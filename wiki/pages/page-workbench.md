---
id: page-workbench
title: 项目工作台
section: sec-growth
importance: high
view: my_project
component: src/components/ProjectMemberWorkbench.tsx
sources:
  - src/components/ProjectMemberWorkbench.tsx:1-991
related_pages: ["page-guidance", "page-supervision", "page-defense"]
nodes:
  - nd-workbench-hero
  - nd-workbench-todo
  - nd-workbench-wo
  - nd-workbench-diag-scores
  - nd-workbench-diag-gaps
  - nd-workbench-diag-questions
  - nd-workbench-team
  - nd-workbench-folder
---

## 一句话定位

学员端（team_member）的项目主界面：一个项目头部横幅 + 五个子 tab，覆盖「今天要改什么 → 找谁要的材料 → 离金奖差多少 → 团队合不合规 → 改完的版本留没留痕」这条完整的学生侧任务链。

## 事实（每条强制可回溯）

**一、挂载与壳层关系**

1. 由 `App.tsx` 在 `activeTab === 'my_project'` 时挂载，接收 `session` / `project` / `workOrders` / `onUpdateWorkOrder` / `onOpenRulesConfig` / `onExecuteTodo` 六个 props。 Sources: [src/App.tsx:690-699]() [src/components/ProjectMemberWorkbench.tsx:45-53]()
2. 本页**不在沉浸式布局白名单**（`coach` / `new_chat` / `guidance_workbench` / `asset_management`）内，因此页面自身可纵向滚动、有常规内边距。 Sources: [src/App.tsx:597]() [src/App.tsx:625-627]()
3. 根容器带稳定 id `project-member-workbench`。 Sources: [src/components/ProjectMemberWorkbench.tsx:154]()

**二、子导航（页面级结构，不单独下钻为节点）**

4. 五个子 tab 定义与顺序：`todos`（动态待办）/ `tasks`（专家辅导与督导工单）/ `diagnostic`（2026国赛AI对标体检与短板）/ `team`（团队架构与合规审查）/ `folder`（项目文件夹）。 Sources: [src/components/ProjectMemberWorkbench.tsx:67]()
5. 默认激活 `todos`。 Sources: [src/components/ProjectMemberWorkbench.tsx:67]()
6. tab 切换**只由本地 state `activeSubTab` 控制**：不写 URL、不读 query、不接受外部入参——因此**任何外部页面都无法直达某个子 tab**。 Sources: [src/components/ProjectMemberWorkbench.tsx:67]()

**三、数据入口**

7. `projectOrders` = 全局 `workOrders` 按当前项目 id 过滤。 Sources: [src/components/ProjectMemberWorkbench.tsx:64]()
8. `currentTeam` = `MOCK_PROJECT_TEAMS` 按项目 id 匹配，**匹配失败静默回退到第 0 项**。 Sources: [src/components/ProjectMemberWorkbench.tsx:65]()
9. 页面自身持有的本地 state 共 8 个：`activeSubTab` / `selectedOrder` / `aiTodos` / `todoFilter` / `submissionNotes` / `newBpVersion` / `newPptVersion` / `isSubmitting` / `submitSuccess`。 Sources: [src/components/ProjectMemberWorkbench.tsx:67-111]()

## 规则与边界（AI 开发硬约束）

- **本页是「事实的下沉终点」**：v1 里 30 条事实压在单个页面文档中；v2 已按可见交互单元拆到 8 个节点。**页面文档只保留页面级事实**，节点内事实不要重复写回这里。
- **本地 state 不可跨页共享**是本站最主要的结构性约束：`aiTodos`、`activeSubTab`、`selectedOrder` 全部困在组件内，App 层无法读写。任何「从别处控制本页」的需求都要先解决这一点。**两条 high 级缺口（工作台回写待办、断点自动生成待办）都是这一个根因**——待办池的可写性是本页两条出边共同的前置。
- **两个 tab 的数据口径不同源**：「团队架构」的合规状态读 `MOCK_PROJECT_TEAMS.auditStatus`，「诊断体检」的短板读 `ProjectItem.tier1Scores`/`logicGaps`，二者与 `page-screening` 的合规检测均不互通。
- 页面内所有 `alert()` 均为占位反馈（文件浏览、存入文件夹、提交成功），接真实链路时需整体替换。
- **口径（v0.4 硬约束 1，2026-09-14）**：「每个学生仅绑定一个项目」已拍板——demo 侧栏的项目切换 / 多项目查看**仅用于演示**，产品化后学生端只会看到自己的项目且无切换入口。本页（及全部学生端页面）因此**不建「项目切换」节点**，项目身份（`currentMemberProject`）只作展示与联动；改侧栏切换交互时按演示态处理，不据此新增产品能力。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增一个子 tab | `activeSubTab` 联合类型 `:67` + 按钮组 `:210-271` + 内容区 | 无外部影响，纯页内 |
| 支持外部直达某子 tab | `:67` | 需提升 `activeSubTab` 到 App 层或改为 URL 驱动 |
| 待办状态跨页可写 | `aiTodos` `:71` | 见边 `e-guidance-taskbar-2-workbench-todo-writeback` |
| 接入真实项目/工单数据 | `src/data/mockProjects.ts` / `src/data/mockMentors.ts` | 同时影响 `page-cockpit` / `page-supervision` |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-workbench-hero` | 项目识别头 | bar | 156-208 | → `modal-rules-config` |
| `nd-workbench-todo` | 动态待办 | panel | 274-435 | → `nd-guidance-taskbar`（×2 平行边） |
| `nd-workbench-wo` | 专家辅导与督导工单 | panel | 438-691 | → `page-supervision`（writeback） |
| `nd-workbench-diag-scores` | 一级指标得分卡 | panel | 696-719 | 无 |
| `nd-workbench-diag-gaps` | 逻辑断点与硬伤 | panel | 721-745 | → `nd-workbench-todo`（**intended·high**） |
| `nd-workbench-diag-questions` | 评委尖锐提问攻防演练 | panel | 747-768 | → `page-defense`（**undefined，去向待拍板**） |
| `nd-workbench-team` | 团队架构与合规审查 | table | 774-847 | 无 |
| `nd-workbench-folder` | 项目文件夹 | panel | 850-988 | → `nd-guidance-version-drawer`（intended） |

> 未下钻为节点的页面级结构：子导航切换条（210-271）。
>
> **体检区拆为 3 个节点的依据**：三块有各自独立的数据源（`tier1Scores` / `logicGaps` / `killerQuestions`）、独立的业务归宿（得分卡=展示，断点=走待办，提问=走演练），满足「至少被一条边连接」之外还需区分归属——原来当一块处理会把两条不同去向的链压成一条。

## 与 related_pages 的联动提示

- **→ `page-guidance`（全链路指导工作台）**：本页「动态待办」是全库唯一向工作台传业务载荷的发送方（见 `edges.json` 前两条）；工作台的任务上下文条是唯一接收方。改载荷必须两侧同步。
- **→ `page-supervision`（督导闭环中心）**：本页「专家辅导与督导工单」提交整改后写回全局 `workOrders`，导师侧可见。这是跨角色的真实闭环。
- **→ `page-defense`（模拟答辩训练）**：产品口径已定「评委提问不走动态待办体系」，但去向待拍板——我建议接答辩训练的**问答对抗阶段**当题库用（理由见边 `e-workbench-diag-questions-2-defense` 的 issue 字段）。**代码中当前无任何连接**：本页体检区无跳转入口，答辩页也不读 `killerQuestions`。
- **→ 本页内部的两条链**：「逻辑断点 →（生成）动态待办 →（去执行）全链路指导工作台」是产品口径明确定的完整链，第一跳未实现、第二跳已实现；「评委提问 → 演练」是另一条链，不走待办。
