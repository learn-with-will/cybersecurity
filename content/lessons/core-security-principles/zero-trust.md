---
slug: zero-trust
title: "Zero Trust"
topic: foundations
kind: concept
summary: "Zero trust is a security model that assumes every request—internal or external—should be verified."
tags: [foundations, zero-trust, access-control]
related: [core-security-principles, network-defense]
---
> **In one line:** Zero trust assumes no entity is trustworthy by default, requiring continuous verification for every access attempt.

## The idea

Old models often trusted internal traffic implicitly. **Zero trust** changes this:

- **Verify explicitly**: Every request must be authenticated, authorized, and encrypted.
- **Least privilege**: Restrict access as far as possible.
- **Assume breach**: Design systems assuming the network is already compromised.

Zero trust doesn't mean "distrust everyone," it means "verify everyone."

## See it

```flow
Request -> Verify Identity -> Verify Authorization -> Grant Access
```

## Remember
- Never assume traffic is safe just because it comes from inside the network.
- Verify every access attempt, regardless of its source.
- Assume breach and design accordingly.
