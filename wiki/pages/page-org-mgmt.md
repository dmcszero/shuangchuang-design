---
id: page-org-mgmt
title: 用户与团队架构管理
section: sec-admin
importance: medium
sources:
  - src/components/UserManagement.tsx
  - src/components/TeamManagement.tsx
  - src/data/mockUsersAndTeams.ts
  - src/App.tsx
related_pages: [page-screening, page-roles-navigation]
---

# 用户与团队架构管理

## 一句话定位

管理端的组织治理双页：`users_management` 是**五角色用户表**（启停 / 重置密码 / 新增用户），`teams_management` 是**团队架构与合规审查**（三合规体检 + 成员明细 + 催办）。

> **口径提醒**：本页有三套"角色"概念且互不相同 —— ① 登录门户角色 `PortalRole`（4 值）② 系统用户角色 `SystemUser.role`（5 值）③ 团队成员的分工 `TeamMemberItem.division`（5 值）。改任一套前先确认是哪一套。

## 事实（每条强制可回溯）

### 一、用户与权限管理（users_management）

1. Props 只有 1 项：`onOpenProject: (projectId: string) => void`。`Sources: [src/components/UserManagement.tsx:24-28]()`
2. **系统用户角色是 5 值**：`super_admin | college_coordinator | mentor | student_leader | advisor`，与登录门户的 4 个 `PortalRole` 不是一个枚举。`Sources: [src/data/mockUsersAndTeams.ts:10-10]()` `Sources: [src/types.ts:19-19]()`
3. 五角色的中文映射（新增用户时用于构造 `roleLabel`）：校级超级管理员 / 学院联络秘书 / 评审专家 / 导师 / 学生项目负责人 / 指导教师。`Sources: [src/components/UserManagement.tsx:71-77]()`
4. `SystemUser` 字段：id / name / avatar / staffOrStudentId / email / phone / role / roleLabel / college / associatedProjectsCount / status（active \| inactive）/ lastLogin / createdAt。`Sources: [src/data/mockUsersAndTeams.ts:3-17]()`
5. 四个筛选维度：关键词（搜索）、角色（`roleFilter`）、学院（`collegeFilter`）、状态（`statusFilter`），全部默认 `'all'`。`Sources: [src/components/UserManagement.tsx:105-118]()`
6. 学院下拉的选项是**从数据动态去重生成**的（`Array.from(new Set(users.map(u => u.college)))`），不是固定常量。`Sources: [src/components/UserManagement.tsx:119-119]()`
7. 三个操作：启停（`handleToggleStatus`，active ↔ inactive）、重置密码（`handleResetPassword`，仅 toast）、新增用户（`handleCreateUser`，前插到本地 `users` 状态）。`Sources: [src/components/UserManagement.tsx:52-66]()`
8. 新增用户的 `id` 用 `user-${Date.now().toString().slice(-4)}` 生成 —— **只取时间戳后 4 位**，快速连续创建有碰撞风险。`Sources: [src/components/UserManagement.tsx:79-80]()`
9. 页面结构：页头与指标汇总（131-154）→ 统计卡（155-210）→ 筛选与搜索栏（211-270）→ 用户表（271-410）→ 新增用户弹窗（411-546）。`Sources: [src/components/UserManagement.tsx:131-154]()` `Sources: [src/components/UserManagement.tsx:155-210]()` `Sources: [src/components/UserManagement.tsx:211-270]()` `Sources: [src/components/UserManagement.tsx:271-410]()` `Sources: [src/components/UserManagement.tsx:411-546]()`
10. 表格里的「最近登录」用一个启发式判断在线：`lastLogin === '刚刚'` 或含"分钟"即视为在线。`Sources: [src/components/UserManagement.tsx:295-295]()`
11. 用户数据源 `MOCK_USERS` 共 553 行文件中的 64-201 段。`Sources: [src/data/mockUsersAndTeams.ts:64-64]()`
12. `onOpenProject` 在 `App` 里接的是 `handleSelectProjectById`（按 id 找项目并打开详情抽屉）。`Sources: [src/App.tsx:672-676]()` `Sources: [src/App.tsx:435-440]()`

### 二、项目团队架构管理（teams_management）

13. Props 只有 1 项：`onSelectProject: (projectId: string) => void`。`Sources: [src/components/TeamManagement.tsx:22-26]()`
14. `ProjectTeam` 的三项结构合规布尔 + 审核态：`crossCollege`（跨学院）/ `hasFinanceSpecialist`（商业专人）/ `ipOwnerEnrolled`（发明人入队），`auditStatus: 'verified' | 'need_supplement' | 'warning'`。`Sources: [src/data/mockUsersAndTeams.ts:57-61]()`
15. 三项合规在 UI 上以三宫格呈现（2026 Structural Compliance Checks）。`Sources: [src/components/TeamManagement.tsx:286-339]()`
16. **统计数字是硬编码放大的**：`totalTeams = teams.length + 77`，再按固定比例推算 `crossTeams = round(totalTeams * 0.683)`、`financeReady = round(totalTeams * 0.78)`、`ipReady = round(totalTeams * 0.942)`。即"全局口径"用固定系数伪造，不是真实统计。`Sources: [src/components/TeamManagement.tsx:59-65]()`
17. 实际生效的筛选是**三个**：关键词、审核状态（`statusFilter`）、跨学院（`crossCollegeFilter`，`yes`/`no`）。`Sources: [src/components/TeamManagement.tsx:44-57]()`
17.1 **死状态记录**：`trackFilter` 在 30 行声明且初始化为 `'all'`，但**全组件无第二处引用**（既无 UI 也无过滤条件）；`setTeams` 同样声明后从未被调用（`teams` 是只读的）。`Sources: [src/components/TeamManagement.tsx:30-30]()` `Sources: [src/components/TeamManagement.tsx:27-27]()`
18. 团队卡是**可展开**的（`expandedTeamId`），展开后显示审核评语、三合规体检、成员明细表与操作栏。`Sources: [src/components/TeamManagement.tsx:196-205]()` `Sources: [src/components/TeamManagement.tsx:268-270]()` `Sources: [src/components/TeamManagement.tsx:340-400]()` `Sources: [src/components/TeamManagement.tsx:401-436]()`
19. 催办 `handleSendReminder(teamName, issue)` 只出 toast，**不改任何状态、不产生通知记录**。`Sources: [src/components/TeamManagement.tsx:40-43]()`
20. 团队成员的分工是五枚举：技术研发/核心算法、市场拓展/商业模式、财务测算/融资对接、知识产权/法律合规、路演答辩/视觉呈现。`Sources: [src/data/mockUsersAndTeams.ts:19-31]()`
21. 成员条目带 `isIpOwner`（是否知识产权所有人）—— 这是 `ipOwnerEnrolled` 合规项的判定依据。`Sources: [src/data/mockUsersAndTeams.ts:28-28]()`
22. 团队数据源 `MOCK_PROJECT_TEAMS` 在 `mockUsersAndTeams.ts:202` 起；**同一份数据也被学生端项目工作台的「团队架构与合规审查」tab 消费**（见 page-workbench）。`Sources: [src/data/mockUsersAndTeams.ts:202-202]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:65-65]()`

### 三、接线

23. 两个页面都挂在 `App` 的 `users_management` / `teams_management` 分支下，分别接收 `onOpenProject` / `onSelectProject`。`Sources: [src/App.tsx:672-682]()`
24. 两页的入口都在 `school_admin` 的「校本智库与组织管理」导航组内。`Sources: [src/components/Sidebar.tsx:252-259]()`
25. 另有一个间接入口：侧栏账号菜单里的「全员权限与角色分配」会对 `school_admin` / `system_admin` 显示，点击直接 `setActiveTab('users_management')`。`Sources: [src/components/Sidebar.tsx:740-751]()`

## 规则与边界（AI 开发硬约束）

- **三套角色枚举不要互相赋值**：`PortalRole`（登录门户，4 值）、`SystemUser.role`（系统用户，5 值）、`TeamMemberItem.division`（团队分工，5 值）取值完全不同。把 `UserManagement` 的 `roleMap` 当登录角色来源用会直接出错。`Sources: [src/types.ts:19-19]()` `Sources: [src/data/mockUsersAndTeams.ts:10-10]()` `Sources: [src/data/mockUsersAndTeams.ts:27-27]()`
- **`handleSendReminder` 与"催办"承诺不匹配**：只弹 toast。若要做真实催办，需要新增通知写入（参考 `NotificationAlert` 结构，`types.ts:229-237`），并在 `App` 的 `alerts` 状态上加写入口（当前 `alerts` 是**只读**的 `useState` 无 setter）。`Sources: [src/App.tsx:68-68]()`
- **团队统计的 `+77` 与三个系数是刻意伪造的"全校口径"**：不要把它当真实数据用于任何决策性展示；做真实统计时必须整体替换 59-65 行。
- **两端都存在"声明了但没接上"的状态**，改这两页前先确认不要基于死状态做假设：`TeamManagement` 的 `trackFilter`（声明+初始化，无 UI 无过滤）与 `setTeams`（从未调用）；`TopHeader` 的 `onOpenRulesConfig`（声明+解构，无使用点，见 page-sidebar-widgets）。`Sources: [src/components/TeamManagement.tsx:27-32]()`
- **用户列表是本地状态，没有回写到 `App`**：新增/启停只改本组件内的 `users`，切换 tab 后即丢失（`TeamManagement` 同理，且连 setter 都未使用）。这与 `mentors`、`workOrders` 等"提升到 App"的做法**不一致**，是当前实现的一致性缺口。
- **两页的数据源不同**：用户来自 `MOCK_USERS`，团队来自 `MOCK_PROJECT_TEAMS`，两者**没有做关联验证**（用户的 `associatedProjectsCount` 与团队表不是同一真相源）。
- **`handleCreateUser` 的 id 生成有碰撞风险**（时间戳后 4 位）。做真实持久化前必须换成稳定 id。
- **团队成员表与项目工作台的团队 tab 共用数据但渲染组件不同**：改 `ProjectTeam` 结构要同时核两处渲染。
- 本页是**组织治理视角**，不做项目内容编辑；所有项目相关动作都通过 `onOpenProject` / `onSelectProject` 打开全局抽屉。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一个用户角色 | `mockUsersAndTeams.ts:10` 加枚举 → `UserManagement.tsx:71-77` 加映射 → `226-241` 加筛选项 |
| 加用户表一列 | `UserManagement.tsx:271-410` 表格 |
| 改用户筛选维度 | `UserManagement.tsx:105-118` + `211-270` |
| 改新增用户表单 | `UserManagement.tsx:411-546` + `67-104` |
| 加团队合规体检项 | `mockUsersAndTeams.ts:57-61`（数据）+ `TeamManagement.tsx:286-339`（渲染）+ `ProjectMemberWorkbench.tsx:773-848`（学生端同套） |
| 改团队统计口径 | `TeamManagement.tsx:59-65` |
| 加团队筛选维度 | `TeamManagement.tsx:44-58` + `155-195` |
| 改团队成员分工枚举 | `mockUsersAndTeams.ts:27` |

## 与 related_pages 的联动提示

- → **page-screening**：两页都通过 `onOpenProject` / `onSelectProject` 打开同一个 `ProjectDetailDrawer`；用户表里的"关联项目"与团队卡的"项目"都指向 `ProjectItem`。
- → **page-roles-navigation**：本页操作的是**系统用户角色**，与登录门户的 4 端权限是两套体系；侧栏账号菜单提供了跳转入口（740-751），但两套角色并未做联动映射 —— 这是当前实现的语义缺口，改动前需先确认产品意图。
- 数据共线：团队成员数据同时被学生端项目工作台消费（page-workbench 第四节），改结构会影响两端。
