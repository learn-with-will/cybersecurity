# Cybersecurity — Authoring Contract

This is the contract every lesson and quiz in this course follows. It exists so the course stays
**beginner-friendly, defensive in framing, and factually anchored to primary sources**. If a claim
cannot be traced to a source below, qualify it or leave it out.

---

## Voice and audience

- **Audience:** a motivated newcomer with basic computer literacy and no security background.
- **Tone:** plain, welcoming, second person ("you"). Short sentences. No hype, no fear-mongering.
- **Define every term** the first time it appears, in **bold**, in one clause. Never assume jargon
  ("payload", "vector", "hash", "nonce") is already known.
- **Exactly one Real World Analogy per lesson**, in its own section — an everyday, non-technical
  comparison (locks, mailrooms, ID checks, castles). Don't scatter extra analogies elsewhere.
- **Minimal, runnable, illustrative code.** Prefer the shortest snippet that makes the point. Code is
  for understanding, never a copy-paste attack tool.
- **Build on previous lessons.** Reference earlier concepts by name; assume tiers are read in order.

## Ethics and safety framing (non-negotiable)

This is a **defender's** course. Offensive techniques are taught only to the depth a defender needs
to understand and stop them.

- Frame everything as "how this attack works, so you can prevent/detect it."
- **No operational, step-by-step instructions for attacking systems you don't own.** Show the
  *shape* of an attack (e.g. an example injection string, a phishing email's tells) and then the
  defense — never a working exploit chain against a real target.
- Every mention of a hands-on tool (Nmap, Wireshark, Burp, sqlmap, hashcat, Metasploit) carries the
  standing rule: **only against systems you own or have written authorization to test.** Say so.
- Penetration testing and red-team content emphasizes **scope, authorization, and law** first.
- Do not include real credentials, real target hosts, real personal data, or live malware.

## Sources (cite these; invent nothing)

Cite the primary/official source for every non-obvious claim. Prefer standards bodies and official
docs over blogs.

- **OWASP** — Top 10 (2021 edition), Cheat Sheet Series, Application Security Verification Standard
  (ASVS), Web Security Testing Guide (WSTG): <https://owasp.org/>
- **NIST** — Cybersecurity Framework (CSF) 2.0 <https://www.nist.gov/cyberframework>; SP 800-63
  Digital Identity Guidelines; SP 800-61 Computer Security Incident Handling; SP 800-53 controls;
  SP 800-207 Zero Trust Architecture; FIPS 197 (AES), FIPS 180-4 / 202 (SHA-2 / SHA-3):
  <https://csrc.nist.gov/>
- **MITRE** — ATT&CK <https://attack.mitre.org/>; CWE <https://cwe.mitre.org/>; CVE
  <https://www.cve.org/>. **FIRST** — CVSS <https://www.first.org/cvss/>.
- **IETF RFCs** — TLS 1.3 (RFC 8446), OAuth 2.0 (RFC 6749) / 2.1 draft, OpenID Connect, JWT
  (RFC 7519), HTTP Semantics (RFC 9110), HSTS (RFC 6797), Internet Security Glossary (RFC 4949):
  <https://www.rfc-editor.org/>
- **CIS** — Critical Security Controls and Benchmarks: <https://www.cisecurity.org/>
- **MDN Web Docs** — web security (same-origin policy, CORS, CSP, cookies):
  <https://developer.mozilla.org/en-US/docs/Web/Security>
- **PortSwigger Web Security Academy** — <https://portswigger.net/web-security> (web-attack labs).
- **CISA** — advisories and guidance: <https://www.cisa.gov/>
- **Ross Anderson, *Security Engineering* (3rd ed.)** — freely online:
  <https://www.cl.cam.ac.uk/~rja14/book.html>

When a fact is version- or date-sensitive (framework editions, "recommended" algorithms, cipher
support), write **"as of writing"** and cite the source. Never invent CVE numbers, CVSS scores,
version numbers, benchmarks, or "fastest/most secure" superlatives.

## High-risk facts checklist (things this topic is easy to get wrong)

Verify each of these against a source before writing it. These are the recurring traps:

1. **Encoding ≠ encryption ≠ hashing.** Encoding (Base64, URL) is reversible and provides **no**
   confidentiality. Encryption is reversible **with a key**. Hashing is **one-way**. Never call
   Base64 "encryption."
2. **Hashing vs. password hashing.** SHA-256 is fine for integrity but **wrong for passwords**. Use a
   slow, salted KDF: **Argon2, scrypt, bcrypt, or PBKDF2** (OWASP Password Storage Cheat Sheet).
   **MD5 and SHA-1 are broken for collision resistance** — never use them for signatures/integrity.
3. **Salt vs. pepper.** A **salt** is unique, per-password, stored alongside the hash (defeats
   rainbow tables). A **pepper** is a secret added to all, stored separately. Salting is mandatory;
   peppering is optional.
4. **Symmetric vs. asymmetric.** Symmetric = one shared key (AES). Asymmetric = a key **pair**;
   encrypt with the **public** key, decrypt with the **private** key; **sign** with the private key,
   **verify** with the public key. Get the direction right.
5. **SSL is dead; say TLS.** SSL 2.0/3.0 are deprecated/insecure. Current is **TLS 1.2 and 1.3**
   (TLS 1.0/1.1 deprecated, RFC 8996). A "TLS certificate" (colloquially "SSL certificate") proves
   **server identity** and enables encryption; it does not by itself authenticate the client.
6. **What HTTPS does and doesn't do.** It gives confidentiality, integrity, and **server**
   authentication in transit. It does **not** make a site "safe," vet its content, or protect data
   at rest.
7. **CIA triad** = **Confidentiality, Integrity, Availability.** Don't confuse with the agency; don't
   drop Availability.
8. **AuthN vs. AuthZ.** **Authentication** = who you are. **Authorization** = what you may do. Broken
   access control (authorization) is OWASP Top 10 A01:2021.
9. **Vulnerability / threat / risk / exploit** are distinct. Vulnerability = weakness; threat =
   potential cause of harm; risk = likelihood × impact; exploit = code/technique that uses a
   vulnerability. **Zero-day** = a vulnerability with no patch available yet, not "a virus."
10. **CVE vs. CVSS vs. CWE.** CVE = an **identifier** for one specific vulnerability. CVSS = a
    **severity score** (0–10). CWE = a **category** of weakness type. Different things.
11. **Encryption is not integrity.** Confidentiality (encryption) and integrity/authenticity (MAC,
    signatures, AEAD) are separate goals; use **authenticated encryption (AEAD, e.g. AES-GCM)** to
    get both, and don't roll your own crypto.
12. **Least privilege / defense in depth / zero trust** are principles, not products. Zero trust =
    "never trust, always verify" (NIST SP 800-207), not "a firewall."
13. **IDS vs. IPS; firewall types.** IDS detects and alerts; IPS can block inline. A stateful
    firewall tracks connections; a WAF filters HTTP. Don't blur them.
14. **MFA factor strength.** SMS OTP is better than nothing but phishable/SIM-swappable; **TOTP**
    apps are stronger; **FIDO2/WebAuthn** hardware is phishing-resistant (NIST SP 800-63B).
15. **Input validation ≠ output encoding.** Injection defenses are context-specific:
    **parameterized queries** for SQL, **output encoding/escaping** for XSS, allow-lists for
    commands. Validation alone does not stop XSS.

## Lesson rules

- **Filename:** `public/content/<level>/<slug>.md`. **Front-matter (YAML):** `id` (`lesson-NN`),
  `slug`, `title` (quoted), `level`, `order` (1–24), `duration` (minutes), `tags` (**exactly 5**),
  `summary` (**one sentence**, quoted).
- **H1 sections, in this exact order:** `Learning Objectives` · `Why It Matters` ·
  `Concept Explanation` (with `###` subsections) · `Key Terminology` · `Options and Trade-offs`
  (a Markdown table) · `Worked Example` · `Real World Analogy` · `Examples` (`## Example 1` basic,
  `## Example 2` real-world, `## Example 3` pitfall) · `Common Mistakes` · `Best Practices` ·
  `Summary` · `Flash Cards` (**6** `Q:` / `A:` pairs) · `Exercises` (`### Easy` / `### Medium` /
  `### Challenging`) · `Further Reading` (links to the sources above).
- **Code fences:** only `bash`, `python`, `javascript`, `sql`, `http`, `json`, or `text`. Nothing
  else. Use `text` for console output, ASCII diagrams, and log lines.
- Keep every claim checkable. When you name a default or a "recommended" choice, cite the source in
  Further Reading and hedge with "as of writing."

## Quiz rules

- **File:** `public/quizzes/lesson-NN.json`. `id` = `quiz-lesson-NN`, `lessonId` = `lesson-NN`,
  `passingScore` = 60.
- **5–6 questions**, collectively covering **all five types**: `single-choice`, `multiple-choice`,
  `fill-blank`, `ordering`, `match-pair`.
- Every question has an `explanation`. **Every answer must be traceable to the lesson body** — do not
  test anything the lesson didn't teach.
- Keep option ids short (`a`,`b`,`c`,`d`); `fill-blank` answers list every accepted spelling
  (compared case-insensitively after trim).
