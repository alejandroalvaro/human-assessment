import { useState, useCallback } from 'react';
import type { Message, Phase } from '../types';
import type { Language } from '../utils/language';
import { getDefaultLanguage } from '../utils/language';
import { sendInterviewMessage, generateReport } from '../services/anthropic';

const COMPLETE_MARKER = '[ASSESSMENT_COMPLETE]';

export function useChat(password: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>('interview');
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const [lang, setLang] = useState<Language>(() => getDefaultLanguage(password));

  const sendMessage = useCallback(
    async (text: string) => {
      if (isLoading || !text.trim()) return;

      const userMessage: Message = { role: 'user', content: text.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendInterviewMessage(password, lang, updatedMessages);

        let displayContent = response;
        let isComplete = false;

        if (response.includes(COMPLETE_MARKER)) {
          displayContent = response.replace(COMPLETE_MARKER, '').trimEnd();
          isComplete = true;
        }

        const assistantMessage: Message = {
          role: 'assistant',
          content: displayContent,
        };

        setMessages([...updatedMessages, assistantMessage]);

        if (isComplete) {
          setAssessmentComplete(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [password, lang, messages, isLoading]
  );

  const startInterview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const kickoff: Message = {
      role: 'user',
      content: lang === 'pt'
        ? 'Ola, quero fazer minha avaliacao HUMAN 3.0.'
        : 'Hola, quiero hacer mi evaluacion HUMAN 3.0.',
    };

    try {
      const response = await sendInterviewMessage(password, lang, [kickoff]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages([kickoff, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setIsLoading(false);
    }
  }, [password, lang]);

  const requestReport = useCallback(async () => {
    setPhase('generating');
    setError(null);

    try {
      const reportText = await generateReport(password, lang, messages);
      setReport(reportText);
      setPhase('report');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      setPhase('interview');
    }
  }, [password, lang, messages]);

  return {
    messages,
    isLoading,
    phase,
    report,
    error,
    assessmentComplete,
    sendMessage,
    startInterview,
    requestReport,
    lang,
    setLang,
  };
}
