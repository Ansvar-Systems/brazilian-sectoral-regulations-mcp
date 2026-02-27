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

describe('get_incident_reporting_rules', () => {
  it('returns incident reporting rules for telecom sector', () => {
    const result = handleToolCall(db as any, 'get_incident_reporting_rules', {
      sector: 'telecom',
    }) as any;
    expect(result.results.sector).toBe('telecom');
    expect(result.results.total).toBeGreaterThan(0);
    expect(result.results.rules.length).toBe(result.results.total);
  });

  it('returns rules for all sectors', () => {
    const sectors = ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'];
    for (const sector of sectors) {
      const result = handleToolCall(db as any, 'get_incident_reporting_rules', {
        sector,
      }) as any;
      expect(result.results.sector).toBe(sector);
      expect(result.results.total).toBeGreaterThanOrEqual(0);
    }
  });

  it('each rule has expected fields', () => {
    const result = handleToolCall(db as any, 'get_incident_reporting_rules', {
      sector: 'telecom',
    }) as any;
    for (const rule of result.results.rules) {
      expect(rule).toHaveProperty('event_type');
      expect(rule).toHaveProperty('regulator_id');
    }
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'get_incident_reporting_rules', {
      sector: 'telecom',
    }) as any;
    expect(result._metadata).toBeDefined();
  });
});
