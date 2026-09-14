---
id: nd-screening-compliance
title: 合规与一票否决拦截
page: page-screening
kind: panel
importance: high
sources:
  - src/components/ScreeningHub.tsx:482-563
---

## 一句话定位

初筛的**风控视图**：逐条列出项目的知识产权权属、全网查重率、AI 代写痕迹与逻辑断层数，命中风险的整条染红并打上「一票否决拦截」徽标。

## 事实（每条强制可回溯）

1. 顶栏标题「知识产权合规审查、查重与一票否决秒级拦截看板」，副文引用规则口径：「根据2026大赛评审规则第2条与第4条"必要条件"：若存在弄虚作假、抄袭剽窃、AI代写违规等情况，一票否决。」 Sources: [src/components/ScreeningHub.tsx:484-495]()
2. 顶栏右侧「重新批量扫描」按钮 → `onOpenBatchImport`（打开批量导入弹层，即**扫描与导入共用同一个入口**）。 Sources: [src/components/ScreeningHub.tsx:496-501]()
3. 每条卡三档底色（判据写死）：`!compliance.passed || compliance.ipRiskLevel === 'high'` → 玫红；否则 `compliance.warnings.length > 0` → 琥珀；否则灰白（hover 变白）。 Sources: [src/components/ScreeningHub.tsx:509-515]()
4. 左区：项目名 + （学院 · 负责人）+ 仅在 `!compliance.passed` 时出现的「一票否决拦截」徽标；下行 `<strong>IP权属：</strong> {compliance.ipDetails}`。 Sources: [src/components/ScreeningHub.tsx:517-531]()
5. 右区四个指标：**全网查重率** `compliance.plagiarismRate%`（>15% 标红放大，阈值写死）、**AI代写痕迹** `compliance.aiContentRate%`（固定 sky 色）、**逻辑断层疑点** `logicGaps.length 处`（>0 标琥珀）、以及「查看详情」按钮（`stopPropagation` + `onSelectProject`）。 Sources: [src/components/ScreeningHub.tsx:533-561]()
6. 整卡点击 → `onSelectProject`（与「查看详情」同一目标）。 Sources: [src/components/ScreeningHub.tsx:508]()
7. 本视图同样吃 `filteredProjects`，因此**合规筛选器（仅看通过 / 仅看预警）对本视图最有用**——但默认赛道筛选会同时收窄它。 Sources: [src/components/ScreeningHub.tsx:37-55]()

## 规则与边界（AI 开发硬约束）

- 「重新批量扫描」实为**打开导入弹层**（`modal-batch-import`），不是重扫——文案与行为不一致；改文案或改行为要显式决策。
- 查重阈值 >15% 与「一票否决」的判据（`compliance.passed`）是**两套独立逻辑**：查重超线只染红数字，不会自动把项目标为拦截。真实合规规则若要求「查重超线即否决」，这里就是缺口。
- `warnings[]` 的内容**在本视图完全不展示**（只用于决定底色），要看具体警告必须进详情抽屉。
- 「AI 代写痕迹」是 2026 规则的新增红线项，此处只有一个百分比数字，**无判据说明与阈值**——属数据口径待定。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 展示 warnings 明细 | `:509-515` | 需在卡内加列表；数据已在 `compliance.warnings` |
| 查重超线自动拦截 | `:539-545` | 需定义合规裁决规则并与 `compliance.passed` 合并 |
| 「重新批量扫描」接真实重扫 | `:496-501` | 需独立于导入弹层的新流程 |
| AI 代写痕迹阈值化 | `:547-553` | 需产品给阈值口径 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-screening-compliance-2-project-drawer`** → `shell-project-drawer`（项目详情抽屉）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击合规卡任一处，或卡内「查看详情」按钮
  - 载荷：`ProjectItem`
  - 逻辑：整卡 onClick 与按钮 onClick 均调 onSelectProject(project)（按钮带 stopPropagation）。
  - 出处：`src/components/ScreeningHub.tsx:508`
  - 出处：`src/components/ScreeningHub.tsx:557-563`
- **`e-screening-compliance-2-modal-import`** → `modal-batch-import`（批量导入与自动初筛）｜`navigate` · **implemented（已实现）**
  - 触发：点击合规看板右上「重新批量扫描」
  - 逻辑：onClick={onOpenBatchImport} → App 打开 BatchImportModal（与驾驶舱「导入新批次项目」同一弹层）。
  - 出处：`src/components/ScreeningHub.tsx:496-501`
  - 出处：`src/App.tsx:699`
  - 备注：按钮语义是「重新扫描合规」，实际打开的是「批量导入」弹层——文案与行为不一致。
<!-- EDGES:END -->
