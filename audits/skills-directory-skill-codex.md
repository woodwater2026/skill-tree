# skills-directory-skill-codex audit

- Repository: skills-directory/skill-codex
- URL: https://github.com/skills-directory/skill-codex
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 5

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Sensitive path or credential reference detected
- Path: `README.md`:13
- Category: sensitive-path
- Evidence: `- Codex configured with valid credentials and settings.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:42
- Category: sensitive-path
- Evidence: `### Important: Thinking Tokens`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:43
- Category: sensitive-path
- Evidence: `By default, this skill suppresses thinking tokens (stderr output) using \`2>/dev/null\` to avoid bloating Claude Code's context window. If you want to see the thinking tokens for debugging or insight into Codex's reasoning process, explicitly ask Claude to show them.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/skill-codex/skills/codex/SKILL.md`:21
- Category: sensitive-path
- Evidence: `5. **IMPORTANT**: By default, append \`2>/dev/null\` to all \`codex exec\` commands to suppress thinking tokens (stderr). Only show stderr if the user explicitly requests to see thinking tokens or if debugging is needed.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [low] Network request capability detected
- Path: `.claude-plugin/marketplace.json`:2
- Category: network
- Evidence: `"$schema": "https://anthropic.com/claude-code/marketplace.schema.json",`
- Description: Code appears to make outbound network requests or use HTTP clients.
