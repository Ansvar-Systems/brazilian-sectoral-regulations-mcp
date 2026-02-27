export interface ResponseMetadata {
  disclaimer: string;
  data_freshness: {
    last_ingested: string;
    staleness_warning: string | null;
  };
  source_authority: string;
  ai_disclosure: string;
  server: string;
  version: string;
}

const STALE_THRESHOLD_DAYS = 90;

export function buildMeta(): ResponseMetadata {
  const lastIngested = '2026-02-27';
  const daysSince = Math.floor(
    (Date.now() - new Date(lastIngested).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    disclaimer: 'Reference tool only. Not legal advice. Verify against official gazettes and consult qualified legal counsel.',
    data_freshness: {
      last_ingested: lastIngested,
      staleness_warning: daysSince > STALE_THRESHOLD_DAYS
        ? `Data is ${daysSince} days old. Re-run ingestion to refresh.`
        : null,
    },
    source_authority: 'Brazilian sectoral regulatory agencies: ANATEL, ANS, ANVISA, ANEEL, ANAC',
    ai_disclosure: 'This data is served by an MCP server for AI assistant consumption. Always verify citations against primary sources.',
    server: 'brazilian-sectoral-regulations-mcp',
    version: '0.1.0',
  };
}

export interface ToolResponse<T> {
  results: T;
  _metadata: ResponseMetadata;
}
