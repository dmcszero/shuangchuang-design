---
id: nd-guidance-diag
title: 全维诊断报告
page: page-guidance
kind: panel
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx:632-737
---

## 一句话定位

工作台中栏的「全维诊断报告」tab：先用一张卡回答「你的项目属于哪一类创新」，再用左右两张卡分别回答「评委最容易问死你的三处在哪」与「下一步最该做什么」。**这是本页把「诊断」翻译成「动作」的地方**——两张卡各自带一条去往别处的出口。

## 事实（每条强制可回溯）

**一、结构**

1. tab 内容为三块：创新类型分诊卡（`:635-679`）、死穴待补强卡（`:684-709`）、下一步演进路径卡（`:712-734`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:632-737]()

**二、分诊卡**

2. 标题「大赛创新类型智能分诊 (AI Triage)」，右侧徽章显示「主导类型：{SAMPLE_TRIAGE.primaryType} (置信度 88%)」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:642-648]()
3. 置信度条遍历 `SAMPLE_TRIAGE.confidence` 渲染，条宽 = `v * 100%`（四类：产品创新 0.88 / 工艺流程创新 0.08 / 商业模式创新 0.03 / 服务创新 0.01）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:652-667]() [src/components/guidance/guidanceMockData.ts:348-353]()
4. 「申报书原文萃取佐证」遍历 `SAMPLE_TRIAGE.evidence`，逐条渲染 `[{type}] “{quote}”`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:670-677]() [src/components/guidance/guidanceMockData.ts:354-357]()

**三、死穴卡（左侧出口）**

5. 标题为「国赛评委高频死穴待补强项 ({SAMPLE_DIAGNOSIS.missing.length})」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:685-687]()
6. 每条展示 `text`，底部左侧固定文案「关联：第{chapterId}章」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:691-694]()
7. 底部右侧「前往补全」→ `setActiveChapterId(it.chapterId)` + `setCenterTab('bp')`，即**跳到 BP tab 并高亮该章**（不滚动、不预填问题）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:695-704]()

**四、下一步卡（右侧出口）**

8. 标题为「专家推荐下一步最优演进路径 ({SAMPLE_DIAGNOSIS.nextSteps.length})」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:713-715]()
9. 每条展示 `text`，底部左侧文案**硬编码**「紧急程度：高」，不读 `it.urgency`（三条数据里恰好有一条是 medium）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:722]() [src/components/guidance/guidanceMockData.ts:390-412]()
10. 底部右侧「让 AI 执行」→ `handleSendMessage('请协助我执行优化动作：${it.text}')`，把该条原文当用户消息发给右栏 AI 教练。 Sources: [src/components/SceneGuidanceWorkbench.tsx:723-729]()
11. 「(置信度 88%)」也是**硬编码**（`:647`），与 `confidence.产品创新 = 0.88` 数值一致但无计算关系。 Sources: [src/components/SceneGuidanceWorkbench.tsx:647]()

## 规则与边界（AI 开发硬约束）

- **本 tab 的数据与项目工作台体检区不同源**：这里读 `SAMPLE_DIAGNOSIS`（`DiagnosisItem[]`，含 `action`/`target` 字段），工作台体检区读 `mockProjects.ts` 的 `tier1Scores` / `logicGaps`。**两套诊断口径各写各的**，改其中一套不会影响另一套。 Sources: [src/components/guidance/guidanceTypes.ts:170-185]() [src/components/ProjectMemberWorkbench.tsx:696-768]()
- **`DiagnosisItem` 的 `action` / `target` 两个字段在本文件无任何消费**：`action` 取值为 `chapter_coach` / `edit` / `full_run`，`target` 取值为章号或 `'defense'`——**类型已经预留了「按 action 路由到不同模块」的设计，但渲染时被压成两句话术相同的按钮**。`nextSteps` 第 3 条 `target:'defense'`（联动路演答辩训练）因此落在「让 AI 执行」这条通用出口里，**没有真正进入答辩模块**。 Sources: [src/components/guidance/guidanceMockData.ts:390-412]() [src/components/SceneGuidanceWorkbench.tsx:717-733]()
- `SAMPLE_DIAGNOSIS` 的 `youAre` / `stage` / `stageLabel` 三个字段已定义但本 tab **完全未渲染**（原本应是「你现在在哪」的结论句）。 Sources: [src/components/guidance/guidanceMockData.ts:362-366]()
- 三块均**无空态**：`missing`/`nextSteps` 为空数组时只剩标题与计数 `(0)`，无引导文案。
- 分诊卡徽章的「置信度 88%」与置信度条里的第一项各写各的，改权重时两处需同步。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 按 `action` 路由出口 | `:717-733` | 用 `it.action`/`it.target` 决定去 BP / 去教练 / 去答辩训练（`target:'defense'` 当前无效） |
| 紧急程度接真实字段 | `:722` | 改为读 `it.urgency` 并分级配色 |
| 补齐「你现在在哪」结论句 | `:632` 起 | 渲染 `stageLabel` + `youAre` |
| 与工作台体检区统一口径 | `SAMPLE_DIAGNOSIS` | 需产品先定哪套为准（见 `page-workbench` 的 `nd-workbench-diag-*`） |
| 空态处理 | `:684-734` | 三个区块都需空态文案与动作入口 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 1 条**

- **`e-guidance-coach-2-guidance-diag`** ← `nd-guidance-coach`（右栏 AI 备赛伴学教练）｜`navigate` · **implemented（已实现）**
  - 触发：点击右栏「意图聚焦」条上的 L1~L6 阶段徽章
  - 逻辑：onClick={() => setCenterTab('diag')} —— 与顶栏 stepper 同款实现：只切 tab，**不把所点阶段写入任何 state**（coachIntent 的 setter 从未被调用）。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:863-876`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:100`
  - 备注：同一交互在两处（顶栏 :326 / 右栏 :866）重复实现且都无效，是「阶段」概念在本页的集中缺口。

**出边 2 条**

- **`e-guidance-diag-2-guidance-bp`** → `nd-guidance-bp`（BP 章节打磨区）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击「国赛评委高频死穴待补强项」卡片里的「前往补全」
  - 逻辑：onClick={() => { setActiveChapterId(it.chapterId); setCenterTab('bp'); }} —— 只做章节定位与 tab 切换，不预填问题、不滚动、不带诊断上下文。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:695-704`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:112-115`
  - 备注：与 e-guidance-diag-2-guidance-coach 是本节点两条去向不同的出口：「前往补全」去改文档，「让 AI 执行」去问教练。
- **`e-guidance-diag-2-guidance-coach`** → `nd-guidance-coach`（右栏 AI 备赛伴学教练）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击「专家推荐下一步最优演进路径」卡片里的「让 AI 执行」
  - 载荷：`用户消息文本 = `请协助我执行优化动作：${it.text}``
  - 逻辑：onClick={() => handleSendMessage(`请协助我执行优化动作：${it.text}`)} → 右栏追加一条 user 消息 + 置 isAiThinking，900ms 后按关键词分支产出 assistant 回复。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:723-729`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:191-256`
  - 备注：DiagnosisItem 的 action / target 字段未被消费，因此 nextSteps 里 target:'defense' 的那条（第 3 条）也走这条通用出口，不会进入答辩模块。
<!-- EDGES:END -->
