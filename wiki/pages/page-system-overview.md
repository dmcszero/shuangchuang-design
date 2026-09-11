---
id: page-system-overview
title: 系统总览与四端门户
section: sec-system
importance: high
sources:
  - src/App.tsx
  - src/components/LoginPage.tsx
  - src/types.ts
  - src/data/mockUniversities.ts
related_pages: [page-roles-navigation, page-app-shell]
---

# 系统总览与四端门户

## 一句话定位

「赛事打磨平台」是 2026 中国国际大学生创新大赛的校级培育决策平台，入口是一个四端（项目组成员 / 学校管理端 / 导师端 / Admin 端）统一登录网关，登录态落 localStorage，登录后按角色落到各自的默认首页。

## 事实（每条强制可回溯）

1. 系统划分 4 个业务专属端，角色枚举为 `team_member | school_admin | mentor | system_admin`。`Sources: [src/types.ts:19-19]()`
2. 登录页左侧是四端身份选择卡，四张卡分别对应 4 个角色，且均标注了适配人群（学生队长/核心成员、校双创院/教务处/学院秘书、国赛评委/创投合伙人、平台超级管理员）。`Sources: [src/components/LoginPage.tsx:169-270]()`
3. 角色到中文标签的映射在提交时构造：项目组成员 / 学校管理端 / 辅导导师端 / Admin超管端。`Sources: [src/components/LoginPage.tsx:84-89]()`
4. 只有 `team_member` 与 `school_admin` 需要选择所属高校，高校选择器按角色条件渲染。`Sources: [src/components/LoginPage.tsx:78-81]()`
5. 高校可选清单来自 `UNIVERSITY_LIST` 常量数组；登录页还提供 5 个快捷选择（同济 / 清华 / 浙大 / 上交 / 华科）。`Sources: [src/data/mockUniversities.ts:3-32]()` `Sources: [src/components/LoginPage.tsx:392-405]()`
6. 四端预置演示账号集中在 `DEMO_PRESET_ACCOUNTS`（按角色分组），点击卡片可一键免密登入（绕过表单直接构造 session）。`Sources: [src/data/mockUniversities.ts:50-151]()` `Sources: [src/components/LoginPage.tsx:510-529]()`
7. 登录表单初始值硬编码为演示数据：高校「同济大学」、账号 `S20220199`、密码 `123456`、姓名「林子越」、学院「电子与信息工程学院」。`Sources: [src/components/LoginPage.tsx:32-40]()`
8. 登录态持久化的 localStorage key 是 `ai_studio_innovation_session_2026`：初始化时读取。`Sources: [src/App.tsx:44-54]()`
9. 同一 key 在登录成功时写入。`Sources: [src/App.tsx:244-250]()`
10. 退出登录时移除该 key 并清空 session。`Sources: [src/App.tsx:267-274]()`
11. 无 session 时 `App` 直接渲染 `LoginPage`，不渲染任何框架结构。`Sources: [src/App.tsx:475-478]()`
12. 默认落地页按角色决定：学生进 `coach`、导师进 `supervision`、平台管理员进 `mentors_pool`、其余（学校管理端）进 `cockpit`；`activeTab` 的初始值用同一套规则计算。`Sources: [src/App.tsx:56-61]()`
13. 登录成功后重定向逻辑与初始值规则一致，学生端额外把 `selectedProject` 预置为其绑定项目。`Sources: [src/App.tsx:252-264]()`
14. `UserSession` 的字段集合为 role / roleLabel / name / avatar / account / university / college / majorOrTitle / email / phone / projectId / projectName。`Sources: [src/types.ts:21-34]()`
15. 学生登录时若预置账号无项目，则兜底绑定 `proj-001` 与项目名「光子芯眸——新一代全固态硅光激光雷达芯片破壁者」。`Sources: [src/components/LoginPage.tsx:103-104]()`
16. 平台品牌文案为「赛事打磨平台」+ 角标「2026大赛官方培育决策平台」，页脚为「2026 中国国际大学生创新大赛 · 高校双创管理中枢决策平台 | 账号体系与四端权限调度架构」。`Sources: [src/components/LoginPage.tsx:126-136]()` `Sources: [src/components/LoginPage.tsx:565-567]()`
17. 高校下拉在检索无结果时允许直接使用自定义输入，即高校不是封闭枚举。`Sources: [src/components/LoginPage.tsx:369-383]()`

## 规则与边界（AI 开发硬约束）

- **新增/修改角色是一次五处联动改**：`types.ts` 的 `PortalRole`、`Sidebar.getNavGroups`、`TopHeader.tabTitleMap`、`LoginPage` 的 `roleLabels`、`mockUniversities` 的 `DEMO_PRESET_ACCOUNTS`。缺任一处会出现「能登录但无导航 / 无标题 / 无预置账号」的静默故障。见 `Sources: [src/components/Sidebar.tsx:190-261]()` `Sources: [src/components/TopHeader.tsx:44-62]()`
- **登录态存储 key 是隐式契约**：改名不会报错，只会让所有已有用户静默掉登录态；如需迁移必须显式兼容旧 key。
- 登录页职责是**身份入口**：只做角色选择、凭证收集、session 构造。业务数据、权限判定不放这里。
- 演示预置账号与表单默认值均为 **demo 数据**，不是真实认证实现（没有校验密码正确性，`password` 仅用于回填）。`Sources: [src/components/LoginPage.tsx:72-108]()`
- 高校字段对 `mentor` / `system_admin` 为 `undefined`，下游任何依赖 `session.university` 的展示都必须容错（侧栏、页脚均已做条件渲染）。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 新增一个端/角色 | 见上方「五处联动改」；另需在 `LoginPage` 四端卡片区加卡片（169-270） |
| 增删演示预置账号 | `src/data/mockUniversities.ts` 的 `DEMO_PRESET_ACCOUNTS`（50-151） |
| 改某角色的默认首页 | `App.tsx` 两处：`activeTab` 初值（56-61）与 `handleLoginSuccess`（252-264），**必须同步** |
| 改高校清单/加高校 | `UNIVERSITY_LIST`（`mockUniversities.ts:3-33`）；快捷选择徽章另在 `LoginPage.tsx:392` |
| 改品牌文案 | `LoginPage.tsx:126-136`（顶部）与 `565-567`（页脚）；工作区内另见 `App.tsx` 页脚（686-690） |
| 调整 session 字段 | `types.ts:21-34` + 构造点（`LoginPage.tsx:94-105`、`516-527`） |

## 与 related_pages 的联动提示

- → **page-roles-navigation**：本页只负责「谁进来了」，导航矩阵负责「进来后能去哪些视图」。改角色必然会连带改导航，两页必须一起改。
- → **page-app-shell**：登录成功后落进的正是应用骨架（三列布局 + TabType 分发）；改默认落地页要同步核对骨架里对该 tab 的渲染分支是否存在。
- 反向注意：`session.projectId` 是学生端全局项目选择的初始来源（见 page-sidebar-widgets），改 `UserSession` 字段时须一并核对项目切换器与 `App.tsx:481-483` 的兜底逻辑。
