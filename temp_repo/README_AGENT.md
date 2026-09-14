# temp_repo/ · 上游子项目（README_AGENT）

> 定位：**上游团队仓内的独立子项目**——AI Studio 导出的单页 demo「创新大赛AI助手」（40 文件 / 12,898 行 ts·tsx，**全部由上游跟踪**）。
> 它与本仓根目录的 `src/`（团队主原型）是**两个不同的应用**：组件集不同、入口独立、不在同一构建里。
> **⚠️ 只读勿改**：这个目录随 `git merge upstream/main` 整体更新，本地改写会造成合并冲突。

---

## 一、它是什么

| 项 | 值（`metadata.json`） |
|---|---|
| 名称 | 创新大赛AI助手 |
| 定位 | 高校双创赛事智能体统一对话入口「AI 备赛教练」 |
| 能力 | 政策咨询 / BP 深度诊断（调用 4.2 引擎）/ 模拟答辩（调用 4.3 引擎）/ 案例与竞品情报 / 校内智库对接 / 运营闭环 |
| 声明能力位 | `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`（`package.json` 依赖 `@google/genai` + `express`） |

## 二、结构

| 位置 | 内容 |
|---|---|
| `package.json` | 独立工程（vite `--port=3000 --host=0.0.0.0` / build / preview / `lint`=tsc --noEmit；依赖含 `@google/genai`、`express`、`motion`、`lucide-react`） |
| `index.html` / `vite.config.ts` / `tsconfig.json` / `.env.example` / `metadata.json` | 工程入口与配置 |
| `src/App.tsx` / `src/types.ts` / `src/utils/titleUtils.ts` | 应用壳层与类型 |
| `src/components/` | 25 个组件。**独有**：`SceneCases.tsx` / `SceneCoaching.tsx` / `SceneMockQA.tsx` / `SceneSkills.tsx` / `AiMascot.tsx` / `AtomicCallCard.tsx` / `DeepCall*.tsx`（5 个）/ `OperationFlywheelModal.tsx` 等 |
| `src/data/` | 7 个 mock（`mockCoachAgentsAndSkills` / `mockCoachData` / `mockData` / `mockSessionMessages` / `mockSpaceData` / `mockSpaces` / `mockSpacesData`） |

> ⚠️ **易混淆点**：本目录与本仓 `src/` 存在**同名文件**（`SceneAICoach.tsx` / `SceneDashboard.tsx` / `SceneScreening.tsx` / `Sidebar.tsx` / `RadarChart.tsx` / `ReActProcessView.tsx` / `ChatComposer.tsx` / `Navbar.tsx` / `SidebarSpaceManager.tsx` / `SharedWorkspaceDrawer.tsx` 等），**内容不同**。读文件时务必确认路径前缀——`wiki/` 的行号引用指向的是 `../src/`，**不是**这里。

## 三、维护约定

- **不改**：属上游文件；如确需实验，先复制到别处（或另建分支），不在此目录原地改
- **不进 `wiki/` 结构知识库**：`../wiki/` 的 page/node 只覆盖本仓 `src/` 的主原型；本目录未建模
- 与团队同步由 `git merge upstream/main` 自然带入，无需手工干预
