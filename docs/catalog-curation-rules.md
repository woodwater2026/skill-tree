# Skill Tree Catalog v2 — Curation Rules & Discovery Standards

## 1. Shortlist rules

A skill enters the **first library shortlist** only if it meets all of the following:
- clear skill identity (not just generic AI repo / article collection)
- reusable by agents or developers in a repeatable workflow
- active ecosystem signal (stars, cross-list mentions, or official backing)
- understandable scope from repo metadata / README
- risk acceptable for catalog inclusion (low/medium by default; high only if strategically important and clearly labeled)

## 2. Trending discovery rules

We continuously scan from these sources:
- GitHub search queries: claude code skill / claude skills / openclaw skills / agent skills / copilot skills / mcp server skills / claude code subagents
- awesome-lists and official registries
- cross-ecosystem hubs (Claude Code, OpenClaw, Copilot, Cursor, Codex)
- official vendor collections (Anthropic, Vercel, GitHub, OpenClaw)

A repo counts as “trending discovery worthy” if it satisfies one of:
- rapid star accumulation
- appears in multiple awesome lists / registries
- comes from an official org
- introduces a new skill category with clear repeat use

## 3. De-duplication rules

We remove or downgrade entries when:
- the repo is a mirror / translation / fork without unique value
- it is just a meta-list repeating another larger registry
- it is a generic AI resources repo with weak skill specificity
- multiple repos package the same exact workflow with little differentiation

## 4. Filtering standards

### Keep in core library
- official registries
- respected tooling / factories / specs
- representative vertical skill packs
- low/medium-risk skills with clear utility and documentation

### Keep as candidate pool
- good ecosystem signal but weaker documentation
- medium-risk automation projects needing clearer boundaries
- niche domain skill packs that may fit later categories

### Keep as noise / observation only
- ambiguous repos with weak skill identity
- low-star duplicates
- generic prompt collections with no durable workflow value
- high-risk repos with unclear safeguards and low strategic value

## 5. First-library recommendation logic

For initial Skill Tree launch, prioritize three kinds of entries:
1. **Discovery anchors** — official registries / awesome lists users already trust
2. **Infrastructure anchors** — skill specs / factories / scanners
3. **Representative vertical skills** — enough to prove taxonomy breadth without flooding users with noise

## 6. Current decision outputs

### Top 10 strongest initial library candidates
- obra/superpowers (general, score 68)
- anthropics/skills (general, score 68)
- ComposioHQ/awesome-claude-skills (registry, score 63.4)
- VoltAgent/awesome-openclaw-skills (registry, score 57.5)
- hesreallyhim/awesome-claude-code (registry, score 47.5)

### Top 10 medium-priority candidates
- github/awesome-copilot (registry, score 42.8)
- googleworkspace/cli (tooling, score 38.3)
- BehiSecc/awesome-claude-skills (registry, score 35.8)
- kepano/obsidian-skills (memory-knowledge, score 32.7)
- vercel-labs/agent-skills (general, score 31.7)
- clawdbot-ai/awesome-openclaw-skills-zh (registry, score 31.6)
- VoltAgent/awesome-claude-code-subagents (registry, score 31.0)
- blader/humanizer (general, score 30.9)
- muratcankoylan/Agent-Skills-for-Context-Engineering (memory-knowledge, score 30.3)
- LeoYeAI/openclaw-master-skills (registry, score 30.0)

### Examples of noise / later-watch items
- alirezarezvani/claude-code-skill-factory (deployment, score -15.4)
- ythx-101/x-tweet-fetcher (media-data, score -15.3)
- wshuyi/x-article-publisher-skill (media-data, score -15.3)
- glitternetwork/pinme (deployment, score -13.0)
- SawyerHood/dev-browser (general, score -8.0)
- levnikolaevich/claude-code-skills (security, score -3.8)
- BrownFineSecurity/iothackbot (security, score -3.3)
- skills-directory/skill-codex (registry, score -3.0)
- SimoneAvogadro/android-reverse-engineering-skill (security, score -2.7)
- cisco-ai-defense/skill-scanner (security, score -2.5)
