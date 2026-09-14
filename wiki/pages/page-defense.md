---
id: page-defense
title: 模拟答辩训练
section: sec-coach
importance: high
view: defense_training
component: src/components/SceneDefenseTraining.tsx
sources:
  - src/components/SceneDefenseTraining.tsx:1-171
related_pages: ["page-coach", "page-workbench", "page-guidance"]
nodes:
  - nd-defense-selector
  - nd-defense-config
  - nd-defense-history
  - nd-defense-prep
  - nd-defense-roadshow
  - nd-defense-session
  - nd-defense-report
---

## 一句话定位

五屏串联的答辩实训流水线：选模式 → 赛前解构 → （路演）/（问答对抗）→ 复盘报告。它是全库**唯一接入真实设备能力**（摄像头、麦克风、语音识别、语音合成）的页面，也是学生端「临场感」最强的模块。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'defense_training'` 时挂载，只接收 `currentProject` 与 `session` 两个 prop。 Sources: [src/App.tsx:674-679]()
2. 本页**不在沉浸式白名单**内（白名单为 coach/new_chat/guidance_workbench/asset_management），因此外层可滚动、有常规内边距与全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]() [src/App.tsx:783-787]()
3. 页面根容器带稳定 id `scene-defense-training`。 Sources: [src/components/SceneDefenseTraining.tsx:117]()

**二、五屏路由与页面级 state（不单独下钻）**

4. `view` 状态机：`selector | prep | roadshow | session | report`，初值 `selector`；每个分支都要求 `selectedProject && selectedMode` 才渲染（否则白屏）。 Sources: [src/components/SceneDefenseTraining.tsx:18]() [src/components/SceneDefenseTraining.tsx:118-170]()
5. `handleStartSession()` 按模式分流：`roadshow` 进路演屏，其余进问答屏。 Sources: [src/components/SceneDefenseTraining.tsx:75-81]()
6. `handleFinishRoadshow(evalData, proceedToQA)` 是路演的分叉点：`proceedToQA=true` 时置 `isPostRoadshow` 并进问答屏，否则直接进报告屏。 Sources: [src/components/SceneDefenseTraining.tsx:83-91]()
7. 页面级 state 共 8 个：`view` / `selectedProject` / `selectedMode` / `currentConfig` / `isReplay` / `activeHistoryItem` / `isPostRoadshow` / `roadshowEvaluation`。 Sources: [src/components/SceneDefenseTraining.tsx:18-63]()
8. **项目随侧栏联动**：`getDefenseProject(currentProject)` 把 `ProjectItem` 映射为 `DefenseProject`（赛道=`trackLabel · groupLabel`，标签含阶段/评级/「已入选国赛攻坚」），并在 `currentProject` 变化时同步；项目为空时回落 `MOCK_DEFENSE_PROJECTS[0]`。 Sources: [src/components/SceneDefenseTraining.tsx:19-48]()

**三、子组件与文件构成（不在 structure.json 初始 relevant_files 内，此处补登）**

9. 本页共 12 个文件：主控 `SceneDefenseTraining.tsx` + 5 个屏幕（Selector / Prep / Roadshow / Session / Report）+ 4 个支撑组件（`DefenseVideoWindow` 摄像头窗口、`RoadshowDefenseStage` 舞台问答、`RoadshowCombinedReportModal` 合并报告弹窗、`DefenseCharts` 图表）+ `defenseConstants.ts`（模式/评委/幻灯片/历史常量）+ `defenseTypes.ts`（类型）。 Sources: [src/components/defense/DefenseRoadshowScreen.tsx:37-39]() [src/components/defense/DefenseSessionScreen.tsx:22]() [src/components/defense/DefenseReportScreen.tsx:20-24]()
10. 真实设备能力分布在两个子组件：`DefenseVideoWindow`（`getUserMedia` 摄像头/麦克风 + 姿态定时器）与 `RoadshowDefenseStage`（`speechSynthesis` 朗读提问 + 录音）；问答屏另有 `webkitSpeechRecognition` 语音转写。 Sources: [src/components/defense/DefenseVideoWindow.tsx:64-120]() [src/components/defense/RoadshowDefenseStage.tsx:151-170]() [src/components/defense/DefenseSessionScreen.tsx:54-102]()

## 规则与边界（AI 开发硬约束）

- **与 `page-coach` 的页内答辩是两套实现**：本页是完整演练（5 屏 / 录像 / 计时 / 多模式），`page-coach` 的 `nd-coach-defense` 是会话内 2 轮轻量版；两处题库各自 mock（`defenseConstants` vs `mockCoachData`），**不共享**。
- 五屏之间的数据流是**单向且窄的**：项目/模式/配置三个 prop 下行，回调用 `onStart*`/`onFinish*` 上行；中间过程数据（问答消息、逐页用时明细）**留在各自屏幕内部**，这正是报告屏数据不真实的原因（见 `nd-defense-report`）。
- 本页所有语料（幻灯片、评委、题目、点评、追问、亮点疑点）都是**写死的「深瞳视界」素材**，与学员真实项目无关；项目名只在标题与开场白里被插值。
- `isReplay` 是唯一的「跳过解构动画」开关，只在报告屏「重练一次」路径被置真。
- 训练结果**不落库**：五屏走完不写任何持久化数据，历史记录仍是常量。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接入真实项目材料（BP/PPT） | `SceneDefenseTraining.tsx:19-40` | 会影响路演幻灯片与题库两处常量 |
| 训练结果落库（历史/报告） | `SceneDefenseTraining.tsx:104-115` | `RECENT_DEFENSE_HISTORY` 改为可变数据 |
| 与 `page-coach` 页内答辩统一题库 | — | 见 issue `issue-product-coach-session-unification` 的相邻议题 |
| 权限/降级体验优化 | `DefenseVideoWindow.tsx:64-120` | 影响路演与问答两屏 |
| 新增第六种训练模式 | `defenseConstants.ts:37-109` | 抽屉条件 + 开场白分支 + 本页分流（`handleStartSession`） |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-defense-selector` | 实训模式选择与项目联动 | panel | Selector 76-248 | → `nd-defense-config`（点卡片开抽屉） |
| `nd-defense-config` | 模式参数配置抽屉 | drawer | Selector 299-611 | → `nd-defense-prep`（onStart） |
| `nd-defense-history` | 实训历史与复盘入口 | list | Selector 250-297 | → `nd-defense-report`（onViewReport） |
| `nd-defense-prep` | 赛前解构与靶向题库 | panel | Prep 29-334 | → `nd-defense-roadshow` / `nd-defense-session`（onStartSession） |
| `nd-defense-roadshow` | 全真路演竞技台 | panel | Roadshow 49-1011 | → `nd-defense-session`（转入问答）/ `nd-defense-report`（结束） |
| `nd-defense-session` | 问答对抗实训舱 | panel | Session 33-572 | → `nd-defense-report`（交卷） |
| `nd-defense-report` | 答辩复盘报告 | panel | Report 34-678 | → `nd-defense-selector`（重新开始）/ `nd-defense-prep`（重练一次） |

> 未下钻为节点的页面级结构：五屏路由与状态机（SceneDefenseTraining 18-63）、顶栏/页脚（壳层 `shell-topbar` / 全局 footer）、`RoadshowCombinedReportModal` 合并报告弹窗（路演屏内弹层，与报告屏功能重叠，见 `nd-defense-report` 规则）。
>
> **拆分依据**：七个节点各自有独立状态域与独立出口；其中「选择器」拆出「配置抽屉」与「历史」两块——抽屉有自己的临时配置态与启动出口，历史有自己的数据域与出口（且会改写全局 `selectedProject`，语义独立）。

## 与 related_pages 的联动提示

- **→ `page-coach`（AI 助手）**：会话里也能跑轻量答辩（`nd-coach-defense`），两处入口不同（推荐任务胶囊 vs 答辩页），题库与评分口径都不共享。
- **→ `page-workbench`（项目工作台）**：工作台体检区的「评委尖锐提问攻防演练」产品口径已定「不走动态待办」，**建议去向是本页的问答对抗**（待拍板 `e-workbench-diag-questions-2-defense`）；当前代码零连接。
- **→ `page-guidance`（全链路指导工作台）**：无代码连接；本页产出的报告不会回流到工作台的评分/版本体系。
- **→ 与登录/项目上下文**：本页项目取自 `currentMemberProject`（侧栏联动），与 `page-coach` 的兜底项目名口径不一致（见 issue `issue-coach-project-context-unbound`）。
