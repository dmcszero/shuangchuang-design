---
id: page-mentors-pool
title: 导师池管理
section: sec-mentorship
importance: medium
view: mentors_pool
component: src/components/MentorPoolManagement.tsx
sources:
  - src/components/MentorPoolManagement.tsx:1-1741
  - src/components/PlatformMentorPoolManagement.tsx:1-1491
related_pages: ["page-mentorship", "page-supervision"]
nodes:
  - nd-mentorspool-header
  - nd-mentorspool-filters
  - nd-mentorspool-list
  - nd-mentorspool-edit
  - nd-mentorspool-detail
  - nd-platform-mentors-pool
---

## 一句话定位

「导师资源的档案库」，**一页两端**：校管端（`school_admin`）维护本校及外聘导师档案并写回全局 `mentors`；admin 超管端（`system_admin`）维护全平台认证专家与跨校调度开关——两端组件、数据结构、写回方式完全不同。

## 事实（每条强制可回溯）

**一、挂载与两套实现（本页最重要的结构事实）**

1. `App.tsx` 在 `activeTab === 'mentors_pool'` 时按角色分流：`system_admin` → `PlatformMentorPoolManagement`（无 props）；其余（校管）→ `MentorPoolManagement`（接 `mentors` / `onUpdateMentors` / `onNavigateTab?`）。 Sources: [src/App.tsx:750-757]()
2. 校端根容器 id `mentor-pool-management`；平台端 id `platform-mentor-pool-management`。 Sources: [src/components/MentorPoolManagement.tsx:483]() [src/components/PlatformMentorPoolManagement.tsx:487]()
3. **数据源不同**：校端吃 App 的 `mentors` 状态（`mockMentors` 初值）并**真实写回**；平台端自持 `MOCK_PLATFORM_MENTORS`，改动不出组件。 Sources: [src/App.tsx:69]() [src/components/MentorPoolManagement.tsx:33-36]() [src/components/PlatformMentorPoolManagement.tsx:41-42]()
4. **admin 端默认页就是本页**（`p-admin.defaultPage = page-mentors-pool`，源码依据 `App.tsx:61`），因此超管登录后第一屏是平台导师池。 Sources: [src/App.tsx:61]() [src/components/PlatformMentorPoolManagement.tsx:487]()
5. 本页两端都**不在沉浸式白名单**内：外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()

**二、校端（MentorPoolManagement）**

6. 结构四段：页头与宏指标（492-604）→ 五维筛选与双视图切换（605-729）→ 卡片/表格视图（730-1103）→ 两个弹窗（编辑 1104-1531 / 详情 1532-1741）。 Sources: [src/components/MentorPoolManagement.tsx:492]() [src/components/MentorPoolManagement.tsx:605]() [src/components/MentorPoolManagement.tsx:730]() [src/components/MentorPoolManagement.tsx:1104]() [src/components/MentorPoolManagement.tsx:1532]()
7. 页面 state 约 **30 个**：6 个筛选/视图态 + 6 个弹窗与复制/Toast 态 + 23 个表单态。 Sources: [src/components/MentorPoolManagement.tsx:45-83]()
8. 宏指标（6 张卡）**全部真实派生**：总数与校内外构成、国奖评审计数、累计金奖数、负荷容量与负荷率、可约导师数、平均评分。 Sources: [src/components/MentorPoolManagement.tsx:469-481]() [src/components/MentorPoolManagement.tsx:536-603]()
9. 写操作三个，全部经 `onUpdateMentors` 写回 App：新增（插到最前）、编辑（就地替换）、解聘（`confirm` 后移除）。 Sources: [src/components/MentorPoolManagement.tsx:187-275]()
10. 本页产出的字段**直接驱动 `page-mentorship` 的匹配算法**：`expertiseTags`（短板匹配 +8）、`preferredTracks`（赛道匹配 +10）、`maxCapacity` / `currentProjectsCount` / `availability`（负荷与可约状态）。 Sources: [src/components/MentorshipDispatch.tsx:49-77]()

**三、平台端（PlatformMentorPoolManagement）**

11. 独有维度：**认证等级**（`fellow` / `national_senior` / `leading_investor` / `industry_chief` / `legal_finance` …）与**调度状态** `dispatchStatus`（`open_all` / `restricted` / `paused`），后者可一键切换（`open_all ↔ paused`）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:138-145]() [src/components/PlatformMentorPoolManagement.tsx:342-352]()
12. 三个弹窗：准入/编辑（947-1218）、全息档案（1219-1380，含「国家级特聘聘书快照」与「近期跨校调度记录」）、**跨校调度工单**（1381-1491，含派出大学/任务/形式/日期）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:947]() [src/components/PlatformMentorPoolManagement.tsx:1219]() [src/components/PlatformMentorPoolManagement.tsx:1381]()
13. 导出为**真实 CSV 下载**（Blob + `link.download`）；移出智库用 `confirm` 二次确认。 Sources: [src/components/PlatformMentorPoolManagement.tsx:398-410]() [src/components/PlatformMentorPoolManagement.tsx:295-297]()

## 规则与边界（AI 开发硬约束）

- **改本页前先问「端」**：校端与平台端是两套组件、两套数据、两套枚举（`roleCategory` vs `certificationLevel`），一个改动不可能同时覆盖两端。
- **只有校端会写回全局**：校端的增删改会立刻反映到 `page-mentorship` 的推荐与名册；平台端的改动**不流向任何其他页面**（含不流向校端导师池）。
- 「跨校调度工单」（平台端 MODAL 3）目前**有出口无落点**——没有页面接收它；做闭环需在调度页/督导页建接收侧。
- 校端的「宏指标真实、列表可写」使它成为全库数据完整度最高的页面之一；平台端则是「自成一体的小世界」。
- 两端的「可用性」语义不同：校端 `availability`（available/busy/full，用于预约）vs 平台端 `dispatchStatus`（用于跨校调度），**勿混用字段名**。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 两端数据打通（平台→校） | 两端组件顶部 | 需引入共享数据源与 App 状态 |
| 调度工单接落点 | `PlatformMentorPoolManagement.tsx:1381-1491` | `page-mentorship` / `page-supervision` 需建接收 |
| 校端导师字段扩展 | `MentorPoolManagement.tsx:61-83` → `:1134-1508` → `:187-262` | 五处同步（state/初值/回填/提交/控件）+ 详情弹窗 |
| 统一两端角色/等级枚举 | 两端徽标函数 | 需映射表 |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-mentorspool-header` | 校端页头与智库宏指标 | bar | MentorPool 492-604 | → `page-mentorship`（进入调度排期） |
| `nd-mentorspool-filters` | 五维筛选与双视图切换 | form | MentorPool 605-729 | 无（驱动列表） |
| `nd-mentorspool-list` | 导师卡片/表格双视图 | list | MentorPool 730-1103 | → `shell-app`（解聘写回，writeback） |
| `nd-mentorspool-edit` | 聘任与编辑导师弹窗 | modal | MentorPool 1104-1531 | → `shell-app`（新增/编辑写回，writeback） |
| `nd-mentorspool-detail` | 导师履历详情弹窗 | modal | MentorPool 1532-1741 | → `nd-mentorspool-edit`（跳编辑） |
| `nd-platform-mentors-pool` | 平台导师池（admin 端） | panel | Platform 41-1491 | 无外部落点（自持数据） |

> 未下钻为节点的页面级结构：校端空态（731-748）、平台端空态（659-676）、两端各自的 Toast。
>
> **拆分依据**：校端五块各有独立状态域与出口；平台端作为**同一 page 的另一端视角**单列一个节点（其组件、数据与写回方式都与校端不同，不能合并表述）。**粒度自检**：6 个节点覆盖两个组件的关键面，符合 6~12 区间。

## 与 related_pages 的联动提示

- **→ `page-mentorship`（导师智能调度）**：校端页头「进入辅导调度排期」跳过去；校端导师数据**就是**调度页匹配算法的输入（改标签/赛道/容量会影响推荐排序）。调度页只能读，不能改导师档案——维护入口在本页。
- **→ `page-supervision`（督导闭环中心）**：导师端的工单处理与本页无直接数据联系（工单只带 `mentorName` 字符串），因此「谁在平台上、谁在带项目」目前无法在本页核对。
- **→ `page-screening` / `page-cockpit`**：项目侧的「待调度」状态（`assignedMentorName` 为空）与本页的导师池**无打通**——初筛页的「排期」按钮只跳调度页，不落到具体导师。
- **多端口径提示**：本页与 `page-knowledge-base` 同为「多端复用页」（校端 + admin 端各一套实现），下钻与后续改造都需按端区分。
