---
id: nd-supervision-workbench
title: 工单深度工作区（状态时序 + 四 tab）
page: page-supervision
kind: bar
importance: high
sources:
  - src/components/SupervisionClosure.tsx:751-910
---

## 一句话定位

右栏工单详情的外壳：顶部交代「这是谁的工单、导师组有谁、走到哪一步了」（五段状态时序），下方四个 tab 切换处置视角——**全页的中控台**。

## 事实（每条强制可回溯）

1. 左栏选中哪条工单，这里就渲染哪条（`selectedOrder`），无选中时整块不渲染（`selectedOrder ? (...) : ...`）。 Sources: [src/components/SupervisionClosure.tsx:752]()
2. 头部信息：批次号「工单批次号: `{id}`」+ 学院 + 负责人 + 项目名（大标题）+ 右侧状态徽标 + 「辅导开会时间：`sessionDate`」。 Sources: [src/components/SupervisionClosure.tsx:757-777]()
3. 联合指导专家组横幅：渲染 `coMentors[]`（「姓名 `[角色标签]`」）+ 右侧「已授权跨领域共同评审」；无 `coMentors` 时整块消失。 Sources: [src/components/SupervisionClosure.tsx:780-798]()
4. **五段状态时序**是纯展示的进度条（不是可点步骤）：1. 会议音视频录入（有 `meetingRecord` 即绿）/ 2. AI建议草稿 / 3. 导师确认推送 / 4. 团队整改落实 / 5. 双版本提分终审；各段的着色由 `selectedOrder.status` 与相邻状态推断（当前段加 ring 高亮，已完成段变绿，未达段灰白）。 Sources: [src/components/SupervisionClosure.tsx:801-855]()
5. **时序与状态不是一一映射**：5 段时序对应 9 个状态，`team_rejected` / `need_rework` / `team_rejected` 等回退态在时序上会回落显示；`student_submitted` 与 `expert_checked` 是 `team_submitted` / `closed_completed` 的别名。 Sources: [src/components/SupervisionClosure.tsx:801-855]() [src/components/SupervisionClosure.tsx:414-440]()
6. tab 导航四项：**辅导整改任务清单 ({n})** / **改前改后版本比对 & AI提分验收**（工单处于 `team_submitted` 时带「新提交」红点徽标）/ **会议音视频与ASR纪要** / **项目原始材料与初始诊断**；状态为本地 state `activeWorkspaceTab`（初值 `tasks`）。 Sources: [src/components/SupervisionClosure.tsx:68]() [src/components/SupervisionClosure.tsx:857-907]()
7. 切工单**不重置 tab**：选中另一条工单后仍停留在原 tab（如从「提分验收」切到一条没有 diff 的工单，会看到空态文案）。 Sources: [src/components/SupervisionClosure.tsx:68]()

## 规则与边界（AI 开发硬约束）

- 本节点是**只读外壳**：所有写操作分布在四个 tab 内部（见各 tab 节点）；改 tab 结构不会影响业务逻辑。
- 状态时序的着色是**推断式**的（靠 status 判断），新增状态值时必须同步扩这里的条件，否则时序会停在中段（如 `need_rework` 无对应分支）。 Sources: [src/components/SupervisionClosure.tsx:801-855]()
- `activeWorkspaceTab` 与 `selectedOrder` 解耦（见事实 7）——做「按状态自动切 tab」需新增 effect。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增状态 + 时序分支 | `:801-855` | `WorkOrderStatus` 类型 + `getStatusBadge` + 左栏筛选档 |
| 按状态自动切 tab | `:68` | 需 effect 监听 `selectedOrder.status` |
| tab 加计数/徽标 | `:857-907` | 目前只有 diff tab 有徽标 |
| 时序改为可点跳转 | `:801-855` | 需定义每段对应的 tab |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-supervision-pipeline-2-workbench`** ← `nd-supervision-pipeline`（辅导工单管线列表）｜`navigate` · **implemented（已实现）**
  - 触发：点击工单管线中的任一工单卡
  - 逻辑：onClick={() => setSelectedOrder(order)} → 右栏工作区按该工单渲染（头部/时序/四 tab）。
  - 出处：`src/components/SupervisionClosure.tsx:676`
  - 出处：`src/components/SupervisionClosure.tsx:752-756`

**出边 3 条**

- **`e-supervision-workbench-2-tasks-embed`** → `nd-supervision-tasks`（辅导整改任务清单）｜`embed` · **implemented（已实现）**
  - 触发：切换到「辅导整改任务清单」tab（默认激活）
  - 逻辑：activeWorkspaceTab === 'tasks' 时在工作区下方渲染任务清单区。
  - 出处：`src/components/SupervisionClosure.tsx:68`
  - 出处：`src/components/SupervisionClosure.tsx:911`
- **`e-supervision-workbench-2-diff-embed`** → `nd-supervision-diff`（改前改后比对与 AI 提分验收）｜`embed` · **implemented（已实现）**
  - 触发：切换到「改前改后版本比对 & AI提分验收」tab
  - 逻辑：activeWorkspaceTab === 'diff_ai' 时渲染；工单处于 team_submitted 时 tab 上带「新提交」徽标。
  - 出处：`src/components/SupervisionClosure.tsx:879-893`
  - 出处：`src/components/SupervisionClosure.tsx:1117`
- **`e-supervision-workbench-2-sources-embed`** → `nd-supervision-sources`（会议纪要与项目材料）｜`embed` · **implemented（已实现）**
  - 触发：切换到「会议音视频与ASR纪要」或「项目原始材料与初始诊断」tab
  - 逻辑：activeWorkspaceTab === 'meeting' / 'materials' 时分别渲染两个只读面板。
  - 出处：`src/components/SupervisionClosure.tsx:894-907`
  - 出处：`src/components/SupervisionClosure.tsx:1313`
  - 出处：`src/components/SupervisionClosure.tsx:1409`
<!-- EDGES:END -->
