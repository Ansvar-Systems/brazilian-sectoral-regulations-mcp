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

describe('get_certification_requirements', () => {
  it('returns certifications for telecom sector', () => {
    const result = handleToolCall(db as any, 'get_certification_requirements', {
      sector: 'telecom',
    }) as any;
    expect(result.results.sector).toBe('telecom');
    expect(result.results.total).toBeGreaterThan(0);
    expect(result.results.certifications.length).toBe(result.results.total);
  });

  it('filters by product_type when provided', () => {
    const result = handleToolCall(db as any, 'get_certification_requirements', {
      sector: 'telecom',
      product_type: 'telecom_equipment',
    }) as any;
    expect(result.results.product_type_filter).toBe('telecom_equipment');
  });

  it('each certification has expected fields', () => {
    const result = handleToolCall(db as any, 'get_certification_requirements', {
      sector: 'telecom',
    }) as any;
    for (const cert of result.results.certifications) {
      expect(cert).toHaveProperty('id');
      expect(cert).toHaveProperty('certification_name');
      expect(cert).toHaveProperty('regulator_id');
      expect(cert).toHaveProperty('mandatory');
    }
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'get_certification_requirements', {
      sector: 'telecom',
    }) as any;
    expect(result._metadata).toBeDefined();
  });
});
