---
id: nd-users-filters
title: 四维筛选（搜索 + 角色 + 学院 + 状态）
page: page-users
kind: form
importance: medium
sources:
  - src/components/UserManagement.tsx:211-270
---

## 一句话定位

用户台账的检索条：关键词 + 角色 + 学院 + 账号状态四个条件，把用户表收窄——**学院下拉的选项是从当前用户数据动态去重生成的**（本页唯一一处「数据驱动 UI」）。

## 事实（每条强制可回溯）

1. 三个筛选 state + 一个搜索 state：`roleFilter` / `collegeFilter` / `statusFilter` / `searchQuery`（初值均为 `all` / 空串）。 Sources: [src/components/UserManagement.tsx:26-29]()
2. 关键词搜索覆盖 **4 个字段**：姓名 / 工号学号 / 邮箱 / 学院（不区分大小写子串匹配）。 Sources: [src/components/UserManagement.tsx:106-111]()
3. **学院下拉选项动态生成**：`collegesList = Array.from(new Set(users.map(u => u.college)))`——增删用户会实时改变下拉选项（实测 mock 有 6 个学院）。 Sources: [src/components/UserManagement.tsx:119]() [src/components/UserManagement.tsx:242-254]()
4. 角色下拉五档与 `SystemUser['role']` 五值一一对应（超级管理员 / 学院联络秘书 / 评审专家·导师 / 指导教师 / 学生负责人）。 Sources: [src/components/UserManagement.tsx:226-240]()
5. 状态下拉三档：全部 / `active`（正常启用）/ `inactive`（暂停授权）。 Sources: [src/components/UserManagement.tsx:256-269]()
6. 四条件**「与」关系**，结果给表格；表格**有空态**（「没有匹配的用户记录」，跨 7 列居中）。 Sources: [src/components/UserManagement.tsx:112-118]() [src/components/UserManagement.tsx:273-280]()

## 规则与边界（AI 开发硬约束）

- **学院下拉的数据驱动特性有副作用**：若某学院最后一位用户被停用/删除，该选项会消失（筛选态仍保留旧值时会筛出空表）——接真实分页/后端数据时需改成固定字典或独立的部门接口。
- 筛选**不影响指标卡**（指标卡是写死/半写死的页面级派生），切筛选时指标纹丝不动。
- 无排序、无分页；结果按 `users` 数组原序。
- 搜索 placeholder 写「搜索姓名、工号/学号、邮箱...」，实际还包含学院字段。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 学院选项改固定字典 | `:119` | 需引入院系数据源（`page-mentorship` / `page-teams` 也在用学院名，口径需统一） |
| 加排序/分页 | `:105-118` | 建议与筛选共用 state |
| 筛选态与表格联动优化（选空结果时提示重置） | `:273-280` | 可参考 `page-mentors-pool` 的「一键重置筛选」写法 |
| 导出当前筛选结果 | `:211-270` | 当前无导出 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
