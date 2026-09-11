---
id: page-screening
title: 智能对标初筛与排名（screening）
section: sec-admin
importance: high
sources:
  - src/components/ScreeningHub.tsx
  - src/components/ProjectDetailDrawer.tsx
  - src/data/mockProjects.ts
  - src/data/rules2026.ts
  - src/types.ts
related_pages: [page-cockpit, page-data-model, page-org-mgmt]
---

# 智能对标初筛与排名（screening）

## 一句话定位

管理端的 2026 细则对标初筛页：**三个视图模式**（二级指标矩阵 / 综合梯队与金奖对标 / 合规一票否决拦截）× **四维筛选**（赛道 / 梯队 / 合规 / 关键词），点击任一行通过 `ProjectDetailDrawer` 下钻到六 tab 详情。

## 事实（每条强制可回溯）

### 一、入口与筛选

1. Props 共 5 项：`projects` / `onSelectProject` / `onOpenBatchImport` / `onOpenAssignMentor`。`Sources: [src/components/ScreeningHub.tsx:17-29]()`
2. 四个筛选状态：`selectedTrack`（默认 `higher_education_creative`，**不是 `'ALL'`**）、`selectedGrade`（默认 `'ALL'`）、`selectedCompliance`（默认 `'ALL'`）、`searchQuery`。`Sources: [src/components/ScreeningHub.tsx:30-33]()`
3. 视图模式状态 `viewMode`，三值 `'tier2_matrix' | 'comprehensive' | 'compliance_scan'`，默认 `tier2_matrix`。`Sources: [src/components/ScreeningHub.tsx:34-34]()`
4. 过滤逻辑 `useMemo` 依赖全部四个筛选值，规则为：赛道精确匹配 → 等级精确匹配 → 合规状态（`passed` 取通过、`warning` 取未通过）→ 关键词命中 5 个字段（`name` / `college` / `leader` / `advisor` / `code`，全小写匹配）。`Sources: [src/components/ScreeningHub.tsx:36-55]()`
5. **默认赛道筛选是硬编码的高教主赛道·创意组**，因此进入页面默认看不到其它赛道的项目 —— 这不是数据缺失。`Sources: [src/components/ScreeningHub.tsx:30-30]()`
6. 筛选工具条四段：赛道选择器（114）、等级选择器（131）、合规状态（147）、搜索框（161）。`Sources: [src/components/ScreeningHub.tsx:112-177]()`

### 二、三视图模式

7. 视图切换器在页头右侧。`Sources: [src/components/ScreeningHub.tsx:72-111]()`
8. 三个模式的按钮文案（含 button 与文案行号）：**2026二级细分指标全景表**（`tier2_matrix`，按钮 75 / 文案 83）、**综合梯队与金奖对标**（`comprehensive`，按钮 87 / 文案 95）、**合规与一票否决拦截**（`compliance_scan`，按钮 99 / 文案 107）。`Sources: [src/components/ScreeningHub.tsx:74-110]()`
9. **视图 1（二级指标矩阵，178-387）**：两级表头（一级分组头 206、一级超列 212、二级子表头 228、二级项 234/241/246/252），行内按 `tier1Scores` 逐个 `find` 取四组分数（266-269）。`Sources: [src/components/ScreeningHub.tsx:178-387]()`
10. 该视图的四组二级指标项数是 **5 / 3 / 4 / 5 == 17**，与 `rules2026.ts` 中高教主赛道·创意组的指标树一致。`Sources: [src/components/ScreeningHub.tsx:234-264]()` `Sources: [src/data/rules2026.ts:14-53]()`
11. 二级指标项是**硬编码**在视图 1 里的（个人成长 5 项 / 项目创新 3 项 / 产业价值 4 项 / 团队协作 5 项），而 `rules2026.ts` 是数据驱动的 17 项 —— 即**表格结构写死了默认赛道的指标**。`Sources: [src/components/ScreeningHub.tsx:234-264]()`
12. 产业价值组在取数时做了三个 id 的兜底：`industry_value || development_prospect || tertiary...`（红旅赛道用 `development_prospect`）。`Sources: [src/components/ScreeningHub.tsx:268-268]()`
13. **视图 2（综合对标表，388-481）** 与 **视图 3（合规与知识产权扫描表，482-574）** 各自独立渲染，不做组件抽离。`Sources: [src/components/ScreeningHub.tsx:388-388]()` `Sources: [src/components/ScreeningHub.tsx:482-482]()`

### 三、项目详情抽屉（下钻）

14. 抽屉由 `App` 级挂载，`selectedProject` 有值且 `isDrawerOpen` 为真时渲染，否则返回 `null`。`Sources: [src/components/ProjectDetailDrawer.tsx:36-36]()`
15. 打开路径是 `handleSelectProject`（设置 project + 置位 drawer）。`Sources: [src/App.tsx:430-433]()`
16. 抽屉宽度 `max-w-3xl`，从右侧滑出，遮罩为 `bg-slate-900/40 backdrop-blur-xs`。`Sources: [src/components/ProjectDetailDrawer.tsx:41-45]()`
17. **六个 tab**（枚举与默认值）：`'scores' | 'radar' | 'compliance' | 'logic_gaps' | 'supervision' | 'materials'`，默认 `scores`。`Sources: [src/components/ProjectDetailDrawer.tsx:34-34]()`
18. 六个 tab 的文案与动态计数：

| tab | 文案 | 动态部分 |
|---|---|---|
| `scores` | 2026国赛二级细分评分 ({totalScore}分) | 总分 |
| `radar` | 金奖特征对标 ({goldSimilarity}%) | 金奖相似度 |
| `logic_gaps` | 逻辑断层与杀手锏问题 ({killerQuestions.length}) | 杀手题数 |
| `supervision` | 督导工单与版本演进 ({projectWorkOrders.length}) | 本项目的工单数 |
| `compliance` | 合规与体检 (通过 \| 预警) | 合规结论 |
| `materials` | 材料清单 | 无 |

`Sources: [src/components/ProjectDetailDrawer.tsx:81-137]()`

19. 六个 tab 的内容块行号：scores 144 / radar 256 / logic_gaps 326 / supervision 378 / compliance 450 / materials 509。`Sources: [src/components/ProjectDetailDrawer.tsx:144-144]()` `Sources: [src/components/ProjectDetailDrawer.tsx:256-256]()` `Sources: [src/components/ProjectDetailDrawer.tsx:326-326]()` `Sources: [src/components/ProjectDetailDrawer.tsx:378-378]()` `Sources: [src/components/ProjectDetailDrawer.tsx:450-450]()` `Sources: [src/components/ProjectDetailDrawer.tsx:509-509]()`
20. 工单 tab 的数据由 `workOrders.filter(o => o.projectId === project.id)` 单独过滤得到。`Sources: [src/components/ProjectDetailDrawer.tsx:38-38]()`
21. `scores` tab 内对二级指标做了"弱项"标记：得分率 < 75% 即 `isWeak`。`Sources: [src/components/ProjectDetailDrawer.tsx:201-202]()`
22. 抽屉底部有指派导师按钮 → `onOpenAssignMentor`，在 `App` 里的实现是"关抽屉 + 切到 mentorship tab"。`Sources: [src/App.tsx:455-458]()`

### 四、数据类型

23. 抽屉与初筛消费的核心结构：`ProjectItem`（含 `compliance` / `tier1Scores` / `logicGaps` / `killerQuestions` / `materials` / `scoreHistory`）。`Sources: [src/types.ts:99-140]()`
24. `ComplianceInspection` 8 个字段：通过与否 / 知识产权风险级别 / IP 详情 / 查重率 / AI 代写疑似度 / 参赛资格 / 历史重复申报 / 警告列表。`Sources: [src/types.ts:80-89]()`
25. `LogicGapItem` 四类 + 每个含 `title` / `location` / `description` / `suggestion`。`Sources: [src/types.ts:91-97]()`
26. `materials` 子结构含 BP 文件名与页数、PPT 文件名与页数、VCR 文件名（可选）、专利数、软著数。`Sources: [src/types.ts:131-139]()`
27. 规则侧 `TrackEvaluationRule` 含 `mandatoryConditions`（一票否决条件）。`Sources: [src/types.ts:54-61]()`

## 规则与边界（AI 开发硬约束）

- **视图 1 的二级指标项是硬编码的**，只覆盖默认赛道（高教主赛道·创意组）的 17 项。若用户切到红旅/职教/产业赛道，表头结构不会跟着变 —— 这是当前实现在多赛道下的最大限制。做多赛道适配时必须把 234-265 的结构改为按 `tier1Rules` 数据驱动。
- **新增一级/二级指标要改三处**：`rules2026.ts`（数据）、`ScreeningHub.tsx:234-265`（视图 1 表头与取数）、`mockProjects.ts` 各项目的 `tier1Scores`（数据）。漏掉第二处则数据不显示。
- **`ProjectDetailDrawer` 是全局单例**（挂在 `App` 级），不要在 `ScreeningHub` 内再挂一个，否则会出现双抽屉。
- **抽屉的 `isOpen` 与 `project` 是双条件**：`if (!isOpen || !project) return null`。只置 `isOpen` 不设 `project` 不会渲染。`Sources: [src/components/ProjectDetailDrawer.tsx:36-36]()`
- **`compliance.passed` 与 `selectedCompliance` 的语义是"通过/未通过"二值**，不是三态；`ComplianceInspection` 里的 `ipRiskLevel`（low/medium/high）没有参与筛选。想按风险级别筛，需要新增筛选维度。
- **弱项阈值 75% 是硬编码**：`isWeak = scoreRate < 75`。这个阈值与其它页面（如驾驶舱热力）的口径无关，改它不会全局生效。
- **默认赛道筛选不是 `'ALL'`**：这是刻意的产品化默认，但会让"看不到全部项目"被误判为 bug。改默认值前先确认产品意图。
- 搜索是 `toLowerCase()` 字面包含匹配，中文不受影响但英文/编号大小写不敏感。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一个视图模式 | `ScreeningHub.tsx:34` 加枚举 → `72-111` 加切换按钮 → 页尾加渲染块（参考 482） |
| 加一个筛选维度 | `ScreeningHub.tsx:30-33` 加 state → `36-55` 加过滤条件 → `112-177` 加控件 |
| 改筛选默认值 | `ScreeningHub.tsx:30-33` |
| 加一个抽屉 tab | `ProjectDetailDrawer.tsx:34` 加枚举 → `81-137` 加按钮 → `144-509` 区加内容块 |
| 改弱项阈值 | `ProjectDetailDrawer.tsx:202` |
| 改规则数据 | `rules2026.ts`（5 赛道全量） |
| 改项目评分数据 | `mockProjects.ts` 的 `tier1Scores` / `compliance` |
| 调多赛道适配 | 见规则节第 1 条（视图 1 数据驱动化） |

## 与 related_pages 的联动提示

- → **page-cockpit**：驾驶舱所有池卡点击都跳到这里（6 次），但**不传筛选条件**。若要实现"点 A 级卡后只筛 A 级"，需要给 `TabType` 加参数通道 —— 当前架构不支持。
- → **page-data-model**：本页是 `ProjectItem` / `ComplianceInspection` / `LogicGapItem` / `TrackEvaluationRule` 四个结构最重的消费方；改结构必看该页。
- → **page-org-mgmt**：抽屉底部的「指派导师」会切到 `mentorship` tab；导师库数据在 page-mentorship / page-pools-kb，真正指派还要看 `MentorshipDispatch`。
- 注意：`ProjectDetailDrawer` 被 `ScreeningHub`、`CockpitDashboard`、`MentorshipDispatch`、`SupervisionClosure`、`MilestoneKanban` 五处间接共用（都通过 `App.handleSelectProject`）—— 改抽屉等于改五个页面的下钻体验。
