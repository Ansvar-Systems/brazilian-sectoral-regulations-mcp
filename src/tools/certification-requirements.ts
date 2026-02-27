import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { generateResponseMetadata } from '../utils/metadata.js';

interface CertificationInput {
  sector: string;
  product_type?: string;
}

interface CertificationRow {
  id: number;
  regulator_id: string;
  sector: string;
  product_type: string | null;
  certification_name: string;
  description: string | null;
  legal_basis: string | null;
  mandatory: number;
}

interface CertificationResult {
  sector: string;
  product_type_filter: string | null;
  total: number;
  certifications: CertificationRow[];
}

export function getCertificationRequirements(
  db: Db,
  input: CertificationInput,
): ToolResponse<CertificationResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  const params: unknown[] = [input.sector.toLowerCase()];
  let productFilter = '';

  if (input.product_type) {
    productFilter = ' AND cr.product_type = ?';
    params.push(input.product_type);
  }

  const sql = `
    SELECT cr.id, cr.regulator_id, cr.sector, cr.product_type,
           cr.certification_name, cr.description, cr.legal_basis, cr.mandatory
    FROM certification_requirements cr
    WHERE cr.sector = ?${productFilter}
    ORDER BY cr.mandatory DESC, cr.regulator_id, cr.id
  `;

  const rows = db.prepare(sql).all(...params) as CertificationRow[];

  return {
    results: {
      sector: input.sector,
      product_type_filter: input.product_type ?? null,
      total: rows.length,
      certifications: rows,
    },
    _metadata: generateResponseMetadata(builtAt),
  };
}
