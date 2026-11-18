---
slug: defense-in-depth
title: "Defense in Depth"
topic: foundations
kind: concept
summary: "Defense in depth layers multiple independent security controls so that a single failure doesn't leave the system exposed."
tags: [foundations, defense-in-depth, security]
related: [security-as-a-process, what-is-cybersecurity]
---
> **In one line:** Layering multiple independent controls ensures that if one is bypassed, another still protects the asset.

## The idea

Any single security control can fail. To mitigate this, defenders use **defense in depth**: layering many independent controls. If an attacker bypasses the first layer (e.g., a firewall), they are stopped by the next (e.g., host-based protection). The goal is to make the entire system resilient to individual failures.

## See it

Imagine securing a house:
1. Fence (Outer layer)
2. Door lock (Inner layer)
3. Alarm system (Monitoring layer)

If the fence is jumped, the door lock still stops the burglar. If the door lock is picked, the alarm still trips.

## Remember
- Defense in depth relies on multiple layers of independent controls.
- Single points of failure must be identified and eliminated.
- Layered defense makes a system resilient, not just "unbreakable".
