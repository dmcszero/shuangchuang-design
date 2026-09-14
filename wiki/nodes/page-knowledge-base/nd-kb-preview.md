---
id: nd-kb-preview
title: 文件解析要点预览
page: page-knowledge-base
kind: modal
importance: medium
sources:
  - src/components/KnowledgeBaseManagement.tsx:1085-1149
---

## 一句话定位

点文档名或「查看解析要点」后弹出的解读卡：上半是 AI 摘要与元信息，下半是「核心知识要点与结构化提取示例」——**下半的要点内容是写死的示例，与所选文件无关**。

## 事实（每条强制可回溯）

1. 由 `previewFile`（`KnowledgeBaseFile | null`）控制；文件表格的名称点击与「查看解析要点」按钮都设该 state。 Sources: [src/components/KnowledgeBaseManagement.tsx:47]() [src/components/KnowledgeBaseManagement.tsx:775-780]() [src/components/KnowledgeBaseManagement.tsx:801-809]()
2. 头部：按 `fileType` 取图标 + 文件名（截断）+ 元信息行「大小：`{size}` · 核心知识要点：`{chunks}` 条 · 备赛检索命中：`{hitCount}` 次」——**三个数字都是真实字段**。 Sources: [src/components/KnowledgeBaseManagement.tsx:1088-1105]()
3. 「AI 智能摘要与内容引要」块渲染 `previewFile.summary`（真实字段，但可能是上传时的兜底文案）+ 上传人与入库时间（真实字段）。 Sources: [src/components/KnowledgeBaseManagement.tsx:1109-1123]()
4. **「核心知识要点与结构化提取示例」块是写死的两条**（`知识要点 #001 · 匹配度 94.2% · 字数 380 字` 与 `知识要点 #002 · 匹配度 89.5% · 字数 412 字`，正文为校内扶持政策与网评专家视角的示例段落）——**与 `previewFile` 无任何关联**，任何文件打开都看到同样两条。 Sources: [src/components/KnowledgeBaseManagement.tsx:1124-1149]()
5. 弹窗内可滚动（`max-h-[75vh] overflow-y-auto`），关闭方式是右上 ✕（无遮罩点击/ESC 关闭）。 Sources: [src/components/KnowledgeBaseManagement.tsx:1112]() [src/components/KnowledgeBaseManagement.tsx:1101-1107]()

## 规则与边界（AI 开发硬约束）

- **本弹窗是「元信息真实 + 内容示例」的混合体**：头部三个数字与摘要来自真实字段，要点列表则是固定示例——对外演示时容易被当成真实解析结果（见 issue `issue-kb-preview-hardcoded-chunks`）。
- 「匹配度」这一概念在全库**只出现在这里**（写死 94.2% / 89.5%），既不是 RAG 评分字段也无来源。
- 要点正文内容（「1:1 配套培育孵化资金」「网评专家重点审视技术壁垒」）是**校内政策语料**，当打开的是平台库或其他分类的文件时仍然显示同样内容——分类与内容不匹配。
- 弹窗只读，无「复制要点」「跳转原文」等动作。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 要点列表接真实数据 | `:1124-1149` | `KnowledgeBaseFile` 需加 `chunks[]` 或 `excerpts[]` 字段 |
| 去掉写死匹配度 | `:1130` `:1139` | 需真实相似度来源 |
| 加「复制/跳原文」 | `:1085-1149` | 纯 UI |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-kb-detail-2-preview-embed`** ← `nd-kb-detail`（库内文件管理（二级视图））｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击文档名，或行末「查看解析要点」
  - 载荷：`KnowledgeBaseFile（完整对象）`
  - 逻辑：setPreviewFile(file) → 渲染预览弹窗；头部三个数字（size / chunks / hitCount）与摘要取自该对象，但「核心知识要点」两条为写死示例。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:775-780`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:801-809`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:1085-1149`

**出边 0 条**

（无）
<!-- EDGES:END -->
