const SPECIALS = {
  scheduled: {
    title: 'Scheduled Agent Workflows',
    eyebrow: 'Workflow Stack Specials',
    intro: 'For recurring jobs that need predictable triggers, repeat safety, and clear failure visibility.',
    startHere: [
      'You need the workflow to run every day, week, or hour.',
      'Repeatability matters more than one-off execution.',
      'You want agents to check, report, sync, or clean up on a schedule.',
    ],
    axes: ['Trigger reliability', 'Repeat safety', 'Output consistency', 'Failure visibility', 'Dependency stability'],
    risks: ['silent failures', 'repeated bad writes', 'stale credentials', 'set-and-forget workflows with no monitoring'],
    filter(item) { return item.supports_scheduled === 'supported' || (item.workflow_specials || []).includes('scheduled'); },
    stackLinks: ['Governance / Safety / Review', 'Execution / Tool Use', 'Long-running Task Support'],
  },
  'long-running': {
    title: 'Long-running Agent Workflows',
    eyebrow: 'Workflow Stack Specials',
    intro: 'For workflows that must preserve state, checkpoints, plans, and continuity across longer jobs.',
    startHere: [
      'The task spans many steps or hours.',
      'Restarting from scratch is expensive.',
      'You need plans, checkpoints, or persistent notes.',
    ],
    axes: ['State persistence', 'Recovery behavior', 'Context continuity', 'Output traceability', 'Operational fatigue'],
    risks: ['context drift over time', 'hidden state accumulation', 'unsafe local writes', 'fake persistence without clean recovery'],
    filter(item) { return item.supports_long_running === 'supported' || (item.workflow_specials || []).includes('long-running'); },
    stackLinks: ['Long-running Task Support', 'Knowledge / Output Retention', 'Governance / Safety / Review'],
  },
  'multi-agent': {
    title: 'Multi-agent & Subagent Workflows',
    eyebrow: 'Workflow Stack Specials',
    intro: 'For workflows that need role separation, orchestration, and clearer coordination than one agent can provide alone.',
    startHere: [
      'One agent is doing too many kinds of work at once.',
      'You want separate reviewers, implementers, or researchers.',
      'You need better decomposition and coordination.',
    ],
    axes: ['Role clarity', 'Coordination overhead', 'Handoff quality', 'Failure containment', 'Operator visibility'],
    risks: ['orchestration theater with no benefit', 'hidden complexity', 'duplicated work', 'poor handoffs and context fragmentation'],
    filter(item) { return item.supports_multi_agent === 'supported' || (item.workflow_specials || []).includes('multi-agent'); },
    stackLinks: ['Subagent Coordination / Orchestration', 'Context / Protocol Integration', 'Governance / Safety / Review'],
  },
  'context-protocol': {
    title: 'Context & Protocol Integration',
    eyebrow: 'Workflow Stack Specials',
    intro: 'For agents that need structured context, external systems, MCP-style bridges, or protocol-aware integrations.',
    startHere: [
      'Prompting alone is not enough.',
      'The agent needs external systems or structured context to be useful.',
      'You care about adapters, bridges, or consistent context injection.',
    ],
    axes: ['Integration clarity', 'Dependency surface', 'Context quality', 'Operational stability', 'Permission sensitivity'],
    risks: ['dependency sprawl', 'hidden credential assumptions', 'noisy context injection', 'brittle bridges', 'wider attack surface'],
    filter(item) { return item.supports_context_protocol === 'supported' || (item.workflow_specials || []).includes('context-protocol'); },
    stackLinks: ['Context / Protocol Integration', 'Execution / Tool Use', 'Governance / Safety / Review'],
  },
};

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function getSpecialKey() {
  const path = window.location.pathname;
  const match = path.match(/\/specials\/([^/.]+)\.html$/);
  return match?.[1] || 'scheduled';
}

function pickInstall(item) {
  return item.install_cmd || `/plugin install github:${item.repo}`;
}

function renderList(el, items, p0Repos = new Set(), p0PackMap = new Map()) {
  el.innerHTML = items.map((item) => {
    const guide = p0PackMap.get(item.repo) || {};
    return `
    <article class="special-item">
      <div class="special-meta">
        <span class="special-chip">${item.workflow_stack_role || 'Workflow layer'}</span>
        <span class="special-chip muted">runtime ${item.runtime_control_level || 'unknown'}</span>
        ${p0Repos.has(item.repo) ? '<span class="special-chip">P0 guide</span>' : ''}
      </div>
      <h3>${item.name}</h3>
      <p>${item.summary || item.use_case || ''}</p>
      <ul>
        <li><strong>Install:</strong> <code>${pickInstall(item)}</code></li>
        <li><strong>Fit:</strong> ${guide.fit_for || item.use_case || 'See catalog detail for usage guidance.'}</li>
        <li><strong>Usage:</strong> ${guide.how_to_use || 'Start with the install path, then validate on one narrow workflow.'}</li>
        <li><strong>Caution:</strong> ${guide.main_risk || item.risk_explanation || 'Review runtime and permission surface before install.'}</li>
      </ul>
    </article>`;
  }).join('');
}

async function loadGuidePlan() {
  try {
    const data = await loadJson('../../catalog/top50-guides-gap-plan-v1.json');
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

async function loadP0Pack() {
  try {
    const data = await loadJson('../../catalog/top50-guides-p0-pack-v1.json');
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

async function main() {
  const key = getSpecialKey();
  const config = SPECIALS[key];
  const [index, guidePlan, p0Pack] = await Promise.all([
    loadJson('../../catalog/index.json'),
    loadGuidePlan(),
    loadP0Pack(),
  ]);
  const p0Repos = new Set(guidePlan.filter((item) => item.priority_batch === 'P0').map((item) => item.repo));
  const p0PackMap = new Map(p0Pack.map((item) => [item.repo, item]));
  const items = (index.items || [])
    .filter(config.filter)
    .sort((a, b) => Number(p0Repos.has(b.repo)) - Number(p0Repos.has(a.repo)));

  document.getElementById('special-eyebrow').textContent = config.eyebrow;
  document.getElementById('special-title').textContent = config.title;
  document.getElementById('special-intro').textContent = config.intro;
  document.getElementById('start-here').innerHTML = config.startHere.map((x) => `<li>${x}</li>`).join('');
  document.getElementById('decision-axes').innerHTML = config.axes.map((x) => `<li>${x}</li>`).join('');
  document.getElementById('risk-list').innerHTML = config.risks.map((x) => `<li>${x}</li>`).join('');
  document.getElementById('stack-links').innerHTML = config.stackLinks.map((x) => `<span class="special-chip">${x}</span>`).join('');
  document.getElementById('special-count').textContent = `${items.length} matching skills in main index`;
  renderList(document.getElementById('special-results'), items.slice(0, 8), p0Repos, p0PackMap);
}

main().catch((error) => {
  const el = document.getElementById('special-results');
  if (el) el.innerHTML = `<p>${error.message}</p>`;
  console.error(error);
});
