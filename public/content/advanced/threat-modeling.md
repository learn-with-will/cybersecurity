---
id: lesson-17
slug: threat-modeling
title: "Threat Modeling"
level: advanced
order: 17
duration: 20
tags:
  - threat-modeling
  - stride
  - secure-design
  - data-flow-diagram
  - risk
summary: "How to find security flaws in a design before they're built — the four questions of threat modeling, the STRIDE framework for categorizing threats, data-flow diagrams and trust boundaries, attack trees, and how to prioritize the threats you find into concrete mitigations."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what **threat modeling** is and when to do it.
- Run the **four-question** threat-modeling framework.
- Apply **STRIDE** to categorize threats to a system.
- Draw a **data-flow diagram** with **trust boundaries**.
- **Prioritize** threats and turn them into mitigations.

# Why It Matters

The cheapest vulnerability to fix is one you catch in the **design**, before any code is written —
"**Insecure Design**" is its own OWASP category (**A04:2021**). **Threat modeling** is the structured
way to ask "what could go wrong?" early and deliberately, instead of discovering it in production. It
ties together everything you've learned: assets and threats (Lesson 2), principles (Lesson 3), and the
specific attacks (Lessons 9–16), applied to *your* design.

# Concept Explanation

### What threat modeling is

**Threat modeling** is a structured activity to identify, prioritize, and address the threats to a
system **while it's being designed or changed**. It's a thinking process, not a tool — a team looks at a
design and reasons systematically about how an attacker could abuse it, then decides what to do. Do it
early (design), and revisit it when the architecture changes significantly.

### The four questions

Adam Shostack's widely used framing reduces threat modeling to **four questions**:

```text
 1. What are we building?         -> model the system (diagram it)
 2. What can go wrong?            -> enumerate threats (e.g. with STRIDE)
 3. What are we going to do about it? -> decide mitigations
 4. Did we do a good job?         -> review and validate
```

Everything else is technique for answering these. Question 1 is usually a **diagram**; question 2 is
often driven by **STRIDE**.

### STRIDE: categorizing threats

**STRIDE** is a mnemonic for six threat categories, each the violation of a security property:

```text
 Threat                     Violates            Example
 ------------------------   -----------------   ------------------------------
 Spoofing                   Authentication      pretending to be another user
 Tampering                  Integrity           altering data in transit/at rest
 Repudiation                Non-repudiation     denying an action, no audit trail
 Information disclosure     Confidentiality     leaking data to the unauthorized
 Denial of service          Availability        overwhelming or crashing a service
 Elevation of privilege     Authorization       gaining rights you shouldn't have
```

For each component and data flow, ask "how could each STRIDE threat apply here?" It maps neatly onto the
CIA triad and the auth concepts from earlier lessons, so it prompts you to consider threats you might
otherwise miss.

### Data-flow diagrams and trust boundaries

A **data-flow diagram (DFD)** models the system as **processes**, **data stores**, **external
entities**, and the **data flows** between them — and, crucially, the **trust boundaries** they cross
(Lesson 9). Threats concentrate where data crosses a boundary (untrusted → trusted).

```text
 [User] --request--> || --> (Web App) --query--> || --> [Database]
        (browser)   trust        (server)       trust
                  boundary                     boundary
   ^ Spoofing/Tampering here      ^ Injection / Info disclosure here
```

Drawing the boundaries makes the "where do I need checks?" answer visible.

### Attack trees

An **attack tree** breaks a goal into the ways to achieve it, refining down to concrete steps — useful
for reasoning about a specific high-value target:

```text
 Goal: read another user's messages
 ├─ OR Steal their session      (XSS -> cookie theft; sniff plaintext)
 ├─ OR Exploit access control   (IDOR on /messages/{id})
 └─ OR Compromise the server    (unpatched vuln; weak admin creds)
```

Each leaf suggests a mitigation and a place to test.

### Prioritizing and mitigating

Not every threat deserves equal effort — prioritize by **risk** (likelihood × impact, Lesson 1). For
each significant threat, choose a response:

- **Mitigate** — add a control (the usual choice: parameterize, authenticate, encrypt, rate-limit).
- **Eliminate** — remove the risky feature entirely.
- **Transfer** — shift the risk (e.g. use a managed service, insurance).
- **Accept** — consciously accept a low risk, and document why.

(Older schemes like **DREAD** exist for scoring but are criticized as subjective; a simple risk-based
ranking is usually enough.) The **output** of threat modeling is a prioritized list of threats with
mitigations assigned — feeding directly into design and the secure SDLC (Lesson 22).

# Key Terminology

- **Threat modeling** — structured identification and mitigation of threats to a design.
- **Four questions** — building? / what goes wrong? / what to do? / did we do well?
- **STRIDE** — Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege.
- **Data-flow diagram (DFD)** — processes, stores, entities, flows, and trust boundaries.
- **Trust boundary** — where data crosses from less to more trusted; threats concentrate here.
- **Attack tree** — a goal decomposed into attack paths and steps.
- **Mitigate / eliminate / transfer / accept** — the four responses to a risk.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| When | After launch (pen test) | During design | During design — flaws are cheapest to fix before they're built (A04). |
| Method | Ad hoc brainstorming | Structured (STRIDE) | Structured coverage catches categories brainstorming forgets. |
| Scope | Model everything perfectly | Focus on trust boundaries | Focus effort where data crosses boundaries and on high-value assets. |
| Risk response | Mitigate everything | Prioritize by risk | Prioritize; accept documented low risks rather than gold-plating. |

# Worked Example

Threat-model a simple "upload and share a file" feature using the four questions:

```text
1. What are we building?
   [User] -> (Upload API) -> [Object storage]; (Share link) -> [Any viewer]

2. What can go wrong? (STRIDE at each boundary)
   Spoofing:   attacker uploads as someone else            -> require auth
   Tampering:  file altered in transit                     -> TLS (Lesson 12)
   Repudiation:no record of who uploaded/shared            -> audit logging (16)
   Info disc.: share links guessable -> anyone reads files -> unguessable tokens,
                                                              access checks (7)
   DoS:        huge/many uploads exhaust storage           -> size/rate limits
   EoP:        viewer escalates to admin of the file       -> authorization checks

3. What will we do? -> the mitigations above, prioritized by risk.
4. Did we do a good job? -> review the model, verify each mitigation is built/tested.
```

The exercise surfaced a serious flaw (guessable share links = information disclosure) **before** a line
of code shipped — exactly the point.

# Real World Analogy

Threat modeling is like an **architect reviewing blueprints before construction**. Instead of building
the house and discovering the front door opens into a cliff, the architect walks the plans asking "where
could someone break in? where could water get in? where's the fire exit?" (**STRIDE**), marks the
property lines and entry points (**trust boundaries**), and fixes the design on paper — vastly cheaper
than fixing a finished building.

# Examples

## Example 1 — Basic: STRIDE finds a missing control

Reviewing a login design with STRIDE, a team realizes there's no protection against **Repudiation** —
no audit log of authentication events. They add security logging (Lesson 16) so account activity is
recorded and disputes can be resolved.

**Why this works:** the category prompt ("could someone deny an action?") surfaced a gap plain
brainstorming skipped.

## Example 2 — Real-world: a trust boundary reveals injection risk

Drawing the DFD, a developer sees user input crossing from the browser into a database query with no
boundary check. That's the classic injection setup (Lesson 10). They assign the mitigation
(parameterized queries) during design, not after a breach.

**Why this works:** boundaries visually pinpoint where untrusted data becomes dangerous.

## Example 3 — Pitfall: modeling only the "happy path"

A team models how the feature is *supposed* to be used and declares it safe — but never asks how an
attacker would *misuse* it. They miss that share links are sequential integers. Threat modeling means
thinking like the attacker, not just documenting the intended flow.

**Why this bites:** a threat model that ignores abuse cases gives false confidence.

# Common Mistakes

- **Skipping it until after launch**, when fixes are expensive.
- **Only modeling the happy path** instead of abuse cases.
- **Treating it as a one-time document** rather than revisiting on major changes.
- **Enumerating threats but never assigning mitigations or owners.**
- **Over-scoping** — trying to model everything instead of focusing on trust boundaries and key assets.

# Best Practices

- Threat-model **during design** and whenever the architecture changes materially.
- Use the **four questions** and a structured method like **STRIDE** for coverage.
- **Diagram the system** and mark **trust boundaries**; focus effort where data crosses them.
- **Prioritize by risk** and choose an explicit response (mitigate/eliminate/transfer/accept).
- Record threats **with owners and mitigations**, and verify they're built and tested.

# Summary

- **Threat modeling** finds design flaws early by asking, structurally, what can go wrong — addressing
  OWASP **A04: Insecure Design**.
- The **four questions** (building? / what goes wrong? / what to do? / did we do well?) frame the work;
  **STRIDE** gives coverage across six threat categories mapped to security properties.
- **Data-flow diagrams** with **trust boundaries** show where threats concentrate; **attack trees**
  reason about specific targets.
- **Prioritize by risk** and turn each threat into a **mitigation** — the model's real output.

# Flash Cards

Q: What are the four questions of threat modeling?
A: What are we building? What can go wrong? What are we going to do about it? And did we do a good job? — model, enumerate threats, mitigate, then review.

Q: What does each letter of STRIDE stand for?
A: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege — each violating a security property (auth, integrity, non-repudiation, confidentiality, availability, authorization).

Q: Why are trust boundaries the focus of a data-flow diagram?
A: Threats concentrate where data crosses from a less-trusted to a more-trusted zone (e.g. browser to server), so boundaries show exactly where authentication, authorization, and validation are needed.

Q: When in the development lifecycle should threat modeling happen, and why?
A: During design (and on major changes), because flaws caught on paper are far cheaper to fix than ones discovered in production — addressing insecure design (OWASP A04).

Q: What are the four possible responses to an identified risk?
A: Mitigate (add a control), eliminate (remove the risky feature), transfer (shift the risk), or accept (consciously accept and document a low risk).

Q: What is an attack tree?
A: A diagram that decomposes an attacker's goal into the alternative paths and concrete steps to achieve it, helping you reason about a specific target and where to add defenses.

# Exercises

### Easy
Pick a simple feature (a comment box, a password reset). Write the first two threat-modeling questions'
answers: a one-line description of what it does and two things that could go wrong.

### Medium
Draw a data-flow diagram for a login feature, mark the trust boundaries, and apply STRIDE to list one
threat in each of at least four categories with a mitigation for each.

### Challenging
Build an attack tree for the goal "take over a user's account" on an app you know. Include at least
three top-level paths, refine one to concrete steps, and assign a mitigation to each leaf. Prioritize
which path you'd defend first and justify it by risk.

# Further Reading

- OWASP — *Threat Modeling* and *Threat Modeling Cheat Sheet*: <https://owasp.org/www-community/Threat_Modeling>
- Microsoft — *The STRIDE Threat Model*: <https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats>
- Adam Shostack — *Threat Modeling: Designing for Security* (the four questions): <https://shostack.org/resources/threat-modeling>
- OWASP — *Top 10 (2021) A04: Insecure Design*: <https://owasp.org/Top10/A04_2021-Insecure_Design/>
