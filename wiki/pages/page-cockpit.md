---
id: page-cockpit
title: 备赛数据驾驶舱（cockpit）
section: sec-admin
importance: high
sources:
  - src/components/CockpitDashboard.tsx
  - src/data/mockProjects.ts
  - src/App.tsx
related_pages: [page-screening, page-milestones, page-supervision]
---

# 备赛数据驾驶舱（cockpit）

## 一句话定位

学校管理端的默认落地页（`school_admin` 登录后进这里）与决策枢纽：一个 AI 决策横幅 + 五张 KPI 池卡 + 一级指标二级得分率热力 + 5 个迷你看板（赛道分布 / 辅导转化）+ A 级潜力池列表 + 异常停滞与合规预警。**全页数据只读、无写操作，所有下钻都是跳转到别的 tab 或打开项目抽屉。**

## 事实（每条强制可回溯）

### 一、入口与数据

1. Props 共 6 项：`projects` / `onSelectProject` / `onOpenReportExport` / `onOpenBatchImport` / `onNavigateTab`，其中 `onNavigateTab` 的类型被收窄为 `'screening' | 'mentorship' | 'supervision' | 'milestones'` 四选一。`Sources: [src/components/CockpitDashboard.tsx:16-29]()`
2. 组件用显式参数注解声明 props（`{...}: CockpitDashboardProps`），props 契约真实受检。`Sources: [src/components/CockpitDashboard.tsx:24-29]()`
3. 数据全部来自传入的 `projects`（`App` 传入 `mockProjects`），组件内**不持有任何业务状态**，只有从 `projects` 派生的 5 个分组计数。`Sources: [src/components/CockpitDashboard.tsx:31-35]()` `Sources: [src/App.tsx:605-613]()`
4. 5 个派生分组：A 级、B 级、C 级、D 级、以及"异常"（`healthStatus` 为 `warning` 或 `critical`）。`Sources: [src/components/CockpitDashboard.tsx:31-35]()`

### 二、页面结构（自上而下）

5. **AI 决策横幅**（39-76）：带两个操作按钮，分别触发 `onOpenReportExport` 与 `onOpenBatchImport`。`Sources: [src/components/CockpitDashboard.tsx:39-76]()`
6. **五张 KPI 池卡**（77-156）：总注册数（79）、A 级金池（94）、B 级银/省金池（111）、C·D 级（126）、督导闭环率（141）。`Sources: [src/components/CockpitDashboard.tsx:77-156]()`
7. 五张卡中**有四张的点击目标是 `onNavigateTab('screening')`**（81/96/113/128），第五张（闭环率）跳 `'supervision'`（143）；热力卡也跳 screening（174）。`Sources: [src/components/CockpitDashboard.tsx:77-156]()`
8. **主栅格**（157-158）：左 2 列放 2026 评审维度热力 + 弱项雷达，右 1 列放 A 级潜力池与预警。`Sources: [src/components/CockpitDashboard.tsx:157-160]()` `Sources: [src/components/CockpitDashboard.tsx:383-384]()`
9. **四一级指标得分率热力/分解条**（159-304），四段的语义与满分区间为：个人成长（30 分，183）、项目创新（30 分，216）、产业价值（25-30 分，241）、团队协作（15-20 分，270）。`Sources: [src/components/CockpitDashboard.tsx:159-304]()`
10. **5 个迷你看板**（305-382）：① 报名赛道分布（307）；② 辅导督导与提分转化（356）。`Sources: [src/components/CockpitDashboard.tsx:305-382]()`
11. **A 级潜力池列表**（385-440）：点击项 → `onNavigateTab('screening')`（393）。`Sources: [src/components/CockpitDashboard.tsx:385-440]()`
12. **实时预警与停滞监控**（441-478）：其中一处跳 `onNavigateTab('mentorship')`（433）。`Sources: [src/components/CockpitDashboard.tsx:441-478]()`

### 三、跳转口径（重要）

13. `onNavigateTab` 实测调用共 8 次，分布为：`'screening'` × 6（81/96/113/128/174/393）、`'supervision'` × 1（143）、`'mentorship'` × 1（433）。`Sources: [src/components/CockpitDashboard.tsx:81-81]()` `Sources: [src/components/CockpitDashboard.tsx:143-143]()` `Sources: [src/components/CockpitDashboard.tsx:393-393]()` `Sources: [src/components/CockpitDashboard.tsx:433-433]()`
14. **`'milestones'` 虽在类型里被允许，但全页无任何调用点** —— 是一个未使用的类型分支（里程碑看板只能从侧栏进）。`Sources: [src/components/CockpitDashboard.tsx:21-21]()`
15. 跳转的实际实现是 `App` 里的 `onNavigateTab={(tab) => setActiveTab(tab)}` —— 即驾驶舱不控制跳转，只上报目标 tab。`Sources: [src/App.tsx:611-611]()`

### 四、数据侧

16. 项目数据源 `MOCK_PROJECTS` 共 906 行，落在 `mockProjects.ts`，导出名 `mockProjects`。`Sources: [src/data/mockProjects.ts:3-3]()` `Sources: [src/data/mockProjects.ts:906-906]()`
17. 驾驶舱消费的 `ProjectItem` 字段：`grade`（A/B/C/D）、`healthStatus`、`totalScore`、`name`、`trackLabel`、`college`。`Sources: [src/types.ts:113-128]()`
18. 等级枚举 `TierGrade = 'A' | 'B' | 'C' | 'D'`；健康度枚举 `HealthStatus = 'normal' | 'warning' | 'critical'`。`Sources: [src/types.ts:36-38]()`

## 规则与边界（AI 开发硬约束）

- **驾驶舱是只读页**：不要在此页加任何写操作（编辑项目、下发工单、改分数）。所有动作都应"跳转到对应 tab"或"打开抽屉"。这是它和其它管理页最大的区别。
- **跳转必须走 `onNavigateTab`，不要自己 import 别的组件**。`App` 用 `activeTab` 做单页切换，直挂组件会出现两套布局同时渲染。
- **`onNavigateTab` 的类型收窄要保留**：它把可跳转目标限制在 4 个管理页。若要新增跳转目标，需同时改 `CockpitDashboard.tsx:21` 与 `App.tsx:611` 的 `TabType` 兼容性。
- **KPI 卡的数字全部由 `projects` 派生，不要引入独立的统计常量**：一旦写死，会与筛选/导入（`handleBatchImportComplete` 会整体替换 `projects`）后的数据脱节。`Sources: [src/App.tsx:442-445]()`
- **"督导闭环率"是唯一跳 `supervision` 的卡**，其余池卡都跳 `screening`。改跳转目标时注意别把闭环率也一起改成 screening（语义会错）。
- **`'milestones'` 分支当前是死值**：要么给它加调用点，要么在重构时删掉。不要因为"类型里允许"就以为已有入口。
- 热力区的四段满分（30/30/25-30/15-20）是**跨赛道区间的近似展示**，与 `rules2026.ts` 中每个赛道的精确满分不完全一致（例如高教主赛道·创意组是 30/30/25/15）—— 展示口径与规则口径存在偏差，改数值前先确认以哪个为准。`Sources: [src/data/rules2026.ts:9-55]()`

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一张 KPI 卡 | `CockpitDashboard.tsx:77-156` 区块内追加（参考 94 行 A 级卡写法），派生计数加在 31-35 |
| 改 KPI 卡跳转 | 各卡 `onClick={() => onNavigateTab('...')}`（81/96/113/128/143） |
| 改 AI 决策横幅 | `CockpitDashboard.tsx:39-76` |
| 改一级指标热力 | `CockpitDashboard.tsx:159-304`（四段分别在 183/216/241/270） |
| 加迷你看板 | `CockpitDashboard.tsx:305-382`（现有两个：307 赛道分布、356 招生转化） |
| 改 A 级池 / 预警区 | `CockpitDashboard.tsx:385-440` / `441-478` |
| 改页面数据源 | `mockProjects.ts`（注意：改结构会同时影响初筛、里程碑、督导） |

## 与 related_pages 的联动提示

- → **page-screening**：驾驶舱的 6 个跳转目标里 6 次指向初筛，两者是"概览 → 明细"的关系；初筛的筛选状态是独立 state，驾驶舱传入不了筛选条件（只传 tab）。
- → **page-milestones**：`'milestones'` 是有类型无调用的分支，如果要打通"驾驶舱 → 里程碑看板"，落点就在这里。
- → **page-supervision**：闭环率卡与工单状态强相关，改 `SupervisionWorkOrder.status` 的枚举会直接影响该卡的含义。
- 共用数据提醒：本页与初筛、里程碑、督导、辅导**共用同一份 `mockProjects` / `workOrders`**（由 `App` 持有），任一页写入都会全局生效。
