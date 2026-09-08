/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Brain, 
  ListTodo, 
  Terminal, 
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { ReActProcess, ReActStep } from '../types';

interface ReActProcessViewProps {
  reactProcess?: ReActProcess;
  process?: ReActProcess;
  defaultExpanded?: boolean;
  isLive?: boolean;
  currentLivePhase?: 'reasoning' | 'plan' | 'act' | 'completed';
}

export default function ReActProcessView({ 
  reactProcess, 
  process: propProcess,
  defaultExpanded = false,
  isLive = false,
  currentLivePhase = 'completed'
}: ReActProcessViewProps) {
  const activeProcess = reactProcess || propProcess;
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded || isLive);
  const [collapsedSubSections, setCollapsedSubSections] = useState<Record<string, boolean>>({});

  if (!activeProcess || !activeProcess.steps || activeProcess.steps.length === 0) {
    return null;
  }

  const toggleSubSection = (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedSubSections(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const stepsCount = activeProcess.steps.length;
  const duration = activeProcess.duration || '2.1s';

  return (
    <div className="mb-3 w-full font-sans">
      {/* Collapsible Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left cursor-pointer group ${
          isLive
            ? 'bg-[#18181B] text-zinc-200 border border-blue-500/40 shadow-xs'
            : isExpanded 
              ? 'bg-[#18181B] text-gray-200 border border-zinc-700/80 shadow-xs' 
              : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:border-zinc-600 shadow-2xs'
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
            isLive 
              ? 'bg-blue-950/80 text-blue-400 ring-1 ring-blue-500/30' 
              : isExpanded 
                ? 'bg-zinc-800 text-indigo-400' 
                : 'bg-zinc-800 text-emerald-400'
          }`}>
            {isLive ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="flex items-center space-x-2 min-w-0">
            <span className="font-semibold tracking-tight text-white truncate text-[12.5px]">
              {isLive ? '正在执行 ReAct 思考与行动链路...' : (activeProcess.summary || '已完成思考与规划')}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50 flex-shrink-0">
              {isLive ? (
                <span className="flex items-center space-x-1 text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping"></span>
                  <span>执行中</span>
                </span>
              ) : (
                `${stepsCount} 步 · ${duration}`
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] font-medium flex-shrink-0 text-zinc-400 group-hover:text-zinc-200">
          <span>{isExpanded ? '收起过程' : '展开过程'}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isExpanded ? 'rotate-180 text-zinc-200' : 'text-zinc-400'
          }`} />
        </div>
      </button>

      {/* Expanded Content Panel matching the screenshot aesthetic */}
      {isExpanded && (
        <div className="mt-2 rounded-xl bg-[#141416] border border-zinc-800 text-zinc-300 p-4 space-y-4 shadow-lg text-xs font-sans animate-in fade-in duration-150">
          {activeProcess.steps.map((step: ReActStep, index: number) => {
            const isSubCollapsed = !!collapsedSubSections[step.id];
            const isLastStep = index === activeProcess.steps.length - 1;

            if (step.type === 'reasoning') {
              return (
                <div key={step.id || index} className={`space-y-2 pb-3.5 ${!isLastStep ? 'border-b border-zinc-800/80' : ''}`}>
                  <div className="flex items-center justify-between text-zinc-400">
                    <div className="flex items-center space-x-2 font-semibold text-[12.5px] text-zinc-200">
                      <Brain className="h-4 w-4 text-indigo-400" />
                      <span>{step.title || '深度思考'}</span>
                      {isLive && index === activeProcess.steps.length - 1 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse ml-1" />
                      )}
                    </div>
                    {step.subtitle && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {step.subtitle}
                      </span>
                    )}
                  </div>
                  {step.content && (
                    <div className="text-zinc-300 leading-relaxed text-[12px] pl-6 font-normal whitespace-pre-line bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/60">
                      {step.content}
                    </div>
                  )}
                </div>
              );
            }

            if (step.type === 'plan') {
              return (
                <div key={step.id || index} className={`space-y-2 pb-3.5 ${!isLastStep ? 'border-b border-zinc-800/80' : ''}`}>
                  <div 
                    onClick={(e) => toggleSubSection(step.id, e)}
                    className="flex items-center justify-between cursor-pointer group py-0.5 select-none"
                  >
                    <div className="flex items-center space-x-2 font-semibold text-[12.5px] text-zinc-200 group-hover:text-white">
                      <ListTodo className="h-4 w-4 text-sky-400" />
                      <span>{step.title || '整理任务计划'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-zinc-400 hover:text-zinc-200">
                      <span>{isSubCollapsed ? '展开清单' : '收起清单'}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${isSubCollapsed ? '' : 'rotate-180'}`} />
                    </div>
                  </div>

                  {!isSubCollapsed && (
                    <div className="pl-6 space-y-2">
                      {step.content && (
                        <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                          {step.content}
                        </p>
                      )}
                      {step.tasks && step.tasks.length > 0 && (
                        <div className="bg-[#1C1C20] rounded-lg p-3 space-y-2 border border-zinc-800">
                          {step.tasks.map((task) => (
                            <div key={task.id} className="flex items-start space-x-2.5 text-[12px] text-zinc-200">
                              <span className="text-sky-400 font-mono text-sm leading-none mt-0.5">○</span>
                              <span className="leading-snug">{task.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            // Act step
            return (
              <div key={step.id || index} className={`space-y-2 pb-3.5 ${!isLastStep ? 'border-b border-zinc-800/80' : ''}`}>
                <div 
                  onClick={(e) => toggleSubSection(step.id, e)}
                  className="flex items-center justify-between cursor-pointer group py-0.5 select-none"
                >
                  <div className="flex items-center space-x-2 font-semibold text-[12.5px] text-zinc-200 group-hover:text-white">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span>{step.title}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 hover:text-zinc-200">
                    <span>{isSubCollapsed ? '展开详情' : '收起详情'}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isSubCollapsed ? '' : 'rotate-180'}`} />
                  </div>
                </div>

                {!isSubCollapsed && (
                  <div className="pl-6 space-y-2.5">
                    {step.content && (
                      <p className="text-zinc-300 text-[12px] leading-relaxed">
                        {step.content}
                      </p>
                    )}

                    {step.command && (
                      <div className="bg-[#0C0C0E] rounded-lg p-3 border border-zinc-800 font-mono text-[11.5px] text-zinc-300 overflow-x-auto space-y-2">
                        <div className="flex items-center justify-between text-zinc-400 text-[10.5px] uppercase tracking-wider pb-1.5 border-b border-zinc-800/80 font-sans">
                          <span className="font-semibold text-zinc-300">{step.command.lang || 'bash'}</span>
                          <span className="text-emerald-400 flex items-center space-x-1 lowercase font-mono">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            <span>exit 0</span>
                          </span>
                        </div>
                        <div className="text-zinc-100 flex items-center space-x-2">
                          <span className="text-zinc-500 select-none">$</span>
                          <span className="text-sky-300">{step.command.cmd}</span>
                        </div>
                        {step.command.output && (
                          <div className="text-zinc-400 pt-1.5 text-[11px] border-t border-zinc-800/80 font-sans leading-relaxed">
                            {step.command.output}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
