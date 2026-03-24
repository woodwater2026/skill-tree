# joinmassive-clawpod audit

- Repository: joinmassive/clawpod
- URL: https://github.com/joinmassive/clawpod
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 63

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Sensitive path or credential reference detected
- Path: `README.md`:17
- Category: sensitive-path
- Evidence: `### 1. Get an API Token`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:19
- Category: sensitive-path
- Evidence: `Sign up at [Massive](https://clawpod.joinmassive.com/waitlist) and get your Unblocker API token.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:21
- Category: sensitive-path
- Evidence: `### 2. Set the Token`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:24
- Category: sensitive-path
- Evidence: `export MASSIVE_UNBLOCKER_TOKEN="your-token"`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:30
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:31
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:44
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:45
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:58
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:59
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:63
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:64
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:68
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:69
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:73
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:74
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:78
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:79
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:83
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:84
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:88
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=https://example.com" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:89
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:95
- Category: network
- Evidence: `curl -s -G --data-urlencode "url=$url" \`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:96
- Category: sensitive-path
- Evidence: `-H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `README.md`:105
- Category: network
- Evidence: `curl -s -H "Authorization: Bearer $MASSIVE_UNBLOCKER_TOKEN" \`
- Description: Code appears to make outbound network requests or use HTTP clients.
