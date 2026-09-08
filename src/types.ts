export type TrackType =
  | 'higher_education_creative' // 高教主赛道 - 创意组
  | 'higher_education_startup'  // 高教主赛道 - 创业组
  | 'red_youth_creative'        // “青年红色筑梦之旅” - 创意组
  | 'red_youth_public'          // “青年红色筑梦之旅” - 公益组
  | 'red_youth_startup'         // “青年红色筑梦之旅” - 创业组
  | 'vocational_creative'       // 职教赛道 - 创意组
  | 'vocational_startup'        // 职教赛道 - 创业组
  | 'industry_enterprise'       // 产业赛道 - 企业命题组
  | 'industry_conversion'       // 产业赛道 - 成果转化组
  | 'international_track'       // 国际项目赛道
  | 'sprout'                    // 萌芽赛道
  | '科技创新'
  | '商业模式'
  | '社会公益'
  | '乡村振兴'
  | '创意设计';

export type PortalRole = 'team_member' | 'school_admin' | 'mentor' | 'system_admin';

export interface UserSession {
  role: PortalRole;
  roleLabel: string;
  name: string;
  avatar: string;
  account: string;
  university?: string; // 高校名称（项目组成员、学校管理端必选）
  college?: string;    // 二级学院/部门
  majorOrTitle?: string;
  email?: string;
  phone?: string;
  projectId?: string;   // 项目组成员绑定的重点项目ID
  projectName?: string; // 绑定的项目名称
}

export type TierGrade = 'A' | 'B' | 'C' | 'D';
export type StageLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type HealthStatus = 'normal' | 'warning' | 'critical';

export interface Tier2CriterionRule {
  id: string;
  name: string;
  maxScore: number;
  description: string;
}

export interface Tier1CriterionRule {
  id: string;
  name: string;
  maxScore: number;
  tier2List: Tier2CriterionRule[];
}

export interface TrackEvaluationRule {
  trackId: TrackType;
  trackName: string;
  groupName: string;
  totalMaxScore: number;
  tier1Rules: Tier1CriterionRule[];
  mandatoryConditions: string[];
}

export interface Tier2ScoreItem {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  comment?: string;
  benchmarkGoldScore?: number;
}

export interface Tier1ScoreItem {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  tier2Scores: Tier2ScoreItem[];
}

export interface ComplianceInspection {
  passed: boolean;
  ipRiskLevel: 'low' | 'medium' | 'high';
  ipDetails: string;
  plagiarismRate: number; // 查重率 %
  aiContentRate: number; // AI代写疑似度 %
  eligibilityPassed: boolean; // 参赛资格审查
  duplicateDeclaration: boolean; // 历史重复申报检测
  warnings: string[];
}

export interface LogicGapItem {
  type: 'logic_broken' | 'data_conflict' | 'tech_stack' | 'business_vague';
  title: string;
  location: string;
  description: string;
  suggestion: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  name: string;
  college: string;
  leader: string;
  leaderTitle?: string;
  teamMembersCount: number;
  advisor: string;
  track: TrackType;
  trackLabel: string;
  groupLabel: string;
  currentStage: StageLevel;
  stageName: string;
  grade: TierGrade;
  rank: number;
  totalScore: number;
  benchmarkGoldScore: number;
  goldSimilarity: number; // 历史金奖特征匹配度 %
  aiConfidence: number; // AI评测置信度 %
  compliance: ComplianceInspection;
  tier1Scores: Tier1ScoreItem[];
  weaknessLabels: string[];
  strengthsLabels: string[];
  logicGaps: LogicGapItem[];
  killerQuestions: string[];
  assignedMentorId?: string;
  assignedMentorName?: string;
  lastUpdated: string;
  healthStatus: HealthStatus;
  healthReason?: string;
  scoreHistory: { date: string; score: number; reviewStage: string }[];
  materials: {
    bpFile: string;
    bpPages: number;
    pptFile: string;
    pptSlides: number;
    vcrFile?: string;
    patentCount: number;
    softwareCopyrightCount: number;
  };
}

export interface MentorExpert {
  id: string;
  name: string;
  avatar: string;
  title: string;
  organization: string;
  type: 'internal' | 'external';
  roleCategory?: 'academic' | 'industry' | 'national_judge' | 'investor' | 'legal_finance' | 'alumni';
  phone?: string;
  email?: string;
  wechat?: string;
  officeLocation?: string;
  honorTitle?: string;
  appointedYear?: string;
  expertiseTags: string[];
  preferredTracks: TrackType[];
  currentProjectsCount: number;
  maxCapacity: number;
  rating: number;
  mentoringCount: number;
  goldProjectsCoached: number;
  availability: 'available' | 'busy' | 'full';
  bio: string;
  availableTimeSlots: string[];
}

export interface WorkOrderTask {
  id: string;
  category: '创新点' | '商业模式' | '团队' | '材料/PPT' | '财务与数据';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDays: number;
}

export interface SupervisionWorkOrder {
  id: string;
  projectId: string;
  projectName: string;
  college: string;
  leader: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  sessionDate: string;
  sessionType: 'online_meeting' | 'offline_coaching' | 'mock_defense';
  audioDurationMinutes: number;
  diagnosticSummary: {
    coreFindings: string;
    dimensionFeedback: {
      dimension: string;
      expertRemark: string;
      level: 'good' | 'average' | 'poor';
    }[];
  };
  tasks: WorkOrderTask[];
  status: 'pending_student' | 'student_submitted' | 'expert_checked' | 'overdue';
  studentSubmission?: {
    submissionDate: string;
    modificationNotes: string;
    newBpVersion: string;
    newPptVersion: string;
    vcrUpdated?: boolean;
  };
  expertCheck?: {
    checkedDate: string;
    approved: boolean;
    finalRemark: string;
    scoreChangeDelta: number;
  };
}

export interface CohortBatchTask {
  id: string;
  title: string;
  targetGrade: TierGrade | 'ALL';
  targetTracks: TrackType[] | 'ALL';
  deadline: string;
  description: string;
  totalTargetProjects: number;
  submittedCount: number;
  reviewedCount: number;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface NotificationAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  content: string;
  timestamp: string;
  projectId?: string;
  actionLabel?: string;
}

// ==========================================
// shuangchuang-AI Domain Types
// ==========================================

export type ProjectType = '科研型' | '技术应用型' | '农业实践型' | '商业模式型' | '社会公益型';
export type MaturityStatus = 'L1' | 'L2' | 'L3' | 'L4'; // 探索期, 概念期, 方案期, 成熟期
export type GradeType = 'A' | 'B' | 'C' | 'D';
export type ConfidenceType = 'high' | 'medium' | 'low';

export interface Chapter {
  id: string;
  title: string;
  whatJudgesLookFor: string;
  commonPitfalls: string;
  content: string;
  feedback: string;
  score: number;
}

export interface Project {
  id: string;
  name: string;
  track: TrackType;
  type: ProjectType;
  leader: string;
  school: string;
  status: MaturityStatus;
  score: number;
  grade: GradeType;
  confidence: ConfidenceType;
  summary: string;
  detailedScores: {
    innovation: number;       // 创新性
    feasibility: number;      // 技术可行性
    businessValue: number;    // 市场与商业价值
    team: number;             // 团队匹配度
    presentation: number;     // 材料完整性与表达
    socialImpact: number;     // 社会价值与影响力
  };
  reasons: {
    innovation: string;
    feasibility: string;
    businessValue: string;
    team: string;
    presentation: string;
    socialImpact: string;
  };
  issues: string[]; // 一致性问题
  anomalies: string[]; // 抄袭、AI代写检测标签
  revisions: Array<{
    version: string;
    date: string;
    score: number;
    changes: string;
  }>;
  chapters: Chapter[];
}

export interface Case {
  id: string;
  name: string;
  award: '金奖' | '银奖' | '铜奖';
  track: TrackType;
  type: ProjectType;
  summary: string;
  highlights: string[];
  judgeComments: string;
}

export interface ExpertSkill {
  id: string;
  name: string;
  category: '评审类' | '指导类' | '提问类';
  track: TrackType;
  description: string;
  rules: string[];
  pitfalls: string[];
  anchors: Array<{
    range: string;
    criteria: string;
  }>;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  score?: number; // Answer score if evaluated
  criticism?: string; // AI critique
  followUpPrompt?: string; // Next question suggestion
}

export interface MockQASession {
  id: string;
  projectId: string;
  projectName: string;
  persona: string; // Judge name
  personaTitle: string; // "资深投资人" etc.
  personaStyle: string; // "严苛", "务实", etc.
  difficulty: 'basic' | 'medium' | 'hard';
  status: 'idle' | 'running' | 'completed';
  currentQuestionIndex: number;
  questions: string[];
  answers: string[];
  scores: number[];
  feedbacks: string[];
  messages: Message[];
}

export interface ReActStep {
  id: string;
  type: 'reasoning' | 'plan' | 'act';
  title: string;
  subtitle?: string;
  content?: string;
  tasks?: Array<{ id: string; text: string; done?: boolean }>;
  command?: {
    lang?: string;
    cmd: string;
    output?: string;
  };
}

export interface ReActProcess {
  duration?: string;
  summary?: string;
  steps: ReActStep[];
}

export interface ChatMessage {
  id: string;
  sender: 'coach' | 'student' | 'system';
  type: 
    | 'text' 
    | 'intro_scenarios' 
    | 'stage_prompt' 
    | 'policy_answer' 
    | 'track_comparison' 
    | 'ask_bp_upload' 
    | 'tool_calling' 
    | 'bp_diagnosis' 
    | 'judge_selector' 
    | 'defense_grilling' 
    | 'defense_review' 
    | 'gold_cases' 
    | 'competitor_intel' 
    | 'campus_resources' 
    | 'flywheel_summary'
    | 'atomic_call_result'
    | 'deep_call_prompt_confirm'
    | 'deep_call_config_collection'
    | 'deep_call_result';
  text?: string;
  timestamp: string;
  data?: any;
  citation?: string;
  engineAttribution?: string;
  adoptedStatus?: 'none' | 'adopted' | 'rejected';
  reactProcess?: ReActProcess;
  mentionedFiles?: Array<{ id: string; name: string; type?: string }>;
  callMeta?: {
    callType: 'shallow' | 'deep';
    targetEngine: '4.2' | '4.3';
    capabilityName: string;
    duration?: string;
    inputPayload?: any;
    outputResponse?: any;
  };
  generatedFiles?: AssociatedFileItem[];
  changesCount?: number;
}

export interface DataFlowLog {
  id: string;
  time: string;
  callType: 'shallow' | 'deep';
  source: '4.1 智能问答';
  target: '4.2 全链路智能指导' | '4.3 模拟评审与答辩训练';
  actionName: string;
  status: 'pending' | 'success' | 'cancelled';
  inputPayload: any;
  outputResponse?: any;
}

export interface SpaceWorkspace {
  localPath: string; // 本地工作空间目录路径 (e.g. ~/Workspaces/zhiyun-agri)
  cloudBucket: string; // 云端同步存储桶路径 (e.g. oss://innov-cloud/spaces/sp-zhiyun/)
  cloudSyncStatus: 'synced' | 'syncing' | 'offline'; // 同步状态
  lastSyncTime: string; // 最近同步时间
  totalFiles: number;
  syncRate?: string; // 100% 同步
}

export interface CoachSession {
  id: string;
  title: string;
  time: string;
  preview?: string;
  active?: boolean;
  messages?: ChatMessage[];
  taskKey?: string; // 7类任务标识
  taskTag?: string; // 任务分类标签
  taskType?: string; // 任务类型：'chat' | 'bp' | 'defense' | 'ppt' | 'policy' | 'market' | 'benchmark' | 'knowledge' | 'writing' | 'image' | 'sheet' | 'video'
}

export interface ProjectSpace {
  id: string;
  name: string;
  trackTag: string; // 参赛赛道/组别，如 "新农科组" | "医疗健康"
  school: string; // 申报高校
  leader: string; // 团队负责人
  stage: MaturityStatus; // L1-L4
  workspace: SpaceWorkspace;
  sessions: CoachSession[];
  activeSessionId: string;
  icon?: string;
}

export interface ExpertAgent {
  id: 'diagnosis' | 'defense' | 'policy' | 'intel' | 'campus';
  name: string;
  avatar: string;
  badge: string;
  role: string;
  description: string;
  recommendedFor: string;
  builtinSkills: Array<{ id: string; name: string; icon: string; description?: string }>;
  builtinConnectors: Array<{ id: string; name: string; icon: string; recordsCount?: string }>;
}

export interface CoachSkillDef {
  id: string;
  name: string;
  icon: string;
  engine: string;
  description: string;
  defaultActive: boolean;
}

export interface McpConnectorDef {
  id: string;
  name: string;
  icon: string;
  endpoint: string;
  recordsCount: string;
  status: 'connected' | 'idle';
  description: string;
  defaultActive: boolean;
}

export interface RecommendedTaskDef {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  agentId: 'diagnosis' | 'defense' | 'policy' | 'intel' | 'campus';
  skills: string[];
  mcps: string[];
  tag?: string;
  taskCategory?: string; // 7大任务之一
}

export interface AssociatedFileItem {
  id: string;
  name: string;
  type: 'bp' | 'ppt' | 'vcr' | 'attachment' | 'excel' | 'doc';
  typeLabel: string;
  size: string;
  updateTime: string;
  status?: 'ready' | 'processing';
  metaInfo?: string;
  contentData?: any;
}

