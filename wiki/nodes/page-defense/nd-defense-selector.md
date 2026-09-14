---
id: nd-defense-selector
title: 实训模式选择与项目联动
page: page-defense
kind: panel
importance: high
sources:
  - src/components/defense/DefenseSelectorScreen.tsx:76-248
---

## 一句话定位

答辩训练的首屏：横幅交代「这是哪个项目的答辩舱」，五张模式卡列出可选的训练形态（路演 / 标准答辩 / 电梯演讲 / 高压追问 / 弱项突击 / 对抗演练），点任意一张即展开配置抽屉。

## 事实（每条强制可回溯）

1. 顶部深色横幅标题为「模拟评审与答辩训练舱」，徽标「2026大赛评审专家人设与国赛多维大模型实训」，副文说明三种能力（六维雷达 / 挑剔风格 / 失分点补强）。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:77-105]()
2. 横幅底部有**当前项目联动条**：「当前答辩实训项目：{selectedProject.name}（{track}）」+ 说明「已通过左侧项目栏全局联动，评委人设与靶向题库已定向匹配」——与 App 侧栏选中的项目自动对齐。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:107-121]() [src/components/SceneDefenseTraining.tsx:41-48]()
3. 模式卡数据源是常量 `TRAINING_MODES`，共 **6 种模式**：`roadshow` 全真实战路演（实战旗舰）/ `standard` 标准答辩（推荐）/ `elevator` 电梯演讲（速通）/ `followup` 高压追问 / `weakness` 弱项突击 / `adversarial` 对抗性演练（硬核）。 Sources: [src/components/defense/defenseConstants.ts:37-109]() [src/components/defense/DefenseSelectorScreen.tsx:176-247]()
4. 卡片点击 = `handleModeClick(mode)`：设为当前模式 + **打开右侧配置抽屉** + 按模式**预置配置**（电梯演讲→单评委；高压追问→单评委+高压；弱项突击→单评委；对抗演练→3 人评委席+高压）。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:47-60]()
5. 卡片内那个「配置参数并开始 / 选择模式」按钮**没有自己的 onClick**，视觉按钮实际靠整卡点击触发——改交互时不要只给按钮加事件。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:229-243]()
6. 横幅下方另有一张**路演专属高亮卡**（「重磅新升级 · 2026国赛标准」）：点「立即登台演练路演」直接以 `roadshow` 模式 + 5min + 完整讲稿 + 自动转问答的配置跳进准备屏，**不经过配置抽屉**。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:123-162]()
7. 学员所选项目若为空，回落到 `MOCK_DEFENSE_PROJECTS[0]`（「深瞳视界——工业级微米三维缺陷纳秒成像检测仪」，高教主赛道·研究生创意组）。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:32-34]() [src/components/defense/defenseConstants.ts:4-13]()

## 规则与边界（AI 开发硬约束）

- **项目来源是 `currentProject` prop**（App 的 `currentMemberProject`），本屏不自己选项目；`SceneDefenseTraining.getDefenseProject()`（`:19-40`）把 `ProjectItem` 映射成 `DefenseProject`（赛道 = `trackLabel · groupLabel`，标签含阶段/评级）。改映射要同时看 `page-workbench` 的项目数据口径。 Sources: [src/components/SceneDefenseTraining.tsx:19-40]()
- 预置配置只在**点卡片时**写入一次（`handleModeClick`）；抽屉里手动改过的值在关闭后再点别的模式会被覆盖。
- 模式数量与文案是产品口径（6 模式 = 训练方法论），新增模式要同时在 `defenseConstants.TRAINING_MODES`、抽屉的条件渲染分支、`DefenseSessionScreen` 的开场白分支（按 `mode.id` 四选一）三处登记。
- 本屏无网络请求、无 loading，纯本地状态。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增训练模式 | `defenseConstants.ts:37-109` | 抽屉条件（`:363-590`）+ 开场白分支（`DefenseSessionScreen.tsx:132-156`） |
| 项目联动改为多选 | `DefenseSelectorScreen.tsx:32-43` | `SceneDefenseTraining` 的 `selectedProject` 单一态 |
| 「立即登台路演」加二次确认 | `:139-162` | 纯本地 |
| 改横幅文案/指标口径 | `:77-121` | 对外表述，需与产品口径一致 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-defense-report-2-selector-navigate`** ← `nd-defense-report`（答辩复盘报告）｜`navigate` · **implemented（已实现）**
  - 触发：点报告屏「重新开始」
  - 逻辑：onRestart → SceneDefenseTraining.handleRestart：setView('selector') 并清 isReplay/isPostRoadshow/roadshowEvaluation。
  - 出处：`src/components/SceneDefenseTraining.tsx:104-110`
  - 出处：`src/components/defense/DefenseReportScreen.tsx:34-42`

**出边 2 条**

- **`e-defense-selector-2-config-navigate`** → `nd-defense-config`（模式参数配置抽屉）｜`navigate` · **implemented（已实现）**
  - 触发：点击任一训练模式卡（6 张卡中的任一张）
  - 逻辑：handleModeClick(mode)：setSelectedMode + setIsDrawerOpen(true) + 按模式预置 config（电梯→单评委；高压追问→单评委+高压；弱项突击→单评委；对抗演练→3 人评委席+高压）。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:47-60`
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:176-186`
  - 备注：卡片内的「配置参数并开始」按钮自身无 onClick，交互靠整卡点击。
- **`e-defense-selector-2-prep-navigate`** → `nd-defense-prep`（赛前解构与靶向题库）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击高亮卡「立即登台演练路演」
  - 载荷：`{ project, mode: roadshow 模式, config: {...config, roadshowDuration:'5min', teleprompterMode:'full_script', autoTransitionToQA:true} }`
  - 逻辑：配置内联构造后直接 onStart(...) —— 不经过配置抽屉（与 e-defense-config-2-prep-navigate 构成平行边：同 from/to，trigger 与载荷来源不同）。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:139-162`
  - 出处：`src/components/SceneDefenseTraining.tsx:65-73`
<!-- EDGES:END -->
