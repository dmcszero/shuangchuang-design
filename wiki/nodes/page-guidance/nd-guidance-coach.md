---
id: nd-guidance-coach
title: 右栏 AI 备赛伴学教练
page: page-guidance
kind: panel
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx:841-961
---

## 一句话定位

工作台右栏的常驻对话区：BP 章节头与诊断卡把「问题」推进来，它输出「评委视角的推演」，当推演结果是可落纸的段落时，再通过「一键应用至计划书对应章节」把结果推回中栏。**它是本页三条入边、一条回写边的交汇点。**

## 事实（每条强制可回溯）

**一、结构**

1. 右栏宽 `w-80 lg:w-96`，固定在右侧；版本抽屉打开时该栏被设为 `opacity-0 pointer-events-none`（不卸载）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:841-845]()
2. 头部固定文案「AI 备赛伴学教练」/「评委级视角 · 全生命周期靶向指导」，无会话列表、无切换入口。 Sources: [src/components/SceneGuidanceWorkbench.tsx:848-858]()
3. 「意图聚焦」条遍历 `stageProgress` 渲染 L1~L6 徽章，当前态判定**硬编码** `st.stage === 'L4'`，点击行为同样是 `setCenterTab('diag')`（不消费 `stage`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:861-877]()
4. 消息流按 `role` 分左右：user 右对齐 indigo 底，assistant 左对齐白底描边；assistant 消息可挂 `suggestedDiff` 与 `suggestions`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:881-930]()
5. 思考中态显示「AI 教练正在结合评委标准深度推演...」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:932-937]()
6. 输入条为受控 `input`，`Enter` 触发发送；空白或思考中按钮 `disabled`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:941-959]()

**二、回复引擎（本节点的核心事实）**

7. `handleSendMessage` **不是真实 LLM 调用，是关键词 if-else**：命中「第5章 / 竞争 / 壁垒」→ 输出三段竞争反制论述并附带 `suggestedDiff`（第5章）；命中「财务 / 第10章 / 账期」→ 输出账期压力模型（无 diff）；命中「待办 / 任务」→ 输出 3 条团队待办（无 diff）；否则走兜底文案。 Sources: [src/components/SceneGuidanceWorkbench.tsx:206-238]()
8. 回复延迟固定 `900ms`；思考中标志在回调末尾复位。 Sources: [src/components/SceneGuidanceWorkbench.tsx:206]() [src/components/SceneGuidanceWorkbench.tsx:254-255]()
9. 三条分支的回复**都**附带同 3 条固定建议（润色第3章 / 优化第12章 / 查看专家质询话术）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:246-250]()
10. 兜底文案会引用 `coachIntent`：「我正基于【${coachIntent}】阶段指引…」——因 `setCoachIntent` 从未被调用，该值恒为 `'L4'`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:237]() [src/components/SceneGuidanceWorkbench.tsx:100]()
11. 若回复带 `suggestedDiff`，消息气泡内渲染「一键应用至计划书对应章节」按钮（emerald 底）→ `handleApplyDiff`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:896-909]()
12. 三个外部入口都汇到同一个 `handleSendMessage`：章节头「AI 深度诊断此章」（`:582`）、诊断卡「让 AI 执行」（`:724`）、任务上下文条注入的引导消息的建议气泡（`:131`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:582]() [src/components/SceneGuidanceWorkbench.tsx:724]() [src/components/SceneGuidanceWorkbench.tsx:131]()

## 规则与边界（AI 开发硬约束）

- **三个死状态**（声明后无任何 UI 消费，删改前先确认不是预留）：
  - `chatCollapsed` / `setChatCollapsed`（`:99`）——无折叠按钮；
  - `sessions` / `setSessions`（`:101`）——无会话列表，`INITIAL_COACH_SESSIONS` 导入即废弃；
  - `activeSessionId` / `setActiveSessionId`（`:102`）——无选中态消费。
  Sources: [src/components/SceneGuidanceWorkbench.tsx:99-102]() [src/components/guidance/guidanceMockData.ts:506-531]()
- **与 `page-coach` 是两套独立会话实现**：本栏是 `SceneGuidanceWorkbench` 内的简版 if-else；`page-coach`（`SceneAICoach.tsx`，2965 行）是带 ReAct 过程可视化的完整版。两者**零共享**（不同的 state、不同的 mock、不同的消息类型：`CoachMessageItem` vs 教练侧自有类型）。任何「统一会话」的改造都必须先决定保留哪一套。
- **「待办」分支的文案已经过期**：回复里问「是否一键将这些任务同步下发至**左侧任务待办栏**？」，但本页**左侧栏已在 0908-16 移除**（源码注释明确记录「左栏移除后，仅保留中栏三 tab + 右栏 AI 单主体」）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:235]() [src/components/SceneGuidanceWorkbench.tsx:82]()
- 关键词命中是**包含匹配**，顺序敏感：「第5章…财务」会命中第 5 章分支（先判定）；新增分支必须放在兜底之前，并考虑与既有分支的重叠。
- `suggestedDiff` 只被「第5章/竞争/壁垒」分支产出，且 `chapterId` 写死为 `'5'`；其余分支即使语义上该改某章也不会产出 diff。 Sources: [src/components/SceneGuidanceWorkbench.tsx:220-224]()
- 消息 `id` 用 `Date.now()` / `Date.now()+1`，同一毫秒内连发两条会撞 key。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接入真实 LLM | `:191-256` | 替换 if-else，保留 `CoachMessageItem` 契约与 `suggestedDiff` 渲染 |
| 让阶段徽章真正切阶段 | `:861-877` | 引入阶段 state（同时修 `coachIntent` 死状态） |
| 清理死状态 | `:99-102` | 确认 `sessions`/`activeSessionId`/`chatCollapsed` 无后续规划后删除 |
| 修「左侧待办栏」过期文案 | `:235` | 目标应改为项目工作台「动态待办」 |
| 为更多分支产出 diff | `:206-238` | `suggestedDiff.chapterId` 需按内容动态给出，不能写死 `'5'` |
| 与 `page-coach` 会话统一 | 两处 state | 见 `page-coach` 页面文档 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-guidance-diag-2-guidance-coach`** ← `nd-guidance-diag`（全维诊断报告）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击「专家推荐下一步最优演进路径」卡片里的「让 AI 执行」
  - 载荷：`用户消息文本 = `请协助我执行优化动作：${it.text}``
  - 逻辑：onClick={() => handleSendMessage(`请协助我执行优化动作：${it.text}`)} → 右栏追加一条 user 消息 + 置 isAiThinking，900ms 后按关键词分支产出 assistant 回复。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:723-729`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:191-256`
  - 备注：DiagnosisItem 的 action / target 字段未被消费，因此 nextSteps 里 target:'defense' 的那条（第 3 条）也走这条通用出口，不会进入答辩模块。
- **`e-guidance-bp-2-guidance-coach`** ← `nd-guidance-bp`（BP 章节打磨区）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击章节头横幅的「AI 深度诊断此章」
  - 载荷：`用户消息文本 = `请帮我针对第${activeChapterId}章提出3条国赛评委视角的提分修改建议``
  - 逻辑：onClick 直接调 handleSendMessage(模板串)；因文案含「第5章」等关键词时才会命中带 diff 的分支，诊断第 5 章会产出 suggestedDiff，诊断其他章则走兜底文案。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:581-587`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:206-238`
  - 备注：「按章诊断」的能力受 if-else 覆盖范围限制：只有第 5 章 / 第 10 章两类有专门回复。

**出边 2 条**

- **`e-guidance-coach-2-guidance-bp`** → `nd-guidance-bp`（BP 章节打磨区）｜`writeback` · **implemented（已实现）**
  - 触发：点击 AI 消息里的「一键应用至计划书对应章节」
  - 载荷：`diff.replacement（AI 生成的段落原文）`
  - 逻辑：消息气泡在 msg.suggestedDiff 存在时渲染按钮 → handleApplyDiff(diff) → setBpContent(prev => prev + '\n' + diff.replacement) + setBpMode('preview') + setCenterTab('bp') + alert。**diff.chapterId / chapterName 只用于 alert 文案，不参与插入定位。**
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:896-909`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:258-264`
  - 备注：全库唯一一条「AI 产物写回文档」的链路，也是本页唯一成环的闭环。当前实现为追加到文末，与「应用至对应章节」的文案不符。
- **`e-guidance-coach-2-guidance-diag`** → `nd-guidance-diag`（全维诊断报告）｜`navigate` · **implemented（已实现）**
  - 触发：点击右栏「意图聚焦」条上的 L1~L6 阶段徽章
  - 逻辑：onClick={() => setCenterTab('diag')} —— 与顶栏 stepper 同款实现：只切 tab，**不把所点阶段写入任何 state**（coachIntent 的 setter 从未被调用）。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:863-876`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:100`
  - 备注：同一交互在两处（顶栏 :326 / 右栏 :866）重复实现且都无效，是「阶段」概念在本页的集中缺口。
<!-- EDGES:END -->
