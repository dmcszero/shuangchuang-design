---
id: nd-mentorspool-list
title: 导师卡片/表格双视图
page: page-mentors-pool
kind: list
importance: high
sources:
  - src/components/MentorPoolManagement.tsx:730-1103
---

## 一句话定位

校端导师名册的两种呈现：卡片视图（档案感、看资历与负荷）与表格视图（密集对比、可直接拨号发信），每张卡/每行都通往「完整档案」「编辑」与「解聘」。

## 事实（每条强制可回溯）

1. 三分支渲染：`filteredMentors.length === 0` → 空态（图标 + 「未找到符合筛选条件的双创导师」+ **一键重置全部筛选**按钮）；否则按 `viewMode` 走卡片或表格。 Sources: [src/components/MentorPoolManagement.tsx:730-748]()
2. **卡片视图**（`:749-990`）内容：头像与基础信息、状态徽标、荣誉/聘任徽标、**联系方式条**（电话/邮箱/微信/办公地点，点击可复制——`copiedField` 状态）、擅长领域标签、带教容量与战绩（`currentProjectsCount/maxCapacity`、`goldProjectsCoached`、`rating`）；底部 CTA「查看完整档案」+ 编辑/解聘两个图标按钮。 Sources: [src/components/MentorPoolManagement.tsx:760-990]()
3. **表格视图**（`:991-1102`）七列：导师基础信息 / 归属与角色 / 联系方式 / 擅长辅导领域（**最多显示 3 个标签 + 「+N」**）/ 带教负荷与战绩（`n/max` 组、金奖数、评分）/ 预约状态徽标 / 管理操作（详情 / 编辑 / 解聘）。 Sources: [src/components/MentorPoolManagement.tsx:991-1095]()
4. 换行规则：卡片视图按网格排布；表格视图横向滚动（`overflow-x-auto`），联系方式列做截断。 Sources: [src/components/MentorPoolManagement.tsx:994]()
5. 「解聘」= `handleDeleteMentor(id, name, e)`：**先 `window.confirm` 二次确认**，确认后 `onUpdateMentors(remaining)` 写回 App（这是本页唯一带确认的破坏性操作）。 Sources: [src/components/MentorPoolManagement.tsx:266-275]()
6. 「查看完整档案」→ `handleViewDetail(mentor)`（打开 MODAL 2）；「编辑」→ `handleOpenEditModal(mentor, e)`（打开 MODAL 1，`e.stopPropagation()` 防止触发卡片点击）。 Sources: [src/components/MentorPoolManagement.tsx:945-978]()
7. 导师数量较多时**无分页、无虚拟滚动**——靠筛选收窄。 Sources: [src/components/MentorPoolManagement.tsx:991-1102]()

## 规则与边界（AI 开发硬约束）

- 两视图**消费同一份 `filteredMentors`**，改数据字段要同时核对两处渲染（卡片的信息更全，表格是精简版）。
- 删除是**真删除**（从 `mentors` 数组移除并写回 App），没有软删/归档；而 `page-mentorship` 的推荐与名册会立即少掉这位导师。
- 「解聘」在表格里是文字按钮、卡片里是图标按钮，两者调用同一 handler；确认文案由 handler 内的 `confirm()` 提供。
- 联系方式复制（`copiedField`）只影响一个文案态，无系统剪贴板 API 之外的副作用。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 改字段展示 | `:760-1095` | 卡片与表格两处 |
| 加软删除/停聘 | `:266-275` | 需 `MentorExpert` 加状态字段（平台端已有 `dispatchStatus` 可参考） |
| 加排序/分页 | `:991-1102` | 建议与筛选共用一套 state |
| 批量操作 | `:991-1102` | 需引入选中集 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
