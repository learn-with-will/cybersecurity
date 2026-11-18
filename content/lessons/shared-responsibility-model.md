---
slug: shared-responsibility-model
title: The Shared Responsibility Model
topic: cloud-security
kind: concept
summary: Understand how security duties are split between cloud providers and customers.
tags: [cloud-security, shared-responsibility]
related: [cloud-misconfiguration, secrets-management]
---

# The idea

In the cloud, security duties are **split** between the provider and you, the customer:

- The **provider** secures the cloud **itself** — physical data centers, hardware, the hypervisor, and managed-service internals ("security **of** the cloud").
- **You** secure what you put **in** the cloud — your **data, configuration, identities/IAM, network rules, and application code** ("security **in** the cloud").

The exact line shifts by service model (IaaS → PaaS → SaaS), but **your data and access management are always yours to secure**.

# See it

```text
                     IaaS        PaaS        SaaS
 Data & access      YOU         YOU         YOU
 Application        YOU         YOU        provider
 OS / runtime       YOU        provider    provider
 Hardware / DC    provider     provider    provider
```

# Remember

- Providers secure the infrastructure "of" the cloud.
- You secure the data and configuration "in" the cloud.
- Never assume the cloud is "secure by default" for your workloads.
