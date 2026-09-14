---
id: nd-cockpit-pool
title: A 级金奖潜力项目池
page: page-cockpit
kind: list
importance: high
sources:
  - src/components/CockpitDashboard.tsx:385-440
---

## 一句话定位

右栏的金奖种子榜：按分数顺序列出 A 级项目（默认只显示前 5 条），点任一条打开项目详情抽屉，底部按钮直接把管理员送去导师调度台做批量护航。

## 事实（每条强制可回溯）

1. 标题「A级重点金奖潜力项目池 ({aGradeProjects.length})」——括号内是**真实派生**计数。 Sources: [src/components/CockpitDashboard.tsx:386-391]()
2. 右上「全部排名」→ `onNavigateTab('screening')`。 Sources: [src/components/CockpitDashboard.tsx:392-397]()
3. 列表渲染 `aGradeProjects.slice(0, 5)`：**最多 5 条**，超出部分只能靠「全部排名」去初筛页看（当前 mock 数据 A 级恰为 5 条）。 Sources: [src/components/CockpitDashboard.tsx:401]()
4. 每条卡显示：序号徽标（`idx + 1`，**按数组顺序而非 `project.rank`**）、项目名（超长 `line-clamp-1`）、右侧 `totalScore 分`、下行 `{college} · {leader}` 与「金奖匹配度 `{goldSimilarity}%`」。 Sources: [src/components/CockpitDashboard.tsx:402-428]()
5. 卡片带稳定 id `cockpit-top-project-{project.id}`（可作自动化定位锚点）。 Sources: [src/components/CockpitDashboard.tsx:404]()
6. 点击卡片 → prop `onSelectProject(project)`（App 侧 `handleSelectProject` → 设 `selectedProject` 并开 `ProjectDetailDrawer`）。 Sources: [src/components/CockpitDashboard.tsx:405]() [src/App.tsx:497-500]()
7. 底部主按钮「为 A 级项目批量调度国家级导师」→ `onNavigateTab('mentorship')`。 Sources: [src/components/CockpitDashboard.tsx:431-438]()

## 规则与边界（AI 开发硬约束）

- **序号≠排名**：卡上第 1 条取的是 `aGradeProjects[0]`（沿 `mockProjects` 数组顺序），而项目自带 `rank` 字段（proj-001 rank=1 / proj-002 rank=2 …）。若数组顺序与 rank 不一致，序号会与实际排名矛盾——本页没有按 rank 排序。 Sources: [src/components/CockpitDashboard.tsx:31]() [src/data/mockProjects.ts:19]()
- 只显示前 5 条是本页的**硬编码截断**，不是分页；A 级超过 5 个时列表不会提示「还有 N 个」。
- 「批量调度国家级导师」按钮跳的是导师调度页，**不带任何筛选/A 级上下文**——接收端不知道来意（见 issue `issue-cockpit-nav-no-context`）。
- 本节点是驾驶舱唯一的「项目级下钻入口」之一（另一处是预警列表），两者都走同一个 prop，因此改 `onSelectProject` 语义会同时影响两处。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 按 rank 排序 | `:31`（派生） | 排序不影响其它卡（分池只按 grade） |
| 支持展开全部 / 分页 | `:401` | 需新增 state 或独立列表页 |
| 跳导师页时带上 A 级筛选 | `:431-438` | `onNavigateTab` 需扩为带载荷（当前只传 tab 名） |
| 增加卡片指标（赛道/阶段） | `:414-427` | `ProjectItem` 字段 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 3 条**

- **`e-cockpit-pool-2-screening`** → `page-screening`（智能初筛中心）｜`navigate` · **implemented（已实现）**
  - 触发：点击金奖池卡右上「全部排名」
  - 逻辑：onClick={() => onNavigateTab('screening')}。
  - 出处：`src/components/CockpitDashboard.tsx:392-397`
- **`e-cockpit-pool-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击 A 级金奖池中的任一项目卡
  - 载荷：`ProjectItem（完整对象）`
  - 逻辑：onClick={() => onSelectProject(project)} → App.handleSelectProject：setSelectedProject + setIsDrawerOpen(true) → 渲染 ProjectDetailDrawer。
  - 出处：`src/components/CockpitDashboard.tsx:405`
  - 出处：`src/App.tsx:497-500`
- **`e-cockpit-pool-2-mentorship`** → `page-mentorship`（导师智能调度）｜`navigate` · **implemented（已实现）**
  - 触发：点击金奖池底部「为 A 级项目批量调度国家级导师」
  - 逻辑：onClick={() => onNavigateTab('mentorship')}；不携带 A 级筛选或项目列表。
  - 出处：`src/components/CockpitDashboard.tsx:431-438`
  - 备注：接收端（导师调度页）的项目下拉初值是 projects[0]，与本按钮想表达的「A 级批量」无关。
<!-- EDGES:END -->
