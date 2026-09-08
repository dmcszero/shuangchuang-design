import { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Mic, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  FileText, 
  TrendingUp, 
  Search, 
  Award,
  BookMarked
} from 'lucide-react';
import { SupervisionWorkOrder, ProjectItem } from '../types';

interface SupervisionClosureProps {
  workOrders: SupervisionWorkOrder[];
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onUpdateWorkOrder?: (order: SupervisionWorkOrder) => void;
}

export default function SupervisionClosure({
  workOrders,
  projects,
  onSelectProject,
  onUpdateWorkOrder
}: SupervisionClosureProps) {
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'pending_student' | 'student_submitted' | 'expert_checked'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<SupervisionWorkOrder>(workOrders[0]);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);

  // Filtered orders
  const filteredOrders = workOrders.filter(o => {
    if (selectedStatus !== 'ALL' && o.status !== selectedStatus) return false;
    return true;
  });

  const handleSimulateAudioImport = () => {
    setIsSimulatingAudio(true);
    setSimulationSuccess(false);

    setTimeout(() => {
      setIsSimulatingAudio(false);
      setSimulationSuccess(true);
      setTimeout(() => setSimulationSuccess(false), 5000);
    }, 1800);
  };

  const handleApproveCheck = (order: SupervisionWorkOrder) => {
    const updated: SupervisionWorkOrder = {
      ...order,
      status: 'expert_checked',
      expertCheck: {
        checkedDate: '2026-08-27 20:15',
        approved: true,
        finalRemark: '专家复核确认：修改完全符合预期，数据闭环与逻辑严密，通过！',
        scoreChangeDelta: 2.0,
      }
    };
    setSelectedOrder(updated);
    if (onUpdateWorkOrder) {
      onUpdateWorkOrder(updated);
    }
  };

  return (
    <div id="supervision-closure-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <CheckSquare className="h-5 w-5 text-emerald-600 mr-2" />
            专家辅导资产沉淀与督导修改闭环中心
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            核心痛点解决：彻底杜绝“专家评完就忘、学生听完不改”，辅导语音AI结构化转为工单，双向跟踪复核
          </p>
        </div>

        {/* Audio/Video Import Simulator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSimulateAudioImport}
            disabled={isSimulatingAudio}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 transition flex items-center disabled:opacity-50"
          >
            <Mic className="h-4 w-4 mr-1.5" />
            {isSimulatingAudio ? 'AI 正在转写并生成工单...' : '导入专家辅导录音/视频'}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {simulationSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>
              已完成录音智能转写！成功提取《专家辅导诊断报告》，并自动生成 3 条修改工单任务推送至学生团队待办清单。
            </span>
          </div>
        </div>
      )}

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">已沉淀专家诊断工单</div>
          <div className="text-xl font-bold text-slate-900 mt-1">68 份</div>
          <div className="text-[11px] text-sky-700 font-semibold mt-1">100% 语音结构化归档</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <div className="text-xs text-emerald-800 font-medium">辅导修改整体完成率</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">88.5%</div>
          <div className="text-[11px] text-slate-500 mt-1">平均工单处理周期 3.2 天</div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-800 font-medium">专家二次 Check 提分均值</div>
          <div className="text-xl font-bold text-amber-700 mt-1">+7.4 分</div>
          <div className="text-[11px] text-slate-500 mt-1">94% 项目通过复核验收</div>
        </div>
      </div>

      {/* Main 2-Col Work Order Workflow Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Work Orders Pipeline List */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                辅导工单列表 ({filteredOrders.length})
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 text-[11px] bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedStatus('ALL')}
                className={`py-1 rounded font-medium transition ${selectedStatus === 'ALL' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedStatus('student_submitted')}
                className={`py-1 rounded font-medium transition ${selectedStatus === 'student_submitted' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                待复核
              </button>
              <button
                onClick={() => setSelectedStatus('expert_checked')}
                className={`py-1 rounded font-medium transition ${selectedStatus === 'expert_checked' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                已通过
              </button>
            </div>

            {/* Order Items */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3 rounded-xl border text-xs transition cursor-pointer space-y-1.5 shadow-2xs ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 text-slate-900 shadow-xs ring-1 ring-sky-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-slate-900 line-clamp-1 flex-1 pr-2">
                        {order.projectName}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] shrink-0 font-medium ${
                        order.status === 'expert_checked' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        order.status === 'student_submitted' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {order.status === 'expert_checked' ? '复核通过' :
                         order.status === 'student_submitted' ? '待复核' : '修改中'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>指导专家：{order.mentorName}</span>
                      <span>{order.sessionDate.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reusable Knowledge Assets Vault */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-xs text-slate-900 flex items-center">
              <BookMarked className="h-4 w-4 mr-1.5 text-amber-500" />
              校本《双创避坑指南》与脱敏案例
            </h3>
            <p className="text-slate-500 text-[11px]">
              已将历届 142 条专家经典点评及优秀项目修改前后版本沉淀为校本智库，供跨届传承。
            </p>
            <div className="space-y-1.5">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 flex justify-between">
                <span>📘 2026新工科赛道财务估值避坑指南</span>
                <span className="text-sky-700 font-medium">查看 (42例)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 flex justify-between">
                <span>📘 红旅赛道农户利益联结规范模板</span>
                <span className="text-sky-700 font-medium">查看 (28例)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Deep-Dive Work Order & Side-by-Side Version Diff & Check Mode */}
        <div className="lg:col-span-2 space-y-5">
          {selectedOrder && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 text-xs text-slate-800">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-sky-700 font-mono font-semibold">{selectedOrder.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{selectedOrder.college} · {selectedOrder.leader}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedOrder.projectName}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">辅导专家：{selectedOrder.mentorName}</div>
                  <div className="text-[11px] text-slate-500">{selectedOrder.sessionDate} (时长 {selectedOrder.audioDurationMinutes}分钟)</div>
                </div>
              </div>

              {/* Step 1: AI Extracted Diagnostic Report */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-xs text-sky-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  AI 提取《专家辅导核心诊断意见》
                </div>
                <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                  &quot;{selectedOrder.diagnosticSummary.coreFindings}&quot;
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {selectedOrder.diagnosticSummary.dimensionFeedback.map((fb, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-800">{fb.dimension}</span>
                        <span className={`text-[10px] px-1 rounded font-medium ${
                          fb.level === 'good' ? 'bg-emerald-100 text-emerald-800' :
                          fb.level === 'average' ? 'bg-sky-100 text-sky-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {fb.level === 'good' ? '优秀' : fb.level === 'average' ? '需优化' : '急需整改'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{fb.expertRemark}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Generated Modification Work Orders (To-Do List) */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 flex items-center">
                  <CheckSquare className="h-4 w-4 text-emerald-600 mr-1.5" />
                  已下发项目团队修改工单 (To-Do List)：
                </h4>

                <div className="space-y-2">
                  {selectedOrder.tasks.map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-medium border border-sky-200">
                            {t.category}
                          </span>
                          <span className={`font-semibold text-xs ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {t.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{t.description}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        t.completed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {t.completed ? '✓ 已修改完成' : '待提交'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Student Submission & Version Evolution Diff */}
              {selectedOrder.studentSubmission && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-sky-800 flex items-center">
                      <FileCheck className="h-4 w-4 mr-1.5 text-sky-600" />
                      学生团队修改交付说明（版本演进对比）
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      提交时间：{selectedOrder.studentSubmission.submissionDate}
                    </span>
                  </div>

                  <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-[11px] leading-relaxed">
                    {selectedOrder.studentSubmission.modificationNotes}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500">更新后商业计划书</div>
                      <div className="font-semibold text-slate-900 truncate mt-0.5">
                        {selectedOrder.studentSubmission.newBpVersion}
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500">更新后路演 PPT</div>
                      <div className="font-semibold text-slate-900 truncate mt-0.5">
                        {selectedOrder.studentSubmission.newPptVersion}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Expert Check & Score Jump Delta */}
              {selectedOrder.status === 'expert_checked' && selectedOrder.expertCheck ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" />
                      专家二次复核（Check模式）已通过验收
                    </span>
                    <span className="text-amber-700 font-mono text-sm">
                      本次打磨提分：+{selectedOrder.expertCheck.scoreChangeDelta} 分
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    <strong>专家最终复核意见：</strong> {selectedOrder.expertCheck.finalRemark}
                  </p>
                </div>
              ) : selectedOrder.status === 'student_submitted' ? (
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 text-sky-900 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs">学生已提交修改版本，等待专家复核</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">可由专家或管理者在此一键模拟二次Check核验</p>
                  </div>
                  <button
                    onClick={() => handleApproveCheck(selectedOrder)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                  >
                    通过专家二次复核验收
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
