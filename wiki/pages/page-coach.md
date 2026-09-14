---
id: page-coach
title: AI 助手（备赛教练）
section: sec-coach
importance: high
view: coach
component: src/components/SceneAICoach.tsx
sources:
  - src/components/SceneAICoach.tsx:1-2965
related_pages: ["page-workbench", "page-guidance", "page-defense", "page-assets"]
nodes:
  - nd-coach-sessions
  - nd-coach-guide
  - nd-coach-composer
  - nd-coach-stream
  - nd-coach-react
  - nd-coach-atomic
  - nd-coach-deep
  - nd-coach-defense
  - nd-coach-workspace
  - nd-coach-review
---

## 一句话定位

学生端的会话式主入口（框架 1.1「AI助手」本体，含会话历史与新建对话）：左中两栏是「问-答-出卡片」的对话流，右栏挂独立产物区；它同时是 4.1↔4.2/4.3 跨模块调用的发起方与接收方，也是产物审批意见回到对话的地方。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'coach' || activeTab === 'new_chat'` 时挂载，接收 27 个 props（会话一族 / 右栏一族 / 审核一族 / 场景跳转）。 Sources: [src/App.tsx:630-673]()
2. 本页在**沉浸式布局白名单**内（`coach`/`new_chat`/`guidance_workbench`/`asset_management`）：外层容器 `overflow-hidden`，`main` 改为 `h-[calc(100vh-4rem)] overflow-hidden p-0 flex flex-col`——页面自身管理滚动，且**不显示全局页脚**。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]() [src/App.tsx:783-787]()
3. 右栏（`RightWorkspacePanel`）与 4px 拖拽分割线**只挂在 `activeTab === 'coach'`**：切到 `new_chat` 时右栏整体消失。 Sources: [src/App.tsx:796-825]() [src/App.tsx:831-833]()
4. 顶栏标题随会话变化：`new_chat` 显示「新建对话」，否则显示当前会话标题（缺省回退「规划场景深度演进路径」）。 Sources: [src/App.tsx:612-620]()

**二、视图结构（两条分支）**

5. 二选一分支：`isNewChatMode || messages.length === 0` → 会话引导页（居中）；否则 → 消息流 + 吸底输入条。 Sources: [src/components/SceneAICoach.tsx:1990]() [src/components/SceneAICoach.tsx:2019-2028]() [src/components/SceneAICoach.tsx:2859-2876]()
6. 页面根容器为 `bg-[#F5F5F7]` 全高布局，内部是单列（无中栏/右栏的自家栅格）——右栏由 App 平级渲染。 Sources: [src/components/SceneAICoach.tsx:1982-1986]()

**三、页面级 state 全景（下钻节点时不要重复登记）**

7. 对话域：`messages`（当前会话消息）、`sessionHistoryMap`（按 sessionId 缓存）、`inputValue`、`isThinking`、`liveReAct`、`mentionedFiles`/`sharedFiles`、`selectedAgentId`/`selectedSkillIds`/`selectedMcpIds`。 Sources: [src/components/SceneAICoach.tsx:214-260]() [src/components/SceneAICoach.tsx:408-430]()
8. 跨模块调用域：`deepCallTarget`/`currentInputPayload`/`autoPromptHint`/`dataFlowLogs`/`showDeepExecutionModal`。 Sources: [src/components/SceneAICoach.tsx:309-317]()
9. 页内答辩域：`selectedJudge`/`defenseStep`/`defenseScores`。 Sources: [src/components/SceneAICoach.tsx:292-294]()
10. **写而不用（死状态）四处**：`bpUploaded`（只在 drawer 回调里被置 true）、`engineCallCounts`（只自增）、`hasPendingReviewFiles`（算而不用）、`isWorkspaceOpen`（只被置 false，`SharedWorkspaceDrawer` 永远打不开）。 Sources: [src/components/SceneAICoach.tsx:213]() [src/components/SceneAICoach.tsx:275-281]() [src/components/SceneAICoach.tsx:150]() [src/components/SceneAICoach.tsx:153]() [src/components/SceneAICoach.tsx:2908-2932]()
11. 会话/产物/审核三块的真源在 App 层（`standaloneSessions`、`reviewFiles`、`rightWorkspaceWidthPx` 等），本页只读写 props。 Sources: [src/App.tsx:73-117]()

**四、意图路由（本页最特殊的一层）**

12. 所有输入都要经过 `handleCustomTextQuery` 的**关键词 if-else 链**（158 行起）决定走哪个引擎：PPT/路标 → 生成产物卡；「已确认+4.2/4.3」→ 执行深度调用；「取消+调用」→ 取消；「完整诊断/全链路」→ 深度调用 4.2；「多考官/极限压力」→ 深度调用 4.3；考官名 → 出题；否则落到赛道/壁垒/BP/答辩/案例/竞品/校内/运营八组关键词。 Sources: [src/components/SceneAICoach.tsx:1564-1700]()
13. 推荐任务胶囊与底部输入的 task-* 键最终都汇到 `handleTriggerAction(actionKey)` 的同一套分支（按动作构造 ReAct 三步 + 消息卡）。 Sources: [src/components/SceneAICoach.tsx:1017-1110]()

## 规则与边界（AI 开发硬约束）

- **本页与 `page-guidance` 的右栏「AI 备赛伴学教练」是两套独立实现**（不同 state / 不同 mock / 不同消息类型，零共享）；两者是否统一是待拍板项 `issue-product-coach-session-unification`，**不要顺手合并表述或代码**。
- 产品口径：本页 = 框架 1.1「AI助手」，会话历史与新建对话是其功能子集（见 `nd-coach-sessions`）；`page-workbench` 的「AI 诊断待办 → 去执行」跳的是 `page-guidance` 而不是本页。
- 页面**没有任何真实 LLM 调用**：全部由 `executeReActWorkflow` 的 setTimeout（650/1300/2000ms）+ 硬编码文案模拟；接真实链路时这一层是主战场。
- 关键词路由既是功能也是技术债：**改任何用户可见文案都要回看关键词表**（例如预填的「已确认上述配置参数…」依赖 `已确认`+`配置`）。
- 右栏与拖拽只在 `coach` 态存在——做「新建对话也要右栏」这类需求时，改的是 App 的挂载条件而不是本页。
- 学生端「单项目绑定」在本页**没有体现**：本页的项目上下文恒为兜底字面量（见 issue `issue-coach-project-context-unbound`）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接入真实 LLM / Agent | `:1017-1562`（触发分发）+ `:524-590`（ReAct 模拟） | 消息模型 `ChatMessage`（`src/types.ts:443-485`） |
| 新增一种消息卡 | `:2106-2775` | `type` 联合 + 各 handler 载荷 |
| 让会话历史持久化 | `src/App.tsx:73-76` | `mockSessionMessages.ts` / `mockSpaceData.ts` |
| 本页与材料打磨工作台统一消息通道 | `nd-coach-stream` 与 `nd-guidance-coach` | 见 `decisions.md` 的会话统一条目 |
| 清理死状态与死弹层 | `:150` `:153` `:213` `:275-281` `:2908-2932` | 纯清理，注意 `SharedWorkspaceDrawer` 的文件保留与否要一起决定 |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-coach-sessions` | 会话历史与新建对话 | nav | Sidebar 511-593 / App 73-76 | 决定当前会话 → 其余全部节点（read） |
| `nd-coach-guide` | 会话引导页（空态首屏） | panel | 1990-2016 / SessionGuidePage | → `nd-coach-stream`（发送后转历史视图） |
| `nd-coach-composer` | 消息输入区与能力配置 | form | 2859-2905 / ChatComposer | → `nd-coach-stream`（提交消息） |
| `nd-coach-stream` | 会话消息流 | list | 2019-2830 | → `nd-coach-atomic` / `nd-coach-deep` / `nd-coach-defense`（卡片内交互） |
| `nd-coach-react` | ReAct 思考过程视图 | panel | ReActProcessView | 无（纯展示） |
| `nd-coach-atomic` | 浅度原子能力调用卡 | panel | AtomicCallCard / 856-1015 | → `nd-coach-deep`（一键升级） |
| `nd-coach-deep` | 深度调用管道（4.2 / 4.3） | panel | 596-855 / DeepCall* | → `nd-coach-stream`（结果卡回帖） |
| `nd-coach-defense` | 页内模拟答辩（4.3 浅度） | panel | 1759-1947 / 2322-2477 | → `nd-coach-stream`（复盘卡） |
| `nd-coach-workspace` | 右侧独立工作区（产物展示） | drawer | RightWorkspacePanel / App 96-215 | → `nd-coach-review`（切审核模式） |
| `nd-coach-review` | 产物审核与改进意见 | bar | RightWorkspacePanel 186-232 / App 113-180 | → `nd-coach-stream`（审批意见回帖，writeback） |

> 未下钻为节点的页面级结构：`SharedWorkspaceDrawer`（不可达弹层，2908-2932）、`OperationFlywheelModal` 运营飞轮看板（2936-2941，由输入区与飞轮消息打开）、`DeepCallConfirmModal`（不可达弹层，2946-2953）、顶栏标题与面包屑（壳层 `shell-topbar`）。
>
> **拆分依据**：十个节点各有独立数据域与独立出口（会话索引 / 引导提示词 / 输入与附件 / 消息渲染 / 过程展示 / 原子调用 / 深度管道 / 页内答辩 / 产物展示 / 审批回写），且**审批回写**与**产物展示**虽然同处一个面板，业务归宿不同（前者改文件状态并回帖会话，后者只读展示），故拆开。

## 与 related_pages 的联动提示

- **→ `page-defense`（模拟答辩训练）**：本页的 `nd-coach-defense` 是轻量替代（2 轮 / 固定 5 题 / 无录像），两套题库各自 mock；`page-workbench` 的「评委提问」建议去向（待拍板）指向的是 `page-defense` 而不是本页。
- **→ `page-guidance`（材料打磨工作台，原名全链路指导工作台）**：两者同属学生端备赛域但**无代码连接**——本页的深度调用结果是"回帖"，不写任何版本/快照；工作台的跳转入口来自 `page-workbench`。
- **→ `page-workbench`（项目工作台）**：本页读取的项目上下文与工作台当前项目**不一致**（本页走 `activeSpace`，恒为 null → 文案兜底；工作台走 `activeProjectId`）。
- **→ `page-assets`（素材与资产管理）**：本页产物区是**常量清单 + 硬编码预览**，与资产页的版本管理能力零共享；「在右侧独立区域打开」只是切面板。
