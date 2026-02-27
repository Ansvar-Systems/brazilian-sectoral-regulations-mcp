import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { buildMeta } from '../utils/metadata.js';

interface GetProvisionInput {
  regulator: string;
  regulation_id: string;
  article: string;
}

interface ProvisionDetail {
  id: number;
  regulation_id: string;
  regulator_id: string;
  article_ref: string;
  title: string | null;
  content: string;
  topic: string | null;
  regulation_title: string;
  official_number: string | null;
  year: number | null;
  status: string | null;
  source_url: string | null;
}

export function getProvision(
  db: Db,
  input: GetProvisionInput,
): ToolResponse<ProvisionDetail | { error: string }> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  const normalizedArticle = input.article
    .replace(/^Art\.?\s*/i, '')
    .trim();

  const sql = `
    SELECT
      p.id, p.regulation_id, p.regulator_id, p.article_ref,
      p.title, p.content, p.topic,
      r.title AS regulation_title, r.official_number, r.year,
      r.status, r.source_url
    FROM provisions p
    JOIN regulations r ON r.id = p.regulation_id
    WHERE p.regulator_id = ?
      AND p.regulation_id = ?
      AND (p.article_ref = ? OR p.article_ref = ?)
    LIMIT 1
  `;

  const row = db
    .prepare(sql)
    .get(
      input.regulator.toUpperCase(),
      input.regulation_id,
      input.article,
      normalizedArticle,
    ) as ProvisionDetail | undefined;

  if (!row) {
    return {
      results: {
        error: `Provision not found: ${input.regulator} ${input.regulation_id} Art. ${input.article}`,
      },
      _metadata: buildMeta(),
    };
  }

  return {
    results: row,
    _metadata: buildMeta(),
  };
}
