---
slug: cloud-misconfiguration
title: Cloud Misconfiguration
topic: cloud-security
kind: pitfall
summary: Common cloud security failures like public storage and over-permissive IAM roles.
tags: [cloud-security, iam]
related: [shared-responsibility-model, secrets-management]
---

# The idea

The biggest cloud risks aren't exotic exploits — they're **misconfigurations**.

- **Publicly exposed storage.** Object storage (like S3 buckets) left open to the internet is a classic cause of mass data leaks. Always default to **private** and audit access.
- **Over-permissive IAM.** Granting broad permissions (like `*` or full admin) violates least privilege. If a key leaks, the blast radius is catastrophic. Always use **minimal, scoped** permissions.

# See it

```json
// Prefer scoped policies:
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::reports-bucket/quarterly/*"
}
```

# Remember

- Default storage to private; assume nothing is secure by accident.
- Grant minimal, scoped IAM permissions only.
- Audit cloud configurations and logs continuously.
