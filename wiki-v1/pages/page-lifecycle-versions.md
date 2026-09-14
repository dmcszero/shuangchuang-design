---
id: page-lifecycle-versions
title: L1~L6 生命周期与版本体系
section: sec-data
importance: high
sources:
  - src/components/guidance/guidanceMockData.ts
  - src/components/guidance/guidanceTypes.ts
  - src/components/SceneGuidanceWorkbench.tsx
  - src/components/SceneAICoach.tsx
  - src/components/MilestoneKanban.tsx
  - src/data/mockCoachData.ts
  - src/components/workbench/workbenchMockData.ts
  - src/components/ProjectMemberWorkbench.tsx
  - src/types.ts
related_pages: [page-guidance, page-milestones, page-coach, page-defense]
---

# L1~L6 生命周期与版本体系

## 一句话定位

本页做两件事：① **把三套并存的阶段口径摊平对照**（教练 L1~L4 / 里程碑 L1~L5 / 指导工作台 L1~L6），如实记录 demo 的口径不一致；② 说明版本体系——**快照 / 里程碑 / 回滚 / diff 全量只在指导工作台做**，项目文件夹的版本线是只读镜像。

## 事实（每条强制可回溯）

### 一、阶段口径对照（核心）

**口径 ①：教练模块 L1~L4**

1. 数据源 `mockStages`，**仅 4 项**：`L1 创意探索期` / `L2 概念验证期` / `L3 模式成型期` / `L4 国赛冲刺期`，每项含 `title` / `name` / `desc` / `focus` / `badgeColor`。`Sources: [src/data/mockCoachData.ts:246-279]()`
2. 教练侧类型是**字面量联合**：`useState<'L1' | 'L2' | 'L3' | 'L4'>('L3')`，默认 L3。`Sources: [src/components/SceneAICoach.tsx:123-123]()`
3. 阶段选择处理器也只接受 4 值，并用 `!` 断言强取目标阶段（找不到会抛）。`Sources: [src/components/SceneAICoach.tsx:449-451]()`

**口径 ②：里程碑看板 L1~L5**

4. 阶段定义是 `MilestoneKanban` 组件内的**本地数组**，5 项，名称是备赛管线口径：`L1 申报与初筛` / `L2 校赛与导师打磨` / `L3 省赛集中封闭营` / `L4 国赛精英训练营` / `L5 金奖答辩冲刺`。`Sources: [src/components/MilestoneKanban.tsx:30-36]()`
5. 对应类型是 `StageLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'`，也是 `ProjectItem.currentStage` 的类型。`Sources: [src/types.ts:37-37]()` `Sources: [src/types.ts:111-111]()`

**口径 ③：指导工作台 L1~L6**

6. 数据源 `INITIAL_STAGE_ITEMS`，**6 项**：`L1 创意激发` / `L2 可行性验证` / `L3 材料成型` / `L4 打磨优化` / `L5 路演成型` / `L6 赛前冲刺`，状态依次 done/done/done/doing/todo/todo。`Sources: [src/components/guidance/guidanceMockData.ts:29-36]()`
7. 该类型是 `StageProgressItem.stage: string`，**注释写 `// L1~L6`**（即用字符串而非枚举，类型层面无约束）。`Sources: [src/components/guidance/guidanceTypes.ts:158-167]()`
8. 工作台顶栏注释自称「L1~L6 Stage Stepper」，UI 上共 6 张卡。`Sources: [src/components/SceneGuidanceWorkbench.tsx:318-320]()`

**四套定义并列对照表**

| 维度 | 教练（coach） | 里程碑（milestones） | 指导工作台（guidance） | AI 域（旧） |
|---|---|---|---|---|
| 阶段数 | **4**（L1~L4） | **5**（L1~L5） | **6**（L1~L6） | **4**（L1~L4） |
| 数据源 | `mockCoachData.ts:246-279` | `MilestoneKanban.tsx:30-36` | `guidanceMockData.ts:29-36` | — |
| 类型约束 | 字面量联合（强） | `StageLevel`（强） | `string`（**无约束**） | `MaturityStatus`（强） |
| 阶段语义 | 创意→验证→成型→冲刺 | 申报→校赛→省赛→国赛→金奖 | 创意→验证→材料→打磨→路演→冲刺 | 探索/概念/方案/成熟 |
| 默认值 | `L3` | `'ALL'`（筛选） | 数据里 `L4` 为 doing | — |

`Sources: [src/data/mockCoachData.ts:246-279]()` `Sources: [src/components/MilestoneKanban.tsx:30-36]()` `Sources: [src/components/guidance/guidanceMockData.ts:29-36]()` `Sources: [src/types.ts:244-244]()`

9. 另外 `MaturityStatus = 'L1' | 'L2' | 'L3' | 'L4'` 是 AI 域的旧口径（注释为"探索期, 概念期, 方案期, 成熟期"），用于 `ProjectSpace.stage`。`Sources: [src/types.ts:244-244]()` `Sources: [src/types.ts:451-451]()`
10. **三套口径的语义并不一致**：同为 L2，教练叫"概念验证期"、里程碑叫"校赛与导师打磨"；同为 L4，教练叫"国赛冲刺期"、里程碑叫"国赛精英训练营"、工作台叫"打磨优化"。**只对"编号"统一，对"含义"不统一**。
11. 工作台 stepper 的"当前阶段"判定**硬编码为 `st.stage === 'L4'`**，并不读数据里的 `status`（数据里 `L4` 恰好也是 `doing`，所以看不出来）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:321-321]()`

### 二、版本体系

12. 版本类型 `VersionType = 'snapshot' | 'version' | 'milestone'` 三态。`Sources: [src/components/guidance/guidanceTypes.ts:100-100]()`
13. `ProjectVersion` 字段：`versionId` / `versionType` / `label` / `source`（**自由字符串**，注释建议 auto/manual/edit/milestone）/ `scoreVersionId` / `createdAt` / `total` / `content?` / `parentId?` / `branchName?` / `commitMsg?`。`Sources: [src/components/guidance/guidanceTypes.ts:102-114]()`
14. 已有版本带 `parentId?` / `branchName?` 字段（形似 git 分支模型），但**当前数据与 UI 都没有使用父子链或分支**（`SAMPLE_VERSIONS` 里没有 `parentId`）。`Sources: [src/components/guidance/guidanceTypes.ts:110-112]()`
15. `SAMPLE_VERSIONS` 4 条历史：`v1.0.0`(snapshot/auto/73) → `v1.2.0`(version/edit/81) → `v1.4.0`(milestone/milestone/87) → `v2.0.0-rc`(version/manual/91)。`Sources: [src/components/guidance/guidanceMockData.ts:245-290]()`
16. **新建快照**：版本号 `v2.0.<versions.length>`，`source: 'manual'`，`total: 91`（硬编码），并置为当前版本 + 显示 2.5s 成功提示。`Sources: [src/components/SceneGuidanceWorkbench.tsx:151-169]()`
17. **标记里程碑**：版本号固定 `v2.1.0-M`，`total: 92`（硬编码），并弹 alert 提示已同步至"项目全息大事记"。`Sources: [src/components/SceneGuidanceWorkbench.tsx:171-188]()`
18. **预览快照**：`viewingVersionId` 控制只读态，进入后禁用编辑与导出，且有专门的提示条。`Sources: [src/components/SceneGuidanceWorkbench.tsx:92-94]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:429-450]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:496-496]()`
19. **回滚**：`handleRollbackTo(ver)` 独立入口，位于版本历史抽屉的每一行内（行内操作区）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:282-289]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:1048-1076]()`
20. **diff**：独立弹层 `GuidanceVersionDiffModal`，含两个版本选择器 + 分数 delta 横幅 + 逐条变更（当前 mock 2 条）。`Sources: [src/components/guidance/GuidanceModals.tsx:22-176]()`
21. 版本历史抽屉在**右缘**，顶栏「版本历史」按钮切换，抽屉打开时覆盖右栏 AI 教练。`Sources: [src/components/SceneGuidanceWorkbench.tsx:92-94]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:957-1076]()`

### 三、版本在别处的镜像与引用

22. **项目文件夹的版本线是只读镜像**，源码注释写明「主文档版本线（与工作台快照体系同源）」。`Sources: [src/components/ProjectMemberWorkbench.tsx:926-954]()`
23. 项目文件夹的「大事记 = 文件更改记录」记录 `versionRef`（形成的版本），例如 `v2.0.0-rc` / `v1.4.0`，来源标注 `全链路指导工作台` 或 `全链路指导工作台·版本抽屉`。`Sources: [src/components/workbench/workbenchMockData.ts:165-206]()`
24. 工单侧的版本演进另有一套：`studentSubmission.newBpVersion` / `newPptVersion` 是自由字符串（如 `v3.3_2026_Final.pdf`），与 `ProjectVersion` **没有关联**。`Sources: [src/types.ts:200-206]()` `Sources: [src/components/ProjectMemberWorkbench.tsx:106-110]()`
25. `GuidanceTodoItem.stage` 字段也标注 `// L1~L6`（同样是自由字符串），与指导工作台口径一致。`Sources: [src/components/guidance/guidanceTypes.ts:197-206]()`
26. `SAMPLE_TODOS` 里的待办 `stage` 取值是 `'L4'`，且用 `chapterRef: '第5章 竞争分析'` 关联章节。`Sources: [src/components/guidance/guidanceMockData.ts:292-343]()`

## 规则与边界（AI 开发硬约束）

- **口径不一致是"如实记录的现状"，不是待修 bug**（除非产品明确要求统一）。任何"顺手统一"都会同时改变教练选阶段、里程碑看板列、工作台 stepper 三处语义，且需要同步迁移 `mockProjects.currentStage` 的取值。
- **要做统一，必须先定"以哪套语义为准"**：当前三套的**编号**一致但**含义**不同（见事实 10）。只改编号数量不解决问题，必须重命名阶段。
- **`StageProgressItem.stage` 是 `string`，没有类型保护**：写错阶段值不会报错。这是三套口径里最脆弱的一环，建议优先加固。
- **版本操作只有一处写入方**：`SceneGuidanceWorkbench`（快照 151-169、里程碑 171-188、回滚 282-289）。项目文件夹、工单的版本字段都是**只读或独立**的，**不要在别处新增版本写入**，否则会出现多个版本真相源。
- **版本号是字符串拼接且有重名风险**：`v2.0.${versions.length}` 与固定 `v2.1.0-M`（见 page-guidance 规则节）。做真实版本管理必须换稳定 id。
- **`total` 分数是硬编码常量**（91 / 92），与评分逻辑无关。改评分不会自动改版本分数。
- **`parentId` / `branchName` 是预留字段**：数据与 UI 均未使用，不要以为已有分支能力。
- **预览是"只读态"，不是"切换当前版本"**：`viewingVersionId` 与 `currentVersionId` 是两个概念，不要合并。
- 工单的 `newBpVersion` 与本页的 `ProjectVersion.versionId` **不会自动同步**，跨页对比版本号时注意这是两套编号。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一个全局阶段（统一口径） | 四套定义都要改：`mockCoachData.ts:246-279`、`MilestoneKanban.tsx:30-36`、`guidanceMockData.ts:29-36`、`types.ts:37/244`；并核对 `mockProjects.ts` 的 `currentStage` |
| 加一个版本类型 | `guidanceTypes.ts:100`（`VersionType`）+ 创建入口 `SceneGuidanceWorkbench.tsx:151-188` |
| 改快照/里程碑创建逻辑 | `SceneGuidanceWorkbench.tsx:151-188` |
| 改 diff 弹层 | `GuidanceModals.tsx:22-176` |
| 改版本抽屉/回滚 | `SceneGuidanceWorkbench.tsx:957-1076` |
| 改项目文件夹版本线 | `ProjectMemberWorkbench.tsx:926-954`（注意：保持只读） |
| 改大事记引用 | `workbenchMockData.ts:152-206` |

## 与 related_pages 的联动提示

- → **page-guidance**：L1~L6 与完整版本体系的实现方；本页只做口径对照与体系说明，版本操作细节以该页为准。
- → **page-milestones**：L1~L5 口径的使用方，也是**唯一用阶段做看板列**的页面。
- → **page-coach**：L1~L4 口径的使用方（阶段选择器 + 开场引导）。改阶段模型必须回到该页核对 123 行与 449 行。
- → **page-defense**：`DefenseHistoryItem.stats` 里含"完成 N 轮"等文案，但**不涉及阶段字段**；不过 `getDefenseProject` 会把 `ProjectItem.stageName` 写进 tags（`阶段: xxx`），因此阶段改名会影响答辩的项目标签。`Sources: [src/components/SceneDefenseTraining.tsx:27-32]()`
- 三处入口提示：阶段口径虽分三处，但**没有任何地方声明它们是同一概念**——如果将来加"全局阶段枚举"，优先在 `types.ts` 定义一次，再由三处引用（这是本页最直接的改进建议）。
