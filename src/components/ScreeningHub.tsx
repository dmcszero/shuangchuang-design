import { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  SlidersHorizontal, 
  Download, 
  Users, 
  CheckCircle2, 
  Info,
  ChevronRight
} from 'lucide-react';
import { ProjectItem, TrackType, TierGrade } from '../types';

interface ScreeningHubProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenBatchImport: () => void;
  onOpenAssignMentor?: (project: ProjectItem) => void;
}

export default function ScreeningHub({
  projects,
  onSelectProject,
  onOpenBatchImport,
  onOpenAssignMentor
}: ScreeningHubProps) {
  const [selectedTrack, setSelectedTrack] = useState<TrackType | 'ALL'>('higher_education_creative');
  const [selectedGrade, setSelectedGrade] = useState<TierGrade | 'ALL'>('ALL');
  const [selectedCompliance, setSelectedCompliance] = useState<'ALL' | 'passed' | 'warning'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tier2_matrix' | 'comprehensive' | 'compliance_scan'>('tier2_matrix');

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedTrack !== 'ALL' && p.track !== selectedTrack) return false;
      if (selectedGrade !== 'ALL' && p.grade !== selectedGrade) return false;
      if (selectedCompliance === 'passed' && !p.compliance.passed) return false;
      if (selectedCompliance === 'warning' && p.compliance.passed) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.college.toLowerCase().includes(q) ||
          p.leader.toLowerCase().includes(q) ||
          p.advisor.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, selectedTrack, selectedGrade, selectedCompliance, searchQuery]);

  return (
    <div id="screening-hub-view" className="space-y-5">
      {/* Top Header & Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Layers className="h-5 w-5 text-sky-600 mr-2" />
              2026国赛官方评审规则·智能对标初筛与细分二级指标评分
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              内置最新国赛一级指标与细分二级指标，支持多赛道标准自适应匹配打分、金奖对标特征比对与合规秒级拦截
            </p>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('tier2_matrix')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                viewMode === 'tier2_matrix'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>2026二级细分指标全景表</span>
            </button>

            <button
              onClick={() => setViewMode('comprehensive')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                viewMode === 'comprehensive'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>综合梯队与金奖对标</span>
            </button>

            <button
              onClick={() => setViewMode('compliance_scan')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                viewMode === 'compliance_scan'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>合规与一票否决拦截</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Track Selector */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">赛道与组别规则切换</label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value as TrackType | 'ALL')}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="higher_education_creative">高教主赛道 - 创意组 (4个一级/17个二级)</option>
              <option value="higher_education_startup">高教主赛道 - 创业组 (4个一级/20个二级)</option>
              <option value="red_youth_creative">青年红色筑梦之旅 - 创意组</option>
              <option value="vocational_creative">职教赛道 - 创意组</option>
              <option value="industry_enterprise">产业命题赛道 - 企业命题组</option>
              <option value="ALL">全部申报赛道</option>
            </select>
          </div>

          {/* Grade Selector */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">梯队评级筛选</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as TierGrade | 'ALL')}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">全部评级梯队 (A/B/C/D)</option>
              <option value="A">A级 · 国赛金奖潜力池 (90分+)</option>
              <option value="B">B级 · 省金/国银培育池 (80-89分)</option>
              <option value="C">C级 · 校赛基础培育池 (70-79分)</option>
              <option value="D">D级 · 需深度重构 (70分以下)</option>
            </select>
          </div>

          {/* Compliance Status */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">合规审查状态</label>
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value as 'ALL' | 'passed' | 'warning')}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">全部合规状态</option>
              <option value="passed">仅看合规审查通过</option>
              <option value="warning">仅看一票否决/查重预警</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">关键词搜索</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索项目名称、学院、负责人..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: EXPANDED TIER-2 MATRIX TABLE */}
      {viewMode === 'tier2_matrix' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-2">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">当前呈现：2026国赛标准细分二级指标打分矩阵</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">共筛选出 <strong>{filteredProjects.length}</strong> 个对标项目</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center text-emerald-700 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> ≥85% 优势项
              </span>
              <span className="flex items-center text-rose-700 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-1" /> &lt;75% 需补强
              </span>
              <button
                onClick={() => alert('已导出《2026中国国际大学生创新大赛初筛二级指标评分细则表.xlsx》')}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition flex items-center ml-2 shadow-2xs font-medium"
              >
                <Download className="h-3.5 w-3.5 mr-1" /> 导出评分细则
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {/* Level 1 Group Headers */}
                <tr className="bg-slate-100/90 text-[11px] text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold sticky left-0 bg-slate-100 z-20 w-48 border-r border-slate-200">项目基本信息</th>
                  <th className="py-2.5 px-2 font-semibold text-center w-16">总分</th>
                  <th className="py-2.5 px-2 font-semibold text-center w-16 border-r border-slate-200">梯队</th>
                  
                  {/* Tier 1 Super Columns */}
                  <th colSpan={5} className="py-2 px-2 text-center bg-blue-50 text-blue-900 border-r border-slate-200 font-semibold">
                    个人成长 (满分 30分) · 5个二级指标
                  </th>
                  <th colSpan={3} className="py-2 px-2 text-center bg-purple-50 text-purple-900 border-r border-slate-200 font-semibold">
                    项目创新 (满分 30分) · 3个二级指标
                  </th>
                  <th colSpan={4} className="py-2 px-2 text-center bg-rose-50 text-rose-900 border-r border-slate-200 font-semibold">
                    产业价值 (满分 25分) · 4个二级指标
                  </th>
                  <th colSpan={5} className="py-2 px-2 text-center bg-emerald-50 text-emerald-900 border-r border-slate-200 font-semibold">
                    团队协作 (满分 15分) · 5个二级指标
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                </tr>

                {/* Level 2 Sub-Headers */}
                <tr className="bg-slate-50 text-[10px] text-slate-600 border-b border-slate-200 font-mono">
                  <th className="py-2 px-3 sticky left-0 bg-slate-50 z-20 border-r border-slate-200">名称 / 学院 / 负责人</th>
                  <th className="py-2 px-2 text-center">100分</th>
                  <th className="py-2 px-2 text-center border-r border-slate-200">评级</th>

                  {/* 个人成长 5项 */}
                  <th className="py-2 px-1 text-center bg-blue-50/50" title="立德树人(6分)">立德(6)</th>
                  <th className="py-2 px-1 text-center bg-blue-50/50" title="调研深入(6分)">调研(6)</th>
                  <th className="py-2 px-1 text-center bg-blue-50/50" title="逻辑正确(6分)">逻辑(6)</th>
                  <th className="py-2 px-1 text-center bg-blue-50/50" title="知识掌握与应用能力(6分)">应用(6)</th>
                  <th className="py-2 px-1 text-center bg-blue-50/50 border-r border-slate-200" title="人才培养成效(6分)">育人(6)</th>

                  {/* 项目创新 3项 */}
                  <th className="py-2 px-1 text-center bg-purple-50/50" title="问题导向(10分)">问题(10)</th>
                  <th className="py-2 px-1 text-center bg-purple-50/50" title="目标导向(10分)">目标(10)</th>
                  <th className="py-2 px-1 text-center bg-purple-50/50 border-r border-slate-200" title="创新成效(10分)">成效(10)</th>

                  {/* 产业价值 4项 */}
                  <th className="py-2 px-1 text-center bg-rose-50/50" title="产业认知(6分)">认知(6)</th>
                  <th className="py-2 px-1 text-center bg-rose-50/50" title="市场定位(7分)">市场(7)</th>
                  <th className="py-2 px-1 text-center bg-rose-50/50" title="落地前景(6分)">落地(6)</th>
                  <th className="py-2 px-1 text-center bg-rose-50/50 border-r border-slate-200" title="社会影响(6分)">社会(6)</th>

                  {/* 团队协作 5项 */}
                  <th className="py-2 px-1 text-center bg-emerald-50/50" title="团队精神(3分)">精神(3)</th>
                  <th className="py-2 px-1 text-center bg-emerald-50/50" title="团队结构(3分)">结构(3)</th>
                  <th className="py-2 px-1 text-center bg-emerald-50/50" title="团队效能(3分)">效能(3)</th>
                  <th className="py-2 px-1 text-center bg-emerald-50/50" title="团队资源(3分)">资源(3)</th>
                  <th className="py-2 px-1 text-center bg-emerald-50/50 border-r border-slate-200" title="团队贡献(3分)">贡献(3)</th>

                  <th className="py-2 px-3 text-center">管理下钻</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredProjects.map((project) => {
                  // Find tier1 scores
                  const pg = project.tier1Scores.find(t => t.id === 'personal_growth');
                  const pi = project.tier1Scores.find(t => t.id === 'project_innovation');
                  const iv = project.tier1Scores.find(t => t.id === 'industry_value' || t.id === 'development_prospect' || t.id === 'execution_effect');
                  const tc = project.tier1Scores.find(t => t.id === 'team_collaboration');

                  return (
                    <tr 
                      key={project.id}
                      id={`project-row-${project.id}`}
                      className="hover:bg-slate-50 transition group cursor-pointer"
                      onClick={() => onSelectProject(project)}
                    >
                      {/* Basic Info Sticky */}
                      <td className="py-3 px-3 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200">
                        <div className="space-y-0.5 max-w-[200px] sm:max-w-xs">
                          <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition line-clamp-1">
                            {project.name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center space-x-1.5 truncate">
                            <span>{project.college}</span>
                            <span>•</span>
                            <span>{project.leader}</span>
                          </div>
                        </div>
                      </td>

                      {/* Total Score */}
                      <td className="py-3 px-2 text-center font-bold text-sky-700 font-mono">
                        {project.totalScore}
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-2 text-center border-r border-slate-200">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          project.grade === 'A' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          project.grade === 'B' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          project.grade === 'C' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {project.grade}
                        </span>
                      </td>

                      {/* 个人成长 5个二级指标 */}
                      <td className="py-3 px-1 text-center font-mono bg-blue-50/20 text-slate-700">
                        {pg?.tier2Scores[0]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-blue-50/20 text-slate-700">
                        {pg?.tier2Scores[1]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-blue-50/20 text-slate-700">
                        {pg?.tier2Scores[2]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-blue-50/20 text-slate-700">
                        {pg?.tier2Scores[3]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono border-r border-slate-200 bg-blue-50/20 text-slate-700">
                        {pg?.tier2Scores[4]?.score ?? '-'}
                      </td>

                      {/* 项目创新 3个二级指标 */}
                      <td className="py-3 px-1 text-center font-mono bg-purple-50/20 text-slate-700">
                        {pi?.tier2Scores[0]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-purple-50/20 text-slate-700">
                        {pi?.tier2Scores[1]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono border-r border-slate-200 bg-purple-50/20 text-slate-700">
                        {pi?.tier2Scores[2]?.score ?? '-'}
                      </td>

                      {/* 产业价值 4个二级指标 */}
                      <td className="py-3 px-1 text-center font-mono bg-rose-50/20 text-slate-700">
                        {iv?.tier2Scores[0]?.score ?? '-'}
                      </td>
                      <td className={`py-3 px-1 text-center font-mono bg-rose-50/20 font-bold ${
                        (iv?.tier2Scores[1]?.score ?? 0) < 5.5 ? 'text-rose-600' : 'text-slate-700'
                      }`}>
                        {iv?.tier2Scores[1]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-rose-50/20 text-slate-700">
                        {iv?.tier2Scores[2]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono border-r border-slate-200 bg-rose-50/20 text-slate-700">
                        {iv?.tier2Scores[3]?.score ?? '-'}
                      </td>

                      {/* 团队协作 5个二级指标 */}
                      <td className="py-3 px-1 text-center font-mono bg-emerald-50/20 text-slate-700">
                        {tc?.tier2Scores[0]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-emerald-50/20 text-slate-700">
                        {tc?.tier2Scores[1]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-emerald-50/20 text-slate-700">
                        {tc?.tier2Scores[2]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono bg-emerald-50/20 text-slate-700">
                        {tc?.tier2Scores[3]?.score ?? '-'}
                      </td>
                      <td className="py-3 px-1 text-center font-mono border-r border-slate-200 bg-emerald-50/20 text-slate-700">
                        {tc?.tier2Scores[4]?.score ?? '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectProject(project)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-200 rounded text-[11px] font-medium transition inline-flex items-center"
                        >
                          下钻诊断 <ChevronRight className="h-3 w-3 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: COMPREHENSIVE BENCHMARK TABLE */}
      {viewMode === 'comprehensive' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold w-16">排名</th>
                  <th className="py-3 px-4 font-semibold">项目名称 / 所属赛道</th>
                  <th className="py-3 px-4 font-semibold">学院 / 团队负责人</th>
                  <th className="py-3 px-3 font-semibold text-center">综合评分</th>
                  <th className="py-3 px-3 font-semibold text-center">梯队定级</th>
                  <th className="py-3 px-3 font-semibold text-center">金奖特征对标</th>
                  <th className="py-3 px-3 font-semibold text-center">AI置信度</th>
                  <th className="py-3 px-4 font-semibold text-center">指派导师</th>
                  <th className="py-3 px-4 font-semibold text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      #{project.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition line-clamp-1">
                          {project.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {project.trackLabel} · {project.groupLabel}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{project.college}</div>
                      <div className="text-[11px] text-slate-500">{project.leader} ({project.advisor})</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-sky-700 text-sm font-mono">
                      {project.totalScore}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        project.grade === 'A' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        project.grade === 'B' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        project.grade === 'C' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {project.grade} 级
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-amber-700 font-mono">{project.goldSimilarity}%</span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700 font-mono">
                      {project.aiConfidence}%
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-slate-700">
                      {project.assignedMentorName ? (
                        <span className="text-emerald-700 font-semibold">{project.assignedMentorName.split('（')[0]}</span>
                      ) : (
                        <span className="text-slate-400 italic">待调度</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onSelectProject(project)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-sky-700 rounded text-xs transition font-medium"
                        >
                          详情
                        </button>
                        {onOpenAssignMentor && (
                          <button
                            onClick={() => onOpenAssignMentor(project)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs transition font-medium shadow-2xs"
                          >
                            排期
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: COMPLIANCE & IP SCAN TABLE */}
      {viewMode === 'compliance_scan' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-3 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mr-2" />
                知识产权合规审查、查重与一票否决秒级拦截看板
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                根据2026大赛评审规则第2条与第4条“必要条件”：若存在弄虚作假、抄袭剽窃、AI代写违规等情况，一票否决。
              </p>
            </div>
            <button
              onClick={onOpenBatchImport}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
            >
              重新批量扫描
            </button>
          </div>

          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  !project.compliance.passed || project.compliance.ipRiskLevel === 'high'
                    ? 'bg-rose-50/80 border-rose-300 shadow-2xs'
                    : project.compliance.warnings.length > 0
                    ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{project.name}</span>
                    <span className="text-[11px] text-slate-500">({project.college} · {project.leader})</span>
                    {!project.compliance.passed && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                        一票否决拦截
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong className="text-slate-700">IP权属：</strong> {project.compliance.ipDetails}
                  </p>
                </div>

                <div className="flex items-center space-x-6 shrink-0 text-xs">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500">全网查重率</div>
                    <div className={`font-mono font-bold mt-0.5 ${
                      project.compliance.plagiarismRate > 15 ? 'text-rose-600 text-sm' : 'text-emerald-600'
                    }`}>
                      {project.compliance.plagiarismRate}%
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] text-slate-500">AI代写痕迹</div>
                    <div className="font-mono font-bold text-sky-700 mt-0.5">
                      {project.compliance.aiContentRate}%
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] text-slate-500">逻辑断层疑点</div>
                    <div className={`font-mono font-bold mt-0.5 ${
                      project.logicGaps.length > 0 ? 'text-amber-700' : 'text-slate-500'
                    }`}>
                      {project.logicGaps.length} 处
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition font-medium shadow-2xs"
                  >
                    查看体检报告
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
