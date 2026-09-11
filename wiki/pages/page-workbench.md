---
id: page-workbench
title: 项目工作台（my_project）
section: sec-student
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx
  - src/components/workbench/workbenchMockData.ts
  - src/data/mockUsersAndTeams.ts
  - src/data/mockMentors.ts
  - src/types.ts
related_pages: [page-guidance, page-supervision, page-cross-link]
---

# 项目工作台（my_project）

## 一句话定位

学生端首页（`my_project`），一个五子 tab 的聚合工作台：**动态待办（AI 诊断 + 专家工单双来源统一池）/ 专家辅导与督导工单 / AI 对标体检与短板 / 团队架构与合规审查 / 项目文件夹**——它是"任务入口"而非"任务执行地"，点「去执行」才会携载荷跳到全链路指导工作台。

## 事实（每条强制可回溯）

### 一、结构与入口

1. Props 共 6 项：`session` / `project` / `workOrders` / `onUpdateWorkOrder` / `onOpenRulesConfig` / `onExecuteTodo`。`Sources: [src/components/ProjectMemberWorkbench.tsx:45-62]()`
2. 子视图枚举为 `'todos' | 'tasks' | 'diagnostic' | 'team' | 'folder'`，默认 `todos`。`Sources: [src/components/ProjectMemberWorkbench.tsx:67-67]()`
3. 五个 tab 的可见文案（含动态计数）：**动态待办**（未完成数实时计算）/ **专家辅导与督导工单**（工单数）/ **2026国赛AI对标体检与短板** / **团队架构与合规审查** / **项目文件夹（大事记=文件更改记录）**。`Sources: [src/components/ProjectMemberWorkbench.tsx:213-272]()`
4. 工单数据从 `workOrders` 按 `projectId` 过滤得到 `projectOrders`；团队数据取 `MOCK_PROJECT_TEAMS` 中匹配项目的一条，否则回落 `[0]`。`Sources: [src/components/ProjectMemberWorkbench.tsx:64-65]()`
5. 每个 tab 的渲染都是 IIFE 或条件块，行号：todos 274 / tasks 438 / diagnostic 694 / team 774 / folder 850。`Sources: [src/components/ProjectMemberWorkbench.tsx:274-274]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:438-438]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:694-694]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:774-774]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:850-850]()`

### 二、动态待办（双源统一池）

6. 双源分别是：AI 诊断来源（本地状态 `aiTodos`，初始 `WORKBENCH_AI_TODOS`）与专家工单来源（复用 `workOrders` 里的 `tasks`）。`Sources: [src/components/ProjectMemberWorkbench.tsx:70-71]()`
7. 来源筛选器三态：`'all' | 'ai' | 'wo'`。`Sources: [src/components/ProjectMemberWorkbench.tsx:72-72]()`
8. 进度条按「已完成 / 总数」计算，总数 = AI 待办数 + 全部工单任务数，且分母做了 `|| 1` 防零。`Sources: [src/components/ProjectMemberWorkbench.tsx:275-280]()`
9. AI 待办条目自带 `stage` / `priority` / `chapterRef` 等字段（继承 `GuidanceTodoItem`），完成态可切换。`Sources: [src/components/workbench/workbenchMockData.ts:9-14]()`
10. **「去执行」是本页最重要的一条联动**：AI 来源走 `executeAiTodo`，载荷 `{taskId, title, source:'ai', sourceLabel:'AI 诊断生成', chapterId}`；工单来源走 `executeWorkOrderTask`，载荷 `{taskId: \`${orderId}:${taskId}\`, source:'workorder', sourceLabel:'专家工单 · <工单标签>', chapterId: undefined}`。`Sources: [src/components/ProjectMemberWorkbench.tsx:86-104]()`
11. `chapterId` 由 `chapterRef` 正则提取（`/第(\d+)章/` → 章号字符串），因此 `chapterRef` 必须写成「第N章 …」格式才能被定位。`Sources: [src/components/ProjectMemberWorkbench.tsx:78-83]()`
12. 载荷类型 `GuidanceTaskContext` 定义在 guidance 域的 `guidanceTypes.ts`，本组件从该文件 import —— 即**项目工作台反向依赖 guidance 域的类型**。`Sources: [src/components/ProjectMemberWorkbench.tsx:45-53]()` `Sources: [src/components/guidance/guidanceTypes.ts:187-194]()`

### 三、工单 tab（三态与交付提交）

13. 左列是工单选择器与概览，右列是详情 + 任务勾选 + 提交区，另有专家复核结果区。`Sources: [src/components/ProjectMemberWorkbench.tsx:440-448]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:500-518]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:578-578]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:666-666]()`
14. 工单状态取自 `SupervisionWorkOrder.status`，四态：`pending_student | student_submitted | expert_checked | overdue`。`Sources: [src/types.ts:199-199]()`
15. 任务勾选 `handleToggleTaskDone` 在本地重建 `updatedOrder` 并回调 `onUpdateWorkOrder`（**状态提升到 App 级**，见 page-cross-link）。`Sources: [src/components/ProjectMemberWorkbench.tsx:142-153]()`
16. 提交交付物前强制校验「修改重点说明」非空，否则 alert 拦截；通过后进入 2 秒模拟提交，写入 `status: 'student_submitted'` 与 `studentSubmission`（含日期、说明、新 BP/PPT 版本号）。`Sources: [src/components/ProjectMemberWorkbench.tsx:113-141]()`
17. 提交表单的版本默认值硬编码为 `v3.3_2026_Final.pdf` 与 `v4.1_Roadshow_Defense.pptx`。`Sources: [src/components/ProjectMemberWorkbench.tsx:106-110]()`
18. `studentSubmission` 的字段集合：提交日期 / 修改说明 / 新 BP 版本 / 新 PPT 版本 / 是否更新 VCR。`Sources: [src/types.ts:200-206]()`
19. 专家复核结果 `expertCheck` 含通过与否、终评语、**提分 delta**（`scoreChangeDelta`）。`Sources: [src/types.ts:207-212]()`

### 四、诊断与团队 tab

20. 诊断 tab 展示六维得分进度条（`score/maxScore` 百分比）、逻辑断层清单与"杀手题"。`Sources: [src/components/ProjectMemberWorkbench.tsx:694-772]()`
21. 逻辑断层的数据类型 `LogicGapItem` 分四类：`logic_broken | data_conflict | tech_stack | business_vague`。`Sources: [src/types.ts:91-97]()`
22. 团队 tab 展示团队结构与合规审查，数据来自 `MOCK_PROJECT_TEAMS`。`Sources: [src/components/ProjectMemberWorkbench.tsx:773-848]()` `Sources: [src/data/mockUsersAndTeams.ts:202-202]()`
23. `ProjectTeam` 带三项合规布尔：`crossCollege`（跨学院）/ `hasFinanceSpecialist`（商业专人）/ `ipOwnerEnrolled`（发明人入队），以及审核态 `verified | need_supplement | warning`。`Sources: [src/data/mockUsersAndTeams.ts:33-62]()`
24. 团队成员 `TeamMemberItem` 的分工是一套五枚举：技术研发/核心算法、市场拓展/商业模式、财务测算/融资对接、知识产权/法律合规、路演答辩/视觉呈现。`Sources: [src/data/mockUsersAndTeams.ts:19-31]()`

### 五、项目文件夹（三来源 + 版本线 + 大事记）

25. 文件来源标签是三枚举 `'system' | 'upload' | 'ai'`（三件套/系统、上传、会话生成），映射表 `FILE_SOURCE` 共 9 个文件条目（3 system / 3 upload / 3 ai）。`Sources: [src/components/workbench/workbenchMockData.ts:111-124]()`
26. 会话生成的产物单独一个数组 `AI_GENERATED_FILES`（与三件套、上传件并列）。`Sources: [src/components/workbench/workbenchMockData.ts:71-72]()`
27. **待归档区**（`PENDING_ARCHIVE_ITEMS`）：来自会话、尚未入库的产物，字段为 `name / fromSession / time / size`。`Sources: [src/components/workbench/workbenchMockData.ts:126-150]()`
28. **大事记 = 文件更改记录**，不是业务事件日志：`FileChangeEntry` 的口径是「谁·何时·动作·来自哪·形成哪版」，`kind` 四枚举为 `edit | milestone | upload | archive`。`Sources: [src/components/workbench/workbenchMockData.ts:152-163]()`
29. `fromRef` 记录了来源方（如「全链路指导工作台」「会话『…』」「专家工单」「全链路指导工作台·版本抽屉」），`versionRef` 记录形成的版本号 —— 这是跨模块溯源的关键字段。`Sources: [src/components/workbench/workbenchMockData.ts:165-206]()`
30. 项目文件夹的版本线是**只读镜像**（与工作台快照体系同源），是"呈现"而非"操作入口"。`Sources: [src/components/ProjectMemberWorkbench.tsx:926-954]()`

## 规则与边界（AI 开发硬约束）

- **「去执行」是无条件跳转本页职责之外**：本页只负责构造 `GuidanceTaskContext` 并回调，不做跳转实现（跳转在 `App.tsx:462-465`）。不要在本组件内直接 `setActiveTab`。
- **`chapterRef` 格式是隐式契约**：必须含「第N章」，否则 `chapterIdFromRef` 返回 `undefined`，跳过去后工作台无法定位章节。新增待办数据时务必遵守。
- **工单状态与任务勾选状态不在本页维护**：`workOrders` 由 `App` 持有（`App.tsx:66`），本页通过 `onUpdateWorkOrder` 上报。本页只维护 `aiTodos` 这一份本地状态 —— 两套状态来源不同，不要合并。
- **大事记 ≠ 业务事件**：源码注释明确写了"不含业务事件"。想记录"项目进入 L4"这类业务事件应另开数据结构，不要塞进 `FILE_CHANGE_LOG`。
- **待归档与项目文件夹是两回事**：待归档（`PENDING_ARCHIVE_ITEMS`）是"尚未入库"，文件夹是"已入库 + 有版本线"。推进归档动作时要同时更新 `FILE_SOURCE` 与 `FILE_CHANGE_LOG`（参考 `fc-2` 那条"会话产物入库"记录）。
- **进度分母必须保留 `|| 1`**：工单数为 0 时否则会得到 `NaN%`。`Sources: [src/components/ProjectMemberWorkbench.tsx:280-280]()`
- 提交交付物用的是 `alert()` 而非 toast，与其它模块的反馈方式不一致，保持现状以免引入新的 UI 依赖。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一个子 tab | `ProjectMemberWorkbench.tsx:67` 加枚举 → `213-272` 加按钮 → 底部加条件渲染块（参考 438/694 写法） |
| 新增 AI 待办数据 | `workbenchMockData.ts:14-70`（`WORKBENCH_AI_TODOS`），注意 `chapterRef` 格式 |
| 改「去执行」载荷 | `ProjectMemberWorkbench.tsx:86-104` + 同步核对 `guidanceTypes.ts:188-194` 与 page-guidance 的消费端 |
| 改工单状态流转 | `types.ts:199` + `ProjectMemberWorkbench.tsx:113-141` + `App.tsx:451-453` |
| 改团队合规体检项 | `mockUsersAndTeams.ts:57-61`（数据）+ `TeamManagement.tsx:286-339`（管理端同套口径） |
| 加项目文件夹来源类型 | `workbenchMockData.ts:111-124`（`FileSourceKind` + `FILE_SOURCE`）+ 本页第 3 节渲染处的标签映射 |
| 改大事记字段 | `workbenchMockData.ts:152-163`（类型）+ `ProjectMemberWorkbench.tsx:955-990`（渲染） |

## 与 related_pages 的联动提示

- → **page-guidance**：本页是这条跨模块链的**起点**，工作台是终点。改 `GuidanceTaskContext` 必须两页一起改（这是全库唯一带载荷的跨模块跳转）。
- → **page-supervision**：同一份 `workOrders` 两个视角 —— 学生提交（本页）/ 专家复核（督导页）。改工单状态机要两侧同步，否则会出现"学生提交了但督导页看不到"。
- → **page-cross-link**：本页的"去执行"、"工单状态提升"是四大联动中的两条，改任意一条都要回到该页核对全链路。
- 注意：本页的「团队架构与合规审查」tab 与管理端的 `teams_management` 共用 `MOCK_PROJECT_TEAMS` 数据源，但**渲染组件不同**（本页内联 vs `TeamManagement.tsx`），改数据结构会同时影响两端。
