#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path('/Users/woodwater/.openclaw/workspace')
CATALOG_V1 = ROOT / 'skill-tree/catalog/skills-catalog-v1.json'
SHORTLIST = ROOT / 'agents/research/skills-shortlist-v1.json'
HIGH_INTENT = ROOT / 'skill-tree/catalog/high-intent-skills-enriched-v1.json'
GOVERNANCE = ROOT / 'skill-tree/catalog/high-intent-governance-fields-v1.json'
WORKFLOW_RUNTIME = ROOT / 'skill-tree/catalog/workflow-runtime-fields-v1.json'
SCHEDULED = ROOT / 'skill-tree/catalog/scheduled-workflow-candidates-v1.json'
RUNTIME_CONTROL = ROOT / 'skill-tree/catalog/runtime-control-fields-v1.json'
OUT = ROOT / 'skill-tree/catalog/index.json'

catalog = json.loads(CATALOG_V1.read_text())
shortlist = json.loads(SHORTLIST.read_text())
high_intent = json.loads(HIGH_INTENT.read_text()) if HIGH_INTENT.exists() else {'items': []}
governance = json.loads(GOVERNANCE.read_text()) if GOVERNANCE.exists() else {'items': []}
workflow_runtime = json.loads(WORKFLOW_RUNTIME.read_text()) if WORKFLOW_RUNTIME.exists() else {'items': []}
scheduled = json.loads(SCHEDULED.read_text()) if SCHEDULED.exists() else {'items': []}
runtime_control = json.loads(RUNTIME_CONTROL.read_text()) if RUNTIME_CONTROL.exists() else {'items': []}

catalog_items = {item['repo']: item for item in catalog['items']}
high_intent_items = {item['repo']: item for item in high_intent.get('items', [])}
governance_items = {item['repo']: item for item in governance.get('items', [])}
workflow_runtime_items = {item['repo']: item for item in workflow_runtime.get('items', [])}
scheduled_items = {item['repo']: item for item in scheduled.get('items', [])}
runtime_control_items = {item['repo']: item for item in runtime_control.get('items', [])}

def slugify(repo: str) -> str:
    return repo.lower().replace('_', '-').replace('/', '-')

def derive_workflow_fields(item: dict) -> dict:
    workflow_scenarios = []
    unattended = item.get('unattended_run', 'unknown')
    subagent = item.get('subagent_support', 'unknown')
    protocol_support = item.get('protocol_support', []) or []
    rationale = (item.get('governance_rationale') or '').lower()
    install_friction = item.get('install_friction') or ''

    if unattended in {'supported', 'limited'} or 'scheduled' in rationale or 'background' in rationale:
        workflow_scenarios.append('scheduled')
    if unattended == 'supported' or 'long-running' in rationale or 'planning continuity' in (item.get('use_case') or '').lower():
        workflow_scenarios.append('long-running')
    if subagent == 'supported' or 'multi-agent' in rationale or 'delegation' in rationale or 'orchestration' in rationale:
        workflow_scenarios.append('multi-agent')
    if protocol_support or 'protocol' in rationale or 'mcp' in rationale:
        workflow_scenarios.append('context-protocol')

    runtime_control_level = 'none'
    if unattended in {'supported', 'limited'} or subagent == 'supported' or protocol_support:
        runtime_control_level = 'basic'
    if (
        unattended == 'supported'
        and item.get('governance_maturity') in {'medium', 'high'}
        and (subagent == 'supported' or protocol_support)
    ):
        runtime_control_level = 'advanced'
    if unattended == 'unknown' and subagent == 'unknown' and not protocol_support:
        runtime_control_level = 'unknown'

    runtime_control_surfaces = []
    if unattended in {'supported', 'limited'}:
        runtime_control_surfaces.append('background-execution')
    if subagent == 'supported':
        runtime_control_surfaces.append('delegation')
    if protocol_support:
        runtime_control_surfaces.append('protocol-bridge')
    if item.get('governance_maturity') in {'medium', 'high'}:
        runtime_control_surfaces.append('governance-controls')

    workflow_entry_signals = []
    if 'scheduled' in workflow_scenarios:
        workflow_entry_signals.append('choose when work must run on a schedule or without a person watching every step')
    if 'long-running' in workflow_scenarios:
        workflow_entry_signals.append('choose when the job spans multiple checkpoints, retries, or context handoffs')
    if 'multi-agent' in workflow_scenarios:
        workflow_entry_signals.append('choose when one agent is not enough and you need delegation or orchestration')
    if 'context-protocol' in workflow_scenarios:
        workflow_entry_signals.append('choose when the agent must load external context or connect through MCP/API/CLI bridges')

    workflow_decision_axes = []
    if unattended in {'supported', 'limited'}:
        workflow_decision_axes.append('operator involvement required')
    if install_friction:
        workflow_decision_axes.append('setup friction and local services')
    if protocol_support:
        workflow_decision_axes.append('integration surface and protocol compatibility')
    if subagent == 'supported':
        workflow_decision_axes.append('coordination complexity across agents')
    if item.get('governance_maturity') in {'medium', 'high'}:
        workflow_decision_axes.append('governance depth and approval controls')

    workflow_risk_signals = []
    if unattended == 'supported':
        workflow_risk_signals.append('unattended execution can amplify mistakes before a human notices')
    elif unattended == 'limited':
        workflow_risk_signals.append('partially unattended flows still need explicit checkpoints and fallbacks')
    if subagent == 'supported':
        workflow_risk_signals.append('delegation broadens blast radius and makes failures harder to trace')
    if protocol_support:
        workflow_risk_signals.append('protocol bridges widen the integration and credential surface area')
    if item.get('governance_maturity') in {'unknown', 'low'}:
        workflow_risk_signals.append('governance depth is unclear, so runtime controls may need manual review')

    site_surfaces = ['catalog']
    if workflow_scenarios:
        site_surfaces.extend(['specials', 'filters'])
    if runtime_control_level in {'basic', 'advanced'}:
        site_surfaces.append('runtime-control')

    return {
        'workflow_scenarios': workflow_scenarios,
        'runtime_control_level': runtime_control_level,
        'runtime_control_surfaces': runtime_control_surfaces,
        'workflow_entry_signals': workflow_entry_signals,
        'workflow_decision_axes': workflow_decision_axes,
        'workflow_risk_signals': workflow_risk_signals,
        'site_surfaces': sorted(set(site_surfaces)),
    }

items = []
for s in shortlist['items']:
    base = catalog_items.get(s['repo'], {})
    hi = high_intent_items.get(s['repo'], {})
    gov = governance_items.get(s['repo'], {})
    wr = workflow_runtime_items.get(s['repo'], {})
    sched = scheduled_items.get(s['repo'], {})
    rc = runtime_control_items.get(s['repo'], {})
    merged = {
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
        'workflow_stack_role': wr.get('workflow_stack_role', ''),
        'supports_scheduled': sched.get('supports_scheduled', wr.get('supports_scheduled', 'unknown')),
        'supports_long_running': wr.get('supports_long_running', 'unknown'),
        'supports_multi_agent': wr.get('supports_multi_agent', 'unknown'),
        'supports_context_protocol': wr.get('supports_context_protocol', 'unknown'),
        'runtime_control_level': wr.get('runtime_control_level', 'unknown'),
        'distribution_layer': rc.get('distribution_layer', ''),
        'background_execution': rc.get('background_execution', 'unknown'),
        'local_first': rc.get('local_first', 'unknown'),
        'workflow_lock_in': rc.get('workflow_lock_in', 'unknown'),
        'permission_visibility': rc.get('permission_visibility', 'unknown'),
        'runtime_control_rationale': rc.get('runtime_control_rationale', ''),
        'workflow_specials': wr.get('workflow_specials', []),
        'workflow_entry_points': sched.get('workflow_entry_points', wr.get('workflow_entry_points', [])),
        'scheduled_fit_explanation': sched.get('scheduled_fit_explanation', ''),
        'collection_status': 'recommended',
        'priority_score': s.get('priority_score'),
        'why_include_now': s.get('why_include_now'),
        'direct_value_to_skill_tree': s.get('direct_value_to_skill_tree'),
        'safety_precheck': base.get('safety_precheck', {}),
        'audit_status': 'shortlisted',
        'review_status': 'pending_repo_index_integration',
        'updated_at': datetime.now(timezone.utc).isoformat(),
    }
    merged.update(derive_workflow_fields(merged))
    merged.update({
        'workflow_stack_role': wr.get('workflow_stack_role', merged.get('workflow_stack_role', '')),
        'supports_scheduled': sched.get('supports_scheduled', wr.get('supports_scheduled', merged.get('supports_scheduled', 'unknown'))),
        'supports_long_running': wr.get('supports_long_running', merged.get('supports_long_running', 'unknown')),
        'supports_multi_agent': wr.get('supports_multi_agent', merged.get('supports_multi_agent', 'unknown')),
        'supports_context_protocol': wr.get('supports_context_protocol', merged.get('supports_context_protocol', 'unknown')),
        'runtime_control_level': wr.get('runtime_control_level', merged.get('runtime_control_level', 'unknown')),
        'distribution_layer': rc.get('distribution_layer', merged.get('distribution_layer', '')),
        'background_execution': rc.get('background_execution', merged.get('background_execution', 'unknown')),
        'local_first': rc.get('local_first', merged.get('local_first', 'unknown')),
        'workflow_lock_in': rc.get('workflow_lock_in', merged.get('workflow_lock_in', 'unknown')),
        'permission_visibility': rc.get('permission_visibility', merged.get('permission_visibility', 'unknown')),
        'runtime_control_rationale': rc.get('runtime_control_rationale', merged.get('runtime_control_rationale', '')),
        'workflow_specials': wr.get('workflow_specials', merged.get('workflow_specials', [])),
        'workflow_entry_points': sched.get('workflow_entry_points', wr.get('workflow_entry_points', merged.get('workflow_entry_points', []))),
        'scheduled_fit_explanation': sched.get('scheduled_fit_explanation', merged.get('scheduled_fit_explanation', '')),
    })
    items.append(merged)

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
        'workflow_stack_role', 'supports_scheduled', 'supports_long_running', 'supports_multi_agent', 'supports_context_protocol',
        'workflow_specials', 'workflow_entry_points', 'scheduled_fit_explanation',
        'workflow_scenarios', 'runtime_control_level', 'distribution_layer', 'background_execution', 'local_first', 'workflow_lock_in', 'permission_visibility', 'runtime_control_rationale', 'runtime_control_surfaces',
        'workflow_entry_signals', 'workflow_decision_axes', 'workflow_risk_signals', 'site_surfaces',
        'security_rating', 'collection_status', 'priority_score', 'audit_status',
        'review_status', 'updated_at'
    ],
    'items': items,
}

OUT.write_text(json.dumps(index, ensure_ascii=False, indent=2))
print(f'wrote {OUT}')
