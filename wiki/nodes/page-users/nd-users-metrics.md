---
id: nd-users-metrics
title: 账号规模指标卡
page: page-users
kind: panel
importance: medium
sources:
  - src/components/UserManagement.tsx:155-198
---

## 一句话定位

四张账号规模卡（全校注册用户 / 专家与导师智库 / 学院联络秘书 / 学生申报骨干）——**三张写死、一张半真半假**，是本页演示态的集中处。

## 事实（每条强制可回溯）

1. 卡一「全校注册用户」：数值 `users.length + 333`（**凭空 +333**，mock 实为 9 位用户，显示 342）+ 「正常活跃账号率 98.2%」（写死）。 Sources: [src/components/UserManagement.tsx:157-172]()
2. 卡二「专家与导师智库」：数值 **48 位**（写死）+ 「含18位校外投融资及国赛评委」（写死）——而 mock 中 `role === 'mentor'` 的用户只有 **2 位**。 Sources: [src/components/UserManagement.tsx:174-186]()
3. 卡三「学院联络秘书」：数值 **26 个学院**（写死）+ 「已实现全校二级学院全覆盖」；而 mock 中 `role === 'college_coordinator'` 只有 **2 位**、学院去重后只有 **6 个**。 Sources: [src/components/UserManagement.tsx:188-200]() [src/data/mockUsersAndTeams.ts:64-201]()
4. 卡四「学生项目申报骨干」：数值 **268 人**（写死）+ 「绑定 **82** 个正式申报项目」（写死，与驾驶舱/团队页的 82 同族）。 Sources: [src/components/UserManagement.tsx:202-210]()
5. 四卡均为纯展示，无点击、无筛选联动。 Sources: [src/components/UserManagement.tsx:155-198]()

## 规则与边界（AI 开发硬约束）

- **本页指标卡没有一张接真实数据**：`users.length + 333` 与三个字面量（48 / 26 / 268）。真实值可直接从 `users` 聚合（`filter(role).length`），无需新数据源（见 issue `issue-users-fake-metrics`）。
- 「学院联络秘书 26 个学院」把**账号数**与**学院数**混为一个数字，语义上也无法与 `collegesList`（6 个）对齐。
- mock 中存在两个相近学院名（「生命科学学院」与「生物工程与生命科学学院」）——统计学院数时需先确认口径（见 issue `issue-users-college-naming`）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 指标接真实聚合 | `:155-210` | 四处数值 + 三条副文案（98.2% / 18位 / 82 项目） |
| 统一学院口径 | `:188-200` | `mockUsersAndTeams.ts` 的 college 字段 |
| 卡可点击跳筛选 | `:155-210` | 需与 `roleFilter` 联动 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
