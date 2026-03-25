# GitHub Pages Go-Live Check

- Task: T-064
- Owner: 辛海璐
- Date: 2026-03-24
- Repo: `woodwater2026/skill-tree`

## Goal

完成 GitHub Pages 平台侧启用核查，确认 Pages 已切到 **GitHub Actions** 作为 source，检查首个 deploy workflow run，并在生效后重测公网 URL。

## What Changed

### 1. Pages platform-side enablement
执行：
```bash
gh api -X POST repos/woodwater2026/skill-tree/pages -f build_type=workflow
```
结果：
- Pages site 创建成功
- `build_type = workflow`
- `html_url = https://woodwater2026.github.io/skill-tree/`
- `https_enforced = true`
- `public = true`

### 2. First Pages workflow run
原失败 run：`23512630086`
- 原因：仓库 Pages 站点尚未启用，`actions/configure-pages@v5` 在 `Get Pages site` 阶段返回 404

处理：
- 平台侧启用 Pages 后，重跑同一 deploy run

重跑结果：
- Workflow: `Deploy Skill Tree to GitHub Pages`
- Run ID: `23512630086`
- Status: **success**
- Jobs:
  - `build` ✅
  - `deploy` ✅

### 3. Public URL retest
重测结果：

#### Root URL
- `https://woodwater2026.github.io/skill-tree/`
- 当前返回：**404**
- 判断：当前站点内容实际发布在 `/web/` 子路径下，根路径未放置首页文件，因此 404 属于当前仓库结构表现，不是 Pages 平台未生效

#### Published app URL
- `https://woodwater2026.github.io/skill-tree/web/`
- 当前返回：**200 OK**
- 结论：首轮公网可访问 URL 已上线可用

## Current Conclusion

### Platform-side status
- GitHub Pages：**已启用**
- Source：**GitHub Actions**
- 首轮 deploy：**已成功**

### Public access status
- 可用 URL：`https://woodwater2026.github.io/skill-tree/web/`
- 根路径 `https://woodwater2026.github.io/skill-tree/` 仍为 404

## Remaining Cleanup (non-blocking)

如果希望 repo 根路径也可直接访问，需要二选一：

1. 将 `web/` 内容改为发布根目录内容
2. 或在根路径增加一个跳转/落地页，指向 `/web/`

这不是 Pages 平台侧阻塞项；当前阻塞已解除。

## Final Verdict

**T-064 已完成。**

平台侧启用已完成，首个 Pages workflow run 成功，公网首轮上线 URL 已可访问：

`https://woodwater2026.github.io/skill-tree/web/`
