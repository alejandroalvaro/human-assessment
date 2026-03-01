# FOR_ALEJANDRO.md — Human Assessment

> **Company:** 8AI
> **Repo:** human-assessment
> **What this file is:** A human-readable narrative of this project — decisions, context, and session history. For operational instructions, see `CLAUDE.md`.

---

## What Is This Project?

An AI-powered personal development assessment tool. The user enters a password (which also determines language — Portuguese or Spanish), then has a conversation with Claude who asks probing questions based on the HUMAN 3.0 framework (Mind, Body, Spirit, Vocation). After enough questions, Claude generates a detailed written development report that the user can download as PDF.

---

## Architecture in Plain Language

A React single-page app that talks to Claude through a Cloudflare Pages Function proxy. The proxy validates the access password and injects the API key — the user never sees the key. The interview uses claude-3-5-sonnet for cost-efficient back-and-forth, then switches to opus for the final comprehensive report.

---

## Key Decisions

- **Cloudflare Pages over Vercel:** Free tier is generous, functions are simple proxies
- **Password gate over proper auth:** Simple access control for family/friends, no user accounts needed
- **Language from password:** Elegant — each user gets a password that also sets their language

---

## Session Log

> **Format for new entries:** Follow the standard format from the global CLAUDE.md (Section 5).

---

<!-- New session entries are appended below this line -->
