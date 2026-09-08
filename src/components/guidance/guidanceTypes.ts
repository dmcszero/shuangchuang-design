/**
 * 全链路智能指导工作台类型定义
 * 对齐高校双创赛事 L1~L6 六阶段旅程与 12 章商业计划书打磨
 */

// ---- 创新类型分诊 ----
export interface TriageEvidence {
  type: string; // 类型（产品/工艺流程/服务/商业模式）
  quote: string; // BP 原文片段
}

export interface TriageResult {
  projectId: string;
  primaryType: string; // 主导类型
  secondaryTypes: string[]; // 次要类型
  confidence: Record<string, number>; // 各类型置信度
  evidence: TriageEvidence[];
  status: string; // active / re-triage
  degraded: boolean; // 是否降级（LLM 不可用）
}

// ---- 章节识别（要素级判定） ----
export interface ChapterElement {
  elementId: string;
  name: string;
  present: boolean;
  evidence: string;
}

export type ChapterMatchType = 'complete' | 'weak' | 'missing' | 'not_applicable';

export interface RecognizedChapter {
  standardId: string; // 标准章编号（1~12）
  standardName: string;
  actualTitle: string;
  matchType: ChapterMatchType;
  coverage: number; // 覆盖度 0~1
  elements: ChapterElement[];
}

export interface RecognitionResult {
  projectId: string;
  chapters: RecognizedChapter[];
  missing: string[]; // 缺项标准章编号
  weak: string[]; // 弱覆盖标准章编号
  notApplicable: string[];
  degraded: boolean;
}

// ---- 评分（基线 & 增量） ----
export interface ScoreItem {
  itemId: string;
  itemText: string; // 评审内容条目文本
  dimension: string; // 所属维度
  cap: number; // 条目分值上限
  baseScore: number; // 上一版得分
  currentScore: number;
  delta: number;
  reason: string;
  quote: string;
}

export type TrendType = 'up' | 'down' | 'flat';

export interface AssessResult {
  projectId: string;
  versionId: string;
  group: string; // 创意组/创业组
  scorecardName: string;
  items: ScoreItem[];
  dimensionScores: Record<string, number>;
  total: number;
  trend: TrendType;
  isBaseline: boolean;
  degraded: boolean;
  issues: string[];
}

// ---- 工作台聚合 ----
export interface ScoreVersion {
  versionId: string;
  createdAt: string;
  total: number;
  trend: TrendType;
}

export interface GuidanceDashboard {
  projectId: string;
  projectName: string;
  triage: TriageResult | null;
  recognition: RecognitionResult | null;
  group: string | null;
  latestVersion: AssessResult | null;
  versions: ScoreVersion[];
  chaptersDone: number;
  chaptersTotal: number;
}

// ---- 版本管理 ----
export type VersionType = 'snapshot' | 'version' | 'milestone';

export interface ProjectVersion {
  versionId: string;
  versionType: VersionType;
  label: string;
  source: string; // auto/manual/edit/milestone
  scoreVersionId: string | null;
  createdAt: string;
  total: number | null;
  content?: string;
  parentId?: string | null;
  branchName?: string | null;
  commitMsg?: string;
}

// ---- 多模态材料管理 ----
export interface ProjectFileItem {
  id: string;
  name: string;
  fileType: 'text' | 'binary' | 'readonly';
  size: number;
  versionRef: string | null;
  readonly: boolean;
  updatedAt: string;
  category: string; // 核心申报书 / 用户调研 / 核心技术 / 路演答辩 / 演示多媒体 / 佐证材料
  badge?: string; // 国赛金奖正本 / 真实实测验证 / 已授权发明专利 / CNAS权威认证等
  description?: string;
  author?: string;
  ext: string; // md / pptx / mp4 / pdf / xlsx
  tags?: string[];
  contentPreview?: string;
  metadata?: Record<string, any>;
}

// ---- AI 教练会话 ----
export interface CoachSessionItem {
  id: string | number;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  stageFocus?: string;
}

export interface CoachMessageItem {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  suggestions?: string[];
  suggestedDiff?: {
    chapterId: string;
    chapterName: string;
    replacement: string;
  };
}

// ---- 全链路阶段旅程（L1~L6） ----
export type StageStatus = 'done' | 'doing' | 'todo';

export interface StageProgressItem {
  stage: string; // L1~L6
  label: string;
  status: StageStatus;
  hint: string;
  subItems?: string[];
}

// ---- 诊断报告 ----
export interface DiagnosisItem {
  text: string;
  chapterId: string;
  action: string;
  target: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface DiagnosisResult {
  projectId: string;
  stage: string;
  stageLabel: string;
  youAre: string;
  missing: DiagnosisItem[];
  nextSteps: DiagnosisItem[];
}

// ---- 动态待办 ----
export interface GuidanceTodoItem {
  id: string;
  title: string;
  stage: string; // L1~L6
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  chapterRef?: string;
}
