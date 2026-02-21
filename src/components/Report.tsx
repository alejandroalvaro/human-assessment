import { useMemo } from 'react';

interface Props {
  content: string;
  onRestart: () => void;
}

const QUADRANT_STYLES: Record<string, { h2: string; h3dot: string; border: string }> = {
  mind:     { h2: 'text-xl font-bold text-quadrant-mind mt-6 mb-3', h3dot: 'bg-quadrant-mind', border: 'border-l-2 border-quadrant-mind pl-4' },
  body:     { h2: 'text-xl font-bold text-quadrant-body mt-6 mb-3', h3dot: 'bg-quadrant-body', border: 'border-l-2 border-quadrant-body pl-4' },
  spirit:   { h2: 'text-xl font-bold text-quadrant-spirit mt-6 mb-3', h3dot: 'bg-quadrant-spirit', border: 'border-l-2 border-quadrant-spirit pl-4' },
  vocation: { h2: 'text-xl font-bold text-quadrant-vocation mt-6 mb-3', h3dot: 'bg-quadrant-vocation', border: 'border-l-2 border-quadrant-vocation pl-4' },
  default:  { h2: 'text-xl font-bold text-brand-text mt-6 mb-3', h3dot: 'bg-accent-coral', border: '' },
};

function detectQuadrant(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('mente') || lower.includes('mind') || lower.includes('mental')) return 'mind';
  if (lower.includes('corpo') || lower.includes('body') || lower.includes('fisic') || lower.includes('físic')) return 'body';
  if (lower.includes('espírito') || lower.includes('espirito') || lower.includes('spirit') || lower.includes('espiritual')) return 'spirit';
  if (lower.includes('vocação') || lower.includes('vocacao') || lower.includes('vocation') || lower.includes('proposito') || lower.includes('propósito')) return 'vocation';
  return 'default';
}

function parseMarkdown(text: string): string {
  let currentQuadrant = 'default';

  return text
    .split('\n')
    .map((line) => {
      // Horizontal rules
      if (/^---$/.test(line)) {
        return '<hr class="border-white/10 my-6" />';
      }

      // H1
      const h1Match = line.match(/^# (.+)$/);
      if (h1Match) {
        return `<h1 class="text-2xl font-bold text-brand-text mt-8 mb-4">${h1Match[1]}</h1>`;
      }

      // H2 — detect quadrant
      const h2Match = line.match(/^## (.+)$/);
      if (h2Match) {
        currentQuadrant = detectQuadrant(h2Match[1]);
        const style = QUADRANT_STYLES[currentQuadrant] || QUADRANT_STYLES.default;
        const borderWrap = style.border ? ` ${style.border}` : '';
        return `<h2 class="${style.h2}${borderWrap}">${h2Match[1]}</h2>`;
      }

      // H3 — use current quadrant color dot
      const h3Match = line.match(/^### (.+)$/);
      if (h3Match) {
        const style = QUADRANT_STYLES[currentQuadrant] || QUADRANT_STYLES.default;
        return `<h3 class="text-lg font-semibold text-brand-text mt-5 mb-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full ${style.h3dot} inline-block shrink-0"></span>${h3Match[1]}</h3>`;
      }

      // Bold
      let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-brand-text font-semibold">$1</strong>');
      // Italic
      processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');

      // Bullet points
      const bulletMatch = processed.match(/^- (.+)$/);
      if (bulletMatch) {
        return `<li class="ml-4 text-brand-text-muted mb-1">${bulletMatch[1]}</li>`;
      }

      // Empty lines
      if (processed.trim() === '') return '';

      // Paragraphs
      if (!/^<[huplo]|^<hr|^<li|^<ul|^<str|^<em/.test(processed)) {
        return `<p class="text-brand-text-muted mb-2">${processed}</p>`;
      }

      return processed;
    })
    .join('\n')
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="list-disc pl-4 my-2">$1</ul>');
}

export function Report({ content, onRestart }: Props) {
  const html = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-brand-surface/95 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-quadrant-mind" />
            <span className="w-2 h-2 rounded-full bg-quadrant-body" />
            <span className="w-2 h-2 rounded-full bg-quadrant-spirit" />
            <span className="w-2 h-2 rounded-full bg-quadrant-vocation" />
          </div>
          <span className="text-sm font-medium text-brand-text-muted">HUMAN 3.0 — Relatorio</span>
        </div>
        <button
          onClick={onRestart}
          className="px-4 py-1.5 bg-brand-surface-alt text-brand-text-muted rounded-lg hover:bg-brand-surface-alt/80 transition-colors text-sm"
        >
          Nova Avaliacao
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
