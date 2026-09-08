export interface KnowledgeBaseFile {
  id: string;
  name: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'txt' | 'md';
  size: string;
  sizeBytes: number;
  uploadedAt: string;
  uploader: string;
  chunks: number;
  status: 'indexed' | 'processing' | 'failed';
  summary: string;
  hitCount: number;
  downloadUrl?: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  code: string;
  category: 'school_policy' | 'competition_rules' | 'gold_cases' | 'expert_experience' | 'opc_incubation';
  categoryLabel: string;
  description: string;
  enabled: boolean;
  fileCount: number;
  totalSize: string;
  chunkCount: number;
  embeddingModel: string;
  audience: string;
  updatedAt: string;
  status: 'ready' | 'syncing' | 'disabled';
  files: KnowledgeBaseFile[];
}

export const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: 'kb-policy',
    name: '校内双创扶持与经费报销政策库',
    code: 'KB-SCH-POLICY',
    category: 'school_policy',
    categoryLabel: '校内专属智库',
    description: '涵盖本校双创学院专项种子基金申报细则、国赛差旅与样品试制报销规程、OPC孵化空间免费入驻协议及往届校级立项资助政策。',
    enabled: true,
    fileCount: 4,
    totalSize: '7.9 MB',
    chunkCount: 459,
    embeddingModel: '智能语义解析与特征索引引擎',
    audience: '全校参赛团队及指导教师',
    updatedAt: '2026-09-02 14:30',
    status: 'ready',
    files: [
      {
        id: 'f-pol-01',
        name: '《高校2026年大学生创新创业专项扶持资金管理与报销流程指引》.pdf',
        fileType: 'pdf',
        size: '2.4 MB',
        sizeBytes: 2516582,
        uploadedAt: '2026-08-25 10:15',
        uploader: '陈建国 (双创学院)',
        chunks: 142,
        status: 'indexed',
        summary: '明确实训补贴、专家外聘指导费、参赛打样材料费限额标准及OA系统审批全路径，支持AI直接定位报销凭证要求。',
        hitCount: 489
      },
      {
        id: 'f-pol-02',
        name: '《国家级重点双创赛事差旅、打样与成果转化资助办法（试行）》.docx',
        fileType: 'docx',
        size: '1.1 MB',
        sizeBytes: 1153433,
        uploadedAt: '2026-08-26 15:40',
        uploader: '李文华 (教务处)',
        chunks: 68,
        status: 'indexed',
        summary: '重点资助进入省赛排位及国赛集训营的A级重点项目，提供最高10万元技术样机试制专项津贴。',
        hitCount: 320
      },
      {
        id: 'f-pol-03',
        name: '《大学科技园OPC双创孵化空间申请与免费工位入驻细则》.pdf',
        fileType: 'pdf',
        size: '3.5 MB',
        sizeBytes: 3670016,
        uploadedAt: '2026-08-28 09:20',
        uploader: '周晓萌 (大学科技园)',
        chunks: 195,
        status: 'indexed',
        summary: '专为学生一人公司（OPC）及团队提供前18个月免租金卡座及云资源代金券，打通赛后实体落地第一步。',
        hitCount: 275
      },
      {
        id: 'f-pol-04',
        name: '《科研成果向在校生团队无偿授权许可操作规范手册》.docx',
        fileType: 'docx',
        size: '890 KB',
        sizeBytes: 911360,
        uploadedAt: '2026-08-30 11:05',
        uploader: '王树林 (科技处)',
        chunks: 54,
        status: 'indexed',
        summary: '规避国赛知识产权合规硬伤，明确导师科研成果授权给学生团队参赛的排他性协议模版与无权属纠纷公证流程。',
        hitCount: 198
      }
    ]
  },
  {
    id: 'kb-rules-2026',
    name: '2026大赛官方规则与赛道指标要点库',
    code: 'KB-NAT-2026',
    category: 'competition_rules',
    categoryLabel: '2026大赛规程',
    description: '收录教育部2026年中国国际大学生创新大赛高教主赛道、红旅赛道、产业命题赛道官方通知，赋分权重与合规一票否决红线。',
    enabled: true,
    fileCount: 4,
    totalSize: '14.0 MB',
    chunkCount: 805,
    embeddingModel: '智能语义解析与特征索引引擎',
    audience: '全体备赛团队 / 评委 / 院系秘书',
    updatedAt: '2026-09-03 16:45',
    status: 'ready',
    files: [
      {
        id: 'f-rul-01',
        name: '《教育部关于举办2026年中国国际大学生创新大赛的通知及总体方案》.pdf',
        fileType: 'pdf',
        size: '5.6 MB',
        sizeBytes: 5872025,
        uploadedAt: '2026-08-20 09:00',
        uploader: '陈建国 (校管理员)',
        chunks: 310,
        status: 'indexed',
        summary: '大赛权威母文：规定校级初赛、省级复赛与全国总决赛时间轴，强化【个人成长】新指标与产教深度融合导向。',
        hitCount: 1250
      },
      {
        id: 'f-rul-02',
        name: '《2026高教主赛道评审规则细化指标及赋分权重拆解手册》.pdf',
        fileType: 'pdf',
        size: '3.8 MB',
        sizeBytes: 3984588,
        uploadedAt: '2026-08-22 14:10',
        uploader: '专家智库秘书处',
        chunks: 240,
        status: 'indexed',
        summary: '全面拆解五个一级指标（个人成长、项目创新、产业价值、团队协作、商业模式）及18个二级要点赋分尺度。',
        hitCount: 980
      },
      {
        id: 'f-rul-03',
        name: '《青年红色筑梦之旅赛道实效落地与乡村振兴对标审查要则》.pdf',
        fileType: 'pdf',
        size: '2.9 MB',
        sizeBytes: 3040870,
        uploadedAt: '2026-08-24 16:30',
        uploader: '陈建国 (校管理员)',
        chunks: 160,
        status: 'indexed',
        summary: '突出“扎根中国大地、联农带农益农效益”，详细界定公益组、创意组与创业组财务和帮扶合同审核凭证。',
        hitCount: 410
      },
      {
        id: 'f-rul-04',
        name: '《产业命题赛道出题企业技术需求与校企联合申报审查指引》.docx',
        fileType: 'docx',
        size: '1.7 MB',
        sizeBytes: 1782579,
        uploadedAt: '2026-08-29 11:20',
        uploader: '科研协作办',
        chunks: 95,
        status: 'indexed',
        summary: '针对华为、中兴、国家电网等龙头企业命题的答题方案审查，包括知识产权共享协议及真实应用场景测试证明。',
        hitCount: 330
      }
    ]
  },
  {
    id: 'kb-cases-gold',
    name: '历届国赛金奖标杆案例与解构库',
    code: 'KB-CASE-GOLD',
    category: 'gold_cases',
    categoryLabel: '历史金奖案例',
    description: '深度采集近四年全国金奖项目脱敏BP、路演PPT模板、评委逐题点评记录及实战攻防复盘，供全校项目作为对标范本。',
    enabled: true,
    fileCount: 4,
    totalSize: '33.4 MB',
    chunkCount: 1390,
    embeddingModel: '智能语义解析与特征索引引擎',
    audience: 'A/B级重点梯队及指导专家',
    updatedAt: '2026-09-01 18:20',
    status: 'ready',
    files: [
      {
        id: 'f-cas-01',
        name: '《往届新工科硬科技赛道全国金奖BP完整结构与逻辑闭环深度拆解》.pdf',
        fileType: 'pdf',
        size: '8.2 MB',
        sizeBytes: 8598323,
        uploadedAt: '2026-08-15 16:00',
        uploader: '专家案例库运营组',
        chunks: 480,
        status: 'indexed',
        summary: '涵盖国家重点实验室成果孵化全案，揭示痛点抓取-技术首创-封测验证-批量落地-商业飞轮五层逻辑构建法则。',
        hitCount: 1680
      },
      {
        id: 'f-cas-02',
        name: '《近三年国赛高分路演PPT视觉配色、关键图表与前三页抓手模板集》.pptx',
        fileType: 'pptx',
        size: '18.5 MB',
        sizeBytes: 19398656,
        uploadedAt: '2026-08-18 10:45',
        uploader: '设计工坊指导组',
        chunks: 520,
        status: 'indexed',
        summary: '10分钟路演黄金结构：前60秒吸引评委注意力的封面视觉与颠覆性数据对比，附40余张高精矢量图表组件。',
        hitCount: 1420
      },
      {
        id: 'f-cas-03',
        name: '《生命健康与生物医药赛道金奖项目技术壁垒与临床报批论证范本》.pdf',
        fileType: 'pdf',
        size: '4.6 MB',
        sizeBytes: 4823449,
        uploadedAt: '2026-08-21 14:30',
        uploader: '医学院双创工作站',
        chunks: 260,
        status: 'indexed',
        summary: '详述三类医疗器械及创新药物项目的合规性伦理审批、动物实验对照数据和海外专利PCT布局写法。',
        hitCount: 650
      },
      {
        id: 'f-cas-04',
        name: '《从校赛一等奖到国赛金奖：三届学长完整迭代轨迹与答辩实录》.docx',
        fileType: 'docx',
        size: '2.1 MB',
        sizeBytes: 2202009,
        uploadedAt: '2026-08-27 15:50',
        uploader: '陈建国 (校管理员)',
        chunks: 130,
        status: 'indexed',
        summary: '真实记录一个大学生研发团队从“工科技术自嗨”到组建商学院跨学科团队、拿下首轮天使投资的五轮蜕变。',
        hitCount: 780
      }
    ]
  },
  {
    id: 'kb-experts-qa',
    name: '专家评审经验与高频追问库',
    code: 'KB-EXP-VET',
    category: 'expert_experience',
    categoryLabel: '专家经验智库',
    description: '凝聚48位国赛资深专家与投融资评委的问答题库，预设投资型、学术型、产业型、质疑型等场景的压力测试题。',
    enabled: true,
    fileCount: 3,
    totalSize: '7.4 MB',
    chunkCount: 478,
    embeddingModel: '智能语义解析与特征索引引擎',
    audience: '模拟路演答辩与训练系统',
    updatedAt: '2026-09-04 09:15',
    status: 'ready',
    files: [
      {
        id: 'f-exp-01',
        name: '《国赛网评与现场答辩500个高频尖锐问题池与标杆应答策略》.docx',
        fileType: 'docx',
        size: '3.4 MB',
        sizeBytes: 3565158,
        uploadedAt: '2026-08-10 11:30',
        uploader: '林志豪 (国家级双创专家)',
        chunks: 215,
        status: 'indexed',
        summary: '针对“技术壁垒是否属于导师论文衍生”、“财务模型是否虚假放大百倍市场”等必杀题提供合规反击范式。',
        hitCount: 890
      },
      {
        id: 'f-exp-02',
        name: '《财务预测与单位经济学模型常见20大逻辑硬伤及合规修正建议》.xlsx',
        fileType: 'xlsx',
        size: '1.2 MB',
        sizeBytes: 1258291,
        uploadedAt: '2026-08-14 17:20',
        uploader: '孙雅芳 (投资人合伙人)',
        chunks: 88,
        status: 'indexed',
        summary: '包含现金流测算表、获客成本CAC与客户终身价值LTV比值模型，杜绝“三年营收突破五十亿”等失真填报。',
        hitCount: 610
      },
      {
        id: 'f-exp-03',
        name: '《投资人与产业评委视角：如何避开“技术自嗨”与“伪需求”陷阱》.pdf',
        fileType: 'pdf',
        size: '2.8 MB',
        sizeBytes: 2936012,
        uploadedAt: '2026-08-19 13:45',
        uploader: '陈建国 (校管理员)',
        chunks: 175,
        status: 'indexed',
        summary: '指导学生团队从“我们能做什么”转为“客户真实痛点是什么、愿意支付多少对价”，大幅改善答辩评委缘。',
        hitCount: 740
      }
    ]
  },
  {
    id: 'kb-incubate-opc',
    name: 'OPC孵化转化与产业资本对接库',
    code: 'KB-OPC-INC',
    category: 'opc_incubation',
    categoryLabel: 'OPC孵化转化',
    description: '面向高校一人公司（OPC）及微型创业实体，整合早期天使创投资本名录、科技型中小企业入库指南与产教融合转化合同。',
    enabled: false,
    fileCount: 2,
    totalSize: '3.6 MB',
    chunkCount: 200,
    embeddingModel: '智能语义解析与特征索引引擎',
    audience: '金奖优胜项目与赛后孵化OPC企业',
    updatedAt: '2026-08-31 16:10',
    status: 'disabled',
    files: [
      {
        id: 'f-opc-01',
        name: '《高校OPC双创团队工商注册、税务减免与首期孵化协议模板》.docx',
        fileType: 'docx',
        size: '1.5 MB',
        sizeBytes: 1572864,
        uploadedAt: '2026-08-25 14:00',
        uploader: '成果转化办公室',
        chunks: 90,
        status: 'indexed',
        summary: '提供标准公司章程、合伙人股权代持与退出机制协议、科技成果入股定价备忘录等法律合规模版。',
        hitCount: 120
      },
      {
        id: 'f-opc-02',
        name: '《2026年长三角/大湾区高校科创早期天使基金与直投机构名录》.xlsx',
        fileType: 'xlsx',
        size: '2.1 MB',
        sizeBytes: 2202009,
        uploadedAt: '2026-08-28 10:15',
        uploader: '校友创投联合会',
        chunks: 110,
        status: 'indexed',
        summary: '整合50余家专注于高校硬科技“投早、投小、投硬科技”的知名VC/PE机构对接人和投资偏好轮次。',
        hitCount: 240
      }
    ]
  }
];
