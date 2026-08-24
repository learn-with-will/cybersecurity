---
id: lesson-07
slug: authorization-and-access-control
title: "Authorization and Access Control"
level: beginner
order: 7
duration: 19
tags:
  - authorization
  - access-control
  - rbac
  - least-privilege
  - permissions
summary: "How systems decide what an authenticated user may do — the access-control models (DAC, MAC, RBAC, ABAC), how file permissions and access-control lists work, and why broken access control is the number-one web risk, illustrated with insecure direct object references and missing permission checks."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **authorization** and how it follows authentication.
- Compare the main access-control models: **DAC, MAC, RBAC, ABAC**.
- Read basic **file permissions** and **access-control lists (ACLs)**.
- Recognize **broken access control** patterns like **IDOR**.
- Apply **least privilege** and **complete mediation** to access decisions.

# Why It Matters

Logging a user in is only half the job; the system must then decide, for **every** action, whether
that user is allowed to do it. Getting this wrong is the single most common serious web vulnerability —
**Broken Access Control** is #1 on the OWASP Top 10 (2021). A user who can change a number in a URL and
read someone else's data, or reach an admin page they shouldn't, is an access-control failure. This
lesson turns the "what are you allowed to do?" question into concrete models and checks.

# Concept Explanation

### Authorization, after authentication

**Authorization (AuthZ)** decides **what an authenticated identity may do** — which resources it can
read, write, or delete, and which actions it can perform. Authentication (Lesson 6) established *who*;
authorization enforces *permitted*. The two must both work: a perfectly authenticated user still must
be blocked from data that isn't theirs.

### Access-control models

Different systems decide permissions in different ways:

- **DAC (Discretionary Access Control)** — the **owner** of a resource decides who can access it
  (e.g., you share a file with a coworker). Flexible but easy to misconfigure. Classic file
  permissions are DAC.
- **MAC (Mandatory Access Control)** — a **central policy** (not the owner) enforces access based on
  **labels** like "Secret" / "Top Secret." Rigid and used in high-security/military systems
  (SELinux is an example).
- **RBAC (Role-Based Access Control)** — permissions attach to **roles** (e.g., *editor*, *admin*),
  and users are assigned roles. The most common model in business apps: easy to manage at scale.
- **ABAC (Attribute-Based Access Control)** — decisions use **attributes** and context (user
  department, resource sensitivity, time of day, location) evaluated by a policy. Most flexible,
  supports fine-grained and zero-trust decisions.

Most real systems combine these — for example, RBAC roles refined by ABAC rules.

### Permissions and access-control lists

At the operating-system level, access is expressed as **permissions**. On Unix-like systems each file
has read (`r`), write (`w`), and execute (`x`) permissions for the **owner**, the **group**, and
**others**:

```bash
ls -l secret.txt
# -rw-r-----  1 alice  finance  1024 Jan 10 09:00 secret.txt
#  ^owner rw   ^group r  ^others (none)
# Owner alice can read/write; the finance group can read; everyone else: nothing.

chmod 640 secret.txt   # set exactly rw- r-- --- (owner rw, group r, others none)
```

A finer-grained mechanism is an **ACL (Access Control List)** — an explicit list of "who can do what"
attached to a resource (e.g., "Bob: read; Admins: read+write"). Cloud IAM policies are ACLs/policies
at scale.

### Least privilege and complete mediation, applied

Two principles from Lesson 3 govern good authorization:

- **Least privilege** — grant the **minimum** needed. Default to no access; add specific grants.
- **Complete mediation** — check the permission on **every** request, server-side, using the user's
  *current* rights. Never trust the client to hide a button; hidden isn't blocked.

### Broken access control (the #1 web risk)

**Broken access control** happens when the server fails to properly enforce who can do what. Common
patterns:

- **IDOR (Insecure Direct Object Reference)** — the app uses a user-supplied identifier to fetch a
  resource **without checking ownership**:

```http
GET /api/orders/1001   Authorization: (logged in as user A)   -> A's order (fine)
GET /api/orders/1002   Authorization: (still user A)          -> B's order! (IDOR)
```

  The fix: the server must verify that order `1002` **belongs to** the requesting user before
  returning it.

- **Missing function-level checks** — an admin action (`/admin/deleteUser`) is protected only by
  *hiding the link*, so anyone who guesses the URL can call it.
- **Privilege escalation** — a normal user manages to gain admin rights (via a missing check or a
  tampered role field).

The common cause is **trusting the client** or checking permission in only one place. Enforce
authorization **on the server, for every request, against the object actually being accessed.**

# Key Terminology

- **Authorization (AuthZ)** — deciding what an identity may do.
- **DAC / MAC** — owner-decided access / central-policy, label-based access.
- **RBAC / ABAC** — role-based / attribute-and-context-based access control.
- **Permission** — an allowed operation (read/write/execute) on a resource.
- **ACL** — an explicit list of who may do what to a resource.
- **Broken access control** — failure to enforce authorization; OWASP A01:2021.
- **IDOR** — accessing another user's object by changing an identifier, with no ownership check.
- **Privilege escalation** — gaining rights beyond those you were granted.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Model | RBAC (roles) | ABAC (attributes) | RBAC for simple, stable roles; ABAC when decisions depend on context/attributes or zero-trust. |
| Default policy | Allow, then restrict | Deny, then grant | Deny by default (fail-safe) and grant explicitly — safer and clearer. |
| Where to check | Client (hide UI) | Server (enforce) | Always enforce on the server; hiding UI is convenience, not security. |
| Object access | Trust the ID sent | Verify ownership | Verify the object belongs to the caller every time (prevents IDOR). |

# Worked Example

Design authorization for a document app with users and admins:

```text
Roles (RBAC):   viewer (read own docs), editor (read/write own docs),
                admin (manage all docs and users).
Default:        DENY — a new user has no access until a role is assigned.

Request:        DELETE /docs/42 by user "editor Bob"
Checks (server):
  1. Authenticated? (Lesson 6)  -> yes, Bob.
  2. Does doc 42 belong to Bob? -> ownership check (blocks IDOR).
  3. Does Bob's role allow delete? -> editor may delete OWN docs -> allowed.
Admin action DELETE /users/9 by Bob -> role check fails (not admin) -> 403.
```

Every request re-checks identity, ownership, and role **on the server** — that's least privilege plus
complete mediation in practice.

# Real World Analogy

Think of a **hotel key card**. Reception **authenticates** you at check-in; the card then
**authorizes** you — it opens *your* room and the gym, but not other guests' rooms or the manager's
office (**RBAC**: your "guest" role). If the door lock only checked that you had *a* card, not that it
was keyed to *this* room, anyone could open any door — that's **IDOR**. And hiding the manager's office
behind an unmarked door (but leaving it unlocked) is a **missing function-level check**.

# Examples

## Example 1 — Basic: reading Unix permissions

`-rw-r-----` on a payroll file means the owner can read/write, the group can read, and everyone else
gets nothing. If someone accidentally runs `chmod 644` (adding read for "others"), the whole system's
users can now read payroll — an access-control mistake made in one keystroke.

**Why this works:** permissions are precise; small changes have big authorization consequences.

## Example 2 — Real-world: fixing an IDOR

A support tool loads tickets by URL: `/tickets/5581`. A tester notices changing the number shows *other
customers'* tickets. The team adds a server-side check that the ticket's owner matches the logged-in
agent's allowed accounts, closing an information leak that authentication alone didn't stop.

**Why this works:** authorization must verify the *specific object*, not just that someone is logged
in.

## Example 3 — Pitfall: "the button is hidden, so it's safe"

Developers hide the "Delete all" admin button from normal users in the UI but forget to check the role
on the server endpoint. An ordinary user opens the browser's dev tools, finds the API call, and invokes
it directly — deleting data they were never authorized to touch.

**Why this bites:** the client can't enforce security; only server-side checks (complete mediation)
count.

# Common Mistakes

- **Trusting the client** — hiding a link or disabling a button is not authorization.
- **Checking permissions in one place** and skipping others (missing complete mediation).
- **Not verifying object ownership** — the root of IDOR.
- **Over-broad roles** — everyone an "admin" for convenience violates least privilege.
- **Confusing authentication with authorization** — being logged in ≠ being allowed.

# Best Practices

- **Deny by default**; grant the minimum via well-defined **roles** (RBAC), refined with attributes
  (ABAC) when needed.
- **Enforce every check server-side**, on every request, against the actual object.
- **Verify ownership** for any resource fetched by a user-supplied id.
- **Centralize authorization logic** so checks are consistent and testable.
- **Review roles and permissions regularly**; remove access when it's no longer needed.

# Summary

- **Authorization** decides what an authenticated user may do — it must be enforced everywhere,
  every time, on the server.
- Models include **DAC** (owner-decided), **MAC** (label-based), **RBAC** (roles), and **ABAC**
  (attributes/context); most apps use RBAC, often with ABAC.
- **Permissions** and **ACLs** express access at the OS and app level.
- **Broken access control** (OWASP A01:2021), especially **IDOR** and missing checks, is the top web
  risk — fix it with **least privilege**, **ownership checks**, and **complete mediation**.

# Flash Cards

Q: How does authorization relate to authentication?
A: Authentication proves who you are; authorization then decides, for each action, what you're allowed to do. Both must succeed — being logged in doesn't mean being permitted.

Q: What is the difference between RBAC and ABAC?
A: RBAC grants permissions through roles assigned to users; ABAC decides using attributes and context (user, resource, environment) evaluated by a policy, allowing finer-grained rules.

Q: What is an IDOR (Insecure Direct Object Reference)?
A: When an app fetches a resource using a user-supplied identifier without checking that the resource belongs to the requester, letting a user read or change others' data by changing the id.

Q: Why is hiding a button in the UI not a valid access control?
A: The client can be bypassed (dev tools, direct API calls); authorization must be enforced on the server for every request — hidden is not the same as blocked.

Q: What does "deny by default" mean for authorization?
A: A subject has no access unless explicitly granted; permissions are added deliberately rather than removed, so mistakes fail safe (no access) instead of exposing data.

Q: Which OWASP Top 10 (2021) category covers authorization failures, and its rank?
A: Broken Access Control, ranked #1 (A01:2021) — the most common serious web application risk.

# Exercises

### Easy
Run `ls -l` in a directory and interpret the permissions of one file: who can read, write, and execute
it, and what `chmod 600` would change.

### Medium
Design RBAC roles for a small blog (reader, author, editor, admin). List the permissions each role
gets, and state the default for a brand-new user.

### Challenging
Given an endpoint `GET /api/invoices/{id}`, describe every server-side check needed to prevent IDOR and
privilege escalation, and explain why performing them on the client would be insufficient.

# Further Reading

- OWASP — *Top 10 (2021) A01: Broken Access Control*: <https://owasp.org/Top10/A01_2021-Broken_Access_Control/>
- OWASP — *Authorization Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- NIST SP 800-162 — *Guide to Attribute Based Access Control (ABAC)*: <https://csrc.nist.gov/pubs/sp/800/162/upd2/final>
- MITRE CWE-639 — *Authorization Bypass Through User-Controlled Key (IDOR)*: <https://cwe.mitre.org/data/definitions/639.html>
