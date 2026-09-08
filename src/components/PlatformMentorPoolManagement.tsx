import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
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
  Send,
  Building2,
  Globe2,
  FileCheck,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Zap,
  BookmarkCheck
} from 'lucide-react';
import { TrackType } from '../types';
import { PlatformMentorExpert, MOCK_PLATFORM_MENTORS } from '../data/mockPlatformMentors';

export default function PlatformMentorPoolManagement() {
  const [mentors, setMentors] = useState<PlatformMentorExpert[]>(MOCK_PLATFORM_MENTORS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [dispatchFilter, setDispatchFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Modals & Selected Mentor
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [currentEditingMentor, setCurrentEditingMentor] = useState<PlatformMentorExpert | null>(null);
  const [currentDetailMentor, setCurrentDetailMentor] = useState<PlatformMentorExpert | null>(null);
  const [dispatchTargetMentor, setDispatchTargetMentor] = useState<PlatformMentorExpert | null>(null);

  // Dispatch Form State
  const [dispatchUniversity, setDispatchUniversity] = useState('北京航空航天大学');
  const [dispatchTask, setDispatchTask] = useState('国赛金种子项目闭门会诊与打分表对标');
  const [dispatchFormat, setDispatchFormat] = useState<'线下入校' | '线上联审'>('线下入校');
  const [dispatchDate, setDispatchDate] = useState('2026-03-25');
  const [dispatchNotes, setDispatchNotes] = useState('');

  // Toast & Copy
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formCertificationLevel, setFormCertificationLevel] = useState<PlatformMentorExpert['certificationLevel']>('national_senior');
  const [formRoleCategory, setFormRoleCategory] = useState<PlatformMentorExpert['roleCategory']>('national_judge');
  const [formHonorTitle, setFormHonorTitle] = useState('');
  const [formAppointedYear, setFormAppointedYear] = useState('2024-2027年特聘 (中央直聘)');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWechat, setFormWechat] = useState('');
  const [formOfficeLocation, setFormOfficeLocation] = useState('');
  const [formExpertiseTags, setFormExpertiseTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [formPreferredTracks, setFormPreferredTracks] = useState<TrackType[]>(['higher_education_creative']);
  const [formServedUniversitiesCount, setFormServedUniversitiesCount] = useState<number>(30);
  const [formCoachedGoldCount, setFormCoachedGoldCount] = useState<number>(10);
  const [formNationalReviewYears, setFormNationalReviewYears] = useState<number>(6);
  const [formMaxCapacity, setFormMaxCapacity] = useState<number>(6);
  const [formRating, setFormRating] = useState<number>(4.96);
  const [formDispatchStatus, setFormDispatchStatus] = useState<PlatformMentorExpert['dispatchStatus']>('open_all');
  const [formBio, setFormBio] = useState('');
  const [formSpecialties, setFormSpecialties] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(`${label}-${text}`);
    showToast(`已复制${label}：${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Tag helpers
  const PRESET_EXPERTISE_TAGS = [
    '硬科技颠覆性创新',
    '2026全国统考细则',
    '五维打分模型重构',
    '创投资本尽调穿透',
    '股权架构与估值模型',
    '青年红色筑梦之旅',
    '新工科赛道专家',
    '新医科赛道专家',
    '产业命题赛道',
    '乡村振兴利益联结机制',
    '专思创育人故事',
    '科技成果赋权改革',
    '职务发明权属无纠纷证明',
    '现场答辩尖锐质询',
    '冠军答辩实战台风'
  ];

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  ];

  const LEVEL_LABELS: Record<PlatformMentorExpert['certificationLevel'], string> = {
    fellow: '两院院士级战略导师',
    national_senior: '国家级资深评审组长',
    leading_investor: '头部创投管理合伙人',
    industry_chief: '全球500强首席科学家',
    legal_finance: '科创成果转化合规首席',
    alumni_champ: '国赛冠军校友金牌导师'
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setCurrentEditingMentor(null);
    const nextCodeNum = mentors.length + 1;
    const formattedNum = nextCodeNum < 10 ? `00${nextCodeNum}` : `0${nextCodeNum}`;
    setFormCode(`NAT-EXP-${formattedNum}`);
    setFormName('');
    setFormAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setFormTitle('');
    setFormOrg('');
    setFormCertificationLevel('national_senior');
    setFormRoleCategory('national_judge');
    setFormHonorTitle('全国大赛资深国奖评委组长');
    setFormAppointedYear('2024-2027年特聘 (中央直聘)');
    setFormPhone('138-0100-8899');
    setFormEmail('expert@cistec.gov.cn');
    setFormWechat('');
    setFormOfficeLocation('国家双创专家指导中心 / 中央专家调度工作室');
    setFormExpertiseTags(['2026全国统考细则', '五维打分模型重构']);
    setFormPreferredTracks(['higher_education_creative', 'higher_education_startup']);
    setFormServedUniversitiesCount(35);
    setFormCoachedGoldCount(15);
    setFormNationalReviewYears(6);
    setFormMaxCapacity(6);
    setFormRating(4.96);
    setFormDispatchStatus('open_all');
    setFormBio('');
    setFormSpecialties('打分表严谨对标, 商业计划书逻辑重构, 现场质询破局');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (mentor: PlatformMentorExpert, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentEditingMentor(mentor);
    setFormCode(mentor.code);
    setFormName(mentor.name);
    setFormAvatar(mentor.avatar);
    setFormTitle(mentor.title);
    setFormOrg(mentor.organization);
    setFormCertificationLevel(mentor.certificationLevel);
    setFormRoleCategory(mentor.roleCategory);
    setFormHonorTitle(mentor.honorTitle);
    setFormAppointedYear(mentor.appointedYear);
    setFormPhone(mentor.phone);
    setFormEmail(mentor.email);
    setFormWechat(mentor.wechat || '');
    setFormOfficeLocation(mentor.officeLocation);
    setFormExpertiseTags([...mentor.expertiseTags]);
    setFormPreferredTracks([...mentor.preferredTracks]);
    setFormServedUniversitiesCount(mentor.servedUniversitiesCount);
    setFormCoachedGoldCount(mentor.coachedGoldCount);
    setFormNationalReviewYears(mentor.nationalReviewYears);
    setFormMaxCapacity(mentor.maxCapacity);
    setFormRating(mentor.rating);
    setFormDispatchStatus(mentor.dispatchStatus);
    setFormBio(mentor.bio);
    setFormSpecialties(mentor.specialties.join(', '));
    setIsEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveMentorForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formOrg.trim()) {
      showToast('请填写专家姓名、头衔职务与所属机构单位');
      return;
    }

    const specialtiesArr = formSpecialties
      .split(/[,，\n]/)
      .map(s => s.trim())
      .filter(Boolean);

    if (currentEditingMentor) {
      // Update
      const updated: PlatformMentorExpert = {
        ...currentEditingMentor,
        code: formCode || currentEditingMentor.code,
        name: formName.trim(),
        avatar: formAvatar || currentEditingMentor.avatar,
        title: formTitle.trim(),
        organization: formOrg.trim(),
        certificationLevel: formCertificationLevel,
        levelLabel: LEVEL_LABELS[formCertificationLevel],
        roleCategory: formRoleCategory,
        honorTitle: formHonorTitle.trim() || '全国大赛特聘战略专家',
        appointedYear: formAppointedYear.trim() || '2024-2027年特聘 (中央直聘)',
        phone: formPhone.trim(),
        email: formEmail.trim(),
        wechat: formWechat.trim() || undefined,
        officeLocation: formOfficeLocation.trim(),
        expertiseTags: formExpertiseTags.length > 0 ? formExpertiseTags : ['2026大赛官方指导专家'],
        preferredTracks: formPreferredTracks.length > 0 ? formPreferredTracks : ['higher_education_creative'],
        servedUniversitiesCount: Number(formServedUniversitiesCount) || 30,
        coachedGoldCount: Number(formCoachedGoldCount) || 10,
        nationalReviewYears: Number(formNationalReviewYears) || 5,
        maxCapacity: Number(formMaxCapacity) || 6,
        rating: Number(formRating) || 4.96,
        dispatchStatus: formDispatchStatus,
        bio: formBio.trim() || '中央特聘平台专家，为全平台各入驻高校提供跨校巡诊与重点项目终极打磨。',
        specialties: specialtiesArr.length > 0 ? specialtiesArr : currentEditingMentor.specialties
      };

      setMentors(mentors.map(m => m.id === updated.id ? updated : m));
      showToast(`平台特聘专家【${updated.name} (${updated.code})】档案已更新`);
    } else {
      // Create new
      const newMentor: PlatformMentorExpert = {
        id: `pmentor-${Date.now().toString().slice(-4)}`,
        code: formCode || `NAT-EXP-${Math.floor(100 + Math.random() * 900)}`,
        name: formName.trim(),
        avatar: formAvatar || PRESET_AVATARS[0],
        title: formTitle.trim(),
        organization: formOrg.trim(),
        certificationLevel: formCertificationLevel,
        levelLabel: LEVEL_LABELS[formCertificationLevel],
        roleCategory: formRoleCategory,
        honorTitle: formHonorTitle.trim() || '全国大赛特聘战略专家',
        appointedYear: formAppointedYear.trim() || '2024-2027年特聘 (中央直聘)',
        phone: formPhone.trim() || '138-0000-0000',
        email: formEmail.trim() || 'expert@cistec.gov.cn',
        wechat: formWechat.trim() || undefined,
        officeLocation: formOfficeLocation.trim() || '中央专家调度工作室',
        expertiseTags: formExpertiseTags.length > 0 ? formExpertiseTags : ['2026大赛官方指导专家', '五维打分模型重构'],
        preferredTracks: formPreferredTracks.length > 0 ? formPreferredTracks : ['higher_education_creative'],
        servedUniversitiesCount: Number(formServedUniversitiesCount) || 20,
        coachedGoldCount: Number(formCoachedGoldCount) || 8,
        nationalReviewYears: Number(formNationalReviewYears) || 5,
        activeDispatchesCount: 0,
        maxCapacity: Number(formMaxCapacity) || 6,
        rating: Number(formRating) || 4.96,
        dispatchStatus: formDispatchStatus,
        bio: formBio.trim() || '中央特聘平台专家，具备国家级赛事深厚评审与辅导资历。',
        specialties: specialtiesArr.length > 0 ? specialtiesArr : ['官方打分表严格对标', '重点项目闭门问诊'],
        recentDispatches: []
      };

      setMentors([newMentor, ...mentors]);
      showToast(`成功准入新平台特聘专家【${newMentor.name} (${newMentor.code})】！已入选国家级智库`);
    }

    setIsEditModalOpen(false);
  };

  // Delete Mentor
  const handleDeleteMentor = (mentorId: string, mentorName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`确认从平台导师智库移除特聘专家【${mentorName}】吗？下架后全平台各高校将无法发起跨校调度预约。`)) {
      setMentors(mentors.filter(m => m.id !== mentorId));
      showToast(`已从平台智库移出专家【${mentorName}】`);
    }
  };

  // Open Dispatch Modal
  const handleOpenDispatchModal = (mentor: PlatformMentorExpert, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDispatchTargetMentor(mentor);
    setDispatchUniversity('北京航空航天大学');
    setDispatchTask(`${mentor.name}教授：2026重点高教主赛道金种子闭门辅导`);
    setDispatchFormat('线下入校');
    setDispatchDate('2026-03-25');
    setDispatchNotes('');
    setIsDispatchModalOpen(true);
  };

  // Submit Dispatch Task
  const handleSubmitDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchTargetMentor) return;

    const newDispatchItem = {
      university: dispatchUniversity,
      task: dispatchTask,
      date: dispatchDate,
      format: dispatchFormat
    };

    setMentors(prev => prev.map(m => {
      if (m.id === dispatchTargetMentor.id) {
        return {
          ...m,
          servedUniversitiesCount: m.servedUniversitiesCount + 1,
          activeDispatchesCount: m.activeDispatchesCount + 1,
          recentDispatches: [newDispatchItem, ...m.recentDispatches.slice(0, 4)]
        };
      }
      return m;
    }));

    setIsDispatchModalOpen(false);
    showToast(`成功下发跨校调度指令！已指派【${dispatchTargetMentor.name}】于 ${dispatchDate} 赴【${dispatchUniversity}】开展${dispatchFormat}指导`);
  };

  // Toggle Dispatch Status
  const handleToggleDispatchStatus = (mentorId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMentors(prev => prev.map(m => {
      if (m.id === mentorId) {
        const nextStatus = m.dispatchStatus === 'open_all' ? 'paused' : 'open_all';
        const label = nextStatus === 'open_all' ? '已恢复全平台开放跨校调度' : '已暂停该专家全平台调度';
        showToast(`专家【${m.name}】${label}`);
        return { ...m, dispatchStatus: nextStatus };
      }
      return m;
    }));
  };

  // Export Roster to CSV
  const handleExportRoster = () => {
    const headers = [
      '平台专家编号',
      '姓名',
      '资质层级',
      '角色分类',
      '工作单位/机构',
      '头衔职务',
      '国家级特聘荣誉称号',
      '特聘聘期',
      '联系电话',
      '工作邮箱',
      '办公驻点',
      '擅长辅导领域',
      '已赋能高校数',
      '指导国赛金奖总数',
      '国赛评审年限',
      '在服跨校任务数',
      '月度承载上限',
      '综合履职评分',
      '调度开放状态'
    ];

    const rows = filteredMentors.map(m => [
      m.code,
      m.name,
      m.levelLabel,
      m.roleCategory,
      `"${m.organization.replace(/"/g, '""')}"`,
      `"${m.title.replace(/"/g, '""')}"`,
      `"${m.honorTitle.replace(/"/g, '""')}"`,
      `"${m.appointedYear.replace(/"/g, '""')}"`,
      m.phone,
      m.email,
      `"${m.officeLocation.replace(/"/g, '""')}"`,
      `"${m.expertiseTags.join('; ')}"`,
      m.servedUniversitiesCount,
      m.coachedGoldCount,
      m.nationalReviewYears,
      m.activeDispatchesCount,
      m.maxCapacity,
      m.rating,
      m.dispatchStatus === 'open_all' ? '全平台开放' : m.dispatchStatus === 'restricted' ? '定向指派' : '已暂停'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `全平台国家级双创特聘导师智库大名册_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('已导出全平台特聘专家大名册 CSV 档案');
  };

  // Filter logic
  const filteredMentors = mentors.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.organization.toLowerCase().includes(q) ||
      m.honorTitle.toLowerCase().includes(q) ||
      m.expertiseTags.some(t => t.toLowerCase().includes(q));

    const matchesLevel = levelFilter === 'all' || m.certificationLevel === levelFilter;
    const matchesTrack = trackFilter === 'all' || m.preferredTracks.some(t => t === trackFilter);
    const matchesDispatch = dispatchFilter === 'all' || m.dispatchStatus === dispatchFilter;

    return matchesSearch && matchesLevel && matchesTrack && matchesDispatch;
  });

  // Macro Metrics
  const totalExperts = mentors.length;
  const totalFellowsAndJudges = mentors.filter(m => m.certificationLevel === 'fellow' || m.roleCategory === 'national_judge').length;
  const totalUniversitiesServed = mentors.reduce((acc, m) => acc + m.servedUniversitiesCount, 0);
  const totalGoldCoached = mentors.reduce((acc, m) => acc + m.coachedGoldCount, 0);
  const avgRating = totalExperts > 0
    ? (mentors.reduce((acc, m) => acc + m.rating, 0) / totalExperts).toFixed(2)
    : '4.98';

  const getCertificationBadgeClass = (level: PlatformMentorExpert['certificationLevel']) => {
    switch (level) {
      case 'fellow':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold ring-1 ring-amber-200';
      case 'national_senior':
        return 'bg-sky-50 text-sky-800 border-sky-300 font-semibold';
      case 'leading_investor':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold';
      case 'industry_chief':
        return 'bg-purple-50 text-purple-800 border-purple-300 font-semibold';
      case 'legal_finance':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      case 'alumni_champ':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDispatchBadge = (status: PlatformMentorExpert['dispatchStatus']) => {
    switch (status) {
      case 'open_all':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
            全网开放跨校调度
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1" />
            定向指派中
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1" />
            已暂停调度
          </span>
        );
    }
  };

  return (
    <div id="platform-mentor-pool-management" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">平台导师智库管理</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3 text-amber-600" />
              <span>中央总控 · 全国权威国评库</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            集中管理全平台统一准入认证的两院院士战略导师、资深国赛评委组长、头部创投合伙人、全球500强企业首席科学家与冠军导师。面向全平台各入驻高校提供跨校巡诊调度与辅导质效监管。
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleExportRoster}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition cursor-pointer"
            title="导出全国专家大名册 CSV"
          >
            <Download className="h-4 w-4 mr-1.5 text-slate-400" />
            导出专家大名册
          </button>

          <button
            id="btn-add-platform-mentor"
            onClick={handleOpenAddModal}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            准入新特聘专家
          </button>
        </div>
      </div>

      {/* Macro Metrics Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">平台认证专家总数</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5">{totalExperts} <span className="text-xs font-normal text-slate-400">位国家级专家</span></div>
          <div className="text-[11px] text-sky-600 mt-0.5">中央直聘 · 全网统调</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">院士与资深国评组长</span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1.5">{totalFellowsAndJudges} <span className="text-xs font-normal text-slate-400">位核心席位</span></div>
          <div className="text-[11px] text-amber-600 mt-0.5">国奖答辩终审打分资质</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">累计赋能高校人次</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1.5">{totalUniversitiesServed} <span className="text-xs font-normal text-slate-400">所高校覆盖</span></div>
          <div className="text-[11px] text-emerald-600 mt-0.5">跨校巡讲与驻点指导</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">辅导国赛金奖战绩</span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1.5">{totalGoldCoached} <span className="text-xs font-normal text-slate-400">项国金</span></div>
          <div className="text-[11px] text-purple-600 mt-0.5">含总冠军与排头兵金牌</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">跨校履职好评率</span>
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1.5">{avgRating} <span className="text-xs font-normal text-slate-400">/ 5.00</span></div>
          <div className="text-[11px] text-rose-600 mt-0.5">各入驻高校全五星好评</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索专家姓名、编号(NAT-EXP)、单位或技术擅长..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Filters & View Mode */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-1 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">资质层级:</span>
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">全部资质层级</option>
              <option value="fellow">两院院士级战略导师</option>
              <option value="national_senior">国家级资深评审组长</option>
              <option value="leading_investor">头部创投管理合伙人</option>
              <option value="industry_chief">全球500强首席科学家</option>
              <option value="legal_finance">科创成果转化合规首席</option>
              <option value="alumni_champ">国赛冠军校友金牌导师</option>
            </select>

            <select
              value={dispatchFilter}
              onChange={(e) => setDispatchFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">全部调度状态</option>
              <option value="open_all">全平台开放跨校调度</option>
              <option value="restricted">定向指派中</option>
              <option value="paused">已暂停调度</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0 ml-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  viewMode === 'card' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                卡片视图
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                名册列表
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Content Grid / Table */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">未检索到匹配的平台特聘专家</h3>
          <p className="text-xs text-slate-500 mt-1">请尝试修改搜索词或重置资质层级过滤选项</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              onClick={() => {
                setCurrentDetailMentor(mentor);
                setIsDetailModalOpen(true);
              }}
              className="bg-white rounded-xl border border-slate-200 hover:border-sky-300 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className={`h-1.5 w-full ${
                mentor.certificationLevel === 'fellow' ? 'bg-amber-500' :
                mentor.certificationLevel === 'national_senior' ? 'bg-sky-500' :
                mentor.certificationLevel === 'leading_investor' ? 'bg-indigo-500' :
                mentor.certificationLevel === 'industry_chief' ? 'bg-purple-500' :
                mentor.certificationLevel === 'legal_finance' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />

              <div className="p-5 space-y-4 flex-1">
                {/* Header: Code + Certification Level + Dispatch Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {mentor.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] border ${getCertificationBadgeClass(mentor.certificationLevel)}`}>
                      {mentor.levelLabel}
                    </span>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    {getDispatchBadge(mentor.dispatchStatus)}
                  </div>
                </div>

                {/* Profile row: Avatar + Name + Title + Organization */}
                <div className="flex items-start space-x-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-13 h-13 rounded-xl object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-sky-400 transition"
                    />
                    {mentor.certificationLevel === 'fellow' && (
                      <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-500 text-white rounded-full shadow-xs" title="两院院士导师">
                        <Award className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {mentor.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">
                        {mentor.honorTitle.split('·')[0].trim()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium mt-0.5 truncate" title={mentor.title}>
                      {mentor.title}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1 truncate" title={mentor.organization}>
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{mentor.organization}</span>
                    </div>
                  </div>
                </div>

                {/* Battle Stats Strip */}
                <div className="grid grid-cols-4 gap-1.5 py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">赋能高校</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{mentor.servedUniversitiesCount} <span className="text-[10px] font-normal text-slate-400">所</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">辅导国金</div>
                    <div className="text-xs font-bold text-purple-700 mt-0.5">{mentor.coachedGoldCount} <span className="text-[10px] font-normal text-slate-400">项</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">国评年限</div>
                    <div className="text-xs font-bold text-sky-700 mt-0.5">{mentor.nationalReviewYears} <span className="text-[10px] font-normal text-slate-400">年</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">履职口碑</div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5 flex items-center justify-center space-x-0.5">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{mentor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {mentor.expertiseTags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {mentor.expertiseTags.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded text-[10px]">
                      +{mentor.expertiseTags.length - 3}
                    </span>
                  )}
                </div>

                {/* Latest dispatch indicator */}
                {mentor.recentDispatches.length > 0 && (
                  <div className="text-[11px] text-slate-500 bg-sky-50/50 p-2 rounded-lg border border-sky-100/80 flex items-start space-x-1.5">
                    <Zap className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-700">最新跨校巡诊: </span>
                      <span className="text-slate-600 truncate block">
                        {mentor.recentDispatches[0].university} · {mentor.recentDispatches[0].task}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-500" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => copyToClipboard(mentor.phone, '专家电话')}
                    className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded transition"
                    title={`拨打或复制专家电话: ${mentor.phone}`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(mentor.email, '专家邮箱')}
                    className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded transition"
                    title={`发送邮件至: ${mentor.email}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleOpenEditModal(mentor, e)}
                    className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded transition"
                    title="编辑特聘资质与档案"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteMentor(mentor.id, mentor.name, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    title="从平台智库移出"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleOpenDispatchModal(mentor, e)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-2xs transition cursor-pointer"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    <span>跨校调度</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">专家信息 / 编号</th>
                  <th className="px-3 py-3 font-semibold">资质层级</th>
                  <th className="px-3 py-3 font-semibold">所属单位 / 头衔职务</th>
                  <th className="px-3 py-3 font-semibold text-center">赋能高校</th>
                  <th className="px-3 py-3 font-semibold text-center">指导国金</th>
                  <th className="px-3 py-3 font-semibold text-center">国评年限</th>
                  <th className="px-3 py-3 font-semibold text-center">满意度</th>
                  <th className="px-3 py-3 font-semibold text-center">调度状态</th>
                  <th className="px-4 py-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <span>{mentor.name}</span>
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                              {mentor.code}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{mentor.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] border ${getCertificationBadgeClass(mentor.certificationLevel)}`}>
                        {mentor.levelLabel}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 max-w-xs">
                      <div className="font-medium text-slate-800 text-xs truncate" title={mentor.organization}>
                        {mentor.organization}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5" title={mentor.title}>
                        {mentor.title}
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-800 font-mono text-xs">{mentor.servedUniversitiesCount}</span>
                      <span className="text-[10px] text-slate-400 ml-0.5">所</span>
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      <span className="font-bold text-purple-700 font-mono text-xs">{mentor.coachedGoldCount}</span>
                      <span className="text-[10px] text-purple-500 ml-0.5">项</span>
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap font-mono text-xs text-sky-700 font-bold">
                      {mentor.nationalReviewYears} 年
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap font-mono text-xs text-amber-700 font-bold">
                      ★ {mentor.rating}
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {getDispatchBadge(mentor.dispatchStatus)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setCurrentDetailMentor(mentor);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded transition flex items-center space-x-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>全息档案</span>
                        </button>

                        <button
                          onClick={(e) => handleOpenDispatchModal(mentor, e)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition flex items-center space-x-1"
                        >
                          <Send className="h-3 w-3" />
                          <span>跨校调度</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: 准入 / 编辑平台特聘专家档案 */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 z-10 px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentEditingMentor ? `编辑特聘专家资质【${currentEditingMentor.name}】` : '准入新平台特聘专家'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    录入并认证全平台通用的国家级大赛专家档案与跨校赋能资质
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

            <form onSubmit={handleSaveMentorForm} className="p-6 space-y-4 text-xs">
              {/* Basic credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">国家级专家编号 *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="如：NAT-EXP-009"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">专家姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="专家真实姓名"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">认证资质层级 *</label>
                  <select
                    value={formCertificationLevel}
                    onChange={e => setFormCertificationLevel(e.target.value as PlatformMentorExpert['certificationLevel'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="fellow">两院院士级战略导师</option>
                    <option value="national_senior">国家级资深评审组长</option>
                    <option value="leading_investor">头部创投管理合伙人</option>
                    <option value="industry_chief">全球500强首席科学家</option>
                    <option value="legal_finance">科创成果转化合规首席</option>
                    <option value="alumni_champ">国赛冠军校友金牌导师</option>
                  </select>
                </div>
              </div>

              {/* Title & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">所属机构/高校/创投基金 *</label>
                  <input
                    type="text"
                    required
                    value={formOrg}
                    onChange={e => setFormOrg(e.target.value)}
                    placeholder="如：清华大学机械工程学院 / 红杉中国"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">职称/职务头衔 *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="如：中国工程院院士 / 管理合伙人"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Honor & Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">特聘荣誉称号</label>
                  <input
                    type="text"
                    value={formHonorTitle}
                    onChange={e => setFormHonorTitle(e.target.value)}
                    placeholder="如：全国大赛评审委员会资深战略顾问"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">中央特聘聘期</label>
                  <input
                    type="text"
                    value={formAppointedYear}
                    onChange={e => setFormAppointedYear(e.target.value)}
                    placeholder="如：2024-2027年特聘 (中央直聘)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">直联电话</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="138-0000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">工作邮箱</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="expert@cistec.gov.cn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">驻点工作室/办公地</label>
                  <input
                    type="text"
                    value={formOfficeLocation}
                    onChange={e => setFormOfficeLocation(e.target.value)}
                    placeholder="中央专家调度工作室"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Battle Metrics & Capacity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">已赋能高校数</label>
                  <input
                    type="number"
                    value={formServedUniversitiesCount}
                    onChange={e => setFormServedUniversitiesCount(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">辅导国金数</label>
                  <input
                    type="number"
                    value={formCoachedGoldCount}
                    onChange={e => setFormCoachedGoldCount(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-purple-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">国评年限</label>
                  <input
                    type="number"
                    value={formNationalReviewYears}
                    onChange={e => setFormNationalReviewYears(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-sky-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">跨校调度状态</label>
                  <select
                    value={formDispatchStatus}
                    onChange={e => setFormDispatchStatus(e.target.value as PlatformMentorExpert['dispatchStatus'])}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  >
                    <option value="open_all">全平台开放</option>
                    <option value="restricted">定向指派</option>
                    <option value="paused">已暂停调度</option>
                  </select>
                </div>
              </div>

              {/* Expertise Tags Selection */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">专业特长标签 (点击切换)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_EXPERTISE_TAGS.map(tag => {
                    const selected = formExpertiseTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selected) {
                            setFormExpertiseTags(formExpertiseTags.filter(t => t !== tag));
                          } else {
                            setFormExpertiseTags([...formExpertiseTags, tag]);
                          }
                        }}
                        className={`px-2 py-1 rounded text-[11px] border transition cursor-pointer ${
                          selected
                            ? 'bg-sky-600 text-white border-sky-600 font-medium'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 inline mr-1" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio & Specialties */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">专家生平履历与赛事评审背书</label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  placeholder="详细介绍该专家在全国总决赛的评审经验、行业代表性与指导重点..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">特色辅导绝技 (用逗号分隔)</label>
                <input
                  type="text"
                  value={formSpecialties}
                  onChange={e => setFormSpecialties(e.target.value)}
                  placeholder="如：2026打分表逐项对标, 商业自嗨破防, 答辩开场30秒抓人"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-xs"
                >
                  确认保存并同步智库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 平台特聘专家全息档案 & 国家级特聘聘书快照 */}
      {/* ========================================================================= */}
      {isDetailModalOpen && currentDetailMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>教育部全国大学生创新大赛 · 平台国家级专家智库</span>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={currentDetailMentor.avatar}
                    alt={currentDetailMentor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-white">{currentDetailMentor.name}</h2>
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40">
                        {currentDetailMentor.code}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">{currentDetailMentor.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{currentDetailMentor.organization}</div>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-700 sm:pl-4">
                  <div className="text-[11px] text-amber-300 font-semibold">{currentDetailMentor.honorTitle}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{currentDetailMentor.appointedYear}</div>
                  <div className="mt-2">
                    <button
                      onClick={() => handleOpenDispatchModal(currentDetailMentor)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition"
                    >
                      <Send className="h-3 w-3 inline mr-1" />
                      发起跨校调度
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Battle Record Strip */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-400 block">累计赋能高校</span>
                  <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{currentDetailMentor.servedUniversitiesCount} 所</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">辅导国赛金奖</span>
                  <span className="text-base font-bold text-purple-700 font-mono mt-0.5 block">{currentDetailMentor.coachedGoldCount} 项</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">国评年限</span>
                  <span className="text-base font-bold text-sky-700 font-mono mt-0.5 block">{currentDetailMentor.nationalReviewYears} 年</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">全网综合评分</span>
                  <span className="text-base font-bold text-amber-700 font-mono mt-0.5 block">★ {currentDetailMentor.rating}</span>
                </div>
              </div>

              {/* Bio & Endorsement */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center space-x-1.5 text-xs">
                  <BookmarkCheck className="h-4 w-4 text-sky-600" />
                  <span>专家学术/创投背景与赛事权威背书</span>
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {currentDetailMentor.bio}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center space-x-1.5 text-xs">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <span>核心靶向突破绝技</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentDetailMentor.specialties.map((spec, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-amber-50/60 border border-amber-200/70 p-2 rounded-lg text-amber-900">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Cross-University Dispatches */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-1.5 text-xs">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span>近期跨校巡诊与入校督导履历 ({currentDetailMentor.recentDispatches.length} 场)</span>
                </h4>
                <div className="space-y-2">
                  {currentDetailMentor.recentDispatches.map((disp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800">{disp.university}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            disp.format === '线下入校' ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {disp.format}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{disp.task}</p>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono shrink-0 ml-3">{disp.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Contact */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">直联:</span>
                  <span className="font-mono text-slate-700 font-semibold">{currentDetailMentor.phone}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-700">{currentDetailMentor.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(currentDetailMentor.phone, '专家电话')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition cursor-pointer"
                  >
                    复制电话
                  </button>
                  <button
                    onClick={() => copyToClipboard(currentDetailMentor.email, '专家邮箱')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition cursor-pointer"
                  >
                    复制邮箱
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 发起跨校巡回辅导调度工单 (Dispatch Modal) */}
      {/* ========================================================================= */}
      {isDispatchModalOpen && dispatchTargetMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">发起跨校巡回指导调度</h3>
                  <p className="text-[11px] text-slate-500">
                    统筹指派【{dispatchTargetMentor.name} ({dispatchTargetMentor.code})】支援入驻高校
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDispatch} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">受援目标入驻高校 *</label>
                <select
                  value={dispatchUniversity}
                  onChange={e => setDispatchUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="北京航空航天大学">北京航空航天大学 (高教主赛道新工科重镇)</option>
                  <option value="清华大学">清华大学 (硬科技重大颠覆成果池)</option>
                  <option value="浙江大学">浙江大学 (数字经济与人工智能先锋)</option>
                  <option value="上海交通大学">上海交通大学 (医工交叉与智能制造)</option>
                  <option value="华中科技大学">华中科技大学 (光电信息与精密工程)</option>
                  <option value="西安交通大学">西安交通大学 (高端能源动力装备)</option>
                  <option value="中国农业大学">中国农业大学 (青年红色筑梦之旅国家标杆)</option>
                  <option value="哈尔滨工业大学">哈尔滨工业大学 (航天航空排头兵)</option>
                  <option value="同济大学">同济大学 (智能汽车与智能建造)</option>
                  <option value="华南理工大学">华南理工大学 (大湾区产业命题对接)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">巡诊形式 *</label>
                  <select
                    value={dispatchFormat}
                    onChange={e => setDispatchFormat(e.target.value as '线下入校' | '线上联审')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="线下入校">线下入校 (专家驻点闭门诊断)</option>
                    <option value="线上联审">线上联审 (跨校重点项目联合会审)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">预约调度日期 *</label>
                  <input
                    type="date"
                    required
                    value={dispatchDate}
                    onChange={e => setDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">专项调度辅导任务 *</label>
                <input
                  type="text"
                  required
                  value={dispatchTask}
                  onChange={e => setDispatchTask(e.target.value)}
                  placeholder="如：2026大赛全国总决赛主讲人高燃答辩台风特训"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">调度备注要求与特别说明</label>
                <textarea
                  rows={2}
                  value={dispatchNotes}
                  onChange={e => setDispatchNotes(e.target.value)}
                  placeholder="如：请专家重点对标打分表创新维度，准备3个高频连环追问题库..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-start space-x-2 text-[11px] text-sky-800">
                <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  调度指令下发后，系统将自动向【{dispatchUniversity}】双创负责人与【{dispatchTargetMentor.name}】专家手机发送跨校辅导派驻通知。
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-xs"
                >
                  确认下发跨校调度
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
