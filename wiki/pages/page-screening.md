---
id: page-screening
title: 智能初筛中心
section: sec-screening
importance: high
view: screening
component: src/components/ScreeningHub.tsx
sources:
  - src/components/ScreeningHub.tsx:1-563
related_pages: ["page-cockpit", "page-mentorship"]
nodes:
  - nd-screening-control
  - nd-screening-matrix
  - nd-screening-ranking
  - nd-screening-compliance
---

## 一句话定位

学校管理端的项目处置主工作面：用「赛道 / 梯队 / 合规 / 关键词」四维筛选把项目收窄，再在三个互斥视图里看——**二级指标全景表**（谁强在哪）、**综合梯队排名**（谁在前）、**合规拦截看板**（谁有雷）；每个项目都能下钻到详情抽屉或送去排期。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'screening'` 时挂载，接收四个 props：`projects` / `onSelectProject` / `onOpenBatchImport` / `onOpenAssignMentor?`（可选）。 Sources: [src/App.tsx:697-703]() [src/components/ScreeningHub.tsx:15-28]()
2. 本页**不在沉浸式白名单**内：外层可纵向滚动、有常规内边距与全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `screening-hub-view`。 Sources: [src/components/ScreeningHub.tsx:58]()

**二、页面级结构**

4. 三段式：控制区（头 + 视图 tab + 筛选）→ 互斥的三张视图 → 无页脚。 Sources: [src/components/ScreeningHub.tsx:59-177]() [src/components/ScreeningHub.tsx:178]() [src/components/ScreeningHub.tsx:388]() [src/components/ScreeningHub.tsx:482]()
5. 页面 state 共 5 个（筛选 4 + 视图 1），**全部为本地 state，不写 URL、不外传**；筛选结果 `filteredProjects` 是唯一派生，三视图共用。 Sources: [src/components/ScreeningHub.tsx:30-55]()
6. 数据只读：本页所有信息来自 `projects`，**没有任何写操作**（不改状态、不落库）；「导出评分细则」与「重新批量扫描」分别是 alert 与打开弹层。 Sources: [src/components/ScreeningHub.tsx:195]() [src/components/ScreeningHub.tsx:496]()

**三、数据口径（本页最重要的结构事实）**

7. **指标结构按赛道而异**：mock 中高教主赛道-创意组项目为 4 个一级（个人成长 5 / 项目创新 3 / 产业价值 4 / 团队协作 5 个二级）；红旅赛道项目的「项目创新」有 **4** 项且一级是「发展前景」（`development_prospect`）；产业命题赛道项目（proj-007）有 **5** 个一级（个人成长 / 项目创新 / **实现成效** / **项目分析** / 团队协作）。 Sources: [src/data/mockProjects.ts:60-81]() [src/components/ScreeningHub.tsx:265-271]()
8. 但**全景表的列是写死的 17 列**且**按下标取数**，因此第 7 条里的差异会导致：红旅项目第 4 个二级项不显示、产业命题项目的「项目分析」整块缺失、且「产业价值」列名与真实一级名（实现成效）不符。 Sources: [src/components/ScreeningHub.tsx:206-259]() [src/components/ScreeningHub.tsx:309-368]()
9. 默认筛选是「高教主赛道-创意组」，**首屏只显示 5 / 8 个项目**（当前 mock）。 Sources: [src/components/ScreeningHub.tsx:30]()
10. 排名用 `project.rank` 字段，不随筛选重算。 Sources: [src/components/ScreeningHub.tsx:412-414]()
11. 合规数据来自 `ProjectItem.compliance`（`passed` / `ipRiskLevel` / `ipDetails` / `plagiarismRate` / `aiContentRate` / `warnings[]`），本页只用其中 5 个字段，`warnings[]` 仅决定底色不展示内容。 Sources: [src/components/ScreeningHub.tsx:509-553]()

## 规则与边界（AI 开发硬约束）

- **本页是「只读视图层」**：所有处置动作（详情、排期、导入、导出）都是出口，页面自身不改变任何数据。要加「就地改分/改状态」需先在 App 层有对应写接口。
- **指标表不可跨赛道复用**：列结构写死且按下标取值（issue `issue-screening-fixed-columns-by-index`）。任何「统一评分表」的需求都要先把指标结构数据化（`rules2026.ts` 已是候选真源）。
- 三视图共用筛选，其中 `compliance_scan` 最依赖合规筛选器；切视图不会重置筛选，容易误判「数据不对」。
- 「排期」按钮**不传项目**给下游（App 的 handler 忽略入参），当前只是「跳到导师调度台」的快捷方式。
- `alert()` 与「重新批量扫描→打开导入弹层」两处均为占位/口径不符，勿当作能力引用。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 指标表改为数据驱动 | `:206-368` | 需引入指标字典（`rules2026.ts`）与按 id 取数 |
| 排期带项目载荷 | `:471-476` | App `handleOpenAssignMentor`（:526-529）+ `page-mentorship` 接收 |
| 批量导入后自动回到合规视图 | `:496` | 弹层回调 `handleBatchImportComplete`（App :503-506） |
| 排名按筛选重算 | `:412` | 口径需先定（全局名次 vs 结果集名次） |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-screening-control` | 视图切换与四维筛选 | form | 59-177 | 无（纯内部状态，驱动三视图） |
| `nd-screening-matrix` | 二级指标全景表 | table | 178-386 | → `shell-project-drawer`（下钻诊断） |
| `nd-screening-ranking` | 综合梯队与金奖对标 | table | 388-480 | → `shell-project-drawer`（详情）、→ `page-mentorship`（排期） |
| `nd-screening-compliance` | 合规与一票否决拦截 | panel | 482-563 | → `shell-project-drawer`（查看详情）、→ `modal-batch-import`（重新批量扫描） |

> 未下钻为节点的页面级结构：三视图互斥渲染分支（178 / 388 / 482）、`filteredProjects` 派生（37-55）。
>
> **拆分依据**：控制区与三张视图各有独立状态域与出口；三视图虽然共用筛选结果，但呈现维度、判据与动作完全不同（指标对比 / 排名处置 / 合规裁决），必须分开登记——尤其合规视图的判据（`ipRiskLevel` / `plagiarismRate` 阈值）与其它两视图无关。

## 与 related_pages 的联动提示

- **← `page-cockpit`（数据驾驶舱）**：驾驶舱的「申报总数 / A 级 / B 级 / C·D 级」四张 KPI 卡与「查看初筛全览」都跳到这里，**但不带筛选条件**——到本页后仍是默认赛道筛选，看到的数会比驾驶舱卡片数字少（驾驶舱卡片是真实派生、默认赛道筛选是本页初值）。
- **→ `page-mentorship`（导师智能调度）**：本页「排期」按钮的落点（无载荷）；导师调度页是本页的下游处置台。
- **→ `shell-project-drawer`（项目详情抽屉）**：三张视图的每一行/条都能打开它；抽屉里的工单与项目详情是进一步下钻的载体。
- **→ `modal-batch-import`（批量导入弹层）**：合规视图的「重新批量扫描」入口；导入完成后 App 直接替换 `projects`（`handleBatchImportComplete`），本页筛选状态保留。
- **与 `page-milestones`（里程碑看板）**：本页无跳转入口；里程碑页是「按阶段看」，本页是「按分数/合规看」，两者对同一批项目的切面不同。
