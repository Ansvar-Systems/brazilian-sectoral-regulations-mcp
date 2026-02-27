import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { generateResponseMetadata } from '../utils/metadata.js';

interface ApplicabilityInput {
  sector: string;
  activity_description: string;
}

interface ApplicabilityRow {
  id: number;
  regulator_id: string;
  sector: string;
  activity_pattern: string;
  applies: number;
  conditions: string | null;
  legal_basis: string | null;
}

interface ApplicabilityResult {
  sector: string;
  activity_description: string;
  matching_rules: ApplicabilityRow[];
  total_matches: number;
  note: string;
}

export function checkApplicability(
  db: Db,
  input: ApplicabilityInput,
): ToolResponse<ApplicabilityResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  // Search for applicability rules where the activity_pattern matches
  // the user-provided description via LIKE
  const words = input.activity_description
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 10);

  if (words.length === 0) {
    return {
      results: {
        sector: input.sector,
        activity_description: input.activity_description,
        matching_rules: [],
        total_matches: 0,
        note: 'No meaningful keywords extracted from the activity description.',
      },
      _metadata: generateResponseMetadata(builtAt),
    };
  }

  // Build a query that matches any word in activity_pattern
  const likeConditions = words.map(() => 'LOWER(ar.activity_pattern) LIKE ?');
  const params: unknown[] = [input.sector.toLowerCase()];
  for (const word of words) {
    params.push(`%${word}%`);
  }

  const sql = `
    SELECT ar.id, ar.regulator_id, ar.sector, ar.activity_pattern,
           ar.applies, ar.conditions, ar.legal_basis
    FROM applicability_rules ar
    WHERE ar.sector = ?
      AND (${likeConditions.join(' OR ')})
    ORDER BY ar.applies DESC, ar.id
    LIMIT 20
  `;

  const rows = db.prepare(sql).all(...params) as ApplicabilityRow[];

  return {
    results: {
      sector: input.sector,
      activity_description: input.activity_description,
      matching_rules: rows,
      total_matches: rows.length,
      note:
        'These rules are matched by keyword against your activity description. ' +
        'This is indicative, not definitive. Consult a qualified regulatory specialist ' +
        'for a binding applicability determination.',
    },
    _metadata: generateResponseMetadata(builtAt),
  };
}
