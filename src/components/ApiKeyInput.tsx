import { useState } from 'react';

interface Props {
  onSubmit: (password: string) => void;
}

export function ApiKeyInput({ onSubmit }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) {
      setError('Digite a senha de acesso');
      return;
    }
    onSubmit(trimmed);
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
            Avaliacao de Desenvolvimento Multidimensional
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
              Senha de acesso
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Digite sua senha..."
              className="w-full px-3 py-2 bg-brand-bg border border-white/10 rounded-lg text-brand-text placeholder-brand-text-faint focus:outline-none focus:border-white/20"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password.trim()}
            className="w-full py-2 bg-accent-coral text-white rounded-lg font-medium hover:bg-accent-coral/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Comecar Avaliacao
          </button>
        </form>

        <p className="text-brand-text-faint text-xs text-center mt-4">
          Acesso restrito. Solicite sua senha ao administrador.
        </p>
      </div>
    </div>
  );
}
