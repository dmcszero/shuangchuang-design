---
id: page-milestones
title: 重点项目全流程看板（milestones）
section: sec-admin
importance: medium
sources:
  - src/components/MilestoneKanban.tsx
  - src/data/mockProjects.ts
  - src/components/ReportExportModal.tsx
related_pages: [page-lifecycle-versions, page-cockpit]
---

# 重点项目全流程看板（milestones）

## 一句话定位

五金阶段管线看板（**L1~L5**，与教练模块的 L1~L4、指导工作台的 L1~L6 都不同）：顶部是 5 张可点击的阶段卡（点击即筛选）、中部是各阶段均分跃迁曲线、下部是按健康度着色的项目卡片看板列，右上角可导出复盘材料。

## 事实（每条强制可回溯）

1. Props 共 3 项：`projects` / `onSelectProject` / `onOpenReportExport`。`Sources: [src/components/MilestoneKanban.tsx:17-27]()`
2. 唯一状态是 `selectedPipelineStage`，默认 `'ALL'`。`Sources: [src/components/MilestoneKanban.tsx:28-28]()`
3. **阶段定义是本地数组，不来自任何共享常量**，共 5 项，每项含 `key` / `name` / `desc` / `count`（按 `currentStage` 过滤计数）/ `color`：

| key | 名称 | 描述 |
|---|---|---|
| L1 | L1 · 申报与初筛 | 规则自检与AI对标 |
| L2 | L2 · 校赛与导师打磨 | 首轮短板工单整改 |
| L3 | L3 · 省赛集中封闭营 | 商业与财务模型强化 |
| L4 | L4 · 国赛精英训练营 | 国赛评委模拟答辩 |
| L5 | L5 · 金奖答辩冲刺 | 一票否决与极限路演 |

`Sources: [src/components/MilestoneKanban.tsx:30-36]()`

4. 筛选逻辑：`selectedPipelineStage !== 'ALL'` 时按 `p.currentStage` 精确过滤，无其它条件。`Sources: [src/components/MilestoneKanban.tsx:38-41]()`
5. 阶段卡点击是**切换式**：点击当前已选阶段会复位为 `'ALL'`。`Sources: [src/components/MilestoneKanban.tsx:71-71]()`
6. 页头横幅明确口径为「L1~L5 生命周期管线监控、项目停滞超时实时预警、金奖核心指标提升全景复盘」。`Sources: [src/components/MilestoneKanban.tsx:45-55]()`
7. 导出按钮文案「生成金奖指标提升复盘材料」，触发 `onOpenReportExport`。`Sources: [src/components/MilestoneKanban.tsx:57-63]()`
8. 阶段流指示卡区在 66-124，其中 86-124 是「提分与阶段跃迁曲线」。`Sources: [src/components/MilestoneKanban.tsx:66-124]()`
9. 看板列视图在 125-194，每列内部再按阶段筛一次项目。`Sources: [src/components/MilestoneKanban.tsx:125-194]()` `Sources: [src/components/MilestoneKanban.tsx:139-139]()`
10. 项目卡片的颜色由阶段卡自带 `color` 字段驱动（按健康度/阶段着色）。`Sources: [src/components/MilestoneKanban.tsx:31-35]()`
11. 导出走全局弹层 `ReportExportModal`，含格式选择栏 + 报告预览文档（4 个 section）。`Sources: [src/components/ReportExportModal.tsx:20-36]()` `Sources: [src/components/ReportExportModal.tsx:63-109]()` `Sources: [src/components/ReportExportModal.tsx:113-212]()`
12. 项目数据源同 `mockProjects`（`MOCK_PROJECTS`，906 行）。`Sources: [src/data/mockProjects.ts:3-3]()`
13. 本页消费的 `ProjectItem` 字段主要是 `currentStage`（`StageLevel`）、`stageName`、`name`、`college`、`totalScore`、`healthStatus`。`Sources: [src/types.ts:110-128]()`

## 规则与边界（AI 开发硬约束）

- **阶段口径不一致，不要"统一"掉**：本页是 **L1~L5**，教练模块是 **L1~L4**，指导工作台是 **L1~L6**。这是当前 demo 的真实状态（口径对照见 page-lifecycle-versions）。在本页改用 `INITIAL_STAGE_ITEMS` 之前，先确认三者是否真的要统一 —— 统一会同时改变三个页面的语义。
- **阶段数组是硬编码的**，且 `count` 是"渲染时遍历重算"而不是预统计。新增阶段要同时提供 `key`（必须是有效 `StageLevel`）、`name`、`desc`、`color`。
- **`StageLevel` 类型只有 L1~L5**：想在指导工作台那样用 L6，必须改 `types.ts:37`，那会影响 `ProjectItem.currentStage` 的全库消费方。`Sources: [src/types.ts:37-37]()`
- **筛选是单选且只有一个维度**：没有赛道/等级/学院筛选。要做多维筛选需仿照 `ScreeningHub` 的 `useMemo` 模式重写。
- **导出只传"打开弹层"信号，不传数据**：`onOpenReportExport` 是无参回调，报告内容由 `ReportExportModal` 自己 mock。做真实导出必须新增数据通道。`Sources: [src/components/ReportExportModal.tsx:20-26]()`
- **点击项目卡走全局 `onSelectProject`**，因此会打开 `ProjectDetailDrawer`（与初筛共用同一个抽屉）—— 改抽屉会同时影响本页。
- 本页是 `'milestones'` 的唯一入口（侧栏），驾驶舱虽然类型上允许跳过来但实际没有调用点。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加/改阶段 | `MilestoneKanban.tsx:30-36`（含 `count` 计算表达式） |
| 改筛选行为 | `MilestoneKanban.tsx:38-41`（过滤）+ `71`（切换式点击） |
| 改页头/导出入口 | `MilestoneKanban.tsx:45-64` |
| 改跃迁曲线 | `MilestoneKanban.tsx:86-124` |
| 改看板列与项目卡 | `MilestoneKanban.tsx:125-194` |
| 改导出弹层 | `ReportExportModal.tsx:37-212` |
| 阶段口径统一（跨三页） | 见 page-lifecycle-versions 的口径对照表 |

## 与 related_pages 的联动提示

- → **page-lifecycle-versions**：本页是三套阶段口径之一（L1~L5），且是唯一**用阶段做看板列**的页面。改阶段模型必看该页的口径对照。
- → **page-cockpit**：驾驶舱的五 KPI 与阶段分布相关，但驾驶舱的阶段口径来自 `rules2026.ts` 的一级指标，**与本页的五阶段管线不是同一个概念**（一个是评审维度、一个是备赛管线阶段），不要混用。
- 共用数据提醒：本页与驾驶舱、初筛、督导共用 `App` 持有的 `projects`；`currentStage` 字段的取值同时决定本页归属列与初筛的阶段列。
