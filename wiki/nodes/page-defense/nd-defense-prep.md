---
id: nd-defense-prep
title: 赛前解构与靶向题库
page: page-defense
kind: panel
importance: medium
sources:
  - src/components/defense/DefensePrepScreen.tsx:29-334
---

## 一句话定位

正式开练前的「AI 评委预研报告」：3.3 秒解构动画之后，给出项目亮点、评委必抓疑点与 12 题预测题库——让学员带着「评委可能问什么」登台。

## 事实（每条强制可回溯）

1. 进入本屏时默认先播解构动画（`isAnalyzing = !skipAnalysis`）；`skipAnalysis` 由 `isReplay` 传入，**「重练一次」会跳过动画直接看内容**。 Sources: [src/components/defense/DefensePrepScreen.tsx:37]() [src/components/SceneDefenseTraining.tsx:111-115]() [src/components/SceneDefenseTraining.tsx:126-135]()
2. 动画按 1100 / 2200 / 3300ms 三档推进文案，路演模式与其他模式的文案不同（路演：编排 8 页幻灯片 / 生成讲稿提词 / 邀请评委入席；其他：深度阅读计划书 / 比对历届金奖 / 提炼靶向题库）。 Sources: [src/components/defense/DefensePrepScreen.tsx:39-63]()
3. 顶栏徽标随模式切换「路演战前编排 / 赛前解构报告」，标题为「全真实战路演编排与评委席预研」或「全息档案解构与靶向考题预测」；右上主按钮在动画期间 `disabled`。 Sources: [src/components/defense/DefensePrepScreen.tsx:73-107]()
4. 上下文摘要条按模式展示不同指标：路演→路演时限 + 「8页国赛标准幻灯片」+ 提词模式；电梯演讲→演讲时限；其他→单题时限 + 轮次（`config.rounds === 'unlimited' ? '自然控场' : '{n}题制'`）。 Sources: [src/components/defense/DefensePrepScreen.tsx:137-190]()
5. 左栏两块：**项目核心亮点提取**（两条绿卡，标注「答辩时应乘胜追击」）与**评委必抓核心疑点与漏洞**（两条黄卡，标注「高频失分高危区」）。 Sources: [src/components/defense/DefensePrepScreen.tsx:200-290]()
6. 右栏是**预测题库**：标题旁写死「已生成 12 题」，但实际只渲染 **4 条硬编码题目**（高频必考 1 条 / 针对疑点 2 条 / 冷门拓展 1 条），题面内容与具体项目无关（写的是基恩士/康耐视、光学镜组供应链等「深瞳视界」场景）。 Sources: [src/components/defense/DefensePrepScreen.tsx:292-334]()
7. 本屏**没有任何数据来自项目**：亮点、疑点、题目全是常量文本，`project` 只用于显示名称与赛道。 Sources: [src/components/defense/DefensePrepScreen.tsx:133-190]()
8. 两个出口：顶栏「正式进入实训舱 / 登台开启全真实战路演」与摘要条内「立即启动答辩舱 / 立即登台开启路演」，都调 `onStartSession`；左上返回键回选择屏。 Sources: [src/components/defense/DefensePrepScreen.tsx:95-104]() [src/components/defense/DefensePrepScreen.tsx:180-188]() [src/components/defense/DefensePrepScreen.tsx:68-72]()
9. 返回键直回 `selector`，**不会重置 `selectedProject`**（重进时项目仍是上次的）。 Sources: [src/components/SceneDefenseTraining.tsx:130]()

## 规则与边界（AI 开发硬约束）

- 「12 题」是**文案与实现的落差**（实际 4 条写死）：改动题库时要么补齐到 12 条，要么改文案（见 issue `issue-defense-prep-question-count`）。
- 本屏所有内容都是**「深瞳视界」项目的语料**，与学员真实项目无关——这是全页最容易被误当真的地方。
- 动画时长为写死的 setTimeout，`skipAnalysis` 只控制是否播放；若要接真实解构接口，替换点在 `:50-63` 的 effect。
- 本屏不改任何状态（除自身 `isAnalyzing` / `loadingStep`），是纯只读屏。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 题库接真实生成 | `:292-334` | 需引入数据层 + 与 `page-coach` 的考官题库口径对齐 |
| 亮点/疑点接项目数据 | `:215-290` | 依赖 `ProjectItem` 的短板字段（当前未传入） |
| 调整解构耗时/文案 | `:39-63` | 影响所有模式的进入体验 |
| 支持「跳过动画」开关暴露给用户 | `:37` | 现在只由重练路径内部使用 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 3 条**

- **`e-defense-config-2-prep-navigate`** ← `nd-defense-config`（模式参数配置抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：抽屉底部「进入 {模式名} 训练舱」
  - 载荷：`{ project: DefenseProject, mode: ModeDef, config: DefenseSessionConfig }`
  - 逻辑：handleStartWithCurrent → 关抽屉 + onStart(project, mode, config) → SceneDefenseTraining.handleStartPrep：写 selectedProject/selectedMode/currentConfig，清 isReplay/isPostRoadshow/roadshowEvaluation，setView('prep')。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:61-66`
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:593-608`
  - 出处：`src/components/SceneDefenseTraining.tsx:65-73`
- **`e-defense-selector-2-prep-navigate`** ← `nd-defense-selector`（实训模式选择与项目联动）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击高亮卡「立即登台演练路演」
  - 载荷：`{ project, mode: roadshow 模式, config: {...config, roadshowDuration:'5min', teleprompterMode:'full_script', autoTransitionToQA:true} }`
  - 逻辑：配置内联构造后直接 onStart(...) —— 不经过配置抽屉（与 e-defense-config-2-prep-navigate 构成平行边：同 from/to，trigger 与载荷来源不同）。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:139-162`
  - 出处：`src/components/SceneDefenseTraining.tsx:65-73`
- **`e-defense-report-2-prep-navigate`** ← `nd-defense-report`（答辩复盘报告）｜`navigate` · **implemented（已实现）**
  - 触发：点报告屏「重练一次」
  - 逻辑：onReplay → setIsReplay(true) + setView('prep')；准备屏收到 skipAnalysis=true 后跳过 3.3 秒解构动画直接看内容。
  - 出处：`src/components/SceneDefenseTraining.tsx:111-115`
  - 出处：`src/components/defense/DefensePrepScreen.tsx:37`
  - 出处：`src/components/defense/DefensePrepScreen.tsx:49-64`

**出边 2 条**

- **`e-defense-prep-2-roadshow-navigate`** → `nd-defense-roadshow`（全真路演竞技台）｜`navigate` · **implemented（已实现）**
  - 触发：点启动按钮且 mode.id === 'roadshow'
  - 逻辑：onStartSession → SceneDefenseTraining.handleStartSession：roadshow 模式 setView('roadshow')，其余 setView('session')。
  - 出处：`src/components/defense/DefensePrepScreen.tsx:95-104`
  - 出处：`src/components/SceneDefenseTraining.tsx:75-81`
- **`e-defense-prep-2-session-navigate`** → `nd-defense-session`（问答对抗实训舱）｜`navigate` · **implemented（已实现）**
  - 触发：点启动按钮且 mode.id ≠ 'roadshow'
  - 逻辑：同上分流逻辑的 else 分支（标准答辩 / 电梯演讲 / 高压追问 / 弱项突击 / 对抗演练 均进问答屏）。
  - 出处：`src/components/defense/DefensePrepScreen.tsx:180-188`
  - 出处：`src/components/SceneDefenseTraining.tsx:75-81`
<!-- EDGES:END -->
