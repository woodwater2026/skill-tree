#!/usr/bin/env python3
"""Batch-audit high-priority Skill Tree repos and normalize output to schema-like records."""

from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parents[2]
WORKSPACE_ROOT = REPO_ROOT.parent
AUDITOR_PATH = WORKSPACE_ROOT / "projects" / "skill_tree_auditor.py"
CATALOG_PATH = REPO_ROOT / "catalog" / "skills-catalog-v1.json"
OUTPUT_DIR = REPO_ROOT / "audits"
SCHEMA_PATH = REPO_ROOT / "schema" / "skill.schema.json"

DEFAULT_TARGETS = [
    "skills-directory/skill-codex",
    "trailofbits/skills",
    "cisco-ai-defense/skill-scanner",
    "blessonism/openclaw-search-skills",
    "joinmassive/clawpod",
    "ythx-101/x-tweet-fetcher",
    "tuya/tuya-openclaw-skills",
    "glitternetwork/pinme",
    "SimoneAvogadro/android-reverse-engineering-skill",
    "vercel-labs/skills",
]

CATEGORY_MAP = {
    "registry": "agent-operations",
    "marketplace": "agent-operations",
    "security": "security-compliance",
    "tooling": "system-environment",
    "developer-workflow": "development",
    "specification": "agent-operations",
}


def load_auditor_module():
    spec = importlib.util.spec_from_file_location("skill_tree_auditor", AUDITOR_PATH)
    if not spec or not spec.loader:
        raise RuntimeError(f"Unable to load auditor module from {AUDITOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def load_catalog() -> Dict[str, Dict[str, Any]]:
    data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    mapping: Dict[str, Dict[str, Any]] = {}
    for item in data.get("items", []):
        mapping[item.get("repo", "")] = item
    return mapping


def load_schema() -> Dict[str, Any]:
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


def slugify(repo_name: str) -> str:
    return repo_name.lower().replace("_", "-").replace("/", "-")


def normalize_category(raw: str) -> str:
    return CATEGORY_MAP.get(raw, "agent-operations")


def security_score(report: Dict[str, Any]) -> float:
    sev = report["audit"]["findings_by_severity"]
    score = 100.0
    score -= sev.get("critical", 0) * 35
    score -= sev.get("high", 0) * 15
    score -= sev.get("medium", 0) * 4
    score -= sev.get("low", 0) * 1
    return max(0.0, round(score, 1))


def popularity_score(stars: int | None) -> float:
    if not stars:
        return 0.0
    if stars >= 50000:
        return 100.0
    if stars >= 10000:
        return 85.0
    if stars >= 5000:
        return 70.0
    if stars >= 1000:
        return 55.0
    return 35.0


def quality_score(report: Dict[str, Any], item: Dict[str, Any]) -> float:
    score = 70.0
    if item.get("summary"):
        score += 10
    if report["scan_stats"]["files_scanned"] >= 20:
        score += 10
    if report["audit"]["findings_by_severity"].get("critical", 0) == 0:
        score += 5
    if report["audit"]["findings_by_severity"].get("high", 0) == 0:
        score += 5
    return min(100.0, round(score, 1))


def to_skill_record(item: Dict[str, Any], report: Dict[str, Any]) -> Dict[str, Any]:
    repo = item["repo"]
    slug = slugify(repo)
    stars = item.get("stars") if isinstance(item.get("stars"), int) else 0
    ts = datetime.now(timezone.utc).isoformat()
    source = report.get("source", {})
    findings = report["audit"].get("findings", [])

    secondary_categories = []
    if item.get("category") == "security":
        secondary_categories = ["research", "development"]
    elif item.get("category") == "registry":
        secondary_categories = ["research"]

    return {
        "id": slug,
        "name": item.get("name") or repo.split("/")[-1],
        "slug": slug,
        "primary_category": normalize_category(item.get("category", "registry")),
        "secondary_categories": secondary_categories,
        "tags": [t for t in [item.get("category"), "skill-tree", "security-audited"] if t],
        "summary": item.get("summary") or "Repository audited by Skill Tree",
        "description": f"Automated Skill Tree audit for {repo}. Source category: {item.get('category', 'unknown')}.",
        "source": {
            "repo_url": item.get("source") or source.get("repo_url"),
            "platform": source.get("platform", "github"),
            "owner": source.get("owner") or repo.split("/")[0],
            "repo": source.get("repo") or repo.split("/")[1],
            "stars": stars,
        },
        "compatibility": {
            "agents": ["claude-code", "openclaw", "codex"],
            "languages": list(report["scan_stats"].get("language_breakdown", {}).keys())[:10],
        },
        "capabilities": sorted([
            cap for cap, enabled in {
                "network": report["security"].get("network_access"),
                "file-write": report["security"].get("file_write"),
                "shell-execution": report["security"].get("shell_execution"),
                "browser-control": report["security"].get("browser_control"),
                "credentials-access": report["security"].get("credentials_access"),
            }.items() if enabled
        ]),
        "security": report["security"],
        "audit": {
            "status": "reviewed",
            "findings_count": report["audit"]["findings_count"],
            "last_audited_at": report["audit"]["last_audited_at"],
            "auditor": report["audit"].get("auditor", "吕明亮"),
            "recommendation": report["audit"]["recommendation"],
            "findings": findings,
        },
        "discovery": {
            "discovered_from": "T-041 shortlist / T-043 priority set",
            "catalog_version": "v1",
            "featured": True,
            "popularity_score": popularity_score(stars),
            "quality_score": quality_score(report, item),
            "security_score": security_score(report),
        },
        "updated_at": ts,
    }


def validate_record(record: Dict[str, Any], schema: Dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in schema.get("required", []):
        if field not in record:
            errors.append(f"missing required field: {field}")

    enum_values = schema.get("properties", {}).get("primary_category", {}).get("enum", [])
    if record.get("primary_category") not in enum_values:
        errors.append(f"invalid primary_category: {record.get('primary_category')}")

    risk_enum = schema.get("properties", {}).get("security", {}).get("properties", {}).get("risk_level", {}).get("enum", [])
    if record.get("security", {}).get("risk_level") not in risk_enum:
        errors.append(f"invalid risk_level: {record.get('security', {}).get('risk_level')}")

    audit_status_enum = schema.get("properties", {}).get("audit", {}).get("properties", {}).get("status", {}).get("enum", [])
    if record.get("audit", {}).get("status") not in audit_status_enum:
        errors.append(f"invalid audit.status: {record.get('audit', {}).get('status')}")

    recommendation_enum = schema.get("properties", {}).get("audit", {}).get("properties", {}).get("recommendation", {}).get("enum", [])
    if record.get("audit", {}).get("recommendation") not in recommendation_enum:
        errors.append(f"invalid audit.recommendation: {record.get('audit', {}).get('recommendation')}")

    for finding in record.get("audit", {}).get("findings", []):
        if finding.get("severity") not in {"info", "low", "medium", "high", "critical"}:
            errors.append(f"invalid finding severity: {finding.get('severity')}")
            break

    return errors


def to_markdown(record: Dict[str, Any]) -> str:
    lines = [
        f"# {record['slug']} audit",
        "",
        f"- Repository: {record['source']['owner']}/{record['source']['repo']}",
        f"- URL: {record['source']['repo_url']}",
        f"- Risk level: **{record['security']['risk_level']}**",
        f"- Recommendation: **{record['audit'].get('recommendation', 'review')}**",
        f"- Findings: {record['audit']['findings_count']}",
        "",
        "## Security summary",
    ]
    for bullet in record['security'].get('summary', []):
        lines.append(f"- {bullet}")
    lines.extend(["", "## Findings"]) 
    for finding in record['audit'].get('findings', [])[:25]:
        lines.extend([
            f"### [{finding['severity']}] {finding['title']}",
            f"- Path: `{finding.get('path','')}`:{finding.get('line','')}",
            f"- Category: {finding.get('category','')}",
            f"- Evidence: `{finding.get('evidence','').replace('`', '\\`')}`",
            f"- Description: {finding.get('description','')}",
            "",
        ])
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    auditor = load_auditor_module()
    catalog = load_catalog()
    schema = load_schema()

    generated: List[str] = []
    validation_errors: Dict[str, list[str]] = {}
    for repo in DEFAULT_TARGETS[: args.limit]:
        item = catalog.get(repo, {
            "name": repo.split("/")[-1],
            "repo": repo,
            "category": "registry",
            "source": f"https://github.com/{repo}",
            "stars": 0,
            "summary": f"Skill repository {repo}",
        })
        report = auditor.build_report(f"https://github.com/{repo}")
        record = to_skill_record(item, report)
        slug = record["slug"]
        errors = validate_record(record, schema)
        if errors:
            validation_errors[slug] = errors
        json_path = OUTPUT_DIR / f"{slug}.json"
        md_path = OUTPUT_DIR / f"{slug}.md"
        json_path.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        md_path.write_text(to_markdown(record), encoding="utf-8")
        generated.append(slug)
        print(f"generated {slug}")

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(generated),
        "items": generated,
        "validation": {
            "valid": len(validation_errors) == 0,
            "invalid_items": validation_errors,
        },
    }
    (OUTPUT_DIR / "index.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
