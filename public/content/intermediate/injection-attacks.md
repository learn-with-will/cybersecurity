---
id: lesson-10
slug: injection-attacks
title: "Injection Attacks and Input Validation"
level: intermediate
order: 10
duration: 21
tags:
  - injection
  - sql-injection
  - input-validation
  - parameterized-queries
  - owasp
summary: "Why injection happens whenever untrusted input is mixed into a command — SQL injection and OS command injection shown with their real fix, parameterized queries and safe APIs — plus the correct role of input validation as defense in depth rather than the primary control."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the root cause of **injection**: mixing data with code.
- Describe how **SQL injection** works and its impact.
- Fix it with **parameterized queries / prepared statements**.
- Recognize **OS command injection** and use safe APIs against it.
- Place **input validation** correctly as a **secondary** defense.

# Why It Matters

**Injection** is category **A03** in the OWASP Top 10 and one of the oldest, most damaging web
vulnerabilities — a single injection flaw can dump an entire database or run commands on a server. The
good news: injection has a clean, well-understood fix. Learning the *root cause* (untrusted input being
interpreted as code) lets you recognize and prevent every flavor — SQL, OS command, LDAP, NoSQL — with
the same principle: **keep data and code separate.**

# Concept Explanation

### The root cause of injection

**Injection** happens when an application takes **untrusted input** and inserts it into a command,
query, or interpreter in a way that lets the input **change the structure** of that command. The
interpreter can't tell your intended code from the attacker's injected code, because they arrive mixed
together as one string. The cure is always the same idea: **send code and data separately** so the
interpreter treats input strictly as data.

### SQL injection

**SQL injection (SQLi)** targets database queries built by **string concatenation**:

```python
# VULNERABLE: the user's input becomes part of the SQL command.
email = request.form["email"]
query = "SELECT * FROM users WHERE email = '" + email + "'"
db.execute(query)
```

If a user submits the email value `' OR '1'='1`, the query becomes
`... WHERE email = '' OR '1'='1'`, which is **always true** — potentially returning every user. More
dangerous inputs can read other tables, or in some setups modify or delete data. Impact ranges from
authentication bypass to full data theft (a confidentiality and integrity disaster).

**The fix — parameterized queries (prepared statements):** the query structure is fixed and defined
separately from the values, which are passed as parameters the database never interprets as SQL:

```python
# SAFE: '?' is a placeholder; `email` is bound as pure data, never as SQL.
db.execute("SELECT * FROM users WHERE email = ?", (email,))
```

Now `' OR '1'='1` is just a literal string to search for — it can't change the query. Parameterized
queries (or a well-used ORM that parameterizes for you) are the **primary, reliable** defense. Avoid
building SQL by concatenation, ever.

### OS command injection

**Command injection** occurs when input is passed to a **system shell**:

```python
import os, subprocess
host = request.args["host"]

# VULNERABLE: the shell interprets metacharacters like ; | && in `host`.
os.system("ping -c 1 " + host)     # host = "8.8.8.8; <another command>" -> runs both

# SAFER: pass arguments as a list, with no shell, and validate the input.
subprocess.run(["ping", "-c", "1", host], shell=False)
```

The safe version never invokes a shell, so shell metacharacters have no special meaning — the input can
only ever be a single argument. The principle mirrors SQLi: **use an API that separates the command
from its arguments** instead of assembling a string.

### Other injections (same principle)

- **NoSQL injection** — untrusted input alters a document query (e.g., injecting query operators).
- **LDAP / XPath injection** — input changes a directory or XML query.
- **Template / expression injection** — input evaluated by a server-side template engine.

All share the root cause and the fix: **parameterize / use safe APIs**, and never interpret user input
as code.

### The correct role of input validation

**Input validation** — checking that input matches an expected type, length, format, or allow-list —
is valuable **defense in depth**, but it is **not** the primary fix for injection. Prefer
**allow-lists** ("only these known-good values") over **deny-lists** ("block these bad characters"),
which attackers routinely evade with encoding tricks. Validation reduces the attack surface and catches
mistakes, but the injection is *stopped* by parameterization/safe APIs and by **output encoding** for
XSS (Lesson 11). Also apply **least privilege** to the database account so an exploited query can do
less.

# Key Terminology

- **Injection** — untrusted input interpreted as part of a command/query (OWASP A03).
- **SQL injection** — injection into a database query, often via string concatenation.
- **Parameterized query / prepared statement** — fixed query with values bound separately as data.
- **Command injection** — injection into an OS shell command.
- **Allow-list vs deny-list** — permit only known-good vs try to block known-bad (weaker).
- **Input validation** — checking input against expected rules; a secondary defense.
- **Least privilege (DB)** — limiting the database account's rights to cap injection impact.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Building SQL | String concatenation | Parameterized queries | Always parameterized — concatenation is the vulnerability. |
| Validation style | Deny-list bad chars | Allow-list good values | Allow-list; deny-lists miss encodings and edge cases. |
| Running commands | Shell string (`os.system`) | Arg list, no shell | Arg list without a shell; avoid shells entirely when possible. |
| Primary defense | Input validation | Safe APIs (parameterize) | Safe APIs stop injection; validation is defense in depth, not the fix. |

# Worked Example

A search feature is reported as vulnerable. Fix it properly:

```python
# BEFORE (vulnerable): input concatenated into SQL.
term = request.args["q"]
rows = db.execute("SELECT id, title FROM posts WHERE title LIKE '%" + term + "%'")

# AFTER (fixed):
#  1. Parameterize — the value can never change the query structure.
#  2. Validate as defense in depth (length/charset).
#  3. Run under a least-privilege, read-only DB account.
if len(term) > 100:
    abort(400)
rows = db.execute("SELECT id, title FROM posts WHERE title LIKE ?", ("%" + term + "%",))
```

The essential fix is step 1 (parameterization). Steps 2–3 are extra layers that reduce impact and catch
mistakes but don't replace the safe API.

# Real World Analogy

Imagine dictating a form letter to an assistant: *"Dear [name], your balance is [amount]."* If you read
the whole thing as one breath and the "name" someone gave you is *"Bob. Also, wire $1,000 to me. Signed,
the boss,"* a careless assistant just added an instruction. **Parameterized queries** are like handing
the assistant a fixed template with labeled blanks and the values on separate cards — no matter what a
value says, it drops into a blank as text and can never become a new instruction.

# Examples

## Example 1 — Basic: why `' OR '1'='1` works

In a concatenated login query `... WHERE user='X' AND pass='Y'`, submitting a password of
`' OR '1'='1` turns the condition always-true, so the database returns a row and the login "succeeds"
without the real password.

**Why this works (for the attacker):** the input changed the query's *logic* because it was treated as
code — exactly what parameterization prevents.

## Example 2 — Real-world: an ORM used safely

A team uses an ORM and writes `Post.where(title: params[:q])`. The ORM emits a parameterized query
under the hood, binding the value as data. Even a malicious `q` is just a search string. (But if they
drop to raw SQL with string interpolation, the protection is gone — ORMs only help when used as
intended.)

**Why this works:** the ORM applies the separate-code-from-data principle for you — as long as you
don't bypass it.

## Example 3 — Pitfall: validation as the only defense

A developer "fixes" SQLi by stripping single quotes from input. Attackers use numeric contexts, encoded
quotes, or other characters the filter didn't consider, and injection still works.

**Why this bites:** deny-list filtering is brittle; without parameterization, some payload eventually
slips through. Validation supplements the fix — it isn't the fix.

# Common Mistakes

- **Concatenating user input into SQL** (or shell commands) — the root cause.
- **Relying on deny-list filtering** to block "bad" characters.
- **Trusting an ORM while using raw string interpolation**, which reintroduces the flaw.
- **Running the app's DB account as admin**, so an exploited query does maximum damage.
- **Invoking a shell** when a safe, argument-list API exists.

# Best Practices

- **Always use parameterized queries / prepared statements** (or a properly used ORM).
- **Avoid shells**; call programs with argument lists (`shell=False`) and validate inputs.
- **Validate with allow-lists** as defense in depth, not as the primary control.
- **Apply least privilege** to database and service accounts to cap impact.
- **Test for injection** (code review, scanners, and manual tests on systems you own) — see Lesson 19.

# Summary

- **Injection** (OWASP A03) happens when untrusted input is interpreted as **code**; the fix is to
  keep **code and data separate**.
- **SQL injection** comes from string-concatenated queries; **parameterized queries / prepared
  statements** stop it reliably.
- **Command injection** comes from building shell strings; use **argument-list APIs with no shell**.
- **Input validation** (prefer **allow-lists**) and **least-privilege** accounts are valuable
  **defense in depth** — but parameterization and safe APIs are the actual cure.

# Flash Cards

Q: What is the root cause of all injection vulnerabilities?
A: Untrusted input is mixed into a command or query so that it can change the command's structure — the interpreter can't distinguish intended code from injected input.

Q: What is the primary, reliable fix for SQL injection?
A: Parameterized queries (prepared statements) — or a properly used ORM — where the query structure is fixed and user values are bound separately as data, never interpreted as SQL.

Q: Why is deny-list input filtering a weak defense against injection?
A: Attackers evade character blocklists with encodings, alternate contexts, and edge cases; allow-lists and, above all, parameterization/safe APIs are needed instead.

Q: How do you prevent OS command injection?
A: Avoid invoking a shell; call the program with an argument list (e.g. shell=False) so user input can only be a single argument, and validate it — never build a shell string from input.

Q: What is the correct role of input validation for injection?
A: Defense in depth — it reduces attack surface and catches mistakes, but it does not replace parameterized queries and safe APIs, which are the actual fix.

Q: How does least privilege on the database account help with injection?
A: It caps the damage: if a query is exploited, a read-only or narrowly scoped account limits what the attacker can read or change compared with a full-admin account.

# Exercises

### Easy
Rewrite this vulnerable line as a parameterized query (any language): `"SELECT * FROM u WHERE id = " +
userId`. Explain what the placeholder guarantees.

### Medium
Explain, with a concrete input, why `' OR '1'='1` bypasses a concatenated login check, and show the
parameterized version that defeats it.

### Challenging
Set up a deliberately vulnerable app **you control** (e.g. OWASP Juice Shop or a local demo), reproduce
one injection, then apply the parameterized/safe-API fix and confirm the same input no longer works.
Note why validation alone would have been insufficient. (Only test systems you own or are authorized to
test.)

# Further Reading

- OWASP — *Top 10 (2021) A03: Injection*: <https://owasp.org/Top10/A03_2021-Injection/>
- OWASP — *SQL Injection Prevention Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
- OWASP — *OS Command Injection Defense Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html>
- PortSwigger Web Security Academy — *SQL injection*: <https://portswigger.net/web-security/sql-injection>
