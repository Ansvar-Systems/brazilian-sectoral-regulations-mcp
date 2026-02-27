# Tools -- Brazilian Sectoral Regulations MCP

10 tools covering Brazilian sectoral regulatory intelligence across ANATEL, ANS, ANVISA, ANEEL, and ANAC.

---

## 1. search_regulations

Full-text search across all Brazilian sectoral regulations.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (Portuguese or English) |
| `sector` | string | No | Filter: `telecom`, `health_insurance`, `health_pharma`, `energy`, `aviation` |
| `regulator` | string | No | Filter: `ANATEL`, `ANS`, `ANVISA`, `ANEEL`, `ANAC` |
| `limit` | number | No | Max results (default 10, max 50) |

**Returns:** Matching provisions with regulation metadata, ranked by relevance.

**When to use:** User asks about telecom, health, energy, or aviation rules in Brazil without citing a specific article.

---

## 2. get_provision

Retrieve a single provision from a specific regulation.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `regulator` | string | Yes | `ANATEL`, `ANS`, `ANVISA`, `ANEEL`, `ANAC` |
| `regulation_id` | string | Yes | Regulation identifier (e.g., `resolucao-740`) |
| `article` | string | Yes | Article reference (e.g., `Art. 5`, `5`) |

**Returns:** Full article text with regulation metadata.

**When to use:** User cites a specific article number from a known regulation.

---

## 3. get_cybersecurity_requirements

Get cybersecurity requirements for a Brazilian sector.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sector` | string | Yes | `telecom`, `health_insurance`, `health_pharma`, `energy`, `aviation` |
| `category` | string | No | Filter: `access_control`, `incident_response`, `encryption`, etc. |

**Returns:** List of cybersecurity requirements with legal basis and category.

**When to use:** User asks about information security obligations or cyber rules for a sector.

---

## 4. get_certification_requirements

Get certification and approval requirements for products or services.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sector` | string | Yes | `telecom`, `health_insurance`, `health_pharma`, `energy`, `aviation` |
| `product_type` | string | No | Filter: `SaMD`, `telecom_equipment`, `medical_device`, etc. |

**Returns:** Required certifications with mandatory/optional flag and legal basis.

**When to use:** User asks what certifications are needed to operate or sell in a sector.

---

## 5. get_incident_reporting_rules

Get sector-specific incident reporting obligations.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sector` | string | Yes | `telecom`, `health_insurance`, `health_pharma`, `energy`, `aviation` |

**Returns:** Event types, timelines, reporting channels, penalties, and legal basis.

**When to use:** User asks about breach notification, incident timelines, or reporting channels.

---

## 6. get_regulator_info

Get information about a Brazilian sectoral regulatory authority.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sector` | string | Yes | `telecom`, `health_insurance`, `health_pharma`, `energy`, `aviation` |

**Returns:** Authority details (name, website, enforcement powers) and regulation/provision counts.

**When to use:** User asks who regulates a sector or what enforcement powers an agency has.

---

## 7. check_applicability

Determine whether sectoral regulations apply to a described business activity.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sector` | string | Yes | The sector to check against |
| `activity_description` | string | Yes | Description of the business activity or product |

**Returns:** Matching applicability rules with conditions and legal basis.

**When to use:** User wants to know if their product or operation falls under sector-specific rules.

**Limitation:** Keyword-based matching. Indicative, not definitive. Always recommend professional review.

---

## 8. list_sources

List all data sources with record counts and freshness metadata.

**Parameters:** None.

**Returns:** Source inventory with URLs, authorities, last fetch dates, and record counts.

**When to use:** Understand data provenance and coverage before relying on results.

---

## 9. about

Return server identity, scope, data totals, and capabilities.

**Parameters:** None.

**Returns:** Server name, version, domain, description, regulator list, table counts, and build timestamp.

**When to use:** First call to understand what this server covers.

---

## 10. check_data_freshness

Check data freshness and identify stale sources.

**Parameters:** None.

**Returns:** Per-source freshness status (fresh/stale/unknown) with days-since-fetch and overall status.

**When to use:** Verify data currency before making compliance decisions.
