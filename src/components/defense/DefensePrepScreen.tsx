import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  AlertTriangle, 
  ListChecks, 
  FileSearch, 
  Target, 
  Clock, 
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { DefenseProject, ModeDef, DefenseSessionConfig } from './defenseTypes';

interface Props {
  project: DefenseProject;
  mode: ModeDef;
  config: DefenseSessionConfig;
  onStartSession: () => void;
  onBack: () => void;
  skipAnalysis?: boolean;
}

export default function DefensePrepScreen({
  project,
  mode,
  config,
  onStartSession,
  onBack,
  skipAnalysis = false
}: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(!skipAnalysis);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    'AI 评委正依据2026国赛标准深度阅读项目计划书...',
    '正在交叉比对该赛道历届金奖与高频易失分点...',
    '正在结合评委挑剔人设提炼核心疑点与靶向题库...'
  ];

  useEffect(() => {
    if (skipAnalysis) return;

    const t1 = setTimeout(() => setLoadingStep(1), 1100);
    const t2 = setTimeout(() => setLoadingStep(2), 2200);
    const t3 = setTimeout(() => setIsAnalyzing(false), 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [skipAnalysis]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                赛前解构报告
              </span>
              <h1 className="text-lg font-bold text-slate-900">全息档案解构与靶向考题预测</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              AI 评委视界 (Judge's Horizon) · 提前掌握评委提问动机与潜在痛脚
            </p>
          </div>
        </div>

        <button
          onClick={onStartSession}
          disabled={isAnalyzing}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          <Play size={14} className="fill-current" />
          <span>正式进入实训舱</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-24 gap-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-3 border-indigo-600 border-t-transparent"
              />
              <FileSearch size={26} className="text-indigo-600" />
            </div>

            <div className="text-center space-y-1.5 max-w-md px-4">
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold text-slate-800"
              >
                {loadingMessages[loadingStep]}
              </motion.p>
              <p className="text-xs text-slate-400">
                正在为【{project.name}】动态编排【{mode.name}】难度策略
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Context Summary Banner */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border"
                    style={{ backgroundColor: mode.bg, color: mode.text, borderColor: mode.border }}
                  >
                    <mode.icon size={13} />
                    {mode.name}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{project.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Target size={13} className="text-slate-400" />
                    <span>{project.track}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    <span>单题时限：{config.timeLimit}秒 · {config.rounds === 'unlimited' ? '自然控场' : `${config.rounds}题制`}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Cpu size={13} className="text-indigo-600" />
                    <span className="text-indigo-700 font-medium">难度：{config.difficulty === 'high_pressure' ? '高压严苛' : config.difficulty === 'friendly' ? '温和循诱' : '标准专业'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onStartSession}
                className="shrink-0 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Play size={15} className="fill-current" />
                <span>立即启动答辩舱</span>
              </button>
            </div>

            {/* 2-Column Grid: Insights & Doubts on Left, Question Pool on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Highlights & Doubts */}
              <div className="lg:col-span-7 space-y-6">
                {/* Highlights */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-600" />
                      <span>项目核心亮点提取 (Judge Highlights)</span>
                    </h3>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      答辩时应乘胜追击
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>底层研发壁垒显著，技术先发优势明确</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        底层核心器件与专用检测算法自研，核心专利链条完整，在中试车间与主流产线验证了微米级缺陷的高检出率，具备替代进口垄断的技术实力。
                      </p>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>团队学科交叉配比合理，科研成果转化链条清晰</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        团队由光学工程博导指导，硕博研究生主导工程落地，同时吸纳了具备工业检测头部企业实操经验的商科成员，执行力指标可信度高。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Doubts & Holes */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-600" />
                      <span>评委必抓核心疑点与漏洞 (Critical Doubts)</span>
                    </h3>
                    <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                      高频失分高危区
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-1">
                      <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>面对行业既有巨头或低价竞争时，护城河论证薄弱</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        计划书中对“如果基恩士或康耐视采取价格战或捆绑销售”缺乏预先反制机制。评委大概率会在追问环节针对客户迁移成本展开连环质询。
                      </p>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-1">
                      <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>财务测算增长曲线过陡，缺乏回款周期与坏账假设</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        预测第三年销售额激增4倍，但未明确制造业客户长达6-9个月验收回款期下的流动资金缺口应对策略，易被投资人评委判定为“学生气理想化”。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Predictive Question Pool */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ListChecks size={16} className="text-indigo-600" />
                        <span>预测高维题库 (AI Question Pool)</span>
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">已生成 12 题</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">
                      评委将在下列靶向题库中动态抽选，并根据你的实时回答情况发起二级下钻追问：
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          tag: '高频必考',
                          tagClass: 'bg-rose-50 text-rose-700 border-rose-200',
                          question: '你们与国外垄断厂商（如基恩士）相比，除了价格优势外，最不可被追平的技术与本土化壁垒是什么？'
                        },
                        {
                          tag: '针对疑点',
                          tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
                          question: '财务预测明后年营收连番翻倍，但工业品验证周期极长，你们的前期试用客户转化为真金白银付费的转化率是多少？'
                        },
                        {
                          tag: '针对疑点',
                          tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
                          question: '高校科研成果归属权是否已完成清晰切割？是否具备学校科技处明确出具的独占许可或转让批复？'
                        },
                        {
                          tag: '冷门拓展',
                          tagClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                          question: '若未来供应链关键光学镜组受到进出口限制，你们是否有成熟的国产二供替代方案？'
                        }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5 hover:border-slate-300 transition-colors"
                        >
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.tagClass}`}>
                            {item.tag}
                          </span>
                          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                            {item.question}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-center">
                    <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">
                      已就绪，点击进入实训舱后评委将自主开场质询 →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
