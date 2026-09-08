/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, TrendingUp, 
  Sparkles, X, ShieldCheck, HeartHandshake, Layers 
} from 'lucide-react';
import { mockOperationMetrics } from '../data/mockCoachData';

interface OperationFlywheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OperationFlywheelModal({ isOpen, onClose }: OperationFlywheelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-gray-900">第七幕 · 运营闭环与数据驾驶舱</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  越用越好 · 自进化飞轮
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                实时追踪使用层、质量层与业务层三大效能指标，展现“学生反馈 → 经验校准 → 质量提升”完整闭环
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Closed-Loop Flywheel Architecture Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">智能体自进化飞轮 (Self-Reinforcement Loop)</h4>
              <p className="text-[11px] text-gray-600">
                学生采纳/点赞 → 触发 4.2/4.3 诊断与答辩规则权重新标定 → 反哺专家经验库与金奖对标集
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-blue-700 font-semibold bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200/50">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>动态优化迭代周期: 实时</span>
          </div>
        </div>

        {/* 3-Layer Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layer 1: Usage Layer */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span>使用层 (Usage)</span>
              </span>
              <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                活跃度
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-gray-400 block">周活跃备赛人次</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {mockOperationMetrics.activeStudentsWeekly}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium ml-1.5">↑ 24.3%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">人均提问轮次</span>
                <span className="text-sm font-bold text-gray-800 font-mono">
                  {mockOperationMetrics.avgQuestionsPerUser} 轮/人
                </span>
              </div>

              {/* Scenario breakdown */}
              <div className="pt-2 border-t border-gray-200 space-y-1.5">
                <span className="text-[10px] font-semibold text-gray-600 block">四场景使用分布</span>
                {mockOperationMetrics.scenarioDistribution.map((s, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-600">
                      <span>{s.name}</span>
                      <span className="font-mono font-bold">{s.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Layer 2: Quality Layer */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>质量层 (Quality)</span>
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                精准可信
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-400 block">综合回答好评率 (点赞率)</span>
                <span className="text-xl font-black text-emerald-600 font-mono">
                  {mockOperationMetrics.qualityMetrics.userSatisfactionRate}
                </span>
              </div>
              <div className="space-y-2 pt-1 border-t border-gray-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">政策来源可追溯率</span>
                  <span className="font-bold text-blue-600 font-mono">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">BP 诊断建议采纳率</span>
                  <span className="font-bold text-purple-600 font-mono">
                    {mockOperationMetrics.qualityMetrics.diagnosisAdoptionRate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">专家经验反馈微调</span>
                  <span className="font-bold text-amber-600 font-mono">
                    {mockOperationMetrics.qualityMetrics.qASkillFeedbackCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Business Layer */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                <span>业务层 (Business)</span>
              </span>
              <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono">
                赛事成效
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-400 block">校内初赛晋级通过率</span>
                <span className="text-xl font-black text-purple-600 font-mono">
                  {mockOperationMetrics.businessImpact.schoolAdvancementRate}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium ml-1.5">
                  (较往届 {mockOperationMetrics.businessImpact.schoolAdvancementGrowth})
                </span>
              </div>
              <div className="space-y-2 pt-1 border-t border-gray-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">本届省赛金奖数</span>
                  <span className="font-bold text-amber-600 font-mono">
                    {mockOperationMetrics.businessImpact.provincialGoldMedalCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">国赛金奖冲刺目标</span>
                  <span className="font-bold text-red-600 font-mono">
                    {mockOperationMetrics.businessImpact.nationalGoldMedalTarget}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Flywheel Reinforcement Logs */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
            <HeartHandshake className="h-3.5 w-3.5 text-blue-600" />
            <span>实时自学习与知识库加固日志 (Live Feedback Ingestion)</span>
          </span>
          <div className="bg-gray-900 text-gray-200 p-3.5 rounded-xl text-xs font-mono space-y-2">
            {mockOperationMetrics.flywheelLogs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                <span className="text-blue-400 flex-shrink-0">[{log.time}]</span>
                <span className="text-gray-300">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Dismiss */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-blue-500/20"
          >
            返回对话主界面
          </button>
        </div>
      </div>
    </div>
  );
}
