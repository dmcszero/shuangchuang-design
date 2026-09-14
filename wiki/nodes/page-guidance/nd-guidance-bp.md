---
id: nd-guidance-bp
title: BP 章节打磨区
page: page-guidance
kind: panel
importance: high
sources:
  - src/components/SceneGuidanceWorkbench.tsx:503-629
---

## 一句话定位

工作台中栏的「商业计划书（BP 12章）」tab 主体：在**排版预览**与**Markdown 源码编辑**两种形态间切换，可一键让 AI 针对当前章节提分，也是 AI 生成内容的**唯一落纸位置**。

## 事实（每条强制可回溯）

**一、tab 内两个动作（右端）**

1. 「切换源码编辑 / 切换排版预览」按钮按 `bpMode` 双向切换（`setBpMode(m => m === 'preview' ? 'edit' : 'preview')`）；`viewingVersionId` 非空时 `disabled`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:505-512]() [src/components/SceneGuidanceWorkbench.tsx:84]()
2. 导出按钮**只弹 alert**（`已成功导出国赛标准申报格式 Markdown 与 PDF 归档文档包！`），无真实导出逻辑。 Sources: [src/components/SceneGuidanceWorkbench.tsx:514-520]()
3. 中栏三个 tab（BP / 全维诊断报告 / 六维评分详情）的切换按钮在 `:463-499`，属**页面级子导航**，不单独下钻为节点。 Sources: [src/components/SceneGuidanceWorkbench.tsx:463-499]()

**二、章节头横幅**

4. 横幅渲染「重点章节」标签 + 「第 {activeChapterId} 章：{name}」，`name` 由 `STANDARD_12_CHAPTERS.find(c => c.id === activeChapterId)` 求得；其下渲染该章 `hint`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:567-580]()
5. 「AI 深度诊断此章」按钮 → `handleSendMessage('请帮我针对第${activeChapterId}章提出3条国赛评委视角的提分修改建议')`，即**打开右栏 AI 教练并把这句话当作用户消息发出**。 Sources: [src/components/SceneGuidanceWorkbench.tsx:581-587]()

**三、正文渲染（伪 Markdown）**

6. 编辑模式为受控 `textarea`，值即 `bpContent`；头部实时显示「Markdown 源码编辑模式 · 实时字数：{bpContent.length} 字」。 Sources: [src/components/SceneGuidanceWorkbench.tsx:552-562]()
7. 预览模式**不是 Markdown 库**，而是按 `\n\n` 切段后逐段判前缀：`# ` → h1、`## ` → h2、`- ` → ul、其余 → p。 Sources: [src/components/SceneGuidanceWorkbench.tsx:592-624]()
8. h2 段若 `para.includes(`${activeChapterId}.`)` 则加琥珀高亮（`bg-amber-50/60 border-l-4 border-amber-500`）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:601-607]()
9. 初始内容为 `SAMPLE_BP_CONTENT`，是**全库唯一一份完整 12 章 BP 正文**（以模板字符串硬编码在 mock 文件里）。 Sources: [src/components/SceneGuidanceWorkbench.tsx:85]() [src/components/guidance/guidanceMockData.ts:38-97]()

**四、AI 产出的落点**

10. `handleApplyDiff` 的行为是 `setBpContent(prev => prev + '\n' + diff.replacement)`——**无条件追加到全文末尾**，随后 `setBpMode('preview')` + `setCenterTab('bp')` + `alert(...)`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:258-264]()

## 规则与边界（AI 开发硬约束）

- **`bpContent` 是唯一真源，改它要连带核对三处**：正文字数显示（`:553`/`:831`）、章节头高亮（`:601`）、以及 AI 上下文（教练回复里引用「当前版本」的假设）。持久化**不存在**——刷新即回 `SAMPLE_BP_CONTENT`。
- **「应用 AI 改写」不按章节插入**：`diff.chapterId` / `chapterName` 只用于 alert 文案，正文是追加到文末。产品文案若承诺「增补至对应章节」，当前行为与承诺不符。
- **章节高亮是字符串包含判定**，存在误命中：当 `activeChapterId === '1'` 时，`'11. …'` 与 `'12. …'` 都会被判为命中。修高亮逻辑时优先改为前缀匹配 `## {id}.`。 Sources: [src/components/SceneGuidanceWorkbench.tsx:601]()
- 预览态的 h2 渲染把段落文本整体当标题，**不解析加粗/表格**；BP 正文里的 `**…**` 会原样显示。
- 编辑态不涉及退出保护：`Ctrl+S` 无绑定（头部提示「按 Ctrl+S 或点击右上角保存快照」但代码**没有键盘监听**），改这一段时别顺着文案去实现不存在的功能。 Sources: [src/components/SceneGuidanceWorkbench.tsx:554]()
- 导出按钮是 alert 占位，接真实导出前不要把它当作已有能力引用。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| AI 改写按章节就地替换 | `:258-264` | 需解析 BP 的 `## N.` 段边界并做区间替换 |
| 引入真 Markdown 渲染 | `:591-625` | 替换手写切段逻辑；注意保留章节高亮 |
| BP 内容持久化 | `:85` | `SAMPLE_BP_CONTENT` → 版本 `content` 字段（见 `nd-guidance-snapshot-banner`） |
| 修章节高亮误命中 | `:601` | 改前缀匹配 `## {id}.` |
| 接真实导出 | `:514-520` | 需落 PDF/MD 生成链路 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 4 条**

- **`e-guidance-taskbar-2-guidance-bp`** ← `nd-guidance-taskbar`（任务上下文条）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点任务条「→ 跳转关联章节」，或挂载时收到带 chapterId 的任务上下文
  - 载荷：`activeChapterId = taskContext.chapterId + centerTab = 'bp'`
  - 逻辑：两条路径：①useEffect（taskContext 变化时）在有 chapterId 的情况下 setActiveChapterId(taskContext.chapterId) + setCenterTab('bp')；②按钮 onClick={jumpToTaskChapter} 做同样两件事。前者受 prefiledTaskIdRef 去重约束（同 taskId 只处理一次）。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:122-125`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:136-141`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:410-417`
  - 备注：本页「章节定位」能力的兑现路径。专家工单来源的 chapterId 恒为 undefined，故该按钮不渲染、effect 也不切章节。
- **`e-guidance-chapters-2-guidance-bp`** ← `nd-guidance-chapters`（BP 章节速达条）｜`navigate` · **implemented（已实现）**
  - 触发：点击章节速达条上的任一章节按钮
  - 逻辑：handleSelectChapter(chId) → setActiveChapterId(chId) + setCenterTab('bp')。改变章节头横幅的章名与 hint，并切换 BP 正文中 `para.includes(`${id}.`)` 的琥珀高亮段落。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:112-115`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:530-533`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:601-607`
  - 备注：高亮是字符串包含判定，activeChapterId='1' 时会误命中 '11. '/'12. ' 开头的段落。
- **`e-guidance-diag-2-guidance-bp`** ← `nd-guidance-diag`（全维诊断报告）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击「国赛评委高频死穴待补强项」卡片里的「前往补全」
  - 逻辑：onClick={() => { setActiveChapterId(it.chapterId); setCenterTab('bp'); }} —— 只做章节定位与 tab 切换，不预填问题、不滚动、不带诊断上下文。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:695-704`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:112-115`
  - 备注：与 e-guidance-diag-2-guidance-coach 是本节点两条去向不同的出口：「前往补全」去改文档，「让 AI 执行」去问教练。
- **`e-guidance-coach-2-guidance-bp`** ← `nd-guidance-coach`（右栏 AI 备赛伴学教练）｜`writeback` · **implemented（已实现）**
  - 触发：点击 AI 消息里的「一键应用至计划书对应章节」
  - 载荷：`diff.replacement（AI 生成的段落原文）`
  - 逻辑：消息气泡在 msg.suggestedDiff 存在时渲染按钮 → handleApplyDiff(diff) → setBpContent(prev => prev + '\n' + diff.replacement) + setBpMode('preview') + setCenterTab('bp') + alert。**diff.chapterId / chapterName 只用于 alert 文案，不参与插入定位。**
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:896-909`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:258-264`
  - 备注：全库唯一一条「AI 产物写回文档」的链路，也是本页唯一成环的闭环。当前实现为追加到文末，与「应用至对应章节」的文案不符。

**出边 1 条**

- **`e-guidance-bp-2-guidance-coach`** → `nd-guidance-coach`（右栏 AI 备赛伴学教练）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击章节头横幅的「AI 深度诊断此章」
  - 载荷：`用户消息文本 = `请帮我针对第${activeChapterId}章提出3条国赛评委视角的提分修改建议``
  - 逻辑：onClick 直接调 handleSendMessage(模板串)；因文案含「第5章」等关键词时才会命中带 diff 的分支，诊断第 5 章会产出 suggestedDiff，诊断其他章则走兜底文案。
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:581-587`
  - 出处：`src/components/SceneGuidanceWorkbench.tsx:206-238`
  - 备注：「按章诊断」的能力受 if-else 覆盖范围限制：只有第 5 章 / 第 10 章两类有专门回复。
<!-- EDGES:END -->
