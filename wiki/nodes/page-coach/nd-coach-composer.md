---
id: nd-coach-composer
title: 消息输入区与能力配置
page: page-coach
kind: form
importance: high
sources:
  - src/components/SceneAICoach.tsx:2859-2905
  - src/components/ChatComposer.tsx:60-757
---

## 一句话定位

AI 助手的输入与「装配台」：一条输入框 + 四个能力下拉（上传文件 / 专家智能体 / 技能 / MCP 连接器）+ 语音与发送——决定这次提问「带哪些文件、由哪个专家、开哪些技能」作答。

## 事实（每条强制可回溯）

1. 会话视图里输入区是**吸底常驻**（`sticky bottom-0`），仅在会话历史视图出现；空态首屏用的是同一个组件但居中形态。 Sources: [src/components/SceneAICoach.tsx:2859-2876]() [src/components/SceneAICoach.tsx:1990-2016]()
2. 输入框为 textarea（id `chat-composer-textarea`），**Enter 发送、Shift+Enter 换行**；发送后清空并禁用（`!inputValue.trim() || isThinking`）。 Sources: [src/components/ChatComposer.tsx:158-172]() [src/components/ChatComposer.tsx:255-269]() [src/components/ChatComposer.tsx:627-640]()
3. 四个能力下拉**同时只开一个**（互相 `setXxx(false)`），点击组件外部统一关闭（`mousedown` 监听 + 容器包含判断）。 Sources: [src/components/ChatComposer.tsx:106-118]() [src/components/ChatComposer.tsx:274-291]()
4. 「上传文件」是二选一菜单（id `btn-upload-menu`）：①选择项目文件 → 打开项目文件弹层；②上传本地文件或图片 → 触发隐藏 `<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt">`。 Sources: [src/components/ChatComposer.tsx:274-352]() [src/components/ChatComposer.tsx:183-192]()
5. 本地文件是**纯前端态**：读 `File.name`/`File.size` 造 chip，图片额外 `URL.createObjectURL` 出缩略图；移除时 `revokeObjectURL`。文件内容从不上传，也没有 provider 消费它。 Sources: [src/components/ChatComposer.tsx:127-152]() [src/components/ChatComposer.tsx:154-162]()
6. 「专家智能体」下拉（id `btn-expert-agent-menu`）列出 `EXPERT_AGENTS` 5 位，选中即 `onSelectAgent` + toast「已切换为「X」」；当前专家决定按钮上的头像与名称。 Sources: [src/components/ChatComposer.tsx:354-410]() [src/components/ChatComposer.tsx:103]()
7. 「技能」下拉（id `btn-skills-menu`）列出 `COACH_SKILLS`，全选/清空两个快捷按钮，计数显示为 `技能 (n)`。 Sources: [src/components/ChatComposer.tsx:412-500]()
8. 「连接器」下拉（id `btn-connectors-menu`）列出 `MCP_CONNECTORS`，每项硬编码绿字「已连接」+ 记录数，同样有全选/清空。 Sources: [src/components/ChatComposer.tsx:502-590]()
9. 「选择项目文件」弹层（`:646-757`）按 `filteredProjectFiles`（文件名或 typeLabel 子串匹配）过滤 `availableFiles`，点击行即切换 `mentionedFiles`，底部显示已勾选数与「确定引用」。 Sources: [src/components/ChatComposer.tsx:176-179]() [src/components/ChatComposer.tsx:680-750]()
10. 已引用文件以 chip 形式**显示在输入框上方**（项目文件 sky 色、本地文件 emerald 色），可单个移除；发送时 `mentionedFiles` 随消息落进 `msg.mentionedFiles`。 Sources: [src/components/ChatComposer.tsx:209-253]() [src/components/SceneAICoach.tsx:1713-1721]()
11. **技能/连接器的选择不参与任何推理**：`selectedSkillIds`/`selectedMcpIds` 只在 UI 展示计数与勾选态，消息里唯一记录它们的地方是 `callMeta`（浅度调用卡）中的引擎名，没有按选择过滤逻辑。 Sources: [src/components/ChatComposer.tsx:412-590]() [src/components/SceneAICoach.tsx:218-236]()
12. 语音按钮只切换 `isRecording` 并弹 toast（「语音输入已开启/已结束」），**无录音实现**。 Sources: [src/components/ChatComposer.tsx:598-625]()
13. 组件声明了 `spaces`/`activeSpace`/`activeSpaceId`/`onSelectSpace`/`onCreateSpace`/`isNewSessionMode` 六个 props，但**均未解构使用**；文件顶部导入的 `RECOMMENDED_TASKS` 与 `AiMascot` 亦为未使用导入。 Sources: [src/components/ChatComposer.tsx:33-49]() [src/components/ChatComposer.tsx:60-73]() [src/components/ChatComposer.tsx:14-19]()

## 规则与边界（AI 开发硬约束）

- 输入区**不承载业务逻辑**：所有意图识别在 `SceneAICoach.handleCustomTextQuery`（关键词匹配），这里只负责收集文本与附件。
- `mentionedFiles` 只影响 UI 与消息标注，**不参与任何检索**——「AI 结合文件解答」是文案承诺，未实现（见 issue `issue-coach-file-mention-not-used`）。
- 项目文件列表来自 prop `availableFiles`，在 SceneAICoach 里是本地常量 `DEFAULT_WORKSPACE_FILES`（4 个写死的文件名），与右侧产物库 `ALL_PROJECT_DELIVERABLES` **不是同一份数据**。
- 技能/连接器是**演示用配置面板**：改动它们不会改变回答，若要让其生效需先在 `handleTriggerAction`/`handleCustomTextQuery` 里接入过滤。
- 弹层的 `popoverPosition` 由 `isCenteredMode` 决定方向：同一组件在首屏向上弹、在底部向下弹，改一处要两边看。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让技能/连接器真正生效 | `:412-590` | `SceneAICoach.tsx:1017-1562`（触发分发）需读取选择 |
| 附件真正参与检索 | `:127-179` | 需新增「上传 → 解析 → 注入 prompt」链路 |
| 项目文件改为真实产物库 | `SceneAICoach.tsx:34-72` | 会与 `RightWorkspacePanel.ALL_PROJECT_DELIVERABLES` 合并去重 |
| 启用备赛空间选择 | `:36-39` | 见 `nd-coach-sessions` 事实 9（当前整套是死结构） |
| 清理无用 props/导入 | `:14-19` `:33-49` | 纯清理，需回归两处调用点（首屏 / 底部） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-coach-guide-2-composer-prefill`** ← `nd-coach-guide`（会话引导页（空态首屏））｜`writeback` · **implemented（已实现）**
  - 触发：点击 8 个推荐任务胶囊中的任一个
  - 逻辑：handleSelectTask：setInputValue(task.prompt) + onSelectAgent(task.agentId) + 2.5s 提示气泡 + 50ms 后聚焦输入框并把光标移到末尾。
  - 出处：`src/components/SessionGuidePage.tsx:140-156`
  - 出处：`src/components/SessionGuidePage.tsx:196-208`
  - 备注：会覆盖输入框已有内容。

**出边 2 条**

- **`e-coach-composer-2-stream-send`** → `nd-coach-stream`（会话消息流）｜`writeback` · **implemented（已实现）**
  - 触发：发送消息（Enter 或发送按钮）
  - 逻辑：ChatComposer.handleSubmit → SceneAICoach.handleSendMessage：清空输入、追加学生消息（带 mentionedFiles）、新建态先 onStartSessionFromGuide 落一条会话、标题含「新会话/初始」时改写为提问前 18 字，随后把文本交给 handleCustomTextQuery 的关键词路由产出回答。
  - 出处：`src/components/ChatComposer.tsx:158-172`
  - 出处：`src/components/ChatComposer.tsx:627-640`
  - 出处：`src/components/SceneAICoach.tsx:1707-1749`
- **`e-coach-composer-2-stream-mention-intended`** → `nd-coach-stream`（会话消息流）｜`writeback` · **intended（设计有·未实现）**｜severity: medium
  - 触发：@ 引用项目文件后提问（输入框 placeholder 承诺）
  - 设计依据：输入框 placeholder「输入内容，输入 @ 可引用项目文件提问，或点击上方推荐任务载入提示词...」src/components/ChatComposer.tsx:264；项目文件弹层副标题「AI 备赛助手将在当前会话中深度结合该文件解答」src/components/ChatComposer.tsx:673
  - 期望行为：被引用的项目文件（以及上传的本地文件）应进入模型上下文并影响回答内容。
  - **卡点**：mentionedFiles / localUploadedFiles 只写进 msg.mentionedFiles 用于渲染 chip 与标记，全仓无检索或注入消费方；本地文件甚至只有文件名与大小（不读内容）。
<!-- EDGES:END -->
