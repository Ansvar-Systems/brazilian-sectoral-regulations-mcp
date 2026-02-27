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

describe('get_cybersecurity_requirements', () => {
  it('returns requirements for telecom sector', () => {
    const result = handleToolCall(db as any, 'get_cybersecurity_requirements', {
      sector: 'telecom',
    }) as any;
    expect(result.results.sector).toBe('telecom');
    expect(result.results.total).toBeGreaterThan(0);
    expect(result.results.requirements.length).toBe(result.results.total);
  });

  it('returns requirements for all 5 sectors', () => {
    const sectors = ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'];
    for (const sector of sectors) {
      const result = handleToolCall(db as any, 'get_cybersecurity_requirements', {
        sector,
      }) as any;
      expect(result.results.sector).toBe(sector);
      expect(result.results.total).toBeGreaterThanOrEqual(0);
    }
  });

  it('filters by category when provided', () => {
    const result = handleToolCall(db as any, 'get_cybersecurity_requirements', {
      sector: 'telecom',
      category: 'access_control',
    }) as any;
    expect(result.results.category_filter).toBe('access_control');
    // If there are results, they should all be in the specified category
    for (const req of result.results.requirements) {
      expect(req.category).toBe('access_control');
    }
  });

  it('each requirement has expected fields', () => {
    const result = handleToolCall(db as any, 'get_cybersecurity_requirements', {
      sector: 'telecom',
    }) as any;
    for (const req of result.results.requirements) {
      expect(req).toHaveProperty('id');
      expect(req).toHaveProperty('requirement');
      expect(req).toHaveProperty('regulator_id');
    }
  });
});
