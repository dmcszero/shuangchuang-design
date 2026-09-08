import React, { useState } from 'react';
import { 
  ProjectVersion, 
  ProjectFileItem, 
  GuidanceTodoItem 
} from './guidanceTypes';
import { 
  X, 
  GitCompare, 
  Upload, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  FolderPlus, 
  Tag, 
  Calendar 
} from 'lucide-react';

// =================== 1. Version Diff Modal ===================
interface VersionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ProjectVersion[];
  currentVersionId: string;
}

export const GuidanceVersionDiffModal: React.FC<VersionDiffModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersionId,
}) => {
  const [baseVerId, setBaseVerId] = useState<string>(versions[1]?.versionId || versions[0]?.versionId || '');
  const [compareVerId, setCompareVerId] = useState<string>(currentVersionId || versions[0]?.versionId || '');

  if (!isOpen) return null;

  const baseVer = versions.find(v => v.versionId === baseVerId);
  const compareVer = versions.find(v => v.versionId === compareVerId);

  const scoreDiff = (compareVer?.total || 0) - (baseVer?.total || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">版本快照差异比对 (Diff Inspector)</h3>
              <p className="text-xs text-slate-500">比对不同提交节点间的商业计划书与评分演进变化</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Version Pickers & Score Delta Banner */}
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">基准版本:</span>
              <select
                value={baseVerId}
                onChange={(e) => setBaseVerId(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {versions.map(v => (
                  <option key={v.versionId} value={v.versionId}>
                    {v.label} ({v.total ? `${v.total}分` : '暂无评分'})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-400">→</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">对比版本:</span>
              <select
                value={compareVerId}
                onChange={(e) => setCompareVerId(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {versions.map(v => (
                  <option key={v.versionId} value={v.versionId}>
                    {v.label} ({v.total ? `${v.total}分` : '暂无评分'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600">总分变化：</span>
            <span className={`font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              scoreDiff >= 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} 分
            </span>
          </div>
        </div>

        {/* Diff Comparison Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>关键章节变更摘要（2处主要修改，1处新增论据）：</span>
            </div>

            {/* Change 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">【第5章 竞争分析与护城河】</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  补强竞争壁垒
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-900 line-through text-[11px] leading-relaxed">
                  对比基恩士与康耐视，本项目具备本土化服务与性价比优势，售价为国外设备的一半，客户反馈良好。
                </div>
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900 text-[11px] leading-relaxed">
                  构筑三道不可逾越的护城河：1.沉淀200万张私有缺陷光谱图谱形成模型飞轮；2.深度集成产线MES协议，停线换型迁移成本高达200万元；3.提供2小时极速驻厂响应，彻底击破海外巨头2-4周备件周期。
                </div>
              </div>
            </div>

            {/* Change 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">【第10章 财务预测与融资计划】</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  增设账期压力测试
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-900 line-through text-[11px] leading-relaxed">
                  2026年预计营收850万元，交付4台设备，单台毛利率58.3%，获客成本低。
                </div>
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900 text-[11px] leading-relaxed">
                  2026年预计营收850万元；针对半导体行业长账期（6-9个月验收），引入长账期流动资金压力测试，配合两家头部封测厂到账65万元前期POC开发费，证明现金流绝对安全。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            完成检视
          </button>
        </div>
      </div>
    </div>
  );
};

// =================== 2. Upload Material Modal ===================
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newFile: ProjectFileItem) => void;
}

export const GuidanceUploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('佐证材料');
  const [badge, setBadge] = useState('');
  const [desc, setDesc] = useState('');
  const [ext, setExt] = useState('pdf');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    const newFile: ProjectFileItem = {
      id: `f-${Date.now()}`,
      name: fileName.endsWith(`.${ext}`) ? fileName : `${fileName}.${ext}`,
      fileType: ext === 'md' ? 'text' : ext === 'pdf' ? 'readonly' : 'binary',
      size: Math.floor(Math.random() * 5000000) + 500000,
      versionRef: 'v2.0.0-rc',
      readonly: ext === 'pdf',
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      category,
      badge: badge.trim() || undefined,
      description: desc.trim() || '团队上传的重要答辩佐证资产',
      author: '项目组成员',
      ext,
      tags: [category, '新上传']
    };

    onUploadSuccess(newFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">登记与上传申报材料</h3>
              <p className="text-xs text-slate-500">纳入项目多模态材料库，支持在中栏直接调取检视</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              材料文件名称 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例如：产线联合概念验证协议书(POC)"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">材料归属分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="核心申报书">核心申报书</option>
                <option value="用户调研">用户调研</option>
                <option value="核心技术">核心技术</option>
                <option value="路演答辩">路演答辩</option>
                <option value="演示多媒体">演示多媒体</option>
                <option value="佐证材料">佐证材料</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">文件格式 / 扩展名</label>
              <select
                value={ext}
                onChange={(e) => setExt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="pdf">PDF (盖章凭证/报告)</option>
                <option value="pptx">PPTX (幻灯片演示)</option>
                <option value="mp4">MP4 (视频/实录)</option>
                <option value="xlsx">XLSX (财务模型表)</option>
                <option value="md">Markdown (文本正本)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">高光印章/标签（可选）</label>
            <input
              type="text"
              placeholder="例如：上市龙头盖章 / CNAS权威背书 / 已授权发明专利"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">佐证价值说明</label>
            <textarea
              rows={3}
              placeholder="简要描述本材料用于击碎评委哪个疑虑（如真实性、技术壁垒、商业转化等）"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer font-medium flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              确认入库
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =================== 3. Create Todo Modal ===================
interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTodo: (newTodo: GuidanceTodoItem) => void;
}

export const GuidanceCreateTodoModal: React.FC<CreateTodoModalProps> = ({
  isOpen,
  onClose,
  onCreateTodo,
}) => {
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState('L4');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [assignee, setAssignee] = useState('李林峰');
  const [chapterRef, setChapterRef] = useState('第5章 竞争分析');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo: GuidanceTodoItem = {
      id: `td-${Date.now()}`,
      title: title.trim(),
      stage,
      completed: false,
      priority,
      assignee,
      chapterRef,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
    };

    onCreateTodo(newTodo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">新建阶段推进待办</h3>
              <p className="text-xs text-slate-500">为团队成员下发针对性优化动作</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              待办任务描述 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例如：在BP第5章补全大厂迁移停机成本测算表"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">对应旅程阶段</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="L1">L1 创意激发</option>
                <option value="L2">L2 可行性验证</option>
                <option value="L3">L3 材料成型</option>
                <option value="L4">L4 打磨优化</option>
                <option value="L5">L5 路演成型</option>
                <option value="L6">L6 赛前冲刺</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">优先级</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="high">高优先级 (紧急)</option>
                <option value="medium">中优先级 (标准)</option>
                <option value="low">低优先级 (补充)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">责任人</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">关联章节/环节</label>
              <input
                type="text"
                value={chapterRef}
                onChange={(e) => setChapterRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer font-medium"
            >
              立即下发
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
