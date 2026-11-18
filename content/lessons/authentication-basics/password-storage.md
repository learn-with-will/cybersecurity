---
slug: password-storage
title: "Secure Password Storage"
topic: foundations
kind: technique
summary: "Passwords must never be stored in plain text; use strong salts and slow, computationally intensive hashing algorithms."
tags: [foundations, authentication, storage]
related: [authentication-basics, cryptography-essentials]
---
> **In one line:** Never store passwords in plain text; always use unique salts and slow, modern hashing algorithms.

## The idea

If your database is breached, the attacker will get all the stored credentials. To protect users:

- **Never store plain text**: Use secure hashing.
- **Salting**: Add a random value (salt) to each password before hashing to prevent rainbow table attacks.
- **Slow hashing (KDFs)**: Use algorithms designed to be computationally expensive (like Argon2 or bcrypt) to thwart brute-force attempts.

## See it

```flow
Password + Unique Salt -> Slow Hashing Algorithm -> Secure Hash
```

## Remember
- Never store passwords in plain text.
- Use a unique salt for every password.
- Choose a slow, battle-tested hashing algorithm like Argon2 or bcrypt.
