# Skill Tree

**Search, audit, and classify AI Agent skills.**

Skill Tree is a security-first directory for Claude Code / AI agent skills. It helps users discover useful skills, understand what they do, and evaluate risk before installation.

## Why Skill Tree

The skill ecosystem is growing quickly, but discovery and trust are fragmented.

Most directories answer **what exists**.
Skill Tree is built to answer two harder questions:
1. **What does this skill actually do?**
2. **Should I trust it in my environment?**

Skill Tree combines:
- structured skill metadata,
- human-readable summaries,
- machine-readable JSON output,
- category-based discovery,
- and evidence-backed security audit results.

## What we have now

Phase 1 is complete.

Current project assets:
- **50 curated skills** in the initial catalog
- **10 deep audit reports** for high-priority / high-interest skills
- **schema v1** for normalized skill records
- **taxonomy v1** for category-based browsing
- **GitHub-native repo structure** for catalog, audits, and reports

This repository is designed for both:
- **humans** browsing skills and audit summaries
- **agents** consuming structured JSON/YAML-compatible metadata

## Core Features

- **Discovery**: find skills by category, keyword, or use case
- **Security audit**: review network access, file writes, shell execution, permissions, and risky code patterns
- **Classification**: browse a consistent skill taxonomy instead of scattered repos
- **Dual format**: optimized for both human review and agent consumption

## Why this matters

AI agent skills can be powerful, but they can also:
- call external services,
- write or modify local files,
- request browser or shell access,
- or hide risky behavior behind unclear setup instructions.

Skill Tree makes those risks visible earlier.

## Repository Structure

```text
schema/      JSON schema for skill records
catalog/     Catalog data and taxonomy
audits/      Security audit outputs
docs/        Product spec, taxonomy, and audit methodology
reports/     Ecosystem and summary reports
assets/      Wireframes and diagrams
tools/       Ingestion, normalization, and audit utilities
web/         Static Web UI MVP (Phase 2)
```

## Data Model

Each skill record includes:
- identity and summary
- source repository metadata
- category and tags
- compatibility
- capabilities
- security posture
- audit findings
- discovery and scoring metadata

See `schema/skill.schema.json` for the normalized schema.

## Category System

Each skill has:
- **one primary category**
- optional secondary categories and tags

Current primary categories:
- development
- research
- productivity
- communication
- data-analysis
- security-compliance
- agent-operations
- system-environment
- creativity

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

## Audit Methodology

Our audit model is intentionally simple and repeatable.

We look for signals such as:
- outbound network requests
- file write / delete behavior
- shell or subprocess execution
- browser control or external automation
- credential handling
- obfuscation, eval/exec, or suspicious persistence patterns

Audit output is split into layers:
1. **Security summary** — fast human scan
2. **Flags / findings** — normalized machine-readable findings
3. **Evidence** — path/snippet references when available
4. **Recommendation** — use / review / avoid

## Real Progress So Far

Built and delivered in the current project cycle:
- Product spec + taxonomy + schema
- First 50-skill catalog
- First 10 deep security reviews
- Initial repository structure and docs

This gives us a working foundation for:
- expanding to 100+ skills,
- standardizing audit output,
- and publishing a browsable static Web UI.

## Example Use Cases

### 1. Find a skill for a task
Search by keyword or browse a category like `development` or `security-compliance`.

### 2. Review before installation
Check whether a skill writes files, executes shell commands, or reaches external networks before you install it.

### 3. Compare alternatives
Use category + summary + risk rating to compare skills with similar functions.

### 4. Build internal policy
Teams can use the schema and audit outputs as a lightweight review layer before approving skills for local environments.

## Current Status

- ✅ T-042 product spec integrated
- ✅ Schema v1 added
- ✅ Initial 50-skill catalog integrated
- ✅ First audit batch completed
- ✅ Search-ready shortlist index integrated (`catalog/index.json`)
- ✅ Index layer now includes `security_rating` and `collection_status`
- ⏳ Schema-aligned automated audit output expansion in progress
- ⏳ Static Web UI MVP in progress

## Roadmap

### Phase 2
1. Align automated audit output to the canonical schema
2. Publish 10 standardized audit artifacts in-repo
3. Expand catalog coverage from 50 → 100 skills
4. Ship a static Web UI MVP
5. Improve README and launch messaging with real examples and audit data

## Contribution Principles

1. Prefer structured data over ad hoc notes.
2. Prefer evidence-backed security claims.
3. Keep summaries short and useful.
4. Treat risk communication as a core product surface.
5. Default to clarity over hype.

## Vision

Skill Tree aims to become the default trust layer for AI agent skills:
- discoverable like a directory,
- inspectable like a security report,
- and usable by both humans and agents.
