# Coverage -- Brazilian Sectoral Regulations MCP

> Last verified: 2026-02-27 | Database version: 0.1.0

## What's Included

| Regulator | Sector | Regulations | Provisions | Completeness | Status |
|-----------|--------|-------------|------------|-------------|--------|
| ANATEL | Telecom | 0 | 0 | Pending ingestion | Scaffold |
| ANS | Health insurance | 0 | 0 | Pending ingestion | Scaffold |
| ANVISA | Health/pharma/SaMD | 0 | 0 | Pending ingestion | Scaffold |
| ANEEL | Energy | 0 | 0 | Pending ingestion | Scaffold |
| ANAC | Civil aviation | 0 | 0 | Pending ingestion | Scaffold |

**Total:** 10 tools, 0 regulations, 0 provisions

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
| ANATEL | Quarterly | -- | Pending |
| ANS | Quarterly | -- | Pending |
| ANVISA | Quarterly | -- | Pending |
| ANEEL | Quarterly | -- | Pending |
| ANAC | Quarterly | -- | Pending |

To check freshness programmatically, call the `check_data_freshness` tool.
