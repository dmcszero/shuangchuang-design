import { useState } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ProjectItem } from '../types';

interface MilestoneKanbanProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenReportExport: () => void;
}

export default function MilestoneKanban({
  projects,
  onSelectProject,
  onOpenReportExport
}: MilestoneKanbanProps) {
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<string>('ALL');

  const stages = [
    { key: 'L1', name: 'L1 · 申报与初筛', desc: '规则自检与AI对标', count: projects.filter(p => p.currentStage === 'L1').length, color: 'border-slate-200 bg-white text-slate-900' },
    { key: 'L2', name: 'L2 · 校赛与导师打磨', desc: '首轮短板工单整改', count: projects.filter(p => p.currentStage === 'L2').length, color: 'border-blue-200 bg-blue-50/40 text-blue-950' },
    { key: 'L3', name: 'L3 · 省赛集中封闭营', desc: '商业与财务模型强化', count: projects.filter(p => p.currentStage === 'L3').length, color: 'border-indigo-200 bg-indigo-50/40 text-indigo-950' },
    { key: 'L4', name: 'L4 · 国赛精英训练营', desc: '国赛评委模拟答辩', count: projects.filter(p => p.currentStage === 'L4').length, color: 'border-amber-200 bg-amber-50/40 text-amber-950' },
    { key: 'L5', name: 'L5 · 金奖答辩冲刺', desc: '一票否决与极限路演', count: projects.filter(p => p.currentStage === 'L5').length, color: 'border-emerald-200 bg-emerald-50/40 text-emerald-950' },
  ];

  const filteredProjects = projects.filter(p => {
    if (selectedPipelineStage !== 'ALL' && p.currentStage !== selectedPipelineStage) return false;
    return true;
  });

  return (
    <div id="milestone-kanban-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <GitBranch className="h-5 w-5 text-sky-600 mr-2" />
            全流程进度追踪、实时监控与金奖指标复盘
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            L1~L5 生命周期管线监控、项目停滞超时实时预警、金奖核心指标提升全景复盘
          </p>
        </div>

        <button
          onClick={onOpenReportExport}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 transition flex items-center shrink-0"
        >
          <Award className="h-4 w-4 mr-1.5" />
          生成金奖指标提升复盘材料
        </button>
      </div>

      {/* Stage Flow Indicator Cards (L1 -> L5) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stages.map((st) => (
          <div
            key={st.key}
            onClick={() => setSelectedPipelineStage(selectedPipelineStage === st.key ? 'ALL' : st.key)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 shadow-2xs ${st.color} ${
              selectedPipelineStage === st.key ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/30' : 'hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>{st.name.split('·')[0]}</span>
              <span className="font-mono text-sm text-sky-700">{st.count} 项</span>
            </div>
            <div className="text-[11px] text-slate-700 font-semibold truncate">{st.name.split('·')[1]}</div>
            <div className="text-[10px] text-slate-500">{st.desc}</div>
          </div>
        ))}
      </div>

      {/* Score Improvement & Stage Progression Curve */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center">
            <TrendingUp className="h-4 w-4 text-emerald-600 mr-2" />
            重点培育梯队：各备赛阶段均分跃迁与金奖指标提升趋势
          </h3>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            整体均分净增 +7.4 分
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[11px] text-slate-500 font-medium">阶段一 · 申报初筛均分</div>
            <div className="text-xl font-bold text-slate-700">81.2 分</div>
            <div className="text-[10px] text-slate-500">主要问题：产业定位不清</div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-1">
            <div className="text-[11px] text-sky-800 font-medium">阶段二 · 校赛督导后均分</div>
            <div className="text-xl font-bold text-sky-700">86.5 分</div>
            <div className="text-[10px] text-emerald-700 font-semibold">环比提升 +5.3 分</div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1">
            <div className="text-[11px] text-blue-800 font-medium">阶段三 · 省赛集训后均分</div>
            <div className="text-xl font-bold text-blue-700">90.8 分</div>
            <div className="text-[10px] text-emerald-700 font-semibold">财务模型与估值补强</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
            <div className="text-[11px] text-amber-800 font-medium">阶段四 · A级国赛金奖冲刺</div>
            <div className="text-xl font-bold text-amber-700">94.8 分</div>
            <div className="text-[10px] text-amber-800 font-medium">已达国赛金奖夺金水准</div>
          </div>
        </div>
      </div>

      {/* Kanban Column Board View */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center">
            <Layers className="h-4 w-4 text-sky-600 mr-2" />
            参赛项目全生命周期阶段分布与实时健康度监控
          </h3>
          <span className="text-xs text-slate-500">
            共显示 <strong>{filteredProjects.length}</strong> 个项目
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {stages.map((stage) => {
            const stageProjects = projects.filter(p => p.currentStage === stage.key);
            return (
              <div key={stage.key} className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 flex flex-col space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-xs text-slate-900">{stage.name.split('·')[0]}</span>
                  <span className="text-[11px] text-slate-500 font-mono">({stageProjects.length})</span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px] pr-0.5">
                  {stageProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => onSelectProject(project)}
                      className={`p-2.5 rounded-xl border text-xs transition cursor-pointer space-y-1.5 shadow-2xs ${
                        project.healthStatus === 'critical'
                          ? 'bg-rose-50 border-rose-200 hover:border-rose-400'
                          : project.healthStatus === 'warning'
                          ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
                          : 'bg-white border-slate-200 hover:border-sky-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-slate-900 line-clamp-1 flex-1 pr-1">
                          {project.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          project.grade === 'A' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          project.grade === 'B' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {project.grade}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{project.leader} ({project.college.slice(0, 4)})</span>
                        <span className="font-bold text-sky-700 font-mono">{project.totalScore}分</span>
                      </div>

                      {project.healthStatus !== 'normal' && (
                        <div className="text-[10px] text-rose-700 flex items-center pt-0.5 border-t border-slate-200/80 font-medium">
                          <AlertTriangle className="h-3 w-3 mr-1 shrink-0" />
                          <span className="truncate">{project.healthReason || '待办超时'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
