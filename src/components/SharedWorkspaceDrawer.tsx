/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Presentation, Video, Paperclip, 
  Layers, X, Plus, FileCheck, Award, MessageSquare, 
  ChevronRight, Download, Trash2, AtSign, Check, UploadCloud
} from 'lucide-react';
import { UniversityOption } from '../data/mockCoachData';
import { ProjectSpace, AssociatedFileItem } from '../types';

export interface ActionItem {
  id: string;
  title: string;
  category: string;
  sourceEngine: string;
  completed: boolean;
}

export const defaultSharedFiles: AssociatedFileItem[] = [
  {
    id: 'f-bp',
    name: '智耘农业_商业计划书_V2.4_初赛版.pdf',
    type: 'bp',
    typeLabel: 'BP 计划书',
    size: '4.8 MB',
    updateTime: '2026-05-18',
    status: 'ready',
  },
  {
    id: 'f-ppt',
    name: '智耘农业_国赛路演幻灯片_V3.1.pptx',
    type: 'ppt',
    typeLabel: '路演 PPT',
    size: '12.4 MB',
    updateTime: '2026-05-20',
    status: 'ready',
  },
  {
    id: 'f-vcr',
    name: '智耘农业_1分钟田间实测与产品VCR.mp4',
    type: 'vcr',
    typeLabel: '项目 VCR',
    size: '38.2 MB',
    updateTime: '2026-05-21',
    status: 'ready',
  },
  {
    id: 'f-att',
    name: '科技查新与发明专利授权书_合订本.pdf',
    type: 'attachment',
    typeLabel: '佐证附件',
    size: '8.6 MB',
    updateTime: '2026-05-15',
    status: 'ready',
  },
];

export interface SharedWorkspaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUniversity: UniversityOption;
  currentSpace?: ProjectSpace | null;
  actionItems: ActionItem[];
  onToggleActionItem: (id: string) => void;
  onNavigateToDiagnosis?: () => void;
  onNavigateToMockQA?: () => void;
  onSimulateUploadBP?: () => void;
  files?: AssociatedFileItem[];
  onDeleteFile?: (fileId: string) => void;
  mentionedFileIds?: string[];
  onToggleMentionFile?: (file: AssociatedFileItem) => void;
}

export default function SharedWorkspaceDrawer({
  isOpen,
  onClose,
  currentUniversity,
  currentSpace,
  actionItems,
  onToggleActionItem,
  onNavigateToDiagnosis,
  onNavigateToMockQA,
  onSimulateUploadBP,
  files,
  onDeleteFile,
  mentionedFileIds = [],
  onToggleMentionFile,
}: SharedWorkspaceDrawerProps) {
  // Local fallback file list if not passed from parent
  const [localFileList, setLocalFileList] = useState<AssociatedFileItem[]>(defaultSharedFiles);
  const activeFiles = files || localFileList;

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFileType, setUploadFileType] = useState<'bp' | 'ppt' | 'vcr' | 'attachment'>('bp');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSimulateNewUpload = () => {
    if (!uploadFileName.trim()) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newFile: AssociatedFileItem = {
        id: `f-${Date.now()}`,
        name: uploadFileName,
        type: uploadFileType,
        typeLabel: 
          uploadFileType === 'bp' ? 'BP 计划书' :
          uploadFileType === 'ppt' ? '路演 PPT' :
          uploadFileType === 'vcr' ? '项目 VCR' : '佐证附件',
        size: '6.2 MB',
        updateTime: '刚刚',
        status: 'ready',
      };
      setLocalFileList(prev => [newFile, ...prev]);
      setShowUploadModal(false);
      setUploadFileName('');
      showToast(`已关联文件：${uploadFileName}`);
      if (uploadFileType === 'bp' && onSimulateUploadBP) {
        onSimulateUploadBP();
      }
    }, 800);
  };

  const handleDownload = (name: string) => {
    showToast(`已开始下载：${name}`);
  };

  const handleDelete = (file: AssociatedFileItem) => {
    if (onDeleteFile) {
      onDeleteFile(file.id);
    } else {
      setLocalFileList(prev => prev.filter(f => f.id !== file.id));
    }
    showToast(`已删除：${file.name}`);
  };

  const handleToggleMention = (file: AssociatedFileItem) => {
    if (onToggleMentionFile) {
      onToggleMentionFile(file);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'bp':
        return <FileText className="h-4 w-4 text-rose-500" />;
      case 'ppt':
        return <Presentation className="h-4 w-4 text-orange-500" />;
      case 'vcr':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'attachment':
      default:
        return <Paperclip className="h-4 w-4 text-purple-500" />;
    }
  };

  const getFileBadgeStyle = (type: string) => {
    switch (type) {
      case 'bp':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ppt':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'vcr':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'attachment':
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <>
      {/* Slide-out Panel container */}
      <aside 
        className={`fixed top-0 bottom-0 right-0 z-40 w-80 sm:w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">共享资产</h3>
              <p className="text-[10px] text-gray-400 font-mono">
                {currentSpace ? `${currentSpace.name} · 文件与记录` : '独立咨询 · 无工作空间'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
              title="关联新文件"
            >
              <Plus className="h-3 w-3" />
              <span>关联文件</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="收起"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toast Feedback Notification */}
        {toastMsg && (
          <div className="mx-3 mt-2 py-1.5 px-3 bg-gray-900 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-in fade-in duration-150">
            <span>{toastMsg}</span>
            <Check className="h-3.5 w-3.5 text-emerald-400 ml-2" />
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
          {/* Project Identity & Workspace Compact Header */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-gray-50 p-2.5 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span className="font-bold text-gray-900 text-xs truncate">
                    {currentSpace ? `${currentSpace.icon || '📁'} ${currentSpace.name}` : '📁 无工作空间'}
                  </span>
                  {currentSpace?.trackTag && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-100/80 text-blue-800 rounded-full font-medium">
                      {currentSpace.trackTag}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 truncate">
                  {currentSpace ? `${currentSpace.school || currentUniversity.name} · ${currentSpace.leader || '负责人'}` : '当前会话未绑定项目工作空间'}
                </p>
              </div>
              <span className="flex-shrink-0 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center space-x-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>{currentSpace?.workspace?.syncRate || '已就绪'}</span>
              </span>
            </div>

            {/* Local & Cloud sync paths */}
            {currentSpace && (
              <div className="pt-1.5 border-t border-blue-100/60 space-y-1 text-[9px] font-mono">
                <div className="flex items-center justify-between text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-100">
                  <span className="text-gray-400 flex-shrink-0">本地:</span>
                  <span className="text-gray-700 truncate max-w-[210px]" title={currentSpace.workspace.localPath}>
                    {currentSpace.workspace.localPath}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-100">
                  <span className="text-gray-400 flex-shrink-0">云端:</span>
                  <span className="text-sky-700 truncate max-w-[210px]" title={currentSpace.workspace.cloudBucket}>
                    {currentSpace.workspace.cloudBucket}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* MODULE 1: Associated Files (BP, PPT, VCR, Attachments)       */}
          {/* ============================================================ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                <Paperclip className="h-3.5 w-3.5 text-blue-600" />
                <span>申报与路演文件 ({activeFiles.length})</span>
              </span>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-0.5"
              >
                <span>+ 添加</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeFiles.map((file) => {
                const isMentioned = mentionedFileIds.includes(file.id);
                return (
                  <div 
                    key={file.id}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 mt-0.5">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${getFileBadgeStyle(file.type)}`}>
                            {file.typeLabel}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{file.size}</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 text-xs truncate mt-1" title={file.name}>
                          {file.name}
                        </h5>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span className="text-gray-400 font-mono text-[10px]">{file.updateTime}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleMention(file)}
                          className={`px-2 py-0.5 rounded-md text-xs font-medium border flex items-center space-x-1 transition-colors ${
                            isMentioned
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                          title={isMentioned ? '取消在聊天中的引用' : '在聊天窗口中引用'}
                        >
                          <AtSign className="h-3 w-3" />
                          <span>{isMentioned ? '已引用' : '引用'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(file.name)}
                          className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 flex items-center space-x-1 transition-colors text-xs"
                          title="下载文件"
                        >
                          <Download className="h-3 w-3 text-gray-500" />
                          <span>下载</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(file)}
                          className="px-2 py-0.5 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-medium rounded-md border border-gray-200 hover:border-rose-200 flex items-center space-x-1 transition-colors text-xs"
                          title="删除文件"
                        >
                          <Trash2 className="h-3 w-3 text-gray-500 hover:text-rose-500" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* MODULE 2: Linked Diagnosis & Mock QA Records (Simplified)    */}
          {/* ============================================================ */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                <FileCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>关联诊断与答辩记录</span>
              </span>
            </div>

            <div className="space-y-2">
              {/* 4.2 Diagnosis Report Card */}
              <div className="p-2.5 rounded-xl border border-amber-200/90 bg-amber-50/40 transition-all flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                      诊断报告 · 7.2分
                    </span>
                  </div>
                  <h5 className="font-semibold text-gray-900 text-xs truncate mt-1">
                    全链路六维诊断报告.pdf
                  </h5>
                </div>
                {onNavigateToDiagnosis && (
                  <button
                    type="button"
                    onClick={onNavigateToDiagnosis}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium text-xs flex items-center space-x-1 transition-colors flex-shrink-0"
                    title="查看诊断复盘"
                  >
                    <span>查看复盘</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* 4.3 Mock QA Record Card */}
              <div className="p-2.5 rounded-xl border border-rose-200/90 bg-rose-50/40 transition-all flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-rose-600 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100/70 px-1.5 py-0.5 rounded">
                      模拟答辩 · 84分
                    </span>
                  </div>
                  <h5 className="font-semibold text-gray-900 text-xs truncate mt-1">
                    模拟答辩连环追问速记.log
                  </h5>
                </div>
                {onNavigateToMockQA && (
                  <button
                    type="button"
                    onClick={onNavigateToMockQA}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 font-medium text-xs flex items-center space-x-1 transition-colors flex-shrink-0"
                    title="开始模拟答辩演练"
                  >
                    <span>答辩演练</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-gray-100 bg-gray-50/50 text-[10px] text-center text-gray-400 font-mono flex items-center justify-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>全要素资产已作为 System Prompt 注入教练对话</span>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* SIMULATE NEW FILE UPLOAD MODAL                               */}
      {/* ============================================================ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-gray-100 space-y-3 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <UploadCloud className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-xs text-gray-900">关联项目材料至工作空间</h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs">文件类型</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['bp', 'ppt', 'vcr', 'attachment'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadFileType(t)}
                      className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-colors ${
                        uploadFileType === t 
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getFileIcon(t)}
                      <span>
                        {t === 'bp' && '商业计划书'}
                        {t === 'ppt' && '路演幻灯片'}
                        {t === 'vcr' && '项目视频'}
                        {t === 'attachment' && '佐证附件'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs">文件名称</label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="例如: 智耘农业_财务预测模型_V1.0.xlsx"
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSimulateNewUpload}
                disabled={isUploading || !uploadFileName.trim()}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 text-xs flex items-center space-x-1"
              >
                {isUploading ? <span>上传解析中...</span> : <span>立即关联</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
