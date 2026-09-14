---
id: nd-milestones-trend
title: 阶段均分跃迁卡
page: page-milestones
kind: panel
importance: medium
sources:
  - src/components/MilestoneKanban.tsx:90-124
---

## 一句话定位

四张阶段均分卡（申报初筛 81.2 → 校赛督导后 86.5 → 省赛集训后 90.8 → 国赛冲刺 94.8），配一个「整体均分净增 +7.4 分」徽标——用一条上行的数字线讲「培育有效」。

## 事实（每条强制可回溯）

1. 卡片标题「重点培育梯队：各备赛阶段均分跃迁与金奖指标提升趋势」，右上徽标写死「整体均分净增 **+7.4 分**」。 Sources: [src/components/MilestoneKanban.tsx:93-99]()
2. 四张卡的数字与评注**全部写死**：81.2 分（主要问题：产业定位不清）/ 86.5 分（环比提升 +5.3 分）/ 90.8 分（财务模型与估值补强）/ 94.8 分（已达国赛金奖夺金水准）。 Sources: [src/components/MilestoneKanban.tsx:102-121]()
3. 四卡配色依次为：灰 / 天蓝 / 蓝 / 琥珀（越靠后越暖，暗示层级上升）。 Sources: [src/components/MilestoneKanban.tsx:103-120]()
4. 本卡**不吃任何 props**，是纯常量展示。 Sources: [src/components/MilestoneKanban.tsx:90-124]()

## 规则与边界（AI 开发硬约束）

- **这里的四个数字是「故事」不是统计**：真实数据里每个项目只有一个 `totalScore`，**没有历史分数快照**，因此「阶段均分跃迁」在当前数据结构下无法真实计算——要做真必须先补历史分数（或从工单的 `expertCheck.scoreChangeDelta` 累加）。 Sources: [src/data/mockProjects.ts:20]()
- 「+7.4 分」与 `page-cockpit` 的「均分提升 +7.4分」、`page-supervision` 的「AI 复核提分均值 +7.0 分」是**三个相近但不同的写死数字**——同一叙事口径分散在多页。
- 阶段数与 `nd-milestones-stages` 的 L1~L5 是 4 vs 5 的不对齐（这里四张卡对应「申报/校赛/省赛/国赛」，阶段卡有五段）——两处都在讲同一件事，段数却不同。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 均分趋势接真实数据 | `:102-121` | 需历史分数快照或工单提分累加 |
| 与阶段卡段数对齐 | `:102-121` | 需产品确认阶段到底几段（与 L1~L6/L1~L5/L1~L4 之争同源） |
| 统一全局「提分」数字口径 | 跨页 | `page-cockpit` :604 与 `page-supervision` :604 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
