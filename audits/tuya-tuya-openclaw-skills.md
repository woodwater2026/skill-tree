# tuya-tuya-openclaw-skills audit

- Repository: tuya/tuya-openclaw-skills
- URL: https://github.com/tuya/tuya-openclaw-skills
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 15

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Elevated permission or system modification pattern detected
- Path: `README.md`:58
- Category: permissions
- Evidence: `- \`requests\` library (\`pip install requests\`)`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `README.md`:155
- Category: sensitive-path
- Evidence: `| Device Control | Issue properties | POST | \`/v1.0/end-user/devices/{device_id}/shadow/properties/issue\` | [device-control.md](Tuya%20Smart%20control/references/device-control.md) |`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `README_zh.md`:57
- Category: permissions
- Evidence: `- \`requests\` 库（\`pip install requests\`）`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `README_zh.md`:154
- Category: sensitive-path
- Evidence: `| 设备控制 | 下发属性指令 | POST | \`/v1.0/end-user/devices/{device_id}/shadow/properties/issue\` | [device-control.md](Tuya%20Smart%20control/references/device-control.md) |`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/SKILL.md`:28
- Category: sensitive-path
- Evidence: `- **Credentials**: Read from environment variable \`TUYA_API_KEY\`. The base URL is auto-detected from the API key prefix (e.g. \`sk-AY...\` → China, \`sk-EU...\` → Europe). You can override by setting \`TUYA_BASE_URL\`.`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Network request capability detected
- Path: `tuya-smart-control/SKILL.md`:110
- Category: network
- Evidence: `curl -s -H "Authorization: Bearer $TUYA_API_KEY" "$TUYA_BASE_URL/v1.0/end-user/homes/all"`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/SKILL.md`:180
- Category: sensitive-path
- Evidence: `POST {base_url}/v1.0/end-user/devices/{device_id}/shadow/properties/issue`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/SKILL.md`:217
- Category: sensitive-path
- Evidence: `| token invalid (code: 1010) | Tell the user the Api-key has expired and needs to be updated |`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/references/device-control.md`:147
- Category: sensitive-path
- Evidence: `POST /v1.0/end-user/devices/{device_id}/shadow/properties/issue`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/scripts/tuya_api.py`:7
- Category: sensitive-path
- Evidence: `Credentials are read from environment variables. TUYA_API_KEY is required;`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/scripts/tuya_api.py`:53
- Category: sensitive-path
- Evidence: `api_key = os.environ.get("TUYA_API_KEY")`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/scripts/tuya_api.py`:55
- Category: sensitive-path
- Evidence: `base_url = os.environ.get("TUYA_BASE_URL")`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `tuya-smart-control/scripts/tuya_api.py`:125
- Category: sensitive-path
- Evidence: `f"/v1.0/end-user/devices/{device_id}/shadow/properties/issue",`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [low] Network request capability detected
- Path: `tuya-smart-control/scripts/tuya_api.py`:65
- Category: network
- Evidence: `self.session = requests.Session()`
- Description: Code appears to make outbound network requests or use HTTP clients.

### [info] Operational command examples found in documentation
- Path: `tuya-smart-control/SKILL.md`:1
- Category: docs
- Evidence: `---`
- Description: Repository documentation contains commands that may require manual review before use.
