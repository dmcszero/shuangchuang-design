import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  School, 
  Award, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { PortalRole, UserSession } from '../types';
import { UNIVERSITY_LIST, DEMO_PRESET_ACCOUNTS, PortalPresetAccount } from '../data/mockUniversities';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [activeRole, setActiveRole] = useState<PortalRole>('team_member');
  
  // Form State
  const [selectedUniversity, setSelectedUniversity] = useState<string>('同济大学');
  const [universitySearch, setUniversitySearch] = useState<string>('');
  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState<boolean>(false);
  
  const [account, setAccount] = useState<string>('S20220199');
  const [password, setPassword] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('林子越');
  const [collegeOrDept, setCollegeOrDept] = useState<string>('电子与信息工程学院');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle switching roles
  const handleRoleChange = (newRole: PortalRole) => {
    setActiveRole(newRole);
    setErrorMessage('');
    const defaultPreset = DEMO_PRESET_ACCOUNTS[newRole][0];
    if (defaultPreset) {
      setAccount(defaultPreset.account);
      setPassword(defaultPreset.passwordHint);
      setUserName(defaultPreset.name);
      setCollegeOrDept(defaultPreset.college);
      if (newRole === 'team_member' || newRole === 'school_admin') {
        setSelectedUniversity(defaultPreset.university || '同济大学');
      }
    }
  };

  // One-click demo selection
  const handleSelectPreset = (preset: PortalPresetAccount) => {
    setActiveRole(preset.role);
    setAccount(preset.account);
    setPassword(preset.passwordHint);
    setUserName(preset.name);
    setCollegeOrDept(preset.college);
    if (preset.university) {
      setSelectedUniversity(preset.university);
    }
    setErrorMessage('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.trim()) {
      setErrorMessage('请输入账号/学号/工号！');
      return;
    }
    if ((activeRole === 'team_member' || activeRole === 'school_admin') && !selectedUniversity.trim()) {
      setErrorMessage('请选择或填写所属高校！');
      return;
    }

    // Determine role label & avatar
    const roleLabels: Record<PortalRole, string> = {
      team_member: '项目组成员',
      school_admin: '学校管理端',
      mentor: '辅导导师端',
      system_admin: 'Admin超管端',
    };

    const currentPresets = DEMO_PRESET_ACCOUNTS[activeRole];
    const matchedPreset = currentPresets.find(p => p.account === account.trim()) || currentPresets[0];

    const session: UserSession = {
      role: activeRole,
      roleLabel: roleLabels[activeRole],
      name: userName || matchedPreset.name || '系统用户',
      avatar: matchedPreset?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      account: account.trim(),
      university: (activeRole === 'team_member' || activeRole === 'school_admin') ? selectedUniversity : undefined,
      college: collegeOrDept || matchedPreset?.college,
      majorOrTitle: matchedPreset?.majorOrTitle,
      projectId: matchedPreset?.projectId || (activeRole === 'team_member' ? 'proj-001' : undefined),
      projectName: matchedPreset?.projectName || (activeRole === 'team_member' ? '光子芯眸——新一代全固态硅光激光雷达芯片破壁者' : undefined),
    };

    onLoginSuccess(session);
  };

  const filteredUniversities = UNIVERSITY_LIST.filter(u => 
    u.toLowerCase().includes(universitySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Decor - Subtle light gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md z-20">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-sky-500/20">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">赛事打磨平台</span>
              <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium">
                2026大赛官方培育决策平台
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              面向高校管理端、参赛项目组、辅导专家智库与系统管理员的全流程统一门户
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span className="hidden md:inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            2026国赛标准规则库已生效
          </span>
        </div>
      </header>

      {/* Main Form Center */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
          
          {/* Left Column: 4 Portals Selector & Feature Highlights */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/80 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-md">
                  多端权限统一网关
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 tracking-tight">
                  请选择您的登录身份
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  系统划分4个业务专属端，为各端用户提供精准量身定制的工作台与数据视角。
                </p>
              </div>

              {/* 4 Portals Cards */}
              <div className="space-y-2.5">
                {/* 1. 项目组成员 */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('team_member')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                    activeRole === 'team_member'
                      ? 'bg-sky-50 border-sky-400 text-slate-900 shadow-sm ring-1 ring-sky-300'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${activeRole === 'team_member' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">【项目组成员】</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded font-medium">
                        需选高校
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      学生队长/核心成员 · 申报材料、AI体检与导师整改闭环
                    </p>
                  </div>
                </button>

                {/* 2. 学校管理端 */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('school_admin')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                    activeRole === 'school_admin'
                      ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm ring-1 ring-blue-300'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${activeRole === 'school_admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    <School className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">【学校管理端】</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                        需选高校
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      校双创院/教务处/学院秘书 · 全校备赛大盘与导师调度
                    </p>
                  </div>
                </button>

                {/* 3. 导师端 */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('mentor')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                    activeRole === 'mentor'
                      ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-sm ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${activeRole === 'mentor' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">【导师端】</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                        智库专家
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      国赛评委/创投合伙人 · 项目问诊、指导批注与工单复核
                    </p>
                  </div>
                </button>

                {/* 4. Admin端 */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('system_admin')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                    activeRole === 'system_admin'
                      ? 'bg-purple-50 border-purple-400 text-slate-900 shadow-sm ring-1 ring-purple-300'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${activeRole === 'system_admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">【Admin端】</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-medium">
                        全局总控
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      平台超级管理员 · 2026大赛官方规则配置与跨校中台权限
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom info tip */}
            <div className="pt-6 text-[11px] text-slate-500 border-t border-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>支持统一身份认证 (CAS / OAuth2.0 / 统一学工号)</span>
            </div>
          </div>

          {/* Right Column: Dynamic Form & Preset Accounts */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <div>
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <span>
                      {activeRole === 'team_member' && '【项目组成员】账号登录'}
                      {activeRole === 'school_admin' && '【学校管理端】账号登录'}
                      {activeRole === 'mentor' && '【导师端】专家评委登录'}
                      {activeRole === 'system_admin' && '【Admin端】平台总管登录'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeRole === 'team_member' && '请选择您所在的高校，并输入学号或手机号进行登录'}
                    {activeRole === 'school_admin' && '请选择您的高校，并输入教工号或双创管理员邮箱'}
                    {activeRole === 'mentor' && '输入专家智库备案编号或特聘专家手机号验证登录'}
                    {activeRole === 'system_admin' && '输入平台超级管理员安全凭证与加密密码'}
                  </p>
                </div>

                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                  2026国赛标准版
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* UNIVERSITY SELECTOR (Only required for team_member and school_admin) */}
                {(activeRole === 'team_member' || activeRole === 'school_admin') && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center">
                        <Building2 className="h-3.5 w-3.5 mr-1 text-sky-600" />
                        所属高校 (必选)
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">已选：{selectedUniversity}</span>
                    </label>

                    {/* University Picker Dropdown */}
                    <div className="relative">
                      <div
                        onClick={() => setIsUniDropdownOpen(!isUniDropdownOpen)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-sky-500 rounded-xl p-2.5 text-xs text-slate-900 flex items-center justify-between cursor-pointer transition shadow-2xs"
                      >
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-sky-600 shrink-0" />
                          <span className="font-semibold text-slate-900">{selectedUniversity || '点击选择高校...'}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>

                      {/* Dropdown Menu */}
                      {isUniDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                          {/* Search box inside dropdown */}
                          <div className="relative mb-2">
                            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="搜索高校名称（如：同济、清华、浙大）"
                              value={universitySearch}
                              onChange={(e) => setUniversitySearch(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                              autoFocus
                            />
                          </div>

                          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                            {filteredUniversities.map((uni) => (
                              <button
                                key={uni}
                                type="button"
                                onClick={() => {
                                  setSelectedUniversity(uni);
                                  setIsUniDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                                  selectedUniversity === uni
                                    ? 'bg-sky-50 text-sky-700 font-semibold'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                <span>{uni}</span>
                                {selectedUniversity === uni && <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />}
                              </button>
                            ))}
                            {filteredUniversities.length === 0 && (
                              <div className="p-2 text-center text-slate-500">
                                <span>未检索到高校，可直接自定义使用：</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedUniversity(universitySearch);
                                    setIsUniDropdownOpen(false);
                                  }}
                                  className="mt-1 block mx-auto text-sky-600 font-bold hover:underline"
                                >
                                  使用 "{universitySearch}"
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Select Preset University Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 self-center mr-1">快捷选择:</span>
                      {['同济大学', '清华大学', '浙江大学', '上海交通大学', '华中科技大学'].map((uni) => (
                        <button
                          key={uni}
                          type="button"
                          onClick={() => setSelectedUniversity(uni)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                            selectedUniversity === uni
                              ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {uni}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACCOUNT FIELD */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    {activeRole === 'team_member' && '学号 / 注册手机号 / 邮箱'}
                    {activeRole === 'school_admin' && '教工号 / 双创管理邮箱'}
                    {activeRole === 'mentor' && '专家库编号 / 手机号'}
                    {activeRole === 'system_admin' && '超级管理员工号 / 账号'}
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="请输入账号"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* PASSWORD FIELD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-800">登录密码</label>
                    <span className="text-[11px] text-slate-400">
                      默认测试密码已自动填入
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono transition shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Extra Department / College display */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">用户姓名</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      {activeRole === 'team_member' ? '所属学院与专业' : activeRole === 'school_admin' ? '主管机构/院系' : '机构/专长标签'}
                    </label>
                    <input
                      type="text"
                      value={collegeOrDept}
                      onChange={(e) => setCollegeOrDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2 text-sm mt-4"
                >
                  <span>进入 {activeRole === 'team_member' ? '【项目组成员】工作台' : activeRole === 'school_admin' ? '【学校管理端】大盘' : activeRole === 'mentor' ? '【导师端】评审系统' : '【Admin端】管理中枢'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* One-Click Demo Preset Accounts Section */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                  当前端推荐测试账号 (点击一键免密登入)
                </span>
                <span className="text-[10px] text-slate-400">免手动填写</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_PRESET_ACCOUNTS[activeRole].map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      handleSelectPreset(preset);
                      // trigger instant login for smooth experience
                      const session: UserSession = {
                        role: preset.role,
                        roleLabel: preset.role === 'team_member' ? '项目组成员' : preset.role === 'school_admin' ? '学校管理端' : preset.role === 'mentor' ? '辅导导师端' : 'Admin超管端',
                        name: preset.name,
                        avatar: preset.avatar,
                        account: preset.account,
                        university: preset.university,
                        college: preset.college,
                        majorOrTitle: preset.majorOrTitle,
                        projectId: preset.projectId,
                        projectName: preset.projectName,
                      };
                      onLoginSuccess(session);
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 rounded-xl cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={preset.avatar}
                        alt={preset.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-sky-700 transition truncate">
                            {preset.name}
                          </span>
                          {preset.university && (
                            <span className="text-[10px] bg-white border border-slate-200 text-sky-700 font-medium px-1 py-0.2 rounded shrink-0">
                              {preset.university}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {preset.title} · {preset.account}
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600 transition shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Global Minimalist Footer */}
      <footer className="h-12 border-t border-slate-200 bg-white text-center flex items-center justify-center text-[11px] text-slate-400 px-4">
        <span>2026 中国国际大学生创新大赛 · 高校双创管理中枢决策平台 | 账号体系与四端权限调度架构</span>
      </footer>
    </div>
  );
}
