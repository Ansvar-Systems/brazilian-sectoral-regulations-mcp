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

describe('check_applicability', () => {
  it('returns matching rules for telecom sector activity', () => {
    const result = handleToolCall(db as any, 'check_applicability', {
      sector: 'telecom',
      activity_description: 'mobile network operator providing internet access',
    }) as any;
    expect(result.results.sector).toBe('telecom');
    expect(result.results.activity_description).toBeTruthy();
    expect(result.results.total_matches).toBeGreaterThanOrEqual(0);
    expect(result.results.note).toBeTruthy();
  });

  it('returns empty results for very short activity description', () => {
    const result = handleToolCall(db as any, 'check_applicability', {
      sector: 'telecom',
      activity_description: 'ab',
    }) as any;
    expect(result.results.total_matches).toBe(0);
    expect(result.results.note).toContain('No meaningful keywords');
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'check_applicability', {
      sector: 'telecom',
      activity_description: 'telecom service provider',
    }) as any;
    expect(result._metadata).toBeDefined();
  });
});
