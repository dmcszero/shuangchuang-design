import { useState } from 'react';
import { X, BookOpen, CheckCircle2, AlertOctagon, Award, Layers } from 'lucide-react';
import { COMPETITION_RULES_2026 } from '../data/rules2026';
import { TrackType } from '../types';

interface RulesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesConfigModal({ isOpen, onClose }: RulesConfigModalProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<TrackType>('higher_education_creative');

  if (!isOpen) return null;

  const currentRule = COMPETITION_RULES_2026.find(r => r.trackId === selectedTrackId) || COMPETITION_RULES_2026[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="rules-config-modal-content"
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col text-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-50 border border-sky-200 rounded-xl text-sky-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                中国国际大学生创新大赛（2026）官方评审规则体系
                <span className="ml-2 text-xs font-normal text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full font-medium">
                  国赛标准内置
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                依据教育部官方评审要点，已将一级与二级细分指标、分值权重及一票否决项结构化嵌入系统
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Track Selector Tabs */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center space-x-2 overflow-x-auto">
          {COMPETITION_RULES_2026.map(rule => (
            <button
              key={rule.trackId}
              onClick={() => setSelectedTrackId(rule.trackId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center space-x-1.5 ${
                selectedTrackId === rule.trackId
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>{rule.trackName}（{rule.groupName}）</span>
              <span className="text-[10px] opacity-75">100分</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">赛道与组别</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{currentRule.trackName} - {currentRule.groupName}</div>
              <div className="text-xs text-sky-700 mt-1 flex items-center font-medium">
                <Layers className="h-3.5 w-3.5 mr-1 text-sky-600" />
                共包含 {currentRule.tier1Rules.length} 个一级指标，{currentRule.tier1Rules.reduce((acc, cur) => acc + cur.tier2List.length, 0)} 个二级指标
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">总分值设定</div>
              <div className="text-sm font-bold text-amber-700 mt-1">满分 {currentRule.totalMaxScore} 分</div>
              <div className="text-xs text-slate-500 mt-1">按国赛评委实际答辩与材料评分加权</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="text-xs text-rose-800 font-medium flex items-center">
                <AlertOctagon className="h-3.5 w-3.5 mr-1 text-rose-600" />
                必要条件（一票否决项）
              </div>
              <div className="text-xs text-rose-900 mt-1 space-y-1">
                {currentRule.mandatoryConditions.map((c, i) => (
                  <div key={i} className="flex items-start">
                    <span className="mr-1 text-rose-600">•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tier 1 & Tier 2 Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-1.5" />
              2026国赛细分指标与评审要点对照表
            </h3>

            <div className="space-y-4">
              {currentRule.tier1Rules.map((t1) => (
                <div key={t1.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  {/* Tier 1 Header */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-sky-600" />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{t1.name}</span>
                      <span className="text-xs text-slate-500">（含 {t1.tier2List.length} 个二级指标）</span>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      满分 {t1.maxScore} 分
                    </span>
                  </div>

                  {/* Tier 2 List */}
                  <div className="divide-y divide-slate-100">
                    {t1.tier2List.map((t2, idx) => (
                      <div key={t2.id} className="p-3.5 hover:bg-slate-50 transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-slate-400 font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                          <div>
                            <div className="font-semibold text-slate-900">{t2.name}</div>
                            <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">{t2.description}</p>
                          </div>
                        </div>
                        <div className="sm:text-right shrink-0 pl-6 sm:pl-0">
                          <span className="text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                            {t2.maxScore} 分
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>AI初筛评分引擎已按此标准全自动化对齐打分</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition font-medium"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
}
