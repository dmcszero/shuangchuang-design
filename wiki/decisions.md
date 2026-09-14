# 待拍板清单（产品决策分流）

> 由 `python wiki/gen_wiki_tools.py gaps` 从 `wiki/edges.json` 生成，**勿手改**。
> 口径：只收 `category = 产品决策` 的条目（issues[] 与带该标记的边），按 severity 排序（high → medium → low）；技术实现 / 数据口径类问题不混入本清单，见 `wiki/gaps.md`。
> 交付节奏（2026-09-14 用户拍板）：批 1~3 全部铺开后**一次性全量交付**上司对齐，不逐批打扰。owner=工程自决 的条目为已定规则登记，列此供知悉，无需上司决策。
>
> 统计：共 13 条（上司拍板 7 · 工程自决 2 · 待产品定义 4）。

## 汇总表

| # | 条目 | 位置 / 走向 | owner | severity |
|---|---|---|---|---|
| 1 | （候选）点击某条评委提问 → 进入模拟答辩训练并带入该题（`e-workbench-diag-questions-2-defense`） | 评委尖锐提问攻防演练（`nd-workbench-diag-questions`）→ 模拟答辩训练（`page-defense`） | 上司拍板 | high |
| 2 | 两套会话实现是否统一：page-coach 完整版 vs guidance 右栏内嵌简版（保留哪套）（`issue-product-coach-session-unification`） | 右栏 AI 备赛伴学教练（`nd-guidance-coach`） | 上司拍板 | high |
| 3 | 「产物 / 资产」两套体系未统一：AI 产出无归档路径，路演幻灯片两处各 mock（`issue-assets-vs-coach-deliverables`） | 素材与资产管理（`page-assets`） | 上司拍板 | medium |
| 4 | 右栏 AI 教练有 4 个 state 声明后从未被消费（`issue-guidance-dead-coach-state`） | 右栏 AI 备赛伴学教练（`nd-guidance-coach`） | 上司拍板 | medium |
| 5 | 阶段口径三套并存（本页 L1~L6 / 教练 L1~L4 / 看板 L1~L5）（`issue-guidance-stage-taxonomy-mismatch`） | 全链路指导工作台（`page-guidance`） | 上司拍板 | medium |
| 6 | 登录页是演示态假门：文案称支持统一身份认证，实为前端自选身份 + 免密预置卡 + 密码不校验（`issue-login-sso-placeholder`） | 登录分流（`page-login`） | 待产品定义 | medium |
| 7 | 导师池「一页两端」但数据完全不互通（平台专家无法下派、校端看不到平台库）（`issue-mentors-pool-two-ends-not-synced`） | 导师池管理（`page-mentors-pool`） | 上司拍板 | medium |
| 8 | 产品规则：L1~L6 跨模块非单模块负责 → page-guidance 改名「材料打磨工作台」（批 3 后执行）（`issue-product-guidance-rename-material-workbench`） | 全链路指导工作台（`page-guidance`） | 上司拍板 | medium |
| 9 | 产品规则：每个学生仅绑定一个项目，学生端不可切换项目（demo 可切换仅为演示）（`issue-product-single-project-binding`） | 项目工作台（`page-workbench`） | 工程自决 | medium |
| 10 | 「备赛空间（ProjectSpace）」整套能力无 UI 入口，是死结构（`issue-coach-spaces-dead`） | 会话历史与新建对话（`nd-coach-sessions`） | 待产品定义 | low |
| 11 | 体检区三块均无空态处理，数据为空时只剩标题（`issue-diag-region-no-empty-state`） | 逻辑断点与硬伤（`nd-workbench-diag-gaps`） | 待产品定义 | low |
| 12 | GuidanceModals.tsx 内另两个弹层组件全库零引用（死代码约 298 行）（`issue-guidance-unused-modals`） | 版本快照差异比对弹层（`nd-guidance-diff-modal`） | 待产品定义 | low |
| 13 | 产品规则：功能模块树会持续生长，structure.json 需允许增量扩展（`issue-product-framework-incremental-growth`） | shuangchuang-ai-wiki（`shuangchuang-ai-wiki`） | 工程自决 | low |

## 逐条详情

### 1. （候选）点击某条评委提问 → 进入模拟答辩训练并带入该题

- 来源：`e-workbench-diag-questions-2-defense`（边）｜位置：评委尖锐提问攻防演练（`nd-workbench-diag-questions`）→ 模拟答辩训练（`page-defense`）
- owner：**上司拍板**｜severity：**high**
- **背景**：当前无实现。产品口径已确定「评委提问不走动态待办体系」，但去向未定，本边为候选路径之一。
- **建议 / 期望**：评委提问不走动态待办，那走哪？**建议（待拍板）：接「模拟答辩训练」的问答对抗阶段，把它当题库用。** 三条理由：①该区块源码标题本身就写着「评委尖锐提问攻防演练」（src/components/ProjectMemberWorkbench.tsx:751），业务定位本就是演练而非任务；②提问没有终态——待办可勾掉，提问要反复练，与答辩训练的重复演练语义一致；③page-defense 已有问答对抗阶段，天然是它的下游。备选路径：单题「去练」直达 AI 教练并预填该问题（更轻，但缺少针对单题的演练结构）。接洽前必须先解的前置：killerQuestions 是 string[]（src/types.ts:124），载不动题目 id / 应对要点 / 佐证材料 / 时长；且 defenseConstants 的题库与本区块各自 mock，无共享。

### 2. 两套会话实现是否统一：page-coach 完整版 vs guidance 右栏内嵌简版（保留哪套）

- 来源：`issue-product-coach-session-unification`（issue）｜位置：右栏 AI 备赛伴学教练（`nd-guidance-coach`）
- owner：**上司拍板**｜severity：**high**
- **背景**：「AI助手」三名并存（2026-09-14 用户要求明确，见《0914-15-LLM-Wiki框架合流变更方案》§3.3）：①page-coach（SceneAICoach.tsx，2965 行）+ new_chat 通用会话 = 框架 1.1「AI助手」本体（ReAct 过程可视化、会话历史、新建对话）；②page-guidance 右栏「AI 备赛伴学教练」= 内嵌简版辅助栏（关键词 if-else 假回复 SceneGuidanceWorkbench.tsx:206-238、无会话管理、三个死状态），与 page-coach 零共享（不同 state/mock/消息类型）；③「材料打磨工作台」= page-guidance 改名后的页面名。统一前，guidance 右栏按「内嵌辅助栏」定位下钻，不与 1.1 混同。
- **建议 / 期望**：两套会话实现是否统一？若统一，保留哪一套（完整版 page-coach 还是内嵌简版）？统一前 guidance 右栏维持「内嵌辅助栏」定位。
- **卡点**：待上司拍板；该决策同时卡住 issue-guidance-dead-coach-state（右栏 4 个死状态补齐还是删除）。

### 3. 「产物 / 资产」两套体系未统一：AI 产出无归档路径，路演幻灯片两处各 mock

- 来源：`issue-assets-vs-coach-deliverables`（issue）｜位置：素材与资产管理（`page-assets`）
- owner：**上司拍板**｜severity：**medium**
- **背景**：AI 助手右栏的产物区是常量 ALL_PROJECT_DELIVERABLES（8 项，RightWorkspacePanel.tsx:40-124）+ 硬编码预览；资产管理系统有文件树 + 版本时间线 + Diff（AssetManagementSystem.tsx），但两者零共享：①AI 生成的产物不会进入资产库（深度调用「采纳并同步至工作空间」只追加一条提示消息）；②路演幻灯片在资产页用 ROADSHOW_SLIDES_DATA（mockAssetManagementData.ts:118-135），在答辩页用 MOCK_ROADSHOW_SLIDES（defenseConstants.ts），两份数据互不相干；③page-workbench 的项目文件夹又宣称「与全链路指导工作台快照同源」，构成第三套版本口径。
- **建议 / 期望**：一个项目只有一套「资产/产物」真源：AI 产物、答辩材料、BP 版本都归档进同一处并按版本管理；各页只做展示投影。
- **卡点**：属产品架构级决策（资产库是独立模块还是各模块内嵌），需上司拍板后由工程统一数据层。

### 4. 右栏 AI 教练有 4 个 state 声明后从未被消费

- 来源：`issue-guidance-dead-coach-state`（issue）｜位置：右栏 AI 备赛伴学教练（`nd-guidance-coach`）
- owner：**上司拍板**｜severity：**medium**
- **背景**：chatCollapsed/setChatCollapsed（:99，无折叠按钮）、coachIntent/setCoachIntent（:100，setter 全文件仅出现在声明行，导致 AI 兜底文案「基于【L4】阶段指引」恒为 L4）、sessions/setSessions（:101，无会话列表，INITIAL_COACH_SESSIONS 导入即废弃）、activeSessionId/setActiveSessionId（:102，无消费）。四者合计对应「会话管理」「面板折叠」「阶段聚焦」三个未落地能力。
- **建议 / 期望**：会话列表可切换（sessions 驱动）、面板可折叠（chatCollapsed 驱动）、阶段徽章可切换并影响 AI 回复口径（coachIntent 真正可写）。
- **卡点**：三处均为 UI 未实现（不是数据缺失）：mock 数据已备好但无渲染分支；需先决定本页右栏与 page-coach 的分工，再决定是补齐还是删除。

### 5. 阶段口径三套并存（本页 L1~L6 / 教练 L1~L4 / 看板 L1~L5）

- 来源：`issue-guidance-stage-taxonomy-mismatch`（issue）｜位置：全链路指导工作台（`page-guidance`）
- owner：**上司拍板**｜severity：**medium**
- **背景**：本页 stepper（INITIAL_STAGE_ITEMS）为 L1~L6（创意激发/可行性验证/材料成型/打磨优化/路演成型/赛前冲刺），page-coach 侧为 L1~L4，page-milestones（里程碑看板）为 L1~L5。三套口径都叫「Lx 阶段」，且本页 stepper 的点击还不消费 stage 值，导致「阶段」在系统内既无统一定义也无实际跳转能力。
- **卡点**：需产品拍板唯一的阶段口径与阶段数（L4/L5/L6 之争），再统一三处数据源与 stepper 行为；本轮只登记，不展开。

### 6. 登录页是演示态假门：文案称支持统一身份认证，实为前端自选身份 + 免密预置卡 + 密码不校验

- 来源：`issue-login-sso-placeholder`（issue）｜位置：登录分流（`page-login`）
- owner：**待产品定义**｜severity：**medium**
- **背景**：页面底部署名「支持统一身份认证 (CAS / OAuth2.0 / 统一学工号)」（LoginPage.tsx:274-278），但代码中没有任何 SSO 跳转/回调/token 处理：①身份由左栏四张卡前端单选；②「一键免密登入」预置账号卡直接构造 session 调 onLoginSuccess，绕过全部校验（LoginPage.tsx:513-532）；③表单只校验账号非空与学生/校管端高校非空，**密码字段无任何校验**，默认值 123456 明文写在源码（LoginPage.tsx:36-38、72-81）。session 存 localStorage，刷新即免登录。
- **建议 / 期望**：产品化需明确：接哪套统一身份认证（校内 CAS / OAuth2.0 / 学工号）、四端身份是否由认证结果而非用户自选决定、预置免密卡在非演示环境是否保留。
- **卡点**：需产品侧给认证口径（依赖各校 IT 环境），工程侧才能落地；demo 阶段保持现状。

### 7. 导师池「一页两端」但数据完全不互通（平台专家无法下派、校端看不到平台库）

- 来源：`issue-mentors-pool-two-ends-not-synced`（issue）｜位置：导师池管理（`page-mentors-pool`）
- owner：**上司拍板**｜severity：**medium**
- **背景**：`page-mentors-pool` 在 admin 端渲染 `PlatformMentorPoolManagement`（自持 `MOCK_PLATFORM_MENTORS`，**无任何 props、改动不出组件**），在校管端渲染 `MentorPoolManagement`（吃 App 的 `mentors` 并 `onUpdateMentors` 写回）。两套数据、两套枚举（`certificationLevel` vs `roleCategory`）、两套可用性语义（`dispatchStatus` vs `availability`）、两个独立导出实现。后果：①平台端「跨校调度工单」（MODAL 3）有出口无落点——没有任何页面接收；②平台特聘专家不会出现在校端的调度页候选里；③校端也看不到平台库。
- **建议 / 期望**：明确两端关系（平台库是校端库的超集？还是分属两套池、靠「下派/调度」桥接？），并建立对应链路：若为超集则共享数据源；若靠调度桥接，则需在校端或调度页建立「调度工单接收与展示」。
- **卡点**：属产品级数据架构决策（多校/单校部署形态、平台与学校的导师库关系），需上司拍板后由工程统一数据层。

### 8. 产品规则：L1~L6 跨模块非单模块负责 → page-guidance 改名「材料打磨工作台」（批 3 后执行）

- 来源：`issue-product-guidance-rename-material-workbench`（issue）｜位置：全链路指导工作台（`page-guidance`）
- owner：**上司拍板**｜severity：**medium**
- **背景**：用户大框架「1.3」注：全链路指导工作台后续要更改为材料打磨工作台，专门支持可编辑文本材料的编辑、打磨——因为 L1~L6 本质上涉及各个模块，而非单模块负责。由此两条后果：①page-guidance 定位收窄为「材料打磨工作台」，改 title + 节点口径（排期：批 3 完成后统一执行，同步改 schema 变更记录）；②「阶段」概念不归属单一页面，加剧三套阶段口径并存问题（见 issue-guidance-stage-taxonomy-mismatch，需上司拍板唯一口径）。
- **建议 / 期望**：批 3 完成后：page-guidance title 改为「材料打磨工作台」，页面/节点文档口径同步改写（只改口径描述不改行号引用）；structure.json 该页 frameworkRef 去除改名排期注记。
- **卡点**：改名动作本身已排期（批 3 后）；但 L1~L6 唯一阶段口径未拍板前，节点文档中涉及阶段的表述维持现状只登记不展开（issue-guidance-stage-taxonomy-mismatch）。

### 9. 产品规则：每个学生仅绑定一个项目，学生端不可切换项目（demo 可切换仅为演示）

- 来源：`issue-product-single-project-binding`（issue）｜位置：项目工作台（`page-workbench`）
- owner：**工程自决**｜severity：**medium**
- **背景**：用户大框架（2026-09-14）「1. 学生角色」注：每个学生仅会绑定一个项目，demo 中展示仅因为方便查看，后续学生端只会看到自己的项目无法切换。当前 demo 登录时会 setActiveTeamProjectId 并允许切换查看不同项目（App.tsx:323-328），工作台/驾驶舱多处以 activeTeamProjectId 驱动。
- **建议 / 期望**：学生端账号与唯一项目绑定：登录后无项目切换入口，所有学生端页面只呈现该项目数据；demo 的多项目切换能力在学生端入口关闭（管理端不受影响）。
- **卡点**：规则已定（用户拍板 2026-09-14），无需上司再议；落地为工程收口——待 demo 产品化阶段执行，本轮 wiki 只登记不改代码。

### 10. 「备赛空间（ProjectSpace）」整套能力无 UI 入口，是死结构

- 来源：`issue-coach-spaces-dead`（issue）｜位置：会话历史与新建对话（`nd-coach-sessions`）
- owner：**待产品定义**｜severity：**low**
- **背景**：App 持有 spaces / activeSpaceId 与 handleSelectSpace / handleCreateSpace / handleSyncWorkspace 全套 handler（App.tsx:73-76、348-407、485-495），并透传给 Sidebar 与 ChatComposer；但两处组件都声明了 props 却**从未在组件体内使用**（Sidebar.tsx:76-80 仅有声明；ChatComposer.tsx:36-39 连解构都没做），故 activeSpaceId 恒为 'none'、currentActiveSpace 恒为 null，建空间/切空间/云同步三条链路全部不可达（并连带 issue-coach-project-context-unbound）。
- **建议 / 期望**：要么给「备赛空间」补上入口（侧栏空间选择器 + 新建空间向导 + 云同步状态），要么按「每个学生只有一个项目」的产品口径整块移除，避免半套概念留在代码里。
- **卡点**：需产品拍板：备赛空间是多项目管理能力，与「每个学生仅绑定一个项目」（issue-product-single-project-binding）直接冲突——二者只能留一个。

### 11. 体检区三块均无空态处理，数据为空时只剩标题

- 来源：`issue-diag-region-no-empty-state`（issue）｜位置：逻辑断点与硬伤（`nd-workbench-diag-gaps`）
- owner：**待产品定义**｜severity：**low**
- **背景**：实测 proj-002 的 logicGaps 为空数组，该区块仅渲染标题「逻辑断点与硬伤分析 (0)」，下方空白；killerQuestions 与 tier1Scores 同理。三个区块均无「暂无数据 / 尚未体检」提示，也无「发起体检」入口。
- **卡点**：需产品确认空态文案，以及空态下是否提供「发起 AI 体检」的动作入口。

### 12. GuidanceModals.tsx 内另两个弹层组件全库零引用（死代码约 298 行）

- 来源：`issue-guidance-unused-modals`（issue）｜位置：版本快照差异比对弹层（`nd-guidance-diff-modal`）
- owner：**待产品定义**｜severity：**low**
- **背景**：GuidanceModals.tsx 导出三个组件，但全 src/ 只有 SceneGuidanceWorkbench 引用了 GuidanceVersionDiffModal（import 与使用各 1 处）。GuidanceUploadModal（:184-332，148 行）与 GuidanceCreateTodoModal（:341-481，140 行）无任何引用。后者构造的 GuidanceTodoItem 与 guidanceTypes 契约一致，疑似「工作台内建待办」旧方案遗留。
- **卡点**：需产品确认「工作台内建待办 / 材料上传」是否仍在路线图上：若在，应补入口与边；若否，应删除以消除误读（读代码者会以为该能力已就绪）。

### 13. 产品规则：功能模块树会持续生长，structure.json 需允许增量扩展

- 来源：`issue-product-framework-incremental-growth`（issue）｜位置：shuangchuang-ai-wiki（`shuangchuang-ai-wiki`）
- owner：**工程自决**｜severity：**low**
- **背景**：用户大框架总注：后续还会继续基于当前版本进行功能开发，即功能模块树还会继续生长，但当前先按现状设计。对 wiki 的含义：section/page/persona/placeholder 均须支持增量登记，不允许推翻式重构；新增功能若 demo 未实现，走 placeholders[] 占位（只登记、不建 page/node），与 2026-09-14 框架合流原则一致。
- **建议 / 期望**：新增模块时：demo 已实现 → 增量登记 page（+personas/frameworkRef）并排期下钻；demo 未实现 → 登记 placeholders[]。schema 变更走 §10 变更记录，批次规划随之追加。
- **卡点**：无——登记为长期约定，随批 1~3 铺开持续验证其可操作性。
