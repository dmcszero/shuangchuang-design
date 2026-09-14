---
id: page-mentorship
title: 导师智能调度
section: sec-mentorship
importance: high
view: mentorship
component: src/components/MentorshipDispatch.tsx
sources:
  - src/components/MentorshipDispatch.tsx:1-483
related_pages: ["page-mentors-pool", "page-supervision", "page-screening", "page-cockpit"]
nodes:
  - nd-mentorship-banner
  - nd-mentorship-match
  - nd-mentorship-directory
  - nd-mentorship-tasks
  - nd-mentorship-taskmodal
---

## 一句话定位

学校管理端的「派单台」：选项目 → 让 AI 按短板推荐 Top 3 导师 → 预约排期，同时向整个梯队群发阶段打磨任务并监督提交进度；服务 `school_admin` 与（只读侧）`mentor` 两端，是 `sec-mentorship` 任务链的起点。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'mentorship'` 时挂载，接收六个 props：`mentors` / `projects` / `cohortTasks` / `onSelectProject` / `onAddNewCohortTask` / `onNavigateToMentorPool?`。 Sources: [src/App.tsx:704-717]() [src/components/MentorshipDispatch.tsx:8-32]()
2. 本页**不在沉浸式白名单**内，外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `mentorship-dispatch-view`。 Sources: [src/components/MentorshipDispatch.tsx:118]()

**二、页面级结构**

4. 布局：页头 → 三栏网格（左 2 栏＝智能匹配 + 导师名册；右 1 栏＝任务中心）→ 任务创建弹窗。 Sources: [src/components/MentorshipDispatch.tsx:130]() [src/components/MentorshipDispatch.tsx:163]() [src/components/MentorshipDispatch.tsx:408]()
5. 页面 state 共 9 个：选中项目、导师标签筛选、导师搜索、弹窗开关、Toast、以及表单四项。 Sources: [src/components/MentorshipDispatch.tsx:34-44]()
6. **本页是全库少数含真实算法的页面**：`recommendedMentors` 按三条规则给导师加分排序（起始 80，最多 +25，上限 99），规则见 `nd-mentorship-match` 事实 4。 Sources: [src/components/MentorshipDispatch.tsx:49-77]()
7. 本页唯一的写操作是 `onAddNewCohortTask`（新增批次任务，真实写入 App 的 `cohortTasks`）；「一键预约排期」**只弹 Toast**，不创建工单。 Sources: [src/components/MentorshipDispatch.tsx:88-91]() [src/components/MentorshipDispatch.tsx:111-114]()

**三、数据口径**

8. 导师数据 `MentorExpert` 的匹配相关字段：`preferredTracks` / `expertiseTags` / `rating` / `type` / `organization` / `bio` / `availableTimeSlots` / `currentProjectsCount` / `maxCapacity` / `availability` / `goldProjectsCoached`。 Sources: [src/components/MentorshipDispatch.tsx:49-77]() [src/components/MentorshipDispatch.tsx:222-352]()
9. 任务数据 `CohortBatchTask` 的字段：`title` / `targetGrade` / `targetTracks` / `deadline` / `description` / `totalTargetProjects` / `submittedCount` / `reviewedCount` / `status` / `createdAt`；其中 **`targetTracks` 与 `createdAt` 创建时写死**，`totalTargetProjects` 用 15/28/82 写死映射。 Sources: [src/components/MentorshipDispatch.tsx:93-108]()
10. 演示数字族（82 / 15 / 28）在本页出现在**三处**：任务弹窗的下拉文案（15/28/82）、`totalTargetProjects` 映射（15/28/82）；与 `page-cockpit` 的横幅与 KPI 卡同源（见 issue `issue-cockpit-static-metrics` 与 `issue-mentorship-mock-fanout`）。

## 规则与边界（AI 开发硬约束）

- **「预约」与「下发任务」是两个不同层级的动作**：预约面向单个项目 + 单个导师（当前是 Toast 模拟），下发面向整个梯队（真实写入）。做「派单闭环」时要分清这两条链。
- 匹配算法的输入是**标签子串匹配**（`includes`），因此改 `weaknessLabels` / `expertiseTags` 的文案会静默改变推荐结果与排序。
- 本页与 `page-mentors-pool` 的分工：本页**用**导师（挑选/预约），导师池页**管**导师（录入/标签维护）；本页只读 `mentors`，不写回。维护入口在页头按钮（可选 prop）。
- 任务创建后不可编辑/终止，进度只读——「下发与监督」目前只做到了「下发」。
- 无任何空态处理（导师筛选空、任务空都只是空白）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 预约真实建工单 | `:88-91` | 需新增 `onAddNewWorkOrder` prop（App 已有 handler） |
| 下发任务按项目定向 | `:93-114` | `CohortBatchTask` 需扩字段（当前只到梯队级） |
| 匹配算法规则外置 | `:49-77` | 建议抽配置（与 `weaknessLabels` 口径绑定） |
| 任务进度接真实提交 | `:371-402` | 需 `submittedCount` 由学生侧提交驱动 |
| 导师名册支持预约 | `:322-352` | 复用 `handleBookMentor`（需补时段选择） |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-mentorship-banner` | 页头与调度动作 | bar | 130-162 | → `page-mentors-pool`（管理导师智库）、→ `nd-mentorship-taskmodal` |
| `nd-mentorship-match` | 智能短板定向匹配与预约 | panel | 167-280 | 无外部出口（预约仅 Toast） |
| `nd-mentorship-directory` | 导师智库全览与筛选 | list | 282-356 | 无（只读名册） |
| `nd-mentorship-tasks` | 常态化培育任务中心 | list | 357-405 | ← `nd-mentorship-taskmodal`（新增后写入） |
| `nd-mentorship-taskmodal` | 新建批次打磨任务弹窗 | modal | 408-483 | → `shell-app`（新增批次任务，writeback） |

> 未下钻为节点的页面级结构：三栏网格容器（163）、Toast 区（119-128）、推荐算法与筛选派生（46-86）。
>
> **拆分依据**：五块各有独立状态域与出口——页头管导航与开启弹窗；匹配卡有自己的选中项目与预约动作；名册有自己的筛选态；任务中心是只读监督面；弹窗是独立表单与写出口。名册与匹配卡虽然同处左栏且都展示导师，但**一个按项目推荐、一个按标签检索**，业务归宿不同，故拆开。

## 与 related_pages 的联动提示

- **← `page-cockpit`（数据驾驶舱）**：金奖池底部「为 A 级项目批量调度国家级导师」跳到本页，**不带筛选**；本页项目下拉是独立的（初值取 `projects[0]`，即 proj-001）。
- **← `page-screening`（智能初筛中心）**：排名视图的「排期」按钮跳本页，同样**不带项目载荷**（App 的 `handleOpenAssignMentor` 忽略入参）——这是本页最需要补的上下文缺口。
- **→ `page-mentors-pool`（导师池管理）**：页头「管理导师智库档案」的落点（维护导师数据的唯一入口）。
- **→ `page-supervision`（督导闭环中心）**：同属 `sec-mentorship`，是任务/工单的另一端（导师侧复核）；本页创建的是**批次任务**，督导页处理的是**工单**，两者数据结构不同（`CohortBatchTask` vs `SupervisionWorkOrder`），当前无互转链路。
- **→ `page-workbench`（项目工作台）**：学生侧「专家辅导与督导工单」区块消费的是 `workOrders`，本页既不创建也不消费它——「预约导师」到「学生看到工单」目前是断的。
