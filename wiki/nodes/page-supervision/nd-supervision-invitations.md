---
id: nd-supervision-invitations
title: 学校指派与导师邀请闭环
page: page-supervision
kind: panel
importance: high
sources:
  - src/components/SupervisionClosure.tsx:489-578
---

## 一句话定位

导师端最上游的一环：学校把项目指派给你时，这里弹出琥珀色邀请区——看项目简述与指派导师组，然后「接受入驻」或「婉拒并附理由」。

## 事实（每条强制可回溯）

1. 区块**仅在存在待响应邀请时渲染**（`pendingInvitations.length > 0`）——全部处理完即整块消失。 Sources: [src/components/SupervisionClosure.tsx:490]() [src/components/SupervisionClosure.tsx:137]()
2. 数据源是页面本地 state `invitations`，初值 `mockSchoolInvitations`（来自 mock 数据文件）。 Sources: [src/components/SupervisionClosure.tsx:57]()
3. 标题「学校创新创业学院 · 新项目辅导指派邀请 ({n} 项待确认)」+ 说明「学校已根据项目专业赛道与多导师交叉培育规划，指派您为项目指导导师。您可接受入驻或婉拒并附理由。」+ 右侧徽标「待导师响应」。 Sources: [src/components/SupervisionClosure.tsx:493-514]()
4. 每条邀请展示：赛道徽标、学院、「指派时间 `invitedDate`」、项目名、项目简述（`projectSummary`），以及**学校指派导师组**（`assignedMentors[]`，每人显示「姓名(角色标签)」）。 Sources: [src/components/SupervisionClosure.tsx:517-550]()
5. 三个动作：「查看材料与AI诊断」（→ 打开邀请详情弹窗，MODAL 3）｜「婉拒邀请」（→ 打开婉拒弹窗，MODAL 2）｜「接受指导并入驻」（→ `handleAcceptInvitation`）。 Sources: [src/components/SupervisionClosure.tsx:553-575]()
6. `handleAcceptInvitation` 把该邀请状态改为 `accepted` + Toast「已成功接受学校对【项目】的辅导指派！已加入您的指导项目库。」——**只改本地 state**，不创建工单、不通知学校。 Sources: [src/components/SupervisionClosure.tsx:134-138]()
7. 婉拒弹窗（MODAL 2，`:1583-1624`）要求填理由：`handleConfirmDecline` 把状态改 `declined` 并写入 `declineReason`（为空时兜底「导师因近期国家级评审及出差行程冲突，无法按期指导」），Toast 文案称「回执与理由已同步推送至学校双创教学指导处」——**实际无推送**。 Sources: [src/components/SupervisionClosure.tsx:140-152]()
8. 邀请详情弹窗（MODAL 3，`:1625-1696`）展示学校提供的项目材料与 AI 诊断，是「接单前先看料」的入口。

## 规则与边界（AI 开发硬约束）

- **邀请状态只存在页面内**：`invitations` 是本地 state（初值 mock），刷新页面即回到初始数据；接受/婉拒的结果**不流向 App**（没有对应 prop），因此学校端看不到响应。要做到「回执推送」，需要新增上行链路。
- 「接受」**不会**把项目加入任何指导库，也不会创建工单或任务——它是纯状态标记 + Toast 文案。
- 「婉拒理由」在 UI 上是必填体验（弹窗内确认按钮在空值时行为需按实现核对），但代码里**空值会静默兜底**，不会阻断提交。 Sources: [src/components/SupervisionClosure.tsx:143-147]()
- 本区块与下方工单管线**无联动**：接受邀请不会在管线里出现新工单。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接受/婉拒结果上报 | `:134-152` | 需新增 props（App 层需有接收方） |
| 接受后自动创建首批工单 | `:134-138` | 需接 `onAddNewWorkOrder`（本页已有该 prop） |
| 邀请列表接真实数据 | `:57` | `mockSchoolInvitations` 退场 |
| 邀请详情弹窗内容接材料 | `:1625-1696` | 目前是 mock 材料 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-supervision-invitations-2-shell-intended`** → `shell-app`（应用壳层）｜`writeback` · **intended（设计有·未实现）**｜severity: medium
  - 触发：接受指导并入驻 / 婉拒邀请（含理由）
  - 设计依据：婉拒成功文案「回执与理由已同步推送至学校双创教学指导处。」src/components/SupervisionClosure.tsx:150；接受文案「已加入您的指导项目库」src/components/SupervisionClosure.tsx:136
  - 期望行为：邀请响应（接受/婉拒+理由）应回传学校端（`page-mentorship` 的导师调度或学校侧指派记录），使管理端能看到导师是否接单；接受后项目应进入该导师的指导项目库。
  - **卡点**：invitations 是页面本地 state（初值 mockSchoolInvitations），接受/婉拒只改本地并弹 Toast；本页没有对应上行 prop，App 层无邀请状态与接收方。
<!-- EDGES:END -->
