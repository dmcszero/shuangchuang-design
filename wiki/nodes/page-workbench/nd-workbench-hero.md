---
id: nd-workbench-hero
title: 项目识别头
page: page-workbench
kind: bar
importance: medium
sources:
  - src/components/ProjectMemberWorkbench.tsx:156-208
---

## 一句话定位

项目工作台顶部的项目身份横幅：一眼交代「这是哪个项目、谁在做、对标金奖还差多少」，并提供通往官方打分细则的唯一入口。

## 事实（每条强制可回溯）

1. 根容器带稳定 id `project-member-workbench`，可作为自动化测试/锚点定位使用。 Sources: [src/components/ProjectMemberWorkbench.tsx:154]()
2. 徽章组四项：学院（`session.university || project.college`）、赛道（`project.trackLabel`）、评级档位+综合得分（`project.grade` 档种子 · 综合得分 `project.totalScore`）、当前阶段（`project.stageName` (`project.currentStage`)）。 Sources: [src/components/ProjectMemberWorkbench.tsx:161-176]()
3. 主标题为项目名 `project.name`。 Sources: [src/components/ProjectMemberWorkbench.tsx:178-180]()
4. 元信息行四项：项目编号 `project.code`、负责人 `project.leader` (+`session.roleLabel`)、指导老师 `project.advisor`、已绑定辅导专家（`project.assignedMentorName` 为空时回退为「赵元博（国赛资深专家）」）。 Sources: [src/components/ProjectMemberWorkbench.tsx:182-187]()
5. 右侧大数字为「国赛金奖对标匹配度」`project.goldSimilarity`%，副标注「AI 置信度」`project.aiConfidence`%。 Sources: [src/components/ProjectMemberWorkbench.tsx:191-197]()
6. 「查看2026官方打分细则」按钮触发 prop `onOpenRulesConfig`。 Sources: [src/components/ProjectMemberWorkbench.tsx:199-205]()

## 规则与边界（AI 开发硬约束）

- 本节点**无任何本地 state**，全部数据来自 `session` 与 `project` 两个 props。
- 已绑定辅导专家存在**兜底默认值**，会让「未绑定」与「已绑定赵元博」在 UI 上无法区分。 Sources: [src/components/ProjectMemberWorkbench.tsx:186]()
- 背景装饰层为纯样式（`pointer-events-none`），不影响交互。 Sources: [src/components/ProjectMemberWorkbench.tsx:158]()
- 布局在 `lg` 断点从纵向切换为横向，改这里要同时核对窄屏。 Sources: [src/components/ProjectMemberWorkbench.tsx:159]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增身份徽章 | `:161-176` | 需确认 `ProjectItem` 有对应字段 |
| 打分细则入口改为新页而非弹层 | `:199-205` | `page-workbench` 的入边/出边（当前指向 `modal-rules-config`） |
| 去掉专家兜底默认值 | `:186` | 会暴露空态，需补 UI |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-workbench-hero-2-modal-rules`** → `modal-rules-config`（评审规则配置）｜`navigate` · **implemented（已实现）**
  - 触发：点击「查看2026官方打分细则」按钮
  - 逻辑：prop onOpenRulesConfig → App 层 () => setIsRulesModalOpen(true) → 渲染 RulesConfigModal。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:199-205`
  - 出处：`src/App.tsx:696`
  - 出处：`src/App.tsx:869-872`
<!-- EDGES:END -->
