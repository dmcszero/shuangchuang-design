---
id: nd-workbench-diag-questions
title: 评委尖锐提问攻防演练
page: page-workbench
kind: panel
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx:747-768
---

## 一句话定位

「AI 对标体检」tab 下半区右侧：预演 2026 国赛现场评委最可能抛出的尖锐问题，供团队提前备好攻防。**它的性质是「演练」，不是「待办」**——区块标题本身就是证据。

## 事实（每条强制可回溯）

1. 区块标题为「**2026国赛现场评委尖锐提问攻防演练** (N)」，N 取 `project.killerQuestions.length`。标题自带「攻防演练」定位。 Sources: [src/components/ProjectMemberWorkbench.tsx:749-752]()
2. 数据源 `project.killerQuestions`，类型为 **`string[]`**（纯字符串数组，无结构）。 Sources: [src/types.ts:124]() [src/components/ProjectMemberWorkbench.tsx:754]()
3. 每条渲染：`Q{idx+1}` 玫瑰色序号徽章 + 问题文本。 Sources: [src/components/ProjectMemberWorkbench.tsx:757-760]()
4. 「建议应对策略」为**硬编码的单句文案**，所有题目共用同一句，不随题变化。 Sources: [src/components/ProjectMemberWorkbench.tsx:762-764]()
5. 卡片为灰色主题（`bg-slate-50/70`），与左侧琥珀色的断点区区分。 Sources: [src/components/ProjectMemberWorkbench.tsx:755]()
6. 与「逻辑断点与硬伤」并排为 2 列网格。 Sources: [src/components/ProjectMemberWorkbench.tsx:721]()

## 规则与边界（AI 开发硬约束）

- **数据是 `string[]`**：无法承载「应对要点 / 佐证材料 / 回答时长 / 演练状态」等任何结构化信息。要接洽到演练场景，**必须先把类型升级为对象数组**，这属于 `ProjectItem` 的契约变更。
- 本区块**完全只读**：无按钮、无 onClick、无演练入口。
- **它与「动态待办」在语义上不同族**：待办的语义是「要改的东西」，可完成、可勾选、有责任人；提问的语义是「要准备的东西」，需要反复演练、没有终态。**这就是它不应走待办体系的根因。**
- 应对策略硬编码，且**只有一句**——即便接洽到演练场景，当前数据也喂不出有区分度的内容。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接洽到演练场景 | 本区块 | 见出边 `e-workbench-diag-questions-2-defense`（待产品确认路径） |
| 类型升级 | `killerQuestions: string[]` | → 对象数组（含 id / 问题 / 应对要点 / 佐证 / 时长），破坏性变更 |
| 应对策略差异化 | `:762-764` | 依赖上一条类型升级 |
| 作为答辩训练题库 | 本区块 | 与 `defenseConstants` 的题库合并（当前两侧各自 mock） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-workbench-diag-questions-2-defense`** → `page-defense`（模拟答辩训练）｜`navigate-with-payload` · **undefined（设计本身未定）**｜severity: high
  - 触发：（候选）点击某条评委提问 → 进入模拟答辩训练并带入该题
  - 逻辑：当前无实现。产品口径已确定「评委提问不走动态待办体系」，但去向未定，本边为候选路径之一。
  - **待确认**：评委提问不走动态待办，那走哪？**建议（待拍板）：接「模拟答辩训练」的问答对抗阶段，把它当题库用。** 三条理由：①该区块源码标题本身就写着「评委尖锐提问攻防演练」（src/components/ProjectMemberWorkbench.tsx:751），业务定位本就是演练而非任务；②提问没有终态——待办可勾掉，提问要反复练，与答辩训练的重复演练语义一致；③page-defense 已有问答对抗阶段，天然是它的下游。备选路径：单题「去练」直达 AI 教练并预填该问题（更轻，但缺少针对单题的演练结构）。接洽前必须先解的前置：killerQuestions 是 string[]（src/types.ts:124），载不动题目 id / 应对要点 / 佐证材料 / 时长；且 defenseConstants 的题库与本区块各自 mock，无共享。
<!-- EDGES:END -->
