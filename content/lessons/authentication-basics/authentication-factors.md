---
slug: authentication-factors
title: "Authentication Factors"
topic: foundations
kind: concept
summary: "Authentication factors—what you know, what you have, and what you are—form the basis of verifying user identity."
tags: [foundations, authentication, identity]
related: [authentication-basics, authorization-basics]
---
> **In one line:** Verifying identity reliably requires combining multiple independent authentication factors.

## The idea

Identity verification relies on three categories of factors:

- **What you know**: Passwords, PINs, security questions.
- **What you have**: Security keys, mobile devices, hardware tokens.
- **What you are**: Biometrics (fingerprint, face recognition).

Multi-Factor Authentication (MFA) combines these to prevent attackers from gaining access using only a leaked password.

## See it

| Factor Category | Example |
| :--- | :--- |
| Knowledge | Password |
| Possession | TOTP / Hardware key |
| Inherence | Fingerprint |

## Remember
- Single-factor authentication is rarely sufficient for secure accounts.
- MFA combines independent factors to increase security.
- Phishing-resistant hardware keys provide the highest level of security.
