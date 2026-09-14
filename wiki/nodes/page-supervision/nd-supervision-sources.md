---
id: nd-supervision-sources
title: 会议纪要与项目材料
page: page-supervision
kind: panel
importance: medium
sources:
  - src/components/SupervisionClosure.tsx:1313-1475
---

## 一句话定位

工单的另两个 tab（只读）：**会议音视频与 ASR 纪要**（哪次会、说了什么、关键发言时间点）与**项目原始材料与初始诊断**（导师接单时项目长什么样）——给导师「回头看依据」的两个面。

## 事实（每条强制可回溯）

1. **TAB 3 会议音视频与 ASR 纪要**（`:1313-1408`）读 `selectedOrder.meetingRecord`：
   - 头部按 `mediaType` 显示视频/录音图标 + 会议标题； Sources: [src/components/SupervisionClosure.tsx:1316-1340]()
   - 模拟音频波形条（纯 CSS 条状装饰，无真实播放）； Sources: [src/components/SupervisionClosure.tsx:1342-1358]()
   - 「会议纪要」段落渲染 `meetingRecord.summary`； Sources: [src/components/SupervisionClosure.tsx:1360-1370]()
   - 「转写要点」逐条渲染 `transcriptHighlights[]`（形如「【10:15 导师发言】：…」，**时间点是文案的一部分**，不是结构化字段）。 Sources: [src/components/SupervisionClosure.tsx:1372-1400]()
2. 无 `meetingRecord` 时该 tab 渲染空态（未附会议记录的工单不会崩）。 Sources: [src/components/SupervisionClosure.tsx:1314]()
3. **TAB 4 项目原始材料与初始诊断**（`:1409-1475`）：
   - 「项目材料卡」网格列出 BP / PPT / 附件等交付物； Sources: [src/components/SupervisionClosure.tsx:1440-1470]()
   - 初始诊断区渲染 `diagnosticSummary.coreFindings` 与 `dimensionFeedback[]`（每项含 `dimension` / `expertRemark` / `level`(good·average·poor)）。 Sources: [src/components/SupervisionClosure.tsx:331-407]() [src/components/SupervisionClosure.tsx:1409-1438]()
4. 两个 tab 均**无任何交互**（不可播放、不可下载、不可批注），是纯展示面。 Sources: [src/components/SupervisionClosure.tsx:1313-1475]()
5. `diagnosticSummary` 由导入会议时生成（见 `nd-supervision-import`），字段为 `coreFindings` + 三维度反馈。 Sources: [src/components/SupervisionClosure.tsx:379-392]()

## 规则与边界（AI 开发硬约束）

- 「ASR 纪要」是**文案承诺**：没有任何转写实现，`transcriptHighlights` 是导入时写死/生成的字符串数组，时间点只是文本前缀。
- 音频波形条与「会议时长 42分钟」等数字均为展示用常量；要接真实播放需引入媒体元素与存储。
- 本节点承担「留痕」职责：`meetingRecord` 与 `diagnosticSummary` 只在**导入会议**时写入一次，之后不随工单状态变化（除 `handleSimulateTeamSubmit` 不触碰它们）。
- 两个 tab 与 `activeWorkspaceTab` 一起构成 `selectedOrder` 的只读投影——切工单时内容随之切换，但 tab 不重置（见 `nd-supervision-workbench` 事实 7）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 会议真实播放 | `:1342-1358` | 需存储与播放器（`meetingRecord` 需加 URL 字段） |
| 转写结构化（时间戳字段化） | `:1372-1400` | 需改 `transcriptHighlights` 为对象数组 |
| 材料可下载/预览 | `:1440-1470` | 需接文件服务 |
| 初始诊断接真实 AI 输出 | `:379-392` | 替换导入时的生成逻辑 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-supervision-workbench-2-sources-embed`** ← `nd-supervision-workbench`（工单深度工作区（状态时序 + 四 tab））｜`embed` · **implemented（已实现）**
  - 触发：切换到「会议音视频与ASR纪要」或「项目原始材料与初始诊断」tab
  - 逻辑：activeWorkspaceTab === 'meeting' / 'materials' 时分别渲染两个只读面板。
  - 出处：`src/components/SupervisionClosure.tsx:894-907`
  - 出处：`src/components/SupervisionClosure.tsx:1313`
  - 出处：`src/components/SupervisionClosure.tsx:1409`

**出边 0 条**

（无）
<!-- EDGES:END -->
