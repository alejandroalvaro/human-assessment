import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import type { Language } from '../utils/language';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  messages: Message[];
  isLoading: boolean;
  assessmentComplete: boolean;
  error: string | null;
  lang: Language;
  onSendMessage: (text: string) => void;
  onRequestReport: () => void;
}

export function Chat({
  messages,
  isLoading,
  assessmentComplete,
  error,
  lang,
  onSendMessage,
  onRequestReport,
}: Props) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && !assessmentComplete) {
      textareaRef.current?.focus();
    }
  }, [isLoading, assessmentComplete]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading || assessmentComplete) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const t = {
    header: lang === 'pt' ? 'HUMAN 3.0 — Avaliação' : 'HUMAN 3.0 — Evaluación',
    placeholder: lang === 'pt' ? 'Digite sua resposta...' : 'Escribí tu respuesta...',
    send: lang === 'pt' ? 'Enviar' : 'Enviar',
    generateReport: lang === 'pt' ? 'Gerar Relatório HUMAN 3.0' : 'Generar Reporte HUMAN 3.0',
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg">
      {/* Header */}
      <div className="flex-shrink-0 bg-brand-surface border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-quadrant-mind" />
          <span className="w-2 h-2 rounded-full bg-quadrant-body" />
          <span className="w-2 h-2 rounded-full bg-quadrant-spirit" />
          <span className="w-2 h-2 rounded-full bg-quadrant-vocation" />
        </div>
        <h1 className="text-sm font-medium text-brand-text-muted">
          {t.header}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl whitespace-pre-wrap text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-surface-alt text-brand-text'
                  : 'bg-brand-surface text-brand-text-muted border-l-2 border-accent-coral'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-surface border-l-2 border-accent-coral rounded-2xl">
              <TypingIndicator />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 bg-brand-surface border-t border-white/5 p-4">
        {assessmentComplete ? (
          <button
            onClick={onRequestReport}
            className="w-full py-3 bg-accent-coral text-white rounded-lg font-medium hover:bg-accent-coral/90 transition-colors"
          >
            {t.generateReport}
          </button>
        ) : (
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              disabled={isLoading}
              rows={1}
              className="flex-1 px-3 py-2.5 bg-brand-bg border border-white/10 rounded-lg text-brand-text placeholder-brand-text-faint focus:outline-none focus:border-white/20 resize-none disabled:opacity-50 text-base"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-accent-coral text-white rounded-lg font-medium hover:bg-accent-coral/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {t.send}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
