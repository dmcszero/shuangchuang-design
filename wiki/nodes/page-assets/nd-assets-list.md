---
id: nd-assets-list
title: 资产清单视图（中栏）
page: page-assets
kind: table
importance: medium
sources:
  - src/components/AssetManagementSystem.tsx:575-850
---

## 一句话定位

中栏的资产总览：面包屑 + 视图切换（表格 / 卡片）+ 一键导出清单，把当前快照里的文件按文件夹或列表铺开，点进去即进入多模态预览。

## 事实（每条强制可回溯）

1. 栏头是面包屑：根目录 `handleNavigateFolder('')` + 当前文件夹（`currentFolder` 非空时显示），另外提供搜索、筛选与右侧操作按钮。 Sources: [src/components/AssetManagementSystem.tsx:577-634]()
2. 「导出清单」按钮把**当前快照所有文件名的 JSON** 复制到剪贴板（`handleCopy(JSON.stringify(snapshotFiles.map(f => f.name), null, 2), 'export')`），不是下载文件。 Sources: [src/components/AssetManagementSystem.tsx:624-630]()
3. 视图切换是 `middleViewMode: 'table' | 'cards'` 两态按钮组（默认 `table`）。 Sources: [src/components/AssetManagementSystem.tsx:113]() [src/components/AssetManagementSystem.tsx:653-672]()
4. `table` 模式下按**文件夹分组渲染表格**：每个文件夹一段，行内点击进文件；`cards` 模式则是卡片网格。 Sources: [src/components/AssetManagementSystem.tsx:681-745]() [src/components/AssetManagementSystem.tsx:745-790]()
5. 列表项展示文件名、路径/元信息、类型图标与最近一次提交信息（来自 `AssetFile.lastCommitMessage/lastCommitDate/lastCommitAuthor`）。 Sources: [src/data/mockAssetManagementData.ts:1-24]()
6. 点任意文件 → `handleOpenFile(file)`，中栏由「清单」切换为「文件预览」（见 `nd-assets-preview`）；`activeFile` 由 `snapshotFiles.find(...)` 派生，**若该文件不在当前快照中则为 null**。 Sources: [src/components/AssetManagementSystem.tsx:152-156]() [src/components/AssetManagementSystem.tsx:212-216]()
7. 列出的是 `snapshotFiles`（当前版本快照）而非全量 `filesList`；`filesList` 只用于新增文件与提交记录维护。 Sources: [src/components/AssetManagementSystem.tsx:86]() [src/components/AssetManagementSystem.tsx:147-152]()

## 规则与边界（AI 开发硬约束）

- 中栏是「清单 ↔ 预览」二态切换（由 `activeFileId` 是否为空决定），**不是路由**；因此没有 URL 可分享、刷新会回到清单态。
- 「导出清单」是复制 JSON 而非导出资产——文案与行为有落差，改文案或改行为要显式决策。
- 表格分组渲染依赖 `snapshotFiles` 里的 `folder` 字段；新增文件若目录不在 `availableFolders` 中会额外冒出一个分组（因为文件夹列表是动态汇总的）。
- 本栏无自身 state（除 `middleViewMode`），数据全部派生。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 加排序/筛选条件 | `:653-680`（工具条） | 需新增 state 与派生过滤 |
| 导出改为真下载 | `:624-630` | 需接文件流接口 |
| 表格列改字段 | `:681-745` | `AssetFile` 类型 |
| 支持多选批量操作 | `:681-790` | 会引入选中集 state，与 tree 选中态分离 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-assets-timeline-2-list-writeback`** ← `nd-assets-timeline`（版本时间线（右栏））｜`writeback` · **implemented（已实现）**
  - 触发：同上（进入某版本 / 回最新）
  - 逻辑：中栏清单与 activeFile 同由 snapshotFiles 派生；若当前 activeFileId 不在新快照中，activeFile 变为 null、中栏回落为清单/README 视图。
  - 出处：`src/components/AssetManagementSystem.tsx:147-156`
  - 出处：`src/components/AssetManagementSystem.tsx:575-680`
- **`e-assets-addfile-2-list-writeback`** ← `nd-assets-addfile`（新增资产归档弹窗）｜`writeback` · **implemented（已实现）**
  - 触发：弹窗「确认创建并归档」
  - 逻辑：handleCreateMockFile：生成 AssetFile（无后缀补 .docx、size 写死 15.4 KB）→ 插入 filesList 头部 → 把新 id push 进 activeCommit.fileIdsPresent（就地修改）→ 关弹窗 → handleOpenFile(newAsset) 直接进入预览。
  - 出处：`src/components/AssetManagementSystem.tsx:359-399`
  - 备注：新文件立刻出现在左栏/中栏（快照集合被就地改），但不产生新 commit；刷新即消失。

**出边 0 条**

（无）
<!-- EDGES:END -->
