---
id: nd-coach-stream
title: 会话消息流
page: page-coach
kind: list
importance: high
sources:
  - src/components/SceneAICoach.tsx:2019-2830
---

## 一句话定位

AI 助手的输出面：把每条 `ChatMessage` 按 sender 与 `type` 渲染成气泡 + 13 种业务卡片（赛道对比表、诊断雷达、考官矩阵、答辩质询、复盘、金奖案例、竞品、校内资源、原子/深度调用卡…），是全库**消息类型最多的渲染分发点**。

## 事实（每条强制可回溯）

1. 容器为 `max-w-4xl` 的消息列表（`messages.map`），底部有 `messagesEndRef` 锚点，消息或 `isThinking` 变化时平滑滚到底。 Sources: [src/components/SceneAICoach.tsx:2020-2028]() [src/components/SceneAICoach.tsx:430]() [src/components/SceneAICoach.tsx:490-492]()
2. 三类 sender 三种形态：`system` 居中（`tool_calling` 类型为蓝色脉冲条，其他为灰色胶囊）；`student` 右对齐蓝底（`bg-[#0071E3]`）+ 右侧固定头像「林」；`coach` 左对齐白底 + Bot 头像。 Sources: [src/components/SceneAICoach.tsx:2029-2045]() [src/components/SceneAICoach.tsx:2064-2072]() [src/components/SceneAICoach.tsx:2821-2824]()
3. 学生头像的文字**硬编码为「林」**，与 `session.name` 无关。 Sources: [src/components/SceneAICoach.tsx:2821-2824]()
4. coach 消息若有 `reactProcess` 则在气泡顶部渲染 `ReActProcessView`（折叠态）。 Sources: [src/components/SceneAICoach.tsx:2073-2078]()
5. 消息类型分发共 13 类卡片，位置如下（行号 = 该类型分支入口）：`intro_scenarios` :2106、`stage_prompt` :2134、`policy_answer` :2163、`bp_diagnosis` :2216、`judge_selector` :2322、`defense_grilling` :2362、`defense_review` :2428、`gold_cases` :2515、`competitor_intel` :2562、`campus_resources` :2589、`atomic_call_result` :2641、`deep_call_config_collection` :2661、`deep_call_result` :2671，另有 `flywheel_summary` :2694。 Sources: [src/components/SceneAICoach.tsx:2106]() [src/components/SceneAICoach.tsx:2216]() [src/components/SceneAICoach.tsx:2641]() [src/components/SceneAICoach.tsx:2694]()
6. `bp_diagnosis` 卡内含雷达图（`RadarChart`）+ 金奖差距 + 逐章问题批注 + 底部「点赞/点踩」（写 `adoptedStatus`，再点同键即取消）。 Sources: [src/components/SceneAICoach.tsx:2216-2320]() [src/components/SceneAICoach.tsx:1949-1958]()
7. `judge_selector` 卡列出 5 位考官（`mockJudgePersonas`），点击即 `handleStartDefense(j)`——**这是页内答辩链路的入口**。 Sources: [src/components/SceneAICoach.tsx:2322-2360]() [src/components/SceneAICoach.tsx:2331]()
8. `defense_grilling` 卡渲染当前质询题 + 上一轮批注与得分 + 两个「预设答案」按钮（点击即判定得分）；`defense_review` 卡渲染综合得分、Q1/Q2 分项、高频失分倾向与金奖应答范式。 Sources: [src/components/SceneAICoach.tsx:2362-2426]() [src/components/SceneAICoach.tsx:2428-2477]()
9. 点赞/点踩按钮位置分流：`bp_diagnosis`、`defense_review`、`atomic_call_result`、`deep_call_result`、`intro_scenarios`、`stage_prompt`、`deep_call_config_collection` 这几类**不含**气泡外的小按钮（卡片自带）；其余 coach 消息在时间戳行右侧显示小按钮。 Sources: [src/components/SceneAICoach.tsx:2790-2800]() [src/components/SceneAICoach.tsx:2283-2320]()
10. `msg.citation` 存在时在气泡底部渲染「📜 依据来源：X」+「AI 生成，仅供参考」。 Sources: [src/components/SceneAICoach.tsx:2708-2717]()
11. `msg.generatedFiles` 存在时渲染橙色产物卡（点击 → `handleOpenFileInRightWorkspace` 打开右栏），并附两条快捷链接：「查看所有产物 (N)」（N = `ALL_PROJECT_DELIVERABLES.length`，**是产物库总数而非本次生成数**）与「查看所有变更 (msg.changesCount || 2)」（缺省写死 2）。 Sources: [src/components/SceneAICoach.tsx:2718-2775]() [src/components/SceneAICoach.tsx:2756-2774]()
12. `isThinking` 时在流末尾插入「思考中」气泡：有 `liveReAct` 时渲染实时 ReAct，否则显示「AI 备赛教练正在思考与检索知识库...」。 Sources: [src/components/SceneAICoach.tsx:2830-2856]()

## 规则与边界（AI 开发硬约束）

- 消息渲染是**巨型 switch 的 JSX 版**：新增一种卡片 = 新增 `type` + 在 `ChatMessage['type']` 联合类型（`src/types.ts:443-485`）登记 + 在此加分支，三处不同步会静默不渲染（TS 不会报错，因为 `msg.data` 是 any）。
- 所有卡片数据来自 `msg.data`（宽松 any 类型），**没有 schema 校验**；改数据结构要全局搜 `msg.data.` 的使用点。
- 消息内容全部由 `setTimeout` 模拟（`executeReActWorkflow` 650/1300/2000ms 三档），**没有真实 LLM 调用**；接真实链路时这一层整体替换。
- 「查看所有产物」数字来自产物库而不是本次生成，属**文案与语义不一致**，改这个链接要看 `RightWorkspacePanel.ALL_PROJECT_DELIVERABLES`。
- 与 `page-guidance`（材料打磨工作台）的对话渲染是两套独立实现，**不要试图抽公共消息组件**而不先确认两侧的消息模型差异。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增消息卡片类型 | `:2106-2775` | `src/types.ts:443-485` 的 type 联合 + 各 `handle*` 的 payload |
| 改学生头像/姓名 | `:2821-2824` | 需接 `session.name`（当前硬编码「林」） |
| 点赞点踩接真实反馈 | `:1949-1958` | 目前仅改本地 `adoptedStatus`，无上报 |
| 让「查看所有产物」名副其实 | `:2756-2774` | 需按消息维度统计生成物 |
| 接入真实 LLM 流式输出 | `:524-590`（executeReActWorkflow） | 影响全部卡片的构造时机 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 6 条**

- **`e-coach-sessions-2-stream-read`** ← `nd-coach-sessions`（会话历史与新建对话）｜`read` · **implemented（已实现）**
  - 触发：（无触发，会话索引驱动）
  - 逻辑：activeSessionId + sessionHistoryMap 决定渲染哪条会话的消息；activeSpaceId 恒为 'none' 故走 standaloneSessions 分支；切换会话时若该 id 无历史则 setMessages([])。
  - 出处：`src/App.tsx:73-76`
  - 出处：`src/components/SceneAICoach.tsx:423-472`
- **`e-coach-composer-2-stream-send`** ← `nd-coach-composer`（消息输入区与能力配置）｜`writeback` · **implemented（已实现）**
  - 触发：发送消息（Enter 或发送按钮）
  - 逻辑：ChatComposer.handleSubmit → SceneAICoach.handleSendMessage：清空输入、追加学生消息（带 mentionedFiles）、新建态先 onStartSessionFromGuide 落一条会话、标题含「新会话/初始」时改写为提问前 18 字，随后把文本交给 handleCustomTextQuery 的关键词路由产出回答。
  - 出处：`src/components/ChatComposer.tsx:158-172`
  - 出处：`src/components/ChatComposer.tsx:627-640`
  - 出处：`src/components/SceneAICoach.tsx:1707-1749`
- **`e-coach-deep-2-stream-writeback`** ← `nd-coach-deep`（深度调用管道（4.2 / 4.3））｜`writeback` · **implemented（已实现）**
  - 触发：配置卡「确认并执行」→ 执行弹窗跑到 100%
  - 载荷：`deep_call_result{engineVersion, overallScore, goldBenchmarkGap, radar[], criticalFlaws[], actionItems[], nextPrompt} + DataFlowLog(callType:'deep')`
  - 逻辑：handleExecuteDeepCall(config) 装配 inputPayload 并开执行弹窗 → onFinish → handleDeepExecutionComplete 生成硬编码结果、写 dataFlowLogs、追加结果卡、预填 nextPrompt、累加 engineCallCounts。
  - 出处：`src/components/SceneAICoach.tsx:2665`
  - 出处：`src/components/SceneAICoach.tsx:689-836`
  - 备注：结果数字（86.8 / 88.5）与 2 秒时长全部是写死的展示值。
- **`e-coach-defense-2-stream-writeback`** ← `nd-coach-defense`（页内模拟答辩（4.3 浅度））｜`writeback` · **implemented（已实现）**
  - 触发：第二轮预设答案提交后
  - 逻辑：handleAnswerDefenseQ2 → setDefenseStep('completed') → 1.5s 后追加 defense_review 卡（avgScore=(q1||90+q2)/2、逐题分、失分倾向、金奖应答范式）。
  - 出处：`src/components/SceneAICoach.tsx:1901-1946`
  - 出处：`src/components/SceneAICoach.tsx:2428-2477`
- **`e-coach-review-2-stream-writeback`** ← `nd-coach-review`（产物审核与改进意见）｜`writeback` · **implemented（已实现）**
  - 触发：点击审批三键（同意 / 否决 / 改进）
  - 载荷：`ReviewDecision = 'approved' | 'rejected' | 'improved'（改进另带 comment）`
  - 逻辑：App.handleReviewDecision 改该文件 status 与 decisionTime → 调 reviewCallbackRef（SceneAICoach 经 onRegisterReviewHandler 注册）→ postReviewChatMessage 追加一条 student 消息；improved 另在 900ms 后追加 coach 假回复「收到！…正在结合金奖指标重新推理并润色生成新版本」。
  - 出处：`src/App.tsx:119-146`
  - 出处：`src/components/SceneAICoach.tsx:199-210`
  - 出处：`src/components/SceneAICoach.tsx:163-198`
  - 备注：审批结果只改内存并回帖会话，不落库、不真正重新生成。
- **`e-coach-composer-2-stream-mention-intended`** ← `nd-coach-composer`（消息输入区与能力配置）｜`writeback` · **intended（设计有·未实现）**｜severity: medium
  - 触发：@ 引用项目文件后提问（输入框 placeholder 承诺）
  - 设计依据：输入框 placeholder「输入内容，输入 @ 可引用项目文件提问，或点击上方推荐任务载入提示词...」src/components/ChatComposer.tsx:264；项目文件弹层副标题「AI 备赛助手将在当前会话中深度结合该文件解答」src/components/ChatComposer.tsx:673
  - 期望行为：被引用的项目文件（以及上传的本地文件）应进入模型上下文并影响回答内容。
  - **卡点**：mentionedFiles / localUploadedFiles 只写进 msg.mentionedFiles 用于渲染 chip 与标记，全仓无检索或注入消费方；本地文件甚至只有文件名与大小（不读内容）。

**出边 3 条**

- **`e-coach-stream-2-react-embed`** → `nd-coach-react`（ReAct 思考过程视图）｜`embed` · **implemented（已实现）**
  - 触发：（无触发，消息带 reactProcess 时内嵌渲染）
  - 逻辑：coach 消息若带 reactProcess 则在气泡顶部渲染 <ReActProcessView defaultExpanded={false}>；实时态则在流末尾以 isLive 渲染。
  - 出处：`src/components/SceneAICoach.tsx:2073-2078`
  - 出处：`src/components/SceneAICoach.tsx:2831-2843`
- **`e-coach-stream-2-atomic-navigate`** → `nd-coach-atomic`（浅度原子能力调用卡）｜`navigate` · **implemented（已实现）**
  - 触发：点击 judge_selector 卡中的某位考官
  - 逻辑：handleStartDefense(j)：写 selectedJudge + 追加学生消息「已选定考官…」+ 按 mockJudgeQuestionsMap 出 5 题 → ReAct → 落 atomic_call_result 卡（atomicType='questions_43'）。
  - 出处：`src/components/SceneAICoach.tsx:2331`
  - 出处：`src/components/SceneAICoach.tsx:1759-1861`
- **`e-coach-stream-2-workspace-navigate`** → `nd-coach-workspace`（右侧独立工作区（产物展示））｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击消息里的生成产物卡，或卡片内「在右侧独立区域打开」
  - 载荷：`AssociatedFileItem{id, name, type, typeLabel, size, updateTime, status?, metaInfo?}`
  - 逻辑：handleOpenFileInRightWorkspace(file) → App.handleOpenFileInRightWorkspace：setIsRightWorkspaceOpen(true) + setPanelMode('deliverables') + setActiveWorkspaceFileId(file.id) + 追加 openTabs。
  - 出处：`src/components/SceneAICoach.tsx:2718-2755`
  - 出处：`src/App.tsx:181-191`
  - 备注：会把右栏从审核模式切到展示模式（设计如此）。
<!-- EDGES:END -->
