---
id: nd-guidance-taskbar
title: 任务上下文条
page: page-guidance
kind: bar
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx:402-433
---

## 一句话定位

全链路指导工作台里那条琥珀色横幅——它是**从项目工作台「去执行」跳进来后唯一的落地凭证**：显示正在执行哪条待办、来自哪、能否定位到章节，并提供「跳转关联章节」与「完成并回写待办」两个动作。

## 事实（每条强制可回溯）

**一、渲染条件与展示**

1. 仅当 prop `taskContext` 非空时渲染；为空时整条不出现。 Sources: [src/components/SceneGuidanceWorkbench.tsx:402]()
2. 展示固定前缀「正在执行任务：」+ `taskContext.title`（超长截断，`max-w-md`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:405-406]()
3. 展示来源标签 `taskContext.sourceLabel`（如「AI 诊断生成」/「专家工单 · 赵元博」）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:407-409]()

**二、两个动作**

4. 「→ 跳转关联章节」按钮**仅在 `taskContext.chapterId` 存在时渲染**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:410-417]()
5. 该按钮调用 `jumpToTaskChapter`，行为 = `setActiveChapterId(chapterId)` + `setCenterTab('bp')`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:136-141]()
6. 「完成并回写待办」按钮无条件渲染，调用 `handleCompleteTask`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:418-424]()
7. `handleCompleteTask` 当前行为 = 调 `onTaskCompleted?.(taskContext.taskId)` + `alert('任务【…】已完成，并已回写项目工作台·动态待办！')`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:144-149]()
8. 右侧关闭按钮调用 `onDismissTask?.()`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:425-431]()

**三、接收端的自动联动（跳进来瞬间发生什么）**

9. 挂载后由 `useEffect` 处理：用 ref `prefiledTaskIdRef` 记录已处理的 `taskId`，**同一个 taskId 只处理一次**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:118-121]()
10. 若 `chapterId` 存在 → `setActiveChapterId` + `setCenterTab('bp')`（自动切到 BP 章节页）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:122-125]()
11. 随后向 AI 教练消息列表**追加一条 assistant 引导消息**，内容含待办标题与来源，并声明「已为你定位到第 N 章」（有章节时）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:126-132]()
12. 该消息带 3 条建议回复：「列出该章节提分检查清单」「基于当前版本生成修改草稿」「查看历史版本中的相关论述」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:131]()
13. 追加消息的 id 为 `task-${taskContext.taskId}`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:127]()

## 规则与边界（AI 开发硬约束）

- **`prefiledTaskIdRef` 是只增不清的 ref**：离开工作台再回来，同一个 taskId **不会**再次触发引导消息与章节定位。若产品期望「每次跳转都重新定位」，必须改造该去重逻辑。
- **「完成并回写待办」目前没有真正回写**：`onTaskCompleted` 传到 App 层后，`handleTaskCompleted` 只执行 `setGuidanceTaskContext(null)`（仅关闭任务条）。项目工作台的 `aiTodos` 是页面本地 state，App 层无 setter，**跨页回写链路实际断开**。 Sources: [src/App.tsx:545-548]() [src/App.tsx:546-548]()
- 「跳转关联章节」按钮**依赖 chapterId**；专家工单来源的跳转从不带 chapterId，因此从工单待办进来时该按钮**不会出现**——这是设计差异，不是 bug，但会造成两个来源体验不一致。
- 本节点的文案是**硬编码模板字符串**，新增来源类型（`source` 枚举扩展）时需同步改这里与 `GuidanceTaskContext` 类型。
- 任务条与页面主体共用 `z-10`，不要随意提升 z-index，否则会盖住右缘版本抽屉的遮罩（z-30）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 真正实现「回写待办」 | `:144-149` + `src/App.tsx:545-548` | 需把 `aiTodos` 提升到 App 层（或引入状态管理） |
| 让工单来源也能定位章节 | `:410-417` | 需让 `executeWorkOrderTask` 产出 `chapterId`（见 `nd-workbench-todo`） |
| 支持再次跳转重新定位 | `:118-121` | 改造 `prefiledTaskIdRef` 去重策略 |
| 新增来源类型 | `:129` | `GuidanceTaskContext.source` 枚举 + `nd-workbench-todo` 载荷构造 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-workbench-todo-2-guidance-ai`** ← `nd-workbench-todo`（动态待办）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击 AI 诊断待办项右侧「去执行」按钮
  - 载荷：`GuidanceTaskContext{taskId, title, source:'ai', sourceLabel:'AI 诊断生成', chapterId}`
  - 逻辑：ProjectMemberWorkbench.executeAiTodo 构造载荷 → prop onExecuteTodo → App.handleExecuteTodo: setGuidanceTaskContext(ctx) + setActiveTab('guidance_workbench')。接收端 SceneGuidanceWorkbench 的 effect 用 prefiledTaskIdRef 去重后：有 chapterId 则 setActiveChapterId + setCenterTab('bp')，并追加一条带 3 条建议回复的 AI 引导消息。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:86-94`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:368-378`
  - 出处：`src/App.tsx:537-540`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:119-133`
  - 备注：全库唯一一条带业务载荷的跨模块跳转链路，且章节定位能力有效（chapterRef 含「第N章」时）。
- **`e-workbench-todo-2-guidance-wo`** ← `nd-workbench-todo`（动态待办）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击专家工单任务右侧「去执行」按钮
  - 载荷：`GuidanceTaskContext{taskId:'<orderId>:<taskId>', title, source:'workorder', sourceLabel:'专家工单 · <导师名>', chapterId: undefined}`
  - 逻辑：ProjectMemberWorkbench.executeWorkOrderTask 构造载荷（taskId 用冒号拼接工单号与任务号）→ prop onExecuteTodo → App.handleExecuteTodo。因 chapterId 恒为 undefined：接收端不切章节、任务条不渲染「跳转关联章节」按钮，仅追加 AI 引导消息。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:96-104`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:416-426`
  - 出处：`src/App.tsx:537-540`
  - 备注：与 e-workbench-todo-2-guidance-ai 构成平行边（同 from/to、不同 id 与 trigger）。两条边能力不对等，是本节点最易踩的不对称。

**出边 2 条**

- **`e-guidance-taskbar-2-workbench-todo-writeback`** → `nd-workbench-todo`（动态待办）｜`writeback` · **intended（设计有·未实现）**｜severity: high
  - 触发：点击任务上下文条「完成并回写待办」按钮
  - 逻辑：handleCompleteTask → onTaskCompleted(taskId) → App.handleTaskCompleted，而该方法体只有 setGuidanceTaskContext(null)（关闭任务条）。项目工作台的 aiTodos 是 ProjectMemberWorkbench 内部 useState，App 层没有它的 setter，因此待办状态实际未被修改。
  - 设计依据：按钮自身文案「完成并回写待办」src/components/SceneGuidanceWorkbench.tsx:423；其 alert 文案「…并已回写项目工作台·动态待办！」src/components/SceneGuidanceWorkbench.tsx:147
  - 期望行为：点击后，项目工作台「动态待办」中 taskId 对应的 AI 待办应被标记 completed=true，且返回项目工作台时该勾选状态仍然保持。
  - **卡点**：待办池状态被困在 ProjectMemberWorkbench 组件内部（useState(WORKBENCH_AI_TODOS)，:71），App 层无访问入口；需要把 aiTodos 提升到 App 层或引入共享状态，才能打通跨页回写。
- **`e-guidance-taskbar-2-guidance-bp`** → `nd-guidance-bp`（BP 章节打磨区）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点任务条「→ 跳转关联章节」，或挂载时收到带 chapterId 的任务上下文
  - 载荷：`activeChapterId = taskContext.chapterId + centerTab = 'bp'`
  - 逻辑：两条路径：①useEffect（taskContext 变化时）在有 chapterId 的情况下 setActiveChapterId(taskContext.chapterId) + setCenterTab('bp')；②按钮 onClick={jumpToTaskChapter} 做同样两件事。前者受 prefiledTaskIdRef 去重约束（同 taskId 只处理一次）。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:122-125`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:136-141`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:410-417`
  - 备注：本页「章节定位」能力的兑现路径。专家工单来源的 chapterId 恒为 undefined，故该按钮不渲染、effect 也不切章节。
<!-- EDGES:END -->
