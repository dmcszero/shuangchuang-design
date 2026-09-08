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

interface ProjectMemberWorkbenchProps {
  session: UserSession;
  project: ProjectItem;
  workOrders: SupervisionWorkOrder[];
  onUpdateWorkOrder: (order: SupervisionWorkOrder) => void;
  onOpenRulesConfig: () => void;
}

export default function ProjectMemberWorkbench({
  session,
  project,
  workOrders,
  onUpdateWorkOrder,
  onOpenRulesConfig,
}: ProjectMemberWorkbenchProps) {
  // Find project work orders
  const projectOrders = workOrders.filter(o => o.projectId === project.id);
  const currentTeam = MOCK_PROJECT_TEAMS.find(t => t.projectId === project.id) || MOCK_PROJECT_TEAMS[0];

  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'diagnostic' | 'team' | 'materials'>('tasks');
  const [selectedOrder, setSelectedOrder] = useState<SupervisionWorkOrder | null>(projectOrders[0] || null);

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
          onClick={() => setActiveSubTab('materials')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'materials'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>申报材料与版本管理</span>
        </button>
      </div>

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

      {/* Tab Content 4: Materials */}
      {activeSubTab === 'materials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">商业计划书 (BP)</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-medium">PDF格式</span>
              </div>
              <p className="text-xs font-mono text-slate-600 truncate">{project.materials.bpFile}</p>
              <div className="text-xs text-slate-400">页数：{project.materials.bpPages} 页 · 查重率：{project.compliance.plagiarismRate}%</div>
              <div className="pt-2 flex items-center space-x-2">
                <button 
                  onClick={() => alert(`模拟下载商业计划书：${project.materials.bpFile}`)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>下载当前版</span>
                </button>
                <button 
                  onClick={() => alert('模拟替换上传新版商业计划书成功！')}
                  className="py-1.5 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium transition"
                >
                  更新上传
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">现场路演PPT</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">PPTX格式</span>
              </div>
              <p className="text-xs font-mono text-slate-600 truncate">{project.materials.pptFile}</p>
              <div className="text-xs text-slate-400">幻灯片页数：{project.materials.pptSlides} 页 (正文12页+附录16页)</div>
              <div className="pt-2 flex items-center space-x-2">
                <button 
                  onClick={() => alert(`模拟下载路演PPT：${project.materials.pptFile}`)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>下载当前版</span>
                </button>
                <button 
                  onClick={() => alert('模拟替换上传新版路演PPT成功！')}
                  className="py-1.5 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium transition"
                >
                  更新上传
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">一分钟展示视频 (VCR)</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">MP4格式</span>
              </div>
              <p className="text-xs font-mono text-slate-600 truncate">{project.materials.vcrFile || 'vcr_demo_intro_1min.mp4'}</p>
              <div className="text-xs text-slate-400">分辨率：1080P · 时长：58秒 · 字幕已校准</div>
              <div className="pt-2 flex items-center space-x-2">
                <button 
                  onClick={() => alert('模拟在线预览展示视频！')}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>在线预览</span>
                </button>
                <button 
                  onClick={() => alert('模拟替换上传新版VCR成功！')}
                  className="py-1.5 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium transition"
                >
                  更新上传
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
