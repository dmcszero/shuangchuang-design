---
id: nd-users-table
title: 用户台账表与账号操作
page: page-users
kind: table
importance: high
sources:
  - src/components/UserManagement.tsx:271-409
---

## 一句话定位

本页主体：七列用户台账（姓名工号 / 角色 / 单位 / 关联项目 / 联系方式 / 状态 / 操作），行内可**点击状态徽标即时启用或停用**、可重置密码——本页的两个写/动作入口都在这一行里。

## 事实（每条强制可回溯）

1. 七列表头：用户姓名 / 工号（文案写作「用户姓名 / **工工号**」，含一处重复字）、系统身份与角色、所属单位/学院、关联项目/指导数、联系方式、状态、操作。 Sources: [src/components/UserManagement.tsx:275-284]()
2. 首列复合展示：头像（带右下角状态点）——**状态点三色**：`active` 且 `isOnline` 为绿、`active` 非在线为灰、非 active 为玫红；其中 `isOnline` 判据写死为 `lastLogin === '刚刚' || lastLogin.includes('分钟')`。 Sources: [src/components/UserManagement.tsx:292-317]()
3. 角色列用五色徽标（超级管理员玫红 / 导师琥珀 / 学院秘书天蓝 / 指导教师翡翠 / 学生负责人靛蓝）+ `roleLabel` 文本。 Sources: [src/components/UserManagement.tsx:318-334]()
4. 关联项目列渲染 `user.associatedProjectsCount` + 「项」；联系方式列渲染邮箱（截断 140px）与电话。 Sources: [src/components/UserManagement.tsx:344-361]()
5. **状态列是一个可点按钮**（title「点击切换启用/停用状态」）→ `handleToggleStatus(user.id)`：在 `active ↔ inactive` 之间翻转，并对**原用户对象**弹 Toast「已启用/停用用户【X】账号权限」。 Sources: [src/components/UserManagement.tsx:44-56]() [src/components/UserManagement.tsx:362-383]()
6. 操作列只有一个动作「重置密码」→ `handleResetPassword(user.name)`，**仅弹 Toast**「已向用户【X】绑定的企业微信及邮箱发送临时密码重置链接」。 Sources: [src/components/UserManagement.tsx:58-60]() [src/components/UserManagement.tsx:385-395]()
7. 表尾信息条：左侧「共显示 `{filteredUsers.length}` 位注册账号」（**真实派生**）；右侧「按校级统一身份认证系统 (CAS/OAuth2) 权限策略实时同步」（**写死声明，无任何同步实现**）。 Sources: [src/components/UserManagement.tsx:404-408]()
8. 空态单独一行渲染（`colSpan={7}`，居中「没有匹配的用户记录」）。 Sources: [src/components/UserManagement.tsx:274-280]()

## 规则与边界（AI 开发硬约束）

- **账号状态可一键翻转但无二次确认**：误点即改（且会立刻影响筛选结果与指标口径认知）；「停用」的后果（该用户能否登录、权限何时失效）在代码里无体现——真实能力需接权限系统。
- 「重置密码」是**纯提示**（见事实 6）：不发邮件、不生成临时密码、不落库。
- 表尾的「CAS/OAuth2 实时同步」是**文案承诺**（与 `page-login` 的 SSO 假门同一问题域，见 issue `issue-login-sso-placeholder`）；同页 `page-teams` 的「一键合规全检」也是同类写法。
- `isOnline` 判据依赖 `lastLogin` 自由文本（『刚刚』/含「分钟」），是脆弱的字符串匹配，字段格式一变就失效。
- 本表**无分页**，行数=`users.length`（当前 9）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 停用加二次确认 / 加停用原因 | `:44-56` `:362-383` | 需 `SystemUser` 扩字段 |
| 重置密码接真实流程 | `:58-60` | 需邮件/短信服务与 token 表 |
| `isOnline` 改结构化字段 | `:294` | `SystemUser.lastLogin` 改时间戳 |
| 行内编辑用户资料 | `:385-395` | 当前只有「新增」，无编辑入口（`page-mentors-pool` 有完整增删改可参考） |
| 修正表头「工工号」笔误 | `:277` | 纯文案 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-users-table-2-shell-accounts-intended`** → `shell-app`（应用壳层）｜`writeback` · **intended（设计有·未实现）**｜severity: high
  - 触发：点击状态列徽标切换启用/停用；或在新增弹窗提交新用户
  - 设计依据：页尾声明「按校级统一身份认证系统 (CAS/OAuth2) 权限策略实时同步」src/components/UserManagement.tsx:407；新增弹窗「账号开通后将自动下发短信及激活邮件…」src/components/UserManagement.tsx:530-532；弹窗标题「录入新用户与分配权限」src/components/UserManagement.tsx:437
  - 期望行为：账号的新增、启停与角色授权应进入系统级权限体系（可被登录/鉴权消费），并同步到统一身份认证；停用后该用户应无法登录或失去相应权限。
  - **卡点**：users 是组件本地 state（初值 MOCK_USERS），本页**没有任何上行 prop**（只有可选 onOpenProject）；账号与登录体系（page-login 的 DEMO_PRESET_ACCOUNTS + 前端自选角色）互不相通，Auth 层不存在。
<!-- EDGES:END -->
