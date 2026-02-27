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

describe('search_regulations', () => {
  it('returns results when searching "seguranca"', () => {
    const result = handleToolCall(db as any, 'search_regulations', {
      query: 'seguranca',
    }) as any;
    expect(result.results.total).toBeGreaterThan(0);
    expect(result.results.provisions.length).toBeGreaterThan(0);
  });

  it('filters by sector "telecom"', () => {
    const result = handleToolCall(db as any, 'search_regulations', {
      query: 'seguranca',
      sector: 'telecom',
    }) as any;
    for (const p of result.results.provisions) {
      expect(p.sector).toBe('telecom');
    }
  });

  it('filters by regulator "ANATEL"', () => {
    const result = handleToolCall(db as any, 'search_regulations', {
      query: 'dados',
      regulator: 'ANATEL',
    }) as any;
    for (const p of result.results.provisions) {
      expect(p.regulator_id).toBe('ANATEL');
    }
  });

  it('caps results at the specified limit', () => {
    const result = handleToolCall(db as any, 'search_regulations', {
      query: 'seguranca',
      limit: 2,
    }) as any;
    expect(result.results.provisions.length).toBeLessThanOrEqual(2);
  });

  it('returns clean message for special-character-only query', () => {
    const result = handleToolCall(db as any, 'search_regulations', {
      query: '!!!***',
    }) as any;
    expect(result.results.total).toBe(0);
    expect(result.results.message).toContain('special characters');
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'search_regulations', {
      query: 'telecom',
    }) as any;
    expect(result._metadata).toBeDefined();
    expect(result._metadata.disclaimer).toBeTruthy();
  });
});
