/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, User, Cpu, BookOpen, Layers, 
  HelpCircle, MessageSquare, BarChart3, ChevronRight, 
  CheckCircle2, ThumbsUp, ThumbsDown, AlertCircle, 
  UploadCloud, FileText, ArrowRight, ShieldCheck, 
  Search, RefreshCw, Award, Scale, Building2, 
  SlidersHorizontal, ChevronDown, Check, Eye, Folder, Cloud, HardDrive,
  Plus, MessageSquarePlus, Activity, Paperclip, Presentation
} from 'lucide-react';
import RadarChart from './RadarChart';
import SharedWorkspaceDrawer from './SharedWorkspaceDrawer';
import { ALL_PROJECT_DELIVERABLES } from './RightWorkspacePanel';
import OperationFlywheelModal from './OperationFlywheelModal';
import ChatComposer from './ChatComposer';
import AiMascot from './AiMascot';
import ReActProcessView from './ReActProcessView';
import DeepCallConfirmModal from './DeepCallConfirmModal';
import DeepCallExecutionModal from './DeepCallExecutionModal';
import AtomicCallCard from './AtomicCallCard';
import DeepCallConfigCard from './DeepCallConfigCard';
import DeepCallResultCard from './DeepCallResultCard';
import { ProjectSpace, ChatMessage, CoachSession, ReActProcess, DataFlowLog, AssociatedFileItem } from '../types';
import { mockSessionHistories } from '../data/mockSessionMessages';

const DEFAULT_WORKSPACE_FILES: AssociatedFileItem[] = [
  {
    id: 'f1',
    name: 'BP_商业计划书_v2.4_智耘农业.pdf',
    type: 'bp',
    typeLabel: '商业计划书 (BP)',
    size: '14.8 MB',
    updateTime: '2026-03-28 14:20'
  },
  {
    id: 'f2',
    name: '路演汇报Deck_金奖标准_v3.pptx',
    type: 'ppt',
    typeLabel: '路演汇报幻灯片 (Deck)',
    size: '28.4 MB',
    updateTime: '2026-03-29 09:15'
  },
  {
    id: 'f3',
    name: '建瓯与吉安茶园盲测挽损公章台账.xlsx',
    type: 'attachment',
    typeLabel: '财务测算与佐证材料',
    size: '3.2 MB',
    updateTime: '2026-03-27 18:40'
  },
  {
    id: 'f4',
    name: '1分钟极速路演开场白与防守预案.docx',
    type: 'attachment',
    typeLabel: '答辩提纲与预案',
    size: '1.1 MB',
    updateTime: '2026-03-29 11:30'
  }
];
import { 
  mockUniversities, 
  mockScenarioCards, 
  mockStages, 
  mockTrackComparisons, 
  mockJudgePersonas, 
  mockDefenseScript, 
  mockGoldCases, 
  mockCompetitorList, 
  mockJudgeQuestionsMap,
  UniversityOption, 
  JudgePersonaDef 
} from '../data/mockCoachData';
import { 
  COACH_SKILLS, 
  MCP_CONNECTORS, 
  EXPERT_AGENTS 
} from '../data/mockCoachAgentsAndSkills';

interface SceneAICoachProps {
  onNavigateToScene?: (sceneId: string) => void;
  activeSpace: ProjectSpace | null;
  activeSpaceId?: string;
  spaces?: ProjectSpace[];
  standaloneSessions?: CoachSession[];
  onSelectSpace?: (spaceId: string) => void;
  onCreateSpace?: (newSpace: { name: string; trackTag: string; school: string; leader: string }) => void;
  activeSessionId: string;
  onSelectSession?: (spaceId: string, sessionId: string) => void;
  onCreateSession?: (spaceId: string) => void;
  onSyncWorkspace?: (spaceId: string) => void;
  onUpdateSessionTitle?: (spaceId: string, sessionId: string, newTitle: string) => void;
  isRightWorkspaceOpen?: boolean;
  onToggleRightWorkspace?: () => void;
  onSetRightWorkspaceOpen?: (open: boolean) => void;
  onOpenFileInRightWorkspace?: (file: AssociatedFileItem) => void;
}

export default function SceneAICoach({ 
  onNavigateToScene, 
  activeSpace, 
  activeSpaceId,
  spaces = [],
  standaloneSessions = [],
  onSelectSpace,
  onCreateSpace,
  activeSessionId, 
  onSelectSession,
  onCreateSession,
  onSyncWorkspace,
  onUpdateSessionTitle,
  isRightWorkspaceOpen,
  onToggleRightWorkspace,
  onSetRightWorkspaceOpen,
  onOpenFileInRightWorkspace
}: SceneAICoachProps) {
  // 1. Core State
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityOption>(mockUniversities[0]); // Default XMU
  const [currentStage, setCurrentStage] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L3');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);

  const handleOpenFileInRightWorkspace = (file: AssociatedFileItem) => {
    if (onOpenFileInRightWorkspace) {
      onOpenFileInRightWorkspace(file);
    } else if (onSetRightWorkspaceOpen) {
      onSetRightWorkspaceOpen(true);
    }
  };

  const [showFlywheelModal, setShowFlywheelModal] = useState<boolean>(false);
  const [bpUploaded, setBpUploaded] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Expert Agent, Skills, MCP states
  const [selectedAgentId, setSelectedAgentId] = useState<'diagnosis' | 'defense' | 'policy' | 'intel' | 'campus'>('policy');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    COACH_SKILLS.filter(s => s.defaultActive).map(s => s.id)
  );
  const [selectedMcpIds, setSelectedMcpIds] = useState<string[]>(
    MCP_CONNECTORS.filter(m => m.defaultActive).map(m => m.id)
  );

  const handleToggleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const handleToggleMcp = (mcpId: string) => {
    setSelectedMcpIds(prev => 
      prev.includes(mcpId) ? prev.filter(id => id !== mcpId) : [...prev, mcpId]
    );
  };

  // Shared Files & @ Mention state
  const [sharedFiles, setSharedFiles] = useState<AssociatedFileItem[]>(DEFAULT_WORKSPACE_FILES);
  const [mentionedFiles, setMentionedFiles] = useState<AssociatedFileItem[]>([]);

  const handleToggleMentionFile = (file: AssociatedFileItem) => {
    setMentionedFiles(prev => {
      const exists = prev.some(f => f.id === file.id);
      if (exists) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleAddMentionFile = (file: AssociatedFileItem) => {
    setMentionedFiles(prev => {
      if (prev.some(f => f.id === file.id)) return prev;
      return [...prev, file];
    });
  };

  const handleRemoveMentionFile = (fileId: string) => {
    setMentionedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDeleteSharedFile = (fileId: string) => {
    setSharedFiles(prev => prev.filter(f => f.id !== fileId));
    setMentionedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Active Session from props
  const currentSession = (activeSpace && activeSpaceId !== 'none')
    ? (activeSpace.sessions.find(s => s.id === activeSessionId) || activeSpace.sessions[0])
    : (standaloneSessions.find(s => s.id === activeSessionId) || standaloneSessions[0]);

  // Engine invocation counters
  const [engineCallCounts, setEngineCallCounts] = useState({
    policy: 2,
    diagnosis: 1,
    mockqa: 1,
    industry: 1,
    campus: 1,
  });

  // Action Items in Right Panel
  const [actionItems, setActionItems] = useState([
    { id: 'act-1', title: '重构商业模式：由散户收费转型为“合作社托管+农险分成”', category: '商业模式', sourceEngine: '4.2 诊断引擎', completed: true },
    { id: 'act-2', title: '修正财务预测一致性：首期装配产能 30 套与营收匹配', category: '财务数据', sourceEngine: '4.2 诊断引擎', completed: false },
    { id: 'act-3', title: '答辩前 10 秒抛出建瓯、吉安两季 1.8 万亩增收盲测台账', category: '答辩策略', sourceEngine: '4.3 答辩引擎', completed: false },
    { id: 'act-4', title: '对接厦大信息学院张林教授团队低空多光谱算子', category: '校本资源', sourceEngine: '4.1.4 校内智库', completed: true },
  ]);

  // Defense Interactive State
  const [selectedJudge, setSelectedJudge] = useState<JudgePersonaDef>(mockJudgePersonas[0]);
  const [defenseStep, setDefenseStep] = useState<'not_started' | 'q1_grill' | 'q1_answered' | 'q2_grill' | 'q2_answered' | 'completed'>('not_started');
  const [defenseScores, setDefenseScores] = useState<{ q1?: number; q2?: number }>({});

  // 6-Dimension Radar Data
  const radarData = [
    { label: '创新性', value: 7.5, benchmark: 9.2 },
    { label: '技术可行性', value: 8.0, benchmark: 9.0 },
    { label: '市场与商业价值', value: 5.5, benchmark: 8.8 }, // Noticeably low as required
    { label: '团队匹配度', value: 7.0, benchmark: 8.9 },
    { label: '表达与完整性', value: 6.5, benchmark: 8.7 },
    { label: '社会价值', value: 8.5, benchmark: 9.4 },
  ];

  // -------------------------------------------------------------
  // 4.1 ↔ 4.2 / 4.3 智能引擎深度调用状态
  // -------------------------------------------------------------
  const [showDeepConfirmModal, setShowDeepConfirmModal] = useState<boolean>(false);
  const [showDeepExecutionModal, setShowDeepExecutionModal] = useState<boolean>(false);
  const [deepCallTarget, setDeepCallTarget] = useState<'4.2' | '4.3'>('4.2');
  const [deepCallActionName, setDeepCallActionName] = useState<string>('4.2 全链路智能指导与商业模式深度体检');
  const [currentInputPayload, setCurrentInputPayload] = useState<any>(null);
  const [autoPromptHint, setAutoPromptHint] = useState<string | null>(null);

  // Initial Data Flow Logs (Traceable history between 4.1 and 4.2/4.3 engines)
  const [dataFlowLogs, setDataFlowLogs] = useState<DataFlowLog[]>([
    {
      id: 'log-seed-42-01',
      time: '10:15:22',
      callType: 'deep',
      source: '4.1 智能问答',
      target: '4.2 全链路智能指导',
      actionName: '4.2 完整商业计划书与全链路诊断',
      status: 'success',
      inputPayload: {
        protocolVersion: 'v2.1-RPC',
        projectId: activeSpace?.id || 'proj-smart-agri-01',
        projectName: activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统',
        trackTag: activeSpace?.trackTag || '新农科组',
        university: selectedUniversity.name,
        materials: [
          { name: 'BP_商业计划书_v2.4_智耘农业.pdf', type: 'PDF', size: '14.8MB', checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb924' },
          { name: '路演汇报Deck_金奖标准_v3.pptx', type: 'PPTX', size: '28.4MB', checksum: 'sha256:8f4b2390ab1289cfb091823901bc09' }
        ],
        config: {
          focusDimension: '商业模式与落地闭环',
          reviewDepth: 'extreme',
          benchmarkCohort: '近三年全国金奖项目库 (Top 1%)',
          enableChapterAnnotation: true
        }
      },
      outputResponse: {
        status: 200,
        engineVersion: '4.2-Diagnosis-Engine-Pro',
        totalScore: 71.5,
        goldBenchmarkGap: '-32% 商业模式闭环成熟度差距',
        radarDimensions: [
          { label: '创新性', score: 7.5, benchmark: 9.2 },
          { label: '技术可行性', score: 8.0, benchmark: 9.0 },
          { label: '市场与商业价值', score: 5.5, benchmark: 8.8 },
          { label: '团队匹配度', score: 7.0, benchmark: 8.9 },
          { label: '表达与完整性', score: 6.5, benchmark: 8.7 },
          { label: '社会价值', score: 8.5, benchmark: 9.4 }
        ],
        criticalFlaws: [
          { chapter: '第三章 · 市场与商业模式', flaw: '假设向单体散户收费，散户付费意愿极低，缺少合作社分成兜底机制' },
          { chapter: '第四章 · 财务预测与产能规划', flaw: '首期生产线年产仅30套，但预测覆盖120个主体，产能营收前后矛盾' }
        ],
        actionItems: [
          '重构商业模式：由散户收费转型为“合作社托管+农险分成”',
          '修正财务预测一致性：首期装配产能 30 套与营收匹配'
        ]
      }
    },
    {
      id: 'log-seed-43-02',
      time: '09:30:10',
      callType: 'shallow',
      source: '4.1 智能问答',
      target: '4.3 模拟评审与答辩训练',
      actionName: '4.3 原子能力：评委尖锐质询生成器 (出5道答辩题)',
      status: 'success',
      inputPayload: {
        protocolVersion: 'v2.1-ATOMIC-MCP',
        atomicCapability: 'sk-defense-grill',
        projectId: activeSpace?.id || 'proj-smart-agri-01',
        params: {
          questionCount: 5,
          targetAspects: ['商业壁垒', '大厂竞争', '下沉市场账期', '数据飞轮'],
          judgeStyle: '国赛资深创投评委 + 农业技术专家'
        }
      },
      outputResponse: {
        status: 200,
        atomicSkill: 'sk-defense-grill',
        generatedCount: 5,
        latencyMs: 480,
        questions: [
          {
            qId: 1,
            category: '商业壁垒',
            question: '如果大疆或极飞在飞控固件中免费集成相似算法，你们的核心壁垒在哪里？',
            difficulty: '极高',
            defenseTip: '强调南方茶树专有病理数据集与物理光学机理，非通用视觉可替代。'
          }
        ]
      }
    }
  ]);

  // Live ReAct simulation state for real-time progress simulation
  interface LiveReActState {
    active: boolean;
    process: ReActProcess;
    currentPhase: 'reasoning' | 'plan' | 'act' | 'completed';
  }
  const [liveReAct, setLiveReAct] = useState<LiveReActState | null>(null);
  const liveTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearLiveTimers = () => {
    liveTimersRef.current.forEach(t => clearTimeout(t));
    liveTimersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearLiveTimers();
    };
  }, []);

  // Session History State (Each session has its own distinct dialogue record)
  const [sessionHistoryMap, setSessionHistoryMap] = useState<Record<string, ChatMessage[]>>(mockSessionHistories);
  const currentLoadedSessionIdRef = useRef<string>(activeSessionId);

  // Chat message stream for the active session
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return mockSessionHistories[activeSessionId] || [];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Switch session messages when activeSessionId or activeSpace changes
  useEffect(() => {
    if (!activeSessionId) return;
    currentLoadedSessionIdRef.current = activeSessionId;
    clearLiveTimers();
    setLiveReAct(null);
    setIsThinking(false);

    if (sessionHistoryMap[activeSessionId] && sessionHistoryMap[activeSessionId].length > 0) {
      setMessages(sessionHistoryMap[activeSessionId]);
    } else if (mockSessionHistories[activeSessionId] && mockSessionHistories[activeSessionId].length > 0) {
      const hist = mockSessionHistories[activeSessionId];
      setMessages(hist);
      setSessionHistoryMap(prev => ({ ...prev, [activeSessionId]: hist }));
    }

    // 根据当前会话的 taskKey 或标题，自适应匹配当前子智能体专家 (主智能体技能与连接器由用户自主独立配置，不再强制关联)
    const tKey = currentSession?.taskKey || '';
    const tTitle = currentSession?.title || '';

    if (tKey === 'task-1' || tTitle.includes('政策') || tTitle.includes('规则')) {
      setSelectedAgentId('policy');
    } else if (tKey === 'task-deep-42' || tKey === 'task-shallow-42' || tKey === 'task-2-1' || tTitle.includes('4.2') || tTitle.includes('BP') || tTitle.includes('体检') || tTitle.includes('前三页')) {
      setSelectedAgentId('diagnosis');
    } else if (tKey === 'task-2-2' || tTitle.includes('创新点') || tTitle.includes('壁垒') || tTitle.includes('护城河')) {
      setSelectedAgentId('diagnosis');
    } else if (tKey === 'task-deep-43' || tKey === 'task-shallow-43' || tKey === 'task-2-3' || tTitle.includes('4.3') || tTitle.includes('答辩') || tTitle.includes('开场白') || tTitle.includes('质询')) {
      setSelectedAgentId('defense');
    } else if (tKey === 'task-3-1' || tTitle.includes('标杆') || tTitle.includes('金奖共性')) {
      setSelectedAgentId('intel');
    } else if (tKey === 'task-3-2' || tTitle.includes('竞品') || tTitle.includes('痛点')) {
      setSelectedAgentId('intel');
    } else if (tKey === 'task-4' || tTitle.includes('校内') || tTitle.includes('校本') || tTitle.includes('智库') || tTitle.includes('报销')) {
      setSelectedAgentId('campus');
    }

    if (!sessionHistoryMap[activeSessionId]?.length && !mockSessionHistories[activeSessionId]?.length) {
      // New or unseeded session: initialize with bespoke greeting for this space
      const isNoSpace = activeSpaceId === 'none' || !activeSpace;
      const spaceName = isNoSpace ? '' : activeSpace.name;
      const sessTitle = currentSession?.title || '新备赛咨询会话';
      const defaultNewSessionMsgs: ChatMessage[] = [
        {
          id: `intro-${activeSessionId}`,
          sender: 'coach',
          type: 'intro_scenarios',
          text: isNoSpace
            ? `同学你好！我是你的 AI 备赛教练，当前会话为独立咨询模式（无工作空间）。\n\n赛事政策库与双创知识库已就绪，你可以随时向我提问或点击下方卡片开启深度辅导，也可以在输入框随时挂载项目工作空间！`
            : `同学你好！已为你开启「${spaceName}」的会话：**${sessTitle}**。\n\n我是你的 AI 备赛教练，当前工作空间（${activeSpace?.workspace?.localPath || '本地与云端'}）与赛事知识库已就绪，随时向我提问或点击下方卡片开启深度辅导！`,
          timestamp: '刚刚',
          data: {
            scenarios: mockScenarioCards
          }
        },
        {
          id: `stage-ask-${activeSessionId}`,
          sender: 'coach',
          type: 'stage_prompt',
          text: isNoSpace
            ? `在开始前，请选择你当前关注或准备推进的备赛阶段：`
            : `在开始前，请确认你的项目「${spaceName}」当前所处的备赛阶段：`,
          timestamp: '刚刚',
          data: {
            stages: mockStages,
            currentStage: currentStage
          }
        }
      ];
      setMessages(defaultNewSessionMsgs);
      setSessionHistoryMap(prev => ({
        ...prev,
        [activeSessionId]: defaultNewSessionMsgs
      }));
    }
  }, [activeSessionId, activeSpace?.id, activeSpaceId]);

  // Keep session history synchronized whenever messages change in the active session
  useEffect(() => {
    if (currentLoadedSessionIdRef.current === activeSessionId && messages.length > 0) {
      setSessionHistoryMap(prev => {
        if (prev[activeSessionId] === messages) return prev;
        return {
          ...prev,
          [activeSessionId]: messages
        };
      });
    }
  }, [messages, activeSessionId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle stage selection
  const handleSelectStage = (stageId: 'L1' | 'L2' | 'L3' | 'L4') => {
    setCurrentStage(stageId);
    const targetStage = mockStages.find(s => s.id === stageId)!;
    
    // Append student choice and coach acknowledgment
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'student',
      type: 'text',
      text: `我们团队目前处于「${targetStage.title}」`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const coachReply: ChatMessage = {
      id: `coach-${Date.now() + 1}`,
      sender: 'coach',
      type: 'text',
      text: `已为你锁定「${targetStage.title}」！当前核心目标：**${targetStage.focus}**。\n\n接下来，你可以点击下方的**建议问题胶囊**，或者直接向我提问（如查询赛道、诊断 BP、模拟答辩等）。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, coachReply]);
  };

  // Core ReAct live stream simulator engine
  const executeReActWorkflow = (
    reactProcess: ReActProcess,
    finalMessagePayload: ChatMessage,
    onFinish?: () => void
  ) => {
    clearLiveTimers();
    setIsThinking(true);

    const steps = reactProcess.steps;
    const step1 = steps.length > 0 ? steps[0] : null;
    const step2 = steps.length > 1 ? steps[1] : null;
    const step3 = steps.length > 2 ? steps[2] : null;

    // Stage 1: Reasoning (0ms)
    setLiveReAct({
      active: true,
      process: {
        ...reactProcess,
        steps: step1 ? [step1] : []
      },
      currentPhase: 'reasoning'
    });

    // Stage 2: Plan (650ms)
    const t1 = setTimeout(() => {
      if (step2) {
        setLiveReAct(prev => prev ? ({
          ...prev,
          process: {
            ...reactProcess,
            steps: steps.slice(0, 2)
          },
          currentPhase: 'plan'
        }) : null);
      }
    }, 650);
    liveTimersRef.current.push(t1);

    // Stage 3: Act (1300ms)
    const t2 = setTimeout(() => {
      if (step3) {
        setLiveReAct(prev => prev ? ({
          ...prev,
          process: {
            ...reactProcess,
            steps: steps.slice(0, Math.min(steps.length, 3))
          },
          currentPhase: 'act'
        }) : null);
      }
    }, 1300);
    liveTimersRef.current.push(t2);

    // Stage 4: Finish (2000ms)
    const t3 = setTimeout(() => {
      setLiveReAct(null);
      setIsThinking(false);
      const completeMsg: ChatMessage = {
        ...finalMessagePayload,
        reactProcess: reactProcess,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, completeMsg]);
      if (onFinish) onFinish();
    }, 2000);
    liveTimersRef.current.push(t3);
  };

  // -------------------------------------------------------------
  // 4.1 ↔ 4.2 / 4.3 跨模块深度调用与浅度调用交互逻辑
  // -------------------------------------------------------------
  
  // 1. 启动深度调用意图确认与配置装配流（直接在会话流内执行 ReAct 意图识别并渲染配置卡片）
  const handleStartDeepCall = (target: '4.2' | '4.3', initialPrompt?: string) => {
    setDeepCallTarget(target);
    setDeepCallActionName(
      target === '4.2' 
        ? '4.2 全链路智能指导与商业计划书深度体检' 
        : '4.3 模拟评审与多考官极限压力答辩训练'
    );
    setShowDeepConfirmModal(false);

    const is42 = target === '4.2';
    const targetTitle = is42 ? '4.2 全链路智能指导' : '4.3 模拟评审与答辩训练';
    const projName = activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统';

    const deepCallProcess: ReActProcess = {
      duration: '1.6s',
      summary: is42 
        ? '已识别商业计划书全链路深度体检意图，正在装配工作空间物料与配置'
        : '已识别全流程模拟答辩与多考官极限压力意图，正在装配工作空间物料与配置',
      steps: [
        {
          id: `dc-s1-${Date.now()}`,
          type: 'reasoning',
          title: '意图识别与跨模块路由',
          subtitle: '480ms',
          content: is42
            ? `识别到针对「${projName}」的 4.2 全链路商业计划书深度体检指令。自动装配工作空间 38 页 BP 与路演 PPT 资产，准备发起跨模块 RPC 管道调用。`
            : `识别到针对「${projName}」的 4.3 全流程模拟答辩与多考官极限压力训练指令。自动装配工作空间 BP、Deck 与盲测公章数据，准备调度多考官矩阵发起答辩演练。`
        },
        {
          id: `dc-s2-${Date.now()}`,
          type: 'plan',
          title: '装配工作空间物料与配置',
          tasks: [
            { id: 't1', text: `打包工作空间核心物料（BP、PPT、财务测算表、盲测公章台账）` },
            { id: 't2', text: is42 ? '装配六维打分雷达与国赛金奖标杆库基准线' : '装配考官人设矩阵（投资人/学者/评委长）与高压质询题库' },
            { id: 't3', text: `生成 ${targetTitle} 意图识别与配置确认卡片` }
          ]
        },
        {
          id: `dc-s3-${Date.now()}`,
          type: 'act',
          title: `调用 ${targetTitle} 意图校验网关`,
          command: {
            lang: 'mcp',
            cmd: `mcp://${is42 ? 'guidance-engine' : 'defense-engine'}/intent-check?project=${encodeURIComponent(projName)}&mode=deep_pipeline`
          },
          content: `意图校验通过，工作空间物料与配置参数已就绪，等待用户确认执行。`
        }
      ]
    };

    const configMsgPayload: ChatMessage = {
      id: `coach-cfg-${Date.now()}`,
      sender: 'coach',
      type: 'deep_call_config_collection',
      text: is42
        ? `已识别你的【4.2 全链路智能指导与商业计划书深度体检】调用意图！\n\n4.1 正在为你打包当前工作空间 38 页 BP 与路演 PPT 资产。请在下方卡片核对本次调用的项目物料、诊断重点维度与基准库设置。**核对无误后，点击卡片中的「确认配置并立即调用 4.2 执行」即可启动 2 秒模拟调用：**`
        : `已识别你的【4.3 模拟评审与多考官极限压力答辩】深度调用意图！\n\n4.1 正在为你打包当前工作空间物料资产与考官配置。请在下方卡片核对本次调用的项目物料、考官矩阵与基准库设置。**核对无误后，点击卡片中的「确认配置并立即调用 4.3 执行」即可启动 2 秒模拟调用：**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engineAttribution: is42 ? '4.2 全链路智能指导专家引擎 · 意图确认' : '4.3 模拟评审与答辩训练引擎 · 意图确认',
      data: {
        target: target,
        projectName: projName,
        trackTag: activeSpace?.trackTag || '新农科组',
        university: selectedUniversity.name,
        materials: [
          { id: 'm1', name: 'BP_商业计划书_v2.4_智耘农业.pdf', type: 'PDF', size: '14.8MB', selected: true },
          { id: 'm2', name: '路演汇报Deck_金奖标准_v3.pptx', type: 'PPTX', size: '28.4MB', selected: true },
          { id: 'm3', name: '建瓯与吉安茶园盲测挽损公章台账.xlsx', type: 'XLSX', size: '3.2MB', selected: true }
        ],
        focusDimensions: is42 
          ? ['商业模式与合作社分成闭环', '财务预测与产能匹配度', 'PPT 前三页视觉焦点']
          : ['商业壁垒与大厂防守', '下沉市场现金流账期', '技术专属数据集验证'],
        benchmarkCohort: '近三年全国国赛金奖标杆库 (Top 1%)'
      }
    };

    executeReActWorkflow(deepCallProcess, configMsgPayload, () => {
      // 预填输入框指令，方便用户一键发送或回车推进
      const autoPrompt = `已确认上述配置参数，请立即打包物料并调用 ${targetTitle} 引擎执行完整流程`;
      setInputValue(autoPrompt);
      setAutoPromptHint(`已为你填入下一步推进指令，点击「发送」或卡片上的「确认并执行」按钮即可触发 2 秒深度调用`);
    });
  };

  // 2. 兼容弹窗确认回调（如果有弹窗调用触发）
  const handleConfirmDeepCallModal = () => {
    setShowDeepConfirmModal(false);
    handleStartDeepCall(deepCallTarget);
  };

  // 3. 执行深度调用（触发 2.0 秒真实管道进度模拟弹窗）
  const handleExecuteDeepCall = (configPayload?: any) => {
    const is42 = deepCallTarget === '4.2';
    const projName = activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统';

    const inputPayload = {
      protocolVersion: 'v2.1-RPC-PIPELINE',
      timestamp: new Date().toISOString(),
      sourceModule: '4.1 智能问答',
      targetModule: is42 ? '4.2 全链路智能指导' : '4.3 模拟评审与答辩训练',
      actionName: is42 ? '4.2 完整商业计划书与全链路诊断' : '4.3 多考官矩阵模拟答辩复盘',
      projectId: activeSpace?.id || 'proj-smart-agri-01',
      projectName: projName,
      trackTag: activeSpace?.trackTag || '新农科组',
      university: selectedUniversity.name,
      materials: configPayload?.materials || [
        { name: 'BP_商业计划书_v2.4_智耘农业.pdf', size: '14.8 MB', checksum: 'sha256:e3b0c44298fc' },
        { name: '路演汇报Deck_金奖标准_v3.pptx', size: '28.4 MB', checksum: 'sha256:8f4b2390ab12' }
      ],
      config: {
        focusDimension: configPayload?.selectedFocus || (is42 ? '商业模式与落地闭环' : '严苛投资人·深度压力测试'),
        reviewDepth: configPayload?.reviewDepth || 'extreme',
        benchmarkCohort: '近三年全国国赛金奖标杆库 (Top 1%)',
        simulationTimeoutMs: 2000
      }
    };

    setCurrentInputPayload(inputPayload);
    setShowDeepExecutionModal(true);
    setAutoPromptHint(null);
  };

  // 4. 深度调用 2 秒完成后的回调：生成返回数据、记录数据流日志、渲染结果卡片、准备下一步交互
  const handleDeepExecutionComplete = () => {
    setShowDeepExecutionModal(false);
    setIsThinking(false);

    const is42 = deepCallTarget === '4.2';
    const projName = activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统';

    const outputResponse = is42 ? {
      status: 200,
      engineVersion: '4.2-Diagnosis-Engine-Pro',
      duration: '2.0s (RPC-Complete)',
      overallScore: 86.8,
      goldBenchmarkGap: '-2.4% 冲刺金奖区间',
      radar: [
        { label: '教育维度', value: 88, max: 100 },
        { label: '创新维度', value: 92, max: 100 },
        { label: '团队维度', value: 85, max: 100 },
        { label: '商业维度', value: 74, max: 100 },
        { label: '社会价值', value: 94, max: 100 },
        { label: '答辩表现', value: 86, max: 100 }
      ],
      criticalFlaws: [
        { 
          chapter: '第四章 · 商业模式', 
          flaw: '散户直接收费存在阻力，需补充与安溪铁观音合作社的“集中托管分成协议”与农险定损公章支撑' 
        },
        { 
          chapter: '第五章 · 财务测算', 
          flaw: '三年现金流中预留 6 个月安全垫，需与首期 30 套产能回款节奏保持一致' 
        }
      ],
      actionItems: [
        '重构商业模式：由散户收费转型为“合作社托管+农险分成”',
        '在商业计划书附录补充与 3 家国家级示范合作社的预签约意向函',
        '将 PPT 第 4 页商业闭环图更新为“农户-合作社-险企”三元流动拓扑图'
      ],
      nextPrompt: `帮我根据 4.2 诊断意见，重写 BP 商业计划书第四章商业模式与合作社分成方案`
    } : {
      status: 200,
      engineVersion: '4.3-Defense-Engine-Pro',
      duration: '2.0s (RPC-Complete)',
      overallScore: 88.5,
      goldBenchmarkGap: '已达国赛金奖答辩标准 (前 2%)',
      radar: [
        { label: '表达流畅度', value: 92, max: 100 },
        { label: '逻辑严密性', value: 85, max: 100 },
        { label: '数据支撑度', value: 88, max: 100 },
        { label: '抗压应对力', value: 86, max: 100 },
        { label: '答辩时长控', value: 90, max: 100 },
        { label: '评委认同度', value: 89, max: 100 }
      ],
      criticalFlaws: [
        { 
          chapter: '第 1 题 · 商业壁垒质询', 
          flaw: '面对大厂免费算法提问时，回答前 10 秒过于纠结通用技术参数，应直接抛出 20 万张专有病理数据集与农户真实台账' 
        },
        { 
          chapter: '第 3 题 · 财务产能质询', 
          flaw: '未明确轻资产代工策略与软件订阅收入占比，易让评委误判为重资产制造企业' 
        }
      ],
      actionItems: [
        '演练 30 秒黄金应对法：先给数据结论，再拆解护城河机理',
        '答辩前 10 秒抛出建瓯、吉安两季 1.8 万亩增收盲测台账',
        '在 PPT 附录准备供应链代工协议与生产线资质证明备查'
      ],
      nextPrompt: `帮我针对 4.3 评委提出的第 1 题，生成 30 秒黄金应对结构化话术`
    };

    // 记录数据流日志
    const newLog: DataFlowLog = {
      id: `flow-log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      callType: 'deep',
      source: '4.1 智能问答',
      target: is42 ? '4.2 全链路智能指导' : '4.3 模拟评审与答辩训练',
      actionName: is42 ? '4.2 完整商业计划书与全链路诊断' : '4.3 多考官矩阵模拟答辩复盘',
      status: 'success',
      inputPayload: currentInputPayload || { projectName: projName, targetModule: deepCallTarget },
      outputResponse: outputResponse
    };

    setDataFlowLogs(prev => [newLog, ...prev]);

    // 在 4.1 会话中追加结果卡片
    const resultMsg: ChatMessage = {
      id: `coach-result-${Date.now()}`,
      sender: 'coach',
      type: 'deep_call_result',
      text: is42
        ? `【4.2 全链路智能指导】执行完毕！已将诊断分析报告回传至 4.1 会话。\n\n项目当前综合评分为 **86.8 分**，已逼近国赛金奖基准线。系统已为你定位 **2 项核心改进点** 与 **3 项待办落地清单**：`
        : `【4.3 模拟评审与答辩训练】执行完毕！已将考官复盘报告回传至 4.1 会话。\n\n答辩演练总评 **88.5 分**（达金奖前 2% 水平）。考官指出在“大厂壁垒质询”与“财务产能矛盾”两题需强化黄金 30 秒数据定调。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engineAttribution: is42 ? '4.2 全链路智能指导专家引擎' : '4.3 模拟评审与答辩训练引擎',
      data: {
        ...outputResponse,
        target: deepCallTarget,
        flowLogId: newLog.id
      }
    };

    setMessages(prev => [...prev, resultMsg]);

    // 自动为用户填入下一步推荐提问
    setInputValue(outputResponse.nextPrompt);
    setAutoPromptHint(`已为你准备好下一步落地提问，点击「发送」或回车即可继续多轮推进`);

    // 同步更新右侧待办项
    if (is42) {
      setEngineCallCounts(prev => ({ ...prev, diagnosis: prev.diagnosis + 1 }));
    } else {
      setEngineCallCounts(prev => ({ ...prev, mockqa: prev.mockqa + 1 }));
    }
  };

  // 5. 取消深度调用
  const handleCancelDeepCall = () => {
    setShowDeepConfirmModal(false);
    setShowDeepExecutionModal(false);
    setIsThinking(false);

    const cancelMsg: ChatMessage = {
      id: `sys-cancel-${Date.now()}`,
      sender: 'system',
      type: 'text',
      text: `已终止深度调用流程，会话已恢复为普通智能问答模式。随时可以重新发起深度调用。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, cancelMsg]);
    setInputValue('');
    setAutoPromptHint(null);
  };

  // 6. 浅度调用（原子能力调用，直接在 4.1 内呈现）
  const handleStartShallowCall = (type: 'questions' | 'chapter' | 'moat') => {
    const projName = activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统';
    
    let atomicType = 'questions_43';
    let targetEngine: '4.2' | '4.3' = '4.3';
    let capabilityName = '评委尖锐质询题生成器 (5题)';
    let reactTitle = '调用 4.3 答辩质询原子能力';
    let cardData: any = {};
    let inputPayload: any = {};
    let outputResponse: any = {};

    if (type === 'questions') {
      const selectJudgeMsg: ChatMessage = {
        id: `coach-judge-select-${Date.now()}`,
        sender: 'coach',
        type: 'judge_selector',
        text: `【4.3 模拟评审与答辩训练 · 浅度原子调用】\n已接入 4.3 题库引擎！针对《${projName}》，请在下方选择为你出题的评委考官人设。\n**选定考官后，系统将即刻在单次回复中为你生成该考官专属的 5 道尖锐质询题：**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engineAttribution: '4.3 模拟评审与答辩训练 (考官矩阵选择器)',
        data: {
          judges: mockJudgePersonas
        }
      };

      setMessages(prev => [...prev, selectJudgeMsg]);
      return;
    } else if (type === 'chapter') {
      atomicType = 'chapter_42';
      targetEngine = '4.2';
      capabilityName = 'BP 商业模式章节速诊 (sk-bp-diag)';
      reactTitle = '调用 4.2 BP 商业模式速诊器';

      inputPayload = {
        protocolVersion: 'v2.1-ATOMIC-MCP',
        atomicCapability: 'sk-bp-diag',
        targetEngine: '4.2',
        chapterTarget: '第四章 · 商业模式与市场落地',
        projectId: activeSpace?.id || 'proj-smart-agri-01'
      };

      outputResponse = {
        status: 200,
        atomicSkill: 'sk-bp-diag',
        chapterScore: 68.0,
        flaws: [
          '散户直接付费假设不成立（农业下沉市场支付意愿极弱）',
          '缺少村集体合作社统一托管代扣与农险定损分成兜底机制'
        ],
        advice: '将单一散户软件销售升级为“合作社统防统治服务费 + 保险挽损按比例分成”双轨制。'
      };

      cardData = {
        atomicType: 'chapter_42',
        chapterName: '第四章 · 商业模式与市场落地',
        score: 68.0,
        flaws: outputResponse.flaws,
        advice: outputResponse.advice
      };

    } else {
      atomicType = 'moat_42';
      targetEngine = '4.2';
      capabilityName = '技术创新壁垒与评分维度自测 (sk-innovation-moat)';
      reactTitle = '调用 4.2 创新壁垒核查器';

      inputPayload = {
        protocolVersion: 'v2.1-ATOMIC-MCP',
        atomicCapability: 'sk-innovation-moat',
        targetEngine: '4.2',
        projectId: activeSpace?.id || 'proj-smart-agri-01'
      };

      outputResponse = {
        status: 200,
        atomicSkill: 'sk-innovation-moat',
        moatLayers: [
          { name: '专有数据壁垒', level: '极高', detail: '20 万张南方茶树病害多光谱图谱，大厂通用视觉无训练集' },
          { name: '硬件标定壁垒', level: '高', detail: '自研轻量化光谱反射标定板，克服复杂天气反光' },
          { name: '行业公章背书', level: '高', detail: '福建农林大学与建瓯茶协联合盲测增收 18% 鉴定证书' }
        ],
        rubricCheck: '创新维度 92分（达国金线）；商业维度 72分（需重构）；综合推荐申报高教主赛道新农科组。'
      };

      cardData = {
        atomicType: 'moat_42',
        moatLayers: outputResponse.moatLayers,
        rubricCheck: outputResponse.rubricCheck
      };
    }

    // 记录数据流日志
    const newLog: DataFlowLog = {
      id: `flow-log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      callType: 'shallow',
      source: '4.1 智能问答',
      target: targetEngine === '4.2' ? '4.2 全链路智能指导' : '4.3 模拟评审与答辩训练',
      actionName: capabilityName,
      status: 'success',
      inputPayload: inputPayload,
      outputResponse: outputResponse
    };

    setDataFlowLogs(prev => [newLog, ...prev]);

    // 构造 ReAct 过程
    const shallowProcess: ReActProcess = {
      duration: '1.4s',
      summary: `已完成 ${targetEngine} [${capabilityName}] 原子能力调用`,
      steps: [
        {
          id: `sr1-${Date.now()}`,
          type: 'reasoning',
          title: '识别原子能力调用意图',
          subtitle: '380ms',
          content: `识别到针对「${projName}」的原子功能调用诉求。路由至 ${targetEngine} 对应的微服务算子 [${capabilityName}]，无需执行完整重度流程。`
        },
        {
          id: `sr2-${Date.now()}`,
          type: 'plan',
          title: '参数序列化与上下文装配',
          tasks: [
            { id: 't1', text: `提取当前工作空间项目上下文与赛道参数` },
            { id: 't2', text: `向 ${targetEngine} 原子能力微服务发起轻量 RPC 交互` }
          ]
        },
        {
          id: `sr3-${Date.now()}`,
          type: 'act',
          title: reactTitle,
          command: {
            lang: 'mcp',
            cmd: `mcp://${targetEngine === '4.2' ? 'guidance-engine' : 'defense-engine'}/atomic?skill=${encodeURIComponent(atomicType)}`
          },
          content: `原子能力响应成功 (200 OK, 460ms)，数据已流转至 4.1 前端。`
        }
      ]
    };

    const shallowMsgPayload: ChatMessage = {
      id: `coach-atomic-${Date.now()}`,
      sender: 'coach',
      type: 'atomic_call_result',
      text: `已为你浅度调用【${targetEngine === '4.2' ? '4.2 全链路智能指导' : '4.3 模拟评审与答辩训练'}】的原子能力：**${capabilityName}**。\n\n计算耗时 460ms，结果已直接回传并渲染在下方。如需开启全篇章深入排查或多考官全真演练，可点击卡片底部按钮一键升级为深度调用：`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engineAttribution: targetEngine === '4.2' ? '4.2 全链路智能指导 (原子能力)' : '4.3 模拟评审与答辩训练 (原子能力)',
      data: cardData,
      callMeta: {
        callType: 'shallow',
        targetEngine: targetEngine,
        capabilityName: capabilityName,
        duration: '460ms',
        inputPayload: inputPayload,
        outputResponse: outputResponse
      }
    };

    executeReActWorkflow(shallowProcess, shallowMsgPayload);
  };

  // Trigger Tool Invocation & Generate Dynamic Script Responses
  const handleTriggerAction = (actionKey: string, appendUserMsg: boolean = true) => {
    if (isThinking && appendUserMsg) return;

    if (appendUserMsg) {
      let userText = '';
      const projectName = activeSpace?.name || '当前项目';

      switch (actionKey) {
        // 1. 赛事政策与规则
        case 'policy':
        case 'task-policy-track':
          userText = `我的项目是 ${projectName}，能报哪个赛道？高教主赛道与红旅/产业赛道有什么区别，能同时报吗？`;
          break;
        case 'task-policy-rubric':
          userText = `我的项目属于 ${activeSpace?.trackTag || '主赛道'}，评委最看重什么？财务预测与技术壁垒要注意哪几个方面？`;
          break;

        // 2.1 BP与PPT深度诊断
        case 'diagnosis':
        case 'task-bp-diagnosis':
          userText = `帮我检查《${projectName}》商业计划书的市场分析与商业模式逻辑漏洞，并给出前三页PPT抓人眼球的优化建议`;
          break;

        // 2.2 核心创新点与壁垒提炼
        case 'moat':
        case 'task-moat-extract':
          userText = `针对《${projectName}》核心技术，如何避免“技术自嗨”，提炼出打动评委的核心创新点并构建商业壁垒？`;
          break;

        // 2.3 路演答辩与模拟
        case 'mockqa':
        case 'task-defense-grill':
          userText = `针对《${projectName}》的财务测算与落地可行性，评委最可能问哪3个尖锐问题？帮我优化1分钟路演开场白`;
          break;

        // 3.1 标杆金奖案例拆解
        case 'cases':
        case 'task-gold-benchmark':
          userText = `近三年全国创新大赛金奖项目中，与《${projectName}》赛道相关的优秀项目在商业模式与落地闭环上都有哪些共性？`;
          break;

        // 3.2 竞品与市场调研
        case 'competitor':
        case 'task-competitor-intel':
          userText = `帮我系统梳理当前赛道的主要竞品矩阵，并列出 5 个主要痛点及对应的穿透解决措施`;
          break;

        // 4. 校内专属智库
        case 'campus':
        case 'task-campus-kb':
          userText = `调用${selectedUniversity.name}双创专属知识库，查询本校特色扶持政策、校内导师研究方向与经费报销流程`;
          break;

        // 4.1 ↔ 4.2 / 4.3 深度调用与浅度调用任务
        case 'task-deep-42-diag':
          userText = `帮我完整诊断项目，开启 4.2 全链路智能指导与商业计划书深度体检`;
          break;

        case 'task-deep-43-defense':
          userText = `帮我开启全流程模拟答辩，跳转 4.3 模拟评审与多考官极限压力训练`;
          break;

        case 'task-shallow-43-questions':
          userText = `针对我的项目，调用 4.3 评委质询原子能力，出 5 道最可能被问到的尖锐答辩题`;
          break;

        case 'task-shallow-42-chapter':
          userText = `针对商业计划书“市场与商业模式”章节，调用 4.2 诊断原子能力进行速诊并指出硬伤`;
          break;

        case 'task-shallow-42-moat':
          userText = `核查我们项目的核心技术创新壁垒，并对照国赛金奖评分维度进行自测`;
          break;

        case 'flywheel':
          userText = '查看 AI 备赛教练的运营闭环指标与自进化效能';
          break;

        default:
          userText = actionKey;
      }

      // 1. Append User Message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'student',
        type: 'text',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMsg]);
    }

    // 针对深度与浅度调用的特殊拦截分发
    if (actionKey === 'task-deep-42-diag') {
      handleStartDeepCall('4.2', '帮我完整诊断项目，开启 4.2 全链路智能指导与商业计划书深度体检');
      return;
    }
    if (actionKey === 'task-deep-43-defense') {
      handleStartDeepCall('4.3', '帮我开启全流程模拟答辩，跳转 4.3 模拟评审与多考官极限压力训练');
      return;
    }
    if (actionKey === 'task-shallow-43-questions') {
      handleStartShallowCall('questions');
      return;
    }
    if (actionKey === 'task-shallow-42-chapter') {
      handleStartShallowCall('chapter');
      return;
    }
    if (actionKey === 'task-shallow-42-moat') {
      handleStartShallowCall('moat');
      return;
    }

    setIsThinking(true);

    // 2. Dispatch specific action response with realistic latency & tool calling state
    const projectName = activeSpace?.name || '智耘农业';

    // 1. 赛事政策与规则
    if (actionKey === 'policy' || actionKey === 'task-policy-track' || actionKey === 'task-policy-rubric') {
      const policyProcess: ReActProcess = {
        duration: '1.9s',
        summary: '已完成赛道申报规则对比与合规红线推演',
        steps: [
          {
            id: `p1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '890ms',
            content: `研判「${projectName}」项目申报策略。高教主赛道与红旅赛道排他不可兼报。主赛道侧重自主研发核心算法与技术新颖度，红旅赛道侧重合作社台账与真实挽损实效。`
          },
          {
            id: `p2-${Date.now()}`,
            type: 'plan',
            title: '赛道准入与打分要素计划',
            tasks: [
              { id: 't1', text: '检索全国大赛评审规则第十二条兼报排他性条款' },
              { id: 't2', text: '对标高教主赛道与红旅赛道打分权重与基准线' }
            ]
          },
          {
            id: `p3-${Date.now()}`,
            type: 'act',
            title: '调用 4.1 赛事政策与规则库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://official-rules/query?track=main_vs_red_journey'
            },
            content: '已完成主赛道与红旅赛道 6 维打分权重对比及申报红线校验。'
          }
        ]
      };

      const policyMsgPayload: ChatMessage = {
        id: `coach-policy-${Date.now()}`,
        sender: 'coach',
        type: 'policy_answer',
        text: `针对「${projectName}」，根据全国大赛组委会最新评审规定：\n\n1. **高教主赛道 - 新农科/新工科组（推荐首选）**：适合突出你的**算法新颖度、自主专利与硬核技术壁垒**；\n2. **青年红色筑梦之旅赛道 - 乡村振兴组**：适合突出你在**基层扎根服务实效、挽损增收台账与带动就业**。\n\n⚠️ **重要规则提醒**：同一项目在同一个竞赛年度**严禁跨赛道重复申报**，必须二选一。以下是赛道的深度维度对比：`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: '依据《中国国际大学生创新大赛（2025/2026）评审规则》第三章第十二条及专项申报指引',
        data: {
          comparisons: mockTrackComparisons
        }
      };

      executeReActWorkflow(policyProcess, policyMsgPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, policy: prev.policy + 1 }));
      });

    // 2.1 BP与PPT深度诊断
    } else if (actionKey === 'diagnosis' || actionKey === 'task-bp-diagnosis') {
      const diagProcess: ReActProcess = {
        duration: '2.4s',
        summary: '已完成商业计划书 6 维穿透与 PPT 视觉重构',
        steps: [
          {
            id: `d1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '1.1s',
            content: `审阅《${projectName}》商业计划书市场篇。散户付费意愿极低，直接向农户收取年费是严重逻辑硬伤，需重构为“合作社托管 + 农险分成”。PPT 前三页需去掉密集文字，突出实拍与核心挽损增收公章背书。`
          },
          {
            id: `d2-${Date.now()}`,
            type: 'plan',
            title: '制定诊断与重构计划',
            tasks: [
              { id: 't1', text: '运行 6 维多因子雷达模型测算国金基准线差距' },
              { id: 't2', text: '识别商业模式中“付费主体与现金流”断层' },
              { id: 't3', text: '重构路演 PPT 前三页视觉焦点与背书链条' }
            ]
          },
          {
            id: `d3-${Date.now()}`,
            type: 'act',
            title: '运行商业计划书语义穿透体检',
            command: {
              lang: 'mcp',
              cmd: `mcp://bp-diagnostics/scan?project=${encodeURIComponent(projectName)}&radar=6dim`
            },
            content: '输出综合评分与雷达短板：市场与商业价值为核心扣分项，生成针对性重构建议。'
          }
        ]
      };

      const diagCardPayload: ChatMessage = {
        id: `diag-report-${Date.now()}`,
        sender: 'coach',
        type: 'bp_diagnosis',
        text: `已为你完成《${projectName}》商业计划书（初稿 V2.4）的全维度穿透式诊断。当前项目综合评分 **7.1 分**（处于 L3 成型期待加固阶段）。\n\n关键诊断发现：**技术与社会价值得分突出，但「市场与商业价值」明显偏低（仅 5.5 分），存在商业逻辑闭环脆弱与散户付费伪假设等重大扣分点**。\n\n🎯 **PPT 前三页改造**：Cover 换为实景实拍，P2 突出真实核心痛点与早检对比，P3 醒目标注实测数据与增收挽损公章！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engineAttribution: '4.2 商业计划与模式诊断专家 · 金牌备赛教练',
        adoptedStatus: 'none',
        data: {
          radar: radarData,
          overallScore: 71.5,
          goldGap: '-32% 商业模式闭环成熟度差距',
          chapterIssues: [
            {
              chapter: '第三章 · 市场与商业模式',
              level: '重大逻辑漏洞',
              desc: 'BP 中假设向广大单体散户收取软件订阅费，散户付费意愿极低，未建立“组织化合作社托管 + 行业险企定损挽损分成”闭环。'
            },
            {
              chapter: '第四章 · 财务预测与产能规划',
              level: '前后数据矛盾',
              desc: '预测 2026 年覆盖 120 个中型合作主体，但生产线年产仅 30 套，营收暴增预期与供应链产能严重脱节。'
            }
          ],
          nextAdvice: '💡 教练建议：优先根据金奖范式将盈利模式重构为「组织化合作社托管 + 产业定损补贴分成」，并校准财务产能数据。'
        }
      };

      executeReActWorkflow(diagProcess, diagCardPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, diagnosis: prev.diagnosis + 1 }));
      });

    // 2.2 创新点与壁垒提炼
    } else if (actionKey === 'moat' || actionKey === 'task-moat-extract') {
      const moatProcess: ReActProcess = {
        duration: '1.8s',
        summary: '已完成核心创新点提炼与护城河构建',
        steps: [
          {
            id: `m1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '830ms',
            content: `破除《${projectName}》“通用技术自嗨”的扣分点，将硬件载体降维为载荷底盘，升维提炼专属病理数据库与算法，构筑数据、牌照、渠道、边缘算力四重壁垒。`
          },
          {
            id: `m2-${Date.now()}`,
            type: 'plan',
            title: '提炼与防守计划',
            tasks: [
              { id: 't1', text: '拆解通用技术与专属病理算法的技术分水岭' },
              { id: 't2', text: '构建“三层穿透法”技术创新话术' },
              { id: 't3', text: '确立四大商业护城河（数据、资质、渠道、算力）' }
            ]
          },
          {
            id: `m3-${Date.now()}`,
            type: 'act',
            title: '调用壁垒提炼专家引擎',
            command: {
              lang: 'mcp',
              cmd: `mcp://moat-extractor/analyze?project=${encodeURIComponent(projectName)}`
            },
            content: '已生成三大核心创新点话术及四大商业护城河矩阵。'
          }
        ]
      };

      const moatMsgPayload: ChatMessage = {
        id: `coach-moat-${Date.now()}`,
        sender: 'coach',
        type: 'text',
        text: `针对《${projectName}》破除“手持锤子找钉子”的**技术自嗨**痛点，提炼真正打动国赛评委的核心创新点与护城河：\n\n🛡️ **一、核心创新点提炼（三层穿透法）**：\n1. **硬件创新**：自研“4 通道窄带滤波光学分光载荷”，大幅降低工业级多光谱设备成本，实现高性价比普惠；\n2. **算法专属化**：构建专属病理数据库，数万组多气候标定切片，比通用大模型识别率高 18.4%；\n3. **标准话语权**：参与起草行业团体操作规范标准。\n\n🏰 **二、构建四大商业护城河**：\n1. **数据护城河**：连续多年多气候带标数据集，竞品无法在短期内复现；\n2. **资质与牌照壁垒**：联合推广中心与险企签发联合测报认证，成为定损指定数据源；\n3. **渠道绑定壁垒**：数十家大型合作社多年独家运营托管协议；\n4. **边缘算力壁垒**：端侧 FPGA 芯片秒级边缘推理，巡检完成即出处方图，彻底摆脱无网络困境。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: '依据国家信息化工程技术研究中心与大赛工科高教主赛道金奖壁垒提炼模型',
        engineAttribution: '4.2 商业计划与模式诊断专家 · 创新与壁垒提炼',
      };

      executeReActWorkflow(moatProcess, moatMsgPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, diagnosis: prev.diagnosis + 1 }));
      });

    // 2.3 路演与答辩模拟
    } else if (actionKey === 'mockqa' || actionKey === 'task-defense-grill') {
      const mockqaProcess: ReActProcess = {
        duration: '2.0s',
        summary: '已完成答辩施压问题推演与考官人设矩阵加载',
        steps: [
          {
            id: `q1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '910ms',
            content: `模拟大赛总决赛投资人与产业评委视角。围剿大厂降维打击、散户付费伪假设、硬件产能脱节三大弱点，准备共生开发者定位与险企分成防守话术。`
          },
          {
            id: `q2-${Date.now()}`,
            type: 'plan',
            title: '答辩攻防计划',
            tasks: [
              { id: 't1', text: '生成 3 组尖锐质询与标准防守话术' },
              { id: 't2', text: '定制 60 秒黄金路演震撼开场白' }
            ]
          },
          {
            id: `q3-${Date.now()}`,
            type: 'act',
            title: '加载考官人设与答辩题库',
            command: {
              lang: 'mcp',
              cmd: `mcp://defense-simulator/grill?project=${encodeURIComponent(projectName)}&mode=judge_selector`
            },
            content: '已加载 4 位评委多重视角，准备就绪。'
          }
        ]
      };

      const judgeSelectMsgPayload: ChatMessage = {
        id: `coach-judge-select-${Date.now()}`,
        sender: 'coach',
        type: 'judge_selector',
        text: `答辩训练系统已连接！针对《${projectName}》商业落地与财务产能，评委最常就“竞品降维打击、散户付费伪假设、营收产能脱节”进行连环轰炸。请选择一位考官人设开启答辩：`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: {
          judges: mockJudgePersonas
        }
      };

      executeReActWorkflow(mockqaProcess, judgeSelectMsgPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, mockqa: prev.mockqa + 1 }));
      });

    // 3.1 标杆金奖案例拆解
    } else if (actionKey === 'cases' || actionKey === 'task-gold-benchmark') {
      const casesProcess: ReActProcess = {
        duration: '1.7s',
        summary: '已完成往届金奖案例案卷检索与共性比对',
        steps: [
          {
            id: `c1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '750ms',
            content: '拆解历届涉农及科技成果转化金奖项目（如《渔光智联》、《茶语云眼》），提炼组织化主体对接、三单合一公函账本、高校独占专利反哺三大底层共性。'
          },
          {
            id: `c2-${Date.now()}`,
            type: 'plan',
            title: '案例萃取计划',
            tasks: [
              { id: 't1', text: '筛选近三年全国金奖案卷库' },
              { id: 't2', text: '总结金奖商业模式与落地实效共性规律' }
            ]
          },
          {
            id: `c3-${Date.now()}`,
            type: 'act',
            title: '调用金奖标杆案例库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://gold-benchmarks/filter?sector=smart_agriculture'
            },
            content: '完成金奖案例要素对齐与可复用经验清单生成。'
          }
        ]
      };

      const casesMsgPayload: ChatMessage = {
        id: `coach-cases-${Date.now()}`,
        sender: 'coach',
        type: 'gold_cases',
        text: `为你检索并深度解析了近三年在全国总决赛获得金奖的 3 个典型脱敏项目（包括《渔光智联》、《茶语云眼》等标杆案例）：\n\n🏆 **金奖标杆项目商业模式三大底层共性**：\n1. **避开散户直销**：无一例外采用“政企险三方绑定”或“合作社托管”模式；\n2. **铁证实证台账**：均具备连续 2 年以上由地方权威部门或第三方出具的实测增收公章报告；\n3. **兼顾育人成效**：团队深入一线，学生第一作者主导技术攻关与扎根创业。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: '教育部全国大学生创新大赛金奖案例库全景报告',
        data: {
          cases: mockGoldCases
        }
      };

      executeReActWorkflow(casesProcess, casesMsgPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, industry: prev.industry + 1 }));
      });

    // 3.2 竞品与市场调研
    } else if (actionKey === 'competitor' || actionKey === 'task-competitor-intel') {
      const compProcess: ReActProcess = {
        duration: '1.6s',
        summary: '已完成头部竞品对标与行业痛点分析',
        steps: [
          {
            id: `cp1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '720ms',
            content: '对标大疆农业、极飞科技、麦飞科技等头部玩家。总结通用光谱波段宽、设备售价高、田间无网络等 5 大行业痛点，提炼智耘农业窄带反演与 FPGA 边缘算力优势。'
          },
          {
            id: `cp2-${Date.now()}`,
            type: 'plan',
            title: '竞品调研计划',
            tasks: [
              { id: 't1', text: '梳理头部竞品融资轮次与优劣势' },
              { id: 't2', text: '归纳 5 大核心痛点与差异化穿透对策' }
            ]
          },
          {
            id: `cp3-${Date.now()}`,
            type: 'act',
            title: '聚合产业研报与竞品情报',
            command: {
              lang: 'mcp',
              cmd: 'mcp://intel-extractor/matrix?sector=smart_agriculture'
            },
            content: '生成 5 大痛点对策表及头部竞品对标四象限。'
          }
        ]
      };

      const compMsgPayload: ChatMessage = {
        id: `coach-comp-${Date.now()}`,
        sender: 'coach',
        type: 'competitor_intel',
        text: `已为你调取智慧农业赛道核心竞品矩阵（大疆农业、极飞科技、麦飞科技等）与智慧农业 5 大痛点对策：\n\n📌 **智慧农业与低空飞防 5 大核心痛点及穿透对策**：\n1. **通用光谱波段宽**：初期细微病害无法察觉 → 采用 4 通道窄带滤波捕捉叶绿体荧光猝灭；\n2. **硬件售价高昂**：进口设备动辄 10 万元 → 自研分光镜片整机降至 8,000 元内；\n3. **田间网络盲区**：无法实时传云 → 端侧 FPGA 轻量模型就地实时秒级边缘推理；\n4. **有检测无喷洒**：不与后续施药联动 → 输出标准处方图直接导入植保机精准变量施药；\n5. **缺乏农险挂钩**：纯卖硬件缺乏持续流 → 联合险企按挽损定损金额分成。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: '数据源：农业农村部信息中心智慧农业研报及企查查投融资大数据',
        data: {
          competitors: mockCompetitorList
        }
      };

      executeReActWorkflow(compProcess, compMsgPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, industry: prev.industry + 1 }));
      });

    // 4. 校内专属智库
    } else if (actionKey === 'campus' || actionKey === 'task-campus-kb') {
      const campusProcess: ReActProcess = {
        duration: '1.4s',
        summary: '已完成校本双创智库与特色政策调取',
        steps: [
          {
            id: `ca1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '630ms',
            content: `调取${selectedUniversity.name}双创专属政策：天使种子基金（最高10万）、重点实验室算力集群及差旅打样线上极速报销。`
          },
          {
            id: `ca2-${Date.now()}`,
            type: 'plan',
            title: '校内资源匹配计划',
            tasks: [
              { id: 't1', text: '查询校内专项资助基金申请条件' },
              { id: 't2', text: '对接重点实验室算力资源与导师智库' },
              { id: 't3', text: '梳理差旅耗材免纸质报销流程' }
            ]
          },
          {
            id: `ca3-${Date.now()}`,
            type: 'act',
            title: '连接校本双创知识库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://campus-kb/xmu?focus=funding_and_reimbursement'
            },
            content: '已提取校内种子基金申报指南与绿色报销流转规范。'
          }
        ]
      };

      const campusMsgPayload: ChatMessage = {
        id: `coach-campus-${Date.now()}`,
        sender: 'coach',
        type: 'campus_resources',
        text: `已为你调取【${selectedUniversity.name}】校内双创专属扶持资源库。作为本校在库培育项目，你可以享受科创天使种子基金（最高 10 万元）、重点实验室算力集群，以及双创竞赛差旅与打样绿色报销通道。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: '厦门大学创新创业教育学院文件（厦大创字〔2025〕06号）',
        data: {
          university: selectedUniversity
        }
      };

      executeReActWorkflow(campusProcess, campusMsgPayload, () => {
        setEngineCallCounts(prev => ({ ...prev, campus: prev.campus + 1 }));
      });

    // 运营飞轮看板
    } else if (actionKey === 'flywheel') {
      const flywheelProcess: ReActProcess = {
        duration: '1.1s',
        summary: '已完成运营闭环与自进化效能指标聚合',
        steps: [
          {
            id: `fw1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '450ms',
            content: '调取 AI 备赛教练全链路自进化飞轮日志与学生采纳率看板。'
          },
          {
            id: `fw2-${Date.now()}`,
            type: 'plan',
            title: '指标汇总计划',
            tasks: [
              { id: 't1', text: '汇总 4.1~4.3 专家模型调用量与采纳率' },
              { id: 't2', text: '生成高校省金/国金晋级率对比看板' }
            ]
          },
          {
            id: `fw3-${Date.now()}`,
            type: 'act',
            title: '调取飞轮指标中心',
            command: {
              lang: 'mcp',
              cmd: 'mcp://flywheel/metrics?range=current_week'
            },
            content: '加载完成，弹出运营看板。'
          }
        ]
      };

      const flywheelMsgPayload: ChatMessage = {
        id: `coach-flywheel-${Date.now()}`,
        sender: 'coach',
        type: 'flywheel_summary',
        text: `已为你汇总「AI 备赛教练」的**运营闭环与自进化飞轮效能报告**。系统遵循「学生反馈采纳 → 规则库与专家经验微调 → 诊断及答辩命中率提升」的正向闭环。点击下方按钮可展开数据驾驶舱完整看板。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      executeReActWorkflow(flywheelProcess, flywheelMsgPayload, () => {
        setShowFlywheelModal(true);
      });
    } else {
      // Generic keyboard query matcher
      handleCustomTextQuery(actionKey, false);
    }
  };

  // Custom user input logic with keyword routing and live ReAct workflow
  const handleCustomTextQuery = (text: string, appendUserMsg: boolean = false) => {
    const lower = text.toLowerCase();

    // 0. PPT重新生成/演进路标导出意图匹配 (在对话流中展示快捷方式并自动打开右侧独立区域)
    if (lower.includes('ppt') || lower.includes('路标') || lower.includes('幻灯片') || lower.includes('重新输出') || lower.includes('详细点') || lower.includes('生成文件')) {
      setTimeout(() => {
        const pptFile: AssociatedFileItem = {
          id: 'art-ppt-1',
          name: '安里AI_BP补充_项目路标.pptx',
          type: 'ppt',
          typeLabel: '路演汇报幻灯片 (Deck)',
          size: '31.3 KB',
          updateTime: '刚刚',
          status: 'ready'
        };
        const pptMsg: ChatMessage = {
          id: `msg-gen-ppt-${Date.now()}`,
          sender: 'coach',
          type: 'text',
          text: `已完成 2m33s >\n\nPPT已重新生成。和上一版相比，每个格子的内容大幅扩充：\n\n**产品里程碑（内容最多）：**\n• P1：完整列出Assistant助手7项功能、数据脱敏4项、案件库2项、评估能力2项\n• P2：SaaS产品化、合规完成、Assistant扩展、Workflows+多Agent、自建替代各模块子项都展开\n• P3/P4：全流程AI化各环节、Agent Platform客户化、生态化等细节保留\n\n**场景深度：**\n• P1：验证目标、覆盖范围、交付流程都保留\n• P2：刑事+知产各自的具体功能和适用场景展开\n• P3：立案→举证→庭审→判决→执行每个环节的AI能力都列出\n• P4：融资、匹配、闭环、分成模式的完整链条\n\n**客户/收入/融资：** 每个格子的数字、条件、时间窗口等细节全部保留，没有压缩。\n\n字体用了7-8pt来容纳更多内容，打开看看排版是否合适，有需要调整的告诉我。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          generatedFiles: [pptFile],
          changesCount: 2
        };
        setMessages(prev => [...prev, pptMsg]);
        setIsThinking(false);
        handleOpenFileInRightWorkspace(pptFile);
      }, 500);
      return;
    }

    // 1. 深度调用一键确认与执行匹配
    if (lower.includes('已确认') && (lower.includes('4.2') || lower.includes('4.3') || lower.includes('物料') || lower.includes('配置') || lower.includes('引擎'))) {
      handleExecuteDeepCall({
        selectedFocus: deepCallTarget === '4.2' ? '商业模式与落地闭环' : '严苛投资人·深度压力测试',
        reviewDepth: 'extreme'
      });
      return;
    }

    // 2. 取消深度调用
    if (lower.includes('取消') && (lower.includes('调用') || lower.includes('流程') || lower.includes('深度') || lower.includes('配置'))) {
      handleCancelDeepCall();
      return;
    }

    // 3. 4.1 深度调用意图匹配 (4.2 / 4.3)
    if (lower.includes('完整诊断') || lower.includes('深度体检') || lower.includes('全链路智能指导') || lower.includes('跳转 4.2') || lower.includes('深度调用 4.2') || lower.includes('4.2 全链路')) {
      handleStartDeepCall('4.2', text);
      return;
    }
    if (lower.includes('全流程模拟答辩') || lower.includes('跳转 4.3') || lower.includes('深度调用 4.3') || lower.includes('多考官') || lower.includes('极限压力') || lower.includes('4.3 模拟评审')) {
      handleStartDeepCall('4.3', text);
      return;
    }

    // 4. 4.1 浅度原子能力调用匹配 (4.2 / 4.3)
    const matchedJudge = mockJudgePersonas.find(j => lower.includes(j.name.toLowerCase()) || lower.includes(j.id.toLowerCase()));
    if (matchedJudge) {
      handleStartDefense(matchedJudge);
      return;
    }

    if (lower.includes('5道答辩题') || lower.includes('5 道答辩题') || lower.includes('尖锐答辩题') || lower.includes('浅度调用 4.3') || lower.includes('出答辩题') || lower.includes('出题') || lower.includes('质询题') || lower.includes('出5道')) {
      handleStartShallowCall('questions');
      return;
    }
    if (lower.includes('商业模式章节') || lower.includes('bp 商业模式') || lower.includes('商业模式速诊') || lower.includes('第四章') || lower.includes('浅度调用 4.2')) {
      handleStartShallowCall('chapter');
      return;
    }
    if (lower.includes('技术创新壁垒') || lower.includes('评分维度自测') || lower.includes('壁垒自测') || lower.includes('创新壁垒')) {
      handleStartShallowCall('moat');
      return;
    }

    if (lower.includes('赛道') || lower.includes('政策') || lower.includes('规则') || lower.includes('组别') || lower.includes('红旅') || lower.includes('准入') || lower.includes('门槛') || lower.includes('评分') || lower.includes('标准')) {
      handleTriggerAction('policy', appendUserMsg);
    } else if (lower.includes('创新点') || lower.includes('壁垒') || lower.includes('护城河') || lower.includes('技术自嗨') || lower.includes('伪需求') || lower.includes('重复造轮子')) {
      handleTriggerAction('moat', appendUserMsg);
    } else if (lower.includes('bp') || lower.includes('诊断') || lower.includes('计划书') || lower.includes('打分') || lower.includes('雷达') || lower.includes('体检') || lower.includes('前三页')) {
      handleTriggerAction('diagnosis', appendUserMsg);
    } else if (lower.includes('答辩') || lower.includes('模拟') || lower.includes('评委') || lower.includes('路演') || lower.includes('追问') || lower.includes('质询') || lower.includes('开场白')) {
      handleTriggerAction('mockqa', appendUserMsg);
    } else if (lower.includes('案例') || lower.includes('金奖') || lower.includes('共性') || lower.includes('标杆') || lower.includes('历年')) {
      handleTriggerAction('cases', appendUserMsg);
    } else if (lower.includes('竞品') || lower.includes('极飞') || lower.includes('大疆') || lower.includes('鹰瞳') || lower.includes('融资') || lower.includes('市场') || lower.includes('痛点')) {
      handleTriggerAction('competitor', appendUserMsg);
    } else if (lower.includes('校内') || lower.includes('本校') || lower.includes('报销') || lower.includes('导师') || lower.includes('资金') || lower.includes('厦大') || lower.includes('清华') || lower.includes('浙大') || lower.includes('校本') || lower.includes('智库')) {
      handleTriggerAction('campus', appendUserMsg);
    } else if (lower.includes('运营') || lower.includes('指标') || lower.includes('闭环') || lower.includes('飞轮') || lower.includes('数据')) {
      handleTriggerAction('flywheel', appendUserMsg);
    } else {
      const projectName = activeSpace?.name || '当前项目';
      const cleanSummary = text.length > 15 ? text.slice(0, 15) + '...' : text;
      
      const customProcess: ReActProcess = {
        duration: '1.8s',
        summary: `已完成「${cleanSummary}」意图解析与多维推演`,
        steps: [
          {
            id: `custom-r1-${Date.now()}`,
            type: 'reasoning',
            title: '深度思考',
            subtitle: '780ms',
            content: `深入分析针对「${projectName}」提出的咨询「${text}」。解析核心意图（赛道规则、BP商业逻辑、技术壁垒或答辩攻防），调取匹配的备赛教练模型与标杆知识库。`
          },
          {
            id: `custom-r2-${Date.now()}`,
            type: 'plan',
            title: '整理任务计划',
            tasks: [
              { id: 't1', text: `解析「${cleanSummary}」核心诉求与评分细则关联` },
              { id: 't2', text: `调取「${projectName}」项目上下文与国金基准线` },
              { id: 't3', text: '组织金牌教练针对性解答与下一步建议' }
            ]
          },
          {
            id: `custom-r3-${Date.now()}`,
            type: 'act',
            title: '调用多智能体备赛教练推演引擎',
            command: {
              lang: 'mcp',
              cmd: `mcp://coach-engine/query?project=${encodeURIComponent(projectName)}&q=${encodeURIComponent(cleanSummary)}`
            },
            content: '完成知识库检索与结构化建议组装。'
          }
        ]
      };

      const fallbackMsgPayload: ChatMessage = {
        id: `coach-fallback-${Date.now()}`,
        sender: 'coach',
        type: 'text',
        text: `针对你提出的「${text}」，我已经建立项目上下文关联。\n\n你可以直接点击下方的快捷功能胶囊，或者尝试向我询问：\n\n• **1. 赛事政策**："我的项目能报哪个赛道？高教主赛道与红旅/产业赛道有什么区别？"\n• **2.1 BP深度诊断**："帮我诊断商业计划书初稿，指出市场分析逻辑漏洞与PPT前三页建议"\n• **2.2 创新点与壁垒**："如何破除技术自嗨，提炼打动评委的核心创新点与商业护城河？"\n• **2.3 模拟答辩演练**："评委最可能问哪3个尖锐质询？帮我优化1分钟路演开场白"\n• **3.1 标杆金奖案例**："近三年相关赛道国赛金奖项目，商业模式与落地闭环有什么共性？"\n• **3.2 竞品调研与痛点**："梳理当前赛道主要竞品矩阵与行业5大痛点解决措施"\n• **4. 校内专属智库**："本校双创学院有哪些特色扶持、重点实验室算力与报销流程？"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      executeReActWorkflow(customProcess, fallbackMsgPayload);
    }
  };

  // Trigger Send
  const handleSendMessage = (text: string) => {
    if (!text.trim() || isThinking) return;

    const query = text.trim();
    setInputValue('');

    const currentMentions = [...mentionedFiles];
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'student',
      type: 'text',
      text: query,
      mentionedFiles: currentMentions.length > 0 ? currentMentions : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setMentionedFiles([]);
    setIsThinking(true);

    if (onUpdateSessionTitle && currentSession && (currentSession.title.includes('新会话') || currentSession.title.includes('初始'))) {
      const cleanTitle = query.length > 18 ? query.slice(0, 18) + '...' : query;
      onUpdateSessionTitle(activeSpaceId || 'none', activeSessionId, cleanTitle);
    }

    handleCustomTextQuery(query, false);
  };

  const handleSendInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Start fresh new session
  const handleStartNewSession = () => {
    if (onCreateSession) {
      onCreateSession('none');
    }
    setMessages([]);
  };

  // 4.3 浅度调用：选定考官后，即刻在一次回复里输出五道题目，不需要应答策略
  const handleStartDefense = (judge: JudgePersonaDef) => {
    setSelectedJudge(judge);

    const userPickMsg: ChatMessage = {
      id: `usr-pick-judge-${Date.now()}`,
      sender: 'student',
      type: 'text',
      text: `已选定考官：【${judge.name} · ${judge.role}】\n请为我的项目生成 5 道该考官维度的尖锐质询题。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetQuestions = mockJudgeQuestionsMap[judge.id] || mockJudgeQuestionsMap.critical;
    const projName = activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统';

    const reactPlan: ReActProcess = {
      duration: '1.2s',
      summary: `已调取【${judge.name}】考官题库并生成 5 道尖锐质询题`,
      steps: [
        {
          id: `p1-${Date.now()}`,
          type: 'reasoning',
          title: '考官画像分析与项目特征匹配',
          subtitle: '420ms',
          content: `调取【${judge.name}】（${judge.style}）国赛高频质询维度与关注要点（${judge.focusArea}），针对《${projName}》的技术创新与商业模式盲区，生成 5 道最尖锐质询题。`
        },
        {
          id: `p2-${Date.now()}`,
          type: 'plan',
          title: '质询维度生成计划',
          tasks: [
            { id: 't1', text: `锁定考官风格：${judge.style}` },
            { id: 't2', text: '提炼 5 个高频质询维度（壁垒/可行性/产能/鲁棒性/团队）' },
            { id: 't3', text: '单次全量输出 5 道题目（纯质询模式，无应答策略）' }
          ]
        },
        {
          id: `p3-${Date.now()}`,
          type: 'act',
          title: '调用 4.3 评委尖锐质询生成器 (sk-defense-grill)',
          command: {
            lang: 'mcp',
            cmd: `mcp://defense-simulator/grill?judge=${judge.id}&question_count=5&mode=five_questions_direct`
          },
          content: `4.3 引擎返回 200 OK (380ms)，成功生成 5 道尖锐质询题。`
        }
      ]
    };

    const inputPayload = {
      protocolVersion: 'v2.1-ATOMIC-MCP',
      atomicCapability: 'sk-defense-grill',
      targetEngine: '4.3',
      projectId: activeSpace?.id || 'proj-smart-agri-01',
      params: {
        judgeId: judge.id,
        judgeName: judge.name,
        judgeRole: judge.role,
        judgeStyle: judge.style,
        focusArea: judge.focusArea,
        questionCount: 5,
        outputMode: 'direct_questions_only'
      }
    };

    const outputResponse = {
      status: 200,
      atomicSkill: 'sk-defense-grill',
      judge: judge.name,
      generatedCount: 5,
      latencyMs: 380,
      questions: targetQuestions
    };

    const resultMsg: ChatMessage = {
      id: `coach-atomic-43-${Date.now() + 1}`,
      sender: 'coach',
      type: 'atomic_call_result',
      text: `已为你接入【${judge.name} (${judge.role})】考官视角。\n考官风格：**${judge.style}**。\n考查重点：${judge.focusArea}。\n\n已根据《${projName}》的项目特征，一次性出具 5 道最高频、最尖锐的答辩质询题：`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engineAttribution: `4.3 模拟评审与答辩训练 (原子能力 · ${judge.name})`,
      data: {
        atomicType: 'questions_43',
        projectName: projName,
        judge: judge,
        questions: targetQuestions
      },
      callMeta: {
        callType: 'shallow',
        targetEngine: '4.3',
        capabilityName: `评委尖锐质询题生成器 (${judge.name})`,
        duration: '380ms',
        inputPayload,
        outputResponse
      }
    };

    setMessages(prev => [...prev, userPickMsg]);

    executeReActWorkflow(reactPlan, resultMsg, () => {
      setEngineCallCounts(prev => ({ ...prev, shallow43: prev.shallow43 + 1 }));
    });
  };

  // Handle student answering in defense
  const handleAnswerDefenseQ1 = (answerObj: any) => {
    setDefenseScores(prev => ({ ...prev, q1: answerObj.score }));
    setDefenseStep('q1_answered');

    const userAnsMsg: ChatMessage = {
      id: `usr-def-q1-${Date.now()}`,
      sender: 'student',
      type: 'text',
      text: `【我的回答】${answerObj.text}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userAnsMsg]);
    setIsThinking(true);

    // Follow-up counter grill
    setTimeout(() => {
      setIsThinking(false);
      setDefenseStep('q2_grill');

      const counterGrillMsg: ChatMessage = {
        id: `coach-counter-grill-${Date.now()}`,
        sender: 'coach',
        type: 'defense_grilling',
        text: `评委听完你的第一轮回答，给出了即时批注并立即进行**第二轮深度追问**！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: {
          step: 2,
          judge: selectedJudge,
          previousCritique: answerObj.critique,
          previousScore: answerObj.score,
          exchange: mockDefenseScript
        }
      };
      setMessages(prev => [...prev, counterGrillMsg]);
    }, 1200);
  };

  const handleAnswerDefenseQ2 = (answerObj: any) => {
    setDefenseScores(prev => ({ ...prev, q2: answerObj.score }));
    setDefenseStep('q2_answered');

    const userAnsMsg: ChatMessage = {
      id: `usr-def-q2-${Date.now()}`,
      sender: 'student',
      type: 'text',
      text: `【第二轮回答】${answerObj.text}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userAnsMsg]);
    setIsThinking(true);

    // Post-Match Review Card
    setTimeout(() => {
      setIsThinking(false);
      setDefenseStep('completed');

      const avgScore = Math.round(((defenseScores.q1 || 90) + answerObj.score) / 2);

      const reviewMsg: ChatMessage = {
        id: `coach-defense-review-${Date.now()}`,
        sender: 'coach',
        type: 'defense_review',
        text: `答辩模拟结束！本次挑战【${selectedJudge.name}】综合表现得分 **${avgScore} 分**。系统已生成逐题复盘与失分点透析报告：`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engineAttribution: '由 4.3 模拟评审与答辩训练引擎生成',
        adoptedStatus: 'none',
        data: {
          judge: selectedJudge,
          avgScore: avgScore,
          q1Score: defenseScores.q1 || 92,
          q2Score: answerObj.score,
          review: mockDefenseScript.review,
          recurringMistakes: [
            '❌ 倾向于用技术参数回答商业变现问题（技术思维与评委商业思维脱节）',
            '❌ 关键经济效益数据（如每亩挽损142元、增产35%）未在回答开篇前10秒迅速亮出'
          ],
          modelFormula: '【金奖答辩黄金公式】定性生态协同 + 物理机理/专有数据集 + 权威第三方盲测闭环'
        }
      };
      setMessages(prev => [...prev, reviewMsg]);
    }, 1500);
  };

  // Feedback Toggle on diagnosis or review card
  const handleFeedbackToggle = (msgId: string, status: 'adopted' | 'rejected') => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const nextStatus = m.adoptedStatus === status ? 'none' : status;
        return { ...m, adoptedStatus: nextStatus };
      }
      return m;
    }));
  };

  // Switch university
  const handleSwitchUniversity = (univ: UniversityOption) => {
    setSelectedUniversity(univ);
    const noticeMsg: ChatMessage = {
      id: `sys-univ-${Date.now()}`,
      sender: 'system',
      type: 'text',
      text: `已切换认证院校至【${univ.name}】。校内智库与报销通道已同步加载该校专属政策。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, noticeMsg]);
  };

  // Action item checkbox toggle in right panel
  const handleToggleActionItem = (id: string) => {
    setActionItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F5F5F7] text-[#1D1D1F] select-none relative overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* MAIN FULL-WIDTH CHAT WORKSPACE                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFC] relative h-full">
        {/* Main Workspace Area: Fixed Layout with Upper Scrollable Viewport and Bottom-Docked Input Bar */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {/* Scrollable Message / Greeting Area */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6 flex justify-center">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full text-center my-auto">
                {/* Mascot Greeting */}
                <div className="mb-3">
                  <AiMascot size={72} showSpeaker={true} className="hover:scale-105 transition-transform" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  开启新的备赛辅导会话
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 max-w-lg mt-1.5 leading-relaxed">
                  向 AI 备赛助手提问，或点击下方推荐任务与快捷功能发起冲刺咨询
                </p>

                {/* Quick Badges Row */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-2 text-xs font-mono">
                  <div className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs flex items-center space-x-1.5">
                    <span className="text-blue-500">🤖</span>
                    <span>智能体: {selectedAgentId === 'diagnosis' ? '诊断与指导专家' : '答辩专家'}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs flex items-center space-x-1.5">
                    <span className="text-indigo-500">⚡</span>
                    <span>技能: {selectedSkillIds.length} 项启用</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs flex items-center space-x-1.5">
                    <span className="text-emerald-500">🔌</span>
                    <span>MCP: {selectedMcpIds.length} 个连接</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl space-y-6">
                {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            const isStudent = msg.sender === 'student';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  {msg.type === 'tool_calling' ? (
                    <div className="flex items-center space-x-2.5 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-xs shadow-xs animate-pulse">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-bold">{msg.text}</span>
                        <span className="text-[10px] text-blue-600">{msg.data?.step}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-mono">
                      {msg.text}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex space-x-3 max-w-4xl ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {/* Coach Avatar */}
                {isCoach && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-xs mt-0.5">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                )}

                {/* Message Content Container */}
                <div className={`space-y-3 max-w-[90%] sm:max-w-[85%] ${isStudent ? 'items-end' : 'items-start'}`}>
                  {/* Bubble wrapper */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-xs leading-relaxed shadow-xs ${
                      isStudent
                        ? 'bg-[#0071E3] text-white rounded-br-xs font-medium'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs'
                    }`}
                  >
                    {/* Collapsible Completed ReAct Process Step */}
                    {isCoach && msg.reactProcess && (
                      <div className="mb-3">
                        <ReActProcessView process={msg.reactProcess} />
                      </div>
                    )}

                    {/* Mentioned Files Chips */}
                    {msg.mentionedFiles && msg.mentionedFiles.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {msg.mentionedFiles.map((file) => (
                          <span
                            key={file.id}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium ${
                              isStudent
                                ? 'bg-white/20 text-white border border-white/30 backdrop-blur-xs'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <Paperclip className="h-3 w-3 flex-shrink-0" />
                            <span>@{file.name}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Plain Text content */}
                    {msg.text && (
                      <div className="whitespace-pre-line text-[13px] font-normal leading-relaxed">
                        {msg.text}
                      </div>
                    )}

                    {/* ---------------- ACT 1: 4 Scenario Cards ---------------- */}
                    {msg.type === 'intro_scenarios' && msg.data?.scenarios && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-gray-100">
                        {msg.data.scenarios.map((sc: any) => (
                          <div
                            key={sc.id}
                            onClick={() => handleTriggerAction(sc.id)}
                            className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                {sc.code}
                              </span>
                              <span className="text-[10px] text-gray-400 group-hover:text-blue-600 transition-colors">
                                点击提问 →
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 transition-colors">
                              {sc.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {sc.subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ---------------- ACT 1: Preparation Stage Selector Prompt ---------------- */}
                    {msg.type === 'stage_prompt' && msg.data?.stages && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-gray-100">
                        {msg.data.stages.map((st: any) => (
                          <button
                            key={st.id}
                            onClick={() => handleSelectStage(st.id)}
                            className={`p-3 rounded-xl text-left border transition-all ${
                              currentStage === st.id
                                ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 text-blue-950'
                                : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-white text-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-blue-700 font-mono">
                                {st.title}
                              </span>
                              {currentStage === st.id && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-snug">
                              {st.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* ---------------- ACT 2: Track Comparison Table Card ---------------- */}
                    {msg.type === 'policy_answer' && msg.data?.comparisons && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px] border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                <th className="p-2.5 font-bold">赛道与组别</th>
                                <th className="p-2.5 font-bold">申报条件与门槛</th>
                                <th className="p-2.5 font-bold">评审考核侧重点</th>
                                <th className="p-2.5 font-bold">针对「智耘农业」建议</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {msg.data.comparisons.map((c: any, idx: number) => (
                                <tr key={idx} className={c.isRecommended ? 'bg-blue-50/40' : ''}>
                                  <td className="p-2.5 align-top">
                                    <div className="font-bold text-gray-900">{c.track}</div>
                                    <div className="text-[10px] text-gray-500">{c.group}</div>
                                    {c.isRecommended && (
                                      <span className="inline-block mt-1 text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded">
                                        ★ 首选推荐 (92分)
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2.5 align-top text-gray-600 max-w-[160px]">
                                    {c.eligibility}
                                  </td>
                                  <td className="p-2.5 align-top text-gray-600 max-w-[180px]">
                                    {c.reviewFocus}
                                  </td>
                                  <td className="p-2.5 align-top text-blue-900 font-medium max-w-[160px]">
                                    {c.advice}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Follow-up Action prompt */}
                        <div className="flex items-center justify-between bg-blue-50/70 p-2.5 rounded-xl text-blue-800 text-[11px]">
                          <span>💡 准备好了吗？下一步建议对 BP 初稿进行全维度深度诊断</span>
                          <button
                            onClick={() => handleTriggerAction('diagnosis')}
                            className="px-3 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                          >
                            立即诊断 BP →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ---------------- ACT 3: BP Depth Diagnosis Report Card (Calling 4.2 Engine) ---------------- */}
                    {msg.type === 'bp_diagnosis' && msg.data && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-4">
                        {/* Radar Chart + Benchmarking Score Summary (Kept as required rich media card) */}
                        <div className="bg-slate-50/70 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                          {/* Left: SVG Radar Chart */}
                          <div className="flex-shrink-0">
                            <RadarChart data={msg.data.radar} size={250} />
                          </div>

                          {/* Right: Gap Breakdown */}
                          <div className="flex-1 space-y-2.5 w-full text-xs">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                              <span className="font-bold text-gray-800">对标国赛金奖差距</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                                {msg.data.goldGap}
                              </span>
                            </div>
                            <div className="space-y-1 text-[11px] text-gray-600">
                              <div className="flex justify-between">
                                <span>🌾 社会价值与科技创新</span>
                                <span className="font-bold text-emerald-600">已达金奖线 (8.5 / 7.5)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>⚠️ 市场与商业价值</span>
                                <span className="font-bold text-red-600">落后金奖线 3.3 分 (5.5分)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>⚠️ 材料完整性与一致性</span>
                                <span className="font-bold text-amber-600">数据打架待修正 (6.5分)</span>
                              </div>
                            </div>
                            {msg.data.nextAdvice && (
                              <div className="text-[11px] text-amber-900 pl-2.5 border-l-2 border-amber-400 py-0.5 leading-relaxed">
                                {msg.data.nextAdvice}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Chapter Issues List: Pure Text with Chatbot-style Typography (no text boxes) */}
                        <div className="space-y-3 pt-1">
                          <div className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
                            <span>🔍 逐章穿透式问题批注：</span>
                          </div>
                          <div className="space-y-3 pl-1">
                            {msg.data.chapterIssues.map((iss: any, i: number) => (
                              <div key={i} className="space-y-1 text-xs">
                                <div className="flex items-center space-x-2 flex-wrap">
                                  <span className="font-bold text-gray-900">
                                    {i + 1}. {iss.chapter}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                    iss.level.includes('漏洞') 
                                      ? 'bg-rose-50 text-rose-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    【{iss.level}】
                                  </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed pl-3 border-l-2 border-gray-200">
                                  {iss.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Adoption Feedback & Tool Engine Attribution */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px]">
                          <span className="font-mono text-gray-400 text-[10px]">
                            {msg.engineAttribution}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleFeedbackToggle(msg.id, 'adopted')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                msg.adoptedStatus === 'adopted'
                                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                              title="点赞"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>点赞</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedbackToggle(msg.id, 'rejected')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                msg.adoptedStatus === 'rejected'
                                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                              title="点踩"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                              <span>点踩</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------------- ACT 4: Judge Persona Selector ---------------- */}
                    {msg.type === 'judge_selector' && msg.data?.judges && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
                        <span className="text-xs font-bold text-gray-800 block">
                          五大评委考官矩阵 (点击选择一位开启答辩):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.data.judges.map((j: JudgePersonaDef) => (
                            <div
                              key={j.id}
                              onClick={() => handleStartDefense(j)}
                              className="p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50/60 hover:border-blue-300 transition-all cursor-pointer space-y-1.5 group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`h-6 w-6 rounded-full ${j.avatarBg} text-white flex items-center justify-center text-[10px] font-bold`}>
                                    {j.avatarText}
                                  </div>
                                  <span className="font-bold text-xs text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {j.name}
                                  </span>
                                </div>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                  j.grillDifficulty === '极高' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  难度: {j.grillDifficulty}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 line-clamp-2">
                                {j.description}
                              </p>
                              <div className="text-[9px] text-blue-600 font-medium">
                                考点：{j.focusArea}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ---------------- ACT 4: Defense Interactive Grilling & Answers ---------------- */}
                    {msg.type === 'defense_grilling' && msg.data && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        {/* Judge's Grilling Question */}
                        <div className="p-3 rounded-xl bg-red-50/60 border-l-4 border-red-500 space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <div className={`h-5 w-5 rounded-full ${msg.data.judge.avatarBg} text-white flex items-center justify-center text-[10px] font-bold`}>
                              {msg.data.judge.avatarText}
                            </div>
                            <span className="font-bold text-red-950 text-xs">
                              {msg.data.judge.name} ({msg.data.judge.role})
                            </span>
                            <span className="text-[10px] text-red-700">
                              ⚠️ {msg.data.step === 1 ? '第一轮尖锐发问' : '第二轮深度追问'}
                            </span>
                          </div>

                          <p className="text-xs text-red-950 font-medium leading-relaxed pl-7">
                            "{msg.data.step === 1 ? msg.data.exchange.judgeQuestion : msg.data.exchange.counterQuestion}"
                          </p>
                        </div>

                        {/* Optional Previous Score */}
                        {msg.data.previousCritique && (
                          <div className="pl-3 border-l-2 border-gray-300 text-xs text-gray-700 space-y-0.5">
                            <div className="font-semibold text-gray-900">
                              上一轮得分: <span className="font-mono text-blue-600 font-bold">{msg.data.previousScore} 分</span>
                            </div>
                            <p className="text-gray-600">{msg.data.previousCritique}</p>
                          </div>
                        )}

                        {/* Candidate Preset Answers for Student (Interactive choice buttons) */}
                        {defenseStep !== 'completed' && (
                          <div className="space-y-2 pt-1">
                            <span className="text-xs font-bold text-gray-800 block">
                              选择你的应对应答策略 (或在下方输入框手动打字回答):
                            </span>
                            <div className="space-y-2">
                              {(msg.data.step === 1 ? msg.data.exchange.presetAnswers : msg.data.exchange.counterAnswers).map((ans: any) => (
                                <button
                                  key={ans.id}
                                  onClick={() => msg.data.step === 1 ? handleAnswerDefenseQ1(ans) : handleAnswerDefenseQ2(ans)}
                                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all space-y-1 group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-blue-900 group-hover:text-blue-600">
                                      {ans.label}
                                    </span>
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                      ans.score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      预期得分: {ans.score}分
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">
                                    {ans.text}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ---------------- ACT 4: Post-Match Defense Review Report Card ---------------- */}
                    {msg.type === 'defense_review' && msg.data && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3.5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <span className="font-bold text-xs text-gray-900">
                              📊 答辩复盘综合得分
                            </span>
                            <span className="text-xl font-black text-indigo-600 font-mono">
                              {msg.data.avgScore} <span className="text-xs text-gray-400 font-normal">/ 100 分</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                            <span className="flex items-center space-x-1">
                              <span className="text-gray-400">Q1 巨头竞争与壁垒:</span>
                              <strong className="text-gray-900 font-mono">{msg.data.q1Score} 分</strong>
                              <span className="text-blue-600">(良好)</span>
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center space-x-1">
                              <span className="text-gray-400">Q2 田间量化经济账:</span>
                              <strong className="text-gray-900 font-mono">{msg.data.q2Score} 分</strong>
                              <span className="text-emerald-600">(卓越)</span>
                            </span>
                          </div>

                          {/* Identified Recurring Mistakes */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-xs font-bold text-red-900 block">
                              ⚠️ 识别出的典型高频失分倾向:
                            </span>
                            <ul className="space-y-1 pl-1 text-xs text-gray-700">
                              {msg.data.recurringMistakes.map((mistake: string, mIdx: number) => (
                                <li key={mIdx} className="flex items-start space-x-2 pl-2 border-l-2 border-red-300">
                                  <span>{mistake}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Model Answer Formula */}
                          <div className="pt-1 text-xs text-gray-800 space-y-1">
                            <span className="font-bold text-emerald-900 block">🏆 金奖评委推荐应答范式:</span>
                            <p className="pl-3 border-l-2 border-emerald-500 text-gray-700 leading-relaxed">
                              {msg.data.modelFormula}
                            </p>
                          </div>
                        </div>

                        {/* Adoption feedback */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                          <span className="font-mono text-gray-400 text-[10px]">
                            {msg.engineAttribution}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleFeedbackToggle(msg.id, 'adopted')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                msg.adoptedStatus === 'adopted'
                                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                              title="点赞"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>点赞</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedbackToggle(msg.id, 'rejected')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                msg.adoptedStatus === 'rejected'
                                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                              title="点踩"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                              <span>点踩</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------------- ACT 5: Gold Cases & Competitors ---------------- */}
                    {msg.type === 'gold_cases' && msg.data?.cases && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        <div className="space-y-4">
                          {msg.data.cases.map((c: any) => (
                            <div
                              key={c.id}
                              className="space-y-1.5 border-b border-gray-100 pb-3.5 last:border-b-0 last:pb-0"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center space-x-1.5 font-bold text-gray-900 text-xs">
                                    <Award className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                                    <span>{c.title}</span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                                    {c.competition} · {c.award} · {c.school}
                                  </span>
                                </div>
                                <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                  {c.track}
                                </span>
                              </div>

                              <p className="text-xs text-gray-700 leading-relaxed">
                                {c.summary}
                              </p>

                              <div className="pl-3 border-l-2 border-blue-200 space-y-1 text-xs text-gray-600">
                                <span className="font-semibold text-gray-800 block">可借鉴做法与亮点：</span>
                                {c.actionableTakeaways.map((tak: string, tIdx: number) => (
                                  <div key={tIdx} className="flex items-start space-x-1.5">
                                    <span className="text-blue-500">•</span>
                                    <span>{tak}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="text-[11px] text-emerald-700 font-medium">
                                💎 商业模式特征：{c.businessModelTrait}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Competitor Intel Card */}
                    {msg.type === 'competitor_intel' && msg.data?.competitors && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        <div className="space-y-3">
                          {msg.data.competitors.map((cp: any, idx: number) => (
                            <div
                              key={idx}
                              className="space-y-1 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-bold text-gray-900">{cp.name}</div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">
                                  {cp.latestRound} · {cp.fundingAmount}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                <strong className="text-gray-800">主打产品：</strong> {cp.product}
                              </p>
                              <p className="text-xs text-blue-900 leading-relaxed pl-3 border-l-2 border-blue-300">
                                <strong className="text-blue-700">智耘农业应对策略：</strong> {cp.ourAdvantage}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ---------------- ACT 6: Campus Specific Resources ---------------- */}
                    {msg.type === 'campus_resources' && msg.data?.university && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <span className="font-bold text-purple-950 text-xs flex items-center space-x-1.5">
                            <Building2 className="h-4 w-4 text-purple-700" />
                            <span>{msg.data.university.fundName}</span>
                          </span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                            {msg.data.university.maxGrant}
                          </span>
                        </div>
                        <span className="text-[11px] text-purple-700 block">
                          🔒 仅对 {msg.data.university.name} 在校师生认证开放
                        </span>

                        {/* Matching Labs & Mentors */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold text-gray-900 block">
                            推荐校内匹配导师与重点实验室：
                          </span>
                          <div className="space-y-2 pl-1">
                            {msg.data.university.labs.map((lab: any, lIdx: number) => (
                              <div key={lIdx} className="space-y-0.5 text-xs">
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>• {lab.name}</span>
                                  <span className="text-emerald-600 font-mono text-[10px]">匹配度 {lab.matchScore}%</span>
                                </div>
                                <p className="text-gray-500 pl-3">{lab.leader} · {lab.direction}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reimbursement Steps */}
                        <div className="space-y-1 pt-1">
                          <span className="font-bold text-gray-900 text-xs block">
                            赛事打样与差旅极速报销通道：
                          </span>
                          <div className="space-y-1 pl-1 text-xs text-gray-700">
                            {msg.data.university.reimbursementSteps.map((stp: string, sIdx: number) => (
                              <div key={sIdx} className="flex items-start space-x-2">
                                <span className="text-blue-600 font-mono font-bold">•</span>
                                <span>{stp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------------- 4.1 ↔ 4.2/4.3 CALL CARDS ---------------- */}
                    {/* 1. Atomic Call Result Card (Shallow Call) */}
                    {msg.type === 'atomic_call_result' && msg.data && (
                      <AtomicCallCard
                        data={msg.data}
                        callMeta={msg.callMeta}
                        onUpgradeToDeepCall={(target) => handleStartDeepCall(target)}
                        onSwitchJudge={() => handleStartShallowCall('questions')}
                        onAdopt={() => {
                          const notice: ChatMessage = {
                            id: `sys-adopt-${Date.now()}`,
                            sender: 'system',
                            type: 'text',
                            text: `已记录反馈点赞，已沉淀至当前工作空间备赛素材库。`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setMessages(prev => [...prev, notice]);
                        }}
                      />
                    )}

                    {/* 2. Deep Call Config Collection Card (In-Chat Parameter Confirmation) */}
                    {msg.type === 'deep_call_config_collection' && (
                      <DeepCallConfigCard
                        targetModule={deepCallTarget}
                        projectName={activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统'}
                        onConfirmExecution={(cfg) => handleExecuteDeepCall(cfg)}
                        onCancelCall={handleCancelDeepCall}
                      />
                    )}

                    {/* 3. Deep Call Result Card (Deep Call Return) */}
                    {msg.type === 'deep_call_result' && msg.data && (
                      <DeepCallResultCard
                        data={msg.data}
                        targetModule={msg.data.target || deepCallTarget}
                        projectName={activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统'}
                        onSelectNextAction={(prompt) => {
                          setInputValue(prompt);
                          handleSendMessage(prompt);
                        }}
                        onAdoptResults={() => {
                          const notice: ChatMessage = {
                            id: `sys-adopt-deep-${Date.now()}`,
                            sender: 'system',
                            type: 'text',
                            text: `已记录反馈点赞，已全量同步至【${activeSpace?.name || '当前项目'}】工作空间！`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setMessages(prev => [...prev, notice]);
                        }}
                      />
                    )}

                    {/* ---------------- ACT 7: Flywheel Preview Capsule ---------------- */}
                    {msg.type === 'flywheel_summary' && (
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-medium">
                          运营闭环看板已就绪，覆盖使用层、质量层与业务成效
                        </span>
                        <button
                          onClick={() => setShowFlywheelModal(true)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          打开数据驾驶舱 →
                        </button>
                      </div>
                    )}

                    {/* Source Citations & Footnotes */}
                    {msg.citation && (
                      <div className="mt-3 pt-2 border-t border-gray-100/80 text-[10px] text-gray-400 flex items-center justify-between">
                        <span className="font-mono text-gray-500">
                          📜 依据来源：{msg.citation}
                        </span>
                        <span className="text-gray-400 italic">AI 生成，仅供参考</span>
                      </div>
                    )}

                    {/* Generated Artifacts Shortcut Card (Matching Screenshot) */}
                    {msg.generatedFiles && msg.generatedFiles.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-2.5">
                        {msg.generatedFiles.map((file) => (
                          <div
                            key={file.id}
                            onClick={() => handleOpenFileInRightWorkspace(file)}
                            className="group flex items-center justify-between p-3 rounded-xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/80 hover:border-orange-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-300/60 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                                <Presentation className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-orange-700 transition-colors">
                                  {file.name}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {file.size}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-orange-600 font-medium shrink-0 pl-2">
                              <span>在右侧独立区域打开</span>
                              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}

                        {/* Quick Action Links matching screenshot */}
                        <div className="flex items-center space-x-4 text-xs font-medium text-slate-500 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (msg.generatedFiles && msg.generatedFiles.length > 0) {
                                handleOpenFileInRightWorkspace(msg.generatedFiles[0]);
                              } else if (onToggleRightWorkspace) {
                                onToggleRightWorkspace();
                              }
                            }}
                            className="hover:text-sky-600 flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>查看所有产物 ({ALL_PROJECT_DELIVERABLES.length})</span>
                            <ChevronRight className="h-3 w-3 text-slate-400" />
                          </button>
                          <span className="text-slate-300">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (msg.generatedFiles && msg.generatedFiles.length > 0) {
                                handleOpenFileInRightWorkspace(msg.generatedFiles[0]);
                              }
                            }}
                            className="hover:text-sky-600 flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>查看所有变更 ({msg.changesCount || 2})</span>
                            <ChevronRight className="h-3 w-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & System disclaimer & Quick Like/Dislike for coach messages */}
                  <div className={`flex items-center justify-between text-[10px] text-gray-400 px-1 ${isStudent ? 'justify-end' : ''}`}>
                    <div className="flex items-center space-x-2">
                      <span>{msg.timestamp}</span>
                      {isCoach && <span>· 智能体统一入口</span>}
                    </div>
                    {isCoach && msg.type !== 'bp_diagnosis' && msg.type !== 'defense_review' && msg.type !== 'atomic_call_result' && msg.type !== 'deep_call_result' && msg.type !== 'intro_scenarios' && msg.type !== 'stage_prompt' && msg.type !== 'deep_call_config_collection' && (
                      <div className="flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleFeedbackToggle(msg.id, 'adopted')}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] transition-all ${
                            msg.adoptedStatus === 'adopted'
                              ? 'bg-emerald-100 text-emerald-700 font-semibold'
                              : 'hover:bg-gray-100 text-gray-500'
                          }`}
                          title="点赞"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>点赞</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedbackToggle(msg.id, 'rejected')}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] transition-all ${
                            msg.adoptedStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-700 font-semibold'
                              : 'hover:bg-gray-100 text-gray-500'
                          }`}
                          title="点踩"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          <span>点踩</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Avatar */}
                {isStudent && (
                  <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    林
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking / Live ReAct working process */}
          {isThinking && (
            <div className="flex space-x-3 items-start max-w-4xl">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-xs mt-0.5">
                <Bot className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div className="max-w-[90%] sm:max-w-[85%] w-full">
                {liveReAct?.active && liveReAct.process ? (
                  <div className="rounded-2xl p-3.5 bg-white border border-blue-200/80 shadow-xs rounded-bl-xs">
                    <ReActProcessView 
                      process={liveReAct.process} 
                      isLive={true} 
                      currentLivePhase={liveReAct.currentPhase} 
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-white border border-gray-200/80 text-xs text-gray-500 rounded-bl-xs shadow-xs">
                    <Bot className="h-4 w-4 text-blue-600 animate-spin" />
                    <span>AI 备赛教练正在思考与检索知识库...</span>
                  </div>
                )}
              </div>
            </div>
          )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Docked ChatComposer: Permanently fixed to the bottom */}
          <div className="sticky bottom-0 px-4 sm:px-6 py-3 sm:py-4 bg-[#FBFBFC] flex-shrink-0 flex justify-center border-0 border-none z-0">
            <div className="w-full max-w-4xl">
              {autoPromptHint && (
                <div className="mb-2.5 flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 text-blue-950 text-xs shadow-2xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse flex-shrink-0" />
                    <span className="font-medium truncate">{autoPromptHint}</span>
                  </div>
                  <button
                    onClick={() => setAutoPromptHint(null)}
                    className="text-blue-600 hover:text-blue-900 text-[10px] font-mono ml-2 underline flex-shrink-0"
                  >
                    关闭提示
                  </button>
                </div>
              )}

              <ChatComposer
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={handleSendMessage}
                isThinking={isThinking}
                spaces={spaces}
                activeSpace={activeSpace}
                activeSpaceId={activeSpaceId || (activeSpace?.id || 'none')}
                onSelectSpace={onSelectSpace || (() => {})}
                onCreateSpace={onCreateSpace || (() => {})}
                selectedAgentId={selectedAgentId}
                onSelectAgent={setSelectedAgentId}
                selectedSkillIds={selectedSkillIds}
                onToggleSkill={handleToggleSkill}
                selectedMcpIds={selectedMcpIds}
                onToggleMcp={handleToggleMcp}
                onOpenFlywheelModal={() => setShowFlywheelModal(true)}
                isNewSessionMode={messages.length === 0}
                availableFiles={sharedFiles}
                mentionedFiles={mentionedFiles}
                onAddMentionFile={handleAddMentionFile}
                onRemoveMentionFile={handleRemoveMentionFile}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COLUMN 4: SHARED WORKSPACE DRAWER (Legacy drawer)             */}
      {/* ------------------------------------------------------------- */}
      <SharedWorkspaceDrawer
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        currentUniversity={selectedUniversity}
        currentSpace={activeSpace}
        actionItems={actionItems}
        onToggleActionItem={handleToggleActionItem}
        files={sharedFiles}
        onDeleteFile={handleDeleteSharedFile}
        mentionedFileIds={mentionedFiles.map(f => f.id)}
        onToggleMentionFile={handleToggleMentionFile}
        onNavigateToDiagnosis={() => {
          setIsWorkspaceOpen(false);
          handleTriggerAction('diagnosis');
        }}
        onNavigateToMockQA={() => {
          setIsWorkspaceOpen(false);
          handleTriggerAction('mockqa');
        }}
        onSimulateUploadBP={() => {
          setBpUploaded(true);
          handleTriggerAction('diagnosis');
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* ACT 7: OPERATION FLYWHEEL MODAL                               */}
      {/* ------------------------------------------------------------- */}
      <OperationFlywheelModal
        isOpen={showFlywheelModal}
        onClose={() => setShowFlywheelModal(false)}
      />

      {/* ------------------------------------------------------------- */}
      {/* 4.1 ↔ 4.2 / 4.3 CROSS-MODULE DEEP CALL MODALS                 */}
      {/* ------------------------------------------------------------- */}
      <DeepCallConfirmModal
        isOpen={showDeepConfirmModal}
        onClose={() => setShowDeepConfirmModal(false)}
        onConfirm={handleConfirmDeepCallModal}
        targetModule={deepCallTarget}
        projectName={activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统'}
        userPromptText={deepCallActionName}
      />

      <DeepCallExecutionModal
        isOpen={showDeepExecutionModal}
        onFinish={handleDeepExecutionComplete}
        onAbort={handleCancelDeepCall}
        targetModule={deepCallTarget}
        projectName={activeSpace?.name || '智耘农业——基于低空多光谱的茶园精准病虫害防控系统'}
        inputPayload={currentInputPayload}
      />
    </div>
  );
}
