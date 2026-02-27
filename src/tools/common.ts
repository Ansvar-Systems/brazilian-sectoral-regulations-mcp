/** Minimal database interface compatible with both better-sqlite3 and @ansvar/mcp-sqlite */
export interface Db {
  prepare(sql: string): {
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
    run(...params: unknown[]): unknown;
  };
  pragma(sql: string): unknown;
}

export interface RegulatorInfo {
  id: string;
  name: string;
  full_name: string;
  sector: string;
}

export const REGULATORS: RegulatorInfo[] = [
  {
    id: 'ANATEL',
    name: 'ANATEL',
    full_name: 'Agencia Nacional de Telecomunicacoes',
    sector: 'telecom',
  },
  {
    id: 'ANS',
    name: 'ANS',
    full_name: 'Agencia Nacional de Saude Suplementar',
    sector: 'health_insurance',
  },
  {
    id: 'ANVISA',
    name: 'ANVISA',
    full_name: 'Agencia Nacional de Vigilancia Sanitaria',
    sector: 'health_pharma',
  },
  {
    id: 'ANEEL',
    name: 'ANEEL',
    full_name: 'Agencia Nacional de Energia Eletrica',
    sector: 'energy',
  },
  {
    id: 'ANAC',
    name: 'ANAC',
    full_name: 'Agencia Nacional de Aviacao Civil',
    sector: 'aviation',
  },
];

export const SECTORS = [
  'telecom',
  'health_insurance',
  'health_pharma',
  'energy',
  'aviation',
] as const;

export type Sector = (typeof SECTORS)[number];

/** Clamp a user-supplied limit to the range [1, max]. */
export function clampLimit(input: number | undefined, max = 50, fallback = 10): number {
  if (input == null) return fallback;
  if (input < 1) return 1;
  if (input > max) return max;
  return Math.floor(input);
}

/**
 * Build a robust FTS5 query from user input.
 * - Strips FTS5 special chars
 * - Adds prefix matching (word*) for cross-language partial matching
 * - Returns null for empty/whitespace-only input
 */
export function buildFtsQuery(raw: string): string | null {
  const cleaned = raw
    .replace(/["\*\(\)\{\}\[\]:^~!@#$%&|\\<>=;,]/g, ' ')
    .replace(/\b(AND|OR|NOT|NEAR)\b/gi, '')
    .trim();

  if (!cleaned) return null;

  const tokens = cleaned.split(/\s+/).filter(t => t.length > 0);
  if (tokens.length === 0) return null;

  return tokens.map(t => `"${t}"*`).join(' ');
}

/** @deprecated Use buildFtsQuery instead */
export function escapeFTS5Query(raw: string): string {
  return buildFtsQuery(raw) ?? '';
}

/** Calculate number of days since a date string. */
export function daysSince(isoDate: string): number {
  const then = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

/** Convert a Date or date string to ISO date (YYYY-MM-DD). */
export function toIsoDate(date?: Date | string): string {
  if (!date) return new Date().toISOString().slice(0, 10);
  if (typeof date === 'string') return date.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

/** Look up regulator info by ID or sector. */
export function findRegulator(idOrSector: string): RegulatorInfo | undefined {
  const normalized = idOrSector.toUpperCase();
  const byId = REGULATORS.find((r) => r.id === normalized);
  if (byId) return byId;
  return REGULATORS.find((r) => r.sector === idOrSector.toLowerCase());
}

/** Validate that a sector string is one of the known sectors. */
export function isValidSector(s: string): s is Sector {
  return (SECTORS as readonly string[]).includes(s.toLowerCase());
}
