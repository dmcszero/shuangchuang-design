---
id: nd-login-form
title: 账号登录表单
page: page-login
kind: form
importance: high
sources:
  - src/components/LoginPage.tsx:285-496
---

## 一句话定位

右栏的主体登录表单：按当前身份换文案，收集账号/密码/姓名/学院，做两项本地校验后构造 `UserSession` 交给上层分流——**全库唯一产生登录态的地方**。

## 事实（每条强制可回溯）

1. 表单标题与副标题随 `activeRole` 四选一（如学生端「【项目组成员】账号登录 / 请选择您所在的高校，并输入学号或手机号进行登录」）。 Sources: [src/components/LoginPage.tsx:285-303]()
2. 右上角固定徽标「2026国赛标准版」（不随角色变化）。 Sources: [src/components/LoginPage.tsx:304-306]()
3. 提交校验只有两条：账号非空（否则「请输入账号/学号/工号！」）；学生端与校管端高校非空（否则「请选择或填写所属高校！」）。**密码字段无任何校验**，空值或任意字符都能提交。 Sources: [src/components/LoginPage.tsx:72-81]()
4. 账户/密码输入框带角色化 label（学号·注册手机号·邮箱 / 教工号 / 专家库编号 / 超级管理员工号），密码框默认填入 `123456` 并标「默认测试密码已自动填入」，可切换明文显示。 Sources: [src/components/LoginPage.tsx:36-38]() [src/components/LoginPage.tsx:410-428]() [src/components/LoginPage.tsx:430-455]()
5. 「用户姓名」与「所属学院与专业 / 主管机构院系 / 机构专长标签」是两个自由文本输入框，label 随角色变化。 Sources: [src/components/LoginPage.tsx:458-479]()
6. 提交时按 `role` 生成 `roleLabel`（项目组成员 / 学校管理端 / 辅导导师端 / Admin超管端），并组装 `UserSession`：`role/roleLabel/name/avatar/account/university(仅学生+校管)/college/majorOrTitle/projectId/projectName`。 Sources: [src/components/LoginPage.tsx:82-107]()
7. **账号匹配失败会回落到该端第一个预置账号**（`currentPresets.find(...) || currentPresets[0]`）：avatar/majorOrTitle/projectId/projectName 均取预置值，学生端因此恒有 `projectId`（缺省 `proj-001`）与项目名。 Sources: [src/components/LoginPage.tsx:91-106]()
8. 校验失败的提示条只在 `errorMessage` 非空时渲染（玫瑰色 `AlertCircle` 行）。 Sources: [src/components/LoginPage.tsx:481-486]()
9. 提交按钮文案随角色变化（进入【项目组成员】工作台 / 【学校管理端】大盘 / 【导师端】评审系统 / 【Admin端】管理中枢）。 Sources: [src/components/LoginPage.tsx:489-496]()
10. 登录成功回调是 prop `onLoginSuccess`（由 App 注入 `handleLoginSuccess`），本组件不自行跳转。 Sources: [src/components/LoginPage.tsx:24-28]() [src/components/LoginPage.tsx:107]() [src/App.tsx:551-553]()

## 规则与边界（AI 开发硬约束）

- **这是演示态鉴权**：身份由前端单选、无密码校验、无后端请求、无 token；任何「真实性」需求都要先接受它是一层假门（见 issue `issue-login-sso-placeholder`）。
- `session` 会被 App 写入 localStorage（key `ai_studio_innovation_session_2026`），**刷新页面即免登录回到上次身份**；改登录逻辑要连带考虑这条持久化路径。 Sources: [src/App.tsx:47-58]() [src/App.tsx:317-322]()
- 学生端登录后由 App 决定落地页与当前项目：`setActiveTab('coach')` + `setActiveTeamProjectId(session.projectId)`；改这里会直接改变学生进系统看到的第一屏（当前是 AI 助手而不是项目工作台）。 Sources: [src/App.tsx:323-330]()
- 「每个学生仅绑定一个项目」口径由预置账号的 `projectId` 承载——**不要在这张表单里加项目选择器**（demo 的项目切换入口在侧栏，属演示态）。
- 表单校验与预置卡免密登入是两条并行路径（后者不校验），只改一边会造成「表单报错但一键能进」的不一致。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接入真实登录接口 | `:72-108` | App `handleLoginSuccess`（:315-340）+ localStorage 会话结构 |
| 加密码/验证码校验 | `:72-81` | 需同时处理免密路径（`nd-login-presets`） |
| 改角色落地页 | — | `src/App.tsx:323-339`（分流唯一真源） |
| 新增端专属表单字段 | `:305-479` | 角色 label 有三处并行写法（title/副标题/输入框 label），易漏改 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 3 条**

- **`e-login-portals-2-form-credentials`** ← `nd-login-portals`（四端身份选择卡）｜`writeback` · **implemented（已实现）**
  - 触发：点击任一身份卡（【项目组成员】/【学校管理端】/【导师端】/【Admin端】）
  - 逻辑：handleRoleChange(newRole)：setActiveRole + 清空 errorMessage + 取该端第一个预置账号回填 account/password(取 passwordHint)/userName/collegeOrDept；仅学生端与校管端另回填 selectedUniversity。
  - 出处：`src/components/LoginPage.tsx:44-58`
  - 出处：`src/components/LoginPage.tsx:171`
  - 出处：`src/components/LoginPage.tsx:197`
  - 出处：`src/components/LoginPage.tsx:223`
  - 出处：`src/components/LoginPage.tsx:249`
  - 备注：回填会覆盖用户已输入内容，是演示取舍（改交互需同时改 handleSelectPreset）。
- **`e-login-university-2-form-writeback`** ← `nd-login-university`（所属高校选择器）｜`writeback` · **implemented（已实现）**
  - 触发：在高校下拉中选定一项 / 点快捷徽章 / 使用自定义校名
  - 逻辑：setSelectedUniversity(...) 写入表单 state；该值随后被提交校验（学生与校管端必填）与 session.university 消费。
  - 出处：`src/components/LoginPage.tsx:351-368`
  - 出处：`src/components/LoginPage.tsx:389-403`
  - 出处：`src/components/LoginPage.tsx:369-381`
- **`e-login-presets-2-form-prefill`** ← `nd-login-presets`（一键免密登入测试账号）｜`writeback` · **implemented（已实现）**
  - 触发：点击「当前端推荐测试账号」卡片
  - 逻辑：handleSelectPreset(preset) 回填 account/password/name/college（有 university 则一并回填）并清错；由于同一处理器内立刻登录跳转，这次回填对用户通常不可见。
  - 出处：`src/components/LoginPage.tsx:60-71`
  - 出处：`src/components/LoginPage.tsx:513-532`

**出边 2 条**

- **`e-login-form-2-portals-read`** → `nd-login-portals`（四端身份选择卡）｜`read` · **implemented（已实现）**
  - 触发：（无触发，表单读取当前角色）
  - 逻辑：表单标题/副标题、账号 label、学院 label、提交按钮文案与「所属高校」字段的可见性全部由 activeRole 派生；校验分支也按 activeRole 判断是否要求高校。
  - 出处：`src/components/LoginPage.tsx:285-303`
  - 出处：`src/components/LoginPage.tsx:311-312`
  - 出处：`src/components/LoginPage.tsx:410-412`
  - 出处：`src/components/LoginPage.tsx:458-462`
  - 出处：`src/components/LoginPage.tsx:489-496`
- **`e-login-form-2-shell-app-login`** → `shell-app`（应用壳层）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：提交表单（账号非空、学生/校管端高校非空）
  - 载荷：`UserSession{role, roleLabel, name, avatar, account, university?, college, majorOrTitle?, projectId?, projectName?}`
  - 逻辑：handleFormSubmit 构造 session → prop onLoginSuccess → App.handleLoginSuccess：写 state + localStorage('ai_studio_innovation_session_2026')，按 role 设默认 tab（team_member→coach / mentor→supervision / system_admin→mentors_pool / 其余→cockpit），学生端另设 activeTeamProjectId 与 selectedProject。
  - 出处：`src/components/LoginPage.tsx:72-108`
  - 出处：`src/App.tsx:315-340`
  - 出处：`src/App.tsx:47-58`
  - 备注：密码不参与校验；未匹配账号回落到该端第一个预置账号的身份字段。
<!-- EDGES:END -->
