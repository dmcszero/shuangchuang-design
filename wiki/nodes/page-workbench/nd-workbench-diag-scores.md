---
id: nd-workbench-diag-scores
title: 一级指标得分卡
page: page-workbench
kind: panel
importance: medium
sources:
  - src/components/ProjectMemberWorkbench.tsx:696-719
---

## 一句话定位

「AI 对标体检」tab 的上半区，用四张卡把项目的五个一级指标得分摊开，回答「我现在几分、离满分差多少」。

## 事实（每条强制可回溯）

1. 数据源 `project.tier1Scores`（`Tier1ScoreItem[]`），逐项渲染。 Sources: [src/types.ts:72-78]() [src/types.ts:120]() [src/components/ProjectMemberWorkbench.tsx:697]()
2. 每张卡显示：指标名、`得分 / 满分分`、大号百分比、进度条。 Sources: [src/components/ProjectMemberWorkbench.tsx:701-715]()
3. 百分比 = `Math.round(scoreItem.score / scoreItem.maxScore * 100)`。 Sources: [src/components/ProjectMemberWorkbench.tsx:698]()
4. 进度条颜色三档：`pct >= 90` 绿（emerald-500）、`pct >= 80` 天蓝（sky-500）、否则琥珀（amber-500）。 Sources: [src/components/ProjectMemberWorkbench.tsx:710-712]()
5. 布局为响应式网格：移动 1 列 / 中屏 2 列 / 大屏 4 列。 Sources: [src/components/ProjectMemberWorkbench.tsx:696]()
6. `Tier1ScoreItem` 自带二级指标数组 `tier2Scores`（`Tier2ScoreItem[]`），**当前 UI 完全未渲染**。 Sources: [src/types.ts:77]()
7. `ProjectItem` 另有 `weaknessLabels` / `strengthsLabels` 两个标签数组，本区块**同样未使用**。 Sources: [src/types.ts:121-122]()

## 规则与边界（AI 开发硬约束）

- 本区块**只读**：来自 `ProjectItem` 的静态字段，无任何写操作、无点击交互、无出边。
- 颜色阈值 `90` / `80` **硬编码**，与 `rules2026.ts` 的评审规则无任何关联；改评分口径时这里不会自动跟随。
- 「短板」在本区块**没有专门标识**——低分项只体现为琥珀色进度条，没有「这是短板」的语义标记，也没有排序（按 `tier1Scores` 原序）。
- 二级指标 `tier2Scores` 已存在于数据层但无 UI，属于**数据完备、呈现缺失**。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 展开二级指标 | `:697-718` | 消费已有字段 `tier2Scores`（types.ts:77），无需改数据 |
| 让短板可识别 | `:710-712` | 需要短板判定口径（现仅靠颜色） |
| 阈值接规则配置 | `:710-712` | `src/data/rules2026.ts` |
| 按得分排序 | `:697` | 需明确排序口径（升序暴露短板？） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
