---
slug: encoding-encryption-hashing
title: "Encoding, Encryption, and Hashing"
topic: foundations
kind: concept
summary: "Understand the differences: encoding is format conversion, encryption is reversible confidentiality, and hashing is one-way integrity."
tags: [foundations, cryptography, basics]
related: [cryptography-essentials, tls-and-pki]
---
> **In one line:** Know the difference: encoding translates formats, encryption hides information, and hashing provides verifiable integrity.

## The idea

People frequently confuse these three:

- **Encoding**: Changes data to a new format for transmission (e.g., Base64). **Not** security; anyone can decode it.
- **Encryption**: Uses keys to hide information. Reversible if you have the key. Provides confidentiality.
- **Hashing**: A one-way function that produces a unique "fingerprint." Not reversible. Provides integrity.

## See it

| Process | Reversible? | Primary Goal |
| :--- | :--- | :--- |
| Encoding | Yes (No key) | Format |
| Encryption | Yes (With key) | Confidentiality |
| Hashing | No | Integrity |

## Remember
- Never mistake encoding for security.
- Encryption provides confidentiality.
- Hashing provides verifiable integrity.
