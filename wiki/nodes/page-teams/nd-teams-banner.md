---
id: nd-teams-banner
title: 页头与合规全检入口
page: page-teams
kind: bar
importance: medium
sources:
  - src/components/TeamManagement.tsx:68-96
---

## 一句话定位

团队管理页的页头：一句话交代本页对标的评审要素（个人成长 / 团队架构），右侧一个动作——「一键合规全检」，点击即弹提示。

## 事实（每条强制可回溯）

1. 标题「项目团队人员与学科架构管理」+ 徽标「2026国赛团队资质核查」。 Sources: [src/components/TeamManagement.tsx:73-77]()
2. 副文「严格对标 2026 国赛【个人成长】与【团队架构】评价要素，重点核查本硕博学段配比、商业专人配置及专利成果权属」。 Sources: [src/components/TeamManagement.tsx:78-80]()
3. 「一键合规全检」按钮的 onClick 只调 `showToast('已启动全校项目团队结构与发明人权属合规自动化扫描')`——**没有任何扫描逻辑**，3 秒后提示自动消失。 Sources: [src/components/TeamManagement.tsx:84-92]() [src/components/TeamManagement.tsx:35-38]()
4. 页面级 Toast 为右上角深色浮层（`fixed top-16 right-6`），全页所有动作共用这一条通道。 Sources: [src/components/TeamManagement.tsx:50-57]()
5. 页面根容器带稳定 id `team-management-module`。 Sources: [src/components/TeamManagement.tsx:47]()

## 规则与边界（AI 开发硬约束）

- 「一键合规全检」是**纯提示**（见事实 3）：本页的合规结论其实来自数据里的 `auditStatus` 字段，而不是任何扫描过程。接真实能力时的替换点是这个按钮与 `auditStatus` 的来源（mock）。
- 页头**无状态**（`toastMessage` 由页面级 state 承载，见 `nd-teams-filters` 的规则提示）。
- 副文提到的三项核查点（学段配比 / 商业专人 / 专利权属）与下方指标卡、团队卡内的三项合规检查**一一对应**——改口径要三处同步。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 合规全检接真实扫描 | `:84-92` | 需后端扫描服务 + 结果写回 `auditStatus` |
| 改核查点口径 | `:78-80` | 指标卡（`:99-160`）与团队卡三项检查（`:320-360`） |
| 导出/报告入口 | `:82-94` | 当前无导出（对比 `page-users` 有） |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 0 条**

（无）
<!-- EDGES:END -->
