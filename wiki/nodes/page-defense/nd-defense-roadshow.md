---
id: nd-defense-roadshow
title: 全真路演竞技台
page: page-defense
kind: panel
importance: high
sources:
  - src/components/defense/DefenseRoadshowScreen.tsx:49-1011
---

## 一句话定位

16:9 大屏投影式路演演练场：倒计时在走、幻灯片在翻、提词在右、评委席在反应，右侧还能开真实摄像头看自己的台风——结束后无缝转入问答或直接出合并报告。

## 事实（每条强制可回溯）

1. 时长由 `config.roadshowDuration` 映射：3min→180s / 5min→300s（默认）/ 8min→480s / 10min→600s。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:57-64]()
2. 页面状态达 15 个：`timeLeft` / `isRunning` / `currentSlideIndex` / `activeRightTab`（提词/评委/视频）/ `showVideoWindow` / `videoPlacement`（画中画/侧栏）/ `isLaserPointerActive` / `laserPos` / `isAutoSpeechPlaying` / `showFinishModal` / `slideTimeSpent[]` / `judges` / `speechPacingStatus`（slow/optimal/fast）/ `qaResults` / `showCombinedReportModal`。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:65-79]()
3. 主计时器每秒 tick：倒计时归零时若当前页索引 < 8 则**直接跳到第 9 页（索引 8，答辩页）**；同时累计当前页停留秒数到 `slideTimeSpent`。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:85-110]()
4. 评委席会根据**当前幻灯片**动态改写 4 位评委的心情与旁白（`reactionText`），例如第 3 页触发「对15纳秒曝光瞬态冻结和差分消噪专利大为赞赏」、第 6 页触发「在手3500万订单与宁王180天驻厂中试极具说服力」——全是硬编码映射。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:111-150]() [src/components/defense/defenseConstants.ts:177-230]()
5. 幻灯片数据源为常量 `MOCK_ROADSHOW_SLIDES`，每页含 `plannedSeconds` 用于语速评估（`< planned*0.7` 判慢等三档）。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:82]() [src/components/defense/DefenseRoadshowScreen.tsx:150-180]()
6. 页头控制条含：返回、数字倒计时、暂停/继续（`isRunning`）、**激光笔开关**（开启后在 PPT 容器上跟踪鼠标坐标 `laserPos`）、视讯窗口开关、结束路演。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:268-373]() [src/components/defense/DefenseRoadshowScreen.tsx:151-165]()
7. 主舞台左 16:9 投影（带 `pptContainerRef`）+ 右栏三 tab：**提词**（逐页讲稿/要点 + 「试听国赛冠军语速标准范例」按钮，实为 `speechSynthesis` 语音合成朗读）、**评委席**（4 位评委实时反应），**视频**（真实摄像头窗口）。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:374-700]() [src/components/defense/DefenseRoadshowScreen.tsx:763-780]()
8. 投影页底部嵌 **`RoadshowDefenseStage`**：进入答辩页后由它驱动多轮问答，完成后通过 `onCompleteDefense(results)` 把 `DefenseQAResult[]` 回写到 `qaResults`。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:427-440]() [src/components/defense/RoadshowDefenseStage.tsx:38]() [src/components/defense/RoadshowDefenseStage.tsx:428]()
9. 结束路演 → 完成弹窗（`:905-985`）→ 可直接进 `RoadshowCombinedReportModal`（路演 + 问答合并报告）或调 `onFinishRoadshow(generateEvaluation(), proceedToQA)` 转入问答屏 / 复盘屏。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:254-266]() [src/components/defense/DefenseRoadshowScreen.tsx:986-1010]()
10. `generateEvaluation()` 产出的评分是**公式化的硬编码**：完成度 = `(currentSlideIndex+1)/总页数*100`、舞台表现分按 `isAutoSpeechPlaying ? 88 : 94`、逐页用时取 `slideTimeSpent`。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:182-230]()
11. **真实设备能力集中在右侧**：`DefenseVideoWindow` 调 `navigator.mediaDevices.getUserMedia` 打开摄像头/麦克风（拒绝授权时降级为占位），`RoadshowDefenseStage` 用 `speechSynthesis` 朗读评委提问、用 `getUserMedia({audio:true})` 录音。 Sources: [src/components/defense/DefenseVideoWindow.tsx:64-120]() [src/components/defense/RoadshowDefenseStage.tsx:151-170]() [src/components/defense/RoadshowDefenseStage.tsx:268-280]()
12. 摄像头开启时会启一个**姿态检测定时器**（`postureTimer`）周期性刷新姿态提示，与真实 CV 无关（随机/规则模拟）。 Sources: [src/components/defense/DefenseVideoWindow.tsx:271-284]()

## 规则与边界（AI 开发硬约束）

- **本节点是全库唯一使用真实浏览器设备 API 的地方**（摄像头 / 麦克风 / 语音合成）；改动时要考虑权限被拒、无设备、非 HTTPS 三种降级路径，别把 `permissionStatus` 分支删掉。
- 幻灯片内容、评委反应、语速标准全是常量（`MOCK_ROADSHOW_SLIDES` / `MOCK_VIRTUAL_JUDGES`），**与学员项目无关**；接入真实项目材料是「路演可用」的前置条件。
- 计时器 effect 依赖 `[isRunning, currentSlideIndex]`：每次翻页都会重建 interval，**翻页瞬间会重置这一秒的计数**（改计时逻辑要留意）。
- 结束弹窗是「继续问答 / 直接出报告」的分叉点，与 `SceneDefenseTraining.isPostRoadshow` 联动：选「继续问答」会把 `isPostRoadshow=true` 传给问答屏，从而启用地道靶向追问开场白。
- 合并报告弹窗（`RoadshowCombinedReportModal`）与报告屏（`nd-defense-report`）是两套报告 UI，改一处别忘另一处。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 幻灯片接真实 PPT/项目材料 | `:82` + `defenseConstants.ts` 的 `MOCK_ROADSHOW_SLIDES` | 会波及提词、语速评估、页数判断（`<8`） |
| 真实评分替换硬编码 | `:182-230` | `RoadshowEvaluation` 类型与报告屏消费 |
| 提词语音改为真实 TTS 服务 | `:763-780` | 当前用浏览器 `speechSynthesis` |
| 激光笔改为真实指针 | `:151-165` | 纯前端，注意容器坐标系 |
| 摄像头权限失败的最优降级 | `DefenseVideoWindow.tsx:64-120` | 影响问答屏与路演屏两处复用 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-defense-prep-2-roadshow-navigate`** ← `nd-defense-prep`（赛前解构与靶向题库）｜`navigate` · **implemented（已实现）**
  - 触发：点启动按钮且 mode.id === 'roadshow'
  - 逻辑：onStartSession → SceneDefenseTraining.handleStartSession：roadshow 模式 setView('roadshow')，其余 setView('session')。
  - 出处：`src/components/defense/DefensePrepScreen.tsx:95-104`
  - 出处：`src/components/SceneDefenseTraining.tsx:75-81`

**出边 2 条**

- **`e-defense-roadshow-2-session-navigate`** → `nd-defense-session`（问答对抗实训舱）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：路演结束弹窗选择「转入评委问答」
  - 载荷：`RoadshowEvaluation{totalScore, slideDurations[], ...}（由 generateEvaluation() 生成）`
  - 逻辑：handleFinishRoadshow(evaluation, true) → setIsPostRoadshow(true) + setView('session')；问答屏据此切换为「路演陈述已结束，无缝转入评委针对性现场答辩」横幅与靶向追问开场白。
  - 出处：`src/components/defense/DefenseRoadshowScreen.tsx:986-1010`
  - 出处：`src/components/SceneDefenseTraining.tsx:83-91`
  - 出处：`src/components/defense/DefenseSessionScreen.tsx:132-156`
- **`e-defense-roadshow-2-report-navigate`** → `nd-defense-report`（答辩复盘报告）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：路演结束弹窗选择「直接生成报告」
  - 载荷：`RoadshowEvaluation（同 generateEvaluation()）`
  - 逻辑：handleFinishRoadshow(evaluation, false) → setView('report')；报告屏用该评测渲染路演专项面板。
  - 出处：`src/components/defense/DefenseRoadshowScreen.tsx:990-1008`
  - 出处：`src/components/SceneDefenseTraining.tsx:83-91`
  - 出处：`src/components/defense/DefenseReportScreen.tsx:44-63`
<!-- EDGES:END -->
