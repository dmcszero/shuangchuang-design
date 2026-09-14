---
id: nd-defense-session
title: 问答对抗实训舱
page: page-defense
kind: panel
importance: high
sources:
  - src/components/defense/DefenseSessionScreen.tsx:33-572
---

## 一句话定位

一对一（或多评委）的问答对抗主战场：评委先开口、学员限时作答、AI 按轮次追问，右侧实时看自己的摄像头画面与评委画像，随时可交卷出报告——**全库唯一接入了真实语音识别与录音的对话界面**。

## 事实（每条强制可回溯）

1. 页面状态：`messages`（问答消息流）、`input`、`isRecording`、`timeLeft`、`isStreaming`、`roundCount`、`showVideoWindow`；另有 `scrollRef` 与 `recognitionRef`。 Sources: [src/components/defense/DefenseSessionScreen.tsx:43-50]()
2. **真实语音识别**：`toggleVoiceRecording` 使用 `window.SpeechRecognition || window.webkitSpeechRecognition`（`lang='zh-CN'`、`continuous`、`interimResults`），识别片段拼接到输入框；浏览器不支持该 API 时降级为「假装录音 2 秒」并自动停止。 Sources: [src/components/defense/DefenseSessionScreen.tsx:54-102]()
3. 倒计时每秒递减（`config.timeLimit || 90` 起），回答提交后**重置为本轮时限**；格式化输出为 `mm:ss`。 Sources: [src/components/defense/DefenseSessionScreen.tsx:124-131]() [src/components/defense/DefenseSessionScreen.tsx:203-208]() [src/components/defense/DefenseSessionScreen.tsx:250-254]()
4. 开场白在挂载后 1.4 秒出现，按四种情形写死文案：① 路演转入（`isPostRoadshow`，含 15 纳秒激光干涉、3500 万订单等具体数字）；② 电梯演讲；③ 高压追问；④ 对抗演练；⑤ 其他（标准答辩）。 Sources: [src/components/defense/DefenseSessionScreen.tsx:132-190]()
5. 提交回答 `handleSend`：记录本轮用时（`时限 - 剩余`，为 0 时取满时限）→ 追加用户消息 → 清空输入、重置计时、停止录音 → `roundCount+1` → 2.2 秒后追加 AI 追问。 Sources: [src/components/defense/DefenseSessionScreen.tsx:192-215]()
6. AI 追问是**按轮次写死的三段文案**（第 1 轮问现金流/交付周期、第 2 轮问职务发明与专利排他协议、第 3 轮起说目标轮次已完成、可交卷），**与学员回答内容无关**。 Sources: [src/components/defense/DefenseSessionScreen.tsx:217-244]()
7. 底部提供 3 枚**快速回答 chips**（先发数据飞轮 / 已签概念验证与到账金额 / 已取得高校专利排他许可），点击即填入输入框，用于快速演示。 Sources: [src/components/defense/DefenseSessionScreen.tsx:212-217]() [src/components/defense/DefenseSessionScreen.tsx:367-380]()
8. 顶栏五个元素：返回键、模式徽标（`{mode.name}舱`）、项目名、视讯连线开关（`showVideoWindow`）、当前轮次（`第 {roundCount} 轮`）、「交卷并生成评审报告」按钮（→ `onFinish` → 复盘屏）。 Sources: [src/components/defense/DefenseSessionScreen.tsx:220-273]()
9. 路演转入时顶部额外渲染紫色横幅「路演陈述已结束，无缝转入评委针对性现场答辩」+「靶向追问模式」标记。 Sources: [src/components/defense/DefenseSessionScreen.tsx:278-292]()
10. 右栏是「视讯窗口（真实摄像头）+ 评委人设 + 实时聚焦 + 提前交卷」，与左栏消息流并列；主舞台高度固定 `h-[74vh]`。 Sources: [src/components/defense/DefenseSessionScreen.tsx:277]() [src/components/defense/DefenseSessionScreen.tsx:484-570]()
11. **赛制配置里的轮次/时限只影响计时与展示，不改变追问分支**：`config.rounds` 未参与追问逻辑（追问只看 `roundCount` 的 1/2/其他）。 Sources: [src/components/defense/DefenseSessionScreen.tsx:217-244]()

## 规则与边界（AI 开发硬约束）

- 这是**唯一有真实设备能力的问答界面**：`getUserMedia`（摄像头/麦克风，在 `DefenseVideoWindow` 内）+ `SpeechRecognition`（语音转文字）；改这块必须处理权限拒绝与 API 缺失两种降级。
- AI 追问是剧本不是模型：**无论学员怎么答，第 1/2 轮的追问都一样**；要让它"听懂"就得替换 `handleSend` 的 setTimeout 分支。
- 交卷不产生任何落库：`onFinish` 只切视图，报告屏自己另算分（见 `nd-defense-report`）。
- 计时器 effect 依赖为空数组（`:124-131`），**切模式或重进不会重建计时器**，且倒计时到 0 后不会自动交卷。
- 语音识别的中间结果会不断追加到输入框（`interim` + 拼接），用户需自己删改；识别失败静默降级、无提示。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 追问接真实 LLM | `:217-244` | 需引入异步流式渲染 + `isStreaming` 语义 |
| 让 `config.rounds` 真正生效 | `:192-244` | 追问分支与交卷判断 |
| 倒计时到点自动交卷 | `:124-131` | 与 `onFinish` 联动 |
| 语音识别失败提示 | `:54-102` | 需新增 UI（当前静默） |
| 评委画像从 mock 换成真实 | `:484-570` | 与 `defenseConstants` 的 `MOCK_VIRTUAL_JUDGES` 同源 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-defense-prep-2-session-navigate`** ← `nd-defense-prep`（赛前解构与靶向题库）｜`navigate` · **implemented（已实现）**
  - 触发：点启动按钮且 mode.id ≠ 'roadshow'
  - 逻辑：同上分流逻辑的 else 分支（标准答辩 / 电梯演讲 / 高压追问 / 弱项突击 / 对抗演练 均进问答屏）。
  - 出处：`src/components/defense/DefensePrepScreen.tsx:180-188`
  - 出处：`src/components/SceneDefenseTraining.tsx:75-81`
- **`e-defense-roadshow-2-session-navigate`** ← `nd-defense-roadshow`（全真路演竞技台）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：路演结束弹窗选择「转入评委问答」
  - 载荷：`RoadshowEvaluation{totalScore, slideDurations[], ...}（由 generateEvaluation() 生成）`
  - 逻辑：handleFinishRoadshow(evaluation, true) → setIsPostRoadshow(true) + setView('session')；问答屏据此切换为「路演陈述已结束，无缝转入评委针对性现场答辩」横幅与靶向追问开场白。
  - 出处：`src/components/defense/DefenseRoadshowScreen.tsx:986-1010`
  - 出处：`src/components/SceneDefenseTraining.tsx:83-91`
  - 出处：`src/components/defense/DefenseSessionScreen.tsx:132-156`

**出边 1 条**

- **`e-defense-session-2-report-navigate`** → `nd-defense-report`（答辩复盘报告）｜`navigate` · **implemented（已实现）**
  - 触发：点顶栏「交卷并生成评审报告」
  - 逻辑：onFinish → SceneDefenseTraining.handleFinish → setView('report')；**不携带任何训练数据**（消息流与逐题用时留在会话屏内部 state）。
  - 出处：`src/components/defense/DefenseSessionScreen.tsx:265-272`
  - 出处：`src/components/SceneDefenseTraining.tsx:100-102`
  - 备注：这是「报告与本次训练不连通」的结构性成因，见 issue-defense-report-not-connected。
<!-- EDGES:END -->
