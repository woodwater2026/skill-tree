# Audit Methodology

Skill Tree audits AI Agent skills using a summary-first security review model.

## Audit Dimensions

1. **Network behavior**
   - outbound HTTP requests
   - remote fetch or update behavior
   - unknown domains or third-party services

2. **File system behavior**
   - file writes
   - deletion or modification behavior
   - access to sensitive paths

3. **Permissions / capabilities**
   - shell execution
   - browser control
   - messaging APIs
   - credentials access
   - privileged system operations

4. **Code risk patterns**
   - `eval` / `exec`
   - subprocess spawning
   - obfuscation
   - remote code execution patterns
   - suspicious persistence behavior

## Rating Rubric

### Low
Expected behavior, narrow permissions, high transparency.

### Medium
Useful but elevated capability or incomplete transparency.

### High
Broad permissions, risky behavior, or meaningful uncertainty.

### Critical
Clear malicious indicators or plainly unsafe operation.

## Output Model

Each audit should include:
- summary bullets
- normalized findings
- evidence references
- recommendation: `use`, `review`, or `avoid`

## Review Flow

1. Read repo metadata and structure.
2. Inspect core files.
3. Identify network / file / permission behavior.
4. Capture findings with evidence.
5. Assign risk level and recommendation.
6. Save both JSON and Markdown audit artifacts.
