---
id: prioritization-and-metrics
title: Prioritization and Metrics
slug: prioritization-and-metrics
---

# Prioritizing with limited resources

No organization can do everything at once. Prioritize by **risk** and start with the **highest-leverage basics** — the controls that stop the most common attacks cheaply:

```text
 Do first (biggest risk reduction per effort):
   - MFA everywhere (esp. email/admin) ............ stops most account takeover
   - Patch internet-facing & KEV vulnerabilities .. closes reused attack paths
   - Backups (tested, offline) .................... defeats ransomware
   - Least privilege (accounts, cloud IAM) ........ caps blast radius
   - Asset inventory + logging .................... you can't protect/see the unknown
 Then mature: segmentation, DevSecOps, threat modeling, IR rehearsals, zero trust.
```

# Measuring the program

You manage what you measure. Choose **metrics** tied to risk and outcomes, not vanity numbers:

- **Coverage** — % of assets inventoried, patched, with MFA, with logging.
- **Time** — mean time to **detect (MTTD)** and to **respond/recover (MTTR)**; patch latency for critical vulnerabilities.
- **Exposure** — number of internet-facing services; open critical/KEV vulnerabilities.
- **People** — phishing-simulation click and **report** rates over time.
