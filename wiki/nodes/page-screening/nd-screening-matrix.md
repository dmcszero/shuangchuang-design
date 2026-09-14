---
id: nd-screening-matrix
title: 二级指标全景表
page: page-screening
kind: table
importance: high
sources:
  - src/components/ScreeningHub.tsx:178-386
---

## 一句话定位

初筛的**主视图**：把每个项目摊成一行、把 2026 评审的四个一级指标拆成 17 个二级列，横向拉平对比——「同样的规则下，谁强在哪、谁短在哪」。

## 事实（每条强制可回溯）

1. 表头两层：一级分组超级列写死四组——个人成长（满分30分·5个二级）/ 项目创新（满分30分·3个）/ 产业价值（满分25分·4个）/ 团队协作（满分15分·5个）。 Sources: [src/components/ScreeningHub.tsx:206-259]()
2. 二级列名与分值写在 `title` 提示里：立德(6)/调研(6)/逻辑(6)/应用(6)/育人(6)、问题(10)/目标(10)/成效(10)、认知(6)/市场(7)/落地(6)/社会(6)、精神(3)/结构(3)/效能(3)/资源(3)/贡献(3)。 Sources: [src/components/ScreeningHub.tsx:234-257]()
3. 表头右侧带图例：绿点「≥85% 优势项」、红点「<75% 需补强」，另有「导出评分细则」按钮——点击仅 `alert('已导出《2026中国国际大学生创新大赛初筛二级指标评分细则表.xlsx》')`，**无实际导出**。 Sources: [src/components/ScreeningHub.tsx:187-201]()
4. 首列 sticky（`sticky left-0`）：项目名（`line-clamp-1`）+ 学院 + 负责人；随后是总分、梯队徽标（A 琥珀 / B 蓝 / C 灰 / D 玫红）。 Sources: [src/components/ScreeningHub.tsx:278-308]()
5. 二级分数取值方式：先按 id 找一级块——`personal_growth` / `project_innovation` / **`industry_value` 或 `development_prospect` 或 `execution_effect`（三选一兜底）** / `team_collaboration`，再**按下标**取 `tier2Scores[0..n]`，缺项渲染 `-`。 Sources: [src/components/ScreeningHub.tsx:265-271]() [src/components/ScreeningHub.tsx:309-368]()
6. 唯一的条件着色：产业价值第 2 列（市场）分数 `< 5.5` 时标红加粗（阈值写死）。 Sources: [src/components/ScreeningHub.tsx:340-345]()
7. 行带稳定 id `project-row-{project.id}`；整行点击 → `onSelectProject`（打开项目详情抽屉），最后一列另有「下钻诊断 ›」按钮走同一回调（带 `stopPropagation`）。 Sources: [src/components/ScreeningHub.tsx:273-277]() [src/components/ScreeningHub.tsx:370-380]()
8. 顶部信息条显示「共筛选出 **{filteredProjects.length}** 个对标项目」（真实派生）。 Sources: [src/components/ScreeningHub.tsx:181-186]()

## 规则与边界（AI 开发硬约束）

- **列数固定 17、按数组下标取值**是本节点的最大结构风险：mock 数据里 proj-002 / proj-005 的「项目创新」实为 **4** 项（第 4 项「模式创新」被静默丢弃）；proj-007（产业命题赛道）实为**五个**一级指标（个人成长 / 项目创新 / 实现成效 / 项目分析 / 团队协作），表头只列四个，其「项目分析」整块不可见，且三方兜底的 `iv` 会命中 `execution_effect`，列名却仍写「产业价值」。见 issue `issue-screening-fixed-columns-by-index`。
- 表头「满分 25分 / 15分」是**创意组口径**；创业组的分值区间不同（下拉文案里写「20个二级」）——同一张表服务多种赛道时必然错位。
- 分数格式没有统一处理（直接渲染 number），`6` 与 `6.0` 会呈现为不同文本。
- `alert()` 是占位反馈，不要当成导出能力引用。
- 表格横向溢出靠 `overflow-x-auto`；首列 sticky 在窄屏是唯一锚点。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 按二级指标 id 取数（去掉下标依赖） | `:309-368` | 需把 `tier2Scores` 从数组改为按 id 索引，或引入指标字典 |
| 支持多赛道不同指标表 | `:206-259` | 表头需由数据结构驱动（参考 `rules2026.ts`） |
| 真实导出 Excel | `:195` | 需接导出接口 |
| 阈值着色规则外置 | `:340-345` | 建议抽为常量/配置，与驾驶舱热力图共用 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-screening-matrix-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击全景表任一行，或行末「下钻诊断 ›」按钮
  - 载荷：`ProjectItem`
  - 逻辑：整行 onClick 与按钮 onClick 均调 onSelectProject(project)（按钮带 stopPropagation）→ App.handleSelectProject 开抽屉。
  - 出处：`src/components/ScreeningHub.tsx:273-277`
  - 出处：`src/components/ScreeningHub.tsx:370-380`
  - 出处：`src/App.tsx:497-500`
<!-- EDGES:END -->
