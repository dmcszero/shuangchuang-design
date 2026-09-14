---
id: page-supervision
title: 督导闭环中心
section: sec-mentorship
importance: high
view: supervision
component: src/components/SupervisionClosure.tsx
sources:
  - src/components/SupervisionClosure.tsx:1-1896
related_pages: ["page-mentorship", "page-workbench", "page-screening"]
nodes:
  - nd-supervision-header
  - nd-supervision-invitations
  - nd-supervision-metrics
  - nd-supervision-pipeline
  - nd-supervision-workbench
  - nd-supervision-tasks
  - nd-supervision-diff
  - nd-supervision-sources
  - nd-supervision-import
---

## 一句话定位

导师端的**默认落地页**（`p-mentor.defaultPage`）与全库最完整的跨角色闭环：接受学校指派 → 导入辅导会议生成 AI 工单草稿 → 确认推送团队 → 团队整改并提交 → 双版本比对与 AI 提分 → 导师终审归档或退回；**且这条链的数据真的与 `page-workbench`（学生端）共享同一份 `workOrders`**。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'supervision'` 时挂载，接收五个 props：`workOrders` / `projects` / `onSelectProject` / `onUpdateWorkOrder?` / `onAddNewWorkOrder?`。 Sources: [src/App.tsx:719-726]() [src/components/SupervisionClosure.tsx:41-55]()
2. 本页**不在沉浸式白名单**内：外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `mentor-portal-supervision-workbench`。 Sources: [src/components/SupervisionClosure.tsx:441]()

**二、页面级 state 全景（18 个，下钻节点时不重复登记）**

4. 数据态：`invitations`（初值 mock）、`selectedOrder`（初值 `workOrders[0]`）、`feedbackToast`。 Sources: [src/components/SupervisionClosure.tsx:57-65]() [src/components/SupervisionClosure.tsx:87]()
5. 筛选态：`selectedStatus` / `searchKeyword`；工作区态：`activeWorkspaceTab`（4 tab）。 Sources: [src/components/SupervisionClosure.tsx:63-68]()
6. 任务编辑态：`isTaskModalOpen` / `editingTask` / `taskForm{title,category,description,priority,dueDays}`。 Sources: [src/components/SupervisionClosure.tsx:71-81]()
7. 导入态：`isUploadModalOpen` / `uploadMediaType` / `uploadProjectTarget` / `uploadMeetingTitle` / `isAiProcessing`。 Sources: [src/components/SupervisionClosure.tsx:82-86]()
8. 终审态：`isReworkModalOpen` / `reworkComment` / `isFinalApproveModalOpen` / `finalRemark` / `finalScoreDelta`；邀请态：`showDeclineModal` / `declineReason` / `showInvitationDetailModal`。 Sources: [src/components/SupervisionClosure.tsx:90-96]() [src/components/SupervisionClosure.tsx:58-60]()

**三、数据契约与跨页闭环**

9. 所有写操作经 `syncOrder(updated)`：先设本地 `selectedOrder`，再调 `onUpdateWorkOrder` → App 的 `setWorkOrders`。**因此学生端 `page-workbench` 的「专家辅导与督导工单」会立刻看到同一条工单的新状态**——这是全库少数真正双向的数据流。 Sources: [src/components/SupervisionClosure.tsx:106-112]() [src/App.tsx:516-518]() [src/App.tsx:732-738]()
10. 工单状态机共 **9 个值**：`draft_ai_suggested` / `pending_team_accept` / `team_rejected` / `team_in_progress` / `team_submitted` / `student_submitted`（别名）/ `expert_checked`（别名）/ `need_rework` / `closed_completed`；页面用 7 种徽标文案与 5 个筛选档呈现。 Sources: [src/components/SupervisionClosure.tsx:113-126]() [src/components/SupervisionClosure.tsx:414-440]()
11. 创建入口唯一（导入会议，`onAddNewWorkOrder`）；**接受指派邀请不会创建工单**（只改本地邀请状态）。 Sources: [src/components/SupervisionClosure.tsx:404-411]() [src/components/SupervisionClosure.tsx:134-138]()

**四、演示与写死的边界**

12. 「学生侧动作」在导师端有**三个模拟按钮**（模拟接单 / 驳回 / 提交），其中「提交」会一次性写入 `studentSubmission` 与 `versionDiff`（含 AI 提分四维度数据）——真实应由学生端触发。 Sources: [src/components/SupervisionClosure.tsx:936-1022]()
13. 写死数据集中在三处：页头导师身份（陈建国）、指标横幅的「AI 复核提分均值 +7.0 分」、导入生成的工单内容（导师/时长/转写要点/三维度诊断/三条任务）。 Sources: [src/components/SupervisionClosure.tsx:444-450]() [src/components/SupervisionClosure.tsx:604]() [src/components/SupervisionClosure.tsx:338-405]()
14. 详情区（会议纪要、原始材料）为纯展示，无播放/下载/批注。 Sources: [src/components/SupervisionClosure.tsx:1313-1475]()

## 规则与边界（AI 开发硬约束）

- **本页的「闭环」是状态机的闭环，不是数据的闭环**：状态、任务清单、评审字段都落回 `workOrders`（真闭环）；而邀请响应、AI 转写、文档比对、提分测算都是本地模拟（不落库、无服务）。
- **状态推进有两条路**：导师侧（草稿确认、推送、终审、退回）与学生侧（接单、驳回、提交）。学生侧当前只能由导师端模拟按钮代劳——接真实链路时的第一件事是把这三个按钮换成学生端触发。 Sources: [src/components/SupervisionClosure.tsx:936-1022]()
- 导师身份写死在页头（不读 `session`），因此本页**无法区分不同导师**；多导师场景（`coMentors`）只在数据结构里存在，权限层面未实现。
- 本页与 `page-mentorship` 的任务体系**不同源**：那边下发 `CohortBatchTask`（批次磨任务），这边处理 `SupervisionWorkOrder`（项目工单）；两者的「任务」概念不通用。
- 三个「模拟」按钮、导入弹窗的「2GB/转写」文案、以及 Toast 里的「已同步推送至学校」都是**演示包装**，任何对外说明都要先剔除。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 学生侧动作接真实链路 | `:936-1022` | `page-workbench` 工单区块需提供接单/驳回/提交动作（其现有 `onUpdateWorkOrder` 已可回写） |
| 导师身份接登录态 | `:444-450` | 需新增 `session` prop |
| ASR 与文档比对接真实服务 | `:188-231` `:331-411` | 两处 handler 替换；数据结构可保留 |
| 邀请响应回传学校端 | `:134-152` | 需新增上行 props + App 状态 |
| 提分均值接真实统计 | `:604` | 见 issue `issue-supervision-static-metrics` |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-supervision-header` | 页头与会议导入入口 | bar | 442-488 | → `nd-supervision-import`（开弹窗） |
| `nd-supervision-invitations` | 学校指派与导师邀请闭环 | panel | 489-578 | 无上行（仅本地状态 + Toast） |
| `nd-supervision-metrics` | 督导指标横幅 | panel | 579-609 | 无（纯展示） |
| `nd-supervision-pipeline` | 辅导工单管线列表 | list | 612-750 | → `nd-supervision-workbench`（选中工单）、→ `nd-supervision-import` |
| `nd-supervision-workbench` | 工单深度工作区（状态时序 + 四 tab） | bar | 751-910 | → 四个 tab 节点（embed） |
| `nd-supervision-tasks` | 辅导整改任务清单 | panel | 911-1116 | → `shell-app`（工单状态与任务写回，writeback） |
| `nd-supervision-diff` | 改前改后比对与 AI 提分验收 | panel | 1117-1312 | → `shell-app`（终审归档 / 退回，writeback） |
| `nd-supervision-sources` | 会议纪要与项目材料 | panel | 1313-1475 | 无（只读） |
| `nd-supervision-import` | 导入会议录音生成工单草稿 | modal | 1476-1541 | → `shell-app`（新建工单，writeback） |

> 未下钻为节点的页面级结构：Toast 区（472-488）、主 2 栏网格（610）、左栏流程指引（736-750）、**其余五个弹窗**（MODAL 2 婉拒 1583-1624、MODAL 3 邀请详情 1625-1696、MODAL 4 任务编辑 1697-1794、MODAL 5 终审归档 1795-1851、MODAL 6 退回修改 1852-1896——它们分别依附于邀请节点、任务清单节点与 diff 节点，不单独建节点）。
>
> **拆分依据**：九个节点各有独立状态域与出口。其中「工作区外壳」与四个 tab 拆开是因为：外壳管工单身份与流转可视化（18 个 state 中只用 `activeWorkspaceTab`），每个 tab 有各自的载荷与写出口（任务清单可写回工单、提分验收可终结工单、另两个只读）。**粒度自检**：9 个节点落在 6~12 的经验区间内。

## 与 related_pages 的联动提示

- **↔ `page-workbench`（项目工作台）**：**真双向**——学生在工作台勾选任务完成/提交整改成果会 `onUpdateWorkOrder` 写入同一份 `workOrders`，导师在本页可见（`student_submitted`）；反之导师推送/退回，学生侧同样可见。这是全库唯一「跨角色真实闭环」的数据链（`page-workbench` 的 `nd-workbench-wo` 出边已登记）。
- **→ `page-mentorship`（导师智能调度）**：管理端派单与本页接单是同一业务的两端，但**任务模型不同**（`CohortBatchTask` vs `SupervisionWorkOrder`），且调度页的「一键预约」不创建工单——「派单 → 接单」尚未打通。
- **→ `page-screening`（智能初筛中心）**：排名视图的「排期」跳调度页（不是本页）；本页的工单可追溯到项目，但**没有从本页跳回项目初筛的入口**。
- **→ `shell-project-drawer`（项目详情抽屉）**：本页虽接收 `onSelectProject`，但**全页没有任何调用点**（导师查看项目详情的路径缺失）。
