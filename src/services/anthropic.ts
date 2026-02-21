import type { Message } from '../types';
import { INTERVIEW_SYSTEM_PROMPT, ANALYSIS_SYSTEM_PROMPT } from '../config/prompts';

const API_URL = import.meta.env.DEV
  ? '/api/v1/messages'
  : 'https://api.anthropic.com/v1/messages';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  error?: { type: string; message: string };
}

async function callAnthropic(
  apiKey: string,
  model: string,
  system: string,
  messages: AnthropicMessage[],
  maxTokens: number
): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `API error (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch {
      // use default error message
    }
    throw new Error(errorMessage);
  }

  const data: AnthropicResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const textContent = data.content.find((c) => c.type === 'text');
  if (!textContent) {
    throw new Error('No text content in response');
  }

  return textContent.text;
}

export async function sendInterviewMessage(
  apiKey: string,
  messages: Message[]
): Promise<string> {
  return callAnthropic(
    apiKey,
    'claude-sonnet-4-20250514',
    INTERVIEW_SYSTEM_PROMPT,
    messages.map((m) => ({ role: m.role, content: m.content })),
    1024
  );
}

export async function generateReport(
  apiKey: string,
  messages: Message[]
): Promise<string> {
  const transcript = messages
    .map((m) => {
      const label = m.role === 'assistant' ? 'Avaliador' : 'Usuario';
      return `${label}: ${m.content}`;
    })
    .join('\n\n');

  return callAnthropic(
    apiKey,
    'claude-opus-4-6',
    ANALYSIS_SYSTEM_PROMPT,
    [
      {
        role: 'user',
        content: `Here is the complete interview transcript to analyze:\n\n---\n\n${transcript}\n\n---\n\nPlease generate the complete HUMAN 3.0 Development Assessment Report based on this interview.`,
      },
    ],
    16000
  );
}
