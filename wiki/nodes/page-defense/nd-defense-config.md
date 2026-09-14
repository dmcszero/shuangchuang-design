---
id: nd-defense-config
title: 模式参数配置抽屉
page: page-defense
kind: drawer
importance: medium
sources:
  - src/components/defense/DefenseSelectorScreen.tsx:299-611
---

## 一句话定位

点模式卡后从右侧滑出的配置面板：按所选模式**只显示相关参数**（评委席规模 / 质询烈度 / 问答轮次 / 单题时限 / 路演时长 / 提词模式 / 演讲时长），确认后带着这份配置进入训练舱。

## 事实（每条强制可回溯）

1. 抽屉用 `motion/react` 的 `AnimatePresence` + slide-over 实现（`initial={{x:'100%'}} → x:0`，弹簧过渡），右侧 `max-w-lg` 全高；同时渲染半透明遮罩，点遮罩关闭。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:300-318]()
2. 头部显示模式名 + 徽标 + 一行随模式变化的说明（路上演→「配置路演排位时限与提词辅导模式」；电梯→「配置极速演讲时长与高密度表达节奏」；追问/弱项/对抗→「配置本次专项质询的答辩轮次与作答时限」；其余→「配置本次演练的评委参数与对抗烈度」）。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:319-352]()
3. 头部下方是「已选答辩项目」小卡（项目名 + 赛道），数据取自 `selectedProject`。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:354-359]()
4. 参数按模式**条件渲染**（互斥）：`elevator` 显示提示语 + 演讲时长（1min/3min）；`followup`/`weakness`/`adversarial` 显示各自的「评委预置」提示语；**评委席规模（单主审 / 3人联合评委席）只在 `standard` 模式下出现**；质询风格（温和肯定 / 标准专业 / 高压刁难）非 elevator、非 roadshow 显示；问答轮次（自然控场/3/5/8 题）与单题时限（60/90/120 秒）非 roadshow、非 elevator 显示；`roadshow` 显示路演时限（3/5/8/10 分钟）与提词模式（完整讲稿 / 脱稿要点）。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:363-590]()
5. 所有参数写进同一个 `config` state（`DefenseSessionConfig`），字段为 `judgeMode` / `difficulty` / `rounds` / `timeLimit` / `elevatorDuration` / `roadshowDuration` / `teleprompterMode` / `autoTransitionToQA`。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:44-51]() [src/components/defense/defenseTypes.ts:92-102]()
6. 底部两个出口：主按钮「进入 {模式名} 训练舱」→ `handleStartWithCurrent()` = 关抽屉 + `onStart(project, mode, config)`；次按钮「暂不开始，返回修改」仅关抽屉。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:61-66]() [src/components/defense/DefenseSelectorScreen.tsx:593-608]()
7. 抽屉里的选择**不校验**：没有任何「至少选 X」的约束，直接点主按钮即可开练。
8. 本屏的 `config` 是**局部 state**，`onStart` 之后由 `SceneDefenseTraining` 的 `currentConfig`（`:50-59`）接管并下发给准备/路演/问答/报告四个屏。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:44]() [src/components/SceneDefenseTraining.tsx:50-59]() [src/components/SceneDefenseTraining.tsx:65-73]()

## 规则与边界（AI 开发硬约束）

- **条件渲染的排除清单是本节点的最大坑**：几处 `!['elevator','followup','weakness','adversarial','roadshow'].includes(mode.id)` 之类的判断散落在 6 处，新增模式必须逐处检查，否则会出现「参数栏莫名消失/出现」。
- 抽屉与「立即登台演练路演」是两条并行入口：后者**绕过本抽屉**直接注入一套固定配置（5min + 完整讲稿 + 自动转问答）。改默认值时两处都要动。
- `config` 字段有可选性（`roadshowDuration?` / `teleprompterMode?` / `autoTransitionToQA?`），下游多处用 `|| '5min'` / `|| 'full_script'` 兜底——**兜底值散落在多个屏幕**，改默认值要全局搜。
- 抽屉关闭不重置已改的参数；再次点开其他模式会被 `handleModeClick` 的预置逻辑覆盖（部分字段）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增一类参数 | `:363-590` | `DefenseSessionConfig` 类型 + 全部消费屏 |
| 改条件渲染分组 | `:363-590`（6 处判断） | 逐处核对 6 个 mode.id |
| 改默认配置 | `:44-51` + `:47-60` | `SceneDefenseTraining.tsx:50-59` 的初值同步 |
| 抽屉改为整页配置向导 | `:299-611` | 需重做交互，注意保留 `onStart` 契约 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-defense-selector-2-config-navigate`** ← `nd-defense-selector`（实训模式选择与项目联动）｜`navigate` · **implemented（已实现）**
  - 触发：点击任一训练模式卡（6 张卡中的任一张）
  - 逻辑：handleModeClick(mode)：setSelectedMode + setIsDrawerOpen(true) + 按模式预置 config（电梯→单评委；高压追问→单评委+高压；弱项突击→单评委；对抗演练→3 人评委席+高压）。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:47-60`
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:176-186`
  - 备注：卡片内的「配置参数并开始」按钮自身无 onClick，交互靠整卡点击。

**出边 1 条**

- **`e-defense-config-2-prep-navigate`** → `nd-defense-prep`（赛前解构与靶向题库）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：抽屉底部「进入 {模式名} 训练舱」
  - 载荷：`{ project: DefenseProject, mode: ModeDef, config: DefenseSessionConfig }`
  - 逻辑：handleStartWithCurrent → 关抽屉 + onStart(project, mode, config) → SceneDefenseTraining.handleStartPrep：写 selectedProject/selectedMode/currentConfig，清 isReplay/isPostRoadshow/roadshowEvaluation，setView('prep')。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:61-66`
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:593-608`
  - 出处：`src/components/SceneDefenseTraining.tsx:65-73`
<!-- EDGES:END -->
