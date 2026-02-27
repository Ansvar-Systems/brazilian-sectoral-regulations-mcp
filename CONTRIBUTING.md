# Contributing to Brazilian Sectoral Regulations MCP

Thank you for your interest in contributing. This document provides guidelines for contributing.

## Ways to Contribute

- **Bug fixes** -- found a bug? Submit a fix
- **New regulations** -- add support for additional sectoral regulations
- **Data quality** -- improve accuracy of ingested regulatory text
- **Documentation** -- improve docs, fix typos, add examples
- **Test coverage** -- add tests for edge cases

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp.git
cd brazilian-sectoral-regulations-mcp

# Install dependencies
npm install

# Build the database
npm run build:db

# Build TypeScript
npm run build

# Run tests
npm test
```

## Submitting Changes

### Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `dev` for your feature (`git checkout -b feature/my-feature dev`)
3. **Make your changes** following the code style guidelines below
4. **Run tests** to ensure nothing is broken (`npm test`)
5. **Commit** with a clear message following conventional commits
6. **Push** to your fork
7. **Open a Pull Request** targeting `dev` (not `main`)

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` -- new feature
- `fix` -- bug fix
- `docs` -- documentation only
- `refactor` -- code change that neither fixes a bug nor adds a feature
- `test` -- adding or updating tests
- `chore` -- maintenance tasks

**Examples:**
```
feat(anatel): add Resolucao 740 cybersecurity requirements
fix(search): handle empty FTS5 query gracefully
docs(readme): update installation instructions
```

## Code Style

- **TypeScript** -- all code must be TypeScript with strict mode
- **No `any` types** -- use proper typing
- **Prepared statements** -- always use parameterized queries for SQL
- **Anti-slop** -- no banned words per ADR-009 (see CLAUDE.md)

## Adding New Regulations

1. Add seed data to `data/seed/` following existing JSON format
2. Update `scripts/ingest.ts` if adding a new data source
3. Run `npm run build:db` to rebuild the database
4. Add tests for the new data
5. Update `COVERAGE.md` and `data/coverage.json`

## Testing

```bash
# Run all tests
npm test

# Lint check
npm run lint

# Full validation
npm run validate
```

## Questions?

- Open a [GitHub Discussion](https://github.com/Ansvar-Systems/brazilian-sectoral-regulations-mcp/discussions)
- Email: hello@ansvar.eu

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.
