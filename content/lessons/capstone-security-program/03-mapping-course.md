---
id: mapping-course
title: Mapping the Course into the Functions
slug: mapping-course
---

# Mapping the course into the functions

Here is the whole course as one program:

```text
 GOVERN   (L1,3,23)   CIA goals; security principles; policies, ownership (CISO),
                      risk register, compliance (CSF/ISO/GDPR), awareness culture.
 IDENTIFY (L2,17,18)  asset inventory; threat landscape & threat modeling (STRIDE);
                      vulnerability management (CVE/CVSS, KEV).
 PROTECT  (L3-15,21,  least privilege & zero trust; crypto & TLS/PKI; authN/MFA &
           22)         authZ; network defense & segmentation; endpoint hardening &
                      patching; secure web dev (injection, XSS/CSRF, sessions);
                      cloud/container security; DevSecOps & supply chain.
 DETECT   (L16)       logging, monitoring, SIEM, detection engineering (ATT&CK).
 RESPOND  (L20)       incident response lifecycle; forensics; communication.
 RECOVER  (L20)       restore from clean backups; lessons learned -> improve.
```

Notice **defense in depth** across functions: if PROTECT fails (a phish gets through), DETECT catches it (SIEM alert), RESPOND contains it, and RECOVER restores — no single failure is fatal.
