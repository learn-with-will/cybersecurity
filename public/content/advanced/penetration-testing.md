---
id: lesson-19
slug: penetration-testing
title: "Penetration Testing and Ethical Hacking"
level: advanced
order: 19
duration: 20
tags:
  - penetration-testing
  - ethical-hacking
  - authorization
  - methodology
  - reporting
summary: "What authorized penetration testing is and — first and foremost — the legal authorization and scope that separate it from a crime, plus the phases of an engagement from reconnaissance to reporting, the types of tests, and why the written report of findings, not the exploit, is the real deliverable."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State why **written authorization and scope** are the foundation of any test.
- Describe the **phases** of a penetration test.
- Distinguish **black/grey/white box** tests and **red teaming** vs a **pen test**.
- Explain how pen testing complements **vulnerability scanning**.
- Explain why the **report** is the deliverable that creates value.

# Why It Matters

A **penetration test** proves whether vulnerabilities are *actually exploitable* and how far an attacker
could get — depth that automated scanning (Lesson 18) can't provide. But the same actions, without
permission, are **crimes**. The professional discipline of ethical hacking is defined less by technical
skill than by **authorization, scope, and ethics**. This lesson teaches the framework and mindset from a
**defender's** point of view: how tests are run legally, and how their findings make systems stronger.

> **Ground rule for this entire lesson:** only ever test systems you **own** or have **explicit,
> written authorization** to test. Everything below assumes that authorization exists. Practice on
> legal, intentionally vulnerable targets (labs you run, or platforms that grant permission), never on
> systems that aren't yours.

# Concept Explanation

### Authorization comes first

Before any technical work, ethical hacking requires **explicit, written permission** from the system
owner. This isn't a formality — it's the line between a security service and a computer-crime offense
under laws such as the U.S. **Computer Fraud and Abuse Act**, the UK **Computer Misuse Act**, and
equivalents worldwide. A proper engagement establishes:

- **Scope** — exactly which systems, addresses, and applications are in and out of bounds.
- **Rules of Engagement (RoE)** — allowed techniques, testing windows, data-handling rules, and what to
  do if something breaks or real attacker activity is found.
- **Authorization document** ("get-out-of-jail-free letter") — signed proof the testing is sanctioned.
- **Contacts and safety** — who to call, and limits to avoid outages or harm.

Sticking to scope and RoE is non-negotiable; stepping outside them is both unethical and illegal.

### The phases of a test

Most methodologies (e.g. **PTES**, the **OWASP WSTG** for web, or the classic **cyber kill chain**
lens) follow the same arc:

```text
 1. Reconnaissance    gather public info about the target (in scope only)
 2. Scanning/Enum     map hosts, ports, services, and versions (Lesson 4, 18)
 3. Gaining access    safely demonstrate exploitation of a real weakness
 4. Post-exploitation assess impact: what data/systems are reachable? (no harm)
 5. Reporting         document findings, evidence, risk, and fixes
 6. Remediation retest confirm the fixes actually work
```

Reconnaissance and scanning are the same techniques defenders use to understand their own attack surface
(Lesson 2). The middle phases *demonstrate* impact carefully and reversibly — a professional avoids
causing outages or touching data they don't need to.

### Types of tests

- **Black box** — the tester knows nothing up front (simulates an outside attacker).
- **White box** — full knowledge (architecture, source), for thorough coverage.
- **Grey box** — partial knowledge (e.g. a normal user account) — a common, efficient middle ground.
- **External vs internal** — attacking from the internet vs from an assumed foothold inside.

Related but distinct engagements:

- **Vulnerability assessment** — breadth: enumerate weaknesses (mostly scanning, Lesson 18).
- **Penetration test** — depth: exploit and chain specific weaknesses to prove impact.
- **Red team** — goal-oriented, stealthy, adversary-simulation against people, process, and tech
  (tests **detection and response**, not just vulnerabilities). The **blue team** defends; **purple
  teaming** has them collaborate.
- **Bug bounty** — crowdsourced testing under a published authorization/scope (safe-harbor) policy.

### Tools, used only within scope

Professionals use recon and testing tools — for example **Nmap** (host/port discovery), **Burp Suite**
(web proxy), **Metasploit** (exploitation framework), and password-auditing tools — **exclusively**
against authorized targets. Knowing they exist matters to defenders too, because attackers use the same
ones. Example of a benign, in-scope discovery step against a host you own:

```bash
# Discover which services a HOST YOU OWN exposes (same as a defender's audit).
nmap -sV 192.0.2.10        # 192.0.2.x is a documentation/test range
# -> lists open ports and service versions to review and harden.
```

### The report is the product

The exploit is not the deliverable — the **report** is. A good report gives, for each finding: a clear
description, **reproduction steps**, **evidence**, a **risk rating** (impact + likelihood), and, most
importantly, **concrete remediation guidance**. Findings are prioritized so the owner fixes the most
dangerous issues first, and a **retest** confirms the fixes. Value is created when vulnerabilities get
**fixed**, not when they're found.

# Key Terminology

- **Penetration test** — an authorized, simulated attack to find and prove exploitable weaknesses.
- **Scope / Rules of Engagement** — what may be tested, how, and when.
- **Authorization letter** — signed proof the testing is sanctioned.
- **Reconnaissance / enumeration** — gathering info / mapping services on in-scope targets.
- **Black / grey / white box** — no / partial / full prior knowledge.
- **Red team / blue team / purple team** — adversary simulation / defenders / the two collaborating.
- **Bug bounty** — crowdsourced testing under a published authorization policy.
- **Retest** — re-checking that reported issues were actually fixed.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Prerequisite | Start testing | Get written authorization + scope | Always authorization first — without it, testing is illegal. |
| Knowledge given | Black box | White box | White/grey for coverage and value per hour; black box to simulate an outsider realistically. |
| Engagement type | Vulnerability scan | Penetration test / red team | Scan for breadth/continuous; pen test for exploitable depth; red team to test detection & response. |
| Deliverable focus | The exploit | The report + remediation | The report — fixes create the value; the exploit is only evidence. |

# Worked Example

Setting up an engagement properly, before any packets fly:

```text
1. Authorization: signed contract naming the client, the tester, and dates;
   a signed "authorization to test" letter the tester can produce on demand.
2. Scope:      IN  -> app.example.com, 192.0.2.0/24 (their range)
               OUT -> third-party services, production payment processor, staff
                      personal devices.
3. Rules of Engagement: test window 20:00-02:00; no denial-of-service; stop and
   report immediately if real attacker activity or sensitive data is found;
   emergency contact provided.
4. Only then: recon -> enumerate -> carefully demonstrate impact -> REPORT with
   reproduction steps, risk ratings, and fixes -> retest after remediation.
```

The technical testing is bounded on all sides by the paperwork in steps 1–3. That structure is what
makes it *ethical hacking* rather than an intrusion.

# Real World Analogy

An ethical hacker is like a **hired locksmith who tests a building's security** — but only after the
owner signs a work order specifying **which doors** to try and **when**. The locksmith picks the locks
to *prove* they're weak, then writes a **report**: "the back door lock can be bypassed; here's how, and
here's the stronger lock to install." Doing the exact same lock-picking on a stranger's house — with no
work order — is **burglary**. The signed authorization and scope are what separate the professional from
the criminal, even though the hands-on skill looks identical.

# Examples

## Example 1 — Basic: scope keeps testing legal and safe

A tester is authorized for `app.example.com` but notices an interesting-looking `partner.other.com`.
Because it's **out of scope** (and owned by a third party), they don't touch it — they note it and ask
the client. Respecting scope avoids both legal exposure and collateral damage.

**Why this works:** authorization is specific; "interesting" is not permission.

## Example 2 — Real-world: a chain scanners missed

Automated scans rated an app "low risk." A pen tester chains a minor information leak with a weak
password reset to take over an account — a real, high-impact path that no single scanner finding
captured. The report shows the chain and how to break it.

**Why this works:** human testers find exploitable **combinations**; that depth is the point of pen
testing.

## Example 3 — Pitfall: "I was just curious" on a live site

Someone runs a scanner against a company's website without permission "to see if it's secure." Even with
no damage and good intentions, that unauthorized access can be a **crime** and can trigger the company's
incident response. Curiosity is not authorization.

**Why this bites:** legality depends on **permission**, not intent or outcome — always get written
authorization, or use a legal practice lab.

# Common Mistakes

- **Testing without explicit written authorization** or **outside the agreed scope**.
- **Ignoring Rules of Engagement** (timing, no-DoS, data handling, stop conditions).
- **Causing outages or accessing more data than needed** to prove a point.
- **Treating the exploit as the goal** instead of clear, actionable reporting.
- **Skipping the retest**, so "fixed" findings are never confirmed.

# Best Practices

- **Get signed authorization and a precise scope** before any testing; keep the letter to hand.
- **Follow the Rules of Engagement**; minimize impact and data access; stop and report surprises.
- Use a **recognized methodology** (PTES, OWASP WSTG) for consistent coverage.
- Practice **only on systems you own or are permitted to test** (personal labs, sanctioned platforms).
- Deliver a **prioritized report with reproduction steps and fixes**, then **retest**.

# Summary

- A **penetration test** is an **authorized** simulated attack that proves whether weaknesses are
  exploitable — its legitimacy rests entirely on **written authorization, scope, and Rules of
  Engagement**.
- Engagements follow phases — **recon → enumeration → careful exploitation → post-exploitation →
  reporting → retest** — and come in **black/grey/white box** flavors; **red teaming** also tests
  detection and response.
- Pen testing (**depth**) complements vulnerability scanning (**breadth**).
- The **report and remediation**, not the exploit, are the real deliverable — value comes from
  **fixing** what's found.

# Flash Cards

Q: What single thing must exist before any penetration testing begins, and why?
A: Explicit written authorization from the system owner (with defined scope) — without it, the same actions are illegal under computer-crime laws; authorization is what makes the work ethical hacking.

Q: What are Rules of Engagement in a penetration test?
A: The agreed constraints — allowed techniques, testing windows, data-handling rules, and what to do if something breaks or real attacker activity is found — that keep the test safe and lawful.

Q: How do black box, grey box, and white box tests differ?
A: Black box gives the tester no prior knowledge (like an outside attacker), white box gives full knowledge (architecture/source) for thorough coverage, and grey box gives partial knowledge such as a normal user account.

Q: How does a penetration test differ from a red team engagement?
A: A pen test finds and proves exploitable vulnerabilities in a scoped target; a red team runs a stealthy, goal-oriented adversary simulation that also tests the organization's detection and response.

Q: Why is the report, not the exploit, the real deliverable of a pen test?
A: Value is created only when vulnerabilities get fixed; the report provides prioritized findings, reproduction steps, evidence, risk ratings, and remediation guidance that let the owner actually improve security.

Q: How does penetration testing complement vulnerability scanning?
A: Scanning gives automated breadth across many known issues; pen testing adds skilled, manual depth that chains weaknesses to demonstrate real, exploitable impact scanners miss.

# Exercises

### Easy
List the four things an engagement must define before testing starts (authorization, scope, rules of
engagement, contacts) and write one example of each for a fictional client.

### Medium
Explain, using the phases of a pen test, how a tester would go from "knows nothing" to a written finding
for a web app — and identify which phase produces the value for the client.

### Challenging
Set up a **legal** practice lab you control (e.g. a local intentionally-vulnerable app such as OWASP
Juice Shop, or an authorized training platform). Define your own scope and rules, find one vulnerability,
and write a short professional finding with reproduction steps, a risk rating, and a fix. Do not test any
system you don't own or aren't authorized to test.

# Further Reading

- OWASP — *Web Security Testing Guide (WSTG)*: <https://owasp.org/www-project-web-security-testing-guide/>
- NIST SP 800-115 — *Technical Guide to Information Security Testing and Assessment*: <https://csrc.nist.gov/pubs/sp/800/115/final>
- Penetration Testing Execution Standard (PTES): <http://www.pentest-standard.org/>
- OWASP — *Vulnerable web applications for legal practice* (e.g. Juice Shop): <https://owasp.org/www-project-juice-shop/>
