export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type Phase = 'api-key' | 'interview' | 'generating' | 'report';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  phase: Phase;
  report: string | null;
  error: string | null;
}
