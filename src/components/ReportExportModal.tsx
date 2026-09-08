import { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Presentation, 
  Sparkles, 
  TrendingUp, 
  Award, 
  AlertTriangle 
} from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportExportModal({ isOpen, onClose }: ReportExportModalProps) {
  const [reportFormat, setReportFormat] = useState<'word' | 'ppt'>('word');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="report-export-modal-content"
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                双创备赛阶段性数据复盘与金奖指标提升汇报材料
                <span className="ml-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  AI 一键生成
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                面向校领导与双创工作领导小组的标准化汇报纪要（含梯队分布、共性短板、督导成效与金奖冲刺策略）
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

        {/* Format Selector Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setReportFormat('word')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                reportFormat === 'word'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Word 汇报文本格式</span>
            </button>
            <button
              onClick={() => setReportFormat('ppt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                reportFormat === 'ppt'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>PPT 汇报讲稿大纲</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition flex items-center font-medium shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copied ? '已复制汇报内容' : '复制全文'}
            </button>
            <button
              onClick={() => {
                alert('已生成并下载《2026中国国际大学生创新大赛备赛复盘与金奖培育诊断报告.docx》');
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-2xs transition flex items-center"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              下载汇报文件
            </button>
          </div>
        </div>

        {/* Report Preview Document */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 text-slate-700 text-xs leading-relaxed space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-5 shadow-2xs">
            {/* Title & Metadata */}
            <div className="border-b border-slate-200 pb-4 text-center">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                2026年中国国际大学生创新大赛（校内备赛阶段）数据复盘与金奖培育诊断报告
              </h1>
              <div className="text-xs text-slate-500 mt-2 flex items-center justify-center space-x-4">
                <span>编制单位：学校创新创业学院</span>
                <span>统计周期：2026年6月-8月</span>
                <span>数据来源：AI双创管理中枢</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-sm text-sky-800 flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5 text-sky-600" />
                核心结论摘要（AI 决策简述）
              </div>
              <p className="text-slate-700">
                本届大赛全校共导入申报项目 <strong className="text-slate-900">82 项</strong>。经 2026 官方评审规则自动化对标初筛，已锁定 <strong className="text-amber-700">A级金奖潜力池 15 项</strong>（占比 18.3%）、B级银奖梯队 28 项。辅导工单督导闭环率达到 <strong className="text-emerald-700">88.5%</strong>，重点项目平均经过 3.2 轮打磨后，评分均值较初筛提升 <strong className="text-sky-700 font-bold">+7.4 分</strong>。
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Award className="h-4 w-4 text-amber-600 mr-1.5" />
                一、金奖潜力池构建与梯队结构
              </h3>
              <div className="grid grid-cols-4 gap-3 text-center my-2">
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="text-[11px] text-amber-900 font-semibold">A级 · 金奖冲刺池</div>
                  <div className="text-base font-bold text-amber-700 mt-0.5">15 项 (90分+)</div>
                  <div className="text-[10px] text-slate-500">一对一国赛评委精打磨</div>
                </div>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <div className="text-[11px] text-blue-900 font-semibold">B级 · 省金/国银池</div>
                  <div className="text-base font-bold text-blue-700 mt-0.5">28 项 (80-89分)</div>
                  <div className="text-[10px] text-slate-500">专项商业短板补强</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-[11px] text-slate-700 font-semibold">C级 · 校赛培育池</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">31 项 (70-79分)</div>
                  <div className="text-[10px] text-slate-500">常态化AI答疑与模板指导</div>
                </div>
                <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg">
                  <div className="text-[11px] text-rose-900 font-semibold">D级/合规拦截</div>
                  <div className="text-base font-bold text-rose-700 mt-0.5">8 项 (含2项拦截)</div>
                  <div className="text-[10px] text-slate-500">查重超标或IP权属未明</div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <AlertTriangle className="h-4 w-4 text-rose-600 mr-1.5" />
                二、2026国赛细分指标全校共性短板洞察
              </h3>
              <p className="text-slate-700">
                通过对全校项目在 2026 评审细则各二级指标的横向雷达分析，发现以下三大共性失分痛点：
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700 pl-2">
                <li>
                  <strong className="text-slate-900">产业价值 - 市场定位与财务模型偏弱（得分率仅 68.4%）：</strong> 新工科项目普遍存在“技术自嗨”，对工业中试放大良品率、车规/医疗长周期认证对现金流的折损缺乏审慎测算。
                </li>
                <li>
                  <strong className="text-slate-900">个人成长 - 调研深入与真实佐证不足（得分率 76.2%）：</strong> 部分学生项目调研停留在网络公开研报，缺少深入车间、基层乡村及意向客户的第一手真实访谈实测台账。
                </li>
                <li>
                  <strong className="text-slate-900">跨材料一致性瑕疵：</strong> AI终审发现 34% 的项目在商业计划书(BP)、路演PPT及答辩稿中存在销售额预测与估值数据前后不一致的低级失误。
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <TrendingUp className="h-4 w-4 text-emerald-600 mr-1.5" />
                三、常态化督导闭环与金奖指标提升成效
              </h3>
              <p className="text-slate-700">
                本届推行“专家诊断 → AI生成修改工单 → 学生限期提交 → 专家二次Check复核”强制闭环管理模式，彻底解决“专家评完就忘、学生听完不改”顽疾。已累计下发工单 68 项，修改完成率达 88.5%。重点项目如【光子芯眸】（微电子）经投资人二次复核后，金奖对标分从 86.0 分跃升至 94.5 分。
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                四、下一阶段备赛冲刺实施建议
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-2">
                <li>针对 15 个 A 级项目开展“国赛评委 5 种人设”高强度模拟压力测试答辩；</li>
                <li>针对 28 个 B 级项目统一调度投资人导师进行“商业模式与财务估值”专项加练；</li>
                <li>严把一票否决合规关，对查重疑似超标项目组织专班人工复核，确保国赛零差错申报。</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>支持直接复制文字或导出 Word/PPT 原稿给校领导汇报</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition font-medium"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
