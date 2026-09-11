---
id: page-ai-agents
title: AI 能力装配层（专家/技能/连接器）
section: sec-ai
importance: medium
sources:
  - src/data/mockCoachAgentsAndSkills.ts
  - src/components/ChatComposer.tsx
  - src/components/SceneAICoach.tsx
  - src/types.ts
related_pages: [page-coach]
---

# AI 能力装配层（专家/技能/连接器）

## 一句话定位

静态装配模型层：**5 位专家智能体 × 8 项教练技能 × 5 个 MCP 连接器**，三类**各自独立配置、不做强制关联**；真正渲染装配 UI 的是 `ChatComposer` 的三个弹出菜单，而选中态的持有者是 `SceneAICoach`。

## 事实（每条强制可回溯）

### 一、5 位专家智能体

1. `EXPERT_AGENTS` 共 5 条，id 为 `policy` / `diagnosis` / `defense` / `intel` / `campus`。`Sources: [src/data/mockCoachAgentsAndSkills.ts:8-92]()`
2. 五位的名称、徽章与定位：

| id | 名称 | badge | 定位 |
|---|---|---|---|
| `policy` | 赛事政策与规则专家 | 4.1 政策引擎 | 政策百事通 · 多级规则与资格审查 |
| `diagnosis` | 商业计划与模式诊断专家 | 4.2 诊断引擎 | 金牌备赛教练 · BP深度体检与壁垒提炼 |
| `defense` | 路演答辩与模拟专家 | 4.3 答辩引擎 | 金牌备赛教练 · 评委模拟与压力质询 |
| `intel` | 行业情报与对标专家 | 4.4&4.5 情报局 | 行业情报局 · 金奖案例与竞品全景 |
| `campus` | 校内双创与智库专家 | 4.6 校内智库 | 校内智库 · 校本专属知识库与资源匹配 |

`Sources: [src/data/mockCoachAgentsAndSkills.ts:9-91]()`

3. 每位专家自带 `builtinSkills` 与 `builtinConnectors` 两个内置清单（即"推荐搭配"，不是绑定）。例如 `policy` 内置 2 技能 + 2 连接器，`diagnosis` 内置 2 技能 + 3 连接器。`Sources: [src/data/mockCoachAgentsAndSkills.ts:17-42]()`
4. `ExpertAgent['id']` 是**内联联合类型** `'diagnosis' | 'defense' | 'policy' | 'intel' | 'campus'`，同样写在了 `ChatComposerProps` 的 `selectedAgentId` / `onSelectAgent` 上（**同一个联合被复制了三处**）。`Sources: [src/types.ts:458-468]()` `Sources: [src/components/ChatComposer.tsx:42-43]()` `Sources: [src/components/SceneAICoach.tsx:140-140]()`

### 二、8 项教练技能

5. `COACH_SKILLS` 共 **8** 条，按 engine 归为 4 组（源文件用注释分组）：

| 分组 | 技能 id | 名称 | engine |
|---|---|---|---|
| 1. 政策百事通 | `sk-policy-rules` | 多级赛事规则与赛道准入 | 4.1 政策引擎 |
| | `sk-rubric-interpret` | 评审标准与导向精读 | 4.1 政策引擎 |
| 2. 金牌备赛教练 | `sk-bp-diag` | BP/PPT 穿透诊断与逻辑体检 | 4.2 诊断引擎 |
| | `sk-innovation-moat` | 创新点提炼与壁垒护城河 | 4.2 诊断引擎 |
| | `sk-defense-grill` | 路演答辩与极限压力测试 | 4.3 答辩引擎 |
| 3. 行业情报局 | `sk-gold-cases` | 近三年标杆金奖案例拆解 | 4.4 案例智库 |
| | `sk-competitor` | 竞品调研与行业痛点分析 | 4.5 产业智库 |
| 4. 校内智库 | `sk-campus` | 校本专属智库与双创资源 | 4.6 校内智库 |

`Sources: [src/data/mockCoachAgentsAndSkills.ts:94-166]()`

6. **8 项技能的 `defaultActive` 全为 `true`**。`Sources: [src/data/mockCoachAgentsAndSkills.ts:102-164]()`
7. `CoachSkillDef.engine` 是**自由字符串**而不是枚举，取值形如 `'4.1 政策引擎'` / `'4.4 案例智库'` / `'4.5 产业智库'`。`Sources: [src/types.ts:470-477]()`

### 三、5 个 MCP 连接器

8. `MCP_CONNECTORS` 共 **5** 条，每条含真实形态的 `endpoint`（`mcp://...`）、`recordsCount` 文案、`status` 与 `defaultActive`。`Sources: [src/data/mockCoachAgentsAndSkills.ts:168-219]()`

| id | 名称 | endpoint | recordsCount |
|---|---|---|---|
| `mcp-rules-reg` | 官方政策规则库 MCP | `mcp://registry/cwec-official-rules` | 国/省/校三级最新章程 |
| `mcp-expert-exp` | 评审专家经验库 MCP | `mcp://knowledge/expert-heuristics` | 1,420+ 评审打分偏好 |
| `mcp-history-cases` | 金奖标杆案例库 MCP | `mcp://database/gold-silver-cases` | 320+ 全国金奖全景案卷 |
| `mcp-industry-intel` | 产业与竞品情报 MCP | `mcp://market/industry-intel-live` | 实时企业库与行研报告 |
| `mcp-campus-repo` | 高校校本智库 MCP | `mcp://university/campus-private-kb` | 本校专属双创资源资产 |

`Sources: [src/data/mockCoachAgentsAndSkills.ts:169-218]()`

9. **5 个连接器的 `status` 全为 `'connected'`、`defaultActive` 全为 `true`**。`Sources: [src/data/mockCoachAgentsAndSkills.ts:175-217]()`

### 四、装配 UI 与状态归属

10. **状态在 `SceneAICoach`，UI 在 `ChatComposer`**：`selectedAgentId`（默认 `'policy'`）、`selectedSkillIds`、`selectedMcpIds` 三个状态由 `SceneAICoach` 持有。`Sources: [src/components/SceneAICoach.tsx:139-146]()`
11. 技能的初始选中集是 `COACH_SKILLS.filter(s => s.defaultActive).map(s => s.id)`；连接器同理 —— 即**默认全开（8 技能 + 5 连接器）**。`Sources: [src/components/SceneAICoach.tsx:141-146]()`
12. 切换技能/连接器是纯 toggle（存在即移除、不存在即追加），无依赖校验。`Sources: [src/components/SceneAICoach.tsx:148-163]()`
13. `ChatComposer` 的左控区共四个：**上传文件 / 专家选择 / 技能选择 / 连接器选择**。`Sources: [src/components/ChatComposer.tsx:260-260]()`
14. 三个弹出菜单的行号：专家（352）、技能（420）、连接器（515）。`Sources: [src/components/ChatComposer.tsx:352-352]()` `Sources: [src/components/ChatComposer.tsx:420-420]()` `Sources: [src/components/ChatComposer.tsx:515-515]()`
15. 菜单标题带实时计数：技能为「AI 备赛技能库 (n/8)」、连接器为「MCP 协议与数据连接器 (n/5)」。`Sources: [src/components/ChatComposer.tsx:426-426]()` `Sources: [src/components/ChatComposer.tsx:521-521]()`
16. 两个菜单都提供**批量操作**：全选（`forEach` 追加）与全清（`forEach` 移除）；连接器的「全启用」会弹 toast「已启用全部 5 项 MCP 连接器」。`Sources: [src/components/ChatComposer.tsx:432-445]()` `Sources: [src/components/ChatComposer.tsx:527-543]()`
17. 当前选中专家的对象由 `EXPERT_AGENTS.find(a => a.id === selectedAgentId) || EXPERT_AGENTS[0]` 解析，兜底到第一位（政策专家）。`Sources: [src/components/ChatComposer.tsx:96-96]()`
18. **装配与子智能体路由的关系**：`SceneAICoach` 的会话切换 effect 会按 `taskKey` / 标题关键词**改写 `selectedAgentId`**，但注释明确「技能与连接器由用户自主独立配置，不再强制关联」。`Sources: [src/components/SceneAICoach.tsx:370-388]()`

### 五、推荐任务（当前未接线）

19. `RECOMMENDED_TASKS` 定义了一批以 Prompt 为载体的推荐任务（每条带 `agentId` / `skills[]` / `mcps[]` / `tag` / `taskCategory`），是其"专家+技能+连接器"组合的产品化表达。`Sources: [src/data/mockCoachAgentsAndSkills.ts:221-346]()`
20. `RecommendedTaskDef` 类型含 `taskCategory`（注释写"7大任务之一"）。`Sources: [src/types.ts:490-500]()`
21. **但 `RECOMMENDED_TASKS` 全库无人使用** —— 仅在 `ChatComposer.tsx:17` 被 import，导入后无任何引用点。`Sources: [src/components/ChatComposer.tsx:17-17]()`

### 六、其他死代码

22. **`EXPERT_AGENTS` 在 `SceneAICoach.tsx:81` 被 import，但该文件内无任何使用点**（`ChatComposer` 内部自行 import 并使用）。`Sources: [src/components/SceneAICoach.tsx:78-82]()`
23. **`ChatComposerProps` 声明了 6 个从未被解构使用的 props**：`spaces` / `activeSpace` / `activeSpaceId` / `onSelectSpace` / `onCreateSpace` / `isNewSessionMode`。`Sources: [src/components/ChatComposer.tsx:30-53]()` `Sources: [src/components/ChatComposer.tsx:54-68]()`

## 规则与边界（AI 开发硬约束）

- **三类独立配置是刻意的产品设计**，不要"补回"强制关联：选 `defense` 专家不会自动打开 `sk-defense-grill`。源码注释明确写了这一点（`SceneAICoach.tsx:370`）。专家的 `builtinSkills` / `builtinConnectors` 仅用于展示"建议搭配"。
- **新增一个能力要改四处**：① 数据（`mockCoachAgentsAndSkills.ts` 对应数组）② 类型（`types.ts` 对应 interface，若加枚举值）③ `ChatComposer` 的菜单渲染（自动遍历数组，通常无需改）④ 若涉及专家 id，还要改 `ExpertAgent['id']`、`ChatComposerProps` 的两个联合、`SceneAICoach` 的 `useState` 联合 —— **同一个 id 联合被复制了三处**，漏改会导致类型不一致。
- **`defaultActive` 的语义是"初始是否选中"**，不是"是否可用"。它只被 `SceneAICoach:141-146` 消费；**专家没有对应的默认选中机制**（专家默认硬编码为 `'policy'`）。
- **`status: 'connected'` 是静态文案**：5 个连接器的状态全部写死为已连接，没有任何连接检测逻辑。做真实 MCP 接入时必须替换该字段的来源。
- **`endpoint` 是形似真实的假地址**（`mcp://registry/...`），不是可用端点。不要把它当配置读取。
- **`RECOMMENDED_TASKS` 当前是"定义了但未接线"的数据**：它有完整类型和 5+ 条内容，但 UI 里没有任何入口。接入前先确认它是否仍是当前产品意图（而非被 `mockScenarioCards` 取代）。
- **不要依赖 `builtinSkills` / `builtinConnectors` 做联动**：它们是静态清单，与用户的选中态无关。
- `CoachSkillDef.engine` 是自由字符串，**不能用于精确匹配**；需要按引擎分组时应建立显式映射表。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一位专家 | `mockCoachAgentsAndSkills.ts:8-92`（数据）+ `types.ts:459`（id 联合）+ `ChatComposer.tsx:42-43` + `SceneAICoach.tsx:140` |
| 加一项技能 | `mockCoachAgentsAndSkills.ts:94-166`（数据，注意 `defaultActive`） |
| 加一个 MCP 连接器 | `mockCoachAgentsAndSkills.ts:168-219` |
| 改默认选中集 | `SceneAICoach.tsx:141-146`（也可改数据里的 `defaultActive`） |
| 改装配菜单 UI | `ChatComposer.tsx:352`（专家）/ `420`（技能）/ `515`（连接器） |
| 改专家默认值 | `SceneAICoach.tsx:140`（当前硬编码 `'policy'`） |
| 接入推荐任务 | 当前无入口，见规则节 |
| 改 session 期专家自动切换 | `SceneAICoach.tsx:370-388` |

## 与 related_pages 的联动提示

- → **page-coach**：本页是装配层（"能选什么"），page-coach 是装配的持有者与消费方（"选了谁、怎么用"）。改状态归属（把 `selectedAgentId` 提出到 `App`）会同时影响两页。
- 与 page-defense 的区分：`defense` 专家（4.3 答辩引擎）与 `defense_training` 视图（四屏状态机）**不是同一套实现**，前者是会话内的角色，后者是独立页面。
- 注意：本页数据被 `ChatComposer` 与 `SceneAICoach` **双重 import**（后者含一处死 import），重构 import 结构时注意别引入循环依赖。
