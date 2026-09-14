---
id: nd-assets-preview
title: 多模态资产预览
page: page-assets
kind: panel
importance: high
sources:
  - src/components/AssetManagementSystem.tsx:850-1570
---

## 一句话定位

资产系统的**可演示核心**：同一份「资产」按类型渲染成六种形态——路演幻灯片大屏、视频播放器、带 CNAS 公章的检测报告、财务三张表 + BOM、Markdown 正文、源码/JSON——并可一键切到纯文本查看。

## 事实（每条强制可回溯）

1. 预览区顶部有「纯文本/源码 ↔ 多模态渲染」切换按钮（`showRawCode`，默认 false 即多模态），按钮文案随状态互换。 Sources: [src/components/AssetManagementSystem.tsx:112]() [src/components/AssetManagementSystem.tsx:855-872]()
2. 六个预览分支：① PPTX 路演幻灯片（16:9 画布 + 15 页缩略图条）；② MP4 样机演示视频播放器；③ PDF 权威检测报告 / 专利凭证（含红色 CNAS 公章）；④ XLSX 财务三张表与单机 BOM（四个 sheet tab：`unit`/`pnl`/`cash`/`bom`）；⑤ MD / 文档正文；⑥ Code / JSON。 Sources: [src/components/AssetManagementSystem.tsx:924-1027]() [src/components/AssetManagementSystem.tsx:1027-1125]() [src/components/AssetManagementSystem.tsx:1125-1215]() [src/components/AssetManagementSystem.tsx:1215-1475]() [src/components/AssetManagementSystem.tsx:1475-1542]() [src/components/AssetManagementSystem.tsx:1542-1565]()
3. 幻灯片形态自带分页状态：`activeSlide`（默认第 1 页）与 `ROADSHOW_SLIDES_DATA`（数据来自 mock 文件），支持前后翻页与缩略图点选，页脚显示「第 N 页 / 共 M 页」。 Sources: [src/components/AssetManagementSystem.tsx:108]() [src/components/AssetManagementSystem.tsx:938-1010]() [src/data/mockAssetManagementData.ts:118-135]()
4. 视频形态是**模拟播放器**：`isPlayingVideo` 开关 + `videoProgress` 进度（默认 38%），四个章节按钮直接把进度跳到 8% / 34% / 71% / 92%，**没有真实媒体元素**。 Sources: [src/components/AssetManagementSystem.tsx:109-110]() [src/components/AssetManagementSystem.tsx:1060-1120]()
5. Excel 形态的四个 sheet tab 状态为 `activeSheetTab`（默认 `unit`），表格内容为常量数据。 Sources: [src/components/AssetManagementSystem.tsx:111]() [src/components/AssetManagementSystem.tsx:1215-1300]()
6. 根目录且未选中文件时，中栏渲染 **README.md 兜底预览**：标题「面向晶圆级高精度光学缺陷检测系统 · 2026国赛金奖对标资产管理体系」，正文说明本系统「遵循 Git 无分支版本演进设计模式」并列出 7 大类合规材料（12 章 BP、访谈纪要、答辩幻灯片、4K 录像、CNAS 报告、财务三张表、BOM），并指引用户去右栏用「进入该版本 / Diff 历史」。 Sources: [src/components/AssetManagementSystem.tsx:1566-1590]()
7. 预览内容与 `activeFile` 的关联仅限于**类型分流**：具体正文/图表/视频帧全是常量（`mockAssetManagementData` 中的样例），换文件不会换内容。 Sources: [src/components/AssetManagementSystem.tsx:909-1570]()
8. 所有形态都在同一容器内条件渲染，**没有独立的预览组件文件**（全部写在本组件内，占本文件约 40% 篇幅）。 Sources: [src/components/AssetManagementSystem.tsx:909-1565]()

## 规则与边界（AI 开发硬约束）

- 预览是**全 demo 中最"像真的"的一层**：CNAS 公章、财务表、4K 录像、访谈纪要都是视觉素材，**没有任何真实文件**；对外演示时不要暗示这些材料已存在。
- 类型分流用 `activeFile.type`，新增类型要在六分支之外补一支，否则落到空渲染（无兜底 UI）。
- `showRawCode` 是全局开关（不分文件），切到源码视图后所有文件都显示文本。
- 幻灯片/视频/Excel 的分页与进度状态**不随文件切换重置**（同一个组件内 state），换文件后会保持上次的页号。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 预览接真实文件（PDF/视频） | `:909-1565` | 需引入 blob/流接口与六分支重写 |
| 新增预览类型（如 HTML 原型） | `:909-1565` | `AssetFile['type']` + `renderFileIcon` |
| 换文件时重置分页/进度 | `:108-111` | 加 `useEffect([activeFileId])` 即可 |
| 幻灯片数据接真实 Deck | `mockAssetManagementData.ts:118-135` | 与 `page-defense` 的路演幻灯片常量口径不同源 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
