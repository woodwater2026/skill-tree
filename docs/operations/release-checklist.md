# Skill Tree Release Checklist

> 目的：把发版前最容易漏掉的 repo 验收动作固化成固定步骤，避免“本地已完成，但远端未同步”或“入口文件存在，但链接失效”。

## 使用时机

在以下任一场景执行：
- 阶段性交付后准备对外发布
- 提交 Product Hunt / HN / awesome list / 社区分发前
- 发布文章或演示前，需要确认 repo 可被外部访问与消费

---

## A. 远端一致性校验

### 1. 工作区必须干净
执行：
```bash
git status --short
```
通过标准：
- 没有未提交改动
- 没有忘记 add 的新文件

不通过处理：
- 先确认哪些文件属于本次发版范围
- 统一 `git add` / `git commit`
- 不允许带脏工作区进入发版确认

### 2. 本地 HEAD 必须和远端一致
执行：
```bash
git rev-parse HEAD
git rev-parse origin/main
```
通过标准：
- 两个 commit hash 完全一致

不通过处理：
- 若本地领先：立即 `git push`
- 若远端领先：先 `git pull --rebase`，确认无覆盖风险后再继续

### 3. 关键 workflow 文件必须在远端版本中
至少检查：
- `.github/workflows/deploy-pages.yml`
- `.github/workflows/audit-regression.yml`

通过标准：
- 文件存在于当前分支
- 已被 push 到远端

不通过处理：
- 补提交并 push
- 不允许只在本地生成 workflow

---

## B. 关键内容完整性校验

### 4. 核心目录必须齐全
至少检查：
- `catalog/`
- `audits/`
- `web/`
- `docs/`

通过标准：
- 每个目录都存在
- 阶段交付要求的关键文件都在

### 5. 核心文件必须存在
至少检查：
- `README.md`
- `catalog/index.json`
- `web/index.html`
- `web/app.js`
- `docs/START_HERE.md`
- `docs/operations/minimum-ops-rules.md`
- `docs/operations/intake-ingestion-guide.md`
- `docs/operations/data-layer-and-review-flow.md`

如当前阶段有新增交付，也要补入这一节。

---

## C. 入口与链接校验

### 6. README 入口必须能把新人带到正确位置
README 至少要清楚指向：
- `docs/START_HERE.md`
- `docs/operations/minimum-ops-rules.md`
- `docs/operations/intake-ingestion-guide.md`
- `catalog/index.json`

通过标准：
- 路径存在
- README 里的入口名称与实际文件口径一致

### 7. 产品层消费路径必须唯一
确认：
- 产品 / UI 只消费 `catalog/index.json`
- README / docs 不应暗示前端直接读 shortlist / intake / catalog 原始层

通过标准：
- README、docs、index 三处口径一致

不通过处理：
- 先修正文档，再发版

---

## D. 发版风险检查

### 8. 防止未清理敏感样例进入远端
重点检查：
- 审计报告里的 token/API key 示例
- 会触发 GitHub Push Protection 的字符串前缀
- 明显不应公开的本地路径或临时凭证

通过标准：
- 无敏感样例
- push 不会被 secret scanning 拦截

不通过处理：
- 先清理内容并重写 commit，再 push
- 不允许通过“忽略告警”硬推

### 9. 发布相关外链必须可解释
若 README / docs / 文章引用以下链接：
- GitHub Pages URL
- Substack / DEV.to URL
- awesome-list PR URL

则要确认：
- 要么已经可访问
- 要么文档里明确标记为 pending / 待发布

---

## E. 最终验收结论

发版前只需要输出一段简短结论：

- 当前远端提交 hash
- `git status` 是否干净
- HEAD / origin 是否一致
- 核心目录和文件是否齐全
- README 关键入口是否可用
- 是否存在需要阻断发版的问题

建议格式：

```text
Release check PASS
- commit: <hash>
- working tree: clean
- head/origin: synced
- key dirs/files: present
- README entry links: valid
- blockers: none
```

若不通过，则必须写清：
- blocker 是什么
- 由谁处理
- 处理完后再复检

---

## 最小原则

**没有通过这份 checklist，就不算 ready to launch。**

宁可慢 10 分钟复检，也不要把“本地好了、远端没好”的版本发出去。
