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
| `drilldown-manual.md` | **《铺开执行手册》**：批 1~3 页面顺序 + v0.4 八条口径硬约束 + 每批完成定义——逐页下钻的 agent 开工前必读（配合 skill `wiki-drilldown`） |
| `pages/<page-id>.md` | 薄页面：只留页面级事实（挂载、布局、本地 state 全景、跨页 props 契约）+ **节点地图** |
| `nodes/<page-id>/<node-id>.md` | 节点文档，固定五节：一句话定位 / 事实（每条带 `Sources: [路径:行号]()`）/ 规则与边界 / 常见开发任务 / **出入边（第 5 节由工具生成，勿手写）** |
| `gen_wiki_tools.py` | **工具链**：`validate` / `sync-edges` / `index` / `map` / `gaps` 五命令（纯标准库） |
| `build_map.py` | 结构图生成器（40 KB HTML 模板单源；`gen_wiki_tools.py map` 只做入口转发，勿在两处维护模板） |
| `llms.txt` | ⚙️ 产物：索引（page/node 两层 + 描述 + 下钻状态）——**AI 找结构的入口** |
| `gaps.md` | ⚙️ 产物：缺口清单（intended / undefined / issues 三张表 + 逐条详情） |
| `decisions.md` | ⚙️ 产物：**《待拍板清单》**——只收 `category=产品决策` 的条目，按 severity 排序含背景+建议+卡点；批 4 一次性交付上司 |
| `module-map.html` | ⚙️ 产物：本地预览的结构可视化（按已下钻页面自动分列；双击即开） |
| `site/index.html` | ⚙️ 产物：**发布副本**（发布单元只含这一个文件） |

## 三、当前进度（2026-09-14，批 1 学生端下钻后）

**section 8 · page 15（已下钻 6 / 待铺开 9）· node 45 · 边 59（52 implemented · 6 intended · 1 undefined）· issues 24 · `validate` 0 error / 1 warning**（唯一 warning = 9 个 page 尚未铺开的汇总提示）

- 已下钻：`page-workbench` 项目工作台（8 节点）、`page-guidance` 全链路指导工作台（10 节点）、`page-login` 登录分流（4）、`page-coach` AI 助手（10）、`page-defense` 模拟答辩训练（7）、`page-assets` 项目资产管理系统 Git 模式（6）
- 待铺开按批次（《铺开执行手册》）：~~批 1 学生端 4 页~~ ✅ 已完 → 批 2 校管端 6 页 → 批 3 治理 3 页
- 《待拍板清单》现 12 条（上司拍板 / 待产品定义 / 工程自决三类，见 `decisions.md`），批 1~3 攒齐后一次性交付

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

## 七、维护约定

- 新发现的缺口**必须进 `edges.json` 的 `issues[]`**（不要只在对话里提，否则会丢）
- 完成一批下钻后：跑五命令 → 提交本仓 → （如需对外）重新发布 `site/`
- `wiki-v1/`（20 页 taxonomy）是旧结构，**只作对照、不再更新**；`baseline` 已在 2026-09-14 改回本仓 `main`
