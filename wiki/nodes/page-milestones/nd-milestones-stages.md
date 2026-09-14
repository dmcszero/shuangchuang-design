---
id: nd-milestones-stages
title: L1~L5 阶段流指示卡
page: page-milestones
kind: panel
importance: medium
sources:
  - src/components/MilestoneKanban.tsx:64-88
---

## 一句话定位

五张阶段卡横排（申报与初筛 → 校赛与导师打磨 → 省赛集中封闭营 → 国赛精英训练营 → 金奖答辩冲刺），每张显示该阶段项目数与一句话重点，点击即「筛选」——**但筛选实际只作用于一个数字**。

## 事实（每条强制可回溯）

1. 阶段定义写在组件内（每次渲染重建的常量数组），五项：`L1 · 申报与初筛`（规则自检与AI对标）/ `L2 · 校赛与导师打磨`（首轮短板工单整改）/ `L3 · 省赛集中封闭营`（商业与财务模型强化）/ `L4 · 国赛精英训练营`（国赛评委模拟答辩）/ `L5 · 金奖答辩冲刺`（一票否决与极限路演）。 Sources: [src/components/MilestoneKanban.tsx:26-32]()
2. 每张卡的项目数是**真实派生**：`projects.filter(p => p.currentStage === st.key).length`。 Sources: [src/components/MilestoneKanban.tsx:27-31]()
3. 点击卡片切换 `selectedPipelineStage`（`ALL ↔ 该阶段`，再次点击同卡即取消），选中态加 `ring-2 ring-sky-500`。 Sources: [src/components/MilestoneKanban.tsx:68-72]()
4. **筛选只影响一处渲染**：`filteredProjects` 仅在「共显示 N 个项目」这一句里被读取（看板列用的是全量 `projects`）——因此点卡片**视觉上几乎无变化**，只有右上角数字会变。 Sources: [src/components/MilestoneKanban.tsx:35-40]() [src/components/MilestoneKanban.tsx:130-133]()
5. 五张卡的配色各自不同（L1 白 / L2 蓝 / L3 靛 / L4 琥珀 / L5 翡翠）。 Sources: [src/components/MilestoneKanban.tsx:27-31]()

## 规则与边界（AI 开发硬约束）

- **「点了没反应」是本节点的真实缺陷**（见 issue `issue-milestones-filter-no-effect`）：`filteredProjects` 与看板列的取数**不是同一个数据源**。修的时候要让看板列吃 `filteredProjects`（或反之统一）。
- 阶段名与 `currentStage` 字段值（`'L1'`…`'L5'`）强绑定；新增阶段要同时改类型、卡片数组与看板列。
- 卡片上的「重点」描述是产品口径文案（如「一票否决与极限路演」），改动属对外表述。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 修复筛选生效 | `:35-40` + `:130-133` | 看板列改用 `filteredProjects`（注意列内还要再按 stage 分） |
| 阶段数变化 | `:26-32` + 看板栅格列数（`lg:grid-cols-5`） | 类型 `currentStage` + 数据 |
| 卡片加进度/趋势 | `:27-31` | 需历史分数数据（当前无） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
