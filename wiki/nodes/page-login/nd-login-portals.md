---
id: nd-login-portals
title: 四端身份选择卡
page: page-login
kind: panel
importance: high
sources:
  - src/components/LoginPage.tsx:152-279
---

## 一句话定位

登录页左栏的「我以什么身份进来」选择区：四张身份卡对应四个业务端，点选即决定后续表单形态、预置账号与登录后的落地工作区。

## 事实（每条强制可回溯）

1. 左栏容器为 `lg:col-span-5`：窄屏时置于顶部、`lg` 断点起转为左侧栏（右栏 `lg:col-span-7` 承载表单）。 Sources: [src/components/LoginPage.tsx:152]() [src/components/LoginPage.tsx:282]()
2. 顶部三件套：徽标「多端权限统一网关」+ 标题「请选择您的登录身份」+ 说明「系统划分4个业务专属端，为各端用户提供精准量身定制的工作台与数据视角。」 Sources: [src/components/LoginPage.tsx:155-163]()
3. 四张身份卡按固定顺序渲染（整个卡片组 `:166-272`），角色值依次为 `team_member` / `school_admin` / `mentor` / `system_admin`，卡面文案为【项目组成员】/【学校管理端】/【导师端】/【Admin端】；四张卡的点击处理器分别在 `:171` / `:197` / `:223` / `:249`。 Sources: [src/components/LoginPage.tsx:166-272]() [src/components/LoginPage.tsx:171]() [src/components/LoginPage.tsx:197]() [src/components/LoginPage.tsx:223]() [src/components/LoginPage.tsx:249]()
4. 每张卡右上角带固定徽标（需选高校 / 需选高校 / 智库专家 / 全局总控）与一行人群说明（学生队长/核心成员 · 申报材料、AI体检与导师整改闭环 等）。 Sources: [src/components/LoginPage.tsx:178-190]() [src/components/LoginPage.tsx:204-216]() [src/components/LoginPage.tsx:230-242]() [src/components/LoginPage.tsx:256-268]()
5. 选中态由 `activeRole` 决定（初值 `team_member`），四端选中配色不同：sky（学生）/ blue（校管）/ amber（导师）/ purple（admin）。 Sources: [src/components/LoginPage.tsx:29]() [src/components/LoginPage.tsx:172-175]()
6. 点击卡片调用 `handleRoleChange`：切换角色 + 清空 `errorMessage` + 用该端**第一个**预置账号回填 `account` / `password`（取 `passwordHint`）/ `userName` / `collegeOrDept`；仅学生端与校管端额外回填 `selectedUniversity`。 Sources: [src/components/LoginPage.tsx:44-58]()
7. 底部提示行「支持统一身份认证 (CAS / OAuth2.0 / 统一学工号)」为纯文本声明（`CheckCircle2` 图标 + 一行 span），**代码中无任何对应实现**（无 SSO 跳转、无回调、无 token 处理）。 Sources: [src/components/LoginPage.tsx:274-278]()

## 规则与边界（AI 开发硬约束）

- `activeRole` 是整页唯一的身份来源：表单文案、校验分支、预置账号列表、提交后的角色标签全部由它派生，改它等于改四个端。
- **角色切换会覆盖用户已输入的内容**（账号/密码/姓名/学院/高校被演示账号覆写）。这是演示取舍；若要保留用户输入，须同时改 `handleRoleChange` 与 `handleSelectPreset` 两处。
- 新增端要三处同步：`PortalRole` 联合类型（`src/types.ts`）、`DEMO_PRESET_ACCOUNTS`（`src/data/mockUniversities.ts`）、App 的角色分流分支（`src/App.tsx:315-340`）——漏改第三处会落到 `cockpit` 兜底分支。
- 卡片的人群说明文案（如「学院秘书」「国赛评委/创投合伙人」）是对外表述口径，改动会被团队仓合并带走，属产品文案而非样式调整。
- 左栏为纯展示 + 单选，无网络请求；不要在此处加任何登录调用（登录动作在右栏表单与预置卡）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 调整四端表述/人群说明 | `:178-268` | 产品文案，需与 PRD「三类核心用户」口径对齐 |
| 支持第五个端 | `:166-272` + `:29` | `PortalRole` 类型 / `DEMO_PRESET_ACCOUNTS` / App 分流 |
| 记住用户上次选择的端 | `:29` | 需引入持久化（现仅 session 存 localStorage） |
| 落地点：真实统一身份认证 | `:274-278`（文案） | 见 issue `issue-login-sso-placeholder` |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-login-form-2-portals-read`** ← `nd-login-form`（账号登录表单）｜`read` · **implemented（已实现）**
  - 触发：（无触发，表单读取当前角色）
  - 逻辑：表单标题/副标题、账号 label、学院 label、提交按钮文案与「所属高校」字段的可见性全部由 activeRole 派生；校验分支也按 activeRole 判断是否要求高校。
  - 出处：`src/components/LoginPage.tsx:285-303`
  - 出处：`src/components/LoginPage.tsx:311-312`
  - 出处：`src/components/LoginPage.tsx:410-412`
  - 出处：`src/components/LoginPage.tsx:458-462`
  - 出处：`src/components/LoginPage.tsx:489-496`

**出边 1 条**

- **`e-login-portals-2-form-credentials`** → `nd-login-form`（账号登录表单）｜`writeback` · **implemented（已实现）**
  - 触发：点击任一身份卡（【项目组成员】/【学校管理端】/【导师端】/【Admin端】）
  - 逻辑：handleRoleChange(newRole)：setActiveRole + 清空 errorMessage + 取该端第一个预置账号回填 account/password(取 passwordHint)/userName/collegeOrDept；仅学生端与校管端另回填 selectedUniversity。
  - 出处：`src/components/LoginPage.tsx:44-58`
  - 出处：`src/components/LoginPage.tsx:171`
  - 出处：`src/components/LoginPage.tsx:197`
  - 出处：`src/components/LoginPage.tsx:223`
  - 出处：`src/components/LoginPage.tsx:249`
  - 备注：回填会覆盖用户已输入内容，是演示取舍（改交互需同时改 handleSelectPreset）。
<!-- EDGES:END -->
