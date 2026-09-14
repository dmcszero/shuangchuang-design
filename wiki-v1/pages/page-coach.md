---
id: page-coach
title: 新建对话（金牌AI教练）
section: sec-student
importance: high
sources:
  - src/components/SceneAICoach.tsx
  - src/components/ChatComposer.tsx
  - src/components/SharedWorkspaceDrawer.tsx
  - src/components/ReActProcessView.tsx
  - src/components/AtomicCallCard.tsx
  - src/components/DeepCallConfirmModal.tsx
  - src/components/DeepCallConfigCard.tsx
  - src/components/DeepCallExecutionModal.tsx
  - src/components/DeepCallResultCard.tsx
  - src/components/AiMascot.tsx
  - src/data/mockCoachData.ts
  - src/data/mockCoachAgentsAndSkills.ts
  - src/data/mockSessionMessages.ts
  - src/data/mockSpaceData.ts
  - src/types.ts
related_pages: [page-ai-agents, page-sidebar-widgets, page-defense, page-cross-link]
---

# 新建对话（金牌AI教练）

## 一句话定位

学生端主模块，也是全库最大的单体组件（**2902 行**，UTF-8 行数口径）：一个会话式 AI 教练，内部同时承载空间/会话管理、专家-技能-连接器装配、多类咨询动作、富卡消息流、ReAct 实时过程渲染，以及 **4.1 ↔ 4.2/4.3 的深度调用与浅度调用协议**——会话历史与深/浅调用都是它的子功能，不单独立页。

## 事实（每条强制可回溯）

### 一、规模与入口

1. 组件全文至 **2902 行**（全库最大单体），`export default function SceneAICoach`。`Sources: [src/components/SceneAICoach.tsx:103-120]()` `Sources: [src/components/SceneAICoach.tsx:2900-2902]()`
2. **非常规写法**：`const DEFAULT_WORKSPACE_FILES` 声明在第 31 行，而其 `mockCoachData` / `mockCoachAgentsAndSkills` 的 `import` 语句排在第 65-82 行（即 const 之后还有 import）。ESM 会提升 import 所以能跑，但阅读顺序颠倒。`Sources: [src/components/SceneAICoach.tsx:31-64]()` `Sources: [src/components/SceneAICoach.tsx:65-82]()`
3. 该常量服务于共享工作区文件初始值。`Sources: [src/components/SceneAICoach.tsx:161-161]()`
4. Props 由 `App` 注入，共 17 项，含 `activeSpace` / `spaces` / `standaloneSessions` / `activeSessionId` 与全部增删改会话回调、右区开关与文件打开回调。`Sources: [src/components/SceneAICoach.tsx:84-101]()`

### 二、状态层

5. 核心状态三项：`selectedUniversity`、`currentStage`（类型为 `'L1'|'L2'|'L3'|'L4'`，默认 `L3`）、`isWorkspaceOpen`。`Sources: [src/components/SceneAICoach.tsx:121-124]()`
6. 当前会话取数区分「空间内会话」与「独立会话」，均带 `[0]` 兜底。`Sources: [src/components/SceneAICoach.tsx:191-194]()`
7. 引擎调用计数器 `engineCallCounts` 初始化 5 项：policy / diagnosis / mockqa / industry / campus。`Sources: [src/components/SceneAICoach.tsx:196-203]()`
8. 右侧行动项 `actionItems` 初始 4 条，每条带 `category` 与 `sourceEngine`（分别标注 `4.2 诊断引擎` / `4.3 答辩引擎` / `4.1.4 校内智库`）。`Sources: [src/components/SceneAICoach.tsx:205-211]()`
9. 答辩交互有自己的小状态机 `defenseStep`，取值 `not_started | q1_grill | q1_answered | q2_grill | q2_answered | completed`，并配 `defenseScores`。`Sources: [src/components/SceneAICoach.tsx:213-216]()`
10. 雷达数据 6 维（创新性 / 技术可行性 / 市场与商业价值 / 团队匹配度 / 表达与完整性 / 社会价值），每维带 `benchmark` 金奖基准；其中「市场与商业价值」被刻意压到 5.5 以制造短板。`Sources: [src/components/SceneAICoach.tsx:218-226]()`
11. 深度调用状态 6 个：`showDeepConfirmModal` / `showDeepExecutionModal` / `deepCallTarget` / `deepCallActionName` / `currentInputPayload` / `autoPromptHint`。`Sources: [src/components/SceneAICoach.tsx:228-236]()`
12. 预置 2 条数据流日志：`log-seed-42-01`（deep → 4.2，含 protocolVersion `v2.1-RPC`、物料 checksum、config、outputResponse）与 `log-seed-43-02`（shallow → 4.3，protocolVersion `v2.1-ATOMIC-MCP`、atomicCapability `sk-defense-grill`、latencyMs 480）。`Sources: [src/components/SceneAICoach.tsx:238-322]()`
13. ReAct 实时过程状态 `LiveReActState`（active / process / currentPhase），配 `liveTimersRef` 定时器池与 `clearLiveTimers`。`Sources: [src/components/SceneAICoach.tsx:324-342]()`
14. 会话历史按 `Record<string, ChatMessage[]>` 存，初始值来自 `mockSessionHistories`。`Sources: [src/components/SceneAICoach.tsx:344-351]()` `Sources: [src/data/mockSessionMessages.ts:15-15]()`

### 三、会话生命周期与意图路由

15. 切换会话的 effect 依赖 `activeSessionId / activeSpace.id / activeSpaceId`：清定时器 → 复位 ReAct 与 thinking → 取历史或播种新会话 → **按 `taskKey` / 标题关键词自适应切换子智能体**。`Sources: [src/components/SceneAICoach.tsx:354-428]()`
16. 子智能体匹配是"三选一命中"式：`task-1`/政策关键词 → `policy`；`task-2-1`/`task-deep-42`/`task-shallow-42`/BP 关键词 → `diagnosis`；`task-2-3`/`task-deep-43`/`task-shallow-43`/答辩关键词 → `defense`；`task-3-1`/`task-3-2` → `intel`；`task-4` → `campus`。`Sources: [src/components/SceneAICoach.tsx:370-388]()`
17. 同一处注释明确了装配原则：**「主智能体技能与连接器由用户自主独立配置，不再强制关联」**。`Sources: [src/components/SceneAICoach.tsx:370-370]()`
18. 新会话（无历史）播种两条开场消息：`intro_scenarios`（4 张场景卡）与 `stage_prompt`（4 个阶段选项），且按有无空间给两套文案。`Sources: [src/components/SceneAICoach.tsx:390-427]()`
19. 消息变更时反向回写 `sessionHistoryMap`（带 `currentLoadedSessionIdRef` 防串会话）。`Sources: [src/components/SceneAICoach.tsx:430-441]()`
20. 阶段选择 `handleSelectStage` 只接受 `'L1'|'L2'|'L3'|'L4'`，找不到目标阶段会直接抛（`!` 断言）。`Sources: [src/components/SceneAICoach.tsx:448-471]()`
21. 阶段选项数据源 `mockStages` **只定义 L1~L4 四个阶段**（创意探索期 / 概念验证期 / 模式成型期 / 国赛冲刺期）。`Sources: [src/data/mockCoachData.ts:245-279]()`

### 四、ReAct 实时过程

22. `executeReActWorkflow(reactProcess, finalMessagePayload, onFinish)` 是统一的过程模拟引擎：**0ms 出 reasoning、650ms 加 plan、1300ms 加 act、2000ms 结束**并落地最终消息。`Sources: [src/components/SceneAICoach.tsx:473-540]()`
23. 提前切会话会 `clearLiveTimers()` 取消未触发的 setTimeout，避免跨会话串帧。`Sources: [src/components/SceneAICoach.tsx:333-342]()`

### 五、深度调用协议（4.1 → 4.2 / 4.3）

24. 启动入口 `handleStartDeepCall(target, initialPrompt?)`：先在会话流内做 ReAct 意图识别，再渲染**配置采集卡**（`deep_call_config_collection`），并准备自动确认 prompt。`Sources: [src/components/SceneAICoach.tsx:542-631]()`
25. 执行 `handleExecuteDeepCall` 组装 `inputPayload`（`protocolVersion: 'v2.1-RPC'`、项目 id/名/赛道/高校、materials 与 config）；项目名缺省值是硬编码的「智耘农业——基于低空多光谱的茶园精准病虫害防控系统」。`Sources: [src/components/SceneAICoach.tsx:638-669]()`
26. 完成回调 `handleDeepExecutionComplete`：生成 `outputResponse`（含 totalScore 71.5、goldBenchmarkGap、radarDimensions、criticalFlaws、actionItems）→ **写入一条 `DataFlowLog`** → 渲染 `deep_call_result` 结果卡 → 准备下一步交互。`Sources: [src/components/SceneAICoach.tsx:670-785]()`
27. 取消路径 `handleCancelDeepCall` 会额外追加一条系统取消消息，保证会话流可回溯。`Sources: [src/components/SceneAICoach.tsx:786-804]()`
28. 三步弹层分工：`DeepCallConfirmModal`（意图确认）→ `DeepCallConfigCard`（物料/焦点/深度三节配置）→ `DeepCallExecutionModal`（**2000ms 固定管道的进度模拟**）→ `DeepCallResultCard`（结果回传 + 采纳）。`Sources: [src/components/DeepCallConfirmModal.tsx:28-35]()` `Sources: [src/components/DeepCallConfigCard.tsx:39-57]()` `Sources: [src/components/DeepCallExecutionModal.tsx:52-57]()` `Sources: [src/components/DeepCallResultCard.tsx:30-42]()`
29. 执行弹层的时长是**硬编码 2000ms**，注释写明"satisfies requirements"，非真实耗时。`Sources: [src/components/DeepCallExecutionModal.tsx:52-53]()`

### 六、浅度调用协议（原子能力，留在 4.1 内）

30. `handleStartShallowCall(type)` 接受 `'questions' | 'chapter' | 'moat'` 三种原子能力，直接在 4.1 会话内出结果卡（不上报弹层）。`Sources: [src/components/SceneAICoach.tsx:805-965]()`
31. 原子能力卡 `AtomicCallCard` 内部再分 3 个形态：`questions_43`（4.3 出 5 道答辩题）/ `chapter`（4.2 商业模式速诊）/ `moat`（4.2 技术壁垒核查）。`Sources: [src/components/AtomicCallCard.tsx:37-39]()` `Sources: [src/components/AtomicCallCard.tsx:85-85]()` `Sources: [src/components/AtomicCallCard.tsx:196-196]()` `Sources: [src/components/AtomicCallCard.tsx:232-232]()`
32. 原子卡的升级路径由 `onUpgradeToDeepCall` / `onSwitchJudge` 两个回调提供（浅调 → 深调的就地升级）。`Sources: [src/components/SceneAICoach.tsx:2577-2596]()`

### 七、咨询动作与关键词路由

33. 主要动作分发器 `handleTriggerAction(actionKey, appendUserMsg)`，覆盖 **8 类**：赛事政策与规则(1)、BP与PPT深度诊断(2.1)、创新点与壁垒提炼(2.2)、路演与答辩模拟(2.3)、标杆金奖案例拆解(3.1)、竞品与市场调研(3.2)、校内专属智库(4)、以及 4.1↔4.2/4.3 深浅调用任务。每类都配一个独立 `ReActProcess` 与 payload。`Sources: [src/components/SceneAICoach.tsx:967-1048]()` `Sources: [src/components/SceneAICoach.tsx:1085-1512]()`
34. 自由文本走 `handleCustomTextQuery`：按关键词优先级依次匹配 PPT 重生成 → 深调一键确认 → 取消深调 → 深调意图(4.2/4.3) → 浅调原子能力(4.2/4.3)；未命中则走 fallback 通用应答。`Sources: [src/components/SceneAICoach.tsx:1514-1655]()`
35. `handleSendMessage` 会把 `mentionedFiles` 快照挂到用户消息上，并在首条消息时用前 18 字重命名会话标题。`Sources: [src/components/SceneAICoach.tsx:1656-1683]()`
36. 4.3 浅调特殊路径 `handleStartDefense(judge)`：选定考官后**一次性输出 5 道题且不要求作答策略**，题目来自 `mockJudgeQuestionsMap[judge.id]`，缺省回落到 `critical`。`Sources: [src/components/SceneAICoach.tsx:1697-1710]()`
37. 逐轮作答有两条独立路径：Q1 后追加"连环追问"（`counterGrillMsg`），Q2 后算平均分并出复盘（`reviewMsg`）。`Sources: [src/components/SceneAICoach.tsx:1802-1886]()`
38. 反馈采纳状态 `adoptedStatus` 支持再次点击取消（`none → status → none`）。`Sources: [src/components/SceneAICoach.tsx:1888-1897]()`

### 八、消息流渲染

39. 消息渲染按 `sender` 三分（coach / student / system），`isCoach` 段落内按 `msg.type` 分派富卡。`Sources: [src/components/SceneAICoach.tsx:1964-1966]()` `Sources: [src/components/SceneAICoach.tsx:1923-2042]()`
40. `msg.type` 的**显式卡片分支共 15 个**，行号见下：`tool_calling`(1971) / `intro_scenarios`(2044) / `stage_prompt`(2072) / `policy_answer`(2101) / `bp_diagnosis`(2154) / `judge_selector`(2260) / `defense_grilling`(2300) / `defense_review`(2366) / `gold_cases`(2453) / `competitor_intel`(2500) / `campus_resources`(2527) / `atomic_call_result`(2579) / `deep_call_config_collection`(2599) / `deep_call_result`(2609) / `flywheel_summary`(2632)。`Sources: [src/components/SceneAICoach.tsx:1971-1971]()` `Sources: [src/components/SceneAICoach.tsx:2632-2632]()`
41. 默认文本渲染有**排除清单**（已由卡片分支接管的 type 不再走纯文本）。`Sources: [src/components/SceneAICoach.tsx:2725-2725]()`
42. 消息可带 `citation`（渲染「📜 依据来源」+「AI 生成，仅供参考」）与 `generatedFiles`（渲染产物快捷卡，点击在右侧独立工作区打开）。`Sources: [src/components/SceneAICoach.tsx:2646-2690]()`
43. 而 `ChatMessage.type` 在类型层**声明了 19 种**。`Sources: [src/types.ts:369-391]()`
44. **口径漂移（如实记录）**：其中 `track_comparison` / `ask_bp_upload` / `deep_call_prompt_confirm` 三种**在全库既无生产点也无渲染分支**（对 `src/` 全量检索仅命中 `types.ts` 的联合类型声明），属枚举死值。`Sources: [src/types.ts:377-378]()` `Sources: [src/types.ts:389-389]()`
45. 教练头像位使用 `AiMascot` 组件（72px、带扬声器）。`Sources: [src/components/SceneAICoach.tsx:1935-1935]()`
46. 输入框是独立组件 `ChatComposer`，自带【上传文件】+【专家选择】+【技能选择】+【连接器选择】四个左控区。`Sources: [src/components/ChatComposer.tsx:260-260]()` `Sources: [src/components/ChatComposer.tsx:352-352]()` `Sources: [src/components/ChatComposer.tsx:420-420]()` `Sources: [src/components/ChatComposer.tsx:492-492]()`

### 九、弹层挂载

47. `SceneAICoach` 内部挂 4 个非 App 级弹层：`SharedWorkspaceDrawer`（旧版共享工作区抽屉）、`OperationFlywheelModal`（运营飞轮）、`DeepCallConfirmModal`、`DeepCallExecutionModal`。`Sources: [src/components/SceneAICoach.tsx:2844-2899]()`
48. `SharedWorkspaceDrawer` 内部分两模块：关联文件（BP/PPT/VCR/附件）+ 关联诊断与模拟答辩记录卡。`Sources: [src/components/SharedWorkspaceDrawer.tsx:278-280]()` `Sources: [src/components/SharedWorkspaceDrawer.tsx:364-366]()`
49. 空间/会话的增删改全部落在 `App.tsx`（`handleCreateSpace` / `handleCreateSession` / `handleDeleteSession` / `handleUpdateSessionTitle` / `handleSyncWorkspace`），本组件只发回调。`Sources: [src/App.tsx:296-428]()`

## 规则与边界（AI 开发硬约束）

- **本页覆盖「会话历史 + 深/浅调用」两大子功能，不要再为它们另立页面**（用户 0910 拍板的归属原则）。改会话历史 → 本页 + `Sidebar.tsx:529-611`；改深/浅调用 → 本页第五节/第六节。
- **`currentStage` 只能取 L1~L4**。这是教练模块的独立口径，与指导工作台（L1~L6）、里程碑看板（L1~L5）**不一致且并存**，口径对照见 page-lifecycle-versions。想统一阶段模型前先确认三处是否该统一。
- **2000ms / 650ms / 1300ms 是硬编码的演示延迟**，不是真实性能指标；做真实接入时这三处必须替换，不要在其上做性能优化。
- **深调与浅调的边界不能混**：浅调（原子能力）结果留在 4.1 会话流内；深调必须经过 确认 → 配置 → 执行 → 结果 四态，且必须写 `DataFlowLog`。跳过 `DataFlowLog` 会破坏"数据流可回溯"这一设计前提（`dataFlowLogs` 初始值见 238-322）。
- **`DataFlowLog` 的 `source` 字段被写死为 `'4.1 智能问答'`**，`target` 只允许 4.2 / 4.3 两个值。新增调用目标需同步改 `types.ts`。`Sources: [src/types.ts:412-422]()`
- **项目名硬编码值分散多处**：`'智耘农业——基于低空多光谱的茶园精准病虫害防控系统'` 在 `SceneAICoach` 内重复出现至少 6 处（558/641/676/807/1710/2602），且每次都是 `activeSpace?.name || <硬编码>`。改默认演示项目名必须全量替换，建议先 `grep -n "智耘农业" src/components/SceneAICoach.tsx`。
- **`ChatMessage.type` 有枚举死值**：`track_comparison` / `ask_bp_upload` / `deep_call_prompt_confirm` 无人使用。新增消息类型时不要认为"类型已声明就等于已实现"；同时新增 type 必须补渲染分支，否则会静默落到默认文本渲染（即使 payload 结构是对的，`msg.data` 也不会被消费）。
- **`DEFAULT_WORKSPACE_FILES` 的位置不要"顺手整理"**：把 import 移到文件顶部是纯收益的重构，但若同时改动行号，会连带影响本页与 page-ai-agents 中所有引用行号，需同步回写。
- 子智能体的**自适应切换只是"选中态"**，不携带技能/连接器的强制绑定——这是刻意设计（注释在 370 行），不要"补回"强制关联。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 新增一种咨询动作 | `SceneAICoach.tsx:967-1048` 加 `actionKey` 分支 + 对应 `ReActProcess` 与 payload（参考 1085-1513 的 8 个样板） |
| 新增一种富卡消息 | `types.ts:372-391` 加 type → `SceneAICoach.tsx:2043-2644` 加渲染分支 → 若走默认文本需更新 `2725` 的排除清单 |
| 改关键词意图路由 | `SceneAICoach.tsx:1514-1656`（`handleCustomTextQuery`，注意优先级顺序 = 数组顺序无关，是 if-else 顺序） |
| 改深调弹层/管道 | `DeepCallExecutionModal.tsx:52-57`（时长）、`DeepCallConfigCard.tsx:39-57`（可选项） |
| 改浅调原子能力 | `SceneAICoach.tsx:805-966` + `AtomicCallCard.tsx:85/196/232`（三形态） |
| 改 ReAct 节奏 | `SceneAICoach.tsx:497-540`（三档 setTimeout 毫秒数） |
| 改开场白/阶段选项 | `SceneAICoach.tsx:390-427` + `mockCoachData.ts:245-279` |
| 加/改专家、技能、连接器 | 见 page-ai-agents（数据在 `mockCoachAgentsAndSkills.ts`） |
| 改会话增删改 | `App.tsx:296-428`（本组件只发回调） |

## 与 related_pages 的联动提示

- → **page-ai-agents**：装配层（5 专家 / 8 技能 / 5 连接器）的数据与配置 UI 独立成层，本页只负责"选了谁"。改装配模型会同时影响本页的 `selectedAgentId` 与 `ChatComposer` 三个菜单。
- → **page-sidebar-widgets**：会话历史区在 `Sidebar.tsx`（学生端与学校管理端可见），但业务归属本页；改会话数据结构要两处同步，且 `Sidebar` 的 `sessions` / `standaloneSessions` 双入参语义重叠。
- → **page-defense**：`defense_training` 是**独立视图**（四屏状态机），与本页内的 4.3 浅调（一次性出 5 题）不是同一套实现；两者共享 `mockJudgePersonas` / `mockJudgeQuestionsMap` 数据源（`mockCoachData.ts:305-535`），改考官人设要两处核对。
- → **page-cross-link**：教练产物 → 右侧独立工作区（`App.tsx:111-120`）与 → 项目文件夹待归档（`PENDING_ARCHIVE_ITEMS`）是两条独立联动链，改 `generatedFiles` 字段会同时影响它们。
- → **page-lifecycle-versions**：本页只认 L1~L4，是三套阶段口径之一，改阶段模型必看该页。
