---
id: nd-mentorship-directory
title: 导师智库全览与筛选
page: page-mentorship
kind: list
importance: medium
sources:
  - src/components/MentorshipDispatch.tsx:282-356
---

## 一句话定位

全校 + 校外导师的名册视图：搜索框 + 六个能力标签把名册收窄，卡片展示资历、标签、当前带项负荷与可预约状态——调度时的「挑人底册」。

## 事实（每条强制可回溯）

1. 标题「全校及外部双创导师智库全览 ({mentors.length} 位专家)」——数量真实派生。 Sources: [src/components/MentorshipDispatch.tsx:284-289]()
2. 搜索框在姓名 / 机构 / 能力标签上做不区分大小写的子串匹配（`filteredMentors`）。 Sources: [src/components/MentorshipDispatch.tsx:79-86]() [src/components/MentorshipDispatch.tsx:291-302]()
3. 能力标签栏为**写死的 6 项**：全部领域(ALL) / 硬科技 / 财务 / 红旅 / 新材料 / 能工巧匠；筛选逻辑是 `expertiseTags.some(t => t.includes(tag))` 子串匹配。 Sources: [src/components/MentorshipDispatch.tsx:304-320]()
4. 卡片内容：头像、姓名 + 星级 `rating`、职称（截断）、`bio`（`line-clamp-2`）、`expertiseTags` chips、底行「当前辅导：`currentProjectsCount` / `maxCapacity` 项」与状态点（`availability === 'available'` → 绿「可预约」，否则「满载」）。 Sources: [src/components/MentorshipDispatch.tsx:322-352]()
5. 本栏**与上方「智能匹配」互不联动**：换项目不会改变本栏（本栏只吃 `mentorTagFilter` / `mentorSearch`）。 Sources: [src/components/MentorshipDispatch.tsx:79-86]()
6. 卡片上**没有任何动作按钮**（不能预约、不能查看详情、不能编辑）；预约只能在上方 Top 3 卡里做。 Sources: [src/components/MentorshipDispatch.tsx:322-352]()

## 规则与边界（AI 开发硬约束）

- **本栏是只读名册**：看到合适的导师无法直接预约（只能回上方匹配卡操作，且只有 Top 3 能约）——这是本页最明显的操作断点。
- 标签栏写死 6 项，与导师数据里的实际标签集合**可能不匹配**（`expertiseTags` 是自由文本数组）；新增标签玩法要么扩这 6 项，要么改成从数据动态汇总。
- 「满载」只影响状态点显示，**不影响任何可点性**（本栏无按钮；上方预约按钮也不检查）。
- 导师列表为空（筛选后）时**无空态文案**，只留空白网格。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 卡片加「预约」按钮 | `:322-352` | 复用 `handleBookMentor`（需把 slot 选择一并设计） |
| 标签栏动态化 | `:304-320` | 需从 `mentors` 汇总标签并去重 |
| 满载禁约 | `:322-352` + `:268-275` | 两处都要判断 `availability` |
| 增加空态 | `:322` | 纯 UI |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
