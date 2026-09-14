---
id: nd-assets-diff
title: 版本 Diff 对比弹层
page: page-assets
kind: modal
importance: medium
sources:
  - src/components/AssetManagementSystem.tsx:1787-1937
---

## 一句话定位

点某条提交的「查看 diff」时弹出的差异查看器：上方列出该 commit 触及的文件（带 +A / ~M / -D 与增删行数），下方是带行号与配色的统一 diff——**Git 体验的最后一块拼图**。

## 事实（每条强制可回溯）

1. 由 `activeDiffCommit` 控制（`VersionCommit | null`）；打开时同时把 `selectedDiffFileIndex` 重置为 0。 Sources: [src/components/AssetManagementSystem.tsx:116-117]() [src/components/AssetManagementSystem.tsx:1768-1772]()
2. 弹层顶部显示「Commit Diff 变更差异对比」+ 短 SHA + commit 标题，并提供「切换至该版本资产快照」按钮（调 `handleEnterVersionSnapshot(activeDiffCommit.id)` 后关闭弹层）与关闭按钮。 Sources: [src/components/AssetManagementSystem.tsx:1794-1840]()
3. 变更文件以 tab 条呈现：`+A`（added，绿）/ `~M`（modified，琥珀）/ `-D`（deleted，红）+ 文件名 + `+additions` / `-deletions`；点击切换 `selectedDiffFileIndex`。 Sources: [src/components/AssetManagementSystem.tsx:1842-1870]()
4. 正文区先给一行文件摘要（路径 + 描述 + 增删统计），再渲染统一 diff：每行三列（旧行号 / 新行号 / 记号），新增行绿底、删除行红底并加删除线，其余为普通行。 Sources: [src/components/AssetManagementSystem.tsx:1872-1920]()
5. diff 数据来自 commit 的 `changes[].diffLines`（`{type:'add'|'del'|'', oldLine?, newLine?, text}`），由 mock 常量提供；「提交」按钮生成的假 commit 也自带一组假 diff 行。 Sources: [src/data/mockAssetManagementData.ts:25-59]() [src/components/AssetManagementSystem.tsx:325-355]()
6. 弹层底部文案「按国赛答辩演进线对比 · 可在版本之间无损无缝穿梭」+ 关闭按钮。 Sources: [src/components/AssetManagementSystem.tsx:1923-1935]()
7. **弹层没有 ESC 关闭、没有点击遮罩关闭**（遮罩是纯视觉层，未绑 onClick），出口只有顶部/底部两个按钮与「切换至该版本」。 Sources: [src/components/AssetManagementSystem.tsx:1788-1793]()

## 规则与边界（AI 开发硬约束）

- diff 是**只读展示**：没有行内评论、没有接受/拒绝、没有回滚入口；「回滚」语义只在文案里（「切换至该版本资产快照」改的是浏览态，不改数据）。
- 「切换至该版本」会**在执行后关闭弹层**并把左中两栏切到该版本；这是本弹层唯一的写操作。
- 组件对 `changes[selectedDiffFileIndex]` 为空时直接不渲染正文（无空态 UI）。
- diff 行数与内容均为 mock，与 `page-guidance` 的版本 diff 弹层（`nd-guidance-diff-modal`）是两套实现，勿混用数据。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 加 ESC/遮罩关闭 | `:1788-1793` | 需新增 keydown 监听（参考 `RightWorkspacePanel` 的写法） |
| 支持任意两版本对比 | `:1794-1840` | 需扩 `activeDiffCommit` 为双版本 |
| 加回滚动作 | `:1794-1840` | 需先定义"回滚"是改浏览态还是改数据 |
| diff 接真实后端 | `mockAssetManagementData.ts:25-59` | 影响假 commit 生成器 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-assets-timeline-2-diff-navigate`** ← `nd-assets-timeline`（版本时间线（右栏））｜`navigate` · **implemented（已实现）**
  - 触发：点 commit 卡的「查看 diff」
  - 逻辑：setActiveDiffCommit(commit) + setSelectedDiffFileIndex(0) → 渲染 Diff 弹层。
  - 出处：`src/components/AssetManagementSystem.tsx:1763-1775`
  - 出处：`src/components/AssetManagementSystem.tsx:1787-1793`

**出边 1 条**

- **`e-assets-diff-2-timeline-writeback`** → `nd-assets-timeline`（版本时间线（右栏））｜`writeback` · **implemented（已实现）**
  - 触发：点弹层右上「切换至该版本资产快照」
  - 逻辑：handleEnterVersionSnapshot(activeDiffCommit.id) + setActiveDiffCommit(null)：既切换浏览版本（改写 selectedCommitId），又关闭自身。
  - 出处：`src/components/AssetManagementSystem.tsx:1802-1812`
  - 出处：`src/components/AssetManagementSystem.tsx:224-232`
<!-- EDGES:END -->
