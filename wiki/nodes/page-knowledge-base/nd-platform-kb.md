---
id: nd-platform-kb
title: 平台赛事知识库（admin 端）
page: page-knowledge-base
kind: panel
importance: high
sources:
  - src/components/PlatformKnowledgeBaseManagement.tsx:33-1115
---

## 一句话定位

同一侧栏入口在 **admin 超管端**渲染的另一套界面：平台级「中央总控」知识库，管的是全国统考规程、近五年国赛金奖全案、百位评委追问题库等**下发给全平台各校**的标准库——与校端库数据完全独立。

## 事实（每条强制可回溯）

1. **按角色分流渲染**：`App.tsx` 在 `activeTab === 'knowledge_base'` 时判断 `session?.role === 'system_admin'` → 渲染本组件，否则渲染校端 `KnowledgeBaseManagement`。 Sources: [src/App.tsx:761-766]()
2. **本组件不接受任何 props**（与校端一致），自持 `knowledgeBases` state（初值 `MOCK_PLATFORM_KNOWLEDGE_BASES`）——两端各自独立、互不影响。 Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:33-34]()
3. 页头：「平台赛事知识库管理」+ 徽标「中央总控 · 全平台通用」；副文明确**数据隔离关系**：「本模块数据独立于各高校本校私有智库，作为底层标准供给全平台」。根容器 id `platform-knowledge-base-module`。 Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:305]() [src/components/PlatformKnowledgeBaseManagement.tsx:321-335]()
4. 五张宏指标卡的**结构与校端一致、口径全换成「全网」**：平台赛事库总数（`totalBases`）/ 全网分发启用状态（`activeBases`）/ 官方权威标杆文档（`totalFiles`）/ 全国统一标准切片（`totalChunks`）/ 全网各校累计调阅（`totalHits`）——**全部真实派生**。 Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:266-271]() [src/components/PlatformKnowledgeBaseManagement.tsx:346-402]()
5. 实测当前 mock：**5 个平台库**（4 启用 + 1 停用）、**16 份文件**、**4,090 条切片**、**31,480 次命中**。 Sources: [src/data/mockPlatformKnowledgeBase.ts:1-302]()
6. 二级视图与校端同构（面包屑 → 库概况 → 规格条 → 文件检索 → 文档表），差异在文案与默认值：新建弹窗默认分类 `competition_rules`、默认受众「全平台各入驻高校与指导专家」、上传默认大小 `3.2 MB`。 Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:56-66]() [src/components/PlatformKnowledgeBaseManagement.tsx:577-814]()
7. 三个弹窗与校端一一对应：新建平台库（`:815-909`）、发布新文件（`:910-1040`）、**文件解析快照与向量切片预览**（`:1041-1115`）。 Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:815]() [src/components/PlatformKnowledgeBaseManagement.tsx:910]() [src/components/PlatformKnowledgeBaseManagement.tsx:1041]()
8. **分类枚举与校端完全相同**（同样是 `school_policy` / `competition_rules` / `gold_cases` / `expert_experience` / `opc_incubation` 五值）——两端共享分类体系，但数据、筛选、计数各自独立。 Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:246-256]() [src/data/mockPlatformKnowledgeBase.ts:1-302]()
9. 两端**都没有对外出口**（无 `onNavigateTab`、无跳转按钮）：平台库无法查看「哪些学校在用」，校端库也看不到平台库。 Sources: [src/App.tsx:761-766]()

## 规则与边界（AI 开发硬约束）

- **本节点是「多端复用页」的第二例**（第一例是 `page-mentors-pool`）：同一 page、同一 tab，按 `system_admin` 分流到两套独立实现；下钻/改造必须指明「端」。 Sources: [src/App.tsx:750-766]()
- **两端的分类枚举相同但数据隔离**：这意味着「平台标准库下发给某校」这类需求**没有链路**——平台端的库不会出现在校端列表里，反之亦然（见 issue `issue-kb-two-ends-not-synced`）。
- 平台端的写操作与校端同构（新建 / 上传 / 启停 / 删除），同样是**组件内 state、刷新即复原**；上传文件的 `chunks` 同为零随机数逻辑（平台端在 `handleUploadFileSubmit` 内同样用随机数生成切片数）。
- 副文「作为底层标准供给全平台」是**设计意图声明**，非现状描述——现状是两套孤立 mock。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 平台库下发给校端（订阅/引用） | `:34` | 需共享数据层 + App 状态 + 校端列表加「平台来源」标识 |
| 两端分类/字段统一 | `:246-256` | 与校端 `:241-250` 同源化（建议抽 `kbCategories` 常量） |
| 平台端查看各校使用情况 | `:346-402` | 「全网各校累计调阅」目前是 `hitCount` 求和（mock） |
| 对齐两端上传默认值 | `:62-66` | 校端 `:57-61` |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-platform-kb-2-school-kb-intended`** → `nd-kb-list`（知识库列表卡与启停/删除）｜`read` · **intended（设计有·未实现）**｜severity: medium
  - 触发：（设计意图）平台标准库应下发/供给各高校使用
  - 设计依据：平台端副文「本模块数据独立于各高校本校私有智库，作为底层标准供给全平台」src/components/PlatformKnowledgeBaseManagement.tsx:330-332；指标卡「面向全部入驻高校下发」:352
  - 期望行为：平台库作为底层标准对校端可见（订阅或引用），校端 AI 检索时可同时命中平台标准与本校私有库。
  - **卡点**：两端各自自持 state（`MOCK_PLATFORM_KNOWLEDGE_BASES` vs `MOCK_KNOWLEDGE_BASES`）、均无 props、无共享数据层与订阅机制；App 仅按 `session.role === 'system_admin'` 分流渲染，两者之间没有任何数据流动。
<!-- EDGES:END -->
