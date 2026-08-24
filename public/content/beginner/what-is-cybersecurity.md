---
id: lesson-01
slug: what-is-cybersecurity
title: "What Is Cybersecurity?"
level: beginner
order: 1
duration: 15
tags:
  - foundations
  - cia-triad
  - risk
  - threats
  - overview
summary: "What cybersecurity actually is — protecting the confidentiality, integrity, and availability of information — plus the vocabulary of assets, threats, vulnerabilities, and risk, why security is a continuous process rather than a product, and an honest look at what it can and cannot promise."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **cybersecurity** in plain language and what it protects.
- Name and use the **CIA triad**: confidentiality, integrity, availability.
- Tell apart **asset**, **threat**, **vulnerability**, **risk**, and **exploit**.
- Describe why security is a **process**, using **defense in depth**.
- Give an **honest** account of what security can and cannot guarantee.

# Why It Matters

Almost everything you rely on — your bank, your messages, your hospital's records, the power grid —
runs on computers and networks. That makes those systems worth attacking, and it makes protecting
them everyone's problem, not just an IT department's. Before you touch a single tool, you need the
**map**: what "secure" even means, and the words professionals use to reason about it. Every later
lesson — networks, cryptography, web attacks, incident response — is a detailed tour of one region on
this map.

# Concept Explanation

### What cybersecurity is

**Cybersecurity** is the practice of protecting systems, networks, programs, and data from digital
attack, damage, or unauthorized access. The goal is not to make a system impossible to attack (that
is unachievable) but to make attacks **hard, expensive, and detectable** enough that your assets stay
protected against the threats you actually face.

Security is always about a **trade-off**. Perfect security would mean a computer that is turned off,
encased in concrete, and unusable. Real security balances protection against **cost, usability, and
performance**.

### The CIA triad

The three classic goals of security are remembered as the **CIA triad** (nothing to do with the
agency):

```text
        Confidentiality
              /\
             /  \
            /    \
           /  CIA \
          /        \
   Integrity ---- Availability
```

- **Confidentiality** — information is seen only by those authorized to see it. Broken by a data
  leak. Protected by encryption and access control.
- **Integrity** — information is accurate and has not been tampered with. Broken by an attacker
  altering a bank balance. Protected by hashes, digital signatures, and checks.
- **Availability** — information and services are usable when needed. Broken by a ransomware attack
  or a flood of traffic (denial of service). Protected by backups, redundancy, and capacity.

Every control you will ever learn serves one or more of these three. Some sources add
**authenticity** and **non-repudiation** (you cannot deny an action you took), but CIA is the core.

### Assets, threats, vulnerabilities, and risk

Security has a precise vocabulary. Confusing these words leads to muddled thinking:

- An **asset** is something worth protecting — data, a server, a reputation.
- A **vulnerability** is a weakness that could be used to harm an asset — an unpatched bug, a weak
  password, an untrained employee.
- A **threat** is a potential cause of harm — a criminal group, a careless insider, a flood.
- A **threat actor** is the specific entity behind a threat (a person, group, or program).
- An **exploit** is the specific technique or code that takes advantage of a vulnerability.
- **Risk** is the combination of how *likely* a threat is to hit a vulnerability and how *bad* the
  impact would be: informally, **risk ≈ likelihood × impact**.

You reduce risk by removing vulnerabilities (patching), reducing likelihood (blocking access), or
reducing impact (backups, encryption).

### Security is a process, not a product

You cannot buy a box that makes you "secure." Attackers adapt, software changes, and people make
mistakes, so security is a **continuous cycle**: identify what you have, protect it, detect problems,
respond, and recover — then repeat. This is the shape of the **NIST Cybersecurity Framework**
(Identify, Protect, Detect, Respond, Recover, and — in CSF 2.0 — Govern).

Because any single control can fail, defenders layer many independent controls so that if one is
bypassed, another still stands. This is **defense in depth**, and you will see it everywhere.

# Key Terminology

- **Cybersecurity** — protecting systems and data from digital attack, loss, or unauthorized access.
- **CIA triad** — confidentiality, integrity, availability; the three core security goals.
- **Asset** — anything of value worth protecting.
- **Vulnerability** — a weakness that could be exploited.
- **Threat / threat actor** — a potential cause of harm / the entity behind it.
- **Exploit** — the technique or code that uses a vulnerability.
- **Risk** — likelihood × impact of a threat meeting a vulnerability.
- **Defense in depth** — layering independent controls so one failure isn't total.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Security posture | Lock everything down | Keep everything open | Neither — match controls to the **risk** to each asset; over-locking hurts usability, under-locking invites harm. |
| Where to spend effort | Prevent every attack | Detect and respond fast | You need both: prevention reduces incidents, detection limits the damage of the ones that get through. |
| Password vs. usability | Very long, rotated often | Simple, never changed | Prefer long passphrases + MFA over forced frequent rotation (NIST SP 800-63B); usable security is used security. |

# Worked Example

Suppose you want to secure your personal **email account**. Map it to the CIA triad:

```text
Asset:          Your email account and its contents.
Confidentiality: Only you should read your mail  → strong unique password + MFA.
Integrity:       No one should send mail as you or alter it → MFA, signed messages.
Availability:    You must be able to log in when needed → recovery codes, backup email.

Threat actor:   A criminal running an automated password-guessing bot.
Vulnerability:  A weak, reused password.
Exploit:        Credential stuffing (trying leaked passwords).
Risk reduction: Unique password (removes the vulnerability) + MFA (cuts likelihood
                of success even if the password leaks).
```

Notice that one asset needs **all three** goals, and that a single good control (MFA) helps with
several at once.

# Real World Analogy

Think of securing a **house**. The **assets** are the people and valuables inside. A **vulnerability**
is an unlocked window; a **threat** is a burglar; the **risk** depends on both how likely a burglar is
and how much you'd lose. You don't rely on one lock — you use a door lock, a fence, lights, and an
alarm (**defense in depth**), so that if the fence is jumped, the alarm still trips. And you never
believe the house is "unburglable" — you just make it a harder, riskier target than the next one.

# Examples

## Example 1 — Basic: classifying a control

A hospital encrypts patient records so only doctors can read them, keeps checksums to detect
tampering, and stores nightly backups. Encryption serves **confidentiality**, checksums serve
**integrity**, and backups serve **availability** — one system, all three goals of the CIA triad.

**Why this works:** naming which goal each control serves makes gaps obvious (here, nothing is
missing).

## Example 2 — Real-world: a breach mapped to CIA

A company suffers a ransomware attack: files are encrypted by the attacker and a ransom is demanded.
The primary loss is **availability** (staff can't reach their files). If the attackers also copied the
data before encrypting it ("double extortion"), **confidentiality** is lost too. Good **backups**
would have restored availability without paying.

**Why this works:** the same incident touches multiple CIA goals; mapping them tells you what to fix.

## Example 3 — Pitfall: security theater

An office installs an impressive-looking badge reader at the front door — but props the door open all
day and never patches its servers. The badge reader creates a *feeling* of security while the real
risk (unpatched, internet-facing systems) is ignored.

**Why this bites:** "**security theater**" spends effort on visible controls that don't reduce the
actual risk. Always tie a control back to a real threat and asset.

# Common Mistakes

- **Treating security as a product you buy once.** It's an ongoing process of identify → protect →
  detect → respond → recover.
- **Confusing threat, vulnerability, and risk.** They're different; risk needs both a weakness *and*
  a likely threat *and* meaningful impact.
- **Chasing 100% security.** Impossible; aim to manage risk to an acceptable level for each asset.
- **Ignoring availability.** Confidentiality gets attention, but an offline hospital is a security
  failure too.

# Best Practices

- Start by listing your **assets** and the **threats** that actually matter to them.
- Apply **defense in depth** — never depend on a single control.
- Prefer controls that **reduce impact** (backups, encryption) alongside those that prevent attacks.
- Assume breaches will happen and plan to **detect and respond**, not just prevent.
- Match effort to **risk**: spend the most where likelihood and impact are highest.

# Summary

- **Cybersecurity** protects the **confidentiality, integrity, and availability** (CIA) of systems
  and data.
- The core vocabulary — **asset, vulnerability, threat, exploit, risk** — lets you reason clearly;
  **risk ≈ likelihood × impact**.
- Security is a **continuous process** (identify, protect, detect, respond, recover), not a one-time
  purchase.
- **Defense in depth** layers independent controls so a single failure isn't catastrophic.
- Be **honest**: you manage risk, you don't eliminate it.

# Flash Cards

Q: What do the three letters of the CIA triad stand for?
A: Confidentiality (only the authorized can see data), Integrity (data is accurate and untampered), and Availability (data and services are usable when needed).

Q: What is the difference between a vulnerability and a threat?
A: A vulnerability is a weakness that could be exploited; a threat is a potential cause of harm (such as an attacker) that might exploit it.

Q: In one line, what is risk?
A: The combination of how likely a threat is to exploit a vulnerability and how large the impact would be — informally, risk ≈ likelihood × impact.

Q: Why is security called a process rather than a product?
A: Attackers, software, and people constantly change, so security is a continuous cycle of identify, protect, detect, respond, and recover — you can't buy it once and be done.

Q: What is defense in depth?
A: Layering multiple independent controls so that if one is bypassed, another still protects the asset.

Q: What is "security theater"?
A: Visible controls that create a feeling of security without reducing the real risk, while actual weaknesses go unaddressed.

# Exercises

### Easy
Pick a device or account you use daily. Write one sentence each for how its confidentiality,
integrity, and availability could be lost.

### Medium
For that same account, list one asset, one plausible threat actor, one vulnerability, and one control
that would reduce the risk. Say whether your control reduces likelihood, impact, or both.

### Challenging
Find a news story about a recent security incident. Identify which CIA goals were harmed, name the
vulnerability that was exploited (if reported), and propose one defense-in-depth control that might
have limited the damage. Note any place the reporting was too vague to be sure.

# Further Reading

- NIST — *Cybersecurity Framework (CSF) 2.0*: <https://www.nist.gov/cyberframework>
- NIST Computer Security Resource Center — *Glossary* (asset, threat, vulnerability, risk): <https://csrc.nist.gov/glossary>
- IETF RFC 4949 — *Internet Security Glossary, Version 2*: <https://www.rfc-editor.org/rfc/rfc4949>
- Ross Anderson — *Security Engineering* (3rd ed.), ch. 1: <https://www.cl.cam.ac.uk/~rja14/book.html>
