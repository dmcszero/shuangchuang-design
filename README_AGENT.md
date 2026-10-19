# shuangchuang-design-main · 仓根导航（README_AGENT）

> 定位：**产品设计原型仓 + LLM Wiki 结构知识库所在仓**。React 19 + Vite 6 + Tailwind v4，纯 mock 无后端。
> 双身份：① `src/` 是**团队原型**（跟随上游只读同步）；② `wiki/` `ontology/` 是本仓**自有建模层**（团队仓没有这些）。
> 本文是 **agent 导航文档**（按需下钻，不自动注入）；仓内真源仍是源码与 `wiki/schema.md`。

---

## 一、仓库拓扑（先读这节，它决定所有 git 操作）

| 远程 | 地址 | 权限 |
|---|---|---|
| `origin` | `github.com/dmcszero/shuangchuang-design`（个人） | 读写 —— `git push` 默认目标 |
| `upstream` | `github.com/guideshiny/shuangchuang-design`（**团队**） | **只读**（`pushurl=no_push`，实测误推失败） |

- `remote.pushDefault=origin`；`main` 追踪 `origin/main`
- **跟进团队更新（唯一正确方式，勿手工拷文件）**：

  ```powershell
  $env:HTTPS_PROXY='http://127.0.0.1:7890'   # 本机 git 不读系统代理，必须显式给
  git fetch upstream
  git merge upstream/main
  ```

- `../shuangchuang-design-SY/` 是团队仓的**另一个本地克隆**，2026-09-14 起降为**只读镜像**：只读它、不写它（写进本仓才受 git 保护）
- 基线轨迹：本仓 `main` 于 2026-09-14 重定到团队 `main`（`505a858`）；此前 v1 建模基于本仓 09-08 快照，末段曾短暂切到 SY 克隆
- **上游状态（2026-10-19 核实）**：团队 `upstream/main` 自 2026-09-10（`505a858`）起未再更新，**本仓即当前最新**；确切的领先提交数现场查（`git rev-list --count upstream/main..main`），勿凭本文推断

## 二、顶层结构

| 目录 / 文件 | 内容 | 归属 |
|---|---|---|
| `src/` | 原型源码（80 文件 / 44,195 行，10-19 实测）→ 读 `src/README_AGENT.md` | 团队（同步上游） |
| `wiki/` | **LLM Wiki 结构知识库**（15 page / 95 node / 99 edge；125 跟踪文件）→ 读 `wiki/README_AGENT.md` | 本仓自有 |
| `ontology/` | 本体建模（Turtle + SHACL：`sdm_core.ttl` + `sdm_shapes.ttl` + `tools/ontology_tools.py`；生成物不入库）→ 读 `ontology/README_AGENT.md` | 本仓自有（路线已冻结） |
| `temp_repo/` | 上游仓内的**独立子项目**（41 文件：上游 40 + 本仓 `README_AGENT.md`）→ 读 `temp_repo/README_AGENT.md` | **上游跟踪，只读勿改** |
| `assets/` | 仅 `assets/.aistudio/.gitignore`（AI Studio 元数据） | 上游 |
| `dist/` | 构建产物（`.gitignore` 已忽略，不入库） | 生成物 |
| `index.html` / `vite.config.ts` / `tsconfig.json` / `package.json` / `metadata.json` / `.env.example` | 工程入口与配置 + AI Studio 元数据（**上游文件，非必要不改**） | 上游 |

> 全仓 git 跟踪 261 个文件；本仓相对团队基线的自有增量 = `wiki/` 全量 + `ontology/` 源文件 + 5 份 `README_AGENT.md` + 若干忽略规则。
> ⚠️ 旧 `wiki-v1/`（v1 结构 25 文件）已于 2026-09-18 删除（`a8309b8`，git 历史可回溯）——别处若见对它的引用即已失效。

## 三、常用命令

| 目的 | 命令 |
|---|---|
| 起原型（:3000） | `npm run dev`（终端 npm 不在 PATH 时应使用绝对路径，见工作区 `.vscode/tasks.json`） |
| 类型检查 | `npm run lint`（tsc --noEmit） |
| 构建 | `npm run build` |
| **Wiki 工具链**（五命令，顺序不可换） | `python wiki/gen_wiki_tools.py sync-edges` → `validate` → `index` → `gaps` → `map`；改过 `build_map.py` 另跑结构图 DOM 探针 `wiki/check_map.cjs`（64 项，退出码 0 = 全通过） |
| 本体工具链 | `python ontology/tools/ontology_tools.py all`（或 `validate`/`query`/`diagram`/`html`） |

## 四、阅读指引（按目标选路）

| 目标 | 读 |
|---|---|
| 改前端功能 / 查组件 | `src/README_AGENT.md` → 再按 `wiki/llms.txt` 找对应 page/node |
| 查结构与交互链路（谁跳到谁、带什么载荷） | `wiki/README_AGENT.md` → `wiki/llms.txt`（索引）→ `wiki/nodes/<page-id>/<node-id>.md` |
| 查「设计要做但代码没做」的缺口 | `wiki/gaps.md`（由 `gaps` 命令生成，勿手改） |
| 看结构可视化 | `wiki/module-map.html`（本地双击即开）；发布副本 `wiki/site/index.html` |
| 查本体（SHACL 约束 / SPARQL 结果 / 状态机图） | `ontology/README_AGENT.md` |
| 查另一个子项目（创新大赛AI助手） | `temp_repo/README_AGENT.md` |

## 五、维护约定

- **团队文件不改写**：`src/`、`temp_repo/`、工程配置随上游走；需要"个人化"的信息写进 `wiki/` 或本文件，不写进团队文件
- **下钻前先同步上游**：`Sources` 行号绑定源码版本，团队一动行号就漂 → 先 `git fetch upstream && git merge upstream/main`，再 `validate`
- **新增 node / edge**：按 skill `wiki-drilldown` 的六步流程（`wiki/schema.md` 是契约真源，不得绕过）
- **发布单元**：`wiki/site/`（只含 `index.html`）；**不要把整个 `wiki/` 或 `ontology/` 发布出去**（会外曝内部结构数据）
- **本文件（README_AGENT 系列）为本仓专有**：不流向团队仓（`upstream` 本就推不动），可随本仓入个人仓
- **README 陈旧度体检**：本文件与 4 份子 README（`src` / `wiki` / `ontology` / `temp_repo`）由工作区每日脚本 `.github/skills/ranzhuang-daily-setup/assets/check_readme_stale.py` 监控（对比「同级目录最新文件」的 mtime，>14 天报红）——**目录内容有实质变更后，顺手刷新对应 README**
