# Contributing to Skill Tree

Thanks for contributing to Skill Tree.

## Principles

1. Security claims must be evidence-backed.
2. Prefer structured JSON artifacts over free-form notes.
3. One skill should have one canonical slug.
4. Use one primary category; add secondary tags only when helpful.
5. Keep summaries concise and factual.

## Repository Areas

- `catalog/` — curated skill records and taxonomy
- `audits/` — per-skill audit JSON/Markdown reports
- `schema/` — JSON schema definitions
- `docs/` — methodology and governance docs
- `reports/` — ecosystem-level summaries
- `tools/` — ingestion, normalization, and audit utilities

## Adding a New Skill

1. Create or update the entry in `catalog/skills-catalog-v1.json`.
2. Validate against `schema/skill.schema.json`.
3. Assign one primary category.
4. Add a security summary and initial audit status.
5. If reviewed in depth, add:
   - `audits/<skill-slug>.json`
   - `audits/<skill-slug>.md`

## Audit Guidelines

Review at minimum:
- network access
- file writes/modifications
- shell execution
- browser control
- credentials access
- suspicious code patterns (`eval`, `exec`, obfuscation, persistence)

## Risk Levels

- **low**: expected behavior, low privilege, transparent implementation
- **medium**: elevated capabilities or unclear behavior
- **high**: risky patterns, broad permissions, or weak transparency
- **critical**: malicious indicators or clearly unsafe behavior

## Pull Request Checklist

- [ ] schema-valid JSON
- [ ] slug/id naming is canonical
- [ ] category chosen from taxonomy
- [ ] security summary added
- [ ] audit findings include evidence when available
- [ ] README/docs links remain accurate

## Licensing

By contributing, you agree that your contributions are licensed under the repository license.
