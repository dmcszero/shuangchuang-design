---
id: nd-guidance-chapters
title: BP 章节速达条
page: page-guidance
kind: nav
importance: medium
sources:
  - src/components/SceneGuidanceWorkbench.tsx:526-543
---

## 一句话定位

BP tab 下沿的 12 章横向跳转条（「章节速达:」）。它是**跨页跳转能力的最终落点**——「已为你定位到第 N 章」这句话能否兑现，取决于本节点的高亮是否真的跟着 `activeChapterId` 走。

## 事实（每条强制可回溯）

1. 仅在 `centerTab === 'bp'` 时渲染；切到诊断/评分 tab 时整条消失。 Sources: [src/components/SceneGuidanceWorkbench.tsx:526]()
2. 固定前缀文案「章节速达:」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:528]()
3. 数据源为 `STANDARD_12_CHAPTERS`，12 个按钮文案为 `{ch.id}. {ch.name}`（如「5. 竞争分析与护城河」）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:529-541]() [src/components/guidance/guidanceMockData.ts:14-27]()
4. 当前章节按钮反色（indigo 底白字），判定为 `activeChapterId === ch.id`；其余为浅灰描边。 Sources: [src/components/SceneGuidanceWorkbench.tsx:533-537]()
5. 点击任一按钮 → `handleSelectChapter(chId)` → `setActiveChapterId(chId)` + `setCenterTab('bp')`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:530-533]() [src/components/SceneGuidanceWorkbench.tsx:112-115]()
6. 容器 `overflow-x-auto`，12 章超宽时横向滚动而非换行。 Sources: [src/components/SceneGuidanceWorkbench.tsx:527]()

## 规则与边界（AI 开发硬约束）

- **章号是字符串，不是数字**：`STANDARD_12_CHAPTERS[].id` 为 `'1'`…`'12'`，`activeChapterId` 也是 string。跨模块传参（`GuidanceTaskContext.chapterId`）与诊断卡（`DiagnosisItem.chapterId`）同口径。做「页→章」换算时不要引入数字类型，否则 `'10' < '2'` 这类字符串比较会埋雷。
- **`STANDARD_12_CHAPTERS` 是 12 章标准名的唯一真源**（`guidanceMockData.ts:14-27`）：本页章节头标题、章节头的 hint、以及本条的按钮文案都从它取。改章名只需改这一处。 Sources: [src/components/SceneGuidanceWorkbench.tsx:574]() [src/components/SceneGuidanceWorkbench.tsx:578]()
- 默认章节是**硬编码** `'5'`（`activeChapterId` 初值）；若 BP 正文不含第 5 章，默认态会指向一个空高亮位。
- 本节点只负责「选中哪一章」；**「滚动到该章正文」并不存在**——章节高亮作用于章节头横幅与 BP 正文里 `includes(`${id}.`)` 的段落高亮，不是滚动锚点。
- 章的 `hint` 字段在 mock 里是完整的一句话，但按钮只渲染 `id + name`，未渲染 `hint`。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 章名/章序变更 | `src/components/guidance/guidanceMockData.ts:14-27` | 本节点按钮、章节头、诊断卡章节标签自动跟随 |
| 支持滚动定位到章 | `:530-533` | 需给 BP 正文段落加锚点 id |
| 默认章节跟随项目 | `:86` | 硬编码 `'5'` 需按 BP 正文实际章节推导 |
| 新增「章节完成度」标记 | `:529-541` | 需引入 `RecognizedChapter`（`guidanceTypes.ts:32-39`，当前本页未消费） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-guidance-chapters-2-guidance-bp`** → `nd-guidance-bp`（BP 章节打磨区）｜`navigate` · **implemented（已实现）**
  - 触发：点击章节速达条上的任一章节按钮
  - 逻辑：handleSelectChapter(chId) → setActiveChapterId(chId) + setCenterTab('bp')。改变章节头横幅的章名与 hint，并切换 BP 正文中 `para.includes(`${id}.`)` 的琥珀高亮段落。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:112-115`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:530-533`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:601-607`
  - 备注：高亮是字符串包含判定，activeChapterId='1' 时会误命中 '11. '/'12. ' 开头的段落。
<!-- EDGES:END -->
