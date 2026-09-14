---
id: nd-assets-tree
title: 资产文件树（左栏）
page: page-assets
kind: list
importance: medium
sources:
  - src/components/AssetManagementSystem.tsx:445-573
---

## 一句话定位

资产系统的左栏导航：按**当前版本快照**渲染文件夹树与文件，支持「Go to file」搜索与逐层下钻——它是「看到的是哪个版本」这件事最直接的体现。

## 事实（每条强制可回溯）

1. 栏头为「Files 文件资产清单」+ 快照文件数徽标 + 返回根目录按钮（`handleNavigateFolder('')`）；搜索框 placeholder 为「Go to file...」，右侧附带快捷键提示「T」。 Sources: [src/components/AssetManagementSystem.tsx:450-484]()
2. 文件树按**文件夹分组**渲染：每组标题行显示展开箭头、文件夹图标与文件计数，点击同行执行 `toggleFolder(name)` + `handleNavigateFolder(name)`（展开与下钻是同一个动作）。 Sources: [src/components/AssetManagementSystem.tsx:486-521]()
3. 无归属文件夹的文件（`!f.folder`）**平铺在文件夹之间**，没有独立分区标题。 Sources: [src/components/AssetManagementSystem.tsx:547-560]()
4. 数据源不是全量文件，而是 `snapshotFiles`（按当前选中 commit 的 `fileIdsPresent` 过滤后的快照），并进一步用 `fileSearchQuery` 在 `name`/`path` 上做子串过滤。 Sources: [src/components/AssetManagementSystem.tsx:147-172]()
5. 文件夹列表 `availableFolders` 由**当前快照中出现的文件夹**动态汇总（不是常量），因此切到某个历史版本后，文件夹数量可能变少。 Sources: [src/components/AssetManagementSystem.tsx:159-166]()
6. 点击文件执行 `handleOpenFile(file)`：设 `activeFileId` 并清空 `currentFolder`；当前文件在树中有蓝色左边框高亮。 Sources: [src/components/AssetManagementSystem.tsx:212-216]() [src/components/AssetManagementSystem.tsx:522-540]()
7. 栏底显示「当前快照共 N 项资产」，与顶部徽标同源。 Sources: [src/components/AssetManagementSystem.tsx:566-572]()

## 规则与边界（AI 开发硬约束）

- **本栏随「版本快照」联动**，不是静态目录：`selectedCommitId` 一变，树与计数立刻按该版本的 `fileIdsPresent` 重算（见 `nd-assets-timeline`）。改树的数据源要同时看快照派生逻辑。
- 「展开文件夹」与「进入文件夹」被绑成一个动作，因此**无法只展开不导航**；要支持独立展开需拆分 handler。
- 搜索框的「T」是**装饰性快捷键提示**（未绑定任何键盘事件），不要据它写文档。
- 文件图标由 `renderFileIcon(type)` 提供（ppt/excel/doc|bp/pdf/vcr/code|yaml|json 七类），新增类型要同步扩这个 switch。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增文件类型图标 | `:399-425` | `AssetFile['type']` 类型与各预览分支 |
| 支持只展开不导航 | `:494-501` | 需拆 `toggleFolder` 与 `handleNavigateFolder` |
| 搜索加高亮/模糊匹配 | `:167-172` | 纯前端 |
| 树改真实目录接口 | `:147-166` | 会同时影响中栏与右栏的版本语义 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-assets-timeline-2-tree-writeback`** ← `nd-assets-timeline`（版本时间线（右栏））｜`writeback` · **implemented（已实现）**
  - 触发：点某条 commit 的「进入该版本」，或非 HEAD 时点「回最新」
  - 逻辑：setSelectedCommitId(...) → activeCommit 变化 → snapshotFiles（按该 commit 的 fileIdsPresent 过滤）与 availableFolders 重算 → 左栏文件树与计数整体切换为该版本状态。
  - 出处：`src/components/AssetManagementSystem.tsx:224-232`
  - 出处：`src/components/AssetManagementSystem.tsx:144-166`
  - 出处：`src/components/AssetManagementSystem.tsx:1626-1636`
  - 备注：「版本」是全页的筛选器：左栏、中栏、预览可见的文件集合都由它决定。

**出边 0 条**

（无）
<!-- EDGES:END -->
