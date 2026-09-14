---
id: nd-kb-list
title: 知识库列表卡与启停/删除
page: page-knowledge-base
kind: list
importance: high
sources:
  - src/components/KnowledgeBaseManagement.tsx:399-559
---

## 一句话定位

一级视图的主体：知识库卡片网格，每张卡可开关「运行/停用」、可进库管理文件、可删除——**校端知识库的自有写操作集中在卡片右上角的开关上**。

## 事实（每条强制可回溯）

1. 检索条：关键词（匹配 `name` / `description` / `code` 三字段）+ 分类下拉（五类 + 全部）+ 状态下拉（全部 / 仅看启用 / 仅看停用），三条件「与」关系。 Sources: [src/components/KnowledgeBaseManagement.tsx:241-250]() [src/components/KnowledgeBaseManagement.tsx:399-440]()
2. **空态完备**：无匹配结果时渲染图标 + 「未找到符合条件的知识库」+ **一键「重置所有筛选」按钮**（清空三条件）。 Sources: [src/components/KnowledgeBaseManagement.tsx:442-457]()
3. 卡片带稳定 id `kb-card-{kb.id}`；上半区展示：编码（mono 徽标）+ **启用开关胶囊**（`● 运行中` / `○ 已停用`）+ 分类徽标（`getCategoryBadgeClass` 五色）+ 名称 + 描述 + 子指标行 + 受众人群。 Sources: [src/components/KnowledgeBaseManagement.tsx:458-527]()
4. **启用开关**（`handleToggleKbStatus`）：翻转 `kb.enabled` 并同步 `status`（`ready` / `disabled`），Toast 文案随动作变化（启用→「AI大模型与智能备赛教练即刻恢复检索调用」；停用→「AI检索问答已暂停挂载此库」）；带 `e.stopPropagation()` 避免触发卡片跳转。 Sources: [src/components/KnowledgeBaseManagement.tsx:88-104]() [src/components/KnowledgeBaseManagement.tsx:474-490]()
5. 卡片标题点击 → `handleEnterKbFiles(kb.id)`：设 `selectedKbId`、清空文件筛选、切 `viewLevel='detail'`、**平滑滚回页顶**。 Sources: [src/components/KnowledgeBaseManagement.tsx:73-79]() [src/components/KnowledgeBaseManagement.tsx:492-499]()
6. 卡片底部两个动作：「进入文件管理 / 管理库内文件」（同 `handleEnterKbFiles`）与**删除知识库**（`handleDeleteKnowledgeBase`，带 `window.confirm` 二次确认；若删的是当前选中库则回退到剩余第一个并切回列表视图）。 Sources: [src/components/KnowledgeBaseManagement.tsx:147-161]() [src/components/KnowledgeBaseManagement.tsx:528-556]()

## 规则与边界（AI 开发硬约束）

- **启停与删除是真实写操作**（改组件内 `knowledgeBases` state），且**会立即反映到五张宏指标卡**（`activeBases` 变化）——本页是全库少数「指标与操作真正联动」的页面。
- 删除是**真删除**（连同其文件与要点从 state 移除），无撤销、无回收站；确认文案明确「所有文档与知识索引将被彻底移除」。
- 数据**不出组件**：`KnowledgeBaseManagement` 不接收任何 props，删库/停库的效果不会流向 AI 助手（`page-coach` 的校内智库是另一套 mock，见 issue `issue-kb-not-connected-to-coach`）。
- 分类枚举五值（`school_policy` / `competition_rules` / `gold_cases` / `expert_experience` / `opc_incubation`）在筛选、卡片徽标、新建弹窗三处共用，新增分类要三处同步。
- 卡片无「编辑」入口（建库后不能改名/改分类/改受众）——要改只能删了重建。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 支持编辑库信息 | `:458-556` | 需新增编辑弹窗（可复用新建表单） |
| 删除改软删/归档 | `:147-161` | `KnowledgeBase` 需加状态字段 |
| 卡片加「最近更新」时间 | `:505-527` | `kb.updatedAt` 字段已有但本卡未展示 |
| 知识库启停接真实 RAG 挂载 | `:88-104` | 需后端索引服务 + `page-coach` 消费 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-platform-kb-2-school-kb-intended`** ← `nd-platform-kb`（平台赛事知识库（admin 端））｜`read` · **intended（设计有·未实现）**｜severity: medium
  - 触发：（设计意图）平台标准库应下发/供给各高校使用
  - 设计依据：平台端副文「本模块数据独立于各高校本校私有智库，作为底层标准供给全平台」src/components/PlatformKnowledgeBaseManagement.tsx:330-332；指标卡「面向全部入驻高校下发」:352
  - 期望行为：平台库作为底层标准对校端可见（订阅或引用），校端 AI 检索时可同时命中平台标准与本校私有库。
  - **卡点**：两端各自自持 state（`MOCK_PLATFORM_KNOWLEDGE_BASES` vs `MOCK_KNOWLEDGE_BASES`）、均无 props、无共享数据层与订阅机制；App 仅按 `session.role === 'system_admin'` 分流渲染，两者之间没有任何数据流动。

**出边 2 条**

- **`e-kb-list-2-detail-navigate`** → `nd-kb-detail`（库内文件管理（二级视图））｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击库卡标题，或卡片底部「进入文件管理 / 管理库内文件」
  - 载荷：`kbId（字符串）`
  - 逻辑：handleEnterKbFiles(kbId)：setSelectedKbId + 清空文件筛选 + setViewLevel('detail') + window.scrollTo(顶部平滑滚动)；二级视图由 currentKb 派生渲染。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:73-79`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:492-499`
  - 出处：`src/components/KnowledgeBaseManagement.tsx:542-549`
- **`e-kb-list-2-coach-intended`** → `page-coach`（AI 备赛教练）｜`read` · **intended（设计有·未实现）**｜severity: high
  - 触发：（设计意图）AI 助手/备赛教练应挂载已启用的知识库做 RAG 检索
  - 设计依据：校端页头徽标「校内专属智库 (RAG底层)」src/components/KnowledgeBaseManagement.tsx:323；启停 Toast「AI大模型与智能备赛教练即刻恢复检索调用」src/components/KnowledgeBaseManagement.tsx:97；底部声明「在 AI 智能导师与备赛问答中提供准确的原文引文出处（Grounding Citations）」src/components/KnowledgeBaseManagement.tsx:831
  - 期望行为：启用的知识库应作为 AI 助手（及校内智库提问）的检索底座：问答引用可回溯到库内文档与要点；停用后该库不再被检索。
  - **卡点**：AI 助手的「校内智库」回答读的是 `mockCoachData` 的另一套语料（默认厦门大学、引用文号硬编码「厦大创字〔2025〕06号」），与知识库的 22 个 state 零连接；全库无检索引擎与向量库调用。
<!-- EDGES:END -->
