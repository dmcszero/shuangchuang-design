---
id: nd-workbench-wo
title: 专家辅导与督导工单
page: page-workbench
kind: panel
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx:438-691
---

## 一句话定位

项目工作台的第二个子 tab，承载「导师下发的整改要求 → 学生提交整改成果 → 导师二次复核打分」的完整闭环，是学生侧唯一能看见专家原始诊断意见与复核对分的地方。

## 事实（每条强制可回溯）

**一、左栏：工单列表与选择**

1. 列表按 `projectOrders`（= 按当前项目 id 过滤后的 `workOrders`）渲染，可点击切换选中工单。 Sources: [src/components/ProjectMemberWorkbench.tsx:64]() [src/components/ProjectMemberWorkbench.tsx:447-484]()
2. 每项显示导师名+职称、状态徽章、辅导时间、任务进度 `已完成/总数` 与进度条。 Sources: [src/components/ProjectMemberWorkbench.tsx:460-481]()
3. 状态三态文案映射：`expert_checked` → 专家已复核通过、`student_submitted` → 已提交待复核、其余 → 待团队整改交付。 Sources: [src/components/ProjectMemberWorkbench.tsx:462-470]()
4. 默认选中 `projectOrders[0]`，无工单时为 `null`。 Sources: [src/components/ProjectMemberWorkbench.tsx:68]()

**二、右栏：工单详情**

5. 头部显示导师名、辅导形式（`mock_defense` → 模拟答辩攻防 / `online_meeting` → 线上深度打磨 / 其余 → 线下封闭辅导）、录音时长、工单号。 Sources: [src/components/ProjectMemberWorkbench.tsx:507-516]()
6. 专家核心诊断意见来自 `selectedOrder.diagnosticSummary.coreFindings`。 Sources: [src/components/ProjectMemberWorkbench.tsx:520-528]()
7. 任务清单整行可点击切换完成状态；复选框 `onChange` 是**空函数**，实际由外层 `div` 的 `onClick` 处理（避免双重触发）。 Sources: [src/components/ProjectMemberWorkbench.tsx:542-556]()
8. 任务项显示 `[category] title`、优先级徽章、限期天数、`description`。 Sources: [src/components/ProjectMemberWorkbench.tsx:558-571]()

**三、整改交付提交区**

9. 必填项为「修改要点与答辩回应说明」（textarea），另有 BP 与 PPT 两个版本号输入框。 Sources: [src/components/ProjectMemberWorkbench.tsx:592-644]()
10. 修改要点为空时 `alert('请填写修改重点说明后再提交！')` 并中断提交。 Sources: [src/components/ProjectMemberWorkbench.tsx:113-117]()
11. 提交后 `setTimeout` 600ms 模拟异步，将工单状态置为 `student_submitted` 并写入 `studentSubmission`（含提交日期、修改要点、新 BP/PPT 版本、`vcrUpdated: true`）。 Sources: [src/components/ProjectMemberWorkbench.tsx:118-140]()
12. 成功后显示 3 秒提示条「整改材料提交成功！已自动通知导师进行二次督导复核与打分提升评估。」 Sources: [src/components/ProjectMemberWorkbench.tsx:137-138]() [src/components/ProjectMemberWorkbench.tsx:646-651]()
13. BP/PPT 两个「浏览」按钮均为 `alert` 占位，**没有真实文件选择**。 Sources: [src/components/ProjectMemberWorkbench.tsx:616-622]() [src/components/ProjectMemberWorkbench.tsx:635-641]()

**四、复核对分**

14. 仅当 `selectedOrder.expertCheck` 存在时渲染复核结果区块，含结论（`approved` → 已达到金奖答辩基准 / 否则 需进一步打磨）、评分提升 `+N 分`、评语。 Sources: [src/components/ProjectMemberWorkbench.tsx:667-682]()
15. 无选中工单时显示空态「暂无选中的督导工单」。 Sources: [src/components/ProjectMemberWorkbench.tsx:685-687]()

## 规则与边界（AI 开发硬约束）

- **任务勾选会写回 App 层**：`handleToggleTaskDone` 调用 `onUpdateWorkOrder`，修改的是全局 `workOrders`，与「动态待办」tab 的 AI 待办（本地 state）行为**不一致**。改这里要意识到这条不对称。
- **提交不改变任务完成状态**：`handleSubmitDeliverable` 只改工单 `status` 与 `studentSubmission`，不动 `tasks[].completed`。
- 工单状态机为三态：待整改 → `student_submitted`（学生提交）→ `expert_checked`（导师复核）。学生侧只能推进到第二态。
- `alert()` 是当前唯一的错误反馈方式，无内联错误提示组件。
- 左栏「整改要求」提示卡文案硬编码，不含真实规则数据。 Sources: [src/components/ProjectMemberWorkbench.tsx:489-497]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接真实文件上传 | `:616-622` / `:635-641` | 两个「浏览」按钮、需引入文件选择与上传链路 |
| 让提交也刷新任务完成数 | `:113-140` | 决定是否把 `tasks[].completed` 一并置位 |
| 工单状态映射扩展 | `:462-470` | `SupervisionWorkOrder.status` 类型（`src/types.ts`） |
| 导师侧看同一工单 | — | 见 `page-supervision`（督导闭环中心），两侧共用 `workOrders` |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-workbench-todo-2-workbench-wo-read`** ← `nd-workbench-todo`（动态待办）｜`read` · **implemented（已实现）**
  - 触发：（无触发，数据共享）
  - 逻辑：动态待办 tab 的工单来源直接 flatMap 展开 projectOrders[].tasks；同一份 projectOrders 也驱动工单 tab 的列表与详情。两个节点共享同一数据源，无复制。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:64`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:276`

**出边 1 条**

- **`e-workbench-wo-2-supervision-writeback`** → `page-supervision`（督导闭环中心）｜`writeback` · **implemented（已实现）**
  - 触发：勾选工单任务完成 / 提交整改成果
  - 逻辑：handleToggleTaskDone 与 handleSubmitDeliverable 均调用 prop onUpdateWorkOrder → App.handleUpdateWorkOrder: setWorkOrders。page-supervision（督导闭环中心）消费同一份 workOrders，导师侧因此能看到学生提交态（student_submitted）。
  - 出处：`src/components/ProjectMemberWorkbench.tsx:142-151`
  - 出处：`src/components/ProjectMemberWorkbench.tsx:113-140`
  - 出处：`src/App.tsx:522-524`
  - 出处：`src/App.tsx:732-738`
  - 备注：to 为 page 级（page-supervision 尚未下钻节点）。跨角色回写闭环，是全库少数真正双向的数据流。
<!-- EDGES:END -->
