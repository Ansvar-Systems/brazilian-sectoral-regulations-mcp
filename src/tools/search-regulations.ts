import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { generateResponseMetadata } from '../utils/metadata.js';
import { clampLimit, buildFtsQuery } from './common.js';

interface SearchInput {
  query: string;
  sector?: string;
  regulator?: string;
  limit?: number;
}

interface ProvisionRow {
  id: number;
  regulation_id: string;
  regulator_id: string;
  article_ref: string;
  title: string | null;
  content: string;
  topic: string | null;
  regulation_title: string;
  official_number: string | null;
  sector: string | null;
}

interface SearchResult {
  query: string;
  filters: { sector?: string; regulator?: string };
  total: number;
  provisions: ProvisionRow[];
  message?: string;
}

export function searchRegulations(
  db: Db,
  input: SearchInput,
): ToolResponse<SearchResult> {
  const limit = clampLimit(input.limit);
  const sanitized = buildFtsQuery(input.query);

  if (!sanitized) {
    return {
      results: {
        query: input.query,
        filters: { sector: input.sector, regulator: input.regulator },
        total: 0,
        provisions: [],
        message: 'Query is empty or contains only special characters.',
      },
      _metadata: generateResponseMetadata(),
    };
  }

  const params: unknown[] = [sanitized];
  const conditions: string[] = [];

  if (input.regulator) {
    conditions.push('p.regulator_id = ?');
    params.push(input.regulator.toUpperCase());
  }

  if (input.sector) {
    conditions.push('r.sector = ?');
    params.push(input.sector.toLowerCase());
  }

  const whereClause =
    conditions.length > 0 ? ' AND ' + conditions.join(' AND ') : '';

  params.push(limit);

  const sql = `
    SELECT
      p.id, p.regulation_id, p.regulator_id, p.article_ref,
      p.title, p.content, p.topic,
      r.title AS regulation_title, r.official_number, r.sector
    FROM provisions_fts fts
    JOIN provisions p ON p.id = fts.rowid
    JOIN regulations r ON r.id = p.regulation_id
    WHERE provisions_fts MATCH ?${whereClause}
    ORDER BY rank
    LIMIT ?
  `;

  const rows = db.prepare(sql).all(...params) as ProvisionRow[];

  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  return {
    results: {
      query: input.query,
      filters: { sector: input.sector, regulator: input.regulator },
      total: rows.length,
      provisions: rows,
    },
    _metadata: generateResponseMetadata(builtAt),
  };
}
