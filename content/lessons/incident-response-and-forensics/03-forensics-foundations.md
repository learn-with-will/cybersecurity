---
id: forensics-foundations
title: "Digital Forensics Foundations"
---

# Digital Forensics Foundations

Digital forensics is the collection and analysis of evidence to understand what happened.

### Essential Principles:
-   **Preserve Evidence**: Do not alter it. Work from forensic copies (images).
-   **Chain of Custody**: Document *who* collected each piece, *when*, *how*, and every transfer of custody. An unbroken chain makes evidence legally admissible.
-   **Order of Volatility**: Collect the most ephemeral data first, as it disappears soonest:
    1.  **RAM** (running processes, keys)
    2.  **Network State**
    3.  **Disk**
    4.  **Logs/Backups**

*Powering off a machine prematurely destroys volatile evidence in RAM.*
