---
id: nd-supervision-pipeline
title: 辅导工单管线列表
page: page-supervision
kind: list
importance: high
sources:
  - src/components/SupervisionClosure.tsx:612-750
---

## 一句话定位

左栏的工单队列：搜索 + 五个状态页签把工单收窄，每条卡显示项目、批次标题、导师组、任务完成进度条与状态徽标——点一条即在右栏展开深度工作区。

## 事实（每条强制可回溯）

1. 标题「辅导工单列表 ({filteredOrders.length})」+ 右上「新辅导 +」→ 打开导入弹窗（与页头按钮同一入口）。 Sources: [src/components/SupervisionClosure.tsx:617-634]()
2. 搜索框在 **4 个字段**上做不区分大小写的子串匹配：`projectName` / `college` / `leader` / `mentorName`（placeholder 写「搜索项目、学院、团队成员...」，实际搜的是**导师名**而非团队成员）。 Sources: [src/components/SupervisionClosure.tsx:127-134]() [src/components/SupervisionClosure.tsx:636-646]()
3. 状态页签五档：全部 / AI草稿 / 修改中 / 待我验收 / 已归档；筛选逻辑**做了状态别名合并**——「待我验收」同时命中 `team_submitted` 与 `student_submitted`，「已归档」同时命中 `closed_completed` 与 `expert_checked`。 Sources: [src/components/SupervisionClosure.tsx:113-126]() [src/components/SupervisionClosure.tsx:648-660]()
4. 每条卡：项目名（截断）+ 状态徽标（`getStatusBadge`，含 7 种文案与配色）、批次标题（有则显示「📌 …」）、导师组名单（`coMentors` → 「姓名(角色标签)」）、任务进度（`completed/total` + 百分比条；结项时进度条转绿）、底行「负责人 + 开会日期」。 Sources: [src/components/SupervisionClosure.tsx:662-738]()
5. 状态徽标文案共 7 种（含两个别名）：`1. AI工单草稿 (待导师确认)` / `2. 待团队接单 (已推送)` / `团队已驳回工单` / `3. 团队整改中` / `4. 团队已提交 (待导师验收)` / `导师退回需重新修改` / `5. 已验收归档 (闭环)`。 Sources: [src/components/SupervisionClosure.tsx:414-440]()
6. 列表**有空态**（「暂无匹配的辅导工单」），最大高度 620px 内滚动。 Sources: [src/components/SupervisionClosure.tsx:663-667]()
7. 点击卡片 → `setSelectedOrder(order)`（本地选中，**不回写 App**）。 Sources: [src/components/SupervisionClosure.tsx:676]()
8. 左栏底部是「导师端规范流程指引」五步说明（指派入驻 → 导入音视频生成草稿 → 增删改条目并推送 → 团队提交后自动比对提分 → 终审归档或退回），是理解本页链路的**天然目录**。 Sources: [src/components/SupervisionClosure.tsx:736-750]()

## 规则与边界（AI 开发硬约束）

- 页面初值 `selectedOrder = workOrders[0]`——**列表首条即默认选中**，右栏不会空；若筛选后选中项不在结果里，右栏仍显示原选中项（筛选与选中**不联动**）。 Sources: [src/components/SupervisionClosure.tsx:65]()
- 状态机有 **9 个状态值**但页面只显式处理 7 种徽标、5 个筛选档；`team_rejected` / `need_rework` 两个「回退态」**没有对应页签**，只能在「全部」里看到。 Sources: [src/components/SupervisionClosure.tsx:113-126]() [src/components/SupervisionClosure.tsx:414-440]()
- 进度条是**任务条目完成率**，不代表整单进度；结项工单的进度条会变绿（唯一的状态化着色）。
- 搜索 placeholder 与实现不符（见事实 2），改文案或改实现要成对。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 增加「驳回/退回」页签 | `:648-660` | 筛选别名映射（`:113-126`） |
| 搜索支持团队成员 | `:127-134` | 需数据里有成员字段（当前 `SupervisionWorkOrder` 无成员列表） |
| 筛选与选中联动（自动选首条） | `:676` | 需在筛选变化时同步 `selectedOrder` |
| 工单卡显示更多维度（学院/得分） | `:662-735` | 字段已在 `SupervisionWorkOrder` 上 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-supervision-import-2-pipeline-writeback`** ← `nd-supervision-import`（导入会议录音生成工单草稿）｜`writeback` · **implemented（已实现）**
  - 触发：导入弹窗「开始转写并生成 AI 建议工单草稿」
  - 载荷：`SupervisionWorkOrder{status:'draft_ai_suggested', meetingRecord, diagnosticSummary, tasks[](3 条预制), coMentors[]}`
  - 逻辑：handleUploadAndGenerateOrder：固定 1800ms 后构造工单 → setSelectedOrder(newOrder)（右栏立即切到新工单）+ onAddNewWorkOrder(newOrder) → App.handleAddNewWorkOrder：setWorkOrders(prev => [newOrder, ...prev])（左栏顶部出现新工单卡）。
  - 出处：`src/components/SupervisionClosure.tsx:331-411`
  - 出处：`src/App.tsx:520-522`
  - 出处：`src/App.tsx:734-736`
  - 备注：工单内容（导师/时长/转写要点/诊断/任务）全部写死；上传区无真实文件输入。

**出边 2 条**

- **`e-supervision-pipeline-2-workbench`** → `nd-supervision-workbench`（工单深度工作区（状态时序 + 四 tab））｜`navigate` · **implemented（已实现）**
  - 触发：点击工单管线中的任一工单卡
  - 逻辑：onClick={() => setSelectedOrder(order)} → 右栏工作区按该工单渲染（头部/时序/四 tab）。
  - 出处：`src/components/SupervisionClosure.tsx:676`
  - 出处：`src/components/SupervisionClosure.tsx:752-756`
- **`e-supervision-pipeline-2-import`** → `nd-supervision-import`（导入会议录音生成工单草稿）｜`navigate` · **implemented（已实现）**
  - 触发：点击列表标题旁「新辅导 +」
  - 逻辑：setIsUploadModalOpen(true)（与页头按钮同一入口）。
  - 出处：`src/components/SupervisionClosure.tsx:627-634`
<!-- EDGES:END -->
