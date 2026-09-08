/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, ArrowRight, CheckCircle2, AlertTriangle, 
  Sparkles, Check, ChevronDown, ChevronUp, RefreshCw, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import RadarChart from './RadarChart';

interface DeepCallResultCardProps {
  data: any;
  targetModule: '4.2' | '4.3';
  projectName: string;
  onSelectNextAction: (nextPrompt: string) => void;
  onAdoptResults?: () => void;
}

export default function DeepCallResultCard({
  data,
  targetModule,
  projectName,
  onSelectNextAction,
  onAdoptResults
}: DeepCallResultCardProps) {
  const [feedbackStatus, setFeedbackStatus] = useState<'liked' | 'disliked' | null>(null);

  const is42 = targetModule === '4.2';
  const engineTitle = is42 ? '4.2 全链路智能指导引擎' : '4.3 模拟评审与答辩训练引擎';
  const engineBadge = is42 ? '全篇章深度体检报告' : '全流程模拟答辩复盘';

  const defaultRadar = data?.radar || [
    { label: '教育维度', value: 88, max: 100 },
    { label: '创新维度', value: 92, max: 100 },
    { label: '团队维度', value: 85, max: 100 },
    { label: '商业维度', value: 72, max: 100 },
    { label: '社会价值', value: 94, max: 100 },
    { label: '答辩表现', value: 82, max: 100 }
  ];

  const handleLike = () => {
    setFeedbackStatus(prev => prev === 'liked' ? null : 'liked');
    if (onAdoptResults) onAdoptResults();
  };

  const handleDislike = () => {
    setFeedbackStatus(prev => prev === 'disliked' ? null : 'disliked');
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-100 space-y-4 text-xs text-gray-800">
      {/* Engine Attribution Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-purple-50 border border-blue-200 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {is42 ? '4.2' : '4.3'}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-xs flex items-center space-x-2">
              <span>{engineTitle} · 返回完整数据</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-800 font-mono font-medium">
                {engineBadge}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
              项目: 《{projectName}》
            </div>
          </div>
        </div>
      </div>

      {/* Main Score & Radar Section */}
      <div className="bg-slate-50/80 border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: SVG Radar Chart */}
        <div className="flex-shrink-0">
          <RadarChart data={defaultRadar} size={230} />
        </div>

        {/* Right: Score Metrics & Benchmark Gap */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div>
              <span className="text-gray-500 text-[11px] block">
                {is42 ? '项目全景综合诊断得分' : '答辩连环质询综合得分'}
              </span>
              <span className="text-2xl font-black text-blue-600 font-mono">
                {data?.totalScore || 85.5} <span className="text-xs text-gray-400 font-normal">/ 100 分</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold block">
                {data?.goldGap || '距国赛金奖线落后 3.8 分'}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">对标同赛道 Top 1% 标杆</span>
            </div>
          </div>

          {/* Quick Strengths and Shortcomings */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 font-medium">✨ 核心优势：科技创新度 & 社会公益价值突出</span>
              <span className="text-emerald-600 font-bold font-mono">92/100 (金奖级)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-700 font-medium">⚠️ 主要短板：商业变现逻辑与农户付费意愿验证不足</span>
              <span className="text-red-600 font-bold font-mono">72/100 (需补强)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-700 font-medium">⚠️ 答辩薄弱点：面对巨头下场竞争时防守话术偏被动</span>
              <span className="text-amber-600 font-bold font-mono">82/100 (待演练)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Issues and Diagnosis Details - Pure text with chatbot typography */}
      <div className="space-y-3 pt-1">
        <span className="font-bold text-gray-900 text-xs block">
          {is42 ? '🎯 4.2 诊断指出的 3 大穿透式问题与优化建议：' : '🎙️ 4.3 答辩识别出的 3 大评委质询痛点与应答策略：'}
        </span>

        <div className="space-y-3 pl-1">
          {(data?.issues || [
            {
              title: '商业模式闭环缺陷',
              level: '致命漏洞',
              desc: '计划书与PPT中对农户按亩收费模式过于乐观，未考虑农业靠天吃饭的支付阻力，建议补充与农险公司/村集体合作社的分成兜底机制。',
              action: '重构计划书第4章，加入“按亩服务费+增产挽损分成”双轨制。'
            },
            {
              title: '财务测算与回款周期不一致',
              level: '中度瑕疵',
              desc: '第5章财务表中应收账款周转天数按30天估算，与下沉农村实际账期（普遍在收获季后90-120天）严重打架，易遭财务评委一票否决。',
              action: '调整现金流测算表，预留至少6个月流动性安全垫。'
            },
            {
              title: '技术壁垒阐述易被质疑为“技术自嗨”',
              level: '表达缺陷',
              desc: '过多篇幅阐述多光谱算法底层，缺少国家第三方权威盲测成效证明及权威期刊论文背书。',
              action: '在PPT第6页以醒目图表展示省农科院5000亩实测对比报告。'
            }
          ]).map((issue: any, idx: number) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-bold text-gray-900">
                  {idx + 1}. {issue.title}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  issue.level.includes('致命') ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  【{issue.level}】
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed pl-3 border-l-2 border-gray-200">
                {issue.desc}
              </p>
              <p className="text-blue-900 leading-relaxed pl-3 text-[11px]">
                <strong className="text-blue-700">💡 落地行动：</strong>{issue.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps Prompt Suggestions (Interactive buttons) */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>4.1 为你规划的下一步推进建议（点击即可自动填入发送）：</span>
          </span>
          <span className="text-[10px] text-blue-600 font-mono">多轮会话协同</span>
        </div>

        <div className="space-y-1.5">
          {[
            `帮我根据 4.2 诊断意见，重写 BP 商业计划书第四章商业模式与合作社分成方案`,
            `针对财务账期漏洞，帮我重新测算“三年财务预测与现金流回款表”`,
            `针对评委质疑巨头竞争，帮我生成一套金奖级 1 分钟答辩防守话术`
          ].map((promptText, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => onSelectNextAction(promptText)}
              className="w-full text-left p-2.5 rounded-lg bg-gray-50/70 border border-gray-200/80 hover:border-blue-400 hover:bg-blue-50/60 text-gray-800 hover:text-blue-950 text-xs font-medium transition-all flex items-center justify-between group"
            >
              <span className="truncate pr-2">👉 {promptText}</span>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer Feedback & Attribution */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
        <span className="font-mono text-gray-400 text-[10px]">
          数据源: {engineTitle} · 全链路闭环
        </span>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
            onClick={handleDislike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
