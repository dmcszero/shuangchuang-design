---
id: page-cross-link
title: 跨模块联动与闭环
section: sec-data
importance: high
sources:
  - src/App.tsx
  - src/components/ProjectMemberWorkbench.tsx
  - src/components/SceneGuidanceWorkbench.tsx
  - src/components/guidance/guidanceTypes.ts
  - src/components/SceneAICoach.tsx
  - src/components/Sidebar.tsx
  - src/components/SupervisionClosure.tsx
  - src/components/workbench/workbenchMockData.ts
  - src/data/mockSpaceData.ts
related_pages: [page-workbench, page-guidance, page-sidebar-widgets, page-coach]
---

# 跨模块联动与闭环

## 一句话定位

全库一共只有 **4 条真实的跨模块联动链**（其余"联动"都是同页内跳转）：① 动态待办「去执行」携载荷跳工作台（**全库唯一带载荷的跨模块链**）② 切当前参赛项目全端联动 ③ 教练产物 → 右侧独立工作区 / 项目文件夹待归档 ④ 工单状态 App 级提升（学生提交 → 导师复核）。本页把四条链的每一跳都标出行号。

## 事实（每条强制可回溯）

### 一、联动链 ① 动态待办「去执行」→ 全链路指导工作台（带载荷）

**跳转形态**：唯一带结构载荷的跨模块跳转，载荷类型 `GuidanceTaskContext`。

1. 载荷类型定义：`{ taskId, title, source: 'ai' | 'workorder', sourceLabel, chapterId? }`（`chapterId` 为 BP 标准章编号 1~12）。`Sources: [src/components/guidance/guidanceTypes.ts:187-194]()`
2. **第 1 跳（构造载荷）**：项目工作台的 `executeAiTodo` / `executeWorkOrderTask` 分别构造两种来源的载荷。`Sources: [src/components/ProjectMemberWorkbench.tsx:85-104]()`
3. AI 来源的 `sourceLabel` 固定为「AI 诊断生成」；工单来源为 `专家工单 · {orderLabel}`，且 `chapterId` 为 `undefined`（工单任务不关联章节）。`Sources: [src/components/ProjectMemberWorkbench.tsx:90-103]()`
4. `chapterId` 由 `chapterRef` 正则 `/第(\d+)章/` 提取，因此**只有 `chapterRef` 写成「第N章…」才能定位章节**。`Sources: [src/components/ProjectMemberWorkbench.tsx:78-83]()`
5. **第 2 跳（App 中转）**：`handleExecuteTodo(ctx)` 同时做两件事 —— 存载荷到 `guidanceTaskContext` 并切 tab 到 `guidance_workbench`。`Sources: [src/App.tsx:460-465]()`
6. `guidanceTaskContext` 是 App 级状态，初始为 `null`。`Sources: [src/App.tsx:83-84]()`
7. 另有 `handleDismissTask`（只清空，不回写）与 `handleTaskCompleted`（清空，视为完成）两个处理器。`Sources: [src/App.tsx:467-473]()`
8. **第 3 跳（消费载荷）**：载荷经 props 传入工作台（`taskContext` / `onDismissTask` / `onTaskCompleted`）。`Sources: [src/App.tsx:574-583]()`
9. 工作台收到载荷后：`prefiledTaskIdRef` 去重 → 若带 `chapterId` 则切到 BP tab 并定位章节 → 追加一条含 3 个建议回复的 AI 引导消息。`Sources: [src/components/SceneGuidanceWorkbench.tsx:117-133]()`
10. **第 4 跳（回写）**：任务条上的「完成并回写待办」调用 `onTaskCompleted(taskContext.taskId)`，在 `App` 侧清空载荷（mock 实现）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:143-149]()` `Sources: [src/App.tsx:470-473]()`
11. 任务条 UI 含 4 个元素：任务标题、来源徽章、条件渲染的「→ 跳转关联章节」、以及「完成并回写待办」。`Sources: [src/components/SceneGuidanceWorkbench.tsx:395-427]()`
12. **反向依赖提醒**：项目工作台（student 视图）为使用该载荷类型，反向 import 了 guidance 域的类型文件。`Sources: [src/components/ProjectMemberWorkbench.tsx:45-53]()`

### 二、联动链 ② 切当前参赛项目 → 全端联动

13. **入口**：侧栏项目切换器（仅 `team_member`）。`Sources: [src/components/Sidebar.tsx:300-301]()`
14. 选择后回调 `onSelectProjectItem(projectId)`，先关下拉。`Sources: [src/components/Sidebar.tsx:183-187]()`
15. **App 中转**：同时 `setActiveTeamProjectId(projId)` 与 `setSelectedProject(p)`（两处副作用）。`Sources: [src/App.tsx:510-516]()`
16. 全局项目对象 `currentMemberProject` 三级兜底计算：`activeTeamProjectId` → `session.projectId` → `projects[0]`。`Sources: [src/App.tsx:480-483]()`
17. **三个消费落点**（源码注释自称"切项目全端联动：工作台门卡/答辩舱项目卡/教练空间物料"）：
    - 项目工作台 ← `project={currentMemberProject}`（597）
    - 全链路指导工作台 ← `selectedProject={currentMemberProject}`（577）
    - 模拟评审与答辩训练 ← `currentProject={currentMemberProject}`（588）
    - 教练 ← `activeSpace`（556 附近的 `activeSpace` 派生，注意**不是** `currentMemberProject`）
    `Sources: [src/App.tsx:553-603]()`
18. **重要区分**：教练的"当前项目"是 `activeSpace`（来自 `spaces`，`mockSpaceData`），与 `currentMemberProject`（来自 `projects`，`mockProjects`）**是两个不同的数据源**，注释把它们并称为"教练空间物料"是简化说法。`Sources: [src/App.tsx:71-74]()` `Sources: [src/App.tsx:484-484]()`
19. 侧栏切换器的"选中态"另由 `selectedProjectId={currentMemberProject?.id}` 展示。`Sources: [src/App.tsx:511-511]()`
20. 切项目**不打开**项目详情抽屉（`isDrawerOpen` 只由 `handleSelectProject` 置位，`App.tsx:430-433`）。`Sources: [src/App.tsx:511-516]()`

### 三、联动链 ③ 教练产物 → 右侧独立工作区 / 项目文件夹待归档

**分支 ③-A：产物在右侧独立工作区打开**

21. 消息可携带 `generatedFiles`（`AssociatedFileItem[]`），渲染为产物快捷卡，点击调 `handleOpenFileInRightWorkspace`。`Sources: [src/components/SceneAICoach.tsx:2656-2690]()`
22. 教练内的处理：优先调 `onOpenFileInRightWorkspace`，否则退化为"仅打开右区"。`Sources: [src/components/SceneAICoach.tsx:126-147]()`
23. **App 中转**：打开右区 + 设为激活文件 + 若不在 tab 列表则追加 tab。`Sources: [src/App.tsx:111-120]()`
24. 右区 Tab 状态由 App 持有（`openWorkspaceTabs` / `activeWorkspaceFileId`），并支持关闭 tab（关闭后自动激活最后一个）与新增 tab。`Sources: [src/App.tsx:108-137]()`
25. 落到 `RightWorkspacePanel`（只在 `coach` tab 且右区开启时挂载）。`Sources: [src/App.tsx:734-752]()`

**分支 ③-B：会话产物 → 项目文件夹待归档**

26. 待归档区数据 `PENDING_ARCHIVE_ITEMS`，字段含 `fromSession`（来自哪个会话）。`Sources: [src/components/workbench/workbenchMockData.ts:126-150]()`
27. 归档完成后会写入大事记，`kind: 'archive'`，`fromRef` 记录来源会话，`versionRef` 记录形成版本。样例记录 `fc-2` 的 `action` 为「会话产物入库」，`fromRef` 为 `会话「全链路规划与巨头竞品防御强化」`。`Sources: [src/components/workbench/workbenchMockData.ts:177-186]()`
28. 文件的来源标签三态 `system | upload | ai` 中，`ai` 即"会话生成"，共 3 个条目。`Sources: [src/components/workbench/workbenchMockData.ts:111-124]()`
29. 项目文件夹 tab 的渲染含三块：待归档区 / 文件树（带来源标签）/ 主文档版本线 + 大事记。`Sources: [src/components/ProjectMemberWorkbench.tsx:849-991]()`

### 四、联动链 ④ 工单状态 App 级提升（学生提交 → 导师复核）

30. **状态宿主**：`workOrders` 由 `App` 持有，初始 `mockWorkOrders`。`Sources: [src/App.tsx:66-66]()`
31. **唯一写入口**：`handleUpdateWorkOrder(updated)` 按 id 做数组替换。`Sources: [src/App.tsx:451-453]()`
32. 写入口被分发给两个页面：项目工作台（`onUpdateWorkOrder`，598）与督导页（`onUpdateWorkOrder`，640）。`Sources: [src/App.tsx:594-642]()`
33. **学生侧写入**：任务勾选 `handleToggleTaskDone` 重建 order 并上报；交付提交把 `status` 推到 `student_submitted` 并写 `studentSubmission`。`Sources: [src/components/ProjectMemberWorkbench.tsx:142-153]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:113-141]()`
34. **导师侧写入**：`handleApproveCheck` 把 `status` 推到 `expert_checked` 并写 `expertCheck`（含 `scoreChangeDelta`）。`Sources: [src/components/SupervisionClosure.tsx:55-70]()`
35. 因此这是**唯一一条"两个角色写同一份数据"的联动**（学生端与导师端分属不同 `PortalRole`，却共享 `workOrders`）。`Sources: [src/types.ts:199-199]()`
36. 状态机四态：`pending_student → student_submitted → expert_checked`（外加 `overdue`）。`Sources: [src/types.ts:199-199]()`
37. 驾驶舱的"督导闭环率"KPI 也读这份数据，但**实际与 `status` 无关联计算**（驾驶舱只按 grade 与 healthStatus 分组，见 page-cockpit）。`Sources: [src/components/CockpitDashboard.tsx:31-35]()`

### 五、App 作为"联动总线"的完整清单

38. `App.tsx` 持有的跨模块状态共 9 组：

| 状态 | 行号 | 服务对象 |
|---|---|---|
| `session` | 44-54 | 全局 |
| `activeTab` | 56-61 | 全局路由 |
| `projects` | 64 | 管理端 4 页 + 教练空间 + 工作台 + 答辩 |
| `mentors` | 65 | 辅导 + 导师库 |
| `workOrders` | 66 | 工作台 + 督导 + 项目抽屉 |
| `cohortTasks` | 67 | 辅导 |
| `alerts` | 68 | 顶栏（**只读，无 setter**） |
| `spaces` / `standaloneSessions` / `activeSpaceId` / `activeSessionId` | 71-74 | 教练 + 侧栏会话历史 |
| `selectedProject` / `isDrawerOpen` | 77-78 | 全局项目详情抽屉 |
| `guidanceTaskContext` | 84 | 联动链 ① |
| `activeTeamProjectId` | 87-89 | 联动链 ② |
| `openWorkspaceTabs` / `activeWorkspaceFileId` / `rightWorkspaceWidthPx` 等 | 94-109 | 联动链 ③-A |

`Sources: [src/App.tsx:42-109]()`

39. `alerts` 是**唯一没有 setter 的业务状态**（`const [alerts] = useState(mockAlerts)`），因此任何"产生新告警"的功能都无法落地。`Sources: [src/App.tsx:68-68]()`
40. 项目详情抽屉是**五个管理页共用的下钻出口**（初筛、驾驶舱、辅导、督导、里程碑都通过 `handleSelectProject` 打开）。`Sources: [src/App.tsx:430-440]()` `Sources: [src/App.tsx:754-761]()`

## 规则与边界（AI 开发硬约束）

- **新增跨模块联动必须走 `App` 作中转，不要在子组件间直接通信**。全库没有 Context / 状态库 / 事件总线，唯一的联动机制是"子组件发回调 → App 改状态 → props 下发"。绕过它会出现两个视图不同步。
- **联动链 ① 的载荷类型是唯一契约**：改 `GuidanceTaskContext` 必须同时改生产端（`ProjectMemberWorkbench.tsx:85-104`）与消费端（`SceneGuidanceWorkbench.tsx:117-149`），且它是**跨目录 import**（工作台引 guidance 域类型）。
- **`chapterRef` 格式是隐式协议**：不含「第N章」则 `chapterId` 为 `undefined`，跳过去后无法定位章节（不报错，只是静默失效）。
- **联动链 ② 有两个"当前项目"，别搞混**：教练侧是 `activeSpace`（空间），其它三端是 `currentMemberProject`（项目）。"切项目全端联动"这句注释对教练侧是**过度简化**。
- **联动链 ④ 是双角色共写**：改 `SupervisionWorkOrder.status` 会影响两个 PortalRole 的视图。且 `selectedOrder` 的本地态与 App 态**可能短暂不一致**（督导页先 `setSelectedOrder(updated)` 再上报）。
- **`alerts` 无 setter**：任何"新增预警/通知"的需求都要先给它加 setter 或提升为可变状态。
- **右区挂载有硬条件**（`activeTab === 'coach' && isRightWorkspaceOpen`）：非 coach 页面调 `handleOpenFileInRightWorkspace` 只会改状态，界面不变 —— 这是最容易误判为"联动失效"的地方。
- **待归档 ≠ 已入库**：`PENDING_ARCHIVE_ITEMS`（未入库）与 `FILE_CHANGE_LOG`（已入库记录）是两个数据集；推进归档时要同时更新 `FILE_SOURCE` 与追加 `FILE_CHANGE_LOG`。当前**没有实现这个动作**（数据是静态 mock），只定义了形态。
- 载荷跳转的**去重靠 ref**（`prefiledTaskIdRef`）：同一任务重复点击不会重复追加引导消息，但换一个任务会。改这段逻辑时不要丢掉 ref 去重，否则会出现消息重复。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一条跨模块联动 | 在 `App.tsx` 加状态 + 回调（参考 `guidanceTaskContext` 的 84/462-473 写法），再在两端子组件加 props |
| 改「去执行」载荷 | `ProjectMemberWorkbench.tsx:85-104`（生产）+ `guidanceTypes.ts:187-194`（类型）+ `SceneGuidanceWorkbench.tsx:117-149`（消费） |
| 改切项目联动面 | `App.tsx:510-516`（中转点）+ 各消费视图 props |
| 改教练产物打开目标 | `SceneAICoach.tsx:126-147` + `App.tsx:111-137` |
| 加右区文件类型 | `RightWorkspacePanel.tsx:36`（`ALL_PROJECT_DELIVERABLES`）+ `App.tsx:108-109`（默认 tab） |
| 实现"待归档 → 入库"动作 | `workbenchMockData.ts:126-150`（数据）+ `ProjectMemberWorkbench.tsx:872-894`（UI）+ 需新增状态写入 |
| 给告警加写入口 | `App.tsx:68`（当前只读）+ 消费端 `TopHeader.tsx:159-190` |
| 改工单状态流转 | `App.tsx:451-453` + 两个写方（`ProjectMemberWorkbench.tsx:113-153` / `SupervisionClosure.tsx:55-70`） |

## 与 related_pages 的联动提示

- → **page-workbench**：联动链 ① 的起点与 ③-B 的落点（待归档、大事记都在此页）。
- → **page-guidance**：联动链 ① 的终点（唯一消费载荷的页面），也是 ③-A 相关的产物来源（教练生成、右区打开）。
- → **page-sidebar-widgets**：联动链 ② 的入口（项目切换器）；该页也记录了"两个当前项目"的区分。
- → **page-coach**：联动链 ③ 的起点（`generatedFiles`）；其 `activeSpace` 是 §二 中唯一不跟随 `currentMemberProject` 的"当前项目"。
- 覆盖度说明：本页是 `sec-flow` 分区唯一页面。四条链之外，其余跳转（如驾驶舱 → 初筛、初筛 → 抽屉、辅导 → 导师库）都是**无载荷的同级 tab 切换**，不属于跨模块闭环，不在此页收录。
