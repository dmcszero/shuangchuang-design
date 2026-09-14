---
id: nd-guidance-version-drawer
title: 版本历史抽屉
page: page-guidance
kind: drawer
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx:963-1080
---

## 一句话定位

全链路指导工作台右缘的版本抽屉，回答「这份 BP 有过哪些版本、谁在什么时候改了哪一版」：选中可只读预览、两版可对比 diff、可回滚、可存快照。它是项目工作台「项目文件夹」里那条版本线的**设计归宿**。

## 事实（每条强制可回溯）

**一、结构与开合**

1. 抽屉为绝对定位右缘面板，宽 380px、`z-40`；遮罩层 `z-30`（点击遮罩关闭）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:965-973]()
2. 开合由 `drawerOpen` 控制，位移在 `translate-x-0` 与 `translate-x-full` 之间切换。 Sources: [src/components/SceneGuidanceWorkbench.tsx:972]()
3. 开启入口在工作台顶栏「版本历史」按钮（走 `toggleDrawer`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:386-397]()

**二、头部与工具**

4. 标题「版本历史与快照」，副标题「选中快照可在中栏只读预览 · 双版本可对比 diff」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:978-982]()
5. 工具区两个按钮：「对比所选两版」→ `setDiffModalOpen(true)`；「存为快照」→ `handleSaveSnapshot`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:995-1008]()
6. `handleSaveSnapshot` 生成新版本 id `v2.0.${versions.length}`，`versionType: 'snapshot'`、`source: 'manual'`、`total: 91`、`branchName: 'main'`，并插入版本数组头部。 Sources: [src/components/SceneGuidanceWorkbench.tsx:152-169]()

**三、版本时间轴**

7. 遍历 `versions` 渲染；当前版本高亮为 indigo 底，正在预览版本高亮为 amber 底。 Sources: [src/components/SceneGuidanceWorkbench.tsx:1013-1026]()
8. 每项显示 `commitMsg`、`createdAt`、`branchName`（回退 `'main'`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:1047-1053]()
9. 点击整行 → `handlePreviewVersion` → 中栏进入只读预览，页面顶部出现「快照只读预览提示条」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:1019]() [src/components/SceneGuidanceWorkbench.tsx:436-441]()
10. 行内操作两个：**「与当前对比」**（所有版本可见，`stopPropagation` 后开 diff 弹层）、**「回滚到此版」**（仅非当前版本可见，`stopPropagation` 后调 `handleRollbackTo`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:1055-1072]()
11. 底部提示「↑ 点击快照行 → 中栏进入只读预览并联动顶部提示条」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:1076-1078]()

**四、关联弹层**

12. diff 对比由 `GuidanceVersionDiffModal` 承载，接收 `versions` 与 `currentVersionId`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:1084-1089]()

## 规则与边界（AI 开发硬约束）

- **版本数据源是 `guidanceMockData.SAMPLE_VERSIONS`，与项目工作台「项目文件夹」里那条硬编码版本线（`['v1.0.0 · 校赛基线', …]`）不是同一份数据**。两处文案都声称「同源」，实际各自 mock——**这是本库最明显的一处口径谎报**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:89]() [src/components/ProjectMemberWorkbench.tsx:937]()
- **本抽屉只能由工作台顶栏按钮打开**，没有任何外部参数可让它直开。项目工作台想「跳到版本历史」，当前**缺少入参入口**（无 props、无 query、无 context 字段）。
- `handleSaveSnapshot` 的总分硬编码 `total: 91`，不随实际评分联动。
- 回滚按钮用 `stopPropagation` 阻止触发整行的「预览」行为，改这两处交互时必须保留该隔离。
- 抽屉宽 380px 固定，不响应拖拽（与 App 层右工作区可拖拽的 6:4 分割线不是同一机制）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 支持外部「直开版本历史」 | `drawerOpen` 状态 `:93` | 需新增 props（如 `initialDrawerOpen`）并在 App 层与跳转链路串联 |
| 让版本线与项目文件夹统一 | `:89` + `ProjectMemberWorkbench.tsx:937` | 抽出共享版本常量或 mock |
| 快照总分接真实评分 | `:161` | `handleSaveSnapshot` 应读当前评分而非硬编码 91 |
| 版本线接真实后端 | `SAMPLE_VERSIONS` | `src/components/guidance/guidanceMockData.ts` |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 4 条**

- **`e-workbench-folder-2-guidance-version-drawer`** ← `nd-workbench-folder`（项目文件夹）｜`navigate` · **intended（设计有·未实现）**｜severity: medium
  - 触发：点击项目文件夹主文档版本线下方的「完整版本历史 / diff 对比 / 回滚」提示语
  - 逻辑：当前无任何实现——该处是纯文本 <div>，没有 onClick，也不会调用任何 prop。
  - 设计依据：源码文案明确写好了目标位置：「完整版本历史 / diff 对比 / 回滚 → 全链路指导工作台顶栏『版本历史』抽屉」src/components/ProjectMemberWorkbench.tsx:950-952
  - 期望行为：点击后跳到全链路指导工作台，并自动打开其右缘版本历史抽屉（drawerOpen=true）。
  - **卡点**：两个障碍：①该处为静态文本，无点击处理器，需先加交互；②SceneGuidanceWorkbench 的 drawerOpen 是内部 useState(:93)，没有任何 props 可从外部控制，需先开放入参（如 initialDrawerOpen）。
- **`e-workbench-folder-2-guidance-versionline-reuse`** ← `nd-workbench-folder`（项目文件夹）｜`reuse` · **intended（设计有·未实现）**｜severity: medium
  - 触发：（无触发，宣称数据同源）
  - 逻辑：项目文件夹的「主文档版本线」文案声明「与全链路指导工作台快照同源」，但两侧实际各自 mock：项目侧是 JSX 内硬编码字面量数组，工作台侧读 guidanceMockData.SAMPLE_VERSIONS，无共享常量。
  - 设计依据：文案「版本线（与全链路指导工作台快照同源）」src/components/ProjectMemberWorkbench.tsx:936
  - 期望行为：两处版本线读同一份数据源（同一常量或同一接口），版本号序列天然一致。
  - **卡点**：项目工作台版本线是 JSX 内联硬编码数组（:937），不属于任何 mock 文件；需先抽出共享版本常量，再让两侧引用。
- **`e-guidance-topbar-2-version-drawer-navigate`** ← `nd-guidance-topbar`（全局引导顶栏）｜`navigate` · **implemented（已实现）**
  - 触发：点击顶栏「版本历史」按钮
  - 逻辑：顶栏按钮 onClick={toggleDrawer} → setDrawerOpen(prev => !prev)；抽屉为绝对定位右缘面板（z-40），以 translate-x-0 / translate-x-full 切换显隐；同时渲染 z-30 遮罩（点击遮罩也走 toggleDrawer）。按钮自身在 drawerOpen 时反色。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:386-397`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:267`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:964-973`
  - 备注：与 e-guidance-topbar-2-version-drawer-writeback 构成平行边（同 from/to、不同 trigger）：本条管「开抽屉」，那条管「往抽屉里加数据」。
- **`e-guidance-topbar-2-version-drawer-writeback`** ← `nd-guidance-topbar`（全局引导顶栏）｜`writeback` · **implemented（已实现）**
  - 触发：点击顶栏「保存快照」或「标为里程碑」按钮
  - 载荷：`ProjectVersion{versionId, versionType:'snapshot'|'milestone', label, source:'manual'|'milestone', total, commitMsg, branchName:'main'}`
  - 逻辑：handleSaveSnapshot 生成 v2.0.${versions.length} 并 setVersions([newVer, ...versions]) + setCurrentVersionId；handleMarkMilestone 生成固定 v2.1.0-M 做同样两件事。抽屉直接 map 该 versions 数组渲染时间轴，因此写入即时可见。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:346-375`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:152-188`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1013`
  - 备注：两条路径产出的 total 均硬编码（91 / 92），不读真实评分。

**出边 2 条**

- **`e-guidance-version-drawer-2-diff-modal`** → `nd-guidance-diff-modal`（版本快照差异比对弹层）｜`navigate` · **implemented（已实现）**
  - 触发：点抽屉工具区「对比所选两版」，或某版本行内的「与当前对比」
  - 逻辑：两处均调用 setDiffModalOpen(true)。注意：行内「与当前对比」用 e.stopPropagation() 阻止触发行级预览，但**并不会把该版本设为对比目标**——弹层的 baseVerId/compareVerId 由自身 state 独立初始化（versions[1] 与 currentVersionId）。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:995-1001`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1056-1062`
  - 出处：`src/components/guidance/GuidanceModals.tsx:36-37`
  - 备注：「与当前对比」的按钮语义与弹层实际行为不符，是易踩的交互缺口。
- **`e-guidance-version-drawer-2-snapshot-banner`** → `nd-guidance-snapshot-banner`（快照只读预览提示条）｜`writeback` · **implemented（已实现）**
  - 触发：点击版本抽屉中的某一版本行
  - 载荷：`viewingVersionId: string | null（点当前版本行则置 null）`
  - 逻辑：行 onClick → handlePreviewVersion(ver)：若 ver.versionId === currentVersionId 则清空 viewingVersionId（切换语义），否则 setViewingVersionId(ver.versionId)。该状态同时驱动顶部深色提示条的显隐、BP 区编辑按钮 disabled、源码编辑框 readOnly 与 BP 区只读分支。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:270-276`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1019`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:436-455`
  - 备注：「只读预览」不换内容——渲染源仍是 bpContent，ProjectVersion.content 字段存在但四个 mock 版本都没填。
<!-- EDGES:END -->
