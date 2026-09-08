/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, CheckSquare, Square, ArrowRight, X, Sparkles, 
  Layers, UserCheck, ShieldAlert, Cpu, Settings 
} from 'lucide-react';

interface DeepCallConfigCardProps {
  targetModule: '4.2' | '4.3';
  projectName: string;
  onConfirmExecution: (config: any) => void;
  onCancelCall: () => void;
}

export default function DeepCallConfigCard({
  targetModule,
  projectName,
  onConfirmExecution,
  onCancelCall
}: DeepCallConfigCardProps) {
  const is42 = targetModule === '4.2';

  // State for config selections
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    'BP_商业计划书_v2.4_智耘农业.pdf',
    '路演汇报Deck_金奖标准_v3.pptx'
  ]);

  const [selectedFocus, setSelectedFocus] = useState<string>(
    is42 ? '商业模式与落地闭环' : '严苛投资人·深度压力测试'
  );

  const [reviewDepth, setReviewDepth] = useState<'standard' | 'extreme'>('extreme');

  const availableMaterials = [
    { name: 'BP_商业计划书_v2.4_智耘农业.pdf', size: '14.8 MB', updated: '今日 10:20' },
    { name: '路演汇报Deck_金奖标准_v3.pptx', size: '28.4 MB', updated: '昨日 16:45' },
    { name: '省农科院第三方盲测成效报告.pdf', size: '4.2 MB', updated: '3天前' },
    { name: '三年财务测算与现金流回款表.xlsx', size: '1.8 MB', updated: '2天前' }
  ];

  const focusOptions42 = [
    { id: 'focus-biz', label: '商业模式与落地闭环', desc: '穿透付费主体、分成机制与现金流' },
    { id: 'focus-moat', label: '技术壁垒与创新度', desc: '对标国赛金奖科技创新评分线' },
    { id: 'focus-full', label: '六维全景对标体检', desc: '全篇章逻辑连贯性与数据一致性' }
  ];

  const focusOptions43 = [
    { id: 'judge-vc', label: '严苛投资人·深度压力测试', desc: '聚焦单位经济模型、获客成本与天花板' },
    { id: 'judge-scholar', label: '权威学者·技术真实性质询', desc: '追问核心算法机理、实验对比与专有数据' },
    { id: 'judge-official', label: '赛事主评委·全景答辩演练', desc: '五大评委矩阵轮番连环质询与复盘' }
  ];

  const toggleMaterial = (name: string) => {
    setSelectedMaterials(prev => 
      prev.includes(name) 
        ? prev.filter(m => m !== name)
        : [...prev, name]
    );
  };

  const handleConfirm = () => {
    onConfirmExecution({
      targetModule,
      projectName,
      materials: selectedMaterials,
      focus: selectedFocus,
      depth: reviewDepth,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-100 space-y-4 text-xs text-gray-800">
      {/* Ribbon */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 border border-blue-200">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-blue-600 animate-spin-slow" />
          <span className="font-bold text-blue-950">
            4.1 正在收集并确认传递给 {is42 ? '4.2 智能指导' : '4.3 模拟答辩'} 的配置数据
          </span>
        </div>
        <span className="text-[10px] font-mono text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md font-semibold">
          步骤 2/3: 配置确认
        </span>
      </div>

      {/* Section 1: Material Selection */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900 flex items-center space-x-1.5">
            <FileText className="h-3.5 w-3.5 text-amber-500" />
            <span>选择打包注入的物料资产 (已选 {selectedMaterials.length} 项)：</span>
          </span>
          <span className="text-[10px] text-gray-400">来自项目工作空间</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableMaterials.map((mat) => {
            const isChecked = selectedMaterials.includes(mat.name);
            return (
              <div
                key={mat.name}
                onClick={() => toggleMaterial(mat.name)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-blue-50/40 border-blue-400 text-blue-950 ring-1 ring-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  {isChecked ? (
                    <CheckSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate" title={mat.name}>
                      {mat.name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {mat.size} · {mat.updated}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Review Focus or Judge Persona */}
      <div className="space-y-2">
        <span className="font-bold text-gray-900 flex items-center space-x-1.5">
          <UserCheck className="h-3.5 w-3.5 text-purple-600" />
          <span>{is42 ? '选择诊断重心维度：' : '选择模拟考官矩阵风格：'}</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(is42 ? focusOptions42 : focusOptions43).map((opt) => {
            const isSelected = selectedFocus === opt.label;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedFocus(opt.label)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-50/50 border-purple-400 text-purple-950 ring-1 ring-purple-300'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-xs mb-0.5">{opt.label}</div>
                <p className="text-[10px] text-gray-500 leading-snug">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Depth Mode */}
      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-gray-900 text-xs">执行引擎模式与计算深度</div>
            <div className="text-[10px] text-gray-500">国赛评委经验库 + 历史金奖对标分析</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setReviewDepth('standard')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              reviewDepth === 'standard' ? 'bg-blue-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            快速标准体检
          </button>
          <button
            type="button"
            onClick={() => setReviewDepth('extreme')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              reviewDepth === 'extreme' ? 'bg-purple-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            极限金奖压力测试 (推荐)
          </button>
        </div>
      </div>

      {/* Action Buttons: Confirm & Cancel */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancelCall}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          <span>取消深度调用 (返回普通问答)</span>
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs group"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-200 group-hover:rotate-12 transition-transform" />
          <span>确认配置并触发 2 秒模拟调用 →</span>
        </button>
      </div>
    </div>
  );
}
