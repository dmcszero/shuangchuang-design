---
id: nd-guidance-score
title: 六维评分详情
page: page-guidance
kind: panel
importance: medium
sources:
  - src/components/SceneGuidanceWorkbench.tsx:740-817
---

## 一句话定位

工作台中栏的「六维评分详情」tab：把当前版本的总分、六个维度的得分条、以及六条评审采分点的「当前分 / 上限 / 增量」摊开，回答「这 91 分是怎么来的、还可以从哪几条上加分」。**纯展示，无任何交互。**

## 事实（每条强制可回溯）

1. tab 内容为三块：总分横幅（`:743-768`）、六维条（`:770-784`）、评审细项表（`:786-815`）；全块**无 `onClick`、无 state**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:740-817]()
2. 总分横幅读 `SAMPLE_ASSESSMENT.total`（91）与 `scorecardName`；徽章「国赛金奖候选池 (TOP 3%)」与说明句「基于 2026 大赛最新六维标准（创新性、技术成熟度、商业模式闭环、团队协同、表现力、社会价值）」均为**硬编码文案**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:745-759]() [src/components/guidance/guidanceMockData.ts:415-431]()
3. 右上「相对校赛基线版提分 **+18 分 ↑**」是硬编码字面量。 Sources: [src/components/SceneGuidanceWorkbench.tsx:763-766]()
4. 六维条遍历 `dimensionScores`（创新性 94 / 技术可行性 93 / 商业落地 86 / 团队协同 90 / 表现力 89 / 社会价值 94），条宽直接取分数当百分比。 Sources: [src/components/SceneGuidanceWorkbench.tsx:771-783]() [src/components/guidance/guidanceMockData.ts:424-431]()
5. 细项表遍历 `items`，每条渲染 `itemText` + `dimension` 徽章 + `reason`，右侧渲染 `currentScore` / `cap` 与绿色 `+delta`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:791-813]()
6. 表头文案为「评审细项采分点与增量归因」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:788-790]()

## 规则与边界（AI 开发硬约束）

- **六维是页面自述口径，与工作台体检区的「一级指标」是两套评分体系**（本页：创新性/技术可行性/商业落地/团队协同/表现力/社会价值；工作台：`ProjectItem.tier1Scores`）。两处都叫「评分」，改一处不会同步另一处。 Sources: [src/components/guidance/guidanceMockData.ts:424-431]() [src/components/ProjectMemberWorkbench.tsx:696-719]()
- **数据自洽性已核对通过**（改 mock 时请保持）：六条 `cap` 合计 = 100；六条 `currentScore` 合计 = 19+19+17+14+14+8 = **91**，与 `total: 91` 一致；六条 `delta` 合计 = 10。 Sources: [src/components/guidance/guidanceMockData.ts:432-499]()
- 「+18 分」硬编码，数值上恰等于 `total(91) − v1.0.0(73)`，但**代码里没有这个减法**——`SAMPLE_VERSIONS` 里已有分数序列（73→81→87→91），要实现「基线提分」应改成计算式。 Sources: [src/components/SceneGuidanceWorkbench.tsx:765]() [src/components/guidance/guidanceMockData.ts:245-290]()
- 六维条用 `score` 直接当百分比宽度，因此**维度满分必须是 100** 才成立；若将来维度改为加权分（如满分 20），条宽会失真。
- `SAMPLE_ASSESSMENT.issues`（两条提示文案）与 `trend` / `isBaseline` / `degraded` 字段**本 tab 全部未渲染**。 Sources: [src/components/guidance/guidanceMockData.ts:500-503]()
- 细项表的 `quote` 字段（BP 原文引证）也未渲染——评审「有据可查」的佐证链在 UI 上断了一环。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 提分基线改为计算 | `:763-766` | 从 `SAMPLE_VERSIONS` 取校赛基线版 `total` 做差 |
| 渲染 `issues` 提示 | `:786-815` | `SAMPLE_ASSESSMENT.issues` 已有两条数据 |
| 渲染 `quote` 佐证 | `:793-802` | 每条采分点已有 BP 原文引证字段 |
| 维度满分非 100 时的条宽 | `:776-781` | 需按 `cap` 归一化 |
| 接真实评分接口 | `SAMPLE_ASSESSMENT` | 替换 `src/components/guidance/guidanceMockData.ts:415-504` |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
