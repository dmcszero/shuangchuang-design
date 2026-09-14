---
id: nd-mentorspool-detail
title: 导师履历详情弹窗
page: page-mentors-pool
kind: modal
importance: medium
sources:
  - src/components/MentorPoolManagement.tsx:1532-1741
---

## 一句话定位

点「完整档案」后展开的导师履历：头像与角色标识、荣誉/聘期横幅、可一键复制的即时联络渠道、简介与成就、领域标签、可用时段与战绩指标——「看人」的最后一屏。

## 事实（每条强制可回溯）

1. 由 `isDetailModalOpen && currentDetailMentor` 控制（两者都要满足才渲染）。 Sources: [src/components/MentorPoolManagement.tsx:54]() [src/components/MentorPoolManagement.tsx:1534]()
2. 头部：头像（`h-16 w-16` 圆角带白边）、姓名、角色类别徽标（`getRoleBadgeStyle` + `getRoleCategoryLabel`）、归属徽标（校内学者博导 / 外部特聘专家）、职称与机构；右上两个按钮——**编辑**（关闭详情并打开编辑弹窗，把当前导师带过去）与关闭。 Sources: [src/components/MentorPoolManagement.tsx:1537-1578]()
3. 荣誉横幅：`honorTitle`（缺省「全国大赛特聘指导专家」）+ `appointedYear`（缺省「常任特聘」）+ 可预约状态徽标。 Sources: [src/components/MentorPoolManagement.tsx:1582-1592]()
4. 「即时联络渠道」卡：电话/邮箱/微信/办公地点逐项展示，每项带**一键复制**按钮（写入 `copiedField` 并短暂显示已复制）。 Sources: [src/components/MentorPoolManagement.tsx:1593-1656]()
5. 下方依次：简介与成就（`bio`）、擅长标签（`expertiseTags` 全量）、可用时段（`availableTimeSlots`）、战绩指标（`:1697-1712`）。 Sources: [src/components/MentorPoolManagement.tsx:1658-1712]()
6. 弹窗底部为页脚操作区（`:1714-1741`）。 Sources: [src/components/MentorPoolManagement.tsx:1714-1741]()

## 规则与边界（AI 开发硬约束）

- 详情弹窗**只读**（除「编辑」入口的跳转）；所有修改都回到编辑弹窗，不要在详情里加就地编辑。
- 「编辑」跳转是**关闭详情 + 打开编辑**两个 state 联动，且 `handleOpenEditModal(mentor)` 不带事件参数——改 handler 签名时要注意详情页调用点与列表调用点（后者传 `e`）的差异。
- 可用时段是**自由文本**（表单里是一个字符串输入框，编辑弹窗的 `formTimeSlots` 也是整串），详情页展示时不做拆分——按时间粒度做筛选/排期前需先结构化。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 详情加任职历史/辅导项目列表 | `:1532-1741` | 需数据字段（当前无） |
| 可用时段结构化 | `:1681-1696` | 编辑弹窗 `formTimeSlots` + `page-mentorship` 的预约取用 |
| 一键拨号/发信 | `:1593-1656` | 当前仅复制文本 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
