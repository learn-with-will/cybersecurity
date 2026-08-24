---
id: lesson-16
slug: logging-and-detection
title: "Logging, Monitoring, and Detection"
level: intermediate
order: 16
duration: 19
tags:
  - logging
  - monitoring
  - siem
  - detection
  - mitre-attack
summary: "How defenders see what's happening — what to log (and what never to log), why centralized, tamper-resistant logs and synchronized clocks matter, how a SIEM correlates events into alerts, and how detection engineering maps suspicious behavior to frameworks like MITRE ATT&CK while fighting alert fatigue."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain why **logging and monitoring** are essential (OWASP A09).
- Decide **what to log** and **what must never be logged**.
- Describe **centralized, tamper-resistant** logging and **time sync**.
- Explain what a **SIEM** does and how detections become **alerts**.
- Map suspicious activity to **MITRE ATT&CK** and manage **alert fatigue**.

# Why It Matters

You can't respond to what you can't see. Prevention will sometimes fail, so **detection** is what limits
how long an attacker operates undetected (their "dwell time") and gives you the evidence to respond and
recover. **Security Logging and Monitoring Failures** is OWASP **A09** precisely because missing or
ignored logs turn a containable incident into a silent, months-long breach. This lesson is the "detect"
in identify-protect-detect-respond-recover (Lesson 1) and the foundation for incident response
(Lesson 20).

# Concept Explanation

### Why logging matters

A **log** is a time-stamped record of an event. Logs let you **detect** attacks in progress,
**investigate** what happened, and **prove** it afterward (accountability). Without them, an intrusion
can go unnoticed and, once discovered, be impossible to reconstruct.

### What to log — and what never to log

Log the **security-relevant events**:

- **Authentication** — logins, logouts, failures, MFA events, password changes.
- **Authorization** — access grants and **denials**, privilege changes.
- **Important actions** — creation/deletion of data, configuration and admin changes.
- **System events** — errors, service start/stop, and anomalies.

Each entry should carry **who, what, when, where, and outcome**. But **never log secrets**: no
passwords, no full card numbers, no session tokens or API keys, and minimal personal data (a privacy and
compliance requirement, Lesson 23). Logs are themselves sensitive.

```json
{ "ts": "2026-02-01T10:15:04Z", "event": "login_failed", "user": "alice",
  "src_ip": "203.0.113.7", "reason": "bad_password", "attempt": 5 }
```

Structured logs (like JSON) are far easier to search and correlate than free text.

### Centralization, integrity, and time

- **Centralize** logs off the source system. If an attacker compromises a host, local logs can be
  deleted or altered; shipping them elsewhere (append-only/immutable storage) preserves the evidence.
- **Protect integrity** — restrict who can modify logs; consider write-once storage.
- **Synchronize clocks** (NTP) across systems, ideally in **UTC**, so you can line up events from many
  sources into one timeline. Mismatched clocks make correlation nearly impossible.
- **Retain** logs long enough to investigate (breaches are often found months later) and per compliance.

### SIEM: from events to alerts

A **SIEM (Security Information and Event Management)** system **aggregates** logs from across the
environment, **normalizes** them, and **correlates** events to spot patterns a single log wouldn't
reveal — for example, "one account failed login 50 times, then succeeded, then accessed an admin page."
It raises **alerts** and supports investigation and dashboards. Modern stacks add **SOAR** (automated
response playbooks) and **UEBA** (behavior analytics).

### Detection engineering and MITRE ATT&CK

**Detection engineering** is the craft of writing good **detections** — rules or analytics that fire on
attacker behavior. Detections are often mapped to **MITRE ATT&CK** (Lesson 2) so a team can see which
adversary **techniques** they can and can't currently detect (coverage). Detections key off
**indicators**: known-bad IPs/hashes (**IoCs**) and, more durably, **behaviors** (a service spawning a
shell, mass file encryption). Behavior-based detections survive when attackers change their specific
tools.

### Alert fatigue

Too many low-quality alerts cause **alert fatigue**: analysts start ignoring them, and the real one gets
missed. Counter it by **tuning** out false positives, **prioritizing** by severity, enriching alerts
with context, and automating the routine — quality over quantity. A precise, actionable alert beats a
hundred noisy ones.

# Key Terminology

- **Log** — a time-stamped record of an event (who, what, when, where, outcome).
- **Centralized logging** — shipping logs off-host to tamper-resistant storage.
- **Time synchronization (NTP)** — aligned clocks (UTC) so events correlate.
- **SIEM** — aggregates, correlates, and alerts on security events.
- **Detection engineering** — building rules/analytics that fire on attacker behavior.
- **IoC (Indicator of Compromise)** — an artifact (IP, hash, domain) signaling an attack.
- **Dwell time** — how long an attacker goes undetected.
- **Alert fatigue** — desensitization from too many low-value alerts.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Log storage | Local only | Centralized/immutable | Centralize off-host — local logs can be wiped by an attacker. |
| Detection basis | IoCs (known-bad) | Behavior/anomaly | Use both; behavior-based survives when attackers change tools. |
| Alerting | Alert on everything | Tuned, prioritized alerts | Tune and prioritize — too many alerts cause fatigue and missed incidents. |
| What to log | Everything incl. secrets | Security events, no secrets | Log security-relevant events; never log passwords, tokens, or full PII. |

# Worked Example

You suspect an account-takeover attempt. Good logging makes it visible:

```text
Correlated timeline from centralized logs (clocks in UTC):
  10:14:00  50x login_failed  user=alice  src=203.0.113.7   (brute force?)
  10:15:04  login_success     user=alice  src=203.0.113.7   (finally in)
  10:15:40  role_change       user=alice  -> admin          (privilege escalation)
  10:16:10  data_export       user=alice  size=2GB          (exfiltration)

SIEM correlation rule fires: "many failures + success + admin change + large export
from a new IP within minutes" -> high-severity alert -> incident response (Lesson 20).
```

No single log line proves an attack, but **correlated** events with **synchronized timestamps** tell a
clear story — and because the logs were **centralized**, the attacker couldn't erase them from the host.

# Real World Analogy

Logging and monitoring are a building's **security cameras and logbook**. Individual cameras record who
came and went; the **guard station (SIEM)** watches all the feeds together and notices the pattern — "the
same person tried five doors, then entered, then went to the vault." If the cameras recorded **only
locally** (on each door), a thief could smash them; sending footage to a **central, tamper-proof room**
preserves it. And a guard buried under a thousand false alarms (**alert fatigue**) will miss the real
break-in — so the alarms must be tuned to matter.

# Examples

## Example 1 — Basic: log denials, not just successes

An app logs successful logins but not **failures**. A slow brute-force attack leaves no trace until an
account is taken over. Adding failed-authentication logging (with source and count) makes the attack
visible while it's still happening.

**Why this works:** attacks often show up first as **denied** or failed actions — those must be logged.

## Example 2 — Real-world: centralization preserves evidence

An attacker compromises a server and runs `rm` on its local logs to cover their tracks. But the logs
were streamed in real time to a central, append-only store, so the security team still has the full
record and can reconstruct the intrusion.

**Why this works:** off-host, immutable logging defeats the attacker's attempt to erase evidence.

## Example 3 — Pitfall: logging a password

To "debug login issues," a developer logs the full request body — including the user's password — into
plaintext logs that many staff can read. The log meant to help security has now **leaked credentials**.

**Why this bites:** logs are sensitive; recording secrets or full PII creates a new breach. Log the
event, never the secret.

# Common Mistakes

- **Not logging security events** (especially failures/denials) — OWASP A09.
- **Logging secrets or excessive PII**, turning logs into a liability.
- **Keeping logs only on the source host**, where an attacker can delete them.
- **Unsynchronized clocks**, making cross-system correlation impossible.
- **Drowning in untuned alerts** (alert fatigue) so real incidents are missed.

# Best Practices

- **Log the right events** (auth, authorization, admin actions, errors) with who/what/when/where/outcome,
  as **structured** data — and **never** log secrets.
- **Centralize** logs to tamper-resistant storage, **protect their integrity**, and **retain** them
  adequately.
- **Synchronize clocks** (NTP, UTC) so events correlate across systems.
- Use a **SIEM** to correlate and alert; write **behavior-based detections** mapped to **ATT&CK**.
- **Tune alerts** for signal over noise and prioritize by severity to avoid fatigue.

# Summary

- **Logging and monitoring** are how defenders detect, investigate, and prove incidents; their absence
  is OWASP **A09** and enables silent, long-lived breaches.
- Log **security-relevant events** (who/what/when/where/outcome) as structured data, and **never log
  secrets or excessive PII**.
- **Centralize** logs to tamper-resistant storage and **synchronize clocks** so events correlate.
- A **SIEM** turns correlated events into **alerts**; **detection engineering** maps behavior to **MITRE
  ATT&CK**, and **tuning** fights **alert fatigue**.

# Flash Cards

Q: Which OWASP Top 10 (2021) category covers missing logging and monitoring, and why does it matter?
A: A09, Security Logging and Monitoring Failures; without adequate logging and alerting, attacks go undetected and can't be investigated, turning containable incidents into long, silent breaches.

Q: Name two things you should never write to logs.
A: Secrets and sensitive data — for example passwords, session tokens/API keys, full payment card numbers, and unnecessary personal data — because logs are themselves sensitive.

Q: Why should logs be centralized off the system that generates them?
A: An attacker who compromises a host can delete or alter its local logs; shipping logs to separate, tamper-resistant (append-only) storage preserves the evidence.

Q: Why is clock synchronization important for detection?
A: Correlating an attack across many systems requires their timestamps to line up; with synchronized clocks (NTP, ideally UTC) you can build one accurate timeline of events.

Q: What does a SIEM do?
A: It aggregates and normalizes logs from across the environment and correlates events to detect patterns a single log wouldn't reveal, raising prioritized alerts and supporting investigation.

Q: What is alert fatigue and how do you reduce it?
A: Desensitization caused by too many low-value alerts, leading analysts to miss real ones; reduce it by tuning out false positives, prioritizing by severity, enriching with context, and automating routine handling.

# Exercises

### Easy
List five security events an application should log, and for each note the who/what/when/where/outcome
fields it should capture.

### Medium
Explain why logging a failed login (with source IP and count) can reveal an attack that logging only
successful logins would miss. Then list two things that must be excluded from those logs.

### Challenging
Design a simple detection for account takeover: describe the log events you'd correlate, the condition
that should fire an alert, and how you'd tune it to avoid false positives. Map the behavior to a MITRE
ATT&CK technique.

# Further Reading

- OWASP — *Top 10 (2021) A09: Security Logging and Monitoring Failures*: <https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/>
- OWASP — *Logging Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- MITRE ATT&CK — *Enterprise Matrix* (mapping detections): <https://attack.mitre.org/>
- NIST SP 800-92 — *Guide to Computer Security Log Management*: <https://csrc.nist.gov/pubs/sp/800/92/final>
