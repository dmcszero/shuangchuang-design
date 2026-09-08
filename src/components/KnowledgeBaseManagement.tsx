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
  Cpu
} from 'lucide-react';
import { KnowledgeBase, KnowledgeBaseFile, MOCK_KNOWLEDGE_BASES } from '../data/mockKnowledgeBase';

export default function KnowledgeBaseManagement() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(MOCK_KNOWLEDGE_BASES);
  
  // View level state: 'list' (Level 1: All KBs) | 'detail' (Level 2: Files in selected KB)
  const [viewLevel, setViewLevel] = useState<'list' | 'detail'>('list');
  const [selectedKbId, setSelectedKbId] = useState<string>(knowledgeBases[0]?.id || 'kb-policy');

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
  const [newKbCategory, setNewKbCategory] = useState<KnowledgeBase['category']>('school_policy');
  const [newKbDescription, setNewKbDescription] = useState('');
  const [newKbAudience, setNewKbAudience] = useState('全校参赛团队与指导教师');

  // New File Upload Form state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState<KnowledgeBaseFile['fileType']>('pdf');
  const [uploadFileSize, setUploadFileSize] = useState('2.5 MB');
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
        showToast(`${action}知识库【${kb.name}】，${nextEnabled ? 'AI大模型与智能备赛教练即刻恢复检索调用' : 'AI检索问答已暂停挂载此库'}`);
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
      school_policy: '校内专属智库',
      competition_rules: '2026大赛规程',
      gold_cases: '历史金奖案例',
      expert_experience: '专家经验智库',
      opc_incubation: 'OPC孵化转化'
    };

    const newKb: KnowledgeBase = {
      id: `kb-custom-${Date.now().toString().slice(-4)}`,
      name: newKbName.trim(),
      code: `KB-${Date.now().toString().slice(-4)}`,
      category: newKbCategory,
      categoryLabel: categoryLabels[newKbCategory],
      description: newKbDescription.trim() || '本校自主配置的特色双创与赛事知识库，支撑专属RAG语义索引。',
      enabled: true,
      fileCount: 0,
      totalSize: '0.0 MB',
      chunkCount: 0,
      embeddingModel: '智能语义解析与特征索引引擎',
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
    showToast(`成功创建专属知识库【${newKb.name}】！已直接进入该库文件管理。`);
    // Enter into the newly created KB's file management view
    setViewLevel('detail');
  };

  // Delete Knowledge Base
  const handleDeleteKnowledgeBase = (kbId: string, kbName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`确认删除知识库【${kbName}】吗？删除后其所包含的所有文档与知识索引将被彻底移除。`)) {
      const remaining = knowledgeBases.filter(kb => kb.id !== kbId);
      setKnowledgeBases(remaining);
      if (selectedKbId === kbId) {
        if (remaining.length > 0) {
          setSelectedKbId(remaining[0].id);
        }
        setViewLevel('list');
      }
      showToast(`已删除知识库【${kbName}】`);
    }
  };

  // Handle File Upload
  const handleUploadFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const estimatedChunks = Math.floor(60 + Math.random() * 150);
      const newFile: KnowledgeBaseFile = {
        id: `f-${Date.now().toString().slice(-6)}`,
        name: uploadFileName.trim().endsWith(`.${uploadFileType}`) 
          ? uploadFileName.trim() 
          : `${uploadFileName.trim()}.${uploadFileType}`,
        fileType: uploadFileType,
        size: uploadFileSize || '2.4 MB',
        sizeBytes: 2500000,
        uploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        uploader: '陈建国 (校管理员)',
        chunks: estimatedChunks,
        status: 'indexed',
        summary: uploadFileSummary.trim() || '文档已由AI自动解析、完成文本清洗并注入校内专属知识库，可被智能问答与初筛引擎实时检索引用。',
        hitCount: 0
      };

      setKnowledgeBases(prev => prev.map(kb => {
        if (kb.id === currentKb.id) {
          const updatedFiles = [newFile, ...kb.files];
          const newChunkCount = kb.chunkCount + estimatedChunks;
          const currentMb = parseFloat(kb.totalSize) || 0;
          const addedMb = parseFloat(newFile.size) || 1.5;
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
      showToast(`文件【${newFile.name}】已成功上传并完成结构化知识解析（提取 ${estimatedChunks} 条核心知识要点）！`);
    }, 600);
  };

  // Handle Delete File
  const handleDeleteFile = (fileId: string, fileName: string) => {
    if (confirm(`确认从当前知识库删除文件【${fileName}】吗？对应文档知识内容将从AI检索库中清除。`)) {
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

      showToast(`已从知识库删除文件【${fileName}】`);
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

  // Macro Metrics across all knowledge bases
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
      case 'school_policy':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'competition_rules':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'gold_cases':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'expert_experience':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div id="knowledge-base-module" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 1 VIEW: 知识库整体列表与管理 (Knowledge Bases Overview & Management) */}
      {/* ========================================================================= */}
      {viewLevel === 'list' && (
        <div className="space-y-6">
          {/* Header & Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">学校双创知识库管理</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  校内专属智库 (RAG底层)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                统一管理学校双创扶持政策、2026大赛官方规则、历届金奖案例及专家经验。点击任意知识库卡片可进入二级页面进行库内文档精细化管理。
              </p>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                id="btn-create-kb"
                onClick={() => setIsCreateKbModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition cursor-pointer"
              >
                <FolderPlus className="h-4 w-4 mr-1.5" />
                新建专属知识库
              </button>
            </div>
          </div>

          {/* Macro Metrics Overview Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">全校知识库总数</span>
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                  <Database className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1.5">{totalBases} <span className="text-xs font-normal text-slate-400">个库</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">涵盖 5 大核心赛事分类</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">实时运行启用库</span>
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-700 mt-1.5">{activeBases} <span className="text-xs font-normal text-slate-400">/ {totalBases} 启用</span></div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">大模型 RAG 引擎实时挂载</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">已解析沉淀文档</span>
                <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-sky-700 mt-1.5">{totalFiles} <span className="text-xs font-normal text-slate-400">份</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">红头文件、获奖BP与答辩纪要</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">结构化知识要点</span>
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-indigo-700 mt-1.5">{totalChunks.toLocaleString()} <span className="text-xs font-normal text-slate-400">条</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">深度提炼与多维度语义匹配</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">AI 问答调用总频次</span>
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-700 mt-1.5">{totalHits.toLocaleString()} <span className="text-xs font-normal text-slate-400">次</span></div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">7×24h 备赛答疑与对标赋能</div>
            </div>
          </div>

          {/* Level 1 Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索知识库名称、编码、职能定位..."
                value={kbSearchQuery}
                onChange={e => setKbSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                <span>分类：</span>
              </div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-xs"
              >
                <option value="all">全部分类 (全部 5 类)</option>
                <option value="school_policy">校内专属智库</option>
                <option value="competition_rules">2026大赛规程</option>
                <option value="gold_cases">历史金奖案例</option>
                <option value="expert_experience">专家经验智库</option>
                <option value="opc_incubation">OPC孵化转化</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-xs"
              >
                <option value="all">全部启用状态</option>
                <option value="enabled">仅看已启用 (Active)</option>
                <option value="disabled">仅看已停用 (Disabled)</option>
              </select>
            </div>
          </div>

          {/* Knowledge Bases Grid Display */}
          {filteredKbs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              <FolderOpen className="h-10 w-10 text-slate-300 mx-auto mb-2.5 stroke-1" />
              <div className="text-sm font-semibold text-slate-600">未找到符合条件的知识库</div>
              <div className="mt-1">请尝试清除搜索关键词或调整分类与状态筛选条件</div>
              <button
                onClick={() => { setKbSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                className="mt-3 px-3 py-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium bg-sky-50 hover:bg-sky-100 rounded-lg transition"
              >
                重置所有筛选
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredKbs.map(kb => (
                <div
                  key={kb.id}
                  id={`kb-card-${kb.id}`}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group overflow-hidden"
                >
                  {/* Card Header & Content */}
                  <div className="p-5">
                    {/* Top Row: Category tag, Code & Enable Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold shrink-0">
                          {kb.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${getCategoryBadgeClass(kb.category)}`}>
                          {kb.categoryLabel}
                        </span>
                      </div>

                      {/* Enable/Disable Toggle Pill */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleKbStatus(kb.id, e)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition shrink-0 cursor-pointer ${
                          kb.enabled 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title={kb.enabled ? '点击暂停此知识库调用' : '点击启用此知识库调用'}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${kb.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{kb.enabled ? '运行中' : '已停用'}</span>
                      </button>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => handleEnterKbFiles(kb.id)}
                      className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition cursor-pointer leading-snug"
                    >
                      {kb.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {kb.description}
                    </p>

                    {/* Sub-metrics info grid */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50/70 p-2.5 rounded-lg">
                      <div>
                        <div className="text-[10px] text-slate-400">文档数量</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{kb.files.length} <span className="text-[10px] font-normal text-slate-400">份</span></div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">知识要点</div>
                        <div className="text-xs font-bold text-indigo-700 mt-0.5">{kb.chunkCount} <span className="text-[10px] font-normal text-slate-400">条</span></div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">存储空间</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{kb.totalSize}</div>
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="mt-3 flex items-center text-[11px] text-slate-400 truncate">
                      <Users className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
                      <span className="truncate">受众：{kb.audience}</span>
                    </div>
                  </div>

                  {/* Card Footer: Enter Files Management CTA & Action Buttons */}
                  <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      更新于 {kb.updatedAt}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDeleteKnowledgeBase(kb.id, kb.name, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="删除该知识库"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleEnterKbFiles(kb.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-sky-600 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-lg transition group-hover:bg-sky-600 group-hover:text-white cursor-pointer"
                      >
                        <span>管理库内文件</span>
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
      {/* LEVEL 2 VIEW: 单个知识库内部文件管理 (Files Management in Selected KB) */}
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
                返回知识库列表
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">双创知识库总览</span>
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
              上传新文件到此库
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
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    currentKb.enabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {currentKb.enabled ? '● 运行中 (RAG正常调用)' : '○ 已停用 (暂停AI调用)'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  {currentKb.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-4xl">
                  {currentKb.description}
                </p>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleToggleKbStatus(currentKb.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition inline-flex items-center cursor-pointer ${
                    currentKb.enabled
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
                  }`}
                >
                  {currentKb.enabled ? '停用此库' : '立即启用'}
                </button>

                <button
                  onClick={(e) => handleDeleteKnowledgeBase(currentKb.id, currentKb.name, e)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition cursor-pointer"
                >
                  删除知识库
                </button>
              </div>
            </div>

            {/* Spec & Attributes Bar */}
            <div className="pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] flex items-center">
                  <Cpu className="h-3 w-3 mr-1 text-slate-400" />
                  AI 语义解析引擎
                </span>
                <span className="font-semibold text-slate-800 text-[11px] truncate block mt-0.5">
                  智能语义解析与特征索引引擎
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-slate-400" />
                  入库文档总数
                </span>
                <span className="font-semibold text-sky-700 text-[11px] block mt-0.5">
                  {currentKb.files.length} 份文件
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] flex items-center">
                  <Layers className="h-3 w-3 mr-1 text-slate-400" />
                  提炼知识要点
                </span>
                <span className="font-semibold text-indigo-700 text-[11px] block mt-0.5">
                  {currentKb.chunkCount} 条核心知识要点
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] flex items-center">
                  <HardDrive className="h-3 w-3 mr-1 text-slate-400" />
                  累计存储占用
                </span>
                <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">
                  {currentKb.totalSize}
                </span>
              </div>
            </div>
          </div>

          {/* Files List Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Filter & Search Bar for Files */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={`在【${currentKb.name}】中搜索文档名称、关键词摘要、上传人...`}
                  value={fileSearchQuery}
                  onChange={e => setFileSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center space-x-2.5 shrink-0 text-xs">
                <span className="text-slate-400">格式：</span>
                <select
                  value={fileTypeFilter}
                  onChange={e => setFileTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs"
                >
                  <option value="all">全部格式 (*.*)</option>
                  <option value="pdf">PDF 文档 (*.pdf)</option>
                  <option value="docx">Word 文档 (*.docx)</option>
                  <option value="pptx">PowerPoint (*.pptx)</option>
                  <option value="xlsx">Excel 表格 (*.xlsx)</option>
                  <option value="md">Markdown / 文本</option>
                </select>

                <button
                  onClick={() => showToast(`已刷新【${currentKb.name}】的最新智能知识库索引`)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs flex items-center cursor-pointer transition"
                  title="刷新索引"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  刷新索引
                </button>
              </div>
            </div>

            {/* Document Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">文档名称 / 解析要点</th>
                    <th className="py-3 px-3">格式与大小</th>
                    <th className="py-3 px-3">提炼知识要点</th>
                    <th className="py-3 px-3">RAG 检索命中</th>
                    <th className="py-3 px-3">上传人 / 录入时间</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-slate-400">
                        <FolderOpen className="h-10 w-10 mx-auto mb-2 text-slate-300 stroke-1" />
                        <div className="font-semibold text-slate-600">该知识库暂未上传文档或未匹配到文件</div>
                        <div className="text-[11px] mt-1">支持上传 PDF、Word、PPTX、Excel 与 Markdown 格式文件</div>
                        <button
                          onClick={() => setIsUploadFileModalOpen(true)}
                          className="mt-3 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold inline-flex items-center"
                        >
                          <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
                          上传第一份文件
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map(file => (
                      <tr key={file.id} className="hover:bg-slate-50/80 transition">
                        {/* File Name & Format */}
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">{getFileIcon(file.fileType)}</div>
                            <div>
                              <div 
                                className="font-semibold text-slate-900 hover:text-sky-600 cursor-pointer leading-snug"
                                onClick={() => setPreviewFile(file)}
                              >
                                {file.name}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {file.summary}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Format & Size */}
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          <span className="uppercase font-mono text-[11px] font-semibold text-slate-700">{file.fileType}</span>
                          <span className="text-slate-400 text-[10px] block font-mono">{file.size}</span>
                        </td>

                        {/* Chunks */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {file.chunks} 条要点
                          </span>
                        </td>

                        {/* RAG Hits */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-slate-900 font-semibold text-xs">{file.hitCount}</span>
                          <span className="text-slate-400 text-[10px] ml-0.5">次命中</span>
                        </td>

                        {/* Uploader & Date */}
                        <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                          <div className="text-[11px] text-slate-800 font-medium">{file.uploader}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{file.uploadedAt}</div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition inline-flex items-center cursor-pointer"
                            title="预览文档解析与核心要点"
                          >
                            <Eye className="h-3 w-3 mr-1 text-slate-500" />
                            查看解析要点
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition inline-flex items-center cursor-pointer"
                            title="从当前知识库删除此文件"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            删除
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Tip & Summary */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>知识库文件已自动进行脱敏处理，并在 AI 智能导师与备赛问答中提供准确的原文引文出处（Grounding Citations）</span>
              </div>
              <div className="text-slate-400">
                本库共计 {filteredFiles.length} 份文件 / {currentKb.chunkCount} 个知识要点
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Create New Knowledge Base */}
      {/* ========================================================================= */}
      {isCreateKbModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl">
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">新建学校专属知识库</h3>
                  <p className="text-[11px] text-slate-500">用于沉淀特色赛道材料、校内扶持政策或学院专家经验</p>
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
                  placeholder="如：电子信息学院新一代人工智能特色赛道培育库"
                  value={newKbName}
                  onChange={e => setNewKbName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">业务所属分类 *</label>
                  <select
                    value={newKbCategory}
                    onChange={e => setNewKbCategory(e.target.value as KnowledgeBase['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                  >
                    <option value="school_policy">校内专属智库 (扶持与报销)</option>
                    <option value="competition_rules">2026大赛规程 (规则与指标)</option>
                    <option value="gold_cases">历史金奖案例 (标杆BP与PPT)</option>
                    <option value="expert_experience">专家经验智库 (追问与失分)</option>
                    <option value="opc_incubation">OPC孵化转化 (投融资与落地)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">面向受众人群 *</label>
                  <input
                    type="text"
                    value={newKbAudience}
                    onChange={e => setNewKbAudience(e.target.value)}
                    placeholder="如：全校师生及备赛团队"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">知识库职能简介与调用场景</label>
                <textarea
                  rows={3}
                  value={newKbDescription}
                  onChange={e => setNewKbDescription(e.target.value)}
                  placeholder="说明该知识库的核心文件类型及在学生AI教练问答、AI初筛中的生效场景..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600 mr-1" />
                  默认配置说明
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  新建后知识库默认处于“运行中”状态，自动完成深度语义解析与核心要点结构化归档，创建成功后将直接进入该库的文件管理页面。
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateKbModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                  确认创建并管理文件
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Upload File to Current KB */}
      {/* ========================================================================= */}
      {isUploadFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">上传文件至【{currentKb?.name}】</h3>
                  <p className="text-[11px] text-slate-500">支持 PDF、Word、Excel、PPTX 及 Markdown 格式</p>
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
              {/* Drag & drop simulation area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 hover:bg-sky-50/70 rounded-xl p-6 text-center cursor-pointer transition"
              >
                <UploadCloud className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-800">
                  点击选取本地文件，或拖拽文件到此处
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  单文件上限 50MB，自动完成文本抽取、敏感信息过滤及结构化知识要点提取
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
                  placeholder="如：《2026年高校重点培育项目产学研落地资助实施细则》"
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
                  placeholder="概述文档的核心要点，便于AI问答时提供精准摘要引导..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadFileModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-xs transition flex items-center cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      正在进行语义解析与要点提取...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
                      确认上传并解析
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: File Details & Knowledge Excerpts Preview */}
      {/* ========================================================================= */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                {getFileIcon(previewFile.fileType)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">{previewFile.name}</h3>
                  <div className="text-[11px] text-slate-400">
                    大小：{previewFile.size} · 核心知识要点：{previewFile.chunks} 条 · 备赛检索命中：{previewFile.hitCount} 次
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setPreviewFile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Document Overview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600 mr-1.5" />
                  AI 智能摘要与内容引要
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {previewFile.summary}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-200/60">
                  <span>上传人：{previewFile.uploader}</span>
                  <span>入库时间：{previewFile.uploadedAt}</span>
                </div>
              </div>

              {/* Sample Knowledge Excerpts Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">核心知识要点与结构化提取示例</span>
                  <span className="text-[11px] text-slate-400">AI问答与初筛对标时精准引用的知识要点段落</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-mono font-semibold text-sky-600">知识要点 #001 · 匹配度 94.2%</span>
                      <span>字数: 380 字</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      “...重点支持具有自主知识产权的核心技术成果转化。凡在校生团队作为主创成员申报金奖项目，需提前在科技处备案无权属纠纷授权声明。学校针对A级重点攻坚梯队配备1:1配套培育孵化资金...”
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-mono font-semibold text-sky-600">知识要点 #002 · 匹配度 89.5%</span>
                      <span>字数: 412 字</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      “...针对新工科与硬科技赛道，网评专家重点审视技术壁垒在行业真实产业链中的替代成本，严禁出现仅有实验室论文而无量产工艺验证或客户小批试用报告的情况...”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">状态：知识库已完成结构化解析并正常运行</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition font-medium cursor-pointer"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
