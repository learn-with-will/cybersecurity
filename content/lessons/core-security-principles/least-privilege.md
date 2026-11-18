---
slug: least-privilege
title: "Principle of Least Privilege"
topic: foundations
kind: concept
summary: "The principle of least privilege dictates that users and systems should only have the minimum access necessary to perform their functions."
tags: [foundations, principles, access-control]
related: [core-security-principles, authorization-basics]
---
> **In one line:** Grant users and services only the minimum access permissions necessary to perform their assigned work, and nothing more.

## The idea

The Principle of Least Privilege (PoLP) is a core security pillar. By restricting access:

- You limit the damage of a compromised account.
- You prevent accidental misuse.
- You reduce the overall attack surface.

If an account is not *required* to perform a task, it shouldn't have access to it.

## See it

| Role | Access |
| :--- | :--- |
| User | Read own files |
| Admin | Manage system configs |
| Guest | None |

## Remember
- Least privilege reduces the impact of account compromise.
- Access rights should be regularly audited and revoked if no longer needed.
- Grant only the minimum permissions required for a task.
