---
id: nd-kb-overview
title: 校端页头与知识库宏指标
page: page-knowledge-base
kind: bar
importance: medium
sources:
  - src/components/KnowledgeBaseManagement.tsx:315-398
---

## 一句话定位

校端知识库一级视图的页头与规模盘：说明本库群面向「校内扶持政策 / 2026 规则 / 金奖案例 / 专家经验」，并用五张卡交代库数、启用数、文档数、知识要点数与调用频次——**五张卡全部真实派生**。

## 事实（每条强制可回溯）

1. 标题「学校双创知识库管理」+ 徽标「校内专属智库 (RAG底层)」；副文说明统一管理校内扶持政策、2026 官方规则、历届金奖案例与专家经验，并提示「点击任意知识库卡片可进入二级页面」。 Sources: [src/components/KnowledgeBaseManagement.tsx:319-329]()
2. 右上「新建专属知识库」按钮带稳定 id `btn-create-kb` → `setIsCreateKbModalOpen(true)`（打开 `nd-kb-create`）。 Sources: [src/components/KnowledgeBaseManagement.tsx:329-338]()
3. **五张宏指标卡全部为真实派生**（对 `knowledgeBases` 聚合）：`totalBases`（库数）/ `activeBases`（`enabled` 计数）/ `totalFiles`（各库 `files.length` 求和）/ `totalChunks`（各库 `chunkCount` 求和）/ `totalHits`（各文件 `hitCount` 求和）。 Sources: [src/components/KnowledgeBaseManagement.tsx:262-271]() [src/components/KnowledgeBaseManagement.tsx:341-397]()
4. 实测当前 mock：**5 个库**（4 启用 + 1 停用）、**17 份文件**、**3,332 条知识要点**、**11,382 次命中**；五张卡的副文案「涵盖 5 大核心赛事分类」「大模型 RAG 引擎实时挂载」「7×24h 备赛答疑与对标赋能」为**写死声明**。 Sources: [src/data/mockKnowledgeBase.ts:1-346]() [src/components/KnowledgeBaseManagement.tsx:346-396]()
5. 页面根容器带稳定 id `knowledge-base-module`；Toast 为右上角深色浮层（3.2 秒自动消失）。 Sources: [src/components/KnowledgeBaseManagement.tsx:301-309]()

## 规则与边界（AI 开发硬约束）

- 本节点与 `page-mentors-pool` 校端同属「指标真实」的一类页面——**数字来自组件内 state 的聚合，不写死**；增删库/文件后指标立即变化，是可演示的「活的」看板。
- 五张卡**不可点、不联动筛选**（纯展示）。
- 「RAG 引擎实时挂载」「7×24h」是文案承诺，本页无任何检索引擎实现（`chunkCount` / `hitCount` 都是 mock 字段）。
- 一级/二级视图共用同一个 Toast 与 `showToast`，是页面级唯一反馈通道。 Sources: [src/components/KnowledgeBaseManagement.tsx:64-67]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 指标卡加点击跳筛选 | `:341-397` | 需与 `categoryFilter` / `statusFilter` 联动 |
| 指标接真实检索统计 | `:266-271` | `hitCount` 字段需由真实检索埋点写入 |
| 页头加「导入知识库」 | `:329-338` | 当前只有「新建」 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
