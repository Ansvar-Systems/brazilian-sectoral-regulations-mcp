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

describe('get_provision', () => {
  it('retrieves a valid provision for ANATEL', () => {
    const result = handleToolCall(db as any, 'get_provision', {
      regulator: 'ANATEL',
      regulation_id: 'anatel-res-740',
      article: 'Art. 1',
    }) as any;
    expect(result.results).toBeDefined();
    expect(result.results.error).toBeUndefined();
    expect(result.results.regulator_id).toBe('ANATEL');
    expect(result.results.content).toBeTruthy();
  });

  it('returns error for non-existent provision', () => {
    const result = handleToolCall(db as any, 'get_provision', {
      regulator: 'ANATEL',
      regulation_id: 'anatel-res-740',
      article: 'Art. 99999',
    }) as any;
    expect(result.results.error).toBeDefined();
    expect(result.results.error).toContain('Provision not found');
  });

  it('handles article with "Art." prefix normalization', () => {
    const result = handleToolCall(db as any, 'get_provision', {
      regulator: 'ANATEL',
      regulation_id: 'anatel-res-740',
      article: 'Art. 1',
    }) as any;
    expect(result.results.error).toBeUndefined();
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'get_provision', {
      regulator: 'ANATEL',
      regulation_id: 'anatel-res-740',
      article: 'Art. 1',
    }) as any;
    expect(result._metadata).toBeDefined();
  });
});
