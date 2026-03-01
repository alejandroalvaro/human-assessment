# CLAUDE.md — Human Assessment

> **Company:** 8AI
> **Domain:** human.8ai.com.br
> **Port:** 8304
> **Status:** Active — deployed on Cloudflare Pages

---

## What This Is

AI-powered personal development assessment based on the HUMAN 3.0 framework. Users answer questions posed by Claude, then receive a detailed written development report. Password-gated access, bilingual (PT-BR / ES-AR).

---

## Architecture

### Stack

- **Frontend:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- **Backend:** Cloudflare Pages Functions (proxies to Anthropic API)
- **AI:** Claude claude-3-5-sonnet (interview), Claude opus (report generation)
- **Auth:** Password-gated (ACCESS_PASSWORDS env var)

### Project Structure

```
human-assessment/
├── CLAUDE.md
├── FOR_ALEJANDRO.md
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Chat.tsx          # Interview chat interface
│   │   ├── Report.tsx        # Assessment report display
│   │   ├── ApiKeyInput.tsx   # Password gate
│   │   └── TypingIndicator.tsx
│   ├── hooks/
│   │   └── useChat.ts        # Interview/report state machine
│   ├── config/
│   │   └── prompts.ts        # HUMAN 3.0 system prompts (PT + ES)
│   ├── services/
│   │   └── anthropic.ts      # Anthropic API calls
│   └── utils/
│       └── language.ts       # Language detection from password
├── functions/
│   └── api/
│       └── messages.ts       # Cloudflare Pages Function (API proxy)
└── .dev.vars                 # Local: ANTHROPIC_API_KEY
```

---

## Quick Start

```bash
npm install
npm run dev      # Vite dev server (proxies /api/messages to Anthropic)
npm run build    # tsc + vite build
npm run lint     # ESLint
```

### Required Environment Variables

| Variable | Description | Where |
|----------|-------------|-------|
| `ANTHROPIC_API_KEY` | Claude API key | `.dev.vars` (local), Cloudflare Pages secret (prod) |
| `ACCESS_PASSWORDS` | Comma-separated access passwords | Cloudflare Pages secret |

---

## Code Conventions

- TypeScript strict mode
- Tailwind CSS for styling
- System prompts live in `src/config/prompts.ts` — very large, contain full HUMAN 3.0 framework
- Language auto-detected from which password the user enters

---

## Gotchas

- The prompts.ts file is very large — contains full interview and analysis prompts in both languages
- Vite dev proxy handles `/api/messages` locally; in production, Cloudflare Pages Functions handle it
- PDF export uses html2pdf.js — may have rendering differences across browsers

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Password gate | Done | Language detected from password |
| Interview chat | Done | Claude claude-3-5-sonnet |
| Report generation | Done | Claude opus |
| PDF export | Done | html2pdf.js |
| PT-BR support | Done | |
| ES-AR support | Done | |
| Cloudflare deployment | Done | |
| Mobile optimization | Done | Increased font sizes |

---

## Roadmap

- [ ] Additional languages
- [ ] Report sharing/link generation
- [ ] Assessment history per user
