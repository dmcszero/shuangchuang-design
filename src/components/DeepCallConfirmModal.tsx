/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, X, Check, Layers, AlertCircle, Shield } from 'lucide-react';

interface DeepCallConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetModule: '4.2' | '4.3';
  projectName: string;
  userPromptText: string;
}

export default function DeepCallConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  targetModule,
  projectName,
  userPromptText
}: DeepCallConfirmModalProps) {
  if (!isOpen) return null;

  const isModule42 = targetModule === '4.2';
  const targetTitle = isModule42 ? '4.2 全链路智能指导模块' : '4.3 模拟评审与答辩训练模块';
  const targetIcon = isModule42 ? '🚀' : '🎙️';
  const targetBadge = isModule42 ? '完整项目深度诊断' : '多考官全流程答辩演练';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200/90 rounded-2xl w-full max-w-lg p-6 text-gray-900 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">{targetIcon}</span>
            <div>
              <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
                <span>深度调用意图识别确认</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium">
                  {targetBadge}
                </span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                4.1 智能问答识别到用户触发了跨模块完整流程
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="space-y-3.5 text-xs text-gray-700">
          {/* User intent recognition card */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
            <span className="text-[11px] font-bold text-blue-900 block flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>意图识别结果</span>
            </span>
            <p className="text-[11px] text-blue-950 font-medium">
              用户指令："{userPromptText}"
            </p>
            <p className="text-[10px] text-blue-700">
              判定类型：<strong>深度调用（需跨模块传递完整配置并执行全流程）</strong>
            </p>
          </div>

          {/* Flow Explanation */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="font-bold text-gray-900 text-xs block">
              深度体检与答辩训练流程说明：
            </span>
            <div className="space-y-1.5 text-[11px] text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="font-bold text-blue-600 font-mono">1.</span>
                <span>在 4.1 中确认目标模块、BP/PPT 材料及评审侧重点参数；</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-blue-600 font-mono">2.</span>
                <span>
                  4.1 将项目 <strong>《{projectName}》</strong> 的全部元数据与申报材料传递至 <strong>{targetTitle}</strong>；
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-blue-600 font-mono">3.</span>
                <span>
                  目标模块完成深度分析/答辩训练后，将结构化评测结果直接呈现在对话流中。
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="text-[11px] text-gray-400 flex items-center space-x-1 font-mono">
            <Shield className="h-3.5 w-3.5 text-gray-400" />
            <span>提示：当前为 Demo 演示模式，配置确认后将以 2 秒模拟执行流转。</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-4 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-xs font-medium transition-colors"
          >
            取消调用 (留在 4.1)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <span>确认调用并配置参数</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
