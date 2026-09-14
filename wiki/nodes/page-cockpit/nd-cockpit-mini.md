---
id: nd-cockpit-mini
title: 赛道分布与辅导转化小盘
page: page-cockpit
kind: panel
importance: medium
sources:
  - src/components/CockpitDashboard.tsx:305-382
---

## 一句话定位

热力图下方的两块速览小卡：左边是四条赛道报名分布进度条，右边是「辅导 → 提分」的转化三宫格与经验沉淀句——把全校的**结构与过程**摆在一起。

## 事实（每条强制可回溯）

1. 左卡标题「① 报名赛道分布 (82项)」+ 注「新工科占45%」；四条赛道全部写死：
   - 高教主赛道（创意/创业）**42 项 (51%)** Sources: [src/components/CockpitDashboard.tsx:314-320]()
   - 青年红色筑梦之旅赛道 **20 项 (24%)** Sources: [src/components/CockpitDashboard.tsx:322-328]()
   - 产业命题赛道 **12 项 (15%)** Sources: [src/components/CockpitDashboard.tsx:330-336]()
   - 职教赛道 / 萌芽赛道 **8 项 (10%)** Sources: [src/components/CockpitDashboard.tsx:338-344]()
   进度条宽度即上述百分比字面量（`style={{ width: '51%' }}` 等）。 Sources: [src/components/CockpitDashboard.tsx:318]()
2. 右卡标题「② 专家辅导与提分跃迁」+ 徽标「均分提升 **+7.4分**」（写死）；三宫格：下发修改工单 **68 个** / 专家二次Check **52 次** / 重点培育导师 **18 位**（全部写死）。 Sources: [src/components/CockpitDashboard.tsx:357-375]()
3. 底部经验沉淀句：「✨ 专家评审经验沉淀：已沉淀脱敏金奖答辩点评 **142 条**，生成《双创避坑指南》**6 册**。」（写死）。 Sources: [src/components/CockpitDashboard.tsx:376-378]()
4. 两卡均为纯展示，无按钮、无 state。

## 规则与边界（AI 开发硬约束）

- 四条赛道数字加起来是 42+20+12+8 = **82**，与横幅/KPI 的「82 项」成套（同一批写死数据）；真实 `projects` 只有 8 条且赛道字段分布不同。改一处必须四处一起改，否则比例自相矛盾。
- 右卡的「工单 68 / 二次 Check 52」与真实 `workOrders`（App 层数据，本页收不到）无关；「提分跃迁 +7.4 分」需要历史分数快照才成立，当前**无此数据源**。
- 百分比与项数是**两套并行字面量**（项数与 `width` 各写一次），改数字要成对改。
- 本卡与 `page-screening` 的池子统计口径不同（那边按 grade 分级，这边按赛道分）——合并统计时先定口径。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 赛道分布接真实数据 | `:314-344` | 需按 `ProjectItem.trackLabel` 聚合 + 计算百分比（去掉手写 width） |
| 提分转化接真实工单 | `:357-375` | 需新增 `workOrders` prop；「提分」需历史分数 |
| 增加更多赛道分类 | `:314-344` | 栅格与配色 |
| 经验沉淀做成可跳转 | `:376-378` | 可能指向 `page-mentorship` 的资产沉淀 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
