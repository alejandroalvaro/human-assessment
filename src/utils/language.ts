export type Language = 'pt' | 'es';

export function getLanguage(password: string): Language {
  return password === 'kari' ? 'pt' : 'es';
}
