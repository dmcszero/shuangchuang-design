import { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  UploadCloud, 
  ChevronRight, 
  ExternalLink,
  Users, 
  Sparkles, 
  HelpCircle, 
  ArrowUpRight,
  ShieldAlert,
  Send,
  Download,
  BookOpen,
  Calendar,
  Building,
  Target
} from 'lucide-react';
import { ProjectItem, SupervisionWorkOrder, UserSession } from '../types';
import { MOCK_PROJECT_TEAMS } from '../data/mockUsersAndTeams';
import {
  WORKBENCH_AI_TODOS,
  AI_GENERATED_FILES,
  FILE_SOURCE,
  PENDING_ARCHIVE_ITEMS,
  FILE_CHANGE_LOG,
  WorkbenchAiTodo,
  FileChangeEntry
} from './workbench/workbenchMockData';
import { GuidanceTodoItem, GuidanceTaskContext } from './guidance/guidanceTypes';
import {
  Bot,
  FolderTree,
  ClipboardList,
  History,
  UploadCloud as UploadCloudIcon,
  Inbox,
  ArrowRight
} from 'lucide-react';

interface ProjectMemberWorkbenchProps {
  session: UserSession;
  project: ProjectItem;
  workOrders: SupervisionWorkOrder[];
  onUpdateWorkOrder: (order: SupervisionWorkOrder) => void;
  onOpenRulesConfig: () => void;
  /** 点「去执行」→ 携带任务上下文跳转全链路指导工作台（0908-16 跳转闭环） */
  onExecuteTodo: (ctx: GuidanceTaskContext) => void;
}

export default function ProjectMemberWorkbench({
  session,
  project,
  workOrders,
  onUpdateWorkOrder,
  onOpenRulesConfig,
  onExecuteTodo,
}: ProjectMemberWorkbenchProps) {
  // Find project work orders
  const projectOrders = workOrders.filter(o => o.projectId === project.id);
  const currentTeam = MOCK_PROJECT_TEAMS.find(t => t.projectId === project.id) || MOCK_PROJECT_TEAMS[0];

  const [activeSubTab, setActiveSubTab] = useState<'todos' | 'tasks' | 'diagnostic' | 'team' | 'folder'>('todos');
  const [selectedOrder, setSelectedOrder] = useState<SupervisionWorkOrder | null>(projectOrders[0] || null);

  // 动态待办状态（AI 诊断来源池；专家工单来源复用 workOrders 的 tasks）
  const [aiTodos, setAiTodos] = useState<WorkbenchAiTodo[]>(WORKBENCH_AI_TODOS);
  const [todoFilter, setTodoFilter] = useState<'all' | 'ai' | 'wo'>('all');

  const handleToggleAiTodo = (id: string) => {
    setAiTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // 从章节引用映射到 BP 标准章编号（示例映射：用于跳转定位）
  const chapterIdFromRef = (ref?: string): string | undefined => {
    if (!ref) return undefined;
    const m = ref.match(/第(\d+)章/);
    return m ? m[1] : undefined;
  };

  // 点「去执行」→ 跳转全链路指导工作台
  const executeAiTodo = (td: GuidanceTodoItem) => {
    onExecuteTodo({
      taskId: td.id,
      title: td.title,
      source: 'ai',
      sourceLabel: 'AI 诊断生成',
      chapterId: chapterIdFromRef(td.chapterRef)
    });
  };

  const executeWorkOrderTask = (orderId: string, orderLabel: string, task: { id: string; title: string }) => {
    onExecuteTodo({
      taskId: `${orderId}:${task.id}`,
      title: task.title,
      source: 'workorder',
      sourceLabel: `专家工单 · ${orderLabel}`,
      chapterId: undefined
    });
  };

  // Student submission form state
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [newBpVersion, setNewBpVersion] = useState('v3.3_2026_Final.pdf');
  const [newPptVersion, setNewPptVersion] = useState('v4.1_Roadshow_Defense.pptx');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitDeliverable = (orderId: string) => {
    if (!submissionNotes.trim()) {
      alert('请填写修改重点说明后再提交！');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const order = workOrders.find(o => o.id === orderId);
      if (order) {
        const updated: SupervisionWorkOrder = {
          ...order,
          status: 'student_submitted',
          studentSubmission: {
            submissionDate: '2026-09-05',
            modificationNotes: submissionNotes,
            newBpVersion,
            newPptVersion,
            vcrUpdated: true,
          },
        };
        onUpdateWorkOrder(updated);
        setSelectedOrder(updated);
      }
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 600);
  };

  const handleToggleTaskDone = (orderId: string, taskId: string) => {
    const order = workOrders.find(o => o.id === orderId);
    if (!order) return;
    const updatedTasks = order.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const updatedOrder = { ...order, tasks: updatedTasks };
    onUpdateWorkOrder(updatedOrder);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updatedOrder);
    }
  };

  return (
    <div id="project-member-workbench" className="space-y-6">
      {/* Top Banner: Project Hero Header */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Background ambient pattern */}
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-sky-500/20 text-sky-200 border border-sky-400/30 px-2.5 py-0.5 rounded-full font-medium flex items-center">
                <Building className="h-3 w-3 mr-1" />
                {session.university || project.college}
              </span>
              <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full font-medium">
                {project.trackLabel}
              </span>
              <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-medium flex items-center">
                <Award className="h-3 w-3 mr-1" />
                {project.grade}档种子 · 综合得分 {project.totalScore}
              </span>
              <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-medium">
                当前阶段：{project.stageName} ({project.currentStage})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-sky-200/80">
              <span>项目编号：<span className="text-white font-mono">{project.code}</span></span>
              <span>负责人：<span className="text-white font-medium">{project.leader} ({session.roleLabel})</span></span>
              <span>指导老师：<span className="text-white font-medium">{project.advisor}</span></span>
              <span>已绑定辅导专家：<span className="text-amber-300 font-medium">{project.assignedMentorName || '赵元博（国赛资深专家）'}</span></span>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-6">
            <div className="text-left lg:text-right">
              <div className="text-xs text-sky-200">国赛金奖对标匹配度</div>
              <div className="text-2xl lg:text-3xl font-black text-amber-300 font-mono">
                {project.goldSimilarity}%
              </div>
              <div className="text-[11px] text-sky-300/80">AI 置信度 {project.aiConfidence}%</div>
            </div>

            <button
              onClick={onOpenRulesConfig}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition flex items-center border border-white/15"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-sky-300" />
              查看2026官方打分细则
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('todos')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'todos'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="h-3.5 w-3.5" />
          <span>动态待办 ({aiTodos.filter(t => !t.completed).length + projectOrders.reduce((n, o) => n + o.tasks.filter(t => !t.completed).length, 0)})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'tasks'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>专家辅导与督导工单 ({projectOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('diagnostic')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'diagnostic'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>2026国赛AI对标体检与短板</span>
        </button>

        <button
          onClick={() => setActiveSubTab('team')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'team'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>团队架构与合规审查</span>
        </button>

        <button
          onClick={() => setActiveSubTab('folder')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'folder'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="h-3.5 w-3.5" />
          <span>项目文件夹（大事记=文件更改记录）</span>
        </button>
      </div>

      {/* Tab Content 0: 动态待办（0908-16：AI 诊断 + 专家工单双来源统一池） */}
      {activeSubTab === 'todos' && (() => {
        const aiDone = aiTodos.filter(t => t.completed).length;
        const woTasks = projectOrders.flatMap(o => o.tasks.map(t => ({ order: o, task: t })));
        const woDone = woTasks.filter(({ task }) => task.completed).length;
        const totalTodos = aiTodos.length + woTasks.length;
        const doneTodos = aiDone + woDone;
        const progressPercent = Math.round((doneTodos / (totalTodos || 1)) * 100);
        return (
          <div className="space-y-4">
            {/* 顶部统计与进度 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                <div className="text-2xl font-black font-mono text-indigo-700">{aiTodos.length - aiDone}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5 text-indigo-500" />
                  AI 评分诊断生成的待办
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                <div className="text-2xl font-black font-mono text-sky-700">{woTasks.length - woDone}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-sky-500" />
                  后台专家下发的建议工单
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                <div className="text-2xl font-black font-mono text-emerald-600">{progressPercent}%</div>
                <div className="text-xs text-slate-500 mt-1">L4 阶段整体推进率</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-2xs text-xs text-amber-900 flex flex-col justify-between">
                <div className="flex items-center font-bold text-amber-800">
                  <Target className="h-4 w-4 mr-1.5 text-amber-600" />
                  执行方式
                </div>
                <p className="text-[11px] leading-relaxed mt-1.5">点击待办右侧「去执行」直达全链路指导工作台，携带任务上下文定位关联章节；完成后在工作台一键回写状态。</p>
              </div>
            </div>

            {/* 来源筛选 */}
            <div className="flex items-center gap-2">
              {([
                { key: 'all' as const, label: `全部 (${totalTodos})` },
                { key: 'ai' as const, label: `🤖 AI 诊断生成 (${aiTodos.length})` },
                { key: 'wo' as const, label: `👨‍🏫 专家工单 (${woTasks.length})` }
              ]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setTodoFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition ${
                    todoFilter === f.key
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* 双来源待办列表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* AI 诊断来源 */}
              {todoFilter !== 'wo' && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 border-b border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-indigo-500" />
                    AI 评分诊断生成
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">来源：全维诊断 · 2026 国赛体检</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {aiTodos.map(td => (
                      <div key={td.id} className={`px-4 py-3 flex items-start gap-2.5 ${td.completed ? 'bg-slate-50/50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={td.completed}
                          onChange={() => handleToggleAiTodo(td.id)}
                          className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold leading-relaxed ${td.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {td.title}
                          </div>
                          <div className="flex items-center flex-wrap gap-1.5 mt-1.5 text-[10px] text-slate-400">
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">AI 诊断</span>
                            <span className="font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{td.stage}</span>
                            {td.chapterRef && <span>{td.chapterRef}</span>}
                            {td.assignee && <span>责: {td.assignee}</span>}
                            {td.dueDate && <span>限期 {td.dueDate}</span>}
                            <span className={td.priority === 'high' ? 'text-rose-600 font-semibold' : ''}>{td.priority === 'high' ? '高优先级' : '普通'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => executeAiTodo(td)}
                          disabled={td.completed}
                          className={`self-center shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            td.completed
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {td.completed ? '已完结' : (<>去执行 <ArrowRight className="h-3 w-3" /></>)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 专家工单来源 */}
              {todoFilter !== 'ai' && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 border-b border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Users className="h-4 w-4 text-sky-500" />
                    后台专家下发的建议工单
                    <span className="text-[10px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">来源：常态化辅导 · 工单下发</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {woTasks.length === 0 && (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">当前项目暂无专家工单任务</div>
                    )}
                    {woTasks.map(({ order, task }) => (
                      <div key={`${order.id}:${task.id}`} className={`px-4 py-3 flex items-start gap-2.5 ${task.completed ? 'bg-slate-50/50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTaskDone(order.id, task.id)}
                          className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold leading-relaxed ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            [{task.category}] {task.title}
                          </div>
                          <div className="flex items-center flex-wrap gap-1.5 mt-1.5 text-[10px] text-slate-400">
                            <span className="font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">专家工单</span>
                            <span>工单 {order.id}</span>
                            <span>{order.mentorName} ({order.mentorTitle})</span>
                            <span className={task.priority === 'high' ? 'text-rose-600 font-semibold' : ''}>{task.priority === 'high' ? '高优先级' : '普通'} · 限期 {task.dueDays} 天</span>
                          </div>
                        </div>
                        <button
                          onClick={() => executeWorkOrderTask(order.id, order.mentorName, task)}
                          disabled={task.completed}
                          className={`self-center shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            task.completed
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-700 text-white'
                          }`}
                        >
                          {task.completed ? '已完结' : (<>去执行 <ArrowRight className="h-3 w-3" /></>)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Tab Content 1: Tasks & Supervision Work Orders */}
      {activeSubTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Work Order Selector & Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                辅导督导工单列表
              </h3>
              <div className="space-y-2.5">
                {projectOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const completedTasksCount = order.tasks.filter(t => t.completed).length;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span className="truncate">{order.mentorName} ({order.mentorTitle})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          order.status === 'expert_checked'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'student_submitted'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status === 'expert_checked' ? '专家已复核通过' : order.status === 'student_submitted' ? '已提交待复核' : '待团队整改交付'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>辅导时间：{order.sessionDate}</span>
                        <span>任务进度：{completedTasksCount}/{order.tasks.length}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className="bg-sky-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(completedTasksCount / (order.tasks.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center font-bold text-amber-800">
                <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-600" />
                2026大赛整改要求
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90">
                导师提出的整改清单将计入系统闭环率考核。请队长与核心成员在截止时间前完成材料更新，并上传修改要点说明以触发专家二次复核。
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Order, Tasks Checkbox & Submission */}
          <div className="lg:col-span-8 space-y-5">
            {selectedOrder ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      工单详情 · {selectedOrder.mentorName} 专家辅导纪要
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      辅导形式：{selectedOrder.sessionType === 'mock_defense' ? '模拟答辩攻防' : selectedOrder.sessionType === 'online_meeting' ? '线上深度打磨' : '线下封闭辅导'} · 录音时长：{selectedOrder.audioDurationMinutes}分钟
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">工单号：{selectedOrder.id}</span>
                  </div>
                </div>

                {/* Core Diagnostic Findings */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center">
                    <Target className="h-4 w-4 text-sky-600 mr-1.5" />
                    专家核心诊断意见
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedOrder.diagnosticSummary.coreFindings}
                  </p>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      团队需整改的任务清单（点击复选框标记完成状态）
                    </h3>
                    <span className="text-xs text-slate-400">
                      共 {selectedOrder.tasks.length} 项具体要求
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedOrder.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTaskDone(selectedOrder.id, task.id)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 text-xs ${
                          task.completed
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              [{task.category}] {task.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              task.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {task.priority === 'high' ? '高优先级' : '普通'} · 限期 {task.dueDays} 天
                            </span>
                          </div>
                          <p className={`text-[11px] mt-1 leading-relaxed ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submission Area */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                      <UploadCloud className="h-4 w-4 text-sky-600 mr-1.5" />
                      整改交付提交区 (队长/成员操作)
                    </h3>
                    {selectedOrder.studentSubmission && (
                      <span className="text-[11px] text-emerald-600 font-medium">
                        上次提交时间：{selectedOrder.studentSubmission.submissionDate}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        修改要点与答辩回应说明 (必填)
                      </label>
                      <textarea
                        rows={3}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="例如：已在商业计划书第18页补充中试产线良品率实测数据表；修正了财务模型第二年估值逻辑；PPT第9页已将三家竞品参数做横向标红对比..."
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">更新后的商业计划书(BP)</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newBpVersion}
                            onChange={(e) => setNewBpVersion(e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                          />
                          <button 
                            type="button" 
                            onClick={() => alert('模拟选择本地文件成功！')}
                            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0 font-medium text-[11px]"
                          >
                            浏览
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">更新后的答辩PPT</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newPptVersion}
                            onChange={(e) => setNewPptVersion(e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                          />
                          <button 
                            type="button" 
                            onClick={() => alert('模拟选择本地PPT文件成功！')}
                            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0 font-medium text-[11px]"
                          >
                            浏览
                          </button>
                        </div>
                      </div>
                    </div>

                    {submitSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>整改材料提交成功！已自动通知导师进行二次督导复核与打分提升评估。</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleSubmitDeliverable(selectedOrder.id)}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isSubmitting ? '提交中...' : '提交整改成果，申请导师复核'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expert Checked Results */}
                {selectedOrder.expertCheck && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" />
                        导师复核结论：{selectedOrder.expertCheck.approved ? '已达到金奖答辩基准' : '需进一步打磨'}
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold">
                        评分提升：+{selectedOrder.expertCheck.scoreChangeDelta} 分
                      </span>
                    </div>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      评语：{selectedOrder.expertCheck.finalRemark}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
                暂无选中的督导工单
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: AI Diagnostic & Gap Analysis */}
      {activeSubTab === 'diagnostic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.tier1Scores.map((scoreItem) => {
              const pct = Math.round((scoreItem.score / scoreItem.maxScore) * 100);
              return (
                <div key={scoreItem.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{scoreItem.name}</span>
                    <span className="font-mono text-slate-700">{scoreItem.score} / {scoreItem.maxScore}分</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-2 font-mono">
                    {pct}%
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 90 ? 'bg-emerald-500' : pct >= 80 ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logic Gaps */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                逻辑断点与硬伤分析 ({project.logicGaps.length})
              </h3>
              <div className="space-y-3">
                {project.logicGaps.map((gap, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold text-amber-900">
                      <span>{gap.title}</span>
                      <span className="text-[10px] bg-amber-200/80 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                        位置：{gap.location}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{gap.description}</p>
                    <div className="text-[11px] text-sky-800 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="font-semibold text-sky-900">AI改进建议：</span>
                      {gap.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Killer Questions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <HelpCircle className="h-4 w-4 text-sky-600 mr-1.5" />
                2026国赛现场评委尖锐提问攻防演练 ({project.killerQuestions.length})
              </h3>
              <div className="space-y-3">
                {project.killerQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-1.5 py-0.2 rounded shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <p className="font-semibold text-slate-800 leading-snug">{q}</p>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-6">
                      建议应对策略：由一辩准备3张附录支撑PPT（研发投入明细、流片实物照片、第三方检验机构认证报告），回答控制在45秒内。
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Team Structure */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">项目团队成员架构与分工</h3>
                <p className="text-xs text-slate-500">本硕博梯度、跨学科交叉分工与合规审核状态</p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
                  合规审查：{currentTeam.auditStatus === 'verified' ? '已通过' : '待补充材料'}
                </span>
                <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-medium">
                  共 {currentTeam.members.length} 位在队成员
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">姓名</th>
                    <th className="py-2.5 px-3">学号</th>
                    <th className="py-2.5 px-3">学院 / 专业</th>
                    <th className="py-2.5 px-3">学历层级</th>
                    <th className="py-2.5 px-3">队内分工</th>
                    <th className="py-2.5 px-3">专利/IP权属</th>
                    <th className="py-2.5 px-3">联系电话</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTeam.members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>{member.name}</span>
                        {member.roleInTeam.includes('队长') && (
                          <span className="bg-sky-100 text-sky-800 text-[10px] px-1 rounded font-medium">队长</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{member.studentId}</td>
                      <td className="py-3 px-3 text-slate-700">{member.college} · {member.major}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          member.degree === '博士研究生' ? 'bg-purple-100 text-purple-800' : member.degree === '硕士研究生' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {member.degree}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{member.roleInTeam}</td>
                      <td className="py-3 px-3">
                        {member.isIpOwner ? (
                          <span className="text-emerald-700 font-medium flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                            第一/共有发明人
                          </span>
                        ) : (
                          <span className="text-slate-400">成员</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{member.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
              <span className="font-bold text-slate-800">校级秘书审核批注：</span>
              {currentTeam.auditRemark}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: 项目文件夹（0908-16：文件树 + 待归档区 + 大事记=文件更改记录） */}
      {activeSubTab === 'folder' && (() => {
        // 合并材料清单（mock 注册表 + 会话生成文件），并附加来源标签
        const allFiles = [...AI_GENERATED_FILES];
        const sourceLabel: Record<string, { text: string; cls: string }> = {
          system: { text: '三件套/系统', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
          upload: { text: '上传', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
          ai: { text: '会话生成', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
        };
        const kindIcon: Record<FileChangeEntry['kind'], string> = {
          edit: '✏️',
          milestone: '🚩',
          upload: '📤',
          archive: '📥'
        };
        const kindCls: Record<FileChangeEntry['kind'], string> = {
          edit: 'bg-indigo-500',
          milestone: 'bg-amber-500',
          upload: 'bg-sky-500',
          archive: 'bg-emerald-500'
        };
        return (
          <div className="space-y-5">
            {/* 待归档区：会话产物 → 存入项目文件夹 */}
            <div className="bg-amber-50/70 border border-dashed border-amber-300 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Inbox className="h-4 w-4 text-amber-600" />
                待归档区 · 来自会话的生成产物（存入后自动记入文件更改记录）
              </div>
              <div className="space-y-2">
                {PENDING_ARCHIVE_ITEMS.map(p => (
                  <div key={p.id} className="bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs">
                    <span className="font-semibold text-slate-800">🤖 {p.name}</span>
                    <span className="text-[10px] text-amber-700">生成于会话「{p.fromSession}」 · {p.time} · {p.size}</span>
                    <button
                      onClick={() => alert(`已存入项目文件夹并记入文件更改记录（示例 mock）：${p.name}`)}
                      className="ml-auto shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition"
                    >
                      存入项目文件夹
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 左：文件树（来源标签） */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FolderTree className="h-4 w-4 text-sky-600" />
                  材料注册表 ({allFiles.length})
                </h3>
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {allFiles.map(f => {
                    const src = FILE_SOURCE[f.id] || 'upload';
                    const sl = sourceLabel[src];
                    return (
                      <div key={f.id} className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-slate-50/60 transition text-xs cursor-pointer">
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-semibold text-slate-800 line-clamp-1">{f.name}</span>
                          {f.badge && (
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full whitespace-nowrap">{f.badge}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-1 text-[10px] text-slate-400">
                          <span className={`px-1.5 py-0.2 rounded-full border font-medium ${sl.cls}`}>{sl.text}</span>
                          <span>{f.category} · {(f.size / 1024).toFixed(0)} KB · {f.ext.toUpperCase()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                  来源口径：<b className="text-slate-700">三件套/系统</b>（平台生成归档）· <b className="text-slate-700">上传</b>（团队手动登记）· <b className="text-slate-700">会话生成</b>（AI 教练产物经确认入库）
                </div>
              </div>

              {/* 右：主文档版本线 + 大事记（=文件更改记录） */}
              <div className="lg:col-span-8 space-y-5">
                {/* 主文档版本线（与工作台快照体系同源） */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    📄 商业计划书（主文档）
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">当前版 v2.0.0-rc</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">三件套/系统</span>
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="text-slate-400">版本线（与全链路指导工作台快照同源）：</span>
                    {['v1.0.0 · 校赛基线', 'v1.2.0 · 省赛网评', 'v1.4.0 · 里程碑 🚩', 'v2.0.0-rc · 当前'].map((v, i, arr) => (
                      <span
                        key={v}
                        className={`px-2 py-0.5 rounded-full border font-mono ${
                          i === arr.length - 1
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    完整版本历史 / diff 对比 / 回滚 → 全链路指导工作台顶栏「版本历史」抽屉
                  </div>
                </div>

                {/* 大事记 = 文件更改记录（仅文件与版本变更事件，不含业务事件） */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <History className="h-4 w-4 text-sky-600" />
                    大事记 · 文件更改记录
                    <span className="text-[10px] font-medium text-slate-500 normal-case tracking-normal">谁 · 何时 · 动作 · 来自哪 · 形成哪版（不含业务事件）</span>
                  </h3>
                  <div className="relative pl-6 border-l-2 border-slate-200 space-y-5">
                    {FILE_CHANGE_LOG.map(fc => (
                      <div key={fc.id} className="relative">
                        <div className={`absolute -left-[31px] top-0.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${kindCls[fc.kind]} ${fc.kind === 'edit' ? 'ring-indigo-100' : fc.kind === 'milestone' ? 'ring-amber-100' : fc.kind === 'upload' ? 'ring-sky-100' : 'ring-emerald-100'}`} />
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="font-bold text-slate-800 text-xs">
                            {kindIcon[fc.kind]} {fc.targetFile} · {fc.action}
                          </div>
                          {fc.versionRef && (
                            <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">→ {fc.versionRef}</span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{fc.detail}</p>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                          <span>{fc.date}</span>
                          <span>操作人：{fc.actor}</span>
                          {fc.fromRef && <span>来自：{fc.fromRef}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
