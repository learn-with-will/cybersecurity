---
id: lesson-12
slug: tls-and-pki
title: "TLS and Public Key Infrastructure"
level: intermediate
order: 12
duration: 21
tags:
  - tls
  - pki
  - certificates
  - https
  - encryption
summary: "How HTTPS actually protects traffic — what TLS provides, how the TLS 1.3 handshake combines asymmetric and symmetric crypto with forward secrecy, and how certificates and the public-key infrastructure let your browser verify it's really talking to the right server rather than an impostor."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the three guarantees **TLS** provides (and one it doesn't).
- Walk through the **TLS handshake** at a high level.
- Explain **certificates**, **CAs**, and the **chain of trust**.
- Define **forward secrecy** and why it matters.
- Diagnose common TLS problems (expiry, weak protocols, mixed content).

# Why It Matters

Every "https://" and padlock rests on **TLS** and the **public-key infrastructure (PKI)** behind
certificates. This is how the cryptography from Lesson 5 becomes real protection for the networking
from Lesson 4: confidentiality and integrity on a hostile network, plus proof you're talking to the
genuine server and not an impostor in the middle. Misunderstanding TLS leads to real failures — trusting
expired or self-signed certificates, allowing weak protocols, or thinking "HTTPS" means "safe site."

# Concept Explanation

### What TLS provides

**TLS (Transport Layer Security)** wraps a normal connection (like HTTP → HTTPS) to provide:

- **Confidentiality** — traffic is encrypted, so eavesdroppers on the path see only ciphertext.
- **Integrity** — tampering is detected (authenticated encryption).
- **Server authentication** — the client verifies the server's **identity** via its certificate,
  defeating a **man-in-the-middle (MITM)** impostor.

What it does **not** do: it doesn't vet whether the site is honest, protect data **at rest**, or (by
default) authenticate the **client**. HTTPS means "a private, tamper-evident channel to *this domain*,"
not "this site is trustworthy."

Note on names: **"SSL" is the dead predecessor** of TLS. SSL 2.0/3.0 are insecure and removed; even
**TLS 1.0/1.1 are deprecated** (RFC 8996). Use **TLS 1.2 or 1.3** (as of writing). People still say
"SSL certificate," but the protocol is TLS.

### The TLS handshake

Before any data flows, client and server perform a **handshake** that combines the crypto types from
Lesson 5:

```text
 1. ClientHello  -> supported TLS versions, cipher suites, a key-share.
 2. ServerHello  -> chosen cipher, the server's key-share, and its CERTIFICATE.
 3. The client VERIFIES the certificate (right domain? signed by a trusted CA?
    not expired? not revoked?).
 4. Both derive the SAME symmetric session keys via Diffie-Hellman key exchange
    (no key is ever sent on the wire).
 5. Encrypted application data flows using fast symmetric crypto (AES-GCM, etc.).
```

**TLS 1.3** streamlined this to a single round trip and removed old, weak options. The pattern is
exactly "use asymmetric crypto to authenticate and agree a key, then switch to fast symmetric
encryption" from Lesson 5.

### Certificates and the chain of trust

A **certificate** (X.509) binds a **domain name** to a **public key**, vouched for by a **Certificate
Authority (CA)**. Your browser/OS ships with a **trust store** of root CAs it trusts. Certificates form
a **chain**:

```text
 Root CA (in your trust store)
   └─ signs → Intermediate CA
        └─ signs → example.com's certificate (the "leaf")
```

The browser trusts the leaf because it chains up to a root it already trusts. To issue a certificate, a
CA verifies you **control the domain** (Domain Validation). **Let's Encrypt** issues free DV
certificates and automates renewal, which is why HTTPS is now the default across the web.

Certificates **expire** (short lifetimes are safer) and can be **revoked** if a key is compromised —
checked via **OCSP** or **CRLs**. A **self-signed** certificate isn't signed by a trusted CA, so
browsers warn — fine for private testing, not for public sites.

### Forward secrecy

**Forward secrecy** (a.k.a. perfect forward secrecy) means each session uses **ephemeral** keys, so if
the server's long-term private key is stolen **later**, past recorded sessions **still can't be
decrypted**. TLS achieves it with ephemeral Diffie-Hellman (**ECDHE**), standard in TLS 1.3. It's a
major reason "record now, decrypt later" attacks fail against modern TLS.

### HTTPS everywhere and HSTS

Serve **everything** over HTTPS and send **HSTS (HTTP Strict Transport Security)** so browsers refuse to
connect over plain HTTP at all:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Watch for **mixed content** — an HTTPS page loading some resources over HTTP — which reopens the very
holes HTTPS closed.

# Key Terminology

- **TLS** — protocol giving confidentiality, integrity, and server authentication in transit.
- **SSL** — TLS's obsolete, insecure predecessor (the name persists colloquially).
- **Handshake** — the negotiation that authenticates the server and agrees session keys.
- **Certificate (X.509)** — binds a domain to a public key, signed by a CA.
- **Certificate Authority (CA) / trust store** — issuer of certificates / the roots your device trusts.
- **Chain of trust** — leaf → intermediate → trusted root.
- **Forward secrecy** — past sessions stay safe even if the long-term key later leaks.
- **HSTS** — header forcing browsers to use HTTPS only.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Protocol versions | Allow TLS 1.0/1.1 | TLS 1.2/1.3 only | TLS 1.2/1.3 only; older versions are deprecated and weak. |
| Certificate source | Self-signed | Trusted CA (e.g. Let's Encrypt) | Trusted CA for anything public; self-signed only for private/testing. |
| Key exchange | Static RSA | Ephemeral (ECDHE) | Ephemeral for forward secrecy — the modern default in TLS 1.3. |
| HTTP availability | Redirect HTTP→HTTPS | HSTS (HTTPS only) | Add HSTS after verifying HTTPS works everywhere; it blocks downgrade. |

# Worked Example

Inspect a real server's certificate and protocol from the command line:

```bash
# Show the certificate chain and negotiated protocol for a site (read-only).
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
# subject= CN=example.com          <- who it's for
# issuer=  CN=... (a CA)           <- who vouches for it
# notBefore=...  notAfter=...      <- validity window (expiry!)
```

A defender checks: does the **subject** match the domain, is the **issuer** a trusted CA, and is it
within its **validity dates**? A mismatch, an untrusted issuer, or an expired date are exactly the
conditions that trigger browser warnings — and exactly what a MITM can't fake without a CA-signed
certificate for the real domain.

# Real World Analogy

A **certificate** is like a **passport**. It states who you are (the domain) and is stamped by an
authority the border trusts (the **CA**). The border guard (your browser) trusts the passport because
it's issued by a recognized government (**root CA**) whose seal they can verify — not because the
traveler *says* they're trustworthy. An **expired passport** is rejected; a **homemade** one
(self-signed) gets you stopped; and a passport for "example.com" doesn't let you enter as
"yourbank.com" (name mismatch). TLS then sets up a **private, sealed diplomatic pouch** (the encrypted
session) for the conversation.

# Examples

## Example 1 — Basic: why the padlock isn't "safe"

A phishing site gets a free, valid DV certificate for `secure-login-verify.example`, so it shows a
padlock and "https". The certificate correctly proves you're talking to *that domain* privately — but
the domain is the attacker's. HTTPS guarantees the **channel**, not the site's **honesty**.

**Why this matters:** teach users to check the *domain name*, not just the padlock.

## Example 2 — Real-world: forward secrecy defeats "harvest now"

An attacker records a company's encrypted TLS traffic, hoping to decrypt it later. Years on, they
compromise the server's private key — but because the sessions used **ephemeral ECDHE** keys, the
recorded traffic still can't be decrypted.

**Why this works:** forward secrecy unlinks past sessions from the long-term key.

## Example 3 — Pitfall: ignoring a certificate warning

A developer clicks through a browser's certificate warning "to save time." That warning may be a benign
misconfiguration — or an active MITM presenting a fake certificate. Habitually bypassing warnings trains
users to walk straight into interception.

**Why this bites:** the certificate check is the part of TLS that stops impostors; overriding it
discards server authentication.

# Common Mistakes

- **Saying "SSL" and allowing old protocols** — use TLS 1.2/1.3 and disable SSL/TLS 1.0/1.1.
- **Letting certificates expire** — automate issuance/renewal (e.g. ACME/Let's Encrypt).
- **Trusting self-signed certs in production** or clicking through warnings.
- **Mixed content** — loading HTTP resources on an HTTPS page.
- **Believing HTTPS vets the site** — it secures the channel and proves the domain, nothing more.

# Best Practices

- **HTTPS everywhere**, TLS 1.2/1.3 only, strong cipher suites, and **HSTS**.
- Use **CA-issued certificates** with **automated renewal**; monitor expiry.
- Prefer **forward secrecy (ECDHE)** — default in TLS 1.3.
- **Never bypass certificate errors** in production; investigate them.
- Eliminate **mixed content**; consider **certificate pinning** for high-value mobile/API clients.

# Summary

- **TLS** gives **confidentiality, integrity, and server authentication** in transit — but not site
  honesty, data-at-rest protection, or client auth by default.
- The **handshake** authenticates the server via its **certificate** and agrees **symmetric session
  keys** (asymmetric to set up, symmetric to run — Lesson 5).
- **Certificates** chain from a leaf up to a **trusted root CA**; browsers verify domain, issuer,
  validity, and revocation.
- **Forward secrecy** (ECDHE) keeps past sessions safe if the long-term key later leaks; **"SSL" is
  obsolete** — use **TLS 1.2/1.3** with **HSTS**.

# Flash Cards

Q: What three guarantees does TLS provide, and name one it does not.
A: Confidentiality, integrity, and server authentication in transit; it does not vouch for the site's honesty, protect data at rest, or authenticate the client by default.

Q: In the TLS handshake, how are asymmetric and symmetric cryptography each used?
A: Asymmetric crypto authenticates the server (via its certificate) and helps agree a shared key; the session then uses fast symmetric encryption (e.g. AES-GCM) for the actual data.

Q: What is a certificate and what does a Certificate Authority attest?
A: An X.509 certificate binds a domain name to a public key; a trusted CA signs it to attest that the holder controls that domain, forming a chain up to a root in your trust store.

Q: What is forward secrecy and why does it matter?
A: Each session uses ephemeral keys, so if the server's long-term private key is later stolen, previously recorded sessions still can't be decrypted — defeating "record now, decrypt later."

Q: Why doesn't a padlock/HTTPS mean a website is safe or honest?
A: TLS only secures the channel and proves you're talking to that domain; an attacker's site can have a valid certificate too, so users must check the actual domain name.

Q: Which SSL/TLS versions should be used, and what's the status of "SSL"?
A: Use TLS 1.2 or 1.3 (as of writing); SSL 2.0/3.0 and TLS 1.0/1.1 are deprecated and insecure — "SSL" persists only as a colloquial name.

# Exercises

### Easy
Visit any HTTPS site and inspect its certificate in the browser (click the padlock). Note the subject
(domain), the issuer (CA), and the expiry date.

### Medium
Explain, in order, what your browser does to verify a server's certificate during the handshake, and
what happens if the domain doesn't match or the certificate is expired.

### Challenging
Use `openssl s_client` (or an online SSL test) against a site **you're allowed to test** to find its TLS
version and cipher. Explain whether it supports forward secrecy and whether any deprecated protocol is
enabled, citing why each matters.

# Further Reading

- IETF RFC 8446 — *TLS 1.3*: <https://www.rfc-editor.org/rfc/rfc8446>
- IETF RFC 8996 — *Deprecating TLS 1.0 and TLS 1.1*: <https://www.rfc-editor.org/rfc/rfc8996>
- MDN — *Transport Layer Security (TLS)*: <https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security>
- Mozilla — *TLS configuration / SSL Configuration Generator*: <https://ssl-config.mozilla.org/>
