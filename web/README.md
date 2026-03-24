# Skill Tree Web UI MVP

Run locally:

```bash
cd skill-tree
python3 -m http.server 8000
```

Then open:

- http://localhost:8000/web/

This static MVP loads:

- `../catalog/skills-catalog-v1.json`
- `../audits/index.json`
- `../audits/*.json`

Features:

- keyword search
- risk filter
- category filter
- security score display
- audit summary preview
