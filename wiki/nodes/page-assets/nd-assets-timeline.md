---
id: nd-assets-timeline
title: 版本时间线（右栏）
page: page-assets
kind: list
importance: high
sources:
  - src/components/AssetManagementSystem.tsx:1591-1785
---

## 一句话定位

「项目资产管理系统（Git 模式）」的版本轴：按日期分组的提交记录流，可切换当前查看的版本快照、可提交新版本、可进入某一版本的资产状态——左中两栏的内容随之整体切换。

## 事实（每条强制可回溯）

1. 栏头为「版本时间线」+ HEAD 状态指示：是 HEAD 时显示绿色「最新」，否则显示琥珀色「快照」徽标并额外出现「回最新」按钮（`setSelectedCommitId(versionCommits[0].id)`）。 Sources: [src/components/AssetManagementSystem.tsx:1594-1644]() [src/components/AssetManagementSystem.tsx:144]()
2. 「提交」按钮（id `btn-asset-commit`）调 `handleCreateMockCommit()`：**每次点击生成一条假的 commit**（标题/描述/阶段/作者/增删行数全部来自 `mockCandidates` 轮换），插到时间线顶部并更新若干派生状态。 Sources: [src/components/AssetManagementSystem.tsx:1639-1652]() [src/components/AssetManagementSystem.tsx:234-357]()
3. 提交记录按日期分组（`groupedCommits`），每组有日期头与时间轴竖线；当前选中的 commit 卡片高亮并在轴上加蓝点。 Sources: [src/components/AssetManagementSystem.tsx:194-210]() [src/components/AssetManagementSystem.tsx:1669-1730]()
4. 每张 commit 卡展示：标题 + 阶段徽标（`stageBadge`）+ 描述 + 作者头像/名字 + `committed {timeAgo}` + 短 SHA（可复制，`handleCopy` 后短暂显示对勾）。 Sources: [src/components/AssetManagementSystem.tsx:1731-1760]() [src/components/AssetManagementSystem.tsx:133-143]()
5. 卡片底部两个动作：「进入该版本」（`handleEnterVersionSnapshot(commit.id)`，使左中两栏切到该版本快照；当前版本时按钮变为「当前版本」并禁用语义）与「查看 diff」（打开 `nd-assets-diff`）。 Sources: [src/components/AssetManagementSystem.tsx:1760-1785]() [src/components/AssetManagementSystem.tsx:224-232]()
6. 作者筛选下拉（`authorFilter`）提供「全部作者 / 林子越（项目负责人）/ 张教授（导师评委）」三项，计数取自 `versionCommits.length`。 Sources: [src/components/AssetManagementSystem.tsx:127]() [src/components/AssetManagementSystem.tsx:1654-1668]()
7. 栏底固定文案「已归档 N 个评审里程碑」+ 绿色「100% 审计追溯」。 Sources: [src/components/AssetManagementSystem.tsx:1778-1784]()
8. 版本数据源是 `MOCK_VERSION_COMMITS`（mock 文件），初始选中 `MOCK_VERSION_COMMITS[0]`；提交产生的记录**只存在内存**，刷新即回初值。 Sources: [src/components/AssetManagementSystem.tsx:79-80]() [src/data/mockAssetManagementData.ts:605-680]()

## 规则与边界（AI 开发硬约束）

- 「提交」是**演示按钮**（生成假 commit + 假 diff），不写文件、不落库；文案上它却像一次真实提交——演示时需明确。
- 版本状态（`selectedCommitId`）是**全局筛选器**：它同时决定左栏文件树、中栏清单与预览能看到的文件集合（`snapshotFiles`）。任何"版本"相关需求都要从这条链路想。
- `authorFilter` 与 `timeFilter` 中，**`timeFilter` 声明后从未被使用**（无对应筛选 UI）；`isDarkMode` 同样是只声明未读取的死状态（页面实际只有浅色主题）。 Sources: [src/components/AssetManagementSystem.tsx:127-128]() [src/components/AssetManagementSystem.tsx:76]()
- 时间线的日期分组键来自 commit 的日期字段，新增假 commit 时若不遵守同一格式会多出一个日期头。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 提交接真实接口 | `:234-357` | 需替换假 commit 生成 + 落库 |
| 增加时间筛选 | `:127-128` | 已有 state，缺 UI 与过滤逻辑 |
| 版本对比支持任意两版 | `:1760-1785` | 当前 diff 以"该 commit vs 前一版"语义呈现 |
| 清理死状态 | `:76` `:128` | 纯清理，注意主题对象已是浅色硬编码 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-assets-diff-2-timeline-writeback`** ← `nd-assets-diff`（版本 Diff 对比弹层）｜`writeback` · **implemented（已实现）**
  - 触发：点弹层右上「切换至该版本资产快照」
  - 逻辑：handleEnterVersionSnapshot(activeDiffCommit.id) + setActiveDiffCommit(null)：既切换浏览版本（改写 selectedCommitId），又关闭自身。
  - 出处：`src/components/AssetManagementSystem.tsx:1802-1812`
  - 出处：`src/components/AssetManagementSystem.tsx:224-232`

**出边 3 条**

- **`e-assets-timeline-2-tree-writeback`** → `nd-assets-tree`（资产文件树（左栏））｜`writeback` · **implemented（已实现）**
  - 触发：点某条 commit 的「进入该版本」，或非 HEAD 时点「回最新」
  - 逻辑：setSelectedCommitId(...) → activeCommit 变化 → snapshotFiles（按该 commit 的 fileIdsPresent 过滤）与 availableFolders 重算 → 左栏文件树与计数整体切换为该版本状态。
  - 出处：`src/components/AssetManagementSystem.tsx:224-232`
  - 出处：`src/components/AssetManagementSystem.tsx:144-166`
  - 出处：`src/components/AssetManagementSystem.tsx:1626-1636`
  - 备注：「版本」是全页的筛选器：左栏、中栏、预览可见的文件集合都由它决定。
- **`e-assets-timeline-2-list-writeback`** → `nd-assets-list`（资产清单视图（中栏））｜`writeback` · **implemented（已实现）**
  - 触发：同上（进入某版本 / 回最新）
  - 逻辑：中栏清单与 activeFile 同由 snapshotFiles 派生；若当前 activeFileId 不在新快照中，activeFile 变为 null、中栏回落为清单/README 视图。
  - 出处：`src/components/AssetManagementSystem.tsx:147-156`
  - 出处：`src/components/AssetManagementSystem.tsx:575-680`
- **`e-assets-timeline-2-diff-navigate`** → `nd-assets-diff`（版本 Diff 对比弹层）｜`navigate` · **implemented（已实现）**
  - 触发：点 commit 卡的「查看 diff」
  - 逻辑：setActiveDiffCommit(commit) + setSelectedDiffFileIndex(0) → 渲染 Diff 弹层。
  - 出处：`src/components/AssetManagementSystem.tsx:1763-1775`
  - 出处：`src/components/AssetManagementSystem.tsx:1787-1793`
<!-- EDGES:END -->
