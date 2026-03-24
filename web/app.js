const state = {
  items: [],
  query: "",
  risk: "all",
  category: "all",
};

const els = {
  stats: document.getElementById("stats"),
  search: document.getElementById("search"),
  riskFilters: document.getElementById("risk-filters"),
  categoryFilters: document.getElementById("category-filters"),
  grid: document.getElementById("grid"),
  summary: document.getElementById("results-summary"),
  template: document.getElementById("card-template"),
};

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function slugifyRepo(repo) {
  return repo.toLowerCase().replaceAll("_", "-").replaceAll("/", "-");
}

function mergeData(catalog, audits) {
  const auditMap = new Map(audits.map((item) => [item.slug, item]));
  return catalog.items.map((item) => {
    const slug = slugifyRepo(item.repo);
    const audit = auditMap.get(slug);
    return {
      slug,
      name: item.name,
      repo: item.repo,
      summary: item.summary,
      source: item.source,
      stars: item.stars ?? 0,
      category: audit?.primary_category || item.category || "unknown",
      risk: audit?.security?.risk_level || item?.safety_precheck?.rating || "unknown",
      auditCount: audit?.audit?.findings_count || 0,
      recommendation: audit?.audit?.recommendation || "review",
      securityScore: audit?.discovery?.security_score ?? null,
      qualityScore: audit?.discovery?.quality_score ?? null,
      popularityScore: audit?.discovery?.popularity_score ?? null,
      securitySummary: audit?.security?.summary || [item?.safety_precheck?.notes || "Precheck only"],
      findings: (audit?.audit?.findings || []).slice(0, 5),
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
    .map((category) => `<button class="filter ${state.category === category ? "active" : ""}" data-kind="category" data-value="${category}">${category}</button>`)
    .join("");

  document.querySelectorAll("button.filter").forEach((button) => {
    button.addEventListener("click", () => {
      state[button.dataset.kind] = button.dataset.value;
      render();
    });
  });
}

function getFilteredItems() {
  const q = state.query.trim().toLowerCase();
  return state.items.filter((item) => {
    const textOk = !q || [item.name, item.repo, item.summary, item.category].join(" ").toLowerCase().includes(q);
    const riskOk = state.risk === "all" || item.risk === state.risk;
    const catOk = state.category === "all" || item.category === state.category;
    return textOk && riskOk && catOk;
  }).sort((a, b) => (b.stars || 0) - (a.stars || 0));
}

function renderCard(item) {
  const node = els.template.content.firstElementChild.cloneNode(true);
  node.querySelector(".category").textContent = item.category;
  const riskEl = node.querySelector(".risk");
  riskEl.textContent = item.risk;
  riskEl.classList.add(item.risk);
  node.querySelector(".title").textContent = item.name;
  node.querySelector(".repo").textContent = item.repo;
  node.querySelector(".summary").textContent = item.summary;
  node.querySelector(".score").textContent = item.securityScore == null ? "—" : item.securityScore;
  node.querySelector(".facts").innerHTML = [
    `<span class="fact">⭐ ${item.stars || 0}</span>`,
    `<span class="fact">Findings ${item.auditCount}</span>`,
    `<span class="fact">Rec ${item.recommendation}</span>`,
  ].join("");
  node.querySelector(".audit").innerHTML = `
    <ul>
      ${item.securitySummary.map((line) => `<li>${line}</li>`).join("")}
    </ul>
    ${item.findings.length ? `<p><strong>Top findings</strong></p><ul>${item.findings.map((finding) => `<li>[${finding.severity}] ${finding.title} — <code>${finding.path || "n/a"}:${finding.line || ""}</code></li>`).join("")}</ul>` : "<p>No detailed audit loaded yet.</p>"}
  `;
  return node;
}

function render() {
  renderFilters();
  const items = getFilteredItems();
  els.summary.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;
  els.grid.innerHTML = "";
  items.forEach((item) => els.grid.appendChild(renderCard(item)));
}

async function main() {
  const [catalog, auditIndex] = await Promise.all([
    loadJson("../catalog/index.json").catch(() => loadJson("../catalog/skills-catalog-v1.json")),
    loadJson("../audits/index.json"),
  ]);
  const auditItems = await Promise.all(
    auditIndex.items.map((slug) => loadJson(`../audits/${slug}.json`).catch(() => null))
  );

  if (catalog.version === "index-v1") {
    const auditMap = new Map(auditItems.filter(Boolean).map((item) => [item.slug, item]));
    state.items = catalog.items.map((item) => {
      const audit = auditMap.get(item.slug);
      return {
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
      };
    });
  } else {
    state.items = mergeData(catalog, auditItems.filter(Boolean));
  }

  renderStats(state.items);
  render();
}

els.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

main().catch((error) => {
  els.summary.textContent = error.message;
  console.error(error);
});
