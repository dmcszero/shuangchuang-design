# src/ · 原型源码导航（README_AGENT）

> 定位：**团队原型源码**（React 19 + Vite 6 + Tailwind v4，纯 mock 无后端；80 文件 / 41,343 行）。
> **非必要不改**——这些文件随团队 `upstream` 更新，改写会造成合并冲突；要记录"个人化"信息请写进 `wiki/`。
> 结构语义（谁跳到谁、带什么载荷、哪条边没实现）不在本目录，见 `../wiki/` 与 `../wiki/llms.txt`。

---

## 一、目录结构

| 位置 | 内容 |
|---|---|
| `App.tsx` | **应用壳层**：14 个 tab 的条件渲染分发、全局状态、跨页跳转回调汇聚点 |
| `main.tsx` / `index.css` | 入口与全局样式 |
| `types.ts` | 全域类型（`ProjectItem` / `LogicGapItem` / `Task` / `WorkOrder` 等） |
| `components/` | 40 个组件（顶层 22 个 + 4 个子目录，见下） |
| `components/defense/` | 模拟答辩训练（11 文件：Selector / Prep / Roadshow / Session / Report 五屏 + Charts / VideoWindow / Stage / Constants / Types） |
| `components/guidance/` | 全链路指导工作台子模块（4 文件：`guidanceTypes.ts` 契约 / `guidanceMockData.ts` / `GuidanceModals.tsx` / `ProjectFileViewer.tsx`） |
| `components/review/` | 材料审阅（2 文件：`ReviewFileViewer.tsx` 在用 / `FileReviewApprovalBar.tsx` **死代码**） |
| `components/workbench/` | 项目工作台 mock（1 文件：`workbenchMockData.ts`） |
| `data/` | 16 个 mock 数据文件（`mockProjects` / `mockMentors` / `rules2026` / `mockCoachData` 等） |
| `types/` | `reviewTypes.ts`（审阅域类型） |
| `utils/` | `titleUtils.ts` |

## 二、page ↔ 组件映射（15 个视图）

结构知识库里的 **page** 与源码组件的对应关系（`wiki/structure.json` 的同名真源）：

| page | 主组件 | 所在 |
|---|---|---|
| `page-cockpit` 数据驾驶舱 | `CockpitDashboard.tsx`（+`RadarChart.tsx`） | 顶层 |
| `page-milestones` 里程碑看板 | `MilestoneKanban.tsx` | 顶层 |
| `page-screening` 智能初筛中心 | `ScreeningHub.tsx`（+`BatchImportModal.tsx`、`data/rules2026.ts`） | 顶层 |
| `page-mentorship` 导师智能调度 | `MentorshipDispatch.tsx` | 顶层 |
| `page-supervision` 督导闭环中心 | `SupervisionClosure.tsx` | 顶层 |
| `page-mentors-pool` 导师池管理 | `MentorPoolManagement.tsx` + `PlatformMentorPoolManagement.tsx` | 顶层 |
| `page-workbench` 项目工作台 | `ProjectMemberWorkbench.tsx`（928 行） | 顶层 |
| `page-guidance` 全链路指导工作台 | `SceneGuidanceWorkbench.tsx`（~1092 行）+ `guidance/` | 顶层 |
| `page-coach` AI 备赛教练 | `SceneAICoach.tsx`（+`ChatComposer` / `RightWorkspacePanel` / `ReActProcessView` / `SessionGuidePage`） | 顶层 |
| `page-defense` 模拟答辩训练 | `SceneDefenseTraining.tsx` + `defense/` | 顶层 |
| `page-assets` 素材与资产管理 | `AssetManagementSystem.tsx` | 顶层 |
| `page-knowledge-base` 知识库管理 | `KnowledgeBaseManagement.tsx` + `PlatformKnowledgeBaseManagement.tsx` | 顶层 |
| `page-users` 用户管理 | `UserManagement.tsx` | 顶层 |
| `page-teams` 团队管理 | `TeamManagement.tsx` | 顶层 |
| `page-login` 登录分流 | `LoginPage.tsx` | 顶层 |

**壳层**（非 page，但可作 edge 端点）：`App.tsx` / `Sidebar.tsx`（`TabType` 枚举真源，15 个 tab 值）/ `TopHeader.tsx` / `ProjectDetailDrawer.tsx`（全局复用抽屉）
**弹层**：`RulesConfigModal.tsx` / `BatchImportModal.tsx` / `ReportExportModal.tsx`

## 三、死代码清单（8 个孤儿组件，约 3,663 行 —— 勿参考、勿模仿）

`SceneScreening.tsx`（1171 行，与在用的 `ScreeningHub` 并存）/ `guidance/ProjectFileViewer.tsx`（729 行，无引用）/ `data/mockData.ts`（553 行）/ `SidebarSpaceManager.tsx`（389 行）/ `SceneDashboard.tsx` / `Navbar.tsx` / `review/FileReviewApprovalBar.tsx` / `data/mockSpaces.ts`
（+ 间接死代码 `data/mockSpacesData.ts`；完整清单与检测方法见 `../wiki/structure.json` 的 `orphanComponents`）

## 四、常见任务路径

| 任务 | 路径 |
|---|---|
| 改某页面交互 | 先查 `../wiki/llms.txt` 找到 page → 读 `../wiki/pages/<page-id>.md` 的节点地图 → 定位到具体组件与行号 |
| 查某条跳转/传参怎么实现 | `../wiki/edges.json` 搜边（`implemented` 边带可验证 `sources` 行号） |
| 加/改组件 | 注意 `App.tsx` 的 tab 分发与 `Sidebar.tsx` 的 `TabType` 需同步；改完须重跑 `../wiki` 工具链 validate |
| 查 mock 数据 | `data/` 下按域找；**注意**同名异型的重复 mock（如 `mockData` vs `mockCoachData` vs `workbenchMockData`） |

## 五、与本仓其它目录的关系

- **改了 `src/` 任何文件的行结构 → `wiki/` 的 `Sources` 行号会漂**：`python ../wiki/gen_wiki_tools.py validate` 会报错，需同步修引用
- 团队更新后（`git merge upstream/main`）**第一件事就是跑 validate**，确认既有引用是否仍成立
- `wiki/` 的 node 事实全部来自本目录源码，**只信源码、不采信既有文档**
