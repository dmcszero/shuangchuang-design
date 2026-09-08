import { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Award, 
  Star, 
  Send, 
  Search, 
  CheckCircle2, 
  Plus,
  Clock,
  ArrowRight
} from 'lucide-react';
import { MentorExpert, ProjectItem, CohortBatchTask, TierGrade } from '../types';

interface MentorshipDispatchProps {
  mentors: MentorExpert[];
  projects: ProjectItem[];
  cohortTasks: CohortBatchTask[];
  onSelectProject: (project: ProjectItem) => void;
  onAddNewCohortTask: (task: CohortBatchTask) => void;
  onNavigateToMentorPool?: () => void;
}

export default function MentorshipDispatch({
  mentors,
  projects,
  cohortTasks,
  onSelectProject,
  onAddNewCohortTask,
  onNavigateToMentorPool
}: MentorshipDispatchProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [mentorTagFilter, setMentorTagFilter] = useState<string>('ALL');
  const [mentorSearch, setMentorSearch] = useState<string>('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // New cohort task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTargetGrade, setNewTaskTargetGrade] = useState<TierGrade | 'ALL'>('A');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-09-08 18:00');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const currentSelectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Smart Mentor Recommendation Algorithm
  const recommendedMentors = mentors.map(mentor => {
    let matchScore = 80;
    const reasons: string[] = [];

    if (currentSelectedProject?.track && mentor.preferredTracks.includes(currentSelectedProject.track)) {
      matchScore += 10;
      reasons.push(`深耕【${currentSelectedProject.trackLabel}】赛道评审`);
    }

    if (currentSelectedProject?.weaknessLabels.some(w => w.includes('财务') || w.includes('商业'))) {
      if (mentor.expertiseTags.some(t => t.includes('财务') || t.includes('商业') || t.includes('投资'))) {
        matchScore += 8;
        reasons.push('精准匹配项目薄弱点：【商业模式与财务测算】');
      }
    }

    if (currentSelectedProject?.groupLabel.includes('新工科') || currentSelectedProject?.groupLabel.includes('新医科')) {
      if (mentor.expertiseTags.some(t => t.includes('硬科技') || t.includes('新工科') || t.includes('新医科'))) {
        matchScore += 7;
        reasons.push('具备深厚学术研发与产业转化双重视角');
      }
    }

    return {
      mentor,
      matchScore: Math.min(matchScore, 99),
      reasons: reasons.length > 0 ? reasons : ['常态化备赛综合指导专家']
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const filteredMentors = mentors.filter(m => {
    if (mentorTagFilter !== 'ALL' && !m.expertiseTags.some(t => t.includes(mentorTagFilter))) return false;
    if (mentorSearch.trim()) {
      const q = mentorSearch.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.organization.toLowerCase().includes(q) || m.expertiseTags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleBookMentor = (mentor: MentorExpert, slot: string) => {
    setBookingSuccessMsg(`已成功为【${currentSelectedProject.name}】预约【${mentor.name}】老师：${slot}。AI 辅导工单已同步创建！`);
    setTimeout(() => setBookingSuccessMsg(null), 4000);
  };

  const handleCreateCohortTask = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: CohortBatchTask = {
      id: `batch-task-${Date.now()}`,
      title: newTaskTitle,
      targetGrade: newTaskTargetGrade,
      targetTracks: 'ALL',
      deadline: newTaskDeadline,
      description: newTaskDesc || '请按照最新2026国赛评审标准完成材料迭代并上传。',
      totalTargetProjects: newTaskTargetGrade === 'A' ? 15 : newTaskTargetGrade === 'B' ? 28 : 82,
      submittedCount: 0,
      reviewedCount: 0,
      status: 'active',
      createdAt: '2026-08-27',
    };

    onAddNewCohortTask(newTask);
    setIsTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <div id="mentorship-dispatch-view" className="space-y-6">
      {/* Toast Alert */}
      {bookingSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <span className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0" />
            {bookingSuccessMsg}
          </span>
          <button onClick={() => setBookingSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 ml-4 font-bold">✕</button>
        </div>
      )}

      {/* Top Banner & Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Users className="h-5 w-5 text-sky-600 mr-2" />
            常态化辅导与导师资源智能调度工作台
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            基于项目 2026 国赛短板指标（如财务模型薄弱、技术壁垒不清）智能推荐匹配专家，并支持面向梯队一键下发打磨任务
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onNavigateToMentorPool && (
            <button
              onClick={onNavigateToMentorPool}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center cursor-pointer"
            >
              <Award className="h-4 w-4 mr-1.5 text-amber-600" />
              管理导师智库档案
            </button>
          )}

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/10 transition flex items-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            新建梯队批量打磨任务
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Left: Smart Weakness Matcher; Right: Cohort Task Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Smart Matcher & Mentor Directory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: AI Weakness to Mentor Smart Recommender */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5 text-amber-500" />
                  智能短板定向匹配：选择项目，AI推荐最佳辅导专家
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  自动解析项目 2026 二级指标短板标签，精准对接擅长该领域的专家
                </p>
              </div>

              {/* Project Dropdown Selector */}
              <div className="sm:w-72">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.grade}级·{p.totalScore}分] {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Project Weakness Profile Card */}
            {currentSelectedProject && (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate max-w-md">
                    {currentSelectedProject.name}
                  </span>
                  <span className="text-xs text-amber-800 font-bold">
                    当前对标得分：{currentSelectedProject.totalScore} 分 (A级金奖潜力)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 mr-1">AI 识别待补强标签：</span>
                  {currentSelectedProject.weaknessLabels.map((w, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Recommended Mentors */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-700 flex items-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                AI 算法推荐 Top 3 指导专家（按短板匹配度排序）：
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {recommendedMentors.slice(0, 3).map(({ mentor, matchScore, reasons }) => (
                  <div
                    key={mentor.id}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-sky-400 hover:bg-sky-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5 flex-1">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{mentor.name}</span>
                          <span className="text-xs text-amber-600 flex items-center font-bold">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500 mr-0.5" /> {mentor.rating}
                          </span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                            {mentor.type === 'external' ? '校外资深评审' : '校内双创导师'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{mentor.title} · {mentor.organization}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {reasons.map((r, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-medium">
                              ✓ {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-700">匹配度 {matchScore}%</div>
                        <div className="text-[10px] text-slate-500">已指导出 {mentor.goldProjectsCoached} 个国赛金奖</div>
                      </div>
                      
                      {/* Booking Slot Action */}
                      <div className="space-y-1">
                        <button
                          onClick={() => handleBookMentor(mentor, mentor.availableTimeSlots[0] || '本周专家一对一辅导')}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-2xs transition flex items-center whitespace-nowrap"
                        >
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          一键预约排期
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Full Mentors Directory */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <Users className="h-4 w-4 mr-2 text-sky-600" />
                全校及外部双创导师智库全览 ({mentors.length} 位专家)
              </h3>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    value={mentorSearch}
                    onChange={(e) => setMentorSearch(e.target.value)}
                    placeholder="搜索专家姓名、擅长领域..."
                    className="bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-1 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                  <Search className="h-3 w-3 text-slate-400 absolute left-2 top-2" />
                </div>
              </div>
            </div>

            {/* Tags Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
              <span className="text-slate-500 text-[11px] whitespace-nowrap mr-1">能力标签：</span>
              {['ALL', '硬科技', '财务', '红旅', '新材料', '能工巧匠'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setMentorTagFilter(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    mentorTagFilter === tag
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag === 'ALL' ? '全部领域' : tag}
                </button>
              ))}
            </div>

            {/* Mentor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMentors.map(m => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 text-xs hover:bg-white transition">
                  <div className="flex items-center space-x-3">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>{m.name}</span>
                        <span className="text-[10px] text-amber-600 font-bold">★ {m.rating}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{m.title}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2">{m.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {m.expertiseTags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>当前辅导：{m.currentProjectsCount} / {m.maxCapacity} 项</span>
                    <span className="text-emerald-700 font-semibold">{m.availability === 'available' ? '● 可预约' : '● 满载'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Cohort Batch Task Center */}
        <div className="space-y-6">
          {/* Active Cohort Tasks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <Send className="h-4 w-4 mr-2 text-sky-600" />
                常态化培育任务下发与监督 ({cohortTasks.length})
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              管理者一键向 A/B 级梯队项目团队群发阶段打磨任务，自动建立“挖掘-培育-提升-复盘”循环。
            </p>

            <div className="space-y-3">
              {cohortTasks.map(task => {
                const submitRate = Math.round((task.submittedCount / task.totalTargetProjects) * 100);
                return (
                  <div key={task.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-900 line-clamp-1">{task.title}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-semibold border border-sky-200 shrink-0 ml-2">
                        {task.targetGrade === 'ALL' ? '全校梯队' : `${task.targetGrade}级梯队`}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{task.description}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>提交进度: {task.submittedCount} / {task.totalTargetProjects} 项目</span>
                        <span className="font-bold text-sky-700">{submitRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: `${submitRate}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> 截止：{task.deadline}</span>
                      <span className="text-emerald-700 font-semibold">专家已审 {task.reviewedCount} 项</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Cohort Batch Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center">
                <Send className="h-4 w-4 mr-2 text-sky-600" />
                下发新批次常态化打磨任务
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCohortTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">任务标题</label>
                <input
                  type="text"
                  required
                  placeholder="例如：【金奖冲刺】答辩反面论证与杀手锏问题回应演练"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">目标梯队</label>
                  <select
                    value={newTaskTargetGrade}
                    onChange={(e) => setNewTaskTargetGrade(e.target.value as TierGrade | 'ALL')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="A">A级 · 国赛金奖冲刺池 (15项)</option>
                    <option value="B">B级 · 省金/国银培育池 (28项)</option>
                    <option value="ALL">全校所有申报项目 (82项)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">提交截止时间</label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">具体打磨要求与交付物标准</label>
                <textarea
                  rows={3}
                  placeholder="例如：对照2026国赛官方评审规则，完成商业计划书财务折损测算与PPT前3页重构，并录制1分钟核心创新点答辩音频。"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-2xs transition"
                >
                  一键群发下发
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
