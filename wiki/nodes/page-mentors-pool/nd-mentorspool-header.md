---
id: nd-mentorspool-header
title: 校端页头与智库宏指标
page: page-mentors-pool
kind: bar
importance: medium
sources:
  - src/components/MentorPoolManagement.tsx:492-604
---

## 一句话定位

校端导师池的门面：标题 + 「高端专家库（8大专业领域）」徽标 + 一句职责说明，右侧三个动作（导出名册 / 进入调度排期 / 聘任新导师），下方六张**全部真实派生**的宏指标卡。

## 事实（每条强制可回溯）

1. 标题「全校及外部双创导师智库管理」+ 徽标「高端专家库 (8大专业领域)」+ 说明「统一维护校内学术博导、国奖评审专家、创投资本合伙人、产业高管及财税法务导师档案。支持导师信息添加编辑、联系方式一键联络、擅长领域标签管理与带教容量监控。」 Sources: [src/components/MentorPoolManagement.tsx:496-510]()
2. 三个动作：**导出智库名册**（`handleExportRoster`，CSV）｜**进入辅导调度排期**（仅当 `onNavigateTab` 存在时渲染，跳 `mentorship`）｜**聘任/添加新导师**（`handleOpenAddModal`）。 Sources: [src/components/MentorPoolManagement.tsx:513-533]()
3. 六张宏指标卡的数据**全部真实派生**（本页是全库指标真实度最高的页面之一）：智库总规模 `mentors.length`（附校内/外部人数）、国奖评审资深专家数（`roleCategory === 'national_judge'` 或 `honorTitle` 含「评委」）、累计培育国金奖数（`goldProjectsCoached` 求和）、当前负荷容量 `ΣcurrentProjectsCount / ΣmaxCapacity`（含负荷率百分比）、随时空闲可约导师数（`availability === 'available'`）、导师库综合好评率（`rating` 平均值，保留两位）。 Sources: [src/components/MentorPoolManagement.tsx:469-481]() [src/components/MentorPoolManagement.tsx:536-603]()
4. 页面根容器带稳定 id `mentor-pool-management`；Toast 为右上角深色浮层（3 秒左右自动消失）。 Sources: [src/components/MentorPoolManagement.tsx:483-490]()

## 规则与边界（AI 开发硬约束）

- **本页有真实写回**：`MentorPoolManagementProps` 含 `onUpdateMentors(mentors)`，新增/编辑/删除都经此写回 App 的 `mentors` 状态——因此 `page-mentorship` 的推荐与名册会立刻反映变化。 Sources: [src/components/MentorPoolManagement.tsx:33-36]() [src/App.tsx:711-713]()
- 「进入辅导调度排期」是**可选能力**（`onNavigateTab?`），未传则按钮消失。
- 宏指标是**全库口径**（不随筛选变化），筛选只作用于下方列表。 Sources: [src/components/MentorPoolManagement.tsx:469-481]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增指标卡 | `:536-603` | 派生计算在 `:469-481` |
| 导出名册改格式/加字段 | `handleExportRoster` | 与平台端同名函数（`:355-410`）口径各自独立 |
| 页头加权限控制 | `:513-533` | 需引入 session |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
