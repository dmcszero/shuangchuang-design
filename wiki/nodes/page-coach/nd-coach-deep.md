---
id: nd-coach-deep
title: 深度调用管道（4.2 / 4.3）
page: page-coach
kind: panel
importance: high
sources:
  - src/components/SceneAICoach.tsx:596-855
  - src/components/DeepCallConfigCard.tsx:19-210
  - src/components/DeepCallExecutionModal.tsx:21-240
  - src/components/DeepCallResultCard.tsx:21-200
---

## 一句话定位

4.1（AI 助手）向 4.2/4.3 发起的「重调用」三段式流程：会话内意图确认卡（选物料/焦点/深度）→ 2 秒执行弹窗（阶段进度）→ 结果卡（雷达 + 待办 + 采纳与下一步），是本页唯一「跨模块管道」的完整形态。

## 事实（每条强制可回溯）

1. 入口统一走 `handleStartDeepCall(target, prompt?)`（`target: '4.2' | '4.3'`），来自：原子卡「一键升级」、推荐任务胶囊的 `task-deep-*`（`:1071-1078`）、输入框关键词命中（「完整诊断」「全链路智能指导」「多考官」等，`:1609-1617`）。 Sources: [src/components/SceneAICoach.tsx:597-610]() [src/components/SceneAICoach.tsx:1071-1078]() [src/components/SceneAICoach.tsx:1112-1119]() [src/components/SceneAICoach.tsx:1609-1617]() [src/components/SceneAICoach.tsx:2645]()
2. 第一步产出 `deep_call_config_collection` 消息：附带 ReAct 三步（意图识别与跨模块路由 → 装配工作空间物料 → 调用意图校验网关，命令为 `mcp://guidance-engine|defense-engine/intent-check?...`），并用 `setInputValue` 预填「已确认上述配置参数…」+ `autoPromptHint` 提示条。 Sources: [src/components/SceneAICoach.tsx:611-682]()
3. 配置卡（`DeepCallConfigCard`）持有三个本地状态：勾选物料（默认 3 件全选）、焦点维度、审查深度（`standard | extreme`，默认 extreme）；「确认并执行」把这三项打包调 `onConfirmExecution(config)`，另有取消按钮走 `onCancelCall`。 Sources: [src/components/DeepCallConfigCard.tsx:28-37]() [src/components/DeepCallConfigCard.tsx:63-72]() [src/components/DeepCallConfigCard.tsx:198-204]()
4. `handleExecuteDeepCall(configPayload)` 组装 `inputPayload`（协议版本 `v2.1-RPC-PIPELINE`、sourceModule/targetModule、物料清单与 checksum、focusDimension、reviewDepth、`simulationTimeoutMs: 2000`）存入 `currentInputPayload` 并打开执行弹窗。 Sources: [src/components/SceneAICoach.tsx:689-718]()
5. 执行弹窗（`DeepCallExecutionModal`）用 `progress` 0→100 与 `currentStageIndex` 演示四个阶段（每 25% 一格），结束调 `onFinish`；中途可 `onAbort`。 Sources: [src/components/DeepCallExecutionModal.tsx:28-58]() [src/components/DeepCallExecutionModal.tsx:155-170]() [src/components/DeepCallExecutionModal.tsx:218-228]()
6. `handleDeepExecutionComplete` 生成**硬编码**结果：4.2 → 综合 86.8 分 / 六维雷达 / 2 条硬伤 / 3 条待办 / `nextPrompt`；4.3 → 88.5 分 / 六维 / 2 条 / 3 条。同时写 `dataFlowLogs`（`callType: 'deep'`）并累加 `engineCallCounts`。 Sources: [src/components/SceneAICoach.tsx:721-800]() [src/components/SceneAICoach.tsx:791-834]()
7. 结果卡（`DeepCallResultCard`）渲染雷达图 + 总分 + 金奖差距 + 关键问题 + 待办清单；「采纳并同步至工作空间」调 `onAdoptResults`（追加 system 消息），下一步推荐按钮调 `onSelectNextAction(prompt)` → 在 SceneAICoach 里**直接以该文案发送一条新消息**。 Sources: [src/components/DeepCallResultCard.tsx:74-190]() [src/components/DeepCallResultCard.tsx:186]() [src/components/SceneAICoach.tsx:2671-2690]()
8. 取消路径 `handleCancelDeepCall`：关两个弹窗 + 追加 system 消息「已终止深度调用流程，会话已恢复为普通智能问答模式。」+ 清空输入与提示条；输入框侧由关键词「取消 + 调用/流程/深度/配置」触发。 Sources: [src/components/SceneAICoach.tsx:837-854]() [src/components/SceneAICoach.tsx:1605-1607]()
9. **意图确认弹窗 `DeepCallConfirmModal` 不可达**：全文件对 `setShowDeepConfirmModal` 的调用只有 `false`（初值、`handleStartDeepCall`、`handleConfirmDeepCallModal`、`handleCancelDeepCall`、`onClose`），没有任何置 `true` 的地方。 Sources: [src/components/SceneAICoach.tsx:309]() [src/components/SceneAICoach.tsx:604]() [src/components/SceneAICoach.tsx:684]() [src/components/SceneAICoach.tsx:838]() [src/components/SceneAICoach.tsx:2946-2953]()
10. `engineCallCounts`（policy/diagnosis/mockqa/industry/campus 五个计数器）只被自增，**页面无任何读取点**——是写死的死数据。 Sources: [src/components/SceneAICoach.tsx:275-281]() [src/components/SceneAICoach.tsx:830-832]()

## 规则与边界（AI 开发硬约束）

- 三段式是**一条链**：配置卡 →（`onConfirmExecution`）→ 执行弹窗 →（`onFinish`）→ 结果卡。改任一环的回调名会连带另一环编译报错，这是好事（TS 会拦）；但**改数据字段（`data.*`）不会报错**（any 类型），需人工核对。
- 结果数字（86.8 / 88.5 / 2 秒 / 待办文案）全部硬编码，**与项目真实状态无关**；演示时不要把它们当真实评分。
- 关键词路由是这条链的隐式入口：`handleCustomTextQuery` 里「已确认 + 4.2/4.3/物料/配置」会直接触发 `handleExecuteDeepCall`（`:1596-1603`），「取消 + 调用/流程/深度」会触发 `handleCancelDeepCall`（`:1605-1607`）；改文案要同步这组关键词，否则预填的「已确认上述配置参数…」会失去作用。
- 深度调用**不产生任何真实文件**：结果卡的「同步至工作空间」只追加一条提示消息，右栏产物库不会变化。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接真实 4.2/4.3 接口 | `:689-800` | 执行弹窗的进度需改为真实流式事件 |
| 复活意图确认弹窗 | `:309` + `DeepCallConfirmModal.tsx` | 需在 `handleStartDeepCall` 前插入一次 `setShowDeepConfirmModal(true)` |
| 结果真实回写产物库 | `:800-834` | 见 `nd-coach-workspace`（`ALL_PROJECT_DELIVERABLES` 是常量） |
| 记录/展示调用留痕 | `:317-406`（dataFlowLogs） | 目前无渲染入口 |
| 调整演示时长 | `DeepCallExecutionModal.tsx:28-58` | `simulationTimeoutMs` 同步改（仅展示用） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-atomic-2-deep-navigate`** ← `nd-coach-atomic`（浅度原子能力调用卡）｜`navigate` · **implemented（已实现）**
  - 触发：点击原子卡底部「一键升级为 {4.2 完整项目深度体检 | 4.3 全流程答辩训练} →」
  - 逻辑：onUpgradeToDeepCall(targetEngine) → SceneAICoach.handleStartDeepCall(target) → 生成 deep_call_config_collection 意图确认卡并预填下一步指令。
  - 出处：`src/components/AtomicCallCard.tsx:264-275`
  - 出处：`src/components/SceneAICoach.tsx:2645`
  - 出处：`src/components/SceneAICoach.tsx:597-682`

**出边 2 条**

- **`e-coach-deep-2-stream-writeback`** → `nd-coach-stream`（会话消息流）｜`writeback` · **implemented（已实现）**
  - 触发：配置卡「确认并执行」→ 执行弹窗跑到 100%
  - 载荷：`deep_call_result{engineVersion, overallScore, goldBenchmarkGap, radar[], criticalFlaws[], actionItems[], nextPrompt} + DataFlowLog(callType:'deep')`
  - 逻辑：handleExecuteDeepCall(config) 装配 inputPayload 并开执行弹窗 → onFinish → handleDeepExecutionComplete 生成硬编码结果、写 dataFlowLogs、追加结果卡、预填 nextPrompt、累加 engineCallCounts。
  - 出处：`src/components/SceneAICoach.tsx:2665`
  - 出处：`src/components/SceneAICoach.tsx:689-836`
  - 备注：结果数字（86.8 / 88.5）与 2 秒时长全部是写死的展示值。
- **`e-coach-deep-2-defense-intended`** → `page-defense`（模拟答辩训练）｜`navigate` · **intended（设计有·未实现）**｜severity: medium
  - 触发：触发 4.3 深度调用（胶囊「全流程模拟答辩」/ 关键词命中文案「跳转 4.3 模拟评审与多考官极限压力训练」）
  - 设计依据：用户消息文案「帮我开启全流程模拟答辩，跳转 4.3 模拟评审与多考官极限压力训练」src/components/SceneAICoach.tsx:1076；原子卡按钮「一键升级为 4.3 全流程答辩训练 →」src/components/AtomicCallCard.tsx:271
  - 期望行为：应跳到 page-defense（模拟答辩训练）并带入项目与对应模式，而不是在会话里跑一遍 2 秒模拟。
  - **卡点**：实际只在会话内模拟并回帖结果卡（handleStartDeepCall → 配置卡 → 执行弹窗 → 结果卡）；SceneAICoach 的 onNavigateToScene prop 由 App 注入（src/App.tsx:631）却从未被调用（该 prop 在组件里被解构后无任何使用点）。
<!-- EDGES:END -->
