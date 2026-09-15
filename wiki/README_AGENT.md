# wiki/ · LLM Wiki 结构知识库（README_AGENT）

> 定位：**面向 AI Coding 的可验证结构图谱**——以 `../src/` 源码为唯一事实来源，把原型拆成「section → page → node」三层，把节点间关系记成**带类型 + 带实现状态**的边（edge）。
> 解决的问题：读代码只能看到"实现成什么样"，看不到"设计上要跳到哪、哪条链路其实没接通"。这里两样都记，且**每条事实都带可回溯行号**。
> 本目录是**本仓自有产出层**（团队仓没有），改动受本仓 git 保护。

---

## 一、四层模型 + 正交维度（v0.4）

| 层 | 含义 | 落点 |
|---|---|---|
| **section** | 用户任务域（8 个：管理驾驶舱 / 项目遴选 / 导师与督导 / 项目成长 / 智能陪练 / 素材与知识 / 平台治理 / 入口） | `structure.json` |
| **page** | 一个视图（15 个，≈ 一个 `components/*.tsx` 主组件） | `pages/<page-id>.md` |
| **node** | **可见交互单元**（页面向下再钻一层：一个卡片区 / tab / 抽屉 / 弹层） | `nodes/<page-id>/<node-id>.md` |
| **edge** | 节点/页面间的有向关系。`type` 6 种（navigate / navigate-with-payload / read / writeback / reuse / embed）× `status` 3 种 | `edges.json` |

**正交维度（2026-09-14 框架合流，v0.4）**：
- **persona（端）**：学生 / 学校管理 / 辅导导师 / admin 超管 4 端，`personas[]` 定义 + `page.personas` 多值标端 + `page.frameworkRef` 挂用户大框架条目号；与 section（任务链路）正交
- **placeholder（🧩 占位）**：大框架里有、demo 未实现的功能只登记不建页（现仅 `ph-review-report` 阶段复盘汇报生成）

**边的 status 是本库的灵魂**：
- `implemented` —— 代码已实现（必带可验证 `sources` 行号）
- `intended` —— **设计要做、代码没做**（必带 `designRef` + `expected` + `blockedBy`）
- `undefined` —— **设计本身也没定**，需产品拍板（必带 `issue`）

非边类缺口（页面内的问题，如死 state、硬编码）记入 `edges.json` 的 `issues[]`，**每条必带 `category`（产品决策/技术实现/数据口径）+ `owner`（上司拍板/工程自决/待产品定义）**；`category=产品决策` 的条目由工具自动分流进 `decisions.md`《待拍板清单》。

## 二、文件清单（谁是真源、谁是产物）

| 文件 | 角色 |
|---|---|
| `schema.md` | **契约真源**（v0.4）：四层模型 + persona/placeholder 维度 / 命名 / node 五节结构 / 粒度三问 / 校验规则 A~E / 变更记录。改结构规范先动它 |
| `structure.json` | **结构真源**：8 section + 15 page（`component` / `relevant_files` / `personas` / `frameworkRef` / `docStatus` / `nodeCount`）+ 4 personas + 1 placeholder + 壳层 / 弹层 / 8 个孤儿组件清单 |
| `edges.json` | **边的真源**：23 条边 + 13 条 issues（issues 带 `category` / `owner` 分流字段） |
| `glossary.json` | **术语真源**（v0.9）：`term` → `plain` 对照表（58 条，仅解释、不改原文）；结构图「原始数据」下方自动列「涉及术语」对照 |
| `annotations.json` | **决策批注真源**（v1.0）：`ann-<yyyymmdd>-<seq>` → `target{kind,id}` + `decision` + `comment` + `status`；结构图详情面板「决策批注」区块导出后覆盖本文件、提交 git（导入按 id 去重、`updatedAt` 新者胜）。**它是「争议确认工作台」的产出落点**，`target.id` 就是 wiki 实体 id（未来与 3001 功能对齐的映射表建在这套 id 上）。见 `schema.md` §11.1 |
| `drilldown-manual.md` | **《铺开执行手册》**：批 1~3 页面顺序 + v0.4 八条口径硬约束 + 每批完成定义——逐页下钻的 agent 开工前必读（配合 skill `wiki-drilldown`） |
| `pages/<page-id>.md` | 薄页面：只留页面级事实（挂载、布局、本地 state 全景、跨页 props 契约）+ **节点地图** |
| `nodes/<page-id>/<node-id>.md` | 节点文档，固定五节：一句话定位 / 事实（每条带 `Sources: [路径:行号]()`）/ 规则与边界 / 常见开发任务 / **出入边（第 5 节由工具生成，勿手写）** |
| `gen_wiki_tools.py` | **工具链**：`validate` / `sync-edges` / `index` / `map` / `gaps` 五命令（纯标准库） |
| `build_map.py` | 结构图生成器（40 KB HTML 模板单源；`gen_wiki_tools.py map` 只做入口转发，勿在两处维护模板） |
| `check_map.cjs` | **结构图回归探针**（v1.0）：用 jsdom 加载 `module-map.html`，逐项验收「全量卡片/issue 点击零异常 · 列折叠自愈 · 批注读写与导出导入闭环 · 关系链 BFS 与环 · demo 按钮数 = 14 · 结构完整性」。**改了 `build_map.py` 就要跑它**——五命令只校验数据层，查不出运行时故障（v0.9 的 102/117 张卡片点不动就是这么漏掉的）。依赖 jsdom：`JSDOM_PATH=<jsdom 路径> node wiki/check_map.cjs wiki/module-map.html`，退出码 0 = 全通过 |
| `llms.txt` | ⚙️ 产物：索引（page/node 两层 + 描述 + 下钻状态）——**AI 找结构的入口** |
| `gaps.md` | ⚙️ 产物：缺口清单（intended / undefined / issues 三张表 + 逐条详情） |
| `decisions.md` | ⚙️ 产物：**《待拍板清单》**——只收 `category=产品决策` 的条目，按 severity 排序含背景+建议+卡点；批 4 一次性交付上司 |
| `module-map.html` | ⚙️ 产物：结构可视化（**v1.0** 三层视图 + 决策批注 + 关系链 + demo 深链；双击即开）；**默认页对非工程读者友好**——issues 先看通俗版、术语与节点形态全中文（英文原值在 tooltip） |
| `site/index.html` | ⚙️ 产物：**发布副本**（发布单元只含这一个文件） |

## 三、当前进度（2026-09-14，批 3 完成后 — **全库 15 页全部下钻**）

**section 8 · page 15（已下钻 15 / 待铺开 0）· node 95 · 图上模块 117（含未连线 32）· 边 98（86 implemented · 11 intended · 1 undefined）· issues 40（全部带通俗版）· `validate` 0 error / 8 warning**（warning = 7 条 D4 单向跳转边 + 1 条 E3 外部引用，均属预期）

- 已下钻（15/15）：`page-workbench`(8) · `page-guidance`(10) · `page-login`(4) · `page-coach`(10) · `page-defense`(7) · `page-assets`(6) · `page-cockpit`(6) · `page-screening`(4) · `page-mentorship`(5) · `page-supervision`(9) · `page-milestones`(4) · `page-mentors-pool`(6) · `page-teams`(4) · `page-users`(5) · `page-knowledge-base`(7)
- 批次：批 0 框架合流 ✅ → 批 1 学生端 4 页 ✅ → 批 2 校管端 6 页 ✅ → **批 3 治理与复用页 3 页 ✅**
- **下一步＝批 4 交付总装**：《待拍板清单》全量交付 + 设计方案说明书 + 结构图发布（见《铺开执行手册》§1）
- **《待拍板清单》现 14 条**（`decisions.md`，由 `gaps` 自动生成）：上司拍板 7 · 待产品定义 5 · 工程自决 2；另 27 条技术/数据口径缺口在 `gaps.md`（issues 共 40 条，均已带通俗版）。
### 结构图三层视图（v0.9，给非工程读者看的动线）

| 层 | 何时用 | 看什么 |
|---|---|---|
| **① 总览（页面级，默认）** | 第一次打开 / 对齐整体 | 15 个页面 + 页面↔页面聚合关系（9 列、一屏）；卡片上直读：模块数 / 连线数 / 缺口数 / 未连线数 / 各端标签 |
| **② 全景（节点级）** | 要看模块与具体链路 | 16 列，含全部 117 张卡片；支持端过滤 / 连线过滤（全部·只看缺口·只看跨列）/ 列折叠 |
| **聚焦视图**（画布下方） | 鼠标点任意卡片 / 连线 / 缺口条目 | 该模块的入边与出边（上下游）、同页兄弟模块；**点选后钉住**，不再一移开就没 |

**v1.0 新增（2026-09-15）**：

| 能力 | 说明 |
|---|---|
| **决策批注** | **两个入口、一份数据**：① 详情面板底部；② footer「issues」表格行尾「批注」按钮**就地展开表单**（行内直读 `💬n` 徽标 + 最近决策 + 作者时间 + 未决数）。可写「确认保留 / 确认删除 / 暂缓 / 需补充信息 / 自定义」+ 自由文本；存 localStorage（含草稿缓存，重渲染不丢字），可导出 `annotations.json` 覆盖回 `wiki/` 提交、可导入合并他人批注；被批注的卡片与问题带 `💬n` 徽标，gaps 面板可按「已批注 / 未批注 / 未决」过滤——**支持开会逐条过争议** |
| **关系链页签** | 聚焦视图从「直接关系」扩成双页签：「关系链」= 入向可达树（谁会间接影响它）+ 出向可达树（它会间接影响谁），环去重、超 50 节点可展开全部层数 |
| **demo 深链** | 14 个页面卡片与页面详情挂「打开 demo ↗」按钮 → `localhost:3000/?tab=<TabType>` 新开页直达对应模块（登录页无按钮；demo 未启动时按钮置灰并提示） |
| **中文显示层** | 节点形态 / 层级全部显示中文（`面板` / `弹层（模态框）` / `壳层（全局框架）` …），英文枚举留在 tooltip |
| **点击必有着落** | 列折叠自动展开；定位不到卡片时出 toast；未锚定 issue 在聚焦视图区给常驻说明（不再「点了没反应」） |
## 四、工具链（固定五条，顺序不可换）

```powershell
cd shuangchuang-design-main
$PY='C:\Users\user\AppData\Local\miniforge3\envs\py310\python.exe'
& $PY wiki/gen_wiki_tools.py sync-edges   # 必须先在 validate 之前：D5 会比对 node 第 5 节与 edges.json
& $PY wiki/gen_wiki_tools.py validate     # 目标 0 error；退出码非 0 禁止进下一步
& $PY wiki/gen_wiki_tools.py index        # 重生成 llms.txt
& $PY wiki/gen_wiki_tools.py gaps         # 重生成 gaps.md + decisions.md（待拍板清单）
& $PY wiki/gen_wiki_tools.py map          # 重生成 module-map.html + site/index.html
```

`sync-edges --check` 用于确认已同步（幂等）。

**改了 `build_map.py` 之后，除五命令外还要跑结构图回归探针**（数据层绿 ≠ 页面能点）：

```powershell
$env:JSDOM_PATH='<jsdom 安装目录>'      # 例：C:/Users/user/.workbuddy/binaries/node/workspace/node_modules/jsdom
node wiki/check_map.cjs wiki/module-map.html   # 54 项验收，退出码 0 = 全通过
```

## 五、下钻一个 page（操作流程）

**批次编排先读 `drilldown-manual.md`《铺开执行手册》**（批 1~3 顺序 + v0.4 八条口径硬约束）；**单页操作先读 skill `wiki-drilldown`**（`.github/skills/wiki-drilldown/SKILL.md`，含六步流程 + 踩坑 + 自查清单）。要点：

1. **步骤 0 先同步上游**：`git fetch upstream && git merge upstream/main` —— `Sources` 行号绑源码版本，不同步就动手会得到错行号
2. 读源码（只信源码，不采信既有文档）→ 按**三问**切节点（能否指认 / 是否有自己的状态或载荷 / 是否至少有 1 条边）→ 一个中等复杂页 6~10 个 node
3. 写 `nodes/<page-id>/*.md` 与 `pages/<page-id>.md` → 补 `edges.json` → 改 `structure.json` 的 `docStatus`/`nodeCount` → 跑五命令

## 六、硬约定（踩过坑，逐条照做）

1. 文件一律 **LF + 末尾换行**；用 Python 写时显式 `newline="\n"`
2. 行号口径 = **UTF-8 解码行数、1-based、闭区间**；引用上限是文件 `splitlines()` 长度（末行空行不算）
3. node 第 5 节**由 `sync-edges` 生成**，手写会被覆盖——要改边就改 `edges.json`
4. 每条事实都要带 `Sources: [路径:行号]()`；节点事实 < 3 条引用会被 validate 判错
5. 平行边（同 from/to）必须 `id` 与 `trigger` 都不同；`to` 可为 node / page / modal / shell 四类
6. `validate_pilot.py` 已于 2026-09-14 **删除**（退役脚本 + 硬编码旧基线路径，误跑得假绿）——校验只跑 `gen_wiki_tools.py validate`
7. **发布单元是 `site/`（只含 index.html）**，勿把整个 `wiki/` 发布出去（会外曝 structure.json / edges.json / 节点 md）
8. **图节点 = 全集**（v0.9）：page / node / modal / shell 登记即入图，无边的以虚线灰卡呈现——「看不见某个模块」首先查 `docStatus` 与登记，而不是查它有没有边
9. **issues 必须可定位**（v0.9）：`where` 要指向已登记实体（E3 error），否则结构图上点不动；非本库实体请用非前缀 id（按外部引用处理，只 warning）
10. **通俗版不碰原文**（v0.9）：`plain` 是另写的解释层，与 `title` / `detail` 一一并存；改事实只改原字段，不要写进 `plain`

## 七、维护约定

- 新发现的缺口**必须进 `edges.json` 的 `issues[]`**（不要只在对话里提，否则会丢）
- 完成一批下钻后：跑五命令 → 提交本仓 → （如需对外）重新发布 `site/`
- `wiki-v1/`（20 页 taxonomy）是旧结构，**只作对照、不再更新**；`baseline` 已在 2026-09-14 改回本仓 `main`
