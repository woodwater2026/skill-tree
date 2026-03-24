# glitternetwork-pinme audit

- Repository: glitternetwork/pinme
- URL: https://github.com/glitternetwork/pinme
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 168

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository can write, modify, or delete local files.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Sensitive path or credential reference detected
- Path: `.claude/skills/pinme/SKILL.md`:109
- Category: sensitive-path
- Evidence: `- Upload \`.env\` files`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:138
- Category: sensitive-path
- Evidence: `- ❌ Do not upload \`node_modules\`, \`.env\`, \`.git\` directories`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:158
- Category: sensitive-path
- Evidence: `"excludePatterns": ["node_modules", ".env", ".git", "src"],`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:361
- Category: sensitive-path
- Evidence: `- ❌ \`.env\` - Environment configuration`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:625
- Category: permissions
- Evidence: `**Solution:** Check folder permissions, or use sudo (only when necessary)`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:757
- Category: sensitive-path
- Evidence: `2. **Configure GitHub Secrets:**`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:758
- Category: sensitive-path
- Evidence: `- Go to repository → Settings → Secrets and variables → Actions`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:794
- Category: sensitive-path
- Evidence: `- run: pinme set-appkey "${{ secrets.PINME_APPKEY }}"`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:795
- Category: sensitive-path
- Evidence: `- run: pinme upload dist --domain "${{ secrets.PINME_DOMAIN }}"`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:814
- Category: sensitive-path
- Evidence: `- Verify \`PINME_APPKEY\` secret is correct`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:76
- Category: sensitive-path
- Evidence: `async function checkVipStatus(authConfig: { address: string; token: string }): Promise<boolean> {`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:79
- Category: sensitive-path
- Evidence: `const vipResult = await isVip(authConfig.address, authConfig.token);`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:86
- Category: sensitive-path
- Evidence: `if (e.message === 'Token expired') {`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:144
- Category: sensitive-path
- Evidence: `if (e.message === 'Token expired') {`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:145
- Category: sensitive-path
- Evidence: `return; // Token expired hint already shown in API`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:159
- Category: sensitive-path
- Evidence: `if (e.message === 'Token expired') {`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:160
- Category: sensitive-path
- Evidence: `return; // Token expired hint already shown in API`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:180
- Category: sensitive-path
- Evidence: `const dnsResult = await bindDnsDomainV4(displayDomain, up.contentHash, authConfig.address, authConfig.token);`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:200
- Category: sensitive-path
- Evidence: `if (e.message === 'Token expired') {`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/bind.ts`:201
- Category: sensitive-path
- Evidence: `return; // Token expired hint already shown in API`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/importCar.ts`:12
- Category: sensitive-path
- Evidence: `const URL = process.env.IPFS_PREVIEW_URL;`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/importCar.ts`:13
- Category: sensitive-path
- Evidence: `const secretKey = process.env.SECRET_KEY;`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/importCar.ts`:22
- Category: sensitive-path
- Evidence: `throw new Error('Secret key not found');`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/importCar.ts`:116
- Category: sensitive-path
- Evidence: `const encryptedCID = encryptHash(result.contentHash, secretKey, uid);`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `bin/importCar.ts`:175
- Category: sensitive-path
- Evidence: `const encryptedCID = encryptHash(result.contentHash, secretKey, uid);`
- Description: Code references credential-like files, tokens, or secret-bearing paths.
