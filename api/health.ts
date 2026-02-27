import type { VercelRequest, VercelResponse } from '@vercel/node';
import Database from '@ansvar/mcp-sqlite';
import { join } from 'path';
import { existsSync, copyFileSync, rmSync } from 'fs';

const SOURCE_DB =
  process.env.BRAZILIAN_SECTORAL_DB_PATH ||
  join(process.cwd(), 'data', 'database.db');
const TMP_DB = '/tmp/database.db';
const TMP_DB_LOCK = '/tmp/database.db.lock';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    if (existsSync(TMP_DB_LOCK)) {
      rmSync(TMP_DB_LOCK, { recursive: true, force: true });
    }
    if (!existsSync(TMP_DB)) {
      if (!existsSync(SOURCE_DB)) {
        res.status(500).json({ status: 'error', error: 'Database not found' });
        return;
      }
      copyFileSync(SOURCE_DB, TMP_DB);
    }

    const db = new Database(TMP_DB, { readonly: true });
    const count = (table: string): number => {
      try {
        return (db.prepare(`SELECT COUNT(*) AS cnt FROM ${table}`).get() as { cnt: number }).cnt;
      } catch {
        return 0;
      }
    };

    const result = {
      status: 'ok',
      server: 'brazilian-sectoral-regulations-mcp',
      regulators: count('regulators'),
      regulations: count('regulations'),
      provisions: count('provisions'),
    };

    (db as unknown as { close?: () => void }).close?.();
    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ status: 'error', error: message });
  }
}
