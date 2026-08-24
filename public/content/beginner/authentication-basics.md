---
id: lesson-06
slug: authentication-basics
title: "Authentication Basics"
level: beginner
order: 6
duration: 19
tags:
  - authentication
  - passwords
  - mfa
  - identity
  - credentials
summary: "How systems prove who you are — the three authentication factors, why long passphrases and a password manager beat complex-but-short passwords, how passwords must be stored (salted, slow KDFs), and why multi-factor authentication — especially phishing-resistant FIDO2 — is the single biggest account-security win."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Distinguish **authentication** from **authorization**.
- Name the three **authentication factors** and give examples.
- Explain what makes a **strong password** (per current NIST guidance).
- Describe how passwords must be **stored** (salt + slow KDF).
- Compare **MFA** methods and identify the **phishing-resistant** ones.

# Why It Matters

Authentication is the front door to almost every system, and weak authentication is behind a huge
share of breaches — stolen, guessed, reused, or phished credentials. Getting this right (a good
password strategy plus multi-factor authentication) is the highest-value, lowest-cost security
improvement most people and organizations can make. This lesson also fixes a foundational confusion —
authentication vs authorization — that the next lesson builds on.

# Concept Explanation

### Authentication vs authorization

Two words that sound alike but mean different things:

- **Authentication (AuthN)** answers **"who are you?"** — proving your identity (logging in).
- **Authorization (AuthZ)** answers **"what are you allowed to do?"** — granting access to specific
  actions or data (Lesson 7).

You authenticate **first** (prove identity), then the system authorizes each action. Confusing them
leads to real bugs: a system might correctly log you in yet fail to check whether you're allowed to
open *this* record.

### The three authentication factors

Authentication relies on one or more **factors** — categories of evidence:

- **Something you know** — a password, PIN, or passphrase.
- **Something you have** — a phone, security key, or smart card.
- **Something you are** — a biometric: fingerprint, face, voice.

(Sometimes *somewhere you are* — location — is added as context.) **Multi-factor authentication
(MFA)** means using factors from **two or more different categories**, so stealing one (your password)
isn't enough. Two passwords are **not** MFA — they're the same factor twice.

### What makes a password strong

Guessing resistance comes mostly from **length and unpredictability (entropy)**, not from swapping
`a→@`. Current **NIST SP 800-63B** guidance (as of writing) says:

- **Length beats complexity.** Allow long passwords/passphrases (at least 8, ideally 12+; support 64+)
  and don't force arbitrary composition rules like "must have a symbol."
- **Don't force periodic rotation.** Change passwords only on evidence of compromise — forced monthly
  changes push people to weak, predictable variants.
- **Screen against known-breached passwords**, and never use a password on more than one site.
- **Use a password manager** to generate and store unique random passwords — this makes "unique
  everywhere" actually practical.

A four-word random passphrase like `correct-harbor-violet-engine` is both strong and memorable.

### How passwords must be stored

Systems must **never store passwords in plaintext** — and not with a plain fast hash either. The rule
(OWASP Password Storage Cheat Sheet) is:

- **Salt** each password with a unique random value so identical passwords hash differently and
  precomputed **rainbow tables** don't work.
- Use a **slow, memory-hard key-derivation function (KDF)**: **Argon2** (preferred), **scrypt**,
  **bcrypt**, or **PBKDF2**. Slowness is deliberate — it makes mass guessing expensive.

```text
 stored = argon2( password + unique_salt )     # slow + salted, one-way
```

A **pepper** — a separate secret added to all passwords and kept outside the database — is an optional
extra layer. Contrast this with the *wrong* approach: `sha256(password)`, which a modern GPU can guess
billions of times per second.

### Common attacks and defenses

- **Brute force** — trying many passwords. Defense: slow KDFs, rate limiting, lockouts, MFA.
- **Credential stuffing** — replaying passwords leaked from other sites. Defense: unique passwords,
  breached-password screening, MFA.
- **Phishing** — tricking you into typing your password (and even your OTP) into a fake site. Defense:
  **phishing-resistant MFA** (below), user awareness.

### MFA methods, weakest to strongest

Not all second factors are equal (NIST SP 800-63B):

```text
 Method                 Strength   Note
 --------------------   --------   -----------------------------------------
 SMS / email OTP        weak-ish   Better than nothing, but phishable and
                                   vulnerable to SIM-swap; NIST "restricted".
 Authenticator (TOTP)   good       6-digit codes from an app; offline; still
                                   phishable in real time.
 Push approval          good       Tap to approve; beware "MFA fatigue" spam.
 FIDO2 / WebAuthn key   strongest  Hardware/passkey; PHISHING-RESISTANT — the
                                   key checks the site's real origin.
```

The big idea: **FIDO2/WebAuthn (passkeys)** are *phishing-resistant* because the authenticator is
cryptographically bound to the real website's origin, so it won't authenticate to a look-alike site.
That defeats the attack that beats every code-based method.

# Key Terminology

- **Authentication (AuthN)** — proving who you are.
- **Authorization (AuthZ)** — deciding what you may do (Lesson 7).
- **Factor** — a category of evidence: know / have / are.
- **MFA / 2FA** — using two or more different factor categories.
- **Entropy** — the unpredictability (effective randomness) of a password.
- **Salt / pepper** — unique per-password value / separate global secret added before hashing.
- **KDF** — a slow, salted one-way function for storing passwords (Argon2, bcrypt).
- **Credential stuffing** — reusing passwords leaked elsewhere to log in.
- **Phishing-resistant MFA** — FIDO2/WebAuthn, bound to the real site's origin.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Password style | Short + complex (`P@ss1!`) | Long passphrase | Long passphrase — length adds far more entropy than symbol substitutions. |
| Rotation policy | Force change every 30 days | Change on compromise | Change on compromise (NIST); forced rotation breeds weak, predictable passwords. |
| Storing passwords | Fast hash (SHA-256) | Salted slow KDF (Argon2) | Salted slow KDF, always — fast hashes are cracked at billions/sec. |
| Second factor | SMS OTP | FIDO2 / passkey | Passkey/FIDO2 when possible (phishing-resistant); any MFA beats none. |

# Worked Example

You're hardening your most important account (say, email, which can reset everything else):

```text
1. Replace the password with a UNIQUE random passphrase from a password manager.
2. Turn on MFA. Prefer a passkey / security key (FIDO2); if unavailable, use a
   TOTP authenticator app. Avoid SMS if a stronger option exists.
3. Save the RECOVERY CODES offline (availability: don't lock yourself out).
4. Result: even if the password leaks in a breach, an attacker still can't log
   in without your second factor — and a passkey won't work on a phishing site.
```

One unique password plus phishing-resistant MFA neutralizes the two most common attacks at once:
credential stuffing and phishing.

# Real World Analogy

Think of entering a **secure building**. **Authentication** is proving you're you at the door;
**authorization** is which rooms your badge then opens. A **single factor** is just a keycard — lose it
and anyone can enter. **MFA** is a keycard **plus** a fingerprint: a thief with only the card is
stopped. A **passkey (FIDO2)** is like a badge reader that also checks it's the *real* building — so a
fake lobby set up next door can't capture your credentials.

# Examples

## Example 1 — Basic: is it MFA?

A site asks for your password and then a security question ("mother's maiden name"). Both are
**something you know** — the same factor twice — so this is **not** true MFA. Adding a code from an
authenticator app (**something you have**) would make it MFA.

**Why this matters:** MFA requires *different* factor categories, or a single stolen category defeats
it.

## Example 2 — Real-world: MFA stops a breach reuse

A user's password leaks in another company's breach. Attackers try it on the user's bank
(**credential stuffing**). Because the bank requires an app-based code the attacker doesn't have, the
login fails. The leaked password alone is worthless.

**Why this works:** MFA breaks the link between a leaked password and account takeover.

## Example 3 — Pitfall: real-time phishing beats OTP codes

An attacker builds a convincing fake login page. The victim enters their password **and** their
6-digit TOTP code; the attacker relays both to the real site instantly and gets in. A code-based
second factor didn't help because the victim typed it into the attacker's page.

**Why this bites:** only **phishing-resistant** MFA (FIDO2/WebAuthn) — which checks the site's true
origin — stops this; codes can be relayed.

# Common Mistakes

- **Reusing passwords** across sites — one breach then unlocks many accounts.
- **Believing two knowledge factors are MFA** (password + security question).
- **Storing passwords in plaintext or with a fast hash** instead of a salted slow KDF.
- **Forcing frequent password changes**, which reduces real strength.
- **Assuming SMS codes are strong** — they're phishable and SIM-swappable.

# Best Practices

- Use a **password manager** with a **unique, long passphrase** per site.
- Turn on **MFA everywhere**, preferring **passkeys/FIDO2** (phishing-resistant).
- Store passwords with a **salted, slow KDF** (Argon2/bcrypt/scrypt/PBKDF2); consider a pepper.
- **Rate-limit and lock out** repeated failures; screen against **breached-password** lists.
- Protect **account recovery** (email, phone) as strongly as the account itself.

# Summary

- **Authentication** proves *who you are*; **authorization** decides *what you can do*.
- The three factors are **know / have / are**; **MFA** combines two or more categories.
- Strong passwords come from **length and uniqueness**, not forced complexity or rotation — use a
  **password manager** (NIST SP 800-63B).
- Store passwords **salted** with a **slow KDF** (Argon2/bcrypt), never plaintext or a fast hash.
- **MFA** is the biggest win; **FIDO2/WebAuthn passkeys** are **phishing-resistant** where codes are
  not.

# Flash Cards

Q: What is the difference between authentication and authorization?
A: Authentication proves who you are (identity); authorization decides what you are allowed to do. You authenticate first, then each action is authorized.

Q: What are the three authentication factor categories, with an example of each?
A: Something you know (password), something you have (phone or security key), and something you are (a biometric like a fingerprint).

Q: Why is "password + security question" not real multi-factor authentication?
A: Both are "something you know" — the same factor category twice — so stealing that one category defeats both; MFA needs two different categories.

Q: How should a system store user passwords?
A: Never in plaintext or with a fast hash — use a unique per-password salt and a slow, memory-hard KDF such as Argon2, scrypt, bcrypt, or PBKDF2 (optionally with a pepper).

Q: According to current NIST guidance, should passwords be rotated on a fixed schedule?
A: No — change passwords only on evidence of compromise; forced periodic rotation pushes users toward weaker, predictable passwords.

Q: Why are FIDO2/WebAuthn passkeys called phishing-resistant?
A: The authenticator is cryptographically bound to the real site's origin, so it won't authenticate to a look-alike phishing site, and there's no code an attacker can relay.

# Exercises

### Easy
Audit three of your accounts: for each, note whether the password is unique and whether MFA is on.
Enable MFA on any that lack it.

### Medium
Explain why `sha256(password)` is unsafe for storing passwords and what to use instead. Include the
roles of the salt and the KDF's slowness in your answer.

### Challenging
Describe a real-time phishing attack that captures both a password and a one-time code, then explain
precisely why a FIDO2/WebAuthn passkey would have stopped it. Cite where the origin check happens.

# Further Reading

- NIST SP 800-63B — *Digital Identity Guidelines: Authentication*: <https://pages.nist.gov/800-63-3/sp800-63b.html>
- OWASP — *Authentication Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>
- OWASP — *Password Storage Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- FIDO Alliance — *Passkeys / How FIDO works*: <https://fidoalliance.org/how-fido-works/>
