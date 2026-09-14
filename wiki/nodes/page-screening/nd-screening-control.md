---
id: nd-screening-control
title: 视图切换与四维筛选
page: page-screening
kind: form
importance: high
sources:
  - src/components/ScreeningHub.tsx:59-177
---

## 一句话定位

初筛中心的控制台：顶部三个视图 tab 决定「看哪张表」，下面四个筛选器（赛道 / 梯队 / 合规 / 关键词）决定「看哪些项目」——**全页唯一的数据入口**，三张表都吃它筛出来的结果。

## 事实（每条强制可回溯）

1. 页面持有 5 个本地 state：`selectedTrack`（初值 `'higher_education_creative'` 高教主赛道创意组）、`selectedGrade`（`ALL`）、`selectedCompliance`（`ALL`）、`searchQuery`（空）、`viewMode`（`tier2_matrix`）。 Sources: [src/components/ScreeningHub.tsx:30-34]()
2. `filteredProjects` 由 `useMemo` 派生：赛道精确匹配（`ALL` 除外）→ 梯队匹配 → 合规状态（`passed` 取 `compliance.passed === true`，`warning` 取反）→ 关键词在 **5 个字段**上做不区分大小写的子串匹配（`name` / `college` / `leader` / `advisor` / `code`）。 Sources: [src/components/ScreeningHub.tsx:37-55]()
3. **默认筛选项是「高教主赛道-创意组」**，不是全部：首屏只显示该赛道项目（mock 数据 8 条中 5 条），要看全部须手动切「全部申报赛道」。 Sources: [src/components/ScreeningHub.tsx:30]()
4. 视图切换是三个按钮（`tier2_matrix` / `comprehensive` / `compliance_scan`），选中态为 sky 底白字；三视图**互斥渲染**（`viewMode === xxx && ...`）。 Sources: [src/components/ScreeningHub.tsx:72-104]()
5. 赛道下拉选项把「一级/二级指标数量」写进了文案：「高教主赛道 - 创意组 (4个一级/17个二级)」「高教主赛道 - 创业组 (4个一级/20个二级)」（**其余三个赛道选项未标数量**）。 Sources: [src/components/ScreeningHub.tsx:121-127]()
6. 梯队下拉四档附分数区间说明（A 90分+ / B 80-89 / C 70-79 / D 70 以下）。 Sources: [src/components/ScreeningHub.tsx:138-143]()
7. 筛选变化**不重置 `viewMode`**，反之亦然；三视图共用同一份 `filteredProjects`。 Sources: [src/components/ScreeningHub.tsx:37-55]()

## 规则与边界（AI 开发硬约束）

- **筛选是「与」关系、无排序**：列表顺序 = `projects` 数组原序（即 mock 顺序），不是分数或排名序；`comprehensive` 视图的「排名」列直接显示 `project.rank` 字段，可能与实际行序不一致。
- 默认赛道筛选会让「项目总数」看起来比 `projects.length` 少——排查「项目不见了」先看这里。
- 搜索框覆盖 5 个字段；`code`（项目编号）也在内，可用来精确定位。
- 视图 tab 是**同一页面的三种呈现**，不是路由：刷新后回到 `tier2_matrix`；无处可分享链接。
- 指标数量文案（17 / 20）与真实数据的对应关系**不成立**——见 issue `issue-screening-fixed-columns-by-index`。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 默认改为「全部赛道」 | `:30` | 纯改初值 |
| 支持多赛道多选 | `:30` `:37-45` | 筛选逻辑与下拉控件都要改 |
| 增加排序（分数/排名） | `:37-55` | 需新增 sort state 与三视图共用的排序 |
| 视图模式持久化 / URL 化 | `:34` | 需引入路由或 query 同步 |
| 筛选条件带到下钻页 | `:37` | 目前 `onSelectProject` 不带筛选上下文 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
