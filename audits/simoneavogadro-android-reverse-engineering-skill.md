# simoneavogadro-android-reverse-engineering-skill audit

- Repository: SimoneAvogadro/android-reverse-engineering-skill
- URL: https://github.com/SimoneAvogadro/android-reverse-engineering-skill
- Risk level: **high**
- Recommendation: **avoid**
- Findings: 64

## Security summary
- Overall risk assessed as HIGH based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [medium] Sensitive path or credential reference detected
- Path: `README.md`:8
- Category: sensitive-path
- Evidence: `- **Extracts and documents APIs**: Retrofit endpoints, OkHttp calls, hardcoded URLs, auth headers and tokens`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/commands/decompile.md`:38
- Category: permissions
- Evidence: `The install script auto-detects the OS and installs without sudo when possible (user-local install to \`~/.local/\`). If sudo is needed, it will prompt — if the user declines or sudo is unavailable, the script prints exact manual instructions (exit code 2). Show those instructions to the user and stop.`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/SKILL.md`:43
- Category: permissions
- Evidence: `- Installs without sudo when possible (downloads to \`~/.local/share/\`, symlinks in \`~/.local/bin/\`)`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/SKILL.md`:44
- Category: permissions
- Evidence: `- Uses sudo and the system package manager when necessary (apt, dnf, pacman)`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/SKILL.md`:45
- Category: permissions
- Evidence: `- If sudo is needed but unavailable or the user declines, it prints the exact manual command and exits with code 2 — show these instructions to the user`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/SKILL.md`:169
- Category: sensitive-path
- Evidence: `- **Headers**: \`Authorization: Bearer <token>\``
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/api-extraction-patterns.md`:80
- Category: sensitive-path
- Evidence: `## Hardcoded URLs and Secrets`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/api-extraction-patterns.md`:86
- Category: sensitive-path
- Evidence: `# API keys and tokens`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/api-extraction-patterns.md`:87
- Category: sensitive-path
- Evidence: `grep -rni 'api[_-]\?key\|api[_-]\?secret\|auth[_-]\?token\|bearer\|access[_-]\?token\|client[_-]\?secret' sources/`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/api-extraction-patterns.md`:106
- Category: sensitive-path
- Evidence: `- \`Authorization: Bearer <token>\``
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/call-flow-analysis.md`:119
- Category: sensitive-path
- Evidence: `grep -rni 'API_KEY\|CLIENT_ID\|APP_KEY\|SECRET' sources/`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:10
- Category: permissions
- Evidence: `sudo apt update`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:11
- Category: permissions
- Evidence: `sudo apt install openjdk-17-jdk`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:17
- Category: permissions
- Evidence: `sudo dnf install java-17-openjdk-devel`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:23
- Category: permissions
- Evidence: `sudo pacman -S jdk17-openjdk`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:29
- Category: permissions
- Evidence: `brew install openjdk@17`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:66
- Category: permissions
- Evidence: `brew install jadx`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:117
- Category: permissions
- Evidence: `brew install vineflower`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:147
- Category: permissions
- Evidence: `brew install dex2jar`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:176
- Category: permissions
- Evidence: `sudo apt install apktool`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:179
- Category: permissions
- Evidence: `brew install apktool`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:190
- Category: permissions
- Evidence: `sudo apt install adb`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/references/setup-guide.md`:193
- Category: permissions
- Evidence: `brew install android-platform-tools`
- Description: Code or docs reference privileged commands, package installation, or service persistence.

### [medium] Sensitive path or credential reference detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/scripts/find-api-calls.sh`:112
- Category: sensitive-path
- Evidence: `run_grep -i '(api[_-]?key|auth[_-]?token|bearer|authorization|x-api-key|client[_-]?secret|access[_-]?token)'`
- Description: Code references credential-like files, tokens, or secret-bearing paths.

### [medium] Elevated permission or system modification pattern detected
- Path: `plugins/android-reverse-engineering/skills/android-reverse-engineering/scripts/install-dep.sh`:9
- Category: permissions
- Evidence: `#   2 — requires manual action (e.g. sudo needed but not available)`
- Description: Code or docs reference privileged commands, package installation, or service persistence.
