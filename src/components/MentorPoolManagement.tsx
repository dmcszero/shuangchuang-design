import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  Filter, 
  Download, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { MentorExpert, TrackType } from '../types';

interface MentorPoolManagementProps {
  mentors: MentorExpert[];
  onUpdateMentors: (mentors: MentorExpert[]) => void;
  onNavigateTab?: (tab: 'mentorship' | 'screening' | 'cockpit') => void;
}

export default function MentorPoolManagement({
  mentors,
  onUpdateMentors,
  onNavigateTab,
}: MentorPoolManagementProps) {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [expertiseFilter, setExpertiseFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'busy' | 'full'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Modals & Selected Mentor
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentEditingMentor, setCurrentEditingMentor] = useState<MentorExpert | null>(null);
  const [currentDetailMentor, setCurrentDetailMentor] = useState<MentorExpert | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setShowToastMessage] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formType, setFormType] = useState<'internal' | 'external'>('external');
  const [formRoleCategory, setFormRoleCategory] = useState<NonNullable<MentorExpert['roleCategory']>>('national_judge');
  const [formHonorTitle, setFormHonorTitle] = useState('');
  const [formAppointedYear, setFormAppointedYear] = useState('2024-2026年特聘');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWechat, setFormWechat] = useState('');
  const [formOfficeLocation, setFormOfficeLocation] = useState('');
  const [formExpertiseTags, setFormExpertiseTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [formPreferredTracks, setFormPreferredTracks] = useState<TrackType[]>(['higher_education_creative']);
  const [formMaxCapacity, setFormMaxCapacity] = useState<number>(5);
  const [formCurrentProjects, setFormCurrentProjects] = useState<number>(0);
  const [formRating, setFormRating] = useState<number>(4.9);
  const [formMentoringCount, setFormMentoringCount] = useState<number>(30);
  const [formGoldProjectsCoached, setFormGoldProjectsCoached] = useState<number>(5);
  const [formAvailability, setFormAvailability] = useState<'available' | 'busy' | 'full'>('available');
  const [formBio, setFormBio] = useState('');
  const [formTimeSlots, setFormTimeSlots] = useState<string>('周二 14:00-17:00 (线上会议), 周四 14:00-16:00 (双创楼路演厅)');

  const showToast = (msg: string) => {
    setShowToastMessage(msg);
    setTimeout(() => setShowToastMessage(null), 3200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(`${label}-${text}`);
    showToast(`已复制${label}：${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Preset Expertise Tags for quick toggling
  const COMMON_EXPERTISE_TAGS = [
    '精通硬科技壁垒',
    '商业模式闭环',
    '财务测算与估值',
    '新工科赛道专家',
    '红旅赛道专家',
    '乡村振兴利益联结',
    '新医科赛道专家',
    '医疗器械合规与注册',
    '新材料产业孵化',
    '参赛材料排版与答辩技巧',
    '职教与能工巧匠',
    '产教融合与校企协同',
    '股权结构与期权池',
    '大模型算法创新',
    '路演答辩与现场控场',
    '创业融资与股权分配'
  ];

  // Preset Avatars
  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  ];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setCurrentEditingMentor(null);
    setFormName('');
    setFormAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setFormTitle('');
    setFormOrg('');
    setFormType('external');
    setFormRoleCategory('national_judge');
    setFormHonorTitle('全国大赛资深国奖评委');
    setFormAppointedYear('2024-2026年特聘');
    setFormPhone('138-');
    setFormEmail('@');
    setFormWechat('');
    setFormOfficeLocation('校创新创业中心特聘专家工作室');
    setFormExpertiseTags(['精通硬科技壁垒', '商业模式闭环']);
    setFormPreferredTracks(['higher_education_creative', 'higher_education_startup']);
    setFormMaxCapacity(5);
    setFormCurrentProjects(0);
    setFormRating(4.9);
    setFormMentoringCount(25);
    setFormGoldProjectsCoached(3);
    setFormAvailability('available');
    setFormBio('');
    setFormTimeSlots('每周二 14:00-17:00 (线上会议), 每周五 09:30-12:00 (路演厅)');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (mentor: MentorExpert, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentEditingMentor(mentor);
    setFormName(mentor.name);
    setFormAvatar(mentor.avatar);
    setFormTitle(mentor.title);
    setFormOrg(mentor.organization);
    setFormType(mentor.type);
    setFormRoleCategory(mentor.roleCategory || (mentor.type === 'internal' ? 'academic' : 'industry'));
    setFormHonorTitle(mentor.honorTitle || '特聘双创指导专家');
    setFormAppointedYear(mentor.appointedYear || '2024-2026年特聘');
    setFormPhone(mentor.phone || '');
    setFormEmail(mentor.email || '');
    setFormWechat(mentor.wechat || '');
    setFormOfficeLocation(mentor.officeLocation || '');
    setFormExpertiseTags([...mentor.expertiseTags]);
    setFormPreferredTracks([...mentor.preferredTracks]);
    setFormMaxCapacity(mentor.maxCapacity);
    setFormCurrentProjects(mentor.currentProjectsCount);
    setFormRating(mentor.rating);
    setFormMentoringCount(mentor.mentoringCount);
    setFormGoldProjectsCoached(mentor.goldProjectsCoached);
    setFormAvailability(mentor.availability);
    setFormBio(mentor.bio);
    setFormTimeSlots(mentor.availableTimeSlots.join(', '));
    setIsEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveMentorForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formOrg.trim()) {
      showToast('请填写导师姓名、头衔职称和工作单位/学院');
      return;
    }

    const timeSlotsArray = formTimeSlots
      .split(/[,，\n]/)
      .map(s => s.trim())
      .filter(Boolean);

    if (currentEditingMentor) {
      // Update existing
      const updated: MentorExpert = {
        ...currentEditingMentor,
        name: formName.trim(),
        avatar: formAvatar || currentEditingMentor.avatar,
        title: formTitle.trim(),
        organization: formOrg.trim(),
        type: formType,
        roleCategory: formRoleCategory,
        honorTitle: formHonorTitle.trim() || undefined,
        appointedYear: formAppointedYear.trim() || undefined,
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        wechat: formWechat.trim() || undefined,
        officeLocation: formOfficeLocation.trim() || undefined,
        expertiseTags: formExpertiseTags.length > 0 ? formExpertiseTags : ['创新创业导师'],
        preferredTracks: formPreferredTracks.length > 0 ? formPreferredTracks : ['higher_education_creative'],
        maxCapacity: Number(formMaxCapacity) || 5,
        currentProjectsCount: Number(formCurrentProjects) || 0,
        rating: Number(formRating) || 4.9,
        mentoringCount: Number(formMentoringCount) || 0,
        goldProjectsCoached: Number(formGoldProjectsCoached) || 0,
        availability: formAvailability,
        bio: formBio.trim() || '特聘双创指导导师，为大赛重点项目提供高水平辅导赋能。',
        availableTimeSlots: timeSlotsArray.length > 0 ? timeSlotsArray : ['预约协商辅导时间']
      };

      const newMentors = mentors.map(m => m.id === updated.id ? updated : m);
      onUpdateMentors(newMentors);
      showToast(`导师【${updated.name}】的档案资料已更新`);
    } else {
      // Create new
      const newMentor: MentorExpert = {
        id: `mentor-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        avatar: formAvatar || PRESET_AVATARS[0],
        title: formTitle.trim(),
        organization: formOrg.trim(),
        type: formType,
        roleCategory: formRoleCategory,
        honorTitle: formHonorTitle.trim() || (formType === 'internal' ? '校内骨干学术博导' : '国赛特聘评审专家'),
        appointedYear: formAppointedYear.trim() || '2024-2026年特聘',
        phone: formPhone.trim() || '138-0000-0000',
        email: formEmail.trim() || 'mentor@univ.edu.cn',
        wechat: formWechat.trim() || undefined,
        officeLocation: formOfficeLocation.trim() || '校内双创中心专家工作室',
        expertiseTags: formExpertiseTags.length > 0 ? formExpertiseTags : ['精通硬科技壁垒', '商业模式闭环'],
        preferredTracks: formPreferredTracks.length > 0 ? formPreferredTracks : ['higher_education_creative'],
        maxCapacity: Number(formMaxCapacity) || 5,
        currentProjectsCount: Number(formCurrentProjects) || 0,
        rating: Number(formRating) || 4.95,
        mentoringCount: Number(formMentoringCount) || 10,
        goldProjectsCoached: Number(formGoldProjectsCoached) || 2,
        availability: formAvailability,
        bio: formBio.trim() || '新聘任中国国际大学生创新大赛双创指导专家，主攻关键核心技术与产业商业化闭环辅导。',
        availableTimeSlots: timeSlotsArray.length > 0 ? timeSlotsArray : ['预约协商辅导时间']
      };

      onUpdateMentors([newMentor, ...mentors]);
      showToast(`成功聘任并入库新导师【${newMentor.name}】！`);
    }

    setIsEditModalOpen(false);
  };

  // Delete Mentor
  const handleDeleteMentor = (mentorId: string, mentorName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`确认将导师【${mentorName}】从智库名册中解除聘任并移除吗？移除后常态化辅导预约将不再包含此导师。`)) {
      const remaining = mentors.filter(m => m.id !== mentorId);
      onUpdateMentors(remaining);
      if (currentDetailMentor?.id === mentorId) {
        setIsDetailModalOpen(false);
      }
      showToast(`已将导师【${mentorName}】从智库解除聘任`);
    }
  };

  // Quick Toggle Availability
  const handleQuickToggleAvailability = (mentor: MentorExpert, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextStatus: Record<MentorExpert['availability'], MentorExpert['availability']> = {
      available: 'busy',
      busy: 'full',
      full: 'available'
    };
    const next = nextStatus[mentor.availability];
    const statusText = next === 'available' ? '空闲可约' : next === 'busy' ? '档期较紧' : '负荷已满';
    const updated = mentors.map(m => m.id === mentor.id ? { ...m, availability: next } : m);
    onUpdateMentors(updated);
    showToast(`导师【${mentor.name}】的预约状态已调整为：${statusText}`);
  };

  // Export Roster to CSV
  const handleExportRoster = () => {
    const headers = [
      '导师ID',
      '姓名',
      '归属类型',
      '角色分类',
      '职称头衔',
      '单位/学院',
      '荣誉资质',
      '聘期',
      '联系电话',
      '工作邮箱',
      '微信号',
      '办公地点',
      '擅长辅导领域',
      '当前带教数',
      '最大带教容量',
      '累计辅导人次',
      '指导金奖数',
      '满意度评分',
      '预约状态'
    ];

    const rows = filteredMentors.map(m => [
      m.id,
      m.name,
      m.type === 'internal' ? '校内学术导师' : '外部特聘专家',
      getRoleCategoryLabel(m.roleCategory),
      `"${m.title.replace(/"/g, '""')}"`,
      `"${m.organization.replace(/"/g, '""')}"`,
      m.honorTitle || '',
      m.appointedYear || '',
      m.phone || '',
      m.email || '',
      m.wechat || '',
      `"${(m.officeLocation || '').replace(/"/g, '""')}"`,
      `"${m.expertiseTags.join('; ')}"`,
      m.currentProjectsCount,
      m.maxCapacity,
      m.mentoringCount,
      m.goldProjectsCoached,
      m.rating,
      m.availability === 'available' ? '空闲可约' : m.availability === 'busy' ? '档期较紧' : '负荷已满'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `高校双创导师智库名册_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('已导出导师智库名册 CSV 档案');
  };

  // Open Detail View
  const handleViewDetail = (mentor: MentorExpert) => {
    setCurrentDetailMentor(mentor);
    setIsDetailModalOpen(true);
  };

  // Tag helper
  const handleToggleTag = (tag: string) => {
    if (formExpertiseTags.includes(tag)) {
      setFormExpertiseTags(formExpertiseTags.filter(t => t !== tag));
    } else {
      setFormExpertiseTags([...formExpertiseTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (customTagInput.trim() && !formExpertiseTags.includes(customTagInput.trim())) {
      setFormExpertiseTags([...formExpertiseTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleToggleTrack = (track: TrackType) => {
    if (formPreferredTracks.includes(track)) {
      if (formPreferredTracks.length > 1) {
        setFormPreferredTracks(formPreferredTracks.filter(t => t !== track));
      }
    } else {
      setFormPreferredTracks([...formPreferredTracks, track]);
    }
  };

  // Helper Labels & Badges
  const getRoleCategoryLabel = (cat?: string) => {
    switch (cat) {
      case 'national_judge':
        return '国赛国奖评委';
      case 'investor':
        return '创投资本合伙人';
      case 'industry':
        return '领军产业高管';
      case 'legal_finance':
        return '财税法务专家';
      case 'alumni':
        return '金奖创业校友';
      case 'academic':
      default:
        return '校内学术博导';
    }
  };

  const getRoleBadgeStyle = (cat?: string) => {
    switch (cat) {
      case 'national_judge':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'investor':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'industry':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'legal_finance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'alumni':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'academic':
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const getAvailabilityBadge = (status: MentorExpert['availability']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
            空闲可约
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1" />
            档期较紧
          </span>
        );
      case 'full':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1" />
            负荷已满
          </span>
        );
    }
  };

  // Filter Mentors
  const filteredMentors = mentors.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.organization.toLowerCase().includes(q) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.wechat && m.wechat.toLowerCase().includes(q)) ||
      (m.officeLocation && m.officeLocation.toLowerCase().includes(q)) ||
      (m.honorTitle && m.honorTitle.toLowerCase().includes(q)) ||
      m.expertiseTags.some(t => t.toLowerCase().includes(q));

    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    const matchesRole = roleFilter === 'all' || m.roleCategory === roleFilter;
    const matchesExpertise = expertiseFilter === 'all' || m.expertiseTags.some(t => t.includes(expertiseFilter));
    const matchesAvailability = availabilityFilter === 'all' || m.availability === availabilityFilter;

    return matchesSearch && matchesType && matchesRole && matchesExpertise && matchesAvailability;
  });

  // Macro Metrics
  const totalMentors = mentors.length;
  const internalCount = mentors.filter(m => m.type === 'internal').length;
  const externalCount = mentors.filter(m => m.type === 'external').length;
  const nationalJudgesCount = mentors.filter(m => m.roleCategory === 'national_judge' || (m.honorTitle && m.honorTitle.includes('评委'))).length;
  const totalGoldCoached = mentors.reduce((acc, m) => acc + m.goldProjectsCoached, 0);
  const totalCurrentProjects = mentors.reduce((acc, m) => acc + m.currentProjectsCount, 0);
  const totalCapacity = mentors.reduce((acc, m) => acc + m.maxCapacity, 0);
  const availableMentorsCount = mentors.filter(m => m.availability === 'available').length;
  const avgRating = totalMentors > 0 
    ? (mentors.reduce((acc, m) => acc + m.rating, 0) / totalMentors).toFixed(2)
    : '5.00';

  return (
    <div id="mentor-pool-management" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module Header & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">全校及外部双创导师智库管理</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              高端专家库 (8大专业领域)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            统一维护校内学术博导、国奖评审专家、创投资本合伙人、产业高管及财税法务导师档案。支持导师信息添加编辑、联系方式一键联络、擅长领域标签管理与带教容量监控。
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleExportRoster}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition cursor-pointer"
            title="导出为 CSV 表格"
          >
            <Download className="h-4 w-4 mr-1.5 text-slate-400" />
            导出智库名册
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('mentorship')}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition cursor-pointer"
            >
              <Calendar className="h-4 w-4 mr-1.5 text-sky-600" />
              进入辅导调度排期
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            聘任 / 添加新导师
          </button>
        </div>
      </div>

      {/* Macro Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">智库导师总规模</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5">{totalMentors} <span className="text-xs font-normal text-slate-400">位</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">校内 {internalCount} 人 · 外部 {externalCount} 人</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">国奖评审资深专家</span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1.5">{nationalJudgesCount} <span className="text-xs font-normal text-slate-400">位</span></div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">深谙国赛/省赛评判细则</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">累计培育国金奖数</span>
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1.5">{totalGoldCoached} <span className="text-xs font-normal text-slate-400">项</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">历届中国国际创新大赛金奖</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">当前负荷容量</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-1.5">{totalCurrentProjects} <span className="text-xs font-normal text-slate-400">/ {totalCapacity} 席</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">总体负荷率 {totalCapacity > 0 ? Math.round((totalCurrentProjects / totalCapacity) * 100) : 0}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">随时空闲可约导师</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1.5">{availableMentorsCount} <span className="text-xs font-normal text-slate-400">位</span></div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">可直接发起会诊预约</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">导师库综合好评率</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
              <Star className="h-4 w-4 fill-sky-500 text-sky-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1.5">{avgRating} <span className="text-xs font-normal text-slate-400">/ 5.0</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">基于学生团队辅导后匿名打分</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索导师姓名、职称、单位、电话、邮箱、微信号或擅长领域..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Selects */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2 text-xs shrink-0">
            {/* Type */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs"
            >
              <option value="all">全部导师来源</option>
              <option value="internal">校内学术博导导师</option>
              <option value="external">外部特聘产业/评审专家</option>
            </select>

            {/* Role Category */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs"
            >
              <option value="all">全部细分角色</option>
              <option value="national_judge">国赛国奖评委</option>
              <option value="investor">创投资本合伙人</option>
              <option value="industry">领军产业高管</option>
              <option value="academic">校内学术博导</option>
              <option value="legal_finance">财税法务专家</option>
              <option value="alumni">金奖创业校友</option>
            </select>

            {/* Availability */}
            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs"
            >
              <option value="all">全部预约状态</option>
              <option value="available">空闲可约 (Available)</option>
              <option value="busy">档期较紧 (Busy)</option>
              <option value="full">负荷已满 (Full)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'card' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                卡片档案
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                列表表格
              </button>
            </div>
          </div>
        </div>

        {/* Expertise Quick Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 text-[11px]">热门擅长领域：</span>
          <button
            type="button"
            onClick={() => setExpertiseFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer ${
              expertiseFilter === 'all' 
                ? 'bg-sky-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部领域
          </button>
          {['硬科技', '商业模式', '财务', '红旅', '答辩', '医疗', '职教', '新材料', '股权'].map(kw => (
            <button
              key={kw}
              type="button"
              onClick={() => setExpertiseFilter(expertiseFilter === kw ? 'all' : kw)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer ${
                expertiseFilter === kw 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {kw}
            </button>
          ))}
          {(searchQuery || typeFilter !== 'all' || roleFilter !== 'all' || expertiseFilter !== 'all' || availabilityFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setRoleFilter('all');
                setExpertiseFilter('all');
                setAvailabilityFilter('all');
              }}
              className="text-[11px] text-rose-600 hover:underline ml-2 shrink-0 cursor-pointer"
            >
              清除所有筛选
            </button>
          )}
        </div>
      </div>

      {/* Main Mentor Display: Card View or Table View */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-2.5 stroke-1" />
          <div className="text-sm font-semibold text-slate-600">未找到符合筛选条件的双创导师</div>
          <div className="mt-1">请尝试更换搜索关键词或重置筛选条件</div>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setRoleFilter('all');
              setExpertiseFilter('all');
              setAvailabilityFilter('all');
            }}
            className="mt-3 px-3 py-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium bg-sky-50 hover:bg-sky-100 rounded-lg transition"
          >
            重置所有筛选
          </button>
        </div>
      ) : viewMode === 'card' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredMentors.map(mentor => {
            const loadPercent = Math.min(100, Math.round((mentor.currentProjectsCount / mentor.maxCapacity) * 100));
            return (
              <div
                key={mentor.id}
                id={`mentor-card-${mentor.id}`}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group overflow-hidden"
              >
                {/* Card Top: Profile info & Status */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="h-13 w-13 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
                        />
                        <span 
                          onClick={(e) => handleQuickToggleAvailability(mentor, e)}
                          title="点击快速切换预约状态"
                          className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white cursor-pointer ${
                            mentor.availability === 'available' 
                              ? 'bg-emerald-500' 
                              : mentor.availability === 'busy' 
                              ? 'bg-amber-500' 
                              : 'bg-rose-500'
                          }`} 
                        />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h3 
                            onClick={() => handleViewDetail(mentor)}
                            className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition cursor-pointer"
                          >
                            {mentor.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeStyle(mentor.roleCategory)}`}>
                            {getRoleCategoryLabel(mentor.roleCategory)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {mentor.type === 'internal' ? '校内学者' : '外部特聘'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-1">
                          {mentor.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {mentor.organization}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {getAvailabilityBadge(mentor.availability)}
                    </div>
                  </div>

                  {/* Honor Badge or Appointment */}
                  {mentor.honorTitle && (
                    <div className="mt-3 px-2.5 py-1 bg-amber-50/70 border border-amber-200/70 rounded-lg flex items-center justify-between text-[11px] text-amber-900">
                      <div className="flex items-center space-x-1 font-semibold truncate">
                        <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{mentor.honorTitle}</span>
                      </div>
                      <span className="text-[10px] text-amber-700 shrink-0 ml-1">
                        {mentor.appointedYear || '特聘导师'}
                      </span>
                    </div>
                  )}

                  {/* Contact Information Bar (Phone, Email, WeChat, Office) */}
                  <div className="mt-3.5 p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-mono">{mentor.phone || '暂未登记手机'}</span>
                      </div>
                      {mentor.phone && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(mentor.phone!, '电话'); }}
                          className="text-[10px] text-sky-600 hover:text-sky-700 flex items-center ml-1 shrink-0 cursor-pointer"
                        >
                          <Copy className="h-2.5 w-2.5 mr-0.5" />
                          复制
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-mono truncate">{mentor.email || '暂未登记邮箱'}</span>
                      </div>
                      {mentor.email && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(mentor.email!, '邮箱'); }}
                          className="text-[10px] text-sky-600 hover:text-sky-700 flex items-center ml-1 shrink-0 cursor-pointer"
                        >
                          <Copy className="h-2.5 w-2.5 mr-0.5" />
                          复制
                        </button>
                      )}
                    </div>

                    {(mentor.wechat || mentor.officeLocation) && (
                      <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/50">
                        {mentor.wechat && (
                          <div className="flex items-center space-x-1 truncate">
                            <MessageSquare className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">微信: {mentor.wechat}</span>
                          </div>
                        )}
                        {mentor.officeLocation && (
                          <div className="flex items-center space-x-1 truncate text-slate-400 text-[10px] ml-auto">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[130px]" title={mentor.officeLocation}>
                              {mentor.officeLocation}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expertise Tags (擅长辅导领域) */}
                  <div className="mt-3">
                    <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>擅长领域与指导环节：</span>
                      <span className="text-sky-600 text-[10px] font-medium">{mentor.expertiseTags.length} 项</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertiseTags.slice(0, 4).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {mentor.expertiseTags.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-50 border border-slate-200">
                          +{mentor.expertiseTags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coaching Capacity & Track Record */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">带教负荷进度</span>
                      <span className="font-semibold text-slate-700 font-mono">
                        {mentor.currentProjectsCount} / {mentor.maxCapacity} 组 ({loadPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          loadPercent >= 90 ? 'bg-rose-500' : loadPercent >= 65 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${loadPercent}%` }}
                      />
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50/80 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block">累计辅导</span>
                        <span className="font-bold text-slate-800">{mentor.mentoringCount} 次</span>
                      </div>
                      <div className="bg-slate-50/80 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block">培育金奖</span>
                        <span className="font-bold text-rose-600">{mentor.goldProjectsCoached} 项</span>
                      </div>
                      <div className="bg-slate-50/80 p-1.5 rounded">
                        <span className="text-[10px] text-slate-400 block">综合评分</span>
                        <span className="font-bold text-amber-600 flex items-center justify-center">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-0.5" />
                          {mentor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA & Actions */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleViewDetail(mentor)}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    查看完整档案
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={(e) => handleOpenEditModal(mentor, e)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                      title="编辑导师资料"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMentor(mentor.id, mentor.name, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="解除聘任"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">导师基础信息</th>
                  <th className="py-3 px-3">归属与角色</th>
                  <th className="py-3 px-3">联系方式 (电话/邮箱/微信)</th>
                  <th className="py-3 px-3">擅长辅导领域</th>
                  <th className="py-3 px-3">带教负荷 / 战绩</th>
                  <th className="py-3 px-3">预约状态</th>
                  <th className="py-3 px-4 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMentors.map(mentor => (
                  <tr key={mentor.id} className="hover:bg-slate-50/80 transition">
                    {/* Basic Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div 
                            onClick={() => handleViewDetail(mentor)}
                            className="font-bold text-slate-900 hover:text-sky-600 cursor-pointer"
                          >
                            {mentor.name}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{mentor.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{mentor.organization}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeStyle(mentor.roleCategory)}`}>
                          {getRoleCategoryLabel(mentor.roleCategory)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {mentor.type === 'internal' ? '校内学术' : '外部特聘'} · {mentor.appointedYear || '特聘'}
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-3 px-3">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center space-x-1 font-mono text-slate-800">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{mentor.phone || '-'}</span>
                        </div>
                        <div className="flex items-center space-x-1 font-mono text-slate-500 text-[10px] truncate max-w-[180px]">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="truncate">{mentor.email || '-'}</span>
                        </div>
                        {mentor.wechat && (
                          <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
                            <MessageSquare className="h-3 w-3 text-emerald-600" />
                            <span>微信: {mentor.wechat}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Expertise */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertiseTags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded">
                            {tag}
                          </span>
                        ))}
                        {mentor.expertiseTags.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{mentor.expertiseTags.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Load & Record */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 text-xs">
                        {mentor.currentProjectsCount} / {mentor.maxCapacity} 组
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        金奖 {mentor.goldProjectsCoached} 项 · 评分 {mentor.rating}
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getAvailabilityBadge(mentor.availability)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleViewDetail(mentor)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-sky-600 bg-white hover:bg-slate-50 rounded border border-slate-200 transition"
                      >
                        详情
                      </button>
                      <button
                        onClick={(e) => handleOpenEditModal(mentor, e)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded border border-slate-200 transition"
                      >
                        编辑
                      </button>
                      <button
                        onClick={(e) => handleDeleteMentor(mentor.id, mentor.name, e)}
                        className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition"
                      >
                        解聘
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Add or Edit Mentor Modal */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl">
                  {currentEditingMentor ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentEditingMentor ? `编辑导师档案：${currentEditingMentor.name}` : '聘任 / 录入新双创导师'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    完善导师个人资质、联系方式、擅长辅导领域标签与带教容量配置
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveMentorForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Section 1: Basic Identity & Avatar */}
              <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="font-bold text-slate-800 flex items-center text-xs">
                  <Users className="h-3.5 w-3.5 text-sky-600 mr-1.5" />
                  基本身份与头衔信息
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">导师姓名 *</label>
                    <input
                      type="text"
                      required
                      placeholder="如：赵立明"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">导师归属来源 *</label>
                    <select
                      value={formType}
                      onChange={e => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500 text-slate-700"
                    >
                      <option value="external">外部特聘专家 (企业/投资/行业)</option>
                      <option value="internal">校内学术导师 (学院/研究所)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">专业角色分类 *</label>
                    <select
                      value={formRoleCategory}
                      onChange={e => setFormRoleCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500 text-slate-700"
                    >
                      <option value="national_judge">国赛国奖评委</option>
                      <option value="investor">创投资本合伙人</option>
                      <option value="industry">领军产业高管</option>
                      <option value="academic">校内学术博导</option>
                      <option value="legal_finance">财税法务专家</option>
                      <option value="alumni">金奖创业校友</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">头衔与职务 *</label>
                    <input
                      type="text"
                      required
                      placeholder="如：国赛金奖评审专家 / 启迪之星合伙人"
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">工作单位 / 归属学院 *</label>
                    <input
                      type="text"
                      required
                      placeholder="如：中国乡村发展研究院 / 电子信息工程学院"
                      value={formOrg}
                      onChange={e => setFormOrg(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">资质荣誉称号</label>
                    <input
                      type="text"
                      placeholder="如：全国大赛资深国奖评委、国家杰青"
                      value={formHonorTitle}
                      onChange={e => setFormHonorTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">聘期届次</label>
                    <input
                      type="text"
                      placeholder="如：2024-2026年特聘专家"
                      value={formAppointedYear}
                      onChange={e => setFormAppointedYear(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Avatar selection */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">导师头像 URL</label>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={formAvatar || PRESET_AVATARS[0]} 
                      alt="Avatar Preview" 
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                    <input
                      type="text"
                      value={formAvatar}
                      onChange={e => setFormAvatar(e.target.value)}
                      placeholder="图片 URL 地址"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[10px] text-slate-400">快速选用预设头像：</span>
                    {PRESET_AVATARS.slice(0, 6).map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormAvatar(url)}
                        className="h-6 w-6 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-sky-500 transition cursor-pointer"
                      >
                        <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="p-3.5 bg-sky-50/40 border border-sky-100 rounded-xl space-y-3">
                <div className="font-bold text-sky-900 flex items-center text-xs">
                  <Phone className="h-3.5 w-3.5 text-sky-600 mr-1.5" />
                  联系方式与常驻办公地点（便于师生联络）
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">联系电话 / 手机</label>
                    <input
                      type="text"
                      placeholder="138-xxxx-xxxx"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">工作电子邮箱</label>
                    <input
                      type="email"
                      placeholder="mentor@organization.com"
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">微信号 / 钉钉</label>
                    <input
                      type="text"
                      placeholder="wx_mentor_2026"
                      value={formWechat}
                      onChange={e => setFormWechat(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">校内办公工位 / 常驻指导地点</label>
                  <input
                    type="text"
                    placeholder="如：双创大楼 302 特聘导师工作室 / 电子楼 818 实验室"
                    value={formOfficeLocation}
                    onChange={e => setFormOfficeLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Section 3: Expertise & Domains */}
              <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="font-bold text-slate-800 flex items-center text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                  擅长指导领域与环节标签 (Expertise Tags)
                </div>

                {/* Selected Tags list */}
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-white border border-slate-200 rounded-lg">
                  {formExpertiseTags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className="ml-1 text-sky-400 hover:text-sky-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {formExpertiseTags.length === 0 && (
                    <span className="text-slate-400 text-xs py-0.5">尚未选择擅长领域标签，请在下方点击选用或自定义输入</span>
                  )}
                </div>

                {/* Quick Add Preset Tags */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">点击快速选用或取消：</span>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_EXPERTISE_TAGS.map((tag, idx) => {
                      const isSelected = formExpertiseTags.includes(tag);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                            isSelected 
                              ? 'bg-sky-600 text-white shadow-2xs' 
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom tag input */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="输入自定义擅长领域标签，如：合成生物学技术转化"
                    value={customTagInput}
                    onChange={e => setCustomTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomTag(e); } }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    添加自定义标签
                  </button>
                </div>
              </div>

              {/* Section 4: Preferred Tracks & Capacity */}
              <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="font-bold text-slate-800 flex items-center text-xs">
                  <Briefcase className="h-3.5 w-3.5 text-indigo-600 mr-1.5" />
                  适配赛道、带教容量与历史战绩
                </div>

                {/* Tracks checkboxes */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">适配重点赛道</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'higher_education_creative', label: '高教主赛道 (创意组)' },
                      { id: 'higher_education_startup', label: '高教主赛道 (初创/成长组)' },
                      { id: 'red_youth_creative', label: '青年红色筑梦之旅' },
                      { id: 'vocational_creative', label: '职教赛道' },
                      { id: 'industry_enterprise', label: '产业命题赛道' },
                      { id: 'international_track', label: '国际参赛项目' }
                    ].map(t => (
                      <label 
                        key={t.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                          formPreferredTracks.includes(t.id as TrackType)
                            ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formPreferredTracks.includes(t.id as TrackType)}
                          onChange={() => handleToggleTrack(t.id as TrackType)}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span className="truncate">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Capacity & Ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">最大带教容量 (组)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formMaxCapacity}
                      onChange={e => setFormMaxCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">当前带教项目 (组)</label>
                    <input
                      type="number"
                      min={0}
                      max={formMaxCapacity}
                      value={formCurrentProjects}
                      onChange={e => setFormCurrentProjects(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">培育国金奖数 (项)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formGoldProjectsCoached}
                      onChange={e => setFormGoldProjectsCoached(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">预约档期状态</label>
                    <select
                      value={formAvailability}
                      onChange={e => setFormAvailability(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                    >
                      <option value="available">空闲可约 (Available)</option>
                      <option value="busy">档期较紧 (Busy)</option>
                      <option value="full">负荷已满 (Full)</option>
                    </select>
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">开放辅导时段与辅导方式</label>
                  <input
                    type="text"
                    value={formTimeSlots}
                    onChange={e => setFormTimeSlots(e.target.value)}
                    placeholder="如：周二 14:00-17:00 (线上会议), 周四 14:00-16:00 (校创客空间)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Section 5: Bio / Profile Narrative */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">导师个人详尽履历与评审背景</label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  placeholder="详述导师往届国金指导经历、学术产业造诣、评委提问风格与指导专长..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 text-slate-700"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {currentEditingMentor ? '保存导师资料变更' : '确认录入并纳入智库'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Mentor Detailed Dossier / Profile Drawer */}
      {/* ========================================================================= */}
      {isDetailModalOpen && currentDetailMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Dossier Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50/40 flex items-start justify-between shrink-0">
              <div className="flex items-start space-x-4">
                <img
                  src={currentDetailMentor.avatar}
                  alt={currentDetailMentor.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900">{currentDetailMentor.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getRoleBadgeStyle(currentDetailMentor.roleCategory)}`}>
                      {getRoleCategoryLabel(currentDetailMentor.roleCategory)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {currentDetailMentor.type === 'internal' ? '校内学者博导' : '外部特聘专家'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-1">{currentDetailMentor.title}</p>
                  <p className="text-xs text-slate-500">{currentDetailMentor.organization}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEditModal(currentDetailMentor);
                  }}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition"
                  title="编辑资料"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Status & Honor Banner */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <div className="flex items-center space-x-2 text-amber-950 font-medium">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>{currentDetailMentor.honorTitle || '全国大赛特聘指导专家'}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-amber-800">{currentDetailMentor.appointedYear || '常任特聘'}</span>
                </div>
                {getAvailabilityBadge(currentDetailMentor.availability)}
              </div>

              {/* Direct Contact Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center">
                    <Phone className="h-3.5 w-3.5 text-sky-600 mr-1.5" />
                    即时联络渠道
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">点击右侧按钮可一键复制</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 truncate">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-xs font-medium">{currentDetailMentor.phone || '未登记手机'}</span>
                    </div>
                    {currentDetailMentor.phone && (
                      <button
                        onClick={() => copyToClipboard(currentDetailMentor.phone!, '电话')}
                        className="px-2 py-0.5 text-[10px] text-sky-600 hover:bg-sky-50 rounded border border-sky-200 cursor-pointer"
                      >
                        复制
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-xs truncate">{currentDetailMentor.email || '未登记邮箱'}</span>
                    </div>
                    {currentDetailMentor.email && (
                      <button
                        onClick={() => copyToClipboard(currentDetailMentor.email!, '邮箱')}
                        className="px-2 py-0.5 text-[10px] text-sky-600 hover:bg-sky-50 rounded border border-sky-200 cursor-pointer"
                      >
                        复制
                      </button>
                    )}
                  </div>

                  {currentDetailMentor.wechat && (
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-2 truncate">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-xs">微信: <strong className="font-mono">{currentDetailMentor.wechat}</strong></span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentDetailMentor.wechat!, '微信号')}
                        className="px-2 py-0.5 text-[10px] text-sky-600 hover:bg-sky-50 rounded border border-sky-200 cursor-pointer"
                      >
                        复制
                      </button>
                    </div>
                  )}

                  {currentDetailMentor.officeLocation && (
                    <div className="flex items-center p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                      <span className="truncate">{currentDetailMentor.officeLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio & Achievements */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">导师详尽履历与评委风格</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                  {currentDetailMentor.bio}
                </p>
              </div>

              {/* Expertise Tags */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">擅长辅导领域与环节</h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentDetailMentor.expertiseTags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <Clock className="h-3.5 w-3.5 text-indigo-600 mr-1.5" />
                  常规开放辅导时段
                </h4>
                <div className="space-y-1.5">
                  {currentDetailMentor.availableTimeSlots.map((slot, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg text-slate-700 flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{slot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">累计辅导课时</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">{currentDetailMentor.mentoringCount} 次</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">培育国金项目</span>
                  <span className="text-base font-bold text-rose-600 mt-0.5 block">{currentDetailMentor.goldProjectsCoached} 项</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">学员评分</span>
                  <span className="text-base font-bold text-amber-600 mt-0.5 block">{currentDetailMentor.rating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Dossier Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleDeleteMentor(currentDetailMentor.id, currentDetailMentor.name);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                从智库解除聘任
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  关闭
                </button>
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onNavigateTab('mentorship');
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
                  >
                    为项目指派此导师
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
