---
id: nd-mentorspool-edit
title: 聘任与编辑导师弹窗
page: page-mentors-pool
kind: modal
importance: high
sources:
  - src/components/MentorPoolManagement.tsx:1104-1531
---

## 一句话定位

本页的核心写入口：一个五段式大表单（基础身份 / 联系方式 / 擅长领域 / 意向赛道与容量 / 个人简介），既能聘任新导师也能改现有档案——**23 个表单 state 全在这一个弹窗里**。

## 事实（每条强制可回溯）

1. 由 `isEditModalOpen` 控制，`currentEditingMentor` 决定是「编辑」还是「聘任/录入」（标题与图标随之切换）。 Sources: [src/components/MentorPoolManagement.tsx:53-55]() [src/components/MentorPoolManagement.tsx:1110-1120]()
2. **五段式表单**（`:1132-1508`）：① 基础身份与头像（含头像选择）② 联系方式（电话/邮箱/微信/办公地点）③ 擅长领域（已选标签列表 + 预设标签快加 + 自定义标签输入）④ 意向赛道与容量（赛道多选、maxCapacity、当前项目数、评分、辅导次数、金奖数、可用状态、可用时段）⑤ 个人简介。 Sources: [src/components/MentorPoolManagement.tsx:1134-1508]()
3. 表单初值：新增时为硬编码默认（类型 `external`、角色 `national_judge`、聘任期「2024-2026年特聘」、容量 5、评分 4.9、辅导 30 次、金奖 5 项、可用、时段「周二 14:00-17:00 (线上会议), 周四 14:00-16:00 (双创楼路演厅)」）；编辑时用 `handleOpenEditModal` 回填现有值。 Sources: [src/components/MentorPoolManagement.tsx:61-83]() [src/components/MentorPoolManagement.tsx:278-295]()
4. 提交 `handleSaveMentorForm`：编辑分支**就地替换数组元素**后 `onUpdateMentors(newMentors)` + Toast「导师档案已更新」；新增分支构造新 `MentorExpert`（id 用时间戳）并 `onUpdateMentors([newMentor, ...mentors])` 插到最前。 Sources: [src/components/MentorPoolManagement.tsx:187-230]() [src/components/MentorPoolManagement.tsx:231-262]()
5. 自定义标签：输入框回车/点按钮添加（`handleAddCustomTag`），重复会被去重；预设标签快加是若干写死的常见领域。 Sources: [src/components/MentorPoolManagement.tsx:366-380]() [src/components/MentorPoolManagement.tsx:1349-1392]()
6. 意向赛道用复选框（`TrackType[]`，默认 `['higher_education_creative']`）——**该字段正是 `page-mentorship` 匹配算法 `preferredTracks` 加分的依据**，改这里会直接影响推荐排序。 Sources: [src/components/MentorPoolManagement.tsx:75]() [src/components/MentorshipDispatch.tsx:54-57]()
7. 提交前的必填校验仅依赖表单控件的原生约束（姓名等关键字段需有值）；无深度校验（如容量与当前项目数的关系）。 Sources: [src/components/MentorPoolManagement.tsx:187-230]()

## 规则与边界（AI 开发硬约束）

- **本弹窗是 `page-mentorship` 匹配算法的数据源**：`expertiseTags`（短板匹配 +8）、`preferredTracks`（赛道匹配 +10）、`maxCapacity`/`availability`（负荷与可约状态）都从这里的表单产出。改字段名或语义会**静默改变推荐结果**。
- 新增导师会**插到列表最前**，且立即出现在 `page-mentorship` 的推荐与名册中（同一份 App state）。
- 编辑时**不校验新项目数与容量的关系**，可以造出「当前 9/5 超额」的数据；平台端的容量/负荷口径与校端类似，但各自独立。
- 表单 state 数量大（23 个），改字段要同步：state 声明 → 初值 → 回填 → 提交构造 → 弹窗控件，五处齐全才算改完。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增字段（如荣誉证书附件） | `:61-83`（state）→ `:1134-1508`（控件）→ `:187-262`（提交） | `MentorExpert` 类型 + 详情弹窗展示 |
| 表单校验加强 | `:187-230` | 需错误提示 UI |
| 标签库与 `page-mentorship` 对齐 | `:1349-1392` | 两页标签口径 |
| 导师类型/角色枚举扩展 | `:65-66` | 筛选下拉 + 徽标配色 + 类型定义 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
