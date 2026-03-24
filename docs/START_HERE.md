# Skill Tree Start Here

新人进入 Skill Tree，只看这份文件和 `docs/operations/minimum-ops-rules.md`，就可以开始执行。

## 先看什么

1. **运营底线**
   - `docs/operations/minimum-ops-rules.md`
   - 作用：定义什么不能进 shortlist、不能进 intake、什么必须进风险样本库，以及各层卡口/回滚规则。

2. **数据层与审核流**
   - `docs/operations/data-layer-and-review-flow.md`
   - 作用：看清数据怎么从发现走到正式收录。

3. **接入执行说明**
   - `docs/operations/intake-ingestion-guide.md`
   - 作用：把 intake 条目真正接进 repo 索引层时，字段怎么补、怎么映射、怎么落库。

## 五层入口

### 1) Catalog
- 当前主数据：`catalog/skills-catalog-v1.json`、`catalog/skills-catalog-v2.json`
- 用途：原始候选池 / 广泛发现层
- 负责人：研究
- 说明：catalog 不是正式收录列表，不能直接给产品层消费

### 2) Shortlist
- 当前工作文件：`docs/data/skills-shortlist-v2.json`
- 用途：高质量筛选层，按平台区分优先收录 / 观察 / 丢弃
- 负责人：研究
- 说明：只有满足规则的项才能从 catalog 进入 shortlist

### 3) Risk Library
- 当前工作文件：`docs/data/skills-risk-sample-library-v1.json`
- 用途：风险反例库，避免团队重复看垃圾、重复踩坑
- 负责人：研究
- 说明：高风险 / 低增量 / 可复用丢弃理由的条目必须入库

### 4) Intake
- 当前工作文件：`docs/data/skills-intake-v1.json`
- 用途：首批正式收录候选
- 负责人：研究 → 总管交接
- 说明：只有“真会收”的条目才进入 intake

### 5) Index
- 正式索引层：`catalog/index.json`
- 用途：供 repo / Web UI / 搜索直接消费
- 负责人：辛海璐
- 说明：产品层只消费 index，不直接读取 shortlist / intake / catalog

## 执行顺序

标准流程：

`catalog → shortlist → risk library / intake → index`

### 最小原则
- 不跳层
- 不把观察项当正式收录
- 不把 high risk 放进正式库
- 不让产品层直接消费非正式索引数据
- 发现问题在哪一层，就回滚到哪一层

## 谁该做什么

### 研究（林晚）
- 扩 catalog
- 做 shortlist
- 维护 risk library
- 输出 intake

### 总管（辛海璐）
- 按 ingestion guide 把 intake 接入 index
- 对齐字段命名、口径、状态
- 确保 repo 内文件入口统一

### 产品（黄思博）
- 只基于 index 做展示与产品消费
- 不绕过 index 直接读取上游文件

## 新人上手清单

开始前先确认：
- [ ] 已读 `minimum-ops-rules.md`
- [ ] 已读 `data-layer-and-review-flow.md`
- [ ] 知道自己当前操作的是哪一层
- [ ] 知道该层的负责人是谁
- [ ] 知道下一层的准入条件是什么

如果只需要一句话版本：

**先按规则筛，再进 intake，最后总管写 index；前端永远只读 index。**
