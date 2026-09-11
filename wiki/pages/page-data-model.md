---
id: page-data-model
title: 业务数据模型全景
section: sec-data
importance: high
sources:
  - src/types.ts
  - package.json
  - src/data/mockProjects.ts
  - src/data/rules2026.ts
  - src/data/mockMentors.ts
  - src/data/mockSpaceData.ts
  - src/data/mockUsersAndTeams.ts
  - src/data/mockKnowledgeBase.ts
  - src/data/mockPlatformMentors.ts
  - src/components/guidance/guidanceTypes.ts
  - src/components/defense/defenseTypes.ts
  - src/components/workbench/workbenchMockData.ts
related_pages: [page-screening, page-workbench, page-guidance, page-coach]
---

# 业务数据模型全景

## 一句话定位

`src/types.ts`（513 行）定义全部业务实体，并在 **239 行处用注释分界**为"管理平台域"与"shuangchuang-AI 域"；此外 guidance / defense / workbench 三个子目录各带自己的类型文件。**最需要注意的不是字段本身，而是同一个业务概念存在多套并存模型。**

## 事实（每条强制可回溯）

### 一、类型文件分布

| 文件 | 行数 | 职责 |
|---|---|---|
| `src/types.ts` | 513 | 主类型库（管理域 + AI 域） |
| `src/components/guidance/guidanceTypes.ts` | 206 | 指导工作台域（版本、阶段、任务上下文） |
| `src/components/defense/defenseTypes.ts` | 60 | 答辩域 |
| `src/components/workbench/workbenchMockData.ts` | 228 | 项目工作台域（含类型定义） |
| `src/data/mockKnowledgeBase.ts` | 346 | 知识库类型 + 校内数据 |
| `src/data/mockPlatformMentors.ts` | 303 | 平台导师类型 + 数据 |
| `src/data/mockUsersAndTeams.ts` | 553 | 用户/团队类型 + 数据 |

`Sources: [src/types.ts:1-1]()` `Sources: [src/components/guidance/guidanceTypes.ts:1-1]()` `Sources: [src/components/defense/defenseTypes.ts:1-1]()` `Sources: [src/components/workbench/workbenchMockData.ts:1-1]()` `Sources: [src/data/mockKnowledgeBase.ts:1-1]()` `Sources: [src/data/mockPlatformMentors.ts:1-1]()` `Sources: [src/data/mockUsersAndTeams.ts:1-1]()`

### 二、`src/types.ts` 全量索引

**基础枚举与登录域**

| 类型 | 行号 | 要点 |
|---|---|---|
| `TrackType` | 1-17 | **16 个值**：10 个赛道枚举（如 `higher_education_creative`）+ 6 个中文分类（如 `'科技创新'`）—— 同一联合里混了两种命名体系 |
| `PortalRole` | 19 | 4 值（登录门户角色） |
| `UserSession` | 21-34 | 登录态；`university` 仅对 team_member / school_admin 必填 |

`Sources: [src/types.ts:1-19]()` `Sources: [src/types.ts:21-34]()`

**评审规则域**

| 类型 | 行号 |
|---|---|
| `Tier2CriterionRule` | 40-45 |
| `Tier1CriterionRule` | 47-52 |
| `TrackEvaluationRule`（含 `mandatoryConditions`） | 54-61 |

`Sources: [src/types.ts:40-61]()`

**项目与评分域**

| 类型 | 行号 | 要点 |
|---|---|---|
| `Tier2ScoreItem` | 63-70 | 含 `benchmarkGoldScore`（金奖基准） |
| `Tier1ScoreItem` | 72-78 | |
| `ComplianceInspection` | 80-89 | 8 字段（IP 风险 / 查重率 / AI 代写疑似度 / 资格 / 重复申报） |
| `LogicGapItem` | 91-97 | 4 类断层 |
| `ProjectItem` | 99-140 | **管理域的主模型**，含 `tier1Scores` / `compliance` / `logicGaps` / `killerQuestions` / `scoreHistory` / `materials` |
| `TierGrade` / `StageLevel` / `HealthStatus` | 36-38 | 等级 A-D / 阶段 L1-L5 / 健康度三态 |

`Sources: [src/types.ts:63-140]()`

**导师与工单域**

| 类型 | 行号 | 要点 |
|---|---|---|
| `MentorExpert` | 142-166 | `type: internal\|external`、`roleCategory` 6 类、`availability` 三态 |
| `WorkOrderTask` | 168-176 | `category` 5 类 |
| `SupervisionWorkOrder` | 178-213 | `status` 4 态、`studentSubmission?`、`expertCheck?` |
| `CohortBatchTask` | 215-227 | |
| `NotificationAlert` | 229-237 | `type: urgent\|warning\|info` |

`Sources: [src/types.ts:142-237]()`

**域分隔线（239-241）**

24. 源码在此处有注释分界：`// shuangchuang-AI Domain Types`。`Sources: [src/types.ts:239-241]()`

**AI 域**

| 类型 | 行号 | 要点 |
|---|---|---|
| `ProjectType` / `MaturityStatus` / `GradeType` / `ConfidenceType` | 243-246 | `MaturityStatus` 是 **L1~L4** |
| `Chapter` | 248-256 | 12 章章节模型 |
| `Project` | 258-295 | **AI 域的项目模型**（有 `type` / `status` / `confidence` / `chapters` / `revisions`） |
| `Case` | 297-306 | 金奖案例 |
| `ExpertSkill` | 308-320 | |
| `Message` | 322-330 | sender `user\|ai` |
| `MockQASession` | 332-347 | |
| `ReActStep` / `ReActProcess` | 349-367 | |
| `ChatMessage` | 369-410 | **19 种 type** + `callMeta` / `reactProcess` / `generatedFiles` |
| `DataFlowLog` | 412-422 | `source` 写死 `'4.1 智能问答'`，`target` 只允许 4.2 / 4.3 |
| `SpaceWorkspace` | 424-431 | 本地路径 / 云桶 / 同步状态 |
| `CoachSession` | 433-443 | |
| `ProjectSpace` | 445-456 | **空间域的项目模型** |
| `ExpertAgent` | 458-468 | |
| `CoachSkillDef` | 470-477 | |
| `McpConnectorDef` | 479-488 | |
| `RecommendedTaskDef` | 490-500 | |
| `AssociatedFileItem` | 502-512 | `type` 6 值 |

`Sources: [src/types.ts:243-512]()`

### 三、同一概念的多套模型（本页最重要的事实）

25. **"项目"有三套模型并存**：
    - `ProjectItem`（99-140）：管理域，驱动初筛/驾驶舱/里程碑/项目抽屉/项目工作台
    - `Project`（258-295）：AI 域，含 `chapters`，仅在**孤儿数据文件** `mockData.ts` 中被使用（且同名导出 `mockProjects`，见 page-legacy-code）
    - `ProjectSpace`（445-456）：空间域，驱动教练的空间/会话体系
    `Sources: [src/types.ts:99-140]()` `Sources: [src/types.ts:258-295]()` `Sources: [src/types.ts:445-456]()`

26. **"消息"有四套模型**：`Message`（322-330，sender `user|ai`）、`ChatMessage`（369-410，sender `coach|student|system`，19 种 type）、`CoachMessageItem`（guidanceTypes 145-156，role `user|assistant`，含 `suggestedDiff`）、`DefenseMessage`（defenseTypes 27-33，role `judge|user`）。`Sources: [src/types.ts:322-330]()` `Sources: [src/types.ts:369-410]()` `Sources: [src/components/guidance/guidanceTypes.ts:145-156]()` `Sources: [src/components/defense/defenseTypes.ts:27-33]()`

27. **"阶段"有三套口径**：`StageLevel = L1~L5`（types.ts:37）、`MaturityStatus = L1~L4`（types.ts:244）、以及指导工作台的 L1~L6 字符串（`StageProgressItem.stage: string`，注释写 `// L1~L6`）。口径对照见 page-lifecycle-versions。`Sources: [src/types.ts:36-38]()` `Sources: [src/types.ts:244-244]()` `Sources: [src/components/guidance/guidanceTypes.ts:161-167]()`

28. **"导师"有两套模型**：`MentorExpert`（142-166，校内）与 `PlatformMentorExpert`（`mockPlatformMentors.ts:3-37`，平台，多出 `certificationLevel` / `servedUniversitiesCount` / `dispatchStatus` / `recentDispatches`）。`Sources: [src/types.ts:142-166]()` `Sources: [src/data/mockPlatformMentors.ts:3-37]()`

29. **"知识库"是一套模型两套数据**：`KnowledgeBase` 定义在 `mockKnowledgeBase.ts:16-32`，平台版直接复用该类型（只换数据）。`Sources: [src/data/mockKnowledgeBase.ts:16-32]()` `Sources: [src/components/PlatformKnowledgeBaseManagement.tsx:30-31]()`

30. **"版本"有两套模型**：`ProjectVersion`（guidanceTypes 102-114，含 `versionType` 三态与 `commitMsg`）与 `CoachSession.taskType`（types.ts:442，自由字符串，列出 12 类）；项目工作台的版本线是 `ProjectVersion` 的只读镜像。`Sources: [src/components/guidance/guidanceTypes.ts:100-114]()` `Sources: [src/types.ts:433-443]()`

### 四、Mock 数据源清单（现役）

| 数据源 | 文件 | 导出 |
|---|---|---|
| 项目 | `mockProjects.ts` | `MOCK_PROJECTS` / `mockProjects`（906 行） |
| 评审规则 | `rules2026.ts` | `COMPETITION_RULES_2026`（5 赛道） |
| 导师 / 工单 / 批次 / 告警 | `mockMentors.ts` | 4 个常量 + 4 个别名 |
| 空间 / 会话 | `mockSpaceData.ts` | `initialMergedSessions` / `initialProjectSpaces` |
| 教练会话种子消息 | `mockSessionMessages.ts` | `mockSessionHistories`（1019 行） |
| 教练域数据 | `mockCoachData.ts` | 11 个常量（阶段 L1-L4、考官人设、题库等） |
| 装配层 | `mockCoachAgentsAndSkills.ts` | 4 个常量 |
| 用户 / 团队 | `mockUsersAndTeams.ts` | `MOCK_USERS` / `MOCK_PROJECT_TEAMS` |
| 知识库 / 平台知识库 | `mockKnowledgeBase.ts` / `mockPlatformKnowledgeBase.ts` | 各自一个常量 |
| 平台导师 | `mockPlatformMentors.ts` | `MOCK_PLATFORM_MENTORS` |
| 高校 / 预置账号 | `mockUniversities.ts` | `UNIVERSITY_LIST` / `DEMO_PRESET_ACCOUNTS` |
| 指导工作台 | `guidance/guidanceMockData.ts` | 10 个常量（12 章、L1-L6、版本、待办等） |
| 项目工作台 | `workbench/workbenchMockData.ts` | 5 个常量 |
| 答辩 | `defense/defenseConstants.ts` | 4 个常量 |

`Sources: [src/data/mockProjects.ts:3-3]()` `Sources: [src/data/mockMentors.ts:443-446]()` `Sources: [src/data/mockSpaceData.ts:8-8]()` `Sources: [src/data/mockUniversities.ts:3-3]()`

### 五、类型安全现状（跨模块硬约束）

31. **仓库未安装 `@types/react` / `@types/react-dom`**：`package.json` 的 devDependencies 只声明 `@types/node` 与 `@types/express`，`node_modules/@types/` 下无 react 目录。`Sources: [package.json:25-34]()`
32. 后果：用 `React.FC<Props>` 声明的组件，其 props **实际退化为 `any`、不参与类型检查**（严格模式下会报 `TS7016 Could not find a declaration file for module 'react'`，默认非严格模式下静默通过）。全库共 **7 处** `React.FC<...>`：
    - `SceneGuidanceWorkbench.tsx:62`
    - `guidance/GuidanceModals.tsx:30 / 184 / 341`
    - `guidance/ProjectFileViewer.tsx:42`（孤儿）
    - `defense/DefenseCharts.tsx:9 / 81`
    
    而其余 **37 个** `export default function X({...}: Props)` 形式的组件 props 是真受检的。`Sources: [src/components/SceneGuidanceWorkbench.tsx:62-62]()` `Sources: [src/components/defense/DefenseCharts.tsx:9-9]()`
33. 实测验证：同样的字段错配代码，放在 `.ts` 文件里会报 `TS2339: Property 'title' does not exist on type 'ProjectItem'`，放在 `.tsx` 且用 `React.FC` 声明时**静默通过**。`Sources: [src/components/SceneGuidanceWorkbench.tsx:72-80]()`
34. 已知的真实后果：`SceneGuidanceWorkbench` 读取 `currentProject.title`（`ProjectItem` 无此字段，名称字段是 `name`），运行时取不到值。详见 page-guidance。
35. `.tsx` 中不依赖 React 上下文的类型错误**仍然会被检出**（例如 `Record<TabType, ...>` 的穷尽性检查在 `TopHeader.tabTitleMap` 上有效）。`Sources: [src/components/TopHeader.tsx:44-62]()`

## 规则与边界（AI 开发硬约束）

- **改任一共享类型前，先按上表定位它的全部消费方**。`ProjectItem` 的消费方最多（初筛、驾驶舱、里程碑、督导、辅导、项目工作台、项目抽屉、答辩转换器共 8 处）。
- **不要在"哪套模型正确"上自行拍板**：`ProjectItem` / `Project` / `ProjectSpace` 三套并存是历史状态。若要做统一，属于架构决策，需要先与产品确认（参考 0910 的归属原则拍板方式）。
- **`TrackType` 里混了英文赛道枚举和中文分类**（`'科技创新'` 等）。做赛道匹配时必须区分：`rules2026.ts` 只给 10 个英文赛道配了规则。
- **`MaturityStatus`（L1~L4）与 `StageLevel`（L1~L5）不是同一个类型**，虽然字面量重叠。把 `ProjectItem.currentStage`（`StageLevel`）赋给 `ProjectSpace.stage`（`MaturityStatus`）在 TS 上会报错 —— 这是少见的有效护栏，别用 `as any` 绕过。
- **`DataFlowLog.source` 是字面量类型 `'4.1 智能问答'`**（单一值），`target` 只允许两个值。新增调用目标必须改类型。
- **`ChatMessage.type` 有 3 个死值**（`track_comparison` / `ask_bp_upload` / `deep_call_prompt_confirm`），详见 page-coach。
- **`ProjectVersion.source` 是自由字符串**（注释建议 auto/manual/edit/milestone），不是枚举 —— 无法靠类型约束取值。
- **写 .tsx 时不要依赖 `React.FC` 提供 props 检查**：本仓不具备这个前提。用显式参数注解（`function X({...}: Props)`）可获得真实检查，新组件建议统一用这种写法。
- **mock 数据文件的"别名导出"是历史包袱**：`mockMentors.ts` 同时导出 `MOCK_MENTORS` 与 `mockMentors`（同值不同名），`mockProjects.ts` 同理。新增数据不要继续复制这种双命名。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加业务字段 | `types.ts` 对应 interface + 全部消费方（用本页第三节的模型表交叉核对） |
| 加一个赛道 | `types.ts:1-17`（`TrackType`）+ `rules2026.ts`（规则）+ `mockProjects.ts`（数据） |
| 加一个枚举值 | 改类型后须全局搜消费方的 `if/switch` 与筛选下拉 |
| 找某类型的消费方 | 先按本页第三节定位域，再 `grep -rn "<类型名>" src/` |
| 修类型检查盲区 | 见规则节最后两条（显式注解 + 装 `@types/react`） |
| 统一阶段口径 | 见 page-lifecycle-versions 的口径对照表 |

## 与 related_pages 的联动提示

- → **page-screening**：`ProjectItem` / `ComplianceInspection` / `LogicGapItem` / `TrackEvaluationRule` 最重的消费方。
- → **page-workbench**：`WorkbenchAiTodo` / `FileChangeEntry` / `PendingArchiveItem` 的宿主（定义在工作台目录内，不在主类型库）。
- → **page-guidance**：`ProjectVersion` / `GuidanceTaskContext` / `StageProgressItem` 的宿主（定义在 guidance 目录内）。
- → **page-coach**：`ChatMessage` / `DataFlowLog` / `ProjectSpace` / `CoachSession` 的消费方，也是三套消息模型之一。
- 交叉提醒：`guidanceTypes.ts` 的 `GuidanceTaskContext` 被**项目工作台跨目录 import**，说明"类型归属目录 ≠ 使用目录"。改类型前先全局搜索，不要只在同目录找。
