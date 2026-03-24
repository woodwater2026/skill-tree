# Skill Tree

Search, audit, and classify AI Agent skills.

Skill Tree is a security-first directory for Claude Code / AI Agent skills. It helps users discover useful skills, understand what they do, and evaluate risk before use.

## Why Skill Tree

The skill ecosystem is growing quickly, but discovery and trust are fragmented.

Skill Tree solves this by combining:
- structured skill metadata,
- human-readable summaries,
- machine-readable JSON output,
- security audit results,
- category-based browsing.

## Core Features

- **Discovery**: find skills by category, keyword, or use case
- **Security audit**: review network access, file writes, permissions, and risky code patterns
- **Classification**: browse a consistent skill taxonomy
- **Dual format**: built for both humans and agents

## Repository Structure

```text
schema/      JSON schema for skill records
catalog/     Catalog data and taxonomy
audits/      Security audit outputs
reports/     Ecosystem and summary reports
docs/        Methodology and contribution guides
assets/      Wireframes and diagrams
tools/       Ingestion, normalization, and audit utilities
```

## Data Model

Each skill record includes:
- identity and summary
- source repository metadata
- category and tags
- compatibility
- security posture
- audit findings
- discovery and scoring metadata

See `schema/skill.schema.json` for the current schema draft.

## Security Ratings

Each skill receives one of four ratings:
- **low**
- **medium**
- **high**
- **critical**

Ratings are based on:
- network behavior
- file system behavior
- permissions/capabilities
- suspicious code patterns

## MVP Scope

The first version focuses on:
- taxonomy v1
- schema v1
- first catalog batch
- first audit batch
- static GitHub-readable structure
- future Web UI wireframe support

## Planned Outputs

- `catalog/skills-catalog-v1.json`
- per-skill audit reports
- ecosystem overview report
- security methodology docs
- Web UI prototype later

## Contribution Principles

1. Prefer structured data over ad hoc notes.
2. Prefer evidence-backed security claims.
3. Keep summaries short and useful.
4. Treat risk communication as a product surface.

## Current Status

- ✅ Product spec integrated from T-042
- ✅ Schema v1 added
- ✅ Initial catalog integrated from T-041
- ⏳ Deep audit batch (T-043) pending
- ⏳ Automated scanner/auditor (T-040) pending

## Roadmap

1. Validate and normalize the first 50 catalog entries.
2. Complete deep audit reports for the first 10 high-priority skills.
3. Add automated GitHub repo scanning and risk flag generation.
4. Publish a browsable static UI.
