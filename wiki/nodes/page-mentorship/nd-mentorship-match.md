---
id: nd-mentorship-match
title: 智能短板定向匹配与预约
page: page-mentorship
kind: panel
importance: high
sources:
  - src/components/MentorshipDispatch.tsx:167-280
---

## 一句话定位

本页的核心工作面：选一个项目 → 看它的 AI 待补强标签 → 得到 Top 3 推荐专家（附推荐理由与匹配度%）→ 一键预约排期——**全库少见的真实匹配算法落地处**。

## 事实（每条强制可回溯）

1. 项目选择是一个原生 `<select>`，选项文本为 `[{grade}级·{totalScore}分] {name}`，覆盖全部 `projects`（**不受任何筛选**）；初值 `projects[0]?.id`。 Sources: [src/components/MentorshipDispatch.tsx:34]() [src/components/MentorshipDispatch.tsx:180-194]()
2. 当前项目由 `projects.find(id) || projects[0]` 派生，**找不到时静默回退第一条**。 Sources: [src/components/MentorshipDispatch.tsx:46]()
3. 项目画像卡显示：项目名 + 「当前对标得分：`{totalScore}` 分 **(A级金奖潜力)**」+ 「AI 识别待补强标签」chips（来自 `weaknessLabels`）。 Sources: [src/components/MentorshipDispatch.tsx:196-216]()
4. **推荐算法是真实计算**（本页最特别处）：`recommendedMentors` = 全员起始 80 分，命中规则加分——① 导师 `preferredTracks` 含项目 `track` → **+10** 并记理由「深耕【`trackLabel`】赛道评审」；② 项目 `weaknessLabels` 含「财务」或「商业」且导师 `expertiseTags` 含「财务/商业/投资」→ **+8**，理由「精准匹配项目薄弱点：【商业模式与财务测算】」；③ 项目 `groupLabel` 含「新工科」或「新医科」且导师 tags 含「硬科技/新工科/新医科」→ **+7**，理由「具备深厚学术研发与产业转化双重视角」；最后 `Math.min(score, 99)` 并**按分降序排序**。 Sources: [src/components/MentorshipDispatch.tsx:49-77]()
6. 无任何规则命中时给默认理由「常态化备赛综合指导专家」。 Sources: [src/components/MentorshipDispatch.tsx:74]()
7. 只渲染前 3 名（`slice(0, 3)`）；每张卡显示头像、姓名、评分星级 `rating`、类型（`external` → 校外资深评审 / 否则 校内双创导师）、职称与机构、推荐理由 chips、匹配度%、已指导金奖数、以及「一键预约排期」按钮。 Sources: [src/components/MentorshipDispatch.tsx:222-279]()
8. 预约用**该导师的第一个可用时段**（`mentor.availableTimeSlots[0] || '本周专家一对一辅导'`），无时段选择 UI。 Sources: [src/components/MentorshipDispatch.tsx:268-275]()
9. `handleBookMentor` 只做一件事：设 Toast 文案「已成功为【项目名】预约【导师名】老师：{时段}。**AI 辅导工单已同步创建！**」并在 4 秒后清空——**没有任何工单被创建**（不调 `onAddNewWorkOrder`，本页也没这个 prop）。 Sources: [src/components/MentorshipDispatch.tsx:88-91]()

## 规则与边界（AI 开发硬约束）

- **推荐算法只依赖三个字段**：`mentor.preferredTracks` / `mentor.expertiseTags` / `project.track`、`weaknessLabels`、`groupLabel`。改标签体系（如 `weaknessLabels` 的文案）会**静默改变推荐结果**（因为用的是 `includes` 子串匹配，不是枚举比对）。
- 匹配度上限被夹在 **99**（不可能出现 100%）；起始 80 意味着**没有任何命中的导师也显示 80%**——「匹配度」的最小值并不低，容易被误读为高匹配。
- 「A级金奖潜力」文案写死，**不读 `project.grade`**：选到 B/C/D 级项目时仍显示 A 级字样。
- 预约是**纯 Toast 模拟**（见事实 9）：文案承诺创建工单，代码没有；要做真链路，需先给本页加 `onAddNewWorkOrder` prop（App 已有 `handleAddNewWorkOrder`，仅传给了督导页）。
- 预约按钮**不检查导师满载状态**（`availability === 'full'` 的导师同样可点，见 `nd-mentorship-directory` 事实）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 预约真实创建工单 | `:88-91` | 需新增 prop + App 串 `handleAddNewWorkOrder`（App :520-522） |
| 预约支持选时段 | `:268-275` | 需弹层或下拉（数据已有 `availableTimeSlots`） |
| 匹配算法加规则/改权重 | `:49-77` | 影响推荐排序；建议把规则抽为配置 |
| 「A级金奖潜力」按 grade 显示 | `:203-205` | 纯改文案逻辑 |
| 按项目筛选收窄选项 | `:180-194` | 需引入筛选（当前全量列出） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-mentorship-book-2-workbench-intended`** → `page-workbench`（项目工作台）｜`writeback` · **intended（设计有·未实现）**｜severity: high
  - 触发：点击推荐专家卡「一键预约排期」
  - 设计依据：预约成功文案「已成功为【项目】预约【导师】老师：{时段}。**AI 辅导工单已同步创建！**」src/components/MentorshipDispatch.tsx:89
  - 期望行为：预约后应为该导师与该项目的辅导创建一条工单（`SupervisionWorkOrder`），使 `page-supervision` 能看到待处理工单、`page-workbench` 能看到导师派发任务。
  - **卡点**：handleBookMentor 只 setBookingSuccessMsg + 4 秒后清空；本页没有 onAddNewWorkOrder prop（App 有 handleAddNewWorkOrder 但只传给了 page-supervision），也未传入导师/项目关联字段。
<!-- EDGES:END -->
