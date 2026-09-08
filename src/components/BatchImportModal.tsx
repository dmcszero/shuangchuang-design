import { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Database
} from 'lucide-react';
import { ProjectItem } from '../types';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (newProjects: ProjectItem[]) => void;
}

export default function BatchImportModal({ isOpen, onClose, onImportComplete }: BatchImportModalProps) {
  const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState('');
  const [selectedSource, setSelectedSource] = useState<'excel' | 'api' | 'cloud'>('excel');

  if (!isOpen) return null;

  const handleStartScan = () => {
    setStep('scanning');
    setScanProgress(15);
    setScanStageText('正在解析申报表单、商业计划书(BP)及路演PPT文档...');

    setTimeout(() => {
      setScanProgress(40);
      setScanStageText('正在进行【参赛资格审查】与【知识产权权属/授权声明】合规核验...');
    }, 700);

    setTimeout(() => {
      setScanProgress(75);
      setScanStageText('正在执行全网论文专利查重、AI生成痕迹检测及2026国赛标准秒级打分...');
    }, 1400);

    setTimeout(() => {
      setScanProgress(100);
      setScanStageText('项目对标初筛与分级完成！');
      setStep('results');
    }, 2100);
  };

  const handleFinishImport = () => {
    // Notify parent
    onClose();
    setStep('upload');
    setScanProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="batch-import-modal-content"
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden text-slate-800 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-50 border border-sky-200 rounded-xl text-sky-700">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">海量双创项目智能导入与秒级体检</h2>
              <p className="text-xs text-slate-500">支持全校申报数据一键导入，毫秒级完成合规拦截与2026国赛标准初筛</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {step === 'upload' && (
            <div className="space-y-5">
              {/* Import Source Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedSource('excel')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col ${
                    selectedSource === 'excel'
                      ? 'border-sky-500 bg-sky-50/70 text-slate-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600 mb-2" />
                  <span className="text-xs font-semibold">校级报名表 (Excel/Zip)</span>
                  <span className="text-[10px] text-slate-500 mt-1">包含申报书与BP附件包</span>
                </button>

                <button
                  onClick={() => setSelectedSource('api')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col ${
                    selectedSource === 'api'
                      ? 'border-sky-500 bg-sky-50/70 text-slate-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Database className="h-5 w-5 text-sky-600 mb-2" />
                  <span className="text-xs font-semibold">教务/双创管理系统直连</span>
                  <span className="text-[10px] text-slate-500 mt-1">自动同步已提交项目</span>
                </button>

                <button
                  onClick={() => setSelectedSource('cloud')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col ${
                    selectedSource === 'cloud'
                      ? 'border-sky-500 bg-sky-50/70 text-slate-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="h-5 w-5 text-amber-600 mb-2" />
                  <span className="text-xs font-semibold">历届优质项目池导入</span>
                  <span className="text-[10px] text-slate-500 mt-1">用于往届成果沉淀</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-sky-500/80 rounded-2xl p-8 text-center bg-slate-50/50 transition">
                <div className="mx-auto w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-900">点击或拖拽全校项目申报包至此处</div>
                <p className="text-xs text-slate-500 mt-1">
                  支持 .xlsx, .zip, .pdf 格式（系统预置：2026全校第二批次申报共 24 个项目包）
                </p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
                  <span className="flex items-center"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" /> 自动知识产权合规审查</span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center"><Sparkles className="h-3.5 w-3.5 text-sky-600 mr-1" /> 2026二级指标秒级对标</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">预计耗时：约 2 秒完成全部 24 个项目体检</span>
                <button
                  id="btn-confirm-start-scan"
                  onClick={handleStartScan}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  开始批量导入与AI初筛
                </button>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="py-8 space-y-6 text-center">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-sky-400/20 animate-ping" />
                <div className="w-20 h-20 rounded-full bg-sky-50 border-2 border-sky-500 flex items-center justify-center text-sky-600 shadow-sm">
                  <Sparkles className="h-8 w-8 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">AI 智能初筛与多维体检中...</h3>
                <p className="text-xs text-sky-700 font-mono mt-1 font-medium">{scanProgress}% - {scanStageText}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 max-w-md mx-auto">
                <div 
                  className="bg-sky-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-[11px] text-slate-500 max-w-lg mx-auto pt-2">
                <div className={scanProgress >= 25 ? 'text-emerald-700 font-semibold' : ''}>1. 材料结构解析</div>
                <div className={scanProgress >= 50 ? 'text-emerald-700 font-semibold' : ''}>2. 资格与IP审查</div>
                <div className={scanProgress >= 75 ? 'text-emerald-700 font-semibold' : ''}>3. 查重与AI检测</div>
                <div className={scanProgress >= 95 ? 'text-emerald-700 font-semibold' : ''}>4. 2026标准打分</div>
              </div>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Stat Summary */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500">导入解析成功</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">24 / 24 项</div>
                </div>
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div className="text-xs text-amber-800 font-medium">新入围A级潜力</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">4 项</div>
                </div>
                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200">
                  <div className="text-xs text-sky-800 font-medium">B/C级培育池</div>
                  <div className="text-lg font-bold text-sky-700 mt-1">19 项</div>
                </div>
                <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
                  <div className="text-xs text-rose-800 font-medium">一票否决预警</div>
                  <div className="text-lg font-bold text-rose-700 mt-1">1 项 (高风险)</div>
                </div>
              </div>

              {/* Sample Scanned List */}
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs shadow-2xs">
                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">A级 · 94.5分</span>
                    <span className="font-medium text-slate-900 truncate max-w-sm">光子芯眸——新一代全固态硅光激光雷达芯片破壁者</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> 合规通过 (查重1.8%)
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">A级 · 92.8分</span>
                    <span className="font-medium text-slate-900 truncate max-w-sm">菌草金粮——高抗逆盐碱地微藻蛋白重构与富民产业</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> 合规通过 (红旅证明齐全)
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-rose-50/50 transition bg-rose-50/30">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">D级 · 68.0分</span>
                    <span className="font-medium text-rose-900 truncate max-w-sm">青藤创客——面向中小学的低代码AI创新教具与课程体系</span>
                  </div>
                  <span className="text-[11px] text-rose-700 font-semibold flex items-center">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1 text-rose-600" /> 查重38.5% 一票否决拦截
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-xl transition"
                >
                  关闭
                </button>
                <button
                  onClick={handleFinishImport}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center"
                >
                  确认入库并进入智能初筛工作台
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
