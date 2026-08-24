---
id: lesson-05
slug: cryptography-essentials
title: "Cryptography Essentials"
level: beginner
order: 5
duration: 20
tags:
  - cryptography
  - encryption
  - hashing
  - keys
  - integrity
summary: "The three ideas people constantly confuse — encoding, encryption, and hashing — made clear, plus symmetric versus asymmetric keys, what digital signatures and authenticated encryption give you, and the golden rule to use vetted libraries instead of inventing your own crypto."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Tell apart **encoding**, **encryption**, and **hashing** — and never confuse them again.
- Explain **symmetric** vs **asymmetric** keys and which key does what.
- Describe what a **hash**, a **digital signature**, and a **MAC** protect.
- Explain **authenticated encryption (AEAD)** and why integrity ≠ confidentiality.
- State why you should **never roll your own crypto**.

# Why It Matters

Cryptography is how we get confidentiality and integrity (two of the CIA goals) over networks that
anyone can read. But it's also where beginners make their most dangerous mistakes — calling Base64
"encryption," hashing passwords with MD5, or encrypting data without protecting its integrity. Getting
the vocabulary exactly right here prevents whole categories of real vulnerabilities you'll see in
later lessons (TLS, tokens, password storage).

# Concept Explanation

### The big three: encoding vs encryption vs hashing

These look similar and are constantly mixed up. They are **completely different**:

- **Encoding** (e.g. **Base64**, URL-encoding) reformats data so it survives transport. It is
  **reversible by anyone** and uses **no key**. It provides **zero** confidentiality. `SGVsbG8=` is
  just "Hello" in Base64 — not a secret.
- **Encryption** transforms data so only someone with the right **key** can read it. It is
  **reversible with the key** and provides **confidentiality**.
- **Hashing** maps data to a fixed-size **digest** and is **one-way**: you can't reverse it to get the
  input. It provides **integrity** (a fingerprint), not confidentiality.

```text
 Operation    Reversible?              Key?      Provides
 ----------   ----------------------   -------   -------------------
 Encoding     yes, by anyone           no        nothing (formatting)
 Encryption   yes, with the key        yes       confidentiality
 Hashing      no (one-way)             no*       integrity / fingerprint
```

(*Keyed hashing — a **MAC** — adds a secret key for authenticity; see below.)

### Symmetric encryption

**Symmetric encryption** uses **one shared secret key** for both encrypting and decrypting. The
standard is **AES (Advanced Encryption Standard)**, a NIST standard (FIPS 197). It's fast and used for
bulk data.

```bash
# Encrypt then decrypt with the SAME passphrase-derived key (AES-256).
echo "meet at noon" | openssl enc -aes-256-cbc -pbkdf2 -a          # -> Base64 ciphertext
# The recipient needs the same passphrase to reverse it with -d.
```

The catch: both sides must **share the key** without an eavesdropper getting it — the **key
distribution problem**. Asymmetric crypto solves it.

### Asymmetric (public-key) encryption

**Asymmetric encryption** uses a **key pair**: a **public key** (share freely) and a **private key**
(keep secret). What one key locks, only the other unlocks. The direction matters:

- **For confidentiality:** encrypt with the recipient's **public** key → only their **private** key
  can decrypt. Anyone can send *them* a secret without a pre-shared key.
- **For authenticity (signatures):** the sender **signs** with their **private** key → anyone can
  **verify** with the sender's **public** key, proving it came from them and wasn't altered.

Common algorithms are **RSA** and **elliptic-curve (ECC/Ed25519)**. Asymmetric crypto is slower, so in
practice systems use it to **exchange a symmetric key** (via **Diffie–Hellman** key exchange), then
switch to fast symmetric encryption — exactly what TLS does (Lesson 12).

### Hashing and its properties

A **cryptographic hash** (e.g. **SHA-256**) turns any input into a fixed-length digest with these
properties: **deterministic** (same input → same digest), **one-way** (can't reverse), **avalanche**
(a tiny change flips much of the output), and **collision-resistant** (hard to find two inputs with
the same digest).

```python
import hashlib
# One-way fingerprint of some data:
print(hashlib.sha256(b"hello").hexdigest())
# 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
# Change a single letter and the digest is completely, unpredictably different.
```

Uses: verifying a download wasn't corrupted, detecting file changes, and (with care) storing
passwords. **Important:** **MD5** and **SHA-1** are **broken for collision resistance** — never use
them for signatures or integrity. And **plain fast hashes are wrong for passwords**; passwords need a
**slow, salted** function (Argon2/bcrypt/scrypt/PBKDF2), covered in Lesson 6.

### Integrity is not confidentiality: MACs and AEAD

Encryption hides data but does **not** by itself prove it wasn't tampered with. To get **authenticity
and integrity** you add:

- A **MAC (Message Authentication Code)**, such as **HMAC** — a keyed fingerprint that proves a
  message came from someone with the shared key and wasn't changed.
- **AEAD (Authenticated Encryption with Associated Data)** — modes like **AES-GCM** or
  **ChaCha20-Poly1305** that give confidentiality **and** integrity in one step. Modern systems use
  AEAD by default so you can't forget the integrity half.

### Don't roll your own crypto

The algorithms are public and well-studied — the danger is in the **implementation** (weak randomness,
reused nonces, timing leaks, missing integrity checks). Use **vetted libraries** (libsodium, your
platform's crypto, TLS) and standard modes. "Home-made" crypto is one of the most reliable ways to
create a vulnerability.

# Key Terminology

- **Encoding** — reversible, keyless reformatting (Base64); not security.
- **Encryption / decryption** — reversible transform using a key; confidentiality.
- **Symmetric key** — one shared secret for encrypt and decrypt (AES).
- **Asymmetric / public-key** — a public + private key pair (RSA, ECC).
- **Hash / digest** — one-way fixed-size fingerprint (SHA-256).
- **Digital signature** — sign with private key, verify with public key.
- **MAC / HMAC** — keyed integrity + authenticity check.
- **AEAD** — authenticated encryption (AES-GCM): confidentiality + integrity together.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Hide data in transit | Encode (Base64) | Encrypt (with a key) | Encrypt — encoding is not secret. Base64 only helps data survive transport. |
| Key type | Symmetric (AES) | Asymmetric (RSA/ECC) | Symmetric for bulk speed; asymmetric to exchange keys and sign. Real systems combine both. |
| Password storage | Fast hash (SHA-256) | Slow salted KDF (Argon2/bcrypt) | Always a slow salted KDF for passwords; fast hashes are brute-forced quickly. |
| Encryption mode | Plain encryption | AEAD (AES-GCM) | AEAD — it protects integrity too, so tampering is detected. |

# Worked Example

Alice wants to send Bob a private, verifiable message over an open network:

```text
Setup:  Bob has a key pair. His PUBLIC key is known; his PRIVATE key is secret.

1. Confidentiality: Alice generates a random symmetric key K, encrypts her
   message with K (fast, AES-GCM), and encrypts K with Bob's PUBLIC key.
2. Bob decrypts K with his PRIVATE key, then decrypts the message with K.
3. Authenticity: Alice SIGNS the message with HER private key; Bob VERIFIES
   with Alice's public key, confirming it's really from Alice and unaltered.
```

This "encrypt the data symmetrically, wrap the key asymmetrically, sign for authenticity" pattern is
the heart of TLS and secure messaging — no pre-shared secret needed, and both confidentiality and
integrity are covered.

# Real World Analogy

Think about a **locked mailbox with a mail slot**. Anyone can drop a letter in through the slot
(encrypt with the **public** key), but only the owner with the **key** can open it and read the mail
(decrypt with the **private** key). A **hash** is like a **tamper-evident seal**: you can't recreate
the letter from the seal, but if the seal's fingerprint doesn't match, you know the letter was
changed. **Base64 encoding** is just writing the letter in a different alphabet — anyone can read it.

# Examples

## Example 1 — Basic: Base64 is not encryption

A developer "hides" an API token by Base64-encoding it before storing it in a cookie. Anyone who reads
the cookie decodes it instantly (`base64 -d`) and recovers the token. Encoding changed the *format*,
not the *secrecy*.

**Why this matters:** treating encoding as encryption leaves secrets in plain sight.

## Example 2 — Real-world: verifying a download

A Linux distribution publishes the **SHA-256 hash** of an ISO file. After downloading, you hash your
copy and compare. If the digests match, the file wasn't corrupted or swapped; if they differ, you
don't trust it.

**Why this works:** hashing provides an integrity check — a fingerprint you can compare without
needing a key.

## Example 3 — Pitfall: encryption without integrity

An app encrypts data with AES in a plain mode but adds no MAC. An attacker who can't *read* the
ciphertext can still **flip bits** in it, silently changing the decrypted result (a "bit-flipping"
attack). The app trusted tampered data because it only checked confidentiality, not integrity.

**Why this bites:** confidentiality and integrity are different goals — use AEAD so both are covered.

# Common Mistakes

- **Calling Base64 (or any encoding) "encryption."** It provides no secrecy at all.
- **Hashing passwords with MD5/SHA-1 or plain SHA-256.** Use a slow, salted KDF (Lesson 6).
- **Getting the asymmetric direction wrong.** Encrypt with the *recipient's public* key; sign with
  *your private* key.
- **Encrypting without integrity.** Missing a MAC/AEAD invites tampering.
- **Writing your own crypto.** Use standard algorithms via vetted libraries and modes.

# Best Practices

- Use **AES-GCM** (or ChaCha20-Poly1305) — **AEAD** — for confidentiality *and* integrity.
- Use **SHA-256/SHA-3** for integrity; **never MD5/SHA-1** for security.
- Use **established libraries** (libsodium, platform crypto, TLS); don't invent primitives.
- Protect **private keys** rigorously; their secrecy is the whole game (open design, Lesson 3).
- For passwords, use a **slow salted KDF**, not a general-purpose hash.

# Summary

- **Encoding ≠ encryption ≠ hashing:** encoding is keyless and reversible (no secrecy), encryption is
  reversible with a key (confidentiality), hashing is one-way (integrity).
- **Symmetric** crypto shares one key (fast, AES); **asymmetric** uses a public/private pair —
  encrypt with the recipient's public key, sign with your private key.
- **Integrity is separate from confidentiality**: use **MACs/AEAD** (AES-GCM) so tampering is
  detected.
- **Never roll your own crypto** — use vetted libraries and standard modes, and guard private keys.

# Flash Cards

Q: How do encoding, encryption, and hashing differ?
A: Encoding is keyless, reversible reformatting with no secrecy; encryption is reversible with a key and gives confidentiality; hashing is one-way and gives integrity, not confidentiality.

Q: In symmetric vs asymmetric encryption, how many keys are involved and how are they used?
A: Symmetric uses one shared secret key for both encrypt and decrypt; asymmetric uses a public/private key pair, where what one key locks only the other unlocks.

Q: To send someone a confidential message with public-key crypto, whose key do you use and how?
A: Encrypt with the recipient's public key; only their matching private key can decrypt it.

Q: Which key signs a message and which key verifies the signature?
A: You sign with your own private key; others verify with your public key, proving authenticity and that the message wasn't altered.

Q: Why are MD5 and SHA-1 unsafe for security use?
A: They are broken for collision resistance (attackers can find two inputs with the same digest), so they must not be used for signatures or integrity.

Q: What does AEAD (e.g. AES-GCM) provide that plain encryption does not?
A: It provides authenticity/integrity along with confidentiality in one step, so tampering with the ciphertext is detected rather than silently accepted.

# Exercises

### Easy
Take the word `security`, encode it in Base64 (any online or CLI tool), then decode it back. Explain
in one sentence why this proves encoding is not encryption.

### Medium
Using `hashlib` (or any tool), hash a short string with SHA-256, then change one character and hash
again. Describe what happens to the digest and which hash property that demonstrates.

### Challenging
Explain, step by step, how two people who have never met can end up sharing a secret key over a public
network without an eavesdropper learning it. Name the roles of asymmetric encryption and symmetric
encryption in your answer, and where integrity is checked.

# Further Reading

- NIST FIPS 197 — *Advanced Encryption Standard (AES)*: <https://csrc.nist.gov/pubs/fips/197/final>
- NIST — *Hash Functions (SHA-2, SHA-3)*: <https://csrc.nist.gov/projects/hash-functions>
- OWASP — *Cryptographic Storage Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html>
- Ross Anderson — *Security Engineering* (3rd ed.), ch. 5 (Cryptography): <https://www.cl.cam.ac.uk/~rja14/book.html>
