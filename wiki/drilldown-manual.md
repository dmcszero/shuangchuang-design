# LLM Wiki 铺开执行手册（批 1~4）

> **读者**：执行逐页下钻的 agent（DeepSeek v4.1 flash 等）。
> **定位**：本手册只管「批次编排 + v0.4 口径硬约束 + 批次验收」；**单页下钻的操作步骤、文件模板、踩坑清单不在此重复**，一律照两份真源执行：
>
> | 真源 | 管什么 |
> |---|---|
> | `wiki/schema.md`（v0.4，已冻结） | 契约：四层模型 + persona/placeholder 维度、命名、frontmatter、五节正文、edge schema、校验规则 A1~E2、节点粒度三问 |
> | 工作区 Skill `wiki-drilldown`（`D:\code\创赛\.github\skills\wiki-drilldown\SKILL.md`） | 操作：步骤 0~6（先同步上游 → 读源码 → 三问切节点 → 写文件 → 补边 → 跑五命令）+ 8 条踩过的坑 + 交付自查表 |
>
> 方案依据：《双创资料/文档/技术方案/0914-15-LLM-Wiki框架合流变更方案》（已确认）。执行中遇到本手册与方案冲突，以方案为准并回报；遇到与源码冲突，**以源码为准**（schema §0 基线原则）。

---

## 1. 批次编排（顺序不可换）

| 批次 | 范围 | 页面（按此顺序逐页下钻） | 页数 |
|---|---|---|---|
| 批 1 | 学生端 | page-login → page-coach → page-defense → page-assets | 4 |
| 批 2 | 学校管理端 | page-cockpit → page-screening → page-mentorship → page-supervision → page-mentors-pool → page-milestones | 6 |
| 批 3 | 治理与复用页 | page-teams → page-users → page-knowledge-base | 3 |

- **批 1 开工前先做复核**（不产生新页面）：按「学生单项目绑定」「coach=AI助手」口径复核已下钻的 page-workbench / page-guidance 的节点文档，**只改口径描述，不改行号引用**。
- **执行进度（2026-09-14）**：批 0 ✅ · 批 1 ✅（学生端 4 页）· 批 2 ✅（校管端 6 页）· 批 3 ✅（治理与复用页 3 页）→ **15/15 页全部 drilled**；node 95 · 边 98 · issues 40 · validate 0 error。**批 4 ✅ 交付总装已完成**（见下§6）。

## 1.1 批 4 交付总装（已完成 2026-09-14）

| 交付物 | 位置 | 状态 |
|---|---|---|
| ① wiki 本体 | `wiki/`（15 pages + 95 nodes + `edges.json` + `structure.json` + `schema.md`） | ✅ |
| ② 《待拍板清单（交付版）》 | `双创资料/文档/技术方案/0914-19-待拍板清单（交付版）.md`（机读版 `wiki/decisions.md`） | ✅ 14 条 / 4 组 |
| ③ 《双创智能体设计方案说明书》 | `双创资料/文档/技术方案/0914-19-双创智能体设计方案说明书.md` | ✅ |
| ④ 结构图 | `wiki/module-map.html` + 发布副本 `wiki/site/index.html` | ✅ 已生成；**发布动作需 WorkBuddy**（源目录已改为 `shuangchuang-design-main/wiki/site`） |

**批 4 附带完成的排期动作**：`page-guidance` 改名「**材料打磨工作台**」（硬约束 4 的排期项）：`structure.json` + 页面/节点口径 + schema §10 v0.8；源码内旧名文案（`ProjectMemberWorkbench.tsx:936`/`:950-952`）属源码事实**保留不改**；issue `issue-product-guidance-rename-material-workbench` 已关闭移除（issues 41→40）。
- 每页下钻的完整流程 = Skill `wiki-drilldown` 步骤 0~6，一页走完后才开下一页。
- **行号漂移防线**：每批开工必须先跑 Skill 步骤 0（`git fetch upstream && git merge upstream/main`，代理 `$env:HTTPS_PROXY='http://127.0.0.1:7890'`），merge 有动静就先 `validate` 验既有引用，红了先修再动手。

## 2. v0.4 口径硬约束（贯穿批 1~3，违反即返工）

| # | 约束 | 执行含义 |
|---|---|---|
| 1 | **每个学生仅绑定一个项目**（issue-product-single-project-binding，已定规则） | 学生端页面下钻时，把 demo 的「项目切换」能力标注为「仅演示，产品化后学生端无切换」；不因此建「项目切换」节点 |
| 2 | **page-coach = 框架 1.1「AI助手」本体** | page-coach 下钻 title 写「AI助手（备赛教练）」；会话历史 / 新建对话（`new_chat` + `standaloneSessions`，App.tsx:74/443）是它的**功能子集**，要下钻为其节点 |
| 3 | **guidance 右栏「AI 备赛伴学教练」是内嵌辅助栏，不是 1.1** | 与 page-coach 零共享（不同 state/mock/消息类型）；复核 page-guidance 时维持 nd-guidance-coach 现有定位，两套会话是否统一是待拍板项（issue-product-coach-session-unification），**不擅自合并表述** |
| 4 | **page-guidance 将改名「材料打磨工作台」（批 3 后统一执行）** | 批 1~3 期间所有文档仍用现名「全链路指导工作台」；改名动作（title + 节点口径 + schema 变更记录）由批 3 完成后的单独动作执行，不在逐页下钻中顺手改 |
| 5 | **L1~L6 阶段口径三套并存，未拍板**（issue-guidance-stage-taxonomy-mismatch） | 各页遇到「阶段」概念只登记事实与差异，**不统一、不展开、不替产品选口径**；新发现的阶段口径差异补进该 issue 的 detail |
| 6 | **demo 未实现的功能只登记占位** | 大框架里有、源码里没有的模块，进 `structure.json` 的 `placeholders[]`（`ph-*`），**不建 page/node**；现有唯一占位 ph-review-report（2.13 阶段复盘汇报生成） |
| 7 | **admin 端不是缺失，是分流渲染** | page-mentors-pool / page-knowledge-base 在 admin 端渲染独立的 Platform* 组件（App.tsx:750-767）；多端复用页下钻时按端切节点视角写「事实」，personas 已标在 structure.json |
| 8 | **功能模块树会生长**（issue-product-framework-incremental-growth） | 只增量登记（新 page/persona/placeholder），不推翻既有结构；schema 改动必须登 §10 变更记录 |

## 3. issues 分流纪律（v0.4 新增，E2 强制）

- 本批新发现的缺口进 `edges.json` 的 `issues[]` 时，**`category` / `owner` 必填**（缺了 validate 直接 E2 error）：
  - `category`：`产品决策`（要人拍板）/ `技术实现`（工程自己就能做）/ `数据口径`（定义需对齐）
  - `owner`：`上司拍板`（进《待拍板清单》问上司）/ `工程自决`（落地时顺手做）/ `待产品定义`（等产品侧给说法）
- 拿不准归类的判据：**「这个问题需要庄冉拿去找上司吗？」** 是 → `产品决策` + `上司拍板`；只是缺一句产品文案/清单 → `产品决策` 或 `数据口径` + `待产品定义`；纯代码没做完 → `技术实现` + `工程自决`。
- `category=产品决策` 的条目会自动进 `wiki/decisions.md`《待拍板清单》（`gaps` 命令生成，勿手改）——**写 detail/expected/blockedBy 时按「上司只读这一段就能决策」的标准写**（背景 + 建议 + 卡点）。
- 批 1~3 不交付 decisions.md；批 4 一次性全量交付（用户已拍板）。

## 4. 每批完成定义（Definition of Done，逐条打勾才可 commit）

- [ ] 该批全部页面 `docStatus="drilled"`，`nodeCount` 与实际一致，`nodeScopeNote` 写明未下钻的页面级结构
- [ ] 五命令全绿：`sync-edges`（0 待更新）→ `validate`（**0 error**；warning 仅限「其余页待铺开」汇总与可解释的 D4）→ `index` → `map` → `gaps`
- [ ] 本批新发现 issues 全部带 `category` / `owner`（E2 通过）
- [ ] `decisions.md` 已随 `gaps` 重生成（核对新条目是否如预期进入/不进入清单）
- [ ] commit 到本仓 `main` 并推 origin（**严禁推 upstream**：已挂 `pushurl=no_push`，误推会失败，属正常现象不是故障）
- [ ] 在 `wiki/schema.md` §10 变更记录追加一行（日期 / 版本 / 本批页面与边数变化）

commit message 约定：`feat: LLM Wiki 批 N 下钻——<页面清单>（page X→Y drilled，边 +n，issues +m）`

## 5. 交接与回报

- 每批结束后向验收者（Copilot / 庄冉）回报：本批页面数、node/边/issues 净增、validate 结论、**新进入《待拍板清单》的条目清单**（这是庄冉找上司的弹药，必须单独列出）。
- 遇到以下情况**停下来问，不自作主张**：①三问判定在建/不建之间摇摆的节点；②发现与「硬约束」第 1~8 条冲突的源码事实；③需要给 placeholder 补建 page 的时机判断。
