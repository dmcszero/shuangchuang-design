import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ProjectItem, 
  UserSession 
} from '../types';
import { 
  STANDARD_12_CHAPTERS, 
  INITIAL_STAGE_ITEMS, 
  SAMPLE_BP_CONTENT, 
  SAMPLE_VERSIONS, 
  SAMPLE_TRIAGE, 
  SAMPLE_DIAGNOSIS, 
  SAMPLE_ASSESSMENT, 
  INITIAL_COACH_SESSIONS, 
  INITIAL_COACH_MESSAGES 
} from './guidance/guidanceMockData';
import { 
  ProjectVersion, 
  CoachSessionItem, 
  CoachMessageItem, 
  StageProgressItem,
  GuidanceTaskContext 
} from './guidance/guidanceTypes';
import { GuidanceVersionDiffModal } from './guidance/GuidanceModals';
import { 
  FileText, 
  GitBranch, 
  History, 
  Bot, 
  Save, 
  Flag, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  TrendingUp, 
  Send, 
  Eye, 
  Edit3, 
  AlertCircle, 
  Check, 
  Award, 
  FileCheck, 
  X,
  RotateCcw,
  Target
} from 'lucide-react';

interface SceneGuidanceWorkbenchProps {
  projects: ProjectItem[];
  selectedProject: ProjectItem | null;
  onSelectProject: (project: ProjectItem) => void;
  session: UserSession;
  /** 跨页任务上下文（项目工作台·动态待办 → 工作台执行，0908-16 跳转闭环） */
  taskContext?: GuidanceTaskContext | null;
  onDismissTask?: () => void;
  onTaskCompleted?: (taskId: string) => void;
}

type CenterTab = 'bp' | 'diag' | 'score';

export const SceneGuidanceWorkbench: React.FC<SceneGuidanceWorkbenchProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  session,
  taskContext,
  onDismissTask,
  onTaskCompleted,
}) => {
  // Active Project (fallback to first available or default)
  const currentProject = selectedProject || projects[0] || {
    id: 'p-default',
    title: '面向晶圆级高精度光学缺陷检测系统',
    track: '高教主赛道',
    status: '备赛中',
    leader: '李林峰',
    score: 91,
    members: []
  };

  // State（0908-16：左栏移除后，仅保留中栏三 tab + 右栏 AI 单主体）
  const [centerTab, setCenterTab] = useState<CenterTab>('bp');
  const [bpMode, setBpMode] = useState<'preview' | 'edit'>('preview');
  const [bpContent, setBpContent] = useState<string>(SAMPLE_BP_CONTENT);
  const [activeChapterId, setActiveChapterId] = useState<string>('5');

  // Versions State
  const [versions, setVersions] = useState<ProjectVersion[]>(SAMPLE_VERSIONS);
  const [currentVersionId, setCurrentVersionId] = useState<string>('v2.0.0-rc');

  // 版本历史抽屉 + 快照只读预览（0908-16：版本快照保留在工作台，顶栏按钮 + 右缘抽屉）
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [viewingVersionId, setViewingVersionId] = useState<string | null>(null);

  const [stageProgress] = useState<StageProgressItem[]>(INITIAL_STAGE_ITEMS);

  // AI Coach Chat State
  const [chatCollapsed, setChatCollapsed] = useState<boolean>(false);
  const [coachIntent, setCoachIntent] = useState<string>('L4');
  const [sessions, setSessions] = useState<CoachSessionItem[]>(INITIAL_COACH_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string | number>(1);
  const [messages, setMessages] = useState<CoachMessageItem[]>(INITIAL_COACH_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Modals State
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [saveSuccessTip, setSaveSuccessTip] = useState(false);

  // Chapter Click in BP
  const handleSelectChapter = (chId: string) => {
    setActiveChapterId(chId);
    setCenterTab('bp');
  };

  // 任务上下文联动：章节直达 + AI 预填引导（0908-16 跳转闭环）
  const prefiledTaskIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!taskContext || prefiledTaskIdRef.current === taskContext.taskId) return;
    prefiledTaskIdRef.current = taskContext.taskId;
    if (taskContext.chapterId) {
      setActiveChapterId(taskContext.chapterId);
      setCenterTab('bp');
    }
    setMessages(prev => [...prev, {
      id: `task-${taskContext.taskId}`,
      role: 'assistant' as const,
      content: `收到，我们正在处理待办【${taskContext.title}】（来源：${taskContext.sourceLabel}）。${taskContext.chapterId ? `已为你定位到第 ${taskContext.chapterId} 章，` : ''}需要我先列出该章节的提分检查清单，还是直接基于当前版本生成修改草稿？`,
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['列出该章节提分检查清单', '基于当前版本生成修改草稿', '查看历史版本中的相关论述']
    }]);
  }, [taskContext]);

  // 跳转任务关联章节
  const jumpToTaskChapter = () => {
    if (taskContext?.chapterId) {
      setActiveChapterId(taskContext.chapterId);
      setCenterTab('bp');
    }
  };

  // 完成任务并回写项目工作台·动态待办
  const handleCompleteTask = () => {
    if (taskContext) {
      onTaskCompleted?.(taskContext.taskId);
      alert(`任务【${taskContext.title}】已完成，并已回写项目工作台·动态待办！`);
    }
  };

  // Save Snapshot
  const handleSaveSnapshot = () => {
    const newVerId = `v2.0.${versions.length}`;
    const newVer: ProjectVersion = {
      versionId: newVerId,
      versionType: 'snapshot',
      label: `${newVerId} (手动快照)`,
      source: 'manual',
      scoreVersionId: `s${versions.length + 1}`,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      total: 91,
      commitMsg: '保存商业计划书当前修改草稿与数据测算快照。',
      branchName: 'main'
    };
    setVersions([newVer, ...versions]);
    setCurrentVersionId(newVerId);
    setSaveSuccessTip(true);
    setTimeout(() => setSaveSuccessTip(false), 2500);
  };

  // Mark Milestone
  const handleMarkMilestone = () => {
    const newVerId = `v2.1.0-M`;
    const newVer: ProjectVersion = {
      versionId: newVerId,
      versionType: 'milestone',
      label: `${newVerId} (国赛攻坚里程碑)`,
      source: 'milestone',
      scoreVersionId: `s${versions.length + 1}`,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      total: 92,
      commitMsg: '已完成12章全要素打磨与两家头部上市客户POC协议锁定，正式标定为国赛里程碑！',
      branchName: 'main'
    };
    setVersions([newVer, ...versions]);
    setCurrentVersionId(newVerId);
    alert('已成功锁定当前版本为【国赛攻坚里程碑】，并已同步记录至项目全息大事记！');
  };

  // AI Send Message
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isAiThinking) return;

    const userMsg: CoachMessageItem = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiThinking(true);

    setTimeout(() => {
      let replyContent = '';
      let diffData: any = null;

      if (text.includes('第5章') || text.includes('竞争') || text.includes('壁垒')) {
        replyContent = `针对【第5章 竞争分析与护城河】，我从国赛评委的角度为你做深度反制推演：

1. **评委刁钻质询点**：“基恩士、康耐视都是百亿美元巨头，若他们将价格腰斩50%，你们的生存空间在哪里？”
2. **黄金破局答辩口径**：
   - **MES协议绑定壁垒**：半导体晶圆制造对于“换型停线”零容忍，替换一套检测系统导致的停线验证成本超200万元；
   - **私有光谱数据飞轮**：我们已在长三角两家客户沉淀200万+张特异性光谱缺陷训练集，国外标准算法无法直接适配特色封装；
   - **2小时本土驻厂响应**：海外工程师签证及备件周期长达2-4周，我们承诺长三角2小时内工程师到场。

我已为你撰写了针对第5章的【防守反击增强段落】，你可以点击下方按钮一键应用替换到商业计划书！`;
        diffData = {
          chapterId: '5',
          chapterName: '第5章 竞争分析与护城河',
          replacement: `\n### 5.4 极端竞争压力下的三道硬核反制壁垒\n面对国际巨头潜在的价格战反扑，本项目已建立非对称防御体系：\n1. **MES协议与自动化分选深度联锁**：客户替换设备将面临超过200万元的产线停工验证损耗；\n2. **200万张专有私有缺陷光谱数据飞轮**：形成高精度自适应学习壁垒；\n3. **7×24小时2小时本土极速驻厂响应**：彻底击破海外厂商备件周期长的致命短板。`
        };
      } else if (text.includes('财务') || text.includes('第10章') || text.includes('账期')) {
        replyContent = `关于【第10章 财务预测与账期压力测试】：
评委最忌讳“学生做财务假设过于理想化”。已为你量化补充半导体行业“长达6-9个月验收账期”的极端压力模型：
- 本轮1500万融资预留400万作为极端账期流动性缓冲区；
- 加上长三角两家封测上市龙头已到账的65万元POC开发费，即使未来9个月应收账款延期，公司现有现金流仍可维持正常研产24个月以上。`;
      } else if (text.includes('待办') || text.includes('任务')) {
        replyContent = `已为你自动梳理当前【L4 打磨优化】冲刺阶段的3条核心团队待办：
1. [技术组] 校核200万张缺陷光谱图谱的独占授权背书说明；
2. [商业组] 确认两家封测厂POC首期款银行到账回执作为申报书附录；
3. [路演组] 针对8分钟演讲词开展2次脱稿全真录像。
是否一键将这些任务同步下发至左侧任务待办栏？`;
      } else {
        replyContent = `已收到你的需求！我正基于【${coachIntent}】阶段指引，结合当前项目的国家重点战略属性与前沿光学检测指标进行综合推演。在双创大赛评审中，首要原则是“言之有据、自圆其说、突出学生主体贡献与导师关键领衔”。如需针对特定章节润色，请直接告诉我章节号（如第3章技术突破或第10章三表模型）。`;
      }

      const aiReply: CoachMessageItem = {
        id: Date.now() + 1,
        role: 'assistant',
        content: replyContent,
        createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        suggestedDiff: diffData,
        suggestions: [
          '帮我润色第3章核心技术第一性原理',
          '根据2026大赛新规优化第12章社会效益',
          '查看专家对标基恩士的核心质询话术'
        ]
      };

      setMessages(prev => [...prev, aiReply]);
      setIsAiThinking(false);
    }, 900);
  };

  // Apply AI Diff to BP
  const handleApplyDiff = (diff: { chapterId: string; chapterName: string; replacement: string }) => {
    setBpContent(prev => prev + '\n' + diff.replacement);
    setBpMode('preview');
    setCenterTab('bp');
    alert(`已成功将 AI 优化的【${diff.chapterName}】专属反制论证增补至商业计划书中！`);
  };

  // 版本抽屉开关
  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  // 选中历史快照 → 中栏只读预览联动
  const handlePreviewVersion = (ver: ProjectVersion) => {
    if (ver.versionId === currentVersionId) {
      setViewingVersionId(null);
      return;
    }
    setViewingVersionId(ver.versionId);
  };

  // 退出快照预览
  const exitViewSnapshot = () => setViewingVersionId(null);

  // 回滚到指定版本
  const handleRollbackTo = (ver: ProjectVersion) => {
    if (window.confirm(`确认回滚到【${ver.label}】？当前未保存的修改将丢弃（示例 mock）。`)) {
      setCurrentVersionId(ver.versionId);
      setViewingVersionId(null);
      alert(`已回滚至 ${ver.versionId}，可继续编辑并另存新快照。`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden select-none font-sans text-slate-800">
      {/* ================= 1. Top Global Guidance Bar ================= */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-4 min-w-0">
          {/* Project Tag */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              BP
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm truncate max-w-xs md:max-w-md">
                  {currentProject.title}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                  {currentProject.track}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  国赛攻坚金奖梯队 (91分)
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                负责人：{currentProject.leader} · 主导类型：{SAMPLE_TRIAGE.primaryType} · 版本：{currentVersionId}
              </div>
            </div>
          </div>

          {/* L1~L6 Stage Stepper in Top Bar */}
          <div className="hidden xl:flex items-center gap-1 pl-4 border-l border-slate-200">
            {stageProgress.map((st) => {
              const isCurrent = st.stage === 'L4';
              const isDone = st.status === 'done';
              return (
                <div 
                  key={st.stage}
                  onClick={() => setCenterTab('diag')}
                  title={st.hint}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="font-mono">{st.stage}</span>}
                  <span>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          {saveSuccessTip && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              已存为新快照
            </span>
          )}

          <button
            onClick={handleSaveSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="将当前商业计划书内容与模型保存为历史快照"
          >
            <Save className="w-3.5 h-3.5 text-indigo-600" />
            <span>保存快照</span>
          </button>

          <button
            onClick={handleMarkMilestone}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            title="锁定当前阶段成果并标记为大赛里程碑"
          >
            <Flag className="w-3.5 h-3.5 text-amber-600" />
            <span>标为里程碑</span>
          </button>

          <button
            onClick={() => setDiffModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="对比不同快照版本之间的修改"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-600" />
            <span>版本对比</span>
          </button>

          <button
            onClick={toggleDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
              drawerOpen
                ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
            }`}
            title="打开版本历史与快照抽屉"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>版本历史</span>
          </button>
        </div>
      </div>

      {/* ================= 1.5 任务上下文条（项目工作台跳转带入，0908-16） ================= */}
      {taskContext && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2.5 text-xs text-amber-900 flex-shrink-0 z-10">
          <Target className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>正在执行任务：</span>
          <b className="truncate max-w-md">{taskContext.title}</b>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 whitespace-nowrap">
            {taskContext.sourceLabel}
          </span>
          {taskContext.chapterId && (
            <button
              onClick={jumpToTaskChapter}
              className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-800 text-[11px] hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              → 跳转关联章节
            </button>
          )}
          <button
            onClick={handleCompleteTask}
            className="px-2 py-0.5 rounded-md bg-emerald-600 border border-emerald-600 text-white text-[11px] hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            完成并回写待办
          </button>
          <button
            onClick={() => onDismissTask?.()}
            className="ml-auto p-0.5 rounded text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
            title="关闭任务条"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================= 1.6 快照只读预览提示条（选中历史快照联动） ================= */}
      {viewingVersionId && (
        <div className="bg-slate-800 text-white px-4 py-1.5 flex items-center gap-2.5 text-xs flex-shrink-0 z-10">
          <Eye className="w-3.5 h-3.5 text-amber-300" />
          <span>
            正在查看快照 <b className="font-mono">{viewingVersionId}</b>（只读预览）
            {versions.find(v => v.versionId === viewingVersionId)?.total != null && (
              <span className="ml-1.5 text-emerald-300 font-mono">
                {versions.find(v => v.versionId === viewingVersionId)?.total} 分
              </span>
            )}
          </span>
          <button
            onClick={exitViewSnapshot}
            className="ml-auto px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            返回当前编辑
          </button>
        </div>
      )}

      {/* ================= 2. Two-Column Main Container（中 + 右，0908-16） ================= */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* ================= Center Main Column (Tabs & Workspace) ================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Center Tabs Bar */}
          <div className="h-10 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto h-full">
              <button
                onClick={() => setCenterTab('bp')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  centerTab === 'bp'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>商业计划书 (BP 12章)</span>
              </button>

              <button
                onClick={() => setCenterTab('diag')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  centerTab === 'diag'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>全维诊断报告</span>
              </button>

              <button
                onClick={() => setCenterTab('score')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  centerTab === 'score'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>六维评分详情</span>
              </button>
            </div>

            {/* Center Tab Actions（快照查看态禁用编辑与导出） */}
            {centerTab === 'bp' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBpMode(m => m === 'preview' ? 'edit' : 'preview')}
                  disabled={!!viewingVersionId}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {bpMode === 'preview' ? <Edit3 className="w-3 h-3 text-indigo-600" /> : <Eye className="w-3 h-3 text-indigo-600" />}
                  <span>{bpMode === 'preview' ? '切换源码编辑' : '切换排版预览'}</span>
                </button>

                <button
                  onClick={() => alert('已成功导出国赛标准申报格式 Markdown 与 PDF 归档文档包！')}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="导出计划书"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 12 Chapters Navigation Bar (Visible when in BP tab) */}
          {centerTab === 'bp' && (
            <div className="h-8 bg-white border-b border-slate-200 px-3 flex items-center gap-1 overflow-x-auto text-[11px] flex-shrink-0">
              <span className="text-slate-400 font-medium mr-1 whitespace-nowrap">章节速达:</span>
              {STANDARD_12_CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(ch.id)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    activeChapterId === ch.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {ch.id}. {ch.name}
                </button>
              ))}
            </div>
          )}

          {/* Center Workspace Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            {/* TAB 1: BP Editor & Preview（快照查看态为只读预览） */}
            {centerTab === 'bp' && (
              <div className="h-full flex flex-col p-6 max-w-5xl mx-auto">
                {bpMode === 'edit' && !viewingVersionId ? (
                  <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                      <span className="font-mono">Markdown 源码编辑模式 · 实时字数：{bpContent.length} 字</span>
                      <span>按 Ctrl+S 或点击右上角保存快照</span>
                    </div>
                    <textarea
                      value={bpContent}
                      onChange={(e) => setBpContent(e.target.value)}
                      readOnly={!!viewingVersionId}
                      className={`flex-1 p-6 font-mono text-xs text-slate-800 focus:outline-none resize-none leading-relaxed ${viewingVersionId ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                      placeholder="在此直接编辑商业计划书..."
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6 text-slate-800 text-xs leading-relaxed">
                    {/* Chapter Header Banner */}
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]">
                            重点章节
                          </span>
                          <h3 className="font-bold text-indigo-950 text-sm">
                            第 {activeChapterId} 章：{STANDARD_12_CHAPTERS.find(c => c.id === activeChapterId)?.name}
                          </h3>
                        </div>
                        <p className="text-indigo-800/80 text-xs">
                          {STANDARD_12_CHAPTERS.find(c => c.id === activeChapterId)?.hint}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSendMessage(`请帮我针对第${activeChapterId}章提出3条国赛评委视角的提分修改建议`)}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI 深度诊断此章
                      </button>
                    </div>

                    {/* Styled Markdown Reader Content */}
                    <div className="prose prose-slate max-w-none space-y-4">
                      {bpContent.split('\n\n').map((para, i) => {
                        if (para.startsWith('# ')) {
                          return (
                            <h1 key={i} className="text-xl font-extrabold text-slate-900 border-b border-slate-200 pb-3">
                              {para.replace('# ', '')}
                            </h1>
                          );
                        }
                        if (para.startsWith('## ')) {
                          const isHighlighted = para.includes(`${activeChapterId}.`);
                          return (
                            <div key={i} className={isHighlighted ? 'p-2 -mx-2 rounded-lg bg-amber-50/60 border-l-4 border-amber-500' : ''}>
                              <h2 className="text-base font-bold text-slate-800 mt-6 mb-2">
                                {para.replace('## ', '')}
                              </h2>
                            </div>
                          );
                        }
                        if (para.startsWith('- ')) {
                          return (
                            <ul key={i} className="list-disc pl-5 space-y-1 text-slate-700">
                              {para.split('\n').map((item, j) => (
                                <li key={j}>{item.replace('- ', '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={i} className="text-slate-700 leading-relaxed">
                            {para}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Diagnostic & Triage Report */}
            {centerTab === 'diag' && (
              <div className="p-6 max-w-5xl mx-auto space-y-6">
                {/* Triage Innovation Classification Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">大赛创新类型智能分诊 (AI Triage)</h3>
                        <p className="text-xs text-slate-500">依据教育部参赛指引，精准匹配项目核心赛道属性</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      主导类型：{SAMPLE_TRIAGE.primaryType} (置信度 88%)
                    </span>
                  </div>

                  {/* Confidence Breakdown Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    {Object.entries(SAMPLE_TRIAGE.confidence).map(([k, v]) => (
                      <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex justify-between font-medium text-slate-700 mb-1">
                          <span>{k}</span>
                          <span className="font-mono font-bold text-indigo-600">{Math.round(v * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: `${v * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Evidence Quotes */}
                  <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 text-xs">
                    <span className="font-semibold text-indigo-900">申报书原文萃取佐证：</span>
                    {SAMPLE_TRIAGE.evidence.map((ev, i) => (
                      <div key={i} className="text-indigo-800 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>[{ev.type}] “{ev.quote}”</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Elements & Action Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Missing & Pitfalls */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>国赛评委高频死穴待补强项 ({SAMPLE_DIAGNOSIS.missing.length})</span>
                    </div>
                    <div className="space-y-2.5">
                      {SAMPLE_DIAGNOSIS.missing.map((it, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-amber-900 flex flex-col justify-between gap-2">
                          <p className="leading-relaxed">{it.text}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-amber-200/50">
                            <span className="text-[10px] font-semibold text-amber-700">关联：第{it.chapterId}章</span>
                            <button
                              onClick={() => {
                                setActiveChapterId(it.chapterId);
                                setCenterTab('bp');
                              }}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>前往补全</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Step Action items */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>专家推荐下一步最优演进路径 ({SAMPLE_DIAGNOSIS.nextSteps.length})</span>
                    </div>
                    <div className="space-y-2.5">
                      {SAMPLE_DIAGNOSIS.nextSteps.map((it, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/70 text-indigo-950 flex flex-col justify-between gap-2">
                          <p className="leading-relaxed">{it.text}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-indigo-200/50">
                            <span className="text-[10px] font-semibold text-indigo-700">紧急程度：高</span>
                            <button
                              onClick={() => handleSendMessage(`请协助我执行优化动作：${it.text}`)}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>让 AI 执行</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Score Details & Radar Matrix */}
            {centerTab === 'score' && (
              <div className="p-6 max-w-5xl mx-auto space-y-6 text-xs">
                {/* Top Score Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-100">
                      <span className="text-3xl font-black font-mono">{SAMPLE_ASSESSMENT.total}</span>
                      <span className="text-[10px] tracking-wider opacity-90">当前基准分</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{SAMPLE_ASSESSMENT.scorecardName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          国赛金奖候选池 (TOP 3%)
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        基于 2026 大赛最新六维标准（创新性、技术成熟度、商业模式闭环、团队协同、表现力、社会价值）
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">相对校赛基线版提分</div>
                      <div className="text-lg font-black text-emerald-600 font-mono">+18 分 ↑</div>
                    </div>
                  </div>
                </div>

                {/* 6 Dimensions Radar Bars */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {Object.entries(SAMPLE_ASSESSMENT.dimensionScores).map(([dim, score]) => (
                    <div key={dim} className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
                      <div className="text-slate-500 text-[11px] font-medium">{dim}</div>
                      <div className="text-xl font-bold font-mono text-indigo-700">{score}</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div 
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Itemized Score Breakdown Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    评审细项采分点与增量归因
                  </div>
                  <div className="divide-y divide-slate-100">
                    {SAMPLE_ASSESSMENT.items.map(itm => (
                      <div key={itm.itemId} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{itm.itemText}</span>
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-medium">
                              {itm.dimension}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{itm.reason}</p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-slate-800">{itm.currentScore}</span>
                            <span className="text-slate-400 font-mono text-[11px]"> / {itm.cap}分</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            +{itm.delta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: 文件查看器已随材料资产迁出工作台（→ 会话模块右侧独立工作区 + 项目工作台·项目文件夹，0908-16） */}
          </div>

          {/* Center Bottom Status Bar */}
          <div className="h-7 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
            <div className="flex items-center gap-4">
              <span>📁 {currentProject.title}</span>
              <span>•</span>
              <span>赛道：{currentProject.track}</span>
              <span>•</span>
              <span>主导创新：{SAMPLE_TRIAGE.primaryType}</span>
              <span>•</span>
              <span>字数：{bpContent.length} 字</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 font-medium">AI 全链路中枢联机就绪</span>
            </div>
          </div>
        </div>

        {/* ================= Right Column: AI Coach Interactive Panel（单主体，抽屉打开时被覆盖） ================= */}
        <div 
          className={`w-80 lg:w-96 bg-slate-50/90 border-l border-slate-200 flex flex-col flex-shrink-0 transition-opacity duration-200 ${
            drawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-3 px-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">AI 备赛伴学教练</h3>
                    <p className="text-[10px] text-slate-400">评委级视角 · 全生命周期靶向指导</p>
                  </div>
                </div>
              </div>

              {/* Coach Intent：阶段徽章（0908-16：下拉选择器简化为阶段快捷徽章） */}
              <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center gap-1.5 text-[11px] overflow-x-auto flex-shrink-0">
                <span className="text-slate-500 whitespace-nowrap">意图聚焦:</span>
                {stageProgress.map(st => (
                  <button
                    key={st.stage}
                    onClick={() => setCenterTab('diag')}
                    title={st.hint}
                    className={`px-1.5 py-0.5 rounded whitespace-nowrap cursor-pointer transition-colors font-medium ${
                      st.stage === 'L4'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {st.stage}
                  </button>
                ))}
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Diff Replacement Button if provided */}
                      {msg.suggestedDiff && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                          <span className="text-[10px] text-indigo-600 font-semibold">
                            💡 包含针对【{msg.suggestedDiff.chapterName}】专属反制优化：
                          </span>
                          <button
                            onClick={() => handleApplyDiff(msg.suggestedDiff!)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            一键应用至计划书对应章节
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.createdAt}</span>

                    {/* Suggestions bubbles */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1.5 w-full">
                        <span className="text-[10px] text-slate-400 block px-1">点击快捷向教练提问：</span>
                        {msg.suggestions.map((sug, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSendMessage(sug)}
                            className="p-2 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl text-slate-700 hover:text-indigo-700 text-xs transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                          >
                            <span className="line-clamp-1">{sug}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 p-2 bg-indigo-50 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                    <span>AI 教练正在结合评委标准深度推演...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="输入问题或章节打磨诉求..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isAiThinking}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
        </div>

        {/* ================= 版本历史右缘抽屉（0908-16：顶栏按钮触发，覆盖右栏） ================= */}
        {drawerOpen && (
          <div
            className="absolute inset-0 z-30 bg-slate-900/20"
            onClick={toggleDrawer}
          />
        )}
        <div
          className={`absolute top-0 right-0 bottom-0 z-40 w-[380px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-200 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-3.5 px-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-600" />
                版本历史与快照
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">选中快照可在中栏只读预览 · 双版本可对比 diff</p>
            </div>
            <button
              onClick={toggleDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="关闭抽屉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Tools */}
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setDiffModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5" />
              对比所选两版
            </button>
            <button
              onClick={handleSaveSnapshot}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-indigo-600" />
              存为快照
            </button>
          </div>

          {/* Drawer Body: Version Timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {versions.map(ver => {
              const isCurrent = ver.versionId === currentVersionId;
              const isViewing = ver.versionId === viewingVersionId;
              return (
                <div
                  key={ver.versionId}
                  onClick={() => handlePreviewVersion(ver)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs'
                      : isViewing
                      ? 'bg-amber-50 border-amber-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        ver.versionType === 'milestone' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                      <span className="font-bold text-slate-800 text-xs truncate">{ver.label}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">当前编辑中</span>
                      )}
                      {isViewing && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">预览中</span>
                      )}
                    </div>
                    {ver.total != null && (
                      <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
                        {ver.total}分
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 my-1">
                    {ver.commitMsg}
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <span>{ver.createdAt}</span>
                    <span>分支: {ver.branchName || 'main'}</span>
                  </div>
                  {/* 快照行内操作 */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDiffModalOpen(true); }}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <GitBranch className="w-3 h-3" />
                      与当前对比
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRollbackTo(ver); }}
                        className="px-2 py-1 rounded-md text-[10px] font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        回滚到此版
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-slate-400 text-center pt-2">
              ↑ 点击快照行 → 中栏进入只读预览并联动顶部提示条
            </p>
          </div>
        </div>
      </div>

      {/* ================= Modals ================= */}
      <GuidanceVersionDiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        versions={versions}
        currentVersionId={currentVersionId}
      />
    </div>
  );
};
