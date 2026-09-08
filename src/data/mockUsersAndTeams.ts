import { TrackType } from '../types';

export interface SystemUser {
  id: string;
  name: string;
  avatar: string;
  staffOrStudentId: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'college_coordinator' | 'mentor' | 'student_leader' | 'advisor';
  roleLabel: string;
  college: string;
  associatedProjectsCount: number;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  studentId: string;
  college: string;
  major: string;
  degree: '本科生' | '硕士研究生' | '博士研究生';
  roleInTeam: string;
  division: '技术研发/核心算法' | '市场拓展/商业模式' | '财务测算/融资对接' | '知识产权/法律合规' | '路演答辩/视觉呈现';
  isIpOwner: boolean;
  phone: string;
  email: string;
}

export interface ProjectTeam {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  college: string;
  trackLabel: string;
  grade: 'A' | 'B' | 'C' | 'D';
  leader: {
    name: string;
    studentId: string;
    college: string;
    major: string;
    degree: '本科生' | '硕士研究生' | '博士研究生';
    phone: string;
    email: string;
  };
  advisor: {
    name: string;
    title: string;
    college: string;
    phone: string;
  };
  members: TeamMemberItem[];
  crossCollege: boolean;
  hasFinanceSpecialist: boolean;
  ipOwnerEnrolled: boolean;
  auditStatus: 'verified' | 'need_supplement' | 'warning';
  auditRemark: string;
}

export const MOCK_USERS: SystemUser[] = [
  {
    id: 'user-001',
    name: '陈建国',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'T20180412',
    email: 'guideShiny@gmail.com',
    phone: '138-0010-9888',
    role: 'super_admin',
    roleLabel: '校级超级管理员',
    college: '创新创业学院',
    associatedProjectsCount: 82,
    status: 'active',
    lastLogin: '刚刚',
    createdAt: '2024-03-01',
  },
  {
    id: 'user-002',
    name: '周学文',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'T20201103',
    email: 'zhouxw@university.edu.cn',
    phone: '139-1234-5678',
    role: 'college_coordinator',
    roleLabel: '学院联络秘书',
    college: '电子与信息工程学院',
    associatedProjectsCount: 14,
    status: 'active',
    lastLogin: '10分钟前',
    createdAt: '2025-01-10',
  },
  {
    id: 'user-003',
    name: '王雪琴',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'T20190822',
    email: 'wangxq@university.edu.cn',
    phone: '137-9876-5432',
    role: 'college_coordinator',
    roleLabel: '学院联络秘书',
    college: '生物工程与生命科学学院',
    associatedProjectsCount: 11,
    status: 'active',
    lastLogin: '1小时前',
    createdAt: '2025-02-15',
  },
  {
    id: 'user-004',
    name: '赵元博',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'EXP-8801',
    email: 'zhaoyb@venturecapital.com',
    phone: '135-2233-4455',
    role: 'mentor',
    roleLabel: '国赛专家 / 产业投资人',
    college: '外部特聘专家库',
    associatedProjectsCount: 8,
    status: 'active',
    lastLogin: '3小时前',
    createdAt: '2025-04-01',
  },
  {
    id: 'user-005',
    name: '李清照',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'EXP-8802',
    email: 'liqzh@capitalpartners.cn',
    phone: '136-3344-5566',
    role: 'mentor',
    roleLabel: '国赛评委 / 财务风控专家',
    college: '外部特聘专家库',
    associatedProjectsCount: 6,
    status: 'active',
    lastLogin: '昨天',
    createdAt: '2025-04-05',
  },
  {
    id: 'user-006',
    name: '林子越',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'S20220199',
    email: 'linzy@student.edu.cn',
    phone: '188-1029-3847',
    role: 'student_leader',
    roleLabel: '项目负责人（博士生）',
    college: '电子与信息工程学院',
    associatedProjectsCount: 1,
    status: 'active',
    lastLogin: '5分钟前',
    createdAt: '2026-03-01',
  },
  {
    id: 'user-007',
    name: '苏静茹',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'S20230588',
    email: 'sujr@student.edu.cn',
    phone: '186-5544-3322',
    role: 'student_leader',
    roleLabel: '项目负责人（硕士生）',
    college: '生命科学学院',
    associatedProjectsCount: 1,
    status: 'active',
    lastLogin: '半小时前',
    createdAt: '2026-03-05',
  },
  {
    id: 'user-008',
    name: '张立恒',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'T20100201',
    email: 'zhanglh@university.edu.cn',
    phone: '139-0011-2233',
    role: 'advisor',
    roleLabel: '第一指导教师（教授）',
    college: '电子与信息工程学院',
    associatedProjectsCount: 2,
    status: 'active',
    lastLogin: '昨天',
    createdAt: '2024-05-12',
  },
  {
    id: 'user-009',
    name: '刘志刚',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    staffOrStudentId: 'S20230911',
    email: 'liuzg@student.edu.cn',
    phone: '185-9988-7766',
    role: 'student_leader',
    roleLabel: '项目负责人（本科生）',
    college: '软件工程学院',
    associatedProjectsCount: 1,
    status: 'inactive',
    lastLogin: '7天前',
    createdAt: '2026-04-10',
  }
];

export const MOCK_PROJECT_TEAMS: ProjectTeam[] = [
  {
    id: 'team-001',
    projectId: 'proj-001',
    projectCode: 'CX2026-A-0109',
    projectName: '光子芯眸——新一代全固态硅光激光雷达芯片破壁者',
    college: '电子与信息工程学院',
    trackLabel: '高教主赛道 · 创意组',
    grade: 'A',
    leader: {
      name: '林子越',
      studentId: 'S20220199',
      college: '电子与信息工程学院',
      major: '光学工程',
      degree: '博士研究生',
      phone: '188-1029-3847',
      email: 'linzy@student.edu.cn',
    },
    advisor: {
      name: '张立恒',
      title: '教授 / 长江学者',
      college: '电子与信息工程学院',
      phone: '139-0011-2233',
    },
    members: [
      {
        id: 'm-101',
        name: '林子越',
        studentId: 'S20220199',
        college: '电子与信息工程学院',
        major: '光学工程',
        degree: '博士研究生',
        roleInTeam: '队长 / 核心算法架构',
        division: '技术研发/核心算法',
        isIpOwner: true,
        phone: '188-1029-3847',
        email: 'linzy@student.edu.cn',
      },
      {
        id: 'm-102',
        name: '沈墨涵',
        studentId: 'S20230342',
        college: '微电子与集成电路学院',
        major: '集成电路工程',
        degree: '硕士研究生',
        roleInTeam: '副队长 / 流片封装',
        division: '技术研发/核心算法',
        isIpOwner: true,
        phone: '188-1029-3848',
        email: 'shenmh@student.edu.cn',
      },
      {
        id: 'm-103',
        name: '唐诗韵',
        studentId: 'U20210811',
        college: '经济管理学院',
        major: '金融科技与财务管理',
        degree: '本科生',
        roleInTeam: '财务总监 / 估值建模',
        division: '财务测算/融资对接',
        isIpOwner: false,
        phone: '188-1029-3849',
        email: 'tangsy@student.edu.cn',
      },
      {
        id: 'm-104',
        name: '徐浩然',
        studentId: 'U20220912',
        college: '法学院',
        major: '知识产权法',
        degree: '本科生',
        roleInTeam: '合规经理 / 专利布局',
        division: '知识产权/法律合规',
        isIpOwner: false,
        phone: '188-1029-3850',
        email: 'xuhr@student.edu.cn',
      },
      {
        id: 'm-105',
        name: '陆嘉宇',
        studentId: 'U20211105',
        college: '设计创意学院',
        major: '数字媒体与工业设计',
        degree: '本科生',
        roleInTeam: '视觉呈现 / PPT答辩总监',
        division: '路演答辩/视觉呈现',
        isIpOwner: false,
        phone: '188-1029-3851',
        email: 'luxy@student.edu.cn',
      },
    ],
    crossCollege: true,
    hasFinanceSpecialist: true,
    ipOwnerEnrolled: true,
    auditStatus: 'verified',
    auditRemark: '团队本硕博梯度极佳，跨电信、微电子、经管、法学4院交叉，财务专人已就位，专利发明人全在队，结构满分。',
  },
  {
    id: 'team-002',
    projectId: 'proj-002',
    projectCode: 'CX2026-R-0042',
    projectName: '菌草金粮——高抗逆盐碱地微藻蛋白重构与乡村振兴产业富民示范',
    college: '生命科学学院',
    trackLabel: '“青年红色筑梦之旅” · 创业组',
    grade: 'A',
    leader: {
      name: '苏静茹',
      studentId: 'S20230588',
      college: '生命科学学院',
      major: '微生物与生物发酵',
      degree: '硕士研究生',
      phone: '186-5544-3322',
      email: 'sujr@student.edu.cn',
    },
    advisor: {
      name: '何建平',
      title: '教授 / 农业农村部特聘专家',
      college: '生命科学学院',
      phone: '138-7766-5544',
    },
    members: [
      {
        id: 'm-201',
        name: '苏静茹',
        studentId: 'S20230588',
        college: '生命科学学院',
        major: '微生物学',
        degree: '硕士研究生',
        roleInTeam: '队长 / 菌种研发',
        division: '技术研发/核心算法',
        isIpOwner: true,
        phone: '186-5544-3322',
        email: 'sujr@student.edu.cn',
      },
      {
        id: 'm-202',
        name: '巴特尔',
        studentId: 'U20210219',
        college: '农学院',
        major: '草业科学与土壤改良',
        degree: '本科生',
        roleInTeam: '基地田间测产总监',
        division: '市场拓展/商业模式',
        isIpOwner: true,
        phone: '186-5544-3323',
        email: 'bateer@student.edu.cn',
      },
      {
        id: 'm-203',
        name: '杨雯',
        studentId: 'U20220455',
        college: '商学院',
        major: '市场营销与农村电商',
        degree: '本科生',
        roleInTeam: '合作社运营与渠道拓展',
        division: '市场拓展/商业模式',
        isIpOwner: false,
        phone: '186-5544-3324',
        email: 'yangw@student.edu.cn',
      },
      {
        id: 'm-204',
        name: '郭晓天',
        studentId: 'U20210981',
        college: '经济管理学院',
        major: '会计学',
        degree: '本科生',
        roleInTeam: '财务测算与补贴核算',
        division: '财务测算/融资对接',
        isIpOwner: false,
        phone: '186-5544-3325',
        email: 'guoxt@student.edu.cn',
      },
    ],
    crossCollege: true,
    hasFinanceSpecialist: true,
    ipOwnerEnrolled: true,
    auditStatus: 'verified',
    auditRemark: '红旅团队扎根西北一线，成员涵盖少数民族骨干与农学、商学交叉学科，真实带动农户增收台账齐备。',
  },
  {
    id: 'team-003',
    projectId: 'proj-003',
    projectCode: 'CX2026-A-0321',
    projectName: '微纳心脉——基于超构声学表面的人体植入式无源无线超声供能系统',
    college: '医学技术与生物医学工程学院',
    trackLabel: '高教主赛道 · 创意组',
    grade: 'A',
    leader: {
      name: '陈冠宇',
      studentId: 'S20220677',
      college: '医学技术与生物医学工程学院',
      major: '生物医学工程',
      degree: '博士研究生',
      phone: '139-4455-6677',
      email: 'chengy@student.edu.cn',
    },
    advisor: {
      name: '邓晓峰',
      title: '主任医师 / 博士生导师',
      college: '附属第一医院心血管科',
      phone: '137-0099-8877',
    },
    members: [
      {
        id: 'm-301',
        name: '陈冠宇',
        studentId: 'S20220677',
        college: '医学技术与生物医学工程学院',
        major: '生物医学工程',
        degree: '博士研究生',
        roleInTeam: '队长 / 核心传感器设计',
        division: '技术研发/核心算法',
        isIpOwner: true,
        phone: '139-4455-6677',
        email: 'chengy@student.edu.cn',
      },
      {
        id: 'm-302',
        name: '郑子豪',
        studentId: 'S20230890',
        college: '材料科学与工程学院',
        major: '压电薄膜材料',
        degree: '硕士研究生',
        roleInTeam: '声学表面制备',
        division: '技术研发/核心算法',
        isIpOwner: false,
        phone: '139-4455-6678',
        email: 'zhengzh@student.edu.cn',
      },
      {
        id: 'm-303',
        name: '王佳怡',
        studentId: 'U20210344',
        college: '临床医学院',
        major: '心血管内科（五年制）',
        degree: '本科生',
        roleInTeam: '动物实验与临床前评价',
        division: '市场拓展/商业模式',
        isIpOwner: false,
        phone: '139-4455-6679',
        email: 'wangjy@student.edu.cn',
      },
    ],
    crossCollege: true,
    hasFinanceSpecialist: false,
    ipOwnerEnrolled: true,
    auditStatus: 'need_supplement',
    auditRemark: '【待整改提示】全团队均为医工背景，缺少医疗器械三类注册长周期与财务测算专职人员，建议跨学院增补1名经管或财会专业本科生。',
  },
  {
    id: 'team-004',
    projectId: 'proj-004',
    projectCode: 'CX2026-I-0018',
    projectName: '天工智联——千万级高并发工业物联网时间敏感网络(TSN)协议芯片',
    college: '计算机科学与技术学院',
    trackLabel: '产业命题赛道',
    grade: 'A',
    leader: {
      name: '赵子豪',
      studentId: 'S20220811',
      college: '计算机科学与技术学院',
      major: '计算机系统结构',
      degree: '博士研究生',
      phone: '136-7788-9900',
      email: 'zhaozh@student.edu.cn',
    },
    advisor: {
      name: '沈思远',
      title: '教授 / 网络通信国家重点实验室主任',
      college: '计算机科学与技术学院',
      phone: '139-1122-3344',
    },
    members: [
      {
        id: 'm-401',
        name: '赵子豪',
        studentId: 'S20220811',
        college: '计算机学院',
        major: '计算机系统',
        degree: '博士研究生',
        roleInTeam: '队长 / 协议栈研发',
        division: '技术研发/核心算法',
        isIpOwner: true,
        phone: '136-7788-9900',
        email: 'zhaozh@student.edu.cn',
      },
      {
        id: 'm-402',
        name: '方可心',
        studentId: 'U20210722',
        college: '经济管理学院',
        major: '工商管理',
        degree: '本科生',
        roleInTeam: '企业命题对接 / 商业计划',
        division: '财务测算/融资对接',
        isIpOwner: false,
        phone: '136-7788-9901',
        email: 'fangkx@student.edu.cn',
      },
    ],
    crossCollege: true,
    hasFinanceSpecialist: true,
    ipOwnerEnrolled: true,
    auditStatus: 'verified',
    auditRemark: '已与命题出题企业中车株机签署联合开发中试备忘录，产教融合成效突出。',
  },
  {
    id: 'team-005',
    projectId: 'proj-005',
    projectCode: 'CX2026-A-0552',
    projectName: '青藤创客——面向中小学的低代码AI创新教具与课程体系',
    college: '教育与心理科学学院',
    trackLabel: '高教主赛道 · 创意组',
    grade: 'D',
    leader: {
      name: '刘志刚',
      studentId: 'S20230911',
      college: '教育学院',
      major: '现代教育技术',
      degree: '本科生',
      phone: '185-9988-7766',
      email: 'liuzg@student.edu.cn',
    },
    advisor: {
      name: '周海峰',
      title: '副教授',
      college: '教育与心理科学学院',
      phone: '135-6677-8899',
    },
    members: [
      {
        id: 'm-501',
        name: '刘志刚',
        studentId: 'S20230911',
        college: '教育学院',
        major: '教育技术',
        degree: '本科生',
        roleInTeam: '队长 / 课程编撰',
        division: '技术研发/核心算法',
        isIpOwner: false,
        phone: '185-9988-7766',
        email: 'liuzg@student.edu.cn',
      }
    ],
    crossCollege: false,
    hasFinanceSpecialist: false,
    ipOwnerEnrolled: false,
    auditStatus: 'warning',
    auditRemark: '【一票否决预警】申报书查重率高达 38.5%，且核心知识产权为校外商业公司所有，无合法转让凭据，已暂缓推荐资格。',
  }
];
