---
id: page-sidebar-widgets
title: 备赛捷径与当前参赛项目（全局部件）
section: sec-student
importance: medium
sources:
  - src/components/Sidebar.tsx
  - src/components/TopHeader.tsx
  - src/components/RulesConfigModal.tsx
  - src/data/rules2026.ts
  - src/App.tsx
related_pages: [page-roles-navigation, page-cross-link, page-coach]
---

# 备赛捷径与当前参赛项目（全局部件）

## 一句话定位

侧栏底部有两个**真·全局件**：**备赛捷径区**（2026 官方评审细则的全局入口，学生端与学校管理端共用，管理端另有两个额外入口）与**当前参赛项目切换器**（学生专属，切项目后全端联动）。两者物理上都在 `Sidebar.tsx` 里，但业务归属是"全局能力"，不是导航项。

> **归属声明**：会话历史区（`Sidebar.tsx:529-611`）**不属于本页** —— 按 0910 归属原则，会话历史是金牌 AI 教练（新建对话）的子功能，见 page-coach。

## 事实（每条强制可回溯）

### 一、备赛捷径区

1. 区块标题为「备赛捷径与工具」，整体可见性条件是 **`role !== 'mentor' && role !== 'system_admin'`**（即学生端 + 学校管理端可见，导师端与 Admin 端完全不渲染）。`Sources: [src/components/Sidebar.tsx:613-618]()`
2. 第一个入口「2026官方评审细则」是**唯一对所有该区块可见角色都开放**的项，点击回调 `onOpenRulesConfig`。`Sources: [src/components/Sidebar.tsx:620-630]()`
3. 第二个入口「海量项目智能导入」（`sidebar-btn-import`）仅 `school_admin` 可见，回调 `onOpenBatchImport`。`Sources: [src/components/Sidebar.tsx:632-644]()`
4. 第三个入口「阶段复盘汇报生成」（`sidebar-btn-report`）仅 `school_admin` 可见，回调 `onOpenReportExport`。`Sources: [src/components/Sidebar.tsx:646-656]()`
5. 三个回调均由 `App` 注入并统一置位弹层开关：`onOpenRulesConfig` → `isRulesModalOpen`、`onOpenBatchImport` → `isImportModalOpen`、`onOpenReportExport` → `isReportModalOpen`。`Sources: [src/App.tsx:493-496]()`
6. 评审细则弹层共有**两个可达入口**：① 侧栏备赛捷径区（`sidebar-btn-rules`）；② 项目工作台顶部横幅（`onClick={onOpenRulesConfig}` 直接绑定）。`Sources: [src/components/ProjectMemberWorkbench.tsx:50-50]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:200-200]()`
7. **死 prop 记录（如实登记）**：`TopHeader` 声明并解构了 `onOpenRulesConfig`，但组件体内**无任何使用点**；`App` 仍向它传值，因此"顶栏打开细则"这条路径实际不通。`Sources: [src/components/TopHeader.tsx:16-16]()` `Sources: [src/components/TopHeader.tsx:31-31]()` `Sources: [src/App.tsx:531-531]()`

### 二、2026 评审细则弹层（捷径的目标）

7. `RulesConfigModal` 是无状态弹层，唯一状态是 `selectedTrackId`，当前规则取 `COMPETITION_RULES_2026.find(...) || [0]`。`Sources: [src/components/RulesConfigModal.tsx:11-16]()`
8. 内含四区：头部（24）、赛道选择 tabs（50）、汇总框（71）、一级/二级指标明细（104-150）。`Sources: [src/components/RulesConfigModal.tsx:24-24]()` `Sources: [src/components/RulesConfigModal.tsx:50-68]()` `Sources: [src/components/RulesConfigModal.tsx:71-103]()` `Sources: [src/components/RulesConfigModal.tsx:104-150]()`
9. 规则数据源 `COMPETITION_RULES_2026` 共 **5 个赛道配置**，每个赛道含 `tier1Rules`（一级指标）与 `mandatoryConditions`（一票否决条件）。`Sources: [src/data/rules2026.ts:3-3]()` `Sources: [src/data/rules2026.ts:5-61]()`
10. 5 个赛道分别为：`higher_education_creative`（高教主赛道·创意组）、`higher_education_startup`（高教主赛道·创业组）、`red_youth_creative`（青年红色筑梦之旅·创意组）、`vocational_creative`（职教赛道·创意组）、`industry_enterprise`（产业命题赛道·企业命题组）。`Sources: [src/data/rules2026.ts:5-7]()` `Sources: [src/data/rules2026.ts:63-65]()` `Sources: [src/data/rules2026.ts:124-126]()` `Sources: [src/data/rules2026.ts:182-184]()` `Sources: [src/data/rules2026.ts:240-242]()`
11. 默认赛道（第一个）为高教主赛道·创意组，其指标树是 **4 一级 × 17 二级**：个人成长 30 分（5 项）/ 项目创新 30 分（3 项）/ 产业价值 25 分（4 项）/ 团队协作 15 分（5 项），合计 100 分。`Sources: [src/data/rules2026.ts:9-55]()`
12. 一级指标**不是固定四项**：产业命题赛道有 **5 项**（个人成长 / 项目创新 / 实现成效 / 项目分析 / 团队协作），名称也与其他赛道不同。`Sources: [src/data/rules2026.ts:244-297]()`
13. 每个赛道都带 `mandatoryConditions`（3 条），其中第三条为「存在弄虚作假、抄袭剽窃等违规情况一票否决」。`Sources: [src/data/rules2026.ts:56-60]()`

### 三、当前参赛项目切换器

14. 切换器只在 `role === 'team_member'` 下渲染，位于侧栏导航上方、头部 Logo 之下。`Sources: [src/components/Sidebar.tsx:300-304]()`
15. 区块标题为「当前参赛项目 (全局联动)」，右上角显示「共 {projects.length} 项」。`Sources: [src/components/Sidebar.tsx:306-314]()`
16. 触发按钮展示当前项目的四项信息：`trackLabel`（赛道徽章）、`stageName`（阶段徽章，可选）、`grade` + `totalScore`（等级分徽章，可选）、`name`（项目名）、负责人与编号。`Sources: [src/components/Sidebar.tsx:316-351]()`
17. 当前项目取数：`projects.find(p => p.id === selectedProjectId) || projects[0]`。`Sources: [src/components/Sidebar.tsx:172-172]()`
18. 下拉含搜索框（placeholder「搜索项目名称、编号或负责人…」）与滚动列表；搜索匹配 4 个字段：`name` / `code` / `leader` / `trackLabel`。`Sources: [src/components/Sidebar.tsx:174-181]()` `Sources: [src/components/Sidebar.tsx:372-391]()`
19. 下拉通过 document 级 `mousedown` 监听实现"点击外部关闭"，仅在展开时注册。`Sources: [src/components/Sidebar.tsx:157-170]()`
20. 选择项目走 `handleChooseProject` → `onSelectProjectItem(projectId)` → 关闭下拉并清空搜索词。`Sources: [src/components/Sidebar.tsx:183-187]()`
21. **联动落地在 App**：`onSelectProjectItem` 同时设置 `activeTeamProjectId`（全局学生端项目）与 `selectedProject`（项目详情抽屉的数据源）。`Sources: [src/App.tsx:510-516]()`
22. 全局项目对象 `currentMemberProject` 的取数有三级兜底：`projects.find(activeTeamProjectId)` → `projects.find(session.projectId)` → `projects[0]`。`Sources: [src/App.tsx:480-483]()`
23. `currentMemberProject` 被分发给**四个学生端视图**：`SceneAICoach`（556 行附近，经 `activeSpace` 间接使用）、`SceneGuidanceWorkbench`（577）、`SceneDefenseTraining`（588）、`ProjectMemberWorkbench`（597）。`Sources: [src/App.tsx:553-603]()`
24. 顶栏也接收同一对象作为 `currentProject`（用于预警跳转等）。`Sources: [src/App.tsx:527-534]()`
25. 切换项目只更新 `selectedProject`（抽屉的**数据源**），**不会打开抽屉**：`isDrawerOpen` 的置位只发生在 `handleSelectProject`（点击项目触发），切换器路径没有调用它。`Sources: [src/App.tsx:511-516]()` `Sources: [src/App.tsx:430-433]()` `Sources: [src/App.tsx:77-78]()`

## 规则与边界（AI 开发硬约束）

- **这两个件虽然住在 `Sidebar.tsx` 里，但它们不是导航项**。改导航（page-roles-navigation）时不要把这两个区块当成"菜单"一起重构；反之改全局件时也不要动 `getNavGroups`。
- **备赛捷径区的可见性与导航可见性是两套独立条件**：
  - 导航：`getNavGroups` 按角色分支
  - 备赛捷径区：`!== mentor && !== system_admin`
  两者没有共享常量。改可见性必须分别处理。
- **`RulesConfigModal` 是全局单例弹层**，由 `App` 持有开关状态（`isRulesModalOpen`），入口有两处（侧栏 + 顶栏）。不要在教学页面内部再挂一个实例，否则会出现双弹层。
- **规则数据只有 5 个赛道配置，而 `TrackType` 枚举有 16 个值**。`RulesConfigModal` 用 `find(...) || [0]` 兜底，因此**任意未配置的赛道都会静默显示"高教主赛道·创意组"的规则** —— 这是最容易被误判为"数据正确"的假象。`Sources: [src/types.ts:1-17]()` `Sources: [src/components/RulesConfigModal.tsx:16-16]()`
- **一级指标不是固定 4 项**：任何"循环 4 次"的渲染或统计假设都会在产业命题赛道上出错。必须按 `tier1Rules.length` 迭代。
- **项目切换器只对 `team_member` 生效**。管理端切换项目走的是各页面内部的筛选/下拉（如 `ScreeningHub` 的赛道筛选），不要复用这个组件。
- **切项目的副作用面很大**：会同时改 `activeTeamProjectId`（影响 4 个视图）与 `selectedProject`（影响抽屉）。新增依赖"当前项目"的视图时，必须从 `App` 的 `currentMemberProject` 取值，而不是各自维护一份。
- `selectedProjectId` 只影响切换器的"选中态显示"，**不是**全局当前项目的真相源（真相源是 `App.activeTeamProjectId`）。不要把它当全局状态读写。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一个备赛捷径入口 | `Sidebar.tsx:619-659`（加按钮 + `id`）；回调在 `App.tsx:493-496` 统一注入 |
| 改捷径区可见角色 | `Sidebar.tsx:614` |
| 改评审细则弹层 | `RulesConfigModal.tsx:24-150`；数据改 `rules2026.ts` |
| 新增赛道规则 | `rules2026.ts:3-302` 追加一条 `TrackEvaluationRule`（注意 `trackId` 要落在 `TrackType` 内） |
| 改项目切换器展示字段 | `Sidebar.tsx:316-351`（触发按钮）与 `393-453`（列表项） |
| 改项目搜索维度 | `Sidebar.tsx:174-181` |
| 改切项目后的联动面 | `App.tsx:510-516`（分发点）+ 各消费视图的 props |
| 加"当前项目"的新消费方 | 从 `App.tsx:480-483` 的 `currentMemberProject` 取值并加进 props 链 |

## 与 related_pages 的联动提示

- → **page-roles-navigation**：本页两个件与导航共处一文件但归属不同；改 `Sidebar.tsx` 时请先确认改的是哪个域。
- → **page-cross-link**：切项目联动是四大联动中的第二条（"切项目全端联动"共三处落点），改切换器必须回到该页核对全链路。
- → **page-coach**：教练空间物料（`activeSpace` 的 name / trackTag / workspace）与当前项目**不是同一个数据**：`activeSpace` 来自 `spaces`（`mockSpaceData`），`currentMemberProject` 来自 `projects`（`mockProjects`）。两者都表现为"当前项目"，但真相源不同 —— 改任一方时注意不要假设它们同步。`Sources: [src/App.tsx:71-74]()` `Sources: [src/App.tsx:484-484]()`
