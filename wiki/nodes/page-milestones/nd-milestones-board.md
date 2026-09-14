---
id: nd-milestones-board
title: 全生命周期看板列
page: page-milestones
kind: list
importance: high
sources:
  - src/components/MilestoneKanban.tsx:126-189
---

## 一句话定位

本页的主体：L1~L5 五列看板，每列堆着该阶段的项目卡；卡片按健康度染色（正常白 / 预警琥珀 / 严重玫红），点一张即打开项目详情抽屉——**「哪些项目卡在哪、谁快掉队」的一屏总览**。

## 事实（每条强制可回溯）

1. 标题「参赛项目全生命周期阶段分布与实时健康度监控」+ 右上「共显示 `{filteredProjects.length}` 个项目」（**唯一消费筛选结果的处**）。 Sources: [src/components/MilestoneKanban.tsx:128-133]()
2. 五列由 `stages.map` 生成，每列内部**独立**用 `projects.filter(p => p.currentStage === stage.key)` 取数（**不经过 `filteredProjects`**，因此不受阶段卡筛选影响）。 Sources: [src/components/MilestoneKanban.tsx:135-137]()
3. 列头显示阶段短名 + 该列项目数（真实派生）。 Sources: [src/components/MilestoneKanban.tsx:139-142]()
4. 项目卡内容：项目名（截断）+ 等级徽标（A 琥珀 / B 蓝 / 其他灰）、`leader` + `college` 前 4 字、`totalScore` 分；卡片带稳定键 `project.id`（无 id 锚点属性）。 Sources: [src/components/MilestoneKanban.tsx:145-172]()
5. **健康度染色**：`critical` → 玫红底、`warning` → 琥珀底、其余白底；仅当 `healthStatus !== 'normal'` 时额外渲染一行异常提示（`healthReason`，缺省「待办超时」）。 Sources: [src/components/MilestoneKanban.tsx:147-168]()
6. 点击卡片 → `onSelectProject(project)`（App → 打开 `ProjectDetailDrawer`）。 Sources: [src/components/MilestoneKanban.tsx:151]()
7. 每列列表最高 `460px` 内滚动。 Sources: [src/components/MilestoneKanban.tsx:144]()
8. 看板**无列内排序**（按 `projects` 数组原序），也无拖拽改阶段能力。 Sources: [src/components/MilestoneKanban.tsx:136]()

## 规则与边界（AI 开发硬约束）

- **筛选与看板脱节**是本节点最需注意的结构事实（见 `nd-milestones-stages` 事实 4 与 issue `issue-milestones-filter-no-effect`）：改筛选逻辑时两处必须一起改。
- 卡片染色与 `page-cockpit` 的「异常停滞与合规预警」用的**同一套 `healthStatus`**，但那边只有一份列表、这边分列展示；两处的 `critical` / `warning` 视觉处理不同（驾驶舱不分级，本页分级）。
- 项目卡显示的 `college.slice(0, 4)` 是**硬截断**（不做省略号），学院名少于 4 字时不补。
- 看板无空列态（某阶段无项目时列内空白），也无「拖拽改阶段」——阶段推进目前只能靠数据本身变化。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 让筛选作用于看板 | `:136` | 改为 `filteredProjects.filter(...)`（配合 `nd-milestones-stages`） |
| 列内排序（分数/健康度） | `:136` | 需定义排序键 |
| 支持拖拽改阶段 | `:135-189` | 需写回 `currentStage`（当前无写接口） |
| 健康度分级视觉统一 | `:147-155` | 与 `page-cockpit` 的预警列表口径对齐 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-milestones-board-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击看板列中的任一项目卡
  - 载荷：`ProjectItem`
  - 逻辑：onClick={() => onSelectProject(project)} → App.handleSelectProject 开抽屉。
  - 出处：`src/components/MilestoneKanban.tsx:151`
  - 出处：`src/App.tsx:756`
<!-- EDGES:END -->
