---
id: lesson-14
slug: network-defense
title: "Network Defense"
level: intermediate
order: 14
duration: 20
tags:
  - firewalls
  - ids-ips
  - segmentation
  - vpn
  - network-security
summary: "The controls that protect networks — firewalls that filter traffic, segmentation that limits how far an intruder can spread, intrusion detection and prevention systems that spot and block attacks, VPNs that secure remote access, and web application firewalls — assembled into defense in depth at the network layer."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe what **firewalls** do and the main types.
- Explain **network segmentation** and why it limits blast radius.
- Distinguish **IDS** from **IPS** and signature- vs anomaly-based detection.
- Explain what a **VPN** and a **WAF** each protect.
- Combine these into **defense in depth** on a network.

# Why It Matters

Attacks and defenses both travel over the network you met in Lesson 4. Network controls decide **who
can reach what**, **contain** an intruder who gets in, and **detect** malicious traffic. They're a core
layer of defense in depth: even a perfectly patched server benefits from a firewall in front of it and
monitoring around it. This lesson assembles the toolkit — firewalls, segmentation, IDS/IPS, VPNs,
WAFs — and shows how they fit together.

# Concept Explanation

### Firewalls

A **firewall** enforces rules about which traffic may pass between networks, based on addresses, ports,
and protocols. It's the network's gatekeeper, and (following fail-safe defaults, Lesson 3) a good
policy **denies by default** and allows only what's needed. Types, roughly in order of capability:

- **Packet-filtering** — allows/blocks individual packets by IP/port/protocol; simple, no memory of
  connections.
- **Stateful** — tracks connection **state**, so it can allow reply traffic for connections it saw
  start, and block unsolicited packets. The common baseline.
- **Next-generation (NGFW)** — adds application awareness, user identity, and integrated intrusion
  prevention.

```bash
# A simple host firewall policy (Linux ufw): default deny inbound, allow SSH + HTTPS.
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp        # SSH  (restrict the source in real setups)
ufw allow 443/tcp       # HTTPS
ufw enable
```

### Network segmentation

**Segmentation** divides a network into zones so a compromise in one can't freely reach everything —
a direct application of least privilege and limiting **blast radius**. Techniques:

- **VLANs / subnets** separate groups (e.g., guest Wi-Fi from corporate).
- A **DMZ (demilitarized zone)** isolates internet-facing servers from the internal network, so a
  breached web server isn't *inside* everything.
- **Micro-segmentation** enforces fine-grained rules between individual workloads, a building block of
  **zero-trust networking** (Lesson 3): no implicit trust just because two systems share a network.

```text
 Internet ── Firewall ── DMZ (web servers) ── Firewall ── Internal (databases, staff)
                                   │
              a breach here is CONTAINED, not a path straight to the database
```

### IDS and IPS

- An **IDS (Intrusion Detection System)** **monitors** traffic and **alerts** on suspicious activity —
  it watches, it doesn't block.
- An **IPS (Intrusion Prevention System)** sits **inline** and can **block** malicious traffic in real
  time.

Detection methods:

- **Signature-based** — matches known-bad patterns; accurate for known attacks, blind to novel ones.
- **Anomaly-based** — flags deviations from a learned "normal"; can catch new attacks but produces more
  **false positives**.

They can be **network-based (NIDS/NIPS)** watching a segment, or **host-based (HIDS)** watching one
system. Tuning matters: too sensitive floods analysts with noise; too lax misses attacks.

### VPNs and secure remote access

A **VPN (Virtual Private Network)** creates an **encrypted tunnel** over an untrusted network, so remote
staff can reach internal resources and their traffic can't be read on the path (Lesson 4's "encrypt in
transit"). It protects confidentiality and integrity of the connection — but a VPN that grants broad
internal access conflicts with least privilege, which is why **zero-trust access** (verify each
request/app, not just "you're on the VPN") is increasingly preferred.

### Web application firewalls

A **WAF (Web Application Firewall)** filters **HTTP** traffic (layer 7), blocking common web attacks like
injection and XSS patterns before they reach the app. It's useful **defense in depth** — but it's a
filter that can be bypassed, **not a substitute** for fixing the code (parameterized queries, output
encoding). Treat a WAF as a speed bump and safety net, not the cure.

# Key Terminology

- **Firewall** — enforces which traffic may pass between networks (deny by default).
- **Stateful firewall** — tracks connection state to allow legitimate replies, block unsolicited.
- **Segmentation / DMZ / micro-segmentation** — dividing networks to contain intrusions.
- **IDS / IPS** — detect-and-alert / detect-and-block (inline) systems.
- **Signature vs anomaly detection** — match known-bad vs deviation from normal.
- **VPN** — encrypted tunnel for secure remote access.
- **WAF** — HTTP-layer firewall filtering web attacks; defense in depth, not a fix.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Firewall policy | Allow by default | Deny by default | Deny by default; allow only required ports/sources (fail-safe). |
| Detection mode | IDS (alert) | IPS (block) | IPS to stop attacks inline; IDS where blocking a false positive would be worse than missing one. |
| Detection method | Signature | Anomaly | Combine: signatures for known threats, anomaly for novel — tune for false positives. |
| Remote access | Broad VPN | Zero-trust per-app access | Zero-trust/least-privilege access; a broad VPN over-trusts anyone who connects. |

# Worked Example

Design layered network defense for a small company hosting a public website:

```text
 Internet
    │  Firewall: deny all inbound except 443 to the web server
    ▼
 [ DMZ ]  web server only — no direct path to internal data
    │  Firewall: web server may reach ONLY the app/database port it needs
    ▼
 [ Internal ]  database + staff, segmented by VLAN; guest Wi-Fi isolated

 Monitoring:  IDS/IPS watches DMZ and internal traffic; alerts to the team.
 Remote work: zero-trust access to specific apps, not a flat VPN into everything.
 Web app:     a WAF in front of the site — plus fixing the code (Lessons 10-11).
```

If the web server is compromised, segmentation means the attacker lands in the **DMZ**, not next to the
database; the firewall limits where they can go; and the IDS/IPS raises an alarm. No single control has
to be perfect.

# Real World Analogy

Think of a **secured building**. The **firewall** is the front gate that only lets in expected visitors.
**Segmentation** is the internal doors and floors — a visitor to the lobby can't wander into the vault.
The **DMZ** is a reception area separated from the offices. The **IDS/IPS** is the security camera and
guard: the IDS *watches and radios* an alert, while the IPS *steps in and blocks* the intruder. The
**VPN** is a secure, armored shuttle for staff arriving from outside. And a **WAF** is a screener at one
specific service window checking the paperwork.

# Examples

## Example 1 — Basic: default-deny firewall

A server's firewall is set to deny all inbound traffic and then allow only port 443 from anywhere and
port 22 from the admin's IP. Every other port an attacker probes is simply unreachable — the attack
surface (Lesson 2) shrinks to two well-guarded doors.

**Why this works:** deny-by-default means new or forgotten services aren't accidentally exposed.

## Example 2 — Real-world: segmentation contains ransomware

Ransomware infects a laptop on the guest/staff VLAN. Because critical servers are on a separate,
firewalled segment that the laptop can't reach, the malware can't spread to them. Cleanup is limited to
one zone instead of the whole company.

**Why this works:** segmentation caps blast radius, turning a catastrophe into an incident.

## Example 3 — Pitfall: trusting the WAF instead of the code

A team ships a SQL-injection-prone app but "protects" it with a WAF. Attackers craft an encoding the
WAF's rules don't match, and the injection succeeds. The vulnerable code was never fixed — the WAF was
treated as the cure.

**Why this bites:** perimeter filters can be bypassed; they supplement secure code, they don't replace
it.

# Common Mistakes

- **Allow-by-default firewall rules** or overly broad "any-any" allows.
- **Flat networks** with no segmentation — one foothold reaches everything.
- **Deploying IDS/IPS and ignoring the alerts**, or never tuning out false positives.
- **Broad VPN access** that trusts anyone who connects (violates least privilege).
- **Relying on a WAF** instead of fixing the underlying vulnerability.

# Best Practices

- **Deny by default**; allow only required ports and sources, and review rules regularly.
- **Segment** networks (DMZ, VLANs, micro-segmentation) to contain intrusions.
- Run **IDS/IPS**, combine signature + anomaly detection, and **tune and monitor** the alerts.
- Provide **least-privilege remote access** (zero-trust) rather than flat VPNs; encrypt all remote
  traffic.
- Use a **WAF as defense in depth**, never as a substitute for secure code.

# Summary

- **Firewalls** control which traffic passes (deny by default); **stateful** and **next-gen** firewalls
  add connection and application awareness.
- **Segmentation** (DMZ, VLANs, micro-segmentation) limits how far an intruder can spread — least
  privilege for networks.
- **IDS detects/alerts**; **IPS blocks inline**; use **signature + anomaly** detection and tune for
  false positives.
- **VPNs** secure remote traffic (prefer zero-trust access), and a **WAF** filters web attacks as
  defense in depth — not a replacement for fixing the code.

# Flash Cards

Q: What is the difference between an IDS and an IPS?
A: An IDS monitors traffic and raises alerts (it watches); an IPS sits inline and can actively block malicious traffic in real time.

Q: Why does a stateful firewall improve on simple packet filtering?
A: It tracks the state of connections, so it can allow legitimate reply traffic for connections it saw begin while blocking unsolicited packets — packet filters have no such memory.

Q: How does network segmentation reduce risk?
A: It divides the network into zones so a compromise in one zone can't freely reach others, limiting an intruder's blast radius — least privilege applied to networks.

Q: What is the difference between signature-based and anomaly-based detection?
A: Signature-based matches known-bad patterns (accurate for known attacks, blind to new ones); anomaly-based flags deviations from normal (can catch novel attacks but yields more false positives).

Q: What does a VPN protect, and what's a common overreach?
A: A VPN encrypts the connection over an untrusted network for secure remote access; the overreach is granting broad internal access to anyone connected, which violates least privilege — prefer zero-trust per-app access.

Q: Why is a WAF not a substitute for fixing vulnerable code?
A: A WAF filters known web-attack patterns at the perimeter but can be bypassed with novel encodings; the underlying flaw remains, so it's defense in depth, not a cure.

# Exercises

### Easy
Write a default-deny firewall policy (in words or `ufw`/`iptables` syntax) for a web server that should
accept only HTTPS from anyone and SSH from one admin address.

### Medium
Sketch a segmented network for a company with a public website, an internal database, and guest Wi-Fi.
Show where the firewalls and DMZ go and explain what a breach of the web server can and cannot reach.

### Challenging
Compare a traditional VPN with a zero-trust access model for remote workers. Describe a scenario where
the VPN over-trusts a connected device, and how zero-trust would limit the damage. Cite the least-
privilege principle.

# Further Reading

- NIST SP 800-41 Rev. 1 — *Guidelines on Firewalls and Firewall Policy*: <https://csrc.nist.gov/pubs/sp/800/41/r1/final>
- NIST SP 800-207 — *Zero Trust Architecture*: <https://csrc.nist.gov/pubs/sp/800/207/final>
- Cloudflare Learning — *What is an IDS/IPS?*: <https://www.cloudflare.com/learning/security/what-is-an-intrusion-detection-system/>
- OWASP — *Web Application Firewall*: <https://owasp.org/www-community/Web_Application_Firewall>
