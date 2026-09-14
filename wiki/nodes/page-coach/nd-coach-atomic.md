---
id: nd-coach-atomic
title: 浅度原子能力调用卡
page: page-coach
kind: panel
importance: medium
sources:
  - src/components/AtomicCallCard.tsx:11-300
  - src/components/SceneAICoach.tsx:856-1015
---

## 一句话定位

4.1（AI 助手）向 4.2/4.3 引擎发起的「轻量一问」：一次 RPC 式原子能力调用（5 道质询题 / BP 章节速诊 / 壁垒核查），结果直接渲染在会话里，并给一个「一键升级为深度调用」的出口。

## 事实（每条强制可回溯）

1. 三种原子能力由 `handleStartShallowCall(type)` 分发：`questions`（4.3 评委尖锐质询题生成器 5 题）/ `chapter`（4.2 BP 商业模式章节速诊 `sk-bp-diag`）/ `moat`（4.2 创新壁垒核查 `sk-innovation-moat`）。 Sources: [src/components/SceneAICoach.tsx:856-870]() [src/components/SceneAICoach.tsx:1121-1129]()
2. `questions` 分支**不直接出题**：先落一条 `judge_selector` 消息让用户选考官（`mockJudgePersonas`），选定后走 `handleStartDefense` 才出 5 题。 Sources: [src/components/SceneAICoach.tsx:871-892]() [src/components/SceneAICoach.tsx:1759-1861]()
3. `chapter` / `moat` 分支构造 `inputPayload` / `outputResponse` → 写入 `dataFlowLogs` → 经 `executeReActWorkflow` 落成 `atomic_call_result` 消息，载荷在 `data` 与 `callMeta` 两处。 Sources: [src/components/SceneAICoach.tsx:894-1015]() [src/components/SceneAICoach.tsx:1003-1014]()
4. 卡片头固定一行「浅度调用 · {4.3 模拟评审与答辩训练 | 4.2 全链路智能指导} [原子能力: 名称]」，下面一行元信息（调用类型/引擎/耗时）。 Sources: [src/components/AtomicCallCard.tsx:67-84]()
5. `questions_43` 正文：考官头像+姓名+角色+难度、考查点、题数；三个操作（复制全部 / 换考官 `onSwitchJudge` / 单题复制）；5 道题逐条渲染类别、难度、题面。 Sources: [src/components/AtomicCallCard.tsx:86-194]()
6. **`chapter_42` / `moat_42` 两块正文的数据键与生产者不匹配**：卡片读 `data.chapterDiagnosis` 与 `data.moatChecklist`，而 SceneAICoach 传的是 `{chapterName, score, flaws, advice}` 与 `{moatLayers, rubricCheck}` → 这两个分支的条件为假，**卡片只剩头栏与底部按钮，正文永远为空**（全仓仅本文件引用这两个键名，无任何生产者）。 Sources: [src/components/AtomicCallCard.tsx:197]() [src/components/AtomicCallCard.tsx:233]() [src/components/SceneAICoach.tsx:907-915]() [src/components/SceneAICoach.tsx:939-943]()
7. 底部主按钮「一键升级为 {4.3 全流程答辩训练 | 4.2 完整项目深度体检} →」调用 `onUpgradeToDeepCall(targetEngine)`，在 SceneAICoach 里接到 `handleStartDeepCall`。 Sources: [src/components/AtomicCallCard.tsx:264-275]() [src/components/SceneAICoach.tsx:2645]()
8. 底部点赞/点踩写回本条消息的 `adoptedStatus`（再点即取消）；点赞还会追加一条 system 消息「已记录反馈点赞，已沉淀至当前工作空间备赛素材库。」 Sources: [src/components/AtomicCallCard.tsx:277-296]() [src/components/SceneAICoach.tsx:2647-2660]() [src/components/SceneAICoach.tsx:1949-1958]()
9. 原子调用同样记入 `dataFlowLogs`（`callType: 'shallow'`，`:947-959`），该日志在页面上**无任何渲染入口**，只作为数据留痕。 Sources: [src/components/SceneAICoach.tsx:317]() [src/components/SceneAICoach.tsx:947-959]()

## 规则与边界（AI 开发硬约束）

- 修事实 6 时，**改哪一侧是有讲究的**：`data.chapterDiagnosis` / `data.moatChecklist` 的结构在卡片里已被完整消费（含 `judgePerspective` / `rewriteProposal` / `status` / `scoreImpact` 字段），说明卡片才是「设计意图的完整形态」→ 优先让 SceneAICoach 按卡片的键名产出数据，而不是简化卡片。
- 四种入口都会走到这里：推荐任务胶囊（`nd-coach-guide`）、底部输入的关键词命中、`handleTriggerAction` 的 task-* 键、原子卡自身的「换考官/升级」。改一处行为要四个入口一起回归。
- 所有耗时数字（460ms / 380ms / 1.4s）都是**写死的展示值**，不是实测。
- `dataFlowLogs` 是死数据（无渲染）：要展示「调用留痕」需新增 UI，勿以为它已在页面上出现。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 修复 4.2 原子卡正文为空 | `AtomicCallCard.tsx:197` / `:233` + `SceneAICoach.tsx:907-943` | 见 issue `issue-coach-atomic-card-key-mismatch` |
| 新增一种原子能力 | `SceneAICoach.tsx:856-1015` + `AtomicCallCard.tsx:86-260` | `atomicType` 联合与卡片分支要同步 |
| 展示调用留痕（dataFlowLogs） | `SceneAICoach.tsx:317-406` | 需新增面板，注意与右栏产物区不冲突 |
| 让原子调用走真实接口 | `:1003-1014` | 影响 `callMeta` 的全部消费点 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-stream-2-atomic-navigate`** ← `nd-coach-stream`（会话消息流）｜`navigate` · **implemented（已实现）**
  - 触发：点击 judge_selector 卡中的某位考官
  - 逻辑：handleStartDefense(j)：写 selectedJudge + 追加学生消息「已选定考官…」+ 按 mockJudgeQuestionsMap 出 5 题 → ReAct → 落 atomic_call_result 卡（atomicType='questions_43'）。
  - 出处：`src/components/SceneAICoach.tsx:2331`
  - 出处：`src/components/SceneAICoach.tsx:1759-1861`

**出边 1 条**

- **`e-coach-atomic-2-deep-navigate`** → `nd-coach-deep`（深度调用管道（4.2 / 4.3））｜`navigate` · **implemented（已实现）**
  - 触发：点击原子卡底部「一键升级为 {4.2 完整项目深度体检 | 4.3 全流程答辩训练} →」
  - 逻辑：onUpgradeToDeepCall(targetEngine) → SceneAICoach.handleStartDeepCall(target) → 生成 deep_call_config_collection 意图确认卡并预填下一步指令。
  - 出处：`src/components/AtomicCallCard.tsx:264-275`
  - 出处：`src/components/SceneAICoach.tsx:2645`
  - 出处：`src/components/SceneAICoach.tsx:597-682`
<!-- EDGES:END -->
