# blessonism-openclaw-search-skills audit

- Repository: blessonism/openclaw-search-skills
- URL: https://github.com/blessonism/openclaw-search-skills
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 157

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository can write, modify, or delete local files.
- Repository invokes shell / subprocess style execution paths.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Sensitive path or credential reference detected
- Path: `README.md`:201
- Category: sensitive-path
- Evidence: `**方式一：Credentials 文件（推荐）**`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:203
- Category: sensitive-path
- Evidence: `创建 \`~/.openclaw/credentials/search.json\`：`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:233
- Category: sensitive-path
- Evidence: `环境变量会覆盖 credentials 文件中的同名配置。`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:242
- Category: sensitive-path
- Evidence: `- Credentials：在 \`~/.openclaw/credentials/search.json\` 里增加一项，例如：`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:255
- Category: sensitive-path
- Evidence: `### MinerU Token（可选，content-extract 需要）`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:260
- Category: sensitive-path
- Evidence: `cp mineru-extract/.env.example mineru-extract/.env`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:261
- Category: sensitive-path
- Evidence: `# 编辑 .env，填入你的 MinerU token（从 https://mineru.net/apiManage 获取）`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:268
- Category: permissions
- Evidence: `pip install requests`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:271
- Category: permissions
- Evidence: `pip install trafilatura beautifulsoup4 lxml`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:295
- Category: sensitive-path
- Evidence: `- **Credentials 文件**：统一凭据管理，\`~/.openclaw/credentials/search.json\` 集中存放所有搜索源 key`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:387
- Category: sensitive-path
- Evidence: `- API Keys：Exa 和/或 Tavily（search-layer），Grok API（可选，第四搜索源），MinerU token（可选，content-extract）`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `content-extract/SKILL.md`:13
- Category: sensitive-path
- Evidence: `- **Token 探针**：先用低成本 probe 判断可不可以直接抓；不行再走重解析（MinerU）。`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `content-extract/scripts/content_extract.py`:44
- Category: sensitive-path
- Evidence: `if v := os.environ.get("MINERU_WRAPPER_PATH"):`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Shell or dynamic execution detected
- Path: `content-extract/scripts/content_extract.py`:97
- Category: execution
- Evidence: `p = subprocess.run(cmd, capture_output=True, text=True)`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [medium] Process execution detected
- Path: `content-extract/scripts/content_extract.py`:97
- Category: execution
- Evidence: `subprocess.run`
- Description: Python AST found explicit process execution call.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:174
- Category: sensitive-path
- Evidence: `- **Credentials file**: centralizes search credentials in \`~/.openclaw/credentials/search.json\``
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:233
- Category: sensitive-path
- Evidence: `**Option 1: credentials file (recommended)**`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:235
- Category: sensitive-path
- Evidence: `Create \`~/.openclaw/credentials/search.json\`:`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:267
- Category: sensitive-path
- Evidence: `Environment variables override credentials-file values when both are present.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:271
- Category: sensitive-path
- Evidence: `### MinerU token (optional, for \`content-extract\`)`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:276
- Category: sensitive-path
- Evidence: `cp mineru-extract/.env.example mineru-extract/.env`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:277
- Category: sensitive-path
- Evidence: `# Then edit .env and fill in your MinerU token from https://mineru.net/apiManage`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `docs/README_EN.md`:284
- Category: permissions
- Evidence: `pip install requests`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `docs/README_EN.md`:287
- Category: permissions
- Evidence: `pip install trafilatura beautifulsoup4 lxml`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `docs/README_EN.md`:362
- Category: sensitive-path
- Evidence: `- API keys: Exa/Tavily (base \`search-layer\` setup), Grok (optional), OpenAlex/Semantic Scholar (optional for academic mode), MinerU token (optional for \`content-extract\`)`
- Description: Code references credential-like files, tokens, or secret-bearing paths.
