---
id: nd-teams-card
title: 团队卡与成员名册
page: page-teams
kind: list
importance: high
sources:
  - src/components/TeamManagement.tsx:197-430
---

## 一句话定位

本页主体：每支团队一张可展开的卡——收起时看项目/队长/导师/规模与核验结论，展开后看 AI 诊断意见、三项合规检查与**逐人明细名册**（学段、分工、是否核心发明人、联系方式），并可下发整改催办或跳项目档案。

## 事实（每条强制可回溯）

1. 卡片由 `filteredTeams.map` 渲染，带稳定 id `team-card-{team.id}`；**点击卡片摘要区**切换 `expandedTeamId`（再点收起），初值为第一支团队展开。 Sources: [src/components/TeamManagement.tsx:198-212]() [src/components/TeamManagement.tsx:32]()
2. 摘要区：项目编号（mono 徽标）+ 梯队徽标（A 琥珀 / B 蓝 / 其他玫红）+ 赛道标签 + 学院 + 项目名 + 队长（姓名·学段·专业）+ 第一指导教师（姓名·职称）+ 团队规模。 Sources: [src/components/TeamManagement.tsx:214-252]()
3. 右侧核验结论徽标按 `auditStatus` 三态分色显字：「结构达标」（翡翠 + 勾）／「建议补齐商业专人」（琥珀 + 警告）／「一票否决拦截」（玫红 + 警告），并带旋转箭头指示展开态。 Sources: [src/components/TeamManagement.tsx:255-278]()
4. 展开后第一块是 **AI 诊断意见条**：标题「2026 评审专家/AI 团队架构诊断意见：」+ `team.auditRemark` 全文，底色随 `auditStatus` 三色变化。 Sources: [src/components/TeamManagement.tsx:285-300]()
5. **三项结构合规检查**（每项渲染「满足 / 不满足」两分支）：跨学科跨学院交叉（`crossCollege`）／商业与财务专人就位（`hasFinanceSpecialist`，缺失时文案「缺失 (需跨学院增补)」）／核心发明人入队合规（`ipOwnerEnrolled`，不满足时标「高危 (发明人未入队)」并染玫红）。 Sources: [src/components/TeamManagement.tsx:302-360]()
6. **成员明细表**（6 列）：姓名/学号（学号 mono）、学段与专业（学段徽标：博士紫 / 硕士蓝 / 本科绿）、所属学院、赛事实质分工（`division`，五类枚举）、专利/软著发明人（`isIpOwner` 为真时显示「核心发明人」徽标，否则「-」）、联系方式。 Sources: [src/components/TeamManagement.tsx:362-405]()
7. 表头右侧注「支持按 2026 规程审查学生身份真实性」（纯文案）。 Sources: [src/components/TeamManagement.tsx:365-368]()
8. 底部动作区：左侧显示指导教师与电话；右侧两个按钮——**「下发团队整改催办单」仅在 `auditStatus !== 'verified'` 时渲染**（→ `handleSendReminder`，仅弹 Toast）；**「查看项目全景档案」仅在 prop `onSelectProject` 存在时渲染**（→ `onSelectProject(team.projectId)`）。 Sources: [src/components/TeamManagement.tsx:407-428]()
9. `handleSendReminder(teamName, issue)` 的第二个参数 `issue` **在函数体内未被使用**（Toast 文案只含团队名）。 Sources: [src/components/TeamManagement.tsx:40-42]()

## 规则与边界（AI 开发硬约束）

- **催办是纯提示**（见事实 8/9）：不下发任何工单、不写任何状态；真正有「工单」概念的是 `page-supervision`（`SupervisionWorkOrder`），两者无连接。
- 「查看项目全景档案」是**可选能力**（依赖 `onSelectProject`），App 传入的是 `handleSelectProjectById`（按 id 找项目再开抽屉）——若 id 不存在则**静默无反应**。 Sources: [src/App.tsx:764-766]() [src/App.tsx:501-506]()
- 三项合规检查与 `auditStatus` **无约束关系**：`need_supplement` 的团队可以三项全绿，`verified` 的也可以缺财务专人（判据分离，改一处不会同步另一处）。
- 成员表依赖 `member.division` 的五类枚举与 `member.degree` 的三类枚举；新增枚举要先改 `TeamMemberItem` 类型（`src/data/mockUsersAndTeams.ts:19-31`）。
- 展开态是**单选**（`expandedTeamId` 单值），不能同时展开多支团队。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 催办接真实工单 | `:40-42` `:407-415` | 需接 `page-supervision` 的工单模型 + App 层回调 |
| 支持多卡同时展开 | `:32` | `expandedTeamId` 需改为 Set/数组 |
| 成员明细加编辑/增补 | `:362-405` | 需写接口（本页 `teams` 是本地 state，无上行 prop） |
| 三项检查接入统一判据 | `:302-360` | 需定义「合规判据」（与 `auditStatus` 的关系） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-teams-card-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：展开任一团队卡，点底部「查看项目全景档案」
  - 载荷：`projectId（字符串）`
  - 逻辑：onClick={() => onSelectProject(team.projectId)} → App.handleSelectProjectById：projects.find(p => p.id === projectId) → 命中则 handleSelectProject（开抽屉）；**未命中静默无反应**。按钮仅在 prop 存在时渲染。
  - 出处：`src/components/TeamManagement.tsx:416-425`
  - 出处：`src/App.tsx:775-778`
  - 出处：`src/App.tsx:501-506`
  - 备注：本页唯一真正的跨页出口；与 page-screening / page-cockpit 的项目卡走同一个全局抽屉。
- **`e-teams-card-2-workbench-team-reuse`** → `nd-workbench-team`（团队架构与合规审查）｜`reuse` · **implemented（已实现）**
  - 触发：（无触发，数据同源）
  - 逻辑：两侧读同一份 `MOCK_PROJECT_TEAMS`：本页 `useState(MOCK_PROJECT_TEAMS)`（TeamManagement.tsx:28），学生端工作台 `MOCK_PROJECT_TEAMS.find(t => t.projectId === project.id) || MOCK_PROJECT_TEAMS[0]`（ProjectMemberWorkbench.tsx:65）；共用 `auditStatus` / `auditRemark` / `members` / `crossCollege` 等字段。区别只在呈现：本页全校罗列可筛选，工作台按当前项目取单队。
  - 出处：`src/components/TeamManagement.tsx:24`
  - 出处：`src/components/TeamManagement.tsx:28`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:24`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:65`
  - 备注：全库第二处「跨页共享同一份数据」（第一处是 page-supervision ↔ page-workbench 的 workOrders 写回；本处为只读复用）。
<!-- EDGES:END -->
