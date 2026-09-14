---
id: page-guidance
title: 材料打磨工作台
section: sec-growth
importance: high
view: guidance_workbench
component: src/components/SceneGuidanceWorkbench.tsx
sources:
  - src/components/SceneGuidanceWorkbench.tsx:1-1092
related_pages: ["page-workbench", "page-coach", "page-defense"]
nodes:
  - nd-guidance-topbar
  - nd-guidance-taskbar
  - nd-guidance-snapshot-banner
  - nd-guidance-chapters
  - nd-guidance-bp
  - nd-guidance-diag
  - nd-guidance-score
  - nd-guidance-coach
  - nd-guidance-version-drawer
  - nd-guidance-diff-modal
---

## 一句话定位

沉浸式材料打磨工作台（**2026-09-14 批 4 改名**，原名「全链路指导工作台」）：中栏用三个 tab（BP 正文 / 诊断 / 评分）打磨商业计划书，右栏挂 AI 教练，顶栏管阶段与版本；它同时是**项目工作台「动态待办」跳转的接收方**，也是全库唯一一处「诊断 → AI 改写 → 落回正文」的闭环发生地。

> **改名与定位口径**（用户大框架 1.3 注 + 批 4 执行）：本页定位**收窄为「材料打磨工作台」——专注可编辑文本材料的编辑与打磨**；因为 L1~L6 阶段本质上跨多个模块、不归属单一页面，所以「阶段」不构成本页职责（三套阶段口径并存的拍板项见 `issue-guidance-stage-taxonomy-mismatch`）。
> **源码事实保留**：源码内多处文案仍写作「全链路指导工作台」（如 `ProjectMemberWorkbench.tsx:936` 的「版本线（与全链路指导工作台快照同源）」与 `:950-952` 的跳转提示），且 `page-workbench` 的跳转目标也仍指向本页 `guidance_workbench`——**这些是源码事实，引用时照写，不改写**。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 组件以 `React.FC<SceneGuidanceWorkbenchProps>` 声明，接收 `projects` / `selectedProject` / `onSelectProject` / `session` / `taskContext` / `onDismissTask` / `onTaskCompleted` 七个 props。 Sources: [src/components/SceneGuidanceWorkbench.tsx:49-58]() [src/components/SceneGuidanceWorkbench.tsx:62-70]()
2. 由 `App.tsx` 在 `activeTab === 'guidance_workbench'` 时挂载。 Sources: [src/App.tsx:662-672]()
3. **属于沉浸式布局**（白名单内）：页面不滚动、无内边距、根容器 `h-[calc(100vh-4rem)] overflow-hidden`。 Sources: [src/App.tsx:597]() [src/components/SceneGuidanceWorkbench.tsx:291]()
4. `currentProject` 有三级回退：`selectedProject` → `projects[0]` → 内置默认对象。 Sources: [src/components/SceneGuidanceWorkbench.tsx:72-80]()
5. **布局是两栏**：中栏（`flex-1`）+ 右栏 AI 教练（`w-80 lg:w-96`）；**左栏已在 0908-16 移除**，版本抽屉以绝对定位覆盖右栏而非另开一栏。 Sources: [src/components/SceneGuidanceWorkbench.tsx:82]() [src/components/SceneGuidanceWorkbench.tsx:458-461]()

**二、中栏三 tab（页面级结构）**

6. `CenterTab` 联合类型三值 `bp` / `diag` / `score`，默认 `bp`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:60]() [src/components/SceneGuidanceWorkbench.tsx:83]()
7. tab 切换按钮组在 `:463-499`，三处 `setCenterTab`；**这是页面级子导航，不单独下钻为节点**（与 `page-workbench` 的处理一致）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:463-499]()
8. **切到诊断 tab 的入口有三个**：中栏 tab 按钮（`:478`）、顶栏 L1~L6 stepper（`:326`）、右栏「意图聚焦」徽章（`:866`）——后两者**都只切 tab、不传阶段**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:478]() [src/components/SceneGuidanceWorkbench.tsx:326]() [src/components/SceneGuidanceWorkbench.tsx:866]()
9. 中栏底部状态栏（`:823-837`）显示项目名 / 赛道 / 主导创新类型 / `bpContent.length` 字数，右侧写死「AI 全链路中枢联机就绪」——**纯展示，不单独下钻为节点**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:823-837]()

**三、本地 state 全景**

10. 本页共 18 个 `useState`：`centerTab` / `bpMode` / `bpContent` / `activeChapterId` / `versions` / `currentVersionId` / `drawerOpen` / `viewingVersionId` / `stageProgress` / `chatCollapsed` / `coachIntent` / `sessions` / `activeSessionId` / `messages` / `inputText` / `isAiThinking` / `diffModalOpen` / `saveSuccessTip`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:83-109]()
11. 其中 **4 个是死状态**（声明后无消费）：`chatCollapsed`（`:99`）、`coachIntent`（`:100`，`setCoachIntent` 从未调用）、`sessions`（`:101`）、`activeSessionId`（`:102`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:99-102]()
12. 默认章节 `activeChapterId = '5'`（硬编码），对应「第5章 竞争分析与护城河」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:86]()
13. 数据源全部来自 `guidance/guidanceMockData.ts`：`STANDARD_12_CHAPTERS` / `INITIAL_STAGE_ITEMS` / `SAMPLE_BP_CONTENT` / `SAMPLE_VERSIONS` / `SAMPLE_TRIAGE` / `SAMPLE_DIAGNOSIS` / `SAMPLE_ASSESSMENT` / `INITIAL_COACH_SESSIONS` / `INITIAL_COACH_MESSAGES`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:6-16]()

**四、跨页契约 `taskContext`**

14. `taskContext` 是唯一从外部注入业务的通道，在本文件出现于：props 声明（`:55`）、解构（`:67`）、去重判断（`:120-121`）、章节定位（`:122-125`）、引导消息构造（`:126-132`）、跳转按钮（`:136-141`）、完成回调（`:145-146`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:55]() [src/components/SceneGuidanceWorkbench.tsx:119-133]() [src/components/SceneGuidanceWorkbench.tsx:135-149]()

## 规则与边界（AI 开发硬约束）

- **`drawerOpen` 是内部 state，无外部入参**：没有任何 props 能控制右缘版本抽屉的开合，这是「项目文件夹 → 版本历史」跳转无法实现的直接原因。 Sources: [src/components/SceneGuidanceWorkbench.tsx:93]()
- **本页是「事实下沉的终点」**：v1 里本页只有 2 个最小节点；v2 已按可见交互单元拆到 **10 个节点**。页面文档只保留页面级事实（挂载 / 布局 / tab 分发 / state 全景 / 跨页契约），节点内事实不要回写到这里。
- **四处「看起来实现了、实际没有」的功能**（本轮新增核实，逐条见对应节点）：
  1. 任务条「完成并回写待办」只关条不回写（`nd-guidance-taskbar`）；
  2. 快照只读预览不显示快照内容（`nd-guidance-snapshot-banner`）；
  3. AI 改写「应用至对应章节」实为追加到全文末尾（`nd-guidance-bp`）；
  4. 版本 diff 弹层正文写死、不随所选版本变化（`nd-guidance-diff-modal`）。
- **两套会话实现并存**：本页右栏 AI 教练（简版 if-else）与 `page-coach` 的 `SceneAICoach`（完整版）零共享，详见 `nd-guidance-coach`。
- **口径（v0.4 硬约束 3，2026-09-14）**：右栏「AI 备赛伴学教练」是**内嵌简版辅助栏**，**不属**框架 1.1「AI助手」（1.1 = `page-coach` 本体，含会话历史与新建对话）；两套会话是否统一是待拍板项 `issue-product-coach-session-unification`，**不擅自合并表述、也不替产品选留存哪套**。
- **两套诊断口径并存**：本页「全维诊断报告」读 `SAMPLE_DIAGNOSIS`，`page-workbench` 体检区读 `mockProjects.ts` 的 `tier1Scores` / `logicGaps`，互不相通。
- **本页所有 `alert()` 均为占位反馈**（导出计划书、标里程碑、应用 AI 改写、完成回写），接真实链路时需整体替换；不要把 alert 文案当作能力承诺引用。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 支持外部打开版本抽屉 | `:93` | 新增 props 并在 App 层串入跳转链路（见边 `e-workbench-folder-2-guidance-version-drawer`） |
| 让「完成」真正回写待办 | `:144-149` | 见边 `e-guidance-taskbar-2-workbench-todo-writeback` |
| 版本线与项目文件夹同源 | `:89` | 见边 `e-workbench-folder-2-guidance-versionline-reuse` |
| 阶段（L1~L6）真正驱动内容 | `:100` / `:321` / `:866` | 引入阶段 state，替换 4 个死状态中的 `coachIntent` |
| 本页与 `page-coach` 会话统一 | 两处 state 与 mock | 需产品先定保留哪一套 |
| 接入真实数据 | `guidanceMockData.ts` 全文件 | 9 个导出常量逐一替换 |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-guidance-topbar` | 全局引导顶栏 | bar | 293-399 | → 抽屉（navigate+writeback）、→ diff 弹层、→ 诊断 tab |
| `nd-guidance-taskbar` | 任务上下文条 | bar | 402-433 | → 项目工作台待办（**intended·high**）、→ BP 章节 |
| `nd-guidance-snapshot-banner` | 快照只读预览提示条 | bar | 436-455 | 入边 ← 版本抽屉 |
| `nd-guidance-chapters` | BP 章节速达条 | nav | 526-543 | → BP 打磨区 |
| `nd-guidance-bp` | BP 章节打磨区 | panel | 503-629 | → AI 教练（AI 深度诊断此章）、入边 ← 教练回写 |
| `nd-guidance-diag` | 全维诊断报告 | panel | 632-737 | → BP 打磨区、→ AI 教练 |
| `nd-guidance-score` | 六维评分详情 | panel | 740-817 | 无 |
| `nd-guidance-coach` | 右栏 AI 备赛伴学教练 | panel | 841-961 | → BP 打磨区（回写 diff）、→ 诊断 tab |
| `nd-guidance-version-drawer` | 版本历史抽屉 | drawer | 963-1080 | → diff 弹层、→ 快照提示条 |
| `nd-guidance-diff-modal` | 版本快照差异比对弹层 | modal | `GuidanceModals.tsx:23-175` | 无 |

> **未下钻为节点的页面级结构**：中栏三 tab 切换按钮组（463-499）、中栏底部状态栏（823-837）、12 章正文渲染本身（591-625，属 `nd-guidance-bp` 内部）。
>
> **节点拆分依据**：①顶栏（版本与阶段动作）与任务上下文条、快照提示条三条「bar」各有独立数据域与独立开关，不可合并；②诊断 tab 的两张卡各有**独立出口**（去 BP / 去教练），出口不同故该 tab 只建 1 个节点但两条出边；③版本抽屉与 diff 弹层是两个独立组件（分处两个文件），按「被边引用的独立交互单元」建节点；④12 章速达条虽在 BP tab 内，但它是**跨页跳转的最终落点**（章节定位的唯一可指认证据），故独立成节点。

## 与 related_pages 的联动提示

- **← `page-workbench`（项目工作台）**：唯一的入边来源，且是全库唯一带业务载荷的跨模块跳转。发送方在 `nd-workbench-todo`，接收方在本页 `nd-guidance-taskbar` → 再分发到 `nd-guidance-bp`（章节定位）与 `nd-guidance-coach`（引导消息）。
- **↔ `page-coach`（AI 备赛教练）**：本页右栏与 `page-coach` 的会话能力业务重叠，但**代码零共享**——两处各自实现会话 state 与 mock。这是最明显的一处功能重复，需产品方确认是否为有意设计（简版伴学 vs 完整教练）。
- **→ `page-defense`（模拟答辩训练）**：本页 `SAMPLE_DIAGNOSIS.nextSteps` 里已有一条 `target:'defense'` 的「联动路演答辩训练舱进行巨头防御主题的极限追问实战演练」，但**该 target 字段无任何消费**，实际只会走「让 AI 执行」这条通用出口，**没有真正进入答辩模块**。此外**三套阶段口径并存**：本页 stepper 为 L1~L6、教练侧为 L1~L4、看板侧为 L1~L5（已记入 `edges.json` issues）。
- **→ 本页内部的核心闭环**：「诊断 →（让 AI 执行 / AI 深度诊断此章）→ 教练推演 →（一键应用）→ 写回 BP 正文」是本页唯一一条**成环**的链路，也是全库唯一「AI 产物落回文档」的实现（哪怕当前是追加到文末）。
