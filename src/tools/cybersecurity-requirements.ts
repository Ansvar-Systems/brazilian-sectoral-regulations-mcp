import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { buildMeta } from '../utils/metadata.js';

interface CyberRequirementsInput {
  sector: string;
  category?: string;
}

interface CyberRequirementRow {
  id: number;
  regulator_id: string;
  sector: string;
  requirement: string;
  legal_basis: string | null;
  category: string | null;
}

interface CyberRequirementsResult {
  sector: string;
  category_filter: string | null;
  total: number;
  requirements: CyberRequirementRow[];
}

export function getCybersecurityRequirements(
  db: Db,
  input: CyberRequirementsInput,
): ToolResponse<CyberRequirementsResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  const params: unknown[] = [input.sector.toLowerCase()];
  let categoryFilter = '';

  if (input.category) {
    categoryFilter = ' AND cr.category = ?';
    params.push(input.category.toLowerCase());
  }

  const sql = `
    SELECT cr.id, cr.regulator_id, cr.sector, cr.requirement,
           cr.legal_basis, cr.category
    FROM cybersecurity_requirements cr
    WHERE cr.sector = ?${categoryFilter}
    ORDER BY cr.regulator_id, cr.category, cr.id
  `;

  const rows = db.prepare(sql).all(...params) as CyberRequirementRow[];

  return {
    results: {
      sector: input.sector,
      category_filter: input.category ?? null,
      total: rows.length,
      requirements: rows,
    },
    _metadata: buildMeta(),
  };
}
