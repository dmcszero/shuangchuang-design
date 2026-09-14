---
id: nd-platform-mentors-pool
title: 平台导师池（admin 端）
page: page-mentors-pool
kind: panel
importance: high
sources:
  - src/components/PlatformMentorPoolManagement.tsx:41-1491
---

## 一句话定位

同一个侧栏入口在 **admin 超管端**渲染的另一套界面：平台级「中央总控」导师库，管的是全平台通用认证专家（院士 / 国赛评委组长 / 头部创投 / 首席科学家）与**跨校调度**开关——校端管「谁的专家」，这里管「全平台的专家」。

## 事实（每条强制可回溯）

1. **按角色分流渲染**：`App.tsx` 在 `activeTab === 'mentors_pool'` 时判断 `session?.role === 'system_admin'` → 渲染本组件，否则渲染校端 `MentorPoolManagement`。 Sources: [src/App.tsx:750-757]()
2. **本组件不接受任何 props**，自持 `mentors` state（初值 `MOCK_PLATFORM_MENTORS`）——与校端「App 层持有 + `onUpdateMentors` 写回」的模式不同，**平台端的改动不出组件、不影响校端**。 Sources: [src/components/PlatformMentorPoolManagement.tsx:41-42]()
3. 页头：「平台导师智库管理」+ 徽标「中央总控 · 全国权威国评库」+ 说明「集中管理全平台统一准入认证的两院院士战略导师、资深国赛评委组长、头部创投合伙人、全球500强企业首席科学家与冠军导师。面向全平台各入驻高校提供跨校巡诊调度与辅导质效监管。」；根容器 id `platform-mentor-pool-management`。 Sources: [src/components/PlatformMentorPoolManagement.tsx:487-510]()
4. 认证等级体系（校端没有）：`fellow` / `national_senior` / `leading_investor` / `industry_chief` / `legal_finance` 等，带 `levelLabel` 文案与等级徽标配色（`getCertificationBadgeClass`）；派单状态 `dispatchStatus` 三态：`open_all`（全平台开放）/ `restricted`（定向指派）/ `paused`（已暂停）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:138-145]() [src/components/PlatformMentorPoolManagement.tsx:441-486]()
5. 筛选：搜索 + 等级 + 赛道 + `dispatchStatus` + 视图模式（card/table）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:45-49]() [src/components/PlatformMentorPoolManagement.tsx:590-658]()
6. 写操作三个：准入/编辑（MODAL 1，`:947-1218`）、**跨校调度工单**（MODAL 3，`:1381-1491`，含派出大学/任务/形式（线下入校·线上联审）/日期/备注）、**切换调度状态**（`handleToggleDispatchStatus`：在 `open_all ↔ paused` 之间互切并 Toast）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:342-352]() [src/components/PlatformMentorPoolManagement.tsx:1381-1491]()
7. 「移出平台智库」用 `window.confirm` 二次确认（文案提示「下架后全平台各高校将无法发起跨校调度预约」）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:295-297]()
8. 导出为**真实 CSV 下载**（创建 Blob + `link.download='全平台国家级双创特聘导师智库大名册_{日期}.csv'`）。 Sources: [src/components/PlatformMentorPoolManagement.tsx:398-410]()
9. 全息档案弹窗（MODAL 2，`:1219-1380`）含「国家级特聘聘书快照」与「近期跨校调度记录」两个校端没有的板块。 Sources: [src/components/PlatformMentorPoolManagement.tsx:1219-1380]()

## 规则与边界（AI 开发硬约束）

- **本节点是「多端复用页」的核心证据**：同一 `page-mentors-pool` 在两个 persona（`p-school` / `p-admin`）下渲染**两套完全独立的实现**，数据结构、写回方式、认证体系都不同——下钻/修改时**必须指明是哪一端**。 Sources: [src/App.tsx:750-757]()
- 平台端数据**不跨端共享**：校端与平台端各有各的导师数组（`mockMentors` vs `mockPlatformMentors`）、各有各的编辑弹窗；「平台专家下派到某校」这类需求需要新建同步链路。
- `dispatchStatus` 是平台端独有的「可调度性」开关，与校端的 `availability`（可预约状态）**语义不同**，勿混用。
- 跨校调度工单（MODAL 3）提交后**无对应消费端**（没有页面接收这条调度单），属「有出口无落点」。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 平台专家同步到校端池 | `:42` | 需引入共享数据源与 App 层状态 |
| 调度工单接落点 | `:1381-1491` | 需在 `page-mentorship` / `page-supervision` 建接收侧 |
| 认证等级与校端角色对齐 | `:138-145` | 两套枚举需映射表 |
| 统一两端导出格式 | `:398-410` | 校端同名函数口径独立 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
