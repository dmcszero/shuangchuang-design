---
id: nd-users-adduser
title: 新增用户弹窗
page: page-users
kind: modal
importance: high
sources:
  - src/components/UserManagement.tsx:411-539
---

## 一句话定位

本页唯一的创建入口：填姓名、工号学号、角色、学院与联系方式，提交后新用户即时出现在台账首行——**表单六项全在组件内，无任何后端**。

## 事实（每条强制可回溯）

1. 由 `isAddModalOpen` 控制；关闭方式只有右上 ✕ 与「取消」按钮（无遮罩点击/ESC 关闭）。 Sources: [src/components/UserManagement.tsx:32]() [src/components/UserManagement.tsx:411-436]()
2. 六个表单 state：`newUserName` / `newUserId`（学号工号）/ `newUserRole`（初值 `student_leader`）/ `newUserCollege`（初值「电子与信息工程学院」）/ `newUserEmail` / `newUserPhone`。 Sources: [src/components/UserManagement.tsx:35-40]()
3. 必填项只有两个（原生 `required`）：**真实姓名** 与 **学号/教工号**；角色与学院是下拉选择（有默认值），邮箱与电话可空。 Sources: [src/components/UserManagement.tsx:443-482]()
4. 角色下拉五档，顺序为：学生项目负责人（申报权限）/ 项目指导教师（指导权限）/ 评审专家·导师智库（打分与督导）/ 学院联络秘书（院赛初审）/ 校级超级管理员（全量权限）——括号内是对权限范围的口径说明。 Sources: [src/components/UserManagement.tsx:489-500]()
5. 学院下拉**写死 7 个选项**（电子与信息工程学院 / 计算机科学与技术学院 / 生命科学学院 / 医学技术与生物医学工程学院 / 经济管理学院 / 创新创业学院 / **外部特聘专家库**）——与筛选栏的动态 `collegesList`（从用户数据去重）**不是同一套来源**。 Sources: [src/components/UserManagement.tsx:502-514]()
6. 提交 `handleCreateUser`：按 `roleMap` 取中文角色标签构造 `SystemUser`，其中 **`id` 用时间戳后 4 位、`avatar` 写死一张 unsplash 图、`staffOrStudentId` 与 `email` 为空时自动生成占位值**（`ID{6位随机数}` / `{name小写}@university.edu.cn`）、`phone` 缺省 `138-0000-0000`、`associatedProjectsCount: 0`、`status: 'active'`、`lastLogin: '未登录'`、`createdAt` 取当天。 Sources: [src/components/UserManagement.tsx:62-103]()
7. 提交后：`setUsers([newUser, ...users])`（**插到第一行**）→ 关弹窗 → **清空姓名/工号/邮箱/电话四项（角色与学院保留上次值）** → Toast「成功创建并初始化用户【X】(角色)」。 Sources: [src/components/UserManagement.tsx:98-102]()
8. 弹窗内有一段「初始安全策略提示」：文案称「账号开通后将自动下发短信及激活邮件。首次登录需经校内短信两步验证，并强制修改默认初始密码。」——**无任何对应实现**。 Sources: [src/components/UserManagement.tsx:524-534]()

## 规则与边界（AI 开发硬约束）

- **邮箱自动生成用姓名拼音占位**：中文姓名经 `toLowerCase()` 后仍是中文字符，会产出形如 `张三@university.edu.cn` 的非法邮箱——这是一处真实缺陷（见 issue `issue-users-auto-email`）。
- 新增用户**只进本页 state**，不同步到登录页的预置账号（`page-login` 的 `DEMO_PRESET_ACCOUNTS`），也**不能被新账号登录**——「开通账号」是台账记录而非真实开户。
- 学院下拉写死 7 项 vs 筛选栏动态 6 项（当前数据）：新增一个「外部特聘专家库」用户后，筛选栏会多出一个选项——**两处口径不同源**，改动要一起看。
- 「初始安全策略」是文案（见事实 8），与 `page-login` 的 「支持统一身份认证 (CAS/OAuth2)」同属「承诺先写、实现未做」。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 邮箱占位改拼音/学号前缀 | `:78-80` | 需引入拼音库或改用 `staffOrStudentId` |
| 学院下拉与筛选栏同源 | `:502-514` | 需抽院系常量（`page-teams` / `page-mentorship` 也在用） |
| 添加上传头像 / 批量导入 | `:411-539` | 需新交互与接口 |
| 开通后同步到登录体系 | `:62-103` | 需与 `page-login` 的账号来源打通（当前完全隔离） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
