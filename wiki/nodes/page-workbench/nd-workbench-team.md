---
id: nd-workbench-team
title: 团队架构与合规审查
page: page-workbench
kind: table
importance: medium
sources:
  - src/components/ProjectMemberWorkbench.tsx:774-847
---

## 一句话定位

项目工作台的第四个子 tab，用一张表回答「这个团队够不够格参赛」：成员学历梯度、跨学科分工、专利/IP 权属、以及校级秘书的合规审核状态与批注。

## 事实（每条强制可回溯）

1. 数据源 `MOCK_PROJECT_TEAMS`，按当前项目 id 匹配，匹配不到则回退到第 0 项。 Sources: [src/components/ProjectMemberWorkbench.tsx:65]()
2. 头部显示合规审查状态徽章（`auditStatus === 'verified'` → 已通过，否则 → 待补充材料）与在队成员数。 Sources: [src/components/ProjectMemberWorkbench.tsx:783-788]()
3. 表格列为：姓名 / 学号 / 学院·专业 / 学历层级 / 队内分工 / 专利 IP 权属 / 联系电话。 Sources: [src/components/ProjectMemberWorkbench.tsx:795-803]()
4. 姓名字段为 `flex` 布局，`roleInTeam` 含「队长」时额外渲染色块徽章。 Sources: [src/components/ProjectMemberWorkbench.tsx:808-813]()
5. 学历层级三色：博士研究生 紫、硕士研究生 蓝、其余 灰。 Sources: [src/components/ProjectMemberWorkbench.tsx:817-819]()
6. 专利/IP 权属：`isIpOwner` 为真显示「第一/共有发明人」，否则显示「成员」。 Sources: [src/components/ProjectMemberWorkbench.tsx:825-832]()
7. 表格底部显示校级秘书审核批注 `currentTeam.auditRemark`。 Sources: [src/components/ProjectMemberWorkbench.tsx:841-844]()

## 规则与边界（AI 开发硬约束）

- 本节点**只读**，没有编辑/新增成员的能力，也没有复核操作入口。
- 表格用原生 `<table>`，横向溢出时由外层 `overflow-x-auto` 承载；列宽不固定，改列需测窄屏。 Sources: [src/components/ProjectMemberWorkbench.tsx:792]()
- 「合规审查」的状态**只读自 mock 数据**，与 `page-screening` 的合规检测（`ComplianceInspection`）不是同一套数据，同页两个 tab 的口径可能不一致。
- `currentTeam` 的回退逻辑（`|| MOCK_PROJECT_TEAMS[0]`）会在项目无团队数据时**静默展示错误团队**，是已知隐患。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 支持编辑成员信息 | 表格 `:806-836` | 需新增编辑态与写回链路（当前无） |
| 接入真实团队数据 | `:65` | `MOCK_PROJECT_TEAMS`（`src/data/mockUsersAndTeams.ts`） |
| 与筛选侧合规检测打通 | `:783-788` | 需统一 `auditStatus` 与 `ComplianceInspection` 口径 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
