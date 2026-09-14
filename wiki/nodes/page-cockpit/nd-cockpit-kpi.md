---
id: nd-cockpit-kpi
title: 金奖池 KPI 卡矩阵
page: page-cockpit
kind: panel
importance: high
sources:
  - src/components/CockpitDashboard.tsx:77-156
---

## 一句话定位

五张关键指标卡横排：项目总量、A 级金奖池、B 级省金池、C/D 基础池、工单督导闭环率——前三类与最后一类可点，直接把管理员带到对应工作台。

## 事实（每条强制可回溯）

1. 卡级派生在组件顶部计算：`aGradeProjects` / `bGradeProjects` / `cGradeProjects` / `dGradeProjects` / `warningProjects`，全部来自 prop `projects` 的字段过滤。 Sources: [src/components/CockpitDashboard.tsx:31-35]()
2. 第 1 张「申报项目总数」：数值写死为 **82 项**（非 `projects.length`），副行「同比历届增长 +28.5%」（写死）；点击 → `onNavigateTab('screening')`。 Sources: [src/components/CockpitDashboard.tsx:79-92]()
3. 第 2 张「A级 · 国赛金奖池」：数值为**真实派生** `aGradeProjects.length`，右上角徽标「TOP 18%」写死；副行「对标分 90分+ · 重点1v1护航」；点击 → `screening`。 Sources: [src/components/CockpitDashboard.tsx:94-109]()
4. 第 3 张「B级 · 省金/国银池」：数值 `bGradeProjects.length`（派生）+ 徽标「培育攻坚」；点击 → `screening`。 Sources: [src/components/CockpitDashboard.tsx:111-124]()
5. 第 4 张「C/D级 · 基础培育池」：数值 `cGradeProjects.length + dGradeProjects.length`（派生）+ 副文「常态化AI答疑」；点击 → `screening`。 Sources: [src/components/CockpitDashboard.tsx:126-139]()
6. 第 5 张「工单督导闭环率」：数值写死 **88.5%**（**不来自 App 的 `workOrders`**，本页根本收不到该数据）+ 副文「杜绝"评完就忘、听完不改"」；点击 → `onNavigateTab('supervision')`。 Sources: [src/components/CockpitDashboard.tsx:141-155]()
7. 五张卡的视觉分级：A 级卡为琥珀色系（强调）、B 级蓝色、闭环率卡翡翠色，其余白底。 Sources: [src/components/CockpitDashboard.tsx:94-96]() [src/components/CockpitDashboard.tsx:141-143]()

## 规则与边界（AI 开发硬约束）

- **五张卡里只有三张是真实派生**（A / B / C·D），另两张（总数 82、闭环率 88.5%）是写死值——这是本页「真假混排」的集中处，与横幅写死的 15 项形成三处不一致。见 issue `issue-cockpit-static-metrics`。
- 点击目标由 prop `onNavigateTab` 决定，其类型被窄化为 `'screening' | 'mentorship' | 'supervision' | 'milestones'`（App 侧再宽化为 `TabType`）。加新跳转目标要同时改两处类型。 Sources: [src/components/CockpitDashboard.tsx:20]() [src/App.tsx:694]()
- 卡面无空态：`projects` 为空数组时，A/B/C/D 三卡都显示 `0`，但总数卡仍显示 82。
- 闭环率卡是**唯一跨 section 的出口**（跳到 sec-mentorship 的督导页），其余四张都在 sec-screening 内。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 总数卡改用真实派生 | `:84-86` | `projects.length`；同时核对横幅「82 个」 |
| 闭环率接真实工单数据 | `:147-148` | 需给本页新增 `workOrders` prop（App 有数据，未传） |
| 新增一张指标卡 | `:77-156` | 栅格列数（`lg:grid-cols-5`）+ 可能的 `onNavigateTab` 目标 |
| 调整分池口径 | `:31-35` | 会同时影响 A 级池列表与预警列表 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-cockpit-kpi-2-screening`** → `page-screening`（智能初筛中心）｜`navigate` · **implemented（已实现）**
  - 触发：点击前四张 KPI 卡（申报项目总数 / A级·国赛金奖池 / B级·省金国银池 / C·D级·基础培育池）
  - 逻辑：四张卡的 onClick 均为 onNavigateTab('screening')；不带任何筛选载荷。
  - 出处：`src/components/CockpitDashboard.tsx:81`
  - 出处：`src/components/CockpitDashboard.tsx:96`
  - 出处：`src/components/CockpitDashboard.tsx:113`
  - 出处：`src/components/CockpitDashboard.tsx:128`
  - 出处：`src/App.tsx:693-695`
  - 备注：四张卡合并为一条边（同 from/to、同 logic）；落地到初筛页后仍受该页默认赛道筛选限制，看到的数与卡片数字不一致。
- **`e-cockpit-kpi-2-supervision`** → `page-supervision`（督导闭环中心）｜`navigate` · **implemented（已实现）**
  - 触发：点击第五张 KPI 卡「工单督导闭环率」
  - 逻辑：onClick={() => onNavigateTab('supervision')}。
  - 出处：`src/components/CockpitDashboard.tsx:143`
  - 出处：`src/App.tsx:693-695`
<!-- EDGES:END -->
