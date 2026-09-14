---
id: page-defense
title: 模拟评审与答辩训练（defense_training）
section: sec-student
importance: high
sources:
  - src/components/SceneDefenseTraining.tsx
  - src/components/defense/DefenseSelectorScreen.tsx
  - src/components/defense/DefensePrepScreen.tsx
  - src/components/defense/DefenseSessionScreen.tsx
  - src/components/defense/DefenseReportScreen.tsx
  - src/components/defense/DefenseCharts.tsx
  - src/components/defense/defenseTypes.ts
  - src/components/defense/defenseConstants.ts
  - src/types.ts
related_pages: [page-coach, page-guidance]
---

# 模拟评审与答辩训练（defense_training）

## 一句话定位

一个**四屏有限状态机**（selector → prep → session → report）的答辩实训模块：5 种训练模式 × 可配置评委席（单/多评委、3 级风格、轮次、单题时限），结束后产出六维雷达报告与逐轮复盘。

## 事实（每条强制可回溯）

### 一、状态机与入口

1. 顶层容器仅 **133 行**，唯一状态是 `view: 'selector' | 'prep' | 'session' | 'report'`，默认 `selector`。`Sources: [src/components/SceneDefenseTraining.tsx:15-16]()`
2. 四屏渲染是与 `view` 严格一一对应的条件块，无路由、无 URL 同步。`Sources: [src/components/SceneDefenseTraining.tsx:91-131]()`
3. 四个子屏各自是独立文件，分别 482 / 316 / 463 / 443 行。`Sources: [src/components/defense/DefenseSelectorScreen.tsx:29-29]()` `Sources: [src/components/defense/DefensePrepScreen.tsx:29-29]()` `Sources: [src/components/defense/DefenseSessionScreen.tsx:29-29]()` `Sources: [src/components/defense/DefenseReportScreen.tsx:32-32]()`
4. 状态迁移共 6 个处理器：`handleStartPrep`（selector→prep）、`handleStartSession`（prep→session）、`handleFinish`（session→report）、`handleViewReport`（selector→report，看历史）、`handleRestart`（→selector）、`handleReplay`（→prep 且 `isReplay=true`）。`Sources: [src/components/SceneDefenseTraining.tsx:58-89]()`
5. 回放路径把 `skipAnalysis` 传给 prep 屏，用于跳过分析动画直接进入。`Sources: [src/components/SceneDefenseTraining.tsx:86-89]()` `Sources: [src/components/SceneDefenseTraining.tsx:101-110]()`
6. **项目对象在此被跨域转换**：`getDefenseProject(ProjectItem?) → DefenseProject`，把 `strengthsLabels` / `trackLabel` / `stageName` / `grade` 映射为 `summary` + 4 个 tag（末位硬编码「已入选国赛攻坚」）；无项目时回落 `MOCK_DEFENSE_PROJECTS[0]`。`Sources: [src/components/SceneDefenseTraining.tsx:18-37]()`
7. 切换全局项目时通过 effect 依赖 `currentProject?.id / .name` 重建 `selectedProject`。`Sources: [src/components/SceneDefenseTraining.tsx:41-45]()`
8. 本模块**声明的 props 是 `currentProject` / `session`**，且用了显式类型注解（`{ currentProject, session }: SceneDefenseTrainingProps`），props 契约是真实受检的。`Sources: [src/components/SceneDefenseTraining.tsx:10-15]()`

### 二、训练模式（5 种）

9. `TrainingMode` 枚举 5 值：`standard | elevator | followup | weakness | adversarial`。`Sources: [src/components/defense/defenseTypes.ts:3-3]()`
10. `TRAINING_MODES` 全量定义（含图标、配色、标签、徽章）：

| id | 名称 | 徽章 | tags |
|---|---|---|---|
| `standard` | 标准答辩 | 推荐 | 多轮对话 / 动态追问 / 六维评审 |
| `elevator` | 电梯演讲 | 速通 | 限时表达 / 结构训练 / 1min/3min |
| `followup` | 高压追问 | — | 连环追问 / 逻辑深度 / 承压抗击 |
| `weakness` | 弱项突击 | — | 精准补短 / 历史画像 / 定向突击 |
| `adversarial` | 对抗性演练 | 硬核 | 极限施压 / 逻辑挑刺 / 心理素质 |

`Sources: [src/components/defense/defenseConstants.ts:36-95]()`

11. 默认模式取 `TRAINING_MODES[0]`（即标准答辩）。`Sources: [src/components/SceneDefenseTraining.tsx:47-47]()`
12. 「弱项突击」的描述写明会自动读取"网评对标六维画像"定向出题 —— 但本模块内**没有**读取六维数据的实现，属文案与实现未对齐。`Sources: [src/components/defense/defenseConstants.ts:72-82]()`

### 三、评委席配置

13. `DefenseSessionConfig` 五个字段，取值域均被枚举约束：`judgeMode: single|panel`、`difficulty: friendly|standard|high_pressure`、`rounds: unlimited|3|5|8`、`timeLimit: 60|90|120`、`elevatorDuration?: 1min|3min`。`Sources: [src/components/defense/defenseTypes.ts:42-48]()`
14. 默认配置在容器里硬编码：单评委 / 标准 / 不限轮次 / 90 秒 / 1 分钟。`Sources: [src/components/SceneDefenseTraining.tsx:48-54]()`
15. 配置 UI 在 selector 屏的**滑出抽屉**里，四段：评委席规模（329）、风格难度（354）、电梯演讲时长（380，仅 elevator 模式）、单题时限（435）。`Sources: [src/components/defense/DefenseSelectorScreen.tsx:271-290]()` `Sources: [src/components/defense/DefenseSelectorScreen.tsx:327-457]()`

### 四、四屏各自的职责

16. **Selector**：顶栏（66）+ 当前项目横幅（100，与左侧栏全局项目同步）+ 5 个模式卡（136）+ 最近训练历史（222）+ 配置抽屉（271）。`Sources: [src/components/defense/DefenseSelectorScreen.tsx:66-66]()` `Sources: [src/components/defense/DefenseSelectorScreen.tsx:100-100]()` `Sources: [src/components/defense/DefenseSelectorScreen.tsx:136-152]()` `Sources: [src/components/defense/DefenseSelectorScreen.tsx:222-270]()`
17. **Prep**：三段假加载（1100 / 2200 / 3300 ms）后进入双列——左列"亮点与疑点"，右列"预测题库"。`Sources: [src/components/defense/DefensePrepScreen.tsx:40-60]()` `Sources: [src/components/defense/DefensePrepScreen.tsx:175-176]()` `Sources: [src/components/defense/DefensePrepScreen.tsx:250-250]()`
18. **Session**：左列交互式聊天流（判官/用户消息二分），右列评委人设卡 + 实时焦点卡 + 小贴士 + 结束 CTA；底部含倒计时进度条、录音均衡器动画与输入区。`Sources: [src/components/defense/DefenseSessionScreen.tsx:188-189]()` `Sources: [src/components/defense/DefenseSessionScreen.tsx:198-198]()` `Sources: [src/components/defense/DefenseSessionScreen.tsx:265-340]()` `Sources: [src/components/defense/DefenseSessionScreen.tsx:384-448]()`
19. Session 屏的计时与开场白都由 `setInterval` / `setTimeout` 驱动（纯模拟）；作答耗时按 `config.timeLimit - timeLeft` 反推。`Sources: [src/components/defense/DefenseSessionScreen.tsx:53-62]()` `Sources: [src/components/defense/DefenseSessionScreen.tsx:89-93]()`
20. **Report**：主分卡 + 六维雷达 + 弱项进度条 + 三轮复盘（第 2 轮被标注为"弱项"）+ 四宫格行动矩阵 + 底部 CTA。`Sources: [src/components/defense/DefenseReportScreen.tsx:98-144]()` `Sources: [src/components/defense/DefenseReportScreen.tsx:145-202]()` `Sources: [src/components/defense/DefenseReportScreen.tsx:203-213]()` `Sources: [src/components/defense/DefenseReportScreen.tsx:259-259]()` `Sources: [src/components/defense/DefenseReportScreen.tsx:357-423]()`
21. 报告总分取 `historyItem?.score || 84` —— **84 分是硬编码兜底**。`Sources: [src/components/defense/DefenseReportScreen.tsx:54-54]()`
22. 报告雷达数据（6 维）在屏内本地定义，未从 session 真实结果传入。`Sources: [src/components/defense/DefenseReportScreen.tsx:41-49]()`
23. 报告图表由 `DefenseCharts.tsx` 提供两个导出组件：`ScoreRing`（环形分数）与 `RadarChart`（290px 雷达）。`Sources: [src/components/defense/DefenseCharts.tsx:9-9]()` `Sources: [src/components/defense/DefenseCharts.tsx:81-81]()`
24. 历史记录 `RECENT_DEFENSE_HISTORY` 与配色表 `DIMENSION_COLORS` 定义在常量文件。`Sources: [src/components/defense/defenseConstants.ts:97-143]()` `Sources: [src/components/defense/defenseConstants.ts:144-151]()`

### 五、与其他模块的数据共享

25. `DefenseMessage` 只有 `role: 'judge' | 'user'` 两种角色（无 system），字段为 id / content / time? / tag?。`Sources: [src/components/defense/defenseTypes.ts:27-33]()`
26. `DefenseHistoryItem` 记录 modeId / modeName / projectId / status（`进行中 | 已结束`）/ stats / score? / date。`Sources: [src/components/defense/defenseTypes.ts:50-60]()`
27. 教练模块的 4.3 **浅度调用**（一次性出 5 题）与本模块是**两套独立实现**，但共享考官人设与题库数据源 `mockJudgePersonas` / `mockJudgeQuestionsMap`（定义在 `src/data/mockCoachData.ts`）。`Sources: [src/data/mockCoachData.ts:305-306]()` `Sources: [src/data/mockCoachData.ts:371-372]()`
28. 通用柱状/雷达组件 `RadarChart.tsx`（教练侧使用，接受 `value` / `benchmark` 双序列）与本模块的 `DefenseCharts.RadarChart`（只接受单序列 `value`）**是两个不同组件**。`Sources: [src/components/RadarChart.tsx:19-19]()` `Sources: [src/components/defense/DefenseCharts.tsx:81-81]()`

## 规则与边界（AI 开发硬约束）

- **新增一屏 = 4 处改动**：`view` 联合类型（16）、渲染条件块（91-131）、至少一个迁移处理器（58-89）、以及被调用屏的 props。漏了渲染块不会报错，只会白屏。
- **本模块是纯前端模拟，没有真实 LLM**：加载、计时、流式打字、报告分数全是定时器与硬编码。任何"接入真实答辩引擎"的工作都要替换 `DefensePrepScreen.tsx:49-51`、`DefenseSessionScreen.tsx:53-62`、`DefenseReportScreen.tsx:54` 三处。
- **默认配置有两处真相**：容器里的 `currentConfig` 初值（48-54）与 selector 抽屉里的控件初值。改默认值必须两处同步，否则会出现"抽屉显示 A、实际使用 B"。
- **`DefenseSessionConfig` 用字面量联合而不是 enum**，所以新增档位（例如 `timeLimit: 150`）必须同时改类型（`defenseTypes.ts:42-48`）与 UI 选项（`DefenseSelectorScreen.tsx:327-457`），TS 会在类型处报错但不会检查 UI 是否补齐。
- **`elevatorDuration` 只在 `elevator` 模式下有意义**，但字段是全局可选的。新增"仅某模式可用的配置项"要沿用这个范式（可选字段 + 条件渲染）。
- **模式描述里的承诺要核对实现**：「弱项突击」声称读取六维画像、但代码里没有；改文案或补实现时必须二者对齐（否则页面上会存在无法兑现的能力描述）。
- **不要改 `DefenseProject` 的构造顺序前提**：`getDefenseProject` 依赖 `ProjectItem.strengthsLabels` 可能为空、`grade`/`stageName` 可选，新增字段时要保持可选链容错。
- **本模块的 props 是真受检的（显式注解）**，与 page-guidance 的 `React.FC` 情况相反 —— 在本模块改 props 会真实报编译错，这是好事，别改成 `React.FC` 写法。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 新增训练模式 | `defenseTypes.ts:3` 加 TrainingMode → `defenseConstants.ts:36-95` 加 ModeDef → 若需专属配置再加 `defenseTypes.ts:42-48` 与 `DefenseSelectorScreen.tsx:327-457` |
| 改评委席配置项 | `DefenseSelectorScreen.tsx:327-457`（UI）+ `defenseTypes.ts:42-48`（类型）+ 容器初值 `SceneDefenseTraining.tsx:48-54` |
| 改报告维度/雷达 | `DefenseReportScreen.tsx:41-49`（数据）+ `DefenseCharts.tsx:81`（图形） |
| 改逐轮复盘内容 | `DefenseReportScreen.tsx:203-356` |
| 改会话屏交互 | `DefenseSessionScreen.tsx:89-131`（发送）+ `265-383`（底部控制） |
| 加一屏 | 见规则节「4 处改动」 |
| 接入真实引擎 | 三处模拟点：`DefensePrepScreen.tsx:49-51`、`DefenseSessionScreen.tsx:53-62`、`DefenseReportScreen.tsx:54` |
| 改默认模式 | `SceneDefenseTraining.tsx:47` |

## 与 related_pages 的联动提示

- → **page-coach**：教练模块的 4.3 浅调与本模块**共享考官/题库数据但实现独立**（一个是会话内富卡、一个是四屏状态机）。改 `mockJudgePersonas` / `mockJudgeQuestionsMap` 会同时影响两边。
- → **page-guidance**：`DefenseProject` 由 `ProjectItem` 转换而来，而 `ProjectItem` 正是指导工作台误读字段的同一个类型；两者都属"ProjectItem 的跨域消费方"，改 `ProjectItem` 字段要一起核。
- 注意：本模块的 `DefenseCharts.RadarChart` 与公共 `RadarChart.tsx` 是两个组件，改雷达视觉时先确认改的是哪一个。
- 组件命名冲突提醒：`defense/DefenseCharts.tsx` 导出的 `RadarChart` 与 `components/RadarChart.tsx` 的默认导出同名，同文件内同时 import 需重命名（`as`）。
