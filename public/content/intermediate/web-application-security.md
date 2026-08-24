---
id: lesson-09
slug: web-application-security
title: "Web Application Security"
level: intermediate
order: 9
duration: 20
tags:
  - web-security
  - owasp-top-10
  - http
  - same-origin
  - trust-boundaries
summary: "Why web applications are the biggest attack surface and how to reason about them — the stateless HTTP request/response model, the browser's same-origin boundary, the never-trust-client-input rule, and a tour of the OWASP Top 10 that frames the specific web attacks in the lessons that follow."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the **HTTP request/response** model and its statelessness.
- Read the security-relevant parts of **HTTP messages** (methods, status, headers).
- State the **same-origin** boundary and the **never trust client input** rule.
- List the **OWASP Top 10 (2021)** risk categories.
- Identify **trust boundaries** in a web app.

# Why It Matters

Web applications are exposed to the entire internet, run untrusted users' input, and handle valuable
data — which makes them the most attacked kind of software. Almost every organization runs web apps,
and most serious breaches touch one. This lesson is the framework for the next several: it explains
how the web works at the security level and introduces the **OWASP Top 10**, the industry's consensus
list of the most critical web risks, so the deep-dive lessons (injection, XSS/CSRF, TLS, sessions)
each have a home.

# Concept Explanation

### The HTTP request/response model

The web runs on **HTTP**: a client (browser) sends a **request**, a server returns a **response**.

```http
GET /account HTTP/1.1
Host: example.com
Cookie: session=abc123
User-Agent: Mozilla/5.0

HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=abc123; HttpOnly; Secure

<html> ... </html>
```

Key parts with security weight:

- **Method** — `GET` (read), `POST` (submit), `PUT`/`PATCH` (update), `DELETE` (remove). GETs
  shouldn't change state.
- **Status code** — `200` OK, `301/302` redirect, `401` unauthenticated, `403` forbidden, `404` not
  found, `500` server error.
- **Headers** — metadata like `Cookie`, `Authorization`, `Content-Type`, and **security headers**
  (below).
- **Body** — the payload (form data, JSON, HTML).

### HTTP is stateless

HTTP has **no memory** between requests — each one stands alone. To recognize a logged-in user across
requests, apps use **sessions and cookies or tokens** (Lesson 13). This statelessness is why the
server must **re-authorize every request** (complete mediation, Lesson 7) rather than assuming a prior
check still holds.

### The browser boundary: same-origin

Browsers enforce the **same-origin policy (SOP)**: script from one **origin** (scheme + host + port,
e.g. `https://example.com`) generally cannot read data from a **different** origin. This wall is what
stops a malicious site from silently reading your bank session in another tab. Many web attacks and
defenses (CORS, CSRF, XSS) revolve around this boundary — you'll meet it closely in Lesson 11.

### The golden rule: never trust client input

Everything from the browser — form fields, URL parameters, headers, cookies, JSON — is **attacker-
controllable**. Client-side checks (JavaScript validation, disabled buttons) are for **usability**,
not security, because an attacker bypasses the browser entirely (using tools like `curl` or a proxy).
**All security decisions must be enforced on the server**, and all input must be treated as hostile
until validated and safely handled. Most of the Top 10 is some form of trusting input that shouldn't
be trusted.

### Security response headers

Servers can instruct browsers to enable protections via **response headers** (details in later
lessons):

```text
 Content-Security-Policy       restrict where scripts/resources load from (anti-XSS)
 Strict-Transport-Security     force HTTPS (HSTS)
 X-Content-Type-Options        nosniff — don't guess content types
 X-Frame-Options / frame-anc.  prevent clickjacking (framing)
 Set-Cookie: HttpOnly; Secure; SameSite   protect session cookies
```

### The OWASP Top 10 (2021)

**OWASP** (Open Worldwide Application Security Project) publishes the **Top 10**, a consensus ranking of
the most critical web-app risk categories (2021 edition, as of writing):

```text
 A01  Broken Access Control            (Lesson 7)
 A02  Cryptographic Failures           (Lessons 5, 12)
 A03  Injection (incl. XSS)            (Lessons 10, 11)
 A04  Insecure Design                  (threat modeling, Lesson 17)
 A05  Security Misconfiguration        (Lesson 15)
 A06  Vulnerable & Outdated Components (Lesson 18)
 A07  Identification & Auth Failures   (Lessons 6, 13)
 A08  Software & Data Integrity Fail.  (Lesson 22)
 A09  Security Logging & Monitoring    (Lesson 16)
 A10  Server-Side Request Forgery      (SSRF)
```

The Top 10 is a **awareness and prioritization** tool, not a complete checklist — but it's an
excellent map of where web apps most often go wrong, and this course covers every category.

# Key Terminology

- **HTTP method / status code** — the request's action / the response's outcome.
- **Header** — request/response metadata (cookies, auth, content type, security directives).
- **Stateless** — HTTP keeps no memory between requests; sessions add continuity.
- **Origin** — scheme + host + port; the unit of the **same-origin policy**.
- **Same-origin policy** — browsers block cross-origin script access to another origin's data.
- **Trust boundary** — where data crosses from untrusted (client) to trusted (server) and must be
  validated.
- **OWASP Top 10** — the consensus list of top web-app risk categories.
- **Security headers** — response headers that turn on browser protections (CSP, HSTS, etc.).

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Input validation location | Client-side | Server-side | Server-side for security (client can be bypassed); client-side only for UX. |
| Trusting request data | Trust cookies/headers | Treat all as hostile | Treat all client data as untrusted and validate server-side. |
| State handling | Trust prior checks | Re-check each request | Re-authorize every request — HTTP is stateless. |
| Security headers | Omit for simplicity | Set a strong baseline | Set them (CSP, HSTS, cookie flags); they're cheap defense in depth. |

# Worked Example

Where are the **trust boundaries** in a simple app, and what must be checked at each?

```text
Browser (UNTRUSTED)  --HTTP-->  Web server (TRUSTED)  -->  Database

At the server boundary, for EVERY request:
  1. Authenticate the user (Lesson 6).
  2. Authorize the specific action/object (Lesson 7) — never trust the client's claim.
  3. Validate & sanitize all input (type, length, format).
  4. Use safe APIs for downstream calls (parameterized queries, Lesson 10).
  5. Encode output back to the browser (anti-XSS, Lesson 11).
Everything the browser sends — including "hidden" fields and cookies — can be forged.
```

Naming the boundary makes the rule obvious: the server can trust nothing that crossed it from the
client, and must re-check identity, permission, and input on every request.

# Real World Analogy

A web server is like a **bank teller serving customers through a window**. Anyone can walk up and slide
a note through (send a request), and the note can say anything — including a forged account number. The
teller can't trust the note's claims; they must **verify identity, check the account is really the
customer's, and confirm the request is well-formed** before acting. "The customer filled in the form
nicely" (client-side validation) means nothing if a con artist can slide in their own form.

# Examples

## Example 1 — Basic: GET should not change state

A link `GET /transfer?to=123&amount=100` performs a money transfer. Because browsers, prefetchers, and
crawlers freely follow GETs, this action can be triggered accidentally or maliciously (a preview of
CSRF, Lesson 11). State-changing actions should use `POST`/`PUT`/`DELETE` with proper checks.

**Why this matters:** matching methods to their intent avoids a whole class of accidental and forged
actions.

## Example 2 — Real-world: bypassing client-side validation

A signup form checks "age ≥ 18" in JavaScript. An attacker sends the request directly with `curl`,
skipping the browser and the check, and registers as age 5. Because the server never re-validated, bad
data (or worse) gets in.

**Why this works (for the attacker):** client-side validation is advisory; only server-side checks are
enforced.

## Example 3 — Pitfall: trusting a hidden field

A checkout page stores the price in a hidden form field. A user edits it in the browser dev tools from
`100.00` to `1.00` and submits. The server trusts the submitted price and charges $1.

**Why this bites:** "hidden" fields are fully client-controlled; prices and permissions must be
determined server-side, never taken from the request.

# Common Mistakes

- **Relying on client-side validation** or hidden fields for security.
- **Assuming a prior check still holds** because HTTP feels like a session — re-check every request.
- **Using GET for state-changing actions.**
- **Skipping security headers** (CSP, HSTS, cookie flags).
- **Treating the OWASP Top 10 as complete** rather than as a prioritized starting map.

# Best Practices

- **Validate and authorize on the server, every request**; treat all client input as hostile.
- Use the **right HTTP methods** and return correct status codes.
- Set a **strong security-header baseline** (CSP, HSTS, `nosniff`, framing protection, cookie flags).
- **Map your app to the OWASP Top 10** to find and prioritize weaknesses.
- **Serve everything over HTTPS** (Lesson 12) — plaintext HTTP exposes sessions and data.

# Summary

- The web is **stateless HTTP requests and responses**; continuity comes from sessions/tokens, and
  the server must **re-authorize every request**.
- The **same-origin policy** is the browser's core boundary that many web attacks target.
- **Never trust client input**: enforce all security on the server; client-side checks are UX only.
- The **OWASP Top 10 (2021)** maps the most critical web risks — Broken Access Control, Cryptographic
  Failures, Injection, and the rest — and frames the deep dives ahead.

# Flash Cards

Q: What does it mean that HTTP is stateless, and how do apps work around it?
A: Each HTTP request stands alone with no memory of previous ones; apps use sessions/cookies or tokens to recognize a user across requests, and must re-authorize each request.

Q: What is an "origin" and what does the same-origin policy do?
A: An origin is the combination of scheme, host, and port; the same-origin policy stops script from one origin from reading another origin's data in the browser.

Q: Why must security validation happen on the server, not the client?
A: The client (browser) can be bypassed entirely with tools like curl or a proxy, so client-side checks are only for usability; only server-side checks are enforceable.

Q: Name any four categories from the OWASP Top 10 (2021).
A: For example: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, and A10 Server-Side Request Forgery (others include Insecure Design and Security Misconfiguration).

Q: Why shouldn't a GET request change server state?
A: GETs are freely followed by browsers, prefetchers, and crawlers, so state-changing GETs can be triggered accidentally or forged; changes should use POST/PUT/DELETE with proper checks.

Q: What is a trust boundary in a web application?
A: The point where data crosses from an untrusted source (the client) into the trusted server; there, identity, authorization, and input must all be verified.

# Exercises

### Easy
Open your browser's developer tools on any site and look at the Network tab. Pick one request and
identify its method, status code, and two headers.

### Medium
For a login form you know, list what the server must validate and authorize when the form is submitted,
assuming an attacker could send any values they like (not just what the form allows).

### Challenging
Take three OWASP Top 10 (2021) categories and, for each, describe one concrete way a web app could fail
and one server-side control that addresses it. Cite the OWASP page for one of them.

# Further Reading

- OWASP — *Top 10 (2021)*: <https://owasp.org/www-project-top-ten/>
- MDN — *Web security*: <https://developer.mozilla.org/en-US/docs/Web/Security>
- MDN — *Same-origin policy*: <https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy>
- OWASP — *Web Security Testing Guide*: <https://owasp.org/www-project-web-security-testing-guide/>
