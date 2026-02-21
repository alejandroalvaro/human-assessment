import { useState, useMemo } from 'react';

interface Props {
  onSubmit: (password: string) => void;
}

function detectLandingLang(): 'pt' | 'es' {
  const lang = navigator.language || '';
  return lang.startsWith('es') ? 'es' : 'pt';
}

export function ApiKeyInput({ onSubmit }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const landingLang = useMemo(detectLandingLang, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) {
      setError(landingLang === 'pt' ? 'Digite a senha de acesso' : 'Ingresá tu contraseña');
      return;
    }
    onSubmit(trimmed);
  };

  const t = landingLang === 'pt'
    ? {
        subtitle: 'Avaliação de Desenvolvimento Multidimensional',
        label: 'Senha de acesso',
        placeholder: 'Digite sua senha...',
        button: 'Começar Avaliação',
        footer: 'Acesso restrito. Solicite sua senha ao administrador.',
      }
    : {
        subtitle: 'Evaluación de Desarrollo Multidimensional',
        label: 'Contraseña de acceso',
        placeholder: 'Ingresá tu contraseña...',
        button: 'Comenzar Evaluación',
        footer: 'Acceso restringido. Solicitá tu contraseña al administrador.',
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Quadrant dots */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-quadrant-mind" />
            <span className="w-2.5 h-2.5 rounded-full bg-quadrant-body" />
            <span className="w-2.5 h-2.5 rounded-full bg-quadrant-spirit" />
            <span className="w-2.5 h-2.5 rounded-full bg-quadrant-vocation" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text mb-2">HUMAN 3.0</h1>
          <p className="text-brand-text-muted text-sm">
            {t.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-brand-surface rounded-xl p-6 border border-white/5"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-brand-text-muted mb-1"
            >
              {t.label}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder={t.placeholder}
              className="w-full px-3 py-2.5 bg-brand-bg border border-white/10 rounded-lg text-brand-text placeholder-brand-text-faint focus:outline-none focus:border-white/20"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password.trim()}
            className="w-full py-2.5 bg-accent-coral text-white rounded-lg font-medium hover:bg-accent-coral/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t.button}
          </button>
        </form>

        <p className="text-brand-text-faint text-xs text-center mt-4">
          {t.footer}
        </p>
      </div>
    </div>
  );
}
