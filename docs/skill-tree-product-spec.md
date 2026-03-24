# Skill Tree Product Spec

- Task: T-042
- Owner: 黄思博
- Created: 2026-03-24
- Status: Draft v1

## 1. Product Summary

**Skill Tree** is a searchable, auditable, structured directory for Claude Code / AI Agent skills.

Its purpose is to become the default place to:
- discover useful skills,
- understand what a skill does,
- evaluate security risk before use,
- browse the ecosystem through a consistent taxonomy,
- serve both humans (GitHub/Web UI) and agents (JSON/YAML).

## 2. Core Goals

### User goals
1. Quickly find the right skill for a task.
2. Understand whether a skill is safe enough to install/use.
3. Compare similar skills by function, popularity, and risk.
4. Browse the ecosystem by category instead of random repos.

### Business goals
1. Build authority in AI Agent skill discovery and security auditing.
2. Create a reusable dataset for future Web UI, APIs, and content.
3. Establish a security-first trust layer around skill adoption.
4. Support future growth from curated directory → audit platform → ecosystem standard.

## 3. Target Users

### Primary
- AI agent developers
- Claude Code / coding-agent power users
- teams managing internal agent workflows
- users evaluating third-party skills before installation

### Secondary
- skill creators who want discoverability
- security-conscious teams doing lightweight due diligence
- researchers tracking the skill ecosystem

## 4. Product Principles

1. **Security first**: every skill page should surface risk clearly.
2. **Structured by default**: all catalog data must be machine-readable.
3. **Human-friendly summaries**: short, useful, non-jargony descriptions.
4. **Progressive depth**: summary first, audit detail on drill-down.
5. **Composable taxonomy**: categories should scale as the ecosystem grows.
6. **Low-friction ingestion**: schema must support manual curation and automated scanning.

## 5. Information Architecture

### Top-level entities
1. **Skill**
2. **Source Repository**
3. **Audit Result**
4. **Category / Skill Tree Node**
5. **Maintainer / Publisher**
6. **Version / Snapshot**

### Core user flows
1. Search for a skill by keyword.
2. Browse by category tree.
3. Open a skill detail page.
4. Review security summary.
5. Expand into detailed audit report.
6. Compare alternatives in same category.

## 6. Category System

The taxonomy should be hierarchical but pragmatic. A skill can belong to:
- **one primary category**
- **multiple secondary tags**

### Proposed category tree

#### A. Development
- Code generation
- Refactoring
- Debugging
- Testing
- Code review
- Documentation
- DevOps / CI

#### B. Research
- Web research
- Competitive analysis
- Market analysis
- Data gathering
- Summarization

#### C. Productivity
- Task management
- Workflow automation
- Personal knowledge
- Note processing
- Scheduling / planning

#### D. Communication
- Messaging
- Email / outreach
- Social posting
- Meeting support
- Translation

#### E. Data & Analysis
- Data extraction
- Data cleaning
- Visualization
- Reporting
- Monitoring
- Observability

#### F. Security & Compliance
- Security audit
- Permission review
- Secret scanning
- Policy enforcement
- Risk assessment

#### G. Agent Operations
- Agent orchestration
- Context management
- Budget management
- Session recovery
- Memory management
- Tool routing

#### H. System / Environment
- Environment setup
- Dependency management
- File management
- Browser automation
- Local system integration

#### I. Creativity
- Writing
- Design
- Image/media workflows
- Brainstorming

## 7. Skill Metadata Model

Each skill record should include:
- identity
- source
- taxonomy
- function summary
- popularity signals
- compatibility
- security posture
- audit summary
- maintenance health

### Required fields
- `id`
- `name`
- `slug`
- `primary_category`
- `summary`
- `source`
- `security`
- `audit`
- `discovery`
- `updated_at`

### Important optional fields
- `secondary_categories`
- `tags`
- `stars`
- `license`
- `maintainer`
- `compatibility`
- `versions`
- `examples`
- `readme_template`

## 8. Security Model

### Security audit dimensions
1. **Network behavior**
   - outbound HTTP requests
   - domain allowlist / unknown endpoints
   - remote code fetch behavior

2. **File system behavior**
   - writes files
   - deletes/modifies files
   - touches sensitive paths

3. **Permissions / capabilities**
   - shell execution
   - browser control
   - messaging
   - credential access
   - system-level privileges

4. **Code risk patterns**
   - obfuscation
   - eval/exec usage
   - subprocess spawning
   - secret handling issues
   - suspicious persistence patterns

### Risk rating proposal
- **low**: expected behavior, limited permissions, no suspicious patterns
- **medium**: elevated capability or unclear network/file behavior
- **high**: powerful permissions, risky patterns, insufficient transparency
- **critical**: clearly malicious or unsafe behavior

### Audit output layers
- **Security summary**: 3-5 bullets, human-readable
- **Flags**: normalized machine-readable findings
- **Evidence**: path + code snippet reference when available
- **Recommendation**: use / review / avoid

## 9. Repository Structure Proposal

```text
skill-tree/
  README.md
  schema/
    skill.schema.json
  catalog/
    skills-catalog-v1.json
    categories.json
  audits/
    <skill-slug>.json
    <skill-slug>.md
  reports/
    ecosystem-overview.md
    security-summary.md
  assets/
    wireframes/
    diagrams/
  tools/
    ingest/
    audit/
    normalize/
  docs/
    contribution-guide.md
    taxonomy-guide.md
    audit-methodology.md
```

## 10. README Template Requirements

Each skill detail README section should be easy to scan.

### Suggested template
1. Name
2. One-line summary
3. Primary category
4. What it does
5. When to use it
6. Risks / permissions
7. Source repo
8. Audit rating
9. Key findings
10. Compatibility
11. Last reviewed date

## 11. Web UI Wireframe

### A. Home page
- top search bar
- featured categories
- recently audited skills
- highest-starred safe skills
- latest security warnings

### B. Category page
- left tree navigation
- filters: risk, stars, updated date, compatibility
- card grid/list with score badges

### C. Skill detail page
- header: name, category, risk badge, stars, source
- summary section
- capabilities section
- audit summary section
- findings/evidence section
- related skills section

### D. Audit explorer
- sortable table of findings
- severity filters
- evidence links

## 12. UI Components

### Core cards
- Skill card
- Audit badge
- Risk chip
- Category breadcrumb
- Compatibility tag
- Finding row

### Visual conventions
- green = low risk
- yellow = medium risk
- red = high risk
- dark red = critical
- blue = metadata/info

## 13. Search & Filtering

### Search fields
- name
- summary
- tags
- categories
- source repo
- findings keywords

### Filters
- risk level
- star band
- category
- recently updated
- compatible runtime
- audited / unaudited
- verified / draft

## 14. Data Lifecycle

1. Discover repo
2. Normalize metadata
3. Categorize skill
4. Run security audit
5. Generate summary + findings
6. Store JSON artifacts
7. Publish to repo/UI
8. Re-audit on schedule or version change

## 15. MVP Scope

### In scope
- category taxonomy v1
- machine-readable schema
- repo structure v1
- README template
- wireframe-level UI spec
- security rating model

### Out of scope
- live production crawler
- full Web UI implementation
- user accounts
- voting/reviews
- auto-merge publishing workflow

## 16. Success Metrics

### Product metrics
- first 50 skills cataloged
- 100% of catalog entries schema-valid
- 100% of top skills have risk rating
- <30 seconds for a user to understand a skill’s risk summary

### Ecosystem metrics
- repeat usage by internal team
- shareability of audit pages
- reduction in unsafe skill adoption
- growth in catalog breadth and coverage

## 17. Key Risks

1. Taxonomy grows too complex too early.
2. Audit ratings become inconsistent across reviewers.
3. Metadata quality varies too much by repo.
4. UI becomes crowded if summary and findings are mixed poorly.

### Mitigations
- keep one primary category only
- define strict audit rubric
- schema validation for every record
- summary-first, detail-second UI pattern

## 18. Recommended Next Steps

1. Approve taxonomy v1.
2. Approve schema v1.
3. Let 辛海璐 create `skill-tree` repo from proposed structure.
4. Let 林晚 populate first 50-skill catalog using this schema.
5. Let 吕明亮 build scanner/auditor to output matching JSON.
6. Convert wireframe into simple static Web UI after data exists.
