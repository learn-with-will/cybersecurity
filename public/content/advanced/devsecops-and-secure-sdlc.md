---
id: lesson-22
slug: devsecops-and-secure-sdlc
title: "DevSecOps and the Secure SDLC"
level: advanced
order: 22
duration: 20
tags:
  - devsecops
  - secure-sdlc
  - sast-dast
  - supply-chain
  - ci-cd
summary: "Building security into how software is made — the secure development lifecycle and 'shift left', the automated tests that catch flaws in a CI/CD pipeline (SAST, DAST, SCA, secret and IaC scanning), and defending the software supply chain with dependency management, SBOMs, and signed, verifiable builds."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the **secure SDLC** and what "**shift left**" means.
- Describe **DevSecOps** and security's place in **CI/CD**.
- Compare **SAST, DAST, IAST, SCA**, and **secret/IaC scanning**.
- Explain **software supply chain** risk and defenses (**SBOM**, signing).
- Use automated **guardrails** without blocking delivery.

# Why It Matters

Bolting security on at the end is slow and misses things; the cheapest, most reliable security is built
**into the development process**. **DevSecOps** integrates security into the fast, automated pipelines
teams already use, catching flaws as code is written and shipped. And because modern apps are mostly
**third-party code**, the **software supply chain** has become a top target — **Software and Data
Integrity Failures** is OWASP **A08:2021**. This lesson ties threat modeling (17) and vulnerability
management (18) into how software is actually built and deployed.

# Concept Explanation

### The secure SDLC and "shift left"

The **software development lifecycle (SDLC)** runs from requirements → design → build → test → deploy →
operate. A **secure SDLC** adds security to **every** stage rather than a single review at the end:
threat modeling in design (Lesson 17), secure coding in build, security testing in test, hardening in
deploy, monitoring in operate.

**Shift left** means moving security **earlier** (leftward) in that timeline. A flaw caught in design or
code review costs a fraction of the same flaw found in production, so the goal is to give developers fast
feedback while they're still in the code.

### DevSecOps

**DevSecOps** extends DevOps by making security a **shared responsibility** built into automated
delivery, not a gate owned by a separate team at the end. Its ideas:

- **Automate security checks** inside the **CI/CD pipeline** so every commit is tested.
- **Fast feedback** to developers (in the pull request, not weeks later).
- **Guardrails, not gates** — secure defaults and automated checks that help teams move safely, rather
  than manual bottlenecks.

### The automated testing toolbox

Different tools catch different flaws; you layer them:

```text
 Tool    Looks at              Finds                      When (pipeline)
 -----   -------------------   ------------------------   ----------------
 SAST    source code          insecure code patterns     on commit / PR
 SCA     dependencies         known-vuln libraries (CVE) on commit / build
 Secret  code + history       committed keys/passwords   on commit (pre-merge)
 IaC     infra-as-code        misconfigs (open buckets)  on commit / plan
 DAST    running app          runtime flaws (injection)  on a deployed test env
 IAST    instrumented app     runtime + code context     during testing
```

- **SAST (Static Application Security Testing)** reads source code for insecure patterns — early, but
  can be noisy (false positives).
- **DAST (Dynamic …)** attacks a **running** app from the outside — fewer false positives, later in the
  cycle, and can't see code it doesn't reach.
- **IAST** instruments the running app to combine both views.
- **SCA (Software Composition Analysis)** flags **known-vulnerable dependencies** — essential, since
  most code is third-party (Lesson 18, OWASP A06).
- **Secret scanning** catches credentials before they're merged; **IaC scanning** catches cloud
  misconfigurations (Lesson 21) in Terraform/manifests before they deploy.

No single tool is complete — SAST + SCA + DAST + secret/IaC scanning together give practical coverage.

### Software supply chain security

Your software includes code you didn't write (open-source packages) and a build pipeline that could be
tampered with. Supply-chain attacks target these — a compromised dependency or build server ships
malware to everyone downstream. Defenses:

- **Manage dependencies**: track them, **pin** versions, update promptly, and remove unused ones.
- **SBOM (Software Bill of Materials)** — a machine-readable inventory of everything in your software,
  so when a new vulnerability drops you can instantly tell if you're affected.
- **Verify integrity**: use checksums/**signatures**, and prefer **signed** artifacts and images.
- **Build provenance**: frameworks like **SLSA** describe how to make builds tamper-evident (who built
  what, from which source), so you can trust that a released artifact came from your reviewed code.
- **Secure the pipeline** itself: least-privilege CI credentials, protected branches, and no secrets in
  logs — the build system is high-value infrastructure.

### Guardrails without blocking delivery

Security must fit the pace of delivery or it gets bypassed (psychological acceptability, Lesson 3). Make
the **secure path the easy path**: hardened templates, pre-commit hooks, automated checks that fail the
build on **serious** issues while filing lower-severity ones as tickets, and clear developer feedback.
Tune tools to reduce false positives so the checks stay trusted.

# Key Terminology

- **Secure SDLC** — building security into every development stage, not just at the end.
- **Shift left** — moving security earlier in the lifecycle for cheaper, faster fixes.
- **DevSecOps** — security integrated into automated DevOps delivery as a shared responsibility.
- **SAST / DAST / IAST** — static code / dynamic running-app / instrumented testing.
- **SCA** — software composition analysis: finds known-vulnerable dependencies.
- **Secret / IaC scanning** — catching committed credentials / infra misconfigurations.
- **SBOM** — a bill of materials listing every component in your software.
- **Provenance / SLSA / signing** — tamper-evident builds and verifiable artifacts.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Timing | Security review at the end | Shift left, test continuously | Shift left — earlier flaws are far cheaper; keep a final check too. |
| Testing | One tool (e.g. SAST) | Layered SAST+SCA+DAST+secret/IaC | Layer them; each finds different classes of flaw. |
| Pipeline posture | Manual gates | Automated guardrails | Automated guardrails so security scales with delivery speed. |
| Build policy | Fail on every finding | Fail on serious, ticket the rest | Fail the build on serious issues; track minor ones to avoid alert fatigue and bypass. |

# Worked Example

Add security to a CI/CD pipeline so every change is checked automatically:

```text
 On pull request:
   - SAST scans the changed code for insecure patterns.
   - SCA checks dependencies against known CVEs (fail on Critical).
   - Secret scanning blocks any committed key/password.
   - IaC scan checks Terraform for public buckets / open security groups.
 On merge to main / build:
   - Build in a least-privilege runner; generate an SBOM.
   - Scan the container image (Lesson 21); SIGN the image.
 On deploy to a test env:
   - DAST attacks the running app for injection/XSS regressions.
 Policy: serious findings FAIL the build; lower ones become tracked tickets.
```

The developer gets security feedback in minutes, in the pull request — and only reviewed, signed,
SBOM-tracked artifacts reach production. That's shift-left DevSecOps in one pipeline.

# Real World Analogy

A secure SDLC is like **food safety built into a kitchen**, not a single inspector tasting the dish as it
leaves. Hygiene is designed into every step — **wash hands at the start** (secure design/threat
modeling), **check ingredients for spoilage** (dependency/SCA scanning), **taste and temperature-check
as you cook** (SAST/DAST in the pipeline), and keep a **list of every ingredient** for allergen recalls
(**SBOM**). And you **verify your suppliers** so nobody slips a bad ingredient into the delivery
(**supply-chain security**). Catching a problem at the prep station is far cheaper than recalling plates
from the dining room.

# Examples

## Example 1 — Basic: SCA catches a vulnerable dependency

A team adds a popular library; the **SCA** check flags that its version has a known critical CVE
(Lesson 18). The pull request fails, the developer bumps to a patched version, and the vulnerability
never reaches production — caught in minutes, not after a breach.

**Why this works:** most code is third-party, so scanning dependencies is one of the highest-value
automated checks.

## Example 2 — Real-world: SBOM turns a scramble into a query

A widely used library discloses a serious vulnerability. Because the company maintains an **SBOM** for
every service, they run one query and instantly know which of their 200 services include it — patching
the affected few instead of blindly auditing everything.

**Why this works:** an inventory of components makes "are we affected?" answerable in seconds.

## Example 3 — Pitfall: security that blocks delivery gets bypassed

A slow, noisy security scan with thousands of false positives gates every release for days. Under
pressure, teams get exemptions to skip it entirely — so it protects nothing. The tool wasn't tuned to
the pace of delivery.

**Why this bites:** security that ignores usability (Lesson 3) is routed around; guardrails must be fast
and trustworthy to be followed.

# Common Mistakes

- **Leaving security to a final gate**, when flaws are expensive and rework is huge.
- **Relying on one tool** — SAST alone misses dependency and runtime flaws.
- **Ignoring dependencies/supply chain** (no SCA, no SBOM, unpinned versions).
- **Committing secrets** or **deploying unscanned images/IaC**.
- **Making security so slow/noisy it gets bypassed** instead of tuning it into guardrails.

# Best Practices

- **Shift left**: threat-model in design, secure-code in build, and test continuously in the pipeline.
- **Layer automated checks** — SAST, SCA, DAST, and secret/IaC scanning — with fast PR feedback.
- **Secure the supply chain**: track and pin dependencies, generate **SBOMs**, and use **signed**,
  provenance-tracked (SLSA) builds.
- **Harden the pipeline**: least-privilege CI credentials, protected branches, no secrets in logs.
- **Fail on serious findings, ticket the rest**, and tune tools so guardrails stay fast and trusted.

# Summary

- A **secure SDLC** builds security into every stage; **shifting left** catches flaws early where
  they're cheapest to fix.
- **DevSecOps** integrates automated security into **CI/CD** as a shared responsibility, favoring
  **guardrails over gates**.
- Layer **SAST (code)**, **SCA (dependencies)**, **DAST (running app)**, and **secret/IaC scanning** —
  each finds different flaws.
- Defend the **software supply chain** (OWASP A08) with dependency management, **SBOMs**, **signing**,
  and build **provenance (SLSA)** — and keep security fast enough not to be bypassed.

# Flash Cards

Q: What does "shift left" mean in the secure SDLC?
A: Moving security activities earlier in the development lifecycle (design and coding) so flaws are caught sooner, where they are far cheaper and faster to fix than in production.

Q: How do SAST and DAST differ?
A: SAST analyzes source code statically for insecure patterns (early, but noisier); DAST attacks a running application from the outside to find runtime flaws (later, fewer false positives, but can't see unreached code).

Q: What does SCA (software composition analysis) do and why does it matter?
A: It scans your third-party dependencies for known-vulnerable versions (CVEs); it matters because most modern code is third-party, so vulnerable libraries are a major risk (OWASP A06).

Q: What is an SBOM and how is it useful?
A: A Software Bill of Materials — a machine-readable inventory of every component in your software; when a new vulnerability is disclosed, you can instantly tell which systems are affected.

Q: Which OWASP Top 10 (2021) category covers supply-chain and integrity risks, and name two defenses.
A: A08, Software and Data Integrity Failures; defenses include managing/pinning dependencies, generating SBOMs, and using signed artifacts with build provenance (e.g. SLSA).

Q: Why can security tooling that's too slow or noisy end up protecting nothing?
A: If checks block delivery or overwhelm developers with false positives, teams get exemptions and bypass them; security must be fast, tuned, and built as guardrails to actually be followed.

# Exercises

### Easy
Match each tool to what it inspects: SAST, DAST, SCA, secret scanning — (source code, running app,
dependencies, committed credentials).

### Medium
Design the security steps for a CI/CD pipeline: list what runs on a pull request versus at build/deploy,
and state which findings should fail the build versus become tickets. Justify the split.

### Challenging
Explain a software-supply-chain attack scenario (a compromised dependency or build step) and describe
three defenses — dependency management, SBOM, and signing/provenance — showing how each would detect or
limit it. Cite OWASP A08.

# Further Reading

- OWASP — *DevSecOps Guideline* and *SAMM* (maturity model): <https://owasp.org/www-project-devsecops-guideline/>
- OWASP — *Top 10 (2021) A08: Software and Data Integrity Failures*: <https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/>
- NIST — *Secure Software Development Framework (SSDF), SP 800-218*: <https://csrc.nist.gov/pubs/sp/800/218/final>
- SLSA — *Supply-chain Levels for Software Artifacts*: <https://slsa.dev/>
