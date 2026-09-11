---
id: page-mentorship
title: 常态化辅导与调度（mentorship）
section: sec-admin
importance: medium
sources:
  - src/components/MentorshipDispatch.tsx
  - src/data/mockMentors.ts
  - src/types.ts
related_pages: [page-supervision, page-pools-kb, page-cockpit]
---

# 常态化辅导与调度（mentorship）

## 一句话定位

管理端的导师调度台：左侧是「AI 短板定向匹配器 + Top 3 推荐 + 全量导师库」，右侧是「批次梯队任务下发中心」——**匹配算法是前端规则加权（80 基线 + 10/8/7 三项加分），不是模型打分**。

## 事实（每条强制可回溯）

### 一、入口与数据

1. Props 共 6 项：`mentors` / `projects` / `cohortTasks` / `onSelectProject` / `onAddNewCohortTask` / `onNavigateToMentorPool`。`Sources: [src/components/MentorshipDispatch.tsx:17-33]()`
2. 当前项目取 `projects.find(p => p.id === selectedProjectId) || projects[0]`。`Sources: [src/components/MentorshipDispatch.tsx:46-46]()`
3. 导师数据源 `MOCK_MENTORS`；批次任务数据源 `MOCK_COHORT_TASKS`，两者都定义在 `mockMentors.ts` 并以 `mockMentors` / `mockCohortTasks` 别名导出。`Sources: [src/data/mockMentors.ts:3-3]()` `Sources: [src/data/mockMentors.ts:363-363]()` `Sources: [src/data/mockMentors.ts:443-446]()`

### 二、短板匹配算法（本页核心逻辑）

4. 算法是 `mentors.map(...).sort(...)` 的纯前端加权：**基线分 80**，然后按三条规则加分。`Sources: [src/components/MentorshipDispatch.tsx:48-77]()`
5. 三条加分规则及理由文案：

| 条件 | 加分 | 理由文案 |
|---|---|---|
| 导师 `preferredTracks` 含当前项目 `track` | **+10** | 深耕【{trackLabel}】赛道评审 |
| 项目 `weaknessLabels` 含「财务」或「商业」，且导师 `expertiseTags` 含「财务/商业/投资」 | **+8** | 精准匹配项目薄弱点：【商业模式与财务测算】 |
| 项目 `groupLabel` 含「新工科」或「新医科」，且导师 `expertiseTags` 含「硬科技/新工科/新医科」 | **+7** | 具备深厚学术研发与产业转化双重视角 |

`Sources: [src/components/MentorshipDispatch.tsx:53-70]()`

6. 最终分数上限被 clamp 到 **99**（`Math.min(matchScore, 99)`），因此实际区间是 **[80, 99]**。`Sources: [src/components/MentorshipDispatch.tsx:72-76]()`
7. 若无任何规则命中，理由回落到固定文案「常态化备赛综合指导专家」。`Sources: [src/components/MentorshipDispatch.tsx:75-75]()`
8. **Top 3 推荐**的文案与取数：`recommendedMentors.slice(0, 3)`，标题为「AI 算法推荐 Top 3 指导专家（按短板匹配度排序）」。`Sources: [src/components/MentorshipDispatch.tsx:223-227]()`
9. 全量导师库有独立的筛选逻辑（按 `expertiseTags` 标签筛选 + 名称/机构/标签的文本搜索），与匹配算法无关。`Sources: [src/components/MentorshipDispatch.tsx:79-86]()`
10. 预约导师 `handleBookMentor` 只弹一条 4 秒 toast（「已成功为【…】预约【…】老师：…。AI 辅导工单已同步创建！」），**不改任何状态、不真创建工单**。`Sources: [src/components/MentorshipDispatch.tsx:88-91]()`

### 三、页面结构

11. 页头横幅与主操作在 130-162。`Sources: [src/components/MentorshipDispatch.tsx:130-162]()`
12. 主体是左右两列：左 2 列（智能匹配 + 导师库），右 1 列（批次任务中心）。`Sources: [src/components/MentorshipDispatch.tsx:163-164]()` `Sources: [src/components/MentorshipDispatch.tsx:357-358]()`
13. 左列区块顺序：AI 短板匹配器（167）→ 项目下拉选择器（180）→ 当前项目薄弱点画像卡（196）→ Top 3 推荐（219-264）→ 预约时段（265-281）→ 全量导师库（282）→ 标签栏（304）→ 导师卡片栅格（322-356）。`Sources: [src/components/MentorshipDispatch.tsx:167-356]()`
14. 右列批次中心含「活跃批次任务」列表，进度用 `submittedCount / totalTargetProjects` 计算提交率。`Sources: [src/components/MentorshipDispatch.tsx:359-407]()`
15. 新建批次任务弹窗在 408-490，提交处理器 `handleCreateCohortTask`。`Sources: [src/components/MentorshipDispatch.tsx:93-117]()` `Sources: [src/components/MentorshipDispatch.tsx:408-490]()`
16. 新建任务时 `id` 用 `batch-task-${Date.now()}` 生成，`targetTracks` 被**固定为 `'ALL'`**（弹窗里没有赛道选择控件），描述为空时回落到固定文案。`Sources: [src/components/MentorshipDispatch.tsx:97-104]()`
17. 任务创建后回调 `onAddNewCohortTask`，由 `App` 前插到 `cohortTasks` 数组头部（**状态提升到 App 级**）。`Sources: [src/App.tsx:447-449]()`

### 四、数据结构

18. `MentorExpert` 字段较多，关键项：`type`（internal/external）、`roleCategory`（6 类：academic/industry/national_judge/investor/legal_finance/alumni）、`expertiseTags`、`preferredTracks`、`currentProjectsCount` / `maxCapacity`（用于算负荷率）、`goldProjectsCoached`、`availability`（available/busy/full）、`availableTimeSlots`。`Sources: [src/types.ts:142-166]()`
19. `CohortBatchTask` 字段：`targetGrade`（TierGrade | 'ALL'）、`targetTracks`（TrackType[] | 'ALL'`）、`deadline`、`totalTargetProjects` / `submittedCount` / `reviewedCount`、`status`（active/completed）。`Sources: [src/types.ts:215-227]()`
20. `availability` 三态在 UI 上映射为「空闲可约 / 档期较紧 / 负荷已满」。`Sources: [src/components/MentorPoolManagement.tsx:287-287]()`

## 规则与边界（AI 开发硬约束）

- **匹配分不是模型输出，不要把它描述为"AI 打分"**：它是 80 基线 + 最多 25 分的规则加权。任何导师至少显示 80 分，因此"80 分"实际含义是"无任何匹配理由"，极易被误读为高分。
- **三条加分规则的判断字段是硬依赖**：改 `ProjectItem.weaknessLabels` 或 `groupLabel` 的取值语义会**静默**让匹配失效（不报错，只是永远不加那 8/7 分）。改项目字段前先回看 58-70 行。
- **`slice(0, 3)` 写死三席**：Top 3 是一个产品约束而非可配置项。要改成"Top N"需同时改文案（223）与取数（227）。
- **预约动作是纯展示**：`handleBookMentor` 不改状态。若要真正建工单，需接入 `App.handleUpdateWorkOrder`（`App.tsx:451-453`）或新增 create 回调。
- **新建批次任务的 `targetTracks` 恒为 `'ALL'`**：类型允许数组，但 UI 没给入口。加赛道选择时要同时改 100-101 行与弹窗表单。
- **`handleCreateCohortTask` 的参数类型是非标准的**：`(e: { preventDefault: () => void })` 而不是 `React.FormEvent`。改成标准类型时注意调用点。
- **不要在本页改导师数据**：本页只读 `mentors`；真正的增删改在 `MentorPoolManagement`（见 page-pools-kb）。本页的 `onNavigateToMentorPool` 就是跳过去改。
- 批次任务的 `submittedCount` / `reviewedCount` 是 **mock 静态值**，不会随学生提交而变（学生提交只改工单状态，不改批次统计）。做真实联动前不要假设两者同步。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 改匹配算法权重/规则 | `MentorshipDispatch.tsx:48-77` |
| 改 Top N 推荐 | `MentorshipDispatch.tsx:223`（文案）+ `227`（slice） |
| 改导师库筛选 | `MentorshipDispatch.tsx:79-86` + 标签栏 `304-321` |
| 改预约动作 | `MentorshipDispatch.tsx:88-91` |
| 加/改批次任务弹窗字段 | `MentorshipDispatch.tsx:408-490` + 提交处理器 `93-117` |
| 改批次列表与进度 | `MentorshipDispatch.tsx:359-407` |
| 改导师数据 | 见 page-pools-kb（`MentorPoolManagement` / `mockMentors.ts`） |
| 改导师类型字段 | `types.ts:142-166`（注意：会同时影响导师库页与驾驶舱） |

## 与 related_pages 的联动提示

- → **page-supervision**：本页"预约导师"的承诺是"AI 辅导工单已同步创建"，但实际未创建；真正产生工单的是督导页的 `handleSimulateAudioImport`。这两页的语义裂缝需要一起处理。
- → **page-pools-kb**：导师数据与编辑入口在导师库页（本页只读 + 跳转）。`onNavigateToMentorPool` 在 `App` 里实现为 `setActiveTab('mentors_pool')`（`App.tsx:631`）。
- → **page-cockpit**：驾驶舱有一处 `onNavigateTab('mentorship')`（预警区），是本页的另一个入口来源。
- 数据共线：`mentors` 与 `cohortTasks` 都由 `App` 持有（`App.tsx:65-67`），本页与导师库页共享同一份 `mentors` 引用 —— 在导师库页删除导师会立即反映到本页推荐结果。
