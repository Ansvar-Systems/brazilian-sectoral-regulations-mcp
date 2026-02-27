import type { Db } from './common.js';
import type { ToolResponse } from '../utils/metadata.js';
import { buildMeta } from '../utils/metadata.js';

interface RegulatorInfoInput {
  sector: string;
}

interface RegulatorRow {
  id: string;
  name: string;
  full_name: string;
  sector: string;
  website: string | null;
  enforcement_powers: string | null;
}

interface RegulatorInfoResult {
  sector: string;
  regulator: RegulatorRow | null;
  regulation_count: number;
  provision_count: number;
}

export function getRegulatorInfo(
  db: Db,
  input: RegulatorInfoInput,
): ToolResponse<RegulatorInfoResult> {
  const builtAt = (
    db
      .prepare("SELECT value FROM db_metadata WHERE key = 'built_at'")
      .get() as { value: string } | undefined
  )?.value;

  const regulator = db
    .prepare('SELECT * FROM regulators WHERE sector = ?')
    .get(input.sector.toLowerCase()) as RegulatorRow | undefined;

  let regulationCount = 0;
  let provisionCount = 0;

  if (regulator) {
    const regCount = db
      .prepare('SELECT COUNT(*) AS cnt FROM regulations WHERE regulator_id = ?')
      .get(regulator.id) as { cnt: number };
    regulationCount = regCount.cnt;

    const provCount = db
      .prepare('SELECT COUNT(*) AS cnt FROM provisions WHERE regulator_id = ?')
      .get(regulator.id) as { cnt: number };
    provisionCount = provCount.cnt;
  }

  return {
    results: {
      sector: input.sector,
      regulator: regulator ?? null,
      regulation_count: regulationCount,
      provision_count: provisionCount,
    },
    _metadata: buildMeta(),
  };
}
