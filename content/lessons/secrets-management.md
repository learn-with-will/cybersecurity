---
slug: secrets-management
title: Secrets Management
topic: cloud-security
kind: technique
summary: Never commit secrets to code; use secrets managers to inject them at runtime.
tags: [cloud-security, secrets]
related: [cloud-misconfiguration, container-hardening]
---

# The idea

Hardcoded API keys and credentials in repositories or images leak constantly.

- **Use a secrets manager.** Store keys in a secure service (e.g., KMS, Vault, or cloud-native stores).
- **Inject at runtime.** Load secrets into the application environment at startup, never bake them into images or commit them to git.
- **Scan.** Use automated tools to scan your repositories for accidentally committed secrets.

# See it

Anyone who pulls your container image can inspect its layers and recover any "baked-in" secrets. Injecting them at runtime keeps them out of the image layers.

# Remember

- Never commit secrets to version control.
- Never bake secrets into container images.
- Use a dedicated secrets management service for runtime injection.
