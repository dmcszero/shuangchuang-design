/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Zap, ArrowRight, CheckCircle2, AlertTriangle, Shield, ThumbsUp, ThumbsDown, Check, Sparkles, Copy, RefreshCw 
} from 'lucide-react';

interface AtomicCallCardProps {
  data: any;
  callMeta?: {
    callType: 'shallow' | 'deep';
    targetEngine: '4.2' | '4.3';
    capabilityName: string;
    duration?: string;
    inputPayload?: any;
    outputResponse?: any;
  };
  onUpgradeToDeepCall: (target: '4.2' | '4.3') => void;
  onAdopt?: () => void;
  onSwitchJudge?: () => void;
}

export default function AtomicCallCard({
  data,
  callMeta,
  onUpgradeToDeepCall,
  onAdopt,
  onSwitchJudge
}: AtomicCallCardProps) {
  const [feedbackStatus, setFeedbackStatus] = useState<'liked' | 'disliked' | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const subType = data?.atomicType || 'questions_43';
  const targetEngine = callMeta?.targetEngine || (subType === 'questions_43' ? '4.3' : '4.2');
  const judge = data?.judge;

  const handleLikeClick = () => {
    setFeedbackStatus(prev => prev === 'liked' ? null : 'liked');
    if (onAdopt) onAdopt();
  };

  const handleDislikeClick = () => {
    setFeedbackStatus(prev => prev === 'disliked' ? null : 'disliked');
  };

  const handleCopyAllQuestions = () => {
    if (!data?.questions) return;
    const textToCopy = `【4.3 模拟答辩质询题库 · ${judge ? `${judge.name} (${judge.role})` : '评审专家'}】\n项目：《${data.projectName || '智耘农业'}》\n\n` +
      data.questions.map((q: any, idx: number) => `Q${idx + 1} [${q.category || q.title}] (烈度: ${q.difficulty || '高'})\n"${q.question}"`).join('\n\n');
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingleQuestion = (q: any, idx: number) => {
    navigator.clipboard.writeText(`Q${idx + 1} [${q.category || q.title}]: "${q.question}"`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-100 space-y-3.5 text-xs text-gray-800">
      {/* Top Banner: Shallow Atomic Call Attribution */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 border border-amber-200">
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 rounded-md bg-amber-500 text-white items-center justify-center text-[10px] font-black shadow-2xs">
            ⚡
          </span>
          <span className="font-bold text-amber-950 text-xs">
            浅度调用 · {targetEngine === '4.3' ? '4.3 模拟评审与答辩训练' : '4.2 全链路智能指导'} [原子能力: {callMeta?.capabilityName || (subType === 'questions_43' ? '评委尖锐质询题生成器 (5题)' : '原子技能')}]
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[10px] text-amber-800">
          <span>耗时: {callMeta?.duration || '480ms'}</span>
          <span>•</span>
          <span className="bg-amber-100 px-1.5 py-0.2 rounded font-bold">状态: 200 OK</span>
        </div>
      </div>

      {/* ---------------- TYPE 1: 4.3 Atomic Defense Questions (出5道答辩题 · 无应答策略 · 一次性输出) ---------------- */}
      {subType === 'questions_43' && data.questions && (
        <div className="space-y-3">
          {/* Judge Identity & Prompt Focus Header */}
          {judge ? (
            <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 via-red-50/30 to-amber-50/30 border border-gray-200 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`h-8 w-8 rounded-full ${judge.avatarBg || 'bg-red-600'} text-white flex items-center justify-center text-xs font-black shadow-2xs flex-shrink-0`}>
                  {judge.avatarText || '评'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span className="font-bold text-gray-950 text-xs">{judge.name}</span>
                    <span className="text-[10px] text-gray-600">({judge.role})</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-medium">
                      风格: {judge.style}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    考查焦点：{judge.focusArea}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyAllQuestions}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-[11px] font-medium shadow-2xs"
                  title="复制全部 5 道质询题"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">已复制全部</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>复制5道题</span>
                    </>
                  )}
                </button>

                {onSwitchJudge && (
                  <button
                    type="button"
                    onClick={onSwitchJudge}
                    className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-[11px]"
                    title="更换其他评委考官"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span className="hidden sm:inline">换考官</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">
                针对《{data.projectName || '智耘农业'}》出具的 5 道高频尖锐质询题：
              </span>
              <button
                type="button"
                onClick={handleCopyAllQuestions}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-white border border-gray-200 text-gray-600 hover:text-blue-600 text-[11px]"
              >
                {copiedAll ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedAll ? '已复制' : '复制5题'}</span>
              </button>
            </div>
          )}

          {/* List of 5 Questions (Clean pure-text chatbot typography) */}
          <div className="space-y-3 pt-1 pl-1">
            {data.questions.map((q: any, idx: number) => (
              <div key={idx} className="space-y-1 text-xs group">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-bold text-red-700 font-mono">
                      Q{idx + 1}.
                    </span>
                    <span className="font-bold text-gray-900">
                      {q.title || q.category}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      q.difficulty === '极高' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      烈度: {q.difficulty || '高'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingleQuestion(q, idx)}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="复制本题"
                  >
                    {copiedIdx === idx ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>

                <p className="text-gray-800 font-medium pl-3 border-l-2 border-red-200 leading-relaxed select-text">
                  "{q.question}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TYPE 2: 4.2 Atomic BP Chapter Diagnosis (商业模式速诊) ---------------- */}
      {subType === 'chapter_42' && data.chapterDiagnosis && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100">
            <span className="font-bold text-gray-900">
              BP 第四章【商业模式与市场闭环】速诊结论：
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">
              诊断得分: 6.2 / 10 (待完善)
            </span>
          </div>

          <div className="space-y-3 pl-1">
            {data.chapterDiagnosis.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-bold text-gray-900 flex items-center space-x-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 inline" />
                    <span>{idx + 1}. {item.flawPoint}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-rose-50 text-rose-700">
                    【{item.severity}】
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed pl-3 border-l-2 border-gray-200">
                  <strong className="text-gray-900">评委质疑视角：</strong>{item.judgePerspective}
                </p>
                <p className="text-emerald-900 leading-relaxed pl-3 text-[11px]">
                  <strong className="text-emerald-700">✍️ 建议修改范式：</strong>{item.rewriteProposal}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TYPE 3: 4.2 Atomic Moat & Scoring Checklist (技术壁垒核查) ---------------- */}
      {subType === 'moat_42' && data.moatChecklist && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100">
            <span className="font-bold text-gray-900">
              核心技术创新度与四层商业壁垒对标自测：
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              综合壁垒指数: A-
            </span>
          </div>

          <div className="space-y-2 pl-1">
            {data.moatChecklist.map((m: any, idx: number) => (
              <div key={idx} className="space-y-0.5 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">• {m.layer}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    m.status === '已达标' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    [{m.status}]
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">评分赋能：{m.scoreImpact}</span>
                </div>
                <p className="text-gray-600 pl-3 text-[11px] leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons: Upgrade to Deep Call + Adoption Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
        <button
          type="button"
          onClick={() => onUpgradeToDeepCall(targetEngine)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition-colors shadow-2xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>一键升级为 {targetEngine === '4.3' ? '4.3 全流程答辩训练' : '4.2 完整项目深度体检'} →</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLikeClick}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              feedbackStatus === 'liked'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="点赞"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>点赞</span>
          </button>
          <button
            type="button"
            onClick={handleDislikeClick}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              feedbackStatus === 'disliked'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="点踩"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>点踩</span>
          </button>
        </div>
      </div>
    </div>
  );
}
