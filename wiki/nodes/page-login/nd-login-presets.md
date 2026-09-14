---
id: nd-login-presets
title: 一键免密登入测试账号
page: page-login
kind: list
importance: high
sources:
  - src/components/LoginPage.tsx:500-556
---

## 一句话定位

表单下方的 8 个演示账号卡片（每端 2 个）：点一下直接进入对应端的工作区——**跳过表单与全部校验**，是 demo 演示与自测的主入口。

## 事实（每条强制可回溯）

1. 区块标题「当前端推荐测试账号 (点击一键免密登入)」，右侧注「免手动填写」。 Sources: [src/components/LoginPage.tsx:502-508]()
2. 卡片列表 = `DEMO_PRESET_ACCOUNTS[activeRole]`，因此**只展示当前端的 2 个**账号（切端即换）。 Sources: [src/components/LoginPage.tsx:510]()
3. 点击卡片先调 `handleSelectPreset`（回填表单四项：account/password/name/college，有 university 则一并回填并清错），随后**在同一处理器内立刻构造 `UserSession` 并调用 `onLoginSuccess`**——不经过 `handleSubmit`，因此账号非空与高校必选两条校验都被绕过。 Sources: [src/components/LoginPage.tsx:60-71]() [src/components/LoginPage.tsx:513-532]()
4. 免密登录构造的 session 使用预置账号的 `role/name/avatar/account/university/college/majorOrTitle/projectId/projectName`，`roleLabel` 由内联三元表达式映射（与表单里的映射表是**两套独立写法**）。 Sources: [src/components/LoginPage.tsx:514-532]()
5. 卡片视觉信息：头像图、姓名、高校徽标（有 university 才显示）、`{title} · {account}`、hover 变 sky 色并显示箭头。 Sources: [src/components/LoginPage.tsx:534-544]()
6. 预置账号数据源为 `src/data/mockUniversities.ts` 的 `DEMO_PRESET_ACCOUNTS`（`:50-151`），四端各 2 条，字段含 `passwordHint`（明文密码提示）、`description`（用途说明）、可选 `projectId`/`projectName`。 Sources: [src/data/mockUniversities.ts:50-151]() [src/data/mockUniversities.ts:24-48]()
7. 学生端两个预置账号分别绑定 `proj-001`（同济 · 光子芯眸）与 `proj-002`（浙大 · 菌草金粮），即**点哪张卡决定进哪个项目**。 Sources: [src/data/mockUniversities.ts:51-82]()

## 规则与边界（AI 开发硬约束）

- 免密路径是**绕过校验的后门**：任何新增校验（密码强度、验证码、二次确认）都必须显式决定是否也拦这张卡，否则会出现「填错也能进」。
- `roleLabel` 在本节点与表单节点各写了一套三元映射（`:514-532` 与 `:83-88`），**两处不同步就会出现同一角色两种标签**；改标签要双边改，或抽常量。
- 预置账号既是演示数据也是**身份数据源**：`projectId` 决定学生进去后看到哪个项目，删除/改号会影响演示脚本。
- 密码以明文写在源码的 `passwordHint` 中并被自动填入表单——demo 可接受，但**不得扩展为真实账号体系**。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 新增/替换演示账号 | `src/data/mockUniversities.ts:33+` | 头像 URL、`projectId` 需与 `mockProjects` 对齐 |
| 演示脚本只保留一端 | `:510` | 纯过滤，无副作用 |
| 关掉免密后门（上线前） | `:513-533` | 需同步移除 `handleSelectPreset` 的自动回填语义 |
| 统一 roleLabel 映射 | `:514-532` + `:83-88` | 建议抽到 `src/constants` 并被两侧引用 |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 2 条**

- **`e-login-presets-2-form-prefill`** → `nd-login-form`（账号登录表单）｜`writeback` · **implemented（已实现）**
  - 触发：点击「当前端推荐测试账号」卡片
  - 逻辑：handleSelectPreset(preset) 回填 account/password/name/college（有 university 则一并回填）并清错；由于同一处理器内立刻登录跳转，这次回填对用户通常不可见。
  - 出处：`src/components/LoginPage.tsx:60-71`
  - 出处：`src/components/LoginPage.tsx:513-532`
- **`e-login-presets-2-shell-app-instant`** → `shell-app`（应用壳层）｜`navigate-with-payload` · **implemented（已实现）**
  - 触发：点击预置账号卡（一键免密登入）
  - 载荷：`UserSession{role, roleLabel(内联三元映射), name, avatar, account, university?, college, majorOrTitle?, projectId?, projectName?}`
  - 逻辑：卡片 onClick 内直接构造 session 并调 onLoginSuccess，绕过 handleFormSubmit 的两条校验。
  - 出处：`src/components/LoginPage.tsx:513-532`
  - 出处：`src/App.tsx:315-340`
  - 备注：与 e-login-form-2-shell-app-login 构成平行边（同 from/to、不同 trigger 与 payload 来源）；roleLabel 在本处另写一套三元映射，与表单内的映射表不同步即会出现同角色两套标签。
<!-- EDGES:END -->
