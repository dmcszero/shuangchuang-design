---
id: page-milestones
title: 里程碑看板
section: sec-cockpit
importance: medium
view: milestones
component: src/components/MilestoneKanban.tsx
sources:
  - src/components/MilestoneKanban.tsx:1-189
related_pages: ["page-cockpit", "page-workbench", "page-screening"]
nodes:
  - nd-milestones-banner
  - nd-milestones-stages
  - nd-milestones-trend
  - nd-milestones-board
---

## 一句话定位

学校管理端的「管线视图」：把全校项目按 L1~L5 五个备赛阶段铺成看板列，按健康度染色，配一条阶段均分跃迁线——回答「项目都卡在哪一段、谁快掉队、培育有没有提分」。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'milestones'` 时挂载，接收三个 props：`projects` / `onSelectProject` / `onOpenReportExport`。 Sources: [src/App.tsx:751-759]() [src/components/MilestoneKanban.tsx:15-24]()
2. 本页**不在沉浸式白名单**内：外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `milestone-kanban-view`。 Sources: [src/components/MilestoneKanban.tsx:37]()

**二、页面级结构**

4. 四段式：页头 → L1~L5 阶段流卡 → 阶段均分跃迁卡 → 看板列。 Sources: [src/components/MilestoneKanban.tsx:39]() [src/components/MilestoneKanban.tsx:64]() [src/components/MilestoneKanban.tsx:90]() [src/components/MilestoneKanban.tsx:126]()
5. 页面只有 **1 个 state**（`selectedPipelineStage`，初值 `'ALL'`），且该筛选**实际只影响「共显示 N 个项目」一处**。 Sources: [src/components/MilestoneKanban.tsx:25]() [src/components/MilestoneKanban.tsx:35-40]() [src/components/MilestoneKanban.tsx:131-133]()
6. 阶段定义（五项 L1~L5 的名称/描述/配色）**写在组件体内**，不是共享常量；与其它页的阶段口径不一致。 Sources: [src/components/MilestoneKanban.tsx:26-32]()

**三、数据口径**

7. 真实派生的只有两处：各阶段项目数（阶段卡与列头）与总数显示；**其余数字全部写死**（81.2 / 86.5 / 90.8 / 94.8、+7.4 分）。 Sources: [src/components/MilestoneKanban.tsx:27-31]() [src/components/MilestoneKanban.tsx:102-121]()
8. 「阶段均分跃迁」在当前数据结构下**无法真实计算**：`ProjectItem` 只有一个当前 `totalScore`，没有历史快照。 Sources: [src/data/mockProjects.ts:20]()
9. 项目健康度字段 `healthStatus`（`normal` / `warning` / `critical`）与 `healthReason` 由本页、`page-cockpit` 共用。 Sources: [src/components/MilestoneKanban.tsx:147-168]()

## 规则与边界（AI 开发硬约束）

- **本页是驾驶舱的补充视角**：驾驶舱按「分数梯队」切（A/B/C/D），本页按「备赛阶段」切（L1~L5），两者都不写数据、只做投影。
- **筛选缺陷已登记**（issue `issue-milestones-filter-no-effect`）：`filteredProjects` 与看板列取数不同源，点阶段卡只有数字变化。
- 阶段口径三套并存（本页 L1~L5 / `page-guidance` L1~L6 / `page-coach` L1~L4）——各页只登记不统一，待上司拍板（`issue-guidance-stage-taxonomy-mismatch`）。
- 本页**没有任何写操作**：不能改项目阶段、不能催办、不能派单；「拖拽改阶段」是常见需求但当前无接口。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 修复阶段筛选 | `:35-40` `:136` | 看板列改用 `filteredProjects` |
| 阶段口径统一 | `:26-32` | 需产品拍板 L 阶段数与名称；三页同步 |
| 均分趋势接真实数据 | `:102-121` | 需历史分数快照 |
| 阶段拖拽/推进 | `:135-189` | 需写接口（App 层无 `setProjects` 暴露给本页） |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-milestones-banner` | 页头与复盘导出 | bar | 39-62 | → `modal-report-export` |
| `nd-milestones-stages` | L1~L5 阶段流指示卡 | panel | 64-88 | 无（筛选未生效） |
| `nd-milestones-trend` | 阶段均分跃迁卡 | panel | 90-124 | 无（纯常量） |
| `nd-milestones-board` | 全生命周期看板列 | list | 126-189 | → `shell-project-drawer`（点卡片） |

> 未下钻为节点的页面级结构：阶段常量与筛选派生（25-40）、看板栅格容器（134-135）。
>
> **拆分依据**：四块数据域与出口各不相同——页头管导出、阶段卡是（名义上的）筛选器、趋势卡是纯常量叙事、看板是唯一有出口（项目抽屉）的主体。

## 与 related_pages 的联动提示

- **← `page-cockpit`（数据驾驶舱）**：同属 `sec-cockpit`；驾驶舱的 `onNavigateTab` 类型里含 `'milestones'` 但**无人调用**——从驾驶舱到本页目前只能走侧栏。
- **↔ `page-screening`（智能初筛中心）**：初筛按「分数/合规」切，本页按「阶段」切；同一批项目两种视图，无互跳入口。
- **→ `shell-project-drawer`（项目详情抽屉）**：卡片点击的落点；抽屉内可派导师、看工单。
- **→ `page-workbench`（项目工作台）**：学生侧看到的 `stageName`（当前阶段）就是本页分列的字段来源；本页不写回，学生端阶段推进目前无入口。
