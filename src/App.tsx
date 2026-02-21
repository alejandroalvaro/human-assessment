import { useState, useEffect } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { Chat } from './components/Chat';
import { Report } from './components/Report';
import { useChat } from './hooks/useChat';

function InterviewScreen({ password }: { password: string }) {
  const {
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
  } = useChat(password);

  useEffect(() => {
    startInterview();
  }, [startInterview]);

  if (phase === 'report' && report) {
    return (
      <Report
        content={report}
        lang={lang}
        onRestart={() => window.location.reload()}
      />
    );
  }

  if (phase === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="text-center">
          {/* Spinning quadrant dots */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 animate-spin [animation-duration:3s]">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-quadrant-mind" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-quadrant-body" />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-quadrant-spirit" />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-quadrant-vocation" />
              <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-accent-coral animate-pulse" />
            </div>
          </div>
          <p className="text-brand-text-muted text-sm">
            {lang === 'pt'
              ? 'Gerando seu relatorio HUMAN 3.0...'
              : 'Generando tu reporte HUMAN 3.0...'}
          </p>
          <p className="text-brand-text-faint text-xs mt-2">
            {lang === 'pt'
              ? 'Isso pode levar alguns minutos (analise profunda com Opus)'
              : 'Esto puede tardar algunos minutos (analisis profundo con Opus)'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Chat
      messages={messages}
      isLoading={isLoading}
      assessmentComplete={assessmentComplete}
      error={error}
      lang={lang}
      onSendMessage={sendMessage}
      onRequestReport={requestReport}
    />
  );
}

function App() {
  const [password, setPassword] = useState<string | null>(null);

  if (!password) {
    return <ApiKeyInput onSubmit={setPassword} />;
  }

  return <InterviewScreen password={password} />;
}

export default App;
