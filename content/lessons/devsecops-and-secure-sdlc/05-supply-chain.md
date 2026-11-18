# Software Supply Chain Security

Your software includes code you didn't write (open-source packages) and a build pipeline that could be tampered with. Supply-chain attacks target these. Defenses:

- **Manage dependencies**: track them, **pin** versions, update promptly, and remove unused ones.
- **SBOM (Software Bill of Materials)** — a machine-readable inventory of everything in your software.
- **Verify integrity**: use checksums/**signatures**, and prefer **signed** artifacts and images.
- **Build provenance**: frameworks like **SLSA** describe how to make builds tamper-evident.
- **Secure the pipeline**: least-privilege CI credentials, protected branches, and no secrets in logs.
