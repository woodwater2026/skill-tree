const state = {
  items: [],
  query: "",
  risk: "all",
  category: "all",
  auditedOnly: false,
  activeRepos: null,
  bestLists: [],
  guides: [],
  guidesMap: new Map(),
};

const els = {
  stats: document.getElementById("stats"),
  search: document.getElementById("search"),
  riskFilters: document.getElementById("risk-filters"),
  categoryFilters: document.getElementById("category-filters"),
  categoryNav: document.getElementById("category-nav"),
  capabilityMap: document.getElementById("capability-map-grid"),
  grid: document.getElementById("grid"),
  summary: document.getElementById("results-summary"),
  template: document.getElementById("card-template"),
  bestLists: document.getElementById("best-lists-grid"),
  topGuides: document.getElementById("top-guides"),
  safeStart: document.getElementById("safe-start-grid"),
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
    slug: 'research',
    title: 'Research',
    blurb: 'Help an agent gather, structure, and retain useful context.',
    audience: 'Researchers, analysts, PMs, technical investigators',
    risk: 'Usually low to medium risk',
    picks: ['claude-scientific-skills', 'obsidian-skills', 'planning-with-files'],
    action: { type: 'query', value: 'research' },
  },
  {
    slug: 'orchestration',
    title: 'Orchestration',
    blurb: 'Coordinate multi-step work instead of relying on one-shot prompts.',
    audience: 'Operators, builders, multi-agent workflow designers',
    risk: 'Usually medium risk',
    picks: ['superpowers', 'claude-code-agents', 'AgentSys'],
    action: { type: 'query', value: 'orchestration' },
  },
  {
    slug: 'long-running-tasks',
    title: 'Long-running Tasks',
    blurb: 'Preserve plans, checkpoints, and state across longer jobs.',
    audience: 'Users running long tasks, investigations, or overnight flows',
    risk: 'Usually medium risk',
    picks: ['planning-with-files', 'claude-tmux', 'AgentSys'],
    action: { type: 'query', value: 'long-running tasks' },
  },
  {
    slug: 'code-review',
    title: 'Code Review',
    blurb: 'Inspect, critique, and improve code with safer review loops.',
    audience: 'Engineering teams, reviewers, maintainers',
    risk: 'Usually medium risk',
    picks: ['superpowers', 'Trail of Bits Security Skills', 'claude-code-agents'],
    action: { type: 'list', value: 'best-for-code-review' },
  },
  {
    slug: 'security-audit',
    title: 'Security Audit',
    blurb: 'Surface security-relevant risk before install or deploy.',
    audience: 'Security teams, infra owners, risk reviewers',
    risk: 'Usually medium to high risk',
    picks: ['Trail of Bits Security Skills', 'skill-scanner', 'parry'],
    action: { type: 'list', value: 'best-for-security' },
  },
  {
    slug: 'devops-deployment',
    title: 'DevOps & Deployment',
    blurb: 'Manage infra, deployment, config, and operational workflows.',
    audience: 'Platform, infra, and deployment-heavy teams',
    risk: 'Usually medium to high risk',
    picks: ['cc-devops-skills', 'compound-engineering-plugin', 'AgentSys'],
    action: { type: 'list', value: 'best-for-devops' },
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

function mergeData(catalog, audits, enrichedMap = new Map()) {
  const auditMap = new Map(audits.map((item) => [item.slug, item]));
  return catalog.items.map((item) => {
    const slug = slugifyRepo(item.repo);
    const audit = auditMap.get(slug);
    const enriched = enrichedMap.get(slug) || enrichedMap.get(item.repo) || {};
    const category = audit?.primary_category || item.category || "unknown";
    const guide = state.guidesMap.get(slug) || state.guidesMap.get(item.repo) || {};
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
      one_line_summary: item.one_line_summary || enriched.one_line_summary,
      guide,
    };
    return {
      ...base,
      installCommand: installCommand(base),
      useCaseText: useCase(base),
      riskExplanationText: riskExplanation(base),
      humanSummary: humanAuditSummary(base),
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
          guideText,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const riskOk = state.risk === "all" || item.risk === state.risk;
      const catOk = state.category === "all" || item.category === state.category;
      const auditedOk = !state.auditedOnly || item.auditCount > 0;
      const repoOk = !state.activeRepos || state.activeRepos.has(item.repo);
      return textOk && riskOk && catOk && auditedOk && repoOk;
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
  const humanWhatEl = node.querySelector(".human-what");
  const humanSafeEl = node.querySelector(".human-safe");
  const humanRiskEl = node.querySelector(".human-risk");
  const guideBodyEl = node.querySelector(".guide-body");

  if (!installCodeEl || !copyBtnEl || !useCaseEl || !riskExplanationEl || !humanWhatEl || !humanSafeEl || !humanRiskEl) {
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

  useCaseEl.textContent = item.useCaseText;
  riskExplanationEl.textContent = item.riskExplanationText;
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
  renderBestLists();
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
    "../catalog/high-intent-skills-enriched-v1.json",
    "../../agents/research/high-intent-skills-enriched-v1.json",
    "../catalog/skills-catalog-top20-enriched.json",
    "../../agents/research/skills-catalog-top20-enriched.json",
  ];
  for (const path of candidates) {
    try {
      const data = await loadJson(path);
      const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      return new Map(items.map((item) => [item.slug || item.repo, item]));
    } catch {
      // ignore
    }
  }
  return new Map();
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
  const [catalog, auditIndex, enrichedMap, bestLists, guides] = await Promise.all([
    loadJson("../catalog/index.json").catch(() => loadJson("../catalog/skills-catalog-v1.json")),
    loadJson("../audits/index.json"),
    loadOptionalEnriched(),
    loadBestLists(),
    loadGuides(),
  ]);
  state.bestLists = bestLists;
  state.guides = guides;
  state.guidesMap = new Map(guides.map((item) => [item.repo, item]));
  const auditItems = await Promise.all(auditIndex.items.map((slug) => loadJson(`../audits/${slug}.json`).catch(() => null)));

  if (catalog.version === "index-v1") {
    const auditMap = new Map(auditItems.filter(Boolean).map((item) => [item.slug, item]));
    state.items = catalog.items.map((item) => {
      const audit = auditMap.get(item.slug);
      const enriched = enrichedMap.get(item.slug) || enrichedMap.get(item.repo) || {};
      const guide = state.guidesMap.get(item.repo) || {};
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
        one_line_summary: item.one_line_summary || enriched.one_line_summary || guide.one_line_summary,
        guide,
      };
      return {
        ...base,
        installCommand: installCommand(base),
        useCaseText: useCase(base),
        riskExplanationText: riskExplanation(base),
        humanSummary: humanAuditSummary(base),
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
