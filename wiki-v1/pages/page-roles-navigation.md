---
id: page-roles-navigation
title: 角色×视图导航矩阵
section: sec-system
importance: high
sources:
  - src/components/Sidebar.tsx
  - src/components/TopHeader.tsx
  - src/App.tsx
related_pages: [page-system-overview, page-sidebar-widgets]
---

# 角色×视图导航矩阵

## 一句话定位

侧栏 `getNavGroups()` 用 `if (session.role === ...)` 硬编码了四套导航组，顶栏 `tabTitleMap` 用一张 `Record<TabType, {title, subtitle}>` 提供 13 个视图的标题与副题——这两处合起来就是「角色 → 可见视图 → 页面标题」的完整定义。

## 事实（每条强制可回溯）

1. 导航生成函数是 `getNavGroups()`，返回 `{groupName, items[]}` 的数组，每个 item 是 `{id: TabType, label, icon, badge?, highlight?}`。`Sources: [src/components/Sidebar.tsx:189-263]()`

### 四角色导航组全量对照

| 角色 | 分组数 | 顶层分组名 | 视图项（id → label → badge） |
|---|---|---|---|
| `team_member` | 1 | AI伴学与答辩实训 | `coach`→新建对话；`my_project`→项目工作台（AI对标）；`guidance_workbench`→全链路指导工作台（L1~L6，highlight）；`defense_training`→模拟评审与答辩训练（实训） |
| `mentor` | 1 | 导师评审工作台 | `supervision`→项目辅导与督导工单（问诊督导） |
| `system_admin` | 1 | 全平台资源与权限总控 | `mentors_pool`→平台导师智库管理（国家级）；`knowledge_base`→平台赛事知识库管理（全国库） |
| `school_admin` | 4 | 决策中枢驾驶舱 / AI数智备赛 / 备赛培育核心 / 校本智库与组织管理 | `cockpit`；`coach`；`screening`（2026细则）、`mentorship`（排期）、`supervision`（闭环）、`milestones`（5阶）；`mentors_pool`（专家库）、`knowledge_base`（校内智库）、`users_management`（全员）、`teams_management`（合规） |

`Sources: [src/components/Sidebar.tsx:191-203]()` `Sources: [src/components/Sidebar.tsx:205-214]()` `Sources: [src/components/Sidebar.tsx:216-226]()` `Sources: [src/components/Sidebar.tsx:228-260]()`

2. `school_admin` 是唯一拿到"全量访问"的角色，走的是函数末尾的默认 `return`（即任何未匹配角色都会拿到这套 10 项导航）。`Sources: [src/components/Sidebar.tsx:228-261]()`
3. 导航项点击行为有一处特判：`coach` 项不是单纯的 `setActiveTab`，而是先 `onCreateSession?.()` 建新会话再切 tab，title 为「点击新建对话」。`Sources: [src/components/Sidebar.tsx:470-490]()`
4. 其余导航项统一 `setActiveTab(item.id)`，激活态用 `bg-sky-50 text-sky-700 font-semibold`，徽章配色对 `Hero` / `P0` 有专门分支。`Sources: [src/components/Sidebar.tsx:492-523]()`
5. 侧栏顶部角色副标题按角色四分支渲染：【项目组成员】专属端 / 【学校管理端】决策平台 / 【导师端】评审与问诊 / 【Admin端】平台总管。`Sources: [src/components/Sidebar.tsx:289-296]()`
6. 顶栏标题映射 `tabTitleMap` 是 `Record<TabType, {title, subtitle}>` 全量 13 项，兜底值为 `{title:'管理中枢', subtitle:''}`。`Sources: [src/components/TopHeader.tsx:44-62]()` `Sources: [src/components/TopHeader.tsx:64-64]()`
7. 该映射中 `mentors_pool` 与 `knowledge_base` 两项按 `session?.role === 'system_admin'` 分叉成"平台版/校内版"两套文案。`Sources: [src/components/TopHeader.tsx:54-59]()`
8. `coach` 视图下顶栏不显示「标题 / 副题」结构，改显示会话标题 + 呼吸点 + 「2026大赛知识库在线」徽章。`Sources: [src/components/TopHeader.tsx:90-99]()`
9. 会话标题的取数逻辑区分空间会话与独立会话（`activeSpaceId === 'none'`），兜底为「规划场景深度演进路径」。`Sources: [src/App.tsx:539-543]()`
10. **会话历史区**渲染在导航下方，可见性为 `team_member || school_admin`（导师端与 Admin 端不展示）。`Sources: [src/components/Sidebar.tsx:529-531]()`
11. 会话历史区支持折叠/展开、显示计数、新建会话（`+`）、单条删除（hover 显示垃圾桶）、以及按会话类型渲染不同任务图标。`Sources: [src/components/Sidebar.tsx:532-609]()`
12. 任务图标映射 `renderSessionTaskIcon` 覆盖 11 类：答辩 / BP / PPT / 政策 / 市场表格 / 标杆案例 / 知识库 / 写作 / 图像 / 视频 / 默认，判定依据是 `taskType` 或 `taskKey` 或标题关键词三选一命中。`Sources: [src/components/Sidebar.tsx:113-150]()`
13. **备赛捷径与工具区**可见性为「非 mentor 且非 system_admin」（即学生端与学校管理端），含 3 个入口：2026官方评审细则、海量项目智能导入（仅 school_admin）、阶段复盘汇报生成（仅 school_admin）。`Sources: [src/components/Sidebar.tsx:613-661]()`
14. **当前参赛项目切换器**（全局项目选择）只在 `team_member` 下渲染，位于导航上方。`Sources: [src/components/Sidebar.tsx:300-301]()`
15. 底部固定用户卡展示角色与高校，点击弹出账号菜单（切换登录端、全员权限与角色分配、退出登录）；「全员权限与角色分配」仅对 `school_admin` / `system_admin` 显示。`Sources: [src/components/Sidebar.tsx:664-767]()`
16. 顶栏右侧含两个开关按钮（左栏折叠 `btn-toggle-sidebar`、右区独立工作区 `btn-toggle-right-workspace`）与一个预警铃铛 `btn-top-alert-center`。`Sources: [src/components/TopHeader.tsx:73-142]()`
17. 铃铛红点计数只统计 `urgent` 与 `warning` 两类告警，`info` 不计入。`Sources: [src/components/TopHeader.tsx:42-42]()`
18. 告警下拉里带 `projectId` 的条目会渲染跳转按钮，点击回调 `onSelectProjectFromAlert` → `App.handleSelectProjectById` 打开项目抽屉。`Sources: [src/components/TopHeader.tsx:175-187]()` `Sources: [src/App.tsx:435-440]()`
19. 会话标题在侧栏渲染前会经过 `cleanSessionTitle` 清洗。`Sources: [src/utils/titleUtils.ts:9-16]()`

## 规则与边界（AI 开发硬约束）

- **导航是 if-else 链不是配置表**：`team_member` / `mentor` / `system_admin` 是显式分支，`school_admin` 走默认 return。新增角色若不显式加分支，会自动继承 `school_admin` 的 10 项全量导航 —— 这是最容易踩的坑。
- **视图可见性是分散的四个条件**，没有统一权限表：
  - 导航组：`getNavGroups`（190-261）
  - 会话历史区：`team_member || school_admin`（530）
  - 备赛捷径区：`!== mentor && !== system_admin`（614）
  - 项目切换器：`team_member`（301）
  改某角色的可见性必须四处都核。
- **`tabTitleMap` 是穷尽式 `Record<TabType, ...>`**：给 `TabType` 加成员而不补 `tabTitleMap`，TypeScript 会报错——这是当前唯一的编译期护栏，别用 `Partial` 或 `as any` 绕过。
- **英文术语残留**：侧栏分组名用中文（「AI伴学与答辩实训」等），但项目下拉的注释文案含 "(全局联动)" 等中文括号；而 `App.tsx` 与部分组件里仍有英文注释与英文 UI 残留文本，改动时不要引入新的中英混排。
- 会话历史区的删除按钮是 `e.stopPropagation()` 包装的，改动点击行为时不要破坏这个冒泡拦截。`Sources: [src/components/Sidebar.tsx:588-598]()`

## 常见开发任务（AI Coding 入口）

| 任务 | 落点 |
|---|---|
| 加/删某角色的菜单项 | `Sidebar.tsx:191-260` 对应角色的 `items` 数组 |
| 调导航分组名 | `Sidebar.tsx:194/208/219/231/237/243/252` |
| 改页面标题/副题 | `TopHeader.tsx:44-62` |
| 改会话历史可见性 | `Sidebar.tsx:530` |
| 改备赛捷径可见性 | `Sidebar.tsx:614` |
| 加会话任务图标类型 | `Sidebar.tsx:113-150`（`renderSessionTaskIcon`） |
| 改铃铛计数口径 | `TopHeader.tsx:42` |
| 改侧栏宽度/折叠行为 | `Sidebar.tsx:266-274` |

## 与 related_pages 的联动提示

- → **page-sidebar-widgets**：备赛捷径区与项目切换器虽然物理上都在 `Sidebar.tsx`，但业务归属是"全局件"页；改侧栏时两页都要看，避免把全局件当导航项改。
- → **page-system-overview**：角色定义来自 `PortalRole`，导航是角色的下游消费方。
- 隐藏耦合：`coach` 导航项会**创建新会话**，因此点菜单会改 `activeSessionId`，进而触发 page-coach 的会话切换 effect。改这一项时要意识到它不只是"切页面"。
