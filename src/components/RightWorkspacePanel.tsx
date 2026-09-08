/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Share2, 
  Maximize2, 
  Minimize2, 
  PanelRight, 
  ChevronDown, 
  Search, 
  Printer, 
  Settings2, 
  Sparkles, 
  Check, 
  Presentation, 
  FileSpreadsheet, 
  FileText, 
  Video, 
  Paperclip,
  ZoomIn,
  ZoomOut,
  Pin,
  Download,
  Eye,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AssociatedFileItem } from '../types';

export const ALL_PROJECT_DELIVERABLES: AssociatedFileItem[] = [
  {
    id: 'art-ppt-1',
    name: '安里AI_BP补充_项目路标.pptx',
    type: 'ppt',
    typeLabel: '路演汇报幻灯片 (Deck)',
    size: '31.3 KB',
    updateTime: '刚刚',
    status: 'ready',
    metaInfo: '含 P1~P4 四阶产品、场景、客户/收入与融资演进全案'
  },
  {
    id: 'art-xlsx-1',
    name: '安里AI项目路标_草稿.xlsx',
    type: 'excel',
    typeLabel: '研发排期与财务测算 (Excel)',
    size: '18.6 KB',
    updateTime: '2026-03-29 14:10',
    status: 'ready',
    metaInfo: '分阶段工期甘特表、算力成本折算及客单价模型'
  },
  {
    id: 'art-ppt-2',
    name: '安里AI_BP补充_风险与应对.pptx',
    type: 'ppt',
    typeLabel: '风控防范专项汇报',
    size: '28.4 KB',
    updateTime: '2026-03-29 11:45',
    status: 'ready',
    metaInfo: '涉法合规漏洞、数据隐私脱敏与模型幻觉纠偏机制'
  },
  {
    id: 'art-ppt-3',
    name: '安里AI_BP补充_资源投入.pptx',
    type: 'ppt',
    typeLabel: '研发与市场资源投入',
    size: '24.1 KB',
    updateTime: '2026-03-29 09:30',
    status: 'ready',
    metaInfo: '团队薪酬配比、服务器及行业评测费用预算'
  },
  {
    id: 'art-ppt-4',
    name: '安里AI_BP补充_产品里程碑.pptx',
    type: 'ppt',
    typeLabel: '产品与交付里程碑',
    size: '35.2 KB',
    updateTime: '2026-03-28 17:00',
    status: 'ready',
    metaInfo: '从MVP算法验证到SaaS全流程AI平台阶段拆解'
  },
  {
    id: 'art-doc-1',
    name: '【AI产品需求规划与架构设计说明】.docx',
    type: 'doc',
    typeLabel: '架构设计白皮书',
    size: '42.5 KB',
    updateTime: '2026-03-28 10:15',
    status: 'ready',
    metaInfo: 'Agent编排引擎、微服务网关与司法专属大模型蒸馏技术方案'
  },
  {
    id: 'art-bp-1',
    name: '智耘农业_商业计划书_V2.4_初赛版.pdf',
    type: 'bp',
    typeLabel: '商业计划书 (BP)',
    size: '14.8 MB',
    updateTime: '2026-03-27 16:30',
    status: 'ready',
    metaInfo: '2026国赛标准12章节完整版，含科技查新与公章证明'
  },
  {
    id: 'art-vcr-1',
    name: '智耘农业_1分钟田间实测与产品VCR.mp4',
    type: 'vcr',
    typeLabel: '田间实测与产品VCR',
    size: '38.2 MB',
    updateTime: '2026-03-26 15:20',
    status: 'ready',
    metaInfo: '低空多光谱无人机自主巡检与病虫害实测视频'
  }
];

interface RightWorkspacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  openTabs: string[];
  onCloseTab: (fileId: string) => void;
  onAddTab: (fileId: string) => void;
  allFiles?: AssociatedFileItem[];
  projectName?: string;
  widthPx?: number;
  widthPercent?: number;
  isDragging?: boolean;
  isExpandedFull?: boolean;
  onToggleExpandedFull?: () => void;
}

export default function RightWorkspacePanel({
  isOpen,
  onClose,
  activeFileId,
  onSelectFile,
  openTabs,
  onCloseTab,
  onAddTab,
  allFiles = ALL_PROJECT_DELIVERABLES,
  projectName = '安里AI / 智耘农业',
  widthPx,
  widthPercent = 40,
  isDragging = false,
  isExpandedFull: externalIsExpandedFull,
  onToggleExpandedFull
}: RightWorkspacePanelProps) {
  const [showDeliverablesMenu, setShowDeliverablesMenu] = useState(false);
  const [internalIsExpandedFull, setInternalIsExpandedFull] = useState(false);
  
  // Controlled or uncontrolled support for expanded full state
  const isExpandedFull = externalIsExpandedFull !== undefined ? externalIsExpandedFull : internalIsExpandedFull;
  const toggleFullscreen = () => {
    if (onToggleExpandedFull) {
      onToggleExpandedFull();
    } else {
      setInternalIsExpandedFull(prev => !prev);
    }
  };

  const [freeSelectMode, setFreeSelectMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(48); // default 48% matching screenshot
  const [activeSheetTab, setActiveSheetTab] = useState<'roadmap' | 'budget' | 'kpi'>('roadmap');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen for ESC key to exit in-page fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpandedFull) {
        if (onToggleExpandedFull) {
          onToggleExpandedFull();
        } else {
          setInternalIsExpandedFull(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpandedFull, onToggleExpandedFull]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const activeFile = allFiles.find(f => f.id === activeFileId) || allFiles[0];

  const getFileIcon = (type: string, className = "h-3.5 w-3.5") => {
    switch (type) {
      case 'ppt':
        return <Presentation className={`${className} text-orange-500`} />;
      case 'excel':
        return <FileSpreadsheet className={`${className} text-emerald-600`} />;
      case 'doc':
      case 'bp':
        return <FileText className={`${className} text-blue-600`} />;
      case 'vcr':
        return <Video className={`${className} text-purple-500`} />;
      default:
        return <Paperclip className={`${className} text-slate-500`} />;
    }
  };

  if (!isOpen) return null;

  return (
    <aside 
      id="right-independent-workspace"
      style={
        isExpandedFull 
          ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 9999 } 
          : widthPx !== undefined 
            ? { width: `${widthPx}px` } 
            : { width: `${widthPercent}%` }
      }
      className={`flex flex-col bg-white select-none ${
        isDragging ? '' : 'transition-all duration-150'
      } ${
        isExpandedFull 
          ? 'fixed inset-0 z-[9999] w-screen h-screen border-none shadow-2xl overflow-hidden' 
          : 'h-full border-l border-slate-200 shadow-sm shrink-0 relative'
      }`}
    >
      {/* Dragging Transparent Overlay to prevent event dropping */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-sky-500/5 cursor-col-resize select-none pointer-events-auto" />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 right-6 z-50 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 1. TOP TAB BAR: Multi-file tabs like browser/IDE                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="h-10 bg-slate-100/90 border-b border-slate-200 px-2 flex items-center justify-between shrink-0">
        {/* Scrollable Tabs List */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar min-w-0 flex-1 pr-2 py-1">
          {openTabs.map((tabId) => {
            const file = allFiles.find(f => f.id === tabId);
            if (!file) return null;
            const isActive = file.id === activeFile?.id;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer transition-all shrink-0 max-w-[200px] border-t-2 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs border-sky-600 border-x border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
                }`}
                title={file.name}
              >
                {getFileIcon(file.type)}
                <span className="truncate">{file.name}</span>
                {openTabs.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(file.id);
                    }}
                    className="p-0.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 opacity-70 group-hover:opacity-100 transition-opacity ml-1"
                    title="关闭标签页"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Tab Button */}
          <button
            type="button"
            onClick={() => setShowDeliverablesMenu(prev => !prev)}
            className="h-7 w-7 rounded-lg hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
            title="添加或打开产物文件"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1 shrink-0 pl-2 border-l border-slate-200">
          <button
            type="button"
            onClick={() => showToast('已生成产物公开分享凭据链接')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
            title="分享此产物"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
              isExpandedFull 
                ? 'text-sky-600 bg-sky-100/80 hover:bg-sky-200' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/80'
            }`}
            title={isExpandedFull ? "还原窗口大小 (退出全屏，按 ESC 亦可)" : "全屏展开预览 (覆盖左侧边栏与全部界面)"}
          >
            {isExpandedFull ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
            title="收起右侧独立工作区"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. SUBHEADER: Deliverables Dropdown & Editor Toolbar              */}
      {/* ----------------------------------------------------------------- */}
      <div className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 relative">
        {/* Left: Deliverables Menu Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDeliverablesMenu(prev => !prev)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 transition-colors cursor-pointer"
          >
            <span>概览</span>
            <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${showDeliverablesMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Floating Panel: Deliverables List */}
          {showDeliverablesMenu && (
            <div 
              className="absolute left-0 top-9 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-1 border-b border-slate-100 text-xs font-semibold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <span>产物</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </span>
                <Pin className="h-3.5 w-3.5 text-slate-400 rotate-45" />
              </div>

              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                {allFiles.map((file) => {
                  const isCurrent = file.id === activeFile?.id;
                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        onAddTab(file.id);
                        onSelectFile(file.id);
                        setShowDeliverablesMenu(false);
                      }}
                      className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-sky-50 text-sky-800 font-medium' 
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {getFileIcon(file.type, "h-4 w-4 shrink-0")}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate text-xs font-medium">{file.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{file.size} · {file.typeLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1.5 mt-1 border-t border-slate-100 px-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>共 {allFiles.length} 项交付产物</span>
                <span className="text-sky-600 font-medium cursor-pointer hover:underline">全部导出ZIP</span>
              </div>
            </div>
          )}
        </div>

        {/* Center / Right: Formatting & Tool Controls */}
        <div className="flex items-center space-x-2.5 text-xs text-slate-600">
          <div className="hidden sm:flex items-center space-x-3 text-xs border-r border-slate-200 pr-3">
            <button className="hover:text-slate-900 flex items-center space-x-1 cursor-pointer">
              <span>段落</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            <button className="hover:text-slate-900 cursor-pointer">绘图</button>
            <button className="hover:text-slate-900 cursor-pointer">动画</button>
            <button className="hover:text-slate-900 cursor-pointer">页面设置</button>
            <button 
              onClick={() => showToast('已唤起浏览器高清矢量打印')} 
              className="hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>打印</span>
            </button>
            <button className="hover:text-slate-900 flex items-center space-x-0.5 cursor-pointer">
              <Search className="h-3.5 w-3.5" />
              <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
            </button>
          </div>

          {/* Free Select Mode Toggle */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-600 font-medium hidden md:inline">自由框选模式</span>
            <button
              type="button"
              onClick={() => setFreeSelectMode(prev => !prev)}
              className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                freeSelectMode ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <span 
                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                  freeSelectMode ? 'translate-x-4' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. DOCUMENT CANVAS PREVIEW AREA                                   */}
      {/* ----------------------------------------------------------------- */}
      <div 
        className="flex-1 bg-slate-100/70 overflow-auto p-4 flex flex-col items-center justify-start relative"
        onClick={() => {
          if (showDeliverablesMenu) setShowDeliverablesMenu(false);
        }}
      >
        {/* PPT SLIDE PREVIEW (Default for 安里AI_BP补充_项目路标.pptx) */}
        {activeFile.type === 'ppt' && (
          <div 
            className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden transition-transform duration-200"
            style={{ 
              transform: `scale(${zoomLevel / 48})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Slide Top Banner Header */}
            <div className="bg-[#1E293B] text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="h-6 w-1 bg-amber-400 rounded-full" />
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
                    <span>安里AI项目路标 · 全景演进矩阵</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      Deck v3.2
                    </span>
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    阶段定义 | 核心功能 · 场景深度 · 客户与收入 · 融资与合规演进
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
                密级：商业绝密 · 参赛评委专用
              </span>
            </div>

            {/* Slide Content: 4-Column Timeline Grid Table */}
            <div className="p-4 bg-slate-50/50">
              {/* Table Column Headers */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold mb-2">
                <div className="p-2 bg-slate-200/80 rounded-lg text-slate-700 flex items-center justify-center">
                  维度 / 阶段
                </div>
                <div className="p-2 bg-sky-100/90 text-sky-900 rounded-lg border border-sky-200/80">
                  <div>P1 验证期</div>
                  <div className="text-[10px] font-normal text-sky-700">2025.01-06 / 6个月</div>
                </div>
                <div className="p-2 bg-emerald-100/90 text-emerald-900 rounded-lg border border-emerald-200/80">
                  <div>P2 拓展期</div>
                  <div className="text-[10px] font-normal text-emerald-700">2025.07-2026.06 / 12个月</div>
                </div>
                <div className="p-2 bg-indigo-100/90 text-indigo-900 rounded-lg border border-indigo-200/80">
                  <div>P3 增长期</div>
                  <div className="text-[10px] font-normal text-indigo-700">2026.07-2027.06 / 12个月</div>
                </div>
                <div className="p-2 bg-purple-100/90 text-purple-900 rounded-lg border border-purple-200/80">
                  <div>P4 规模化</div>
                  <div className="text-[10px] font-normal text-purple-700">2027.07-2028.12 / 18个月</div>
                </div>
              </div>

              {/* Row 1: 产品里程碑 */}
              <div className="grid grid-cols-5 gap-2 mb-2 text-xs">
                <div className="p-2.5 bg-slate-100 text-slate-800 font-semibold rounded-lg flex items-center justify-center text-center">
                  产品里程碑
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-sky-800">【MVP基础助手】</div>
                  <div>• Assistant助手7项功能完整列出</div>
                  <div>• 数据脱敏4项、案件库2项</div>
                  <div>• 模型基准评测能力2项全面打通</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-emerald-800">【SaaS产品化】</div>
                  <div>• 合规审查完成、助手专业拓展</div>
                  <div>• Workflows+多Agent深度协作</div>
                  <div>• 自建替代底层算子各模块子项全展开</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-indigo-800">【全流程AI化】</div>
                  <div>• 案件立案→庭审全链条AI嵌入</div>
                  <div>• Agent Platform企业级客户化</div>
                  <div>• 行业垂直生态模型私有化部署</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-purple-800">【平台生态化】</div>
                  <div>• 开发者开放API生态繁荣</div>
                  <div>• 多法域多语言国际版落地</div>
                  <div>• 千家行业大客户私有化集群覆盖</div>
                </div>
              </div>

              {/* Row 2: 场景深度 */}
              <div className="grid grid-cols-5 gap-2 mb-2 text-xs">
                <div className="p-2.5 bg-slate-100 text-slate-800 font-semibold rounded-lg flex items-center justify-center text-center">
                  场景深度
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 验证目标明确，覆盖范围与交付流程完整保留</div>
                  <div>• 针对知识产权初审与民商事合同高频场景建立标准SOP</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 刑事+知产各自的具体功能和适用场景充分展开</div>
                  <div>• 诉前风险排查与法条溯源交叉质证试验落地</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 立案→举证→庭审→判决→执行每个环节AI能力全列出</div>
                  <div>• 智能文书生成与事实要素自动化对齐</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 司法全场景深度渗透，仲裁委/大型头部律所深度绑定</div>
                  <div>• 跨区域司法行政协同生态闭环</div>
                </div>
              </div>

              {/* Row 3: 客户/收入 */}
              <div className="grid grid-cols-5 gap-2 mb-2 text-xs">
                <div className="p-2.5 bg-slate-100 text-slate-800 font-semibold rounded-lg flex items-center justify-center text-center">
                  客户/收入
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 种子客户：10家标杆律所</div>
                  <div>• 收入：0~50万元（MVP验证）</div>
                  <div>• 核心验证产品留存与调用频次</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 年化收入：500~1000万元</div>
                  <div>• 客单价：20~50万/年</div>
                  <div>• 覆盖中型律所与企业法务合规部门</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 年化收入：2000~3000万元</div>
                  <div>• 客单价：50~100万/年</div>
                  <div>• 大型央国企、顶级红圈所高复购</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div>• 年化收入：8000万~1.2亿元</div>
                  <div>• SaaS标准化订阅 + 私有化微调服务</div>
                  <div>• 毛利率达 75% 以上</div>
                </div>
              </div>

              {/* Row 4: 融资 */}
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 bg-slate-100 text-slate-800 font-semibold rounded-lg flex items-center justify-center text-center">
                  融资规划
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-slate-800">天使轮：500~1000万</div>
                  <div>核心投向：团队扩充与模型算法初筛落地</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-slate-800">Pre-A轮：2000~3000万</div>
                  <div>核心投向：商务交付团队与标杆客户扩张</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-slate-800">A轮：5000万~1亿元</div>
                  <div>核心投向：自建算力中心与全国交付网络</div>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <div className="font-semibold text-slate-800">B轮/战略轮：2~3亿元</div>
                  <div>核心投向：海外多法域并购与生态基金</div>
                </div>
              </div>

              {/* Bottom Slide Footer Note */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-mono">
                  核心逻辑：MVP验证算法P0 → 场景扩充+SaaS化(P2) → 全流程AI化+客户拓展(P3) → 矩阵拓展+生态化(P4)
                </span>
                <span className="text-sky-600 hover:underline cursor-pointer">
                  点击添加演示备注
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EXCEL SPREADSHEET PREVIEW */}
        {activeFile.type === 'excel' && (
          <div 
            className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden"
            style={{ 
              transform: `scale(${zoomLevel / 48})`,
              transformOrigin: 'top center'
            }}
          >
            <div className="bg-emerald-700 text-white px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center space-x-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{activeFile.name}</span>
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <button 
                  onClick={() => setActiveSheetTab('roadmap')}
                  className={`px-2 py-0.5 rounded ${activeSheetTab === 'roadmap' ? 'bg-white/25 font-bold' : 'hover:bg-white/10'}`}
                >
                  工期甘特
                </button>
                <button 
                  onClick={() => setActiveSheetTab('budget')}
                  className={`px-2 py-0.5 rounded ${activeSheetTab === 'budget' ? 'bg-white/25 font-bold' : 'hover:bg-white/10'}`}
                >
                  财务收支
                </button>
                <button 
                  onClick={() => setActiveSheetTab('kpi')}
                  className={`px-2 py-0.5 rounded ${activeSheetTab === 'kpi' ? 'bg-white/25 font-bold' : 'hover:bg-white/10'}`}
                >
                  指标对标
                </button>
              </div>
            </div>

            {/* Formula Bar */}
            <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400 font-bold">fx</span>
              <span className="text-slate-700">=SUM(C4:C24)*1.15 [综合预算估算公式]</span>
            </div>

            {/* Table Grid */}
            <div className="p-3 overflow-x-auto text-xs">
              <table className="w-full border-collapse border border-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-200 p-2 w-12 text-center">序号</th>
                    <th className="border border-slate-200 p-2">阶段交付模块</th>
                    <th className="border border-slate-200 p-2">责任团队</th>
                    <th className="border border-slate-200 p-2">工期排期</th>
                    <th className="border border-slate-200 p-2">预算金额 (万元)</th>
                    <th className="border border-slate-200 p-2">当前对标状态</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: 'P1 视觉检测算法蒸馏优化', team: '算法研发组', time: '2025.01 - 2025.03', cost: '38.5', status: '已完成 100%' },
                    { id: 2, name: 'P1 数据脱敏与合规沙箱', team: '数据安全组', time: '2025.03 - 2025.05', cost: '22.0', status: '已完成 100%' },
                    { id: 3, name: 'P2 多Agent编排调度引擎', team: '后端架构组', time: '2025.07 - 2025.10', cost: '85.0', status: '推进中 75%' },
                    { id: 4, name: 'P2 10家标杆客户现场部署', team: '解决方案与交付', time: '2025.10 - 2026.03', cost: '120.0', status: '试点交付中' },
                    { id: 5, name: 'P3 全国高校及赛区知识产权复核', team: '商务与法务组', time: '2026.04 - 2026.06', cost: '45.0', status: '准备申报' },
                  ].map(row => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="border border-slate-200 p-2 text-center text-slate-400 font-mono">{row.id}</td>
                      <td className="border border-slate-200 p-2 font-medium text-slate-800">{row.name}</td>
                      <td className="border border-slate-200 p-2 text-slate-600">{row.team}</td>
                      <td className="border border-slate-200 p-2 text-slate-600 font-mono">{row.time}</td>
                      <td className="border border-slate-200 p-2 text-right font-mono font-semibold text-slate-900">{row.cost}</td>
                      <td className="border border-slate-200 p-2 text-emerald-600 font-semibold">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORD/DOC/BP PREVIEW */}
        {(activeFile.type === 'doc' || activeFile.type === 'bp' || activeFile.type === 'attachment' || activeFile.type === 'vcr') && (
          <div 
            className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4"
            style={{ 
              transform: `scale(${zoomLevel / 48})`,
              transformOrigin: 'top center'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h1 className="text-base font-bold text-slate-900">{activeFile.name}</h1>
                <p className="text-xs text-slate-400 mt-0.5">最后更新：{activeFile.updateTime} · 格式：{activeFile.typeLabel}</p>
              </div>
              <button 
                onClick={() => showToast('已下载该文件至本地')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center space-x-1"
              >
                <Download className="h-3.5 w-3.5" />
                <span>导出源文件</span>
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <h2 className="text-sm font-semibold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                第一章：项目概述与核心痛点
              </h2>
              <p>
                本项目紧密契合 2026 年中国国际大学生创新大赛评审导向。针对传统行业面临的专家稀缺、数据孤岛与人工流转低效三大卡脖子难题，创新性提出了自主研发的垂直场景推理引擎与多 Agent 协同体系。
              </p>

              <h2 className="text-sm font-semibold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                第二章：技术壁垒与知识产权自主可控
              </h2>
              <p>
                已获得 4 项国家发明专利独占实施许可与 6 项软件著作权登记。在核心算法层面，通过小样本蒸馏技术使端侧推理速度提升 400%，在保持 99.2% 精准度的同时极大降低算力基础设施成本。
              </p>

              <h2 className="text-sm font-semibold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                第三章：真实落地商业台账与未来演进
              </h2>
              <p>
                团队坚决杜绝“纸面虚构营收”，已与建瓯、吉安等头部示范单位签署真实服务合同，形成带公章挽损增收台账。四阶演进规划清晰，具备高度可落地的持续商业造血能力。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. BOTTOM STATUS BAR: Page Navigation, Layout Modes, Zoom Controls*/}
      {/* ----------------------------------------------------------------- */}
      <div className="h-9 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-slate-700 font-semibold">第 1 页 / 共 1 页</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-medium flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>AI生成已校对 · 符合2026大赛评审规范</span>
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(30, prev - 6))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="缩小"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <span className="font-mono text-slate-800 font-semibold w-10 text-center">
            {zoomLevel}%
          </span>

          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(100, prev + 6))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="放大"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel(48)}
            className="text-[11px] text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded hover:bg-slate-100"
            title="重置缩放为 48%"
          >
            适屏
          </button>
        </div>
      </div>
    </aside>
  );
}
