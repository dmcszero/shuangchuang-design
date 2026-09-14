---
id: nd-coach-react
title: ReAct 思考过程视图
page: page-coach
kind: panel
importance: medium
sources:
  - src/components/ReActProcessView.tsx:24-233
  - src/components/SceneAICoach.tsx:524-590
---

## 一句话定位

AI 助手回答的「透明化包装」：把一次回答拆成 思考（reasoning）→ 计划（plan）→ 行动（act）三步，可折叠展开、可单独收起子块，并在实时阶段逐帧推进——全库唯一的「过程可视化」组件。

## 事实（每条强制可回溯）

1. 组件在没有 `steps` 时**直接返回 null**（不渲染占位），因此只有带 `reactProcess` 的消息才有这一段。 Sources: [src/components/ReActProcessView.tsx:37-39]()
2. 折叠头栏左侧是摘要文案（`activeProcess.summary`，缺省「已完成思考与规划」；实时态为「正在执行 ReAct 思考与行动链路...」），右侧徽标为 `{steps.length} 步 · {duration}`（实时态改为蓝色「执行中」呼吸点），最右为「展开过程 / 收起过程」。 Sources: [src/components/ReActProcessView.tsx:79-100]()
3. 展开初值 = `defaultExpanded || isLive`：**历史消息默认收起、实时过程默认展开**（SceneAICoach 传 `defaultExpanded={false}`、实时传 `isLive`）。 Sources: [src/components/ReActProcessView.tsx:34]() [src/components/SceneAICoach.tsx:2073-2078]() [src/components/SceneAICoach.tsx:2831-2843]()
4. 三类步骤三种渲染：`reasoning`（Brain 图标 + 标题 + `subtitle` 毫秒徽标 + 正文段落）；`plan`（ListTodo 图标 + `tasks[]` 清单）；`act`（Terminal 图标 + 可选命令块 + 说明文字）。 Sources: [src/components/ReActProcessView.tsx:113-137]() [src/components/ReActProcessView.tsx:139-177]() [src/components/ReActProcessView.tsx:179-228]()
5. 命令块渲染 `step.command.lang` / `.cmd` / `.output`，右侧固定显示绿色「exit 0」，前缀 `$`。 Sources: [src/components/ReActProcessView.tsx:204-226]()
6. plan/act 子块各自有折叠开关（`collapsedSubSections[stepId]`），标题行点击用 `e.stopPropagation()`，避免与外层折叠冲突。 Sources: [src/components/ReActProcessView.tsx:41-49]() [src/components/ReActProcessView.tsx:141-146]() [src/components/ReActProcessView.tsx:181-188]()
7. 实时推进由 `executeReActWorkflow` 驱动：0ms 显示第 1 步（reasoning）、650ms 显示前 2 步（plan）、1300ms 显示前 3 步（act）、2000ms 清空实时态并把 `reactProcess` 挂到最终消息上；定时器集中在 `liveTimersRef`，切换会话时整体 clear。 Sources: [src/components/SceneAICoach.tsx:524-590]() [src/components/SceneAICoach.tsx:411-420]()
8. 命令内容（`mcp://...`）是各 handler 里**硬编码的字符串模板**，没有任何真实 RPC 调用。 Sources: [src/components/SceneAICoach.tsx:1160-1170]() [src/components/SceneAICoach.tsx:1330-1340]()

## 规则与边界（AI 开发硬约束）

- 第 5 节的 `EDGES` 与本组件无关；**ReAct 步骤数据不是边**，它只是消息载荷的一部分。
- 组件是**纯展示**：不发起任何请求、不修改任何状态（除自身折叠态），因此复用它可以零副作用（`page-guidance` 也在用同一实现前，需先确认其消息模型）。
- 命令块的「exit 0」是写死的成功态，**不代表真实执行结果**；接真实链路时要改成按 `step.status` 渲染。
- `act` 步骤在 steps 少于 3 条时不会渲染（`executeReActWorkflow` 里有 `if (step3)` 判断），因此构造新流程时**至少给 3 步**才会走完动画。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 增加 step 类型（如 observation） | `:113-228` | `ReActStep` 类型（`src/types.ts`）+ 各 handler 的步骤构造 |
| 改实时节奏（650/1300/2000ms） | `SceneAICoach.tsx:546-585` | 影响全部调用链的观感与测试等待 |
| 命令块接真实结果 | `:204-226` | 需先在 `ReActStep.command` 上加 status 字段 |
| 收起/展开状态记忆 | `:34` | 现在是组件内 state，切消息即丢 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-stream-2-react-embed`** ← `nd-coach-stream`（会话消息流）｜`embed` · **implemented（已实现）**
  - 触发：（无触发，消息带 reactProcess 时内嵌渲染）
  - 逻辑：coach 消息若带 reactProcess 则在气泡顶部渲染 <ReActProcessView defaultExpanded={false}>；实时态则在流末尾以 isLive 渲染。
  - 出处：`src/components/SceneAICoach.tsx:2073-2078`
  - 出处：`src/components/SceneAICoach.tsx:2831-2843`

**出边 0 条**

（无）
<!-- EDGES:END -->
