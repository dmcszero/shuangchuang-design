---
id: nd-mentorship-taskmodal
title: 新建批次打磨任务弹窗
page: page-mentorship
kind: modal
importance: medium
sources:
  - src/components/MentorshipDispatch.tsx:408-483
---

## 一句话定位

「一键群发」的任务发射台：填标题、选目标梯队、定截止时间、写打磨要求，提交后立刻出现在右栏任务中心——**本页唯一的写操作**。

## 事实（每条强制可回溯）

1. 由 `isTaskModalOpen` 控制（无遮罩点击关闭、无 ESC 关闭，只能点 ✕ 或取消）。 Sources: [src/components/MentorshipDispatch.tsx:37]() [src/components/MentorshipDispatch.tsx:408-419]()
2. 表单四个字段及初值：标题（空，`required`）、目标梯队（`A`，下拉三档）、提交截止（**`'2026-09-08 18:00'` 写死初值**，纯文本框）、打磨要求（空）。 Sources: [src/components/MentorshipDispatch.tsx:41-44]() [src/components/MentorshipDispatch.tsx:421-467]()
3. 目标梯队下拉的选项文案带写死数量：「A级 · 国赛金奖冲刺池 (**15项**)」「B级 · 省金/国银培育池 (**28项**)」「全校所有申报项目 (**82项**)」——与驾驶舱的 82/15 是同一套演示数字。 Sources: [src/components/MentorshipDispatch.tsx:432-440]()
4. `handleCreateCohortTask` 构造 `CohortBatchTask`：`id` 用时间戳、`targetTracks: 'ALL'` **写死**、`totalTargetProjects` 按梯队映射 **15 / 28 / 82**（写死）、`submittedCount: 0`、`reviewedCount: 0`、`status: 'active'`、`createdAt: '2026-08-27'` **写死**；描述为空时兜底「请按照最新2026国赛评审标准完成材料迭代并上传。」 Sources: [src/components/MentorshipDispatch.tsx:93-108]()
5. 提交后：调 `onAddNewCohortTask(newTask)`（App 侧 `setCohortTasks(prev => [newTask, ...prev])` 插到最前）→ 关弹窗 → 清空标题与描述（**截止时间与梯队选择保留**）。 Sources: [src/components/MentorshipDispatch.tsx:111-114]() [src/App.tsx:519-521]()
6. 校验只有浏览器原生 `required`（标题为空时提交被拦），**无其它校验**（截止时间格式不校验）。
7. 任务一旦创建，`targetTracks` 恒为 `'ALL'`，界面上也没有赛道选择项——「面向梯队下发」实际只有梯队维度可配。 Sources: [src/components/MentorshipDispatch.tsx:101]()

## 规则与边界（AI 开发硬约束）

- `totalTargetProjects` 的三个写死值（15/28/82）**同时被用作进度条分母**：在真实项目数远小于 82 时，任何新任务的进度都会显得极低——这是「演示数字进入业务计算」的典型例子（见 issue `issue-mentorship-mock-fanout`）。
- `createdAt` 写死 `'2026-08-27'`（不是当前日期），若将来按时间排序会失真。
- 截止时间是**自由文本**（默认写死），没有日期选择器，也没有过期校验。
- 弹窗关闭**不清空表单**（只有成功创建才清标题与描述）——打开旧内容会残留。
- 本弹窗与 `page-cockpit` 的「导入新批次项目」**不是一回事**：那个导项目（`modal-batch-import`），这个下发任务。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 目标规模改为真实统计 | `:104` | 需按 `projects` 统计各梯队数量（App 层传入） |
| 增加赛道维度 | `:101` | `CohortBatchTask.targetTracks` 语义 + 表单控件 |
| 截止时间改日期选择器 | `:443-455` | 纯 UI（值格式同时要定） |
| 关闭时清空表单 | `:411` | 纯逻辑 |
| 创建后自动定位到任务卡 | `:111-114` | 需滚动锚点（当前新任务插到列表最前） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-mentorship-banner-2-taskmodal`** ← `nd-mentorship-banner`（页头与调度动作）｜`navigate` · **implemented（已实现）**
  - 触发：点击页头「新建梯队批量打磨任务」
  - 逻辑：setIsTaskModalOpen(true)。
  - 出处：`src/components/MentorshipDispatch.tsx:155-161`
  - 出处：`src/components/MentorshipDispatch.tsx:408-419`

**出边 1 条**

- **`e-mentorship-taskmodal-2-tasks-writeback`** → `nd-mentorship-tasks`（常态化培育任务中心）｜`writeback` · **implemented（已实现）**
  - 触发：弹窗提交「一键群发下发」
  - 逻辑：handleCreateCohortTask → onAddNewCohortTask(newTask) → App.handleAddNewCohortTask：setCohortTasks(prev => [newTask, ...prev])（插到最前）→ 右栏任务中心立即渲染新任务卡。
  - 出处：`src/components/MentorshipDispatch.tsx:93-114`
  - 出处：`src/App.tsx:519-521`
  - 备注：totalTargetProjects 与 createdAt 均为写死值（见 issue-mentorship-mock-fanout）。
<!-- EDGES:END -->
