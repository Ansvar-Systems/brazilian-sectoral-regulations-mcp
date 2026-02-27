# Coverage -- Brazilian Sectoral Regulations MCP

> Last verified: 2026-02-27 | Database version: 0.1.0

## What's Included

| Regulator | Sector | Regulations | Provisions | Completeness | Status |
|-----------|--------|-------------|------------|-------------|--------|
| ANATEL | Telecom | 5 | 14 | Complete | Complete |
| ANS | Health insurance | 4 | 12 | Complete | Complete |
| ANVISA | Health/pharma/SaMD | 4 | 13 | Complete | Complete |
| ANEEL | Energy | 4 | 12 | Complete | Complete |
| ANAC | Civil aviation | 3 | 10 | Complete | Complete |

**Total:** 10 tools, 20 regulations, 61 provisions

**Cross-cutting data:** 39 cybersecurity requirements, 17 certification requirements, 14 incident reporting rules, 24 applicability rules

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| General Brazilian law | Covered by brazil-law-mcp | No |
| LGPD (data protection) | Covered by brazil-law-mcp | No |
| State/municipal regulations | Federal-only scope | No |
| Judicial decisions | Out of scope for sectoral regs | No |
| BACEN (Central Bank) | Financial sector, covered by latam-financial-regulations-mcp | No |
| CVM (Securities Commission) | Financial sector | No |
| INMETRO standards | Standards body, not sectoral regulator | Possible v1.1 |

## Limitations

- Data is a snapshot from official government publications, not real-time
- Portuguese-language regulatory text (original); no English translations
- Applicability checks are keyword-based indicators, not definitive legal determinations
- Amendment history may be incomplete for older regulations

## Data Freshness

| Source | Refresh Schedule | Last Refresh | Next Expected |
|--------|-----------------|-------------|---------------|
| ANATEL | Quarterly | 2026-02-27 | 2026-05-27 |
| ANS | Quarterly | 2026-02-27 | 2026-05-27 |
| ANVISA | Quarterly | 2026-02-27 | 2026-05-27 |
| ANEEL | Quarterly | 2026-02-27 | 2026-05-27 |
| ANAC | Quarterly | 2026-02-27 | 2026-05-27 |

To check freshness programmatically, call the `check_data_freshness` tool.
