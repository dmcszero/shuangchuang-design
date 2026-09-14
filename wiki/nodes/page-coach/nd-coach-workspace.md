---
id: nd-coach-workspace
title: 右侧独立工作区（产物展示）
page: page-coach
kind: drawer
importance: high
sources:
  - src/components/RightWorkspacePanel.tsx:120-620
  - src/App.tsx:96-215
---

## 一句话定位

AI 助手右侧的独立产物面板：看本次/历次生成的交付物长什么样（PPT 演进矩阵、Excel 测算表、BP 正文预览），并能全屏、拖拽调宽、切换产物——**「会话在左、产物在右」的物理分界**。

## 事实（每条强制可回溯）

1. 挂载条件：`activeTab === 'coach' && isRightWorkspaceOpen`——「新建对话」态（`new_chat`）与 `guidance_workbench`、`asset_management` 都不渲染它；`isRightWorkspaceOpen` 初值 true，`Ctrl/Cmd+J` 切换。 Sources: [src/App.tsx:831-833]() [src/App.tsx:97]() [src/App.tsx:305-313]()
2. 宽度由 `rightWorkspaceWidthPx` 控制（初值 = 可用宽度的 40%，即 6:4）；中栏与右栏之间有一条 **4px 分割线**（`w-1` + 左右各外扩 4px 热区），仅在该页且非全屏时出现。 Sources: [src/App.tsx:105-108]() [src/App.tsx:796-825]()
3. 拖动用 Pointer Capture（`setPointerCapture`）实现像素级跟随，`clientX` 换算右栏宽度并夹在 `[300, 可用宽-360]`；双击分割线恢复 6:4，窗口 resize 时同步收敛。 Sources: [src/App.tsx:223-258]() [src/App.tsx:260-288]() [src/App.tsx:290-295]()
4. 全屏态由 `isExpandedFull` 驱动：`position: fixed; inset: 0; z-index 9999` 铺满整个页面（覆盖侧栏与顶栏），`Esc` 退出。 Sources: [src/components/RightWorkspacePanel.tsx:306-320]() [src/components/RightWorkspacePanel.tsx:252-265]()
5. 头部是一条合并栏：左侧「产物清单」下拉（列出 review 项并带「修改/新增」徽标 + 其他交付物不带徽标 + 底部「共 N 项交付产物」与「全部导出ZIP」）；右侧「审核项 n/N」指示 + 审批三键 + 全屏/收起按钮。 Sources: [src/components/RightWorkspacePanel.tsx:325-460]()
6. 展示区按 `currentMode` 二分：`review` → `ReviewFileViewer`（支持旧版本对照列，默认关闭）；`deliverables` → 按 `activeFile.type` 三套渲染：`ppt` 四列演进矩阵、`excel` 三个 sheet tab（工期甘特/财务收支/指标对标）、`doc|bp|attachment|vcr` 三章正文。 Sources: [src/components/RightWorkspacePanel.tsx:580-600]() [src/components/RightWorkspacePanel.tsx:601-700]() [src/components/RightWorkspacePanel.tsx:772-870]()
7. 三套预览的正文**全是硬编码示例内容**（「安里AI项目路标 · 全景演进矩阵」「智耘农业 BP 三章」），与 `activeFile` 只有文件名/时间/格式相关——换文件不会换内容。 Sources: [src/components/RightWorkspacePanel.tsx:601-772]() [src/components/RightWorkspacePanel.tsx:851-900]()
8. 产物清单数据源是**模块常量** `ALL_PROJECT_DELIVERABLES`（8 项），不是可变状态：`onAddTab`/`onCloseTab`/`openTabs` 虽由 App 传入，面板内**没有任何标签页渲染**，也没有新增/移除产物的入口。 Sources: [src/components/RightWorkspacePanel.tsx:39-125]() [src/components/RightWorkspacePanel.tsx:130-132]() [src/components/RightWorkspacePanel.tsx:156-158]()
9. 项目名展示来自 prop `projectName`，App 传的是 `currentActiveSpace?.name || '安里AI / 智耘农业'`；因 `activeSpace` 恒为 null（见 `nd-coach-sessions` 事实 9），**该值恒为字面量**。 Sources: [src/App.tsx:847]() [src/components/RightWorkspacePanel.tsx:164]()
10. 面板内多处死状态：`pendingReviewCount`（算而不用）、`freeSelectMode` / `showAnnotations` / `showChangeDeclaration`（无读写闭环）、`setZoomLevel` 从未被调用（缩放恒为 48%）；头部注释声称有「旧版本开关 / 已存批注」，实际未渲染。 Sources: [src/components/RightWorkspacePanel.tsx:190]() [src/components/RightWorkspacePanel.tsx:240-241]() [src/components/RightWorkspacePanel.tsx:246-250]() [src/components/RightWorkspacePanel.tsx:600-610]()
11. BP/文档预览区的「导出源文件」按钮只弹 toast「已下载该文件至本地」，**无任何下载实现**。 Sources: [src/components/RightWorkspacePanel.tsx:860-880]()

## 规则与边界（AI 开发硬约束）

- **产物清单是常量**：想让 AI 生成的文件真的出现在这里，必须先把 `ALL_PROJECT_DELIVERABLES` 改成 state/接口，并让 `generatedFiles` 的点击链路（`nd-coach-stream` 事实 11）与清单同源。
- 「打开文件」链路已有：`handleOpenFileInRightWorkspace(file)` → `setIsRightWorkspaceOpen(true)` + `setPanelMode('deliverables')` + `setActiveWorkspaceFileId(file.id)` + 追加到 `openTabs`。**注意它会把面板从审核模式切走**，这是设计如此，不要"顺手"改成保留 review。 Sources: [src/App.tsx:181-191]()
- 全屏态与拖拽互斥：全屏时分割线不渲染、宽度失效；改其一要同时看另一分支。
- `Ctrl/Cmd+J` 与 `Esc` 是全局键盘事件（App 层），改快捷键要同时看 `App.tsx:305-313`。
- 别被头部注释误导：注释里写的能力（旧版本开关、已存批注）**未必存在**，以 JSX 为准。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 产物清单接真实数据 | `:39-125` | App 的 `openWorkspaceTabs`/`activeWorkspaceFileId` 一族 |
| 实现多标签页 | `:156-158` | 需新增 tab 条 UI；App 侧 handler 已具备 |
| 预览接真实文件内容 | `:626-960` | 三套硬编码预览整体替换 |
| 调整默认比例 / 最小宽度 | `App.tsx:103-108` `:221-231` | 影响 6:4 默认与拖拽夹取边界 |
| 清理死状态 | `:190` `:240-250` | 纯清理，注意别删 `showOldVersion`（在用） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-stream-2-workspace-navigate`** ← `nd-coach-stream`（会话消息流）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击消息里的生成产物卡，或卡片内「在右侧独立区域打开」
  - 载荷：`AssociatedFileItem{id, name, type, typeLabel, size, updateTime, status?, metaInfo?}`
  - 逻辑：handleOpenFileInRightWorkspace(file) → App.handleOpenFileInRightWorkspace：setIsRightWorkspaceOpen(true) + setPanelMode('deliverables') + setActiveWorkspaceFileId(file.id) + 追加 openTabs。
  - 出处：`src/components/SceneAICoach.tsx:2718-2755`
  - 出处：`src/App.tsx:181-191`
  - 备注：会把右栏从审核模式切到展示模式（设计如此）。

**出边 1 条**

- **`e-coach-workspace-2-review-read`** → `nd-coach-review`（产物审核与改进意见）｜`read` · **implemented（已实现）**
  - 触发：（无触发，右栏读取审核态）
  - 逻辑：右栏按 reviewFiles / activeReviewIndex / panelMode 渲染「审核项 n/N」指示与审批三键的可用性（isApprovalNeeded）。
  - 出处：`src/App.tsx:831-870`
  - 出处：`src/components/RightWorkspacePanel.tsx:189-194`
<!-- EDGES:END -->
