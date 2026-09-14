---
id: nd-supervision-tasks
title: 辅导整改任务清单
page: page-supervision
kind: panel
importance: high
sources:
  - src/components/SupervisionClosure.tsx:911-1116
---

## 一句话定位

工单的第一个 tab，也是状态机的主驱动面：按当前状态给出下一步动作（确认推送 / 模拟接单 / 模拟提交），下方逐条维护整改任务（增删改、勾选完成）——**页面里点得最多的一块**。

## 事实（每条强制可回溯）

1. **状态驱动的行动区**（四个分支，互斥）：
   - `draft_ai_suggested` → 提示条 +「导师确认无误，一键推送团队」→ `handlePushDraftToTeam`（状态改 `pending_team_accept`）。 Sources: [src/components/SupervisionClosure.tsx:915-935]()
   - `pending_team_accept` → 「等待团队接单」+ 两个**演示按钮**：「模拟团队驳回」（→ `team_rejected`，附写死的驳回理由文案）与「模拟团队接单开始整改」（→ `team_in_progress`）。 Sources: [src/components/SupervisionClosure.tsx:936-963]()
   - `team_rejected` → 显示驳回理由 +「重新推送工单」按钮（复用 `handlePushDraftToTeam`）。 Sources: [src/components/SupervisionClosure.tsx:964-983]()
   - `team_in_progress` → 「团队整改进行中」+「模拟团队整改完毕并提交」→ `handleSimulateTeamSubmit`（状态改 `team_submitted`，并**一次性写入** `studentSubmission` 与 `versionDiff`（含 AI 提分数据））。 Sources: [src/components/SupervisionClosure.tsx:984-1022]()
2. 「模拟」前缀明确暴露这些按钮是**演示用**：真实团队侧动作（接单/驳回/提交）应来自学生端，代码里由导师端按钮代劳。 Sources: [src/components/SupervisionClosure.tsx:949]() [src/components/SupervisionClosure.tsx:955]() [src/components/SupervisionClosure.tsx:996]()
3. 任务清单区：每条任务显示复选框（`completed`）、优先级徽标、分类、标题、描述、`dueDays` 期限；操作图标两个——编辑（→ MODAL 4 弹窗）与删除（`handleDeleteTask`，**无二次确认**）。 Sources: [src/components/SupervisionClosure.tsx:1040-1095]()
4. 顶部「添加任务条目」按钮 → `handleOpenAddTaskModal`（清空表单打开 MODAL 4，默认分类「商业模式」、优先级 `high`、`dueDays: 3`）。 Sources: [src/components/SupervisionClosure.tsx:264-274]() [src/components/SupervisionClosure.tsx:1025-1035]()
5. 任务编辑弹窗（MODAL 4，`:1697-1794`）提交 → `handleSaveTaskForm`：有 `editingTask` 则就地更新，否则追加新任务（id 用时间戳 `t-manual-{ts}`）；标题为空则直接 return（无提示）。 Sources: [src/components/SupervisionClosure.tsx:288-316]()
6. 勾选/取消勾选任务 → `handleToggleTaskCompleted`（就地翻转 `completed`）；**这条链是左栏进度条的唯一数据源**（`completed/total`）。 Sources: [src/components/SupervisionClosure.tsx:324-329]() [src/components/SupervisionClosure.tsx:672-674]()
7. 学生侧提交的任务回复会以 `studentSubmission.taskReplies[]` 渲染在任务条目下方（「学生任务回复」）。 Sources: [src/components/SupervisionClosure.tsx:1099-1115]()

## 规则与边界（AI 开发硬约束）

- **所有写操作都经 `syncOrder`**：先 `setSelectedOrder(updated)` 再 `onUpdateWorkOrder(updated)`（App 层更新 `workOrders`，学生端工作台随之可见）。改任务数据结构要同时考虑两侧消费。 Sources: [src/components/SupervisionClosure.tsx:106-112]()
- **导师端能代替学生侧推进状态**（模拟按钮）：演示可用，接真实链路时这些按钮应移除或加权限门（否则导师可自己「替团队提交」）。
- 删除任务**无确认、不可撤销**，且会立即回写 App。
- 任务类别（`category`，如「商业模式/材料·PPT/财务与数据」）是**自由文本**，没有枚举约束；筛选/统计前需先规范。
- 状态与任务完成度**无约束关系**：可以任务全未完成却已 `team_submitted`，也可以全完成仍停在 `team_in_progress`。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 移除模拟按钮，改由学生端触发 | `:936-1022` | `page-workbench` 的工单区块需提供对应动作 |
| 删除任务加确认 | `:1083-1093` | 纯 UI |
| 任务类别枚举化 | `:288-316` | 需与 `page-workbench` 的待办分类口径对齐 |
| 推送团队时通知学生 | `:154-163` | 需跨端通知链路（当前仅 Toast） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-supervision-workbench-2-tasks-embed`** ← `nd-supervision-workbench`（工单深度工作区（状态时序 + 四 tab））｜`embed` · **implemented（已实现）**
  - 触发：切换到「辅导整改任务清单」tab（默认激活）
  - 逻辑：activeWorkspaceTab === 'tasks' 时在工作区下方渲染任务清单区。
  - 出处：`src/components/SupervisionClosure.tsx:68`
  - 出处：`src/components/SupervisionClosure.tsx:911`

**出边 1 条**

- **`e-supervision-tasks-2-workbench-writeback`** → `page-workbench`（项目工作台）｜`writeback` · **implemented（已实现）**
  - 触发：导师确认推送草稿 / 终审操作（或模拟团队接单·驳回·提交）；任务条目增删改与勾选
  - 载荷：`SupervisionWorkOrder（含 status、tasks[]、studentSubmission、versionDiff 等字段的整体对象）`
  - 逻辑：所有写操作经 syncOrder(updated)：setSelectedOrder + onUpdateWorkOrder → App.handleUpdateWorkOrder：setWorkOrders(prev => prev.map(...)) → page-workbench 的「专家辅导与督导工单」按项目过滤同一份 workOrders，因此学生侧立即可见新状态。
  - 出处：`src/components/SupervisionClosure.tsx:106-112`
  - 出处：`src/components/SupervisionClosure.tsx:154-163`
  - 出处：`src/App.tsx:516-518`
  - 出处：`src/App.tsx:732-738`
  - 备注：跨角色真实闭环（导师 → 学生）；与既有边 e-workbench-wo-2-supervision-writeback（学生 → 导师）构成双向。
<!-- EDGES:END -->
