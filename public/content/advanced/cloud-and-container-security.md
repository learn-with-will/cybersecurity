---
id: lesson-21
slug: cloud-and-container-security
title: "Cloud and Container Security"
level: advanced
order: 21
duration: 21
tags:
  - cloud-security
  - shared-responsibility
  - iam
  - containers
  - kubernetes
summary: "Securing modern infrastructure — the shared responsibility model that splits duties between provider and customer, why cloud IAM misconfigurations and public storage cause so many breaches, and how containers isolate workloads (and why that isolation is weaker than a VM), plus image, secrets, and Kubernetes basics."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the **shared responsibility model** and who secures what.
- Identify the most common **cloud misconfigurations** and prevent them.
- Apply **least-privilege IAM** and proper **secrets management** in the cloud.
- Describe how **containers** isolate workloads and why it's not a VM boundary.
- Harden container **images** and know the **Kubernetes** security basics.

# Why It Matters

Most systems now run in the **cloud** and in **containers**, which change *where* the security work
happens but not the principles. The biggest cloud risks aren't exotic exploits — they're
**misconfigurations**: a storage bucket left public, an over-permissive access role, a secret committed
to code. Understanding the shared responsibility model and applying least privilege (Lesson 3) in these
environments prevents the majority of cloud incidents.

# Concept Explanation

### The shared responsibility model

In the cloud, security duties are **split** between the provider and you, the customer:

- The **provider** secures the cloud **itself** — physical data centers, hardware, the hypervisor, and
  managed-service internals ("security **of** the cloud").
- **You** secure what you put **in** the cloud — your **data, configuration, identities/IAM, network
  rules, and application code** ("security **in** the cloud").

```text
                     IaaS        PaaS        SaaS
 Data & access      YOU         YOU         YOU
 Application        YOU         YOU        provider
 OS / runtime       YOU        provider    provider
 Hardware / DC    provider     provider    provider
```

The exact line shifts by service model (IaaS → PaaS → SaaS), but **your data and access management are
always yours to secure**. Assuming "the cloud is secure so I don't have to be" is the root of most cloud
breaches.

### The big cloud risks: misconfiguration and identity

- **Publicly exposed storage.** Object storage (e.g. S3-style buckets) left open to the internet is a
  classic cause of mass data leaks. Default to **private**, and audit access.
- **Over-permissive IAM.** Roles granted `*` (all actions) or shared broadly violate least privilege; a
  single leaked key then unlocks everything. Grant **minimal, scoped** permissions.

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::reports-bucket/quarterly/*"
}
```

  The policy above allows *only* reading *specific* objects — not `s3:*` on `*`. Prefer this shape.

- **Secrets in code/images.** Hardcoded API keys and credentials in repositories or container images
  leak constantly. Use a **secrets manager** (or the cloud's KMS/secret store), inject secrets at
  runtime, and scan for committed secrets (Lesson 22).
- **No monitoring.** Enable cloud audit logs (e.g. CloudTrail-style) and configuration monitoring so
  changes and access are visible (Lesson 16).

### Containers: convenient, but not a strong boundary

A **container** packages an app with its dependencies and runs as an **isolated process** on a shared
host **kernel**, using Linux **namespaces** (separate views of processes, network, filesystem) and
**cgroups** (resource limits). Crucially, containers **share the host kernel**, so isolation is **weaker
than a virtual machine's**: a kernel vulnerability or misconfiguration can allow a **container escape**
to the host or other containers. Treat containers as convenient packaging with *decent* isolation, not
as a security sandbox you can run hostile code in.

### Hardening container images and runtime

- **Minimal base images** (slim/distroless) — less software means fewer vulnerabilities and smaller
  attack surface.
- **Scan images** for known-vulnerable packages before deploy (Lesson 18), and rebuild to pick up
  patches.
- **Don't run as root** inside the container; drop unneeded Linux **capabilities**; use **read-only**
  filesystems where possible.
- **No secrets baked into images**; inject at runtime. Anyone who pulls the image can read its layers.
- **Pin and verify** image sources; prefer **signed** images (supply chain, Lesson 22).

```bash
# Scan an image for known vulnerabilities before shipping it.
trivy image myapp:1.4.2        # lists CVEs in the image's packages
# Run without root and with a read-only root filesystem.
docker run --user 1000:1000 --read-only --cap-drop ALL myapp:1.4.2
```

### Kubernetes basics

Orchestrators like **Kubernetes** add their own controls to get right:

- **RBAC** — least-privilege access for users and workloads to the cluster API.
- **Network policies** — micro-segmentation between pods (default-deny east-west traffic).
- **Secrets** — use the cluster secret store (and encrypt it at rest); don't put secrets in manifests
  committed to git.
- **Pod security** — restrict privileged pods, host mounts, and root; apply admission policies.

The same principles recur: least privilege, segmentation, no secrets in code, patch and scan.

# Key Terminology

- **Shared responsibility model** — the split of security duties between provider and customer.
- **IaaS / PaaS / SaaS** — infrastructure / platform / software as a service (shifting the line).
- **IAM** — identity and access management: who/what can do which actions on which resources.
- **Object storage exposure** — a bucket/blob store left publicly readable/writable.
- **Container** — an app isolated via namespaces/cgroups on a shared host kernel.
- **Container escape** — breaking out of a container to the host or other containers.
- **Image scanning** — checking a container image for known-vulnerable components.
- **Secrets manager / KMS** — service that stores and injects secrets and keys securely.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Storage default | Public for convenience | Private, granted explicitly | Private by default; expose specific objects only when required. |
| IAM scope | Broad (`*`) roles | Minimal scoped roles | Minimal, scoped least-privilege roles; a leaked broad key is catastrophic. |
| Secrets | In code/image | Secrets manager at runtime | Secrets manager/KMS; never commit secrets or bake them into images. |
| Isolation for hostile code | Container | Virtual machine / sandbox | Use a VM or stronger sandbox for untrusted code; containers share the kernel. |

# Worked Example

Deploy an app to the cloud securely — the checklist maps to the risks above:

```text
Identity:   give the app a role scoped to ONLY the resources it uses
            (e.g. read one bucket prefix, write one queue). No wildcards.
Storage:    buckets private by default; block public access at the account level.
Secrets:    pull DB credentials from the secrets manager at runtime; nothing in
            the repo or image. Scan the repo for committed secrets.
Container:  minimal base image; scan it (fail the build on criticals); run as a
            non-root user with dropped capabilities and a read-only filesystem.
Cluster:    Kubernetes RBAC least privilege; default-deny network policy; secrets
            in the encrypted cluster store; no privileged pods.
Visibility: enable cloud audit logs + config monitoring (Lesson 16).
```

Every line is a familiar principle — least privilege, no secrets in code, minimize surface, monitor —
applied to cloud-native tools.

# Real World Analogy

The **shared responsibility model** is like **renting an apartment**. The landlord (provider) secures
the building — foundations, exterior walls, locks on the main entrance. But **you** are responsible for
**locking your own door, not leaving your key under the mat, and choosing who you let in** (your data,
IAM, and config). A **container** is like an **office cubicle**: it gives you a separate space, but the
walls don't reach the ceiling and everyone shares the same building air (the **host kernel**) — fine for
normal colleagues, but not where you'd keep a dangerous prisoner (untrusted code); for that you need a
proper locked room (a **VM**).

# Examples

## Example 1 — Basic: the public bucket

A team stores backups in object storage and, for convenience, makes the bucket public "just to test."
It's indexed and its contents (customer data) leak. Defaulting the bucket to **private** and granting
only the specific access needed would have prevented one of the most common cloud breaches.

**Why this works:** private-by-default plus scoped access removes the accidental-exposure failure mode.

## Example 2 — Real-world: a leaked over-privileged key

A developer commits an access key with `*:*` permissions to a public repo. A bot finds it within
minutes and spins up resources / reads data across the account. Had the key been **scoped to least
privilege** (and stored in a secrets manager, never committed), the blast radius would have been tiny.

**Why this works:** least privilege caps what a leaked credential can do; secrets management prevents
the leak.

## Example 3 — Pitfall: trusting a container as a sandbox

A platform runs **untrusted customer code** in plain containers, assuming they're fully isolated. A
container-escape via a kernel flaw lets one tenant reach the host and other tenants. Containers weren't a
strong enough boundary for hostile workloads.

**Why this bites:** containers share the host kernel; untrusted code needs VM-level isolation or a
hardened sandbox.

# Common Mistakes

- **Assuming "the cloud" secures your data/config** — the customer side is always yours.
- **Public storage buckets** and **over-permissive IAM** (`*` roles, shared keys).
- **Hardcoding secrets** in code or container images.
- **Running containers as root** with full capabilities, or from bloated, unscanned images.
- **Relying on container isolation for untrusted code** instead of a VM/sandbox.

# Best Practices

- Know the **shared responsibility** split for each service and own your side (data, IAM, config).
- Default storage to **private**; enforce **least-privilege, scoped IAM**; audit access continuously.
- Keep **secrets out of code/images** — use a secrets manager/KMS and inject at runtime; scan for leaks.
- Use **minimal, scanned, signed images**; run **non-root**, drop capabilities, read-only where possible.
- In Kubernetes: **RBAC**, **default-deny network policies**, encrypted secrets, and no privileged pods;
  reserve **VMs/sandboxes** for untrusted code.

# Summary

- The **shared responsibility model** splits security between provider ("of the cloud") and customer
  ("in the cloud"); **your data, IAM, and configuration are always yours** to secure.
- The dominant cloud risks are **misconfiguration** (public storage, over-permissive IAM) and **secrets
  in code** — all fixed by least privilege and proper secrets management.
- **Containers** isolate via namespaces/cgroups on a **shared kernel**, so they're **weaker than VMs**;
  a container escape is possible — don't run untrusted code in them.
- Harden with **minimal, scanned, non-root images**, and apply **RBAC, network policies, and secret
  encryption** in Kubernetes.

# Flash Cards

Q: What does the shared responsibility model say, and what is always the customer's job?
A: The provider secures the cloud itself (hardware, infrastructure, managed-service internals) while the customer secures what they put in it; the customer is always responsible for their data, identity/access, and configuration.

Q: What are the two most common causes of cloud breaches?
A: Misconfiguration — especially publicly exposed storage and over-permissive IAM roles — and secrets (keys/credentials) committed to code or baked into images.

Q: Why is a container a weaker security boundary than a virtual machine?
A: Containers share the host's kernel and isolate via namespaces/cgroups, so a kernel flaw or misconfiguration can allow a container escape to the host or other containers; a VM has its own kernel and stronger isolation.

Q: Why shouldn't secrets be baked into container images?
A: Anyone who can pull the image can read its layers and extract the secrets; secrets should come from a secrets manager/KMS injected at runtime, not stored in the image or repo.

Q: List three ways to harden a container image or its runtime.
A: Use a minimal (slim/distroless) base image, scan it for known vulnerabilities, and run as a non-root user with dropped capabilities and a read-only filesystem (and use signed images).

Q: Name two Kubernetes security controls and what they do.
A: RBAC grants least-privilege access to the cluster API; network policies provide default-deny micro-segmentation between pods (others: encrypted secrets store, restricting privileged pods).

# Exercises

### Easy
For a service model you use (IaaS, PaaS, or SaaS), list two security tasks that are the provider's
responsibility and two that are yours.

### Medium
Write a least-privilege IAM policy (in words or JSON) for an app that only needs to read one storage
prefix and write to one queue. Explain why `*:*` would be dangerous.

### Challenging
Take a simple containerized app and write a hardening plan: base image choice, image scanning in the
build, non-root runtime, secrets handling, and (if using Kubernetes) RBAC and network policy. Explain
which principle from earlier lessons each step applies.

# Further Reading

- AWS — *Shared Responsibility Model*: <https://aws.amazon.com/compliance/shared-responsibility-model/>
- CIS — *Benchmarks for cloud and Kubernetes*: <https://www.cisecurity.org/cis-benchmarks>
- NIST SP 800-190 — *Application Container Security Guide*: <https://csrc.nist.gov/pubs/sp/800/190/final>
- OWASP — *Kubernetes Security Cheat Sheet*: <https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html>
