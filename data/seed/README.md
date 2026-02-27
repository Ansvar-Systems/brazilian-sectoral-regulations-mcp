# Seed Data

This directory contains JSON seed files for building the SQLite database.

## Expected files

| File | Description |
|------|-------------|
| `regulators.json` | The five Brazilian sectoral regulators (ANATEL, ANS, ANVISA, ANEEL, ANAC) |
| `regulations.json` | Regulations (resolucoes, normas, instrucoes normativas) from each regulator |
| `provisions.json` | Individual articles/provisions from each regulation |
| `cybersecurity_requirements.json` | Cybersecurity rules extracted per sector |
| `certification_requirements.json` | Certification and approval requirements per sector |
| `incident_reporting_rules.json` | Sector-specific incident/breach reporting obligations |
| `applicability_rules.json` | Rules for determining whether a regulation applies to a given activity |
| `sources.json` | Data source metadata (URLs, authorities, freshness) |

## Building the database

```bash
npm run build:db
```

This reads all seed files and produces `data/database.db`.

## Adding data

1. Populate the JSON files following the schema in `scripts/build-db.ts`
2. Run `npm run build:db`
3. Run `npm test` to verify
