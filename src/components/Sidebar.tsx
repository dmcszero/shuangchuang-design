import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  Layers, 
  Users, 
  CheckSquare, 
  Kanban, 
  UserCheck, 
  UsersRound, 
  BookOpen, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Target, 
  LogOut, 
  ChevronRight,
  ShieldCheck, 
  ChevronDown, 
  Database, 
  Award, 
  Building, 
  GraduationCap, 
  School, 
  Repeat,
  Bot,
  Cpu,
  MessageSquare,
  MessageSquarePlus,
  Folder,
  FolderKanban,
  Plus,
  PlusCircle,
  Trash2,
  X,
  Swords,
  Workflow,
  Search,
  Check,
  CheckCircle2,
  Presentation,
  PenTool,
  Image,
  Video
} from 'lucide-react';
import { UserSession, ProjectSpace, CoachSession, ProjectItem } from '../types';
import { cleanSessionTitle } from '../utils/titleUtils';

export type TabType = 
  | 'cockpit' 
  | 'screening' 
  | 'mentorship' 
  | 'supervision' 
  | 'milestones'
  | 'mentors_pool'
  | 'knowledge_base'
  | 'users_management'
  | 'teams_management'
  | 'my_project'
  | 'coach'
  | 'guidance_workbench'
  | 'defense_training';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  session: UserSession;
  onLogout: () => void;
  onOpenBatchImport: () => void;
  onOpenReportExport: () => void;
  onOpenRulesConfig: () => void;
  // Sessions
  sessions?: CoachSession[];
  standaloneSessions?: CoachSession[];
  activeSpaceId?: string;
  activeSessionId?: string;
  onSelectSpace?: (spaceId: string) => void;
  onSelectSession?: (sessionId: string, legacySessionId?: string) => void;
  onCreateSpace?: (newSpace: { name: string; trackTag: string; school: string; leader: string }) => void;
  onCreateSession?: (legacySpaceId?: string) => void;
  onDeleteSession?: (sessionId: string, legacySessionId?: string) => void;
  // Global Project Selection for Team Member
  projects?: ProjectItem[];
  selectedProjectId?: string;
  onSelectProjectItem?: (projectId: string) => void;
  isCollapsed?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  session,
  onLogout,
  onOpenBatchImport,
  onOpenReportExport,
  onOpenRulesConfig,
  sessions,
  standaloneSessions = [],
  activeSessionId = '',
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  projects = [],
  selectedProjectId,
  onSelectProjectItem,
  isCollapsed = false,
}: SidebarProps) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(true);

  // All unified sessions
  const allSessions = sessions && sessions.length > 0 ? sessions : standaloneSessions;

  // Task icon helper for different task types
  const renderSessionTaskIcon = (sess: CoachSession, isActive: boolean) => {
    const type = sess.taskType;
    const key = sess.taskKey || '';
    const title = sess.title || '';

    if (type === 'defense' || key.includes('defense') || key.includes('grill') || title.includes('答辩') || title.includes('质询') || title.includes('考官')) {
      return <Swords className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-purple-600' : 'text-purple-500'}`} />;
    }
    if (type === 'bp' || key.includes('bp') || key.includes('diag') || title.includes('商业计划书') || title.includes('BP') || title.includes('体检')) {
      return <FileText className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-500'}`} />;
    }
    if (type === 'ppt' || title.toLowerCase().includes('ppt') || title.includes('路演') || title.includes('幻灯片')) {
      return <Presentation className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-amber-600' : 'text-amber-500'}`} />;
    }
    if (type === 'policy' || key.includes('task-1') || title.includes('政策') || title.includes('规则') || title.includes('评分标准') || title.includes('细则')) {
      return <BookOpen className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-emerald-500'}`} />;
    }
    if (type === 'market' || type === 'sheet' || key.includes('3-2') || title.includes('竞品') || title.includes('市场') || title.includes('调研') || title.includes('表格')) {
      return <BarChart3 className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-sky-500'}`} />;
    }
    if (type === 'benchmark' || key.includes('3-1') || title.includes('标杆') || title.includes('金奖') || title.includes('案例')) {
      return <Award className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-yellow-600' : 'text-yellow-500'}`} />;
    }
    if (type === 'knowledge' || key.includes('task-4') || title.includes('智库') || title.includes('知识库') || title.includes('算力')) {
      return <Database className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-indigo-500'}`} />;
    }
    if (type === 'writing' || title.includes('写作') || title.includes('文案') || title.includes('提炼') || title.includes('润色') || title.includes('速诊')) {
      return <PenTool className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-rose-500' : 'text-rose-400'}`} />;
    }
    if (type === 'image' || title.includes('图像') || title.includes('图片')) {
      return <Image className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-pink-500' : 'text-pink-400'}`} />;
    }
    if (type === 'video' || title.includes('视频')) {
      return <Video className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-teal-500'}`} />;
    }
    return <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />;
  };

  // Team Member Project Selector State
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    if (isProjectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProjectDropdownOpen]);

  const currentSelectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(p => {
    if (!projectSearchQuery.trim()) return true;
    const q = projectSearchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || 
           p.code.toLowerCase().includes(q) || 
           p.leader.toLowerCase().includes(q) ||
           p.trackLabel.toLowerCase().includes(q);
  });

  const handleChooseProject = (projectId: string) => {
    onSelectProjectItem?.(projectId);
    setIsProjectDropdownOpen(false);
    setProjectSearchQuery('');
  };

  // Role-based Nav configurations
  const getNavGroups = () => {
    if (session.role === 'team_member') {
      return [
        {
          groupName: 'AI伴学与答辩实训',
          items: [
            { id: 'coach' as TabType, label: '新建对话', icon: MessageSquarePlus },
            { id: 'my_project' as TabType, label: '项目工作台', icon: Target, badge: 'AI对标' },
            { id: 'guidance_workbench' as TabType, label: '全链路指导工作台', icon: Workflow, badge: 'L1~L6', highlight: true },
            { id: 'defense_training' as TabType, label: '模拟评审与答辩训练', icon: Swords, badge: '实训', highlight: false },
          ]
        },
      ];
    }

    if (session.role === 'mentor') {
      return [
        {
          groupName: '导师评审工作台',
          items: [
            { id: 'supervision' as TabType, label: '项目辅导与督导工单', icon: CheckSquare, badge: '问诊督导' },
          ]
        },
      ];
    }

    if (session.role === 'system_admin') {
      return [
        {
          groupName: '全平台资源与权限总控',
          items: [
            { id: 'mentors_pool' as TabType, label: '平台导师智库管理', icon: Award, badge: '国家级' },
            { id: 'knowledge_base' as TabType, label: '平台赛事知识库管理', icon: Database, badge: '全国库' },
          ]
        },
      ];
    }

    // school_admin gets full access
    return [
      {
        groupName: '决策中枢驾驶舱',
        items: [
          { id: 'cockpit' as TabType, label: '备赛数据驾驶舱', icon: BarChart3, badge: 'AI决策' },
        ]
      },
      {
        groupName: 'AI数智备赛',
        items: [
          { id: 'coach' as TabType, label: '新建对话', icon: MessageSquarePlus },
        ]
      },
      {
        groupName: '备赛培育核心',
        items: [
          { id: 'screening' as TabType, label: '智能对标初筛与排名', icon: Layers, badge: '2026细则' },
          { id: 'mentorship' as TabType, label: '常态化辅导与调度', icon: Users, badge: '排期' },
          { id: 'supervision' as TabType, label: '辅导资产沉淀与督导', icon: CheckSquare, badge: '闭环' },
          { id: 'milestones' as TabType, label: '重点项目全流程看板', icon: Kanban, badge: '5阶' },
        ]
      },
      {
        groupName: '校本智库与组织管理',
        items: [
          { id: 'mentors_pool' as TabType, label: '双创导师智库管理', icon: Award, badge: '专家库' },
          { id: 'knowledge_base' as TabType, label: session.university ? `${session.university}双创智库` : '学校知识库管理', icon: Database, badge: '校内智库' },
          { id: 'users_management' as TabType, label: '用户与权限管理', icon: UserCheck, badge: '全员' },
          { id: 'teams_management' as TabType, label: '项目团队架构管理', icon: UsersRound, badge: '合规' },
        ]
      },
    ];
  };

  const navGroups = getNavGroups();

  return (
    <aside 
      id="app-sidebar"
      className={`bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 select-none z-30 transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed 
          ? 'w-0 border-r-0 opacity-0 pointer-events-none' 
          : 'w-64 xl:w-72 opacity-100'
      }`}
    >
      <div className="w-64 xl:w-72 flex flex-col h-full shrink-0">
        {/* Sidebar Header: Logo & Platform Title & University Badge */}
      <div className="h-16 px-4 xl:px-5 border-b border-slate-200 flex items-center space-x-3 bg-white">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-sky-500/20 shrink-0">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div className="overflow-hidden min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-xs xl:text-sm tracking-tight text-slate-900 truncate">
              赛事打磨平台
            </span>
            <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-1 py-0.2 rounded font-medium shrink-0">
              2026
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 truncate">
            <span className="truncate">
              {session.role === 'team_member' && '【项目组成员】专属端'}
              {session.role === 'school_admin' && '【学校管理端】决策平台'}
              {session.role === 'mentor' && '【导师端】评审与问诊'}
              {session.role === 'system_admin' && '【Admin端】平台总管'}
            </span>
          </div>
        </div>
      </div>

      {/* Team Member: Global Project Selection Component */}
      {session.role === 'team_member' && (
        <div 
          className="px-3 py-2.5 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 relative z-30" 
          ref={projectDropdownRef}
        >
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-700">
              <FolderKanban className="h-3.5 w-3.5 text-sky-600" />
              <span>当前参赛项目 (全局联动)</span>
            </div>
            <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200/80 font-semibold px-1.5 py-0.2 rounded-full">
              共 {projects.length} 项
            </span>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            id="btn-global-project-selector"
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className={`w-full text-left rounded-xl p-2.5 transition-all border shadow-2xs group flex items-start justify-between ${
              isProjectDropdownOpen 
                ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-500/20' 
                : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                  {currentSelectedProject?.trackLabel || '主赛道'}
                </span>
                {currentSelectedProject?.stageName && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                    {currentSelectedProject.stageName}
                  </span>
                )}
                {currentSelectedProject?.grade && (
                  <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {currentSelectedProject.grade}级 · {currentSelectedProject.totalScore}分
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate leading-snug" title={currentSelectedProject?.name}>
                {currentSelectedProject?.name || '请选择参赛项目'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate flex items-center space-x-1.5">
                <span>负责人: {currentSelectedProject?.leader || '团队负责人'}</span>
                <span>•</span>
                <span>编号: {currentSelectedProject?.code || 'CX2026'}</span>
              </div>
            </div>
            <div className="shrink-0 pt-1">
              <div className={`p-1 rounded-md bg-slate-100 group-hover:bg-sky-100 transition-colors ${
                isProjectDropdownOpen ? 'bg-sky-100 text-sky-700' : 'text-slate-400 group-hover:text-sky-600'
              }`}>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isProjectDropdownOpen ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
          </button>

          {/* Dropdown Panel */}
          {isProjectDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[380px] animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Dropdown Header & Search */}
              <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">切换当前参赛项目</span>
                  <span className="text-slate-400 text-[10px]">全端各模块实时同步</span>
                </div>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    placeholder="搜索项目名称、编号或负责人..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    autoFocus
                  />
                  {projectSearchQuery && (
                    <button
                      onClick={() => setProjectSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Projects List */}
              <div className="overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-100/60 max-h-[260px]">
                {filteredProjects.map((proj) => {
                  const isCurrent = proj.id === currentSelectedProject?.id;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleChooseProject(proj.id)}
                      className={`p-2 rounded-xl cursor-pointer transition-all flex items-start justify-between group/pitem ${
                        isCurrent
                          ? 'bg-sky-50 border border-sky-200/80 text-sky-950 font-medium'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            isCurrent ? 'bg-sky-200/60 text-sky-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {proj.trackLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {proj.code}
                          </span>
                          {proj.grade && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200/60">
                              {proj.grade}级 · {proj.totalScore}分
                            </span>
                          )}
                        </div>
                        <div className={`text-xs font-semibold leading-snug line-clamp-2 ${
                          isCurrent ? 'text-sky-900 font-bold' : 'text-slate-800 group-hover/pitem:text-sky-700'
                        }`}>
                          {proj.name}
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                          <span>负责人: {proj.leader}</span>
                          <span>•</span>
                          <span>{proj.college}</span>
                        </div>
                      </div>
                      <div className="shrink-0 pt-2">
                        {isCurrent ? (
                          <div className="h-5 w-5 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-slate-200 group-hover/pitem:border-sky-400 flex items-center justify-center transition-colors">
                            <ChevronRight className="h-3 w-3 text-slate-300 group-hover/pitem:text-sky-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredProjects.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    未检索到匹配的参赛项目
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sidebar Nav Items (Scrollable Body) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <div className="px-3 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.groupName}
            </div>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isNewChatAction = item.id === 'coach';

                if (isNewChatAction) {
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-tab-${item.id}`}
                      onClick={() => {
                        onCreateSession?.();
                        setActiveTab('coach');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-left"
                      title="点击新建对话"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-semibold shadow-2xs border border-sky-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                        item.badge === 'Hero'
                          ? isActive
                            ? 'bg-sky-600 text-white font-bold'
                            : 'bg-sky-100 text-sky-800 font-bold border border-sky-200'
                          : item.badge === 'P0'
                            ? isActive
                              ? 'bg-rose-500 text-white font-bold'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                            : isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* 会话历史列表 (项目组成员 & 学校管理端可见，Admin端与导师端不展示) */}
        {(session.role === 'team_member' || session.role === 'school_admin') && (
          <div className="pt-3 border-t border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between px-1.5 py-1">
              <button
                onClick={() => setIsSessionsExpanded(!isSessionsExpanded)}
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                title="折叠/展开会话历史"
              >
                <span>会话历史 ({allSessions.length})</span>
                <ChevronDown 
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                    isSessionsExpanded ? '' : '-rotate-90'
                  }`} 
                />
              </button>
              <button
                onClick={() => {
                  onCreateSession?.();
                  setActiveTab('coach');
                }}
                className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                title="新建会话"
                id="btn-create-standalone-session"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {isSessionsExpanded && (
              <div className="space-y-0.5 mt-0.5">
                {allSessions.map((sess) => {
                  const isSessionActive = activeTab === 'coach' && sess.id === activeSessionId;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => {
                        onSelectSession?.(sess.id);
                        setActiveTab('coach');
                      }}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer group/sess ${
                        isSessionActive
                          ? 'bg-sky-50 text-sky-700 font-medium shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {renderSessionTaskIcon(sess, isSessionActive)}
                        <span className="truncate pr-1 text-xs" title={cleanSessionTitle(sess.title)}>
                          {cleanSessionTitle(sess.title)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <span className={`text-[10px] font-mono whitespace-nowrap ${
                          isSessionActive ? 'text-sky-600 font-medium' : 'text-slate-400'
                        }`}>
                          {sess.time}
                        </span>
                        {onDeleteSession && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(sess.id);
                            }}
                            className="opacity-0 group-hover/sess:opacity-100 p-0.5 hover:text-rose-600 rounded text-slate-400 transition-opacity"
                            title="删除会话"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {allSessions.length === 0 && (
                  <div className="px-2 py-2 text-[11px] text-slate-400 italic text-center">
                    暂无会话历史，点击 + 新建
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 常用捷径与工具 (导师端与Admin端不展示) */}
        {session.role !== 'mentor' && session.role !== 'system_admin' && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              备赛捷径与工具
            </div>
            <div className="space-y-1">
              <button
                id="sidebar-btn-rules"
                onClick={onOpenRulesConfig}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>2026官方评审细则</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              </button>

              {session.role === 'school_admin' && (
                <>
                  <button
                    id="sidebar-btn-import"
                    onClick={onOpenBatchImport}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <UploadCloud className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span>海量项目智能导入</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </button>

                  <button
                    id="sidebar-btn-report"
                    onClick={onOpenReportExport}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>阶段复盘汇报生成</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Personal Account at Bottom (展示当前登录端与高校) */}
      <div className="mt-auto border-t border-slate-200 p-3 bg-slate-50/80 relative">
        <div 
          id="sidebar-user-card"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={session.avatar}
                alt={session.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-800 truncate">{session.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium shrink-0 ${
                  session.role === 'team_member' ? 'bg-sky-100 text-sky-800' :
                  session.role === 'school_admin' ? 'bg-blue-100 text-blue-800' :
                  session.role === 'mentor' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {session.roleLabel}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center space-x-1">
                {session.university && (
                  <span className="font-medium text-slate-700 truncate">{session.university}</span>
                )}
                {session.college && (
                  <span className="truncate">· {session.college}</span>
                )}
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
        </div>

        {/* Account Menu Popover */}
        {showAccountMenu && (
          <div 
            id="sidebar-account-popover"
            className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="px-2.5 py-2 border-b border-slate-100">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>{session.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {session.account}
                </span>
              </div>
              {session.university && (
                <div className="text-[11px] text-sky-700 font-medium mt-1 flex items-center">
                  <Building className="h-3 w-3 mr-1 text-sky-600" />
                  所属高校：{session.university}
                </div>
              )}
              <div className="text-[11px] text-slate-400 mt-0.5">
                {session.majorOrTitle || session.college}
              </div>
            </div>

            <div className="py-1 space-y-0.5">
              <button 
                onClick={() => {
                  onLogout();
                  setShowAccountMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-sky-50 text-sky-700 transition text-left font-medium"
              >
                <Repeat className="h-3.5 w-3.5 text-sky-600" />
                <span>切换登录端 / 切换账号</span>
              </button>

              {(session.role === 'school_admin' || session.role === 'system_admin') && (
                <button 
                  onClick={() => {
                    setActiveTab('users_management');
                    setShowAccountMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition text-left"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                  <span>全员权限与角色分配</span>
                </button>
              )}
            </div>

            <div className="pt-1 border-t border-slate-100">
              <button 
                onClick={() => {
                  onLogout();
                  setShowAccountMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition text-left font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </aside>
  );
}
