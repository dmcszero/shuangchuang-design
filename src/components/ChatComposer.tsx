/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, ChevronDown, Check, Plus, 
  Search, Mic, MicOff, Sparkles, 
  X, Paperclip, UploadCloud, FolderOpen, FileText
} from 'lucide-react';
import { ProjectSpace, AssociatedFileItem } from '../types';
import { 
  EXPERT_AGENTS, 
  COACH_SKILLS, 
  MCP_CONNECTORS, 
  RECOMMENDED_TASKS 
} from '../data/mockCoachAgentsAndSkills';
import AiMascot from './AiMascot';

export interface LocalUploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  isImage?: boolean;
  previewUrl?: string;
}

interface ChatComposerProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSend: (text: string) => void;
  isThinking: boolean;
  spaces?: ProjectSpace[];
  activeSpace?: ProjectSpace | null;
  activeSpaceId?: string;
  onSelectSpace?: (spaceId: string) => void;
  onCreateSpace?: (newSpace: { name: string; trackTag: string; school: string; leader: string }) => void;
  selectedAgentId: 'diagnosis' | 'defense' | 'policy' | 'intel' | 'campus';
  onSelectAgent: (agentId: 'diagnosis' | 'defense' | 'policy' | 'intel' | 'campus') => void;
  selectedSkillIds: string[];
  onToggleSkill: (skillId: string) => void;
  selectedMcpIds: string[];
  onToggleMcp: (mcpId: string) => void;
  onOpenFlywheelModal?: () => void;
  isNewSessionMode?: boolean;
  availableFiles?: AssociatedFileItem[];
  mentionedFiles?: AssociatedFileItem[];
  onAddMentionFile?: (file: AssociatedFileItem) => void;
  onRemoveMentionFile?: (fileId: string) => void;
}

export default function ChatComposer({
  inputValue,
  setInputValue,
  onSend,
  isThinking,
  selectedAgentId,
  onSelectAgent,
  selectedSkillIds,
  onToggleSkill,
  selectedMcpIds,
  onToggleMcp,
  onOpenFlywheelModal,
  availableFiles = [],
  mentionedFiles = [],
  onAddMentionFile,
  onRemoveMentionFile
}: ChatComposerProps) {
  // Popover menus state
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState<boolean>(false);
  const [isProjectFilesModalOpen, setIsProjectFilesModalOpen] = useState<boolean>(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState<boolean>(false);
  const [isSkillMenuOpen, setIsSkillMenuOpen] = useState<boolean>(false);
  const [isMcpMenuOpen, setIsMcpMenuOpen] = useState<boolean>(false);

  // Local uploaded files state (images & documents)
  const [localUploadedFiles, setLocalUploadedFiles] = useState<LocalUploadedFile[]>([]);

  // Voice recording mock state
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Search in Project Files modal
  const [fileSearchQuery, setFileSearchQuery] = useState<string>('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current selected expert agent
  const currentAgent = EXPERT_AGENTS.find(a => a.id === selectedAgentId) || EXPERT_AGENTS[0];

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (composerContainerRef.current && !composerContainerRef.current.contains(e.target as Node)) {
        setIsUploadMenuOpen(false);
        setIsAgentMenuOpen(false);
        setIsSkillMenuOpen(false);
        setIsMcpMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Handle local file upload via hidden input
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: LocalUploadedFile[] = Array.from(files).map((f: File) => {
      const isImg = f.type.startsWith('image/');
      return {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        size: f.size > 1024 * 1024 
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(f.size / 1024)} KB`,
        type: f.type,
        isImage: isImg,
        previewUrl: isImg ? URL.createObjectURL(f) : undefined
      };
    });

    setLocalUploadedFiles(prev => [...prev, ...newFiles]);
    showToast(`已上传并添加 ${newFiles.length} 个本地文件/图片`);
    e.target.value = '';
  };

  const handleRemoveLocalFile = (fileId: string) => {
    setLocalUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isThinking) return;
    onSend(inputValue.trim());
    setInputValue('');
  };

  // Filter project files in modal
  const filteredProjectFiles = availableFiles.filter(f => 
    f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
    (f.typeLabel && f.typeLabel.toLowerCase().includes(fileSearchQuery.toLowerCase()))
  );

  return (
    <div 
      ref={composerContainerRef}
      className="w-full relative transition-all"
    >
      {/* Hidden File Input for Local Upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
        onChange={handleLocalFileUpload}
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Composer Box */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 text-gray-900 relative">
        {/* MIDDLE ROW: Attached Files Chips & Textarea Input Area */}
        <div className="relative min-h-[72px] sm:min-h-[86px]">
          {/* File Chips (Project files + Local files/images) */}
          {((mentionedFiles && mentionedFiles.length > 0) || localUploadedFiles.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 pb-2.5">
              {/* Project Files */}
              {mentionedFiles.map((file) => (
                <span
                  key={file.id}
                  className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium group transition-colors shadow-2xs"
                >
                  <Paperclip className="h-3 w-3 text-sky-500 flex-shrink-0" />
                  <span className="max-w-[170px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveMentionFile && onRemoveMentionFile(file.id)}
                    className="text-sky-400 hover:text-rose-600 hover:bg-sky-100 rounded-full p-0.5 transition-colors"
                    title="移除"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {/* Local Uploaded Files / Images */}
              {localUploadedFiles.map((file) => (
                <span
                  key={file.id}
                  className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium group transition-colors shadow-2xs"
                >
                  {file.isImage && file.previewUrl ? (
                    <img src={file.previewUrl} alt="" className="h-4 w-4 rounded object-cover flex-shrink-0" />
                  ) : (
                    <FileText className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                  )}
                  <span className="max-w-[170px] truncate">{file.name}</span>
                  <span className="text-[10px] text-emerald-500 font-mono scale-90">({file.size})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocalFile(file.id)}
                    className="text-emerald-400 hover:text-rose-600 hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
                    title="移除"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <textarea
            ref={inputRef}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入内容，输入 @ 可引用项目文件提问，或点击上方推荐任务载入提示词..."
            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none leading-relaxed min-h-[64px]"
          />
        </div>

        {/* BOTTOM ROW: Controls Bar */}
        <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          {/* Left Controls: 【上传文件】 + 【专家选择】 + 【技能选择】 + 【连接器选择】 */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs">
            {/* 1. 【上传文件】 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsUploadMenuOpen(!isUploadMenuOpen);
                  setIsAgentMenuOpen(false);
                  setIsSkillMenuOpen(false);
                  setIsMcpMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-2xs ${
                  isUploadMenuOpen 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title="上传或选择项目文件"
                id="btn-upload-menu"
              >
                <Paperclip className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                <span>上传文件</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${isUploadMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Upload Popup Menu */}
              {isUploadMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2.5 w-64 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  {/* Option 1: 选择项目文件 */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadMenuOpen(false);
                      setIsProjectFilesModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left group"
                    id="btn-select-project-files"
                  >
                    <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800">选择项目文件</div>
                      <div className="text-[10px] text-slate-400 truncate">从项目库选择关联文件提问</div>
                    </div>
                  </button>

                  {/* Option 2: 上传本地文件或图片 */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left group"
                    id="btn-upload-local-file"
                  >
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <UploadCloud className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800">上传本地文件或图片</div>
                      <div className="text-[10px] text-slate-400 truncate">支持 PDF、Docx、PPT、图片等</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 2. 【专家选择】 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAgentMenuOpen(!isAgentMenuOpen);
                  setIsUploadMenuOpen(false);
                  setIsSkillMenuOpen(false);
                  setIsMcpMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-2xs ${
                  isAgentMenuOpen
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title="选择专家智能体"
                id="btn-expert-agent-menu"
              >
                <span className="text-sm">{currentAgent.avatar}</span>
                <span className="truncate max-w-[130px] sm:max-w-[170px]">{currentAgent.name}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 flex-shrink-0 transition-transform duration-150 ${isAgentMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Expert Agent Popover */}
              {isAgentMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2.5 space-y-1.5 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                    <span>专家智能体选择</span>
                    <span className="text-slate-400 font-normal">5位专家在线</span>
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5">
                    {EXPERT_AGENTS.map((agent) => {
                      const isSelected = selectedAgentId === agent.id;
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            onSelectAgent(agent.id as any);
                            setIsAgentMenuOpen(false);
                            showToast(`已切换为「${agent.name}」`);
                          }}
                          className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left transition-colors border ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 border-blue-200 font-medium'
                              : 'text-slate-700 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{agent.avatar}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 truncate">{agent.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono scale-90">{agent.badge}</span>
                            </div>
                            <div className="text-[11px] text-blue-700 font-medium truncate mt-0.5">{agent.role}</div>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{agent.description}</p>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. 【技能选择】 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSkillMenuOpen(!isSkillMenuOpen);
                  setIsUploadMenuOpen(false);
                  setIsAgentMenuOpen(false);
                  setIsMcpMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-2xs ${
                  isSkillMenuOpen
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title="配置 AI 备赛技能库"
                id="btn-skills-menu"
              >
                <span className="text-amber-500 font-bold">⚡</span>
                <span>技能 ({selectedSkillIds.length})</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 flex-shrink-0 transition-transform duration-150 ${isSkillMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Skills Popover */}
              {isSkillMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2.5 w-84 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-2 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-amber-500 font-bold text-sm">⚡</span>
                      <span className="text-xs font-bold text-slate-900">AI 备赛技能库 ({selectedSkillIds.length}/{COACH_SKILLS.length})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          COACH_SKILLS.forEach(s => {
                            if (!selectedSkillIds.includes(s.id)) onToggleSkill(s.id);
                          });
                          showToast('已开启全部 8 项备赛技能');
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        全选
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          COACH_SKILLS.forEach(s => {
                            if (selectedSkillIds.includes(s.id)) onToggleSkill(s.id);
                          });
                          showToast('已清空技能');
                        }}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
                    {COACH_SKILLS.map((skill) => {
                      const isEnabled = selectedSkillIds.includes(skill.id);
                      return (
                        <div
                          key={skill.id}
                          onClick={() => onToggleSkill(skill.id)}
                          className={`flex items-start space-x-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isEnabled
                              ? 'bg-amber-50/70 border-amber-200/90 text-amber-950'
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isEnabled ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isEnabled && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-slate-800 flex items-center space-x-1">
                                <span>{skill.icon}</span>
                                <span>{skill.name}</span>
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono scale-90">{skill.engine}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{skill.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. 【连接器选择】 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMcpMenuOpen(!isMcpMenuOpen);
                  setIsUploadMenuOpen(false);
                  setIsAgentMenuOpen(false);
                  setIsSkillMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-2xs ${
                  isMcpMenuOpen
                    ? 'bg-purple-50 border-purple-300 text-purple-900'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title="管理 MCP 数据连接器"
                id="btn-connectors-menu"
              >
                <span className="text-purple-600">🔌</span>
                <span>连接器 ({selectedMcpIds.length})</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 flex-shrink-0 transition-transform duration-150 ${isMcpMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* MCP Connectors Popover */}
              {isMcpMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2.5 w-84 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-2 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-purple-600 font-bold text-sm">🔌</span>
                      <span className="text-xs font-bold text-slate-900">MCP 协议与数据连接器 ({selectedMcpIds.length}/{MCP_CONNECTORS.length})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          MCP_CONNECTORS.forEach(c => {
                            if (!selectedMcpIds.includes(c.id)) onToggleMcp(c.id);
                          });
                          showToast('已启用全部 5 项 MCP 连接器');
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        全选
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          MCP_CONNECTORS.forEach(c => {
                            if (selectedMcpIds.includes(c.id)) onToggleMcp(c.id);
                          });
                          showToast('已断开连接器');
                        }}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
                    {MCP_CONNECTORS.map((mcp) => {
                      const isConnected = selectedMcpIds.includes(mcp.id);
                      return (
                        <div
                          key={mcp.id}
                          onClick={() => onToggleMcp(mcp.id)}
                          className={`flex items-start space-x-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isConnected
                              ? 'bg-purple-50/70 border-purple-200/90 text-purple-950'
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isConnected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isConnected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-slate-800 flex items-center space-x-1">
                                <span>{mcp.icon}</span>
                                <span>{mcp.name}</span>
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono scale-90">已连接</span>
                            </div>
                            <div className="text-[10px] text-purple-600 font-mono mt-0.5">{mcp.recordsCount}</div>
                            <p className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{mcp.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Mic & Send Button */}
          <div className="flex items-center space-x-2">
            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  showToast('语音输入已开启：随时向 AI 备赛助手讲话...');
                } else {
                  showToast('语音输入已结束');
                }
              }}
              className={`p-2 rounded-xl transition-all ${
                isRecording 
                  ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300 animate-pulse' 
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="语音输入"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isThinking}
              className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-all shadow-xs ${
                inputValue.trim() && !isThinking
                  ? 'bg-[#0071E3] hover:bg-blue-600 text-white active:scale-95'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200/60'
              }`}
              title="发送会话"
              id="btn-send-message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Files Selection Modal */}
      {isProjectFilesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">选择引用的项目文件</h3>
                  <p className="text-[10px] text-slate-500">
                    勾选项目知识库资产，AI 备赛助手将在当前会话中深度结合该文件解答
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProjectFilesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索项目报告、PPT、文档或财务模型..."
                value={fileSearchQuery}
                onChange={(e) => setFileSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
              />
            </div>

            {/* Files List */}
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filteredProjectFiles.length > 0 ? (
                filteredProjectFiles.map((file) => {
                  const isMentioned = mentionedFiles?.some(m => m.id === file.id);
                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        if (isMentioned) {
                          onRemoveMentionFile?.(file.id);
                        } else {
                          onAddMentionFile?.(file);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isMentioned
                          ? 'bg-sky-50 border-sky-200 text-sky-800'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isMentioned ? 'bg-sky-200/70 text-sky-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate text-xs">{file.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span>{file.typeLabel || '文件'}</span>
                            <span>•</span>
                            <span>{file.size}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-mono">已就绪</span>
                          </div>
                        </div>
                      </div>

                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center ml-2 flex-shrink-0 transition-colors ${
                        isMentioned 
                          ? 'bg-sky-600 border-sky-600 text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isMentioned && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  未找到匹配的项目文件
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 text-[11px]">
                已勾选 <strong className="text-sky-600 font-semibold">{mentionedFiles.length}</strong> 个项目文件
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsProjectFilesModalOpen(false);
                  showToast(`已确认关联 ${mentionedFiles.length} 个项目文件`);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs transition-colors"
              >
                确定引用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
