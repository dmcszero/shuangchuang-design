---
id: page-pools-kb
title: 导师库与知识库（校内/平台双版本）
section: sec-platform
importance: medium
sources:
  - src/components/MentorPoolManagement.tsx
  - src/components/PlatformMentorPoolManagement.tsx
  - src/components/KnowledgeBaseManagement.tsx
  - src/components/PlatformKnowledgeBaseManagement.tsx
  - src/data/mockMentors.ts
  - src/data/mockPlatformMentors.ts
  - src/data/mockKnowledgeBase.ts
  - src/data/mockPlatformKnowledgeBase.ts
  - src/components/TopHeader.tsx
  - src/App.tsx
related_pages: [page-mentorship, page-roles-navigation]
---

# 导师库与知识库（校内/平台双版本）

## 一句话定位

同一个 `TabType` 按角色渲染**两套完全不同的组件与数据**：`mentors_pool` 与 `knowledge_base` 对 `school_admin` 走校内版（`MentorPoolManagement` / `KnowledgeBaseManagement`），对 `system_admin` 走平台版（`PlatformMentorPoolManagement` / `PlatformKnowledgeBaseManagement`）。

## 事实（每条强制可回溯）

### 一、双版本分发

1. **分发点是 `App` 的三元表达式**，不是路由或权限表：

| activeTab | system_admin | 其它（school_admin） |
|---|---|---|
| `mentors_pool` | `<PlatformMentorPoolManagement />` | `<MentorPoolManagement mentors={...} onUpdateMentors={...} onNavigateTab={...} />` |
| `knowledge_base` | `<PlatformKnowledgeBaseManagement />` | `<KnowledgeBaseManagement />` |

`Sources: [src/App.tsx:652-670]()`

2. **平台版不接收任何 props** —— 数据在组件内部直接 import；校内版接收 `mentors`（由 `App` 持有并回写）。这是两版最大的结构差异。`Sources: [src/App.tsx:652-670]()`
3. 顶栏也按同一角色条件分叉出两套标题/副题：平台版为「平台导师智库管理 / 平台赛事知识库管理」，校内版为「全校及外部双创导师智库 / 学校双创知识库管理」。`Sources: [src/components/TopHeader.tsx:54-59]()`
4. 四个组件用**四套独立的 mock 数据**，互不共享：

| 组件 | 数据源 | 类型 |
|---|---|---|
| `MentorPoolManagement` | `MOCK_MENTORS`（经 `App` 传入） | `MentorExpert` |
| `PlatformMentorPoolManagement` | `MOCK_PLATFORM_MENTORS`（内部 import） | `PlatformMentorExpert` |
| `KnowledgeBaseManagement` | `MOCK_KNOWLEDGE_BASES` | `KnowledgeBase` |
| `PlatformKnowledgeBaseManagement` | `MOCK_PLATFORM_KNOWLEDGE_BASES` | `KnowledgeBase`（**类型共用**） |

`Sources: [src/data/mockMentors.ts:3-3]()` `Sources: [src/data/mockPlatformMentors.ts:38-38]()` `Sources: [src/data/mockKnowledgeBase.ts:34-34]()` `Sources: [src/data/mockPlatformKnowledgeBase.ts:3-3]()`

5. **导师类型是两套不同模型**：校内版 `MentorExpert`（`type: internal|external`、`roleCategory` 6 类、`availability` 三态）；平台版 `PlatformMentorExpert`（`certificationLevel` 6 级、`roleCategory` 6 类、`dispatchStatus` 三态、`servedUniversitiesCount` / `nationalReviewYears` / `recentDispatches[]`）。`Sources: [src/types.ts:142-166]()` `Sources: [src/data/mockPlatformMentors.ts:3-37]()`
6. 平台导师的 `certificationLevel` 六值：`fellow | national_senior | leading_investor | industry_chief | legal_finance | alumni_champ`。`Sources: [src/data/mockPlatformMentors.ts:10-10]()`
7. 平台导师的 `dispatchStatus` 三值：`open_all | restricted | paused`，UI 可切换 `open_all ↔ paused`（文案：「已恢复全平台开放跨校调度」/「已暂停该专家全平台调度」）。`Sources: [src/data/mockPlatformMentors.ts:27-27]()` `Sources: [src/components/PlatformMentorPoolManagement.tsx:342-354]()`
8. **知识库类型是共用的**（`KnowledgeBase` 定义在 `mockKnowledgeBase.ts`），两版只有数据不同。`Sources: [src/data/mockKnowledgeBase.ts:16-32]()` `Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:30-31]()`

### 二、导师库（校内版 `MentorPoolManagement`）

9. Props 3 项：`mentors` / `onUpdateMentors` / `onNavigateTab`。`Sources: [src/components/MentorPoolManagement.tsx:33-38]()`
10. 支持**卡片视图与表格视图切换**（`View Mode Toggle` 在 660-683）。`Sources: [src/components/MentorPoolManagement.tsx:660-683]()` `Sources: [src/components/MentorPoolManagement.tsx:730-1102]()`
11. 五个筛选维度：搜索、type、roleCategory、expertiseTags（快捷标签胶囊）、availability。`Sources: [src/components/MentorPoolManagement.tsx:447-468]()` `Sources: [src/components/MentorPoolManagement.tsx:605-729]()`
12. 顶部有 8 项宏指标（导师总数 / 校内数 / 校外数 / 国评评委数 / 累计金奖数 / 在带项目数 / 承载上限 / 可用数 / 平均评分）。`Sources: [src/components/MentorPoolManagement.tsx:470-482]()`
13. 单卡上显示**负荷率**：`currentProjectsCount / maxCapacity`，clamp 到 100%。`Sources: [src/components/MentorPoolManagement.tsx:753-753]()`
14. **导出花名册是真实 CSV 下载**：使用 `\uFEFF` BOM 前缀 + `Blob` + 动态 `<a>` 触发下载。`Sources: [src/components/MentorPoolManagement.tsx:294-350]()`
15. 可用性可快速循环切换（available → busy → full → available）。`Sources: [src/components/MentorPoolManagement.tsx:279-292]()`
16. 两个大弹层：新增/编辑表单（1103-1530，含 5 个 section）与导师档案抽屉（1531-1750）。`Sources: [src/components/MentorPoolManagement.tsx:1103-1530]()` `Sources: [src/components/MentorPoolManagement.tsx:1531-1750]()`

### 三、导师库（平台版 `PlatformMentorPoolManagement`）

17. **无 props**，内部持有 `mentors` 状态（初始 `MOCK_PLATFORM_MENTORS`）。`Sources: [src/components/PlatformMentorPoolManagement.tsx:41-41]()` `Sources: [src/components/PlatformMentorPoolManagement.tsx:39-39]()`
18. 独有能力：**跨校调度**（`handleOpenDispatchModal` / `handleSubmitDispatch` / `handleToggleDispatchStatus`），会向导师追加 `recentDispatches` 记录（院校 / 任务 / 日期 / 形式：线下入校 \| 线上联审）。`Sources: [src/components/PlatformMentorPoolManagement.tsx:302-354]()` `Sources: [src/data/mockPlatformMentors.ts:30-35]()`
19. 同样有 CSV 导出（356-413）与 4 个筛选维度（level / track / dispatch / 搜索）。`Sources: [src/components/PlatformMentorPoolManagement.tsx:356-412]()` `Sources: [src/components/PlatformMentorPoolManagement.tsx:414-431]()`
20. 平台侧宏指标 5 项：专家总数 / 院士与国评级 / 累计服务高校数 / 累计指导金奖 / 平均评分。`Sources: [src/components/PlatformMentorPoolManagement.tsx:433-440]()`

### 四、知识库（两版）

21. 校内版是**两层级视图**：Level 1 知识库列表（310-558）→ Level 2 单库内文件管理（559-840）；平台版同构（314-575 / 576-813）。`Sources: [src/components/KnowledgeBaseManagement.tsx:310-558]()` `Sources: [src/components/KnowledgeBaseManagement.tsx:559-840]()` `Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:314-575]()` `Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:576-813]()`
22. 每版三个弹层：新建知识库、上传文件、文件详情与知识片段预览。`Sources: [src/components/KnowledgeBaseManagement.tsx:841-945]()` `Sources: [src/components/KnowledgeBaseManagement.tsx:946-1083]()` `Sources: [src/components/KnowledgeBaseManagement.tsx:1084-1168]()`
23. 知识库分类是**五值枚举**：`school_policy | competition_rules | gold_cases | expert_experience | opc_incubation`。`Sources: [src/data/mockKnowledgeBase.ts:20-20]()`
24. 文件类型六值：`pdf | docx | pptx | xlsx | txt | md`；文件状态三值 `indexed | processing | failed`。`Sources: [src/data/mockKnowledgeBase.ts:4-4]()` `Sources: [src/data/mockKnowledgeBase.ts:10-10]()`
25. **chunk 数是随机模拟的**：上传时用 `Math.floor(60 + Math.random() * 150)`（校内版）/ `Math.floor(80 + Math.random() * 180)`（平台版），并据此更新知识库总 chunk 数与体积。`Sources: [src/components/KnowledgeBaseManagement.tsx:170-191]()` `Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:174-195]()`
26. 删除文件会按该文件的 chunk 数与体积反向扣减知识库统计。`Sources: [src/components/KnowledgeBaseManagement.tsx:214-240]()`
27. 知识库的关键指标含 RAG 命中次数（`hitCount`），页头汇总里做累加。`Sources: [src/components/KnowledgeBaseManagement.tsx:262-269]()` `Sources: [src/data/mockKnowledgeBase.ts:12-12]()`

## 规则与边界（AI 开发硬约束）

- **两版是并列实现，不是同一组件的 props 分叉**（与 page-defense / page-coach 里"共享组件不同参数"的做法不同）。改一处不会自动同步另一处 —— 想统一必须先抽公共组件，那是较大重构。
- **`knowledge_base` 的两版共用 `KnowledgeBase` 类型**，所以**改类型会同时影响两端**；而**导师库两版类型独立**，改 `PlatformMentorExpert` 不会影响校内版。
- **平台版无 props 意味着数据无法从外部注入**：想让平台导师库接收 `App` 级状态（例如跨校调度结果回流），必须先把数据结构提升到 `App`，属于跨模块改动。
- **`PlatformMentorPoolManagement` 与 `MentorPoolManagement` 都维护自己的 `mentors` 副本**：在内校版删除导师会立即影响 page-mentorship 的推荐结果（因为数据在 App），而平台版的操作是孤立的。
- **chunk 数是 `Math.random()`**：不要用知识库的 chunk 数做任何断言或测试期望值，它每次上传都不同。
- **分类枚举写死在类型里**，新增分类要同时改 `mockKnowledgeBase.ts:20`、两版的 `categoryLabels` 映射（`KnowledgeBaseManagement.tsx:110` / `PlatformKnowledgeBaseManagement.tsx:115`）与筛选项。
- **CSV 导出用 `\uFEFF` BOM**：这是为了让中文在 Excel 中不乱码，改动导出逻辑时不要删掉 BOM 前缀（两版都有）。`Sources: [src/components/MentorPoolManagement.tsx:339-339]()`
- **`TabType` 只有 `mentors_pool` / `knowledge_base` 两项**承载这四个组件；新增"资源池"类页面应复用 `TabType` + 角色分叉模式，而不是新建 4 个 tab。
- 平台版组件在 `App` 中**零参数调用**：`<PlatformMentorPoolManagement />`，所以给平台版加 props 时 `App.tsx:654` / `666` 两处都要改。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 改校内导师库 | `MentorPoolManagement.tsx`（筛选 447-469 / 卡片 730-1102 / 表单 1103-1530 / 档案 1531-1750） |
| 改平台导师库 | `PlatformMentorPoolManagement.tsx`（调度 302-355 / 筛选 414-432 / UI 946-1501） |
| 改导师数据 | 校内 `mockMentors.ts:3-205`；平台 `mockPlatformMentors.ts:38-303` |
| 改知识库 | 校内 `KnowledgeBaseManagement.tsx`（Level1 310-558 / Level2 559-840 / 三弹层 841-1168）；平台同构 |
| 加知识库分类 | `mockKnowledgeBase.ts:20` + 两版 `categoryLabels` + 筛选项 |
| 改角色分叉规则 | `App.tsx:652-670`（组件分叉）+ `TopHeader.tsx:54-59`（标题分叉），**两处必须一致** |
| 统一两版 | 见规则节第 1 条（需先抽公共组件） |

## 与 related_pages 的联动提示

- → **page-mentorship**：校内导师库与辅导调度**共享 `App` 持有的 `mentors`**（`App.tsx:65`）。在导师库删掉一个导师，辅导页的 Top 3 推荐会立刻少一个 —— 这是两个页面的隐式耦合。
- → **page-cockpit / page-screening**：导师/知识库数据**不参与**驾驶舱与初筛的任何统计（那两页只吃 `projects`），因此改导师库不会影响管理端大盘。
- 注意不对称：本页是 `sec-platform` 分区唯一页面，`importance: medium`，按需加载即可；但它的导师数据是 page-mentorship 的输入，改数据结构时要跨分区核对。
