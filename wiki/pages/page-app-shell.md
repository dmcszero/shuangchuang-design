---
id: page-app-shell
title: 应用骨架与全局布局
section: sec-system
importance: high
sources:
  - src/App.tsx
  - src/main.tsx
  - src/components/Sidebar.tsx
  - src/components/TopHeader.tsx
  - src/components/RightWorkspacePanel.tsx
  - src/components/SharedWorkspaceDrawer.tsx
  - src/components/OperationFlywheelModal.tsx
  - src/components/RulesConfigModal.tsx
  - src/components/BatchImportModal.tsx
  - src/components/ReportExportModal.tsx
  - src/components/ProjectDetailDrawer.tsx
related_pages: [page-roles-navigation, page-system-overview, page-cross-link]
---

# 应用骨架与全局布局

## 一句话定位

`App.tsx` 是整个 demo 的唯一壳层：一个三列结构（左 `Sidebar` / 中主内容区 / 右侧独立工作区）+ 顶栏 `TopHeader`，中间按 13 个 `TabType` 做条件渲染分发，右侧独立工作区只在 `coach` 下挂载并支持拖拽调宽与全屏。

## 事实（每条强制可回溯）

1. 应用入口是 `main.tsx`，10 行，`createRoot` + `StrictMode` 包 `App`。`Sources: [src/main.tsx:1-10]()`
2. 路由没有引入 react-router：`TabType` 是一个联合类型字面量，由 `Sidebar.tsx` 导出，共 13 个视图。`Sources: [src/components/Sidebar.tsx:48-61]()`
   13 项依次为 `cockpit / screening / mentorship / supervision / milestones / mentors_pool / knowledge_base / users_management / teams_management / my_project / coach / guidance_workbench / defense_training`。
3. 分发方式是主内容区里一连串 `{activeTab === 'xxx' && (<Component .../>)}`，无路由表、无懒加载。`Sources: [src/App.tsx:552-682]()`
4. 根容器是 `flex h-screen overflow-hidden`，左栏与外层主区为兄弟节点。`Sources: [src/App.tsx:486-525]()`
5. 左栏 `Sidebar` 常驻，宽度 240px（xl 断点 288px），折叠态宽度归零并禁用交互。`Sources: [src/components/Sidebar.tsx:266-274]()`
6. 顶栏 `TopHeader` 高 64px（h-16）、sticky、z-20，接收 `activeSessionTitle` 用于 coach 下显示当前会话名。`Sources: [src/components/TopHeader.tsx:66-106]()` `Sources: [src/App.tsx:527-544]()`
7. 右侧独立工作区（`RightWorkspacePanel`）**只在 `activeTab === 'coach'` 且 `isRightWorkspaceOpen` 时挂载**。`Sources: [src/App.tsx:734-752]()`
8. 默认宽度按 6:4 比例算：右侧 = `(window.innerWidth - sidebarWidth) * 0.4`，sidebarWidth 折叠时 64、展开时 240，且有 300px 下限。`Sources: [src/App.tsx:97-105]()`
9. `RightWorkspacePanel` 自身也声明了 `widthPercent = 40` 作为默认。`Sources: [src/components/RightWorkspacePanel.tsx:144-151]()`
10. 主区与右区的分割线是固定 4px 的 `w-1` 元素（避免拖拽时两侧内容抖动重排），并有左右各外扩 4px 的绝对定位热区。`Sources: [src/App.tsx:699-727]()`
11. 拖拽使用 Pointer Capture 实现像素级跟随：`onPointerDown/Move/Up` 三个处理器，宽度 clamp 到 `[300, availableWidth-360]`。`Sources: [src/App.tsx:152-187]()`
12. 另有全局 `mousemove/mouseup` 兜底监听，防止指针移出分割线后失去跟随。`Sources: [src/App.tsx:189-216]()`
13. 双击分割线恢复 6:4 默认比例。`Sources: [src/App.tsx:218-223]()` `Sources: [src/App.tsx:700-709]()`
14. 窗口 resize 时重新 clamp 右区宽度，避免超出屏幕。`Sources: [src/App.tsx:139-149]()`
15. 全局快捷键在 `App` 层统一监听：`Ctrl/Cmd+B` 切左侧栏、`Ctrl/Cmd+J` 切右侧独立工作区、`Escape` 退出右区全屏。`Sources: [src/App.tsx:225-242]()`
16. `RightWorkspacePanel` 内部也独立监听 `Escape` 来退出页内全屏（受控/非受控双模式：外部给了 `isExpandedFull` 就用外部）。`Sources: [src/components/RightWorkspacePanel.tsx:152-183]()`
17. 主内容区 padding 按 tab 分两套：`coach` / `guidance_workbench` 走 `h-[calc(100vh-4rem)] overflow-hidden p-0`（满屏沉浸式），其余走常规 `p-4 sm:p-6 lg:p-8 space-y-6`。`Sources: [src/App.tsx:546-551]()`
18. 同一套判断也作用于外层滚动容器（其余 tab 允许 `overflow-y-auto`）。`Sources: [src/App.tsx:520-525]()`
19. 页脚只在非沉浸式 tab 下渲染（`coach` / `guidance_workbench` 不显示），内容含高校名与统一品牌语。`Sources: [src/App.tsx:685-690]()`
20. 全局弹层共 5 个两类：**App 级挂载 4 个** —— `ProjectDetailDrawer`、`RulesConfigModal`、`BatchImportModal`、`ReportExportModal`。`Sources: [src/App.tsx:754-780]()`
21. **第 5 个（`OperationFlywheelModal`）与 `SharedWorkspaceDrawer` 挂在 `SceneAICoach` 内部**，不在 App 级。`Sources: [src/components/SceneAICoach.tsx:2844-2878]()`
22. 右侧工作区还维护多文件 Tab 状态（打开列表 + 激活文件 id）与"在右区打开文件"的回调，Open 时会自动加入 Tab。`Sources: [src/App.tsx:108-137]()`
23. 右区默认展开、默认打开 3 个 tab（`art-ppt-1 / art-xlsx-1 / art-doc-1`）。`Sources: [src/App.tsx:94-109]()`
24. 拖拽中的实时比例提示气泡按 `对话 x% : 独立区 y%` 计算并显示。`Sources: [src/App.tsx:720-725]()`

## 规则与边界（AI 开发硬约束）

- **`TabType` 是壳层的唯一路由契约**：新增视图必须同时改 `Sidebar.tsx` 的联合类型、`getNavGroups` 的菜单项、`TopHeader.tabTitleMap`、以及 `App.tsx` 的渲染分支。四处缺一即出现「有菜单没内容」或「有内容没标题」。
- **右区宽度单位是像素，不是百分比**：不要引入百分比宽度方案替换 `rightWorkspaceWidthPx`，否则双击复位与 resize clamp 逻辑全部失效。
- **分割线宽度恒为 4px**：源码注释明确写了「外层宽度恒定，绝不改变尺寸，彻底杜绝两侧内容抖动重排」——不要改成 hover 变宽的写法。
- **键盘监听在两处**：App 层（Ctrl+B / Ctrl+J / Esc）与 RightWorkspacePanel 层（Esc 退全屏）。若把 Esc 逻辑合并到一处，需保证全屏退出仍生效。
- **沉浸式 tab 集合硬编码为数组字面量** `['coach','guidance_workbench']`，出现在两处（滚动策略 521-525、padding 策略 547-551）。新增沉浸式页面必须两处都加。
- **弹层挂载位置有分歧**：通用弹层挂 App 级；与教练会话强绑定的（飞轮、共享工作区）挂 `SceneAICoach`。新增弹层前先判断是否依赖教练上下文。
- `Sidebar` 的 props 中 `sessions` 与 `standaloneSessions` 同时存在且语义重叠（前者用于"统一会话"、后者做兜底），改动会话数据流时须同时核对。`Sources: [src/components/Sidebar.tsx:110-111]()`

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 新增一个全局视图 | `Sidebar.tsx:48-61` 加枚举 → `Sidebar.tsx:190-261` 加菜单 → `TopHeader.tsx:44-62` 加标题 → `App.tsx:552-682` 加分支 |
| 改右侧工作区默认宽度/比例 | `App.tsx:97-105`（默认与 clamp）+ `App.tsx:218-223`（双击复位） |
| 改快捷键 | `App.tsx:225-242`（并同步 `TopHeader.tsx:78` 的 title 提示文案） |
| 新增全局弹层 | 在 `App.tsx:754-780` 区块内追加，并在 `App.tsx` 顶部加 `isXxxModalOpen` 状态（参考 76-81 行写法） |
| 调整主区排版 | `App.tsx:546-551` 的数组判断 + 类名 |
| 改页脚文案 | `App.tsx:686-690` |

## 与 related_pages 的联动提示

- → **page-roles-navigation**：骨架的"内容分发"和导航的"菜单生成"是同一套 `TabType` 的两端，任何一侧新增视图都必须两侧同步。
- → **page-system-overview**：骨架在无 session 时完全不渲染，入口页改动会影响骨架能否被挂载。
- → **page-cross-link**：右区 Tab 状态（`openWorkspaceTabs` / `handleOpenFileInRightWorkspace`）是「教练产物 → 右区打开」这条联动链的落点，见 `App.tsx:111-137`。
- 注意非对称：`OperationFlywheelModal` 不在 App 级弹层清单里，若按本页第 20 条的清单去 App 找它会找不到。
