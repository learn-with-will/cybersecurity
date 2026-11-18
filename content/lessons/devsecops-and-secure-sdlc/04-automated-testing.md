# The Automated Testing Toolbox

Different tools catch different flaws; you layer them:

| Tool | Looks at | Finds | When (pipeline) |
| --- | --- | --- | --- |
| SAST | source code | insecure code patterns | on commit / PR |
| SCA | dependencies | known-vuln libraries (CVE) | on commit / build |
| Secret | code + history | committed keys/passwords | on commit (pre-merge) |
| IaC | infra-as-code | misconfigs (open buckets) | on commit / plan |
| DAST | running app | runtime flaws (injection) | on a deployed test env |
| IAST | instrumented app | runtime + code context | during testing |

No single tool is complete — SAST + SCA + DAST + secret/IaC scanning together give practical coverage.
