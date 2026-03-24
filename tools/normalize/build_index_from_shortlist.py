#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path('/Users/woodwater/.openclaw/workspace')
CATALOG_V1 = ROOT / 'skill-tree/catalog/skills-catalog-v1.json'
SHORTLIST = ROOT / 'agents/research/skills-shortlist-v1.json'
OUT = ROOT / 'skill-tree/catalog/index.json'

catalog = json.loads(CATALOG_V1.read_text())
shortlist = json.loads(SHORTLIST.read_text())

catalog_items = {item['repo']: item for item in catalog['items']}

def slugify(repo: str) -> str:
    return repo.lower().replace('_', '-').replace('/', '-')

items = []
for s in shortlist['items']:
    base = catalog_items.get(s['repo'], {})
    items.append({
        'id': slugify(s['repo']),
        'slug': slugify(s['repo']),
        'name': s['name'],
        'repo': s['repo'],
        'source': base.get('source', f"https://github.com/{s['repo']}"),
        'category': base.get('category', s.get('category', 'unknown')),
        'stars': s.get('stars', base.get('stars', 0)),
        'summary': base.get('summary', s.get('why_include_now', '')), 
        'security_rating': s.get('risk', base.get('safety_precheck', {}).get('rating', 'unknown')),
        'collection_status': 'recommended',
        'priority_score': s.get('priority_score'),
        'why_include_now': s.get('why_include_now'),
        'direct_value_to_skill_tree': s.get('direct_value_to_skill_tree'),
        'safety_precheck': base.get('safety_precheck', {}),
        'audit_status': 'shortlisted',
        'review_status': 'pending_repo_index_integration',
        'updated_at': datetime.now(timezone.utc).isoformat(),
    })

index = {
    'version': 'index-v1',
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'source_catalog': 'skills-catalog-v1.json',
    'source_shortlist': 'skills-shortlist-v1.json',
    'count': len(items),
    'search_ready': True,
    'fields': [
        'id', 'slug', 'name', 'repo', 'source', 'category', 'stars', 'summary',
        'security_rating', 'collection_status', 'priority_score', 'audit_status',
        'review_status', 'updated_at'
    ],
    'items': items,
}

OUT.write_text(json.dumps(index, ensure_ascii=False, indent=2))
print(f'wrote {OUT}')
