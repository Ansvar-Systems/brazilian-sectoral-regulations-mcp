import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { buildMeta } from '../utils/metadata.js';
import { REGULATORS } from './common.js';

interface AboutInfo {
  server: string;
  version: string;
  domain: string;
  description: string;
  regulators: Array<{ id: string; name: string; sector: string }>;
  table_counts: Record<string, number>;
  capabilities: string[];
  built_at: string | null;
}

export function about(db: Db): ToolResponse<AboutInfo> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value ?? null;

  const tables = [
    'regulators',
    'regulations',
    'provisions',
    'cybersecurity_requirements',
    'certification_requirements',
    'incident_reporting_rules',
    'applicability_rules',
    'sources',
  ];

  const tableCounts: Record<string, number> = {};
  const capabilities: string[] = [];

  for (const table of tables) {
    try {
      const result = db
        .prepare(`SELECT COUNT(*) AS cnt FROM ${table}`)
        .get() as { cnt: number };
      tableCounts[table] = result.cnt;
      if (result.cnt > 0) capabilities.push(table);
    } catch {
      tableCounts[table] = 0;
    }
  }

  return {
    results: {
      server: 'brazilian-sectoral-regulations-mcp',
      version: '0.1.0',
      domain: 'brazilian-sectoral-regulations',
      description:
        'Brazilian sectoral regulatory intelligence covering five federal agencies: ' +
        'ANATEL (telecom), ANS (health insurance), ANVISA (health/pharma/SaMD), ' +
        'ANEEL (energy), and ANAC (civil aviation). Includes cybersecurity requirements, ' +
        'certification obligations, incident reporting rules, and applicability guidance.',
      regulators: REGULATORS.map((r) => ({
        id: r.id,
        name: r.full_name,
        sector: r.sector,
      })),
      table_counts: tableCounts,
      capabilities,
      built_at: builtAt,
    },
    _metadata: buildMeta(),
  };
}
