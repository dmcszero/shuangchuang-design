import React, { useState, useRef } from 'react';
import { 
  Database, 
  FolderPlus, 
  Search, 
  CheckCircle2, 
  UploadCloud, 
  Trash2, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  FileCode, 
  Eye, 
  Sparkles, 
  X, 
  Layers, 
  ChevronRight, 
  ArrowLeft,
  RefreshCw, 
  FolderOpen,
  SlidersHorizontal,
  Users,
  HardDrive,
  Cpu,
  Globe2,
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { KnowledgeBase, KnowledgeBaseFile } from '../data/mockKnowledgeBase';
import { MOCK_PLATFORM_KNOWLEDGE_BASES } from '../data/mockPlatformKnowledgeBase';

export default function PlatformKnowledgeBaseManagement() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(MOCK_PLATFORM_KNOWLEDGE_BASES);
  
  // View level state: 'list' (Level 1: All Platform KBs) | 'detail' (Level 2: Files in selected KB)
  const [viewLevel, setViewLevel] = useState<'list' | 'detail'>('list');
  const [selectedKbId, setSelectedKbId] = useState<string>(knowledgeBases[0]?.id || 'pkb-rules-2026');

  // Level 1 search & filters
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Level 2 search & filters (files in selected KB)
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');

  // Modals
  const [isCreateKbModalOpen, setIsCreateKbModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<KnowledgeBaseFile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New KB Form state
  const [newKbName, setNewKbName] = useState('');
  const [newKbCategory, setNewKbCategory] = useState<KnowledgeBase['category']>('competition_rules');
  const [newKbDescription, setNewKbDescription] = useState('');
  const [newKbAudience, setNewKbAudience] = useState('全平台各入驻高校与指导专家');

  // New File Upload Form state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState<KnowledgeBaseFile['fileType']>('pdf');
  const [uploadFileSize, setUploadFileSize] = useState('3.2 MB');
  const [uploadFileSummary, setUploadFileSummary] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Currently selected KB object
  const currentKb = knowledgeBases.find(kb => kb.id === selectedKbId) || knowledgeBases[0];

  // Navigate to Level 2 (File Management for specific KB)
  const handleEnterKbFiles = (kbId: string) => {
    setSelectedKbId(kbId);
    setFileSearchQuery('');
    setFileTypeFilter('all');
    setViewLevel('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate back to Level 1 (Overall KB List)
  const handleBackToKbList = () => {
    setViewLevel('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle KB Status (Enable / Disable)
  const handleToggleKbStatus = (kbId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setKnowledgeBases(prev => prev.map(kb => {
      if (kb.id === kbId) {
        const nextEnabled = !kb.enabled;
        const action = nextEnabled ? '已启用' : '已停用';
        showToast(`${action}平台知识库【${kb.name}】，${nextEnabled ? '全平台各入驻高校及AI大模型即刻恢复检索调用' : '已对全平台暂停挂载'}`);
        return {
          ...kb,
          enabled: nextEnabled,
          status: nextEnabled ? 'ready' : 'disabled'
        };
      }
      return kb;
    }));
  };

  // Create Knowledge Base
  const handleCreateKnowledgeBase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbName.trim()) return;

    const categoryLabels: Record<KnowledgeBase['category'], string> = {
      competition_rules: '官方规程要则',
      gold_cases: '国赛金奖全案',
      expert_experience: '评委洞察与题库',
      school_policy: '国家部委法规',
      opc_incubation: '全国产业资本'
    };

    const newKb: KnowledgeBase = {
      id: `pkb-custom-${Date.now().toString().slice(-4)}`,
      name: newKbName.trim(),
      code: `PKB-${Date.now().toString().slice(-4)}`,
      category: newKbCategory,
      categoryLabel: categoryLabels[newKbCategory] || '平台赛事智库',
      description: newKbDescription.trim() || '全平台通用大赛赛事知识库，面向各入驻高校提供统一权威规程与大模型RAG标准源。',
      enabled: true,
      fileCount: 0,
      totalSize: '0.0 MB',
      chunkCount: 0,
      embeddingModel: '全国统考规则专用嵌入解析引擎',
      audience: newKbAudience,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'ready',
      files: []
    };

    setKnowledgeBases([newKb, ...knowledgeBases]);
    setSelectedKbId(newKb.id);
    setIsCreateKbModalOpen(false);
    setNewKbName('');
    setNewKbDescription('');
    showToast(`成功创建平台赛事知识库【${newKb.name}】！已直接进入该库文件管理。`);
    setViewLevel('detail');
  };

  // Delete Knowledge Base
  const handleDeleteKnowledgeBase = (kbId: string, kbName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`确认从平台赛事知识库删除【${kbName}】吗？删除后全平台各高校调用将同步失效。`)) {
      const remaining = knowledgeBases.filter(kb => kb.id !== kbId);
      setKnowledgeBases(remaining);
      if (selectedKbId === kbId) {
        if (remaining.length > 0) {
          setSelectedKbId(remaining[0].id);
        }
        setViewLevel('list');
      }
      showToast(`已删除平台赛事知识库【${kbName}】`);
    }
  };

  // Handle File Upload
  const handleUploadFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const estimatedChunks = Math.floor(80 + Math.random() * 180);
      const newFile: KnowledgeBaseFile = {
        id: `pf-${Date.now().toString().slice(-6)}`,
        name: uploadFileName.trim().endsWith(`.${uploadFileType}`) 
          ? uploadFileName.trim() 
          : `${uploadFileName.trim()}.${uploadFileType}`,
        fileType: uploadFileType,
        size: uploadFileSize || '3.0 MB',
        sizeBytes: 3145728,
        uploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        uploader: '国家赛事秘书处 (总控管理员)',
        chunks: estimatedChunks,
        status: 'indexed',
        summary: uploadFileSummary.trim() || '文档已完成全国级知识标引与文本切片，注入中央知识库供全平台赛事AI引擎调用。',
        hitCount: 0
      };

      setKnowledgeBases(prev => prev.map(kb => {
        if (kb.id === currentKb.id) {
          const updatedFiles = [newFile, ...kb.files];
          const newChunkCount = kb.chunkCount + estimatedChunks;
          const currentMb = parseFloat(kb.totalSize) || 0;
          const addedMb = parseFloat(newFile.size) || 2.0;
          return {
            ...kb,
            files: updatedFiles,
            fileCount: updatedFiles.length,
            totalSize: `${(currentMb + addedMb).toFixed(1)} MB`,
            chunkCount: newChunkCount,
            updatedAt: '刚刚'
          };
        }
        return kb;
      }));

      setIsUploading(false);
      setIsUploadFileModalOpen(false);
      setUploadFileName('');
      setUploadFileSummary('');
      showToast(`平台赛事文件【${newFile.name}】已成功发布入库（切片知识点：${estimatedChunks} 条）！`);
    }, 600);
  };

  // Handle Delete File
  const handleDeleteFile = (fileId: string, fileName: string) => {
    if (confirm(`确认从平台知识库下架文件【${fileName}】吗？`)) {
      setKnowledgeBases(prev => prev.map(kb => {
        if (kb.id === currentKb.id) {
          const targetFile = kb.files.find(f => f.id === fileId);
          const updatedFiles = kb.files.filter(f => f.id !== fileId);
          const chunkReduction = targetFile ? targetFile.chunks : 0;
          const currentMb = parseFloat(kb.totalSize) || 0;
          const reducedMb = targetFile ? parseFloat(targetFile.size) || 1.0 : 0;
          const newSize = Math.max(0, currentMb - reducedMb).toFixed(1);

          return {
            ...kb,
            files: updatedFiles,
            fileCount: updatedFiles.length,
            chunkCount: Math.max(0, kb.chunkCount - chunkReduction),
            totalSize: `${newSize} MB`,
            updatedAt: '刚刚'
          };
        }
        return kb;
      }));

      showToast(`已从平台赛事知识库删除文件【${fileName}】`);
    }
  };

  // Filtered Knowledge Bases (Level 1)
  const filteredKbs = knowledgeBases.filter(kb => {
    const matchesSearch = kb.name.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
                          kb.description.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
                          kb.code.toLowerCase().includes(kbSearchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || kb.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'enabled' ? kb.enabled : !kb.enabled);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filtered Files in Current Knowledge Base (Level 2)
  const filteredFiles = (currentKb?.files || []).filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
                          f.summary.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
                          f.uploader.toLowerCase().includes(fileSearchQuery.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || f.fileType === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  // Macro Metrics across all platform knowledge bases
  const totalBases = knowledgeBases.length;
  const activeBases = knowledgeBases.filter(k => k.enabled).length;
  const totalFiles = knowledgeBases.reduce((acc, k) => acc + k.files.length, 0);
  const totalChunks = knowledgeBases.reduce((acc, k) => acc + k.chunkCount, 0);
  const totalHits = knowledgeBases.reduce((acc, k) => 
    acc + k.files.reduce((fAcc, f) => fAcc + f.hitCount, 0), 0
  );

  const getFileIcon = (fileType: KnowledgeBaseFile['fileType']) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-rose-500 shrink-0" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-sky-600 shrink-0" />;
      case 'pptx':
        return <Presentation className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />;
      default:
        return <FileCode className="h-5 w-5 text-indigo-500 shrink-0" />;
    }
  };

  const getCategoryBadgeClass = (category: KnowledgeBase['category']) => {
    switch (category) {
      case 'competition_rules':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'gold_cases':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'expert_experience':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'school_policy':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div id="platform-knowledge-base-module" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 1 VIEW: 平台赛事知识库整体列表 (Platform Knowledge Bases Overview) */}
      {/* ========================================================================= */}
      {viewLevel === 'list' && (
        <div className="space-y-6">
          {/* Header & Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">平台赛事知识库管理</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <Globe2 className="h-3 w-3" />
                  <span>中央总控 · 全平台通用</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                统一维护和发布2026大赛全国统考官方规程、近五年国赛金奖标杆全案、百位评委实战追问题库及中央政策法规。本模块数据独立于各高校本校私有智库，作为底层标准供给全平台。
              </p>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                id="btn-create-platform-kb"
                onClick={() => setIsCreateKbModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition cursor-pointer"
              >
                <FolderPlus className="h-4 w-4 mr-1.5" />
                新建平台赛事知识库
              </button>
            </div>
          </div>

          {/* Macro Metrics Overview Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">平台赛事库总数</span>
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                  <Database className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1.5">{totalBases} <span className="text-xs font-normal text-slate-400">个中央库</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">面向全部入驻高校下发</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">全网分发启用状态</span>
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-700 mt-1.5">{activeBases} <span className="text-xs font-normal text-slate-400">/ {totalBases} 启用</span></div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">全平台各高校即时同步</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">官方权威标杆文档</span>
                <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-sky-700 mt-1.5">{totalFiles} <span className="text-xs font-normal text-slate-400">份</span></div>
              <div className="text-[11px] text-sky-600 mt-0.5">红头方案 / 金奖PPT / 答辩题</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">全国统一标准切片</span>
                <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-700 mt-1.5">{totalChunks.toLocaleString()} <span className="text-xs font-normal text-slate-400">条</span></div>
              <div className="text-[11px] text-purple-600 mt-0.5">全国统考指标特征向量</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">全网各校累计调阅</span>
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                  <Cpu className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-700 mt-1.5">{totalHits.toLocaleString()} <span className="text-xs font-normal text-slate-400">次命中</span></div>
              <div className="text-[11px] text-amber-600 mt-0.5">支撑数智教练与初筛</div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search box */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索平台赛事知识库名称、代码或摘要..."
                  value={kbSearchQuery}
                  onChange={(e) => setKbSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2.5 w-full sm:w-auto overflow-x-auto">
                <div className="flex items-center space-x-1.5 shrink-0">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">分类:</span>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="all">全部分类</option>
                  <option value="competition_rules">官方规程要则</option>
                  <option value="gold_cases">国赛金奖全案</option>
                  <option value="expert_experience">评委洞察与题库</option>
                  <option value="school_policy">国家部委法规</option>
                  <option value="opc_incubation">全国产业资本</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="all">全部状态</option>
                  <option value="enabled">分发启用中</option>
                  <option value="disabled">已暂停分发</option>
                </select>
              </div>
            </div>
          </div>

          {/* Platform Knowledge Base Cards Grid */}
          {filteredKbs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Database className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">未找到匹配的平台赛事知识库</h3>
              <p className="text-xs text-slate-500 mt-1">请尝试修改搜索词或重置分类筛选条件</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKbs.map((kb) => (
                <div
                  key={kb.id}
                  onClick={() => handleEnterKbFiles(kb.id)}
                  className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                    kb.enabled 
                      ? 'border-slate-200 hover:border-sky-300' 
                      : 'border-slate-200 bg-slate-50/70 opacity-80'
                  }`}
                >
                  {/* Top Status Accent Line */}
                  <div className={`h-1 w-full ${kb.enabled ? 'bg-sky-500 group-hover:bg-sky-600' : 'bg-slate-300'}`} />

                  <div className="p-5 space-y-3.5 flex-1">
                    {/* Header line: category badge + code + enable toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCategoryBadgeClass(kb.category)}`}>
                          {kb.categoryLabel}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {kb.code}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5" onClick={e => e.stopPropagation()}>
                        <span className={`text-[11px] font-medium ${kb.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {kb.enabled ? '全网分发中' : '已暂停'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleKbStatus(kb.id, e)}
                          className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            kb.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              kb.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Title and description */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {kb.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed h-8">
                        {kb.description}
                      </p>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400">官方文件</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{kb.fileCount} 篇</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">知识切片</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{kb.chunkCount} 条</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">总容量</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{kb.totalSize}</div>
                      </div>
                    </div>

                    {/* Meta info: audience & update */}
                    <div className="space-y-1 text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1 truncate">
                        <Globe2 className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">受众范围: {kb.audience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-sky-500 shrink-0" />
                        <span className="truncate text-slate-600">模型基底: {kb.embeddingModel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      更新于: {kb.updatedAt}
                    </span>

                    <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                      <button
                        title="删除该平台赛事库"
                        onClick={(e) => handleDeleteKnowledgeBase(kb.id, kb.name, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleEnterKbFiles(kb.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-sky-600 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-lg transition group-hover:bg-sky-600 group-hover:text-white cursor-pointer"
                      >
                        <span>管理权威文件</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2 VIEW: 单个平台知识库内部文件管理 (Files in Selected Platform KB) */}
      {/* ========================================================================= */}
      {viewLevel === 'detail' && currentKb && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-200">
          {/* Top Breadcrumbs & Back Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={handleBackToKbList}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                返回平台赛事知识库列表
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">中央赛事知识库</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                {currentKb.name}
              </span>
            </div>

            <button
              onClick={() => setIsUploadFileModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 mr-1.5" />
              发布新文件到此库
            </button>
          </div>

          {/* Current Knowledge Base Profile Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                    {currentKb.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getCategoryBadgeClass(currentKb.category)}`}>
                    {currentKb.categoryLabel}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    currentKb.enabled 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentKb.enabled ? '全网实时分发中' : '已暂停调用'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">{currentKb.name}</h2>
                <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">{currentKb.description}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={(e) => handleToggleKbStatus(currentKb.id, e)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    currentKb.enabled
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {currentKb.enabled ? '暂停全网分发' : '恢复全网分发'}
                </button>
              </div>
            </div>

            {/* Quick stats strip inside KB */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-sky-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">库内文档</span>
                  <span className="font-bold text-slate-800">{currentKb.files.length} 篇</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">存储容量</span>
                  <span className="font-bold text-slate-800">{currentKb.totalSize}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">标准切片数</span>
                  <span className="font-bold text-slate-800">{currentKb.chunkCount} 条要点</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Globe2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">全网分发受众</span>
                  <span className="font-bold text-slate-800 truncate max-w-[130px] block">{currentKb.audience}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Files Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索库内文件名称、内容提要或上传部门..."
                value={fileSearchQuery}
                onChange={(e) => setFileSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">格式过滤:</span>
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                <option value="all">全部格式</option>
                <option value="pdf">PDF 电子文档</option>
                <option value="docx">Word 文本</option>
                <option value="pptx">PowerPoint 演示</option>
                <option value="xlsx">Excel 数据表</option>
              </select>
            </div>
          </div>

          {/* Files Table List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-4 w-4 text-sky-600" />
                <span className="font-bold text-xs text-slate-800">
                  知识库文档列表 ({filteredFiles.length} 篇)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                支持 PDF、Word、PPT、Excel 格式解析与向量索引
              </span>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2.5" />
                <p className="text-xs">暂无符合条件的赛事文档，点击右上角“发布新文件”进行入库</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-2.5 font-semibold">文档名称与摘要</th>
                      <th className="px-3 py-2.5 font-semibold text-center">格式/大小</th>
                      <th className="px-3 py-2.5 font-semibold text-center">知识要点切片</th>
                      <th className="px-3 py-2.5 font-semibold text-center">全网调阅命中</th>
                      <th className="px-3 py-2.5 font-semibold">上传机构 / 日期</th>
                      <th className="px-4 py-2.5 font-semibold text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3 max-w-md">
                          <div className="flex items-start space-x-2.5">
                            {getFileIcon(file.fileType)}
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer block truncate" title={file.name}>
                                {file.name}
                              </span>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1" title={file.summary}>
                                {file.summary}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="font-mono text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {file.fileType}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{file.size}</span>
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full text-[11px] font-medium border border-sky-100">
                            <Sparkles className="h-3 w-3" />
                            <span>{file.chunks} 块</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">已索引完毕</span>
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="font-bold text-amber-700 font-mono text-xs">{file.hitCount.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block">次引用</span>
                        </td>

                        <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                          <div className="font-medium text-slate-700 text-xs">{file.uploader}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{file.uploadedAt}</div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="px-2 py-1 text-xs text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded transition flex items-center space-x-1"
                              title="预览文档解析"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>解析快照</span>
                            </button>

                            <button
                              onClick={() => handleDeleteFile(file.id, file.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                              title="从平台赛事库删除"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: 新建平台赛事知识库 (Create Platform KB Modal) */}
      {/* ========================================================================= */}
      {isCreateKbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">新建平台赛事知识库</h3>
                  <p className="text-[11px] text-slate-500">统一面向全平台入驻高校发布通用赛道规范与智库标准</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateKbModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKnowledgeBase} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">知识库名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：2026中国国际大学生创新大赛国际赛道评审要则与项目池"
                  value={newKbName}
                  onChange={e => setNewKbName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">业务分类 *</label>
                  <select
                    value={newKbCategory}
                    onChange={e => setNewKbCategory(e.target.value as KnowledgeBase['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                  >
                    <option value="competition_rules">官方规程要则 (通知与打分表)</option>
                    <option value="gold_cases">国赛金奖全案 (脱敏BP与PPT)</option>
                    <option value="expert_experience">评委洞察与题库 (压力测试质询)</option>
                    <option value="school_policy">国家部委法规 (成果转化与税收)</option>
                    <option value="opc_incubation">全国产业资本 (直投通道与采购)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">面向受众范围 *</label>
                  <input
                    type="text"
                    value={newKbAudience}
                    onChange={e => setNewKbAudience(e.target.value)}
                    placeholder="如：全平台入驻高校与指导专家"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">知识库定位与详细描述</label>
                <textarea
                  rows={3}
                  value={newKbDescription}
                  onChange={e => setNewKbDescription(e.target.value)}
                  placeholder="说明此知识库所涵盖的官方规程、入库范围及与赛道备战的对标逻辑..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateKbModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-xs"
                >
                  确认创建并进入管理
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 发布新文件到平台知识库 (Upload File Modal) */}
      {/* ========================================================================= */}
      {isUploadFileModalOpen && currentKb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">发布权威赛事文件</h3>
                  <p className="text-[11px] text-slate-500">归入平台知识库：{currentKb.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadFileModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadFileSubmit} className="p-6 space-y-4 text-xs">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
              >
                <UploadCloud className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-700">点击选择本地文档或将文件拖拽至此处</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  单文件上限 100MB，系统将自动完成全国统考知识特征标引与向量切片
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadFileName(file.name.replace(/\.[^/.]+$/, ''));
                      const ext = file.name.split('.').pop()?.toLowerCase();
                      if (ext === 'pdf' || ext === 'docx' || ext === 'pptx' || ext === 'xlsx' || ext === 'txt' || ext === 'md') {
                        setUploadFileType(ext as KnowledgeBaseFile['fileType']);
                      }
                      setUploadFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">文件名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：《2026年中国国际大学生创新大赛产教融合赋分标准》"
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">文档格式 *</label>
                  <select
                    value={uploadFileType}
                    onChange={e => setUploadFileType(e.target.value as KnowledgeBaseFile['fileType'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                  >
                    <option value="pdf">PDF 电子文档 (*.pdf)</option>
                    <option value="docx">Word 文档 (*.docx)</option>
                    <option value="pptx">PowerPoint 幻灯片 (*.pptx)</option>
                    <option value="xlsx">Excel 表格 (*.xlsx)</option>
                    <option value="md">Markdown 结构文档 (*.md)</option>
                    <option value="txt">纯文本文件 (*.txt)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">文件预估大小</label>
                  <input
                    type="text"
                    value={uploadFileSize}
                    onChange={e => setUploadFileSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">核心摘要说明与主要观点</label>
                <textarea
                  rows={2}
                  value={uploadFileSummary}
                  onChange={e => setUploadFileSummary(e.target.value)}
                  placeholder="概述文档的核心要领，便于全平台AI对标初筛及大模型问答引用..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadFileModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>正在抽取切片与索引...</span>
                    </>
                  ) : (
                    <span>立即解析并入库</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 文件解析快照与向量切片预览 (Preview File Modal) */}
      {/* ========================================================================= */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  {getFileIcon(previewFile.fileType)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">{previewFile.name}</h3>
                  <p className="text-[11px] text-slate-500">平台权威赛事文档解析快照与向量切片</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewFile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-700 flex items-center space-x-1.5">
                  <FileText className="h-3.5 w-3.5 text-sky-600" />
                  <span>核心内容摘要（由AI语义解析生成）</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{previewFile.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">生成知识点切片</span>
                  <span className="font-bold text-sky-700 text-sm">{previewFile.chunks} 块</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">全平台累计调阅</span>
                  <span className="font-bold text-amber-700 text-sm">{previewFile.hitCount.toLocaleString()} 次</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">文件大小</span>
                  <span className="font-bold text-slate-800 text-sm font-mono">{previewFile.size}</span>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>部分提取的结构化赛事知识要点样本</span>
                  <span className="text-[10px] text-slate-400 font-mono">Top 3 of {previewFile.chunks}</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-sky-50/50 rounded-lg border border-sky-100 text-slate-700 leading-relaxed font-mono text-[11px]">
                    <span className="font-bold text-sky-700">#01 [赋分权衡]:</span> 严格防范将导师既有科研课题或企业生产线现成项目无偿包装为学生创新创业成果，评审需核验学生团队为第一发明人或软件著作权归属证书。
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
                    <span className="font-bold text-slate-800">#02 [商业验证]:</span> 商业计划书财务模型应具备清晰的单位经济学拆解（如客单价、复购率、B端采购周期），禁止单纯以行业总市场份额百分比推算营收。
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
                    <span className="font-bold text-slate-800">#03 [育人导向]:</span> 强化新工科、新医科、新农科、新文科建设导向，答辩重点考核学生团队在攻坚克难中的专业技术成长与商业领导力蜕变。
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                发布机构：{previewFile.uploader} · {previewFile.uploadedAt}
              </span>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
