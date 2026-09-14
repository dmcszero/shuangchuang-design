---
id: nd-teams-filters
title: 搜索与团队筛选
page: page-teams
kind: form
importance: medium
sources:
  - src/components/TeamManagement.tsx:163-195
---

## 一句话定位

团队列表的检索条：一个关键词框 + 两个下拉（核验状态 / 跨学院），把 5 支团队收窄成要看的那几支。

## 事实（每条强制可回溯）

1. 页面共 6 个 state：`teams`（初值 `MOCK_PROJECT_TEAMS`）/ `searchQuery` / `statusFilter` / **`trackFilter`** / `crossCollegeFilter` / `expandedTeamId` / `toastMessage`。 Sources: [src/components/TeamManagement.tsx:27-33]()
2. **`trackFilter` 声明后从未被读取**——界面上没有对应控件，`filteredTeams` 也不含赛道条件；这是一处死状态。 Sources: [src/components/TeamManagement.tsx:30]() [src/components/TeamManagement.tsx:43-56]()
3. 关键词搜索覆盖 **5 个字段**：项目名 / 项目编号 / 队长姓名 / 指导教师姓名 / 学院（均为不区分大小写的子串匹配）。 Sources: [src/components/TeamManagement.tsx:44-50]()
4. 核验状态下拉三档：全部 / `verified`（核验通过·结构达标）/ `need_supplement`（待整改补充·缺商业财务成员）/ `warning`（一票否决高风险·权属瑕疵）——文案中的括号说明与 `auditStatus` 三值一一对应。 Sources: [src/components/TeamManagement.tsx:174-183]()
5. 跨学院下拉三档：全部 / `yes`（仅看跨学院交叉团队）/ `no`（单一学院团队），判据是布尔字段 `team.crossCollege`。 Sources: [src/components/TeamManagement.tsx:186-194]() [src/components/TeamManagement.tsx:52-53]()
6. 三个条件**「与」关系**，结果直接给卡片列表；列表**无空态文案**（筛不出结果时只留一片空白）。 Sources: [src/components/TeamManagement.tsx:43-56]()

## 规则与边界（AI 开发硬约束）

- `trackFilter` 是**遗留死状态**：要么补赛道筛选控件（数据里有 `trackLabel`），要么删除（见 issue `issue-teams-dead-state`）。
- 筛选**不影响上方的指标卡**（指标卡是页面级派生，不读 `filteredTeams`）——切筛选时指标不动，属预期但易被误读。
- 搜索框 placeholder 写「搜索项目编号、名称、队长、指导教师...」，实际还包含「学院」字段（多支持一项，不影响使用）。
- 无排序、无分页：筛选后按 `teams` 数组原序展示。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 启用赛道筛选 | `:30` | 补控件 + `filteredTeams` 加条件（`trackLabel` / `track` 字段） |
| 删除死状态 | `:30` | 纯清理 |
| 加空态 | `:197` | 纯 UI |
| 筛选与指标卡联动 | `:43-56` | 需决定指标口径是「全校」还是「当前筛选」 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
