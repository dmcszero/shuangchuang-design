---
id: nd-assets-addfile
title: 新增资产归档弹窗
page: page-assets
kind: modal
importance: medium
sources:
  - src/components/AssetManagementSystem.tsx:1939-2033
---

## 一句话定位

「把一份新材料归档进项目资产」的入口：填文件名、选目标目录与资产类型、写一句说明，确认后立刻在文件树/清单里出现（并自动打开预览）——**这是全页唯一的写操作**。

## 事实（每条强制可回溯）

1. 由 `isAddFileModalOpen` 控制，四个表单 state：`newFileName` / `newFileFolder` / `newFileType` / `newFileMeta`。 Sources: [src/components/AssetManagementSystem.tsx:119-124]()
2. 表单三项：文件名称（含后缀）、存放目标目录（`deliverables` / `docs` / `evidence` / `src` / 根目录）、资产类型（doc / ppt / excel / pdf / code）+ 资产说明 textarea。 Sources: [src/components/AssetManagementSystem.tsx:1950-2010]()
3. 目录选项有**命名口径不一致**：弹窗下拉用英文目录名（deliverables/docs/evidence/src/根目录），而 `newFileFolder` 的**初值是中文「核心申报」**——该值不在下拉选项中，若用户不改目录直接提交，归档路径会是「核心申报/xxx」。 Sources: [src/components/AssetManagementSystem.tsx:122]() [src/components/AssetManagementSystem.tsx:1973-1983]()
4. 确认按钮 `handleCreateMockFile`：无后缀时补 `.docx`；生成 `AssetFile`（id 为 `custom-asset-{timestamp}`、size 写死 `15.4 KB`、`lastCommitHash` 用随机数造、正文 `contentLines` 由模板拼出）→ 插到 `filesList` 头部 → **把新 id 追加进当前 commit 的 `fileIdsPresent`** → 关弹窗 → 自动 `handleOpenFile(newAsset)`。 Sources: [src/components/AssetManagementSystem.tsx:359-399]()
5. 因此新文件会**立刻出现在左栏与中栏**（因为当前快照的文件集合被就地修改），并直接进入预览态；文件名为空时确认按钮 disabled。 Sources: [src/components/AssetManagementSystem.tsx:2018-2030]()
6. 新文件不在 `MOCK_VERSION_COMMITS` 的原始数据里，是**运行期注入**——刷新页面即消失（无持久化）。 Sources: [src/components/AssetManagementSystem.tsx:79]() [src/components/AssetManagementSystem.tsx:394-396]()

## 规则与边界（AI 开发硬约束）

- 本弹窗是**唯一改变资产集合的入口**；它直接改 `activeCommit.fileIdsPresent`（就地 push，不是不可变更新），与 React 的不可变约定相悖——扩功能时建议先改成不可变写法。
- 新建文件**不产生新的 commit**（提交按钮是另一个动作）：资产集合变了、版本时间线不变，语义上"工作区脏了但没提交"，UI 上没有对应提示。
- 大小、hash、正文内容都是造出来的：不要在任何验收里把 `15.4 KB` 当成真实文件大小。
- 关闭弹窗**不清空已填内容**（只清 `newFileName` / `newFileMeta` 的时机在成功创建后）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 统一目录命名口径 | `:122` + `:1973-1983` | `FOLDER_METADATA`（mock 文件 :778+）与左栏分组 |
| 新建后自动生成一条 commit | `:359-399` | 与 `handleCreateMockCommit` 合并逻辑 |
| 上传真实文件 | `:1950-2010` | 需引入文件选择与字节流（当前只有文本元数据） |
| 修不可变更新 | `:394-396` | 需把 `fileIdsPresent` 改为拷贝后替换 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-assets-addfile-2-list-writeback`** → `nd-assets-list`（资产清单视图（中栏））｜`writeback` · **implemented（已实现）**
  - 触发：弹窗「确认创建并归档」
  - 逻辑：handleCreateMockFile：生成 AssetFile（无后缀补 .docx、size 写死 15.4 KB）→ 插入 filesList 头部 → 把新 id push 进 activeCommit.fileIdsPresent（就地修改）→ 关弹窗 → handleOpenFile(newAsset) 直接进入预览。
  - 出处：`src/components/AssetManagementSystem.tsx:359-399`
  - 备注：新文件立刻出现在左栏/中栏（快照集合被就地改），但不产生新 commit；刷新即消失。
<!-- EDGES:END -->
