import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  RefreshCw, 
  LayoutGrid, 
  FileText, 
  CheckCircle, 
  Paperclip, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Award, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DefenseProject, ModeDef, DimensionScore, DefenseHistoryItem } from './defenseTypes';
import { ScoreRing, RadarChart } from './DefenseCharts';
import { DIMENSION_COLORS } from './defenseConstants';

interface Props {
  project: DefenseProject;
  mode: ModeDef;
  onRestart: () => void;
  onReplay: () => void;
  historyItem?: DefenseHistoryItem;
}

export default function DefenseReportScreen({
  project,
  mode,
  onRestart,
  onReplay,
  historyItem
}: Props) {
  const [expandedRound, setExpandedRound] = useState<string | null>('r2');

  const radarData: DimensionScore[] = [
    { label: '创新性', value: 88, color: DIMENSION_COLORS.innovation, comment: '技术创新点突出，具有明显先进性' },
    { label: '技术可行性', value: 85, color: DIMENSION_COLORS.technical, comment: '工程实现度高，关键参数扎实' },
    { label: '市场商业度', value: 68, color: DIMENSION_COLORS.market, comment: '商业闭环与竞品反制需进一步补强' },
    { label: '团队综合力', value: 82, color: DIMENSION_COLORS.team, comment: '硕博科研与学科交叉配比优良' },
    { label: '答辩表达度', value: 76, color: DIMENSION_COLORS.expression, comment: '节奏把控良好，部分回答略显冗长' },
    { label: '社会示范性', value: 90, color: DIMENSION_COLORS.social, comment: '服务国家战略与自主可控导向明确' },
  ];

  const toggleRound = (roundId: string) => {
    setExpandedRound((prev) => (prev === roundId ? null : roundId));
  };

  const totalScore = historyItem?.score || 84;

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Bar with Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                答辩实训完成
              </span>
              <h1 className="text-lg font-bold text-slate-900">模拟答辩综合评审报告与专家复盘</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              基于 2026 大赛官方评审维度 · 生成多维雷达与针对性答辩词优化建议
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRestart}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LayoutGrid size={14} />
            <span>换项目/模式</span>
          </button>
          <button
            onClick={onReplay}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw size={14} />
            <span>针对薄弱点再练一次</span>
          </button>
        </div>
      </div>

      {/* Main Score & High-Level Appraisal Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0 relative z-10 flex flex-col items-center">
          <ScoreRing score={totalScore} size={140} />
        </div>

        <div className="flex-1 text-center md:text-left z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border"
              style={{ backgroundColor: mode.bg, color: mode.text, borderColor: mode.border }}
            >
              <mode.icon size={13} />
              {mode.name}实训
            </span>
            <span className="text-xs text-slate-400 font-medium">|</span>
            <span className="text-xs font-bold text-slate-700">{project.name}</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            总体表现优秀（省金顶格/国金冲刺水准），但在商业闭环与巨头防御上存在明显失分点
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            答辩人对于底层关键光学算法与微米测量精度的陈述具有强大说服力，展现了深厚的科研底蕴。但在面对“大厂入局与价格战”的高压追问时，回答未能有效证明客户迁移壁垒与排他性数据飞轮，逻辑出现了短暂断层，建议在正式网评与决赛现场针对该维度专项打补丁。
          </p>

          <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
            <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
              <Clock size={14} className="text-slate-400" />
              <span className="text-slate-500">实训耗时：</span>
              <span className="font-mono font-bold text-slate-800">08:45</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
              <Award size={14} className="text-indigo-600" />
              <span className="text-slate-500">答辩轮次：</span>
              <span className="font-mono font-bold text-indigo-700">完成 4 轮问答</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertTriangle size={14} className="text-amber-500" />
              <span className="text-slate-500">超时预警：</span>
              <span className="font-mono font-bold text-amber-700">1 次 (已平稳收敛)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 6-Dimension Radar on Left, Weakness Progress Bars on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Radar Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              <span>大赛六维评审能力雷达</span>
            </h3>
            <span className="text-xs text-slate-400">满分 100 分制</span>
          </div>

          <div className="py-4">
            <RadarChart data={radarData} size={280} />
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>最强项：社会示范价值 ({radarData[5].value}分)</span>
            <span className="text-amber-600 font-semibold">待加强：市场商业度 ({radarData[2].value}分)</span>
          </div>
        </div>

        {/* Right: Dimension Weakness Breakdown */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600" />
              <span>各评审维度细分得分与诊断</span>
            </h3>
            <span className="text-xs text-slate-400">对标2026评分细则</span>
          </div>

          <div className="space-y-3.5">
            {radarData.map((d) => (
              <div key={d.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] hidden sm:inline">{d.comment}</span>
                    <span className="font-mono font-bold text-indigo-700">{d.value}分</span>
                  </div>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${d.value}%`,
                      backgroundColor: d.value < 75 ? '#f59e0b' : d.value >= 85 ? '#10b981' : '#6366f1'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Round-by-Round Q&A Critique & Golden AI Suggestions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <span>逐轮质询逐字复盘与 AI 优化答辩词 (Round Breakdown)</span>
          </h3>
          <span className="text-xs text-slate-400">点击展开查看详细答辩建议</span>
        </div>

        <div className="space-y-3">
          {/* Round 1 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden transition-all">
            <div
              onClick={() => toggleRound('r1')}
              className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  R1
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  请问你们的核心技术突破性到底在哪个具体指标上形成了对现有格局的颠覆？
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  回答优秀 (88分)
                </span>
                {expandedRound === 'r1' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedRound === 'r1' && (
              <div className="p-4 pt-3 border-t border-slate-200 space-y-3 bg-white">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    现场答辩记录
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    “我们突破了大光斑纳秒激光干涉技术，在亚微米三维轮廓重构指标上，将单次在线全检耗时从同类进口设备的1.8秒压缩至0.2秒以内，同时自研算法保证了99.6%的高检出率。”
                  </p>
                </div>
                <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-3.5 space-y-1 text-xs">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-indigo-600" />
                    <span>AI 专家点评与锦上添花建议</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    以量化参数（1.8s压缩至0.2s，检出率99.6%）开篇非常利落，有力建立了科研硬实力信赖。建议可进一步补充：“该指标已在某新能源动力电池中试产线完成连续1000小时无故障实跑验证”，形成闭环。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Round 2 (The Weak Spot) */}
          <div className="border border-rose-200 rounded-xl overflow-hidden transition-all">
            <div
              onClick={() => toggleRound('r2')}
              className="p-4 bg-rose-50/30 hover:bg-rose-50/50 cursor-pointer flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  R2
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  如果基恩士或康耐视等巨头降价或推出同款功能，你们的客户迁移成本究竟由什么来保障？
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  失分点 / 逻辑断层 (62分)
                </span>
                {expandedRound === 'r2' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedRound === 'r2' && (
              <div className="p-4 pt-3 border-t border-rose-200 space-y-3 bg-white">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    现场答辩记录（暴露薄弱）
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    “我们作为高校初创团队更接地气，服务响应很快，而且我们先进入这个市场，客户对我们有感情，大厂要研发同类产品也需要时间周期。”
                  </p>
                </div>
                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-rose-600" />
                    <span>AI 专家打磨：国金级高分答辩话术推荐</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    切忌在国赛答辩中使用“感情好”、“大厂研发需要时间”这类情绪化与侥幸假设。建议标准防御结构：
                    <br />
                    1. <strong>私有数据飞轮</strong>：我们已累计沉淀国内TOP3封测厂独有缺陷特征图谱超200万张，大厂拿不到产线私有数据，模型泛化精度无法赶超；
                    <br />
                    2. <strong>设备协议锁定</strong>：与客户制造执行系统(MES)深度集成协议定制，更换整套系统停线调试成本高达上百万元，客户迁移意愿极低；
                    <br />
                    3. <strong>软硬协同二代机布局</strong>：在巨头跟进一代机时，我们二代纳秒激光源已进入晶圆级冷测阶段。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Round 3 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden transition-all">
            <div
              onClick={() => toggleRound('r3')}
              className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  R3
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  高校科研成果归属权是否已完成清晰切割？核心发明专利转化是否已获批复？
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  回答良好 (82分)
                </span>
                {expandedRound === 'r3' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedRound === 'r3' && (
              <div className="p-4 pt-3 border-t border-slate-200 space-y-3 bg-white">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    现场答辩记录
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    “我们已取得学校科技处出具的排他性专利独占许可协议，公证书与科技成果转化批文已作为附件随申报材料提交。”
                  </p>
                </div>
                <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-3.5 space-y-1 text-xs">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-indigo-600" />
                    <span>AI 专家点评</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    合规凭据清晰，彻底打消了评委对高校师生创业“职务侵占”或“知识产权纠纷”的疑虑，给评委留下了规范专业的印象。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Box Actionable Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 下一步该怎么改 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">下一步针对性改进措施</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            重构商业计划书第4章【竞争策略与壁垒】：将“服务响应”降为次要论述，将“专有缺陷数据集规模”、“产线停机迁移成本测算表”提至首位展示；在答辩PPT中增加一张工业巨头与我方在细分工业级场景下的维度对比矩阵图。
          </p>
        </div>

        {/* 该补什么材料 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800">
            <Paperclip size={16} className="text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">附件该补充什么硬性佐证材料</h3>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">•</span>
              <span>国家级第三方权威检测机构出具的精度与检出率检测报告（带CMA/CNAS公章）；</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">•</span>
              <span>至少两家工业头部客户的上线驻厂试用证明与采购意向协议扫描件。</span>
            </li>
          </ul>
        </div>

        {/* 承压与应变表现 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">答辩承压与现场气场评价</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            在面对评委犀利反问时情绪稳定，没有出现长时间卡顿或情绪性争辩，语速稳定在220字/分钟，肢体语言及眼神自信。但在论据被质疑时略微后退，可更加坚定地以中试数据反推评委假设前提。
          </p>
        </div>

        {/* 专项检查点对照 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">2026大赛评审细则检查点命中</h3>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle size={13} />
              <span>创新引领：核心关键技术突破与知识产权合规性 — 达标</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle size={13} />
              <span>团队配置：学科交叉与师生协同研发实名制 — 达标</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle size={13} />
              <span>商业逻辑：抗风险及客户迁移成本论证 — 需在决赛答辩前专项强补</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Row */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LayoutGrid size={15} />
          <span>换个项目或切换其他实训模式</span>
        </button>
        <button
          onClick={onReplay}
          className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
        >
          <RefreshCw size={15} />
          <span>再练一次（带入优化答辩词）</span>
        </button>
      </div>
    </div>
  );
}
