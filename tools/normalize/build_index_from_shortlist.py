#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path('/Users/woodwater/.openclaw/workspace')
CATALOG_V1 = ROOT / 'skill-tree/catalog/skills-catalog-v1.json'
SHORTLIST = ROOT / 'agents/research/skills-shortlist-v1.json'
HIGH_INTENT = ROOT / 'skill-tree/catalog/high-intent-skills-enriched-v1.json'
GOVERNANCE = ROOT / 'skill-tree/catalog/high-intent-governance-fields-v1.json'
OUT = ROOT / 'skill-tree/catalog/index.json'

catalog = json.loads(CATALOG_V1.read_text())
shortlist = json.loads(SHORTLIST.read_text())
high_intent = json.loads(HIGH_INTENT.read_text()) if HIGH_INTENT.exists() else {'items': []}
governance = json.loads(GOVERNANCE.read_text()) if GOVERNANCE.exists() else {'items': []}

catalog_items = {item['repo']: item for item in catalog['items']}
high_intent_items = {item['repo']: item for item in high_intent.get('items', [])}
governance_items = {item['repo']: item for item in governance.get('items', [])}

def slugify(repo: str) -> str:
    return repo.lower().replace('_', '-').replace('/', '-')

items = []
for s in shortlist['items']:
    base = catalog_items.get(s['repo'], {})
    hi = high_intent_items.get(s['repo'], {})
    gov = governance_items.get(s['repo'], {})
    items.append({
        'id': slugify(s['repo']),
        'slug': slugify(s['repo']),
        'name': s['name'],
        'repo': s['repo'],
        'source': base.get('source', f"https://github.com/{s['repo']}"),
        'category': base.get('category', s.get('category', 'unknown')),
        'stars': s.get('stars', base.get('stars', 0)),
        'summary': gov.get('summary', hi.get('summary', base.get('summary', s.get('why_include_now', '')))),
        'install_cmd': gov.get('install_cmd', hi.get('install_cmd', base.get('install_cmd', ''))),
        'use_case': gov.get('use_case', hi.get('use_case', base.get('use_case', ''))),
        'risk_explanation': gov.get('risk_explanation', hi.get('risk_explanation', base.get('risk_explanation', ''))),
        'install_friction': gov.get('install_friction', hi.get('install_friction', '')),
        'unattended_run': gov.get('unattended_run', 'unknown'),
        'subagent_support': gov.get('subagent_support', 'unknown'),
        'protocol_support': gov.get('protocol_support', []),
        'governance_maturity': gov.get('governance_maturity', 'unknown'),
        'governance_rationale': gov.get('governance_rationale', ''),
        'security_rating': gov.get('security_rating', hi.get('security_rating', s.get('risk', base.get('safety_precheck', {}).get('rating', 'unknown')))),
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
        'install_cmd', 'use_case', 'risk_explanation', 'install_friction',
        'unattended_run', 'subagent_support', 'protocol_support', 'governance_maturity', 'governance_rationale',
        'security_rating', 'collection_status', 'priority_score', 'audit_status',
        'review_status', 'updated_at'
    ],
    'items': items,
}

OUT.write_text(json.dumps(index, ensure_ascii=False, indent=2))
print(f'wrote {OUT}')
