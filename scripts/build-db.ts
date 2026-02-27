#!/usr/bin/env tsx
/**
 * build-db.ts — Build the SQLite database for Brazilian Sectoral Regulations MCP.
 *
 * Usage:
 *   npx tsx scripts/build-db.ts
 *
 * Reads seed data from data/seed/ and produces data/database.db.
 */
import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'data', 'database.db');
const SEED_DIR = join(ROOT, 'data', 'seed');

// Ensure data directory exists
const dataDir = join(ROOT, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Remove old database
if (existsSync(DB_PATH)) {
  const { unlinkSync } = await import('fs');
  unlinkSync(DB_PATH);
}

const db = new Database(DB_PATH);

// Performance pragmas
db.pragma('journal_mode = DELETE');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// --- Schema ---

db.exec(`
  CREATE TABLE IF NOT EXISTS db_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS regulators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    website TEXT,
    enforcement_powers TEXT
  );

  CREATE TABLE IF NOT EXISTS regulations (
    id TEXT PRIMARY KEY,
    regulator_id TEXT NOT NULL REFERENCES regulators(id),
    title TEXT NOT NULL,
    official_number TEXT,
    year INTEGER,
    sector TEXT,
    status TEXT DEFAULT 'in_force',
    source_url TEXT,
    last_updated TEXT
  );

  CREATE TABLE IF NOT EXISTS provisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulation_id TEXT NOT NULL REFERENCES regulations(id),
    regulator_id TEXT NOT NULL,
    article_ref TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    topic TEXT,
    UNIQUE(regulation_id, article_ref)
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS provisions_fts USING fts5(
    content, title, article_ref,
    content='provisions', content_rowid='id'
  );

  -- Triggers to keep FTS in sync
  CREATE TRIGGER IF NOT EXISTS provisions_ai AFTER INSERT ON provisions BEGIN
    INSERT INTO provisions_fts(rowid, content, title, article_ref)
    VALUES (new.id, new.content, new.title, new.article_ref);
  END;

  CREATE TRIGGER IF NOT EXISTS provisions_ad AFTER DELETE ON provisions BEGIN
    INSERT INTO provisions_fts(provisions_fts, rowid, content, title, article_ref)
    VALUES ('delete', old.id, old.content, old.title, old.article_ref);
  END;

  CREATE TRIGGER IF NOT EXISTS provisions_au AFTER UPDATE ON provisions BEGIN
    INSERT INTO provisions_fts(provisions_fts, rowid, content, title, article_ref)
    VALUES ('delete', old.id, old.content, old.title, old.article_ref);
    INSERT INTO provisions_fts(rowid, content, title, article_ref)
    VALUES (new.id, new.content, new.title, new.article_ref);
  END;

  CREATE TABLE IF NOT EXISTS cybersecurity_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulator_id TEXT REFERENCES regulators(id),
    sector TEXT NOT NULL,
    requirement TEXT NOT NULL,
    legal_basis TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS certification_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulator_id TEXT REFERENCES regulators(id),
    sector TEXT NOT NULL,
    product_type TEXT,
    certification_name TEXT NOT NULL,
    description TEXT,
    legal_basis TEXT,
    mandatory INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS incident_reporting_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulator_id TEXT REFERENCES regulators(id),
    sector TEXT NOT NULL,
    event_type TEXT NOT NULL,
    timeline TEXT,
    channel TEXT,
    penalties TEXT,
    legal_basis TEXT
  );

  CREATE TABLE IF NOT EXISTS applicability_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulator_id TEXT REFERENCES regulators(id),
    sector TEXT NOT NULL,
    activity_pattern TEXT NOT NULL,
    applies INTEGER DEFAULT 1,
    conditions TEXT,
    legal_basis TEXT
  );

  CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    authority TEXT,
    jurisdiction TEXT DEFAULT 'Brazil',
    source_url TEXT,
    last_fetched TEXT,
    last_updated TEXT,
    item_count INTEGER DEFAULT 0
  );

  -- Indexes for common query patterns
  CREATE INDEX IF NOT EXISTS idx_regulations_regulator ON regulations(regulator_id);
  CREATE INDEX IF NOT EXISTS idx_regulations_sector ON regulations(sector);
  CREATE INDEX IF NOT EXISTS idx_provisions_regulation ON provisions(regulation_id);
  CREATE INDEX IF NOT EXISTS idx_provisions_regulator ON provisions(regulator_id);
  CREATE INDEX IF NOT EXISTS idx_cyber_sector ON cybersecurity_requirements(sector);
  CREATE INDEX IF NOT EXISTS idx_cert_sector ON certification_requirements(sector);
  CREATE INDEX IF NOT EXISTS idx_incident_sector ON incident_reporting_rules(sector);
  CREATE INDEX IF NOT EXISTS idx_applicability_sector ON applicability_rules(sector);
`);

// --- Seed data ---

function loadJsonSeed<T>(filename: string): T[] {
  const path = join(SEED_DIR, filename);
  if (!existsSync(path)) {
    console.log(`  Seed file not found, skipping: ${filename}`);
    return [];
  }
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw) as T[];
}

// Load and insert regulators
interface RegulatorSeed {
  id: string;
  name: string;
  full_name: string;
  sector: string;
  website?: string;
  enforcement_powers?: string;
}

const regulators = loadJsonSeed<RegulatorSeed>('regulators.json');
const insertRegulator = db.prepare(`
  INSERT OR REPLACE INTO regulators (id, name, full_name, sector, website, enforcement_powers)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const r of regulators) {
  insertRegulator.run(r.id, r.name, r.full_name, r.sector, r.website ?? null, r.enforcement_powers ?? null);
}

// Load and insert regulations
interface RegulationSeed {
  id: string;
  regulator_id: string;
  title: string;
  official_number?: string;
  year?: number;
  sector?: string;
  status?: string;
  source_url?: string;
  last_updated?: string;
}

const regulations = loadJsonSeed<RegulationSeed>('regulations.json');
const insertRegulation = db.prepare(`
  INSERT OR REPLACE INTO regulations (id, regulator_id, title, official_number, year, sector, status, source_url, last_updated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const r of regulations) {
  insertRegulation.run(
    r.id, r.regulator_id, r.title, r.official_number ?? null,
    r.year ?? null, r.sector ?? null, r.status ?? 'in_force',
    r.source_url ?? null, r.last_updated ?? null,
  );
}

// Load and insert provisions
interface ProvisionSeed {
  regulation_id: string;
  regulator_id: string;
  article_ref: string;
  title?: string;
  content: string;
  topic?: string;
}

const provisions = loadJsonSeed<ProvisionSeed>('provisions.json');
const insertProvision = db.prepare(`
  INSERT OR REPLACE INTO provisions (regulation_id, regulator_id, article_ref, title, content, topic)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const p of provisions) {
  insertProvision.run(
    p.regulation_id, p.regulator_id, p.article_ref,
    p.title ?? null, p.content, p.topic ?? null,
  );
}

// Load and insert cybersecurity requirements
interface CyberSeed {
  regulator_id: string;
  sector: string;
  requirement: string;
  legal_basis?: string;
  category?: string;
}

const cyberReqs = loadJsonSeed<CyberSeed>('cybersecurity_requirements.json');
const insertCyber = db.prepare(`
  INSERT INTO cybersecurity_requirements (regulator_id, sector, requirement, legal_basis, category)
  VALUES (?, ?, ?, ?, ?)
`);

for (const c of cyberReqs) {
  insertCyber.run(c.regulator_id, c.sector, c.requirement, c.legal_basis ?? null, c.category ?? null);
}

// Load and insert certification requirements
interface CertSeed {
  regulator_id: string;
  sector: string;
  product_type?: string;
  certification_name: string;
  description?: string;
  legal_basis?: string;
  mandatory?: number;
}

const certReqs = loadJsonSeed<CertSeed>('certification_requirements.json');
const insertCert = db.prepare(`
  INSERT INTO certification_requirements (regulator_id, sector, product_type, certification_name, description, legal_basis, mandatory)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const c of certReqs) {
  insertCert.run(
    c.regulator_id, c.sector, c.product_type ?? null,
    c.certification_name, c.description ?? null, c.legal_basis ?? null,
    c.mandatory ?? 1,
  );
}

// Load and insert incident reporting rules
interface IncidentSeed {
  regulator_id: string;
  sector: string;
  event_type: string;
  timeline?: string;
  channel?: string;
  penalties?: string;
  legal_basis?: string;
}

const incidentRules = loadJsonSeed<IncidentSeed>('incident_reporting_rules.json');
const insertIncident = db.prepare(`
  INSERT INTO incident_reporting_rules (regulator_id, sector, event_type, timeline, channel, penalties, legal_basis)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const i of incidentRules) {
  insertIncident.run(
    i.regulator_id, i.sector, i.event_type,
    i.timeline ?? null, i.channel ?? null, i.penalties ?? null,
    i.legal_basis ?? null,
  );
}

// Load and insert applicability rules
interface ApplicabilitySeed {
  regulator_id: string;
  sector: string;
  activity_pattern: string;
  applies?: number;
  conditions?: string;
  legal_basis?: string;
}

const applicabilityRules = loadJsonSeed<ApplicabilitySeed>('applicability_rules.json');
const insertApplicability = db.prepare(`
  INSERT INTO applicability_rules (regulator_id, sector, activity_pattern, applies, conditions, legal_basis)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const a of applicabilityRules) {
  insertApplicability.run(
    a.regulator_id, a.sector, a.activity_pattern,
    a.applies ?? 1, a.conditions ?? null, a.legal_basis ?? null,
  );
}

// Load and insert sources
interface SourceSeed {
  id: string;
  full_name: string;
  authority?: string;
  jurisdiction?: string;
  source_url?: string;
  last_fetched?: string;
  last_updated?: string;
  item_count?: number;
}

const sources = loadJsonSeed<SourceSeed>('sources.json');
const insertSource = db.prepare(`
  INSERT OR REPLACE INTO sources (id, full_name, authority, jurisdiction, source_url, last_fetched, last_updated, item_count)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const s of sources) {
  insertSource.run(
    s.id, s.full_name, s.authority ?? null, s.jurisdiction ?? 'Brazil',
    s.source_url ?? null, s.last_fetched ?? null, s.last_updated ?? null,
    s.item_count ?? 0,
  );
}

// --- Build metadata ---

db.prepare(`INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)`).run(
  'built_at',
  new Date().toISOString(),
);
db.prepare(`INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)`).run(
  'schema_version',
  '1.0.0',
);
db.prepare(`INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)`).run(
  'builder',
  'build-db.ts',
);
db.prepare(`INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)`).run(
  'domain',
  'brazilian-sectoral-regulations',
);

// --- Final stats ---

const regCount = (db.prepare('SELECT COUNT(*) AS cnt FROM regulators').get() as { cnt: number }).cnt;
const regxCount = (db.prepare('SELECT COUNT(*) AS cnt FROM regulations').get() as { cnt: number }).cnt;
const provCount = (db.prepare('SELECT COUNT(*) AS cnt FROM provisions').get() as { cnt: number }).cnt;
const cyberCount = (db.prepare('SELECT COUNT(*) AS cnt FROM cybersecurity_requirements').get() as { cnt: number }).cnt;
const certCount = (db.prepare('SELECT COUNT(*) AS cnt FROM certification_requirements').get() as { cnt: number }).cnt;
const incCount = (db.prepare('SELECT COUNT(*) AS cnt FROM incident_reporting_rules').get() as { cnt: number }).cnt;
const appCount = (db.prepare('SELECT COUNT(*) AS cnt FROM applicability_rules').get() as { cnt: number }).cnt;
const srcCount = (db.prepare('SELECT COUNT(*) AS cnt FROM sources').get() as { cnt: number }).cnt;

db.pragma('journal_mode = DELETE');
db.exec('VACUUM');
db.close();

console.log('Database built successfully at:', DB_PATH);
console.log('  Regulators:                ', regCount);
console.log('  Regulations:               ', regxCount);
console.log('  Provisions:                ', provCount);
console.log('  Cybersecurity requirements: ', cyberCount);
console.log('  Certification requirements: ', certCount);
console.log('  Incident reporting rules:   ', incCount);
console.log('  Applicability rules:        ', appCount);
console.log('  Sources:                    ', srcCount);
