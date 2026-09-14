---
id: nd-defense-report
title: 答辩复盘报告
page: page-defense
kind: panel
importance: high
sources:
  - src/components/defense/DefenseReportScreen.tsx:34-678
---

## 一句话定位

一次训练（或一条历史记录）的收尾报告：总分环 + 高层评语 + 分项得分 + 逐页控时图 + 评委原声点评 + 问答轮次回放 + 四象限行动矩阵，并提供「重新开始 / 重练一次」两个出口。

## 事实（每条强制可回溯）

1. 总分来源有三档优先级：`historyItem.score`（从历史进入时）→ 路演评测 `activeRoadshowEval.totalScore` → 兜底常量 **84**；历史项无分数时也会落到 84。 Sources: [src/components/defense/DefenseReportScreen.tsx:109]() [src/components/defense/DefenseReportScreen.tsx:44-63]()
2. 若为路演模式或本次带了 `roadshowEvaluation`，会**合成一份兜底评测**（`totalScore: 92` 等硬编码字段）供路演专项面板使用。 Sources: [src/components/defense/DefenseReportScreen.tsx:44-63]()
3. 报告结构（自上而下）：顶栏导航（`:113`）→ 主评分环 + 高层评语卡（`:153`，使用 `ScoreRing`）→ **路演专项诊断面板**（`:200`，仅在路演评测存在时）→ 4 项分项得分（`:229`）→ **逐页控时柱状图**（`:268`，消费 `slideDurations`）→ **专家评委实时点评引用**（`:306`）→ **多评委问答轮次回放**（`:329`）→ 四象限行动矩阵（`:592`）。 Sources: [src/components/defense/DefenseReportScreen.tsx:113]() [src/components/defense/DefenseReportScreen.tsx:153]() [src/components/defense/DefenseReportScreen.tsx:200]() [src/components/defense/DefenseReportScreen.tsx:229]() [src/components/defense/DefenseReportScreen.tsx:268]() [src/components/defense/DefenseReportScreen.tsx:306]() [src/components/defense/DefenseReportScreen.tsx:329]() [src/components/defense/DefenseReportScreen.tsx:592]()
4. 图表能力来自同目录 `DefenseCharts.tsx`（评分环、进度条等，带 `setTimeout` 入场动画）。 Sources: [src/components/defense/DefenseCharts.tsx:12-13]()
5. 两个出口：`onRestart`（回选择屏，并清空 `isReplay` / `isPostRoadshow` / `roadshowEvaluation`）与 `onReplay`（置 `isReplay=true` 并回准备屏，从而跳过解构动画直接重练）。 Sources: [src/components/defense/DefenseReportScreen.tsx:34-42]() [src/components/SceneDefenseTraining.tsx:104-115]()
6. 报告屏**不接收本次训练的真实问答内容**：它消费的是 `historyItem` / `roadshowEvaluation` 两个可选 prop，问答消息流（在 `DefenseSessionScreen` 内部 state）不传给它——因此从问答屏交卷进入时，报告里的"点评与轮次"全部来自报告屏自己的常量。 Sources: [src/components/defense/DefenseReportScreen.tsx:25-42]() [src/components/SceneDefenseTraining.tsx:159-167]() [src/components/SceneDefenseTraining.tsx:147-157]()
7. 报告屏同样不落库：`onRestart` 回选择屏后，本屏数据不会被追加进 `RECENT_DEFENSE_HISTORY`。 Sources: [src/components/SceneDefenseTraining.tsx:104-110]()

## 规则与边界（AI 开发硬约束）

- **报告数据与训练数据不连通**是本节点最重要的结构事实：分数来自 `historyItem`/兜底常量，点评与轮次来自屏内常量；「交卷出报告」目前只是视图切换。要让报告真实，先要把 `DefenseSessionScreen` 的消息与用时提升到 `SceneDefenseTraining` 层。 Sources: [src/components/SceneDefenseTraining.tsx:19-63]()
- 路演路径有**两份报告 UI**：本屏（页面级）与 `RoadshowCombinedReportModal`（弹层级）；两者数据源不同（后者由 `RoadshowDefenseStage` 的 `qaResults` 驱动），改文案/指标要双边核对。
- 兜底分 84 / 92 会让人误以为是真实成绩——演示时需明确。
- 分项与图表均按百分比渲染，传入超范围值不会被夹取（无防御）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 报告接本次真实结果 | `:34-42` + `SceneDefenseTraining.tsx:147-157` | 需把问答消息/用时提升为共享状态 |
| 与合并报告弹窗统一 | `RoadshowCombinedReportModal.tsx` | 两套 UI 收敛为一份 |
| 报告导出/分享 | `:113-150`（顶栏） | 当前无导出按钮 |
| 历史记录落库 | `SceneDefenseTraining.tsx:104-110` | 需把 `RECENT_DEFENSE_HISTORY` 改为可变数据 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 3 条**

- **`e-defense-history-2-report-navigate`** ← `nd-defense-history`（实训历史与复盘入口）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击实训历史卡（5 条任一条）
  - 载荷：`{ project: 按 item.projectId 解析出的 DefenseProject, mode: 按 item.modeId 解析出的 ModeDef, historyItem }`
  - 逻辑：onViewReport(proj, m, item) → SceneDefenseTraining.handleViewReport：改写全局 selectedProject 与 selectedMode、记录 activeHistoryItem、setView('report')。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:253-259`
  - 出处：`src/components/SceneDefenseTraining.tsx:93-98`
  - 备注：点历史会改掉当前项目上下文（p1/p2/p3 的记录点进去后，页面不再代表当前学生的项目）。
- **`e-defense-roadshow-2-report-navigate`** ← `nd-defense-roadshow`（全真路演竞技台）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：路演结束弹窗选择「直接生成报告」
  - 载荷：`RoadshowEvaluation（同 generateEvaluation()）`
  - 逻辑：handleFinishRoadshow(evaluation, false) → setView('report')；报告屏用该评测渲染路演专项面板。
  - 出处：`src/components/defense/DefenseRoadshowScreen.tsx:990-1008`
  - 出处：`src/components/SceneDefenseTraining.tsx:83-91`
  - 出处：`src/components/defense/DefenseReportScreen.tsx:44-63`
- **`e-defense-session-2-report-navigate`** ← `nd-defense-session`（问答对抗实训舱）｜`navigate` · **implemented（已实现）**
  - 触发：点顶栏「交卷并生成评审报告」
  - 逻辑：onFinish → SceneDefenseTraining.handleFinish → setView('report')；**不携带任何训练数据**（消息流与逐题用时留在会话屏内部 state）。
  - 出处：`src/components/defense/DefenseSessionScreen.tsx:265-272`
  - 出处：`src/components/SceneDefenseTraining.tsx:100-102`
  - 备注：这是「报告与本次训练不连通」的结构性成因，见 issue-defense-report-not-connected。

**出边 2 条**

- **`e-defense-report-2-selector-navigate`** → `nd-defense-selector`（实训模式选择与项目联动）｜`navigate` · **implemented（已实现）**
  - 触发：点报告屏「重新开始」
  - 逻辑：onRestart → SceneDefenseTraining.handleRestart：setView('selector') 并清 isReplay/isPostRoadshow/roadshowEvaluation。
  - 出处：`src/components/SceneDefenseTraining.tsx:104-110`
  - 出处：`src/components/defense/DefenseReportScreen.tsx:34-42`
- **`e-defense-report-2-prep-navigate`** → `nd-defense-prep`（赛前解构与靶向题库）｜`navigate` · **implemented（已实现）**
  - 触发：点报告屏「重练一次」
  - 逻辑：onReplay → setIsReplay(true) + setView('prep')；准备屏收到 skipAnalysis=true 后跳过 3.3 秒解构动画直接看内容。
  - 出处：`src/components/SceneDefenseTraining.tsx:111-115`
  - 出处：`src/components/defense/DefensePrepScreen.tsx:37`
  - 出处：`src/components/defense/DefensePrepScreen.tsx:49-64`
<!-- EDGES:END -->
