# Brazilian Sectoral Regulations MCP

[![CI](https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@anthropic-ai/brazilian-sectoral-regulations-mcp)](https://www.npmjs.com/package/@anthropic-ai/brazilian-sectoral-regulations-mcp)

MCP server for Brazilian sectoral regulations. Covers cybersecurity requirements, certification obligations, incident reporting rules, and applicability guidance across five federal regulatory agencies.

## Coverage

| Regulator | Sector | Status |
|-----------|--------|--------|
| **ANATEL** -- Agencia Nacional de Telecomunicacoes | Telecom | Pending |
| **ANS** -- Agencia Nacional de Saude Suplementar | Health insurance | Pending |
| **ANVISA** -- Agencia Nacional de Vigilancia Sanitaria | Health / pharma / SaMD | Pending |
| **ANEEL** -- Agencia Nacional de Energia Eletrica | Energy | Pending |
| **ANAC** -- Agencia Nacional de Aviacao Civil | Civil aviation | Pending |

## Quick Start

### npx (no install)

```bash
npx @anthropic-ai/brazilian-sectoral-regulations-mcp
```

### Claude Desktop

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

## Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | `search_regulations` | Full-text search across all Brazilian sectoral regulations |
| 2 | `get_provision` | Retrieve a single provision from a specific regulation |
| 3 | `get_cybersecurity_requirements` | Get cybersecurity requirements for a Brazilian sector |
| 4 | `get_certification_requirements` | Get certification and approval requirements for a sector |
| 5 | `get_incident_reporting_rules` | Get sector-specific incident reporting obligations |
| 6 | `get_regulator_info` | Get information about a Brazilian sectoral regulatory authority |
| 7 | `check_applicability` | Determine whether sectoral regulations apply to a business activity |
| 8 | `list_sources` | List data sources with record counts and freshness |
| 9 | `about` | Server metadata and capabilities |
| 10 | `check_data_freshness` | Check data freshness and identify stale sources |

See [TOOLS.md](TOOLS.md) for full parameter documentation and usage guidance.

## Data Sources

All data is sourced from official Brazilian federal regulatory agency publications:

- [ANATEL](https://www.anatel.gov.br) -- telecom regulations
- [ANS](https://www.ans.gov.br) -- health insurance regulations
- [ANVISA](https://www.anvisa.gov.br) -- health, pharma, and SaMD regulations
- [ANEEL](https://www.aneel.gov.br) -- energy sector regulations
- [ANAC](https://www.anac.gov.br) -- civil aviation regulations

Brazilian federal agency regulatory publications are public domain under Brazilian law. See [sources.yml](sources.yml) for detailed provenance metadata.

## Disclaimer

This server provides reference information only. It does not constitute legal, regulatory, or compliance advice. Before making compliance decisions, consult the official regulatory portal and engage qualified Brazilian legal counsel. See [DISCLAIMER.md](DISCLAIMER.md) for full terms.

## License

Apache-2.0. See [LICENSE](LICENSE).
