import { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  Users, 
  CheckSquare, 
  Kanban, 
  UploadCloud, 
  FileText, 
  Bell, 
  BookOpen, 
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Target
} from 'lucide-react';
import { NotificationAlert } from '../types';

interface NavbarProps {
  activeTab: 'cockpit' | 'screening' | 'mentorship' | 'supervision' | 'milestones';
  setActiveTab: (tab: 'cockpit' | 'screening' | 'mentorship' | 'supervision' | 'milestones') => void;
  onOpenBatchImport: () => void;
  onOpenReportExport: () => void;
  onOpenRulesConfig: () => void;
  alerts: NotificationAlert[];
  onSelectProjectFromAlert?: (projectId: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenBatchImport,
  onOpenReportExport,
  onOpenRulesConfig,
  alerts,
  onSelectProjectFromAlert
}: NavbarProps) {
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const urgentAlertCount = alerts.filter(a => a.type === 'urgent' || a.type === 'warning').length;

  const navItems = [
    { id: 'cockpit', label: '备赛数据驾驶舱', icon: BarChart3, badge: 'AI决策' },
    { id: 'screening', label: '智能对标初筛与排名', icon: Layers, badge: '2026细则' },
    { id: 'mentorship', label: '常态化辅导与调度', icon: Users, badge: '导师智库' },
    { id: 'supervision', label: '辅导资产沉淀与督导', icon: CheckSquare, badge: '工单闭环' },
    { id: 'milestones', label: '重点项目全流程看板', icon: Kanban, badge: '5阶管线' },
  ] as const;

  return (
    <header id="global-header" className="bg-white text-slate-900 sticky top-0 z-40 border-b border-slate-200 shadow-xs">
      {/* Top Banner & Quick Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and System Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">高校双创管理中枢</span>
                <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-sky-600" /> 2026 国赛AI赋能版
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">中国国际大学生创新大赛（2026）项目培育·初筛·督导闭环决策平台</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">申报项目总数:</span>
              <span className="font-semibold text-slate-900">82 项</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="flex items-center space-x-1.5">
              <span className="text-amber-700 font-medium">A级金奖潜力池:</span>
              <span className="font-bold text-amber-700">15 项</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-700 font-medium">辅导修改闭环率:</span>
              <span className="font-bold text-emerald-700">88.5%</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="flex items-center space-x-1.5">
              <span className="text-rose-700 font-medium">合规预警拦截:</span>
              <span className="font-bold text-rose-700">2 项</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              id="btn-rules-modal"
              onClick={onOpenRulesConfig}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-xs transition"
              title="查看中国国际大学生创新大赛（2026）官方评审规则"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
              2026评审规则
            </button>

            <button
              id="btn-batch-import"
              onClick={onOpenBatchImport}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition"
            >
              <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
              海量项目导入
            </button>

            <button
              id="btn-report-export"
              onClick={onOpenReportExport}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              阶段复盘汇报
            </button>

            {/* Alert Center Trigger */}
            <div className="relative">
              <button
                id="btn-alert-center"
                onClick={() => setShowAlertMenu(!showAlertMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-xs transition"
              >
                <Bell className="h-4 w-4" />
                {urgentAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {urgentAlertCount}
                  </span>
                )}
              </button>

              {/* Alert Dropdown */}
              {showAlertMenu && (
                <div 
                  id="alert-dropdown-menu"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                      预警与待办中心 ({alerts.length})
                    </span>
                    <span className="text-[11px] text-slate-400">实时智能监控</span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        id={`alert-item-${alert.id}`}
                        className={`p-2.5 rounded-lg text-xs border ${
                          alert.type === 'urgent'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : alert.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span className="truncate">{alert.title}</span>
                          <span className="text-[10px] opacity-75 whitespace-nowrap ml-2">{alert.timestamp}</span>
                        </div>
                        <p className="text-[11px] mt-1 leading-relaxed opacity-90">{alert.content}</p>
                        {alert.projectId && (
                          <button
                            onClick={() => {
                              setShowAlertMenu(false);
                              if (onSelectProjectFromAlert) {
                                onSelectProjectFromAlert(alert.projectId!);
                              }
                            }}
                            className="mt-2 text-[11px] text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center"
                          >
                            {alert.actionLabel || '查看详情'} <ChevronRight className="h-3 w-3 ml-0.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workflow Tabs */}
      <div className="bg-slate-50/70 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  isActive ? 'bg-sky-700 text-sky-100' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
