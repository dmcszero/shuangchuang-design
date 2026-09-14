# 缺口清单（gaps）

> 由 `python wiki/gen_wiki_tools.py gaps` 从 `wiki/edges.json` 生成，**勿手改**。
> 口径：只收 `status != implemented` 的边，外加 `edges.json` 的 `issues`。`intended` = 设计说要做、代码没做；`undefined` = 设计本身也没定，需产品拍板。其中 `category = 产品决策` 的条目另由本命令分流生成 `wiki/decisions.md`《待拍板清单》。
>
> 统计：边 98 条（已实现 86 · intended 11 · undefined 1）· issues 40 条。

## intended（设计有·未实现）

| 边 | 走向 | type | severity | 卡点 |
|---|---|---|---|---|
| `e-guidance-taskbar-2-workbench-todo-writeback` | 任务上下文条 → 动态待办 | `writeback` | high | 待办池状态被困在 ProjectMemberWorkbench 组件内部（useState(WORKBENCH_AI_TODOS)，:71），App 层无访问入口；需要把 aiTodos 提升到 App 层或引入共享状态，才能打通跨页回写。 |
| `e-kb-list-2-coach-intended` | 知识库列表卡与启停/删除 → AI 备赛教练 | `read` | high | AI 助手的「校内智库」回答读的是 `mockCoachData` 的另一套语料（默认厦门大学、引用文号硬编码「厦大创字〔2025〕06号」），与知识库的 22 个 state 零连接；全库无检索引擎与向量库调用。 |
| `e-mentorship-book-2-workbench-intended` | 智能短板定向匹配与预约 → 项目工作台 | `writeback` | high | handleBookMentor 只 setBookingSuccessMsg + 4 秒后清空；本页没有 onAddNewWorkOrder prop（App 有 handleAddNewWorkOrder 但只传给了 page-supervision），也未传入导师/项目关联字段。 |
| `e-users-table-2-shell-accounts-intended` | 用户台账表与账号操作 → 应用壳层 | `writeback` | high | users 是组件本地 state（初值 MOCK_USERS），本页**没有任何上行 prop**（只有可选 onOpenProject）；账号与登录体系（page-login 的 DEMO_PRESET_ACCOUNTS + 前端自选角色）互不相通，Auth 层不存在。 |
| `e-workbench-diag-gaps-2-workbench-todo` | 逻辑断点与硬伤 → 动态待办 | `writeback` | high | 三处缺失：①LogicGapItem 无稳定 id（src/types.ts:91-97），无法建立「断点 ↔ 待办」一一映射；②定位口径不一致——location 是「BP 第24页《发展规划与财务预测》」（实测 src/data/mockProjects.ts:91），而待办的 chapterRef 是「第10章 财务预测与融资计划」，页面上已有的 chapterIdFromRef 正则（第N章）对前者不匹配，需新增「页→章」映射或统一口径；③待办池 WORKBENCH_AI_TODOS 是模块级静态常量，组件内无 append 入口（与 e-guidance-taskbar-2-workbench-todo-writeback 同一根因：状态层级过低）。 |
| `e-coach-composer-2-stream-mention-intended` | 消息输入区与能力配置 → 会话消息流 | `writeback` | medium | mentionedFiles / localUploadedFiles 只写进 msg.mentionedFiles 用于渲染 chip 与标记，全仓无检索或注入消费方；本地文件甚至只有文件名与大小（不读内容）。 |
| `e-coach-deep-2-defense-intended` | 深度调用管道（4.2 / 4.3） → 模拟答辩训练 | `navigate` | medium | 实际只在会话内模拟并回帖结果卡（handleStartDeepCall → 配置卡 → 执行弹窗 → 结果卡）；SceneAICoach 的 onNavigateToScene prop 由 App 注入（src/App.tsx:631）却从未被调用（该 prop 在组件里被解构后无任何使用点）。 |
| `e-platform-kb-2-school-kb-intended` | 平台赛事知识库（admin 端） → 知识库列表卡与启停/删除 | `read` | medium | 两端各自自持 state（`MOCK_PLATFORM_KNOWLEDGE_BASES` vs `MOCK_KNOWLEDGE_BASES`）、均无 props、无共享数据层与订阅机制；App 仅按 `session.role === 'system_admin'` 分流渲染，两者之间没有任何数据流动。 |
| `e-supervision-invitations-2-shell-intended` | 学校指派与导师邀请闭环 → 应用壳层 | `writeback` | medium | invitations 是页面本地 state（初值 mockSchoolInvitations），接受/婉拒只改本地并弹 Toast；本页没有对应上行 prop，App 层无邀请状态与接收方。 |
| `e-workbench-folder-2-guidance-version-drawer` | 项目文件夹 → 版本历史抽屉 | `navigate` | medium | 两个障碍：①该处为静态文本，无点击处理器，需先加交互；②SceneGuidanceWorkbench 的 drawerOpen 是内部 useState(:93)，没有任何 props 可从外部控制，需先开放入参（如 initialDrawerOpen）。 |
| `e-workbench-folder-2-guidance-versionline-reuse` | 项目文件夹 → 版本历史抽屉 | `reuse` | medium | 项目工作台版本线是 JSX 内联硬编码数组（:937），不属于任何 mock 文件；需先抽出共享版本常量，再让两侧引用。 |

## undefined（待产品拍板）

| 边 | 走向 | type | severity | 待确认问题 |
|---|---|---|---|---|
| `e-workbench-diag-questions-2-defense` | 评委尖锐提问攻防演练 → 模拟答辩训练 | `navigate-with-payload` | high | 评委提问不走动态待办，那走哪？**建议（待拍板）：接「模拟答辩训练」的问答对抗阶段，把它当题库用。** 三条理由：①该区块源码标题本身就写着「评委尖锐提问攻防演练」（src/components/ProjectMemberWorkbench.tsx:751），业务定位本就是演练而非任务；②提问没有终态——待办可勾掉，提问要反复练，与答辩训练的重复演练语义一致；③page-defense 已有问答对抗阶段，天然是它的下游。备选路径：单题「去练」直达 AI 教练并预填该问题（更轻，但缺少针对单题的演练结构）。接洽前必须先解的前置：killerQuestions 是 string[]（src/types.ts:124），载不动题目 id / 应对要点 / 佐证材料 / 时长；且 defenseConstants 的题库与本区块各自 mock，无共享。 |

## issues（节点内缺口，未落成边）

| id | 位置 | 状态 | severity | 问题 | 卡点 |
|---|---|---|---|---|---|
| `issue-coach-project-context-unbound` | AI 备赛教练 | undefined | high | AI 助手与右栏产物的项目上下文恒为兜底字面量（activeSpace 恒 null） | 需先把项目上下文从 activeSpace 迁到 currentMemberProject（或二者合并），并把散落的兜底字面量统一为项目字段；另需产品确认「备赛空间」概念是否保留（见 issue-coach-spaces-dead）。 |
| `issue-cockpit-static-metrics` | 数据驾驶舱 | undefined | high | 驾驶舱演示数字与真实数据自相矛盾（同屏内「A 级 5 项」与「15 个金奖种子」并存） | 需要①引入真实聚合逻辑（数据已在 `projects` 与 `tier1Scores` 中）；②确定「工单相关指标」（闭环率/下发数/二次 Check）的数据来源——本页当前拿不到 `workOrders`，需 App 传入；③决定演示态是否保留大数字。 |
| `issue-defense-report-not-connected` | 答辩复盘报告 | undefined | high | 复盘报告与本次训练数据不连通（交卷只切视图，分数走历史/兜底常量） | 需把 DefensiveSession 的消息/用时/评分提升到 SceneDefenseTraining 层（或引入共享 store），并把 RECENT_DEFENSE_HISTORY 改为可变数据。 |
| `issue-guidance-snapshot-preview-no-content` | 快照只读预览提示条 | intended | high | 「快照只读预览」不显示快照内容，看到的仍是当前正文 | ①ProjectVersion.content 无数据来源（mock 未填、无后端）；②快照保存时也未把 bpContent 写进新版本的 content（handleSaveSnapshot :152-169 未设 content 字段）。 |
| `issue-kb-not-connected-to-coach` | 知识库管理 | undefined | high | 知识库与 AI 助手零连接：RAG 底座、检索命中、Grounding Citations 均为文案承诺 | 需后端检索链路（向量库 + 文档解析 + 引用回传）与 App 层知识库状态共享；技术选型方向已在《0819-技术选型方案》中给出（MySQL+Redis+Qdrant+BGE-M3），待确认后落地。 |
| `issue-product-coach-session-unification` | 右栏 AI 备赛伴学教练 | undefined | high | 两套会话实现是否统一：page-coach 完整版 vs guidance 右栏内嵌简版（保留哪套） | 待上司拍板；该决策同时卡住 issue-guidance-dead-coach-state（右栏 4 个死状态补齐还是删除）。 |
| `issue-screening-fixed-columns-by-index` | 二级指标全景表 | undefined | high | 二级指标全景表列数固定 17 且按数组下标取数，各赛道指标结构不同必然错位 | 需要一份「赛道 → 一级/二级指标定义」的数据源（`rules2026.ts` 是候选真源，需核对是否含二级项与分值），以及把 `tier2Scores` 从纯数组改为带 id 的结构（或建指标 id ↔ 下标的映射表）。 |
| `issue-users-accounts-isolated` | 用户管理 | undefined | high | 用户账号体系是孤岛：新增账号无法登录、停用不影响任何权限，且与登录页预置账号互不相通 | 涉及整体鉴权方案（与 issue-login-sso-placeholder 同源），需产品先定「demo 用假鉴权还是接统一认证」；工程侧还需在 App 层建立用户状态与登录流程的联动。 |
| `issue-assets-vs-coach-deliverables` | 素材与资产管理 | undefined | medium | 「产物 / 资产」两套体系未统一：AI 产出无归档路径，路演幻灯片两处各 mock | 属产品架构级决策（资产库是独立模块还是各模块内嵌），需上司拍板后由工程统一数据层。 |
| `issue-coach-atomic-card-key-mismatch` | 浅度原子能力调用卡 | undefined | medium | 4.2 浅度原子卡正文永远不渲染（读取的数据键全仓无生产者） | 二选一：①按卡片的键名结构补全生产端数据（推荐——卡片侧字段更完整，是设计意图形态）；②简化卡片为 flaws/advice 结构（会丢字段）。需先确认哪个是设计真源。 |
| `issue-coach-campus-university-out-of-sync` | AI 备赛教练 | undefined | medium | 登录选定的高校不流向 AI 助手校内智库（coach 自持一套选校，且引用文号硬编码厦大） | 口径与实现都要动：①确定「校内智库以谁为准」（登录校 vs 手动切换）；②把 selectedUniversity 的初值接到 session；③mock 里的机构名与文号需要按校改写。 |
| `issue-coach-file-mention-not-used` | 消息输入区与能力配置 | undefined | medium | @ 引用项目文件与本地文件上传均不参与推理（无消费方） | 需接入文件解析 + 上下文注入链路（当前 demo 无后端、无文件服务）；实现前该能力属「文案先行」。 |
| `issue-cockpit-screening-nav-no-context` | 数据驾驶舱 | undefined | medium | 跨页跳转全都不带上下文（驾驶舱/初筛页的「查看更多 / 排期 / 批量调度」到落地页后需重新找） | 需把 `onNavigateTab` 从「只传 tab 名」扩为「tab + 载荷」（或在 App 层维护一份跨页上下文 state），并让各落地页消费；改动面覆盖 App + 4 个页面，建议与批 3 的导航改造一并做。 |
| `issue-diag-questions-suggestion-hardcoded` | 评委尖锐提问攻防演练 | intended | medium | 评委提问的「建议应对策略」是硬编码单条文案，不随题目变化 | killerQuestions 是 string[]（src/types.ts:124），没有承载结构化应对信息的位置；需先升级为对象数组，属 ProjectItem 契约破坏性变更。 |
| `issue-guidance-dead-coach-state` | 右栏 AI 备赛伴学教练 | intended | medium | 右栏 AI 教练有 4 个 state 声明后从未被消费 | 三处均为 UI 未实现（不是数据缺失）：mock 数据已备好但无渲染分支；需先决定本页右栏与 page-coach 的分工，再决定是补齐还是删除。 |
| `issue-guidance-diff-modal-hardcoded` | 版本快照差异比对弹层 | intended | medium | 版本 diff 弹层正文为写死示例，不随所选版本变化 | 依赖 ProjectVersion.content 落地（同 issue-guidance-snapshot-preview-no-content）+ 需要给弹层增加 initialCompareVersionId 入参。 |
| `issue-guidance-stage-taxonomy-mismatch` | 材料打磨工作台 | undefined | medium | 阶段口径三套并存（本页 L1~L6 / 教练 L1~L4 / 看板 L1~L5） | 需产品拍板唯一的阶段口径与阶段数（L4/L5/L6 之争），再统一三处数据源与 stepper 行为；本轮只登记，不展开。 |
| `issue-kb-preview-hardcoded-chunks` | 文件解析要点预览 | undefined | medium | 文件预览弹窗的「核心知识要点」是写死示例（任何文件都显示同样两条，含写死匹配度） | 需 `KnowledgeBaseFile` 增补 `chunks[]` / `excerpts[]` 字段并由解析服务填充（与 issue-kb-not-connected-to-coach 同一条链路）。 |
| `issue-kb-two-ends-not-synced` | 知识库管理 | undefined | medium | 知识库「一页两端」数据完全隔离：平台标准库无法下发给校端，两端分类同名却互不可见 | 属产品级数据架构决策（平台库是全校共享的超集？还是靠「发布/订阅」桥接？多校部署形态也相关），需上司拍板后由工程统一数据层——与 issue-mentors-pool-two-ends-not-synced 是同一类问题，可一并决策。 |
| `issue-login-sso-placeholder` | 登录分流 | undefined | medium | 登录页是演示态假门：文案称支持统一身份认证，实为前端自选身份 + 免密预置卡 + 密码不校验 | 需产品侧给认证口径（依赖各校 IT 环境），工程侧才能落地；demo 阶段保持现状。 |
| `issue-mentors-pool-two-ends-not-synced` | 导师池管理 | undefined | medium | 导师池「一页两端」但数据完全不互通（平台专家无法下派、校端看不到平台库） | 属产品级数据架构决策（多校/单校部署形态、平台与学校的导师库关系），需上司拍板后由工程统一数据层。 |
| `issue-mentorship-mock-fanout` | 导师智能调度 | undefined | medium | 任务下发规模 15/28/82 写死并被用作进度条分母，与真实项目数（8）不符 | 需要 App 层在创建时把 `projects` 的梯队统计传下来（或把创建逻辑上移到 App），并决定赛道维度是否纳入任务模型。 |
| `issue-milestones-filter-no-effect` | L1~L5 阶段流指示卡 | undefined | medium | 里程碑看板阶段卡「点了没反应」：筛选只影响一个数字，看板列不筛选 | 无外部阻塞，属实现缺陷修复；需先定交互（过滤 vs 高亮）——建议高亮（保持管线全景可见）。 |
| `issue-product-single-project-binding` | 项目工作台 | intended | medium | 产品规则：每个学生仅绑定一个项目，学生端不可切换项目（demo 可切换仅为演示） | 规则已定（用户拍板 2026-09-14），无需上司再议；落地为工程收口——待 demo 产品化阶段执行，本轮 wiki 只登记不改代码。 |
| `issue-teams-fake-metrics` | 团队资质指标卡 | undefined | medium | 团队资质指标卡全为假数据：总数凭空 +77，三个比率写死且与真实字段可算值不符 | 无外部阻塞，属实现补齐（字段齐备）；需先与产品确认「全校团队总数」的口径来源（本页数据只有 5 支 mock，真实规模需接后端）。 |
| `issue-users-fake-metrics` | 账号规模指标卡 | undefined | medium | 用户管理指标卡四张全部写死/假派生（users.length + 333、48 位、26 个学院、268 人） | 无外部阻塞；需与产品确认「学院数」的口径（账号所在单位 vs 学校院系总数）。 |
| `issue-workbench-pending-archive` | 项目文件夹 | intended | medium | 待归档区「存入项目文件夹」为 alert 占位，未真正写入大事记 | FILE_CHANGE_LOG 与 PENDING_ARCHIVE_ITEMS 均为模块级常量（非 state），组件内无可写入口；需改为组件状态或引入真实数据层。 |
| `issue-assets-addfile-folder-mismatch` | 新增资产归档弹窗 | undefined | low | 新增资产弹窗的目录口径不一致（初值「核心申报」不在下拉选项中） | 无外部阻塞，属实现补齐。 |
| `issue-coach-shared-workspace-drawer-dead` | AI 备赛教练 | undefined | low | SharedWorkspaceDrawer 是不可达弹层（isWorkspaceOpen 只会被置 false） | 需决定右栏（RightWorkspacePanel）与旧抽屉是否合并——两者提供的能力高度重叠（产物清单 / 待办 / 文件提及）。 |
| `issue-coach-spaces-dead` | 会话历史与新建对话 | undefined | low | 「备赛空间（ProjectSpace）」整套能力无 UI 入口，是死结构 | 需产品拍板：备赛空间是多项目管理能力，与「每个学生仅绑定一个项目」（issue-product-single-project-binding）直接冲突——二者只能留一个。 |
| `issue-defense-prep-question-count` | 赛前解构与靶向题库 | undefined | low | 赛前解构「已生成 12 题」与实际渲染 4 条不符 | 无外部阻塞，属实现补齐；若要真实生成则依赖 page-defense 的题库数据源重构。 |
| `issue-diag-region-no-empty-state` | 逻辑断点与硬伤 | undefined | low | 体检区三块均无空态处理，数据为空时只剩标题 | 需产品确认空态文案，以及空态下是否提供「发起 AI 体检」的动作入口。 |
| `issue-guidance-unused-modals` | 版本快照差异比对弹层 | undefined | low | GuidanceModals.tsx 内另两个弹层组件全库零引用（死代码约 298 行） | 需产品确认「工作台内建待办 / 材料上传」是否仍在路线图上：若在，应补入口与边；若否，应删除以消除误读（读代码者会以为该能力已就绪）。 |
| `issue-milestones-static-trend` | 阶段均分跃迁卡 | undefined | low | 阶段均分跃迁四数字全写死，且当前数据结构无法支撑真实计算 | 阶段段数需产品先拍板（L1~L4/L5/L6 之争）；真实计算则依赖历史分数数据源的建立。 |
| `issue-product-framework-incremental-growth` | shuangchuang-ai-wiki | intended | low | 产品规则：功能模块树会持续生长，structure.json 需允许增量扩展 | 无——登记为长期约定，随批 1~3 铺开持续验证其可操作性。 |
| `issue-screening-default-track-filter` | 智能初筛中心 | undefined | low | 初筛页默认按「高教主赛道-创意组」筛选，首屏只显示部分项目且与驾驶舱数字对不上 | 属产品口径决策（管理端首屏默认看全校还是看主赛道）；定后再改初值或补跳转载荷（与 issue-cockpit-screening-nav-no-context 联动）。 |
| `issue-supervision-static-metrics` | 督导指标横幅 | undefined | low | 督导指标横幅「AI 复核提分均值 +7.0 分」写死，而真实提分数据可算 | 无外部阻塞，属实现补齐（数据已在 `workOrders` 上）。 |
| `issue-teams-dead-state` | 搜索与团队筛选 | undefined | low | 团队管理页两处死代码：trackFilter 声明后从未被读取、ipReady 派生后从未被使用 | 无外部阻塞；建议与 issue-teams-fake-metrics 一并处理（同一文件的清理批次）。 |
| `issue-users-auto-email` | 新增用户弹窗 | undefined | low | 新增用户邮箱自动生成会把中文姓名拼进域名（如「张三@university.edu.cn」） | 无外部阻塞，属实现修补；若引入拼音方案需新增依赖。 |
| `issue-workbench-material-registry-gap` | 项目文件夹 | undefined | low | 材料注册表的来源映射键集与渲染集不闭合 | 需要一份完整的项目材料清单（现仅存在 AI 生成文件的 mock）。 |

## 逐条详情

### `e-guidance-taskbar-2-workbench-todo-writeback`

- 走向：**任务上下文条**（`nd-guidance-taskbar`）→ **动态待办**（`nd-workbench-todo`）｜type `writeback`｜status **intended**｜severity high
- 触发：点击任务上下文条「完成并回写待办」按钮
- 期望行为：点击后，项目工作台「动态待办」中 taskId 对应的 AI 待办应被标记 completed=true，且返回项目工作台时该勾选状态仍然保持。
- 设计依据：按钮自身文案「完成并回写待办」src/components/SceneGuidanceWorkbench.tsx:423；其 alert 文案「…并已回写项目工作台·动态待办！」src/components/SceneGuidanceWorkbench.tsx:147
- **卡点**：待办池状态被困在 ProjectMemberWorkbench 组件内部（useState(WORKBENCH_AI_TODOS)，:71），App 层无访问入口；需要把 aiTodos 提升到 App 层或引入共享状态，才能打通跨页回写。

### `e-kb-list-2-coach-intended`

- 走向：**知识库列表卡与启停/删除**（`nd-kb-list`）→ **AI 备赛教练**（`page-coach`）｜type `read`｜status **intended**｜severity high
- 触发：（设计意图）AI 助手/备赛教练应挂载已启用的知识库做 RAG 检索
- 期望行为：启用的知识库应作为 AI 助手（及校内智库提问）的检索底座：问答引用可回溯到库内文档与要点；停用后该库不再被检索。
- 设计依据：校端页头徽标「校内专属智库 (RAG底层)」src/components/KnowledgeBaseManagement.tsx:323；启停 Toast「AI大模型与智能备赛教练即刻恢复检索调用」src/components/KnowledgeBaseManagement.tsx:97；底部声明「在 AI 智能导师与备赛问答中提供准确的原文引文出处（Grounding Citations）」src/components/KnowledgeBaseManagement.tsx:831
- **卡点**：AI 助手的「校内智库」回答读的是 `mockCoachData` 的另一套语料（默认厦门大学、引用文号硬编码「厦大创字〔2025〕06号」），与知识库的 22 个 state 零连接；全库无检索引擎与向量库调用。

### `e-mentorship-book-2-workbench-intended`

- 走向：**智能短板定向匹配与预约**（`nd-mentorship-match`）→ **项目工作台**（`page-workbench`）｜type `writeback`｜status **intended**｜severity high
- 触发：点击推荐专家卡「一键预约排期」
- 期望行为：预约后应为该导师与该项目的辅导创建一条工单（`SupervisionWorkOrder`），使 `page-supervision` 能看到待处理工单、`page-workbench` 能看到导师派发任务。
- 设计依据：预约成功文案「已成功为【项目】预约【导师】老师：{时段}。**AI 辅导工单已同步创建！**」src/components/MentorshipDispatch.tsx:89
- **卡点**：handleBookMentor 只 setBookingSuccessMsg + 4 秒后清空；本页没有 onAddNewWorkOrder prop（App 有 handleAddNewWorkOrder 但只传给了 page-supervision），也未传入导师/项目关联字段。

### `e-users-table-2-shell-accounts-intended`

- 走向：**用户台账表与账号操作**（`nd-users-table`）→ **应用壳层**（`shell-app`）｜type `writeback`｜status **intended**｜severity high
- 触发：点击状态列徽标切换启用/停用；或在新增弹窗提交新用户
- 期望行为：账号的新增、启停与角色授权应进入系统级权限体系（可被登录/鉴权消费），并同步到统一身份认证；停用后该用户应无法登录或失去相应权限。
- 设计依据：页尾声明「按校级统一身份认证系统 (CAS/OAuth2) 权限策略实时同步」src/components/UserManagement.tsx:407；新增弹窗「账号开通后将自动下发短信及激活邮件…」src/components/UserManagement.tsx:530-532；弹窗标题「录入新用户与分配权限」src/components/UserManagement.tsx:437
- **卡点**：users 是组件本地 state（初值 MOCK_USERS），本页**没有任何上行 prop**（只有可选 onOpenProject）；账号与登录体系（page-login 的 DEMO_PRESET_ACCOUNTS + 前端自选角色）互不相通，Auth 层不存在。

### `e-workbench-diag-gaps-2-workbench-todo`

- 走向：**逻辑断点与硬伤**（`nd-workbench-diag-gaps`）→ **动态待办**（`nd-workbench-todo`）｜type `writeback`｜status **intended**｜severity high
- 触发：AI 对标体检测出新的逻辑断点（系统自动生成，非用户点击触发）
- 期望行为：体检产出 N 条逻辑断点时，动态待办中同步出现 N 条 AI 来源待办；点其「去执行」可跳到工作台对应章节；断点消除后该待办可关闭。
- 设计依据：产品口径（0911 #2.2）：「短板中的逻辑断点应该跟动态待办绑定，可以认为检测出逻辑断点后就会自动地在动态待办中新增一条相应待办。后续也是通过动态待办去处理。所以应该是逻辑断点--动态待办--相应模块」
- **卡点**：三处缺失：①LogicGapItem 无稳定 id（src/types.ts:91-97），无法建立「断点 ↔ 待办」一一映射；②定位口径不一致——location 是「BP 第24页《发展规划与财务预测》」（实测 src/data/mockProjects.ts:91），而待办的 chapterRef 是「第10章 财务预测与融资计划」，页面上已有的 chapterIdFromRef 正则（第N章）对前者不匹配，需新增「页→章」映射或统一口径；③待办池 WORKBENCH_AI_TODOS 是模块级静态常量，组件内无 append 入口（与 e-guidance-taskbar-2-workbench-todo-writeback 同一根因：状态层级过低）。

### `e-coach-composer-2-stream-mention-intended`

- 走向：**消息输入区与能力配置**（`nd-coach-composer`）→ **会话消息流**（`nd-coach-stream`）｜type `writeback`｜status **intended**｜severity medium
- 触发：@ 引用项目文件后提问（输入框 placeholder 承诺）
- 期望行为：被引用的项目文件（以及上传的本地文件）应进入模型上下文并影响回答内容。
- 设计依据：输入框 placeholder「输入内容，输入 @ 可引用项目文件提问，或点击上方推荐任务载入提示词...」src/components/ChatComposer.tsx:264；项目文件弹层副标题「AI 备赛助手将在当前会话中深度结合该文件解答」src/components/ChatComposer.tsx:673
- **卡点**：mentionedFiles / localUploadedFiles 只写进 msg.mentionedFiles 用于渲染 chip 与标记，全仓无检索或注入消费方；本地文件甚至只有文件名与大小（不读内容）。

### `e-coach-deep-2-defense-intended`

- 走向：**深度调用管道（4.2 / 4.3）**（`nd-coach-deep`）→ **模拟答辩训练**（`page-defense`）｜type `navigate`｜status **intended**｜severity medium
- 触发：触发 4.3 深度调用（胶囊「全流程模拟答辩」/ 关键词命中文案「跳转 4.3 模拟评审与多考官极限压力训练」）
- 期望行为：应跳到 page-defense（模拟答辩训练）并带入项目与对应模式，而不是在会话里跑一遍 2 秒模拟。
- 设计依据：用户消息文案「帮我开启全流程模拟答辩，跳转 4.3 模拟评审与多考官极限压力训练」src/components/SceneAICoach.tsx:1076；原子卡按钮「一键升级为 4.3 全流程答辩训练 →」src/components/AtomicCallCard.tsx:271
- **卡点**：实际只在会话内模拟并回帖结果卡（handleStartDeepCall → 配置卡 → 执行弹窗 → 结果卡）；SceneAICoach 的 onNavigateToScene prop 由 App 注入（src/App.tsx:631）却从未被调用（该 prop 在组件里被解构后无任何使用点）。

### `e-platform-kb-2-school-kb-intended`

- 走向：**平台赛事知识库（admin 端）**（`nd-platform-kb`）→ **知识库列表卡与启停/删除**（`nd-kb-list`）｜type `read`｜status **intended**｜severity medium
- 触发：（设计意图）平台标准库应下发/供给各高校使用
- 期望行为：平台库作为底层标准对校端可见（订阅或引用），校端 AI 检索时可同时命中平台标准与本校私有库。
- 设计依据：平台端副文「本模块数据独立于各高校本校私有智库，作为底层标准供给全平台」src/components/PlatformKnowledgeBaseManagement.tsx:330-332；指标卡「面向全部入驻高校下发」:352
- **卡点**：两端各自自持 state（`MOCK_PLATFORM_KNOWLEDGE_BASES` vs `MOCK_KNOWLEDGE_BASES`）、均无 props、无共享数据层与订阅机制；App 仅按 `session.role === 'system_admin'` 分流渲染，两者之间没有任何数据流动。

### `e-supervision-invitations-2-shell-intended`

- 走向：**学校指派与导师邀请闭环**（`nd-supervision-invitations`）→ **应用壳层**（`shell-app`）｜type `writeback`｜status **intended**｜severity medium
- 触发：接受指导并入驻 / 婉拒邀请（含理由）
- 期望行为：邀请响应（接受/婉拒+理由）应回传学校端（`page-mentorship` 的导师调度或学校侧指派记录），使管理端能看到导师是否接单；接受后项目应进入该导师的指导项目库。
- 设计依据：婉拒成功文案「回执与理由已同步推送至学校双创教学指导处。」src/components/SupervisionClosure.tsx:150；接受文案「已加入您的指导项目库」src/components/SupervisionClosure.tsx:136
- **卡点**：invitations 是页面本地 state（初值 mockSchoolInvitations），接受/婉拒只改本地并弹 Toast；本页没有对应上行 prop，App 层无邀请状态与接收方。

### `e-workbench-folder-2-guidance-version-drawer`

- 走向：**项目文件夹**（`nd-workbench-folder`）→ **版本历史抽屉**（`nd-guidance-version-drawer`）｜type `navigate`｜status **intended**｜severity medium
- 触发：点击项目文件夹主文档版本线下方的「完整版本历史 / diff 对比 / 回滚」提示语
- 期望行为：点击后跳到材料打磨工作台（`page-guidance`），并自动打开其右缘版本历史抽屉（drawerOpen=true）。
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
