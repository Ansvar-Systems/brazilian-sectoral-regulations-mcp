import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { generateResponseMetadata } from '../utils/metadata.js';

interface IncidentReportingInput {
  sector: string;
}

interface IncidentReportingRow {
  id: number;
  regulator_id: string;
  sector: string;
  event_type: string;
  timeline: string | null;
  channel: string | null;
  penalties: string | null;
  legal_basis: string | null;
}

interface IncidentReportingResult {
  sector: string;
  total: number;
  rules: IncidentReportingRow[];
}

export function getIncidentReportingRules(
  db: Db,
  input: IncidentReportingInput,
): ToolResponse<IncidentReportingResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  const sql = `
    SELECT ir.id, ir.regulator_id, ir.sector, ir.event_type,
           ir.timeline, ir.channel, ir.penalties, ir.legal_basis
    FROM incident_reporting_rules ir
    WHERE ir.sector = ?
    ORDER BY ir.regulator_id, ir.id
  `;

  const rows = db.prepare(sql).all(input.sector.toLowerCase()) as IncidentReportingRow[];

  return {
    results: {
      sector: input.sector,
      total: rows.length,
      rules: rows,
    },
    _metadata: generateResponseMetadata(builtAt),
  };
}
