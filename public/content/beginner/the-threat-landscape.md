---
id: lesson-02
slug: the-threat-landscape
title: "The Threat Landscape"
level: beginner
order: 2
duration: 17
tags:
  - threats
  - threat-actors
  - attack-surface
  - risk
  - vulnerabilities
summary: "Who attacks systems and why — the main kinds of threat actors and their motivations — plus the ideas of attack surface and attack vector, how a weakness becomes an incident, and how frameworks like MITRE ATT&CK and identifiers like CVE help defenders describe and track threats."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the common **threat actors** and their **motivations**.
- Define **attack surface** and **attack vector** and shrink the first.
- Trace the chain from **vulnerability** to **exploit** to **incident**.
- Explain what **MITRE ATT&CK**, **CVE**, and **CWE** are for.
- Distinguish a **zero-day** from an ordinary known vulnerability.

# Why It Matters

You can't defend against an enemy you can't describe. Knowing *who* might attack, *why*, and *how*
turns vague anxiety into concrete decisions: which assets to protect first, which weaknesses to close,
and what to watch for. This lesson gives you the "know your enemy" half of security — the counterpart
to the CIA goals from Lesson 1. It also introduces the shared language (ATT&CK, CVE) that lets
defenders around the world compare notes.

# Concept Explanation

### Threat actors and their motivations

Attackers are not all the same. Their skill, resources, and goals differ, and that changes how you
defend:

- **Script kiddies** — low-skill attackers running tools others wrote, usually opportunistically and
  for bragging rights.
- **Cybercriminals** — organized, financially motivated groups behind ransomware, fraud, and data
  theft. The largest everyday threat to most organizations.
- **Hacktivists** — attackers pursuing a political or social cause (defacement, leaks, disruption).
- **Insiders** — employees or contractors who misuse legitimate access, whether **malicious** (theft,
  sabotage) or **negligent** (a mistake, a lost laptop). Hard to stop because they start *inside*.
- **Advanced Persistent Threats (APTs)** — well-funded, patient, skilled groups (often
  nation-state-linked) targeting specific organizations for espionage or strategic sabotage.

Common **motivations** are money, espionage (stealing secrets), ideology, revenge, and simple
curiosity. Matching your defenses to the actors you realistically face is called **threat modeling**
(covered in depth in Lesson 17).

### Attack surface and attack vectors

Your **attack surface** is the sum of all the points where an attacker could try to get in or get
data out — every open port, web form, API, USB slot, employee inbox, and third-party integration.

An **attack vector** is a specific path an attacker uses, such as a phishing email, a vulnerable web
form, or a stolen password.

A core defensive move is to **reduce the attack surface**: turn off services you don't use, close
unneeded ports, remove old accounts, and limit what's exposed to the internet. Less surface means
fewer vectors to defend.

### From weakness to incident

Incidents follow a chain you already met in Lesson 1:

```text
Vulnerability  →  Exploit        →  Compromise     →  Impact
(a weak point)    (technique that   (attacker gains    (data stolen,
                   uses it)          a foothold)        service down)
```

Attacks rarely stop at the first step. After an initial foothold, attackers often **escalate
privileges**, **move laterally** to other systems, and work toward their goal (exfiltrating data,
deploying ransomware). Understanding this progression is what lets defenders detect an attack *in the
middle*, not just at the door.

### Shared language: ATT&CK, CVE, CWE

Defenders use standard references so everyone means the same thing:

- **MITRE ATT&CK** — a public, curated knowledge base of the **tactics** (the attacker's goals, e.g.
  "Initial Access", "Persistence") and **techniques** (how they achieve them) seen in real attacks. It
  gives teams a common map of adversary behavior.
- **CVE (Common Vulnerabilities and Exposures)** — a unique **identifier** for one specific,
  publicly known vulnerability in a product (for example, an ID like `CVE-YYYY-NNNNN`). It is a name,
  not a score.
- **CWE (Common Weakness Enumeration)** — a catalog of **types** of weakness (e.g. "SQL Injection",
  "Improper Authentication"). A CVE is a specific instance; a CWE is the category it belongs to.
- **CVSS** — a separate 0–10 **severity score** you'll meet in Lesson 18.

### Zero-days

A **zero-day** vulnerability is one that is unknown to the vendor (or has no patch available yet), so
defenders have had "zero days" to fix it. A **zero-day exploit** attacks such a flaw before a fix
exists. Zero-days are valuable and dangerous precisely because normal patching can't help — which is
why defense in depth and detection matter even when everything is "up to date."

# Key Terminology

- **Threat actor** — the person, group, or program behind an attack.
- **APT** — an advanced, persistent, well-resourced adversary, often nation-state-linked.
- **Insider threat** — misuse of legitimate access, malicious or accidental.
- **Attack surface** — all the points an attacker could target.
- **Attack vector** — a specific path used to attack.
- **Privilege escalation / lateral movement** — gaining more rights / spreading to other systems.
- **MITRE ATT&CK** — a knowledge base of adversary tactics and techniques.
- **CVE / CWE** — identifier for one vulnerability / category of weakness type.
- **Zero-day** — a vulnerability with no available patch yet.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Threat focus | Defend against everyone equally | Prioritize by likely actors | Prioritize: a small shop faces cybercriminals and phishing, not APTs — spend where the real risk is. |
| Attack surface | Expose services for convenience | Minimize what's reachable | Minimize by default; expose only what's needed and monitor it. |
| Insider risk | Trust all staff fully | Least privilege + logging | Least privilege and logging — trust people, but limit blast radius and keep an audit trail. |

# Worked Example

A small online store asks: *"Who realistically attacks us, and how?"*

```text
Likely actors:   Cybercriminals (card fraud, ransomware); opportunistic script kiddies.
Unlikely actors: Nation-state APTs (no strategic value here).

Attack surface:  The public website + checkout, the admin login, staff email,
                 a third-party payment plugin.
Likely vectors:  Phishing staff for the admin password; exploiting an outdated
                 plugin; credential stuffing the admin login.

Surface reduction: Remove unused plugins, restrict admin login by MFA + IP,
                   train staff on phishing, keep software patched.
```

By naming *plausible* actors and vectors, the store spends its limited effort where it counts instead
of worrying about everything at once.

# Real World Analogy

Think of a **shop**. Burglars (cybercriminals) want the till; a disgruntled ex-employee (insider) has
a key; a protest group (hacktivists) might spray the windows; a professional crew casing the place for
months (APT) is rare but serious. The **attack surface** is every door, window, vent, and the back
alley; an **attack vector** is the specific unlocked window someone climbs through. You reduce risk by
having fewer unlocked openings and watching the ones you must keep.

# Examples

## Example 1 — Basic: actor to motivation

A ransomware gang encrypts a company's files and demands payment. The actor is a **cybercriminal**
group; the motivation is **financial**. Knowing this tells the defender that **reliable backups**
(removing the payment leverage) are a top priority.

**Why this works:** the motivation points straight at the most valuable defense.

## Example 2 — Real-world: shrinking the attack surface

An admin finds an old, forgotten test server exposed to the internet running outdated software. It has
nothing to do with the business but is a live **attack vector**. Shutting it down removes an entire
avenue of attack at zero cost to operations.

**Why this works:** the cheapest security win is often deleting something you no longer need.

## Example 3 — Pitfall: "we're too small to be a target"

A tiny nonprofit assumes no one would bother attacking it, so it skips patching and MFA. But most
attacks are **automated and opportunistic** — bots scan the whole internet for known weaknesses,
indifferent to who owns the system. The nonprofit is compromised by a script hitting an unpatched flaw.

**Why this bites:** you don't have to be *chosen* to be hit; being *reachable and vulnerable* is
enough.

# Common Mistakes

- **Assuming attackers are all elite.** Most damage comes from automated, opportunistic attacks and
  simple phishing, not movie-style hackers.
- **Forgetting insiders.** Access misuse and honest mistakes cause a large share of incidents.
- **Leaving unused services running.** Every forgotten server or port is attack surface.
- **Confusing CVE with severity.** A CVE is an identifier; the severity is a separate CVSS score.

# Best Practices

- **Know your likely adversaries** and prioritize defenses accordingly (threat modeling).
- **Minimize the attack surface**: disable, remove, and restrict by default.
- **Apply least privilege and logging** to limit and reveal insider misuse.
- **Patch known vulnerabilities promptly**, since most attacks reuse public ones.
- **Watch for mid-attack behavior** (privilege escalation, lateral movement), not just the front door.

# Summary

- Threat actors range from **script kiddies** to **cybercriminals**, **hacktivists**, **insiders**,
  and **APTs**, each with different skill and motives.
- Your **attack surface** is everything an attacker could target; an **attack vector** is a specific
  path — shrink the surface to cut the vectors.
- Attacks progress from **vulnerability → exploit → compromise → impact**, often via privilege
  escalation and lateral movement.
- **MITRE ATT&CK**, **CVE**, and **CWE** give defenders a shared language; a **zero-day** is a flaw
  with no patch yet.

# Flash Cards

Q: What is an Advanced Persistent Threat (APT)?
A: A well-funded, skilled, patient adversary — often nation-state-linked — that targets a specific organization over time for espionage or strategic sabotage.

Q: What is the difference between an attack surface and an attack vector?
A: The attack surface is all the points an attacker could target; an attack vector is one specific path they actually use to get in.

Q: Why are insider threats especially hard to defend against?
A: Insiders already have legitimate access, so they start inside your defenses; harm can be malicious (theft, sabotage) or accidental (mistakes, lost devices).

Q: What is the difference between a CVE and a CWE?
A: A CVE is a unique identifier for one specific publicly known vulnerability in a product; a CWE names the general category (type) of weakness it belongs to.

Q: What does MITRE ATT&CK provide?
A: A public knowledge base of the tactics (attacker goals) and techniques (how they achieve them) observed in real attacks, giving defenders a shared map of adversary behavior.

Q: What makes a zero-day dangerous?
A: It is a vulnerability with no available patch, so ordinary patching can't stop it — defenders must rely on layered controls and detection.

# Exercises

### Easy
List three different threat actors and write one realistic motivation for each.

### Medium
For a system you know (a personal site, a home network, a small business), sketch its attack surface:
list every point exposed to the outside, then mark one you could remove or restrict today.

### Challenging
Pick one MITRE ATT&CK tactic (e.g. "Initial Access") from <https://attack.mitre.org/> and describe, in
defender's terms, one technique under it and one control that would detect or block it. Keep it
defensive — focus on how you'd *notice* the behavior.

# Further Reading

- MITRE ATT&CK — *Enterprise Matrix*: <https://attack.mitre.org/>
- MITRE — *CVE Program*: <https://www.cve.org/> and *CWE*: <https://cwe.mitre.org/>
- CISA — *Known Exploited Vulnerabilities Catalog*: <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
- Verizon — *Data Breach Investigations Report (DBIR)* overview: <https://www.verizon.com/business/resources/reports/dbir/>
