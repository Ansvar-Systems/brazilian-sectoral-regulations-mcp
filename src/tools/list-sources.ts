import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { generateResponseMetadata } from '../utils/metadata.js';

interface SourceRow {
  id: string;
  full_name: string;
  authority: string | null;
  jurisdiction: string;
  source_url: string | null;
  last_fetched: string | null;
  last_updated: string | null;
  item_count: number;
}

interface ListSourcesResult {
  sources: SourceRow[];
  totals: {
    sources: number;
    regulations: number;
    provisions: number;
    cybersecurity_requirements: number;
    certification_requirements: number;
    incident_reporting_rules: number;
    applicability_rules: number;
  };
}

export function listSources(db: Db): ToolResponse<ListSourcesResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  const sources = db.prepare('SELECT * FROM sources ORDER BY id').all() as SourceRow[];

  const count = (table: string): number => {
    try {
      return (db.prepare(`SELECT COUNT(*) AS cnt FROM ${table}`).get() as { cnt: number }).cnt;
    } catch {
      return 0;
    }
  };

  return {
    results: {
      sources,
      totals: {
        sources: sources.length,
        regulations: count('regulations'),
        provisions: count('provisions'),
        cybersecurity_requirements: count('cybersecurity_requirements'),
        certification_requirements: count('certification_requirements'),
        incident_reporting_rules: count('incident_reporting_rules'),
        applicability_rules: count('applicability_rules'),
      },
    },
    _metadata: generateResponseMetadata(builtAt),
  };
}
