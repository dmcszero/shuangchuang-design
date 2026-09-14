# LLM Wiki 结构 Schema v0.8

> 本文是 wiki 结构的**唯一约定源**。任何节点/边/页面的新增与修改以本文为准。
> 状态：**`冻结`**（2026-09-11 庄冉验收通过——节点粒度「够了」、section 提案「接受」；v0.4 框架合流经 2026-09-14 确认；v0.5~v0.8 为批 1/2/3 下钻与批 4 改名后的版本号推进，契约未变）

---

## 0. 基线与口径

| 项 | 值 | 说明 |
|---|---|---|
| **真源仓** | `shuangchuang-design-main`（本仓 `main`） | 2026-09-14 起；本仓已重定基线到团队仓 `guideshiny/shuangchuang-design` 的 `main`（`505a858`），**所有建模以本仓当前源码为准**；跟进用 `git fetch upstream && git merge upstream/main` |
| **旧基线** | `wiki-v1/`（本仓） | v1 结构（20 页 taxonomy，2026-09-10 产出）冻结，不再更新；仅供 v2 对照——其 `Sources` 指向的旧行号已不可回溯 |
| **行号口径** | UTF-8 解码行数，1-based，闭区间 | `路径:起[-止]` |
| **路径口径** | 相对本仓根 `shuangchuang-design-main/` | 例：`src/App.tsx` |
| **引用语法** | `Sources: [路径:行号]()` | 复用既有 `CITATION_RE` 契约，不新增格式 |

**基线轨迹**：v1 的 `Sources` 指向 design-main 09-10 快照的行号；团队仓继续推进后，2026-09-11 曾把建模基线切到 `shuangchuang-design-SY/` 克隆目录，以求「结构与源码同仓同版本」——但那是**他人的仓、且产出未入库**，无任何版本保护。**2026-09-14 改回本仓**：`main` 重定基线到团队 `main`、`upstream` 只读远程挂上（`pushurl=no_push`，误推实测失败），于是「同版本」由 fetch+merge 保证、「产出受保护」由本仓 git 保证——两件事拆成两套独立机制，互不牵扯。

---

## 1. 四层模型 + 正交维度（v0.4）

| 层 | 名称 | 载体 | 粒度判据 | 预期量级 |
|---|---|---|---|---|
| L1 | **section** 一级模块 | `structure.json` → `sections[]` | 用户视角的**连续任务域**（不是功能的机械分组） | 5~8 |
| L2 | **page** 页面/视图 | `pages/<id>.md` | `App.tsx` 的一个 tab 或一个独立视图 | ~15 |
| L3 | **node** 可见交互单元 | `nodes/<page-id>/<id>.md` | **用户能指认、能点**的功能块 | 5~12 / page |
| L4 | **edge** 边 | `edges.json` | 两个 node 间的**有向、带语义**关系 | — |

**正交维度（2026-09-14 框架合流新增，与四层不互相替代）**：

| 维度 | 名称 | 载体 | 说明 |
|---|---|---|---|
| persona | **端** | `structure.json` → `personas[]` + `page.personas` | 权限与导航视角（学生 / 学校管理 / 辅导导师 / admin 超管，4 端）；section 是任务链路视角，两者正交。`page.personas` 为多值——复用页面标多端（如 page-knowledge-base 同时服务学生/校管/admin） |
| placeholder | **占位** | `structure.json` → `placeholders[]` | 大框架里有、demo 尚未实现的功能：**只登记占位（id/title/personas/frameworkRef/note），不建 page/node**，待产品定义明确后补 |
| frameworkRef | **大框架条目号** | `page.frameworkRef` / `placeholder.frameworkRef` | 对应用户大框架（0914 #5）的条目编号（如 `1.3`、`2.11`），保持 wiki 与产品大框架可追溯 |

persona 定义含 `defaultPage`（该端登录后的默认落地页），**一律以源码分流逻辑为准**（App.tsx 初始化与登录处理器），不以方案文档猜测为准。

层级表达：
```
section ──(membership)──▶ page ──(page 字段)──▶ node
                                                    │
                                              edge ─┴─▶ node / page

persona ──(page.personas 多值)──▶ page        placeholder（🧩 仅登记，不入图）
```

> `section → page` 的归属写在 `structure.json` 的 section 成员里；`page → node` 的归属写在 node 的 `page` 字段里。二者都不需要额外的边。

---

## 2. 命名规范

| 对象 | 规则 | 示例 |
|---|---|---|
| section | `sec-<domain>` | `sec-growth` |
| page | `page-<view>` | `page-workbench` |
| node | `nd-<page缩写>-<unit>` | `nd-workbench-todo` |
| edge | `e-<from简>-2-<to简>[-<区分词>]` | `e-workbench-todo-2-guidance-ai` |
| persona（v0.4） | `p-<role>` | `p-student` |
| placeholder（v0.4） | `ph-<feature>` | `ph-review-report` |
| issue（v0.4 补充） | 产品规则类用 `issue-product-<slug>` | `issue-product-single-project-binding` |

- 全小写，单词间用 `-`
- node 的 `id` **必须等于文件名**（去掉 `.md`）
- 同一 `from → to` 允许多条平行边，但 **id 与 trigger 必须不同**

---

## 3. node frontmatter

```yaml
---
id: nd-workbench-todo
title: 动态待办
page: page-workbench
kind: panel
importance: high
sources:
  - src/components/ProjectMemberWorkbench.tsx:274-435
---
```

| 字段 | 必填 | 取值 | 说明 |
|---|---|---|---|
| `id` | ✅ | `nd-*` | = 文件名 |
| `title` | ✅ | 中文短语 | 与页面上的可见名称一致 |
| `page` | ✅ | `page-*` | 父页面，必须在 `structure.json` 中存在 |
| `kind` | ✅ | 枚举（见下） | 交互单元形态 |
| `importance` | ✅ | `high`\|`medium`\|`low` | 对齐 page 口径 |
| `sources` | ✅ | `路径:行号` 列表 | ≥ 1 条；`intended` 节点（若需）可为空但须说明 |

**kind 枚举**：`panel`（内容面板）/ `tab`（子导航项）/ `nav`（导航条）/ `list`（列表）/ `form`（表单/提交区）/ `modal`（弹层）/ `bar`（横条）/ `drawer`（抽屉）/ `table`（表格）

---

## 4. node 正文五节（与 page 同构）

```markdown
## 一句话定位
## 事实（每条强制可回溯）
## 规则与边界（AI 开发硬约束）
## 常见开发任务（AI Coding 入口）
## 出入边（incoming / outgoing）
```

- 前 4 节与 page 完全同构，复用既有 `REQUIRED_SECTIONS` 前缀匹配逻辑。
- 第 5 节 **由工具链生成**（`gen_wiki_tools.py sync-edges`），标记区块如下，手写内容会被覆盖：

```markdown
<!-- EDGES:BEGIN -->
（工具链生成，勿手写）
<!-- EDGES:END -->
```

> 设计理由：`edges.json` 是边的真源。若第 5 节也手写，两份必然漂移；生成可保证一致。

---

## 5. edge schema

```json
{
  "id": "e-workbench-todo-2-guidance-ai",
  "from": "nd-workbench-todo",
  "to": "nd-guidance-taskbar",
  "type": "navigate-with-payload",
  "trigger": "点击 AI 诊断待办项的「去执行」",
  "payload": "GuidanceTaskContext{taskId, title, source:'ai', sourceLabel:'AI 诊断生成', chapterId}",
  "logic": "App.handleExecuteTodo → setGuidanceTaskContext(ctx) + setActiveTab('guidance_workbench')；接收端按 prefiledTaskIdRef 去重后追加 AI 引导消息",
  "status": "implemented",
  "sources": [
    "src/components/ProjectMemberWorkbench.tsx:86-94",
    "src/App.tsx:537-540"
  ]
}
```

### 5.1 `type` 枚举

| type | 语义 | 方向 | 典型 |
|---|---|---|---|
| `navigate` | 纯视图/页切换，无载荷 | 单向 | tab 切换、按钮跳页 |
| `navigate-with-payload` | 跨视图跳转 + 传上下文 | 单向 | 工作台「去执行」 |
| `read` | 读对方数据（props / state / 接口） | 单向 | 子组件接收父级数据 |
| `writeback` | 写回对方状态 | 单向 | 提交整改、完成任务回写 |
| `reuse` | 共用组件 / mock / 类型 / 常量 | 单向（可对称） | 共用 `mockProjects` |
| `embed` | 内嵌渲染对方（父子） | 单向 | 抽屉内嵌详情 |

### 5.2 `status` 枚举 ★核心

| status | 含义 | **必填字段** |
|---|---|---|
| `implemented` | 代码已实现 | `sources`（行号必须可验证） |
| `intended` | 设计要求存在，代码没有 / 只做了一半 | `designRef` + `expected` + `blockedBy` |
| `undefined` | 设计本身也没说清 | `issue`（待确认问题原文） |

`intended` 三问（强制填写，缺一不可）：

| 字段 | 问什么 | 例 |
|---|---|---|
| `designRef` | **从哪来**（设计依据的可引用标识） | `源码文案 ProjectMemberWorkbench.tsx:951` |
| `expected` | **期望行为**是什么 | 点「完整版本历史」→ 切到工作台并打开版本抽屉 |
| `blockedBy` | **卡在哪** | 该处为纯文本 div，无 onClick / 无回传链路 |

### 5.3 issues 分流字段（v0.4）

`edges.json` 的 `issues[]` 每条必须带两个分流字段（校验规则 E2）：

| 字段 | 枚举 | 说明 |
|---|---|---|
| `category` | `产品决策` / `技术实现` / `数据口径` | 问题性质：要不要人拍板、工程自己就能做、还是口径需对齐 |
| `owner` | `上司拍板` / `工程自决` / `待产品定义` | 谁来解：拿去问上司、工程落地时顺手做、等产品侧给定义 |

- `undefined` 边可带同名 `category` / `owner`（可选，带了就必须 ∈ 枚举）。
- `category = 产品决策` 的条目（issues + 带标记的边）由 `gaps` 命令分流生成 **`wiki/decisions.md`《待拍板清单》**，按 severity 排序，含背景 + 建议 + 卡点；技术实现 / 数据口径类只留在 `gaps.md`，不混入清单。
- 交付节奏（2026-09-14 用户拍板）：批 1~3 全部铺开后 decisions.md **一次性全量交付**，不逐批对齐。

---

## 6. 校验规则（在 v1 的 A~D 上扩展）

| 组 | 编号 | 规则 | 级别 |
|---|---|---|---|
| A 结构 | A1~A4 | 沿用 v1（section/page 完整性） | error |
| | **A5** | node 的 `page` 必须存在于 `structure.json` | error |
| | **A6** | node 的 `id` 唯一且 = 文件名 | error |
| | **A7** | `docStatus: "drilled"` 的 page 必须至少 1 个 node | error |
| | **A8**（v0.4） | `page.personas` / `placeholders[].personas` 引用的 id 必须存在于 `personas[]`；`persona.defaultPage` 必须是已定义 page；page 未声明 personas 时 warning | error / warning |
| B frontmatter | B1~B4 | 沿用 v1，字段集换成 node 必填集 | error |
| | **B5** | `kind` ∈ 枚举 | error |
| C 引用 | C1~C4 | 沿用 v1 | error |
| | **C5** | `edge.sources` 行号 ≤ 目标文件实际行数 | error |
| D 边 | **D1** | `from` / `to` 必须存在（**node / page / modal / shell**） | error |
| | **D2** | 平行边 id 与 trigger 不重复 | error |
| | **D3** | `status` 与必填字段矩阵一致（见 5.2） | error |
| | **D4** | `navigate*` 边应存在反向 UI 入口 | **warning**（有去无回） |
| | **D5** | node 第 5 节与 `edges.json` 一致 | error |
| E 缺口 | **E1** | 汇总所有非 `implemented` 边 | 报告 |
| | **E2**（v0.4） | issues 必须有 `category` / `owner` 且 ∈ 枚举；边若带同名字段也须 ∈ 枚举（见 5.3） | error |

---

## 7. node 粒度判定（三问）

对候选交互单元问：

1. **用户能否指认它？**（屏幕上有一块可命名的区域 / 一个 tab / 一个按钮组）
2. **它是否有自己的状态或载荷？**（有 `useState` / props / 入参 / 条件渲染）
3. **它是否至少被一条边连接？**（入边或出边）

| 判定 | 动作 |
|---|---|
| 三问全 ✅ | 建 node |
| 仅 1 ✅ | 不建，写进父 node 的「事实」 |
| 仅 2 ✅ | 不建（内部实现细节，不是交互单元） |

**反例（不建 node）**：纯样式容器、单条静态文案、单独图标、纯布局网格。

**自检**：一个 page 拆出的 node 若 > 12 个，说明粒度切碎了——回到"用户能不能指认"重切。

---

## 8. 与工具链的对接

复用 v1 `gen_wiki_tools.py` 已有设施，零重写：

| 既有设施 | 复用方式 |
|---|---|
| `parse_frontmatter()` | 直接解析 node frontmatter（极简 YAML 子集已够） |
| `section_body()` | 前缀匹配，兼容五节标题带补充说明 |
| `CITATION_RE` | 校验 node 事实引用与 edge.sources |
| `read_lines()` | 行号口径统一入口 |
| `Report` 类 | 错误/警告收集 |

新增子命令：

| 命令 | 作用 | 产出 |
|---|---|---|
| `validate` | 扩展 A5~A7 / B5 / C5 / D1~D5 | 控制台报告 + 非零退出码 |
| `sync-edges` | 把 `edges.json` 渲染进各 node 第 5 节 | 覆盖 `<!-- EDGES:BEGIN/END -->` |
| `index` | 生成 `llms.txt`（含 node 清单） | `wiki/llms.txt` |
| `map` | 生成结构图（node 为点，边带 type/status 着色） | `wiki/module-map.html` + `wiki/site/index.html` |
| `gaps` ★ | 汇总非 `implemented` 边，按 `blockedBy` 聚合；并分流 `category=产品决策` 条目生成《待拍板清单》 | `wiki/gaps.md` + `wiki/decisions.md`（v0.4） |

> `map` 的 HTML 模板与图布局由同目录 `build_map.py` 单独承担（单一模板源），`gen_wiki_tools.py map` 只做入口转发——避免 40 KB 模板双份漂移。产物文件名以实际落盘为准：`module-map.html`（发布副本 `site/index.html`，入口落在 `/`）。

---

## 9. 试点范围与完成情况（第 1~3 步）

| 产出 | 范围 | 状态 |
|---|---|---|
| `wiki/schema.md` | 全量 schema（本文件） | ✅ 已落盘 |
| `wiki/structure.json` | 8 个 section（**已确认**）+ 15 个 page + 壳层/弹层/孤儿清单 | ✅ 已落盘 |
| `wiki/nodes/page-workbench/*.md` | 「项目工作台」**8 个节点**（完整；体检区按业务归宿拆 3 个） | ✅ 已落盘 |
| `wiki/nodes/page-guidance/*.md` | 「材料打磨工作台」（原「全链路指导工作台」）**完整 10 节点**（2026-09-13 补全；2026-09-14 批 4 改名） | ✅ 已落盘 |
| `wiki/pages/page-workbench.md` · `page-guidance.md` | v2 薄页面（页面级事实 + 节点地图） | ✅ 已落盘 |
| `wiki/edges.json` | 11 条边（6 implemented / 4 intended / 1 undefined）+ 4 条 issues | ✅ 已落盘 |
| `wiki/gen_wiki_tools.py` | **正式工具链**：`validate` / `sync-edges` / `index` / `map` / `gaps` 五命令（纯标准库） | ✅ 已落盘并跑通 |
| `wiki/llms.txt` · `wiki/gaps.md` | 由 `index` / `gaps` 生成的产物 | ✅ 已落盘 |
| `wiki/module-map.html` · `wiki/site/index.html` | 结构图（本地预览 + 发布副本，内容一致） | ✅ 已落盘 |
| ~~`wiki/validate_pilot.py`~~ | 试点校验器 | 🗑 **2026-09-14 删除**（09-13 退役后仍硬编码旧基线路径 `shuangchuang-design-SY`，误用风险大于留存价值；副本见 SY 只读镜像与 `RanZhuang/2026-09/AI生成/0914-11-SY-wiki-v2备份/`，或本仓 git 历史 `acebad6`） |

校验结果：**section 8 · page 15（已下钻 15 / 待铺开 0）· node 95 · 边 98（86 implemented / 11 intended / 1 undefined）· issues 41；0 error / 7 warning**
（warning 全部为 D4「有去无回」的单向跳转边——驾驶舱/初筛页等导航出口无反向入口，属预期；A3「待铺开页」汇总提示已随批 3 完成而消失；本行随每批下钻重算）

> 其余 13 个视图按**批次规划**铺开（2026-09-14《0914-15-LLM-Wiki框架合流变更方案》§五，学生端优先、逐端推进）：
>
> | 批次 | 范围 | 页面（顺序） |
> |---|---|---|
> | 批 0 | 框架合流落地 | personas / placeholders / issues 分流 / 工具链 A8·E2·decisions（**本版 v0.4 完成**） |
> | 批 1 | 学生端 | page-login → page-coach → page-defense → page-assets（4 页；先按「学生单项目绑定」「coach=AI助手」口径复核 page-workbench / page-guidance 节点文档，只改口径不改行号） |
> | 批 2 | 学校管理端 | page-cockpit → page-screening → page-mentorship → page-supervision → page-mentors-pool → page-milestones（6 页） |
> | 批 3 | 治理与复用页 | page-teams → page-users → page-knowledge-base（3 页） |
> | 批 4 | 交付总装 | 《待拍板清单》全量交付 + 设计方案说明书 + 结构图发布 |
>
> 每铺开一批需重跑 `sync-edges` → `validate` → `index` → `map` → `gaps`；
> **每批完成定义**：五命令 0 error + 该批页面 docStatus=drilled + issues 全部分流（category/owner）+ commit。
> 逐页执行细节见 `wiki/drilldown-manual.md`《铺开执行手册》。
>
> `build_map.py` 的图布局已改为**按已下钻页面自动分列**（不再是写死的三列），后续新增页面无需改生成器。

---

## 10. 变更记录

| 日期 | 版本 | 变更 |
|---|---|---|
| 2026-09-14 | v0.8 ✅ | **批 4 交付总装（改名动作先行）**：①**`page-guidance` 改名「材料打磨工作台」**（原「全链路指导工作台」）——`structure.json` 的 title/description/frameworkRef/nodeScopeNote 按「专注可编辑文本材料的编辑打磨、L1~L6 阶段跨模块不归属本页」口径改写，页面文档 title 与「一句话定位」改写并新增「改名与定位口径」段，`nd-guidance-taskbar` / `nd-guidance-version-drawer` 两处定位按新名改写，跨页联动引用（page-coach / page-defense / page-workbench / page-assets）同步；**源码内文案仍写作「全链路指导工作台」（如 `ProjectMemberWorkbench.tsx:936` / `:950-952`）属源码事实，保留不改**；②issue `issue-product-guidance-rename-material-workbench` 已随执行**关闭并移除**（改名已完成，不再是缺口；残余的「L1~L6 唯一阶段口径」沿用 `issue-guidance-stage-taxonomy-mismatch` 跟）。③交付物：《待拍板清单（交付版）》《双创智能体设计方案说明书》+ 结构图重生成（发布动作见交付说明）。 |
| 2026-09-14 | v0.7 ✅ | **批 3 治理与复用页下钻完成（3 页 / 16 节点）→ 全库 15 页全部 drilled**：`page-teams`（4）· `page-users`（5）· `page-knowledge-base`（7，含 admin 端平台知识库）由 `pending` → `drilled`；node 79 → **95**、边 89 → **98**（新增 9 条，其中 intended 4：账号体系应入权限系统 / 知识库应作 AI 检索底座 / 平台库应下发校端 / （见 edges）、reuse 1 条：本页与工作台共享 MOCK_PROJECT_TEAMS）、issues 33 → **41**（新增 8 条）；`structure.json`：3 页补 `nodeCount`/`nodeScopeNote`，`page-knowledge-base` 补 `mockPlatformKnowledgeBase.ts` 与 related_pages。**本批口径要点**：①团队页指标卡全为由 `teams.length + 77` 推导的假数据（issue-teams-fake-metrics）；②用户页三写死一半真且账号体系是孤岛（issue-users-accounts-isolated / issue-users-auto-email）；③知识库页指标全部真实派生（与前者相反），但上传 chunks 为随机数、预览要点写死（issue-kb-preview-hardcoded-chunks）、与 AI 助手零连接（issue-kb-not-connected-to-coach）；④第二例「一页两端」（知识库）与第二例「跨页共享数据」（MOCK_PROJECT_TEAMS）已登记为 reuse 边。**本批完成后 A3「待铺开页」警告归零，全库只剩 D4 单向跳转边 warning（7 条）。** |
| 2026-09-14 | v0.6 ✅ | **批 2 校管端下钻完成（6 页 / 34 节点）**：`page-cockpit`（6 节点）· `page-screening`（4）· `page-mentorship`（5）· `page-supervision`（9）· `page-milestones`（4）· `page-mentors-pool`（6，含 admin 端平台导师池）由 `pending` → `drilled`；node 45 → **79**、边 59 → **89**（新增 30 条，含 intended 2：预约导师应创建工单、邀请响应应回传学校端）、issues 24 → **33**（新增 9 条，全部带 category/owner）；`structure.json`：6 页补 `nodeCount` / `nodeScopeNote`，`page-mentors-pool` 的 related_pages 补 page-supervision。**本批口径要点**：①驾驶舱「演示数字 vs 真实派生」同屏矛盾（issue-cockpit-static-metrics）；②初筛全景表固定 17 列且按下标取数，跨赛道必错位（issue-screening-fixed-columns-by-index）；③督导页是全库唯一「跨角色真实写回」闭环（与 page-workbench 共享 workOrders，已补双向边）；④导师池「一页两端」数据完全不互通（issue-mentors-pool-two-ends-not-synced）；⑤里程碑阶段筛选只影响一个数字（issue-milestones-filter-no-effect）。 |
| 2026-09-14 | v0.5 ✅ | **批 1 学生端下钻完成（4 页 / 27 节点）**：`page-login`（4 节点）· `page-coach`（10）· `page-defense`（7）· `page-assets`（6）由 `pending` → `drilled`，各新增 `pages/<id>.md`；node 18 → **45**、边 23 → **59**（新增 36 条，其中 intended 2：附件不参与推理、4.3 深度调用应跳 page-defense）、issues 9 → **24**（新增 11 条，全部带 category/owner）；`structure.json`：page-defense 的 `relevant_files` 由 7 补到 12（实测另有 DefenseVideoWindow / RoadshowDefenseStage / RoadshowCombinedReportModal / DefenseCharts / defenseTypes），4 页补 `nodeCount` / `nodeScopeNote`（page-assets 的 title 按侧栏文案写作「项目资产管理系统（Git 模式）」）。**口径复核（硬约束 1/3）**：`page-workbench` 补「单项目绑定 → demo 项目切换仅演示、不建『项目切换』节点」、`page-guidance` 补「右栏 AI 教练 = 内嵌辅助栏、不属 1.1」两条口径描述（**未改任何行号引用**）。契约未变，版本号推进仅为标记进度。 |
| 2026-09-14 | v0.4 ✅ | **框架合流（批 0）**：新增 persona 维度（4 端 `p-*`，§1 正交维度表）+ `placeholders[]` 占位（`ph-*`，只登记不建页）+ page 增 `personas`/`frameworkRef` 字段；edges.json issues 分流（`category`/`owner`，§5.3）+ 新增 4 条产品规则 issue；工具链新增校验 **A8**（persona 引用完整性）与 **E2**（分流字段必填），`gaps` 扩展生成 `wiki/decisions.md`《待拍板清单》；§9 铺开计划改为批 0~4。口径修正：`p-student.defaultPage` 按源码定为 `page-coach`（App.tsx:59/323-324，变更方案原写 page-workbench）、`p-mentor.defaultPage` 为 `page-supervision`（App.tsx:60，方案原写 page-mentorship）——均按「源码为唯一事实源」改正。依据：《0914-15-LLM-Wiki框架合流变更方案》 |
| 2026-09-14 | v0.3.4 ✅ | 删除退役的 `wiki/validate_pilot.py`（防误跑得假绿；历史副本见 SY 只读镜像与 0914 备份，本仓 git 历史 `acebad6` 亦可取回）；本文件 §9 表格与 `wiki-drilldown` skill 坑条目同步改口 |
| 2026-09-14 | v0.3.3 ✅ | **建模基线回归本仓**：`main` 重定基线至团队 `main`（`505a858`，只读 `upstream` 远程 + `pushurl=no_push`，误推实测失败）；v2 全量迁入本仓 `wiki/`（30 文件、哈希与 SY 一致），v1 转 `wiki-v1/`；`baseline` / `repoRoot` / 本文基线表同步改正；`validate` 0 error、231 处引用全部可解析 |
| 2026-09-13 | v0.3.2 ✅ | **第 4 步首批完成**：`page-guidance` 由 2 个最小节点补全为 **10 节点**（顶栏 / 任务条 / 快照提示条 / 章节速达条 / BP 打磨区 / 诊断报告 / 评分详情 / AI 教练 / 版本抽屉 / diff 弹层）；边 11 → **23**（新增 12 条本页内边），issues 4 → **9**（新增 5 条：死弹层组件 / 教练死状态 / 快照预览不换内容 / diff 正文硬编码 / 三套阶段口径）；`build_map.py` 图布局改为按页面自动分列；D4 规则收窄为「跨页且已实现的跳转边」 |
| 2026-09-13 | v0.3.1 ✅ | **第 3 步完成**：正式工具链 `gen_wiki_tools.py`（`validate` / `sync-edges` / `index` / `map` / `gaps`）落盘并跑通，校验 0 error / 2 warning；新增产物 `llms.txt` / `gaps.md`；10 个 node 的第 5 节改为工具生成（含 up/down 边详情）；`map` 产物名与实现对齐为 `module-map.html`；`validate_pilot.py` 退役 |
| 2026-09-11 | v0.3 ✅ | **转冻结**（粒度与 section 验收通过）；体检区按业务归宿拆为 3 节点；新增 2 条边（逻辑断点→动态待办 `intended`、评委提问→答辩训练 `undefined`） |
| 2026-09-11 | v0.2 ✅ | 试点校验通过（8 节点 / 10 边 / 3 issues，0 error） |
| 2026-09-11 | v0.2 | 基线切换至 SY；新增 node/edge 两层；新增 `intended` 三问与 `gaps` 命令；第 5 节改为工具链生成 |
| 2026-09-10 | v0.1 | 两段式（structure.json + pages）；sources 行号契约；A~D 校验（design-main 基线） |
