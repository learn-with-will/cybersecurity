---
id: lesson-13
slug: session-management-and-tokens
title: "Session Management and Tokens"
level: intermediate
order: 13
duration: 21
tags:
  - sessions
  - cookies
  - jwt
  - oauth
  - authentication
summary: "How web apps remember a logged-in user across stateless requests — server-side sessions with secure cookies, stateless JWTs and what their signature does and doesn't protect, and how OAuth 2.0 and OpenID Connect delegate access and identity — plus the attacks (hijacking, fixation) each design must resist."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain how **sessions** and **cookies** keep a user logged in.
- Set the security **cookie attributes** and defend against hijacking/fixation.
- Read a **JWT** and explain what its signature protects (and doesn't).
- Distinguish **OAuth 2.0** (authorization) from **OpenID Connect** (authentication).
- Choose sensibly where to **store tokens** given XSS/CSRF trade-offs.

# Why It Matters

Because HTTP is stateless (Lesson 9), every app needs a way to recognize a returning, logged-in user —
and that mechanism, the **session or token**, becomes a prime target: steal it and you *become* the
user, no password needed. Identification and authentication failures are OWASP **A07**. This lesson
turns "how does login persist?" into concrete, secure designs, and clears up the widespread confusion
between OAuth and authentication.

# Concept Explanation

### Sessions and cookies

The classic design: when you log in, the server creates a **session** (server-side record of who you
are) and gives your browser a **session ID** in a **cookie**. The browser sends that cookie on every
later request, and the server looks up the session:

```http
HTTP/1.1 200 OK
Set-Cookie: session=9f8a...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```

The session ID must be **long, random, and unpredictable** (so it can't be guessed). The real identity
lives on the **server**; the cookie is just a claim ticket.

### Securing cookies

Cookie **attributes** are critical security controls:

- **`HttpOnly`** — JavaScript can't read the cookie, so **XSS can't steal** the session ID.
- **`Secure`** — sent only over HTTPS, so it isn't exposed on plaintext connections.
- **`SameSite=Lax`/`Strict`** — not sent on cross-site requests, blocking most **CSRF** (Lesson 11).
- **`Max-Age`/`Expires`** — bound the session's lifetime; keep it short and idle-timeout it.
- **Scope** (`Path`, `Domain`) — restrict where the cookie is sent.

### Session attacks

- **Session hijacking** — an attacker steals a valid session ID (via XSS, sniffing plaintext, or
  malware) and reuses it. Defenses: `HttpOnly`, `Secure`/TLS everywhere, short lifetimes.
- **Session fixation** — the attacker sets a known session ID *before* you log in, then rides your
  authenticated session. Defense: **regenerate the session ID on login** (and on privilege change).
- **Predictable IDs** — weak randomness lets IDs be guessed. Defense: cryptographically random IDs.

### Tokens and JWT

An alternative to server-side sessions is a **token** the client holds and presents (often as
`Authorization: Bearer <token>`). The common format is a **JWT (JSON Web Token)** — three Base64url
parts:

```text
 header.payload.signature
 header    {"alg":"HS256","typ":"JWT"}          # algorithm
 payload   {"sub":"user123","exp":1699999999}   # claims (who, expiry, ...)
 signature HMAC/RSA over header+payload          # integrity + authenticity
```

Crucial facts, often gotten wrong:

- A signed JWT is **integrity-protected, not encrypted.** The payload is only **Base64url-encoded** —
  **anyone can read it.** Never put secrets in a JWT payload.
- The server must **verify the signature** on every request and **check `exp`** (expiry), plus issuer
  and audience. An attacker who can change claims without detection has full control.
- **Algorithm pitfalls:** reject `alg: none`, and pin the expected algorithm to avoid
  **algorithm-confusion** attacks (e.g. tricking a server that expects RS256 into accepting an HS256
  token signed with the public key). Use a vetted library.
- **Revocation is hard:** a stateless JWT stays valid until it expires, so "log out everywhere" needs
  short lifetimes plus a server-side denylist or a rotating **refresh token**.

### OAuth 2.0 and OpenID Connect

Two standards constantly confused:

- **OAuth 2.0** (RFC 6749) is an **authorization-delegation** framework: it lets you grant an app
  limited access to your resources on another service **without sharing your password** (e.g. "let this
  app read my calendar"). It issues **access tokens** with **scopes**. OAuth by itself is about
  *access*, **not** proving *who* you are.
- **OpenID Connect (OIDC)** is a thin **identity layer on top of OAuth 2.0** that adds an **ID token**
  to actually **authenticate** the user ("Sign in with …"). If you need login, you want **OIDC**, not
  raw OAuth.

Using OAuth access tokens as proof of identity is a classic mistake; use OIDC's ID token for
authentication.

### Where to store tokens

- **Cookie (`HttpOnly`)** — safe from XSS reading, but you must add **CSRF** defenses (SameSite,
  tokens).
- **`localStorage`** — reachable by JavaScript, so any **XSS reads the token**; avoid for sensitive
  tokens. There's no perfectly safe spot — reduce XSS (Lesson 11), keep tokens short-lived, and prefer
  `HttpOnly` cookies with SameSite for browser apps.

# Key Terminology

- **Session** — server-side record of a logged-in user, referenced by a session ID.
- **Cookie attributes** — `HttpOnly`, `Secure`, `SameSite`, `Max-Age`, scope.
- **Session hijacking / fixation** — stealing a valid session / forcing a known session ID.
- **JWT** — a Base64url `header.payload.signature` token; signed (integrity), not encrypted.
- **Bearer token** — whoever holds it can use it — protect it like a password.
- **OAuth 2.0** — delegated authorization (access tokens, scopes), not authentication.
- **OpenID Connect** — identity layer over OAuth adding an ID token for authentication.
- **Refresh token** — a longer-lived token used to obtain new short-lived access tokens.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| State model | Server-side sessions | Stateless JWTs | Sessions for easy revocation; JWTs for scale/stateless APIs — accept harder logout. |
| Token storage (browser) | `localStorage` | `HttpOnly` cookie | `HttpOnly` cookie (XSS-safe) + CSRF defenses; avoid localStorage for sensitive tokens. |
| JWT lifetime | Long-lived | Short + refresh token | Short access tokens with rotating refresh tokens limit stolen-token damage. |
| Login mechanism | Raw OAuth token | OpenID Connect | OIDC for authentication; OAuth access tokens are for access, not identity. |

# Worked Example

Design secure login persistence for a web app:

```text
Server-side session approach:
  1. On login, create a session; issue a random session ID in a cookie set
     HttpOnly; Secure; SameSite=Lax; short Max-Age.
  2. REGENERATE the session ID at login (defeats session fixation).
  3. Store identity server-side; the cookie is only a reference.
  4. On logout/inactivity, destroy the server session (real revocation).

If using JWTs for an API instead:
  1. Sign tokens; verify signature + exp + issuer/audience on EVERY request.
  2. Keep access tokens SHORT-lived; use a rotating refresh token for renewal.
  3. Never store secrets in the payload (it's readable).
  4. Maintain a denylist or rotate keys so you can revoke when needed.
```

Both designs protect the same thing — the credential that says "this request is that user" — and both
depend on TLS everywhere so the credential can't be sniffed.

# Real World Analogy

A **session cookie** is a **coat-check ticket**: the coat (your identity) stays behind the counter, and
the small numbered ticket is all you carry. Whoever holds the ticket can claim the coat — so you keep it
safe (`HttpOnly`, `Secure`) and it expires at closing time. A **JWT** is more like a **signed festival
wristband**: it *contains* your details and a tamper-evident seal, so any staffer can check it without
calling the office — but anyone can *read* what's printed on it, and you can't easily cancel a wristband
already handed out (revocation is hard).

# Examples

## Example 1 — Basic: the cookie flags that matter

Setting `Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax` means the session ID can't be read by
JavaScript (XSS-safe), never travels over plain HTTP, and isn't sent on cross-site requests (CSRF-
resistant) — three attacks blunted by three attributes.

**Why this works:** each flag closes a specific theft or misuse path for the session ID.

## Example 2 — Real-world: OAuth is not login

An app "logs users in with OAuth" by treating a Google **access token** as proof of identity. Because
OAuth only proves the app was *granted access*, not *who* the user is, a token minted for a different
app could be replayed. Switching to **OpenID Connect** (validating an **ID token** meant for this app)
fixes the identity check.

**Why this works:** OIDC is designed to authenticate; OAuth access tokens are designed to authorize.

## Example 3 — Pitfall: secrets inside a JWT

A team stores a user's role and a "premium: true" flag in a JWT and also drops an internal note in the
payload, assuming it's hidden. A user Base64url-decodes the token and reads it all. Worse, if the server
forgets to verify the signature, they could flip `premium` to `true`.

**Why this bites:** a JWT payload is readable and only *tamper-evident if verified* — never confidential,
never trusted unsigned.

# Common Mistakes

- **Weak or non-regenerated session IDs** — enabling guessing or fixation.
- **Missing cookie flags** (`HttpOnly`, `Secure`, `SameSite`).
- **Putting secrets in a JWT** or **not verifying its signature/`exp`/`alg`**.
- **Treating OAuth access tokens as authentication** instead of using OIDC.
- **Storing sensitive tokens in `localStorage`**, exposing them to any XSS.

# Best Practices

- Use **long, random session IDs**, **regenerate on login**, and set **`HttpOnly; Secure; SameSite`**.
- Keep sessions/tokens **short-lived** with idle timeouts; support real **logout/revocation**.
- For JWTs: **verify signature, `exp`, issuer, audience**; **pin the algorithm**; store **no secrets**.
- Use **OpenID Connect** for login and **OAuth scopes** for least-privilege delegated access.
- Enforce **TLS everywhere** so credentials can't be sniffed, and minimize **XSS** to protect tokens.

# Summary

- Because HTTP is stateless, apps track login with **sessions (server-side + cookie)** or **tokens
  (client-held, e.g. JWT)**.
- Secure the **session ID cookie** with `HttpOnly`, `Secure`, `SameSite`, short lifetimes, and
  **regenerate it on login** to stop hijacking and fixation.
- A **JWT** is **signed, not encrypted** — readable by anyone, trustworthy only if the **signature,
  `exp`, and `alg`** are verified; put no secrets in it and plan for revocation.
- **OAuth 2.0** delegates **authorization**; **OpenID Connect** adds **authentication** — use OIDC for
  login.

# Flash Cards

Q: How do sessions keep a user logged in across stateless HTTP requests?
A: On login the server stores a session record and gives the browser a random session ID in a cookie; the browser sends it each request and the server looks up the identity — the cookie is just a reference.

Q: What do the HttpOnly, Secure, and SameSite cookie attributes each protect against?
A: HttpOnly stops JavaScript (XSS) from reading the cookie; Secure keeps it off plaintext HTTP; SameSite stops it being sent on cross-site requests (CSRF).

Q: Is a signed JWT encrypted? What must the server always do with it?
A: No — it's only Base64url-encoded and readable by anyone; the server must verify the signature and check exp (and issuer/audience) on every request, and never store secrets in it.

Q: What is session fixation and how do you prevent it?
A: An attacker sets a known session ID before the victim logs in, then reuses the now-authenticated session; prevent it by regenerating the session ID at login.

Q: What is the difference between OAuth 2.0 and OpenID Connect?
A: OAuth 2.0 delegates authorization (granting an app scoped access without your password); OpenID Connect adds an identity layer with an ID token that actually authenticates the user.

Q: Why is storing a sensitive token in localStorage risky?
A: localStorage is readable by JavaScript, so any XSS on the page can steal the token; an HttpOnly cookie (with CSRF defenses) keeps it out of script's reach.

# Exercises

### Easy
Inspect the cookies a site sets (browser dev tools → Application/Storage). Note which have HttpOnly,
Secure, and SameSite set, and what each flag does.

### Medium
Decode a sample JWT (e.g. with a JWT debugger) and read its header and payload. Explain why the payload
being readable means you must never put secrets in it, and what the signature guarantees.

### Challenging
Compare server-side sessions and stateless JWTs for a new app: for each, describe how you'd handle
login, logout/revocation, and a stolen credential. Recommend one for a browser app and justify it with
the XSS/CSRF trade-offs.

# Further Reading

- OWASP — *Session Management Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- IETF RFC 7519 — *JSON Web Token (JWT)*: <https://www.rfc-editor.org/rfc/rfc7519>
- IETF RFC 6749 — *The OAuth 2.0 Authorization Framework*: <https://www.rfc-editor.org/rfc/rfc6749>
- OpenID Connect — *Specifications / FAQ*: <https://openid.net/developers/how-connect-works/>
