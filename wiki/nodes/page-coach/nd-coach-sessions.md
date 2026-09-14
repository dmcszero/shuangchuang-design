---
id: nd-coach-sessions
title: 会话历史与新建对话
page: page-coach
kind: nav
importance: high
sources:
  - src/components/Sidebar.tsx:511-593
  - src/App.tsx:73-76
---

## 一句话定位

AI 助手的「会话层」：侧栏底部列出历史会话、可折叠、可删除、可新建；它是框架 1.1「AI助手（含会话历史、新建对话）」的最小可指认载体，也是 `new_chat` 这个独立 tab 的入口。

## 事实（每条强制可回溯）

1. 会话数据分两处持有：`standaloneSessions`（无空间归属）与 `spaces[].sessions`（备赛空间内）；`activeSpaceId` 初值恒为 `'none'`，`activeSessionId` 初值取 `initialMergedSessions[0].id`。 Sources: [src/App.tsx:73-76]()
2. 「会话历史」区块**仅对学生端与校管端渲染**（`session.role === 'team_member' || 'school_admin'`），导师端与 Admin 端整块不出现。 Sources: [src/components/Sidebar.tsx:511-513]()
3. 区块标题为「会话历史 ({allSessions.length})」并带折叠箭头，点击切换本地 state `isSessionsExpanded`（初值 true）。 Sources: [src/components/Sidebar.tsx:515-526]() [src/components/Sidebar.tsx:110]()
4. 右侧「+」按钮（id `btn-create-standalone-session`）**只做 `setActiveTab('new_chat')`**，不创建数据——真正的会话记录由首次发送消息时触发（见事实 6）。 Sources: [src/components/Sidebar.tsx:528-536]()
5. 列表项点击 = `onSelectSession(sess.id)` + `setActiveTab('coach')`；展示内容为任务图标 + 清洗后的标题 + 时间，悬停时出现删除按钮（`onDeleteSession`，`e.stopPropagation()`）。 Sources: [src/components/Sidebar.tsx:541-583]()
6. App 侧的会话操作：`handleSelectSession('none', id)` 直接设 `activeSpaceId='none'` + `activeSessionId`；`handleDeleteSession` 删完若删到当前会话则自动切到剩余第一条；`handleStartSessionFromGuide(prompt, msgs)` 才真正新建会话（标题 = 提问前 18 字 + '...'）。 Sources: [src/App.tsx:359-366]() [src/App.tsx:446-467]() [src/App.tsx:409-437]()
7. 消息内容由 `sessionHistoryMap`（`Record<sessionId, ChatMessage[]>`，初值 `mockSessionHistories`）驱动；切换会话时若该 id 既不在 map 也不在 mock 中，则 `setMessages([])`——**空消息即回落到会话引导页**。 Sources: [src/components/SceneAICoach.tsx:423-429]() [src/components/SceneAICoach.tsx:432-472]()
8. 标题自动改写：仅当处于非新建模式且当前标题含「新会话」或「初始」时，把标题替换为本次提问前 18 字（调 `onUpdateSessionTitle`）。 Sources: [src/components/SceneAICoach.tsx:1737-1741]() [src/App.tsx:469-483]()
9. **备赛空间（ProjectSpace）没有 UI 入口**：Sidebar 与 ChatComposer 都接收 `spaces`/`activeSpaceId`/`onSelectSpace`/`onCreateSpace` 等 props，但组件体内均未使用；因此 `activeSpaceId` 恒为 `'none'`、`currentActiveSpace` 恒为 `null`，建空间/切空间/云同步三条链路全部不可达。 Sources: [src/components/Sidebar.tsx:76-80]() [src/components/ChatComposer.tsx:36-39]() [src/components/ChatComposer.tsx:60-73]() [src/App.tsx:557-558]()

## 规则与边界（AI 开发硬约束）

- **会话状态在 App 层**（`standaloneSessions` / `activeSessionId`），组件只读写 props；想加「重命名/置顶/搜索会话」要先扩 App 的 handler，而不是在 Sidebar 里塞本地 state。
- 删会话**没有二次确认**（点击即删），且删除不可撤销（无回收站）。
- `new_chat` 是一个独立 tab：`activeTab === 'new_chat'` 与 `'coach'` 共用 SceneAICoach，但以 `isNewChatMode` 区分——进入后只有真正发送消息才会落成一条会话记录，**中途离开不会留下空会话**。
- 会话标题、时间、消息全部来自 mock（`mockSessionMessages.ts` / `mockSpaceData.ts`），**没有后端**；接真实链路时这一层是替换点。
- 空间（ProjectSpace）能力目前是**死结构**（见事实 9）：改它与删它都要显式决策，别以为它在跑。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增/删除/重命名会话 | `src/App.tsx:409-483` | Sidebar 列表 UI（`Sidebar.tsx:511-593`） |
| 会话列表加搜索/置顶 | `Sidebar.tsx:511-593` | 会引入新 state，注意别与 `isSessionsExpanded` 混 |
| 删除加二次确认 | `Sidebar.tsx:568-580` | 纯 UI，无上下游 |
| 启用备赛空间 | `Sidebar.tsx:76-80` + `ChatComposer.tsx:36-39` | App 的 `spaces` 一族 handler（:348-357 / 367-407 / 485-495）已就绪，缺的是 UI |
| 会话数据接后端 | `src/App.tsx:73-76` | `mockSessionMessages.ts` 与 `mockSpaceData.ts` 同时退役 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-coach-sessions-2-stream-read`** → `nd-coach-stream`（会话消息流）｜`read` · **implemented（已实现）**
  - 触发：（无触发，会话索引驱动）
  - 逻辑：activeSessionId + sessionHistoryMap 决定渲染哪条会话的消息；activeSpaceId 恒为 'none' 故走 standaloneSessions 分支；切换会话时若该 id 无历史则 setMessages([])。
  - 出处：`src/App.tsx:73-76`
  - 出处：`src/components/SceneAICoach.tsx:423-472`
- **`e-coach-sessions-2-guide-read`** → `nd-coach-guide`（会话引导页（空态首屏））｜`navigate` · **implemented（已实现）**
  - 触发：点击「新建对话」（侧栏 + 按钮 / 导航项）
  - 逻辑：setActiveTab('new_chat') → SceneAICoach 以 isNewChatMode 渲染：effect 清空 messages/liveReAct/isThinking → 落到引导页分支。
  - 出处：`src/App.tsx:439-443`
  - 出处：`src/components/Sidebar.tsx:528-536`
  - 出处：`src/components/SceneAICoach.tsx:432-441`
  - 出处：`src/components/SceneAICoach.tsx:1990`
<!-- EDGES:END -->
