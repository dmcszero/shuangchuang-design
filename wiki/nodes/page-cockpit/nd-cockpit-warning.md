---
id: nd-cockpit-warning
title: 异常停滞与合规预警
page: page-cockpit
kind: list
importance: high
sources:
  - src/components/CockpitDashboard.tsx:441-465
---

## 一句话定位

右栏底部的「需要立即干预」清单：把 `healthStatus` 为 `warning` 或 `critical` 的项目连同原因（或兜底文案）列出，点一条直接打开项目详情抽屉——驾驶舱里唯一的**负向**信号面。

## 事实（每条强制可回溯）

1. 标题「异常停滞与合规预警 ({warningProjects.length})」+ 玫红徽标「需即时干预」。 Sources: [src/components/CockpitDashboard.tsx:443-453]()
2. 数据源 `warningProjects = projects.filter(p => p.healthStatus === 'warning' || p.healthStatus === 'critical')`——**真实派生**。 Sources: [src/components/CockpitDashboard.tsx:35]()
3. 每条显示：项目名（`truncate`）+ 右侧「第 `{p.rank}` 名」（**用的是 `rank` 字段，与同页 A 级池的序号口径不同**）+ 原因行 `p.healthReason || '存在待办工单超时未完成'`（缺省兜底文案）。 Sources: [src/components/CockpitDashboard.tsx:454-464]()
4. 点击 → `onSelectProject(p)`（同 A 级池，打开 `ProjectDetailDrawer`）。 Sources: [src/components/CockpitDashboard.tsx:457]()
5. **卡片与列表都不显示 `healthStatus` 的枚举值**——`warning`（如 proj-003 工单逾期）与 `critical` 在本页视觉上完全一样，无分级区分。 Sources: [src/components/CockpitDashboard.tsx:35]() [src/data/mockProjects.ts:329-330]()
6. 列表**无上限截断**（与 A 级池的 `slice(0,5)` 不同），会全部渲染。 Sources: [src/components/CockpitDashboard.tsx:454]()

## 规则与边界（AI 开发硬约束）

- `warning` 与 `critical` 两档在 UI 上**未做区分**（同一套玫红样式），但数据层已分档（mock 中 critical 2 条、warning 1 条）——做「分级干预」时先补视觉分级，别只改数据。
- 兜底文案「存在待办工单超时未完成」会在 `healthReason` 缺失时出现，可能**掩盖真实原因类型**（如合规问题）；补数据时优先保证每个异常项目都有 `healthReason`。
- 「第 N 名」是**全校排名**（来自 `project.rank`），不是「第几个异常」——这里的 N 与 A 级池的序号语义不同，读起来容易混。
- 列表为空时无空态文案（整块只剩标题与 0）。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 预警分级（warning/critical 分色） | `:35` `:454-464` | 需按 `healthStatus` 分样式 + 可能加分档图例 |
| 空态文案 | `:454` | 纯 UI |
| 预警项加「一键派单」动作 | `:454-464` | 需新出口（当前只有打开抽屉） |
| 原因分类展示 | `:462` | 需给 `healthReason` 定枚举口径（当前是自由文本） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-cockpit-warning-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击预警列表中的任一条
  - 载荷：`ProjectItem`
  - 逻辑：onClick={() => onSelectProject(p)} → App.handleSelectProject（同 A 级池）。
  - 出处：`src/components/CockpitDashboard.tsx:457`
  - 出处：`src/App.tsx:497-500`
<!-- EDGES:END -->
