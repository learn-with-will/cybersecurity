---
id: lesson-20
slug: incident-response-and-forensics
title: "Incident Response and Forensics"
level: advanced
order: 20
duration: 20
tags:
  - incident-response
  - forensics
  - nist-800-61
  - chain-of-custody
  - recovery
summary: "What to do when prevention fails — the incident-response lifecycle (preparation, detection and analysis, containment, eradication, recovery, and lessons learned) and the foundations of digital forensics: preserving evidence, respecting the order of volatility, and maintaining a chain of custody."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain why an **incident-response (IR) plan** must exist before an incident.
- Walk through the **NIST IR lifecycle** phases.
- Choose appropriate **containment, eradication, and recovery** actions.
- Apply forensic basics: **preserve evidence**, **order of volatility**, **chain of custody**.
- Describe the value of a **post-incident "lessons learned"** review.

# Why It Matters

Prevention will eventually fail — the mature question is not *if* but *how well you respond*. A calm,
practiced **incident response** limits damage, preserves evidence, restores service, and turns a crisis
into an improvement. Panicked, improvised responses make things worse: they destroy evidence, tip off
the attacker, or cause outages. This lesson is the "respond and recover" end of the framework from
Lesson 1, building on the detection you set up in Lesson 16.

# Concept Explanation

### An event is not an incident

An **event** is any observable occurrence; a **security incident** is an event (or series) that
**actually or imminently jeopardizes** the confidentiality, integrity, or availability of systems or
data. Triage decides which events are incidents worth activating the plan for.

### The incident-response lifecycle (NIST SP 800-61)

NIST describes IR as a repeating lifecycle. A common phrasing:

```text
 1. Preparation                 plans, tools, training, contacts — BEFORE anything
 2. Detection & Analysis        recognize and scope the incident (Lesson 16)
 3. Containment, Eradication
    & Recovery                  stop spread, remove the threat, restore safely
 4. Post-Incident Activity      lessons learned; improve
        ▲───────────────── feed back into Preparation ─────────────────┘
```

(The SANS variant **PICERL** — Preparation, Identification, Containment, Eradication, Recovery, Lessons
Learned — covers the same ground.) The most underrated phase is **Preparation**: the plan, roles,
communication tree, playbooks, and tooling must exist and be **rehearsed** before a real event, because
you can't invent them mid-crisis.

### Containment, eradication, recovery

- **Containment** stops the bleeding. **Short-term**: isolate affected hosts (pull from the network),
  block malicious IPs/accounts — quickly, without destroying evidence. **Long-term**: temporary fixes
  that let business continue while you prepare a clean rebuild. **Don't tip off** an active attacker
  before you're ready to remove them everywhere at once.
- **Eradication** removes the threat: delete malware, disable compromised accounts, close the exploited
  vulnerability (Lesson 18), and rebuild from known-good images rather than "cleaning" a possibly
  rootkitted host.
- **Recovery** restores systems to normal — from **trusted backups** — and **monitors closely** for the
  attacker's return, confirming the environment is clean before declaring the incident over.

### Communication and roles

Incidents are as much about people as technology. A plan names an **incident commander**, technical
responders, and **communications** (legal, PR, management, and — where required — customers and
regulators). Many jurisdictions have **breach-notification** obligations (Lesson 23), and honest, timely
disclosure is both an ethical and often legal duty. Decide communication channels in advance (and assume
your normal systems may be compromised).

### Digital forensics foundations

**Digital forensics** is collecting and analyzing evidence to understand what happened — and to support
possible legal action. A few principles are essential even for non-specialists:

- **Preserve evidence; don't alter it.** Investigating on the live system can overwrite the very traces
  you need. Work from **forensic copies (images)**, and record cryptographic **hashes** to prove the
  copy is unchanged (integrity, Lesson 5).
- **Order of volatility.** Collect the most **ephemeral** data first, because it disappears soonest:

```text
 Most volatile  ->  CPU registers/cache  ->  RAM (running processes, keys)
                 ->  network state/connections  ->  disk  ->  logs/backups/archives
 Least volatile
```

  If you power off a machine to "secure it," you lose everything in **RAM** — sometimes the only place
  evidence (like encryption keys or fileless malware) lives.

- **Chain of custody.** Document **who** collected each piece of evidence, **when**, **how**, and every
  transfer of custody. An unbroken, documented chain is what makes evidence trustworthy and admissible;
  a gap can invalidate it.

### Learn from it

The **post-incident review** ("lessons learned"/retrospective) is where an incident pays dividends: what
happened, how it was detected, what worked, what didn't, and which **concrete improvements** (a missing
control, a slow step, a gap in logging) will be made. Conduct it **blamelessly** so people share the
truth. The output updates Preparation — closing the loop.

# Key Terminology

- **Event vs incident** — any observable occurrence vs one that jeopardizes CIA.
- **IR lifecycle** — Preparation → Detection & Analysis → Containment/Eradication/Recovery → Post-Incident.
- **Containment / eradication / recovery** — stop spread / remove threat / restore from trusted backups.
- **Incident commander** — the person coordinating the response.
- **Digital forensics** — collecting and analyzing evidence of what happened.
- **Order of volatility** — collect the most ephemeral evidence first (RAM before disk).
- **Chain of custody** — documented record of who handled evidence, when, and how.
- **Post-incident review** — blameless lessons-learned that drives improvements.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Readiness | Improvise during the incident | Prepared, rehearsed plan | Prepare and rehearse; you can't build a plan mid-crisis. |
| Containment speed | Immediately power off | Isolate but preserve state | Isolate from the network while preserving RAM/evidence, unless active harm forces a shutdown. |
| Eradication | Clean the infected host | Rebuild from known-good | Rebuild from trusted images — you can't be sure a compromised host is fully clean. |
| Evidence handling | Investigate live | Image + hash + chain of custody | Work from forensic copies with documented custody to keep evidence valid. |

# Worked Example

A SIEM alert (from Lesson 16) indicates a server compromise. Run the lifecycle:

```text
Detection & Analysis:  confirm it's real; scope which systems/accounts/data.
Containment (short):   isolate the server from the network (keep it powered for
                       RAM); disable the abused account; block the C2 IP.
Forensics:             image RAM then disk; hash the images; start a chain-of-
                       custody log (who/what/when).
Eradication:           patch the exploited vulnerability; remove persistence;
                       rotate exposed credentials/keys.
Recovery:              rebuild from known-good images; restore data from clean
                       backups; monitor closely for re-entry before "all clear."
Post-incident:         blameless review -> "detection was slow; add logging on X;
                       segment Y" -> update the plan.
```

Notice containment **isolates without powering off** (to preserve RAM evidence) and recovery **rebuilds**
rather than trusts the compromised host — two decisions that inexperienced responders often get wrong.

# Real World Analogy

Incident response is a building's **fire plan**. You don't design escape routes while the building
burns — you **prepare and drill** beforehand (Preparation). When smoke appears, you **confirm the fire
and its size** (Detection), **close fire doors to stop it spreading** (Containment), **put it out**
(Eradication), and **repair and reopen** (Recovery). Meanwhile, **fire investigators preserve the
scene** — they don't bulldoze it — to learn the cause (**forensics, chain of custody**). Afterward, the
review updates the fire plan so next time is safer.

# Examples

## Example 1 — Basic: isolate, don't power off (yet)

A responder's instinct is to shut down a hacked laptop. But doing so wipes **RAM**, which may hold the
malware (fileless) and encryption keys. Instead they **disconnect it from the network** to contain it
while **capturing memory first**, preserving evidence.

**Why this works:** the order of volatility says the most ephemeral evidence (RAM) must be captured
before it's lost.

## Example 2 — Real-world: rebuild beats "clean"

After a server breach, the team is tempted to delete the malware and move on. Because a rootkit could
hide, they instead **rebuild from a known-good image**, patch the entry point, and restore data from
**clean backups** — regaining genuine trust in the system.

**Why this works:** you can't prove a compromised host is fully clean; rebuilding removes that
uncertainty.

## Example 3 — Pitfall: broken chain of custody

Evidence from an incident is copied around on shared drives with no record of who touched it or when.
When the case goes to lawyers, the evidence is challenged and can't be relied on — the technical facts
were real, but the **handling** wasn't defensible.

**Why this bites:** without a documented, unbroken chain of custody, even genuine evidence may be
worthless.

# Common Mistakes

- **No prepared, rehearsed plan** — improvising during the crisis.
- **Powering off systems** and destroying volatile evidence (RAM) unnecessarily.
- **Tipping off an active attacker** with clumsy, partial containment.
- **"Cleaning" a compromised host** instead of rebuilding from known-good.
- **Skipping the blameless post-incident review**, so the same gap recurs.

# Best Practices

- **Prepare**: write and **rehearse** the IR plan, define roles and communications, keep playbooks and
  tooling ready.
- **Contain** quickly while **preserving evidence**; **isolate** before you power off.
- **Eradicate** by fixing the root cause and **rebuilding from trusted images**; rotate exposed secrets.
- **Recover** from **clean backups** and monitor for re-entry before declaring closure.
- Follow **forensic discipline** (image + hash, order of volatility, chain of custody) and run a
  **blameless** lessons-learned that updates the plan.

# Summary

- Prevention fails eventually; a prepared, practiced **incident response** limits damage and preserves
  evidence.
- The **NIST lifecycle** runs **Preparation → Detection & Analysis → Containment/Eradication/Recovery →
  Post-Incident**, looping back to improve — and **Preparation** is the phase you can't skip.
- **Contain** while preserving evidence, **eradicate** by rebuilding from known-good, and **recover**
  from **trusted backups** with close monitoring.
- **Forensics** rests on **preserving evidence**, the **order of volatility** (RAM before disk), and an
  unbroken **chain of custody**; a **blameless review** turns the incident into lasting improvement.

# Flash Cards

Q: What is the difference between a security event and a security incident?
A: An event is any observable occurrence; an incident is an event (or series) that actually or imminently jeopardizes the confidentiality, integrity, or availability of systems or data.

Q: What are the phases of the NIST incident-response lifecycle?
A: Preparation; Detection and Analysis; Containment, Eradication, and Recovery; and Post-Incident Activity (lessons learned) — repeating, with lessons feeding back into preparation.

Q: Why isn't the eradication step usually "clean the infected machine"?
A: A compromised host may hide persistence (e.g. a rootkit) you can't be sure you've removed, so the safe practice is to rebuild from a known-good image and restore data from clean backups.

Q: What is the order of volatility and why does it matter?
A: The sequence for collecting evidence from most to least ephemeral (registers/cache, RAM, network state, disk, archives); the most volatile data (like RAM) must be captured first or it's lost — e.g. powering off destroys memory evidence.

Q: What is chain of custody and why is it important?
A: A documented record of who collected and handled each piece of evidence, when, and how; an unbroken chain is what makes evidence trustworthy and legally admissible, while a gap can invalidate it.

Q: Why should the post-incident review be blameless?
A: So people share what really happened without fear; honest analysis surfaces the true gaps and produces concrete improvements, whereas blame drives the truth underground and the same failures recur.

# Exercises

### Easy
List the four NIST incident-response phases in order and write one action you'd take in each for a
malware infection on a laptop.

### Medium
Explain why a responder should isolate a compromised server from the network but capture its memory
before powering it off. Reference the order of volatility.

### Challenging
Write a one-page incident-response playbook for a ransomware incident: detection signals, containment
steps (preserving evidence), eradication, recovery from backups, communication/notification
considerations, and the lessons-learned questions you'd ask afterward.

# Further Reading

- NIST SP 800-61 — *Computer Security Incident Handling Guide*: <https://csrc.nist.gov/pubs/sp/800/61/r3/final>
- SANS — *Incident Handler's Handbook (PICERL)*: <https://www.sans.org/white-papers/33901/>
- NIST SP 800-86 — *Guide to Integrating Forensic Techniques into Incident Response*: <https://csrc.nist.gov/pubs/sp/800/86/final>
- CISA — *Incident Response*: <https://www.cisa.gov/topics/cyber-threats-and-advisories/incident-detection-response>
