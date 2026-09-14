---
id: page-users
title: 用户管理
section: sec-governance
importance: medium
view: users_management
component: src/components/UserManagement.tsx
sources:
  - src/components/UserManagement.tsx:1-539
related_pages: ["page-teams", "page-mentors-pool", "page-login"]
nodes:
  - nd-users-banner
  - nd-users-metrics
  - nd-users-filters
  - nd-users-table
  - nd-users-adduser
---

## 一句话定位

学校管理端的账号台账页：四张规模卡 + 四维筛选 + 一张可即时启停的用户表 + 一个新增用户弹窗，管的是学校侧五类账号（超管 / 学院秘书 / 评审专家 / 指导教师 / 学生负责人）。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'users_management'` 时挂载，**只接收一个可选 prop** `onOpenProject?`（App 传的是 `handleSelectProjectById`）。 Sources: [src/App.tsx:769-773]() [src/components/UserManagement.tsx:20-26]()
2. 本页**不在沉浸式白名单**内：外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()
3. 根容器带稳定 id `user-management-module`。 Sources: [src/components/UserManagement.tsx:122]()

**二、页面级 state 与数据流**

4. 页面 state 共 13 个：`users`（初值 `MOCK_USERS`，本地持有）/ 四个筛选态 / 一个弹窗开关 / 一个 Toast / 六个表单态。 Sources: [src/components/UserManagement.tsx:27-40]()
5. **本页的数据是「孤岛」**：`users` 是本地 state，除 `onOpenProject` 外没有任何上行 prop；账号的新增与启停都不离开本页（对比 `page-mentors-pool` 校端有 `onUpdateMentors` 写回 App）。 Sources: [src/components/UserManagement.tsx:20-26]() [src/components/UserManagement.tsx:27]()
6. 实测 mock 用户 **9 位**：`super_admin`×1 / `college_coordinator`×2 / `mentor`×2 / `advisor`×1 / `student_leader`×3；状态 `active`×8 + `inactive`×1；学院去重 **6 个**（其中「生命科学学院」与「生物工程与生命科学学院」两个相近名并存）。 Sources: [src/data/mockUsersAndTeams.ts:64-201]()

**三、真实 vs 演示（本页最重要的边界）**

7. **真实派生只有两处**：表尾「共显示 N 位注册账号」与学院筛选下拉选项（`collegesList`）。 Sources: [src/components/UserManagement.tsx:119]() [src/components/UserManagement.tsx:406]()
8. **写死数字五处**：`users.length + 333`（显示 342）、「98.2% 活跃率」、「48 位专家」、「26 个学院」、「268 人 + 绑定 82 个项目」。 Sources: [src/components/UserManagement.tsx:164]() [src/components/UserManagement.tsx:170]() [src/components/UserManagement.tsx:184]() [src/components/UserManagement.tsx:198]() [src/components/UserManagement.tsx:208]()
9. **写死声明两处**：表尾「按校级统一身份认证系统 (CAS/OAuth2) 权限策略实时同步」、新增弹窗「初始安全策略提示（短信/激活邮件/两步验证/强制改密）」——均无实现。 Sources: [src/components/UserManagement.tsx:407]() [src/components/UserManagement.tsx:524-534]()

**四、真实可用的写操作**

10. 只有两个动作会真正改变本页数据：**新增用户**（`setUsers([newUser, ...users])`）与**切换账号状态**（`handleToggleStatus`）；「重置密码」只弹 Toast。 Sources: [src/components/UserManagement.tsx:44-56]() [src/components/UserManagement.tsx:98-102]()

## 规则与边界（AI 开发硬约束）

- **本页管的是「校内系统账号」，与登录体系完全隔离**：这里新增的账号无法登录（`page-login` 用的是 `DEMO_PRESET_ACCOUNTS` 预置账号 + 前端自选角色），账号状态翻转也不影响登录——做「真账号体系」要把两侧打通（见 issue `issue-users-accounts-isolated`）。
- 与 `page-mentors-pool` 的**导师账号**是两套东西：那边管导师档案（带赛绩/容量/标签），这边管登录账号（带角色/状态/关联项目数）；同一位专家可能两边各有一条记录，且无外键关联。
- 与 `page-teams` 的**团队成员**也是两套：那边是参赛学生名册（学段/分工/发明人），这边是账号（role=student_leader）。
- 指标卡与筛选、表格**互不联动**（指标写死），切筛选时指标不变。
- 「重置密码」和「CAS 同步」是文案承诺，任何对外说明都要先剔除。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 指标接真实聚合 | `:155-210` | 四个数值 + 三条副文案 |
| 账号体系与登录打通 | `:62-103` | `page-login` 的账号来源 + 会话结构 |
| 新增编辑/删除用户 | `:385-395` | 当前只有新增；可参考 `page-mentors-pool` 的增删改全套 |
| 权限矩阵落地（角色 → 可见菜单） | `:489-500` | 需与 `Sidebar` 的角色化导航对齐 |
| 修正表头「工工号」笔误 | `:277` | 纯文案 |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-users-banner` | 页头与新增用户入口 | bar | 131-153 | → `nd-users-adduser`（开弹窗） |
| `nd-users-metrics` | 账号规模指标卡 | panel | 155-198 | 无（纯展示，三写死一半真） |
| `nd-users-filters` | 四维筛选（搜索+角色+学院+状态） | form | 211-270 | 无（驱动表格） |
| `nd-users-table` | 用户台账表与账号操作 | table | 271-409 | 无上行（状态翻转仅本地） |
| `nd-users-adduser` | 新增用户弹窗 | modal | 411-539 | 无上行（新用户仅进本地 state） |

> 未下钻为节点的页面级结构：Toast 区（123-130）、`filteredUsers` 与 `collegesList` 派生（105-119）。
>
> **拆分依据**：五块各有独立状态域与出口——页头管弹窗开关、指标卡纯展示、筛选自有四态、表格承载两个动作、弹窗承载六个表单态；指标卡与筛选虽同属「概览层」，但一个写死一个真实，业务含义不同故分列。

## 与 related_pages 的联动提示

- **↔ `page-teams`（团队管理）**：同属 `sec-governance`、同有「学院」维度、同有写死指标卡（本页 +333 / 那边 +77），但**数据完全不共享**（`MOCK_USERS` vs `MOCK_PROJECT_TEAMS`）；且本页接收 `onOpenProject` 但**全页没有任何调用点**（`page-teams` 则有「查看项目全景档案」按钮）——本页到项目档案的通路是断的。
- **→ `page-mentors-pool`（导师池）**：导师账号（本页 `role=mentor`）与导师档案（那边）是两套记录、无关联；规模数字也不一致（本页写死 48 位，导师池页是真实 `mentors.length`）。
- **→ `page-login`（登录分流）**：本页新增账号与登录页预置账号**互不相通**（见 issue `issue-users-accounts-isolated`）；「CAS/OAuth2 实时同步」两边各写一次文案、各无实现。
- **→ `shell-project-drawer`（项目详情抽屉）**：本页「关联项目数」只显示数字，**不可点击**；`onOpenProject` prop 备而未用，若要支持「点数字看项目列表」可直接接上。
