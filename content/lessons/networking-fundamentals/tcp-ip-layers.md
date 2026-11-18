---
slug: tcp-ip-layers
title: "TCP/IP Layers"
topic: foundations
kind: concept
summary: "The TCP/IP model organizes networking functionality into hierarchical layers, each with specific responsibilities."
tags: [foundations, networking, tcp-ip]
related: [networking-fundamentals, network-defense]
---
> **In one line:** The TCP/IP model organizes networking communication into hierarchical layers, separating concerns like data transmission and address routing.

## The idea

Networking is complex, so the TCP/IP model breaks it down into layers:

- **Link Layer**: Physical hardware and local network frames.
- **Internet Layer**: Routes packets across network boundaries (IP addresses).
- **Transport Layer**: Manages the end-to-end connection (TCP vs. UDP, ports).
- **Application Layer**: User-facing protocols like HTTP, DNS, and SMTP.

## See it

| Layer | Function |
| :--- | :--- |
| Application | User data (HTTP) |
| Transport | Delivery (TCP/UDP) |
| Internet | Routing (IP) |
| Link | Physical medium |

## Remember
- TCP/IP organizes networking into functional, modular layers.
- Higher layers rely on the reliable transport provided by lower ones.
- Security controls are often applied at specific layers of this stack.
