---
slug: container-hardening
title: Container Hardening
topic: container-security
kind: technique
summary: Build minimal images and apply runtime security controls to harden containers.
tags: [containers, hardening]
related: [container-isolation, kubernetes-basics]
---

# The idea

Harden your containers to reduce attack surface and prevent escapes:

- **Minimal images.** Use "slim" or "distroless" images to reduce vulnerable software.
- **Scan images.** Automate vulnerability scanning for packages before deployment.
- **Runtime hardening.** Don't run as root; drop unneeded capabilities (`--cap-drop ALL`); use read-only filesystems.
- **Signed images.** Verify and sign images to ensure supply chain integrity.

# See it

```bash
# Run without root and with a read-only root filesystem.
docker run --user 1000:1000 --read-only --cap-drop ALL myapp:1.4.2
```

# Remember

- Use minimal base images.
- Scan images for vulnerabilities.
- Run as a non-root user and drop unnecessary privileges.
