/**
 * Tool registry — shared between stdio (src/index.ts) and Vercel (api/mcp.ts).
 *
 * Exports TOOL_DEFINITIONS and handleToolCall without starting any transport.
 */
import type { Db } from './common.js';
import { searchRegulations } from './search-regulations.js';
import { getProvision } from './get-provision.js';
import { getCybersecurityRequirements } from './cybersecurity-requirements.js';
import { getCertificationRequirements } from './certification-requirements.js';
import { getIncidentReportingRules } from './incident-reporting.js';
import { getRegulatorInfo } from './regulator-info.js';
import { checkApplicability } from './check-applicability.js';
import { listSources } from './list-sources.js';
import { about } from './about.js';
import { checkDataFreshness } from './check-data-freshness.js';

export const TOOL_DEFINITIONS = [
  {
    name: 'search_regulations',
    description:
      'Full-text search across all Brazilian sectoral regulations from ANATEL, ANS, ANVISA, ANEEL, and ANAC. Use when the user asks about telecom, health, energy, or aviation rules in Brazil.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          minLength: 1,
          description: 'Search query (Portuguese or English)',
        },
        sector: {
          type: 'string',
          enum: ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'],
          description: 'Filter by sector',
        },
        regulator: {
          type: 'string',
          enum: ['ANATEL', 'ANS', 'ANVISA', 'ANEEL', 'ANAC'],
          description: 'Filter by regulator',
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return (default 10, max 50)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_provision',
    description:
      'Retrieve a single provision (article) from a specific sectoral regulation. Use when the user cites a specific article number within a regulation.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        regulator: {
          type: 'string',
          enum: ['ANATEL', 'ANS', 'ANVISA', 'ANEEL', 'ANAC'],
          description: 'Regulator that issued the regulation',
        },
        regulation_id: {
          type: 'string',
          description: 'Regulation identifier (e.g., "resolucao-740")',
        },
        article: {
          type: 'string',
          description: 'Article reference (e.g., "Art. 5", "5")',
        },
      },
      required: ['regulator', 'regulation_id', 'article'],
    },
  },
  {
    name: 'get_cybersecurity_requirements',
    description:
      'Get cybersecurity requirements applicable to a Brazilian sector. Use when the user asks about cyber rules, information security obligations, or data protection requirements for a specific sector.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        sector: {
          type: 'string',
          enum: ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'],
          description: 'The regulated sector',
        },
        category: {
          type: 'string',
          description: 'Filter by requirement category (e.g., "access_control", "incident_response", "encryption")',
        },
      },
      required: ['sector'],
    },
  },
  {
    name: 'get_certification_requirements',
    description:
      'Get certification and approval requirements for products or services in a Brazilian sector. Use when the user asks what certifications are needed to operate in a sector or sell a product type.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        sector: {
          type: 'string',
          enum: ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'],
          description: 'The regulated sector',
        },
        product_type: {
          type: 'string',
          description: 'Filter by product or service type (e.g., "SaMD", "telecom_equipment", "medical_device")',
        },
      },
      required: ['sector'],
    },
  },
  {
    name: 'get_incident_reporting_rules',
    description:
      'Get sector-specific incident reporting obligations in Brazil. Use when the user asks about breach notification timelines, reporting channels, or penalties for non-reporting.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        sector: {
          type: 'string',
          enum: ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'],
          description: 'The regulated sector',
        },
      },
      required: ['sector'],
    },
  },
  {
    name: 'get_regulator_info',
    description:
      'Get information about a Brazilian sectoral regulatory authority, including its mandate, enforcement powers, and contact details. Use when the user asks who regulates a sector.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        sector: {
          type: 'string',
          enum: ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'],
          description: 'The regulated sector',
        },
      },
      required: ['sector'],
    },
  },
  {
    name: 'check_applicability',
    description:
      'Determine whether Brazilian sectoral regulations apply to a described business activity. Use when the user wants to know if their product, service, or operation falls under sector-specific rules.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        sector: {
          type: 'string',
          enum: ['telecom', 'health_insurance', 'health_pharma', 'energy', 'aviation'],
          description: 'The sector to check against',
        },
        activity_description: {
          type: 'string',
          description: 'Description of the business activity or product to check',
        },
      },
      required: ['sector', 'activity_description'],
    },
  },
  {
    name: 'list_sources',
    description:
      'List all data sources with record counts and freshness metadata. Use to understand what data is available and when it was last updated.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'about',
    description:
      'Return server identity, scope, data totals, and capabilities. Use as a first call to understand what this server covers.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'check_data_freshness',
    description:
      'Check data freshness and identify stale sources. Use to verify whether the data is current before relying on it for compliance decisions.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

export function handleToolCall(
  db: Db,
  name: string,
  args: Record<string, unknown>,
): unknown {
  switch (name) {
    case 'search_regulations':
      return searchRegulations(db, args as unknown as Parameters<typeof searchRegulations>[1]);
    case 'get_provision':
      return getProvision(db, args as unknown as Parameters<typeof getProvision>[1]);
    case 'get_cybersecurity_requirements':
      return getCybersecurityRequirements(db, args as unknown as Parameters<typeof getCybersecurityRequirements>[1]);
    case 'get_certification_requirements':
      return getCertificationRequirements(db, args as unknown as Parameters<typeof getCertificationRequirements>[1]);
    case 'get_incident_reporting_rules':
      return getIncidentReportingRules(db, args as unknown as Parameters<typeof getIncidentReportingRules>[1]);
    case 'get_regulator_info':
      return getRegulatorInfo(db, args as unknown as Parameters<typeof getRegulatorInfo>[1]);
    case 'check_applicability':
      return checkApplicability(db, args as unknown as Parameters<typeof checkApplicability>[1]);
    case 'list_sources':
      return listSources(db);
    case 'about':
      return about(db);
    case 'check_data_freshness':
      return checkDataFreshness(db);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
