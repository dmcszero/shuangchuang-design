import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  Send, 
  FileText,
  UserPlus,
  BookOpen,
  Info
} from 'lucide-react';
import { ProjectTeam, MOCK_PROJECT_TEAMS } from '../data/mockUsersAndTeams';

interface TeamManagementProps {
  onSelectProject?: (projectId: string) => void;
}

export default function TeamManagement({ onSelectProject }: TeamManagementProps) {
  const [teams, setTeams] = useState<ProjectTeam[]>(MOCK_PROJECT_TEAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [crossCollegeFilter, setCrossCollegeFilter] = useState<string>('all');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(teams[0]?.id || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendReminder = (teamName: string, issue: string) => {
    showToast(`已向【${teamName}】负责人及指导教师发送团队结构整改催办通知`);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.college.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || team.auditStatus === statusFilter;
    const matchesCross = crossCollegeFilter === 'all' || (crossCollegeFilter === 'yes' ? team.crossCollege : !team.crossCollege);

    return matchesSearch && matchesStatus && matchesCross;
  });

  // Key Stats
  const totalTeams = teams.length + 77;
  const crossTeams = Math.round(totalTeams * 0.683);
  const financeReady = Math.round(totalTeams * 0.78);
  const ipReady = Math.round(totalTeams * 0.942);

  return (
    <div id="team-management-module" className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">项目团队人员与学科架构管理</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              2026国赛团队资质核查
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            严格对标 2026 国赛【个人成长】与【团队架构】评价要素，重点核查本硕博学段配比、商业专人配置及专利成果权属
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => showToast('已启动全校项目团队结构与发明人权属合规自动化扫描')}
            className="inline-flex items-center px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
            一键合规全检
          </button>
        </div>
      </div>

      {/* Key Diagnostic Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">申报团队总数</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalTeams} <span className="text-xs font-normal text-slate-400">支</span></div>
          <div className="text-[11px] text-slate-500 mt-1">
            平均每队 5.2 位核心成员
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">跨学科交叉团队</span>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-2">68.3% <span className="text-xs font-normal text-slate-400">({crossTeams}队)</span></div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 符合 2026 新工科/新文科交叉倡导
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">财务/商业专人配置率</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">78.0% <span className="text-xs font-normal text-slate-400">({financeReady}队)</span></div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            剩余 18 队亟待补齐经管财会成员
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">核心专利人入队率</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">94.2% <span className="text-xs font-normal text-slate-400">合规</span></div>
          <div className="text-[11px] text-rose-700 font-medium mt-1 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1 text-rose-600" />
            1 项存在成果权属高风险拦截
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索项目编号、名称、队长、指导教师..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">全部团队核验状态</option>
              <option value="verified">核验通过 (结构达标)</option>
              <option value="need_supplement">待整改补充 (缺商业/财务成员)</option>
              <option value="warning">一票否决高风险 (权属瑕疵)</option>
            </select>
          </div>

          <div>
            <select
              value={crossCollegeFilter}
              onChange={e => setCrossCollegeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">跨学院交叉团队 (全部)</option>
              <option value="yes">仅看跨学院交叉团队</option>
              <option value="no">单一学院团队</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Cards List */}
      <div className="space-y-4">
        {filteredTeams.map(team => {
          const isExpanded = expandedTeamId === team.id;
          return (
            <div 
              key={team.id}
              id={`team-card-${team.id}`}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition"
            >
              {/* Card Summary Header */}
              <div 
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition"
                onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      {team.projectCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      team.grade === 'A'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : team.grade === 'B'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {team.grade}级梯队
                    </span>
                    <span className="text-xs text-slate-500">{team.trackLabel}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-600">{team.college}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {team.projectName}
                  </h3>

                  {/* Leader and Advisor preview */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-0.5">
                    <span>
                      <strong className="text-slate-800">队长：</strong> {team.leader.name} ({team.leader.degree} · {team.leader.major})
                    </span>
                    <span>
                      <strong className="text-slate-800">第一指导教师：</strong> {team.advisor.name} ({team.advisor.title})
                    </span>
                    <span>
                      <strong className="text-slate-800">团队规模：</strong> {team.members.length} 人
                    </span>
                  </div>
                </div>

                {/* Status Badges and Expand Arrow */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      team.auditStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : team.auditStatus === 'need_supplement'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {team.auditStatus === 'verified' && <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />}
                      {team.auditStatus === 'need_supplement' && <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600" />}
                      {team.auditStatus === 'warning' && <AlertTriangle className="h-3.5 w-3.5 mr-1 text-rose-600" />}
                      {team.auditStatus === 'verified' ? '结构达标' : team.auditStatus === 'need_supplement' ? '建议补齐商业专人' : '一票否决拦截'}
                    </span>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-150 text-xs">
                  {/* Audit Evaluation Remark */}
                  <div className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                    team.auditStatus === 'verified'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : team.auditStatus === 'need_supplement'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}>
                    <Info className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                    <div className="space-y-1">
                      <div className="font-bold text-xs">2026 评审专家/AI 团队架构诊断意见：</div>
                      <p className="leading-relaxed">{team.auditRemark}</p>
                    </div>
                  </div>

                  {/* 2026 Structural Compliance Checks */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-slate-500 font-medium">跨学科 / 跨学院交叉</div>
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                        {team.crossCollege ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>是 (多学科优势互补)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span>否 (单一学科背景)</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-slate-500 font-medium">商业与财务专人就位</div>
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                        {team.hasFinanceSpecialist ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>已配备 (经管/财会专人)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-700">缺失 (需跨学院增补)</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-slate-500 font-medium">核心发明人入队合规</div>
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                        {team.ipOwnerEnrolled ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>合规 (发明人在队无纠纷)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-rose-600" />
                            <span className="text-rose-700">高危 (发明人未入队)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Team Members Roster */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                      <span>团队成员明细与赛事实质分工表 ({team.members.length}人)</span>
                      <span className="text-[11px] text-slate-400 font-normal">支持按 2026 规程审查学生身份真实性</span>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">姓名 / 学号</th>
                            <th className="py-2.5 px-3">学段与专业</th>
                            <th className="py-2.5 px-3">所属学院</th>
                            <th className="py-2.5 px-3">赛事实质分工</th>
                            <th className="py-2.5 px-3">专利/软著发明人</th>
                            <th className="py-2.5 px-3">联系方式</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {team.members.map(member => (
                            <tr key={member.id} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-slate-900">{member.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{member.studentId}</div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mr-1.5 ${
                                  member.degree === '博士研究生'
                                    ? 'bg-purple-100 text-purple-800'
                                    : member.degree === '硕士研究生'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {member.degree}
                                </span>
                                <span>{member.major}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">{member.college}</td>
                              <td className="py-2.5 px-3">
                                <span className="font-medium text-slate-800">{member.division}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                {member.isIpOwner ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    核心发明人
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">-</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-[11px] text-slate-500 font-mono">
                                {member.phone}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-500">
                      指导教师：<strong className="text-slate-700">{team.advisor.name}</strong>（{team.advisor.phone}）
                    </div>

                    <div className="flex items-center space-x-2">
                      {team.auditStatus !== 'verified' && (
                        <button
                          onClick={() => handleSendReminder(team.projectName, team.auditRemark)}
                          className="px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition inline-flex items-center"
                        >
                          <Send className="h-3.5 w-3.5 mr-1" />
                          下发团队整改催办单
                        </button>
                      )}

                      {onSelectProject && (
                        <button
                          onClick={() => onSelectProject(team.projectId)}
                          className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition inline-flex items-center"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          查看项目全景档案
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
