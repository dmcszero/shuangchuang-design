---
id: nd-supervision-import
title: 导入会议录音生成工单草稿
page: page-supervision
kind: modal
importance: high
sources:
  - src/components/SupervisionClosure.tsx:1476-1541
---

## 一句话定位

全页的**起点与唯一创建入口**：选项目 → 选媒体类型 → 填会议名 → 上传文件 →「开始转写并生成 AI 建议工单草稿」，1.8 秒后一条状态为「AI工单草稿」的新工单出现在左栏管线里。

## 事实（每条强制可回溯）

1. 由 `isUploadModalOpen` 控制；三个表单项：`uploadProjectTarget`（项目下拉，覆盖全部 `projects`，初值 `projects[0].id`）、`uploadMediaType`（`video` / `audio` 二选一，初值 video）、`uploadMeetingTitle`（默认值写死「腾讯会议：国赛金奖辅导答辩与技术商业重构研讨会」）。 Sources: [src/components/SupervisionClosure.tsx:82-85]() [src/components/SupervisionClosure.tsx:1494-1525]()
2. **上传区是纯装饰**：一个虚线框 + 提示文案（「点击上传或拖拽录像/录音文件至此… 单个最大支持 2GB」），**没有 `<input type="file">`、没有拖拽处理、没有文件校验**；文件从未真正被选择。 Sources: [src/components/SupervisionClosure.tsx:1527-1534]()
3. 确认按钮「开始转写并生成 AI 建议工单草稿」→ `handleUploadAndGenerateOrder`：置 `isAiProcessing` 并**固定等待 1800ms**，随后构造新工单、关弹窗、选中新工单、调 `onAddNewWorkOrder`（写入 App 的 `workOrders`）。 Sources: [src/components/SupervisionClosure.tsx:331-411]()
4. 新工单的构造内容**全部写死 + 少量插值**：导师固定为 `mentor-001`「陈建国 · 长江学者/航空制造特聘专家」、`coMentors` 固定两人、`sessionDate` 取当前时间、`audioDurationMinutes: 42`、`meetingRecord.durationText: '42分18秒'`、转写要点三条（含时间前缀的文案）、`diagnosticSummary`（1 条核心结论 + 3 维度反馈）、**3 条预制整改任务**（商业模式 / 材料·PPT / 财务与数据）。 Sources: [src/components/SupervisionClosure.tsx:338-405]()
5. 唯一随输入变化的字段：`projectId`/`projectName`/`college`/`leader`（取所选项目）、`batchTitle`（用会议名前 18 字拼接）、`meetingRecord.mediaType`（video/audio）、`meetingRecord.title`（会议名）。 Sources: [src/components/SupervisionClosure.tsx:339-347]() [src/components/SupervisionClosure.tsx:373-376]()
6. 新工单初始状态为 **`draft_ai_suggested`**（时序第 2 段），Toast：「已通过会议{视频|录音}完成转写！已生成【AI建议工单草稿】，请导师确认细化后推送给团队。」 Sources: [src/components/SupervisionClosure.tsx:404-410]()
7. 转写期间按钮禁用并显示旋转图标 +「AI 正在识别语音并生成工单草稿...」；**弹窗可被 ✕/取消关闭**（关闭不中断 1.8 秒后的定时器——关窗后工单仍会生成并被选中）。 Sources: [src/components/SupervisionClosure.tsx:1531-1539]() [src/components/SupervisionClosure.tsx:331-343]()

## 规则与边界（AI 开发硬约束）

- **「ASR 转写」是一段 `setTimeout`**：没有文件、没有语音识别、没有 AI 调用；文案（「2GB」「腾讯会议导出」「AI 正在识别」）都是演示包装。接真实能力时替换 `handleUploadAndGenerateOrder` 整个函数体即可（其产出结构 `SupervisionWorkOrder` 可直接复用）。
- 定时器**不受弹窗关闭影响**（见事实 7）：快速关窗再开会有并发风险（连续点击会生成多条草稿）。
- 生成的任务条目是**固定三条**，与所选项目无关（不会读项目的 `weaknessLabels`，尽管 `page-mentorship` 的推荐算法用了该字段）。
- 新工单的 `mentorName` 与页头写死的导师一致（陈建国），但**不读登录态**。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接真实上传 + ASR | `:1527-1534` `:331-411` | 需文件服务与转写服务；产出结构可保留 |
| 生成任务按项目短板定制 | `:387-405` | 应读 `ProjectItem.weaknessLabels`（与 `page-mentorship` 同源） |
| 防重复提交 | `:331` | 需加并发锁或请求中禁用入口 |
| 关窗取消转写 | `:1531-1539` | 需保存 timer id 并 clear |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 2 条**

- **`e-supervision-header-2-import`** ← `nd-supervision-header`（页头与会议导入入口）｜`navigate` · **implemented（已实现）**
  - 触发：点击页头「导入辅导会议录音/视频」
  - 逻辑：setIsUploadModalOpen(true) → 渲染 MODAL 1（导入弹窗）。
  - 出处：`src/components/SupervisionClosure.tsx:460-469`
  - 出处：`src/components/SupervisionClosure.tsx:1477-1478`
- **`e-supervision-pipeline-2-import`** ← `nd-supervision-pipeline`（辅导工单管线列表）｜`navigate` · **implemented（已实现）**
  - 触发：点击列表标题旁「新辅导 +」
  - 逻辑：setIsUploadModalOpen(true)（与页头按钮同一入口）。
  - 出处：`src/components/SupervisionClosure.tsx:627-634`

**出边 1 条**

- **`e-supervision-import-2-pipeline-writeback`** → `nd-supervision-pipeline`（辅导工单管线列表）｜`writeback` · **implemented（已实现）**
  - 触发：导入弹窗「开始转写并生成 AI 建议工单草稿」
  - 载荷：`SupervisionWorkOrder{status:'draft_ai_suggested', meetingRecord, diagnosticSummary, tasks[](3 条预制), coMentors[]}`
  - 逻辑：handleUploadAndGenerateOrder：固定 1800ms 后构造工单 → setSelectedOrder(newOrder)（右栏立即切到新工单）+ onAddNewWorkOrder(newOrder) → App.handleAddNewWorkOrder：setWorkOrders(prev => [newOrder, ...prev])（左栏顶部出现新工单卡）。
  - 出处：`src/components/SupervisionClosure.tsx:331-411`
  - 出处：`src/App.tsx:520-522`
  - 出处：`src/App.tsx:734-736`
  - 备注：工单内容（导师/时长/转写要点/诊断/任务）全部写死；上传区无真实文件输入。
<!-- EDGES:END -->
