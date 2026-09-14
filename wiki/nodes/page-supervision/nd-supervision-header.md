---
id: nd-supervision-header
title: 页头与会议导入入口
page: page-supervision
kind: bar
importance: medium
sources:
  - src/components/SupervisionClosure.tsx:442-488
---

## 一句话定位

导师端工作台的页头：标明「当前导师是谁」，用一句话说清本页五件事（材料审阅 / 录音导入 / 工单派发 / 智能提分 / 闭环），右侧只放一个动作——导入辅导会议录音或视频。

## 事实（每条强制可回溯）

1. 页头左侧徽标「导师端 · 督导辅导闭环工作台」+ 写死文案「当前导师：**陈建国 教授**（特聘国赛资深评审）」——**不读 `session`**，换登录账号不会变。 Sources: [src/components/SupervisionClosure.tsx:444-450]()
2. 主标题「项目全周期辅导：材料审阅 · 录音导入 · 工单派发 · 智能提分与闭环」。 Sources: [src/components/SupervisionClosure.tsx:451-454]()
3. 副文列出能力清单：「支持接收学校邀请、多导师协同指导、会议录像/音频导入ASR转写、AI智能建议工单、团队接单整改与改前改后版本提分双向验收。」 Sources: [src/components/SupervisionClosure.tsx:455-457]()
4. 右侧唯一按钮「导入辅导会议录音/视频」（emerald→teal 渐变）→ `setIsUploadModalOpen(true)`（打开 `nd-supervision-import`）。 Sources: [src/components/SupervisionClosure.tsx:460-469]()
5. 页头下方紧跟页面级 Toast：按 `feedbackToast.type` 三色（success 翡翠 / warning 琥珀 / info 天蓝），带 ✕ 手动关闭，4.5 秒自动消失。 Sources: [src/components/SupervisionClosure.tsx:99-104]() [src/components/SupervisionClosure.tsx:472-488]()
6. 页面根容器带稳定 id `mentor-portal-supervision-workbench`。 Sources: [src/components/SupervisionClosure.tsx:441]()

## 规则与边界（AI 开发硬约束）

- **导师身份是写死的**（陈建国），本页不接收 `session`：`SupervisionClosureProps` 只有 `workOrders` / `projects` / `onSelectProject` / `onUpdateWorkOrder?` / `onAddNewWorkOrder?`。要做多导师视角必须先加 session prop。 Sources: [src/components/SupervisionClosure.tsx:41-55]()
- Toast 是**全页统一反馈通道**：所有写操作的确认/告警都走 `showToast`，新增动作应复用。
- 「导入会议录音/视频」是本页**唯一的创建入口**（另一处入口在左栏管线标题旁的「新辅导 +」），两处都指向同一弹窗。 Sources: [src/components/SupervisionClosure.tsx:627-634]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 导师身份接登录态 | `:444-450` | 需新增 `session` prop + App 传参 |
| 新增页头动作 | `:458-470` | 需在 props 里加回调 |
| Toast 抽成公共组件 | `:99-104` `:472-488` | 影响本页全部写操作提示 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-supervision-header-2-import`** → `nd-supervision-import`（导入会议录音生成工单草稿）｜`navigate` · **implemented（已实现）**
  - 触发：点击页头「导入辅导会议录音/视频」
  - 逻辑：setIsUploadModalOpen(true) → 渲染 MODAL 1（导入弹窗）。
  - 出处：`src/components/SupervisionClosure.tsx:460-469`
  - 出处：`src/components/SupervisionClosure.tsx:1477-1478`
<!-- EDGES:END -->
