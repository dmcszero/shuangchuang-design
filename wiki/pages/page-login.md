---
id: page-login
title: 登录分流
section: sec-entry
importance: medium
view: login
component: src/components/LoginPage.tsx
sources:
  - src/components/LoginPage.tsx:1-562
related_pages: ["page-coach", "page-cockpit", "page-supervision", "page-mentors-pool"]
nodes:
  - nd-login-portals
  - nd-login-university
  - nd-login-form
  - nd-login-presets
---

## 一句话定位

未登录用户的唯一入口：先选「我是哪个端」，再填账号（或点预置卡免密进入），提交后由 App 按角色分流到该端的默认工作区——学生→AI 助手、校管→数据驾驶舱、导师→督导闭环、Admin→导师池。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 `App.tsx` 在 `!session` 时**整页替换**渲染（早返回，不进入侧栏/顶栏壳层）：`if (!session) { return <LoginPage onLoginSuccess={handleLoginSuccess} />; }` Sources: [src/App.tsx:551-553]()
2. 唯一 prop 是 `onLoginSuccess`，组件自身不跳转、不写全局状态。 Sources: [src/components/LoginPage.tsx:24-28]()
3. 页面根容器为 `min-h-screen flex flex-col justify-between`（品牌头 / 居中卡片区 / 页脚三段），无固定 id 锚点。 Sources: [src/components/LoginPage.tsx:115-118]()
4. 页脚一行说明「2026 中国国际大学生创新大赛 · 高校双创管理中枢决策平台 | 账号体系与四端权限调度架构」（纯文本，无链接）。 Sources: [src/components/LoginPage.tsx:564-566]()

**二、页面级结构（不单独下钻为节点）**

5. 顶部品牌栏（`header`）：Logo + 「赛事打磨平台」+ 徽标「2026大赛官方培育决策平台」+ 一行说明「面向高校管理端、参赛项目组、辅导专家智库与系统管理员的全流程统一门户」；右侧为绿色状态徽标「2026国赛标准规则库已生效」（带呼吸点，**纯展示，不校验任何规则库**）。 Sources: [src/components/LoginPage.tsx:121-145]()
6. 主体是 `max-w-5xl` 的 12 栅格卡片：左 5 栏身份区、右 7 栏表单区；`lg` 以下纵向堆叠。 Sources: [src/components/LoginPage.tsx:149-152]() [src/components/LoginPage.tsx:282-283]()
7. 本地 state 共 10 个：`activeRole` / `selectedUniversity` / `universitySearch` / `isUniDropdownOpen` / `account` / `password` / `showPassword` / `userName` / `collegeOrDept` / `errorMessage`——全部困在组件内，App 只知道登录结果 `UserSession`。 Sources: [src/components/LoginPage.tsx:29-41]()
8. 三个处理器：`handleRoleChange`（切端并回填演示账号）、`handleSelectPreset`（回填 + 免密登入）、`handleFormSubmit`（校验 + 构造 session）。 Sources: [src/components/LoginPage.tsx:44-108]()

**三、登录结果的去向（跨页契约）**

9. `handleLoginSuccess` 把 session 写入 state 与 localStorage（key `ai_studio_innovation_session_2026`），再按角色设默认 tab：`team_member→coach` / `mentor→supervision` / `system_admin→mentors_pool` / 其余（校管）`→cockpit`。 Sources: [src/App.tsx:315-340]()
10. 学生端登录额外做两件事：`setActiveTeamProjectId(session.projectId)` 与 `setSelectedProject(该项目)`——**项目上下文由登录带入 session**，不是进入后再选。 Sources: [src/App.tsx:323-330]()
11. 刷新页面时 App 从 localStorage 恢复 session（无需重新登录），默认 tab 由 `activeTab` 初始化器按同一套角色规则重算。 Sources: [src/App.tsx:47-65]()

## 规则与边界（AI 开发硬约束）

- **本页是「假门」**：无后端请求、无密码校验、身份前端自选、无 token；统一身份认证（CAS / OAuth2.0）仅写在文案里。任何鉴权相关需求都属于**换实现**而不是改参数（见 issue `issue-login-sso-placeholder`）。
- **学生端默认落地页是 AI 助手（`coach`）而不是项目工作台**——这是 v0.4 按源码确认的口径（`p-student.defaultPage = page-coach`），改这里等于改端默认页，必须同步 `structure.json` 的 `personas[].defaultPage`。
- 四个端的「默认页」全部由 `App.tsx` 的分流分支决定，本页只负责产出带 `role` 的 session；**不要在登录页写任何跳转**。
- 高校字段与产品口径相关：它只服务学生/校管两端，且**不会流向 AI 教练页的校内智库**（该页自带独立选校，见 issue `issue-coach-campus-university-out-of-sync`）。
- 页面中所有「已生效 / 标准版 / 统一身份认证」类文案均为**对外表述**，不代表已实现能力；改动需与产品口径对齐。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 加一个端 | `:166-272` + `:29` | `PortalRole` / `DEMO_PRESET_ACCOUNTS` / App 分流三分支 |
| 改某端默认落地页 | — | `src/App.tsx:323-339` + `structure.json:personas[].defaultPage` |
| 接入真实鉴权（SSO） | `:72-108` | App `handleLoginSuccess` + localStorage 会话 + 免密卡路径 |
| 登录页改暗色/换视觉 | `:115-152` | 属团队视觉基线（亮色 slate/sky），改动需团队确认 |
| 去掉免密后门（上线前） | `:513-532` | 同步重估表单校验与 `passwordHint` 用途 |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-login-portals` | 四端身份选择卡 | panel | 152-279 | → `nd-login-form`（回填凭据，writeback） |
| `nd-login-university` | 所属高校选择器 | form | 311-407 | → `nd-login-form`（writeback） |
| `nd-login-form` | 账号登录表单 | form | 285-496 | → `shell-app`（登录分流，navigate-with-payload）；→ `nd-login-portals`（read 当前角色） |
| `nd-login-presets` | 一键免密登入测试账号 | list | 500-556 | → `shell-app`（免密登入，navigate-with-payload） |

> 未下钻为节点的页面级结构：顶部品牌栏（121-145）、页脚说明（564-566）、卡片外框与栅格（149-152 / 282-283）。
>
> **拆分依据**：四块各有独立数据域（角色枚举 / 高校字典 / 表单凭据 / 预置账号）与独立出口（回填、校验、免密登录），且「表单」与「免密卡」**不是同一条提交路径**（后者绕过校验），必须分开登记，否则会漏掉后门。

## 与 related_pages 的联动提示

- **→ `page-coach`（AI 助手，学生端默认页）**：学生登录后直接落到 AI 助手；本页选定的高校**不影响**该页校内智库（该页用 `mockCoachData.mockUniversities[0]`，默认厦门大学，且引用文号硬编码为「厦大创字〔2025〕06号」）。
- **→ `page-cockpit` / `page-supervision` / `page-mentors-pool`**：校管、导师、Admin 三端的落地页；三处都只依赖 `session.role`，不读其他登录字段。
- **→ 与 `page-workbench` 的关系**：学生端登录带出 `projectId`（demo 由预置账号固定），项目工作台头部据此渲染项目身份；「每个学生仅绑定一个项目」的口径由此实现——侧栏的项目切换是演示态遗留。
- **→ 退出登录**：`handleLogout` 清 state 与 localStorage 后回到本页，无二次确认（`src/App.tsx:342-349`）。
