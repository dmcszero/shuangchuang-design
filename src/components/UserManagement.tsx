import { useState, FormEvent } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Shield, 
  Building2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  KeyRound, 
  RefreshCw,
  X,
  Sparkles,
  GraduationCap,
  Award,
  UserCheck
} from 'lucide-react';
import { SystemUser, MOCK_USERS } from '../data/mockUsersAndTeams';

interface UserManagementProps {
  onOpenProject?: (projectId: string) => void;
}

export default function UserManagement({ onOpenProject }: UserManagementProps) {
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<SystemUser['role']>('student_leader');
  const [newUserCollege, setNewUserCollege] = useState('电子与信息工程学院');
  const [newUserId, setNewUserId] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        showToast(`已${nextStatus === 'active' ? '启用' : '停用'}用户【${u.name}】账号权限`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleResetPassword = (userName: string) => {
    showToast(`已向用户【${userName}】绑定的企业微信及邮箱发送临时密码重置链接`);
  };

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const roleMap: Record<SystemUser['role'], string> = {
      super_admin: '校级超级管理员',
      college_coordinator: '学院联络秘书',
      mentor: '评审专家 / 导师',
      student_leader: '学生项目负责人',
      advisor: '指导教师'
    };

    const newUser: SystemUser = {
      id: `user-${Date.now().toString().slice(-4)}`,
      name: newUserName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      staffOrStudentId: newUserId || `ID${Math.floor(100000 + Math.random() * 900000)}`,
      email: newUserEmail || `${newUserName.toLowerCase()}@university.edu.cn`,
      phone: newUserPhone || '138-0000-0000',
      role: newUserRole,
      roleLabel: roleMap[newUserRole],
      college: newUserCollege,
      associatedProjectsCount: 0,
      status: 'active',
      lastLogin: '未登录',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserId('');
    setNewUserEmail('');
    setNewUserPhone('');
    showToast(`成功创建并初始化用户【${newUser.name}】(${newUser.roleLabel})`);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.staffOrStudentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.college.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesCollege = collegeFilter === 'all' || u.college === collegeFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesCollege && matchesStatus;
  });

  const collegesList = Array.from(new Set(users.map(u => u.college)));

  return (
    <div id="user-management-module" className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Metric Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">高校双创用户与权限管理</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
              多角色权限矩阵
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            统一维护校级双创管理者、二级学院秘书、评审专家智库、指导教师及参赛学生团队账号与授权范围
          </p>
        </div>

        <button
          id="btn-add-user"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition shrink-0"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          新增注册用户
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">全校注册用户</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{users.length + 333} <span className="text-xs font-normal text-slate-400">人</span></div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center font-medium">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            正常活跃账号率 98.2%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">专家与导师智库</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">48 <span className="text-xs font-normal text-slate-400">位</span></div>
          <div className="text-[11px] text-slate-500 mt-1">
            含18位校外投融资及国赛评委
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">学院联络秘书</span>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-2">26 <span className="text-xs font-normal text-slate-400">个学院</span></div>
          <div className="text-[11px] text-slate-500 mt-1">
            已实现全校二级学院全覆盖
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">学生项目申报骨干</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">268 <span className="text-xs font-normal text-slate-400">人</span></div>
          <div className="text-[11px] text-slate-500 mt-1">
            绑定 82 个正式申报项目
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索姓名、工号/学号、邮箱..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">全部角色 (All Roles)</option>
              <option value="super_admin">校级超级管理员</option>
              <option value="college_coordinator">学院联络秘书</option>
              <option value="mentor">评审专家 / 导师智库</option>
              <option value="advisor">项目指导教师</option>
              <option value="student_leader">学生项目负责人</option>
            </select>
          </div>

          {/* College Filter */}
          <div>
            <select
              value={collegeFilter}
              onChange={e => setCollegeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">全部单位 / 学院</option>
              {collegesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">全部账号状态</option>
              <option value="active">正常启用 (Active)</option>
              <option value="inactive">暂停授权 (Inactive)</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">用户姓名 / 工工号</th>
                <th className="py-3 px-4">系统身份与角色</th>
                <th className="py-3 px-4">所属单位 / 学院</th>
                <th className="py-3 px-4">关联项目 / 指导数</th>
                <th className="py-3 px-4">联系方式</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    没有匹配的用户记录
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isOnline = user.lastLogin === '刚刚' || user.lastLogin.includes('分钟');
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-8 w-8 rounded-full object-cover border border-slate-200"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                              user.status === 'active' ? (isOnline ? 'bg-emerald-500' : 'bg-slate-300') : 'bg-rose-500'
                            }`} />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{user.staffOrStudentId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                          user.role === 'super_admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : user.role === 'mentor'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : user.role === 'college_coordinator'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : user.role === 'advisor'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          <Shield className="h-3 w-3 mr-1 opacity-70" />
                          {user.roleLabel}
                        </span>
                      </td>

                      {/* College */}
                      <td className="py-3 px-4 text-slate-800">
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{user.college}</span>
                        </div>
                      </td>

                      {/* Associated Projects */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900">{user.associatedProjectsCount}</span>
                        <span className="text-slate-400 text-[11px] ml-1">项</span>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 space-y-0.5">
                        <div className="flex items-center text-[11px] text-slate-600">
                          <Mail className="h-3 w-3 mr-1 text-slate-400" />
                          <span className="truncate max-w-[140px]">{user.email}</span>
                        </div>
                        <div className="flex items-center text-[11px] text-slate-500">
                          <Phone className="h-3 w-3 mr-1 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="点击切换启用/停用状态"
                        >
                          {user.status === 'active' ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" /> 正常启用
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1 text-rose-600" /> 暂停访问
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleResetPassword(user.name)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition inline-flex items-center"
                          title="重置初始密码"
                        >
                          <KeyRound className="h-3 w-3 mr-1" />
                          重置密码
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>共显示 {filteredUsers.length} 位注册账号</span>
          <span>按校级统一身份认证系统 (CAS/OAuth2) 权限策略实时同步</span>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">录入新用户与分配权限</h3>
                  <p className="text-[11px] text-slate-500">支持批量开通专家评委、学院工作组及参赛骨干权限</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">真实姓名 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：李晓明"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">学号 / 教工号 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：T20240982 / S2023..."
                    value={newUserId}
                    onChange={e => setNewUserId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">角色类型 *</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as SystemUser['role'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="student_leader">学生项目负责人 (申报权限)</option>
                    <option value="advisor">项目指导教师 (指导权限)</option>
                    <option value="mentor">评审专家 / 导师智库 (打分与督导)</option>
                    <option value="college_coordinator">学院联络秘书 (院赛初审)</option>
                    <option value="super_admin">校级超级管理员 (全量权限)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">所属单位 / 学院 *</label>
                  <select
                    value={newUserCollege}
                    onChange={e => setNewUserCollege(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="电子与信息工程学院">电子与信息工程学院</option>
                    <option value="计算机科学与技术学院">计算机科学与技术学院</option>
                    <option value="生命科学学院">生命科学学院</option>
                    <option value="医学技术与生物医学工程学院">医学技术与生物医学工程学院</option>
                    <option value="经济管理学院">经济管理学院</option>
                    <option value="创新创业学院">创新创业学院</option>
                    <option value="外部特聘专家库">外部特聘专家库</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">电子邮箱</label>
                  <input
                    type="email"
                    placeholder="user@university.edu.cn"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">手机号码</label>
                  <input
                    type="tel"
                    placeholder="138-xxxx-xxxx"
                    value={newUserPhone}
                    onChange={e => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600 mr-1" />
                  初始安全策略提示
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  账号开通后将自动下发短信及激活邮件。首次登录需经校内短信两步验证，并强制修改默认初始密码。
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-xs transition"
                >
                  确认开通账号
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
