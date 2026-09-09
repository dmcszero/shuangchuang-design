/**
 * 项目工作台（学员端）改造新增 mock 数据（0908-16 方案实施）
 * - 动态待办：AI 诊断生成池（与全链路指导 mock 口径一致）
 * - 项目文件夹：会话生成文件、来源标签、待归档区、文件更改记录
 *   ⚠️ 大事记口径 = 文件更改记录：仅记录文件与版本变更事件，不含立项/获奖等业务事件
 */
import { GuidanceTodoItem, ProjectFileItem } from '../guidance/guidanceTypes';

// ---- 动态待办（AI 诊断生成来源） ----
export interface WorkbenchAiTodo extends GuidanceTodoItem {
  source: 'ai';
}

export const WORKBENCH_AI_TODOS: WorkbenchAiTodo[] = [
  {
    id: 'wtd-1',
    title: '在第5章补充“客户迁移停机成本量化表”与“私有数据飞轮图谱”',
    stage: 'L4',
    completed: false,
    priority: 'high',
    assignee: '李林峰',
    dueDate: '2026-09-09',
    chapterRef: '第5章 竞争分析与护城河',
    source: 'ai'
  },
  {
    id: 'wtd-2',
    title: '在第10章财务模型中引入9个月账期压力测试与65万POC到账资金印证',
    stage: 'L4',
    completed: false,
    priority: 'high',
    assignee: '商业组',
    dueDate: '2026-09-09',
    chapterRef: '第10章 财务预测与融资计划',
    source: 'ai'
  },
  {
    id: 'wtd-3',
    title: '在第12章结合新质生产力与自主可控战略补全社会效益数据链',
    stage: 'L4',
    completed: false,
    priority: 'medium',
    assignee: '李林峰',
    dueDate: '2026-09-10',
    chapterRef: '第12章 社会价值与产业效益',
    source: 'ai'
  },
  {
    id: 'wtd-4',
    title: '校核200万张缺陷光谱图谱独占授权背书说明（响应国赛AI体检）',
    stage: 'L4',
    completed: true,
    priority: 'high',
    assignee: '技术组',
    dueDate: '2026-09-06',
    chapterRef: '第3章 产品/服务与技术',
    source: 'ai'
  },
  {
    id: 'wtd-5',
    title: '开展全真8分钟路演演讲计时演练，强化评委互动与首屏吸引力',
    stage: 'L5',
    completed: false,
    priority: 'medium',
    assignee: '全员',
    dueDate: '2026-09-12',
    source: 'ai'
  }
];

// ---- 项目文件夹：会话生成的产物文件（与三件套/上传件并列） ----
export const AI_GENERATED_FILES: ProjectFileItem[] = [
  {
    id: 'f-ai-ch5',
    name: '第5章_三道反制壁垒_增补段.md',
    fileType: 'text',
    size: 2150,
    versionRef: 'v2.0.0-rc',
    readonly: false,
    updatedAt: '2026-09-05 14:25',
    category: '核心申报书',
    badge: '会话生成',
    description: 'AI 教练针对第5章生成的防守反击增强段落，已一键应用至商业计划书正文',
    author: 'AI 教练 → 李林峰确认',
    ext: 'md',
    tags: ['会话产物', '竞争壁垒'],
    metadata: {
      fromSession: '全链路规划与巨头竞品防御强化'
    }
  },
  {
    id: 'f-ai-auth',
    name: '200万张数据集独占授权说明.docx',
    fileType: 'binary',
    size: 36800,
    versionRef: null,
    readonly: false,
    updatedAt: '2026-09-04 17:50',
    category: '佐证材料',
    badge: '会话生成',
    description: '响应AI待办自动生成的授权背书说明草稿，待法务复核后上传签章版',
    author: 'AI 教练 → 技术组',
    ext: 'docx',
    tags: ['会话产物', '授权背书'],
    metadata: {
      fromSession: '第10章财务预测三张表与单客户经济模型优化'
    }
  }
];

// ---- 文件来源标签（三件套/系统 · 上传 · 会话生成） ----
export type FileSourceKind = 'system' | 'upload' | 'ai';

export const FILE_SOURCE: Record<string, FileSourceKind> = {
  'f-bp-main': 'system',
  'f-roadshow-ppt': 'system',
  'f-demo-video': 'system',
  'f-financial-model': 'system',
  'f-interview-records': 'upload',
  'f-patent-cert': 'upload',
  'f-cnas-report': 'upload',
  'f-ai-ch5': 'ai',
  'f-ai-auth': 'ai'
};

// ---- 待归档区（来自会话、尚未入库的产物） ----
export interface PendingArchiveItem {
  id: string;
  name: string;
  fromSession: string;
  time: string;
  size: string;
}

export const PENDING_ARCHIVE_ITEMS: PendingArchiveItem[] = [
  {
    id: 'pend-1',
    name: '第5章_三道反制壁垒_增补段_v2.md',
    fromSession: 'L4 打磨 · 竞争壁垒攻坚',
    time: '今天 14:25',
    size: '2.1 KB'
  },
  {
    id: 'pend-2',
    name: '竞品基恩士对标分析_雷达图.png',
    fromSession: 'L4 打磨 · 竞争壁垒攻坚',
    time: '今天 14:31',
    size: '380 KB'
  }
];

// ---- 大事记 = 文件更改记录（谁·何时·动作·来自哪·形成哪版；不含业务事件） ----
export interface FileChangeEntry {
  id: string;
  date: string;
  actor: string;
  action: string; // 保存快照 / 编辑提交 / 上传新版 / 锁定里程碑版本 / 会话产物入库 / 初次成稿入库
  targetFile: string;
  detail: string;
  fromRef?: string; // 来自会话 / 工单 / 工作台版本抽屉
  versionRef?: string; // 形成的版本
  kind: 'edit' | 'milestone' | 'upload' | 'archive';
}

export const FILE_CHANGE_LOG: FileChangeEntry[] = [
  {
    id: 'fc-1',
    date: '2026-09-05 14:10',
    actor: '李林峰',
    action: '保存快照',
    targetFile: '面向晶圆级高精度光学缺陷检测系统-商业计划书.md',
    detail: '根据省金评审专家意见，补全大厂竞品迁移成本与私有数据飞轮论证，修正第10章财务回款周期假设。',
    fromRef: '全链路指导工作台',
    versionRef: 'v2.0.0-rc',
    kind: 'edit'
  },
  {
    id: 'fc-2',
    date: '2026-09-05 14:25',
    actor: 'AI 教练 → 李林峰确认',
    action: '会话产物入库',
    targetFile: '第5章_三道反制壁垒_增补段.md',
    detail: 'AI 教练会话生成防守反击增强段落，用户勾选「存入项目文件夹」自动登记。',
    fromRef: '会话「全链路规划与巨头竞品防御强化」',
    kind: 'archive'
  },
  {
    id: 'fc-3',
    date: '2026-08-25 18:30',
    actor: '李林峰',
    action: '锁定里程碑版本 🚩',
    targetFile: '面向晶圆级高精度光学缺陷检测系统-商业计划书.md',
    detail: '省决赛前夕里程碑锁定，新增国家第三方CNAS检测报告附件与头部两家客户POC实测回执。',
    fromRef: '全链路指导工作台·版本抽屉',
    versionRef: 'v1.4.0',
    kind: 'milestone'
  },
  {
    id: 'fc-4',
    date: '2026-08-30 14:00',
    actor: '王梦琪',
    action: '上传新版',
    targetFile: '国家机器人与精密仪器检测评定中心(CNAS)全项检验报告.pdf',
    detail: '响应专家工单整改要求，补充第三方权威背书。',
    fromRef: '专家工单',
    kind: 'upload'
  },
  {
    id: 'fc-5',
    date: '2026-07-20 10:15',
    actor: '李林峰',
    action: '编辑提交',
    targetFile: '面向晶圆级高精度光学缺陷检测系统-商业计划书.md',
    detail: '扩充第3章技术突破第一性原理图解，增加18类缺陷分类矩阵，重构财务预测模型。',
    versionRef: 'v1.2.0',
    kind: 'edit'
  },
  {
    id: 'fc-6',
    date: '2026-06-12 09:00',
    actor: '李林峰',
    action: '初次成稿入库',
    targetFile: '面向晶圆级高精度光学缺陷检测系统-商业计划书.md',
    detail: '首次基线创建，录入初步项目立项计划书与实验室初期检测数据。',
    versionRef: 'v1.0.0',
    kind: 'edit'
  }
];
