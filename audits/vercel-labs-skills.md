# vercel-labs-skills audit

- Repository: vercel-labs/skills
- URL: https://github.com/vercel-labs/skills
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 89

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository invokes shell / subprocess style execution paths.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Sensitive path or credential reference detected
- Path: `.github/workflows/publish.yml`:25
- Category: sensitive-path
- Evidence: `id-token: write`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `.github/workflows/publish.yml`:32
- Category: sensitive-path
- Evidence: `token: ${{ secrets.GITHUB_TOKEN }}`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `.github/workflows/publish.yml`:122
- Category: sensitive-path
- Evidence: `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `.github/workflows/publish.yml`:153
- Category: sensitive-path
- Evidence: `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `AGENTS.md`:85
- Category: sensitive-path
- Evidence: `3. For each skill, call \`fetchSkillFolderHash(source, skillPath, token)\`. Optional auth token is sourced from \`GITHUB_TOKEN\`, \`GH_TOKEN\`, or \`gh auth token\` to improve rate limits.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/cli.mjs`:6
- Category: sensitive-path
- Evidence: `if (module.enableCompileCache && !process.env.NODE_DISABLE_COMPILE_CACHE) {`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Shell or dynamic execution detected
- Path: `scripts/execute-tests.ts`:3
- Category: execution
- Evidence: `import { spawn } from 'node:child_process';`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [medium] Shell or dynamic execution detected
- Path: `scripts/execute-tests.ts`:66
- Category: execution
- Evidence: `const child = spawn('node', [testFile], {`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [medium] Shell or dynamic execution detected
- Path: `scripts/generate-licenses.ts`:7
- Category: execution
- Evidence: `import { execSync } from 'child_process';`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:300
- Category: sensitive-path
- Evidence: `const originalEnv = process.env;`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:304
- Category: sensitive-path
- Evidence: `process.env = { ...originalEnv };`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:308
- Category: sensitive-path
- Evidence: `process.env = originalEnv;`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:312
- Category: sensitive-path
- Evidence: `delete process.env.INSTALL_INTERNAL_SKILLS;`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:317
- Category: sensitive-path
- Evidence: `process.env.INSTALL_INTERNAL_SKILLS = '1';`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:322
- Category: sensitive-path
- Evidence: `process.env.INSTALL_INTERNAL_SKILLS = 'true';`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:327
- Category: sensitive-path
- Evidence: `process.env.INSTALL_INTERNAL_SKILLS = '0';`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:330
- Category: sensitive-path
- Evidence: `process.env.INSTALL_INTERNAL_SKILLS = 'false';`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.test.ts`:333
- Category: sensitive-path
- Evidence: `process.env.INSTALL_INTERNAL_SKILLS = 'yes';`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.ts`:51
- Category: sensitive-path
- Evidence: `getGitHubToken,`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.ts`:1508
- Category: sensitive-path
- Evidence: `const token = getGitHubToken();`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/add.ts`:1509
- Category: sensitive-path
- Evidence: `const hash = await fetchSkillFolderHash(normalizedSource, skillPathValue, token);`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/agents.ts`:10
- Category: sensitive-path
- Evidence: `const codexHome = process.env.CODEX_HOME?.trim() || join(home, '.codex');`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `src/agents.ts`:11
- Category: sensitive-path
- Evidence: `const claudeHome = process.env.CLAUDE_CONFIG_DIR?.trim() || join(home, '.claude');`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Shell or dynamic execution detected
- Path: `src/cli.ts`:3
- Category: execution
- Evidence: `import { spawnSync } from 'child_process';`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [medium] Sensitive path or credential reference detected
- Path: `src/cli.ts`:15
- Category: sensitive-path
- Evidence: `import { fetchSkillFolderHash, getGitHubToken } from './skill-lock.ts';`
- Description: Code references credential-like files, tokens, or secret-bearing paths.
