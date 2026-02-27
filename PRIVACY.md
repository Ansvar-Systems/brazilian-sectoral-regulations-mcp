# Privacy Policy

## Data Collection

**This MCP server collects no data.**

- No user data is stored
- No telemetry is sent
- No tracking or analytics
- No cookies or session data
- No network calls at runtime

## Architecture

The Brazilian Sectoral Regulations MCP is a **read-only knowledge base**. It serves pre-built data from a local SQLite database. No user queries, inputs, or interactions are logged or persisted by the MCP server itself.

## Data Sources

All data in this knowledge base is sourced from **publicly available** Brazilian government regulatory publications:

- ANATEL (anatel.gov.br)
- ANS (ans.gov.br)
- ANVISA (anvisa.gov.br)
- ANEEL (aneel.gov.br)
- ANAC (anac.gov.br)

No proprietary, classified, or restricted data is included.

See [COVERAGE.md](COVERAGE.md) for the complete list of data sources.

## Third-Party Services

When running via stdio (npm package), no third-party services are involved. The MCP server makes no outbound network requests at runtime.

When deployed via Vercel (Streamable HTTP), standard Vercel infrastructure applies. See [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy).

## Contact

Questions about this privacy policy: privacy@ansvar.ai
