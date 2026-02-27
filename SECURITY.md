# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Security Scanning

This project uses multiple layers of automated security scanning:

### Dependency Vulnerabilities
- **npm audit**: Runs on every CI build (fails on high/critical)
- **Trivy**: Weekly vulnerability scanning for dependencies
- **Socket Security**: Supply chain attack detection on PRs

### Code Analysis
- **CodeQL**: Semantic security analysis (weekly + on PRs)
- **Semgrep**: SAST scanning with security-audit ruleset
- **Gitleaks**: Secret detection in code and commit history

### Security Metrics
- **OpenSSF Scorecard**: Weekly security posture evaluation
- **GitHub Security Tab**: Centralized vulnerability tracking

## Reporting a Vulnerability

**Email:** security@ansvar.eu

**Please DO NOT:**
- Open a public GitHub issue
- Disclose the vulnerability publicly before we have addressed it

### Response Timeline

| Severity | Initial Response | Fix Timeline |
|----------|-----------------|--------------|
| Critical | 24 hours | 7 days |
| High | 48 hours | 30 days |
| Medium | 5 days | 90 days |
| Low | 2 weeks | Next release |

## Scope

### In Scope
- MCP server implementation (`src/` directory)
- Database layer and query construction
- Input validation and sanitization
- Dependencies and supply chain
- Build and publishing process
- GitHub Actions workflows

### Out of Scope
- **Regulatory content accuracy**: We compile data from Brazilian government agencies. Content issues should be reported to the relevant regulatory authority.
- **Third-party MCP clients**: Issues with Claude Desktop, Cursor, or other clients should be reported to their respective projects.
- **User's local environment**: Configuration issues outside the MCP server itself.

## Database Security

The sectoral regulations database (`data/database.db`) is:
- **Pre-built and version-controlled** (tamper evident)
- **Opened in read-only mode** (no write risk from tools)
- **Source data from official government publications** (ANATEL, ANS, ANVISA, ANEEL, ANAC)
- **Ingestion scripts require manual execution** (no auto-download from arbitrary sources)

---

**Last Updated:** 2026-02-27
