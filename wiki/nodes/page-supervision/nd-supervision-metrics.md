---
id: nd-supervision-metrics
title: 督导指标横幅
page: page-supervision
kind: panel
importance: medium
sources:
  - src/components/SupervisionClosure.tsx:579-609
---

## 一句话定位

四张督导指标卡：我指导的工单批次、待确认的 AI 草稿、学生修改中的工单、AI 复核提分均值——一半真实统计、一半写死，是导师端「今天有多少活」的速览。

## 事实（每条强制可回溯）

1. 卡一「我指导的项目工单」：数值 `workOrders.length`（**真实派生**）+ 注「支持多导师组联合打磨」。 Sources: [src/components/SupervisionClosure.tsx:581-585]()
2. 卡二「待确认/待推送 AI 工单草稿」：`workOrders.filter(w => w.status === 'draft_ai_suggested').length`（真实派生）+ 注「语音转写沉淀待导师敲定」。 Sources: [src/components/SupervisionClosure.tsx:587-592]()
3. 卡三「学生团队修改中工单」：`status === 'team_in_progress' || 'pending_team_accept'` 的数量（真实派生）+ 注「任务条目双向进度追踪」。 Sources: [src/components/SupervisionClosure.tsx:594-599]()
4. 卡四「AI 复核提分均值 (Δ)」：**写死 `+7.0 分`**（不按 `workOrders` 里的 `expertCheck.scoreChangeDelta` 求均值）+ 注「双版本文档语义深度对比」。 Sources: [src/components/SupervisionClosure.tsx:601-607]()
5. 四卡配色：1 白底 / 2 紫 / 3 蓝 / 4 翡翠。 Sources: [src/components/SupervisionClosure.tsx:581-606]()

## 规则与边界（AI 开发硬约束）

- **三真一假**：前三个数是真实筛选，第四个是写死值——而真实数据里 `expertCheck.scoreChangeDelta` 是可求均值的（已完成工单带该字段），改造成本很低（见 issue `issue-supervision-static-metrics`）。
- 卡三把 `pending_team_accept`（已推送未接单）与 `team_in_progress`（整改中）合并计数，**语义上是「在途」而非「修改中」**——文案与口径略偏。
- 指标横幅不参与筛选，点卡片不跳转（纯展示）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 提分均值接真实数据 | `:604` | 需对已结项工单求 `expertScoreDelta` 均值 |
| 卡片可点击跳筛选 | `:581-606` | 需与左栏 `selectedStatus` 联动 |
| 拆分「在途」与「整改中」 | `:596-598` | 需新增卡片或改文案 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
