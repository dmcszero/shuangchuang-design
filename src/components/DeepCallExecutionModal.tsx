/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, CheckCircle2, ArrowRight, Layers, 
  Sparkles, X, Database, Cpu, Bot
} from 'lucide-react';

interface DeepCallExecutionModalProps {
  isOpen: boolean;
  onFinish: () => void;
  onAbort?: () => void;
  targetModule: '4.2' | '4.3';
  projectName: string;
  inputPayload?: any;
}

export default function DeepCallExecutionModal({
  isOpen,
  onFinish,
  onAbort,
  targetModule,
  projectName
}: DeepCallExecutionModalProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const isModule42 = targetModule === '4.2';
  const targetTitle = isModule42 ? '4.2 全链路智能指导' : '4.3 模拟评审与答辩训练';
  const targetEngineName = isModule42 ? '全链路商业计划诊断引擎' : '多重考官压力答辩引擎';
  const taskCompleteButtonText = isModule42 ? '诊断与指导任务完成（虚拟按钮）' : '模拟答辩任务完成（虚拟按钮）';

  const stages = [
    { title: '4.1 打包项目上下文与物料', detail: '序列化 BP/PPT 结构化数据与参赛元信息' },
    { title: `跨模块路由至 ${targetTitle}`, detail: '调用 RPC/MCP 接口，建立安全数据管道' },
    { title: `${targetEngineName} 执行中`, detail: isModule42 ? '运行六维雷达打分与商业逻辑漏洞穿透' : '生成评委连环质询与答辩复盘矩阵' },
    { title: '生成结构化返回包回传 4.1', detail: '完成数据回传并在 4.1 对话中渲染综合报告' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStageIndex(0);
      setIsCompleted(false);
      return;
    }

    const startTime = Date.now();
    const duration = 2000; // 2.0s delay as specified in requirements

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 25) {
        setCurrentStageIndex(0);
      } else if (pct < 55) {
        setCurrentStageIndex(1);
      } else if (pct < 85) {
        setCurrentStageIndex(2);
      } else {
        setCurrentStageIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsCompleted(true);
        // Manual termination required instead of auto-closing
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg p-6 text-gray-900 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-colors ${
              isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-gray-900">
                  {isCompleted ? `深度调用已就绪：${targetTitle}` : `正在深度调用：${targetTitle}`}
                </h3>
                {isCompleted && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                    2.0s 模拟完毕
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                项目：{projectName} · 跨模块协同流转中
              </p>
            </div>
          </div>
          <button
            onClick={onAbort || onFinish}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="中止调用并返回"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-600 font-medium">{stages[currentStageIndex]?.title}</span>
            <span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/60">
            <div
              className={`h-2 rounded-full transition-all duration-75 ease-out ${
                isCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Pipeline Execution Stages */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-700">
              4.1 ↔ {targetModule} 数据流转协同流水线：
            </span>
            {isCompleted ? (
              <span className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>流水线执行完毕</span>
              </span>
            ) : (
              <span className="text-[10px] text-blue-600 font-mono animate-pulse">
                模拟计算中...
              </span>
            )}
          </div>
          <div className="space-y-2">
            {stages.map((st, idx) => {
              const isDone = progress >= (idx + 1) * 25;
              const isCurrent = currentStageIndex === idx && progress < 100;
              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-2.5 text-xs transition-colors ${
                    isDone
                      ? 'text-gray-900'
                      : isCurrent
                      ? 'text-blue-700 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : isCurrent ? (
                      <RefreshCw className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[9px] font-mono text-gray-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{st.title}</span>
                      {isDone && <span className="text-[9px] text-emerald-600 font-mono">OK</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{st.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Callout */}
        <div className={`p-2.5 rounded-xl border text-xs mb-4 flex items-center justify-between ${
          isCompleted 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
            : 'bg-blue-50/60 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center space-x-2">
            <Sparkles className={`h-3.5 w-3.5 flex-shrink-0 ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`} />
            <span className="text-[11px]">
              {isCompleted 
                ? '已完成深度推演！请点击下方按钮完成任务或返回会话。' 
                : '正在进行多维度分析推演中，请稍候...'}
            </span>
          </div>
        </div>

        {/* Manual Exit & Completion Action Buttons */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onAbort || onFinish}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium transition-colors text-center"
          >
            手动中断任务并返回会话（真实按钮）
          </button>

          <button
            type="button"
            onClick={onFinish}
            className={`w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
              isCompleted
                ? 'bg-[#0071E3] hover:bg-blue-600 ring-2 ring-blue-300 animate-pulse'
                : 'bg-[#0071E3] hover:bg-blue-600 opacity-95'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-100" />
            <span>{taskCompleteButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
