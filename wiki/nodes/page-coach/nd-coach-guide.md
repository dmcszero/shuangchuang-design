---
id: nd-coach-guide
title: 会话引导页（空态首屏）
page: page-coach
kind: panel
importance: high
sources:
  - src/components/SceneAICoach.tsx:1990-2016
  - src/components/SessionGuidePage.tsx:101-252
---

## 一句话定位

AI 助手的空会话首屏：一句「AI 备赛教练，我帮你」+ 8 个推荐任务胶囊 + 一张居中的输入卡片——用户在这里从「不知道能问什么」变成「点一下就有提示词」。

## 事实（每条强制可回溯）

1. 触发条件是 `isNewChatMode || messages.length === 0`：**新建对话**或**当前会话没有任何消息**时渲染；否则渲染会话历史视图。 Sources: [src/components/SceneAICoach.tsx:1990]()
2. 主标题「AI 备赛教练，我帮你」带稳定 id `guide-page-main-title`。 Sources: [src/components/SessionGuidePage.tsx:168-172]()
3. 推荐任务胶囊数据源是本文件导出的常量 `GUIDE_TASK_PILLS`，共 8 项：项目完整诊断 / 全流程模拟答辩 / 5道高频答辩题 / 商业模式速诊 / 技术壁垒核查 / 赛道规则解读 / 竞品壁垒透视 / 财务模型测算（每项含 `id/title/icon/agentId/prompt`）。 Sources: [src/components/SessionGuidePage.tsx:20-77]()
4. 点击胶囊 = `handleSelectTask`：把 `task.prompt` 灌进输入框 + 切换推荐智能体（`onSelectAgent(task.agentId)`）+ 显示 2.5s 提示气泡「已载入「X」提示词，点击发送即可开始」+ 50ms 后聚焦输入框并把光标移到末尾。 Sources: [src/components/SessionGuidePage.tsx:140-156]()
5. 胶囊区是横向轮播：`overflow-x-auto no-scrollbar` + 左右两个圆形箭头按钮（各 `scrollBy({left: ±240})`），胶囊容器 id `guide-task-pills-container`。 Sources: [src/components/SessionGuidePage.tsx:176-222]()
6. 输入卡片复用 `ChatComposer` 的居中形态（`isCenteredMode={true}` + `externalInputRef`），弹层方向随该标志从 `bottom-full` 改成 `top-full`。 Sources: [src/components/SessionGuidePage.tsx:225-250]() [src/components/ChatComposer.tsx:100]()
7. **首屏发送不直接建会话**：`handleSendMessage` 在 `isNewChatMode` 时先调 `onStartSessionFromGuide(query, [userMsg])` 拿到新 sessionId，再在 map 中登记该条消息。 Sources: [src/components/SceneAICoach.tsx:1707-1735]()
8. 引导页**不显示 ReAct 过程、不显示消息流**：`isThinking` 只作为 prop 传下去控制发送按钮禁用与占位文案。 Sources: [src/components/SessionGuidePage.tsx:79-121]() [src/components/ChatComposer.tsx:629-637]()

## 规则与边界（AI 开发硬约束）

- 首屏 = 「无消息」的通用兜底：把某个会话的消息清空也会回到这里，**不要在这里做「首次登录才显示」之类的判断**。
- 胶囊点击会**覆盖输入框内容**（直接 `setInputValue(task.prompt)`），用户在输入框里写了半截再点胶囊会丢。
- `GUIDE_TASK_PILLS` 是**导出常量**（被外部引用），改数据结构要全局搜引用。
- 胶囊的 `agentId` 只影响「推荐哪个专家智能体」，**不改路由**——真正决定行为的是 prompt 文本被 `handleCustomTextQuery` 的关键词匹配（见 `nd-coach-stream`）。
- 引导页与历史视图共用同一个 `inputValue` state，切换视图不会清空输入。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 增删推荐任务胶囊 | `SessionGuidePage.tsx:20-77` | `agentId` 只能是 5 个专家之一（`EXPERT_AGENTS`） |
| 胶囊按角色/项目定制 | `:20-77` | 需把常量改为按 props 计算 |
| 引导页加「最近会话」入口 | `:158-250` | 需新增 props，注意 `nd-coach-sessions` 已有列表 |
| 改首屏标题/文案 | `:168-172` | 对外表述，需与产品口径一致 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-sessions-2-guide-read`** ← `nd-coach-sessions`（会话历史与新建对话）｜`navigate` · **implemented（已实现）**
  - 触发：点击「新建对话」（侧栏 + 按钮 / 导航项）
  - 逻辑：setActiveTab('new_chat') → SceneAICoach 以 isNewChatMode 渲染：effect 清空 messages/liveReAct/isThinking → 落到引导页分支。
  - 出处：`src/App.tsx:439-443`
  - 出处：`src/components/Sidebar.tsx:528-536`
  - 出处：`src/components/SceneAICoach.tsx:432-441`
  - 出处：`src/components/SceneAICoach.tsx:1990`

**出边 1 条**

- **`e-coach-guide-2-composer-prefill`** → `nd-coach-composer`（消息输入区与能力配置）｜`writeback` · **implemented（已实现）**
  - 触发：点击 8 个推荐任务胶囊中的任一个
  - 逻辑：handleSelectTask：setInputValue(task.prompt) + onSelectAgent(task.agentId) + 2.5s 提示气泡 + 50ms 后聚焦输入框并把光标移到末尾。
  - 出处：`src/components/SessionGuidePage.tsx:140-156`
  - 出处：`src/components/SessionGuidePage.tsx:196-208`
  - 备注：会覆盖输入框已有内容。
<!-- EDGES:END -->
