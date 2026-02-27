import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { generateResponseMetadata } from '../utils/metadata.js';
import { daysSince } from './common.js';

interface SourceFreshness {
  id: string;
  full_name: string;
  last_fetched: string | null;
  last_updated: string | null;
  days_since_fetch: number | null;
  days_since_update: number | null;
  status: 'fresh' | 'stale' | 'unknown';
}

interface FreshnessResult {
  checked_at: string;
  built_at: string | null;
  sources: SourceFreshness[];
  overall_status: 'fresh' | 'stale' | 'unknown';
  stale_count: number;
}

const STALE_THRESHOLD_DAYS = 90;

export function checkDataFreshness(db: Db): ToolResponse<FreshnessResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value ?? null;

  const rows = db
    .prepare('SELECT id, full_name, last_fetched, last_updated FROM sources ORDER BY id')
    .all() as Array<{
    id: string;
    full_name: string;
    last_fetched: string | null;
    last_updated: string | null;
  }>;

  const sources: SourceFreshness[] = rows.map((row) => {
    const daysFetch = row.last_fetched ? daysSince(row.last_fetched) : null;
    const daysUpdate = row.last_updated ? daysSince(row.last_updated) : null;

    let status: 'fresh' | 'stale' | 'unknown' = 'unknown';
    if (daysFetch != null) {
      status = daysFetch <= STALE_THRESHOLD_DAYS ? 'fresh' : 'stale';
    }

    return {
      id: row.id,
      full_name: row.full_name,
      last_fetched: row.last_fetched,
      last_updated: row.last_updated,
      days_since_fetch: daysFetch,
      days_since_update: daysUpdate,
      status,
    };
  });

  const staleCount = sources.filter((s) => s.status === 'stale').length;
  const unknownCount = sources.filter((s) => s.status === 'unknown').length;

  let overallStatus: 'fresh' | 'stale' | 'unknown' = 'fresh';
  if (staleCount > 0) overallStatus = 'stale';
  else if (unknownCount === sources.length) overallStatus = 'unknown';

  return {
    results: {
      checked_at: new Date().toISOString(),
      built_at: builtAt,
      sources,
      overall_status: overallStatus,
      stale_count: staleCount,
    },
    _metadata: generateResponseMetadata(builtAt ?? undefined),
  };
}
