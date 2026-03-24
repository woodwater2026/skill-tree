# Skill Tree 首批收录执行说明（基于 `skills-intake-v1`）

> 目标：让辛海璐可直接按本说明把 `skills-intake-v1` 接入 repo 索引层，无需二次猜测。

---

## 1. 输入文件

主输入：
- `agents/research/skills-intake-v1.json`

辅助参考：
- `agents/research/skills-intake-v1.md`
- `agents/research/skills-shortlist-v2.json`
- `agents/research/skills-risk-sample-library-v1.json`
- repo 现有索引层（如 `catalog/index.json`）

---

## 2. 每个入选项入库时必须补齐的元数据

每个正式收录项至少补以下字段：

### 基础识别字段
- `name`：仓库短名
- `repo`：`owner/name`
- `source_url`：GitHub URL
- `platforms`：所属平台（Claude Code / OpenClaw / Cursor / Windsurf / Copilot / Codex / Gemini CLI / Cross-platform）
- `category`：分类（registry / tooling / security / memory-knowledge / cross-agent / framework-domain 等）

### 收录决策字段
- `collection_status`：固定写 `included_v1`
- `intake_batch`：固定写 `intake_v1`
- `priority_score`：直接沿用 `skills-intake-v1.json`
- `include_reason`：直接沿用 `why_admit`
- `direct_value`：直接沿用 `direct_value`

### 安全字段
- `security_rating`：直接映射自 `risk`
  - `low` → `low`
  - `medium` → `medium`
  - `high` → **原则上不应出现在 intake v1**；如果出现，默认拦截，不入正式索引
- `audit_status`：
  - 已有审计报告 → `audited`
  - 无详细审计但完成预筛 → `prechecked`
- `review_status`：固定写 `approved_for_index`
- `risk_notes`：简短说明风险边界；没有就填空字符串，但字段保留

### 展示字段
- `summary`：优先取 catalog 中的 summary
- `tags`：可由 `platforms + category + security_rating` 组合生成
- `search_text`：建议由 `name + repo + category + platforms + summary` 拼接，便于索引/搜索

---

## 3. 安全评级标注规则

`security_rating` 只允许三档：
- `low`
- `medium`
- `high`

### 对 intake v1 的执行要求
- `low`：可直接展示，默认可见
- `medium`：可展示，但建议前端保留明显标签
- `high`：**不进入 intake v1 正式索引层**；若确需保留，只能进风险样本库，不进默认收录页

### 前端建议展示方式
- `low` → 绿色/安全基础项
- `medium` → 黄色/需注意权限边界
- `high` → 红色/仅风险样本库展示

---

## 4. 与 repo 索引层对齐方式

如果 repo 当前已有 `catalog/index.json` 或类似 search-ready 文件，建议新增/统一以下字段：

```json
{
  "name": "skills",
  "repo": "vercel-labs/skills",
  "source_url": "https://github.com/vercel-labs/skills",
  "platforms": ["Cross-platform"],
  "category": "tooling",
  "summary": "...",
  "collection_status": "included_v1",
  "intake_batch": "intake_v1",
  "priority_score": 59.4,
  "security_rating": "medium",
  "audit_status": "prechecked",
  "review_status": "approved_for_index",
  "include_reason": "能为 Skill Tree 建立方法论或基础设施代表性。",
  "direct_value": "作为首批库代表项，提供高信号入口、基础设施锚点或关键类别覆盖。",
  "risk_notes": "Needs clear permission boundaries if promoted in UI.",
  "tags": ["tooling", "cross-platform", "medium-risk"],
  "search_text": "skills vercel-labs/skills tooling cross-platform ..."
}
```

---

## 5. 入库执行顺序

建议按以下顺序执行，避免返工：

1. 读取 `skills-intake-v1.json`
2. 对每条记录补齐 `source_url / summary / tags / search_text`
3. 映射安全字段：`risk -> security_rating`
4. 统一写入收录字段：
   - `collection_status = included_v1`
   - `intake_batch = intake_v1`
   - `review_status = approved_for_index`
5. 合并进 repo 索引层
6. 前端检查能否按以下维度筛选：
   - platform
   - category
   - security_rating
   - collection_status

---

## 6. 明确不要让辛海璐猜的地方

### 不要猜 1：哪些该进正式索引
只以 `skills-intake-v1.json` 为准。不要自行从 shortlist 或 catalog 补条目进正式库。

### 不要猜 2：high risk 怎么办
high risk 不进正式收录索引。统一留在风险样本库处理。

### 不要猜 3：观察项怎么办
观察项不进正式索引层。后续单独维护候选池即可。

### 不要猜 4：目录型项目算不算正式收录
如果它已经在 `skills-intake-v1.json` 里，就算正式收录；否则一律不自行补录。

---

## 7. 建议给 repo 索引层补的最小字段集

如果只想最小可用，至少保留这 10 个字段：
- `name`
- `repo`
- `source_url`
- `platforms`
- `category`
- `collection_status`
- `priority_score`
- `security_rating`
- `include_reason`
- `search_text`

---

## 8. 后续增量更新规则

后面新增条目时，按这个顺序：
1. 先进入 catalog
2. 再进入 shortlist
3. 再进入 intake
4. 最后才进正式索引层

这样可以保证 repo 不会被未经筛选的噪音条目污染。

---

## 结论

`skills-intake-v1.json` 是**正式收录输入**，不是参考意见。

辛海璐只需要按本说明补齐元数据、映射安全字段、写入 repo 索引层即可。正式库与风险样本库要严格分开，不要混写。
