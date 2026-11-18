---
slug: symmetric-vs-asymmetric
title: "Symmetric vs Asymmetric Encryption"
topic: foundations
kind: concept
summary: "Symmetric encryption uses the same key for both parties, while asymmetric encryption uses a public-private key pair."
tags: [foundations, cryptography, keys]
related: [cryptography-essentials, tls-and-pki]
---
> **In one line:** Symmetric encryption is fast for bulk data, while asymmetric encryption solves the key-exchange problem.

## The idea

- **Symmetric**: The same key encrypts and decrypts. Fast but requires secure key sharing.
- **Asymmetric**: Uses a pair—a **public key** for encryption and a **private key** for decryption. The private key is never shared.

Asymmetric encryption is the foundation for secure key exchange in HTTPS (TLS).

## See it

```tree
Encryption Types
  ├── Symmetric (Same key)
  │     └── Fast, good for large data
  └── Asymmetric (Key pair)
        └── Public/Private key, secure sharing
```

## Remember
- Symmetric encryption is faster but sharing the key is a hurdle.
- Asymmetric encryption allows secure communication without a prior shared secret.
- Modern protocols combine both for efficiency and security.
