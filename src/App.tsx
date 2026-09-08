import React, { useState, useEffect } from 'react';
import Sidebar, { TabType } from './components/Sidebar';
import TopHeader from './components/TopHeader';
import CockpitDashboard from './components/CockpitDashboard';
import ScreeningHub from './components/ScreeningHub';
import MentorshipDispatch from './components/MentorshipDispatch';
import SupervisionClosure from './components/SupervisionClosure';
import MilestoneKanban from './components/MilestoneKanban';
import UserManagement from './components/UserManagement';
import TeamManagement from './components/TeamManagement';
import KnowledgeBaseManagement from './components/KnowledgeBaseManagement';
import PlatformKnowledgeBaseManagement from './components/PlatformKnowledgeBaseManagement';
import MentorPoolManagement from './components/MentorPoolManagement';
import PlatformMentorPoolManagement from './components/PlatformMentorPoolManagement';
import ProjectDetailDrawer from './components/ProjectDetailDrawer';
import RulesConfigModal from './components/RulesConfigModal';
import BatchImportModal from './components/BatchImportModal';
import ReportExportModal from './components/ReportExportModal';
import LoginPage from './components/LoginPage';
import ProjectMemberWorkbench from './components/ProjectMemberWorkbench';

// Shuangchuang-AI integrated components
import SceneAICoach from './components/SceneAICoach';
import SceneDefenseTraining from './components/SceneDefenseTraining';
import { SceneGuidanceWorkbench } from './components/SceneGuidanceWorkbench';
import RightWorkspacePanel from './components/RightWorkspacePanel';

import { mockProjects } from './data/mockProjects';
import { mockMentors, mockWorkOrders, mockCohortTasks, mockAlerts } from './data/mockMentors';
import { initialProjectSpaces, initialMergedSessions } from './data/mockSpaceData';
import { 
  ProjectItem, 
  SupervisionWorkOrder, 
  CohortBatchTask, 
  UserSession,
  ProjectSpace,
  CoachSession,
  AssociatedFileItem
} from './types';

export default function App() {
  // Authentication & Session State
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('ai_studio_innovation_session_2026');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (session?.role === 'team_member') return 'coach';
    if (session?.role === 'mentor') return 'supervision';
    if (session?.role === 'system_admin') return 'mentors_pool';
    return 'cockpit';
  });
  
  // Data State - Existing Management Platform
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);
  const [mentors, setMentors] = useState(mockMentors);
  const [workOrders, setWorkOrders] = useState<SupervisionWorkOrder[]>(mockWorkOrders);
  const [cohortTasks, setCohortTasks] = useState<CohortBatchTask[]>(mockCohortTasks);
  const [alerts] = useState(mockAlerts);

  // Data State - Shuangchuang-AI Unified Sessions
  const [spaces, setSpaces] = useState<ProjectSpace[]>(initialProjectSpaces);
  const [standaloneSessions, setStandaloneSessions] = useState<CoachSession[]>(initialMergedSessions);
  const [activeSpaceId, setActiveSpaceId] = useState<string>('none');
  const [activeSessionId, setActiveSessionId] = useState<string>(initialMergedSessions[0]?.id || 'sess-init-1');

  // Modals & Drawers State
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Global Active Project for Team Member (persists throughout session)
  const [activeTeamProjectId, setActiveTeamProjectId] = useState<string>(() => {
    return session?.projectId || mockProjects[0]?.id || 'proj-001';
  });

  // Global Left Sidebar Collapse State (across all roles)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Right Independent Workspace Expand/Collapse & Tabs State (Placed at the very right of the entire page)
  const [isRightWorkspaceOpen, setIsRightWorkspaceOpen] = useState(true);
  
  // Calculate initial right workspace width for 6:4 default ratio (right workspace is exactly 40%)
  const calculateDefaultRightWidth = () => {
    if (typeof window === 'undefined') return 560;
    const sidebarWidth = isSidebarCollapsed ? 64 : 240;
    const availableWidth = window.innerWidth - sidebarWidth;
    return Math.max(300, Math.round(availableWidth * 0.4));
  };

  const [rightWorkspaceWidthPx, setRightWorkspaceWidthPx] = useState<number>(calculateDefaultRightWidth);
  const [isDraggingWorkspace, setIsDraggingWorkspace] = useState<boolean>(false);
  const [isWorkspaceExpandedFull, setIsWorkspaceExpandedFull] = useState<boolean>(false);
  const [activeWorkspaceFileId, setActiveWorkspaceFileId] = useState<string>('art-ppt-1');
  const [openWorkspaceTabs, setOpenWorkspaceTabs] = useState<string[]>(['art-ppt-1', 'art-xlsx-1', 'art-doc-1']);

  const handleOpenFileInRightWorkspace = (file: AssociatedFileItem) => {
    setIsRightWorkspaceOpen(true);
    setActiveWorkspaceFileId(file.id);
    setOpenWorkspaceTabs(prev => {
      if (!prev.includes(file.id)) {
        return [...prev, file.id];
      }
      return prev;
    });
  };

  const handleCloseWorkspaceTab = (fileId: string) => {
    setOpenWorkspaceTabs(prev => {
      const next = prev.filter(t => t !== fileId);
      if (activeWorkspaceFileId === fileId && next.length > 0) {
        setActiveWorkspaceFileId(next[next.length - 1]);
      }
      return next;
    });
  };

  const handleAddWorkspaceTab = (fileId: string) => {
    if (!openWorkspaceTabs.includes(fileId)) {
      setOpenWorkspaceTabs(prev => [...prev, fileId]);
    }
    setActiveWorkspaceFileId(fileId);
  };

  // Window resize handler: Keep right workspace within reasonable bounds
  useEffect(() => {
    const handleResize = () => {
      const sidebarWidth = isSidebarCollapsed ? 64 : 240;
      const availableWidth = window.innerWidth - sidebarWidth;
      const maxAllowed = Math.max(300, availableWidth - 360);
      setRightWorkspaceWidthPx(prev => Math.min(Math.max(280, prev), maxAllowed));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  // Pointer drag-to-resize handler: 100% pixel-accurate follower
  const handlePointerDownResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDraggingWorkspace(true);
  };

  const handlePointerMoveResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingWorkspace) return;
    const windowWidth = window.innerWidth;
    const sidebarWidth = isSidebarCollapsed ? 64 : 240;
    const availableWidth = windowWidth - sidebarWidth;
    if (availableWidth <= 0) return;

    // Right workspace width is exactly the distance from the right edge of screen to mouse pointer
    const rawRightWidth = windowWidth - e.clientX;
    const minWidth = 300;
    const maxWidth = Math.max(minWidth, availableWidth - 360);
    const clamped = Math.min(Math.max(rawRightWidth, minWidth), maxWidth);

    setRightWorkspaceWidthPx(clamped);
  };

  const handlePointerUpResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingWorkspace) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDraggingWorkspace(false);
    }
  };

  // Global window mousemove/mouseup fallback guarantee
  useEffect(() => {
    if (!isDraggingWorkspace) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const sidebarWidth = isSidebarCollapsed ? 64 : 240;
      const availableWidth = windowWidth - sidebarWidth;
      if (availableWidth <= 0) return;

      const rawRightWidth = windowWidth - e.clientX;
      const minWidth = 300;
      const maxWidth = Math.max(minWidth, availableWidth - 360);
      const clamped = Math.min(Math.max(rawRightWidth, minWidth), maxWidth);
      setRightWorkspaceWidthPx(clamped);
    };

    const handleWindowMouseUp = () => {
      setIsDraggingWorkspace(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDraggingWorkspace, isSidebarCollapsed]);

  // Reset to exact 6:4 default ratio on double click
  const handleResetWorkspaceRatio = () => {
    const sidebarWidth = isSidebarCollapsed ? 64 : 240;
    const availableWidth = window.innerWidth - sidebarWidth;
    setRightWorkspaceWidthPx(Math.round(availableWidth * 0.4));
  };

  // Keyboard shortcuts: Ctrl/Cmd+B for Left Sidebar, Ctrl/Cmd+J for Right Independent Workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsRightWorkspaceOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsWorkspaceExpandedFull(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem('ai_studio_innovation_session_2026', JSON.stringify(newSession));
    } catch (e) {
      console.error(e);
    }

    if (newSession.role === 'team_member') {
      setActiveTab('coach');
      const defaultProjId = newSession.projectId || projects[0]?.id || 'proj-001';
      setActiveTeamProjectId(defaultProjId);
      const myProj = projects.find(p => p.id === defaultProjId) || projects[0];
      setSelectedProject(myProj);
    } else if (newSession.role === 'mentor') {
      setActiveTab('supervision');
    } else if (newSession.role === 'system_admin') {
      setActiveTab('mentors_pool');
    } else {
      setActiveTab('cockpit');
    }
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem('ai_studio_innovation_session_2026');
    } catch (e) {
      console.error(e);
    }
  };

  // Spaces & Sessions Handlers
  const handleSelectSpace = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    if (spaceId === 'none') {
      if (standaloneSessions.length > 0) {
        setActiveSessionId(standaloneSessions[0].id);
      }
    } else {
      const sp = spaces.find(s => s.id === spaceId);
      if (sp && sp.sessions.length > 0) {
        setActiveSessionId(sp.sessions[0].id);
      }
    }
  };

  const handleSelectSession = (spaceId: string, sessionId: string) => {
    setActiveSpaceId(spaceId);
    setActiveSessionId(sessionId);
  };

  const handleCreateSpace = (newSpaceData: { name: string; trackTag: string; school: string; leader: string }) => {
    const newId = `space-${Date.now()}`;
    const initialSession: CoachSession = {
      id: `sess-${Date.now()}`,
      title: '新建备赛空间专属咨询会话',
      time: '刚刚',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'coach',
          type: 'text',
          text: `已为你成功创建【${newSpaceData.name}】独立备赛空间！赛道：【${newSpaceData.trackTag}】，工作区文档与专家微调规则已就绪。`,
          timestamp: '刚刚'
        }
      ]
    };

    const newSpace: ProjectSpace = {
      id: newId,
      name: newSpaceData.name,
      trackTag: newSpaceData.trackTag as any,
      school: newSpaceData.school,
      leader: newSpaceData.leader,
      stage: 'L2',
      sessions: [initialSession],
      activeSessionId: initialSession.id,
      workspace: {
        localPath: `~/Workspaces/${newSpaceData.name.replace(/\s+/g, '-').toLowerCase()}`,
        cloudBucket: `oss://innov-cloud/spaces/${newId}/`,
        cloudSyncStatus: 'synced',
        lastSyncTime: '刚刚',
        totalFiles: 3,
        syncRate: '100%'
      }
    };

    setSpaces(prev => [newSpace, ...prev]);
    setActiveSpaceId(newId);
    setActiveSessionId(initialSession.id);
    setActiveTab('coach');
  };

  const handleCreateSession = (spaceId: string) => {
    const newSessionId = `sess-${Date.now()}`;
    const newSession: CoachSession = {
      id: newSessionId,
      title: '新对话咨询会话',
      time: '刚刚',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'coach',
          type: 'text',
          text: '你好！新的备赛会话已建立。你可以向我发起关于PPT排版、答辩防守、市场测算或商业模式的咨询。',
          timestamp: '刚刚'
        }
      ]
    };

    if (spaceId === 'none') {
      setStandaloneSessions(prev => [newSession, ...prev]);
      setActiveSpaceId('none');
      setActiveSessionId(newSessionId);
    } else {
      setSpaces(prev => prev.map(s => {
        if (s.id === spaceId) {
          return {
            ...s,
            sessions: [newSession, ...s.sessions]
          };
        }
        return s;
      }));
      setActiveSpaceId(spaceId);
      setActiveSessionId(newSessionId);
    }
    setActiveTab('coach');
  };

  const handleDeleteSession = (spaceId: string, sessionId: string) => {
    if (spaceId === 'none') {
      setStandaloneSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remaining = standaloneSessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
        }
      }
    } else {
      setSpaces(prev => prev.map(s => {
        if (s.id === spaceId) {
          const remaining = s.sessions.filter(sess => sess.id !== sessionId);
          return {
            ...s,
            sessions: remaining
          };
        }
        return s;
      }));
    }
  };

  const handleUpdateSessionTitle = (spaceId: string, sessionId: string, newTitle: string) => {
    if (spaceId === 'none') {
      setStandaloneSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));
    } else {
      setSpaces(prev => prev.map(s => {
        if (s.id === spaceId) {
          return {
            ...s,
            sessions: s.sessions.map(sess => sess.id === sessionId ? { ...sess, title: newTitle } : sess)
          };
        }
        return s;
      }));
    }
  };

  const handleSyncWorkspace = (spaceId: string) => {
    setSpaces(prev => prev.map(s => {
      if (s.id === spaceId && s.workspace) {
        return {
          ...s,
          workspace: {
            ...s.workspace,
            lastSyncTime: '刚刚',
            cloudSyncStatus: 'synced'
          }
        };
      }
      return s;
    }));
  };

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleSelectProjectById = (projectId: string) => {
    const found = projects.find(p => p.id === projectId);
    if (found) {
      handleSelectProject(found);
    }
  };

  const handleBatchImportComplete = (newProjects: ProjectItem[]) => {
    setProjects(newProjects);
    setIsImportModalOpen(false);
  };

  const handleAddNewCohortTask = (newTask: CohortBatchTask) => {
    setCohortTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateWorkOrder = (updated: SupervisionWorkOrder) => {
    setWorkOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  const handleOpenAssignMentor = () => {
    setIsDrawerOpen(false);
    setActiveTab('mentorship');
  };

  // If not logged in, render the 4-portal Login Page
  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Get active team project for member (globally selected from sidebar)
  const currentMemberProject = projects.find(p => p.id === activeTeamProjectId) || 
                               projects.find(p => p.id === session.projectId) || 
                               projects[0];
  const currentActiveSpace = spaces.find(s => s.id === activeSpaceId) || null;

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white ${isDraggingWorkspace ? 'cursor-col-resize select-none' : ''}`}>
      {/* Left Sidebar: Role-based Navigation & Sessions/Spaces Management */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        onLogout={handleLogout}
        onOpenBatchImport={() => setIsImportModalOpen(true)}
        onOpenReportExport={() => setIsReportModalOpen(true)}
        onOpenRulesConfig={() => setIsRulesModalOpen(true)}
        sessions={standaloneSessions}
        standaloneSessions={standaloneSessions}
        activeSpaceId={activeSpaceId}
        activeSessionId={activeSessionId}
        onSelectSpace={handleSelectSpace}
        onSelectSession={(sessionId, _legacyId) => {
          handleSelectSession('none', sessionId);
        }}
        onCreateSpace={handleCreateSpace}
        onCreateSession={() => handleCreateSession('none')}
        onDeleteSession={(sessionId, _legacyId) => {
          handleDeleteSession('none', sessionId);
        }}
        projects={projects}
        selectedProjectId={currentMemberProject?.id}
        onSelectProjectItem={(projId) => {
          setActiveTeamProjectId(projId);
          const p = projects.find(proj => proj.id === projId);
          if (p) setSelectedProject(p);
        }}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Right Column: Clean Top Status Bar & Workspace */}
      <div className={`flex-1 flex flex-col h-full min-w-0 ${
        ['coach', 'guidance_workbench'].includes(activeTab) 
          ? 'overflow-hidden' 
          : 'overflow-y-auto'
      }`}>
        {/* Top Status Bar */}
        <TopHeader
          activeTab={activeTab}
          session={session}
          onLogout={handleLogout}
          onOpenRulesConfig={() => setIsRulesModalOpen(true)}
          alerts={alerts}
          onSelectProjectFromAlert={handleSelectProjectById}
          currentProject={currentMemberProject}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          isRightWorkspaceOpen={isRightWorkspaceOpen}
          onToggleRightWorkspace={() => setIsRightWorkspaceOpen(prev => !prev)}
          activeSessionTitle={
            (activeSpaceId === 'none'
              ? standaloneSessions.find(s => s.id === activeSessionId)?.title
              : currentActiveSpace?.sessions?.find(s => s.id === activeSessionId)?.title) || '规划场景深度演进路径'
          }
        />

        {/* Main Content Area */}
        <main className={`flex-1 min-w-0 ${
          ['coach', 'guidance_workbench'].includes(activeTab)
            ? 'h-[calc(100vh-4rem)] overflow-hidden p-0 space-y-0 flex flex-col'
            : 'p-4 sm:p-6 lg:p-8 space-y-6'
        }`}>
          {/* Shuangchuang-AI Integrated Modules */}
          {activeTab === 'coach' && (
            <SceneAICoach
              onNavigateToScene={(sceneId) => setActiveTab(sceneId as TabType)}
              activeSpace={currentActiveSpace}
              activeSpaceId={activeSpaceId}
              spaces={spaces}
              standaloneSessions={standaloneSessions}
              onSelectSpace={handleSelectSpace}
              onCreateSpace={handleCreateSpace}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onCreateSession={handleCreateSession}
              onSyncWorkspace={handleSyncWorkspace}
              onUpdateSessionTitle={handleUpdateSessionTitle}
              isRightWorkspaceOpen={isRightWorkspaceOpen}
              onToggleRightWorkspace={() => setIsRightWorkspaceOpen(prev => !prev)}
              onSetRightWorkspaceOpen={(open) => setIsRightWorkspaceOpen(open)}
              onOpenFileInRightWorkspace={handleOpenFileInRightWorkspace}
            />
          )}

          {activeTab === 'guidance_workbench' && (
            <SceneGuidanceWorkbench
              projects={projects}
              selectedProject={currentMemberProject}
              onSelectProject={handleSelectProject}
              session={session}
            />
          )}

          {activeTab === 'defense_training' && (
            <SceneDefenseTraining
              currentProject={currentMemberProject}
              session={session}
            />
          )}

          {/* Existing Management Platform Modules */}
          {activeTab === 'my_project' && (
            <ProjectMemberWorkbench
              session={session}
              project={currentMemberProject}
              workOrders={workOrders}
              onUpdateWorkOrder={handleUpdateWorkOrder}
              onOpenRulesConfig={() => setIsRulesModalOpen(true)}
            />
          )}

          {activeTab === 'cockpit' && (
            <CockpitDashboard
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenReportExport={() => setIsReportModalOpen(true)}
              onOpenBatchImport={() => setIsImportModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'screening' && (
            <ScreeningHub
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenBatchImport={() => setIsImportModalOpen(true)}
              onOpenAssignMentor={handleOpenAssignMentor}
            />
          )}

          {activeTab === 'mentorship' && (
            <MentorshipDispatch
              mentors={mentors}
              projects={projects}
              cohortTasks={cohortTasks}
              onSelectProject={handleSelectProject}
              onAddNewCohortTask={handleAddNewCohortTask}
              onNavigateToMentorPool={() => setActiveTab('mentors_pool')}
            />
          )}

          {activeTab === 'supervision' && (
            <SupervisionClosure
              workOrders={workOrders}
              projects={projects}
              onSelectProject={handleSelectProject}
              onUpdateWorkOrder={handleUpdateWorkOrder}
            />
          )}

          {activeTab === 'milestones' && (
            <MilestoneKanban
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenReportExport={() => setIsReportModalOpen(true)}
            />
          )}

          {activeTab === 'mentors_pool' && (
            session?.role === 'system_admin' ? (
              <PlatformMentorPoolManagement />
            ) : (
              <MentorPoolManagement
                mentors={mentors}
                onUpdateMentors={setMentors}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )
          )}

          {activeTab === 'knowledge_base' && (
            session?.role === 'system_admin' ? (
              <PlatformKnowledgeBaseManagement />
            ) : (
              <KnowledgeBaseManagement />
            )
          )}

          {activeTab === 'users_management' && (
            <UserManagement
              onOpenProject={handleSelectProjectById}
            />
          )}

          {activeTab === 'teams_management' && (
            <TeamManagement
              onSelectProject={handleSelectProjectById}
            />
          )}
        </main>

        {/* Global Compact Footer (shown only for regular dashboard tabs) */}
        {!['coach', 'guidance_workbench'].includes(activeTab) && (
          <footer className="border-t border-slate-200 bg-white py-2.5 px-6 text-center text-[11px] text-slate-400 shrink-0">
            <span>{session.university ? `${session.university} · ` : ''}2026年中国国际大学生创新大赛 · 双创数智中枢 | 4端协同 · 金牌培育 · 全流程督导闭环</span>
          </footer>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 中间对话主体与右侧独立区域交界分割线：支持鼠标左右拖动改变窗口大小 */}
      {/* 1. 外层宽度恒定为 4px (w-1)，绝不改变尺寸，彻底杜绝两侧内容抖动重排 */}
      {/* 2. Pointer Capture 像素级跟随鼠标拖拽，极速流畅，双击恢复 6:4 比例 */}
      {/* 3. 当右侧处于全屏最大化展开状态时，不显示分割线                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'coach' && isRightWorkspaceOpen && !isWorkspaceExpandedFull && (
        <div
          onPointerDown={handlePointerDownResize}
          onPointerMove={handlePointerMoveResize}
          onPointerUp={handlePointerUpResize}
          onDoubleClick={handleResetWorkspaceRatio}
          className={`relative w-1 shrink-0 bg-slate-200 hover:bg-sky-500 active:bg-sky-600 cursor-col-resize select-none transition-colors z-30 flex items-center justify-center group ${
            isDraggingWorkspace ? 'bg-sky-500 shadow-xs' : ''
          }`}
          title="按住鼠标左右拖动调整窗口宽度（双击恢复 6:4 默认比例）"
        >
          {/* 绝对定位扩展热区：左右各外扩 4px (总宽 12px)，方便抓取，绝不占 flex 空间 */}
          <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize pointer-events-auto" />

          {/* 居中固定尺寸的抓取小手柄 */}
          <div className="flex flex-col space-y-1 items-center justify-center py-2 px-0.5 rounded-full bg-slate-300 group-hover:bg-white transition-colors pointer-events-none shadow-2xs">
            <div className="w-0.5 h-0.5 rounded-full bg-slate-600 group-hover:bg-sky-600" />
            <div className="w-0.5 h-0.5 rounded-full bg-slate-600 group-hover:bg-sky-600" />
            <div className="w-0.5 h-0.5 rounded-full bg-slate-600 group-hover:bg-sky-600" />
          </div>

          {/* 拖动时的实时比例提示气泡 */}
          {isDraggingWorkspace && (
            <div className="absolute top-16 -left-14 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-50 animate-in fade-in duration-75">
              对话 {Math.round(100 - (rightWorkspaceWidthPx / Math.max(window.innerWidth - (isSidebarCollapsed ? 64 : 240), 1)) * 100)}% : 独立区 {Math.round((rightWorkspaceWidthPx / Math.max(window.innerWidth - (isSidebarCollapsed ? 64 : 240), 1)) * 100)}%
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 整个页面的最右边：独立区域 (RightWorkspacePanel)              */}
      {/* 展开后，左侧的顶栏与对话主体整体向左自适应压缩收缩             */}
      {/* 全屏展开时，覆盖左侧边栏、顶部状态栏和对话主体，铺满整个网页  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'coach' && isRightWorkspaceOpen && (
        <RightWorkspacePanel
          isOpen={isRightWorkspaceOpen}
          isExpandedFull={isWorkspaceExpandedFull}
          onToggleExpandedFull={() => setIsWorkspaceExpandedFull(prev => !prev)}
          widthPx={rightWorkspaceWidthPx}
          isDragging={isDraggingWorkspace}
          onClose={() => {
            setIsWorkspaceExpandedFull(false);
            setIsRightWorkspaceOpen(false);
          }}
          activeFileId={activeWorkspaceFileId}
          onSelectFile={(id) => setActiveWorkspaceFileId(id)}
          openTabs={openWorkspaceTabs}
          onCloseTab={handleCloseWorkspaceTab}
          onAddTab={handleAddWorkspaceTab}
          projectName={currentActiveSpace?.name || '安里AI / 智耘农业'}
        />
      )}

      {/* Project Detail Deep-Dive Drawer */}
      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        workOrders={workOrders}
        onOpenAssignMentor={handleOpenAssignMentor}
      />

      {/* Rules Config Modal */}
      <RulesConfigModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Batch Import & Auto-Screening Modal */}
      <BatchImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleBatchImportComplete}
      />

      {/* Executive Report Export Modal */}
      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
