---
id: nd-guidance-diff-modal
title: 版本快照差异比对弹层
page: page-guidance
kind: modal
importance: medium
sources:
  - src/components/guidance/GuidanceModals.tsx:23-175
---

## 一句话定位

从工作台顶栏或版本抽屉弹出的全屏比对弹层，让人选两个版本看「总分变化了多少、改了什么」。**唯一动态的是总分差，正文比对是写死的示例。**

## 事实（每条强制可回溯）

1. 组件为 `GuidanceVersionDiffModal`，声明于 `GuidanceModals.tsx:30`，props 为 `isOpen` / `onClose` / `versions` / `currentVersionId`。 Sources: [src/components/guidance/GuidanceModals.tsx:23-35]()
2. 挂载由工作台 `diffModalOpen` state 控制，弹层内部 `if (!isOpen) return null` 早退（非 CSS 隐藏）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:108]() [src/components/guidance/GuidanceModals.tsx:39]()
3. 两个下拉选择器：基准版本初值 `versions[1]?.versionId`，对比版本初值 `currentVersionId`；选项文案为 `{label} ({total}分)`，无评分的显示「暂无评分」。 Sources: [src/components/guidance/GuidanceModals.tsx:36-37]() [src/components/guidance/GuidanceModals.tsx:78-82]()
4. 「总分变化」= `(compareVer?.total || 0) - (baseVer?.total || 0)`，非负染绿显示 `+n`，为负染红显示 `n`。 Sources: [src/components/guidance/GuidanceModals.tsx:44]() [src/components/guidance/GuidanceModals.tsx:104-114]()
5. 弹层标题「版本快照差异比对 (Diff Inspector)」，副标题「比对不同提交节点间的商业计划书与评分演进变化」。 Sources: [src/components/guidance/GuidanceModals.tsx:56-57]()
6. 正文为**两张静态变更卡**：第5章「补强竞争壁垒」（改前/改后对照红绿块）、第10章「增设账期压力测试」；小标题固定写「关键章节变更摘要（2处主要修改，1处新增论据）：」。 Sources: [src/components/guidance/GuidanceModals.tsx:118-160]()
7. 底部「完成检视」按钮 → `onClose`。 Sources: [src/components/guidance/GuidanceModals.tsx:164-171]()
8. 三个触发入口全在工作台：顶栏「版本对比」按钮、抽屉工具区「对比所选两版」、抽屉每个版本行的「与当前对比」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:377-384]() [src/components/SceneGuidanceWorkbench.tsx:995-1001]() [src/components/SceneGuidanceWorkbench.tsx:1056-1062]()

## 规则与边界（AI 开发硬约束）

- **本弹层不做真实 diff**：两张变更卡的文案与红绿对照块是**源码里写死的字面量**，切换下拉里的任意两个版本，正文内容**不会变化**——只有顶部「总分变化」会重算。任何「diff 已完成」的判断都是误判。
- **弹层与 `viewingVersionId` 无关联**：抽屉里点「与当前对比」时并不会把该版本设为对比目标，`baseVerId`/`compareVerId` 完全由弹层内部 state 独立决定（初值永远是 `versions[1]` 与 `currentVersionId`）。因此「与当前对比」按钮的语义与实际行为不符。
- **`GuidanceModals.tsx` 同文件另导出两个组件，全库零引用**：`GuidanceUploadModal`（`:184-332`）与 `GuidanceCreateTodoModal`（`:341-481`）——`grep` 全 `src/` 只有本文件自身出现这两个名字。它们是**死代码**（合计约 298 行），且 `GuidanceCreateTodoModal` 的待办结构与 `GuidanceTodoItem` 契约一致，疑似为「工作台内建待办」的旧方案遗留。 Sources: [src/components/guidance/GuidanceModals.tsx:177-332]() [src/components/guidance/GuidanceModals.tsx:334-481]()
- 弹层用 `fixed inset-0 z-50`，会盖住版本抽屉（`z-40`）与遮罩（`z-30`）；从抽屉里触发时抽屉仍在打开态。
- 下拉的 `value` 若不在 `versions` 中会渲染成空选项（无兜底）；新增版本后 `baseVerId` 初值不会重算（state 只在首次挂载时初始化）。
- 「总分变化」在任一版本 `total` 为 `null` 时按 `0` 处理，会出现「暂无评分 → 91 分」被算成 `+91` 的失真。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接入真实 diff | `:118-160` | 需按所选两版的 `content` 做行级/段级比对（依赖 `ProjectVersion.content` 落地） |
| 「与当前对比」真正带上对比目标 | `SceneGuidanceWorkbench.tsx:1056-1062` | 需给弹层增加 `initialCompareVersionId` 入参 |
| 清理死组件 | `GuidanceModals.tsx:177-481` | 确认无规划后删除 `GuidanceUploadModal` / `GuidanceCreateTodoModal` |
| `total` 为 null 的差值口径 | `:44` | 应区分「未知」与「0 分」 |
| 弹层层级与抽屉共存 | `:47` | 若希望先关抽屉，需在触发时 `setDrawerOpen(false)` |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-guidance-topbar-2-diff-modal`** ← `nd-guidance-topbar`（全局引导顶栏）｜`navigate` · **implemented（已实现）**
  - 触发：点击顶栏「版本对比」按钮
  - 逻辑：onClick={() => setDiffModalOpen(true)} → 页面底部渲染 <GuidanceVersionDiffModal isOpen={diffModalOpen} …>，弹层内部 if (!isOpen) return null。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:377-384`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:108-109`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1084-1089`
- **`e-guidance-version-drawer-2-diff-modal`** ← `nd-guidance-version-drawer`（版本历史抽屉）｜`navigate` · **implemented（已实现）**
  - 触发：点抽屉工具区「对比所选两版」，或某版本行内的「与当前对比」
  - 逻辑：两处均调用 setDiffModalOpen(true)。注意：行内「与当前对比」用 e.stopPropagation() 阻止触发行级预览，但**并不会把该版本设为对比目标**——弹层的 baseVerId/compareVerId 由自身 state 独立初始化（versions[1] 与 currentVersionId）。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:995-1001`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1056-1062`
  - 出处：`src/components/guidance/GuidanceModals.tsx:36-37`
  - 备注：「与当前对比」的按钮语义与弹层实际行为不符，是易踩的交互缺口。

**出边 0 条**

（无）
<!-- EDGES:END -->
