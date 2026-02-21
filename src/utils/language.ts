export type Language = 'pt' | 'es';

export function getDefaultLanguage(password: string): Language {
  if (password === 'kari') return 'pt';
  if (password === 'mami' || password === 'vana') return 'es';
  // For other users (e.g. alejandro): detect from browser
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : '';
  return browserLang.startsWith('es') ? 'es' : 'pt';
}
