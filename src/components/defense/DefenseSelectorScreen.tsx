import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  Settings, 
  X, 
  Info, 
  Play, 
  Clock, 
  History, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Swords,
  ShieldCheck,
  Award
} from 'lucide-react';
import { DefenseProject, ModeDef, DefenseSessionConfig, DefenseHistoryItem } from './defenseTypes';
import { MOCK_DEFENSE_PROJECTS, TRAINING_MODES, RECENT_DEFENSE_HISTORY } from './defenseConstants';

interface Props {
  onStart: (project: DefenseProject, mode: ModeDef, config: DefenseSessionConfig) => void;
  onViewReport: (project: DefenseProject, mode: ModeDef, historyItem?: DefenseHistoryItem) => void;
  initialProject?: DefenseProject;
}

export default function DefenseSelectorScreen({ onStart, onViewReport, initialProject }: Props) {
  const [selectedProject, setSelectedProject] = useState<DefenseProject>(
    initialProject || MOCK_DEFENSE_PROJECTS[0]
  );
  const [selectedMode, setSelectedMode] = useState<ModeDef | null>(TRAINING_MODES[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Synchronize with global project selected in sidebar
  useEffect(() => {
    if (initialProject) {
      setSelectedProject(initialProject);
    }
  }, [initialProject?.id, initialProject?.name]);

  // Configuration state
  const [config, setConfig] = useState<DefenseSessionConfig>({
    judgeMode: 'single',
    difficulty: 'standard',
    rounds: 'unlimited',
    timeLimit: 90,
    elevatorDuration: '1min'
  });

  const handleModeClick = (mode: ModeDef) => {
    setSelectedMode(mode);
    setIsDrawerOpen(true);
  };

  const handleStartWithCurrent = () => {
    if (selectedProject && selectedMode) {
      setIsDrawerOpen(false);
      onStart(selectedProject, selectedMode, config);
    }
  };

  return (
    <div className="space-y-8 pb-16" id="defense-selector-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>2026大赛评审专家人设与国赛多维大模型实训</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            模拟评审与答辩训练舱
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            还原全国大学生创新大赛金奖争夺现场！支持载入当前参赛项目及历届标杆案例，通过高压追问、电梯演讲与极限反驳训练，生成六维能力雷达与专家级改进方案。
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-indigo-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>六维能力雷达动态评估</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Swords className="h-4 w-4 text-rose-400" />
              <span>投资人/学术评委挑剔风格</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              <span>答辩复盘与失分点专项补强</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Active Project Banner (Synchronized Globally with Left Sidebar) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
            <Folder size={20} />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                {selectedProject.track}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={11} />
                <span>当前参赛答辩项目</span>
              </span>
              {selectedProject.tags.map(tag => (
                <span key={tag} className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 hidden sm:inline-block">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate" title={selectedProject.name}>
              {selectedProject.name}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1">
              {selectedProject.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 md:self-center bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs text-slate-500">
          <Info size={14} className="text-indigo-500 shrink-0" />
          <span>全局选定项目 · 更换请在左侧边栏顶部的【当前参赛项目】中切换</span>
        </div>
      </div>

      {/* Mode Selection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">选择实训模式与参数配置</h2>
              <p className="text-xs text-slate-500">点击模式卡片可展开右侧详细参数配置（轮次、单题时限、评委风格），配置完毕即可进入答辩舱实训</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TRAINING_MODES.map((mode) => {
            const isSelected = selectedMode?.id === mode.id;
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => handleModeClick(mode)}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {mode.badge && (
                  <span
                    className={`absolute top-3.5 right-3.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      mode.badge === '推荐'
                        ? 'bg-indigo-100 text-indigo-700'
                        : mode.badge === '速通'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {mode.badge}
                  </span>
                )}

                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: mode.bg, color: mode.text }}
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{mode.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {mode.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {mode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Settings size={13} />
                    <span>{isSelected ? '配置参数并开始' : '选择模式'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Recent Training History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">实训历史与复盘记录</h2>
              <p className="text-xs text-slate-500">点击历史记录可直接查看往期实训生成的六维雷达与专家改进建议报告</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RECENT_DEFENSE_HISTORY.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                const proj = MOCK_DEFENSE_PROJECTS.find((p) => p.id === item.projectId) || selectedProject;
                const m = TRAINING_MODES.find((mode) => mode.id === item.modeId) || TRAINING_MODES[0];
                onViewReport(proj, m, item);
              }}
              className="bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{item.modeName}</span>
                  <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.score ? `${item.score}分` : '已复盘'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {item.projectName}
                </p>
                <p className="text-[11px] text-slate-400">{item.stats}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
                <span>{item.date}</span>
                <span className="text-indigo-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  查看报告 <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mode Configuration Drawer (Slide-Over) */}
      <AnimatePresence>
        {isDrawerOpen && selectedMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: selectedMode.bg, color: selectedMode.text }}
                    >
                      <selectedMode.icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{selectedMode.name}</h3>
                        {selectedMode.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {selectedMode.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">配置本次演练的评委参数与对抗烈度</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Selected Project Card in Drawer */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">已选答辩项目</span>
                  <div className="text-xs font-bold text-slate-900 truncate">{selectedProject.name}</div>
                  <div className="text-[11px] text-slate-500">{selectedProject.track}</div>
                </div>

                {/* Configuration Options */}
                <div className="space-y-5">
                  {/* Judge Mode */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">评委席规模</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'single', label: '单主审评委', sub: '自动匹配对应赛道首席专家' },
                        { id: 'panel', label: '3人联合评委席', sub: '投资人 + 产业学者 + 财务法务' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setConfig((c) => ({ ...c, judgeMode: item.id as any }))}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            config.judgeMode === item.id
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Style */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">评委质询风格与烈度</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'friendly', title: '温和肯定', sub: '先鼓励再提建议' },
                        { id: 'standard', title: '标准专业', sub: '中立直奔核心漏洞' },
                        { id: 'high_pressure', title: '高压刁难', sub: '连环抓痛脚极限施压' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setConfig((c) => ({ ...c, difficulty: s.id as any }))}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            config.difficulty === s.id
                              ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <div className="text-xs">{s.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode-specific: Elevator Pitch Duration */}
                  {selectedMode.id === 'elevator' ? (
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">演讲陈述时长</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: '1min', label: '1分钟极速版 (60秒)', sub: '痛点+核心解法+壁垒' },
                          { id: '3min', label: '3分钟标准版 (180秒)', sub: '完整商业价值主张闭环' }
                        ].map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setConfig((c) => ({ ...c, elevatorDuration: d.id as any }))}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              config.elevatorDuration === d.id
                                ? 'border-amber-500 bg-amber-50/60 text-amber-900 font-bold'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold">{d.label}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{d.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">问答轮次</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'unlimited', label: '自然控场' },
                          { id: '3', label: '3 题' },
                          { id: '5', label: '5 题' },
                          { id: '8', label: '8 题' }
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setConfig((c) => ({ ...c, rounds: r.id as any }))}
                            className={`py-2 px-1 rounded-xl border text-xs font-medium transition-all ${
                              config.rounds === r.id
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        自然控场：评委视答辩表现自主把控深度，问透即收尾，亦可随时提前交卷。
                      </p>
                    </div>
                  )}

                  {/* Per Question Time Limit */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">单题回答时限</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[60, 90, 120].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setConfig((c) => ({ ...c, timeLimit: t }))}
                          className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                            config.timeLimit === t
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {t} 秒
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleStartWithCurrent}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Play size={16} className="fill-current" />
                  <span>进入 {selectedMode.name} 训练舱</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  暂不开始，返回修改
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
