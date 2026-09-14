---
id: page-legacy-code
title: 遗留与孤儿组件盘点
section: sec-system
importance: low
sources:
  - src/App.tsx
  - src/components/Navbar.tsx
  - src/components/SceneDashboard.tsx
  - src/components/SceneScreening.tsx
  - src/components/SidebarSpaceManager.tsx
  - src/components/guidance/ProjectFileViewer.tsx
  - src/data/mockData.ts
  - src/data/mockSpaces.ts
  - src/data/mockSpacesData.ts
related_pages: [page-app-shell]
---

# 遗留与孤儿组件盘点

## 一句话定位

`src/` 下有 7 个源文件**未被任何其它文件 import**（对全库 `from '...'` 语句扫描得出），属于早前版本留下的死代码——它们仍参与 TS 编译（`npm run lint` 会扫），但不在运行时链路上，**只记录、不信赖，开发时不要在其上叠加新功能**。

## 事实（每条强制可回溯）

**判定方法（可复现）**：对 `src/**/*.{ts,tsx}` 全量收集 `from '<spec>'` 的模块名，与各文件 stem 比对，未被任何文件引用的即孤儿。复现命令（Git Bash，仓库根执行）：

```bash
grep -rn "from '.*Navbar'" --include=*.ts --include=*.tsx src/   # 返回空即无引用方
```

1. `src/components/Navbar.tsx`（224 行）为顶层组件定义（`interface NavbarProps` + `export default function Navbar`），全库无引用方。`Sources: [src/components/Navbar.tsx:19-29]()`
2. `src/components/SceneDashboard.tsx`（233 行）为顶层组件定义，全库无引用方。`Sources: [src/components/SceneDashboard.tsx:14-18]()`
3. `src/components/SceneScreening.tsx`（**1171 行**）为顶层组件定义，全库无引用方——是孤儿中体量最大的一个，也是与现役 `ScreeningHub.tsx` 最易混淆的一个。`Sources: [src/components/SceneScreening.tsx:16-38]()`
4. `src/components/SidebarSpaceManager.tsx`（389 行）为顶层组件定义，全库无引用方。`Sources: [src/components/SidebarSpaceManager.tsx:14-26]()`
5. `src/components/guidance/ProjectFileViewer.tsx`（776 行）为顶层组件定义，全库无引用方。`Sources: [src/components/guidance/ProjectFileViewer.tsx:34-42]()`
6. `src/data/mockData.ts`（553 行）为 mock 数据模块，导出 `mockProjects` / `mockCases` / `mockExpertSkills` / `mockInterviews`，全库无引用方。`Sources: [src/data/mockData.ts:8-8]()` `Sources: [src/data/mockData.ts:319-319]()` `Sources: [src/data/mockData.ts:363-363]()` `Sources: [src/data/mockData.ts:412-412]()`
7. `src/data/mockSpaces.ts`（98 行）为 mock 数据模块，导出 `initialSpaces`，全库无引用方。`Sources: [src/data/mockSpaces.ts:8-8]()`
8. **传递性孤儿**：`src/data/mockSpacesData.ts` 本身被引用，但唯一引用方 `SidebarSpaceManager.tsx` 是孤儿，因此它同样不在运行时链路上。`Sources: [src/components/SidebarSpaceManager.tsx:11-11]()`
9. 对照：现役 `App.tsx` 的 import 清单（19 个组件 + 5 个 mock 数据模块 + 类型）里**不含上述任何一个**。`Sources: [src/App.tsx:1-40]()`
10. 现役入口 `main.tsx` 只引用 `App`，故孤儿文件不会从入口被间接拉到。`Sources: [src/main.tsx:1-10]()`
11. 命名易混淆对照：`SceneScreening.tsx`（孤儿，1171 行） vs `ScreeningHub.tsx`（现役，574 行，由 `App.tsx` 在 `screening` tab 渲染）。`Sources: [src/App.tsx:615-622]()`
12. `ProjectFileViewer.tsx` 已由 `SceneGuidanceWorkbench.tsx` 的注释显式"迁出"：该处写明「文件查看器已随材料资产迁出工作台（→ 会话模块右侧独立工作区 + 项目工作台·项目文件夹，0908-16）」。`Sources: [src/components/SceneGuidanceWorkbench.tsx:813-813]()`
13. **同名导出地雷**：孤儿 `src/data/mockData.ts` 导出的 `mockProjects` 与现役 `src/data/mockProjects.ts` 的 `mockProjects` **同名**。`Sources: [src/data/mockData.ts:8-8]()` `Sources: [src/data/mockProjects.ts:906-906]()`
    但两者的元素类型完全不同：孤儿版是 `Project[]`（含 `chapters` / `revisions` / `anomalies` 字段，见 `types.ts`），现役版是 `ProjectItem[]`（含 `tier1Scores` / `compliance` / `logicGaps`）。`Sources: [src/types.ts:258-295]()` `Sources: [src/types.ts:99-140]()`
    误 import 到孤儿版不会报"找不到模块"，只会在运行时出现字段 undefined 的静默错误——这是本页最需要防范的一个坑。

## 规则与边界（AI 开发硬约束）

- **不新增对孤儿文件的依赖**。一旦有现役文件 import 它们，就相当于把死代码拉回主链路，会同时引入未维护的 mock 数据结构与旧交互逻辑。
- **不在孤儿文件上做功能迭代**。要改「初筛」请改 `ScreeningHub.tsx`；要改「文件查看」请改 `RightWorkspacePanel.tsx` 或 `ProjectMemberWorkbench.tsx` 的项目文件夹 tab（见对应页）。在 `SceneScreening.tsx` / `ProjectFileViewer.tsx` 上改是无效劳动。
- **删除前先确认三件事**：① 无 import（本页已证）② 无 `window` 全局挂载或字符串式动态引用 ③ `mockSpacesData.ts` 的传递性依赖是否还有其它出口。当前仓库未做 tree-shaking 校验，删除属"需人工确认"动作。
- **`mockData.ts` 与 `mockSpaces.ts` 不要与现役 mock 混用**。现役数据源以 `mockProjects.ts` / `mockMentors.ts` / `mockSpaceData.ts` / `mockCoachData.ts` 等为准（见 page-data-model）。
- **import 时务必确认路径**：由于 `mockData.ts` 与 `mockProjects.ts` 存在同名 `mockProjects` 导出，写 `import { mockProjects } from '../data/mockData'` 不会报错但拿到的是错误模型。批量重构 mock 层时，先 grep 全库确认 import 源路径。
- 本页属 **importance: low**：无功能影响，仅在改名前/重构前作为地图使用，不必放进日常上下文预算。
- 判定结论有**时效性**：任何一次"接入孤儿组件"的提交都会使本页失效，届时须重跑第 1 条的复现命令并回写本页。

## 常见开发任务（AI Coding 入口）

| 任务 | 做法 |
|---|---|
| 复核孤儿清单 | 重跑本页第 1 节的 import 扫描（全库 `from '<spec>'` 与文件 stem 比对） |
| 清理死代码 | 先确认边界条件（见规则节），再连同 `mockSpacesData.ts` 评估；**建议单独提交**，便于回退 |
| 想复用旧实现 | 不要直接改孤儿文件；把需要的逻辑摘出来落到现役对应文件，并在本页记录摘取来源 |
| 排查"改了没效果" | 先确认改的文件是孤儿还是现役——`SceneScreening` / `ProjectFileViewer` / `Navbar` / `SceneDashboard` / `SidebarSpaceManager` / `mockData` / `mockSpaces` 改了都不会有运行时效果 |

## 与 related_pages 的联动提示

- → **page-app-shell**：`App.tsx` 的 import 清单与分发分支是"现役 vs 孤儿"的判定基线；新增视图时若 import 了本页任一文件，需回到本页更新清单。
- 与 page-screening 的分工：初筛的**现役**实现、三视图模式与四维筛选在 page-screening；本页只负责说明"还有一个叫 `SceneScreening` 的旧实现存在，别走错门"。
