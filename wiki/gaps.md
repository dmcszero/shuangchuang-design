# 缺口清单（gaps）

> 由 `python wiki/gen_wiki_tools.py gaps` 从 `wiki/edges.json` 生成，**勿手改**。
> 口径：只收 `status != implemented` 的边，外加 `edges.json` 的 `issues`。`intended` = 设计说要做、代码没做；`undefined` = 设计本身也没定，需产品拍板。
>
> 统计：边 23 条（已实现 18 · intended 4 · undefined 1）· issues 9 条。

## intended（设计有·未实现）

| 边 | 走向 | type | severity | 卡点 |
|---|---|---|---|---|
| `e-guidance-taskbar-2-workbench-todo-writeback` | 任务上下文条 → 动态待办 | `writeback` | high | 待办池状态被困在 ProjectMemberWorkbench 组件内部（useState(WORKBENCH_AI_TODOS)，:71），App 层无访问入口；需要把 aiTodos 提升到 App 层或引入共享状态，才能打通跨页回写。 |
| `e-workbench-diag-gaps-2-workbench-todo` | 逻辑断点与硬伤 → 动态待办 | `writeback` | high | 三处缺失：①LogicGapItem 无稳定 id（src/types.ts:91-97），无法建立「断点 ↔ 待办」一一映射；②定位口径不一致——location 是「BP 第24页《发展规划与财务预测》」（实测 src/data/mockProjects.ts:91），而待办的 chapterRef 是「第10章 财务预测与融资计划」，页面上已有的 chapterIdFromRef 正则（第N章）对前者不匹配，需新增「页→章」映射或统一口径；③待办池 WORKBENCH_AI_TODOS 是模块级静态常量，组件内无 append 入口（与 e-guidance-taskbar-2-workbench-todo-writeback 同一根因：状态层级过低）。 |
| `e-workbench-folder-2-guidance-version-drawer` | 项目文件夹 → 版本历史抽屉 | `navigate` | medium | 两个障碍：①该处为静态文本，无点击处理器，需先加交互；②SceneGuidanceWorkbench 的 drawerOpen 是内部 useState(:93)，没有任何 props 可从外部控制，需先开放入参（如 initialDrawerOpen）。 |
| `e-workbench-folder-2-guidance-versionline-reuse` | 项目文件夹 → 版本历史抽屉 | `reuse` | medium | 项目工作台版本线是 JSX 内联硬编码数组（:937），不属于任何 mock 文件；需先抽出共享版本常量，再让两侧引用。 |

## undefined（待产品拍板）

| 边 | 走向 | type | severity | 待确认问题 |
|---|---|---|---|---|
| `e-workbench-diag-questions-2-defense` | 评委尖锐提问攻防演练 → 模拟答辩训练 | `navigate-with-payload` | high | 评委提问不走动态待办，那走哪？**建议（待拍板）：接「模拟答辩训练」的问答对抗阶段，把它当题库用。** 三条理由：①该区块源码标题本身就写着「评委尖锐提问攻防演练」（src/components/ProjectMemberWorkbench.tsx:751），业务定位本就是演练而非任务；②提问没有终态——待办可勾掉，提问要反复练，与答辩训练的重复演练语义一致；③page-defense 已有问答对抗阶段，天然是它的下游。备选路径：单题「去练」直达 AI 教练并预填该问题（更轻，但缺少针对单题的演练结构）。接洽前必须先解的前置：killerQuestions 是 string[]（src/types.ts:124），载不动题目 id / 应对要点 / 佐证材料 / 时长；且 defenseConstants 的题库与本区块各自 mock，无共享。 |

## issues（节点内缺口，未落成边）

| id | 位置 | 状态 | severity | 问题 | 卡点 |
|---|---|---|---|---|---|
| `issue-guidance-snapshot-preview-no-content` | 快照只读预览提示条 | intended | high | 「快照只读预览」不显示快照内容，看到的仍是当前正文 | ①ProjectVersion.content 无数据来源（mock 未填、无后端）；②快照保存时也未把 bpContent 写进新版本的 content（handleSaveSnapshot :152-169 未设 content 字段）。 |
| `issue-diag-questions-suggestion-hardcoded` | 评委尖锐提问攻防演练 | intended | medium | 评委提问的「建议应对策略」是硬编码单条文案，不随题目变化 | killerQuestions 是 string[]（src/types.ts:124），没有承载结构化应对信息的位置；需先升级为对象数组，属 ProjectItem 契约破坏性变更。 |
| `issue-guidance-dead-coach-state` | 右栏 AI 备赛伴学教练 | intended | medium | 右栏 AI 教练有 4 个 state 声明后从未被消费 | 三处均为 UI 未实现（不是数据缺失）：mock 数据已备好但无渲染分支；需先决定本页右栏与 page-coach 的分工，再决定是补齐还是删除。 |
| `issue-guidance-diff-modal-hardcoded` | 版本快照差异比对弹层 | intended | medium | 版本 diff 弹层正文为写死示例，不随所选版本变化 | 依赖 ProjectVersion.content 落地（同 issue-guidance-snapshot-preview-no-content）+ 需要给弹层增加 initialCompareVersionId 入参。 |
| `issue-guidance-stage-taxonomy-mismatch` | 全链路指导工作台 | undefined | medium | 阶段口径三套并存（本页 L1~L6 / 教练 L1~L4 / 看板 L1~L5） | 需产品拍板唯一的阶段口径与阶段数（L4/L5/L6 之争），再统一三处数据源与 stepper 行为；本轮只登记，不展开。 |
| `issue-workbench-pending-archive` | 项目文件夹 | intended | medium | 待归档区「存入项目文件夹」为 alert 占位，未真正写入大事记 | FILE_CHANGE_LOG 与 PENDING_ARCHIVE_ITEMS 均为模块级常量（非 state），组件内无可写入口；需改为组件状态或引入真实数据层。 |
| `issue-diag-region-no-empty-state` | 逻辑断点与硬伤 | undefined | low | 体检区三块均无空态处理，数据为空时只剩标题 | 需产品确认空态文案，以及空态下是否提供「发起 AI 体检」的动作入口。 |
| `issue-guidance-unused-modals` | 版本快照差异比对弹层 | undefined | low | GuidanceModals.tsx 内另两个弹层组件全库零引用（死代码约 298 行） | 需产品确认「工作台内建待办 / 材料上传」是否仍在路线图上：若在，应补入口与边；若否，应删除以消除误读（读代码者会以为该能力已就绪）。 |
| `issue-workbench-material-registry-gap` | 项目文件夹 | undefined | low | 材料注册表的来源映射键集与渲染集不闭合 | 需要一份完整的项目材料清单（现仅存在 AI 生成文件的 mock）。 |

## 逐条详情

### `e-guidance-taskbar-2-workbench-todo-writeback`

- 走向：**任务上下文条**（`nd-guidance-taskbar`）→ **动态待办**（`nd-workbench-todo`）｜type `writeback`｜status **intended**｜severity high
- 触发：点击任务上下文条「完成并回写待办」按钮
- 期望行为：点击后，项目工作台「动态待办」中 taskId 对应的 AI 待办应被标记 completed=true，且返回项目工作台时该勾选状态仍然保持。
- 设计依据：按钮自身文案「完成并回写待办」src/components/SceneGuidanceWorkbench.tsx:423；其 alert 文案「…并已回写项目工作台·动态待办！」src/components/SceneGuidanceWorkbench.tsx:147
- **卡点**：待办池状态被困在 ProjectMemberWorkbench 组件内部（useState(WORKBENCH_AI_TODOS)，:71），App 层无访问入口；需要把 aiTodos 提升到 App 层或引入共享状态，才能打通跨页回写。

### `e-workbench-diag-gaps-2-workbench-todo`

- 走向：**逻辑断点与硬伤**（`nd-workbench-diag-gaps`）→ **动态待办**（`nd-workbench-todo`）｜type `writeback`｜status **intended**｜severity high
- 触发：AI 对标体检测出新的逻辑断点（系统自动生成，非用户点击触发）
- 期望行为：体检产出 N 条逻辑断点时，动态待办中同步出现 N 条 AI 来源待办；点其「去执行」可跳到工作台对应章节；断点消除后该待办可关闭。
- 设计依据：产品口径（0911 #2.2）：「短板中的逻辑断点应该跟动态待办绑定，可以认为检测出逻辑断点后就会自动地在动态待办中新增一条相应待办。后续也是通过动态待办去处理。所以应该是逻辑断点--动态待办--相应模块」
- **卡点**：三处缺失：①LogicGapItem 无稳定 id（src/types.ts:91-97），无法建立「断点 ↔ 待办」一一映射；②定位口径不一致——location 是「BP 第24页《发展规划与财务预测》」（实测 src/data/mockProjects.ts:91），而待办的 chapterRef 是「第10章 财务预测与融资计划」，页面上已有的 chapterIdFromRef 正则（第N章）对前者不匹配，需新增「页→章」映射或统一口径；③待办池 WORKBENCH_AI_TODOS 是模块级静态常量，组件内无 append 入口（与 e-guidance-taskbar-2-workbench-todo-writeback 同一根因：状态层级过低）。

### `e-workbench-folder-2-guidance-version-drawer`

- 走向：**项目文件夹**（`nd-workbench-folder`）→ **版本历史抽屉**（`nd-guidance-version-drawer`）｜type `navigate`｜status **intended**｜severity medium
- 触发：点击项目文件夹主文档版本线下方的「完整版本历史 / diff 对比 / 回滚」提示语
- 期望行为：点击后跳到全链路指导工作台，并自动打开其右缘版本历史抽屉（drawerOpen=true）。
- 设计依据：源码文案明确写好了目标位置：「完整版本历史 / diff 对比 / 回滚 → 全链路指导工作台顶栏『版本历史』抽屉」src/components/ProjectMemberWorkbench.tsx:950-952
- **卡点**：两个障碍：①该处为静态文本，无点击处理器，需先加交互；②SceneGuidanceWorkbench 的 drawerOpen 是内部 useState(:93)，没有任何 props 可从外部控制，需先开放入参（如 initialDrawerOpen）。

### `e-workbench-folder-2-guidance-versionline-reuse`

- 走向：**项目文件夹**（`nd-workbench-folder`）→ **版本历史抽屉**（`nd-guidance-version-drawer`）｜type `reuse`｜status **intended**｜severity medium
- 触发：（无触发，宣称数据同源）
- 期望行为：两处版本线读同一份数据源（同一常量或同一接口），版本号序列天然一致。
- 设计依据：文案「版本线（与全链路指导工作台快照同源）」src/components/ProjectMemberWorkbench.tsx:936
- **卡点**：项目工作台版本线是 JSX 内联硬编码数组（:937），不属于任何 mock 文件；需先抽出共享版本常量，再让两侧引用。

### `e-workbench-diag-questions-2-defense`

- 走向：**评委尖锐提问攻防演练**（`nd-workbench-diag-questions`）→ **模拟答辩训练**（`page-defense`）｜type `navigate-with-payload`｜status **undefined**｜severity high
- 触发：（候选）点击某条评委提问 → 进入模拟答辩训练并带入该题
- **待确认**：评委提问不走动态待办，那走哪？**建议（待拍板）：接「模拟答辩训练」的问答对抗阶段，把它当题库用。** 三条理由：①该区块源码标题本身就写着「评委尖锐提问攻防演练」（src/components/ProjectMemberWorkbench.tsx:751），业务定位本就是演练而非任务；②提问没有终态——待办可勾掉，提问要反复练，与答辩训练的重复演练语义一致；③page-defense 已有问答对抗阶段，天然是它的下游。备选路径：单题「去练」直达 AI 教练并预填该问题（更轻，但缺少针对单题的演练结构）。接洽前必须先解的前置：killerQuestions 是 string[]（src/types.ts:124），载不动题目 id / 应对要点 / 佐证材料 / 时长；且 defenseConstants 的题库与本区块各自 mock，无共享。
