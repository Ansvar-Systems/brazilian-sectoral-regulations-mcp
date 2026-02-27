# Brazilian Sectoral Regulations MCP

[![CI](https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@anthropic-ai/brazilian-sectoral-regulations-mcp)](https://www.npmjs.com/package/@anthropic-ai/brazilian-sectoral-regulations-mcp)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Brazilian sectoral regulatory intelligence via the [Model Context Protocol](https://modelcontextprotocol.io). Covers five federal regulatory agencies: **ANATEL** (telecom), **ANS** (health insurance), **ANVISA** (health/pharma/SaMD), **ANEEL** (energy), and **ANAC** (civil aviation).

Part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- open-source regulatory and security intelligence for AI agents.

## What's Inside

| Regulator | Sector | Scope |
|-----------|--------|-------|
| **ANATEL** | Telecommunications | Resolucoes, cybersecurity requirements, equipment certification |
| **ANS** | Health insurance | Health plan operator obligations, data protection rules |
| **ANVISA** | Health/pharma/SaMD | Product registration, SaMD cybersecurity, GMP requirements |
| **ANEEL** | Energy | Grid cybersecurity, SCADA security, incident reporting |
| **ANAC** | Civil aviation | Aviation safety management, cyber requirements, certification |

## Quick Start

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "brazilian-sectoral-regulations": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/brazilian-sectoral-regulations-mcp"]
    }
  }
}
```

### With npm

```bash
npm install -g @anthropic-ai/brazilian-sectoral-regulations-mcp
brazilian-sectoral-regulations-mcp
```

### From Source

```bash
git clone https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp.git
cd brazilian-sectoral-regulations-mcp
npm install
npm run build:db
npm run dev
```

## Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | `search_regulations` | Full-text search across all sectoral regulations |
| 2 | `get_provision` | Retrieve a single article from a regulation |
| 3 | `get_cybersecurity_requirements` | Cyber rules per sector |
| 4 | `get_certification_requirements` | Certification/approval requirements per sector |
| 5 | `get_incident_reporting_rules` | Sector-specific incident reporting obligations |
| 6 | `get_regulator_info` | Authority details and enforcement powers |
| 7 | `check_applicability` | Does this regulation apply to my activity? |
| 8 | `list_sources` | Data source inventory and record counts |
| 9 | `about` | Server metadata and capabilities |
| 10 | `check_data_freshness` | Data freshness status per source |

See [TOOLS.md](TOOLS.md) for full parameter documentation and usage guidance.

## Example Queries

- "What cybersecurity requirements does ANATEL impose on telecom operators?"
- "What certifications does ANVISA require for software as a medical device (SaMD)?"
- "How quickly must energy companies report cyber incidents to ANEEL?"
- "Does ANAC require cybersecurity assessments for avionics software?"
- "What are the data protection obligations for health insurance operators under ANS?"

## Coverage

See [COVERAGE.md](COVERAGE.md) for detailed coverage status per regulator. Machine-readable coverage manifest at `data/coverage.json`.

## Data Sources

All data is sourced from official Brazilian government regulatory publications:

- [ANATEL](https://www.anatel.gov.br) -- Agencia Nacional de Telecomunicacoes
- [ANS](https://www.ans.gov.br) -- Agencia Nacional de Saude Suplementar
- [ANVISA](https://www.anvisa.gov.br) -- Agencia Nacional de Vigilancia Sanitaria
- [ANEEL](https://www.aneel.gov.br) -- Agencia Nacional de Energia Eletrica
- [ANAC](https://www.anac.gov.br) -- Agencia Nacional de Aviacao Civil

See [sources.yml](sources.yml) for structured source metadata.

## Development

```bash
# Install dependencies
npm install

# Build database from seed data
npm run build:db

# Run in development mode
npm run dev

# Run tests
npm test

# Type check
npm run lint

# Full validation
npm run validate
```

## Architecture

- **Transport:** stdio (npm package) + Vercel Streamable HTTP (planned)
- **Database:** SQLite with FTS5 full-text search, opened read-only
- **Language:** TypeScript (strict mode, ES2022)
- **All queries use parameterized statements** (no string interpolation)
- **Every tool response includes `_metadata`** with disclaimer and freshness

## Related MCP Servers

| Server | Scope |
|--------|-------|
| [brazil-law-mcp](https://github.com/Ansvar-Systems/brazil-law-mcp) | General Brazilian legislation (federal laws, LGPD, Constitution) |
| [latam-data-protection-mcp](https://github.com/Ansvar-Systems/latam-data-protection-mcp) | Latin American data protection laws |
| [latam-financial-regulations-mcp](https://github.com/Ansvar-Systems/latam-financial-regulations-mcp) | Latin American financial sector regulations |

## Disclaimer

This server provides reference information about Brazilian sectoral regulations. **It is not legal or compliance advice.** See [DISCLAIMER.md](DISCLAIMER.md).

## License

Apache-2.0. See [LICENSE](LICENSE).

---

Built by [Ansvar Systems](https://ansvar.eu) -- cybersecurity services and AI-powered compliance intelligence.
