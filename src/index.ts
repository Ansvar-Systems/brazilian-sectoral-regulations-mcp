#!/usr/bin/env node
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import type { Db } from './tools/common.js';
import { TOOL_DEFINITIONS, handleToolCall } from './tools/registry.js';

export const SERVER_NAME = 'brazilian-sectoral-regulations-mcp';
export const VERSION = '0.1.0';
export const DB_ENV_VAR = 'BRAZILIAN_SECTORAL_DB_PATH';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

function openDatabase(): Db {
  const dbPath = process.env[DB_ENV_VAR];

  try {
    const BetterSqlite3 = require('better-sqlite3');

    const resolvedPath =
      dbPath ?? join(__dirname, '..', '..', 'data', 'database.db');

    return new BetterSqlite3(resolvedPath, { readonly: true }) as Db;
  } catch {
    throw new Error(
      `Cannot open database. Set ${DB_ENV_VAR} or ensure better-sqlite3 is installed.`,
    );
  }
}

// --- Server setup ---

const server = new Server(
  { name: SERVER_NAME, version: VERSION },
  { capabilities: { tools: {} } },
);

const db = openDatabase();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = handleToolCall(db, name, args ?? {});
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Graceful shutdown
function shutdown() {
  try {
    (db as unknown as { close?: () => void }).close?.();
  } catch {
    // ignore
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const transport = new StdioServerTransport();
await server.connect(transport);
