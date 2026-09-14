---
id: nd-cockpit-banner
title: AI 决策指令横幅
page: page-cockpit
kind: bar
importance: high
sources:
  - src/components/CockpitDashboard.tsx:39-76
---

## 一句话定位

驾驶舱顶部的「本周要干什么」指挥条：用一句话点出全校金奖潜力池规模与当前最突出的失分共性，并在右侧给出两个立即动作（导出复盘汇报 / 导入新批次项目）。

## 事实（每条强制可回溯）

1. 左上是 AI 徽标「AI 备赛决策大模型实时分析」+ 更新时间「今日 20:00」（**写死文案**，不随实际时间变化）。 Sources: [src/components/CockpitDashboard.tsx:42-45]()
2. 主标题写死「2026大赛金奖培育数据决策中枢：聚焦锁定 **15 个 A 级金奖种子**，重点补齐产业价值短板」。 Sources: [src/components/CockpitDashboard.tsx:46-48]()
3. 正文洞察段写死：全校 **82 个**项目中 A 级金奖潜力池达 **15 项**，最突出失分共性为【产业价值-市场定位与财务测算】（平均得分率仅 **68.4%**），建议本周调度投资人专家。 Sources: [src/components/CockpitDashboard.tsx:49-51]()
4. 两个动作按钮：「一键导出复盘汇报」（绿色）→ prop `onOpenReportExport`；「导入新批次项目」（蓝色）→ prop `onOpenBatchImport`。 Sources: [src/components/CockpitDashboard.tsx:57-71]()
5. 横幅背景为 `sky→blue→indigo` 渐变 + 右侧装饰层（`pointer-events-none`），无交互。 Sources: [src/components/CockpitDashboard.tsx:40-41]()

## 规则与边界（AI 开发硬约束）

- **本横幅的数字全是写死的**（82 / 15 / 68.4%），与页面下方 KPI 卡的真实派生值**自相矛盾**——真实项目数为 8、A 级为 5（见 issue `issue-cockpit-static-metrics`）。改文案时不要顺手「对齐」其中一处而留下另一处。
- 「A 级金奖种子」与下方 KPI 卡的「A级·国赛金奖池」是**同一概念的两处表述**，两处都写死/派生口径不同；统一时以 `projects` 派生为准。
- 两个按钮都只是**转发 prop**，本组件不含弹层：导出走 `modal-report-export`，导入走 `modal-batch-import`（见出边）。
- 本组件**无任何 state**，是纯 props 展示页；「实时分析」是文案承诺，没有任何分析调用。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让横幅数字接真实数据 | `:46-51` | 本页 KPI 卡派生逻辑（`:31-35`）+ 见 issue |
| 增加第三个动作按钮 | `:57-71` | 需在 `CockpitDashboardProps`（`:12-21`）加 prop，并改 App 调用点 |
| 改「更新时间」为真实时间 | `:44` | 需引入时间源（当前为字面量） |
| 调整横幅文案口径 | `:46-51` | 对外表述，需与产品口径一致（校管端默认页） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-cockpit-banner-2-modal-report`** → `modal-report-export`（报告导出）｜`navigate` · **implemented（已实现）**
  - 触发：点击横幅「一键导出复盘汇报」
  - 逻辑：prop onOpenReportExport → App 层 () => setIsReportModalOpen(true) → 渲染 ReportExportModal。
  - 出处：`src/components/CockpitDashboard.tsx:57-64`
  - 出处：`src/App.tsx:690`
  - 出处：`src/App.tsx:875-878`
- **`e-cockpit-banner-2-modal-import`** → `modal-batch-import`（批量导入与自动初筛）｜`navigate` · **implemented（已实现）**
  - 触发：点击横幅「导入新批次项目」
  - 逻辑：prop onOpenBatchImport → App 层 () => setIsImportModalOpen(true) → 渲染 BatchImportModal；导入完成后 App 用新数组整体替换 projects。
  - 出处：`src/components/CockpitDashboard.tsx:65-71`
  - 出处：`src/App.tsx:691`
  - 出处：`src/App.tsx:869-873`
  - 出处：`src/App.tsx:503-506`
  - 备注：与 e-screening-compliance-2-modal-import 指向同一弹层（两个入口）。
<!-- EDGES:END -->
