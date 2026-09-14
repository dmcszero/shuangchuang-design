---
id: nd-mentorship-tasks
title: 常态化培育任务中心
page: page-mentorship
kind: list
importance: high
sources:
  - src/components/MentorshipDispatch.tsx:357-405
---

## 一句话定位

右栏的批次任务监督台：列出已下发的梯队打磨任务，每条给出目标梯队、要求、提交进度条、截止时间与专家已审数——**本页唯一看得到「闭环进度」的地方**。

## 事实（每条强制可回溯）

1. 标题「常态化培育任务下发与监督 ({cohortTasks.length})」+ 说明「管理者一键向 A/B 级梯队项目团队群发阶段打磨任务，自动建立"挖掘-培育-提升-复盘"循环」。 Sources: [src/components/MentorshipDispatch.tsx:360-368]()
2. 数据来自 prop `cohortTasks`（App 的 `mockCohortTasks` 状态，可新增）。 Sources: [src/components/MentorshipDispatch.tsx:15-16]() [src/App.tsx:705-712]()
3. 每条任务卡显示：标题（截断）+ 目标梯队徽标（`targetGrade === 'ALL'` 显示「全校梯队」，否则「{X}级梯队」）、描述（两行截断）、**提交进度条**（`submittedCount / totalTargetProjects` 百分比取整）、截止时间、`reviewedCount`（显示为「专家已审 N 项」）。 Sources: [src/components/MentorshipDispatch.tsx:371-402]()
4. 进度条与百分比是**真实计算**（`Math.round(submitted / total * 100)`）；但 `totalTargetProjects` 在创建时是写死的（见 `nd-mentorship-taskmodal`）。 Sources: [src/components/MentorshipDispatch.tsx:372]()
5. 任务卡**无任何动作**（不能催办、不能查看明细、不能关闭）；列表为空时无空态文案。 Sources: [src/components/MentorshipDispatch.tsx:371-402]()
6. `status` 字段（`'active'`）在卡上**未使用**——没有「进行中/已结束」的区分显示。 Sources: [src/components/MentorshipDispatch.tsx:93-108]()

## 规则与边界（AI 开发硬约束）

- 本栏是**只读监督面**：任务只能通过右上「新建梯队批量打磨任务」创建，创建后不能编辑或终止。
- 进度是「提交数」而非「审核通过数」，两个数字（`submittedCount` / `reviewedCount`）语义不同但并列展示，容易误读；`reviewedCount` 甚至可能超过提交数（无约束）。
- `totalTargetProjects` 的可信度取决于创建时的写死值（15/28/82），**与真实 `projects` 数量（8）不符**——进度条百分比因此不反映真实规模。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 任务卡加催办/详情 | `:371-402` | 需新增回调（当前只有 `onAddNewCohortTask`） |
| 显示任务状态 | `:371-402` | `status` 字段已存在未用 |
| 进度改为审核口径 | `:372-397` | `CohortBatchTask` 语义 + 可能新增字段 |
| 空态 | `:371` | 纯 UI |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-mentorship-taskmodal-2-tasks-writeback`** ← `nd-mentorship-taskmodal`（新建批次打磨任务弹窗）｜`writeback` · **implemented（已实现）**
  - 触发：弹窗提交「一键群发下发」
  - 逻辑：handleCreateCohortTask → onAddNewCohortTask(newTask) → App.handleAddNewCohortTask：setCohortTasks(prev => [newTask, ...prev])（插到最前）→ 右栏任务中心立即渲染新任务卡。
  - 出处：`src/components/MentorshipDispatch.tsx:93-114`
  - 出处：`src/App.tsx:519-521`
  - 备注：totalTargetProjects 与 createdAt 均为写死值（见 issue-mentorship-mock-fanout）。

**出边 0 条**

（无）
<!-- EDGES:END -->
