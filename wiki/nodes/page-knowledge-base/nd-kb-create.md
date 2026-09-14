---
id: nd-kb-create
title: 新建知识库弹窗
page: page-knowledge-base
kind: modal
importance: medium
sources:
  - src/components/KnowledgeBaseManagement.tsx:842-946
---

## 一句话定位

校端建库入口：填名称、选业务分类、写受众与职能简介，确认后新库直接以「运行中」状态创建并**自动进入该库的文件管理页**。

## 事实（每条强制可回溯）

1. 由 `isCreateKbModalOpen` 控制；表单四个 state：`newKbName`（必填）/ `newKbCategory`（初值 `school_policy`）/ `newKbAudience`（初值「全校参赛团队与指导教师」）/ `newKbDescription`。 Sources: [src/components/KnowledgeBaseManagement.tsx:45]() [src/components/KnowledgeBaseManagement.tsx:51-54]()
2. 分类下拉五档与 `KnowledgeBase['category']` 五值一一对应，且**每档带职能括注**（校内专属智库(扶持与报销) / 2026大赛规程(规则与指标) / 历史金奖案例(标杆BP与PPT) / 专家经验智库(追问与失分) / OPC孵化转化(投融资与落地)）。 Sources: [src/components/KnowledgeBaseManagement.tsx:891-899]()
3. 必填项只有**库名称**（原生 `required`）；受众与简介可空，简介为空时兜底「本校自主配置的特色双创与赛事知识库，支撑专属RAG语义索引。」 Sources: [src/components/KnowledgeBaseManagement.tsx:865-873]() [src/components/KnowledgeBaseManagement.tsx:123]()
4. 提交 `handleCreateKnowledgeBase` 构造新库：`id` 用时间戳后 4 位（`kb-custom-{4位}`）、`code` 用 `KB-{4位}`、`enabled: true`、`fileCount: 0` / `chunkCount: 0` / `totalSize: '0.0 MB'` / `files: []`、`embeddingModel` 写死「智能语义解析与特征索引引擎」、`status: 'ready'`、`updatedAt` 取当前时间。 Sources: [src/components/KnowledgeBaseManagement.tsx:106-145]()
5. 创建后：`setKnowledgeBases([newKb, ...])`（插到最前）→ `setSelectedKbId(newKb.id)` → 关弹窗 → **清空名称与简介（分类与受众保留）** → Toast「成功创建专属知识库【X】！已直接进入该库文件管理。」→ **`setViewLevel('detail')` 直接跳进该库**。 Sources: [src/components/KnowledgeBaseManagement.tsx:134-145]()
6. 弹窗内有一段「默认配置说明」：文案称「新建后知识库默认处于"运行中"状态，自动完成深度语义解析与核心要点结构化归档」——新库实际是**空库**（0 文件 / 0 要点），前半句为真、后半句无实现。 Sources: [src/components/KnowledgeBaseManagement.tsx:927-936]()

## 规则与边界（AI 开发硬约束）

- 建库后**立刻进入空库的文件管理页**（事实 5）——这是有意设计（把人带到下一步），但也意味着新建后要退回一级页才能看到新卡。
- 新库**无编辑入口**（与 `nd-kb-list` 的规则一致）：名字/分类/受众写错只能删了重建。
- 分类的「职能括注」是产品口径文案，与 `Nd-kb-list` 卡片徽标、筛选下拉的文案**三处各自独立**——改一处要三处同步。
- 新库计数为 0，因此建库瞬间一级页的「已解析沉淀文档 / 结构化知识要点」两卡数字不变（正确行为）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 建库后停在列表页（可配置） | `:144` | 改 `setViewLevel` 行为 |
| 增加建库模板/预置文件 | `:106-145` | 需 `files` 初始化数据 |
| 分类括注统一化 | `:891-899` | 与筛选下拉（`:419-427`）、徽标映射（`:283-297`）对齐 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-kb-create-2-detail-navigate`** → `nd-kb-detail`（库内文件管理（二级视图））｜`writeback` · **implemented（已实现）**
  - 触发：新建库弹窗提交「确认创建并管理文件」
  - 载荷：`KnowledgeBase{id:'kb-custom-*', code:'KB-*', category, audience, enabled:true, files:[], chunkCount:0, ...}`
  - 逻辑：handleCreateKnowledgeBase：setKnowledgeBases([newKb, ...]) → setSelectedKbId(newKb.id) → 关弹窗清表单 → Toast → setViewLevel('detail') **直接进入新库的文件管理页**。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:106-145`
  - 备注：新库为空（0 文件 / 0 要点）；一级页宏指标的「文档/要点」两卡在创建瞬间不变。
<!-- EDGES:END -->
