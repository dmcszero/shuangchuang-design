---
id: nd-screening-ranking
title: 综合梯队与金奖对标
page: page-screening
kind: table
importance: high
sources:
  - src/components/ScreeningHub.tsx:388-480
---

## 一句话定位

初筛的**排名视图**：一行一项目，列出排名、赛道、综合评分、梯队、金奖特征对标、AI 置信度与指派导师，并在行尾给出「详情 / 排期」两个动作——管理员处置项目的主工作面。

## 事实（每条强制可回溯）

1. 九列表头：排名 / 项目名称·赛道 / 学院·团队负责人 / 综合评分 / 梯队定级 / 金奖特征对标 / AI置信度 / 指派导师 / 操作。 Sources: [src/components/ScreeningHub.tsx:391-403]()
2. 排名列直接渲染 `#{project.rank}`（项目自带字段），**不按 `filteredProjects` 重排**——筛选后名次会跳号（如只剩第 3、7 名）。 Sources: [src/components/ScreeningHub.tsx:412-414]()
3. 综合评分为 `project.totalScore`（sky 色加粗），梯队徽标按 grade 分色（A 琥珀 / B 蓝 / C 灰 / D 玫红），与 `nd-screening-matrix` 同一套配色。 Sources: [src/components/ScreeningHub.tsx:428-446]()
4. 「金奖特征对标」渲染 `project.goldSimilarity%`（琥珀 mono），「AI置信度」渲染 `project.aiConfidence%`。 Sources: [src/components/ScreeningHub.tsx:448-458]()
5. 指派导师列：有 `assignedMentorName` 时取其**第一个「（」之前的部分**（如「赵元博（国赛资深专家）」→「赵元博」），否则显示斜体灰字「待调度」。 Sources: [src/components/ScreeningHub.tsx:459-466]()
6. 操作列两个按钮（`stopPropagation`）：「详情」→ `onSelectProject`（抽屉）；「排期」→ `onOpenAssignMentor(project)`——**该 prop 是可选的**，未传时整个按钮不渲染（App 传入的是 `handleOpenAssignMentor`，行为是关闭抽屉并切到 `mentorship` tab）。 Sources: [src/components/ScreeningHub.tsx:467-478]() [src/App.tsx:526-529]()
7. 整行点击 → `onSelectProject`。 Sources: [src/components/ScreeningHub.tsx:407-410]()

## 规则与边界（AI 开发硬约束）

- **「排期」按钮不携带项目上下文**：App 的 `handleOpenAssignMentor` 忽略入参，只做「关抽屉 + 切到导师调度 tab」，接收端不知道要排哪个项目。改造成真实排单时要先把载荷打通。 Sources: [src/App.tsx:526-529]()
- 排名列在筛选态下会跳号（见事实 2）——若要让排名跟随结果集，需改为按 `filteredProjects` 顺序重新编号（注意与 `page-cockpit` 的序号口径区分）。
- 导师名截断靠字符串切割（`split('（')[0]`），**对不含全角括号的名字无影响、对含半角括号的名字无效**——数据规范未定。
- 本视图无分页、无排序控件：项目多时只能靠筛选收窄。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 排期带项目载荷 | `:471-476` | `onOpenAssignMentor` 语义 + App 的 `handleOpenAssignMentor` + `page-mentorship` 接收端 |
| 排名随筛选重算 | `:412-414` | 需定义「筛选后排名」口径 |
| 增加排序 | `:388-480` | 与 `nd-screening-control` 的排序需求共用一套 state |
| 导出本表 | `:388-480` | 当前无导出入口（导出按钮在矩阵视图内） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-screening-ranking-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击排名表任一行，或行末「详情」按钮
  - 载荷：`ProjectItem`
  - 逻辑：行 onClick 与「详情」按钮均调 onSelectProject(project)。
  - 出处：`src/components/ScreeningHub.tsx:407-410`
  - 出处：`src/components/ScreeningHub.tsx:454-460`
- **`e-screening-ranking-2-mentorship`** → `page-mentorship`（导师智能调度）｜`navigate` · **implemented（已实现）**
  - 触发：点击排名表行末「排期」按钮
  - 逻辑：onClick={() => onOpenAssignMentor(project)} → App.handleOpenAssignMentor：**忽略入参**，仅 setIsDrawerOpen(false) + setActiveTab('mentorship')。
  - 出处：`src/components/ScreeningHub.tsx:464-476`
  - 出处：`src/App.tsx:526-529`
  - 备注：项目载荷在 App 层被丢弃——这是「排期」看起来生效但实际不带项目的原因（见 issue-cockpit-screening-nav-no-context）。
<!-- EDGES:END -->
