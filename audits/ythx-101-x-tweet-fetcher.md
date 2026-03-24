# ythx-101-x-tweet-fetcher audit

- Repository: ythx-101/x-tweet-fetcher
- URL: https://github.com/ythx-101/x-tweet-fetcher
- Risk level: **critical**
- Recommendation: **avoid**
- Findings: 292

## Security summary
- Overall risk assessed as CRITICAL based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository can write, modify, or delete local files.
- Repository invokes shell / subprocess style execution paths.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [critical] Remote code execution pattern detected
- Path: `README.md`:163
- Category: remote-code
- Evidence: `curl https://nim-lang.org/choosenim/init.sh -sSf | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:130
- Category: permissions
- Evidence: `| **VPS (headless Linux)** | ✅ | ✅* | *needs \`pip install playwright\` |`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:131
- Category: permissions
- Evidence: `| **Mac / Windows** | ✅ | ✅* | *needs \`pip install playwright\` |`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:160
- Category: permissions
- Evidence: `sudo apt install -y redis-server libpcre3-dev libsass-dev`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Network request capability detected
- Path: `README.md`:163
- Category: network
- Evidence: `curl https://nim-lang.org/choosenim/init.sh -sSf | sh`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:182
- Category: sensitive-path
- Evidence: `2. Copy \`auth_token\` and \`ct0\``
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:186
- Category: sensitive-path
- Evidence: `{"name":"myaccount","auth_token":"YOUR_AUTH_TOKEN","ct0":"YOUR_CT0"}`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:199
- Category: sensitive-path
- Evidence: `[Tokens]`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:200
- Category: sensitive-path
- Evidence: `tokenFile = "sessions.jsonl"`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:206
- Category: permissions
- Evidence: `sudo systemctl start redis-server`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Network request capability detected
- Path: `README.md`:210
- Category: network
- Evidence: `curl http://127.0.0.1:8788/YuLin807`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:218
- Category: sensitive-path
- Evidence: `- **Use a secondary X account** — session token gives full access`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:219
- Category: sensitive-path
- Evidence: `- **Session tokens last ~1 year**`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:258
- Category: permissions
- Evidence: `| \`--backend browser\` | \`pip install playwright\` + \`playwright install chromium\` |`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Network request capability detected
- Path: `SKILL.md`:142
- Category: network
- Evidence: `curl http://localhost:9377/health`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/arxiv_author_finder.py`:8
- Category: sensitive-path
- Evidence: `Layer 2: GitHub HTML scraping → twitter_username (zero API token)`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/arxiv_author_finder.py`:18
- Category: sensitive-path
- Evidence: `GITHUB_TOKEN — GitHub Personal Access Token（5000次/小时 vs 60次/小时）`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `scripts/arxiv_author_finder.py`:21
- Category: permissions
- Evidence: `duckduckgo_search — Layer 4 网络搜索的首选后端（pip install duckduckgo-search）。`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/camofox_client.py`:11
- Category: sensitive-path
- Evidence: `import secrets`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/camofox_client.py`:108
- Category: sensitive-path
- Evidence: `snapshot = camofox_fetch_page(search_url, f"ddg-{secrets.token_hex(8)}", wait=5, port=port)`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/camofox_client.py`:114
- Category: sensitive-path
- Evidence: `snapshot = camofox_fetch_page(search_url, f"search-{secrets.token_hex(8)}", wait=4, port=port)`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/common.py`:17
- Category: sensitive-path
- Evidence: `from config import SEARXNG_URL, GITHUB_TOKEN, ARXIV_API`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/common.py`:133
- Category: sensitive-path
- Evidence: `# ─── GitHub helpers (REST API when token available, HTML scraping as fallback)`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/common.py`:137
- Category: sensitive-path
- Evidence: `if not GITHUB_TOKEN:`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `scripts/common.py`:141
- Category: sensitive-path
- Evidence: `"Authorization": f"token {GITHUB_TOKEN}",`
- Description: Code references credential-like files, tokens, or secret-bearing paths.
