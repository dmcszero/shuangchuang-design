---
id: nd-guidance-snapshot-banner
title: 快照只读预览提示条
page: page-guidance
kind: bar
importance: medium
sources:
  - src/components/SceneGuidanceWorkbench.tsx:436-455
---

## 一句话定位

当用户在版本抽屉里点开某个历史快照时，页面顶部压出一条深色提示条：「你正在看的不是当前版本」，并提供唯一的退出口「返回当前编辑」。它是**只读预览态**的开关与标识。

## 事实（每条强制可回溯）

1. 渲染条件为 `viewingVersionId` 非空；为空时整条不出现。 Sources: [src/components/SceneGuidanceWorkbench.tsx:436]()
2. 底色为深色（`bg-slate-800 text-white`），视觉上刻意区别于琥珀色的任务上下文条（`nd-guidance-taskbar`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:437]()
3. 文案为「正在查看快照 **{viewingVersionId}**（只读预览）」；若该版本 `total != null`，追加一段 emerald 色分数。 Sources: [src/components/SceneGuidanceWorkbench.tsx:439-446]()
4. 唯一动作「返回当前编辑」→ `exitViewSnapshot` → `setViewingVersionId(null)`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:447-453]() [src/components/SceneGuidanceWorkbench.tsx:279]()
5. 写入方是版本抽屉：点快照行 → `handlePreviewVersion`；**若点的正是当前版本，则清空 `viewingVersionId`（切换语义，不是「选中」语义）**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:270-276]() [src/components/SceneGuidanceWorkbench.tsx:1019]()
6. `viewingVersionId` 是**跨区状态**，除本提示条外还改变三处：BP 区的编辑/预览切换按钮被 `disabled`、源码编辑框 `readOnly` 且置灰、BP 区整体走只读分支。 Sources: [src/components/SceneGuidanceWorkbench.tsx:507]() [src/components/SceneGuidanceWorkbench.tsx:550]() [src/components/SceneGuidanceWorkbench.tsx:559-560]()
7. 「回滚到此版」成功后也会清空 `viewingVersionId`，即回滚后自动退出预览态。 Sources: [src/components/SceneGuidanceWorkbench.tsx:282-288]()

## 规则与边界（AI 开发硬约束）

- **只读预览是「只读壳」，不换内容**：进入预览后中栏渲染的仍是 `bpContent`（当前正文），**不是所选快照的内容**。`ProjectVersion` 类型上有 `content?: string` 字段，但 `SAMPLE_VERSIONS` 四个版本**都没填**，渲染分支也从不读它。 Sources: [src/components/guidance/guidanceTypes.ts:110]() [src/components/guidance/guidanceMockData.ts:245-290]() [src/components/SceneGuidanceWorkbench.tsx:559]()
- 因上一条，当前「查看历史快照」的**用户承诺与实际行为不符**——这是本页最容易被误判为「已实现」的功能。
- 该提示条与任务上下文条**同层并存**且不互斥：从待办跳进来（有条）后再点快照（再有条），会出现两条提示条叠加，页面主体上移两行。
- z-index 与本条无关（都是普通文档流），但它下方的中栏会因两条提示条出现而压缩可视高度。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让预览真正显示历史快照内容 | `:550-563` | `ProjectVersion.content` 需真正落库/落 mock，并替换渲染源 |
| 退出预览时恢复编辑态 | `:279` | 同时需决定是否重置 `bpMode`（当前不回滚） |
| 与任务条叠加时的布局收敛 | `:402-455` | 两条 `flex-shrink-0` 提示条需合并为一条复合条或改为可关闭 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-guidance-version-drawer-2-snapshot-banner`** ← `nd-guidance-version-drawer`（版本历史抽屉）｜`writeback` · **implemented（已实现）**
  - 触发：点击版本抽屉中的某一版本行
  - 载荷：`viewingVersionId: string | null（点当前版本行则置 null）`
  - 逻辑：行 onClick → handlePreviewVersion(ver)：若 ver.versionId === currentVersionId 则清空 viewingVersionId（切换语义），否则 setViewingVersionId(ver.versionId)。该状态同时驱动顶部深色提示条的显隐、BP 区编辑按钮 disabled、源码编辑框 readOnly 与 BP 区只读分支。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:270-276`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1019`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:436-455`
  - 备注：「只读预览」不换内容——渲染源仍是 bpContent，ProjectVersion.content 字段存在但四个 mock 版本都没填。

**出边 0 条**

（无）
<!-- EDGES:END -->
