---
id: nd-workbench-folder
title: 项目文件夹
page: page-workbench
kind: panel
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx:850-988
---

## 一句话定位

项目工作台的第五个子 tab，用四个区块回答「这个项目的材料到底有哪些、谁改的、形成哪一版」：待归档区（会话产物入库）、材料注册表（含来源标签）、主文档版本线、大事记（=文件更改记录）。

## 事实（每条强制可回溯）

**一、待归档区**

1. 数据源 `PENDING_ARCHIVE_ITEMS`（2 条 mock），每条显示产物名、来源会话、时间、大小。 Sources: [src/components/workbench/workbenchMockData.ts:135-150]() [src/components/ProjectMemberWorkbench.tsx:879-890]()
2. 「存入项目文件夹」按钮当前仅为 `alert` 占位，**没有真正写入 `FILE_CHANGE_LOG`**。 Sources: [src/components/ProjectMemberWorkbench.tsx:883-888]()
3. 区块文案声明「存入后自动记入文件更改记录」——即设计意图是写入。 Sources: [src/components/ProjectMemberWorkbench.tsx:876]()

**二、材料注册表**

4. 列表数据 = `AI_GENERATED_FILES`（2 条），区块标题自称「材料注册表」并显示条数。 Sources: [src/components/ProjectMemberWorkbench.tsx:852]() [src/components/ProjectMemberWorkbench.tsx:899]()
5. 来源标签三态：`system` → 三件套/系统、`upload` → 上传、`ai` → 会话生成；映射表 `FILE_SOURCE` 按文件 id 查。 Sources: [src/components/ProjectMemberWorkbench.tsx:853-857]() [src/components/workbench/workbenchMockData.ts:114-124]()
6. 每项显示名称、`badge`、来源标签、分类/大小/扩展名。 Sources: [src/components/ProjectMemberWorkbench.tsx:902-919]()
7. **注意**：`FILE_SOURCE` 的键包含 `f-bp-main`、`f-interview-records` 等 9 个 id，但注册表只渲染 `AI_GENERATED_FILES` 的 2 个；其余 7 个来源映射**当前无 UI 消费**。 Sources: [src/components/workbench/workbenchMockData.ts:114-124]()

**三、主文档版本线**

8. 版本节点数组**硬编码**在 JSX 内（`['v1.0.0 · 校赛基线', 'v1.2.0 · 省赛网评', 'v1.4.0 · 里程碑 🚩', 'v2.0.0-rc · 当前']`）。 Sources: [src/components/ProjectMemberWorkbench.tsx:937]()
9. 区块文案写明「版本线（与全链路指导工作台快照同源）」，但两侧数据源实际各自 mock，无共享常量。 Sources: [src/components/ProjectMemberWorkbench.tsx:936]() [src/components/ProjectMemberWorkbench.tsx:928]()
10. 「完整版本历史 / diff 对比 / 回滚 → 全链路指导工作台顶栏『版本历史』抽屉」是**纯文本提示，没有 onClick**。 Sources: [src/components/ProjectMemberWorkbench.tsx:950-952]()

**四、大事记 = 文件更改记录**

11. 数据源 `FILE_CHANGE_LOG`（6 条 mock），字段：日期/操作人/动作/目标文件/详情/来自/形成版本/kind。 Sources: [src/components/workbench/workbenchMockData.ts:165-228]()
12. 四种 `kind` 各配图标与配色：`edit` ✏️、`milestone` 🚩、`upload` 📤、`archive` 📥。 Sources: [src/components/ProjectMemberWorkbench.tsx:858-869]()
13. 区块副标题明确口径：「谁 · 何时 · 动作 · 来自哪 · 形成哪版（不含业务事件）」。 Sources: [src/components/ProjectMemberWorkbench.tsx:960]()

## 规则与边界（AI 开发硬约束）

- **大事记口径 = 文件更改记录**：只记文件与版本变更事件，**不含立项/获奖等业务事件**。这是硬口径，写在 mock 文件头部。 Sources: [src/components/workbench/workbenchMockData.ts:5]()
- 大事记是**时间轴倒序展示**，数据本身不排序，顺序即数组顺序——新增记录应插到数组头部。 Sources: [src/components/workbench/workbenchMockData.ts:166-227]()
- 材料注册表与 `FILE_SOURCE` 的键集**不闭合**（9 键 vs 2 渲染项），是已知的口径缺口，改这里前先确认是否要补全渲染。
- 版本线的数据**没有真源**：它是硬编码字面量，既不属于 `guidanceMockData` 也不属于 `workbenchMockData`。
- 待归档的「存入」动作若真实现，必须同时产出 `FILE_CHANGE_LOG` 记录（kind 应为 `archive`），否则违反第 13 条口径。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 实现「存入项目文件夹」 | `src/components/ProjectMemberWorkbench.tsx:883-888` | 新增 `FILE_CHANGE_LOG` 记录（kind: `archive`）、从 `PENDING_ARCHIVE_ITEMS` 移除 |
| 补全材料注册表渲染 | `src/components/ProjectMemberWorkbench.tsx:852` | 需引入完整材料清单（现仅 `AI_GENERATED_FILES`） |
| 实现版本线 → 版本抽屉跳转 | `src/components/ProjectMemberWorkbench.tsx:950-952` | 见出边 `e-workbench-folder-2-guidance-version-drawer` |
| 把版本线数据抽成共享真源 | 硬编码数组 `:937` | 与 `guidanceMockData.SAMPLE_VERSIONS` 统一 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-workbench-folder-2-guidance-version-drawer`** → `nd-guidance-version-drawer`（版本历史抽屉）｜`navigate` · **intended（设计有·未实现）**｜severity: medium
  - 触发：点击项目文件夹主文档版本线下方的「完整版本历史 / diff 对比 / 回滚」提示语
  - 逻辑：当前无任何实现——该处是纯文本 <div>，没有 onClick，也不会调用任何 prop。
  - 设计依据：源码文案明确写好了目标位置：「完整版本历史 / diff 对比 / 回滚 → 全链路指导工作台顶栏『版本历史』抽屉」src/components/ProjectMemberWorkbench.tsx:950-952
  - 期望行为：点击后跳到材料打磨工作台（`page-guidance`），并自动打开其右缘版本历史抽屉（drawerOpen=true）。
  - **卡点**：两个障碍：①该处为静态文本，无点击处理器，需先加交互；②SceneGuidanceWorkbench 的 drawerOpen 是内部 useState(:93)，没有任何 props 可从外部控制，需先开放入参（如 initialDrawerOpen）。
- **`e-workbench-folder-2-guidance-versionline-reuse`** → `nd-guidance-version-drawer`（版本历史抽屉）｜`reuse` · **intended（设计有·未实现）**｜severity: medium
  - 触发：（无触发，宣称数据同源）
  - 逻辑：项目文件夹的「主文档版本线」文案声明「与全链路指导工作台快照同源」，但两侧实际各自 mock：项目侧是 JSX 内硬编码字面量数组，工作台侧读 guidanceMockData.SAMPLE_VERSIONS，无共享常量。
  - 设计依据：文案「版本线（与全链路指导工作台快照同源）」src/components/ProjectMemberWorkbench.tsx:936
  - 期望行为：两处版本线读同一份数据源（同一常量或同一接口），版本号序列天然一致。
  - **卡点**：项目工作台版本线是 JSX 内联硬编码数组（:937），不属于任何 mock 文件；需先抽出共享版本常量，再让两侧引用。
<!-- EDGES:END -->
