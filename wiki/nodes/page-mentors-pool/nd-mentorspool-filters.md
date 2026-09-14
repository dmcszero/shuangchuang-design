---
id: nd-mentorspool-filters
title: 五维筛选与双视图切换
page: page-mentors-pool
kind: form
importance: medium
sources:
  - src/components/MentorPoolManagement.tsx:605-729
---

## 一句话定位

导师库的检索台：关键词 + 四个下拉（类型 / 角色类别 / 可用状态）+ 一排擅长领域胶囊 + 卡片/表格视图切换——把几十位专家收窄成能看的清单。

## 事实（每条强制可回溯）

1. 页面持有 6 个筛选/视图 state：`searchQuery` / `typeFilter`(`all|internal|external`) / `roleFilter` / `expertiseFilter` / `availabilityFilter`(`all|available|busy|full`) / `viewMode`(`card|table`)。 Sources: [src/components/MentorPoolManagement.tsx:45-50]()
2. 筛选为**「与」关系**：`matchesSearch && matchesType && matchesRole && matchesExpertise && matchesAvailability`。 Sources: [src/components/MentorPoolManagement.tsx:455-465]()
3. 关键词搜索覆盖姓名、机构、职称、标签等字段（`matchesSearch` 派生）；类型/角色/可用性是精确匹配，擅长领域是**标签子串匹配**（`expertiseTags.some(t => t.includes(expertiseFilter))`）。 Sources: [src/components/MentorPoolManagement.tsx:455-465]()
4. 擅长领域是**胶囊快选**（`:684-729`），与下拉的 `expertiseFilter` 共用一个 state；标签值来自预设集合（与 `page-mentorship` 的 6 个标签口径相近但不保证一致）。 Sources: [src/components/MentorPoolManagement.tsx:684-729]()
5. 视图切换是 `card | table` 两态按钮组（默认 card，`:660-681`）。 Sources: [src/components/MentorPoolManagement.tsx:50]() [src/components/MentorPoolManagement.tsx:660-681]()
6. 空态独立处理：`filteredMentors.length === 0` 时渲染「未检索到匹配的导师」类提示（`:731-748`），不进入两种视图。 Sources: [src/components/MentorPoolManagement.tsx:731-748]()

## 规则与边界（AI 开发硬约束）

- 筛选**不重置视图模式**；两视图（卡片/表格）消费同一份 `filteredMentors`，因此改筛选逻辑对两者同时生效。
- `roleFilter` 的取值来自 `roleCategory` 字段，与「角色徽标」（`getRoleBadge` 类似逻辑）是同一数据源；新增角色类别要同时看筛选下拉与徽标配色。
- 搜索与筛选**无防抖、无延迟**，每次输入即重算（数据量小尚可，接后端时需改造）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 增加筛选维度 | `:45-50` `:455-465` | 控件 + 过滤条件 |
| 标签集合动态化 | `:684-729` | 需从 `mentors` 汇总 |
| 筛选态持久化 / URL 化 | `:45-50` | 需引入路由或 storage |
| 加排序（评分/负荷） | `:455-465` | 两视图共用 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
