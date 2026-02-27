import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from '@ansvar/mcp-sqlite';
import { handleToolCall } from '../../src/tools/registry.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', '..', 'data', 'database.db');

let db: InstanceType<typeof Database>;

beforeAll(() => {
  db = new Database(DB_PATH, { readonly: true });
});

afterAll(() => {
  db.close();
});

describe('get_regulator_info', () => {
  it('returns regulator info for telecom sector', () => {
    const result = handleToolCall(db as any, 'get_regulator_info', {
      sector: 'telecom',
    }) as any;
    expect(result.results.sector).toBe('telecom');
    expect(result.results.regulator).not.toBeNull();
    expect(result.results.regulator.id).toBe('ANATEL');
    expect(result.results.regulation_count).toBeGreaterThan(0);
    expect(result.results.provision_count).toBeGreaterThan(0);
  });

  it('returns regulator info for all 5 sectors', () => {
    const expected: Record<string, string> = {
      telecom: 'ANATEL',
      health_insurance: 'ANS',
      health_pharma: 'ANVISA',
      energy: 'ANEEL',
      aviation: 'ANAC',
    };

    for (const [sector, regulatorId] of Object.entries(expected)) {
      const result = handleToolCall(db as any, 'get_regulator_info', {
        sector,
      }) as any;
      expect(result.results.regulator).not.toBeNull();
      expect(result.results.regulator.id).toBe(regulatorId);
    }
  });

  it('returns null regulator for unknown sector', () => {
    const result = handleToolCall(db as any, 'get_regulator_info', {
      sector: 'nonexistent',
    }) as any;
    expect(result.results.regulator).toBeNull();
    expect(result.results.regulation_count).toBe(0);
    expect(result.results.provision_count).toBe(0);
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'get_regulator_info', {
      sector: 'telecom',
    }) as any;
    expect(result._metadata).toBeDefined();
  });
});
