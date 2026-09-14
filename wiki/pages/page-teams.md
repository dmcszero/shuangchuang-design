---
id: page-teams
title: 团队管理
section: sec-governance
importance: medium
view: teams_management
component: src/components/TeamManagement.tsx
sources:
  - src/components/TeamManagement.tsx:1-430
related_pages: ["page-users", "page-workbench", "page-screening"]
nodes:
  - nd-teams-banner
  - nd-teams-metrics
  - nd-teams-filters
  - nd-teams-card
---

## 一句话定位

学校管理端的团队资质核查页：四张资质指标卡 + 三条件筛选 + 可展开的团队卡（内含 AI 诊断意见、三项结构合规检查与逐人明细名册），对标 2026 评审的「个人成长 / 团队架构」要素。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'teams_management'` 时挂载，只接收一个可选 prop `onSelectProject?`（App 传 `handleSelectProjectById`：按 id 找项目并开抽屉）。 Sources: [src/App.tsx:775-779]() [src/components/TeamManagement.tsx:21-26]() [src/App.tsx:501-506]()
2. 本页**不在沉浸式白名单**内：外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `team-management-module`；团队卡带稳定 id `team-card-{team.id}`。 Sources: [src/components/TeamManagement.tsx:47]() [src/components/TeamManagement.tsx:203]()

**二、页面级 state 与数据流**

4. 页面 state 共 7 个：`teams`（初值 `MOCK_PROJECT_TEAMS`，本地持有）/ `searchQuery` / `statusFilter` / **`trackFilter`（声明后从未被读取——死状态）** / `crossCollegeFilter` / `expandedTeamId`（初值第一支团队）/ `toastMessage`。 Sources: [src/components/TeamManagement.tsx:27-33]()
5. **本页数据是「只读孤岛」**：不接受任何写回 prop，`teams` 只用于渲染；「下发催办」「合规全检」都只弹 Toast。 Sources: [src/components/TeamManagement.tsx:21-23]() [src/components/TeamManagement.tsx:40-42]() [src/components/TeamManagement.tsx:84-92]()
6. 实测 mock 团队 **5 支**：`auditStatus` verified×3 / need_supplement×1 / warning×1；`crossCollege` 4真1假、`hasFinanceSpecialist` 3真2假、`ipOwnerEnrolled` 4真1假。 Sources: [src/data/mockUsersAndTeams.ts:202-553]()

**三、真实 vs 演示**

7. **真实派生的只有筛选结果**（`filteredTeams`）；指标卡全部由 `totalTeams = teams.length + 77` 推出（显示 82 支），另有三处写死文案（平均 5.2 人 / 剩余 18 队 / 1 项权属拦截）。 Sources: [src/components/TeamManagement.tsx:58-62]() [src/components/TeamManagement.tsx:100-159]()
8. `ipReady` 派生后**从未使用**（第二处死计算）。 Sources: [src/components/TeamManagement.tsx:62]()
9. 三项结构合规检查（`crossCollege` / `hasFinanceSpecialist` / `ipOwnerEnrolled`）与 `auditStatus` 判据**互相独立**，无约束关系。 Sources: [src/components/TeamManagement.tsx:302-360]()

## 规则与边界（AI 开发硬约束）

- **本页是「核查展示面」而非「管理面」**：不能增删团队成员、不能改团队状态、不能改 `auditStatus`；催办与全检都是 Toast。
- 指标卡的「82 支 / 68.3% / 78.0% / 94.2%」与 `page-cockpit`（82 项）、`page-users`（82 项目）是**同一族演示数字**，互相之间也不一致（本页是「团队」口径，驾驶舱是「项目」口径）——见 issue `issue-teams-fake-metrics`。
- 成员名册是**只读文本**（学段徽标 + 分工 + 发明人），没有成员详情、没有联系方式点击；联系信息在表格里是裸文本。
- 团队卡展开为**单选**（`expandedTeamId` 单值），不支持同时展开对比。
- 「查看项目全景档案」依赖 `onSelectProject`，项目 id 不存在时静默无反应。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 指标卡接真实聚合 | `:58-62` + `:100-159` | 四处字面量（含 5.2 人 / 18 队 / 1 项） |
| 启用赛道筛选 | `:30` | 补控件 + `filteredTeams` 加条件 |
| 催办接真实工单 | `:40-42` `:407-415` | 需接 `page-supervision` 的工单模型 + App 回调 |
| 成员名册支持编辑/增补 | `:362-405` | 需写接口（当前无上行 prop） |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-teams-banner` | 页头与合规全检入口 | bar | 68-96 | 无（Toast 占位） |
| `nd-teams-metrics` | 团队资质指标卡 | panel | 98-161 | 无（写死/假派生） |
| `nd-teams-filters` | 搜索与团队筛选 | form | 163-195 | 无（驱动列表） |
| `nd-teams-card` | 团队卡与成员名册 | list | 197-430 | → `shell-project-drawer`（查看项目全景档案） |

> 未下钻为节点的页面级结构：Toast 区（50-57）、`filteredTeams` 派生（43-56）。
>
> **拆分依据**：四块各有独立数据域与出口——页头管动作（占位）、指标卡是假派生展示、筛选自有四态（含一个死状态）、团队卡承载唯一真实出口（项目抽屉）。

## 与 related_pages 的联动提示

- **↔ `page-users`（用户管理）**：同属 `sec-governance`，各管一半——本页管「参赛团队与成员资质」，那边管「系统账号与权限」；**数据零共享**，且两者都有「学院」维度但取值口径不同（本页 `team.college`、那边 `user.college`，mock 中还有两个相近学院名）。
- **→ `shell-project-drawer`（项目详情抽屉）**：团队卡底部「查看项目全景档案」经 `onSelectProject(team.projectId)` 打开全局抽屉——本页唯一真正的跨页出口。
- **→ `page-workbench`（项目工作台）**：本页与工作台「团队架构与合规审查」区块**读的是同一份数据**——`ProjectMemberWorkbench.tsx:65` 用 `MOCK_PROJECT_TEAMS.find(t => t.projectId === project.id)` 取团队，与本页 `teams` 初值同源（`:24` 同一 import），且共用 `auditStatus` / `auditRemark` / `members` 三个字段。区别只在呈现视角：本页是全校罗列（可筛选），工作台是**按当前项目过滤后的单队视图**。**因此本页是「同一份团队数据」的校管端入口**，改字段要两侧同时核对。
- **→ `page-screening`（智能初筛中心）**：初筛的「合规与一票否决拦截」看板判据是 `ProjectItem.compliance`（查重率 / AI 代写 / 权属说明），与本页的团队三项结构检查（跨学科 / 财务专人 / 发明人入队）**是两套合规口径**，两者互不引用。
