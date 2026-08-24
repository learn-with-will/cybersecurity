---
id: lesson-11
slug: xss-and-csrf
title: "Cross-Site Scripting and CSRF"
level: intermediate
order: 11
duration: 21
tags:
  - xss
  - csrf
  - output-encoding
  - csp
  - same-origin
summary: "Two classic browser attacks and their defenses — cross-site scripting (stored, reflected, DOM-based) stopped by context-aware output encoding and a Content Security Policy, and cross-site request forgery stopped by anti-CSRF tokens and SameSite cookies — both rooted in how browsers handle content and cookies."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **cross-site scripting (XSS)** and its three types.
- Defend against XSS with **output encoding** and a **Content Security Policy**.
- Explain **cross-site request forgery (CSRF)** and why browsers enable it.
- Defend against CSRF with **tokens** and **SameSite cookies**.
- Connect both to the **same-origin policy**.

# Why It Matters

XSS and CSRF are among the most common web vulnerabilities, and both abuse the trust between a user's
browser and a site. **XSS** (a form of injection, OWASP A03) lets an attacker run script in your users'
browsers — stealing sessions or acting as them. **CSRF** rides a logged-in user's browser to perform
actions they didn't intend. Understanding both — and their clean, standard defenses — protects your
users where they're most exposed: inside their own browser.

# Concept Explanation

### Cross-site scripting (XSS)

**XSS** is injecting attacker-controlled **script** into web pages that other users view. It's
injection (Lesson 10) aimed at the **browser** instead of the database: untrusted data ends up in the
HTML page and is executed as code. With script running in the victim's session, an attacker can steal
cookies/tokens, log keystrokes, or perform actions as the user. Three types:

- **Stored (persistent) XSS** — the malicious script is saved on the server (e.g. in a comment) and
  served to everyone who views it. The most dangerous.
- **Reflected XSS** — the script comes from the request (e.g. a URL parameter) and is reflected
  straight back into the page; delivered via a crafted link.
- **DOM-based XSS** — the flaw is in client-side JavaScript that writes untrusted data into the page
  (e.g. `element.innerHTML = location.hash`) without safe handling.

```javascript
// VULNERABLE sink: untrusted input written as HTML runs any script it contains.
document.getElementById("out").innerHTML = userInput;   // <img src=x onerror=...> executes

// SAFER: treat input as text, not HTML — the browser won't execute it.
document.getElementById("out").textContent = userInput;
```

**Defenses (layered):**

- **Context-aware output encoding/escaping** — the primary fix. Encode data for the exact place it
  goes (HTML body, attribute, URL, JavaScript). Modern frameworks (React, Angular) auto-escape by
  default — don't defeat them with raw-HTML sinks (`dangerouslySetInnerHTML`, `innerHTML`).
- **Content Security Policy (CSP)** — a response header that restricts where scripts may load from and
  can block inline script, limiting XSS even if a bug slips through.
- **`HttpOnly` cookies** — keep session cookies out of JavaScript's reach, so XSS can't read them
  (Lesson 13).
- **Input validation** — allow-list where possible; secondary to encoding.
- **Avoid dangerous sinks** — `innerHTML`, `eval`, `document.write` with untrusted data.

### Cross-site request forgery (CSRF)

**CSRF** tricks a **logged-in** user's browser into sending a **state-changing request** the user
didn't intend. The root cause: browsers **automatically attach cookies** (including session cookies) to
requests to a site — even when the request originates from a *different* site. So a malicious page can
cause the victim's browser to make an authenticated request:

```http
<!-- On evil.com, this auto-submits to the victim's bank using their cookies. -->
<form action="https://bank.example/transfer" method="POST">
  <input name="to" value="attacker"><input name="amount" value="1000">
</form>
<script>document.forms[0].submit()</script>
```

The bank sees a valid, cookie-authenticated `POST` and — without a defense — performs the transfer.

**Defenses:**

- **Anti-CSRF tokens** — the server embeds a random, per-session (or per-request) token in its forms;
  a forged cross-site request can't know the token, so it's rejected. The standard fix.
- **`SameSite` cookies** — setting `SameSite=Lax` or `Strict` on the session cookie tells the browser
  not to send it on cross-site requests, blocking most CSRF at the cookie level.
- **Check `Origin`/`Referer`** headers for state-changing requests.
- **Require re-authentication or confirmation** for the most sensitive actions.

### The same-origin policy connects them

Both attacks live around the **same-origin policy** (Lesson 9). SOP stops evil.com's script from
*reading* your bank tab — but it does **not** stop evil.com from *sending* a request that the browser
authenticates with your cookies (CSRF), and it doesn't help if the malicious script is running **inside**
the bank's own origin (XSS). That's why XSS is so severe: it executes *within* the trusted origin,
bypassing SOP entirely.

# Key Terminology

- **XSS** — injecting script that runs in other users' browsers (stored, reflected, DOM-based).
- **Output encoding/escaping** — converting data so it's shown as text, not executed; primary XSS fix.
- **CSP (Content Security Policy)** — header restricting script/resource sources; anti-XSS layer.
- **Sink** — a place where data becomes executable (`innerHTML`, `eval`).
- **CSRF** — forcing a logged-in user's browser to make an unintended state-changing request.
- **Anti-CSRF token** — an unguessable per-session value required on state-changing requests.
- **SameSite cookie** — a cookie attribute limiting cross-site sending.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| XSS defense | Input filtering | Output encoding + CSP | Output encoding is the fix; CSP adds depth; input filtering is secondary. |
| Rendering user HTML | Allow raw HTML | Escape / sanitize | Escape by default; if HTML is required, use a vetted sanitizer allow-list. |
| Session cookie | Readable by JS | `HttpOnly` + `SameSite` + `Secure` | Set all three flags — keeps cookies from XSS and blocks most CSRF. |
| CSRF defense | Referer check only | Token + SameSite | Use tokens and SameSite together; header checks alone are fragile. |

# Worked Example

You maintain a comment feature. Harden it against both attacks:

```text
Against XSS (comments are shown to other users):
  - Store the raw comment; ESCAPE it when rendering into HTML (or rely on the
    framework's auto-escaping; never innerHTML it).
  - Add a Content-Security-Policy header (e.g., no inline script; scripts only
    from 'self') so an escaped-bypass still can't run arbitrary code.
  - Mark the session cookie HttpOnly so a hypothetical XSS can't read it.

Against CSRF (posting a comment is state-changing):
  - Require a per-session anti-CSRF token on the POST.
  - Set the session cookie SameSite=Lax so cross-site POSTs don't carry it.
```

Notice the two defenses are independent and complementary: encoding+CSP stops script from running;
tokens+SameSite stop forged requests from being trusted.

# Real World Analogy

**XSS** is like someone slipping a forged note into a company's internal mail: because it arrives
through the *trusted* internal system, staff act on it as if it were legitimate — the attacker's words
run with your authority. **CSRF** is like a scammer mailing a pre-filled withdrawal slip to your bank
*with your signature already stamped by an automatic machine* (your browser auto-attaching cookies):
the bank sees a validly "signed" request and processes it. The **anti-CSRF token** is a secret code the
bank also requires — one the scammer can't know — so the forged slip is rejected.

# Examples

## Example 1 — Basic: reflected XSS via a URL

A search page echoes `You searched for: <the query>` straight into the HTML. A crafted link puts a
script in the query, so anyone who clicks it runs the attacker's script in their own session. Escaping
the query on output turns the script into harmless visible text.

**Why this works (for the attacker):** untrusted data reached the HTML unescaped; encoding on output
neutralizes it.

## Example 2 — Real-world: SameSite blunts CSRF

A site sets `Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax`. When a malicious page tries to
auto-submit a POST to the site, the browser **omits** the session cookie because it's a cross-site
request, so the server sees an unauthenticated request and rejects it.

**Why this works:** the browser itself refuses to attach the cookie cross-site, removing the forged
request's authority.

## Example 3 — Pitfall: defeating your framework's escaping

A React developer needs to show formatted text and reaches for `dangerouslySetInnerHTML` with
user-provided HTML "to make it work." That one call bypasses React's automatic escaping and reintroduces
stored XSS for every viewer.

**Why this bites:** frameworks are safe by default; raw-HTML sinks opt out of that safety and must be
paired with a strict sanitizer.

# Common Mistakes

- **Building HTML by concatenating untrusted data** or using `innerHTML`/`eval` with it.
- **Relying only on input filtering** for XSS instead of output encoding + CSP.
- **Forgetting `HttpOnly`/`Secure`/`SameSite`** on session cookies.
- **Assuming the same-origin policy stops CSRF** — it doesn't stop sending cookie-authenticated
  requests.
- **Protecting only some state-changing endpoints** with CSRF tokens.

# Best Practices

- **Encode output for its context** and rely on framework auto-escaping; avoid dangerous sinks.
- Deploy a **Content Security Policy** as a strong second layer against XSS.
- Set session cookies **`HttpOnly; Secure; SameSite`**.
- Protect every **state-changing** request with an **anti-CSRF token** (plus SameSite).
- **Sanitize** with a vetted allow-list library only when you must render user HTML.

# Summary

- **XSS** injects script into pages other users view (**stored, reflected, DOM-based**); the fix is
  **context-aware output encoding**, backed by **CSP**, `HttpOnly` cookies, and safe DOM APIs.
- **CSRF** abuses browsers auto-sending cookies to force unintended state-changing requests; the fix is
  **anti-CSRF tokens** plus **`SameSite`** cookies.
- The **same-origin policy** blocks cross-origin *reads* but not cookie-authenticated *sends* (CSRF),
  and doesn't help against script running *inside* the origin (XSS).
- The two defenses are independent — apply both.

# Flash Cards

Q: What are the three types of cross-site scripting?
A: Stored (script saved on the server and served to viewers), reflected (script from the request echoed back into the page), and DOM-based (client-side JS writes untrusted data into the page).

Q: What is the primary defense against XSS?
A: Context-aware output encoding/escaping so untrusted data is rendered as text, not executed — backed by a Content Security Policy, HttpOnly cookies, and avoiding sinks like innerHTML/eval.

Q: What is the root cause that makes CSRF possible?
A: Browsers automatically attach a site's cookies (including the session cookie) to requests to that site, even when the request originates from a different site.

Q: How do anti-CSRF tokens stop the attack?
A: The server requires an unguessable per-session token on state-changing requests; a forged cross-site request can't include the correct token, so it's rejected.

Q: How does a SameSite cookie help against CSRF?
A: SameSite=Lax or Strict tells the browser not to send the cookie on cross-site requests, so a forged request arrives unauthenticated and is rejected.

Q: Why is stored XSS more severe than the same-origin policy can prevent?
A: The malicious script runs inside the site's own origin as the victim, so the same-origin policy doesn't apply — it can read the page, act as the user, and reach anything the user can.

# Exercises

### Easy
Explain the difference between stored and reflected XSS, and give one example delivery method for each.

### Medium
For a comment form, write the specific defenses you'd apply against XSS and against CSRF, and say which
attack each defense addresses.

### Challenging
On a deliberately vulnerable app **you control**, demonstrate a reflected XSS, then fix it with output
encoding and add a CSP that would block inline script. Separately, explain how `SameSite=Lax` would
change a CSRF attempt against the same app. (Only test systems you own or are authorized to test.)

# Further Reading

- OWASP — *Cross Site Scripting Prevention Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html>
- OWASP — *Cross-Site Request Forgery Prevention Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html>
- MDN — *Content Security Policy (CSP)*: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP>
- PortSwigger Web Security Academy — *XSS* and *CSRF*: <https://portswigger.net/web-security/cross-site-scripting>
