---
slug: kubernetes-basics
title: Kubernetes Security Basics
topic: container-security
kind: concept
summary: Essential Kubernetes security: RBAC, network policies, and secret management.
tags: [kubernetes, security]
related: [container-hardening, container-isolation]
---

# The idea

Kubernetes orchestrates containers but adds its own security surface area:

- **RBAC (Role-Based Access Control).** Enforce least-privilege for users and service accounts accessing the cluster API.
- **Network policies.** Apply default-deny micro-segmentation to restrict East-West traffic between pods.
- **Secrets.** Use the encrypted cluster secret store; do not commit secrets to git.
- **Pod Security.** Restrict privileged containers, host mounts, and root access via admission policies.

# See it

The same principles apply everywhere: least privilege, segmentation, no secrets in code, and consistent scanning and patching.

# Remember

- Use RBAC for API access.
- Apply default-deny network policies.
- Encrypt cluster secrets and keep them out of git.
