---
id: nd-cockpit-heatmap
title: 指标得分率热力洞察
page: page-cockpit
kind: panel
importance: high
sources:
  - src/components/CockpitDashboard.tsx:161-303
---

## 一句话定位

把 2026 国赛的**一级/二级评审指标**摊成一张全校得分率热力图：四个一级指标分组内逐项列出二级指标得分率，短板项用琥珀/玫红标出，一眼看出「全校普遍差在哪」。

## 事实（每条强制可回溯）

1. 卡片标题「全校项目 2026 国赛一级与二级细分指标得分率热力洞察」，副题写「基于 82 个项目的 AI 结构化评分数据加权统计」（**82 写死，实际 `projects.length = 8`**）。 Sources: [src/components/CockpitDashboard.tsx:162-170]()
2. 右上按钮「查看初筛全览 ›」→ `onNavigateTab('screening')`。 Sources: [src/components/CockpitDashboard.tsx:173-179]()
3. 四个一级指标分组（数值与颜色全部写死）：
   - **个人成长（满分30分）** 全校平均 86.2%，含 5 个二级项：立德树人 92% / 调研深入 76%⚠️ / 逻辑正确 88% / 知识应用 89% / 人才培养 86%。 Sources: [src/components/CockpitDashboard.tsx:183-215]()
   - **项目创新（满分30分）** 全校平均 87.8%，含 3 项：问题导向 94% / 目标导向 90% / 创新成效 88%。 Sources: [src/components/CockpitDashboard.tsx:216-240]()
   - **产业价值（满分25分 / 创业组30分）** 全校平均 **68.4%（严重短板⚠️，整组玫红底）**，含 4 项：产业认知 78% / **市场定位与财务 58%🚨（唯一加粗玫红边框项）** / 落地前景 69% / 社会影响 85%。 Sources: [src/components/CockpitDashboard.tsx:241-269]()
   - **团队协作（满分15分）** 全校平均 85.0%，含 5 项：团队精神 90% / 团队结构 74%⚠️ / 团队效能 88% / 外部资源 86% / 团队贡献 87%。 Sources: [src/components/CockpitDashboard.tsx:270-303]()
4. 短板标记的视觉语言：琥珀色边框 + `⚠️`（次级短板）、玫红加粗边框 + `🚨`（最短板）——本页只有「市场定位与财务 58%」用了最高级。 Sources: [src/components/CockpitDashboard.tsx:248-253]()
5. **二级指标名称与 `mockProjects` 的评分结构不同源**：这里用的是自造项（如「调研深入」「团队结构」），而 mockProjects 的 `tier1Scores[].items[]` 用的是另一套命名与分组（如 `iv_2 市场定位`、`ry_tc2 团队结构`），且带 `benchmarkGoldScore`（金奖基准）字段——热力图完全没有使用后者的数据。 Sources: [src/data/mockProjects.ts:36-45]() [src/data/mockProjects.ts:60-81]()
6. 本卡无 state、无交互（除右上跳转按钮），是纯展示。

## 规则与边界（AI 开发硬约束）

- **热力图数据是常量，不是统计结果**：页面声称「基于 82 个项目加权统计」，实际每个百分比都是手写。接真实数据时，正确来源是 `ProjectItem.tier1Scores[].items[].score/maxScore` 的加权聚合（mockProjects 已具备该结构，含金牌基准线）。
- 一级指标的**分值区间本身是评审规则的一部分**（个人成长30 / 项目创新30 / 产业价值25·创业组30 / 团队协作15·创业组20），改动会波及页面其它处与 PRD 口径，属产品事实而非样式。
- `⚠️` / `🚨` 是**人工指定的**，不是按阈值算出来的；接真实数据时要补一条阈值规则。
- 指标分组数与二级项数都与真实评分表可能不一致，建议改这块前先与「2026 评审规则」对照（`page-knowledge-base` / `规则导出`）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 热力图接真实聚合 | `:181-303` | 需引入 `tier1Scores` 结构与加权算法；页面需新增 `projects` 之外的数据（已具备） |
| 短板判定改阈值驱动 | `:248-253` | 需定义阈值（如 <70% 标橙、<60% 标红） |
| 指标名与评审规则对齐 | `:183-303` | 需与 `rules2026.ts` / 知识库口径核对 |
| 支持点击二级指标下钻 | `:186-303` | 需新增出口与目标页（当前无） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-cockpit-heatmap-2-screening`** → `page-screening`（智能初筛中心）｜`navigate` · **implemented（已实现）**
  - 触发：点击热力图卡右上「查看初筛全览 ›」
  - 逻辑：onClick={() => onNavigateTab('screening')}。
  - 出处：`src/components/CockpitDashboard.tsx:173-179`
<!-- EDGES:END -->
