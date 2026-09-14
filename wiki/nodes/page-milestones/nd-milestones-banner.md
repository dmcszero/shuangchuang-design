---
id: nd-milestones-banner
title: 页头与复盘导出
page: page-milestones
kind: bar
importance: low
sources:
  - src/components/MilestoneKanban.tsx:39-62
---

## 一句话定位

里程碑看板的页头：一句话点明本页三件事（L1~L5 管线监控 / 停滞预警 / 金奖指标复盘），右侧一个动作——生成复盘材料。

## 事实（每条强制可回溯）

1. 标题「全流程进度追踪、实时监控与金奖指标复盘」+ 图标 `GitBranch`。 Sources: [src/components/MilestoneKanban.tsx:41-45]()
2. 副文写死「L1~L5 生命周期管线监控、项目停滞超时实时预警、金奖核心指标提升全景复盘」。 Sources: [src/components/MilestoneKanban.tsx:46-48]()
3. 「生成金奖指标提升复盘材料」按钮（翡翠色）→ prop `onOpenReportExport`（App 侧打开 `modal-report-export`）。 Sources: [src/components/MilestoneKanban.tsx:50-57]() [src/App.tsx:755-758]()
4. 页面根容器带稳定 id `milestone-kanban-view`。 Sources: [src/components/MilestoneKanban.tsx:37]()

## 规则与边界（AI 开发硬约束）

- 页头**无状态**，按钮只转发 prop；同款出口在 `page-cockpit` 也有（同一弹层）。
- 副文里的「L1~L5」是本页的阶段口径；与 `page-guidance`（L1~L6）、`page-coach`（L1~L4）**不一致**，属已知待拍板项（见 `page-guidance` 的 issue `issue-guidance-stage-taxonomy-mismatch`）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 改副文口径 | `:46-48` | 需与阶段口径拍板同步 |
| 新增页头动作 | `:50-57` | props 需扩 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-milestones-banner-2-modal-report`** → `modal-report-export`（报告导出）｜`navigate` · **implemented（已实现）**
  - 触发：点击页头「生成金奖指标提升复盘材料」
  - 逻辑：prop onOpenReportExport → App 层 () => setIsReportModalOpen(true)（与驾驶舱同一弹层）。
  - 出处：`src/components/MilestoneKanban.tsx:50-57`
  - 出处：`src/App.tsx:757`
<!-- EDGES:END -->
