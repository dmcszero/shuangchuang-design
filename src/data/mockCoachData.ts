/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
  badgeColor: string;
  fundName: string;
  maxGrant: string;
  labs: Array<{ name: string; leader: string; matchScore: number; direction: string }>;
  reimbursementSteps: string[];
  pastWinners: Array<{ name: string; award: string; year: string; mentor: string; contact: string }>;
}

export interface CoachScenarioCard {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  sampleQuestion: string;
  tag: string;
}

export interface CoachStage {
  id: 'L1' | 'L2' | 'L3' | 'L4';
  title: string;
  name: string;
  desc: string;
  focus: string;
  badgeColor: string;
}

export interface TrackComparisonItem {
  track: string;
  group: string;
  eligibility: string;
  reviewFocus: string;
  teamProfile: string;
  recommendationScore: number;
  advice: string;
  isRecommended: boolean;
}

export interface JudgePersonaDef {
  id: 'investor' | 'academic' | 'industrial' | 'critical' | 'comprehensive';
  name: string;
  role: string;
  style: string;
  avatarBg: string;
  avatarText: string;
  description: string;
  focusArea: string;
  grillDifficulty: '高' | '极高' | '中等';
}

export interface CompetitorItem {
  name: string;
  tier: string;
  product: string;
  latestRound: string;
  fundingAmount: string;
  strengths: string;
  weakness: string;
  ourAdvantage: string;
}

export interface GoldCaseItem {
  id: string;
  title: string;
  competition: string;
  award: string;
  year: string;
  track: string;
  school: string;
  summary: string;
  highlights: string[];
  actionableTakeaways: string[];
  businessModelTrait: string;
}

export interface DefenseQAExchange {
  questionId: number;
  judgeQuestion: string;
  judgeTone: string;
  presetAnswers: Array<{
    id: string;
    label: string;
    text: string;
    score: number;
    tag: string;
    critique: string;
  }>;
  counterQuestion: string;
  counterJudgeTone: string;
  counterAnswers: Array<{
    id: string;
    label: string;
    text: string;
    score: number;
    tag: string;
    critique: string;
  }>;
  review: {
    questionTitle: string;
    score: number;
    lossReason: string;
    standardAnswer: string;
  };
}

// Preset universities
export const mockUniversities: UniversityOption[] = [
  {
    id: 'xmu',
    name: '厦门大学',
    shortName: '厦大',
    badgeColor: 'bg-blue-600 text-white',
    fundName: '厦门大学双创学院「翔安创客种子基金」',
    maxGrant: '最高 10 万元无偿资助',
    labs: [
      { name: '信息学院机器视觉与智能遥感实验室', leader: '张林教授 (国家杰青)', matchScore: 98, direction: '低空多光谱成像与农业边缘计算算子' },
      { name: '生命科学学院作物逆境应答重点实验室', leader: '黄副教授', matchScore: 92, direction: '水稻稻瘟病早筛生理生化指标验证' },
      { name: '经济学院农村金融与产业经济课题组', leader: '李研究员', matchScore: 89, direction: '涉农合作社商业变现与三方农险分成模型' }
    ],
    reimbursementSteps: [
      '第一步：登录厦大双创办事大厅提交《创新大赛立项培育及打样耗材申报表》',
      '第二步：指导教师线上确认经费预算（支持样机差旅、大田实验农资与专利申请代办）',
      '第三步：双创学院 48 小时极速线上核批，报销凭证扫码入账至项目团队银行卡'
    ],
    pastWinners: [
      { name: '智农天眼：丘陵果树病虫害无人机多光谱定损系统', award: '第九届国赛金奖 (红旅组)', year: '2024', mentor: '张林教授', contact: '陈学长 (已入驻翔安创客空间，微信可内推)' },
      { name: '海丝菌灵：新型耐盐碱海洋药用微藻繁育技术', award: '第十届国赛金奖 (主赛道研究生组)', year: '2025', mentor: '刘院士团队', contact: '林学姐 (双创导师团助教)' }
    ]
  },
  {
    id: 'tsinghua',
    name: '清华大学',
    shortName: '清华',
    badgeColor: 'bg-purple-800 text-white',
    fundName: '清华大学 x-lab 种子孵化专项支持计划',
    maxGrant: '最高 20 万元创客探索基金',
    labs: [
      { name: '自动化系智能无人系统控制研究所', leader: '王讲席教授', matchScore: 96, direction: '轻量化端侧视觉神经网络' },
      { name: '环境学院现代生态农业与遥感中心', leader: '周研究员', matchScore: 91, direction: '智慧农田精准变量作业系统' }
    ],
    reimbursementSteps: [
      '第一步：清华 x-lab 导师委员会线上评审立项',
      '第二步：财务系统立项专用额度直接划拨',
      '第三步：凭发票与测试验收报告一键报销'
    ],
    pastWinners: [
      { name: '清禾智联：空天地一体化精准农业遥感感知终端', award: '第十届国赛金奖', year: '2025', mentor: '李院士', contact: '孙学长' }
    ]
  },
  {
    id: 'zju',
    name: '浙江大学',
    shortName: '浙大',
    badgeColor: 'bg-blue-800 text-white',
    fundName: '浙江大学求是强鹰创新创业扶持基金',
    maxGrant: '最高 15 万元孵化支持',
    labs: [
      { name: '生物系统工程与食品科学学院智能农业装备研究所', leader: '陈求是教授', matchScore: 97, direction: '农业多光谱近红外无损检测' },
      { name: '计算机科学与技术学院CAD&CG国家重点实验室', leader: '赵教授', matchScore: 90, direction: '高光谱点云重建与冠层分析' }
    ],
    reimbursementSteps: [
      '第一步：浙大生仪/生工学院科研科备案',
      '第二步：双创学院开通紫金港打样工坊设备使用权限',
      '第三步：专项经费报销线上直报'
    ],
    pastWinners: [
      { name: '绿稻先锋：基于近红外反射光谱的水稻飞防预警', award: '第八届国赛金奖 (红旅乡村振兴组)', year: '2023', mentor: '何教授', contact: '郭学长' }
    ]
  },
  {
    id: 'scut',
    name: '华南理工大学',
    shortName: '华工',
    badgeColor: 'bg-emerald-700 text-white',
    fundName: '华南理工大学百步梯青年双创扶助计划',
    maxGrant: '最高 12 万元无偿资助',
    labs: [
      { name: '农林装备智能控制与轻量化微纳传感实验室', leader: '刘教授', matchScore: 95, direction: '亚热带湿热农田多光谱微型相机' }
    ],
    reimbursementSteps: [
      '第一步：华工百步梯攀登计划平台填报',
      '第二步：学院团委审核项目成熟度',
      '第三步：打款至团队专项创业卡'
    ],
    pastWinners: [
      { name: '岭南果网：荔枝霜疫霉病智能光谱早筛巡检车', award: '第九届国赛银奖', year: '2024', mentor: '朱教授', contact: '梁学长' }
    ]
  }
];

// 4 Core Capability Scenarios
export const mockScenarioCards: CoachScenarioCard[] = [
  {
    id: 'policy',
    code: '4.1.1',
    title: '政策百事通',
    subtitle: '赛道规则 · 申报条件 · 条款溯源',
    icon: 'ScrollText',
    color: 'from-blue-500 to-indigo-600',
    sampleQuestion: '我的项目是 AI+农业，能报哪个赛道？',
    tag: '政策规范库'
  },
  {
    id: 'diagnosis',
    code: '4.1.2 → 4.2',
    title: '金牌备赛教练',
    subtitle: 'BP 深度诊断 · 六维雷达 · 逐章批注',
    icon: 'BrainCircuit',
    color: 'from-amber-500 to-orange-600',
    sampleQuestion: '我写了 BP 初稿，帮我深度诊断一下',
    tag: '调用 4.2 引擎'
  },
  {
    id: 'industry',
    code: '4.1.3',
    title: '行业情报局',
    subtitle: '金奖案例对标 · 竞品投融资图谱',
    icon: 'Radar',
    color: 'from-emerald-500 to-teal-600',
    sampleQuestion: '近三年红旅赛道金奖项目商业模式共性？',
    tag: '百万向量案例库'
  },
  {
    id: 'campus',
    code: '4.1.4',
    title: '校内智库',
    subtitle: '本校扶持政策 · 导师匹配 · 报销通道',
    icon: 'Building2',
    color: 'from-purple-500 to-pink-600',
    sampleQuestion: '本校双创学院有什么扶持政策与报销流程？',
    tag: '校本认证资源'
  }
];

// 4 Preparation Stages
export const mockStages: CoachStage[] = [
  {
    id: 'L1',
    title: 'L1 创意探索期',
    name: '创意期',
    desc: '聚焦痛点真实性检验与初步技术构想，尚未完成正式样机。',
    focus: '重点攻克：伪痛点排查、赛道定位与团队初创成员补齐',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'L2',
    title: 'L2 概念验证期',
    name: '验证期',
    desc: '拥有实验室技术原型与小规模对照数据，准备撰写商业计划书初稿。',
    focus: '重点攻克：技术壁垒论证、关键参数对比测试与商业模式草拟',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'L3',
    title: 'L3 模式成型期',
    name: '成型期',
    desc: '具备成套 BP、真实大田/客户测试数据与小批量订单，准备备战校赛与省赛。',
    focus: '重点攻克：商业闭环验证、财务数据前后逻辑一致性与 8 分钟答辩精炼',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'L4',
    title: 'L4 国赛冲刺期',
    name: '冲刺期',
    desc: '已获省赛金奖/国赛入围资格，材料完备，正进行高强度评委答辩演练。',
    focus: '重点攻克：防范评委连环追问、突发刁难应答与展示材料金奖视觉升维',
    badgeColor: 'bg-red-50 text-red-700 border-red-200'
  }
];

// Track comparison table
export const mockTrackComparisons: TrackComparisonItem[] = [
  {
    track: '高教主赛道',
    group: '新农科组（或研究生组）',
    eligibility: '项目负责人员必须为高校全日制在校生；技术具有较强学术新颖度与自主发明专利；需完成实验室原理验证。',
    reviewFocus: '【科技创新性 40%】+【商业可行性 30%】+【团队与带动就业 20%】+【材料质量 10%】。侧重底层算法突破与进口替代壁垒。',
    teamProfile: '以理工农交叉学科博硕士为主，学术带头人或国家级课题支撑强。',
    recommendationScore: 92,
    advice: '如果团队拥有多光谱传感器自研硬件专利和 SCI 论文，且希望突出“用硬核 AI 赋能农业现代化”，主赛道新农科组是黄金选择！',
    isRecommended: true
  },
  {
    track: '青年红色筑梦之旅赛道',
    group: '乡村振兴组',
    eligibility: '项目必须紧密对接国家乡村振兴战略，深入广大农村基层，有扎实的田间落地服务台账与地方政府/合作社盖章证明。',
    reviewFocus: '【红旅精神与社会价值 35%】+【乡村振兴落地实效 30%】+【商业可持续闭环 20%】+【团队扎根实践 15%】。严禁“作秀式下乡”。',
    teamProfile: '农林学子领衔，有扎根田埂的踏实故事，有村镇合作社农户的真实笑脸与增收台账。',
    recommendationScore: 88,
    advice: '如果团队已在福建、江西等水稻产区有长达 1-2 年的驻点推广，有上千亩大田防灾减灾挽损实测报告，红旅赛道具有极高的金奖竞争力！',
    isRecommended: false
  }
];

// 5 Judge Personas
export const mockJudgePersonas: JudgePersonaDef[] = [
  {
    id: 'critical',
    name: '张严苛 评委',
    role: '国赛资深常委 / 质疑型评委',
    style: '言辞犀利 · 紧抓软肋 · 连环追问',
    avatarBg: 'bg-red-600',
    avatarText: '严',
    description: '擅长捕捉商业计划书中的逻辑漏洞与数据矛盾，重点质疑技术壁垒是否真实、巨头是否能轻易复制。',
    focusArea: '核心壁垒真实性、大疆/极飞巨头竞品压制、农户付费意愿真伪',
    grillDifficulty: '极高'
  },
  {
    id: 'investor',
    name: '陈投资 评委',
    role: '红杉/深创投合伙人 / 投资型评委',
    style: '关注算账 · 考量 ROI · 商业闭环',
    avatarBg: 'bg-blue-600',
    avatarText: '投',
    description: '从风险投资人角度考察客单价、CAC 获客成本、LTV、毛利率与资本退出通道。',
    focusArea: '单台硬件物料成本(BOM)、农险补贴分成可持续性、三年营收预测',
    grillDifficulty: '高'
  },
  {
    id: 'academic',
    name: '李教授 评委',
    role: '院士团队学术带头人 / 学术型评委',
    style: '严谨求实 · 审查机理 · 论文专利',
    avatarBg: 'bg-purple-600',
    avatarText: '学',
    description: '重点考查多光谱反射率反演算法的泛化能力，以及是否在不同积温带农田做过双盲对照组试验。',
    focusArea: '算法原创性、太阳光照波动抗干扰鲁棒性、自主知识产权链条',
    grillDifficulty: '高'
  },
  {
    id: 'industrial',
    name: '周实战 评委',
    role: '农业农村部推广总站专家 / 产业型评委',
    style: '田间实战 · 泥土气息 · 落地实效',
    avatarBg: 'bg-emerald-600',
    avatarText: '产',
    description: '关注农机田间颠簸环境下的耐受度、无人机载重电池续航、农户对复杂操作界面的接受门槛。',
    focusArea: '农忙季节实操可用性、飞防机手培训成本、村集体推广阻力',
    grillDifficulty: '中等'
  },
  {
    id: 'comprehensive',
    name: '高会长 评委',
    role: '大赛专家委员会主任 / 综合型评委',
    style: '宏观视野 · 叙事节奏 · 育人成效',
    avatarBg: 'bg-amber-600',
    avatarText: '综',
    description: '全面审视项目立意、团队领军人物特质与 8 分钟答辩的起承转合感染力。',
    focusArea: '学生第一作者身份、创业初心与国家粮食安全战略的同频共振',
    grillDifficulty: '高'
  }
];

export interface AtomicDefenseQuestion {
  qId: number;
  category: string;
  question: string;
  difficulty: '极高' | '高' | '中等';
}

// 5 Dedicated Question Banks per Judge Persona for 4.3 Atomic Shallow Call
export const mockJudgeQuestionsMap: Record<string, AtomicDefenseQuestion[]> = {
  critical: [
    {
      qId: 1,
      category: '巨头降维竞争与替代壁垒',
      question: '如果大疆农业或极飞科技在农用无人机机载固件中免费开源相似的多光谱病理反演算法，你们凭什么不被大厂降维抹杀？',
      difficulty: '极高'
    },
    {
      qId: 2,
      category: '下沉农户真实付费意愿',
      question: '散户茶农靠天吃饭习惯根深蒂固，你们测算的单户 800 元/年软件订阅费，真实的自愿付费转化台账能拿出几户？',
      difficulty: '极高'
    },
    {
      qId: 3,
      category: '财务预测与供应链产能脱节',
      question: '商业计划书中预测 2026 年营收达 1200 万元，但当前装配线年产仅 30 套，营收暴增预期与供应链产能在逻辑上如何自洽？',
      difficulty: '高'
    },
    {
      qId: 4,
      category: '复杂野外环境算法鲁棒性',
      question: '阴雨天光照漫反射导致光谱失真，你们在建瓯雨季实测中宣称的 94.6% 早期识别准确率，有国家级权威机构鉴定公函吗？',
      difficulty: '极高'
    },
    {
      qId: 5,
      category: '团队结构与田间推广短板',
      question: '团队核心多为计算机和软件专业学生，缺少农林植保与农村下沉渠道实战经验，凭什么把产品真正推到田间地头？',
      difficulty: '高'
    }
  ],
  investor: [
    {
      qId: 1,
      category: '硬件BOM成本与毛利率空间',
      question: '你们单台硬件巡检设备的真实物料成本(BOM)是多少？毛利率能否支撑你们在全国各主要茶区自建本地化运维与渠道团队？',
      difficulty: '极高'
    },
    {
      qId: 2,
      category: '险企结算周期与现金流断裂风险',
      question: '你们将主要收入押注在“保险公司定损挽损分成”，险企内部立项与资金结算周期长达 9-12 个月，如何解决早期现金流断裂风险？',
      difficulty: '高'
    },
    {
      qId: 3,
      category: '获客成本(CAC)与单店模型',
      question: '测算中单亩获客成本仅为 300 元，在分散的农业下沉市场，真实的销售人天成本与交通差旅是否严重低估？',
      difficulty: '高'
    },
    {
      qId: 4,
      category: '三年营收阶梯预测与复购率',
      question: '针对未来三年的营收阶梯预测，存量客户的复购率与 LTV（客户生命周期价值）计算模型是怎样的？',
      difficulty: '高'
    },
    {
      qId: 5,
      category: '资本退出路径与融资抗风险',
      question: '目前项目尚未实现正向现金流，如果下一轮股权融资未能按期到位，你们现有的资金储备能支撑团队运转多少个月？',
      difficulty: '高'
    }
  ],
  academic: [
    {
      qId: 1,
      category: '多光谱反演底层算法原创性',
      question: '学术界对多光谱叶绿素反演已有大量开源模型，你们自研算法相较于国际顶刊 SOTA 模型的底层理论创新到底在哪里？',
      difficulty: '极高'
    },
    {
      qId: 2,
      category: '跨积温带与土壤类型过拟合',
      question: '南方茶树在不同积温带、土壤酸碱度与光照倾角下光谱特征差异极大，你们的模型在跨区域迁移时是否存在严重的过拟合现象？',
      difficulty: '高'
    },
    {
      qId: 3,
      category: '高校职务发明专利权属清晰度',
      question: '核心发明专利中，学生第一作者与导师专利的权利归属划分是否清晰？是否存在高校职务发明的知识产权纠纷隐患？',
      difficulty: '高'
    },
    {
      qId: 4,
      category: '专有病理数据集双盲交叉复核',
      question: '团队宣称的 20 万张专有病理数据集，标注标准是否经过中国农科院权威植保专家的双盲交叉复核？',
      difficulty: '高'
    },
    {
      qId: 5,
      category: '高速巡航物理反演自适应校正',
      question: '当无人机在高速巡航（>8m/s）时，气流扰动引起的镜头抖动与边缘畸变，你们在物理反演层是如何进行实时自适应校正的？',
      difficulty: '极高'
    }
  ],
  industrial: [
    {
      qId: 1,
      category: '农村飞防机手实操门槛',
      question: '农村飞防机手多数年龄偏大且文化程度不高，你们的操作界面和处方图生成是否需要专业算法人员现场介入？',
      difficulty: '中等'
    },
    {
      qId: 2,
      category: '农忙突发故障应急响应时效',
      question: '农忙季节病虫害爆发窗口期只有 3-5 天，一旦设备在偏远山区出现故障，你们的本地化应急售后响应时效是几小时？',
      difficulty: '高'
    },
    {
      qId: 3,
      category: '村集体既有农资渠道突破',
      question: '很多村集体合作社已有固定的农资采购与飞防外包合作方，你们作为大学生初创团队，如何打破原有的利益格局进入渠道？',
      difficulty: '极高'
    },
    {
      qId: 4,
      category: '主流植保无人机变量喷洒协议打通',
      question: '处方图与市面上主流植保无人机（如大疆 T50 / 极飞 P100）的变量喷洒接口协议是否已经完成官方底层打通？',
      difficulty: '高'
    },
    {
      qId: 5,
      category: '两季大田双盲实证对比公章报告',
      question: '你们在建瓯合作社的试验田，除虫效果对比传统经验用药，是否有当地农业农村局出具的连续两季对比实证报告？',
      difficulty: '高'
    }
  ],
  comprehensive: [
    {
      qId: 1,
      category: '学生第一负责人研发与经营决策权',
      question: '作为高教主赛道项目，学生第一负责人在技术研发和企业运营中实际行使多大决策权？指导老师是否深度代劳？',
      difficulty: '极高'
    },
    {
      qId: 2,
      category: '青年创业担当与一线卡脖子攻坚',
      question: '团队成员在这次创业备赛过程中，具体解决了哪些国家“卡脖子”或乡村振兴一线的关键痛点？体现了怎样的青年担当？',
      difficulty: '高'
    },
    {
      qId: 3,
      category: '毕业后全职创业扎根决心',
      question: '如果毕业后团队成员拿到大厂高薪 Offer，项目负责人和核心骨干能否真正全职扎根农业持续创业？',
      difficulty: '高'
    },
    {
      qId: 4,
      category: '国家粮食安全与农药减量宏观契合',
      question: '商业计划书的叙事逻辑中，如何把硬核的光学算法与国家粮食安全、农药减量增效国家战略更有机地结合起来？',
      difficulty: '高'
    },
    {
      qId: 5,
      category: '8分钟路演开场视觉与故事线穿透力',
      question: '汇报 PPT 前三页在视觉和故事线上如何快速抓住评委眼球，用最直观的数据证明你们不可替代的价值？',
      difficulty: '高'
    }
  ]
};

// Q&A Grilling Script for "智耘农业" vs Critical Judge
export const mockDefenseScript: DefenseQAExchange = {
  questionId: 1,
  judgeQuestion: '「智耘农业」林同学，你们主打多光谱水稻病害预警。但据我所知，大疆农业（DJI）和极飞科技（XAG）拥有极强的无人机硬件和全国飞防网络。如果他们下周直接在现有无人机上挂载一个 300 块钱的多光谱相机升级固件，你们的核心技术壁垒到底在哪？凭什么活下去？',
  judgeTone: '语气冷峻，直击要害，眼神紧盯选手',
  presetAnswers: [
    {
      id: 'ans-1',
      label: '方案 A（推荐 · 数据与算法双重壁垒）',
      text: '感谢评委老师一针见血的提问！我们与大疆不是替代关系，而是互补生态。我们的核心壁垒有两点：第一，在算法机理上，通用视觉只能识别叶片发黄（已是病害晚期），而我们团队历时三年构建了涵盖我国南方 12 种水稻病害在潜伏期的「叶绿素荧光-近红外特征反射谱专有数据库」，具有 4 项授权发明专利，能提前 3-5 天预警，阻断爆发；第二，在生态上，我们做的是标准软硬件扩展包（Payload SDK），已适配大疆 M350 行业机，大疆卖无人机，我们提供高价值病害诊断算法订阅，形成共赢。',
      score: 92,
      tag: '金奖回答范式',
      critique: '非常优秀的应答！既清晰阐释了提前3-5天潜伏期诊断的物理算法机理，又把“巨头竞争”转化为“生态共赢”，展示了成熟商业认知。'
    },
    {
      id: 'ans-2',
      label: '方案 B（平庸 · 强调价格与售后服务）',
      text: '大疆主要做硬件飞行器，他们对水稻农业病理不了解。我们团队全天在田里跑，我们的售后服务更好，而且我们的设备价格比他们便宜 30% 以上，农户更喜欢用我们。',
      score: 65,
      tag: '常见失分答法',
      critique: '大忌！在顶级国赛评委面前，初创团队千万不要用“比大厂更懂行业、比大厂价格更便宜”作为壁垒，大厂的研发团队和资金随时能降维打击，缺乏说服力。'
    }
  ],
  counterQuestion: '你说构建了 12 种水稻病害反射谱数据库，但农户和合作社买单看的是最直接的经济账——究竟能帮他们每亩多打多少斤粮？挽回多少钱损失？你们在福建、江西有连续两季由第三方农技部门盲测盖章的实测增产增收证明吗？',
  counterJudgeTone: '步步紧逼，追查真实田间落地证据与量化台账',
  counterAnswers: [
    {
      id: 'c-ans-1',
      label: '方案 A（推荐 · 拿出一组铁证量化台账）',
      text: '完全有！这正是我们项目的立足之本。在 2024-2025 年早稻与晚稻两季中，我们在福建建瓯和江西吉安 6 个示范合作社累计完成 1.8 万亩盲测。由福建省农技推广总站与阳光农业相互保险出具的第三方联合测产报告显示：通过提前 4 天锁定稻瘟病核心发病中心，农户农药喷洒量减少 35%，每亩减少绝产挽损 142 元；配合按次诊断服务，农户投入产出比（ROI）达到 1:7.2，合作社复购率达 91%。',
      score: 95,
      tag: '高分铁证范式',
      critique: '精准命中！用“时间跨度（两季）+ 地点（建瓯、吉安）+ 权威第三方（农技站+农险）+ 核心三要素（减药35%、挽损142元、ROI 1:7.2）”形成闭环证据链，评委无可挑剔！'
    },
    {
      id: 'c-ans-2',
      label: '方案 B（模糊 · 泛泛而谈“效果很好”）',
      text: '我们做过很多实验，当地农户反馈都非常好，大家都很高兴。我们也在省里拿了相关报告，能够明显减少病虫害，为国家粮食安全做出很大贡献。',
      score: 58,
      tag: '严重失分',
      critique: '严重失分！评委要的是具体量化数据和公章背书，泛泛而谈“反馈很好、贡献很大”会直接被判定为材料虚假或缺乏实操落地。'
    }
  ],
  review: {
    questionTitle: '第一轮追问：巨头竞争壁垒 & 田间经济账实证',
    score: 82,
    lossReason: '在初次答辩中容易将“技术指标”与“商业落地”割裂，未能在开头前 10 秒抛出权威第三方增收数据。',
    standardAnswer: '【金奖答辩通用公式】① 定性站位（转化竞争为生态协同）+ ② 核心壁垒（物理机理/专有数据集/专利群）+ ③ 第三方盲测铁证（时间+地点+公章+ROI）。'
  }
};

// 3 Anonymized Gold Cases
export const mockGoldCases: GoldCaseItem[] = [
  {
    id: 'case-1',
    title: '神农智巡：水稻智能遥感无人机巡检与病虫害低空早筛系统',
    competition: '中国国际大学生创新大赛（2024）',
    award: '全国总决赛金奖（第一名）',
    year: '2024',
    track: '青年红色筑梦之旅赛道 · 乡村振兴组',
    school: '华中农业大学',
    summary: '针对水稻白叶枯病与稻飞虱爆发期短、人工巡田漏检率高达40%的痛点，团队自研边缘端轻量化多光谱云台与稻田病斑反演算法，实现低空 50 米极速巡田。',
    highlights: [
      '扎根湖北荆州、江西抚州 4 年，累计开展飞防巡田 12 万亩次',
      '与中国人民财产保险（PICC）农业保险部合作，将系统列为官方农险定损验标工具',
      '建立“村集体农机合作社托管模式”，按季向合作社收取每亩 8 元诊断服务费'
    ],
    actionableTakeaways: [
      '商业模式不要直接找农户收机器费，而是向村集体合作社收取低门槛服务费或参与农险分成',
      '必须有连续 2 年以上的第三方官方测产对比数据（含对照组实验）',
      '路演答辩中重点突出“为农户挽损增收的总账本”'
    ],
    businessModelTrait: '政企险三方联动 · 农险定损补贴 + 合作社托管分成'
  },
  {
    id: 'case-2',
    title: '青稞卫士：高原青稞抗黑穗病智能近红外光谱选育与病害防控',
    competition: '中国国际大学生创新大赛（2023）',
    award: '全国总决赛金奖',
    year: '2023',
    track: '高教主赛道 · 新农科组',
    school: '四川大学 / 西藏农牧学院',
    summary: '利用微型近红外光谱探头与机器学习算法，在西藏日喀则等地实现青稞原种纯度无损快检与田间黑穗病孢子早期捕获。',
    highlights: [
      '攻克高海拔强紫外线与极端温差环境下的光学探头温漂校正难题',
      '获得国家发明专利 6 项，发表农业工程顶刊 3 篇',
      '由西藏自治区农业农村厅列为全区现代农业重大科技成果推广项目'
    ],
    actionableTakeaways: [
      '主赛道新农科组必须展现极高的学术严谨性与工学创新突破',
      '硬件测试必须有极端工况测试报告（如抗震动、抗光照波动、低温耐受）',
      '论文和专利要在答辩 PPT 前 3 页快速亮出支撑'
    ],
    businessModelTrait: '专精特新产学研转化 · 农业农村厅科技推广采购直补'
  },
  {
    id: 'case-3',
    title: '柑橘天眼：丘陵山地柑橘黄龙病低空热成像早筛网络',
    competition: '中国国际大学生创新大赛（2022）',
    award: '全国总决赛金奖',
    year: '2022',
    track: '青年红色筑梦之旅赛道 · 乡村振兴组',
    school: '华南农业大学',
    summary: '针对柑橘黄龙病“潜伏期长、一旦发病必须整树砍除”的毁灭性风险，团队利用无人机机载热红外与多光谱融合，提前 40 天预警染病植株。',
    highlights: [
      '覆盖赣南脐橙与广东德庆贡柑产区，挽回果农经济损失超 8000 万元',
      '首创“设备零元租赁 + 挽损精准分成 + 专用药剂定向配送”闭环',
      '团队 12 名成员全部驻村半年以上，典型事迹被人民日报、央视新闻报道'
    ],
    actionableTakeaways: [
      '红旅赛道必须有极强的“泥土气息”和真挚的青年奉献情怀',
      '“提前预警挽救损失”是农业科技项目最打动评委的核心故事线',
      '商业模式闭环要与农资、飞防产业链深度绑定'
    ],
    businessModelTrait: '设备免押铺样 + 挽损收益分成 + 绿色农药统防统治'
  }
];

// Competitor research data
export const mockCompetitorList: CompetitorItem[] = [
  {
    name: '极飞科技 (XAG)',
    tier: '行业巨头 (头部独角兽)',
    product: 'P100 Pro 农业无人机 + 极侠遥感无人机 + 智慧农场系统',
    latestRound: 'C+ 轮 (拟冲刺科创板)',
    fundingAmount: '超 15 亿元人民币',
    strengths: '覆盖全产业链硬件与全国千家农服网点，品牌认知度极高',
    weakness: '硬件偏通用化，针对水稻特定隐蔽病害潜伏期的微观光谱反演机理未做精细化垂直适配',
    ourAdvantage: '「智耘农业」专注水稻专属病理光谱模型，精度高 18%，可作为极飞生态的即插即用算法载荷'
  },
  {
    name: '麦飞科技 (McFly)',
    tier: '农业高光谱独角兽',
    product: '麦视机载多光谱视觉监测套件 + 农田数字化处方图',
    latestRound: 'A+ 轮',
    fundingAmount: '数亿元 (百度风投领投)',
    strengths: '技术积淀深厚，主打小麦与玉米大田病害监测',
    weakness: '单套高光谱设备采购成本高达 15-20 万元，南方水稻散户及中小型合作社难以承受',
    ourAdvantage: '「智耘农业」采用自研窄带滤波分光方案，硬件成本降至 8000 元内，主打高性价比普惠农机'
  },
  {
    name: '珈和科技 (GeoHey)',
    tier: '卫星遥感数据提供商',
    product: '珈和农情遥感云平台',
    latestRound: 'B 轮',
    fundingAmount: '近亿元',
    strengths: '大范围卫星宏观长势监测与产量宏观估算能力强',
    weakness: '卫星光学分辨率（10米级）无法检测单株水稻叶片潜伏期病斑，受云雾多雨天气影响大',
    ourAdvantage: '「智耘农业」低空 50 米无人机巡检分辨率达到毫米级，阴雨多雾天气仍可灵活升空作业'
  }
];

// Operational flywheel metrics
export const mockOperationMetrics = {
  activeStudentsWeekly: '4,820',
  totalQuestions: '68,430',
  avgQuestionsPerUser: '14.6',
  scenarioDistribution: [
    { name: '4.1.1 政策百事通', percentage: 28, count: '19,160次' },
    { name: '4.1.2 金牌备赛教练 (4.2/4.3)', percentage: 38, count: '26,003次' },
    { name: '4.1.3 行业情报局', percentage: 22, count: '15,055次' },
    { name: '4.1.4 校内智库', percentage: 12, count: '8,212次' }
  ],
  qualityMetrics: {
    userSatisfactionRate: '96.4%',
    policyTraceableRate: '100%',
    diagnosisAdoptionRate: '88.2%',
    qASkillFeedbackCount: '1,429 条'
  },
  businessImpact: {
    schoolAdvancementRate: '58.4%', // Before: 32%
    schoolAdvancementGrowth: '+82.5%',
    provincialGoldMedalCount: '18 项',
    nationalGoldMedalTarget: '6 项 (在冲刺中)'
  },
  flywheelLogs: [
    { time: '10:24:18', text: '学生林小满点击「已采纳」BP 商业模式修改建议，系统自动将「涉农合作社三方分成规则」沉淀进 4.2 诊断规则库。' },
    { time: '09:41:05', text: '评审专家修正「高教主赛道新农科组」创新性 90 分锚点，已反向加固政策百事通检索召回权重。' },
    { time: '08:15:30', text: '更新《厦门大学 2026 年双创种子基金申报指引（V3.0）》，校内智库接口实时生效。' }
  ]
};
