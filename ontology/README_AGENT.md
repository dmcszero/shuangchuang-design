# ontology/ · 本体建模（README_AGENT）

> 定位：**Turtle 形式化本体 + SHACL 约束**——用 RDF 描述原型的角色可见性、导航边、跨页载荷链、状态机等。
> **⚠️ 路线状态：已冻结（2026-09-10）**。用户裁定本体路线「结构错误」，改用 **LLM Wiki 路线**（见 `../wiki/`）承接 AI Coding 约束；本目录**保留作未来对比候选（bake-off），不再扩展**。
> 阅读本目录前先明确：**产品结构的当前权威源是 `../wiki/`，不是这里。**

---

## 一、文件清单

| 文件 | 角色 | 入库 |
|---|---|---|
| `sdm_core.ttl`（825 行） | **本体真源**：SDM 命名空间 `https://github.com/dmcszero/shuangchuang-design/ontology#`，描述实体、关系、导航边、载荷链、状态机 | ✅ 跟踪 |
| `sdm_shapes.ttl`（110 行） | **SHACL 约束真源**：对 core 的形状校验规则 | ✅ 跟踪 |
| `tools/ontology_tools.py`（368 行） | **工具链**：校验 / 查询 / 出图 / 生成导览页 | ✅ 跟踪 |
| `ont_generated/` | ⚙️ **全部为生成物**（`validate_report.txt` / `queries/*.md` / `diagram_*.mmd` / `index.html` / `site/index.html`） | ❌ gitignore（可再生） |

`ont_generated/queries/` 下 10 份预置 SPARQL 结果：角色可见性矩阵 / 导航边全集 / 跨页载荷链 / 视图服务生命周期 / 学生模块构件清单 / 模块间与构件级关联 / 教练AI能力装配 / 调用协议与深度调用 / 子流程状态机 / 答辩状态机迁移。

## 二、用法

```powershell
cd shuangchuang-design-main/ontology
$PY='C:\Users\user\AppData\Local\miniforge3\envs\py310\python.exe'
& $PY tools/ontology_tools.py all         # 校验 + 查询 + 出图 + 生成导览页（全流程）
& $PY tools/ontology_tools.py validate    # 仅 SHACL 校验 → ont_generated/validate_report.txt
& $PY tools/ontology_tools.py query       # 仅跑预置 SPARQL → ont_generated/queries/
& $PY tools/ontology_tools.py diagram     # 仅出 Mermaid 图（全局 / 学生 13 步旅程 / 答辩状态机）
& $PY tools/ontology_tools.py html        # 仅生成 index.html 导览页
```

- 依赖（已装在 py310 环境）：`rdflib` / `pyshacl` / `owlrl` / `html5rdf`
- 生成物不入库：**改完 `.ttl` 重跑工具链即可**，无需手动维护 `ont_generated/`

## 三、产出物形态

| 产物 | 内容 |
|---|---|
| `validate_report.txt` | SHACL 校验报告 |
| `queries/*.md` | 10 份预置 SPARQL 查询结果（人可读表格） |
| `diagram_global.mmd` | 全局交互总图（角色 × 视图 × 导航边） |
| `diagram_journey.mmd` | 学生端 13 步旅程链 |
| `diagram_defense.mmd` | 答辩训练状态机 |
| `index.html` | 浅色瘦身版**人工导览页**（五板块，可双击打开） |
| `site/index.html` | 发布副本（发布单元只含此文件） |

> 本体导览页曾于 2026-09-10 发布上线（`f8c5aed0...app.workbuddy.link`）。

## 四、维护约定

- **不再扩展本体建模**：新增结构知识请写 `../wiki/`（node/edge），不要写 ttl——除非启动 bake-off（两条路线对比后再定去留）
- 若确需修本体：源文件只有 `sdm_core.ttl` / `sdm_shapes.ttl` 两个，改完跑 `all` 验证 + 重生成
- **不要把 `ont_generated/` 提交入库**（已有 gitignore 规则）；也不要把整个 `ontology/` 发布出去，只发布 `ont_generated/site/`
