/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderGit2, Folder, Cloud, CloudCheck, RefreshCw, Plus, 
  MessageSquare, ChevronDown, Check, Copy, Trash2, X, Sparkles, Layers
} from 'lucide-react';
import { CoachSpace, CoachSession } from '../data/mockSpacesData';
import { cleanSessionTitle } from '../utils/titleUtils';

interface SidebarSpaceManagerProps {
  spaces: CoachSpace[];
  activeSpaceId: string;
  activeSessionId: string;
  onSelectSpace: (spaceId: string) => void;
  onSelectSession: (spaceId: string, sessionId: string) => void;
  onCreateSession: (spaceId: string) => void;
  onDeleteSession: (spaceId: string, sessionId: string) => void;
  onCreateSpace: (space: Omit<CoachSpace, 'id' | 'sessions' | 'activeSessionId'>) => void;
  onSyncSpace: (spaceId: string) => void;
}

export default function SidebarSpaceManager({
  spaces,
  activeSpaceId,
  activeSessionId,
  onSelectSpace,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onCreateSpace,
  onSyncSpace,
}: SidebarSpaceManagerProps) {
  const [showNewSpaceModal, setShowNewSpaceModal] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // New Space Form State
  const [newSpaceName, setNewSpaceName] = useState<string>('');
  const [newSpaceTrack, setNewSpaceTrack] = useState<string>('高教主赛道 · 新工科组');
  const [newSpaceLocalDir, setNewSpaceLocalDir] = useState<string>('');

  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0];

  const handleCopyPath = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path).catch(() => {});
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleTriggerSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncToast('正在校验本地目录与云端空间版本...');
    setTimeout(() => {
      onSyncSpace(activeSpace.id);
      setIsSyncing(false);
      setSyncToast('云端空间已实时同步完成！');
      setTimeout(() => setSyncToast(null), 2500);
    }, 1200);
  };

  const handleSubmitNewSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    const localDir = newSpaceLocalDir.trim() || `~/Workspaces/${newSpaceName.trim()}/`;
    const cleanId = newSpaceName.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const cloudUri = `cloud://spaces/${cleanId || 'space'}-${Date.now().toString().slice(-4)}`;

    onCreateSpace({
      name: newSpaceName.trim(),
      trackTag: newSpaceTrack,
      leader: '当前团队',
      school: '本校',
      localDirectory: localDir,
      cloudUri: cloudUri,
      cloudStatus: 'synced',
      cloudStatusText: '已实时同步',
      lastSyncTime: '刚刚',
    });

    setNewSpaceName('');
    setNewSpaceLocalDir('');
    setShowNewSpaceModal(false);
  };

  return (
    <div className="pt-2 border-t border-gray-100 space-y-2.5">
      {/* 1. Header: Space Management Title & Add Button */}
      <div className="flex items-center justify-between px-3">
        <span className="text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider flex items-center space-x-1.5">
          <FolderGit2 className="h-3 w-3 text-blue-500" />
          <span>备赛空间与工作区</span>
        </span>
        <button
          onClick={() => setShowNewSpaceModal(true)}
          className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5 px-1.5 py-0.5 rounded hover:bg-blue-50 transition-colors"
          title="新建备赛空间"
        >
          <Plus className="h-3 w-3" />
          <span>新空间</span>
        </button>
      </div>

      {/* 2. Space Selector & Workspace Info Card */}
      <div className="mx-1 p-2.5 rounded-xl bg-gradient-to-b from-gray-50/90 to-blue-50/30 border border-gray-200/80 shadow-2xs space-y-2.5">
        {/* Space Dropdown Selector */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>当前项目空间</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono scale-95">
              {spaces.length} 个空间
            </span>
          </div>
          <div className="relative">
            <select
              value={activeSpace.id}
              onChange={(e) => onSelectSpace(e.target.value)}
              className="w-full bg-white border border-gray-200 text-xs font-bold text-gray-900 rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-7 truncate"
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  🚀 {s.name} ({s.trackTag.split('·')[0].trim()})
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Space Tag & Leader */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-white text-gray-700 border border-gray-200 font-medium truncate max-w-[130px]">
            {activeSpace.trackTag}
          </span>
          <span className="text-gray-400 font-mono text-[9px] truncate">
            负责人: {activeSpace.leader}
          </span>
        </div>

        {/* Dedicated Workspace status: Local Dir + Cloud Space */}
        <div className="p-2 rounded-lg bg-white border border-gray-200/90 space-y-1.5">
          {/* Local Directory */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0 pr-1">
              <Folder className="h-3 w-3 text-amber-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] text-gray-400 font-medium leading-none">本地工作目录</div>
                <span className="text-[10px] text-gray-800 font-mono truncate block max-w-[125px]" title={activeSpace.localDirectory}>
                  {activeSpace.localDirectory}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => handleCopyPath(e, activeSpace.localDirectory)}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="复制本地目录路径"
            >
              {copiedPath ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          {/* Cloud Space Sync */}
          <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0 pr-1">
              <Cloud className="h-3 w-3 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] text-gray-400 font-medium leading-none">云端同步空间</div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
                  }`} />
                  <span className="text-[10px] text-emerald-700 font-medium truncate block">
                    {isSyncing ? '同步中...' : activeSpace.cloudStatusText}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className={`p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all flex-shrink-0 ${
                isSyncing ? 'text-blue-600 animate-spin' : ''
              }`}
              title="触发双向同步"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Sync Toast banner */}
        {syncToast && (
          <div className="p-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[9px] font-medium flex items-center space-x-1 animate-fadeIn">
            <Sparkles className="h-2.5 w-2.5 text-blue-600 flex-shrink-0" />
            <span className="truncate">{syncToast}</span>
          </div>
        )}
      </div>

      {/* 3. Sessions List Under Current Space */}
      <div className="space-y-1 pt-1">
        {/* Sessions Title & Add Session Button */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider">
              会话列表
            </span>
            <span className="text-[9px] font-mono bg-gray-100 text-gray-500 px-1 rounded">
              {activeSpace.sessions.length}
            </span>
          </div>
          <button
            onClick={() => onCreateSession(activeSpace.id)}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5 px-1.5 py-0.5 rounded hover:bg-blue-50 transition-colors"
            title="在当前空间新建咨询会话"
          >
            <Plus className="h-3 w-3" />
            <span>新建会话</span>
          </button>
        </div>

        {/* Session Items */}
        <div className="space-y-0.5 px-1 max-h-56 overflow-y-auto pr-1">
          {activeSpace.sessions.map((sess) => {
            const isSessionActive = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => onSelectSession(activeSpace.id, sess.id)}
                className={`w-full group px-2.5 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSessionActive
                    ? 'bg-blue-50 border border-blue-200/80 text-blue-900 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0 pr-1">
                  <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${
                    isSessionActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span className="text-xs truncate" title={cleanSessionTitle(sess.title)}>
                    {cleanSessionTitle(sess.title)}
                  </span>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  <span className={`text-[9px] font-mono ${
                    isSessionActive ? 'text-blue-500 font-medium' : 'text-gray-400'
                  }`}>
                    {sess.time}
                  </span>

                  {/* Delete session button on hover (prevent deleting if only 1 remains) */}
                  {activeSpace.sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(activeSpace.id, sess.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-red-600 rounded transition-all ml-1"
                      title="删除该会话"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Modal: Create New Space */}
      {showNewSpaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 border border-gray-200 space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderGit2 className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">新建备赛空间</h3>
              </div>
              <button 
                onClick={() => setShowNewSpaceModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewSpace} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  空间/项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 智农云眼 / 声纹智医"
                  value={newSpaceName}
                  onChange={(e) => {
                    setNewSpaceName(e.target.value);
                    if (!newSpaceLocalDir) {
                      setNewSpaceLocalDir(`~/Workspaces/${e.target.value}/`);
                    }
                  }}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  参赛赛道与组别
                </label>
                <select
                  value={newSpaceTrack}
                  onChange={(e) => setNewSpaceTrack(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="高教主赛道 · 新工科组">高教主赛道 · 新工科组</option>
                  <option value="高教主赛道 · 新农科组">高教主赛道 · 新农科组</option>
                  <option value="高教主赛道 · 新医科组">高教主赛道 · 新医科组</option>
                  <option value="青年红色筑梦之旅 · 乡村振兴组">青年红色筑梦之旅 · 乡村振兴组</option>
                  <option value="产业命题赛道 · 专精特新组">产业命题赛道 · 专精特新组</option>
                  <option value="创客组 · 种子项目">创客组 · 种子项目</option>
                </select>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-gray-700 flex items-center space-x-1 mb-1">
                    <Folder className="h-3 w-3 text-amber-500" />
                    <span>独立本地工作目录</span>
                  </label>
                  <input
                    type="text"
                    value={newSpaceLocalDir || `~/Workspaces/${newSpaceName || '新项目'}/`}
                    onChange={(e) => setNewSpaceLocalDir(e.target.value)}
                    className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5 block">
                    用于存放BP、PPT与本地评审素材源文件
                  </span>
                </div>

                <div className="pt-1.5 border-t border-gray-200/60">
                  <div className="text-[11px] font-semibold text-gray-700 flex items-center space-x-1">
                    <CloudCheck className="h-3 w-3 text-blue-500" />
                    <span>云端空间同步</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                    cloud://spaces/{newSpaceName ? newSpaceName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') : 'new-space'}/
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSpaceModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  确认创建空间
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
