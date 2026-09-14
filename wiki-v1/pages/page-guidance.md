---
id: page-guidance
title: 全链路指导工作台（guidance_workbench）
section: sec-student
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx
  - src/components/guidance/guidanceMockData.ts
  - src/components/guidance/guidanceTypes.ts
  - src/components/guidance/GuidanceModals.tsx
  - src/App.tsx
related_pages: [page-workbench, page-lifecycle-versions, page-cross-link]
---

# 全链路指导工作台（guidance_workbench）

## 一句话定位

BP 打磨主阵地（**1086 行**，沉浸式满屏页）：顶栏放项目标签 + L1~L6 阶段 stepper + 四个快捷动作（保存快照 / 标为里程碑 / 版本对比 / 版本历史），中栏是三 tab（BP 12 章 / 全维诊断 / 六维评分），右栏是 AI 教练单主体；它是**全库唯一能接收跨页任务载荷（`GuidanceTaskContext`）的页面**。

## 事实（每条强制可回溯）

### 一、结构与入口

1. Props 共 7 项，其中 `taskContext` / `onDismissTask` / `onTaskCompleted` 三项专为跨页跳转闭环服务。`Sources: [src/components/SceneGuidanceWorkbench.tsx:49-58]()`
2. 中栏 tab 类型是本地定义的 `type CenterTab = 'bp' | 'diag' | 'score'`，默认 `bp`。`Sources: [src/components/SceneGuidanceWorkbench.tsx:60-60]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:83-83]()`
3. 组件用 `React.FC<SceneGuidanceWorkbenchProps>` 声明。`Sources: [src/components/SceneGuidanceWorkbench.tsx:62-62]()`
4. 根容器高度是 `h-[calc(100vh-4rem)]`（配合 `App` 对沉浸式 tab 的 padding 归零）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:290-291]()` `Sources: [src/App.tsx:546-551]()`
5. 布局为两列（中栏 + 右栏），**左栏已在 0908-16 移除**（注释明确："左栏移除后，仅保留中栏三 tab + 右栏 AI 单主体"）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:82-82]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:451-455]()`

### 二、项目对象字段错配（已实测确认）

6. 组件读取 `currentProject.title` 两处。`Sources: [src/components/SceneGuidanceWorkbench.tsx:303-303]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:819-819]()`
7. 组件读取 `currentProject.track` 两处。`Sources: [src/components/SceneGuidanceWorkbench.tsx:306-306]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:821-821]()`
8. 但 `App` 传入的是 `ProjectItem`（来自 `mockProjects`）。`Sources: [src/App.tsx:574-583]()` `Sources: [src/App.tsx:64-64]()`
9. `ProjectItem` **没有 `title` 字段**（名称字段是 `name`），`track` 存在但类型是 `TrackType` 英文枚举（如 `higher_education_creative`）而非中文赛道名。`Sources: [src/types.ts:99-112]()`
10. 兜底对象（`projects` 与 `selectedProject` 都空时）反而是 `Project` **域**的形状（`title` / `track` / `score` / `members`），两套模型混用。`Sources: [src/components/SceneGuidanceWorkbench.tsx:72-80]()` `Sources: [src/types.ts:258-295]()`
11. **该不一致不会报编译错**——因为 `React.FC<Props>` 的 props 在缺乏 React 类型声明时不参与检查。实测：本仓 `node_modules/@types/react` 不存在，`package.json` 只声明了 `@types/node` 与 `@types/express`；同形状的探针在 `.tsx` 下静默通过、在 `.ts` 下报 `TS2339: Property 'title' does not exist on type 'ProjectItem'`。`Sources: [src/components/SceneGuidanceWorkbench.tsx:62-62]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:303-303]()`
    → 运行时表现：从侧栏选中真实项目后，顶栏项目名区域与底栏文件条取不到值（`title` 为 `undefined`），赛道处显示英文枚举。
12. **教训**：本页的 props 契约是"看起来有类型、实际没有"。改本页字段前必须先跑 `npx tsc --noEmit`（它**会**报 `.ts` 与不依赖 React 上下文的错误，实测已确认）并人工核对字段是否真的存在于 `ProjectItem`。

### 三、阶段 stepper 与三 tab

13. 顶栏 stepper 消费 `INITIAL_STAGE_ITEMS`（`useState` 只读，无 setter），并在注释里自称"L1~L6 Stage Stepper"。`Sources: [src/components/SceneGuidanceWorkbench.tsx:96-96]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:318-320]()`
14. stepper 的"当前阶段"判定是 **硬编码 `st.stage === 'L4'`**，而非读数据里的 `status`。`Sources: [src/components/SceneGuidanceWorkbench.tsx:321-321]()`
15. 点击任一阶段卡会跳到 `diag` tab（不是展开阶段详情）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:326-326]()`
16. 阶段数据 `INITIAL_STAGE_ITEMS` 共 **6 项 L1~L6**（创意激发 / 可行性验证 / 材料成型 / 打磨优化 / 路演成型 / 赛前冲刺），状态 done/done/done/doing/todo/todo。`Sources: [src/components/guidance/guidanceMockData.ts:29-36]()`
17. 12 章大纲来自 `STANDARD_12_CHAPTERS`（执行摘要 → 社会价值与产业效益），每章带 `hint` 提示评审关注点。`Sources: [src/components/guidance/guidanceMockData.ts:14-27]()`
18. BP 编辑器有 `preview` / `edit` 双模式，默认 `preview`，初始定位到第 5 章。`Sources: [src/components/SceneGuidanceWorkbench.tsx:84-86]()`
19. 快照查看态下有专门的只读提示条，且该态会禁用编辑与导出。`Sources: [src/components/SceneGuidanceWorkbench.tsx:429-450]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:496-496]()`
20. 底栏原「TAB 4 文件查看器」已迁出：注释写明去向为"会话模块右侧独立工作区 + 项目工作台·项目文件夹"。`Sources: [src/components/SceneGuidanceWorkbench.tsx:813-813]()`

### 四、任务上下文条（跨页闭环的接收端）

21. 收到 `taskContext` 后的 effect 用 `prefiledTaskIdRef` 去重（同一 taskId 不重复预填），行为是：跳章节 + 追加一条 AI 引导消息（含 3 条建议回复）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:117-133]()`
22. 任务条提供两个动作：「→ 跳转关联章节」与「完成并回写待办」。`Sources: [src/components/SceneGuidanceWorkbench.tsx:404-418]()`
23. 「完成并回写」会回调 `onTaskCompleted(taskId)` 并弹 alert 提示已回写。`Sources: [src/components/SceneGuidanceWorkbench.tsx:143-149]()`
24. 关闭任务条只回调 `onDismissTask()`，**不回写**（源码注释明确"关闭任务条（不回写）"，见 App 侧处理函数）。`Sources: [src/App.tsx:467-468]()`

### 五、版本体系（快照 / 里程碑 / diff / 回滚）

25. 版本状态：`versions`（初始 `SAMPLE_VERSIONS`）、`currentVersionId`（初始 `v2.0.0-rc`）、`drawerOpen`、`viewingVersionId`。`Sources: [src/components/SceneGuidanceWorkbench.tsx:88-94]()`
26. `handleSaveSnapshot` 生成新版本号 `v2.0.<versions.length>`，`versionType: 'snapshot'`、`source: 'manual'`、`total: 91`（**分数硬编码**）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:151-169]()`
27. `handleMarkMilestone` 版本号硬编码 `v2.1.0-M`，`versionType: 'milestone'`、`total: 92`；重复点击会产生**同名版本**。`Sources: [src/components/SceneGuidanceWorkbench.tsx:171-188]()`
28. 版本历史抽屉在右缘，覆盖右栏；抽屉内每个版本行有"快照行内操作"（预览 / 回滚）。`Sources: [src/components/SceneGuidanceWorkbench.tsx:957-1076]()`
29. 预览进入只读态（`viewingVersionId`），回滚另有独立入口。`Sources: [src/components/SceneGuidanceWorkbench.tsx:270-289]()`
30. 版本对比是独立弹层 `GuidanceVersionDiffModal`，含双版本选择器、分数 delta 横幅与逐条变更列表。`Sources: [src/components/guidance/GuidanceModals.tsx:22-176]()`
31. `SAMPLE_VERSIONS` 4 条历史版本，分数递增 73 → 81 → 87 → 91，`versionType` 覆盖 snapshot / version / milestone 三态。`Sources: [src/components/guidance/guidanceMockData.ts:245-290]()`
32. `VersionType` 类型定义为 `'snapshot' | 'version' | 'milestone'`，但 `ProjectVersion.source` 是**自由字符串**（注释建议值 auto/manual/edit/milestone），不是枚举 —— 即 `source` 无类型约束。`Sources: [src/components/guidance/guidanceTypes.ts:99-114]()`

### 六、AI 教练（右栏）

33. 右栏教练是**单主体**，抽屉打开时被覆盖。`Sources: [src/components/SceneGuidanceWorkbench.tsx:834-834]()`
34. 教练有独立的会话列表（`INITIAL_COACH_SESSIONS`）与消息流（`INITIAL_COACH_MESSAGES`），与 `SceneAICoach` 的会话体系**互不相通**。`Sources: [src/components/SceneGuidanceWorkbench.tsx:101-103]()`
35. 「阶段徽章」在 0908-16 由下拉选择器简化为快捷徽章，`coachIntent` 默认 `'L4'`。`Sources: [src/components/SceneGuidanceWorkbench.tsx:99-100]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:854-854]()`
36. 教练回复可携带 `suggestedDiff`（章节 id + 章节名 + 替换文本），渲染为「应用替换」按钮，点击触发 `handleApplyDiff`。`Sources: [src/components/SceneGuidanceWorkbench.tsx:259-265]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:889-889]()`
37. 教练回复与发送都是**纯前端模拟**（`isAiThinking` + 定时器），无真实 LLM 调用。`Sources: [src/components/SceneGuidanceWorkbench.tsx:190-257]()`

### 七、其他弹层

38. `GuidanceUploadModal`（上传材料，构造 `ProjectFileItem`）与 `GuidanceCreateTodoModal`（新建待办，构造 `GuidanceTodoItem`）是两个独立导出组件，挂在本页 Modals 区。`Sources: [src/components/guidance/GuidanceModals.tsx:177-333]()` `Sources: [src/components/guidance/GuidanceModals.tsx:334-481]()` `Sources: [src/components/SceneGuidanceWorkbench.tsx:1077-1086]()`

## 规则与边界（AI 开发硬约束）

- **本页每个字段改动都必须人工核对 `ProjectItem` 是否真有该字段**（见第二节）。`React.FC` 形式让 props 失去类型保护，编译器不会替你兜底。这是本页最高优先级的约束。
- **不要"顺手修复" `currentProject.title` → `currentProject.name`**，除非同时确认 `track` → `trackLabel` 的替换与兜底对象的模型选择。当前兜底对象是 `Project` 域形状，直接改名会让兜底分支失效。正确做法是先把兜底对象改成 `ProjectItem` 形状，再统一字段。
- **stepper 的"当前阶段"是硬编码 L4**，不是数据驱动。要让阶段动态化，得改 321 行的判定逻辑，并同步核对数据里的 `status` 是否可靠。
- **版本号生成是字符串拼接，不是自增**：`v2.0.${versions.length}` 与固定 `v2.1.0-M` 会产生重名（快照重复创建 / 里程碑重复锁定）。做真实版本管理前必须换成稳定 id。
- **`total` 分数是硬编码常量（91 / 92）**，未与任何评分结果联动。改评分逻辑不会自动改版本分数。
- **本页教练与 `SceneAICoach` 是两套会话体系**：不要试图让它们共享 `activeSessionId`，两边的消息模型也不同（`CoachMessageItem` vs `ChatMessage`）。`Sources: [src/components/guidance/guidanceTypes.ts:145-156]()`
- **版本操作（快照 / diff / 回滚 / 里程碑）全量只在本页做**；项目文件夹的版本线是只读镜像（见 page-workbench 第五节）。反向改会造成两个版本真相源。
- **`onDismissTask` 与 `onTaskCompleted` 语义不同**：前者丢弃任务条且不回写，后者回写待办。不要把关闭按钮接到回写回调上。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加/改中栏 tab | `SceneGuidanceWorkbench.tsx:60` 加枚举 → `456-518` 加 tab 按钮 → `539-812` 加内容块 |
| 改 12 章大纲 | `guidanceMockData.ts:14-27` |
| 改阶段 stepper | 数据 `guidanceMockData.ts:29-36` + 渲染 `318-341`（注意 321 的硬编码） |
| 加一个版本操作方法 | `SceneGuidanceWorkbench.tsx:151-188`（参考快照/里程碑写法）+ `drawerOpen` 抽屉体 `1005-1076` |
| 改 diff 弹层 | `GuidanceModals.tsx:22-176` |
| 改任务上下文条行为 | `SceneGuidanceWorkbench.tsx:117-149`（接收）+ `395-427`（渲染）；发送端在 page-workbench |
| 改右栏教练回复 | `SceneGuidanceWorkbench.tsx:190-258` + 建议 `907-933` |
| 加弹层 | `SceneGuidanceWorkbench.tsx:1077-1086` 区；独立弹层建议放 `GuidanceModals.tsx` |

## 与 related_pages 的联动提示

- → **page-workbench**：`GuidanceTaskContext` 的生产端在项目工作台（`ProjectMemberWorkbench.tsx:86-104`），消费端在本页。改类型要两页同步，且**本页是唯一消费方**（全库唯一带载荷的跨模块链）。
- → **page-lifecycle-versions**：本页提供 L1~L6（`INITIAL_STAGE_ITEMS`）与完整版本体系，是三套阶段口径中最"全"的一处；口径对照与版本体系的统一说明在该页。
- → **page-cross-link**：本页同时是「去执行载荷」的终点与「版本/快照」的唯写方，改版本体系会影响项目文件夹的只读版本线。
- 注意：`App` 用的是命名导出（`import { SceneGuidanceWorkbench }`）而其它场景多为默认导出 —— 改导出方式会同时影响 `App.tsx:25` 与 `App.tsx:575`。`Sources: [src/App.tsx:25-25]()`
