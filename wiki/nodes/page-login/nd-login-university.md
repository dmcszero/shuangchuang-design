---
id: nd-login-university
title: 所属高校选择器
page: page-login
kind: form
importance: medium
sources:
  - src/components/LoginPage.tsx:311-407
---

## 一句话定位

学生端与校管端必填的「所属高校」选择器：自带搜索的下拉列表 + 5 所快捷徽章 + 「搜不到就用自定义校名」出口，选中的校名最终写进会话的 `university` 字段。

## 事实（每条强制可回溯）

1. 仅 `team_member` 与 `school_admin` 两个角色渲染该字段（条件表达式 `(activeRole === 'team_member' || activeRole === 'school_admin') && (...)`），导师端与 Admin 端整个字段不出现。 Sources: [src/components/LoginPage.tsx:311-312]()
2. 触发器显示「所属高校 (必选)」+「已选：{selectedUniversity}」，点击切换 `isUniDropdownOpen`。 Sources: [src/components/LoginPage.tsx:314-330]()
3. 下拉内搜索框按 `UNIVERSITY_LIST` 做**不区分大小写的子串匹配**（`filteredUniversities`）。 Sources: [src/components/LoginPage.tsx:110-112]() [src/components/LoginPage.tsx:340-350]()
4. 列表项点击 = `setSelectedUniversity(uni)` + 关闭下拉；当前选中项高亮并带勾选图标。 Sources: [src/components/LoginPage.tsx:351-368]()
5. 搜索无结果时提供自定义出口：把搜索词**原样当作校名**写入（`setSelectedUniversity(universitySearch)`），因此校名不受 `UNIVERSITY_LIST` 限制。 Sources: [src/components/LoginPage.tsx:369-381]()
6. 下方 5 个快捷徽章固定为：同济大学、清华大学、浙江大学、上海交通大学、华中科技大学，点击直接赋值（不经过下拉）。 Sources: [src/components/LoginPage.tsx:389-403]()
7. `UNIVERSITY_LIST` 共 28 所高校，默认选中「同济大学」。 Sources: [src/data/mockUniversities.ts:3-32]() [src/components/LoginPage.tsx:32]()
8. `UNIVERSITY_LIST` 与预置账号共用同一文件，但**列表里只有 28 所**，预置账号的 `university` 值（同济/清华/浙大）落在其中。 Sources: [src/data/mockUniversities.ts:3-32]() [src/data/mockUniversities.ts:50-151]()

## 规则与边界（AI 开发硬约束）

- 该值只在**学生端与校管端**参与提交校验（空值时报「请选择或填写所属高校！」）；其他端 `session.university` 恒为 `undefined`，页脚与工作台头部的学校前缀因此不显示。 Sources: [src/components/LoginPage.tsx:78-81]() [src/components/LoginPage.tsx:97]() [src/App.tsx:846]()
- 下拉是**自绘弹层**（绝对定位），当前**没有点击外部关闭**逻辑，也没有与其他弹层互斥；只切换 `isUniDropdownOpen`，不改其他 state。
- 自定义校名会直接进入 `session.university` 并随会话持久化（localStorage），下游页面按字符串使用——**不要假设它一定属于 `UNIVERSITY_LIST`**。
- 校名不会传给 AI 教练页的「校内智库」（该页自带一套 mock 选校，见 issue `issue-coach-campus-university-out-of-sync`）；改这里的字段名或口径要顺手核对那一侧。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 扩充高校库 | `src/data/mockUniversities.ts:3-32` | 快捷徽章 `:389-403` 为独立硬编码，注意口径一致 |
| 下拉支持点击外部关闭 | `:34`（state）/ `:332-386`（弹层） | 无外部依赖，纯页内 |
| 高校改为可配置（后端/字典） | `:33` | 会同时影响 `DEMO_PRESET_ACCOUNTS` 的 `university` 值域 |
| 让教练页校内智库跟随登录校名 | `:97` | 见 `page-coach` 的 `nd-coach-composer` 选校逻辑 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-login-university-2-form-writeback`** → `nd-login-form`（账号登录表单）｜`writeback` · **implemented（已实现）**
  - 触发：在高校下拉中选定一项 / 点快捷徽章 / 使用自定义校名
  - 逻辑：setSelectedUniversity(...) 写入表单 state；该值随后被提交校验（学生与校管端必填）与 session.university 消费。
  - 出处：`src/components/LoginPage.tsx:351-368`
  - 出处：`src/components/LoginPage.tsx:389-403`
  - 出处：`src/components/LoginPage.tsx:369-381`
<!-- EDGES:END -->
