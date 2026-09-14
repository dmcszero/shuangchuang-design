---
id: page-knowledge-base
title: 知识库管理
section: sec-assets
importance: medium
view: knowledge_base
component: src/components/KnowledgeBaseManagement.tsx
sources:
  - src/components/KnowledgeBaseManagement.tsx:1-1149
  - src/components/PlatformKnowledgeBaseManagement.tsx:1-1115
related_pages: ["page-assets", "page-mentorship", "page-mentors-pool"]
nodes:
  - nd-kb-overview
  - nd-kb-list
  - nd-kb-create
  - nd-kb-detail
  - nd-kb-upload
  - nd-kb-preview
  - nd-platform-kb
---

## 一句话定位

「知识库管理」**一页两端**：校管端维护本校私有智库（校内扶持政策 / 竞赛规则 / 金奖案例 / 专家经验 / OPC 孵化五类），admin 超管端维护全平台标准库；两端是两套独立实现与独立数据，靠 `session.role` 分流。

## 事实（每条强制可回溯）

**一、挂载与两套实现**

1. `App.tsx` 在 `activeTab === 'knowledge_base'` 时按角色分流：`system_admin` → `PlatformKnowledgeBaseManagement`，其余 → `KnowledgeBaseManagement`；**两个组件都不接收任何 props**。 Sources: [src/App.tsx:761-766]()
2. 根容器 id：校端 `knowledge-base-module`、平台端 `platform-knowledge-base-module`。 Sources: [src/components/KnowledgeBaseManagement.tsx:301]() [src/components/PlatformKnowledgeBaseManagement.tsx:305]()
3. 两端均为模块化页面（不在沉浸式白名单内）：外层可滚动、常规内边距、有全局页脚。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]()

**二、校端：两级视图（本页面上唯一的「页内导航」）**

4. `viewLevel: 'list' | 'detail'` 决定渲染一级（库列表）还是二级（库内文件）。 Sources: [src/components/KnowledgeBaseManagement.tsx:32]()
5. 页面 state 共 22 个：两级视图态 + 两级筛选态 + 三弹窗态 + 创建表单四项 + 上传表单五项。 Sources: [src/components/KnowledgeBaseManagement.tsx:29-61]()
6. 一级 → 二级经 `handleEnterKbFiles`（设 `selectedKbId` + 清空文件筛选 + 切视图 + 滚回页顶）；返回经 `handleBackToKbList`（切视图 + 滚回页顶）。 Sources: [src/components/KnowledgeBaseManagement.tsx:73-86]()

**三、数据口径（本页最重要的区分）**

7. 校端**五张宏指标卡全部真实派生**（对 `knowledgeBases` 聚合：库数 / 启用数 / 文件数 / 要点数 / 命中数）；实测 mock 为 **5 库（4 启用）/ 17 文件 / 3,332 要点 / 11,382 命中**。 Sources: [src/components/KnowledgeBaseManagement.tsx:262-271]() [src/data/mockKnowledgeBase.ts:1-346]()
8. 平台端同构，实测为 **5 库（4 启用）/ 16 文件 / 4,090 切片 / 31,480 命中**。 Sources: [src/data/mockPlatformKnowledgeBase.ts:1-302]()
9. **真实写操作四处**：新建库、上传文件、启停库、删除库/文件——全部改组件内 state，并**实时回流到宏指标卡**（本页指标与操作真正联动）。 Sources: [src/components/KnowledgeBaseManagement.tsx:88-239]()
10. **演示成分集中在两处**：① 上传时 `chunks` 为随机数（60~209）、`sizeBytes` 写死 2500000、`uploader` 写死「陈建国 (校管理员)」；② 文件预览弹窗的「核心知识要点」是写死的两条示例（匹配度 94.2% / 89.5%）。 Sources: [src/components/KnowledgeBaseManagement.tsx:166-212]() [src/components/KnowledgeBaseManagement.tsx:1124-1149]()
11. **上传控件是全库少数真正使用 `<input type="file">` 的实现**（读取文件名/扩展名/大小），但**文件内容从不读取**（无 `FileReader`、无上传请求）。 Sources: [src/components/KnowledgeBaseManagement.tsx:971-998]()
12. 两端**共享同一套分类枚举**（五值一致），但数据、筛选、计数各自独立、无任何互链。 Sources: [src/components/KnowledgeBaseManagement.tsx:241-250]() [src/components/PlatformKnowledgeBaseManagement.tsx:246-256]()

## 规则与边界（AI 开发硬约束）

- **本页是「多端复用页」第二例**（第一例 `page-mentors-pool`）：同一 page 在两 persona 下渲染两套实现。任何改动先问「哪一端」；两端字段与分类虽同形，**代码不共享**。
- **两端数据完全隔离**：平台库不会出现在校端列表，校端库也不上平台；「平台标准下发各校」是设计意图而非现状（见 issue `issue-kb-two-ends-not-synced`）。
- **与 AI 助手（`page-coach`）无连接**：AI 助手的「校内智库」回答用的是 `mockCoachData` 的另一套语料（默认厦门大学，文号硬编码），**不读本页任何库**——「知识库 → 对话检索」这条链在 demo 里是断的（见 issue `issue-kb-not-connected-to-coach`）。
- 一级页的「启停」会改 `enabled` 与 `status` 两个字段（`ready` / `disabled`），Toast 文案宣称「AI 检索问答已暂停挂载此库」——**无检索服务可挂载**。
- 库与文件都**没有编辑入口**（只能删了重建）；删除均带 `confirm` 二次确认。
- 「脱敏处理」「Grounding Citations」「50MB 上限」「拖拽上传」都是**文案承诺**：拖拽区只绑了 click，无 drop 事件；脱敏与引文无实现。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 知识库接入 AI 助手检索 | `:29`（state） | `page-coach` 的 campus 分支（`mockCoachData`）+ App 层共享 |
| 平台库下发/订阅到校端 | 两端组件顶部 | 需共享数据层 + 校端卡片加来源标识 |
| 上传接真实解析 | `:163-212` | 需文件服务；`chunks` 与 `status` 改由服务返回 |
| 两端分类常量同源 | `:241-250` + 平台端 `:246-256` | 建议抽 `kbCategories` 常量 |
| 库/文件编辑能力 | `:458-556` / `:726-819` | 需新增编辑弹窗与 handler |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-kb-overview` | 校端页头与知识库宏指标 | bar | 315-398 | → `nd-kb-create`（新建库） |
| `nd-kb-list` | 知识库列表卡与启停/删除 | list | 399-559 | → `nd-kb-detail`（进入文件管理）；本地写回（启停/删除） |
| `nd-kb-create` | 新建知识库弹窗 | modal | 842-946 | → `nd-kb-detail`（创建后直接进入） |
| `nd-kb-detail` | 库内文件管理（二级视图） | panel | 560-841 | → `nd-kb-upload`、→ `nd-kb-preview`；本地写回（删文件） |
| `nd-kb-upload` | 上传文件弹窗 | modal | 947-1084 | → `nd-kb-detail`（文件入表，本地写回） |
| `nd-kb-preview` | 文件解析要点预览 | modal | 1085-1149 | 无（只读） |
| `nd-platform-kb` | 平台赛事知识库（admin 端） | panel | 平台端 33-1115 | 无外部出口（自持数据） |

> 未下钻为节点的页面级结构：两级视图切换（`viewLevel`）、两端 Toast、校端一级空态（442-457）与二级空态（746-762）、两端各自的派生计算。
>
> **拆分依据**：校端六块各有独立状态域与出口（一级概览 / 库卡列表 / 建库弹窗 / 二级文件管理 / 上传弹窗 / 预览弹窗）；平台端作为「同一 page 的另一端视角」单列一个节点（组件、数据、默认值都独立，不能与校端合并表述）。**粒度自检**：7 个节点覆盖两个组件的关键面，符合 6~12 区间。

## 与 related_pages 的联动提示

- **→ `page-assets`（资产系统）**：同属 `sec-assets`，但一个是「项目交付物版本管理」、一个是「知识语料库管理」，**数据与能力零共享**（资产页管文件版本与 diff，本页管语料的切片与命中）。
- **→ `page-coach`（AI 助手）**：**应当连接但未连接**——AI 助手的「校内智库」回答与引用文号来自 `mockCoachData`（默认厦门大学、文号硬编码「厦大创字〔2025〕06号」），本页的库与文件完全不参与；「知识库是 RAG 底层」（本页徽标文案）目前只是愿景。
- **→ `page-mentors-pool`（导师池）**：两者同为「一页两端」（校端 + admin 端各一套实现），改造模式相同（自持 state、无 props、无互链），可作为同类问题的参照。
- **→ `page-login`（登录分流）**：admin 端登录默认落 `page-mentors-pool`，本页是 admin 第二个可访问的独立端页面（`knowledge_base` tab）。 Sources: [src/App.tsx:61]()
