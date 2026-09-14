---
id: nd-teams-metrics
title: 团队资质指标卡
page: page-teams
kind: panel
importance: high
sources:
  - src/components/TeamManagement.tsx:98-161
---

## 一句话定位

四张团队资质指标卡（团队总数 / 跨学科交叉率 / 财务专人配置率 / 核心专利人入队率）——**数字全部由一个写死的「总数」推导**，是本页最需要警惕的一处。

## 事实（每条强制可回溯）

1. 四个派生值集中在组件顶部计算：`totalTeams = teams.length + 77`（**凭空 +77**）、`crossTeams = round(totalTeams × 0.683)`、`financeReady = round(totalTeams × 0.78)`、`ipReady = round(totalTeams × 0.942)`。 Sources: [src/components/TeamManagement.tsx:58-62]()
2. 卡一「申报团队总数」：显示 `totalTeams`（= 82）+ 「平均每队 5.2 位核心成员」（写死）。 Sources: [src/components/TeamManagement.tsx:100-112]()
3. 卡二「跨学科交叉团队」：显示 `68.3%`（**写在 JSX 里的字面量**）+ `(crossTeams 队)`（派生于写死总数）+ 「符合 2026 新工科/新文科交叉倡导」。 Sources: [src/components/TeamManagement.tsx:114-126]()
4. 卡三「财务/商业专人配置率」：显示 `78.0%`（字面量）+ `(financeReady 队)` + 「剩余 **18 队**亟待补齐经管财会成员」（写死文案；18 恰为 round(82×0.22)）。 Sources: [src/components/TeamManagement.tsx:128-141]()
5. 卡四「核心专利人入队率」：显示 `94.2%`（字面量）+ 冒号后的「合规」二字（与其它卡的「队/位」不一致）+ 红字「**1 项**存在成果权属高风险拦截」（写死，恰好与 mock 中唯一的 `warning` 团队数量一致）。 Sources: [src/components/TeamManagement.tsx:143-159]()
6. **`ipReady` 派生后从未被使用**（只声明，JSX 里直接写字面量 94.2%）——是一处死计算。 Sources: [src/components/TeamManagement.tsx:62]()
7. 实测 mock 数据为 **5 支团队**：`crossCollege` 4 真 1 假（真实 80%）、`hasFinanceSpecialist` 3 真 2 假（真实 60%）、`ipOwnerEnrolled` 4 真 1 假（真实 80%）、`auditStatus` 为 verified×3 / need_supplement×1 / warning×1。 Sources: [src/data/mockUsersAndTeams.ts:202-553]()

## 规则与边界（AI 开发硬约束）

- **四张卡没有一张来自真实数据**：总数是 `teams.length + 77`，三个比率是写死百分比（卡内显示的「N 队」由假总数推出），另有三处写死文案（5.2 人 / 18 队 / 1 项）。这是本页「演示态」最集中的区域（见 issue `issue-teams-fake-metrics`）。
- 若要接真实数据，正确做法是对 `teams` 直接聚合：`teams.filter(t => t.crossCollege).length` / `hasFinanceSpecialist` / `ipOwnerEnrolled` 的比例——**字段都已经在数据里**，无需新数据源。
- 「1 项存在成果权属高风险拦截」与 mock 中的 warning 团队数量**目前巧合一致**，一旦数据变化就会失真。
- 「平均每队 5.2 位核心成员」同理：可由 `Σmembers.length / teams.length` 真实计算。
- 卡四的「94.2% 合规」写法与其它三卡（`(N队)`）不统一，属显示格式问题。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 指标全部接真实聚合 | `:58-62` + `:100-159` | 四处 JSX 字面量一并替换（含 5.2 人 / 18 队 / 1 项） |
| 删除死计算 `ipReady` | `:62` | 纯清理 |
| 统一显示格式 | `:143-159` | 与其它三卡对齐 |
| 指标卡可点击跳筛选 | `:98-161` | 需与 `statusFilter` / `crossCollegeFilter` 联动 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
