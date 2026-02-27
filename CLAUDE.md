# Brazilian Sectoral Regulations MCP -- Developer Guide

## Git Workflow
- Never commit directly to main. Always create a feature branch and open a PR targeting `dev`.
- Conventional commit prefixes: feat:, fix:, chore:, docs:

## What This MCP Does
Brazilian sectoral regulatory intelligence server covering five federal agencies: ANATEL (telecom), ANS (health insurance), ANVISA (health/pharma/SaMD), ANEEL (energy), and ANAC (civil aviation). Provides cybersecurity requirements, certification obligations, incident reporting rules, and applicability guidance per sector. Does NOT provide general Brazilian law (see brazil-law-mcp for that). Does NOT provide legal advice.

## What's in the Database
- **Regulators table** — 5 Brazilian federal sectoral agencies
- **Regulations table** — resolucoes, normas, instrucoes normativas from each agency
- **Provisions table** — individual articles with FTS5 full-text search
- **Cybersecurity requirements** — sector-specific cyber obligations
- **Certification requirements** — product/service certification and approval rules
- **Incident reporting rules** — breach/incident notification timelines and channels
- **Applicability rules** — keyword-based regulation applicability matching
- **Sources table** — data provenance and freshness metadata

## Architecture
- **Transport:** stdio (npm package) + Vercel Streamable HTTP (stub)
- **Database:** SQLite + FTS5 via better-sqlite3, opened read-only
- **Entry point:** src/index.ts (stdio)
- **Tool definitions:** inline in src/index.ts (10 tools)
- **Tool implementations:** src/tools/*.ts (one file per tool)

## 10 Tools
1. `search_regulations` — FTS5 search across all sectoral regulations
2. `get_provision` — single provision lookup by regulator + regulation + article
3. `get_cybersecurity_requirements` — cyber rules by sector (optional category filter)
4. `get_certification_requirements` — certifications by sector (optional product_type filter)
5. `get_incident_reporting_rules` — incident reporting by sector
6. `get_regulator_info` — authority details by sector
7. `check_applicability` — keyword-based applicability check
8. `list_sources` — data source inventory with record counts
9. `about` — server metadata and capabilities
10. `check_data_freshness` — freshness status per source

## Key Conventions
- All database queries use parameterized statements
- FTS5 queries go through escapeFTS5Query() for input sanitization
- Every tool returns ToolResponse<T> with results + _metadata (freshness, disclaimer)
- Tool descriptions are written for LLM agents
- No banned words per ADR-009

## Testing
- `npm test` — vitest
- `npm run validate` — lint + test

## Data Pipeline
1. Seed JSON files in data/seed/ (manually curated or from ingest.ts)
2. `scripts/build-db.ts` reads seed JSON and builds data/database.db
3. `scripts/ingest.ts` will fetch from government portals (placeholder)
