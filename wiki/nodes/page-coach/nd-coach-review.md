---
id: nd-coach-review
title: 产物审核与改进意见
page: page-coach
kind: bar
importance: high
sources:
  - src/components/RightWorkspacePanel.tsx:186-232
  - src/App.tsx:113-180
  - src/components/SceneAICoach.tsx:141-210
---

## 一句话定位

「AI 生成的产物要不要收下」的审批闸门：同意 / 否决 / 提改进要求三个动作，结果既改文件状态、又**在会话里以学生身份留下一条消息**，形成「AI 产出 → 人审 → 反馈回到对话」的闭环。

## 事实（每条强制可回溯）

1. 审核数据来自 App：`reviewFiles`（`ReviewFileItem[]`，初值 `INITIAL_REVIEW_FILES`）+ `activeReviewIndex` + `panelMode`（`'review' | 'deliverables'`）。 Sources: [src/App.tsx:113-117]()
2. 可审批条件 = `currentMode === 'review' && !!activeReviewFile && activeReviewFile.status === 'pending'`；不满足时三个按钮 `disabled` 并置灰（title 会区分「无需审批 / 已通过 / 已否决 / 已提改进」四种说明）。 Sources: [src/components/RightWorkspacePanel.tsx:189-194]() [src/components/RightWorkspacePanel.tsx:483-540]()
3. 三个动作分别调 `onReviewDecision(file.id, 'approved' | 'rejected' | 'improved', comment?)`：同意/否决直接执行并弹 toast；改进先打开弹窗收集意见再提交（空意见不可提交）。 Sources: [src/components/RightWorkspacePanel.tsx:196-232]() [src/components/RightWorkspacePanel.tsx:898-965]()
4. 头部「审核项 n/N」指示当前进度（`activeReviewIndex + 1 / reviewFiles.length`），已处理项会显示「已同意 / 已否决 / 已提改进」徽标。 Sources: [src/components/RightWorkspacePanel.tsx:458-487]()
5. App 侧 `handleReviewDecision` 做四件事：① 把该文件 `status` 改为决策值并写 `decisionTime`（本地 HH:MM）；② 调 `reviewCallbackRef.current`（由 SceneAICoach 注册的处理器）；③ `setActiveReviewIndex` 顺移到下一条；④ 强制 `setIsRightWorkspaceOpen(true)` + `setPanelMode('review')`。 Sources: [src/App.tsx:119-146]() [src/App.tsx:117]()
6. SceneAICoach 通过 `onRegisterReviewHandler` 注册回调；回调在会话里追加一条 **student 身份**的消息，文案为「【产物审批已通过】我已同意《X》的新增/修改内容，已合并至项目交付物库。」/「【产物审批已否决】已否决《X》的…方案，保留原基准版本。」/「【产物改进要求】已提出对《X》的改进要求：…请 Agent 根据上述意见进行针对性修改与重构！」。 Sources: [src/components/SceneAICoach.tsx:199-210]() [src/components/SceneAICoach.tsx:163-198]()
7. 只有 `improved` 会触发后续：900ms 后追加一条 coach **假回复**「收到！已记录针对《X》的改进意见：「…」。正在结合金奖指标重新推理并润色生成新版本，请稍候在右侧产物区查验！」——**没有真正的重新生成**。 Sources: [src/components/SceneAICoach.tsx:185-197]()
8. 顺移逻辑用闭包里的 `reviewFiles.length`，且只在 `prev < length - 1` 时 +1；因为拿不到更新后的长度，**处理到最后一条后不会循环或清空**。 Sources: [src/App.tsx:127-140]()
9. 批注（annotations）链路在右栏**断裂**：App 提供 `handleAddAnnotation` / `handleRemoveAnnotation`，面板声明并解构了 `onAddAnnotation` / `onRemoveAnnotation`，但**都没有传给 `ReviewFileViewer`**（面板只传 `file` / `showOldVersion` / `onToggleOldVersion`），而 `ReviewFileViewer` 本身是支持 `onAddAnnotation` 的。 Sources: [src/App.tsx:148-180]() [src/components/RightWorkspacePanel.tsx:169-170]() [src/components/RightWorkspacePanel.tsx:583-592]() [src/components/review/ReviewFileViewer.tsx:16-23]()
10. SceneAICoach 里按注释应实现「审批完全部文件后审批窗口消失」的 `hasPendingReviewFiles`（文件顶部注释：「审批按钮窗口在审批完全部文件后消失」）**算而不用**，该行为未实现。 Sources: [src/components/SceneAICoach.tsx:147-150]()

## 规则与边界（AI 开发硬约束）

- 审批结果**只改动内存状态**（`setReviewFiles`），不落库、不写文件；刷新页面回到 `INITIAL_REVIEW_FILES`。
- 回调注册走 ref（`reviewCallbackRef`）而非 props 直传：`onRegisterReviewHandler` 在 effect 里注册，**依赖 `reviewFilesList` 与 `currentActiveReviewFile`**，因此每次列表变化都会重注册——改这块要小心闭包捕获的是旧值。 Sources: [src/components/SceneAICoach.tsx:199-210]() [src/App.tsx:117]()
- 「同意」的语义是「合并至项目交付物库」，但**交付物库是常量**（见 `nd-coach-workspace` 事实 8），所以这条文案目前无法兑现。
- 改进意见的快捷标签是**追加式**（把建议以「· 建议」行拼进 textarea），不是覆盖。
- 审核态与展示态互斥（`panelMode` 单值）：打开一个生成产物会把面板切到展示态，审核进度靠头部计数不丢失但当前文件会切走。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 打通批注链路 | `RightWorkspacePanel.tsx:583-592` | 把 `onAddAnnotation`/`onRemoveAnnotation` 透传给 `ReviewFileViewer` |
| 审批结果持久化 | `App.tsx:119-146` | 需引入后端或 localStorage |
| 全部审批后隐藏审批条 | `SceneAICoach.tsx:150` | 需把 `hasPendingReviewFiles` 传入面板并控制三键 |
| 改进后真重新生成 | `SceneAICoach.tsx:185-197` | 需接生成链路（当前仅 toast/文案） |
| 处理完自动跳下一批 | `App.tsx:127-140` | 顺移逻辑要用更新后的列表 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-workspace-2-review-read`** ← `nd-coach-workspace`（右侧独立工作区（产物展示））｜`read` · **implemented（已实现）**
  - 触发：（无触发，右栏读取审核态）
  - 逻辑：右栏按 reviewFiles / activeReviewIndex / panelMode 渲染「审核项 n/N」指示与审批三键的可用性（isApprovalNeeded）。
  - 出处：`src/App.tsx:831-870`
  - 出处：`src/components/RightWorkspacePanel.tsx:189-194`

**出边 1 条**

- **`e-coach-review-2-stream-writeback`** → `nd-coach-stream`（会话消息流）｜`writeback` · **implemented（已实现）**
  - 触发：点击审批三键（同意 / 否决 / 改进）
  - 载荷：`ReviewDecision = 'approved' | 'rejected' | 'improved'（改进另带 comment）`
  - 逻辑：App.handleReviewDecision 改该文件 status 与 decisionTime → 调 reviewCallbackRef（SceneAICoach 经 onRegisterReviewHandler 注册）→ postReviewChatMessage 追加一条 student 消息；improved 另在 900ms 后追加 coach 假回复「收到！…正在结合金奖指标重新推理并润色生成新版本」。
  - 出处：`src/App.tsx:119-146`
  - 出处：`src/components/SceneAICoach.tsx:199-210`
  - 出处：`src/components/SceneAICoach.tsx:163-198`
  - 备注：审批结果只改内存并回帖会话，不落库、不真正重新生成。
<!-- EDGES:END -->
