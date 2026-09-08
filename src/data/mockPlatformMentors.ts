import { TrackType } from '../types';

export interface PlatformMentorExpert {
  id: string;
  code: string; // 平台国家级专家编号 如 NAT-EXP-001
  name: string;
  avatar: string;
  title: string;
  organization: string;
  certificationLevel: 'fellow' | 'national_senior' | 'leading_investor' | 'industry_chief' | 'legal_finance' | 'alumni_champ';
  levelLabel: string;
  roleCategory: 'national_judge' | 'investor' | 'industry' | 'academic' | 'legal_finance' | 'alumni';
  honorTitle: string;
  appointedYear: string;
  phone: string;
  email: string;
  wechat?: string;
  officeLocation: string;
  expertiseTags: string[];
  preferredTracks: TrackType[];
  servedUniversitiesCount: number; // 跨校赋能高校总数
  coachedGoldCount: number; // 指导国赛金奖总数
  nationalReviewYears: number; // 国赛资深评审年限
  activeDispatchesCount: number; // 当前跨校在服重点项目/巡诊场次
  maxCapacity: number; // 每月跨校辅导承载上限
  rating: number; // 平台综合履职评分 (5.00分制)
  dispatchStatus: 'open_all' | 'restricted' | 'paused';
  bio: string;
  specialties: string[];
  recentDispatches: {
    university: string;
    task: string;
    date: string;
    format: '线下入校' | '线上联审';
  }[];
}

export const MOCK_PLATFORM_MENTORS: PlatformMentorExpert[] = [
  {
    id: 'pmentor-001',
    code: 'NAT-EXP-001',
    name: '陆铭远',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '中国工程院院士 / 智能制造与高端装备全国专家组长',
    organization: '清华大学机械工程学院 / 国家高端装备协同创新中心',
    certificationLevel: 'fellow',
    levelLabel: '两院院士级战略导师',
    roleCategory: 'national_judge',
    honorTitle: '全国大赛评审委员会资深战略顾问 · 院士领航导师',
    appointedYear: '2022-2027年特聘 (中央直聘)',
    phone: '139-0100-9981',
    email: 'lumingyuan@cae.cn',
    wechat: 'lumingyuan_cae',
    officeLocation: '国家工程院战略咨询中心 / 中央专家调度工作室',
    expertiseTags: ['硬科技颠覆性创新', '工业母机与高端装备', '战略科学家顶层设计', '重大科研成果产业化', '新工科赛道'],
    preferredTracks: ['higher_education_creative', 'higher_education_startup', 'industry_enterprise'],
    servedUniversitiesCount: 48,
    coachedGoldCount: 28,
    nationalReviewYears: 9,
    activeDispatchesCount: 5,
    maxCapacity: 6,
    rating: 4.99,
    dispatchStatus: 'open_all',
    bio: '中国工程院院士，长期担任全国大赛专家评审委员会战略顾问。指导培育过28个全国总冠军与国赛金奖项目，擅长从国家重大战略需求与底层硬科技壁垒出发，帮助高校重大科研项目打通“0到1”到“1到N”的产业化跳板。',
    specialties: ['硬科技技术壁垒鉴定', '国家战略契合度拔高', '大国重器商业化落地论证', '院士级成果答辩控场'],
    recentDispatches: [
      { university: '北京航空航天大学', task: '空天动力重大创新项目总决赛闭门问诊', date: '2026-03-02', format: '线下入校' },
      { university: '华中科技大学', task: '精密光刻核心部件金奖冲刺把脉', date: '2026-02-20', format: '线下入校' },
      { university: '上海交通大学', task: '全国百强项目跨校联审视频答辩', date: '2026-01-15', format: '线上联审' }
    ]
  },
  {
    id: 'pmentor-002',
    code: 'NAT-EXP-002',
    name: '沈清扬',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: '教育部高校双创教指委副主任 / 资深国奖评审专家组长',
    organization: '全国高校创新创业投资服务联盟 / 双创人才培育专委会',
    certificationLevel: 'national_senior',
    levelLabel: '国家级资深评审组长',
    roleCategory: 'national_judge',
    honorTitle: '连续八届全国总决赛主赛道首席评委 · 国评总召集人',
    appointedYear: '2023-2026年特聘',
    phone: '138-0118-6623',
    email: 'shenqy@cistec.gov.cn',
    wechat: 'shen_innovate_edu',
    officeLocation: '教育部教指委创新创业研究中心',
    expertiseTags: ['2026全国统考细则', '五维打分模型重构', '现场答辩尖锐质询', '商业模式闭环', '教育维度专思创融合'],
    preferredTracks: ['higher_education_creative', 'higher_education_startup', 'red_youth_creative'],
    servedUniversitiesCount: 72,
    coachedGoldCount: 35,
    nationalReviewYears: 8,
    activeDispatchesCount: 6,
    maxCapacity: 8,
    rating: 4.98,
    dispatchStatus: 'open_all',
    bio: '全国大赛核心打分规则制定专家之一，具有极为深厚的赛事顶层设计洞察。累计主审过数千个晋级全国总决赛的王牌项目，专精项目BP架构逻辑颠覆、打分点精准咬合与现场质询破局。',
    specialties: ['2026官方打分表逐项对标', 'BP逻辑漏洞地毯式扫描', '现场答辩30秒抓眼球开场', '评委心理解密与破防防线'],
    recentDispatches: [
      { university: '浙江大学', task: '全校重点项目寒假集训营主旨演练', date: '2026-02-28', format: '线下入校' },
      { university: '西安交通大学', task: '新工科排头兵项目一对一靶向深诊', date: '2026-02-14', format: '线下入校' },
      { university: '哈尔滨工业大学', task: '东北赛区重点培育项目模拟会审', date: '2026-01-22', format: '线上联审' }
    ]
  },
  {
    id: 'pmentor-003',
    code: 'NAT-EXP-003',
    name: '韩岳峰',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: '红杉中国管理合伙人 / 早期硬科技种子基金负责人',
    organization: '红杉中国资本管理中心',
    certificationLevel: 'leading_investor',
    levelLabel: '头部创投管理合伙人',
    roleCategory: 'investor',
    honorTitle: '全国大赛创投评审主席团专家 · 亿元直投通道合伙人',
    appointedYear: '2024-2027年特聘',
    phone: '137-0105-3342',
    email: 'hanyf@sequoiacap.cn',
    wechat: 'hanyuefeng_vc',
    officeLocation: '北京国贸三期 / 深圳前海深港基金小镇',
    expertiseTags: ['创投资本尽调穿透', '股权架构与估值模型', '商业化变现闭环', '战略融资路演', '高校科技成果孵化'],
    preferredTracks: ['higher_education_creative', 'higher_education_startup', 'industry_enterprise'],
    servedUniversitiesCount: 39,
    coachedGoldCount: 22,
    nationalReviewYears: 7,
    activeDispatchesCount: 4,
    maxCapacity: 5,
    rating: 4.96,
    dispatchStatus: 'open_all',
    bio: '管理超百亿早期硬科技母基金，主导投资过多个高校师生共创走出的独角兽企业。在国赛现场以“财务数据真实度”、“客户签单可验证性”和“商业天花板”的严厉追问著称，专治高校项目“商业自嗨”。',
    specialties: ['财务预测合理性审计', '订单合同真实度与回款证明', '股权代持与期权池避坑', '产业客户标杆背书落地'],
    recentDispatches: [
      { university: '中国科学技术大学', task: '量子科技与新材料金种子投融资对接路演', date: '2026-03-01', format: '线下入校' },
      { university: '复旦大学', task: '微电子科创团队股权架构设计专项辅导', date: '2026-02-18', format: '线上联审' },
      { university: '华南理工大学', task: '粤港澳大湾区高校创新项目闭门资本问诊', date: '2026-01-10', format: '线下入校' }
    ]
  },
  {
    id: 'pmentor-004',
    code: 'NAT-EXP-004',
    name: '张凌波',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    title: '华为计算产品线首席科学家 / 昇腾AI产业生态发展委员会主任',
    organization: '华为技术有限公司中央研究院',
    certificationLevel: 'industry_chief',
    levelLabel: '全球500强首席科学家',
    roleCategory: 'industry',
    honorTitle: '全国大赛产业命题赛道专家组召集人 · 产业攻坚特聘专家',
    appointedYear: '2024-2026年特聘',
    phone: '136-0268-1120',
    email: 'zhanglingbo@huawei.com',
    wechat: 'zhanglb_ascend',
    officeLocation: '深圳坂田华为基地 / 东莞松山湖溪流背坡村',
    expertiseTags: ['产业命题赛道', '大模型与算力底座', '国产自主可控供应链', '工业互联网实战', '龙头企业协同转化'],
    preferredTracks: ['industry_enterprise', 'higher_education_creative'],
    servedUniversitiesCount: 55,
    coachedGoldCount: 19,
    nationalReviewYears: 6,
    activeDispatchesCount: 4,
    maxCapacity: 6,
    rating: 4.95,
    dispatchStatus: 'open_all',
    bio: '华为中央研究院计算领域领军科学家，牵头发布多项全国大赛产业命题赛道核心企业命题。深度熟悉龙头企业工程落地痛点与高校理论算法的嫁接模式，指导项目快速取得链主企业采购测试认证。',
    specialties: ['产业命题命题人意图解析', '工业现场级性能对标评测', '产业链上下游协同采购背书', '技术自主可控软硬件适配'],
    recentDispatches: [
      { university: '南京大学', task: 'AI大模型产业命题解题方案深度攻关', date: '2026-02-25', format: '线下入校' },
      { university: '东南大学', task: '集成电路与EDA命题团队联调验证', date: '2026-02-12', format: '线上联审' },
      { university: '电子科技大学', task: '产业命题赛道全国总决赛预演推演', date: '2026-01-28', format: '线下入校' }
    ]
  },
  {
    id: 'pmentor-005',
    code: 'NAT-EXP-005',
    name: '何婉瑜',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: '中国乡村振兴战略研究院首席研究员 / 红旅赛道评审专家组长',
    organization: '农业农村部乡村振兴专家咨询委员会 / 乡村战略智库',
    certificationLevel: 'national_senior',
    levelLabel: '国家级资深评审组长',
    roleCategory: 'national_judge',
    honorTitle: '全国大赛“青年红色筑梦之旅”金牌总教练 · 连续六届评委组长',
    appointedYear: '2023-2026年特聘',
    phone: '139-1088-7721',
    email: 'hewy@rural-strategy.org.cn',
    wechat: 'he_wanyurural',
    officeLocation: '中国乡村振兴战略研究院 / 红色筑梦专家指导室',
    expertiseTags: ['青年红色筑梦之旅', '乡村振兴利益联结机制', '专思创育人故事', '社会效益多维度测算', '农业科技成果转化'],
    preferredTracks: ['red_youth_creative', 'red_youth_public', 'red_youth_startup'],
    servedUniversitiesCount: 61,
    coachedGoldCount: 26,
    nationalReviewYears: 8,
    activeDispatchesCount: 5,
    maxCapacity: 6,
    rating: 4.97,
    dispatchStatus: 'open_all',
    bio: '红旅赛道全网最权威评审专家之一，累计指导出26个红旅全国金奖。精通农林牧渔与文化旅游类项目的产业闭环重塑，尤其擅长提炼“青年扎根中国大地、把论文写在祖国大地上”的动人育人成效。',
    specialties: ['农户利益分配与增收审计', '科技特派员生动育人故事挖掘', '地方政府与龙头采购协同', '红旅答辩家国情怀与落地实效共振'],
    recentDispatches: [
      { university: '中国农业大学', task: '红旅新农科重点项目益农成效审计特训', date: '2026-02-26', format: '线下入校' },
      { university: '西北农林科技大学', task: '旱区农业科技红旅项目现场答辩推演', date: '2026-02-15', format: '线下入校' },
      { university: '华中农业大学', task: '长江流域乡村振兴示范项目线上质询', date: '2026-01-19', format: '线上联审' }
    ]
  },
  {
    id: 'pmentor-006',
    code: 'NAT-EXP-006',
    name: '顾云帆',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: '上海交通大学医学院转化医学研究员 / 国家药监局医疗器械审评专家',
    organization: '国家转化医学研究中心(上海) / 医疗健康创投专委会',
    certificationLevel: 'national_senior',
    levelLabel: '国家级新医科资深国评',
    roleCategory: 'national_judge',
    honorTitle: '新医科赛道资深国评召集人 · 医疗成果转化国家级导师',
    appointedYear: '2024-2027年特聘',
    phone: '138-0219-5561',
    email: 'guyunfan@shsmu.edu.cn',
    wechat: 'gu_medtech_trans',
    officeLocation: '上海张江科学城国家生物医药创新中心',
    expertiseTags: ['新医科赛道专家', '创新医疗器械特别审查', '临床试验方案设计', '医工交叉专利布局', '医院采购准入目录'],
    preferredTracks: ['higher_education_creative', 'higher_education_startup'],
    servedUniversitiesCount: 34,
    coachedGoldCount: 17,
    nationalReviewYears: 6,
    activeDispatchesCount: 3,
    maxCapacity: 4,
    rating: 4.94,
    dispatchStatus: 'open_all',
    bio: '国家药监局医疗器械创新审查咨询委员会委员，深度辅导过十余个医疗AI、脑机接口与靶向创新药全国金奖团队。专长帮医工交叉团队攻克医学伦理批件、多中心双盲临床与医保物价编码痛点。',
    specialties: ['NMPA创新二类三类注册路径', '多中心伦理批件合规性核查', '科研级成果与临床刚需对齐', '医疗投资人尽调关切突破'],
    recentDispatches: [
      { university: '中南大学湘雅医学院', task: '智能诊疗与脑机接口项目全国总决赛问诊', date: '2026-02-22', format: '线下入校' },
      { university: '四川大学华西医学中心', task: '生物医药项目临床合规性专项督查', date: '2026-02-08', format: '线上联审' },
      { university: '中山大学中山医学院', task: '大健康重点项目预答辩打分演练', date: '2026-01-16', format: '线下入校' }
    ]
  },
  {
    id: 'pmentor-007',
    code: 'NAT-EXP-007',
    name: '宋文杰',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    title: '君合律师事务所合伙人 / 科技部科技成果赋权改革法律顾问',
    organization: '君合律师事务所知识产权与合规部',
    certificationLevel: 'legal_finance',
    levelLabel: '科创成果转化与合规首席专家',
    roleCategory: 'legal_finance',
    honorTitle: '全国大赛参赛资格审查与合规首席法律专家',
    appointedYear: '2024-2026年特聘',
    phone: '135-0102-4488',
    email: 'songwenjie@junhe.com',
    wechat: 'song_junhe_law',
    officeLocation: '北京金融街富凯大厦 / 深圳平安金融中心',
    expertiseTags: ['科技成果赋权改革', '职务发明权属无纠纷证明', '参赛学生持股合规', '股权穿透排查', '高校知识产权许可转让'],
    preferredTracks: ['higher_education_startup', 'higher_education_creative', 'industry_enterprise'],
    servedUniversitiesCount: 45,
    coachedGoldCount: 15,
    nationalReviewYears: 7,
    activeDispatchesCount: 3,
    maxCapacity: 5,
    rating: 4.93,
    dispatchStatus: 'open_all',
    bio: '参与国家多项高校科技成果赋权改革与职务发明单列管理试点方案起草。专职为全国高校提供大赛参赛资格排查（股权穿透、知识产权权属公证、工商变更时效合规、核心团队排他性），杜绝“取消奖项”风险。',
    specialties: ['职务科技成果权属厘清', '学生法人持股比例合规核查', '企业工商穿透与利益冲突排雷', '专利授权独占协议公证'],
    recentDispatches: [
      { university: '同济大学', task: '初创组金种子企业工商穿透与参赛资格合规排查', date: '2026-02-27', format: '线上联审' },
      { university: '天津大学', task: '重大科技成果作价入股与代持合规法律体检', date: '2026-02-11', format: '线下入校' },
      { university: '华中师范大学', task: '全国百校成果转化法务合规公开直播巡讲', date: '2026-01-20', format: '线上联审' }
    ]
  },
  {
    id: 'pmentor-008',
    code: 'NAT-EXP-008',
    name: '林浩宇',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: '第十届全国大赛全国总冠军 / 智芯微光半导体创始人兼CEO',
    organization: '智芯微光微纳半导体(深圳)股份有限公司',
    certificationLevel: 'alumni_champ',
    levelLabel: '国赛冠军校友金牌导师',
    roleCategory: 'alumni',
    honorTitle: '全国大赛金奖冠军校友联合会秘书长 · 实战路演金牌导师',
    appointedYear: '2024-2027年特聘',
    phone: '136-8802-9901',
    email: 'linhy@micro-photon.cn',
    wechat: 'lin_haoyu_champ',
    officeLocation: '深圳南山科技园大疆创新中心旁',
    expertiseTags: ['冠军答辩实战台风', '现场质询反杀破局', '百张PPT结构化高燃提炼', '学生团队凝聚力与心理战', '新工科创业实战'],
    preferredTracks: ['higher_education_creative', 'higher_education_startup'],
    servedUniversitiesCount: 42,
    coachedGoldCount: 14,
    nationalReviewYears: 5,
    activeDispatchesCount: 4,
    maxCapacity: 5,
    rating: 4.95,
    dispatchStatus: 'open_all',
    bio: '以全国总分第一名摘得全国大赛全国总冠军，创办的企业已完成B轮数亿元融资。擅长从“曾经的答辩第一主讲人”实战视角，全方位对标年轻学生的站姿、声调、眼神交互、PPT切换节奏及面对评委质疑时的心理防御机制。',
    specialties: ['答辩路演10分钟高燃控场', '评委严厉质疑反制与自信回应', 'PPT高级质感与工业设计母版', '主讲人高压心理破局'],
    recentDispatches: [
      { university: '华南理工大学', task: '主讲人现场模拟答辩高燃台风特训营', date: '2026-03-03', format: '线下入校' },
      { university: '厦门大学', task: '全国总决赛巅峰对决路演全真模拟实测', date: '2026-02-17', format: '线下入校' },
      { university: '大连理工大学', task: '新工科硬核项目主讲人一对一发声与答辩指导', date: '2026-01-25', format: '线上联审' }
    ]
  }
];
