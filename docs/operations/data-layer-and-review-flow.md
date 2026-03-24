# Skill Tree 数据层与审核流设计说明

> 目标：让产品、研究、总管按同一套执行流程推进 Skill Tree，从候选发现到正式收录全程可落地、可交接、可复用。

---

## 一、数据怎么流转

Skill Tree 的数据流转分 5 层，顺序固定，不能跳层：

### 1. Catalog 层：发现池
**文件示例**：`skills-catalog-v3.json`

**作用**：
- 承接大规模发现结果
- 保留广覆盖，不要求立刻可收录
- 允许存在噪音、重复源、待观察项

**进入条件**：
- repo 具备基本 skill 身份
- 有基础 metadata（repo / source / summary / category / safety_precheck）

**输出到下一层**：
- 通过规则筛选后进入 Shortlist 层

---

### 2. Shortlist 层：筛选池
**文件示例**：
- `skills-shortlist-v2.json`
- `skills-shortlist-v2-decision-summary.md`

**作用**：
- 从 Catalog 中筛出值得继续投入判断的项目
- 直接分为：`优先收录 / 观察 / 丢弃`
- 为决策层提供压缩后的可读结论

**进入条件**：
- 完成基础规则筛选
- 已有平台归属、风险预判、决策理由

**输出到下一层**：
- `优先收录` 候选进入 Intake 层
- `观察` 留在 shortlist 循环更新
- `丢弃` 进入风险样本库

---

### 3. Risk Sample Library 层：反例库
**文件示例**：
- `skills-risk-sample-library-v1.json`
- `skills-risk-sample-library-v1.md`

**作用**：
- 沉淀不建议收录的典型样本
- 形成未来筛选的反例规则，不让团队重复看垃圾
- 为研究和总管提供“为什么不能进库”的标准化样本

**进入条件**：
- 在 shortlist 中被标记为 `丢弃`
- 且能归入明确风险类型（如代理外联 / 委托执行 / 部署 / 高权限研究 / 目录套目录）

**输出到下一层**：
- 不进入正式收录
- 只反向影响 future screening rules

---

### 4. Intake 层：正式收录候选
**文件示例**：
- `skills-intake-v1.json`
- `skills-intake-v1.md`

**作用**：
- 只保留“真的准备收”的项
- 是正式索引层的唯一输入
- 不再混入观察项与噪音项

**进入条件**：
- 来自 shortlist 的 `优先收录`
- 完成明确的收录理由与直接价值描述
- 风险等级为 `low` 或 `medium`

**输出到下一层**：
- 经 ingestion guide 补齐字段后写入正式索引层

---

### 5. Index 层：正式库 / 产品可用层
**文件示例**：`catalog/index.json`

**作用**：
- 给 Web UI / 搜索 / 展示直接消费
- 只保留正式收录条目
- 作为产品层对外展示的“真库”

**进入条件**：
- 来自 intake 文件
- 按 ingestion guide 补齐标准字段
- 完成 review_status / security_rating / collection_status 标记

---

## 二、每一层谁能改、何时进入下一层

### Catalog 层
**谁能改**：研究（林晚）

**什么时候推进下一层**：
- 当 catalog 已具备基础字段
- 且数量扩展到需要决策压缩时
- 即可进入 shortlist

---

### Shortlist 层
**谁能改**：研究（林晚）负责筛选；产品/总管可读，不直接改原筛选逻辑

**什么时候推进下一层**：
- 当某条目被定为 `优先收录`
- 且一句话能说清“为什么现在收 / 对 Skill Tree 直接价值是什么”
- 即可进入 intake

---

### Risk Sample Library 层
**谁能改**：研究负责归类；总管/产品可基于其更新反例规则

**什么时候推进下一层**：
- 不推进到正式收录
- 仅回流影响 catalog / shortlist 规则

---

### Intake 层
**谁能改**：研究负责给出正式名单；总管负责执行接入；产品只消费结果

**什么时候推进下一层**：
- 当 intake 条目完成：
  - 平台归属
  - 分类
  - 风险等级
  - 收录理由
  - 直接价值
- 即可进入正式索引层

---

### Index 层
**谁能改**：总管（辛海璐）

**什么时候允许写入**：
- 只允许从 intake 进入
- 不允许从 catalog / shortlist / risk library 直接写入

---

## 三、从候选变正式收录，必须通过哪些检查

一个条目从候选变正式收录，必须全部通过以下检查：

### 必过检查 1：技能身份清晰
- 不是泛 AI 资源仓库
- 不是弱相关教程/文章集合
- 不是目录套目录的低增量重复项（除非已明确作为入口锚点被选入）

### 必过检查 2：基础元数据完整
至少有：
- `repo`
- `source`
- `summary`
- `category`
- `platforms`
- `safety_precheck`

### 必过检查 3：风险不过线
- `high risk` 默认不得进入正式收录
- 如确有战略价值，也应先停留在观察或风险样本库，不直接入正式索引

### 必过检查 4：有明确收录理由
必须能回答两件事：
1. 为什么现在收
2. 收了以后对 Skill Tree 的直接价值是什么

说不清就不进 intake。

### 必过检查 5：可被索引层消费
必须能补齐：
- `collection_status`
- `priority_score`
- `security_rating`
- `include_reason`
- `search_text`

不能稳定写入索引层的条目，不进正式库。

---

## 四、执行分工（面向产品 / 研究 / 总管）

### 研究（林晚）
负责：
- catalog 增量发现
- shortlist 筛选与压缩
- risk sample library 归类
- intake 名单给出
- ingestion / review 规则文档维护

### 产品（黄思博）
负责：
- 定义索引层字段如何在 UI 展示
- 明确哪些字段对用户可见（security_rating / collection_status / include_reason）
- 用同一流程要求所有新增条目，不另起一套口径

### 总管（辛海璐）
负责：
- 只按 intake + ingestion guide 写正式索引
- 保证正式库、观察池、风险样本库分层
- 不自行跳过筛选层补录条目

---

## 五、最简可落地流程图（文本版）

```text
GitHub/awesome lists/official sources
        ↓
   Catalog（发现池）
        ↓ 规则筛选
   Shortlist（优先/观察/丢弃）
      ↙       ↓        ↘
 Intake    观察循环    Risk Sample Library
   ↓
 Ingestion Guide 补字段
   ↓
 Index（正式库 / Web / Search 可消费）
```

---

## 六、分阶段执行列表

### 阶段 A：发现
- 研究更新 catalog
- 补基础 metadata

### 阶段 B：筛选
- 研究生成 shortlist
- 压缩出决策摘要

### 阶段 C：决策
- 裴谦拍板优先收录方向
- 研究生成 intake 名单

### 阶段 D：接入
- 总管按 ingestion guide 补字段
- 写入 repo 正式索引层

### 阶段 E：反向优化
- 丢弃项进入风险样本库
- 用反例规则优化下一轮筛选

---

## 七、结论

Skill Tree 以后不应该再靠“谁觉得不错就加进去”。

统一流程就是：
**catalog → shortlist → risk library / intake → ingestion → index**

只要这条链路不被跳过，规模可以增长，质量也不会失控。