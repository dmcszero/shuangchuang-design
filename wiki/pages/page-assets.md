---
id: page-assets
title: 项目资产管理系统（Git 模式）
section: sec-assets
importance: medium
view: asset_management
component: src/components/AssetManagementSystem.tsx
sources:
  - src/components/AssetManagementSystem.tsx:1-2033
related_pages: ["page-coach", "page-defense", "page-workbench"]
nodes:
  - nd-assets-tree
  - nd-assets-list
  - nd-assets-preview
  - nd-assets-timeline
  - nd-assets-diff
  - nd-assets-addfile
---

## 一句话定位

把项目交付物当代码库管理的三栏工作台：左栏文件树、中栏清单/多模态预览、右栏版本时间线——**「Git 无分支版本演进」的隐喻落到资产上**，是团队最新提交（`505a858 feat: add asset management system`）带来的新模块。

## 事实（每条强制可回溯）

**一、挂载与壳层**

1. 由 App 在 `activeTab === 'asset_management'` 时挂载，接收 `currentProject` / `session` / `onNavigateTab` 三个 prop。 Sources: [src/App.tsx:681-686]()
2. 本页在**沉浸式白名单**内：外层不可滚、无内边距、无全局页脚，页面自身 `h-full overflow-hidden` 三栏布局。 Sources: [src/App.tsx:596-600]() [src/App.tsx:624-629]() [src/App.tsx:783-787]() [src/components/AssetManagementSystem.tsx:441]()
3. 页面根容器带稳定 id `asset-management-system-root`。 Sources: [src/components/AssetManagementSystem.tsx:441]()
4. **主题状态是死的**：`isDarkMode` 声明为 true 但从未被读取（也从未被切换），实际渲染全部使用硬编码的浅色主题对象 `theme`——即团队把暗色版删掉后留下了这个 state。 Sources: [src/components/AssetManagementSystem.tsx:75-76]() [src/components/AssetManagementSystem.tsx:415-430]()

**二、三栏布局（页面级结构）**

5. 三栏：左 `w-64 xl:w-72`（文件树）、中 `flex-1`（清单/预览）、右 `w-80 xl:w-96`（版本时间线），栏间用 `divide-x` 分割。 Sources: [src/components/AssetManagementSystem.tsx:444-447]()

**三、版本即筛选器（本页最重要的数据口径）**

6. `selectedCommitId` → `activeCommit` → `snapshotFiles`：**当前查看的版本决定能看到哪些文件**；`activeFile`、`availableFolders`、过滤后的文件集合全部从 `snapshotFiles` 派生。 Sources: [src/components/AssetManagementSystem.tsx:144-172]()
7. 全量文件 `filesList`（初值 `INITIAL_ASSET_FILES`）只用于维护与新增；版本数据 `MOCK_VERSION_COMMITS` 每条带 `fileIdsPresent` 定义该版本包含的文件。 Sources: [src/components/AssetManagementSystem.tsx:79-91]() [src/data/mockAssetManagementData.ts:605-680]()
8. 页面级 state 共 24 个（主题/版本/文件/浏览/预览/弹窗/筛选七组），其中 **`timeFilter` 与 `isDarkMode` 是只声明不使用的死状态**。 Sources: [src/components/AssetManagementSystem.tsx:76-131]()

**四、写操作与演示性质**

9. 全页只有两个写操作：右栏「提交」（生成假 commit + 假 diff）与「新增资产文件」（造一条假文件记录）；两者都**只改内存**，无接口、无落库、刷新即复原。 Sources: [src/components/AssetManagementSystem.tsx:234-357]() [src/components/AssetManagementSystem.tsx:359-399]()
10. 预览层六个形态（PPTX / MP4 / PDF+CNAS 公章 / XLSX 三表 + BOM / MD / Code）均为**视觉素材**，与 `activeFile` 只有类型关联。 Sources: [src/components/AssetManagementSystem.tsx:924-1565]()

## 规则与边界（AI 开发硬约束）

- 本页是**「Git 模式」隐喻的展示**，不是真的 Git：没有分支、没有合并、没有真实 SHA；`lastCommitHash` 是随机数、假提交的 diff 是模板文本。对外表述时不要说"已接入版本管理"。
- **版本联动是硬约束**：任何"文件相关"的改动都要先问「它属于哪个版本视图」——切到历史快照后文件集合会变小，顺手写死的"全量渲染"会失效。
- 与 `page-coach` 的右侧产物区**零共享**：那边是 8 项常量清单 + 硬编码预览（`ALL_PROJECT_DELIVERABLES`），这边是文件树 + 版本轴；两处的「产物」概念尚未统一（见 issue `issue-assets-vs-coach-deliverables`）。
- 与 `page-guidance` 的版本体系（快照 / 里程碑 / diff 弹层）也是两套：那边的版本挂在章节内容上，这边挂在文件资产上。
- 本页**不读 `currentProject`**（虽然接收了 prop）：所有内容都是「晶圆级检测 / 智耘农业」等固定案例，切项目不会换内容。 Sources: [src/components/AssetManagementSystem.tsx:64-75]()

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 资产接真实项目文件 | `AssetManagementSystem.tsx:79-91` | 需引入 fileId 体系并与 `ProjectItem` 关联 |
| 提交接真实后端 | `:234-357` | `VersionCommit` 类型（mock 文件 :41-59） |
| 与 `page-coach` 产物区统一 | — | 见 issue `issue-assets-vs-coach-deliverables` |
| 恢复暗色主题 | `:76` `:415-430` | theme 对象需改回按 isDarkMode 取值 |
| 清理死状态 | `:76` `:128` | 纯清理 |

## 节点地图

| 节点 | 可见名称 | kind | 覆盖行 | 关键出边 |
|---|---|---|---|---|
| `nd-assets-tree` | 资产文件树（左栏） | list | 445-573 | → `nd-assets-preview`（点文件，read） |
| `nd-assets-list` | 资产清单视图（中栏） | table | 575-850 | → `nd-assets-preview`（点文件） |
| `nd-assets-preview` | 多模态资产预览 | panel | 850-1570 | 无（纯展示，含 README 兜底 1566） |
| `nd-assets-timeline` | 版本时间线（右栏） | list | 1591-1785 | → `nd-assets-diff`（查看 diff）；→ `nd-assets-tree`/`nd-assets-list`（进入该版本，writeback） |
| `nd-assets-diff` | 版本 Diff 对比弹层 | modal | 1787-1937 | → `nd-assets-timeline`（切换至该版本，writeback） |
| `nd-assets-addfile` | 新增资产归档弹窗 | modal | 1939-2033 | → `nd-assets-tree`/`nd-assets-list`（注入新文件，writeback） |

> 未下钻为节点的页面级结构：三栏容器与分隔（442-447）、中栏面包屑与工具条（577-680）、README 兜底预览（1566-1590）。
>
> **拆分依据**：六个节点各有独立状态域与出口；「清单」与「预览」虽同处中栏，但后者有独立的分页/进度/源码开关状态（6 个 state）且分支庞大（约占本文件 40%），必须分开；右栏的「时间线」与「Diff 弹层」分属浏览与审查两种任务，故也拆开。

## 与 related_pages 的联动提示

- **→ `page-coach`（AI 助手）**：AI 产出的文件通过 `generatedFiles` 只能在右栏「展示」（常量清单），**不会进入本页资产库**；「AI 生成 → 归档为资产」这条链尚未打通（见 issue）。
- **→ `page-defense`（模拟答辩训练）**：本页的 15 页路演幻灯片（`ROADSHOW_SLIDES_DATA`）与答辩页的幻灯片常量（`MOCK_ROADSHOW_SLIDES`）**不是同一份数据**，两处各 mock。
- **→ `page-workbench`（项目工作台）**：工作台的「项目文件夹」区块宣称「与全链路指导工作台快照同源」，而本页才是文件版本的主场——三处版本口径（工作台 / 指导工作台 / 本页）尚未统一。
- **→ 入口**：侧栏在「项目资产管理系统（Git模式）」下提供入口；App 传入了 `onNavigateTab`，可跳转到其他 tab。
