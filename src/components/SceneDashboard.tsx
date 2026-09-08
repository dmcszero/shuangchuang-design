/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, PieChart, Users, ShieldAlert, Cpu, 
  HelpCircle, CheckCircle2, ChevronRight, Activity, TrendingUp 
} from 'lucide-react';
import { Project } from '../types';

interface SceneDashboardProps {
  projects: Project[];
}

export default function SceneDashboard({ projects }: SceneDashboardProps) {
  const [activeChart, setActiveChart] = useState<'track' | 'grade'>('track');

  // Calculate statistics from current projects state
  const totalSubmissions = 2000; // Hardcoded total simulated projects
  const activeCoachedCount = 420; // Simulated mentored groups
  
  // Grading counts matching PRD ratios
  const gradeStats = {
    A: { count: 180, percentage: 9, color: 'bg-[#0071E3]' },
    B: { count: 520, percentage: 26, color: 'bg-[#34C759]' },
    // C takes 760, D takes 540
    C: { count: 760, percentage: 38, color: 'bg-[#FF9500]' },
    D: { count: 540, percentage: 27, color: 'bg-[#8E8E93]' }
  };

  // Track counts matching PRD ratios
  const trackStats = [
    { name: '科技创新', count: 720, percentage: 36, height: 'h-[144px]' },
    { name: '商业模式', count: 580, percentage: 29, height: 'h-[116px]' },
    { name: '社会公益', count: 420, percentage: 21, height: 'h-[84px]' },
    { name: '乡村振兴', count: 280, percentage: 14, height: 'h-[56px]' }
  ];

  // Plagiarism checks
  const plagiarismAlarms = [
    { id: 'ala-1', nameA: '微型光伏潮流孤岛切换潮流测控网关', nameB: '基于10kV高电压下的新型微电网孤岛潮流计算组件', similarity: 92, status: '已下发人工裁决' },
    { id: 'ala-2', nameA: '智农飞手：林木视觉避障精细喷洒航测系统', nameB: '植保多摇臂林区避障相机算法开发', similarity: 86, status: '已下发人工裁决' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Scene 6 · P2 数据归一化</span>
        <h1 className="font-display font-semibold text-3xl md:text-5xl tracking-tight text-gray-900 mt-1">赛事分析看板</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-3xl">
          大赛大盘数据的可视化中控台。打通初筛评分、异常警报、参赛者指导覆盖以及AI专家经验演变指标，辅助组委会进行高质量的汇报与流程干预。
        </p>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '总申报初筛项目', value: '2,000', change: '+24% 较往届同期', desc: '全赛道数字标准化入库完成', icon: Users, color: 'text-gray-600' },
          { label: 'AI 指导工作室覆盖量', value: '420', change: '+180% 专家覆盖倍数', desc: '处于活跃交互与修订中', icon: Cpu, color: 'text-emerald-600' },
          { label: '初筛 AI vs 评委一致率', value: '84.6%', change: '+3.1% 较首周基准校准', desc: '根据 42 次手动干预自动演变', icon: Activity, color: 'text-teal-600' },
          { label: '相似度红线查重预警', value: '2 组', change: '高危重合待人工定性', desc: '语义重叠度 ＞85% 强排斥', icon: ShieldAlert, color: 'text-amber-600' }
        ].map((met, idx) => {
          const Icon = met.icon;
          return (
            <div key={idx} className="p-5 rounded-[24px] border border-gray-200 bg-white text-left space-y-2 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-gray-400 font-mono block leading-none font-semibold">{met.label}</span>
                <Icon className={`h-4 w-4 ${met.color}`} />
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl font-display font-semibold text-gray-900 block leading-none">{met.value}</span>
                <span className="text-[10px] text-gray-500 font-semibold block">{met.change}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-light leading-tight pt-1.5 border-t border-gray-100">
                {met.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Central Interactive Chart Bento & Similarities panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Bento: Clean SVG Custom Charts */}
        <div className="lg:col-span-8 p-6 rounded-[24px] border border-gray-200 bg-white text-left space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Interactive SVG Visualizer</span>
              <h3 className="text-sm font-semibold text-gray-900">
                {activeChart === 'track' ? '申报赛道数量分布图 (Track Registration)' : '初筛等级质量分布图 (Grading Distribution)'}
              </h3>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200/60 shadow-inner">
              <button
                onClick={() => setActiveChart('track')}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  activeChart === 'track' ? 'bg-[#0071E3] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                赛道分布
              </button>
              <button
                onClick={() => setActiveChart('grade')}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  activeChart === 'grade' ? 'bg-[#0071E3] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                质量等级
              </button>
            </div>
          </div>

          {/* Custom SVG chart display areas */}
          <div className="h-48 flex items-end justify-center px-4 relative">
            {activeChart === 'track' ? (
              /* High-fidelity responsive Track Bar charts */
              <div className="w-full flex items-end justify-around h-full border-b border-gray-100 pb-1">
                {trackStats.map((track, idx) => (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer w-1/5 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {track.count}个
                    </span>
                    <div className="w-8 sm:w-12 bg-gray-100 rounded-t-lg group-hover:bg-gray-200/60 transition-all flex items-end overflow-hidden border border-gray-200 shadow-inner">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        className="bg-gradient-to-t from-blue-500 via-blue-400 to-[#0071E3] w-full"
                        style={{ height: `${track.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-light truncate w-full text-center block">
                      {track.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* Donut Style Quality Distributions */
              <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-6">
                
                {/* Simulated Donut Visual representation via custom concentric circle indicator */}
                <div className="relative h-32 w-32 flex items-center justify-center">
                  {/* Concentric rings represent progress ratios */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="54" fill="transparent" stroke="#F5F5F7" strokeWidth="8" />
                    <circle cx="64" cy="64" r="54" fill="transparent" stroke="#0071E3" strokeWidth="8" strokeDasharray="339.29" strokeDashoffset="240" />
                    <circle cx="64" cy="64" r="42" fill="transparent" stroke="#F5F5F7" strokeWidth="8" />
                    <circle cx="64" cy="64" r="42" fill="transparent" stroke="#34C759" strokeWidth="8" strokeDasharray="263.89" strokeDashoffset="180" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[9px] text-gray-400 font-mono block leading-none font-semibold">A级占比</span>
                    <span className="text-lg font-display font-semibold text-gray-900 block">9.0%</span>
                  </div>
                </div>

                {/* Grade breakdown legends */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {Object.entries(gradeStats).map(([grade, data]) => (
                    <div key={grade} className="p-3 rounded-xl bg-gray-50 border border-gray-100 shadow-inner flex items-center justify-between text-left">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className={`h-2 w-2 rounded-full ${data.color}`} />
                          <span className="text-xs font-mono font-bold text-gray-900">{grade}级项目</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-light block leading-none">{data.count}个申报</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-600">{data.percentage}%</span>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          <p className="text-[10px] text-gray-400 font-light leading-normal pt-4 border-t border-gray-100 text-center">
            * 提示：数据大盘每小时进行一次全量数据归一化。本届 A级/B级 等晋级高分项目比例符合预期的高斯正态分布，评审方差处于安全容限内。
          </p>

        </div>

        {/* Right Bento: Duplicate / Copycat alarms */}
        <div className="lg:col-span-4 p-5 rounded-[24px] border border-gray-200 bg-white text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold text-gray-500 flex items-center">
              <ShieldAlert className="h-4 w-4 mr-1.5 text-amber-500" />
              语义抄袭/冲突红线预警
            </h3>
            <span className="text-[9px] px-1.5 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded-full font-mono font-semibold">
              HIGH RISK
            </span>
          </div>

          <p className="text-[10px] text-gray-400 font-light leading-normal">
            系统对2000个项目进行两两语义深度交叉。一旦发现语义流重叠率超过85%者，将自动归档异常，并终止初筛推荐直接下发人工判定。
          </p>

          <div className="space-y-3">
            {plagiarismAlarms.map((ala) => (
              <div key={ala.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 shadow-inner space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-100/60 px-1.5 py-0.5 rounded">
                    重合率: {ala.similarity}%
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-medium">{ala.status}</span>
                </div>
                
                <div className="text-[10px] text-gray-600 space-y-1 leading-snug font-light">
                  <p className="border-l-2 border-gray-300 pl-2">项目 A: {ala.nameA}</p>
                  <p className="border-l-2 border-gray-300 pl-2">项目 B: {ala.nameB}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 shadow-sm text-[10px] text-gray-500 font-light leading-relaxed">
            <p className="font-semibold text-gray-700">💡 组委会干预方案:</p>
            <p className="mt-0.5">
              建议安排 2 位专业赛道评审专家在后天上午进行全真比对，判定是否属于同一指导老师/研究团队的恶意多投或抄袭，并保留一票否决权。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
