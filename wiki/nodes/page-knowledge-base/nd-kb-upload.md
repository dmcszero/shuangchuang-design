---
id: nd-kb-upload
title: 上传文件弹窗
page: page-knowledge-base
kind: modal
importance: high
sources:
  - src/components/KnowledgeBaseManagement.tsx:947-1084
---

## 一句话定位

往当前库里加文档：点击/拖拽选取本地文件（**全库少数真正调用 `input[type=file]` 的控件之一**）→ 补全名称、格式、大小与摘要 → 提交后 600ms「语义解析」占位，随后文件入表并更新库规格。

## 事实（每条强制可回溯）

1. 由 `isUploadFileModalOpen` 控制；五个 state：`uploadFileName`（必填）/ `uploadFileType`（初值 `pdf`）/ `uploadFileSize`（初值 `2.5 MB`）/ `uploadFileSummary` / `isUploading`。 Sources: [src/components/KnowledgeBaseManagement.tsx:46]() [src/components/KnowledgeBaseManagement.tsx:57-61]()
2. **真实文件选择器**：虚线框点击触发 `fileInputRef.current?.click()`，隐藏的 `<input type="file" ref={fileInputRef}>` 在 `onChange` 中读取**文件名、扩展名、大小**——文件名去掉后缀写入名称框、扩展名命中六类则同步到格式下拉、大小换算为 MB 写入大小框。 Sources: [src/components/KnowledgeBaseManagement.tsx:971-998]()
3. **但文件内容从不被读取**：没有 `FileReader`、没有上传请求；后续一切「解析」都基于文件名/大小两个元数据（见事实 4）。 Sources: [src/components/KnowledgeBaseManagement.tsx:971-998]()
4. 提交 `handleUploadFileSubmit`：置 `isUploading` → `setTimeout(600ms)` → 生成 `KnowledgeBaseFile`，其中 **`chunks` 为随机数** `Math.floor(60 + Math.random() * 150)`（60~209），**`sizeBytes` 写死 2500000**，`uploader` 写死「陈建国 (校管理员)」，`status: 'indexed'`（直接标记为已索引），`hitCount: 0`；摘要为空时兜底「文档已由AI自动解析、完成文本清洗并注入校内专属知识库，可被智能问答与初筛引擎实时检索引用。」 Sources: [src/components/KnowledgeBaseManagement.tsx:163-212]()
5. 写入时同步更新所属库：`files` 前置新文件、`fileCount` = 新长度、`chunkCount` 累加该随机 chunks、`totalSize` 按新旧 MB 相加（`parseFloat` 解析）、`updatedAt` 置「刚刚」。 Sources: [src/components/KnowledgeBaseManagement.tsx:185-203]()
6. 文件名若未带后缀会**自动补当前格式后缀**（`name.endsWith('.' + type) ? name : name + '.' + type`）。 Sources: [src/components/KnowledgeBaseManagement.tsx:171-173]()
7. 上传中「取消」与「确认」按钮**都被 disabled**，确认按钮文案切换为「正在进行语义解析与要点提取...」（带旋转图标）；结束后清空名称与摘要（**格式、大小保留上次值**）并 Toast「文件【X】已成功上传并完成结构化知识解析（提取 N 条核心知识要点）！」。 Sources: [src/components/KnowledgeBaseManagement.tsx:1050-1082]() [src/components/KnowledgeBaseManagement.tsx:203-212]()

## 规则与边界（AI 开发硬约束）

- **「AI 解析」是一段 600ms 的 setTimeout + 随机数**：`chunks` 与「提取 N 条核心知识要点」的 N 都是随机生成的，与文件真实内容无关；`status` 直接写成 `indexed`。接真实能力时替换这一整个 handler（数据结构可直接复用）。
- **文件内容零读取**（事实 3）：选中的文件只是元数据来源；这意味着「上传 PDF → 问答能引用」在当前实现下不可能成立。
- 上传成功后**不做格式/大小/重复校验**（同名文件可重复入库）。
- `sizeBytes` 写死 2500000，与展示用的 `size` 字符串**不同步**——按字节统计的自定义需求会得到错误值。
- 断网/失败路径无从触发（无请求），因此没有错误态 UI。

## 常见开发任务（AI Coding 入口）

| 任务 | 起点 | 需要同步改动 |
|---|---|---|
| 接真实上传 + 解析 | `:163-212` | 需文件服务；`chunks` / `status` 改由服务返回 |
| 去掉随机数、改为按内容估算 | `:170` | 需解析结果 |
| 上传进度条 | `:1050-1082` | 需真实进度事件 |
| 重复文件校验 | `:163` | 需按名称/哈希去重 |
| 拖拽上传（文案已承诺） | `:972-998` | 当前只支持点击选取，**无 drop 事件** |

## 出入边（incoming / outgoing）

<!-- EDGES:BEGIN -->
> 本节的**真源是 `wiki/edges.json`**，由 `python wiki/gen_wiki_tools.py sync-edges` 整段渲染，手写会被覆盖。要改边请改边表后重跑该命令。

**入边 0 条**

（无）

**出边 1 条**

- **`e-kb-upload-2-detail-writeback`** → `nd-kb-detail`（库内文件管理（二级视图））｜`writeback` · **implemented（已实现）**
  - 触发：上传弹窗提交「确认上传并解析」
  - 载荷：`KnowledgeBaseFile{name, fileType, size, sizeBytes, uploader, chunks(随机 60~209), status:'indexed', summary, hitCount:0} + 所属库的 fileCount/chunkCount/totalSize/updatedAt 同步更新`
  - 逻辑：handleUploadFileSubmit：isUploading → setTimeout(600ms) → 构造文件 → setKnowledgeBases 就地更新所属库（files 前置、fileCount=新长度、chunkCount 累加、totalSize 相加、updatedAt='刚刚'）→ 关弹窗 → Toast「已成功上传并完成结构化知识解析（提取 N 条要点）」。
  - 出处：`src/components/KnowledgeBaseManagement.tsx:163-212`
  - 备注：真实 `<input type="file">` 只读取文件名/扩展名/大小，**文件内容从不读取**；chunks 为随机数、sizeBytes 写死 2500000。
<!-- EDGES:END -->
