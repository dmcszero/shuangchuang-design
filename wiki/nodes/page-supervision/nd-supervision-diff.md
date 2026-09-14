---
id: nd-supervision-diff
title: 改前改后比对与 AI 提分验收
page: page-supervision
kind: panel
importance: high
sources:
  - src/components/SupervisionClosure.tsx:1117-1312
---

## 一句话定位

本页的**核心 tab**：把「辅导前 / 整改后」两版材料并排摆出来，配上 AI 算出的分维度提分（Δ）与关键改动清单，并在底部给出终审的两个出口——验收归档或退回重改。

## 事实（每条强制可回溯）

1. 提分横幅读 `selectedOrder.versionDiff.aiScoreDelta`：显示「`totalBefore` ➔ `totalAfter`（+`delta`分）」大数字 + 各维度明细卡（维度名、before ➔ after、+delta、进度条、💡 评语）。 Sources: [src/components/SupervisionClosure.tsx:1121-1175]()
2. **无 diff 数据时给明确空态**：「团队尚未提交新版文件，暂无法生成版本比对与提分Δ。团队提交后将自动对比。」 Sources: [src/components/SupervisionClosure.tsx:1176-1181]()
3. 双版本卡：左「整改前原始版本 (Before)」列 beforeBpVersion / beforePptVersion；右「整改后冲刺交付版本 (After)」列 afterBpVersion / afterPptVersion（标「已更新」「待终审验收」）。 Sources: [src/components/SupervisionClosure.tsx:1184-1231]()
4. 「AI 智能比对提取的关键改动证据清单」逐条渲染 `versionDiff.keyChanges[]`（带勾选图标）。 Sources: [src/components/SupervisionClosure.tsx:1232-1248]()
5. 学生提交说明区渲染 `studentSubmission.modificationNotes`（`whitespace-pre-line` 保留换行）+ 提交时间。 Sources: [src/components/SupervisionClosure.tsx:1249-1263]()
6. 底部按状态三选一：
   - 已闭环（`closed_completed` / `expert_checked`）→ 绿色归档回执（显示 `expertCheck.finalRemark` 与 `scoreChangeDelta`，缺省 `+7.0`）。 Sources: [src/components/SupervisionClosure.tsx:1264-1285]()
   - `team_submitted` → 双按钮「退回继续修改」（→ MODAL 6）与「验收合格 · 归档结项」（→ MODAL 5）。 Sources: [src/components/SupervisionClosure.tsx:1286-1308]()
   - 其余状态 → `null`（不渲染任何裁定区）。 Sources: [src/components/SupervisionClosure.tsx:1308-1310]()
7. 验收弹窗（MODAL 5，`:1795-1851`）：预填终审评语（写死「修改非常到位！商业模式与订单数据形成闭环，温漂专利证据链扎实，通过验收！」）与提分 `finalScoreDelta` 初值 **7.0**，确认 → `handleApproveFinalClose`（状态改 `closed_completed` + 写 `expertCheck`）。 Sources: [src/components/SupervisionClosure.tsx:94-96]() [src/components/SupervisionClosure.tsx:232-249]()
8. 退回弹窗（MODAL 6，`:1852-1896`）：要求填 `reworkComment`（空值不提交），确认 → `handleConfirmRework`（状态改 `need_rework`，把意见写进 `teamRejectionReason`，前缀「导师终审打回重改：」）。 Sources: [src/components/SupervisionClosure.tsx:250-262]()

## 规则与边界（AI 开发硬约束）

- **所有 diff 与提分数据都是 mock 生成的**：`handleSimulateTeamSubmit` 在切换状态时一次性写入 `versionDiff`（含 4 个维度的前后分数、Δ 与评语）与 `studentSubmission`——没有真实的文档解析或 AI 对比。要做真实能力，替换点是那条 handler。 Sources: [src/components/SupervisionClosure.tsx:188-231]()
- 终审的**提分数字是导师手填**（弹窗内 `finalScoreDelta`），与 AI 算的 `aiScoreDelta.delta` **无校验关系**；两个数字可任意不一致。
- 退回与验收都**只改状态 + 写字段**，不移动版本文件、不触发重生成。
- 已闭环工单的归档回执里，`expertCheck?.scoreChangeDelta || 7.0` 有兜底值——旧的 mock 工单没有 `expertCheck` 时也会显示「+7.0 分」，容易误读为真实提分。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 提分接真实文档比对 | `:188-231` | 需文件解析 + 评分服务；`versionDiff` 数据结构可保留 |
| 终审分数与 AI 分数一致性校验 | `:232-249` | 需在弹窗内做校验或默认取 AI 值 |
| 支持多轮退回历史 | `:250-262` | 当前 `need_rework` 只存最后一次理由 |
| 归档回执去兜底值 | `:1264-1285` | 需区分「无数据」与「+7.0」 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-supervision-workbench-2-diff-embed`** ← `nd-supervision-workbench`（工单深度工作区（状态时序 + 四 tab））｜`embed` · **implemented（已实现）**
  - 触发：切换到「改前改后版本比对 & AI提分验收」tab
  - 逻辑：activeWorkspaceTab === 'diff_ai' 时渲染；工单处于 team_submitted 时 tab 上带「新提交」徽标。
  - 出处：`src/components/SupervisionClosure.tsx:879-893`
  - 出处：`src/components/SupervisionClosure.tsx:1117`

**出边 1 条**

- **`e-supervision-diff-2-workbench-writeback`** → `page-workbench`（项目工作台）｜`writeback` · **implemented（已实现）**
  - 触发：终审「验收合格 · 归档结项」或「退回继续修改」
  - 载荷：`status: 'closed_completed' | 'need_rework' + expertCheck{checkedDate, approved, finalRemark, scoreChangeDelta} 或 teamRejectionReason`
  - 逻辑：handleApproveFinalClose / handleConfirmRework → syncOrder → App.setWorkOrders → 学生端工作台看到「已验收归档」或「导师退回」及意见。
  - 出处：`src/components/SupervisionClosure.tsx:232-262`
  - 出处：`src/components/SupervisionClosure.tsx:1286-1308`
<!-- EDGES:END -->
