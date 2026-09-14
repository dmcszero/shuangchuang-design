---
id: nd-guidance-topbar
title: 全局引导顶栏
page: page-guidance
kind: bar
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx:293-399
---

## 一句话定位

工作台最上方的固定顶栏：左侧交代「这是哪个项目、走到哪一阶段」，右侧提供**版本生命周期的四个动作**（保存快照 / 标为里程碑 / 版本对比 / 版本历史）。它是本页所有版本类操作的唯一发起处。

## 事实（每条强制可回溯）

**一、项目识别块（左）**

1. 左侧为 BP 方块徽章 + 项目标题（`truncate` 截断）+ 两个徽章：赛道（`currentProject.track`）与「国赛攻坚金奖梯队 (91分)」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:296-311]()
2. 副行文案为「负责人：{leader} · 主导类型：{SAMPLE_TRIAGE.primaryType} · 版本：{currentVersionId}」——**「主导类型」取自诊断分诊结果，「版本」取自版本 state**，是顶栏与另外两个数据域的唯一交汇点。 Sources: [src/components/SceneGuidanceWorkbench.tsx:312-314]()
3. 「(91分)」是**硬编码字面量**，不读 `SAMPLE_ASSESSMENT.total`；当前两者同为 91 属数据巧合。 Sources: [src/components/SceneGuidanceWorkbench.tsx:309]()

**二、L1~L6 阶段 stepper（中）**

4. stepper 容器为 `hidden xl:flex`——**xl 断点以下整块不渲染**（不是折叠，是消失）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:319]()
5. 数据源为 `stageProgress`（`useState(INITIAL_STAGE_ITEMS)`），本轮值只有一个「当前阶段」：判定条件**硬编码** `st.stage === 'L4'`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:96]() [src/components/SceneGuidanceWorkbench.tsx:321]()
6. 已完成态判定为 `st.status === 'done'`，命中时渲染对勾图标而非阶段号。 Sources: [src/components/SceneGuidanceWorkbench.tsx:322]() [src/components/SceneGuidanceWorkbench.tsx:336]()
7. 每个阶段按钮的 `onClick` **只有 `setCenterTab('diag')`，不消费 `stage` 值**——点 L1 与点 L6 的行为完全相同。 Sources: [src/components/SceneGuidanceWorkbench.tsx:326]()
8. 悬停提示 `title` 取 `st.hint`（如 L4 的「当前阶段：评委视界深度质询、竞品壁垒补强与六维增量提分」）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:327]() [src/components/guidance/guidanceMockData.ts:33]()

**三、版本四动作（右）**

9. **保存快照** → `handleSaveSnapshot`：新版本 id 为 `v2.0.${versions.length}`、`versionType:'snapshot'`、`total: 91`（硬编码）、插入数组头部并设为当前版本；按钮自身进入成功态（`saveSuccessTip`）并在 **2500ms 后自动复位**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:346-366]() [src/components/SceneGuidanceWorkbench.tsx:152-169]()
10. **标为里程碑** → `handleMarkMilestone`：固定生成 `v2.1.0-M`（`versionType:'milestone'`、`total: 92`），随后 `alert('已成功锁定当前版本为【国赛攻坚里程碑】，并已同步记录至项目全息大事记！')`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:368-375]() [src/components/SceneGuidanceWorkbench.tsx:172-188]()
11. **版本对比** → `setDiffModalOpen(true)`，打开 `nd-guidance-diff-modal`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:377-384]()
12. **版本历史** → `toggleDrawer`；按钮自身在开抽屉时反色（indigo 底白字）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:386-397]() [src/components/SceneGuidanceWorkbench.tsx:267]()

## 规则与边界（AI 开发硬约束）

- **`coachIntent` 是死状态**：`setCoachIntent` 在本文件**从未被调用**（`setCoachIntent` 仅出现在 :100 的声明行），因此 AI 兜底回复里引用的「基于【L4】阶段指引」恒为 L4。 Sources: [src/components/SceneGuidanceWorkbench.tsx:100]() [src/components/SceneGuidanceWorkbench.tsx:237]()
- **阶段 stepper 目前是「视觉态」而非「可跳转的阶段筛选」**：它读 `stageProgress` 只为上色，点击只切 tab。要让「点 L5 → 看 L5 的路演准备」，必须先引入阶段 state（并同时修掉上一条死状态）。
- 顶栏三处「当前进度」口径互不联动且部分硬编码：**「(91分)」(:309)**、**「当前阶段 L4」(:321)**、**「已存为新快照」提示 (:167-168)**。改评分或阶段口径时必须三处同步核对。
- 顶栏不参与页面滚动（整页 `h-[calc(100vh-4rem)]` 固定高度、`overflow-hidden`），新增按钮前先确认顶栏宽度预算——右侧已有 4 个按钮，窄屏会挤压左侧项目标题。
- 「标为里程碑」的版本号 `v2.1.0-M` **不递增**：连续点两次会产出两条同 id 的版本，`versions.map` 的 `key={ver.versionId}` 将重复。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让 stepper 真正按阶段定位 | `:319-341` | 引入阶段 state（替换死的 `coachIntent`）+ 各 tab 按阶段过滤 |
| 顶栏分数接真实评分 | `:309` | 改为读 `SAMPLE_ASSESSMENT.total` / 真实接口 |
| 保存快照总分接真实评分 | `:161` | `total: 91` 硬编码 |
| 里程碑版本号递增 | `:173` | `v2.1.0-M` 固定值，需按 `versions` 推导 |
| 窄屏适配 | `:344-398` | 4 个快捷动作需折叠为溢出菜单 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 3 条**

- **`e-guidance-topbar-2-version-drawer-navigate`** → `nd-guidance-version-drawer`（版本历史抽屉）｜`navigate` · **implemented（已实现）**
  - 触发：点击顶栏「版本历史」按钮
  - 逻辑：顶栏按钮 onClick={toggleDrawer} → setDrawerOpen(prev => !prev)；抽屉为绝对定位右缘面板（z-40），以 translate-x-0 / translate-x-full 切换显隐；同时渲染 z-30 遮罩（点击遮罩也走 toggleDrawer）。按钮自身在 drawerOpen 时反色。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:386-397`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:267`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:964-973`
  - 备注：与 e-guidance-topbar-2-version-drawer-writeback 构成平行边（同 from/to、不同 trigger）：本条管「开抽屉」，那条管「往抽屉里加数据」。
- **`e-guidance-topbar-2-version-drawer-writeback`** → `nd-guidance-version-drawer`（版本历史抽屉）｜`writeback` · **implemented（已实现）**
  - 触发：点击顶栏「保存快照」或「标为里程碑」按钮
  - 载荷：`ProjectVersion{versionId, versionType:'snapshot'|'milestone', label, source:'manual'|'milestone', total, commitMsg, branchName:'main'}`
  - 逻辑：handleSaveSnapshot 生成 v2.0.${versions.length} 并 setVersions([newVer, ...versions]) + setCurrentVersionId；handleMarkMilestone 生成固定 v2.1.0-M 做同样两件事。抽屉直接 map 该 versions 数组渲染时间轴，因此写入即时可见。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:346-375`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:152-188`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1013`
  - 备注：两条路径产出的 total 均硬编码（91 / 92），不读真实评分。
- **`e-guidance-topbar-2-diff-modal`** → `nd-guidance-diff-modal`（版本快照差异比对弹层）｜`navigate` · **implemented（已实现）**
  - 触发：点击顶栏「版本对比」按钮
  - 逻辑：onClick={() => setDiffModalOpen(true)} → 页面底部渲染 <GuidanceVersionDiffModal isOpen={diffModalOpen} …>，弹层内部 if (!isOpen) return null。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:377-384`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:108-109`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:1084-1089`
<!-- EDGES:END -->
