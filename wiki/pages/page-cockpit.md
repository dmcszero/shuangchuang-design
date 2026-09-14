---
id: page-cockpit
title: 数据驾驶舱
section: sec-cockpit
importance: high
view: cockpit
component: src/components/CockpitDashboard.tsx
sources:
  - src/components/CockpitDashboard.tsx:1-465
related_pages: ["page-screening", "page-milestones", "page-mentorship", "page-supervision"]
nodes:
  - nd-cockpit-banner
  - nd-cockpit-kpi
  - nd-cockpit-heatmap
  - nd-cockpit-mini
  - nd-cockpit-pool
  - nd-cockpit-warning
---

## 一句话定位

学校管理端（`school_admin`）登录后的**默认落地页**（`p-school.defaultPage`）：一条 AI 决策指令 + 五张 KPI 卡 + 一张指标得分率热力图 + 两块速览小盘 + 两个项目级清单（金奖池 / 预警），覆盖「全校态势 → 该补哪块 → 该找谁」三跳。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 `App.tsx` 在 `activeTab === 'cockpit'` 时挂载，接收五类 props：`projects` / `onSelectProject` / `onOpenReportExport` / `onOpenBatchImport` / `onNavigateTab`（窄化为 `'screening' | 'mentorship' | 'supervision' | 'milestones'`）。 Sources: [src/App.tsx:688-695]() [src/components/CockpitDashboard.tsx:12-29]()
2. 本页**不在沉浸式白名单**内，外层可纵向滚动、有常规内边距与全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `cockpit-dashboard-view`。 Sources: [src/components/CockpitDashboard.tsx:38]()

**二、页面级结构（不单独下钻）**

4. 页面是**单列纵向流**（横幅 → KPI 行 → 三栏网格 → 两块小盘），无本地 state、无 useEffect、无数据请求——**全页是纯 props 渲染**。 Sources: [src/components/CockpitDashboard.tsx:24-36]()
5. 派生数据只有两类：按 `grade` 分池（A/B/C/D）与按 `healthStatus` 筛预警。 Sources: [src/components/CockpitDashboard.tsx:31-35]()
6. 主网格为 `lg:grid-cols-3`：左 2 栏放热力图与小盘，右 1 栏放金奖池与预警。 Sources: [src/components/CockpitDashboard.tsx:158-159]()

**三、数据口径（本页最重要的结构事实）**

7. **真实派生数字只有三处**：A 级池卡与列表计数（`aGradeProjects.length`）、B 级与 C/D 级卡、预警列表计数（`warningProjects.length`）。其余全页数字（82 项 / 15 个 A 级种子 / +28.5% / 88.5% 闭环率 / 68.4% / 58% / 赛道 42·20·12·8 / 工单 68 / 二次 Check 52 / 导师 18 / 点评 142 / 指南 6 册）**全部是写死的字面量**。 Sources: [src/components/CockpitDashboard.tsx:31-35]() [src/components/CockpitDashboard.tsx:86]() [src/components/CockpitDashboard.tsx:147]()
8. 实测对照：`mockProjects` 实际只有 **8 个**项目（A 5 / B 1 / C 1 / D 1，另 `warning` 1 + `critical` 2），与页面上「82 项」「15 个 A 级」严重不符——**同一页里真实派生值与写死文案自相矛盾**（见 issue `issue-cockpit-static-metrics`）。 Sources: [src/data/mockProjects.ts:4]() [src/components/CockpitDashboard.tsx:31-35]()
9. 热力图的二级指标命名与 `mockProjects.tier1Scores` 的命名/结构**不同源**（后者含 `score/maxScore/benchmarkGoldScore` 且每项有评语，前者是自造项名与百分比）。 Sources: [src/data/mockProjects.ts:36-81]() [src/components/CockpitDashboard.tsx:183-303]()
10. 本页**拿不到 `workOrders`**（App 有该数据但未传入），因此所有工单相关指标（闭环率、下发工单数、二次 Check）不可能是真实值。 Sources: [src/App.tsx:688-695]()

**四、跨页出口**

11. 本页共 8 个出口：横幅 2 个（导出汇报 / 批量导入）、KPI 4 张卡（→ screening ×3 组 + supervision ×1）、热力图 1 个（→ screening）、金奖池 3 个（全部排名 → screening、项目卡 → 详情抽屉、批量调度导师 → mentorship）、预警列表 1 个（→ 详情抽屉）。 Sources: [src/components/CockpitDashboard.tsx:60]() [src/components/CockpitDashboard.tsx:81]() [src/components/CockpitDashboard.tsx:174]() [src/components/CockpitDashboard.tsx:393]() [src/components/CockpitDashboard.tsx:405]() [src/components/CockpitDashboard.tsx:433]() [src/components/CockpitDashboard.tsx:457]()
12. `onNavigateTab` 只传**目标 tab 名**，不带任何上下文（如「A 级筛选」「该项目」）——接收页无法知道用户从哪来、想干什么。 Sources: [src/components/CockpitDashboard.tsx:20]()

## 规则与边界（AI 开发硬约束）

- **本页是「演示数字」与「真实数据」混排最严重的一页**：改任何一个数字前，先确认它是 `xxx.length` 派生还是字面量；两者不同步会出现同一屏内「A 级 5 项」与「15 个金奖种子」并存的矛盾（issue `issue-cockpit-static-metrics`）。
- 本页**无 state、无请求、无算法**：它是一张「展示板」，不是数据源。所有能力（导出、导入、跳转）都是 App 层 props；给本页加数据能力必须先在 App 层准备好数据（如 `workOrders`）。
- 「A 级」「金奖池」「TOP 18%」这类分级口径全部硬编码在 props 过滤器与文案里，**与 `page-screening` 的分级口径是否一致未经验证**——做统一口径时应把分级规则抽成共享常量（可参考 `rules2026.ts`）。
- 单位/百分比的展示格式（`88.5%`、`+28.5%`、`68.4%`）没有统一格式化函数，是散落字面量。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让驾驶舱数字全部接真实数据 | `:31-35` + 各处字面量 | 需新增 `workOrders` prop；热力图需聚合 `tier1Scores` |
| 跳转带上下文（如只看 A 级） | `:20`（prop 类型） | `onNavigateTab` 需扩为带载荷；接收页（screening 等）需消费 |
| 增加「导出复盘汇报」的真实内容 | `:60` | 弹层 `modal-report-export`（见 `page-milestones` 同入口） |
| 驾驶舱按角色/学校过滤 | `:31-35` | 现为全校数据；多校场景需加过滤（与 `session.university` 联动） |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-cockpit-banner` | AI 决策指令横幅 | bar | 39-76 | → `modal-report-export`、→ `modal-batch-import` |
| `nd-cockpit-kpi` | 金奖池 KPI 卡矩阵 | panel | 77-156 | → `page-screening`（×1 合并边）、→ `page-supervision` |
| `nd-cockpit-heatmap` | 指标得分率热力洞察 | panel | 161-303 | → `page-screening` |
| `nd-cockpit-mini` | 赛道分布与辅导转化小盘 | panel | 305-382 | 无（纯展示） |
| `nd-cockpit-pool` | A 级金奖潜力项目池 | list | 385-440 | → `shell-project-drawer`、→ `page-screening`、→ `page-mentorship` |
| `nd-cockpit-warning` | 异常停滞与合规预警 | list | 441-465 | → `shell-project-drawer` |

> 未下钻为节点的页面级结构：三栏主网格容器（157-159）、KPI 栅格容器（78）、派生计算（31-36）。
>
> **拆分依据**：六块各有独立数据域与出口——横幅管「本周动作」（两个弹层出口）、KPI 管「分池导航」、热力图管「短板定位」、小盘是纯展示、两个列表虽然都开同一个抽屉但业务归宿不同（找种子 / 找问题），故拆为六个。

## 与 related_pages 的联动提示

- **→ `page-screening`（智能初筛中心）**：本页 4 处「查看更多/全部排名/初筛全览」都跳到那里；但**不带筛选条件**，到那边要重新找。
- **→ `page-mentorship`（导师智能调度）**：金奖池底部「为 A 级项目批量调度国家级导师」的落点；同样无载荷。
- **→ `page-supervision`（督导闭环中心）**：KPI 的「工单督导闭环率」卡跳这里；闭环率的**数值来自写死文案**，而督导页有真实工单数据——两者口径不一致。
- **→ `shell-project-drawer`（项目详情抽屉）**：金奖池与预警列表的项目卡都打开同一个全局抽屉（`handleSelectProject`），见 `page-workbench` / `page-screening` 的同类用法。
- **→ 与 `page-milestones`（里程碑看板）**：同属 `sec-cockpit`；本页**没有指向里程碑看板的入口**（`onNavigateTab` 类型里有 `'milestones'` 但无人调用），里程碑只能从侧栏进。
