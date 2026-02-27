import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from '@ansvar/mcp-sqlite';
import { handleToolCall, TOOL_DEFINITIONS } from '../../src/tools/registry.js';
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

describe('about', () => {
  it('returns server name, version, and domain', () => {
    const result = handleToolCall(db as any, 'about', {}) as any;
    expect(result.results.server).toBe('brazilian-sectoral-regulations-mcp');
    expect(result.results.version).toBe('0.1.0');
    expect(result.results.domain).toBe('brazilian-sectoral-regulations');
  });

  it('lists all 5 regulators', () => {
    const result = handleToolCall(db as any, 'about', {}) as any;
    expect(result.results.regulators).toHaveLength(5);
    const ids = result.results.regulators.map((r: any) => r.id);
    expect(ids).toContain('ANATEL');
    expect(ids).toContain('ANS');
    expect(ids).toContain('ANVISA');
    expect(ids).toContain('ANEEL');
    expect(ids).toContain('ANAC');
  });

  it('reports non-zero table counts', () => {
    const result = handleToolCall(db as any, 'about', {}) as any;
    expect(result.results.table_counts.provisions).toBeGreaterThan(0);
    expect(result.results.table_counts.regulations).toBeGreaterThan(0);
  });

  it('reports capabilities based on populated tables', () => {
    const result = handleToolCall(db as any, 'about', {}) as any;
    expect(result.results.capabilities).toContain('provisions');
    expect(result.results.capabilities).toContain('regulations');
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'about', {}) as any;
    expect(result._metadata).toBeDefined();
    expect(result._metadata.disclaimer).toBeTruthy();
  });
});

describe('list_sources', () => {
  it('returns 5 sources', () => {
    const result = handleToolCall(db as any, 'list_sources', {}) as any;
    expect(result.results.sources).toHaveLength(5);
  });

  it('returns accurate totals', () => {
    const result = handleToolCall(db as any, 'list_sources', {}) as any;
    expect(result.results.totals.sources).toBe(5);
    expect(result.results.totals.provisions).toBeGreaterThan(0);
    expect(result.results.totals.regulations).toBeGreaterThan(0);
  });

  it('includes _metadata in response', () => {
    const result = handleToolCall(db as any, 'list_sources', {}) as any;
    expect(result._metadata).toBeDefined();
  });
});

describe('check_data_freshness', () => {
  it('returns freshness data with threshold', () => {
    const result = handleToolCall(db as any, 'check_data_freshness', {}) as any;
    expect(result).toBeDefined();
    expect(result._metadata).toBeDefined();
  });
});

describe('TOOL_DEFINITIONS', () => {
  it('contains 10 tool definitions', () => {
    expect(TOOL_DEFINITIONS).toHaveLength(10);
  });

  it('each tool has name, description, and inputSchema', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }
  });
});

describe('handleToolCall error handling', () => {
  it('throws for unknown tool', () => {
    expect(() => handleToolCall(db as any, 'nonexistent_tool', {})).toThrow(
      'Unknown tool',
    );
  });
});
