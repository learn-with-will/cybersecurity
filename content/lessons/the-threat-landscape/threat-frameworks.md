---
slug: threat-frameworks
title: "Threat Frameworks"
topic: foundations
kind: tool
summary: "Threat frameworks like MITRE ATT&CK provide a shared language for describing attacker behaviors and organizing defenses."
tags: [foundations, threats, mitre]
related: [the-threat-landscape, logging-and-detection]
---
> **In one line:** Frameworks like MITRE ATT&CK provide a standardized way to describe, track, and defend against known attacker tactics.

## The idea

It is hard to defend against what you can't describe. Threat frameworks offer a shared language for defenders:

- **MITRE ATT&CK**: A global knowledge base of attacker tactics and techniques based on real-world observations.
- **CVE (Common Vulnerabilities and Exposures)**: A list of publicly known security vulnerabilities.

Using these allows organizations to map their detection coverage against known attacker behaviors.

## See it

```flow
Tactic -> Technique -> Procedure (TTP)
```

## Remember
- Frameworks help standardize how security teams discuss and detect threats.
- MITRE ATT&CK categorizes real-world adversary behavior.
- CVEs provide standardized identifiers for specific software vulnerabilities.
