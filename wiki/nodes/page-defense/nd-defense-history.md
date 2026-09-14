---
id: nd-defense-history
title: 实训历史与复盘入口
page: page-defense
kind: list
importance: medium
sources:
  - src/components/defense/DefenseSelectorScreen.tsx:250-297
---

## 一句话定位

首屏下方的「往期实训」卡墙：5 条历史记录（模式 / 项目 / 得分 / 日期），点任意一条**直接跳到复盘报告屏**——是「不用重练也能看报告」的通道。

## 事实（每条强制可回溯）

1. 数据源是常量 `RECENT_DEFENSE_HISTORY`（5 条，含 `id/modeId/modeName/projectId/projectName/status/stats/score/date`），分数分别为 92 / 86 / 78 / 72 / 68。 Sources: [src/components/defense/defenseConstants.ts:111-166]()
2. 卡片展示：模式名 + 分数徽标（`{score}分`，无分数时显示「已复盘」）+ 项目名 + `stats` 一行 + 日期 + 「查看报告 ›」。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:262-296]()
3. 点击逻辑：按 `item.projectId` 在 `MOCK_DEFENSE_PROJECTS` 中找项目（**找不到则回落到当前 `selectedProject`**）、按 `item.modeId` 在 `TRAINING_MODES` 中找模式（找不到回落第 0 个），然后 `onViewReport(proj, m, item)`。 Sources: [src/components/defense/DefenseSelectorScreen.tsx:253-259]()
4. 历史里混排了**其他项目**的记录（`p1` 碳迹云 / `p2` 智瞳守护 / `p3` NeuroLink），点进去会把 `SceneDefenseTraining` 的 `selectedProject` 切成那条记录的项目——**从历史进入报告时，页面不再代表当前登录学生的项目**。 Sources: [src/components/defense/defenseConstants.ts:120-165]() [src/components/SceneDefenseTraining.tsx:96-102]()
5. 消费端：`handleViewReport`（`:93-98`）设 `selectedProject` / `selectedMode` / `activeHistoryItem` 并 `setView('report')`；`activeHistoryItem` 只在报告屏用作 `historyItem?.score` 兜底与标题来源。 Sources: [src/components/SceneDefenseTraining.tsx:93-98]() [src/components/defense/DefenseReportScreen.tsx:109]()
6. 卡片无删除、无筛选、无「继续未完成」入口；`status` 恒为「已结束」。 Sources: [src/components/defense/defenseConstants.ts:119-165]()
7. 历史数据**不会因本次训练而更新**：完成一轮训练回到首屏后，列表仍是这 5 条常量（`onRestart` 只切视图，不追加记录）。 Sources: [src/components/SceneDefenseTraining.tsx:104-110]() [src/components/defense/defenseConstants.ts:111]()

## 规则与边界（AI 开发硬约束）

- 点击历史项会**改变全局 `selectedProject`**（不只是打开一份旧报告），这是「历史记录」语义与「看报告」语义混在一个 handler 里的结果；要支持「只看报告不改当前项目」需拆 handler。
- 分数来自 mock 常量，**与真实实训结果无关**：跑完一次新训练不会在这里留下记录（见事实 7）。
- 卡片本身无独立状态（无 hover state / 无选中态），列表为空时**没有空态文案**（直接渲染空白区块）。
- 报告屏对本屏传入的 `historyItem` 是**弱依赖**（只用 score 兜底），因此从历史进入与从本次训练进入看到的是两套评分来源。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 实训结束后落一条真实历史 | `defenseConstants.ts:111` | 需把常量改成 state 并挂到 App/`SceneDefenseTraining` |
| 按当前项目过滤历史 | `DefenseSelectorScreen.tsx:262-291` | 纯过滤，无副作用 |
| 历史项加删除/继续训练 | `:262-296` | 需新增 handler 与状态 |
| 报告入口与项目解耦 | `:253-259` | `SceneDefenseTraining.selectedProject` 的写回语义 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-defense-history-2-report-navigate`** → `nd-defense-report`（答辩复盘报告）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击实训历史卡（5 条任一条）
  - 载荷：`{ project: 按 item.projectId 解析出的 DefenseProject, mode: 按 item.modeId 解析出的 ModeDef, historyItem }`
  - 逻辑：onViewReport(proj, m, item) → SceneDefenseTraining.handleViewReport：改写全局 selectedProject 与 selectedMode、记录 activeHistoryItem、setView('report')。
  - 出处：`src/components/defense/DefenseSelectorScreen.tsx:253-259`
  - 出处：`src/components/SceneDefenseTraining.tsx:93-98`
  - 备注：点历史会改掉当前项目上下文（p1/p2/p3 的记录点进去后，页面不再代表当前学生的项目）。
<!-- EDGES:END -->
