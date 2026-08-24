---
id: lesson-23
slug: governance-risk-and-compliance
title: "Governance, Risk, and Compliance"
level: advanced
order: 23
duration: 19
tags:
  - governance
  - risk-management
  - compliance
  - frameworks
  - privacy
summary: "The management side of security — governance through policies and clear ownership, structured risk management (assess, then treat by mitigating, transferring, avoiding, or accepting), and the frameworks and privacy laws (NIST CSF, ISO 27001, SOC 2, PCI DSS, GDPR) that shape programs — plus why compliance is a floor, not the same as being secure."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **governance**: policies, standards, procedures, and ownership.
- Run a basic **risk-management** cycle and choose a **risk treatment**.
- Identify major **frameworks and regulations** and what each is for.
- Distinguish **privacy** from **security** and name core data-protection ideas.
- Explain why **compliance is a floor, not the same as security**.

# Why It Matters

Technical controls don't run themselves — they need **direction, priorities, and accountability**. That's
**governance, risk, and compliance (GRC)**: the management layer that decides *what* to protect, *how
much* risk is acceptable, and *which rules* apply. It's how a scattered set of controls becomes a
coherent **security program** (the subject of the capstone, Lesson 24). NIST added a **Govern** function
to its framework precisely because everything else depends on it.

# Concept Explanation

### Governance

**Governance** is the system of direction and accountability for security: leadership sets objectives,
assigns ownership (often a **CISO**), allocates resources, and measures results. It's expressed as a
document hierarchy:

```text
 Policy      WHAT and WHY   "All data must be encrypted in transit and at rest."
 Standard    specific rules "Use TLS 1.2+ and AES-256."
 Procedure   step-by-step   "How to request and install a TLS certificate."
 Guideline   recommended    "Prefer automated certificate renewal."
```

Good governance makes security a **business function with an owner and a budget**, not an afterthought.
The **Govern** function in **NIST CSF 2.0** sits at the center, informing Identify, Protect, Detect,
Respond, and Recover.

### Risk management

Since you can't eliminate all risk, you **manage** it deliberately:

1. **Identify** assets and the risks to them (Lessons 1–2, 17).
2. **Assess** each risk by **likelihood × impact** and rank them.
3. **Treat** each risk by choosing one of four responses:
   - **Mitigate (reduce)** — add controls to lower likelihood or impact (the usual choice).
   - **Transfer (share)** — shift risk to another party (insurance, outsourcing).
   - **Avoid** — stop the risky activity entirely.
   - **Accept** — consciously accept a risk within your **risk appetite**, documented.
4. **Monitor** and review continuously.

Whatever remains after controls is **residual risk**, which leadership must knowingly accept. Risks and
their treatments are tracked in a **risk register**.

### Frameworks and regulations

Organizations use established **frameworks** so they don't invent a program from scratch, and must meet
**regulations** that apply to them:

- **NIST Cybersecurity Framework (CSF) 2.0** — a flexible, voluntary framework organized around six
  functions: **Govern, Identify, Protect, Detect, Respond, Recover**. A common program backbone.
- **ISO/IEC 27001** — an international standard for an **Information Security Management System (ISMS)**;
  organizations can be **certified** against it.
- **SOC 2** — an audit report on a service provider's controls against the **Trust Services Criteria**
  (security, availability, processing integrity, confidentiality, privacy); common for SaaS vendors.
- **PCI DSS** — mandatory security requirements for anyone handling **payment card** data.
- **HIPAA** — protects health information in the U.S.
- **GDPR** — the EU's data-protection **law** (see privacy, below).

Frameworks are **maps, not guarantees** — they organize the work you learned in earlier lessons.

### Privacy vs security

**Security** protects data from unauthorized access and harm; **privacy** governs the **appropriate
collection and use** of **personal data** — you can be secure yet still misuse data, and privacy
requires security to work. Core privacy ideas (reflected in **GDPR** and similar laws):

- **Data minimization** — collect only what you need.
- **Purpose limitation** — use data only for the stated purpose.
- **Individual rights** — access, correction, deletion of one's data.
- **Breach notification** — inform regulators/affected people within required timeframes (GDPR: without
  undue delay, and to the authority generally within **72 hours**).
- **Accountability** — be able to demonstrate compliance.

Protecting **personal data (PII)** is both a security and a legal obligation (recall Lesson 16: don't
over-log PII).

### Third-party risk and awareness

Your risk includes your **vendors and suppliers** (supply chain, Lesson 22) — assess them, since their
breach can become yours. And because people are a top attack vector (Lesson 8), **security awareness
training** and a healthy **security culture** are governance responsibilities, not optional extras.

### Compliance is a floor, not a ceiling

Passing an audit means you met a **baseline** on a given day — it is **not proof of security**. Attackers
don't care whether you're compliant. Aim for **genuine risk reduction**; treat compliance as a minimum to
clear, and beware the **checkbox trap** of doing the paperwork while real risks go unaddressed.

# Key Terminology

- **GRC** — governance, risk, and compliance: the management layer of security.
- **Policy / standard / procedure / guideline** — what/why, specific rules, steps, recommendations.
- **Risk treatment** — mitigate, transfer, avoid, or accept a risk.
- **Risk appetite / residual risk** — how much risk you'll accept / what remains after controls.
- **Risk register** — the record of risks and their treatments.
- **NIST CSF 2.0** — framework of Govern, Identify, Protect, Detect, Respond, Recover.
- **ISO 27001 / SOC 2 / PCI DSS / HIPAA / GDPR** — ISMS standard / controls audit / card data / U.S.
  health / EU data-protection law.
- **Privacy** — appropriate collection and use of personal data (distinct from security).

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Program basis | Invent your own | Adopt a framework (CSF/ISO) | Adopt a framework and tailor it; don't reinvent the structure. |
| Risk response | Mitigate everything | Treat per risk appetite | Match treatment to risk and appetite; accept documented low risks. |
| Goal | Pass the audit | Reduce real risk | Reduce real risk; compliance is a floor, not the objective. |
| Data collection | Collect all you can | Data minimization | Minimize — less personal data means less risk and easier compliance. |

# Worked Example

A growing SaaS company sets up basic GRC:

```text
Governance:  leadership names a security owner; publishes policies (data
             protection, access control, incident response) with standards and
             procedures beneath them. Adopts NIST CSF 2.0 as the backbone.
Risk:        builds a risk register; for each risk, records likelihood x impact
             and a treatment, e.g.:
               - Ransomware  -> MITIGATE (backups, EDR, MFA) + TRANSFER (cyber
                                insurance) ; residual risk ACCEPTED by leadership.
               - Legacy app  -> AVOID (retire it) rather than keep patching.
Compliance:  needs SOC 2 for customers and GDPR for EU users -> maps existing
             controls to each, closes gaps, and treats them as a MINIMUM.
Privacy:     data minimization; documents lawful basis; a breach-notification
             procedure meeting the required timeframe.
People:      annual security-awareness training; vendor risk assessments.
```

Notice the program **decides and documents** — owners, risk choices, and residual risk that leadership
knowingly accepts. That's governance turning controls into a managed program.

# Real World Analogy

GRC is the **management of a building's safety**, above the individual locks and alarms.
**Governance** is the owner setting the safety **rules and budget** and appointing a safety officer.
**Risk management** is deciding which hazards to fix now, which to insure against, and which to accept
(you won't rebuild the whole block over a tiny risk). **Compliance** is passing the **fire inspection** —
necessary, but a building can pass inspection and still burn if the culture ignores safety between visits.
And **privacy** is respecting who's allowed to know what about the tenants, separate from keeping the
doors locked.

# Examples

## Example 1 — Basic: choosing a risk treatment

A company faces the risk of laptop theft exposing data. They **mitigate** with full-disk encryption
(Lesson 15) and **transfer** residual financial risk with insurance. The small remaining risk is
formally **accepted** by management and recorded in the risk register.

**Why this works:** naming the treatment makes the decision explicit and accountable, not accidental.

## Example 2 — Real-world: privacy is not just security

A firm stores customer data securely (encrypted, access-controlled) but quietly sells it to advertisers
without consent. They have decent **security** but a serious **privacy** violation — and legal exposure
under laws like GDPR.

**Why this works (as a lesson):** security and privacy are different obligations; you need both.

## Example 3 — Pitfall: the compliance checkbox trap

A company passes a compliance audit and declares itself "secure," then stops improving. Months later an
attacker exploits a risk the checklist never covered. The certificate on the wall didn't stop the breach.

**Why this bites:** compliance is a point-in-time floor; real security is continuous risk management
(Lesson 1).

# Common Mistakes

- **No clear ownership** — security with no accountable leader or policy.
- **Treating risk informally** — no register, no explicit accept/mitigate decisions.
- **Confusing compliance with security** — passing an audit ≠ being secure.
- **Ignoring privacy** — securing data while misusing it, or over-collecting PII.
- **Forgetting third-party and human risk** in the program.

# Best Practices

- **Establish governance**: named ownership, clear **policies/standards/procedures**, and leadership
  support; adopt a framework like **NIST CSF 2.0** or **ISO 27001**.
- **Manage risk explicitly**: assess by likelihood × impact, choose a **treatment**, record **residual
  risk** accepted by leadership, and review regularly.
- **Meet applicable regulations** (GDPR, PCI DSS, HIPAA, SOC 2) but treat them as a **minimum**.
- **Respect privacy**: minimize data, limit purpose, honor rights, and plan breach notification.
- **Include people and vendors**: awareness training and third-party risk assessment.

# Summary

- **GRC** is the management layer that gives security **direction, prioritization, and accountability**;
  **governance** sets policy and ownership (NIST CSF 2.0's **Govern** function).
- **Risk management** assesses risks (likelihood × impact) and **treats** them by **mitigating,
  transferring, avoiding, or accepting** — tracking **residual risk** in a **risk register**.
- **Frameworks** (NIST CSF, ISO 27001, SOC 2, PCI DSS) organize the program; **GDPR** and privacy law add
  data-protection duties distinct from security.
- **Compliance is a floor, not the goal** — real, continuous **risk reduction** is.

# Flash Cards

Q: What is the difference between a policy, a standard, and a procedure?
A: A policy states what must be done and why (high-level); a standard gives the specific rules (e.g. TLS 1.2+, AES-256); a procedure gives the step-by-step instructions to carry it out.

Q: What are the four ways to treat a risk?
A: Mitigate (reduce it with controls), transfer (share it, e.g. insurance), avoid (stop the risky activity), or accept (consciously accept it within your risk appetite and document it).

Q: What are the six functions of the NIST Cybersecurity Framework 2.0?
A: Govern, Identify, Protect, Detect, Respond, and Recover — with Govern (added in 2.0) informing the other five.

Q: How does privacy differ from security?
A: Security protects data from unauthorized access and harm; privacy governs the appropriate collection and use of personal data — you can be secure yet still misuse data, and privacy depends on security.

Q: Why is compliance not the same as security?
A: Compliance means meeting a baseline set of requirements at a point in time; attackers don't care about audits, and real security requires continuous risk management beyond any checklist.

Q: What is residual risk?
A: The risk that remains after controls have been applied; it must be consciously accepted (or further treated) by leadership within the organization's risk appetite and recorded.

# Exercises

### Easy
Write a one-line security policy, then a standard and a procedure that would implement it (for example,
about passwords or encryption).

### Medium
Take three risks for a small company (ransomware, laptop theft, a risky legacy app) and assign each a
treatment (mitigate/transfer/avoid/accept) with a one-sentence justification. Note any residual risk.

### Challenging
Pick a framework (NIST CSF 2.0 or ISO 27001) and a regulation relevant to a business you imagine (GDPR,
PCI DSS, or HIPAA). Explain what each requires at a high level, how they relate, and one way the business
could be compliant yet still insecure. Cite the framework/regulation source.

# Further Reading

- NIST — *Cybersecurity Framework (CSF) 2.0*: <https://www.nist.gov/cyberframework>
- ISO/IEC 27001 — *Information security management systems*: <https://www.iso.org/standard/27001>
- European Commission — *General Data Protection Regulation (GDPR)*: <https://gdpr.eu/> (official text: <https://eur-lex.europa.eu/eli/reg/2016/679/oj>)
- NIST SP 800-30 / 800-37 — *Risk assessment / Risk Management Framework*: <https://csrc.nist.gov/projects/risk-management>
