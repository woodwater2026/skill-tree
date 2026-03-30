const state = {
  items: [],
  query: "",
  risk: "all",
  category: "all",
  whereCode: "all",
  secretHolder: "all",
  backgroundFit: "all",
  auditedOnly: false,
  activeRepos: null,
  bestLists: [],
  guides: [],
  guidesMap: new Map(),
  p0Pack: [],
  p0PackMap: new Map(),
  p1Pack: [],
  p1PackMap: new Map(),
  guidePlan: [],
  guidePlanMap: new Map(),
};

const els = {
  stats: document.getElementById("stats"),
  search: document.getElementById("search"),
  riskFilters: document.getElementById("risk-filters"),
  categoryFilters: document.getElementById("category-filters"),
  whereCodeFilters: document.getElementById("where-code-filters"),
  secretHolderFilters: document.getElementById("secret-holder-filters"),
  backgroundFitFilters: document.getElementById("background-fit-filters"),
  categoryNav: document.getElementById("category-nav"),
  capabilityMap: document.getElementById("capability-map-grid"),
  grid: document.getElementById("grid"),
  summary: document.getElementById("results-summary"),
  template: document.getElementById("card-template"),
  bestLists: document.getElementById("best-lists-grid"),
  topGuides: document.getElementById("top-guides"),
  safeStart: document.getElementById("safe-start-grid"),
  p1Guides: document.getElementById("p1-guides-grid"),
  p0Guides: document.getElementById("p0-guides-grid"),
  runtimeControl: document.getElementById("runtime-control-grid"),
  runtimeBoundary: document.getElementById("runtime-boundary-grid"),
};

const CATEGORY_LABELS = {
  development: "Development",
  research: "Research",
  productivity: "Productivity",
  communication: "Communication",
  "data-analysis": "Data & Analysis",
  "security-compliance": "Security & Compliance",
  "agent-operations": "Agent Operations",
  "system-environment": "System & Environment",
  creativity: "Creativity",
  registry: "Registry",
  general: "General",
  tooling: "Tooling",
  security: "Security",
};

const CAPABILITY_MAP = [
  {
    slug: 'long-running-support',
    title: 'Long-running Task Support',
    blurb: 'Keep plans, checkpoints, and progress alive across longer jobs.',
    audience: 'Teams running investigations, batch work, and longer agent loops',
    risk: 'Usually medium risk due to persistence and local writes',
    picks: ['planning-with-files', 'claude-tmux', 'AgentSys'],
    action: { type: 'query', value: 'long-running tasks' },
  },
  {
    slug: 'governance-safety-review',
    title: 'Governance / Safety / Review',
    blurb: 'Add visibility, review, and control before automation becomes expensive.',
    audience: 'Security teams, operators, and owners of high-blast-radius workflows',
    risk: 'Usually medium to high risk because this layer touches power and policy',
    picks: ['Trail of Bits Security Skills', 'skill-scanner', 'parry'],
    action: { type: 'list', value: 'best-for-security' },
  },
  {
    slug: 'subagent-orchestration',
    title: 'Subagent Coordination / Orchestration',
    blurb: 'Coordinate roles, tool chains, and multi-step flows instead of one-shot prompting.',
    audience: 'Builders designing multi-agent or workflow-heavy systems',
    risk: 'Usually medium risk due to wider automation breadth',
    picks: ['superpowers', 'claude-code-agents', 'AgentSys'],
    action: { type: 'query', value: 'orchestration' },
  },
  {
    slug: 'context-protocol',
    title: 'Context / Protocol Integration',
    blurb: 'Connect the agent to the right context, memory, and external systems at the right time.',
    audience: 'Users who need better context loading and protocol-aware workflows',
    risk: 'Usually medium risk because integrations widen the surface area',
    picks: ['obsidian-skills', 'planning-with-files', 'compound-engineering-plugin'],
    action: { type: 'query', value: 'protocol context integration' },
  },
  {
    slug: 'execution-tool-use',
    title: 'Execution / Tool Use',
    blurb: 'Make the agent actually do useful work across code, browser, docs, and data tasks.',
    audience: 'Hands-on users who need direct execution leverage',
    risk: 'Usually medium risk because execution layers touch real tools and files',
    picks: ['superpowers', 'claude-scientific-skills', 'cc-devops-skills'],
    action: { type: 'query', value: 'execution tool use' },
  },
  {
    slug: 'knowledge-retention',
    title: 'Knowledge / Output Retention',
    blurb: 'Turn one-off agent work into notes, reports, memory, and reusable outputs.',
    audience: 'Researchers, PMs, operators, and teams who need durable outputs',
    risk: 'Usually low to medium risk',
    picks: ['obsidian-skills', 'claude-scientific-skills', 'planning-with-files'],
    action: { type: 'query', value: 'knowledge output retention' },
  },
];

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function slugifyRepo(repo) {
  return repo.toLowerCase().replaceAll("_", "-").replaceAll("/", "-");
}

function labelCategory(category) {
  return CATEGORY_LABELS[category] || category.replaceAll("-", " ");
}

function repoPlatform(repo = "") {
  const lower = repo.toLowerCase();
  if (lower.includes("cursor")) return "Cursor";
  if (lower.includes("windsurf")) return "Windsurf";
  if (lower.includes("openclaw")) return "OpenClaw";
  if (lower.includes("copilot")) return "Copilot";
  if (lower.includes("codex")) return "Codex";
  return "Claude Code";
}

function installCommand(item) {
  if (item.install_cmd) return item.install_cmd;
  if (item.repo) return `/plugin install github:${item.repo}`;
  return "/plugin install <skill-repo>";
}

function useCase(item) {
  if (item.use_case) return item.use_case;
  const category = item.category || "general";
  if (["security-compliance", "security"].includes(category)) {
    return "Use when you need a fast security review, permission check, or risk triage before running a skill.";
  }
  if (["development", "tooling"].includes(category)) {
    return "Use when you want to speed up coding workflows such as refactors, review, testing, or repo setup.";
  }
  if (["research", "registry"].includes(category)) {
    return "Use when you are exploring the skill ecosystem and want to discover, compare, or shortlist tools quickly.";
  }
  return "Use when you need a reusable agent workflow and want to evaluate value before installing.";
}

function riskExplanation(item) {
  if (item.risk_explanation) return item.risk_explanation;
  const risk = item.risk || "medium";
  const findings = item.auditCount || 0;
  const hasNetwork = item.capabilities?.includes("network");
  const hasShell = item.capabilities?.includes("shell-execution");
  if (risk === "low") return "Low risk because the repo mostly looks like docs, registry metadata, or narrowly scoped workflow content.";
  if (risk === "critical") return `Critical risk because the audit found strong unsafe indicators${findings ? ` across ${findings} findings` : ""}, and it should not be run without deep manual review.`;
  if (risk === "high") {
    return `High risk because the repo likely touches powerful capabilities${hasShell ? " (shell execution)" : ""}${hasNetwork ? " and outbound network access" : ""}. Manual review is recommended before use.`;
  }
  return `Medium risk because the repo has useful capability but still exposes elevated behavior${findings ? ` with ${findings} flagged findings` : ""}. Review before installing.`;
}

function oneLineSummary(item) {
  if (item.one_line_summary) return item.one_line_summary;
  return item.summary || `${item.name} for ${labelCategory(item.category || "general").toLowerCase()} workflows.`;
}

function humanAuditSummary(item) {
  const risk = item.risk || "medium";
  const recommendation = item.recommendation || "review";
  const majorRisk = item.findings?.[0]?.title || (risk === "low" ? "no major red flags surfaced in the first pass" : "review the flagged behavior before installing");
  return {
    what: oneLineSummary(item),
    safe:
      risk === "low"
        ? "Safe enough for first-pass exploration; still verify the repo before real use."
        : risk === "medium"
          ? "Potentially useful, but not a blind install. Read the audit summary first."
          : "Do not install blindly. Treat this as a manual-review item.",
    risk: `Main risk: ${majorRisk}. Recommendation: ${recommendation}.`,
  };
}

function runtimeProfile(item) {
  const level = item.runtime_control_level || 'unknown';
  const surfaces = item.runtime_control_surfaces || [];
  if (level === 'none' || level === 'unknown') return 'Manual helper';
  if (level === 'basic' && surfaces.includes('background-execution')) return 'Workflow helper';
  if (level === 'advanced' && surfaces.includes('delegation')) return 'Orchestration layer';
  if (level === 'advanced' && surfaces.includes('protocol-bridge')) return 'Protocol / control-plane layer';
  return level === 'advanced' ? 'Persistent workflow layer' : 'Workflow helper';
}

function oversightRecommendation(item) {
  const level = item.runtime_control_level || 'unknown';
  if (level === 'none') return 'Good starter option. Minimal review needed before first use.';
  if (level === 'basic') return 'Review before first install. Safe when kept inside a controlled workspace.';
  if (level === 'advanced') return 'Advanced workflow option. Use only with clear operator oversight and runtime awareness.';
  return 'Review runtime behavior before install; control expectations are still unclear.';
}

function whereCodeRuns(item) {
  if (item.where_code_runs) return item.where_code_runs;
  const layer = (item.distribution_layer || '').toLowerCase();
  const localFirst = (item.local_first || '').toLowerCase();
  if (layer.includes('hosted') || layer.includes('cloud')) return 'Remote / hosted runtime';
  if (localFirst.includes('yes') || localFirst.includes('local')) return 'Local machine with optional remote APIs';
  if (item.runtime_control_level === 'advanced') return 'Hybrid runtime with extended control surfaces';
  return 'Mostly local or unclear from current evidence';
}

function secretHolder(item) {
  if (item.secret_holder) return item.secret_holder;
  const vis = (item.permission_visibility || '').toLowerCase();
  const layer = (item.distribution_layer || '').toLowerCase();
  if (vis.includes('user') || vis.includes('local')) return 'User-held locally';
  if (layer.includes('hosted') || layer.includes('cloud')) return 'Mixed or provider-involved';
  return 'Unclear from current docs';
}

function backgroundDurationFit(item) {
  if (item.background_duration_fit) return item.background_duration_fit;
  const unattended = (item.unattended_run || '').toLowerCase();
  const bg = (item.background_execution || '').toLowerCase();
  if (unattended === 'supported' || bg.includes('long')) return 'Long-running / durable';
  if (unattended === 'limited' || bg.includes('short')) return 'Short background tasks';
  if (unattended === 'unsupported' || unattended === 'none') return 'Interactive only';
  return 'Claim unclear';
}

function auditEvidence(item) {
  if (item.audit_evidence) return item.audit_evidence;
  if (item.findings?.length) return 'Strong evidence via static audit findings and repo inspection';
  if (item.securitySummary?.length) return 'Partial evidence via summarized review and metadata';
  return 'Weak evidence — rely on docs and manual review';
}

function deriveWorkflowMetadata(item) {
  const workflowScenarios = Array.isArray(item.workflow_scenarios) ? [...item.workflow_scenarios] : [];
  const unattended = item.unattended_run || "unknown";
  const subagent = item.subagent_support || "unknown";
  const protocolSupport = Array.isArray(item.protocol_support) ? item.protocol_support : [];
  const rationale = (item.governance_rationale || "").toLowerCase();
  const useCaseText = (item.use_case || "").toLowerCase();

  if (!workflowScenarios.length) {
    if (["supported", "limited"].includes(unattended) || rationale.includes("scheduled") || rationale.includes("background")) {
      workflowScenarios.push("scheduled");
    }
    if (unattended === "supported" || rationale.includes("long-running") || useCaseText.includes("planning continuity")) {
      workflowScenarios.push("long-running");
    }
    if (subagent === "supported" || rationale.includes("multi-agent") || rationale.includes("delegation") || rationale.includes("orchestration")) {
      workflowScenarios.push("multi-agent");
    }
    if (protocolSupport.length || rationale.includes("protocol") || rationale.includes("mcp")) {
      workflowScenarios.push("context-protocol");
    }
  }

  let runtimeControlLevel = item.runtime_control_level || "none";
  if (!item.runtime_control_level) {
    runtimeControlLevel = (["supported", "limited"].includes(unattended) || subagent === "supported" || protocolSupport.length) ? "basic" : "none";
    if (unattended === "supported" && ["medium", "high"].includes(item.governance_maturity) && (subagent === "supported" || protocolSupport.length)) {
      runtimeControlLevel = "advanced";
    }
    if (unattended === "unknown" && subagent === "unknown" && !protocolSupport.length) {
      runtimeControlLevel = "unknown";
    }
  }

  const runtimeControlSurfaces = Array.isArray(item.runtime_control_surfaces) ? item.runtime_control_surfaces : [];
  if (!runtimeControlSurfaces.length) {
    if (["supported", "limited"].includes(unattended)) runtimeControlSurfaces.push("background-execution");
    if (subagent === "supported") runtimeControlSurfaces.push("delegation");
    if (protocolSupport.length) runtimeControlSurfaces.push("protocol-bridge");
    if (["medium", "high"].includes(item.governance_maturity)) runtimeControlSurfaces.push("governance-controls");
  }

  const workflowEntrySignals = Array.isArray(item.workflow_entry_signals) ? item.workflow_entry_signals : [];
  if (!workflowEntrySignals.length) {
    if (workflowScenarios.includes("scheduled")) workflowEntrySignals.push("choose when work must run on a schedule or without a person watching every step");
    if (workflowScenarios.includes("long-running")) workflowEntrySignals.push("choose when the job spans multiple checkpoints, retries, or context handoffs");
    if (workflowScenarios.includes("multi-agent")) workflowEntrySignals.push("choose when one agent is not enough and you need delegation or orchestration");
    if (workflowScenarios.includes("context-protocol")) workflowEntrySignals.push("choose when the agent must load external context or connect through MCP/API/CLI bridges");
  }

  const workflowDecisionAxes = Array.isArray(item.workflow_decision_axes) ? item.workflow_decision_axes : [];
  if (!workflowDecisionAxes.length) {
    if (["supported", "limited"].includes(unattended)) workflowDecisionAxes.push("operator involvement required");
    if (item.install_friction) workflowDecisionAxes.push("setup friction and local services");
    if (protocolSupport.length) workflowDecisionAxes.push("integration surface and protocol compatibility");
    if (subagent === "supported") workflowDecisionAxes.push("coordination complexity across agents");
    if (["medium", "high"].includes(item.governance_maturity)) workflowDecisionAxes.push("governance depth and approval controls");
  }

  const workflowRiskSignals = Array.isArray(item.workflow_risk_signals) ? item.workflow_risk_signals : [];
  if (!workflowRiskSignals.length) {
    if (unattended === "supported") workflowRiskSignals.push("unattended execution can amplify mistakes before a human notices");
    else if (unattended === "limited") workflowRiskSignals.push("partially unattended flows still need explicit checkpoints and fallbacks");
    if (subagent === "supported") workflowRiskSignals.push("delegation broadens blast radius and makes failures harder to trace");
    if (protocolSupport.length) workflowRiskSignals.push("protocol bridges widen the integration and credential surface area");
    if (["unknown", "low"].includes(item.governance_maturity || "unknown")) workflowRiskSignals.push("governance depth is unclear, so runtime controls may need manual review");
  }

  const siteSurfaces = Array.isArray(item.site_surfaces) ? item.site_surfaces : [];
  if (!siteSurfaces.length) {
    siteSurfaces.push("catalog");
    if (workflowScenarios.length) siteSurfaces.push("specials", "filters");
    if (["basic", "advanced"].includes(runtimeControlLevel)) siteSurfaces.push("runtime-control");
  }

  return {
    workflow_scenarios: [...new Set(workflowScenarios)],
    runtime_control_level: runtimeControlLevel,
    runtime_control_surfaces: [...new Set(runtimeControlSurfaces)],
    workflow_entry_signals: [...new Set(workflowEntrySignals)],
    workflow_decision_axes: [...new Set(workflowDecisionAxes)],
    workflow_risk_signals: [...new Set(workflowRiskSignals)],
    site_surfaces: [...new Set(siteSurfaces)],
  };
}

function mergeData(catalog, audits, enrichedMap = new Map()) {
  const auditMap = new Map(audits.map((item) => [item.slug, item]));
  return catalog.items.map((item) => {
    const slug = slugifyRepo(item.repo);
    const audit = auditMap.get(slug);
    const enriched = enrichedMap.get(slug) || enrichedMap.get(item.repo) || {};
    const category = audit?.primary_category || item.category || "unknown";
    const guide = state.p0PackMap.get(item.repo) || state.guidesMap.get(slug) || state.guidesMap.get(item.repo) || {};
    const base = {
      slug,
      name: item.name,
      repo: item.repo,
      summary: item.summary,
      source: item.source,
      stars: item.stars ?? 0,
      category,
      risk: audit?.security?.risk_level || item?.safety_precheck?.rating || item.security_rating || "unknown",
      auditCount: audit?.audit?.findings_count || 0,
      recommendation: audit?.audit?.recommendation || "review",
      securityScore: audit?.discovery?.security_score ?? null,
      qualityScore: audit?.discovery?.quality_score ?? null,
      popularityScore: audit?.discovery?.popularity_score ?? null,
      securitySummary: audit?.security?.summary || [item?.safety_precheck?.notes || "Precheck only"],
      findings: (audit?.audit?.findings || []).slice(0, 5),
      capabilities: audit?.capabilities || [],
      platform: repoPlatform(item.repo),
      install_cmd: item.install_cmd || enriched.install_cmd || guide.install_cmd,
      use_case: item.use_case || enriched.use_case,
      risk_explanation: item.risk_explanation || enriched.risk_explanation,
      install_friction: item.install_friction || enriched.install_friction,
      unattended_run: item.unattended_run || enriched.unattended_run,
      subagent_support: item.subagent_support || enriched.subagent_support,
      protocol_support: item.protocol_support || enriched.protocol_support || [],
      governance_maturity: item.governance_maturity || enriched.governance_maturity,
      governance_rationale: item.governance_rationale || enriched.governance_rationale,
      workflow_stack_role: item.workflow_stack_role || enriched.workflow_stack_role,
      supports_scheduled: item.supports_scheduled || enriched.supports_scheduled,
      supports_long_running: item.supports_long_running || enriched.supports_long_running,
      supports_multi_agent: item.supports_multi_agent || enriched.supports_multi_agent,
      supports_context_protocol: item.supports_context_protocol || enriched.supports_context_protocol,
      workflow_specials: item.workflow_specials || enriched.workflow_specials || [],
      workflow_entry_points: item.workflow_entry_points || enriched.workflow_entry_points || [],
      scheduled_fit_explanation: item.scheduled_fit_explanation || enriched.scheduled_fit_explanation,
      workflow_scenarios: item.workflow_scenarios || enriched.workflow_scenarios || [],
      runtime_control_level: item.runtime_control_level || enriched.runtime_control_level,
      distribution_layer: item.distribution_layer || enriched.distribution_layer,
      background_execution: item.background_execution || enriched.background_execution,
      local_first: item.local_first || enriched.local_first,
      workflow_lock_in: item.workflow_lock_in || enriched.workflow_lock_in,
      permission_visibility: item.permission_visibility || enriched.permission_visibility,
      runtime_control_rationale: item.runtime_control_rationale || enriched.runtime_control_rationale,
      execution_boundary: item.execution_boundary || enriched.execution_boundary,
      where_code_runs: item.where_code_runs || enriched.where_code_runs,
      secret_holder: item.secret_holder || enriched.secret_holder,
      audit_evidence: item.audit_evidence || enriched.audit_evidence,
      background_duration_fit: item.background_duration_fit || enriched.background_duration_fit,
      runtime_control_surfaces: item.runtime_control_surfaces || enriched.runtime_control_surfaces || [],
      workflow_entry_signals: item.workflow_entry_signals || enriched.workflow_entry_signals || [],
      workflow_decision_axes: item.workflow_decision_axes || enriched.workflow_decision_axes || [],
      workflow_risk_signals: item.workflow_risk_signals || enriched.workflow_risk_signals || [],
      site_surfaces: item.site_surfaces || enriched.site_surfaces || [],
      one_line_summary: item.one_line_summary || enriched.one_line_summary,
      guide,
    };
    const workflow = deriveWorkflowMetadata(base);
    const merged = {
      ...base,
      ...workflow,
    };
    return {
      ...merged,
      installCommand: installCommand(merged),
      useCaseText: useCase(merged),
      riskExplanationText: riskExplanation(merged),
      humanSummary: humanAuditSummary(merged),
    };
  });
}

function statCard(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderStats(items) {
  const audited = items.filter((item) => item.auditCount > 0);
  const riskCounts = audited.reduce((acc, item) => {
    acc[item.risk] = (acc[item.risk] || 0) + 1;
    return acc;
  }, {});
  els.stats.innerHTML = [
    statCard("Cataloged skills", items.length),
    statCard("Audited batch", audited.length),
    statCard("High/Critical", (riskCounts.high || 0) + (riskCounts.critical || 0)),
    statCard("Low risk", riskCounts.low || 0),
  ].join("");
}

function renderFilters() {
  const risks = ["all", "low", "medium", "high", "critical"];
  els.riskFilters.innerHTML = risks
    .map((risk) => `<button class="filter ${state.risk === risk ? "active" : ""}" data-kind="risk" data-value="${risk}">${risk}</button>`)
    .join("");

  const categories = ["all", ...new Set(state.items.map((item) => item.category).filter(Boolean))].sort();
  els.categoryFilters.innerHTML = categories
    .map((category) => `<button class="filter ${state.category === category ? "active" : ""}" data-kind="category" data-value="${category}">${labelCategory(category)}</button>`)
    .join("");

  const whereCodes = ["all", ...new Set(state.items.map((item) => whereCodeRuns(item)).filter(Boolean))].sort();
  const secretHolders = ["all", ...new Set(state.items.map((item) => secretHolder(item)).filter(Boolean))].sort();
  const backgroundFits = ["all", ...new Set(state.items.map((item) => backgroundDurationFit(item)).filter(Boolean))].sort();

  if (els.whereCodeFilters) {
    els.whereCodeFilters.innerHTML = whereCodes
      .map((value) => `<button class="filter ${state.whereCode === value ? "active" : ""}" data-kind="whereCode" data-value="${value}">${value}</button>`)
      .join("");
  }
  if (els.secretHolderFilters) {
    els.secretHolderFilters.innerHTML = secretHolders
      .map((value) => `<button class="filter ${state.secretHolder === value ? "active" : ""}" data-kind="secretHolder" data-value="${value}">${value}</button>`)
      .join("");
  }
  if (els.backgroundFitFilters) {
    els.backgroundFitFilters.innerHTML = backgroundFits
      .map((value) => `<button class="filter ${state.backgroundFit === value ? "active" : ""}" data-kind="backgroundFit" data-value="${value}">${value}</button>`)
      .join("");
  }

  if (els.categoryNav) {
    els.categoryNav.innerHTML = categories
      .filter((category) => category !== "all")
      .map((category) => `<button class="category-link ${state.category === category ? "active" : ""}" data-kind="category" data-value="${category}">${labelCategory(category)}</button>`)
      .join("");
  }

  document.querySelectorAll("button.filter, button.category-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeRepos = null;
      state[button.dataset.kind] = button.dataset.value;
      render();
    });
  });
}

function getFilteredItems() {
  const q = state.query.trim().toLowerCase();
  return state.items
    .filter((item) => {
      const guideText = [item.guide?.fit_for, item.guide?.how_to_use, item.guide?.expected_outcome, item.guide?.main_risk]
        .filter(Boolean)
        .join(" ");
      const textOk =
        !q ||
        [
          item.name,
          item.repo,
          item.summary,
          item.category,
          item.useCaseText,
          item.riskExplanationText,
          item.one_line_summary,
          (item.workflow_scenarios || []).join(" "),
          item.runtime_control_level,
          (item.runtime_control_surfaces || []).join(" "),
          (item.workflow_entry_signals || []).join(" "),
          (item.workflow_decision_axes || []).join(" "),
          (item.workflow_risk_signals || []).join(" "),
          (item.site_surfaces || []).join(" "),
          guideText,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const riskOk = state.risk === "all" || item.risk === state.risk;
      const catOk = state.category === "all" || item.category === state.category;
      const whereOk = state.whereCode === "all" || whereCodeRuns(item) === state.whereCode;
      const secretOk = state.secretHolder === "all" || secretHolder(item) === state.secretHolder;
      const bgOk = state.backgroundFit === "all" || backgroundDurationFit(item) === state.backgroundFit;
      const auditedOk = !state.auditedOnly || item.auditCount > 0;
      const repoOk = !state.activeRepos || state.activeRepos.has(item.repo);
      return textOk && riskOk && catOk && whereOk && secretOk && bgOk && auditedOk && repoOk;
    })
    .sort((a, b) => (b.stars || 0) - (a.stars || 0));
}

async function copyInstallCommand(command, button) {
  try {
    await navigator.clipboard.writeText(command);
    const old = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => (button.textContent = old), 1200);
  } catch {
    button.textContent = "Copy failed";
  }
}

function renderGuideBody(item) {
  const guide = item.guide || {};
  if (!guide.repo) return "<p>No quick guide loaded yet.</p>";
  return `
    <ul>
      <li><strong>Install:</strong> <code>${item.installCommand}</code></li>
      <li><strong>Fit for:</strong> ${guide.fit_for || "—"}</li>
      <li><strong>How to use:</strong> ${guide.how_to_use || "—"}</li>
      <li><strong>Expected outcome:</strong> ${guide.expected_outcome || "—"}</li>
      <li><strong>Main risk:</strong> ${guide.main_risk || "—"}</li>
    </ul>
  `;
}

function renderCard(item) {
  const node = els.template.content.firstElementChild.cloneNode(true);

  const installCodeEl = node.querySelector(".install-code");
  const copyBtnEl = node.querySelector(".copy-btn");
  const useCaseEl = node.querySelector(".use-case");
  const riskExplanationEl = node.querySelector(".risk-explanation");
  const runtimeLevelEl = node.querySelector(".runtime-level");
  const runtimeProfileEl = node.querySelector(".runtime-profile");
  const runtimeOversightEl = node.querySelector(".runtime-oversight");
  const whereCodeRunsEl = node.querySelector(".where-code-runs");
  const secretHolderEl = node.querySelector(".secret-holder");
  const backgroundDurationFitEl = node.querySelector(".background-duration-fit");
  const auditEvidenceEl = node.querySelector(".audit-evidence");
  const humanWhatEl = node.querySelector(".human-what");
  const humanSafeEl = node.querySelector(".human-safe");
  const humanRiskEl = node.querySelector(".human-risk");
  const guideBodyEl = node.querySelector(".guide-body");

  if (!installCodeEl || !copyBtnEl || !useCaseEl || !riskExplanationEl || !runtimeLevelEl || !runtimeProfileEl || !runtimeOversightEl || !whereCodeRunsEl || !secretHolderEl || !backgroundDurationFitEl || !auditEvidenceEl || !humanWhatEl || !humanSafeEl || !humanRiskEl) {
    node.innerHTML = `
      <div class="card-top">
        <div>
          <div class="meta-row">
            <span class="badge category">${labelCategory(item.category)}</span>
            <span class="badge risk ${item.risk}">${item.risk}</span>
          </div>
          <h3 class="title">${item.name}</h3>
          <p class="repo">${item.repo} · ${item.platform}</p>
        </div>
        <div class="score-box">
          <div class="score-label">Security</div>
          <div class="score">${item.securityScore == null ? "—" : item.securityScore}</div>
        </div>
      </div>
      <p class="summary">${oneLineSummary(item)}</p>
      <div class="facts">
        <span class="fact">⭐ ${item.stars || 0}</span>
        <span class="fact">Findings ${item.auditCount}</span>
        <span class="fact">Rec ${item.recommendation}</span>
      </div>
      <section class="install-box">
        <div class="section-label">Install</div>
        <div class="install-row">
          <code class="install-code">${item.installCommand}</code>
          <button class="copy-btn" type="button">Copy</button>
        </div>
      </section>
      <section class="user-value">
        <div class="section-label">Best use case</div>
        <p class="use-case">${item.useCaseText}</p>
      </section>
      <section class="user-value">
        <div class="section-label">Why this risk score</div>
        <p class="risk-explanation">${item.riskExplanationText}</p>
      </section>
      ${item.install_friction ? `<section class="user-value"><div class="section-label">Install friction</div><p class="risk-explanation">${item.install_friction}</p></section>` : ""}
      ${(item.unattended_run || item.subagent_support || (item.protocol_support && item.protocol_support.length) || item.governance_maturity) ? `<section class="plain-summary"><div class="section-label">Governance & protocol fit</div><ul>
        ${item.unattended_run ? `<li><strong>Unattended run:</strong> ${item.unattended_run}</li>` : ""}
        ${item.subagent_support ? `<li><strong>Subagent support:</strong> ${item.subagent_support}</li>` : ""}
        ${(item.protocol_support && item.protocol_support.length) ? `<li><strong>Protocol support:</strong> ${item.protocol_support.join(", ")}</li>` : ""}
        ${item.governance_maturity ? `<li><strong>Governance maturity:</strong> ${item.governance_maturity}</li>` : ""}
      </ul>${item.governance_rationale ? `<p class="risk-explanation">${item.governance_rationale}</p>` : ""}</section>` : ""}
      ${((item.workflow_scenarios && item.workflow_scenarios.length) || item.runtime_control_level || item.workflow_stack_role || item.workflow_specials?.length) ? `<section class="plain-summary"><div class="section-label">Workflow & runtime fit</div><ul>
        ${item.workflow_stack_role ? `<li><strong>Workflow stack role:</strong> ${item.workflow_stack_role}</li>` : ""}
        ${(item.workflow_specials && item.workflow_specials.length) ? `<li><strong>Special pages:</strong> ${item.workflow_specials.join(", ")}</li>` : ""}
        ${(item.workflow_entry_points && item.workflow_entry_points.length) ? `<li><strong>Entry points:</strong> ${item.workflow_entry_points.join(", ")}</li>` : ""}
        ${(item.workflow_scenarios && item.workflow_scenarios.length) ? `<li><strong>Scenario coverage:</strong> ${item.workflow_scenarios.join(", ")}</li>` : ""}
        ${item.supports_scheduled ? `<li><strong>Scheduled support:</strong> ${item.supports_scheduled}</li>` : ""}
        ${item.supports_long_running ? `<li><strong>Long-running support:</strong> ${item.supports_long_running}</li>` : ""}
        ${item.supports_multi_agent ? `<li><strong>Multi-agent support:</strong> ${item.supports_multi_agent}</li>` : ""}
        ${item.supports_context_protocol ? `<li><strong>Context protocol support:</strong> ${item.supports_context_protocol}</li>` : ""}
        ${item.scheduled_fit_explanation ? `<li><strong>Scheduled fit:</strong> ${item.scheduled_fit_explanation}</li>` : ""}
        ${item.runtime_control_level ? `<li><strong>Runtime control:</strong> ${item.runtime_control_level}</li>` : ""}
        ${(item.runtime_control_surfaces && item.runtime_control_surfaces.length) ? `<li><strong>Control surfaces:</strong> ${item.runtime_control_surfaces.join(", ")}</li>` : ""}
        ${(item.workflow_entry_signals && item.workflow_entry_signals.length) ? `<li><strong>Enter when:</strong> ${item.workflow_entry_signals.slice(0, 2).join(" · ")}</li>` : ""}
        ${(item.workflow_decision_axes && item.workflow_decision_axes.length) ? `<li><strong>Judge by:</strong> ${item.workflow_decision_axes.slice(0, 3).join(", ")}</li>` : ""}
        ${(item.workflow_risk_signals && item.workflow_risk_signals.length) ? `<li><strong>Watch for:</strong> ${item.workflow_risk_signals.slice(0, 2).join(" · ")}</li>` : ""}
        ${item.distribution_layer ? `<li><strong>Distribution layer:</strong> ${item.distribution_layer}</li>` : ""}
        ${item.background_execution ? `<li><strong>Background execution:</strong> ${item.background_execution}</li>` : ""}
        ${item.local_first ? `<li><strong>Local-first posture:</strong> ${item.local_first}</li>` : ""}
        ${item.workflow_lock_in ? `<li><strong>Workflow lock-in:</strong> ${item.workflow_lock_in}</li>` : ""}
        ${item.permission_visibility ? `<li><strong>Permission visibility:</strong> ${item.permission_visibility}</li>` : ""}
        ${item.execution_boundary ? `<li><strong>Execution boundary:</strong> ${item.execution_boundary}</li>` : ""}
        ${item.where_code_runs ? `<li><strong>Where code runs:</strong> ${item.where_code_runs}</li>` : ""}
        ${item.secret_holder ? `<li><strong>Secret holder:</strong> ${item.secret_holder}</li>` : ""}
        ${item.background_duration_fit ? `<li><strong>Background duration fit:</strong> ${item.background_duration_fit}</li>` : ""}
        ${(item.site_surfaces && item.site_surfaces.length) ? `<li><strong>Site surfaces:</strong> ${item.site_surfaces.join(", ")}</li>` : ""}
      </ul>${item.runtime_control_rationale ? `<p class="risk-explanation">${item.runtime_control_rationale}</p>` : ""}${item.audit_evidence ? `<p class="risk-explanation"><strong>Audit evidence:</strong> ${item.audit_evidence}</p>` : ""}</section>` : ""}
      <section class="plain-summary runtime-detail">
        <div class="section-label">Runtime control</div>
        <ul>
          <li><strong>Control level:</strong> ${item.runtime_control_level || 'unknown'}</li>
          <li><strong>Runtime profile:</strong> ${runtimeProfile(item)}</li>
          <li><strong>Oversight recommendation:</strong> ${oversightRecommendation(item)}</li>
        </ul>
      </section>
      <section class="plain-summary boundary-detail">
        <div class="section-label">Runtime Boundary Snapshot</div>
        <ul>
          <li><strong>Where code runs:</strong> ${whereCodeRuns(item)}</li>
          <li><strong>Secret holder:</strong> ${secretHolder(item)}</li>
          <li><strong>Background duration fit:</strong> ${backgroundDurationFit(item)}</li>
          <li><strong>Audit evidence:</strong> ${auditEvidence(item)}</li>
        </ul>
      </section>
      <section class="plain-summary">
        <div class="section-label">Human audit summary</div>
        <ul>
          <li><strong>What it does:</strong> ${item.humanSummary.what}</li>
          <li><strong>Is it safe?</strong> ${item.humanSummary.safe}</li>
          <li><strong>Main risk:</strong> ${item.humanSummary.risk}</li>
        </ul>
      </section>
      <details>
        <summary>Audit details</summary>
        <div class="audit">
          <ul>${item.securitySummary.map((line) => `<li>${line}</li>`).join("")}</ul>
        </div>
      </details>
      <details>
        <summary>Quick guide</summary>
        <div class="guide-body">${renderGuideBody(item)}</div>
      </details>
    `;
    const fallbackBtn = node.querySelector('.copy-btn');
    fallbackBtn?.addEventListener('click', () => copyInstallCommand(item.installCommand, fallbackBtn));
    return node;
  }

  node.querySelector(".category").textContent = labelCategory(item.category);
  const riskEl = node.querySelector(".risk");
  riskEl.textContent = item.risk;
  riskEl.classList.add(item.risk);
  node.querySelector(".title").textContent = item.name;
  node.querySelector(".repo").textContent = `${item.repo} · ${item.platform}`;
  node.querySelector(".summary").textContent = oneLineSummary(item);
  node.querySelector(".score").textContent = item.securityScore == null ? "—" : item.securityScore;
  node.querySelector(".facts").innerHTML = [
    `<span class="fact">⭐ ${item.stars || 0}</span>`,
    `<span class="fact">Findings ${item.auditCount}</span>`,
    `<span class="fact">Rec ${item.recommendation}</span>`,
    item.guide?.repo ? `<span class="fact">Guide ready</span>` : "",
  ].join("");

  installCodeEl.textContent = item.installCommand;
  copyBtnEl.addEventListener("click", () => copyInstallCommand(item.installCommand, copyBtnEl));

  useCaseEl.textContent = item.guide?.fit_for || item.useCaseText;
  riskExplanationEl.textContent = item.guide?.main_risk || item.riskExplanationText;
  runtimeLevelEl.textContent = item.runtime_control_level || 'unknown';
  runtimeProfileEl.textContent = runtimeProfile(item);
  runtimeOversightEl.textContent = oversightRecommendation(item);
  whereCodeRunsEl.textContent = whereCodeRuns(item);
  secretHolderEl.textContent = secretHolder(item);
  backgroundDurationFitEl.textContent = backgroundDurationFit(item);
  auditEvidenceEl.textContent = auditEvidence(item);
  humanWhatEl.textContent = item.humanSummary.what;
  humanSafeEl.textContent = item.humanSummary.safe;
  humanRiskEl.textContent = item.humanSummary.risk;

  node.querySelector(".audit").innerHTML = `
    <ul>
      ${item.securitySummary.map((line) => `<li>${line}</li>`).join("")}
    </ul>
    ${item.findings.length ? `<p><strong>Top findings</strong></p><ul>${item.findings.map((finding) => `<li>[${finding.severity}] ${finding.title} — <code>${finding.path || "n/a"}:${finding.line || ""}</code></li>`).join("")}</ul>` : "<p>No detailed audit loaded yet.</p>"}
  `;

  if (guideBodyEl) guideBodyEl.innerHTML = renderGuideBody(item);
  return node;
}

function renderBestLists() {
  if (!els.bestLists) return;
  if (!state.bestLists.length) {
    els.bestLists.innerHTML = "";
    return;
  }
  els.bestLists.innerHTML = state.bestLists
    .map(
      (list) => `
      <article class="best-list-card clickable" data-list-slug="${list.slug}">
        <div class="best-list-head">
          <h3>${list.title}</h3>
          <span class="best-list-chip">${list.skills?.length || 0} picks</span>
        </div>
        <p class="best-list-audience">${list.audience || ""}</p>
        <p class="best-list-intro">${list.intro || ""}</p>
        <ul class="best-list-items">
          ${(list.skills || [])
            .slice(0, 3)
            .map(
              (skill) => `
                <li>
                  <strong>${skill.name}</strong>
                  <div>${skill.why_pick || ""}</div>
                  <div class="best-list-sub">Best for: ${skill.best_for || "—"}</div>
                  <code class="mini-install">${skill.install_cmd || `/plugin add ${skill.source || skill.repo || '<repo>'}`}</code>
                </li>`
            )
            .join("")}
        </ul>
        <div class="best-list-action">Open this result set →</div>
      </article>`
    )
    .join("");

  document.querySelectorAll(".best-list-card.clickable").forEach((card) => {
    card.addEventListener("click", () => applyBestListFilter(card.dataset.listSlug));
  });
}

function renderP1Guides() {
  if (!els.p1Guides) return;
  const repos = [
    'VoltAgent/awesome-agent-skills',
    'RoundTable02/tutor-skills',
    'coleam00/second-brain-skills',
    'ArtemXTech/personal-os-skills',
  ];
  const items = state.items.filter((item) => repos.includes(item.repo));
  els.p1Guides.innerHTML = items.map((item) => {
    const guide = state.p1PackMap.get(item.repo) || {};
    return `
      <article class="guide-card">
        <h3>${item.name}</h3>
        <p class="guide-summary">${guide.one_line_summary || oneLineSummary(item)}</p>
        <div class="guide-meta">
          <span class="fact">${item.platform}</span>
          <span class="fact">P1 high-value</span>
        </div>
        <ul class="guide-points">
          <li><strong>Install:</strong> <code>${guide.install_cmd || item.installCommand}</code></li>
          <li><strong>Fit:</strong> ${guide.fit || item.useCaseText}</li>
          <li><strong>Caution:</strong> ${guide.caution || item.riskExplanationText}</li>
        </ul>
      </article>`;
  }).join('');
}

function renderP0Guides() {
  if (!els.p0Guides) return;
  const p0Repos = state.guidePlan.filter((item) => item.priority_batch === 'P0').slice(0, 6).map((item) => item.repo);
  const p0Items = state.items.filter((item) => p0Repos.includes(item.repo));
  els.p0Guides.innerHTML = p0Items.map((item) => {
    const plan = state.guidePlanMap.get(item.repo);
    const guide = state.p0PackMap.get(item.repo) || item.guide || {};
    return `
      <article class="guide-card">
        <h3>${item.name}</h3>
        <p class="guide-summary">${oneLineSummary(item)}</p>
        <div class="guide-meta">
          <span class="fact">${item.platform}</span>
          <span class="fact">${plan?.priority_batch || 'P0'}</span>
        </div>
        <ul class="guide-points">
          <li><strong>Install:</strong> <code>${item.installCommand}</code></li>
          <li><strong>Fit:</strong> ${guide.fit_for || item.useCaseText}</li>
          <li><strong>Usage:</strong> ${guide.how_to_use || 'See quick guide for the first working path.'}</li>
          <li><strong>Caution:</strong> ${guide.main_risk || item.riskExplanationText}</li>
        </ul>
      </article>`;
  }).join('');
}

function renderTopGuides() {
  if (!els.topGuides) return;
  if (!state.guides.length) {
    els.topGuides.innerHTML = "";
    return;
  }
  els.topGuides.innerHTML = state.guides
    .map(
      (guide) => `
      <article class="guide-card">
        <div class="guide-rank">#${guide.rank}</div>
        <h3>${guide.name}</h3>
        <p class="guide-summary">${guide.one_line_summary}</p>
        <div class="guide-meta">
          <span class="fact">${guide.security_rating}</span>
          <span class="fact">${guide.category}</span>
        </div>
        <ul class="guide-points">
          <li><strong>Install:</strong> <code>${guide.install_cmd}</code></li>
          <li><strong>How to use:</strong> ${guide.how_to_use}</li>
          <li><strong>Fit for:</strong> ${guide.fit_for}</li>
          <li><strong>Risk:</strong> ${guide.main_risk}</li>
        </ul>
      </article>`
    )
    .join("");
}

function renderCapabilityMap() {
  if (!els.capabilityMap) return;
  els.capabilityMap.innerHTML = CAPABILITY_MAP.map((cap) => `
    <article class="capability-card" data-capability-slug="${cap.slug}">
      <span class="capability-chip">Capability</span>
      <h3>${cap.title}</h3>
      <p class="capability-sub">${cap.blurb}</p>
      <div class="capability-skills">
        ${cap.picks.map((pick) => `<span class="capability-skill">${pick}</span>`).join('')}
      </div>
      <p class="capability-for"><strong>Best for:</strong> ${cap.audience}</p>
      <p class="capability-risk"><strong>Risk hint:</strong> ${cap.risk}</p>
      <div class="capability-action">See best skills →</div>
    </article>
  `).join('');

  document.querySelectorAll('.capability-card').forEach((card) => {
    card.addEventListener('click', () => applyCapabilityAction(card.dataset.capabilitySlug));
  });
}

function renderRuntimeControlMap() {
  if (!els.runtimeControl) return;
  const levels = [
    {
      label: 'Level 1 — Guided / Explicit',
      summary: 'Direct user intent, limited runtime power, best starting point for cautious users.',
    },
    {
      label: 'Level 2 — Assisted / Scoped',
      summary: 'Useful automation with bounded workflow scope and moderate operator review.',
    },
    {
      label: 'Level 3 — Automated / Extended',
      summary: 'Persistence, broader workflow reach, and stronger runtime assumptions.',
    },
    {
      label: 'Level 4 — Orchestrated / High-Control',
      summary: 'Subagent, protocol, or workflow-layer control that needs mature oversight.',
    },
  ];
  els.runtimeControl.innerHTML = levels.map((level) => `
    <div class="risk-check-card">
      <strong>${level.label}</strong>
      <span>${level.summary}</span>
    </div>
  `).join('');
}

function renderRuntimeBoundaryMap() {
  if (!els.runtimeBoundary) return;
  const cards = [
    {
      label: 'Where code runs',
      summary: 'Is this mostly local, remote/hosted, or a hybrid runtime with unclear transitions?',
    },
    {
      label: 'Secret holder',
      summary: 'Do secrets stay with the user, move to a provider, or fall into a mixed trust model?',
    },
    {
      label: 'Background duration fit',
      summary: 'Can it actually run unattended for long enough to matter, or is background support only implied?',
    },
    {
      label: 'Audit evidence',
      summary: 'What proof do you get that execution happened and what exactly it touched?',
    },
  ];
  els.runtimeBoundary.innerHTML = cards.map((card) => `
    <div class="risk-check-card">
      <strong>${card.label}</strong>
      <span>${card.summary}</span>
    </div>
  `).join('');
}

function renderSafeStart() {
  if (!els.safeStart) return;
  const safeItems = state.items
    .filter((item) => item.risk === "low" || (item.risk === "medium" && item.recommendation !== "avoid"))
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, 4);

  els.safeStart.innerHTML = safeItems
    .map(
      (item) => `
      <article class="safe-start-card">
        <div class="meta-row">
          <span class="badge category">${labelCategory(item.category)}</span>
          <span class="badge risk ${item.risk}">${item.risk}</span>
        </div>
        <h3>${item.name}</h3>
        <p class="guide-summary">${oneLineSummary(item)}</p>
        <div class="guide-meta">
          <span class="fact">⭐ ${item.stars || 0}</span>
          <span class="fact">${item.platform}</span>
        </div>
        <p class="best-list-sub">${riskExplanation(item)}</p>
        <code class="mini-install">${item.installCommand}</code>
      </article>`
    )
    .join("");
}

function render() {
  renderFilters();
  renderCapabilityMap();
  renderRuntimeControlMap();
  renderRuntimeBoundaryMap();
  renderBestLists();
  renderP1Guides();
  renderP0Guides();
  renderTopGuides();
  renderSafeStart();
  const items = getFilteredItems();
  const activeCategory = state.category === "all" ? "All categories" : labelCategory(state.category);
  const auditedLabel = state.auditedOnly ? " · Audited only" : "";
  const outcomeLabel = state.activeRepos ? " · Outcome preset" : "";
  els.summary.textContent = `${items.length} result${items.length === 1 ? "" : "s"} · ${activeCategory}${auditedLabel}${outcomeLabel}`;
  els.grid.innerHTML = "";
  items.forEach((item) => els.grid.appendChild(renderCard(item)));
}

async function loadOptionalEnriched() {
  const candidates = [
    "../catalog/runtime-execution-boundary-v1.json",
    "../../agents/research/runtime-execution-boundary-v1.json",
    "../catalog/runtime-control-fields-v1.json",
    "../../agents/research/runtime-control-fields-v1.json",
    "../catalog/scheduled-workflow-candidates-v1.json",
    "../../agents/research/scheduled-workflow-candidates-v1.json",
    "../catalog/workflow-runtime-fields-v1.json",
    "../catalog/high-intent-governance-fields-v1.json",
    "../../agents/research/high-intent-governance-fields-v1.json",
    "../catalog/high-intent-skills-enriched-v1.json",
    "../../agents/research/high-intent-skills-enriched-v1.json",
    "../catalog/skills-catalog-top20-enriched.json",
    "../../agents/research/skills-catalog-top20-enriched.json",
  ];
  const merged = new Map();
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      for (const item of items) {
        const key = item.slug || item.repo;
        merged.set(key, { ...(merged.get(key) || {}), ...item });
      }
    } catch {
      // ignore
    }
  }
  return merged;
}

function normalizeBestLists(data) {
  if (Array.isArray(data?.lists)) {
    return data.lists.map((list) => ({
      ...list,
      intro: list.intro || list.description || "",
      skills: (list.skills || []).map((skill) => ({
        ...skill,
        why_pick: skill.why_pick || skill.why_recommended || "",
        best_for: skill.best_for || "",
        install_cmd: skill.install_cmd || "",
      })),
    }));
  }

  if (Array.isArray(data?.pages)) {
    return data.pages.map((page) => ({
      slug: page.slug,
      title: page.title,
      audience: page.description || "",
      intro: page.description || "",
      skills: (page.skills || []).map((skill) => ({
        ...skill,
        why_pick: skill.why_recommended || skill.why_pick || "",
        best_for: skill.best_for || "",
        install_cmd: skill.install_cmd || "",
      })),
    }));
  }

  return [];
}

async function loadBestLists() {
  const candidates = [
    "../catalog/best-skills-for-x-v2.json",
    "../../agents/product/best-skills-for-x-v2.json",
    "../catalog/best-skills-for-x-v1.json",
    "../../agents/product/best-skills-for-x-v1.json",
  ];
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      const normalized = normalizeBestLists(data);
      if (normalized.length) return normalized;
    } catch {
      // ignore
    }
  }
  return [];
}

async function loadGuides() {
  const candidates = [
    "../catalog/top10-skill-guides-v1.json",
    "../../agents/research/top10-skill-guides-v1.json",
  ];
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      const items = Array.isArray(data.items) ? data.items : [];
      return items;
    } catch {
      // ignore
    }
  }
  return [];
}

async function loadP0Pack() {
  const candidates = [
    "../catalog/top50-guides-p0-pack-v1.json",
    "../../agents/research/top50-guides-p0-pack-v1.json",
  ];
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      return Array.isArray(data.items) ? data.items : [];
    } catch {
      // ignore
    }
  }
  return [];
}

async function loadP1Pack() {
  const candidates = [
    "../catalog/top50-guides-p1-pack-v1.json",
    "../../agents/research/top50-guides-p1-pack-v1.json",
  ];
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      return Array.isArray(data.items) ? data.items : [];
    } catch {
      // ignore
    }
  }
  return [];
}

async function loadGuidePlan() {
  const candidates = [
    "../catalog/top50-guides-gap-plan-v1.json",
    "../../agents/research/top50-guides-gap-plan-v1.json",
  ];
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      return Array.isArray(data.items) ? data.items : [];
    } catch {
      // ignore
    }
  }
  return [];
}

function scrollToGrid() {
  document.getElementById("grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyPresetFilter(preset) {
  if (preset === "low-risk") {
    state.risk = "low";
    state.category = "all";
    state.auditedOnly = false;
    state.activeRepos = null;
    state.query = "";
    els.search.value = "";
    render();
    scrollToGrid();
    return;
  }
  if (preset === "audited") {
    state.risk = "all";
    state.category = "all";
    state.auditedOnly = true;
    state.activeRepos = null;
    state.query = "";
    els.search.value = "";
    render();
    scrollToGrid();
    return;
  }
  if (preset === "use-case") {
    state.risk = "all";
    state.category = "all";
    state.auditedOnly = false;
    state.activeRepos = null;
    state.query = "";
    els.search.value = "";
    render();
    document.getElementById("best-lists")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (preset === "workflow-stack") {
    state.risk = "all";
    state.category = "all";
    state.auditedOnly = false;
    state.activeRepos = null;
    state.query = "";
    els.search.value = "";
    render();
    document.getElementById("capability-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function applyBestListFilter(listSlug) {
  const list = state.bestLists.find((item) => item.slug === listSlug);
  if (!list) return;
  const repos = new Set((list.skills || []).map((skill) => skill.repo));
  state.risk = "all";
  state.category = "all";
  state.auditedOnly = false;
  state.activeRepos = repos;
  state.query = "";
  els.search.value = "";
  render();
  scrollToGrid();
}

function applyCapabilityAction(capabilitySlug) {
  const cap = CAPABILITY_MAP.find((item) => item.slug === capabilitySlug);
  if (!cap) return;
  if (cap.action.type === 'list') {
    applyBestListFilter(cap.action.value);
    return;
  }
  state.risk = 'all';
  state.category = 'all';
  state.auditedOnly = false;
  state.activeRepos = null;
  state.query = cap.action.value;
  els.search.value = cap.action.value;
  render();
  scrollToGrid();
}

async function main() {
  const [catalog, auditIndex, enrichedMap, bestLists, guides, p0Pack, p1Pack, guidePlan] = await Promise.all([
    loadJson("../catalog/index.json").catch(() => loadJson("../catalog/skills-catalog-v1.json")),
    loadJson("../audits/index.json"),
    loadOptionalEnriched(),
    loadBestLists(),
    loadGuides(),
    loadP0Pack(),
    loadP1Pack(),
    loadGuidePlan(),
  ]);
  state.bestLists = bestLists;
  state.guides = guides;
  state.p0Pack = p0Pack;
  state.p1Pack = p1Pack;
  state.guidePlan = guidePlan;
  state.guidesMap = new Map(guides.map((item) => [item.repo, item]));
  state.p0PackMap = new Map(p0Pack.map((item) => [item.repo, item]));
  state.p1PackMap = new Map(p1Pack.map((item) => [item.repo, item]));
  state.guidePlanMap = new Map(guidePlan.map((item) => [item.repo, item]));
  const auditItems = await Promise.all(auditIndex.items.map((slug) => loadJson(`../audits/${slug}.json`).catch(() => null)));

  if (catalog.version === "index-v1") {
    const auditMap = new Map(auditItems.filter(Boolean).map((item) => [item.slug, item]));
    state.items = catalog.items.map((item) => {
      const audit = auditMap.get(item.slug);
      const enriched = enrichedMap.get(item.slug) || enrichedMap.get(item.repo) || {};
      const guide = state.p0PackMap.get(item.repo) || state.guidesMap.get(item.repo) || {};
      const base = {
        slug: item.slug,
        name: item.name,
        repo: item.repo,
        summary: item.summary,
        source: item.source,
        stars: item.stars ?? 0,
        category: audit?.primary_category || item.category || "unknown",
        risk: audit?.security?.risk_level || item.security_rating || "unknown",
        auditCount: audit?.audit?.findings_count || 0,
        recommendation: audit?.audit?.recommendation || (item.collection_status === "recommended" ? "use" : "review"),
        securityScore: audit?.discovery?.security_score ?? null,
        qualityScore: audit?.discovery?.quality_score ?? null,
        popularityScore: item.priority_score ?? audit?.discovery?.popularity_score ?? null,
        securitySummary: audit?.security?.summary || [item.safety_precheck?.notes || item.why_include_now || "Shortlisted item"],
        findings: (audit?.audit?.findings || []).slice(0, 5),
        capabilities: audit?.capabilities || [],
        platform: repoPlatform(item.repo),
        install_cmd: item.install_cmd || enriched.install_cmd || guide.install_cmd,
        use_case: item.use_case || enriched.use_case,
        risk_explanation: item.risk_explanation || enriched.risk_explanation,
        install_friction: item.install_friction || enriched.install_friction,
        unattended_run: item.unattended_run || enriched.unattended_run,
        subagent_support: item.subagent_support || enriched.subagent_support,
        protocol_support: item.protocol_support || enriched.protocol_support || [],
        governance_maturity: item.governance_maturity || enriched.governance_maturity,
        governance_rationale: item.governance_rationale || enriched.governance_rationale,
        workflow_stack_role: item.workflow_stack_role || enriched.workflow_stack_role,
        supports_scheduled: item.supports_scheduled || enriched.supports_scheduled,
        supports_long_running: item.supports_long_running || enriched.supports_long_running,
        supports_multi_agent: item.supports_multi_agent || enriched.supports_multi_agent,
        supports_context_protocol: item.supports_context_protocol || enriched.supports_context_protocol,
        workflow_specials: item.workflow_specials || enriched.workflow_specials || [],
        workflow_entry_points: item.workflow_entry_points || enriched.workflow_entry_points || [],
        scheduled_fit_explanation: item.scheduled_fit_explanation || enriched.scheduled_fit_explanation,
        workflow_scenarios: item.workflow_scenarios || enriched.workflow_scenarios || [],
        runtime_control_level: item.runtime_control_level || enriched.runtime_control_level,
        distribution_layer: item.distribution_layer || enriched.distribution_layer,
        background_execution: item.background_execution || enriched.background_execution,
        local_first: item.local_first || enriched.local_first,
        workflow_lock_in: item.workflow_lock_in || enriched.workflow_lock_in,
        permission_visibility: item.permission_visibility || enriched.permission_visibility,
        runtime_control_rationale: item.runtime_control_rationale || enriched.runtime_control_rationale,
        execution_boundary: item.execution_boundary || enriched.execution_boundary,
        where_code_runs: item.where_code_runs || enriched.where_code_runs,
        secret_holder: item.secret_holder || enriched.secret_holder,
        audit_evidence: item.audit_evidence || enriched.audit_evidence,
        background_duration_fit: item.background_duration_fit || enriched.background_duration_fit,
        runtime_control_surfaces: item.runtime_control_surfaces || enriched.runtime_control_surfaces || [],
        workflow_entry_signals: item.workflow_entry_signals || enriched.workflow_entry_signals || [],
        workflow_decision_axes: item.workflow_decision_axes || enriched.workflow_decision_axes || [],
        workflow_risk_signals: item.workflow_risk_signals || enriched.workflow_risk_signals || [],
        site_surfaces: item.site_surfaces || enriched.site_surfaces || [],
        one_line_summary: item.one_line_summary || enriched.one_line_summary || guide.one_line_summary,
        guide,
      };
      const workflow = deriveWorkflowMetadata(base);
      const merged = {
        ...base,
        ...workflow,
      };
      return {
        ...merged,
        installCommand: installCommand(merged),
        useCaseText: useCase(merged),
        riskExplanationText: riskExplanation(merged),
        humanSummary: humanAuditSummary(merged),
      };
    });
  } else {
    state.items = mergeData(catalog, auditItems.filter(Boolean), enrichedMap);
  }

  renderStats(state.items);
  render();
}

els.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPresetFilter(button.dataset.preset));
});

main().catch((error) => {
  els.summary.textContent = error.message;
  console.error(error);
});
