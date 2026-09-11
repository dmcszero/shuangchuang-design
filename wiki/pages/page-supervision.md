---
id: page-supervision
title: 辅导资产沉淀与督导（supervision）
section: sec-admin
importance: medium
sources:
  - src/components/SupervisionClosure.tsx
  - src/data/mockMentors.ts
  - src/types.ts
related_pages: [page-mentorship, page-workbench, page-cockpit]
---

# 辅导资产沉淀与督导（supervision）

## 一句话定位

工单流转闭环页，也是**导师端（`mentor`）的唯一落地页**：辅导录音 → AI 结构化转写 → 生成整改工单 → 学生交付 → 专家复核提分，四步全在一个右侧详情区里呈现；左侧另有校本避坑指南资产库。

## 事实（每条强制可回溯）

### 一、入口与状态

1. Props 共 4 项：`workOrders` / `projects` / `onSelectProject` / `onUpdateWorkOrder?`（注意最后一个是可选的）。`Sources: [src/components/SupervisionClosure.tsx:20-32]()`
2. 导师端登录后默认落在本页（`activeTab` 初值与登录重定向都指向 `supervision`）。`Sources: [src/App.tsx:56-61]()` `Sources: [src/App.tsx:258-259]()`
3. 四个本地状态：`selectedStatus`（状态筛选，四值 `'ALL' | 'pending_student' | 'student_submitted' | 'expert_checked'`）、`selectedOrder`（默认 `workOrders[0]`）、`isSimulatingAudio`、`simulationSuccess`。`Sources: [src/components/SupervisionClosure.tsx:33-36]()`
4. **`selectedOrder` 的初值是 `workOrders[0]`**：类型上不可为空，因此 `workOrders` 为空数组时初值为 `undefined`，后续访问会崩。`Sources: [src/components/SupervisionClosure.tsx:34-34]()`
5. 状态筛选只按 `status` 精确匹配，**没有按项目/导师/日期筛选**。`Sources: [src/components/SupervisionClosure.tsx:39-42]()`

### 二、录音转写模拟

6. 按钮文案随模拟状态切换：`AI 正在转写并生成工单...` / `导入专家辅导录音/视频`；`isSimulatingAudio` 期间按钮禁用。`Sources: [src/components/SupervisionClosure.tsx:88-95]()`
7. 模拟时长硬编码：**1800ms 后完成**，成功提示再保持 **5000ms** 后消失。`Sources: [src/components/SupervisionClosure.tsx:44-53]()`
8. 转写**不改任何工单数据** —— 它只是视觉演示，不会新增工单。`Sources: [src/components/SupervisionClosure.tsx:44-53]()`

### 三、专家复核

9. `handleApproveCheck(order)` 构造 `expertCheck` 并置 `status: 'expert_checked'`，同时更新本地 `selectedOrder` 并回调 `onUpdateWorkOrder`。`Sources: [src/components/SupervisionClosure.tsx:55-70]()`
10. 复核结果里 **日期 `'2026-08-27 20:15'` 与提分 `scoreChangeDelta: 2.0` 都是硬编码**，终评语也是固定文案。`Sources: [src/components/SupervisionClosure.tsx:59-64]()`
11. `onUpdateWorkOrder` 在 `App` 中的实现是"按 id 替换数组元素"，**状态提升到 App 级**，因此学生端（项目工作台）与导师端看到同一份工单。`Sources: [src/App.tsx:451-453]()`

### 四、页面结构

12. 页头横幅含一句明确的产品定位：「核心痛点解决：彻底杜绝"专家评完就忘、学生听完不改"，辅导语音AI结构化转为工单，双向跟踪复核」。`Sources: [src/components/SupervisionClosure.tsx:74-85]()`
13. 三张指标卡在 111-131；主体是左右两列（左：工单流水线 + 资产库；右 2 列：详情）。`Sources: [src/components/SupervisionClosure.tsx:111-131]()` `Sources: [src/components/SupervisionClosure.tsx:132-133]()` `Sources: [src/components/SupervisionClosure.tsx:225-225]()`
14. 左列含筛选项 tabs（143-164）与工单条目列表（165-202）。`Sources: [src/components/SupervisionClosure.tsx:143-202]()`
15. **校本避坑指南资产库**在 203-224（左侧下半区）。`Sources: [src/components/SupervisionClosure.tsx:203-224]()`
16. 右侧详情区是**四步流水**，行号与语义：① AI 提取的诊断报告（246-274）② 生成的整改工单清单（275-306）③ 学生交付与版本演进 diff（307-340）④ 专家复核与提分 delta（341-376）。`Sources: [src/components/SupervisionClosure.tsx:246-274]()` `Sources: [src/components/SupervisionClosure.tsx:275-306]()` `Sources: [src/components/SupervisionClosure.tsx:307-340]()` `Sources: [src/components/SupervisionClosure.tsx:341-376]()`

### 五、数据结构

17. `SupervisionWorkOrder` 共 15 个字段，关键项：`sessionType`（online_meeting / offline_coaching / mock_defense 三态）、`audioDurationMinutes`、`diagnosticSummary`（核心发现 + 按维度展开的专家评语，每维带 `level: good|average|poor`）、`tasks[]`、`status`（四态）、`studentSubmission?`、`expertCheck?`。`Sources: [src/types.ts:178-213]()`
18. **状态枚举实际有四值**：`pending_student | student_submitted | expert_checked | overdue`，但页面的筛选 tabs **只覆盖前三值**（`overdue` 无法筛选出来）。`Sources: [src/types.ts:199-199]()` `Sources: [src/components/SupervisionClosure.tsx:33-33]()`
19. `WorkOrderTask.category` 是五类枚举：`'创新点' | '商业模式' | '团队' | '材料/PPT' | '财务与数据'`。`Sources: [src/types.ts:168-176]()`
20. 工单数据源 `MOCK_SUPERVISION_ORDERS` 定义在 `mockMentors.ts`，与导师、批次任务、告警共处一个文件。`Sources: [src/data/mockMentors.ts:206-206]()`
21. 一份样例工单（`order-2026-0819-01`）的 `diagnosticSummary.dimensionFeedback` 覆盖三个维度，分别给 `good` / `poor` / `average`，其中"商业模式与财务"被判 `poor`。`Sources: [src/data/mockMentors.ts:219-226]()`

## 规则与边界（AI 开发硬约束）

- **本页与"导师端"是绑定关系**：`mentor` 角色只有这一个视图（导航项仅 `supervision`），因此本页即导师端全部能力。新增导师端功能要在这里扩。
- **`onUpdateWorkOrder` 是可选 prop**：组件内做了 `if (onUpdateWorkOrder)` 判空，但**同一函数里的 `setSelectedOrder(updated)` 是无条件的**。因此即使不传回调，UI 也会"看起来复核成功"，只是没落库 —— 排查"复核后刷新就丢"时先看这里。`Sources: [src/components/SupervisionClosure.tsx:66-69]()`
- **复核结果是硬编码的**：日期与 `scoreChangeDelta: 2.0` 写死。做真实复核时必须替换 59-64 行，且要按实际差异计算提分（否则提分永远是 2.0）。
- **筛选 tabs 漏了 `overdue` 态**：`overdue` 工单只能出现在"ALL"里，无法单独筛。这是当前实现的缺口（不是设计意图的证据，`status` 类型里明确有它）。
- **录音转写是纯演示**：不要在此基础上做"导入后新增工单"的功能，因为转写照现在的实现不会产生任何数据；真要接，需新增 create 回调到 `App`。
- **`selectedOrder` 的初始化不防空**：若将来 `workOrders` 可能为空（例如按角色过滤后为空），必须改为可选类型 + 空态渲染，否则运行时报错。
- **四步流水的内容全部来自单条工单**：步骤 2/3/4 分别读 `order.tasks` / `order.studentSubmission` / `order.expertCheck`，因此**未提交的工单在步骤 2/3 会是空态**，不要误判为渲染 bug。
- 资产库（203-224）是静态展示，与工单无数据关联。

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加一个状态筛选 | `SupervisionClosure.tsx:33`（加枚举）+ `143-164`（加 tab） |
| 改复核动作 | `SupervisionClosure.tsx:55-70` |
| 改四步详情内容 | `246-376`（四段行号见第二节事实 16） |
| 改工单数据结构 | `types.ts:178-213`（会同时影响项目工作台与项目抽屉） |
| 改工单数据 | `mockMentors.ts:206-362` |
| 改资产库 | `SupervisionClosure.tsx:203-224` |
| 改录音转写模拟 | `SupervisionClosure.tsx:44-53` |

## 与 related_pages 的联动提示

- → **page-workbench**：同一份 `workOrders` 的"学生侧"（提交交付物）与"导师侧"（复核）分属两页。学生提交把状态推到 `student_submitted`，导师复核推到 `expert_checked` —— 改状态机必须两页同步。
- → **page-mentorship**：辅导页承诺"预约即创建工单"但实际未创建；真正产生工单的能力目前只在本页的演示按钮上（且也不产数据）。这两页的语义缺口需一起补。
- → **page-cockpit**：驾驶舱的"督导闭环率"KPI 与"闭环"跳转都指向本页，改状态枚举会影响该指标口径。
- 注意：本页右侧的四步流水与**项目工作台**的工单 tab 有重叠（都展示 `tasks` / `studentSubmission` / `expertCheck`），但布局与操作不同 —— 一个是导师审阅视角，一个是学生操作视角，改动时不要假设共用组件。
