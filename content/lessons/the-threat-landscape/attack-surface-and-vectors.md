---
slug: attack-surface-and-vectors
title: "Attack Surface and Attack Vectors"
topic: foundations
kind: concept
summary: "The attack surface is the sum of all points where an attacker can interact with a system, while attack vectors are the specific paths used to exploit them."
tags: [foundations, threats, attack-surface]
related: [threat-actors, the-threat-landscape]
---
> **In one line:** The attack surface is the totality of accessible points; an attack vector is the specific path chosen to exploit a weakness.

## The idea

- **Attack Surface**: The total number of points (entry points) where an attacker can try to enter or extract data from a system (open ports, web forms, user interfaces).
- **Attack Vector**: The path or means by which an attacker gains access or exploits a vulnerability (phishing, SQL injection, stolen credentials).

Reducing your attack surface directly limits the available attack vectors.

## See it

```tree
Attack Surface
  ├── Network interfaces
  ├── User inputs
  ├── API endpoints
  └── Open ports
```

## Remember
- Reducing attack surface makes a system harder to exploit.
- An attack vector is the path used to take advantage of an exposure.
- Keep the number of open entry points to the absolute minimum necessary.
