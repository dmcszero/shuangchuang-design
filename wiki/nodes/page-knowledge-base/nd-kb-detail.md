---
id: nd-kb-detail
title: 库内文件管理（二级视图）
page: page-knowledge-base
kind: panel
importance: high
sources:
  - src/components/KnowledgeBaseManagement.tsx:560-841
---

## 一句话定位

进入某个库后的二级视图：面包屑 + 库概况卡（启停/删除）+ 文件检索条 + 文档表（含「提炼知识要点」「RAG 检索命中」两列）+ 底部脱敏与引文声明——**知识库的「内容层」**。

## 事实（每条强制可回溯）

1. 面包屑：「返回知识库列表」按钮（`handleBackToKbList`：切回列表视图并滚回页顶）+ 路径「双创知识库总览 / {库名}」；右侧「上传新文件到此库」→ `setIsUploadFileModalOpen(true)`。 Sources: [src/components/KnowledgeBaseManagement.tsx:82-86]() [src/components/KnowledgeBaseManagement.tsx:564-589]()
2. 库概况卡：编码 + 分类徽标 + **运行状态徽标**（`● 运行中 (RAG正常调用)` / `○ 已停用 (暂停AI调用)`）+ 库名 + 描述；右侧「停用此库/立即启用」与「删除知识库」两个按钮（复用一级页同名 handler，带 `e.stopPropagation()` 的重载）。 Sources: [src/components/KnowledgeBaseManagement.tsx:591-638]()
3. **规格条四项**：AI 语义解析引擎（值写死「智能语义解析与特征索引引擎」）、入库文档总数（`currentKb.files.length`，真实）、提炼知识要点（`currentKb.chunkCount`，真实）、累计存储占用（`currentKb.totalSize`，真实）。 Sources: [src/components/KnowledgeBaseManagement.tsx:641-682]()
4. 文件检索条：关键词匹配 `name` / `summary` / `uploader` 三字段 + 格式下拉六档（pdf / docx / pptx / xlsx / md / 全部）+「刷新索引」按钮（**仅弹 Toast**「已刷新【库名】的最新智能知识库索引」）。 Sources: [src/components/KnowledgeBaseManagement.tsx:253-260]() [src/components/KnowledgeBaseManagement.tsx:687-723]()
5. **文档表六列**：文档名称/解析要点（名称可点 → 打开预览弹窗；下方为 `summary` 两行截断）、格式与大小、提炼知识要点（`chunks` 徽标）、**RAG 检索命中**（`hitCount` 次）、上传人/录入时间、操作（查看解析要点 / 删除）。 Sources: [src/components/KnowledgeBaseManagement.tsx:726-819]()
6. 空态完备：无文件或未匹配时渲染图标 + 提示 + **「上传第一份文件」按钮**（直接开上传弹窗）。 Sources: [src/components/KnowledgeBaseManagement.tsx:746-762]()
7. 删除文件 `handleDeleteFile`：带 `confirm` 二次确认，确认后从库内移除该文件，并**同步扣减** `fileCount` / `chunkCount`（减去该文件 `chunks`）/ `totalSize`（减去解析出的大小），`updatedAt` 置「刚刚」。 Sources: [src/components/KnowledgeBaseManagement.tsx:214-239]()
8. 底部声明条：左侧「知识库文件已自动进行脱敏处理，并在 AI 智能导师与备赛问答中提供准确的原文引文出处（Grounding Citations）」——**无脱敏实现、引文能力也无从验证**；右侧「本库共计 `{filteredFiles.length}` 份文件 / `{currentKb.chunkCount}` 个知识要点」（前者随筛选变化、后者全库口径，**两个数字口径不一致**）。 Sources: [src/components/KnowledgeBaseManagement.tsx:827-838]()

## 规则与边界（AI 开发硬约束）

- **文件增删与库规格联动是真实计算**：增删文件会实时更新 `fileCount` / `chunkCount` / `totalSize` / `updatedAt`，并回流到一级页的宏指标卡——这是本页最扎实的一层。
- 但**「解析出的 chunk 数」是随机数**（上传时 `Math.floor(60 + Math.random() * 150)`），因此「知识要点」总量本质上是演示数据（见 `nd-kb-upload`）。
- 底部两个数字口径不同（筛选后文件数 vs 全库要点数），读起来像一组但含义不同。
- 「刷新索引」是纯 Toast；「脱敏 / Grounding Citations」是文案承诺。
- 二级视图**不重置滚动位置以外的东西**：来回切换库不会丢首尾，但 `selectedKbId` 会保持最后一个进入的库。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 文件真实解析接后端 | `:726-819` | 需 `chunks` 由解析服务返回（去掉随机数） |
| 底部数字口径统一 | `:827-838` | 需明确是「筛选结果」还是「全库」 |
| 文档可预览原文 | `:775-780` | 需接文件服务（当前只有要点摘要） |
| 加批量删除/批量上传 | `:726-819` | 需选中集 state |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 3 条**

- **`e-kb-list-2-detail-navigate`** ← `nd-kb-list`（知识库列表卡与启停/删除）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击库卡标题，或卡片底部「进入文件管理 / 管理库内文件」
  - 载荷：`kbId（字符串）`
  - 逻辑：handleEnterKbFiles(kbId)：setSelectedKbId + 清空文件筛选 + setViewLevel('detail') + window.scrollTo(顶部平滑滚动)；二级视图由 currentKb 派生渲染。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:73-79`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:492-499`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:542-549`
- **`e-kb-create-2-detail-navigate`** ← `nd-kb-create`（新建知识库弹窗）｜`writeback` · **implemented（已实现）**
  - 触发：新建库弹窗提交「确认创建并管理文件」
  - 载荷：`KnowledgeBase{id:'kb-custom-*', code:'KB-*', category, audience, enabled:true, files:[], chunkCount:0, ...}`
  - 逻辑：handleCreateKnowledgeBase：setKnowledgeBases([newKb, ...]) → setSelectedKbId(newKb.id) → 关弹窗清表单 → Toast → setViewLevel('detail') **直接进入新库的文件管理页**。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:106-145`
  - 备注：新库为空（0 文件 / 0 要点）；一级页宏指标的「文档/要点」两卡在创建瞬间不变。
- **`e-kb-upload-2-detail-writeback`** ← `nd-kb-upload`（上传文件弹窗）｜`writeback` · **implemented（已实现）**
  - 触发：上传弹窗提交「确认上传并解析」
  - 载荷：`KnowledgeBaseFile{name, fileType, size, sizeBytes, uploader, chunks(随机 60~209), status:'indexed', summary, hitCount:0} + 所属库的 fileCount/chunkCount/totalSize/updatedAt 同步更新`
  - 逻辑：handleUploadFileSubmit：isUploading → setTimeout(600ms) → 构造文件 → setKnowledgeBases 就地更新所属库（files 前置、fileCount=新长度、chunkCount 累加、totalSize 相加、updatedAt='刚刚'）→ 关弹窗 → Toast「已成功上传并完成结构化知识解析（提取 N 条要点）」。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:163-212`
  - 备注：真实 `<input type="file">` 只读取文件名/扩展名/大小，**文件内容从不读取**；chunks 为随机数、sizeBytes 写死 2500000。

**出边 1 条**

- **`e-kb-detail-2-preview-embed`** → `nd-kb-preview`（文件解析要点预览）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击文档名，或行末「查看解析要点」
  - 载荷：`KnowledgeBaseFile（完整对象）`
  - 逻辑：setPreviewFile(file) → 渲染预览弹窗；头部三个数字（size / chunks / hitCount）与摘要取自该对象，但「核心知识要点」两条为写死示例。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:775-780`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:801-809`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:1085-1149`
<!-- EDGES:END -->
