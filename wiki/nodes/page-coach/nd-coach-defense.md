---
id: nd-coach-defense
title: 页内模拟答辩（4.3 浅度）
page: page-coach
kind: panel
importance: medium
sources:
  - src/components/SceneAICoach.tsx:1759-1947
  - src/components/SceneAICoach.tsx:2322-2477
---

## 一句话定位

AI 助手会话里就地跑完的一轮小型答辩：选一位考官 → 出 5 道尖锐质询 → 两轮「问-答-批注」→ 生成复盘卡；不跳页、不开录像，是完整演练（`page-defense`）的轻量替代。

## 事实（每条强制可回溯）

1. 状态机由三个本地 state 组成：`defenseStep`（`not_started | q1_grill | q1_answered | q2_grill | q2_answered | completed`）、`selectedJudge`（默认 `mockJudgePersonas[0]`）、`defenseScores{q1,q2}`。 Sources: [src/components/SceneAICoach.tsx:292-294]()
2. 入口是 `judge_selector` 消息卡：列出 5 位考官（`mockJudgePersonas`）的头像、姓名、难度（极高为红色徽标）、说明与考查点；点击任一位调 `handleStartDefense(j)`。 Sources: [src/components/SceneAICoach.tsx:2322-2360]()
3. `handleStartDefense` 做三件事：写 `selectedJudge`、追加学生消息「已选定考官：【X · 角色】…」、按 `mockJudgeQuestionsMap[judge.id]`（缺省取 `critical`）**一次性产出 5 道题**，走 ReAct 后落成 `atomic_call_result` 消息（`atomicType: 'questions_43'`）。 Sources: [src/components/SceneAICoach.tsx:1759-1861]()
4. 质询卡 `defense_grilling` 渲染：评委身份与轮次（第一轮尖锐发问 / 第二轮深度追问）、题面、上一轮得分与批注（第二轮才显示）、以及**两个「预设答案」按钮**（含预期得分徽标）。 Sources: [src/components/SceneAICoach.tsx:2362-2426]()
5. 回答只能通过预设答案按钮提交：按钮点击 → `handleAnswerDefenseQ1/Q2(answerObj)`，得分取 `answerObj.score`。 Sources: [src/components/SceneAICoach.tsx:2415-2422]() [src/components/SceneAICoach.tsx:1863]() [src/components/SceneAICoach.tsx:1901]()
6. 卡片文案写了「（或在下方输入框手动打字回答）」，但**文本输入不会进入评分链路**：`handleSendMessage` 只把文本交给 `handleCustomTextQuery` 的通用关键词路由，`defenseStep` 不参与。 Sources: [src/components/SceneAICoach.tsx:2400-2410]() [src/components/SceneAICoach.tsx:1707-1745]() [src/components/SceneAICoach.tsx:1564-1760]()
7. 第一轮答完 → `defenseStep='q1_answered'` → 1.2s 后自动进入第二轮：`setDefenseStep('q2_grill')` + 追加第二条 `defense_grilling`（带 `previousCritique` / `previousScore` / `exchange: mockDefenseScript`）。 Sources: [src/components/SceneAICoach.tsx:1863-1899]()
8. 第二轮答完 → `defenseStep='completed'` → 1.5s 后追加 `defense_review` 卡：`avgScore = Math.round(((q1 || 90) + q2) / 2)`、逐题得分、典型高频失分倾向、金奖应答范式，并带点赞/点踩。 Sources: [src/components/SceneAICoach.tsx:1901-1946]() [src/components/SceneAICoach.tsx:2428-2477]()
9. 全部内容来自 `mockCoachData` 的 `mockDefenseScript`（题目/追问/预设答案/复盘）与 `mockJudgePersonas` / `mockJudgeQuestionsMap`，**与 `page-defense` 的 `defenseConstants` 题库各自独立、无共享**。 Sources: [src/components/SceneAICoach.tsx:73]() [src/components/SceneAICoach.tsx:1894]() [src/components/SceneAICoach.tsx:1936]()

## 规则与边界（AI 开发硬约束）

- 本节点与 `page-defense`（四阶段完整演练）**是两套实现**：这里只有 2 轮问答、固定 5 题、无路演/录像/计时/阶段条；做「统一答辩体验」时要先决定合并还是分工，不要顺手改一侧。
- 计分是**预设答案的选择结果**，不是对自由表达的评分（见事实 6 的文案与实现落差）。
- `defenseStep` 不随会话切换重置：它是页面级 state，切到别的会话再切回来仍保持原有步骤——只有 `isNewChatMode` 或新建会话的 effect 会重置消息，**不会重置 `defenseStep`**。 Sources: [src/components/SceneAICoach.tsx:432-472]() [src/components/SceneAICoach.tsx:293]()
- 所有判定结果都只是写消息，**没有回写任何项目/待办数据**；与 `page-workbench` 的「评委提问」链路目前无连接。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让自由文本也参与评分 | `:1707-1745` | 需在 `handleSendMessage` 前按 `defenseStep` 分流 |
| 与 page-defense 共享题库 | `:73` | 会触及 `defenseConstants.ts`（另一页的真源） |
| 增加轮次/时长控制 | `:1863-1946` | 状态机与消息卡都要扩 |
| 会话切换时重置答辩状态 | `:432-472` | 需把 `defenseStep` 纳入 effect 依赖 |
| 答辩结果回写待办/工单 | `:1930-1946` | 见 `page-workbench` 的 `nd-workbench-todo`（跨页写回尚无入口） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-coach-defense-2-stream-writeback`** → `nd-coach-stream`（会话消息流）｜`writeback` · **implemented（已实现）**
  - 触发：第二轮预设答案提交后
  - 逻辑：handleAnswerDefenseQ2 → setDefenseStep('completed') → 1.5s 后追加 defense_review 卡（avgScore=(q1||90+q2)/2、逐题分、失分倾向、金奖应答范式）。
  - 出处：`src/components/SceneAICoach.tsx:1901-1946`
  - 出处：`src/components/SceneAICoach.tsx:2428-2477`
<!-- EDGES:END -->
