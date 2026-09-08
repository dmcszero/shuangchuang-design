import { 
  Award, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Users, 
  FileText,
  Target,
  Clock,
  Layers
} from 'lucide-react';
import { ProjectItem } from '../types';

interface CockpitDashboardProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenReportExport: () => void;
  onOpenBatchImport: () => void;
  onNavigateTab: (tab: 'screening' | 'mentorship' | 'supervision' | 'milestones') => void;
}

export default function CockpitDashboard({
  projects,
  onSelectProject,
  onOpenReportExport,
  onOpenBatchImport,
  onNavigateTab
}: CockpitDashboardProps) {
  const aGradeProjects = projects.filter(p => p.grade === 'A');
  const bGradeProjects = projects.filter(p => p.grade === 'B');
  const cGradeProjects = projects.filter(p => p.grade === 'C');
  const dGradeProjects = projects.filter(p => p.grade === 'D');
  const warningProjects = projects.filter(p => p.healthStatus === 'warning' || p.healthStatus === 'critical');

  return (
    <div id="cockpit-dashboard-view" className="space-y-6">
      {/* Top Banner with AI Actionable Directive */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-100/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-sky-800 border border-sky-200 shadow-2xs flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-sky-600" /> AI 备赛决策大模型实时分析
              </span>
              <span className="text-xs text-slate-500">更新时间：今日 20:00</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              2026大赛金奖培育数据决策中枢：聚焦锁定 15 个 A 级金奖种子，重点补齐产业价值短板
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AI 诊断洞察：全校 82 个项目中，<strong className="text-amber-700">A级金奖潜力池达 15 项</strong>（新工科、红旅与产业命题领跑）。当前最突出的失分共性为<span className="text-rose-700 font-semibold">【产业价值-市场定位与财务测算】</span>（平均得分率仅 68.4%），建议本周重点调度投资人专家开展针对性打磨。
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenReportExport}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              一键导出复盘汇报
            </button>
            <button
              onClick={onOpenBatchImport}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center"
            >
              <Users className="h-4 w-4 mr-1.5" />
              导入新批次项目
            </button>
          </div>
        </div>
      </div>

      {/* Gold Potential Pool Cards (Top KPI Matrix) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Registered */}
        <div 
          onClick={() => onNavigateTab('screening')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>申报项目总数</span>
            <Layers className="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">82 <span className="text-xs text-slate-500 font-normal">项</span></div>
          <div className="flex items-center text-[11px] text-emerald-600 font-medium mt-2">
            <TrendingUp className="h-3.5 w-3.5 mr-1" /> 同比历届增长 +28.5%
          </div>
        </div>

        {/* A Grade Gold Potential Pool */}
        <div 
          onClick={() => onNavigateTab('screening')}
          className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 hover:shadow-xs transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-amber-900 text-xs font-semibold">
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-amber-600" /> A级 · 国赛金奖池
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold">TOP 18%</span>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2">{aGradeProjects.length} <span className="text-xs text-amber-700 font-normal">项</span></div>
          <div className="text-[11px] text-amber-800/90 mt-2 truncate font-medium">
            对标分 90分+ · 重点1v1护航
          </div>
        </div>

        {/* B Grade Silver / Provincial Gold Pool */}
        <div 
          onClick={() => onNavigateTab('screening')}
          className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-blue-900 text-xs font-semibold">
            <span>B级 · 省金/国银池</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900">培育攻坚</span>
          </div>
          <div className="text-2xl font-bold text-blue-800 mt-2">{bGradeProjects.length} <span className="text-xs text-blue-600 font-normal">项</span></div>
          <div className="text-[11px] text-slate-600 mt-2">
            得分 80-89分 · 补强商业短板
          </div>
        </div>

        {/* C Grade & D Grade */}
        <div 
          onClick={() => onNavigateTab('screening')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>C/D级 · 基础培育池</span>
            <span className="text-[10px] text-slate-500">常态化AI答疑</span>
          </div>
          <div className="text-2xl font-bold text-slate-700 mt-2">{cGradeProjects.length + dGradeProjects.length} <span className="text-xs text-slate-400 font-normal">项</span></div>
          <div className="text-[11px] text-slate-500 mt-2">
            自主按模板多轮打磨
          </div>
        </div>

        {/* Supervision Closure Rate */}
        <div 
          onClick={() => onNavigateTab('supervision')}
          className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-emerald-900 text-xs font-semibold">
            <span>工单督导闭环率</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">88.5%</div>
          <div className="text-[11px] text-emerald-800 mt-2 flex items-center font-medium">
            杜绝“评完就忘、听完不改”
          </div>
        </div>
      </div>

      {/* Main Grid: Shortcomings Heatmap + AI Insight on Left, Active Gold Pipeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 2026 Evaluation Dimensions Heatmap & Weakness Radar Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Heatmap Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center">
                  <Target className="h-4 w-4 text-sky-600 mr-2" />
                  全校项目 2026 国赛一级与二级细分指标得分率热力洞察
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  基于 82 个项目的 AI 结构化评分数据加权统计，快速定位全校能力短板
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('screening')}
                className="text-xs text-sky-600 hover:text-sky-700 flex items-center font-semibold"
              >
                查看初筛全览 <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </button>
            </div>

            {/* Dimension Breakdown Bars */}
            <div className="space-y-4 pt-2">
              {/* 1. 个人成长 (30分) */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2" />
                    【一级指标】个人成长（满分30分）
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">全校平均得分率：86.2% (良好)</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">立德树人</div>
                    <div className="font-bold text-emerald-600 mt-0.5">92%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200 text-center shadow-2xs">
                    <div className="text-slate-600">调研深入</div>
                    <div className="font-bold text-amber-700 mt-0.5">76% ⚠️</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">逻辑正确</div>
                    <div className="font-bold text-emerald-600 mt-0.5">88%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">知识应用</div>
                    <div className="font-bold text-emerald-600 mt-0.5">89%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">人才培养</div>
                    <div className="font-bold text-emerald-600 mt-0.5">86%</div>
                  </div>
                </div>
              </div>

              {/* 2. 项目创新 (30分) */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-2" />
                    【一级指标】项目创新（满分30分）
                  </span>
                  <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">全校平均得分率：87.8% (优异)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">问题导向 (痛点清晰度)</div>
                    <div className="font-bold text-emerald-600 mt-0.5">94%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">目标导向 (实际需求契合)</div>
                    <div className="font-bold text-emerald-600 mt-0.5">90%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">创新成效 (专利成果)</div>
                    <div className="font-bold text-emerald-600 mt-0.5">88%</div>
                  </div>
                </div>
              </div>

              {/* 3. 产业价值 (25-30分) */}
              <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-900 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
                    【一级指标】产业价值（满分25分 / 创业组30分）
                  </span>
                  <span className="font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-300">全校平均得分率：68.4% (严重短板 ⚠️)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-600">产业认知</div>
                    <div className="font-bold text-amber-700 mt-0.5">78%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border-2 border-rose-300 text-center shadow-2xs">
                    <div className="text-rose-700 font-semibold">市场定位与财务</div>
                    <div className="font-bold text-rose-600 mt-0.5">58% 🚨</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-600">落地前景 (意向订单)</div>
                    <div className="font-bold text-amber-700 mt-0.5">69%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">社会影响与带动</div>
                    <div className="font-bold text-emerald-600 mt-0.5">85%</div>
                  </div>
                </div>
              </div>

              {/* 4. 团队协作 (15-20分) */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                    【一级指标】团队协作（满分15分）
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">全校平均得分率：85.0% (良好)</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">团队精神</div>
                    <div className="font-bold text-emerald-600 mt-0.5">90%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200 text-center shadow-2xs">
                    <div className="text-slate-600">团队结构</div>
                    <div className="font-bold text-amber-700 mt-0.5">74% ⚠️</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">团队效能</div>
                    <div className="font-bold text-emerald-600 mt-0.5">88%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">外部资源</div>
                    <div className="font-bold text-emerald-600 mt-0.5">86%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
                    <div className="text-slate-500">团队贡献</div>
                    <div className="font-bold text-emerald-600 mt-0.5">87%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Core Visual Mini-Dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. 报名赛道分布 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">① 报名赛道分布 (82项)</span>
                <span className="text-[11px] text-slate-500">新工科占45%</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">高教主赛道 (创意/创业)</span>
                    <span className="font-bold text-sky-700">42 项 (51%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: '51%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">青年红色筑梦之旅赛道</span>
                    <span className="font-bold text-amber-700">20 项 (24%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">产业命题赛道</span>
                    <span className="font-bold text-purple-700">12 项 (15%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">职教赛道 / 萌芽赛道</span>
                    <span className="font-bold text-emerald-700">8 项 (10%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 辅导督导与提分转化 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">② 专家辅导与提分跃迁</span>
                <span className="text-[11px] text-emerald-700 font-semibold">均分提升 +7.4分</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500">下发修改工单</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">68 个</div>
                </div>
                <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 font-medium">专家二次Check</div>
                  <div className="text-lg font-bold text-emerald-700 mt-0.5">52 次</div>
                </div>
                <div className="p-2 bg-sky-50/80 rounded-xl border border-sky-200">
                  <div className="text-[10px] text-sky-800 font-medium">重点培育导师</div>
                  <div className="text-lg font-bold text-sky-700 mt-0.5">18 位</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                ✨ 专家评审经验沉淀：已沉淀脱敏金奖答辩点评 142 条，生成《双创避坑指南》6 册。
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Top A-grade Gold Projects & Active Warning Monitor */}
        <div className="space-y-6">
          {/* Top A-Grade Potential Pool List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-amber-800 flex items-center">
                <Award className="h-4 w-4 mr-1.5 text-amber-600" />
                A级重点金奖潜力项目池 ({aGradeProjects.length})
              </h3>
              <button 
                onClick={() => onNavigateTab('screening')}
                className="text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                全部排名
              </button>
            </div>

            <div className="space-y-3">
              {aGradeProjects.slice(0, 5).map((project, idx) => (
                <div
                  key={project.id}
                  id={`cockpit-top-project-${project.id}`}
                  onClick={() => onSelectProject(project)}
                  className="p-3 rounded-xl bg-slate-50/80 hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 transition cursor-pointer space-y-2 group shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-xs text-slate-900 group-hover:text-amber-800 transition line-clamp-1">
                        {project.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs text-sky-600 shrink-0 ml-2">
                      {project.totalScore} 分
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{project.college} · {project.leader}</span>
                    <span className="text-amber-700 font-semibold">
                      金奖匹配度 {project.goldSimilarity}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('mentorship')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-sky-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center shadow-2xs"
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              为 A 级项目批量调度国家级导师
            </button>
          </div>

          {/* Real-time Warning & Delay Monitor */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-rose-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1.5 text-rose-600" />
                异常停滞与合规预警 ({warningProjects.length})
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-semibold">
                需即时干预
              </span>
            </div>

            <div className="space-y-2.5">
              {warningProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100/60 transition cursor-pointer text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-medium text-rose-900">
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-rose-700 font-mono ml-2 shrink-0 font-bold">第{p.rank}名</span>
                  </div>
                  <p className="text-[11px] text-rose-700/90">{p.healthReason || '存在待办工单超时未完成'}</p>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 pt-1 flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
              系统每 2 小时自动扫描工单响应与查重状态
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
