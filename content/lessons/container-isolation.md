---
slug: container-isolation
title: Container Isolation
topic: container-security
kind: concept
summary: Containers share the host kernel and provide weaker isolation than VMs.
tags: [containers, kernel]
related: [container-hardening, kubernetes-basics]
---

# The idea

A **container** packages an app and runs as an **isolated process** on a shared host **kernel**, using namespaces and cgroups.

Crucially, containers **share the host kernel**. Isolation is **weaker than a virtual machine's**, which provides its own kernel. A kernel vulnerability or misconfiguration can allow a **container escape** to the host or other containers.

# See it

Containers are convenient for packaging, but treat them as a "cubicle," not a "locked room." Run untrusted code in a VM or a dedicated sandbox, not a plain container.

# Remember

- Containers share the host kernel.
- Container isolation is weaker than VM isolation.
- Do not run untrusted or malicious code in a container.
