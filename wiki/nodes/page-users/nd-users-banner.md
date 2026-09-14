---
id: nd-users-banner
title: 页头与新增用户入口
page: page-users
kind: bar
importance: medium
sources:
  - src/components/UserManagement.tsx:131-153
---

## 一句话定位

用户管理页的页头：标明本页维护的五类账号（校级管理者 / 学院秘书 / 评审专家 / 指导教师 / 学生负责人），右侧一个动作——新增注册用户。

## 事实（每条强制可回溯）

1. 标题「高校双创用户与权限管理」+ 徽标「多角色权限矩阵」。 Sources: [src/components/UserManagement.tsx:133-138]()
2. 副文「统一维护校级双创管理者、二级学院秘书、评审专家智库、指导教师及参赛学生团队账号与授权范围」。 Sources: [src/components/UserManagement.tsx:139-141]()
3. 「新增注册用户」按钮带稳定 id `btn-add-user`，onClick 仅 `setIsAddModalOpen(true)`（打开 `nd-users-adduser`）。 Sources: [src/components/UserManagement.tsx:145-152]()
4. 页面根容器带稳定 id `user-management-module`；Toast 为右上角深色浮层，全页动作共用。 Sources: [src/components/UserManagement.tsx:122]() [src/components/UserManagement.tsx:123-130]()
5. 副文提到的五类账号与角色筛选下拉的五档、`SystemUser['role']` 的五值一一对应（`super_admin` / `college_coordinator` / `mentor` / `advisor` / `student_leader`）。 Sources: [src/components/UserManagement.tsx:139-141]() [src/data/mockUsersAndTeams.ts:11]()

## 规则与边界（AI 开发硬约束）

- 页头**无状态**，按钮只切弹窗开关；角色枚举是「页头文案 / 筛选下拉 / 类型定义 / 创建表单」四处共用的**同一套**口径——新增角色要四处同步。
- 本页全部数据都在组件内（`users` 本地 state，初值 `MOCK_USERS`），**没有上行 prop**，除 `onOpenProject` 外的改动不会离开本页（见 `page-teams` 的同类结构）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增角色类型 | `:11`（类型）→ `:139-141`（文案）→ `:226-240`（筛选）→ `:489-500`（表单） | 四处枚举 + 徽标配色（`:318-334`） |
| 导出用户清单 | `:143-153` | 当前无导出（`page-mentors-pool` 两端各有实现可参考） |
| 批量导入用户 | `:143-153` | 需新弹窗 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
