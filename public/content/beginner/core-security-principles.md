---
id: lesson-03
slug: core-security-principles
title: "Core Security Principles"
level: beginner
order: 3
duration: 18
tags:
  - principles
  - least-privilege
  - defense-in-depth
  - zero-trust
  - design
summary: "The timeless design principles that good security is built on — defense in depth, least privilege, fail-safe defaults, separation of duties, complete mediation, open design, and zero trust — where they come from, and how each one shapes the concrete controls in the rest of the course."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Apply **defense in depth** and **least privilege** to real decisions.
- Explain **fail-safe defaults**, **complete mediation**, and **separation of duties**.
- State why **open design** beats "security through obscurity".
- Summarize **zero trust** and how it differs from perimeter security.
- Recognize these principles inside later, concrete controls.

# Why It Matters

Tools and attacks change every year, but the *principles* behind good security have barely changed
since the 1970s. If you learn the principles, you can evaluate any new technology or design and ask
the right questions — instead of memorizing a list of products. Most of the classic principles come
from a 1975 paper by **Saltzer and Schroeder**, and modern frameworks (NIST, zero trust) are
refinements of the same ideas. Everything concrete you learn later is one of these principles made
real.

# Concept Explanation

### Defense in depth

**Defense in depth** means using **multiple, independent layers** of protection so that no single
failure exposes the asset. A firewall *and* patched software *and* least-privilege accounts *and*
monitoring: if an attacker beats one, the next still stands. The layers should fail independently —
two locks with the same key are one layer, not two.

### Least privilege

**Least privilege** means every user, process, and system gets **only the access it needs to do its
job — no more**. A web server that only reads files shouldn't have database-admin rights. When an
account is compromised, least privilege limits the **blast radius**: the attacker inherits only that
account's narrow rights.

A close relative is **need-to-know**: people see only the data relevant to their task.

### Fail-safe (fail-secure) defaults

When something goes wrong or is unspecified, the **default should be to deny**. Access is granted by
explicit permission, not withheld by explicit denial. If an authorization check errors out, the safe
outcome is "no access," not "allow." A door that unlocks when the power fails is *fail-safe for
people* but *fail-open for security* — you must choose deliberately.

### Complete mediation

**Every** access to a protected resource must be **checked**, every time — not just the first time,
and not cached in a way an attacker can bypass. If a user's permission is revoked, the next request
should feel it. Skipping the check "because we already checked" is a common source of broken access
control.

### Separation of duties and defense against single points

**Separation of duties** splits a sensitive action so no single person can complete it alone — the
person who requests a payment can't also approve it. It defends against both fraud and mistakes.
Related ideas are **two-person control** for critical operations and avoiding a single point of
failure in general.

### Open design (no security through obscurity)

The security of a system should rest on the secrecy of **keys**, not the secrecy of the **design**.
This is **Kerckhoffs's principle**: a cryptosystem should be secure even if everything about it except
the key is public. Hiding how something works ("**security through obscurity**") may slow an attacker
slightly but is not a real defense — designs leak, and secret designs rarely get the scrutiny that
finds their flaws. Obscurity can be a *minor extra layer*, never the foundation.

### Economy of mechanism and psychological acceptability

- **Economy of mechanism** — keep security mechanisms **as simple as possible**. Complexity hides
  bugs; simple designs are easier to verify.
- **Psychological acceptability** — if security is too annoying, people bypass it. Controls people can
  actually live with (a password manager, single sign-on) get used; painful ones get sticky notes.

### Zero trust

Traditional security trusted anything **inside** the network perimeter ("castle-and-moat"). **Zero
trust** rejects that: **never trust, always verify.** Every request is authenticated, authorized, and
encrypted based on identity and context, regardless of where it comes from — as if there is no trusted
inside. NIST describes this in **SP 800-207**. Zero trust is a direct application of least privilege
and complete mediation to modern, perimeter-less networks (cloud, remote work).

# Key Terminology

- **Defense in depth** — multiple independent layers of protection.
- **Least privilege** — only the access needed, nothing more.
- **Fail-safe default** — deny by default when in doubt or on error.
- **Complete mediation** — check every access, every time.
- **Separation of duties** — no single person can complete a sensitive action alone.
- **Open design / Kerckhoffs's principle** — security rests on secret keys, not secret designs.
- **Security through obscurity** — relying on hidden design; weak as a primary defense.
- **Zero trust** — never trust by location; authenticate and authorize every request.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Default access | Allow unless denied | Deny unless allowed | Deny by default (fail-safe) — safer and easier to reason about. |
| Design secrecy | Hide the design | Publish it, protect keys | Publish/assume-known and protect keys (open design); secret designs give false confidence. |
| Perimeter model | Trust the internal network | Verify every request (zero trust) | Zero trust for modern, distributed systems; the "inside" is no longer safe. |
| Mechanism | Feature-rich and complex | Minimal and simple | Simpler is more verifiable (economy of mechanism); complexity hides flaws. |

# Worked Example

You're designing access for a company's internal wiki. Apply the principles:

```text
Least privilege:     Editors edit their team's pages; everyone else reads.
Fail-safe default:   Unknown/expired users get NO access, not read access.
Complete mediation:  Every page load re-checks the user's current permission.
Separation of duties: Publishing a company-wide policy needs a second approver.
Open design:         Use a well-known, reviewed auth library — don't invent one.
Defense in depth:    Login + MFA + network restriction + audit logs.
Zero trust:          A request from the office network is verified the same as one
                     from a café — location grants nothing.
```

Each line is one principle turned into a concrete rule; together they make a system that degrades
gracefully instead of collapsing at the first mistake.

# Real World Analogy

Think of a **bank**. There isn't one safeguard — there's a locked door, a vault, cameras, guards, and
tellers with limited access (**defense in depth**). A teller can open a drawer but not the vault
(**least privilege**). Large transfers need two officers (**separation of duties**). The vault's
security doesn't depend on hiding that it's a vault — it depends on the **combination** being secret
(**open design**). And a person in a suit who *looks* like they belong still has to show ID
(**zero trust**).

# Examples

## Example 1 — Basic: least privilege in a service account

An application only needs to *read* from its database, so its account is granted read-only access.
When attackers later steal that account's credentials, they can read data but **cannot delete tables
or write ransomware notes** — the damage is capped by the narrow permission.

**Why this works:** least privilege turns a full compromise into a limited one.

## Example 2 — Real-world: zero trust for remote work

A company moves to remote work. Instead of a VPN that trusts anyone "inside," it verifies each
request by user identity, device health, and MFA for every app. A stolen laptop alone can't reach
internal systems, because location and network no longer confer trust.

**Why this works:** zero trust matches a world where there is no safe "inside."

## Example 3 — Pitfall: security through obscurity

A team hides an admin page at `/secret-admin-9x` with no login, assuming no one will guess the URL. A
routine scan (or a leaked link, or the browser history on a shared PC) reveals it, and anyone can now
administer the site.

**Why this bites:** a hidden-but-unprotected resource is unprotected; obscurity is not access control.

# Common Mistakes

- **One strong wall, nothing behind it.** A single firewall or login is not defense in depth.
- **Over-permissioning "to avoid hassle."** Broad admin rights everywhere maximize blast radius.
- **Caching authorization forever.** Failing complete mediation lets revoked users keep access.
- **Relying on obscurity.** Secret URLs, hidden ports, and home-grown crypto are not real controls.
- **Ignoring usability.** Controls too painful to use get bypassed, which is worse than a weaker,
  used control.

# Best Practices

- **Layer independent controls** and assume each one can fail.
- **Grant the minimum access** and review it regularly; expire what's unused.
- **Deny by default**; make "allow" the explicit, checked exception.
- **Use open, reviewed designs and libraries**; keep only keys secret.
- **Design for people** — pair strong controls (MFA) with usable tools (password managers, SSO).

# Summary

- The classic principles — **defense in depth, least privilege, fail-safe defaults, complete
  mediation, separation of duties, open design, economy of mechanism, psychological acceptability** —
  come mostly from Saltzer & Schroeder and still hold.
- **Open design** beats **security through obscurity**: protect keys, not the blueprint.
- **Zero trust** (NIST SP 800-207) applies least privilege and complete mediation to networks with no
  trusted "inside."
- Later concrete controls are these principles made real; learn the principles and you can evaluate
  any new tool.

# Flash Cards

Q: What does the principle of least privilege say, and what does it limit?
A: Give every user or process only the access it needs — nothing more. It limits the blast radius when an account is compromised.

Q: What is a fail-safe (fail-secure) default?
A: When in doubt or on error, deny access — permission should be granted explicitly, not withheld explicitly, so failures don't open access.

Q: What does complete mediation require?
A: That every access to a protected resource is checked every time, so revoked permissions take effect immediately and checks can't be bypassed by caching.

Q: What is Kerckhoffs's principle / open design?
A: A system should stay secure even if everything about it except the secret key is public; security must rest on keys, not on hiding the design.

Q: Why is "security through obscurity" a weak primary defense?
A: Hidden designs and secret URLs leak, get less expert scrutiny, and provide no real access control — obscurity may add minor delay but must never be the foundation.

Q: Summarize zero trust in one line.
A: Never trust based on network location — authenticate, authorize, and encrypt every request based on identity and context, as if there is no safe inside.

# Exercises

### Easy
Write down one system you use and describe how it applies (or fails to apply) least privilege.

### Medium
Take any everyday process (approving an expense, publishing a post) and redesign it to include
separation of duties and a fail-safe default. Show the before and after.

### Challenging
Find a control you use that leans on obscurity (a hidden URL, an unlisted port, a "secret" trick).
Propose how to replace the obscurity with a real control (authentication, authorization) while keeping
the obscurity only as an optional extra layer.

# Further Reading

- Saltzer & Schroeder — *The Protection of Information in Computer Systems* (1975): <https://www.cs.virginia.edu/~evans/cs551/saltzer/>
- NIST SP 800-207 — *Zero Trust Architecture*: <https://csrc.nist.gov/pubs/sp/800/207/final>
- OWASP — *Security by Design Principles*: <https://owasp.org/www-project-developer-guide/>
- Ross Anderson — *Security Engineering* (3rd ed.), ch. 1–2: <https://www.cl.cam.ac.uk/~rja14/book.html>
