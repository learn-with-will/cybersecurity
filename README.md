# Cybersecurity Learning Portal

A **frontend-only** Cybersecurity course: read Markdown lessons, take quizzes, and track
your progress — all in the browser. No sign-up, no backend.

## What this is

The portal shell is built with React 19, Vite, TypeScript, React Router, Tailwind CSS v4,
`marked`, and PrismJS. It renders a **24-lesson curriculum** that takes you from "what is
cybersecurity?" through the foundations — the CIA triad, the threat landscape, core principles,
networking, cryptography, authentication, and access control — into hands-on defense (web
application security and the OWASP Top 10, injection, XSS/CSRF, TLS and PKI, sessions and tokens,
network defense, endpoint hardening, and detection) and on to production security (threat modeling,
vulnerability management, penetration testing, incident response, cloud and container security,
DevSecOps, and governance/risk/compliance), ending in a capstone that designs a defense-in-depth
security program. Every lesson is written in plain, welcoming English, keeps a defensive framing,
and is verified against primary sources (see **Sources** below).

Progress, bookmarks, and quiz scores live in `localStorage` under `cybersecurity-learning-*` keys,
so nothing leaves your machine.

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## How the content works

The app is **data-driven** — adding a lesson needs no code changes:

1. Write the lesson Markdown in `public/content/<level>/<slug>.md` with YAML front-matter
   (including a `summary`).
2. Add a quiz at `public/quizzes/lesson-NN.json`.
3. Regenerate `public/content/course-manifest.json` from the front-matter (the manifest is
   generated, so it can't drift).

> **Code fences** must declare one of the highlighted languages: `bash` (the primary language —
> recon, OpenSSL, hardening, tooling), `python` (scripting and crypto), `javascript` (web
> security), `sql` (injection), `http` (requests/responses and security headers), `json`
> (configs, JWTs, policy), or `text` (console output, ASCII diagrams, logs); see
> `src/core/prism.ts`.

## Curriculum

**Beginner — vocabulary & foundations:** what is cybersecurity? · the threat landscape · core
security principles · networking fundamentals · cryptography essentials · authentication basics ·
authorization & access control · malware & social engineering.

**Intermediate — hands-on defense:** web application security · injection attacks · XSS & CSRF ·
TLS & PKI · session management & tokens · network defense · endpoint & OS hardening · logging &
detection.

**Advanced — production security & operations:** threat modeling · vulnerability management ·
penetration testing · incident response & forensics · cloud & container security · DevSecOps ·
governance, risk & compliance · capstone security program.

## Accuracy: no hallucination

Every definition, default, and claim is verified against primary sources. The per-lesson authoring
contract lives in `prompts/cybersecurity-authoring-prompt.md`.

**Sources:**

- **OWASP** — <https://owasp.org/> (Top 10, Cheat Sheet Series, ASVS, WSTG) — application security.
- **NIST** — the **Cybersecurity Framework 2.0** (<https://www.nist.gov/cyberframework>), **SP
  800-63** Digital Identity, **SP 800-61** Incident Handling, and the FIPS crypto standards
  (<https://csrc.nist.gov/>).
- **MITRE** — **ATT&CK** (<https://attack.mitre.org/>), **CWE** (<https://cwe.mitre.org/>), and
  **CVE** (<https://www.cve.org/>).
- **IETF RFCs** — TLS 1.3 (RFC 8446), OAuth 2.0 (RFC 6749), JWT (RFC 7519), HTTP Semantics
  (RFC 9110): <https://www.rfc-editor.org/>.
- **CIS** — Controls and Benchmarks (<https://www.cisecurity.org/>) · **MDN Web Docs** web-security
  reference (<https://developer.mozilla.org/en-US/docs/Web/Security>) · **PortSwigger Web Security
  Academy** (<https://portswigger.net/web-security>).

## Deploying

Pushing to the deploy branch triggers `.github/workflows/deploy.yml`, which builds with
`BASE_PATH=/<repo>/` and publishes `dist/` to GitHub Pages.

---

React 19 · Vite · TypeScript · React Router · Tailwind CSS v4 · marked · PrismJS ·
localStorage.
