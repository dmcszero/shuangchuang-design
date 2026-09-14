---
id: nd-workbench-todo
title: 动态待办
page: page-workbench
kind: panel
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx:274-435
---

## 一句话定位

项目工作台的第一个子 tab，把「AI 评分诊断生成的待办」与「后台专家下发的建议工单」汇成**一个统一池**，每条待办右侧带「去执行」按钮，点击即携带任务上下文跳到材料打磨工作台（`page-guidance`，源码内旧名「全链路指导工作台」）。

## 事实（每条强制可回溯）

**一、入口与默认态**

1. 本节点是项目工作台 5 个子 tab 之首（todos / tasks / diagnostic / team / folder），且为**默认激活**项。 Sources: [src/components/ProjectMemberWorkbench.tsx:67]()
2. 子 tab 按钮上的计数 = 未完成 AI 待办数 + 未完成工单任务数，实时计算。 Sources: [src/components/ProjectMemberWorkbench.tsx:211-222]()

**二、双来源统一池**

3. AI 来源 = `WORKBENCH_AI_TODOS`（5 条 mock），工单来源 = 当前项目所有工单任务的 `flatMap` 展开。 Sources: [src/components/ProjectMemberWorkbench.tsx:276]()
4. 顶部 4 张统计卡依次为：AI 待办未完结数 / 工单任务未完结数 / 阶段推进率 / 执行方式说明。 Sources: [src/components/ProjectMemberWorkbench.tsx:284-313]()
5. 推进率算法为 `Math.round(doneTodos / totalTodos * 100)`，`totalTodos` = AI 待办数 + 工单任务数。 Sources: [src/components/ProjectMemberWorkbench.tsx:280]()
6. 推进率卡片的标签是**硬编码**的「L4 阶段整体推进率」，不随实际阶段变化。 Sources: [src/components/ProjectMemberWorkbench.tsx:301]()
7. 来源筛选为三档 `all` / `ai` / `wo`，状态 `todoFilter` 存于本组件。 Sources: [src/components/ProjectMemberWorkbench.tsx:72]() [src/components/ProjectMemberWorkbench.tsx:316-334]()
8. 筛选为 `wo` 时整个 AI 列表区不渲染，为 `ai` 时整个工单列表区不渲染（条件渲染，非 CSS 隐藏）。 Sources: [src/components/ProjectMemberWorkbench.tsx:339]() [src/components/ProjectMemberWorkbench.tsx:386]()

**三、AI 来源列表**

9. 每条 AI 待办渲染：复选框 + 标题 + 徽章组（`AI 诊断` / `stage` / `chapterRef` / `责:` / `限期` / 优先级）+ 右侧动作按钮。 Sources: [src/components/ProjectMemberWorkbench.tsx:347-380]()
10. 复选框点击只切换本组件内 `aiTodos` 的 `completed`，**不触发跳转、不回写下游**。 Sources: [src/components/ProjectMemberWorkbench.tsx:74-76]()
11. 未完成时按钮文案为「去执行」，`completed` 时按钮 `disabled` 且文案变「已完结」。 Sources: [src/components/ProjectMemberWorkbench.tsx:370-378]()

**四、「去执行」的载荷构造（本节点的核心出口）**

12. AI 待办走 `executeAiTodo`，载荷 `source: 'ai'`、`sourceLabel: 'AI 诊断生成'`、`chapterId` 由 `chapterIdFromRef` 从 `chapterRef` 提取。 Sources: [src/components/ProjectMemberWorkbench.tsx:86-94]()
13. `chapterIdFromRef` 用正则 `/第(\d+)章/` 匹配，只取捕获组第 1 位（章号数字）。 Sources: [src/components/ProjectMemberWorkbench.tsx:79-83]()
14. 工单任务走 `executeWorkOrderTask`，`taskId` 拼为 `${orderId}:${taskId}`、`source: 'workorder'`、`sourceLabel: '专家工单 · <导师名>'`、**`chapterId` 固定为 `undefined`**。 Sources: [src/components/ProjectMemberWorkbench.tsx:96-104]()
15. 两者最终都调用同一个 prop `onExecuteTodo`，由 App 层统一承接。 Sources: [src/components/ProjectMemberWorkbench.tsx:45-53]()

**五、工单来源列表**

16. 每条工单任务渲染：复选框 + `[category] title` + 徽章组（`专家工单` / 工单号 / 导师名+职称 / 优先级+限期）+ 右侧动作按钮。 Sources: [src/components/ProjectMemberWorkbench.tsx:397-428]()
17. 工单复选框走 `handleToggleTaskDone`，会调用 `onUpdateWorkOrder` 更新 App 层工单状态。 Sources: [src/components/ProjectMemberWorkbench.tsx:142-151]()
18. 当前项目无工单任务时显示占位文案「当前项目暂无专家工单任务」。 Sources: [src/components/ProjectMemberWorkbench.tsx:394-396]()

## 规则与边界（AI 开发硬约束）

- **两个来源的 `chapterId` 能力不对等**：AI 来源可能带章节号（取决于 `chapterRef` 是否含「第N章」），工单来源**永远不带**。改载荷或新增来源时必须显式决定这一点。
- **`chapterRef` 不是结构化字段**，是中文自然语言串（如 `'第5章 竞争分析与护城河'`），靠正则提取。新增待办数据必须沿用「第N章」格式，否则定位静默失效。
- **待办的 `completed` 是页面本地 state**（`useState(WORKBENCH_AI_TODOS)`），不随导航持久化，刷新即还原。跨页回写（见出边）目前无法真正落地。
- 「去执行」与复选框是**两个独立动作**：勾选框不会自动跳转，点「去执行」也不会自动标记完成。
- 优先级只有 `high` 与非 `high` 两档视觉区分，`medium`/`low` 同色。 Sources: [src/components/ProjectMemberWorkbench.tsx:365]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增一个待办来源（如「系统提醒」） | `todoFilter` 枚举 + 两个列表区 | `GuidanceTaskContext.source` 枚举、接收端引导文案 |
| 让工单待办也能定位章节 | `executeWorkOrderTask` | 需给 `SupervisionWorkOrder.tasks` 增加章节字段 |
| 改「去执行」载荷 | `executeAiTodo` / `executeWorkOrderTask` | `src/components/guidance/guidanceTypes.ts:188-194`、`src/components/SceneGuidanceWorkbench.tsx:119-133` |
| 让待办完成后真正回写 | 见出边 `e-guidance-taskbar-2-workbench-todo-writeback` | 需把 `aiTodos` 提升到 App 层 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-guidance-taskbar-2-workbench-todo-writeback`** ← `nd-guidance-taskbar`（任务上下文条）｜`writeback` · **intended（设计有·未实现）**｜severity: high
  - 触发：点击任务上下文条「完成并回写待办」按钮
  - 逻辑：handleCompleteTask → onTaskCompleted(taskId) → App.handleTaskCompleted，而该方法体只有 setGuidanceTaskContext(null)（关闭任务条）。项目工作台的 aiTodos 是 ProjectMemberWorkbench 内部 useState，App 层没有它的 setter，因此待办状态实际未被修改。
  - 设计依据：按钮自身文案「完成并回写待办」src/components/SceneGuidanceWorkbench.tsx:423；其 alert 文案「…并已回写项目工作台·动态待办！」src/components/SceneGuidanceWorkbench.tsx:147
  - 期望行为：点击后，项目工作台「动态待办」中 taskId 对应的 AI 待办应被标记 completed=true，且返回项目工作台时该勾选状态仍然保持。
  - **卡点**：待办池状态被困在 ProjectMemberWorkbench 组件内部（useState(WORKBENCH_AI_TODOS)，:71），App 层无访问入口；需要把 aiTodos 提升到 App 层或引入共享状态，才能打通跨页回写。
- **`e-workbench-diag-gaps-2-workbench-todo`** ← `nd-workbench-diag-gaps`（逻辑断点与硬伤）｜`writeback` · **intended（设计有·未实现）**｜severity: high
  - 触发：AI 对标体检测出新的逻辑断点（系统自动生成，非用户点击触发）
  - 载荷：`GuidanceTodoItem{id, title:gap.title, stage:'L4', completed:false, priority, assignee, dueDate, chapterRef:<由 gap.location 换算>} 并带 source:'ai'`
  - 逻辑：完整链：**逻辑断点 →（自动生成）动态待办 →（点「去执行」）全链路指导工作台并定位章节**。本边为第一跳：每条 LogicGapItem 应落成动态待办中一条 source='ai' 的待办；第二跳已实现，见 e-workbench-todo-2-guidance-ai。处理入口统一收敛在动态待办，体检区不直接跳转。
  - 设计依据：产品口径（0911 #2.2）：「短板中的逻辑断点应该跟动态待办绑定，可以认为检测出逻辑断点后就会自动地在动态待办中新增一条相应待办。后续也是通过动态待办去处理。所以应该是逻辑断点--动态待办--相应模块」
  - 期望行为：体检产出 N 条逻辑断点时，动态待办中同步出现 N 条 AI 来源待办；点其「去执行」可跳到工作台对应章节；断点消除后该待办可关闭。
  - **卡点**：三处缺失：①LogicGapItem 无稳定 id（src/types.ts:91-97），无法建立「断点 ↔ 待办」一一映射；②定位口径不一致——location 是「BP 第24页《发展规划与财务预测》」（实测 src/data/mockProjects.ts:91），而待办的 chapterRef 是「第10章 财务预测与融资计划」，页面上已有的 chapterIdFromRef 正则（第N章）对前者不匹配，需新增「页→章」映射或统一口径；③待办池 WORKBENCH_AI_TODOS 是模块级静态常量，组件内无 append 入口（与 e-guidance-taskbar-2-workbench-todo-writeback 同一根因：状态层级过低）。

**出边 4 条**

- **`e-workbench-todo-2-guidance-ai`** → `nd-guidance-taskbar`（任务上下文条）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击 AI 诊断待办项右侧「去执行」按钮
  - 载荷：`GuidanceTaskContext{taskId, title, source:'ai', sourceLabel:'AI 诊断生成', chapterId}`
  - 逻辑：ProjectMemberWorkbench.executeAiTodo 构造载荷 → prop onExecuteTodo → App.handleExecuteTodo: setGuidanceTaskContext(ctx) + setActiveTab('guidance_workbench')。接收端 SceneGuidanceWorkbench 的 effect 用 prefiledTaskIdRef 去重后：有 chapterId 则 setActiveChapterId + setCenterTab('bp')，并追加一条带 3 条建议回复的 AI 引导消息。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:86-94`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:368-378`
  - 出处：`src/App.tsx:537-540`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:119-133`
  - 备注：全库唯一一条带业务载荷的跨模块跳转链路，且章节定位能力有效（chapterRef 含「第N章」时）。
- **`e-workbench-todo-2-guidance-wo`** → `nd-guidance-taskbar`（任务上下文条）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击专家工单任务右侧「去执行」按钮
  - 载荷：`GuidanceTaskContext{taskId:'<orderId>:<taskId>', title, source:'workorder', sourceLabel:'专家工单 · <导师名>', chapterId: undefined}`
  - 逻辑：ProjectMemberWorkbench.executeWorkOrderTask 构造载荷（taskId 用冒号拼接工单号与任务号）→ prop onExecuteTodo → App.handleExecuteTodo。因 chapterId 恒为 undefined：接收端不切章节、任务条不渲染「跳转关联章节」按钮，仅追加 AI 引导消息。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:96-104`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:416-426`
  - 出处：`src/App.tsx:537-540`
  - 备注：与 e-workbench-todo-2-guidance-ai 构成平行边（同 from/to、不同 id 与 trigger）。两条边能力不对等，是本节点最易踩的不对称。
- **`e-workbench-todo-2-workbench-wo-read`** → `nd-workbench-wo`（专家辅导与督导工单）｜`read` · **implemented（已实现）**
  - 触发：（无触发，数据共享）
  - 逻辑：动态待办 tab 的工单来源直接 flatMap 展开 projectOrders[].tasks；同一份 projectOrders 也驱动工单 tab 的列表与详情。两个节点共享同一数据源，无复制。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:64`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:276`
- **`e-workbench-todo-2-guidance-contract-reuse`** → `page-guidance`（材料打磨工作台）｜`reuse` · **implemented（已实现）**
  - 触发：（无触发，类型契约共享）
  - 逻辑：两端共用 src/components/guidance/guidanceTypes.ts 的 GuidanceTaskContext 接口作为跨模块载荷契约；发送端构造、接收端消费，字段变更需双侧同步。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:34`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:52`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:55`
  - 出处：`src/components/guidance/guidanceTypes.ts:188-194`
<!-- EDGES:END -->
