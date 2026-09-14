---
id: nd-workbench-diag-gaps
title: 逻辑断点与硬伤
page: page-workbench
kind: panel
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx:721-745
  - src/types.ts:91-97
---

## 一句话定位

「AI 对标体检」tab 下半区左侧：逐条列出项目论证链上的断裂点与硬伤，每条带位置、描述与 AI 改进建议。**它是「动态待办」的上游来源**——按产品口径，检测出断点即应自动落成一条待办。

## 事实（每条强制可回溯）

1. 区块标题「逻辑断点与硬伤分析 (N)」，N 取 `project.logicGaps.length`。 Sources: [src/components/ProjectMemberWorkbench.tsx:724-727]()
2. 数据源 `project.logicGaps`（`LogicGapItem[]`）。 Sources: [src/types.ts:123]() [src/components/ProjectMemberWorkbench.tsx:729]()
3. 每条渲染四项：`title`、位置徽章（`位置：{location}`）、`description`、以及独立高亮的「AI改进建议：{suggestion}」块。 Sources: [src/components/ProjectMemberWorkbench.tsx:731-741]()
4. 卡片为琥珀主题（`border-amber-200` + `bg-amber-50/50`），与右侧提问区的灰色主题区分。 Sources: [src/components/ProjectMemberWorkbench.tsx:730]()
5. 数据契约 `LogicGapItem`：`type` / `title` / `location` / `description` / `suggestion`。 Sources: [src/types.ts:91-97]()
6. `type` 为四值枚举：`logic_broken`（逻辑断裂）/ `data_conflict`（数据冲突）/ `tech_stack`（技术栈）/ `business_vague`（商业模糊）——**UI 未使用该字段**，四类断点在界面上不作区分。 Sources: [src/types.ts:92]()
7. 本区块与「评委提问」区块并排为 2 列网格（`lg:grid-cols-2`）。 Sources: [src/components/ProjectMemberWorkbench.tsx:721]()

## 规则与边界（AI 开发硬约束）

- **`location` 是自由文本，且与待办的定位口径不一致**——这是「断点 → 生成带章节定位的待办」的真正卡点。
  - 实测：`location` 用「**页 + 章节名**」格式，如 `'BP 第24页《发展规划与财务预测》'`。 Sources: [src/data/mockProjects.ts:91]()
  - 而动态待办的 `chapterRef` 用「**章 + 章节名**」格式，如 `'第10章 财务预测与融资计划'`。 Sources: [src/components/workbench/workbenchMockData.ts:34]()
  - 同页已有的 `chapterIdFromRef`（正则 `/第(\d+)章/`）**对 `location` 不匹配**（值是「第24页」，不含「第N章」字样），因此**无法直接复用**；需要新增「页→章」映射表，或统一两侧口径。 Sources: [src/components/ProjectMemberWorkbench.tsx:79-83]()
- **`logicGaps` 可能为空数组**（实测 `proj-002` 即为 `[]`，该项目的断点区只显示标题「(0)」）。区块**没有空态提示**，空数据时表现为一个只有标题的空卡片。 Sources: [src/data/mockProjects.ts:205]()
- 本区块**完全只读**：无按钮、无 onClick、无「去改进 / 生成待办」入口。
- `LogicGapItem` 上**没有任何 id 字段**，生成待办时无法建立「断点 ↔ 待办」的稳定对应关系，只能靠数组下标（渲染时已用 `idx` 作 key）。**要落地「一个断点一条待办」，需先给 `LogicGapItem` 加稳定 id。** Sources: [src/components/ProjectMemberWorkbench.tsx:730]()
- 断点数量、内容均来自静态 mock（`ProjectItem.logicGaps`），无生成器、无去重机制。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 断点自动生成待办 | 本区块 | ①给 `LogicGapItem` 加 `id` 与 `chapterId`；②在 `logicGaps` 变更处接入 `WORKBENCH_AI_TODOS` 生成器；③待办池须可写（见 `e-workbench-diag-gaps-2-workbench-todo`） |
| 从 `location` 提取章节号 | `:734` | 复用 `chapterIdFromRef` 的正则模式（`:79-83`） |
| 按 `type` 分类展示断点 | `:729-743` | `type` 字段已有数据，UI 可零成本接入 |
| 断点 → 跳转改造 | 本区块 | 目标为 `nd-workbench-todo`（待办），而非直达指导工作台 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-workbench-diag-gaps-2-workbench-todo`** → `nd-workbench-todo`（动态待办）｜`writeback` · **intended（设计有·未实现）**｜severity: high
  - 触发：AI 对标体检测出新的逻辑断点（系统自动生成，非用户点击触发）
  - 载荷：`GuidanceTodoItem{id, title:gap.title, stage:'L4', completed:false, priority, assignee, dueDate, chapterRef:<由 gap.location 换算>} 并带 source:'ai'`
  - 逻辑：完整链：**逻辑断点 →（自动生成）动态待办 →（点「去执行」）全链路指导工作台并定位章节**。本边为第一跳：每条 LogicGapItem 应落成动态待办中一条 source='ai' 的待办；第二跳已实现，见 e-workbench-todo-2-guidance-ai。处理入口统一收敛在动态待办，体检区不直接跳转。
  - 设计依据：产品口径（0911 #2.2）：「短板中的逻辑断点应该跟动态待办绑定，可以认为检测出逻辑断点后就会自动地在动态待办中新增一条相应待办。后续也是通过动态待办去处理。所以应该是逻辑断点--动态待办--相应模块」
  - 期望行为：体检产出 N 条逻辑断点时，动态待办中同步出现 N 条 AI 来源待办；点其「去执行」可跳到工作台对应章节；断点消除后该待办可关闭。
  - **卡点**：三处缺失：①LogicGapItem 无稳定 id（src/types.ts:91-97），无法建立「断点 ↔ 待办」一一映射；②定位口径不一致——location 是「BP 第24页《发展规划与财务预测》」（实测 src/data/mockProjects.ts:91），而待办的 chapterRef 是「第10章 财务预测与融资计划」，页面上已有的 chapterIdFromRef 正则（第N章）对前者不匹配，需新增「页→章」映射或统一口径；③待办池 WORKBENCH_AI_TODOS 是模块级静态常量，组件内无 append 入口（与 e-guidance-taskbar-2-workbench-todo-writeback 同一根因：状态层级过低）。
<!-- EDGES:END -->
