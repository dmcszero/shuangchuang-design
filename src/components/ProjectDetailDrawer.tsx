import { useState } from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  FileCheck2,
  Calendar,
  Layers
} from 'lucide-react';
import { ProjectItem, SupervisionWorkOrder } from '../types';

interface ProjectDetailDrawerProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  workOrders: SupervisionWorkOrder[];
  onOpenAssignMentor?: (project: ProjectItem) => void;
}

export default function ProjectDetailDrawer({
  project,
  isOpen,
  onClose,
  workOrders,
  onOpenAssignMentor
}: ProjectDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'scores' | 'radar' | 'compliance' | 'logic_gaps' | 'supervision' | 'materials'>('scores');

  if (!isOpen || !project) return null;

  const projectWorkOrders = workOrders.filter(o => o.projectId === project.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        id="project-detail-drawer"
        className="w-full max-w-3xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl text-slate-800 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1 flex-1 pr-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                project.grade === 'A' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                project.grade === 'B' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                project.grade === 'C' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {project.grade} 级潜力池 · 综合对标 {project.totalScore} 分 (第 {project.rank} 名)
              </span>
              <span className="text-xs text-slate-500 font-mono">{project.code}</span>
              <span className="text-xs bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-medium">
                {project.trackLabel} · {project.groupLabel}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{project.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
              <span>学院：<strong className="text-slate-800">{project.college}</strong></span>
              <span>负责人：<strong className="text-slate-800">{project.leader}</strong> ({project.leaderTitle || '负责人'})</span>
              <span>指导老师：<strong className="text-slate-800">{project.advisor}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-white border-b border-slate-200 flex space-x-2 overflow-x-auto text-xs py-2">
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'scores' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>2026国赛二级细分评分 ({project.totalScore}分)</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'radar' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>金奖特征对标 ({project.goldSimilarity}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('logic_gaps')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'logic_gaps' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>逻辑断层与杀手锏问题 ({project.killerQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supervision')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'supervision' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>督导工单与版本演进 ({projectWorkOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'compliance' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>合规与体检 ({project.compliance.passed ? '通过' : '预警'})</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'materials' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>材料清单</span>
          </button>
        </div>

        {/* Drawer Body Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {/* TAB 1: FULL TIER-1 & TIER-2 ITEMIZED BREAKDOWN TABLE */}
          {activeTab === 'scores' && (
            <div className="space-y-5">
              {/* Score Benchmark Highlight */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-slate-500 text-xs font-medium">2026国赛标准综合评估分</div>
                  <div className="text-2xl font-bold text-sky-700 mt-0.5">{project.totalScore} <span className="text-xs text-slate-500 font-normal">/ 100 分</span></div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <div className="text-slate-500 text-xs font-medium">国赛金奖基准参考线</div>
                  <div className="text-xl font-bold text-amber-700 mt-0.5">{project.benchmarkGoldScore} 分</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <div className="text-slate-500 text-xs font-medium">AI评分置信度</div>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5">{project.aiConfidence}%</div>
                </div>
              </div>

              {/* Tier 1 & Tier 2 Tables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center">
                    <Layers className="h-4 w-4 text-sky-600 mr-1.5" />
                    2026 评审规则细分二级指标得分明细表
                  </h3>
                  <span className="text-[11px] text-slate-500">已对齐当届官方一级/二级指标分值权重</span>
                </div>

                <div className="space-y-4">
                  {project.tier1Scores.map((t1) => (
                    <div key={t1.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                      {/* Tier 1 Row Header */}
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{t1.name}</span>
                          <span className="text-[11px] text-slate-500">({t1.tier2Scores.length} 个二级指标)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <span className="font-bold text-sky-700">{t1.score}</span>
                            <span className="text-slate-500 text-[11px]"> / {t1.maxScore} 分</span>
                          </div>
                          <div className="w-20 bg-slate-200 rounded-full h-1.5 hidden sm:block overflow-hidden">
                            <div 
                              className="bg-sky-600 h-full rounded-full" 
                              style={{ width: `${(t1.score / t1.maxScore) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tier 2 Detailed Sub-Items */}
                      <div className="divide-y divide-slate-100">
                        {t1.tier2Scores.map((t2, idx) => {
                          const scoreRate = (t2.score / t2.maxScore) * 100;
                          const isWeak = scoreRate < 75;
                          return (
                            <div key={t2.id} className="p-3 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-start space-x-2.5 flex-1">
                                <span className="text-slate-400 font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-slate-800">{t2.name}</span>
                                    {isWeak && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                                        需提分弱项
                                      </span>
                                    )}
                                  </div>
                                  {t2.comment && (
                                    <p className="text-[11px] text-slate-600 leading-relaxed">{t2.comment}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 shrink-0 pl-6 sm:pl-0">
                                <div className="text-right">
                                  <div className="font-bold text-slate-800">
                                    {t2.score} <span className="text-slate-400 font-normal">/ {t2.maxScore}</span>
                                  </div>
                                  {t2.benchmarkGoldScore && (
                                    <div className="text-[10px] text-amber-700">
                                      金奖线: {t2.benchmarkGoldScore}分
                                    </div>
                                  )}
                                </div>
                                <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      scoreRate >= 90 ? 'bg-emerald-500' :
                                      scoreRate >= 75 ? 'bg-sky-500' :
                                      'bg-amber-500'
                                    }`}
                                    style={{ width: `${scoreRate}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RADAR & GOLD BENCHMARK */}
          {activeTab === 'radar' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs text-amber-900 font-medium">历史国赛同赛道金奖特征匹配度</div>
                  <div className="text-2xl font-bold text-amber-700 mt-0.5">{project.goldSimilarity}%</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    基于近五届国赛金奖库 1,200+ 案例特征深度向量对比
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                    A级金奖冲刺标杆
                  </span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="font-semibold text-emerald-800 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" />
                    核心优势亮点（打动评委加分项）
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    {project.strengthsLabels.map((s, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-emerald-600 mr-1.5 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="font-semibold text-rose-800 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5 text-rose-600" />
                    突出短板与失分风险（急需补强）
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    {project.weaknessLabels.map((w, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-rose-600 mr-1.5 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Score Growth History */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-800 flex items-center">
                  <TrendingUp className="h-4 w-4 text-sky-600 mr-1.5" />
                  打磨阶段评分跃迁趋势 (Score Evolution)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  {project.scoreHistory.map((sh, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-500">{sh.date}</div>
                      <div className="text-base font-bold text-sky-700 mt-1">{sh.score} 分</div>
                      <div className="text-[10px] text-slate-700 mt-0.5 truncate font-medium">{sh.reviewStage}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGIC GAPS & KILLER QUESTIONS */}
          {activeTab === 'logic_gaps' && (
            <div className="space-y-5">
              {/* Logic Gaps Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-1.5" />
                  AI 自动识别逻辑断层与疑点 ({project.logicGaps.length})
                </h3>
                {project.logicGaps.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    ✓ 未检测到重大逻辑前后矛盾或数据断层，材料逻辑闭环良好。
                  </div>
                ) : (
                  project.logicGaps.map((gap, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-800 text-xs flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                          {gap.title}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{gap.location}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs">{gap.description}</p>
                      <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900">
                        <strong className="text-sky-700">AI 优化建议：</strong> {gap.suggestion}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Killer Questions */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center">
                  <HelpCircle className="h-4 w-4 text-sky-600 mr-1.5" />
                  评委现场答辩高频“杀手锏”问题预测（答辩前必练）
                </h3>
                <div className="space-y-2.5">
                  {project.killerQuestions.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 leading-relaxed text-xs">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPERVISION WORK ORDERS */}
          {activeTab === 'supervision' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center">
                  <FileCheck2 className="h-4 w-4 text-emerald-600 mr-1.5" />
                  专家辅导修改工单与二次复核闭环 ({projectWorkOrders.length})
                </h3>
                {onOpenAssignMentor && (
                  <button
                    onClick={() => onOpenAssignMentor(project)}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition"
                  >
                    + 预约专家辅导
                  </button>
                )}
              </div>

              {projectWorkOrders.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                  暂无专家辅导工单记录，可点击上方按钮指派导师。
                </div>
              ) : (
                projectWorkOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-slate-200 bg-white shadow-2xs p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{order.mentorName}</span>
                        <span className="text-[11px] text-slate-500 ml-2">({order.mentorTitle})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        order.status === 'expert_checked' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        order.status === 'student_submitted' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {order.status === 'expert_checked' ? '✓ 专家二次复核通过' :
                         order.status === 'student_submitted' ? '学生已提交修改，待专家复核' :
                         '学生修改中'}
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      &quot;{order.diagnosticSummary.coreFindings}&quot;
                    </p>

                    {/* Tasks */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-500">分解待办工单任务 (To-Do List)：</div>
                      {order.tasks.map((t) => (
                        <div key={t.id} className="p-2 rounded bg-slate-50 flex items-center justify-between text-[11px] border border-slate-200">
                          <span className={t.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                            [{t.category}] {t.title}
                          </span>
                          <span className={t.completed ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                            {t.completed ? '已完成' : '待处理'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.expertCheck && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                        <span>专家评语：{order.expertCheck.finalRemark}</span>
                        <span className="font-bold text-emerald-700">评分提升 +{order.expertCheck.scoreChangeDelta}分</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: COMPLIANCE */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">合规审查结论</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    project.compliance.passed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {project.compliance.passed ? '✓ 合规通过' : '⚠️ 触发一票否决预警'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[11px] text-slate-500">论文/专利查重率</div>
                    <div className={`text-base font-bold mt-0.5 ${
                      project.compliance.plagiarismRate > 15 ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {project.compliance.plagiarismRate}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[11px] text-slate-500">AI 代写生成痕迹</div>
                    <div className="text-base font-bold text-sky-700 mt-0.5">
                      {project.compliance.aiContentRate}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[11px] text-slate-500">知识产权风险等级</div>
                    <div className={`text-base font-bold mt-0.5 ${
                      project.compliance.ipRiskLevel === 'high' ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {project.compliance.ipRiskLevel === 'high' ? '高风险' : '低风险'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-700 pt-1">
                  <strong className="text-slate-900">IP与授权详情：</strong> {project.compliance.ipDetails}
                </div>

                {project.compliance.warnings.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="font-semibold text-rose-800 flex items-center">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      预警拦截事项：
                    </div>
                    {project.compliance.warnings.map((w, i) => (
                      <div key={i}>• {w}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">商业计划书 (BP)</div>
                  <div className="font-semibold text-slate-900 mt-1 truncate">{project.materials.bpFile}</div>
                  <div className="text-[11px] text-sky-700 font-medium mt-0.5">{project.materials.bpPages} 页 · 完整版</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">路演 PPT</div>
                  <div className="font-semibold text-slate-900 mt-1 truncate">{project.materials.pptFile}</div>
                  <div className="text-[11px] text-sky-700 font-medium mt-0.5">{project.materials.pptSlides} 页 · 10分钟国赛规格</div>
                </div>
              </div>

              {project.materials.vcrFile && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">路演 VCR 视频</div>
                  <div className="font-semibold text-slate-900 mt-1">{project.materials.vcrFile}</div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">90秒高清视频已生成</div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">已登记专利与软著资产：</span>
                <span className="font-bold text-amber-700">
                  {project.materials.patentCount} 项专利 / {project.materials.softwareCopyrightCount} 项软著
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            最近诊断时间：{project.lastUpdated}
          </div>
          <div className="flex items-center space-x-2">
            {onOpenAssignMentor && (
              <button
                onClick={() => onOpenAssignMentor(project)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition flex items-center shadow-2xs"
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                指派导师
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
