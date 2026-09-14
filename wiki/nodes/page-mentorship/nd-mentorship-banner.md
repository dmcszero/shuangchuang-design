---
id: nd-mentorship-banner
title: 页头与调度动作
page: page-mentorship
kind: bar
importance: medium
sources:
  - src/components/MentorshipDispatch.tsx:130-162
---

## 一句话定位

导师调度台的页头：一句「基于项目短板智能推荐专家 + 面向梯队一键下发任务」交代本页两个职能，右侧两个动作分别通往导师智库维护与新任务下发。

## 事实（每条强制可回溯）

1. 标题「常态化辅导与导师资源智能调度工作台」，副文「基于项目 2026 国赛短板指标（如财务模型薄弱、技术壁垒不清）智能推荐匹配专家，并支持面向梯队一键下发打磨任务」。 Sources: [src/components/MentorshipDispatch.tsx:132-140]()
2. 左侧动作「管理导师智库档案」（带奖杯图标）→ prop `onNavigateToMentorPool`；**该 prop 可选**，未传时按钮整体不渲染（App 传的是 `() => setActiveTab('mentors_pool')`）。 Sources: [src/components/MentorshipDispatch.tsx:143-153]() [src/App.tsx:714-716]()
3. 右侧主按钮「新建梯队批量打磨任务」（sky→blue 渐变）→ `setIsTaskModalOpen(true)`（打开 `nd-mentorship-taskmodal`）。 Sources: [src/components/MentorshipDispatch.tsx:155-161]()
4. 页头下方有一条**全局 Toast 区**：`bookingSuccessMsg` 非空时渲染绿色提示条（带关闭 ✕，4 秒后自动消失）。 Sources: [src/components/MentorshipDispatch.tsx:119-128]()

## 规则与边界（AI 开发硬约束）

- 页头**自身无状态**，两个按钮都只是转发（一个走 prop、一个开本地弹窗）。
- Toast 是**页面级反馈通道**，目前只有「一键预约」使用它；新增操作反馈时应复用同一条而非各写一套。
- `onNavigateToMentorPool` 未传即隐藏按钮——这是「可选能力降级」的写法，改 App 调用点前先确认 mentors_pool 是否可达。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增页头动作（如导入导师名单） | `:141-161` | 需新 prop 或新弹窗 |
| Toast 改为统一消息组件 | `:119-128` | 影响 `handleBookMentor` 与后续新增动作 |
| 改副文口径 | `:133-136` | 对外表述，需与 PRD 的 2.3 条目对齐 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-mentorship-banner-2-mentors-pool`** → `page-mentors-pool`（导师池管理）｜`navigate` · **implemented（已实现）**
  - 触发：点击页头「管理导师智库档案」
  - 逻辑：onClick={onNavigateToMentorPool} → App 层 () => setActiveTab('mentors_pool')（按钮仅在 prop 存在时渲染）。
  - 出处：`src/components/MentorshipDispatch.tsx:143-153`
  - 出处：`src/App.tsx:714-716`
- **`e-mentorship-banner-2-taskmodal`** → `nd-mentorship-taskmodal`（新建批次打磨任务弹窗）｜`navigate` · **implemented（已实现）**
  - 触发：点击页头「新建梯队批量打磨任务」
  - 逻辑：setIsTaskModalOpen(true)。
  - 出处：`src/components/MentorshipDispatch.tsx:155-161`
  - 出处：`src/components/MentorshipDispatch.tsx:408-419`
<!-- EDGES:END -->
