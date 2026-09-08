import { 
  ProjectFileItem, 
  ProjectVersion, 
  TriageResult, 
  RecognitionResult, 
  AssessResult, 
  StageProgressItem, 
  DiagnosisResult, 
  GuidanceTodoItem,
  CoachSessionItem,
  CoachMessageItem
} from './guidanceTypes';

export const STANDARD_12_CHAPTERS = [
  { id: '1', name: '执行摘要', hint: '一分钟电梯演讲、核心痛点、首创突破与关键成果数据' },
  { id: '2', name: '项目背景与痛点', hint: '国家战略需求、产业卡脖子痛点、市场真实刚需与真伪验证' },
  { id: '3', name: '产品/服务与技术', hint: '核心第一性原理、底层专利软著、微米级指标壁垒与技术自洽' },
  { id: '4', name: '市场分析与规模', hint: 'TAM/SAM/SOM测算、客户细分画像、行业年复合增长率(CAGR)' },
  { id: '5', name: '竞争分析与护城河', hint: '国内外竞品矩阵对比、大厂入局反制策略、数据飞轮与迁移成本' },
  { id: '6', name: '商业模式与盈利路径', hint: '付费转化闭环、定价机制、硬件售卖+SaaS增值+驻厂服务' },
  { id: '7', name: '营销推广与获客策略', hint: '标杆种子客户验证、渠道渗透节奏、POC合作转化率' },
  { id: '8', name: '生产交付与运营体系', hint: '产线供应链协同、中试验证、产能规划与质检交付保障' },
  { id: '9', name: '团队结构与组织协同', hint: '核心研发主力、导师指导机制、学科交叉配比与股权期权' },
  { id: '10', name: '财务预测与融资计划', hint: '未来三年三张表预测、单客户经济模型(Unit Economics)、资金使用明细' },
  { id: '11', name: '风险防控与应急预案', hint: '技术替代风险、知识产权合规、高校科研成果转化切割' },
  { id: '12', name: '社会价值与产业效益', hint: '带动高质量就业、赋能新质生产力、绿色低碳与科技向善' }
];

export const INITIAL_STAGE_ITEMS: StageProgressItem[] = [
  { stage: 'L1', label: '创意激发', status: 'done', hint: '痛点发掘、第一性原理推演与选题评估', subItems: ['国家战略卡点对标', '用户痛点访谈纪要', '跨学科技术头脑风暴'] },
  { stage: 'L2', label: '可行性验证', status: 'done', hint: 'POC概念验证、原型机中试与种子客户实测', subItems: ['24位核心客户深度访谈', '实验室级工程样机', '首批付费意向书'] },
  { stage: 'L3', label: '材料成型', status: 'done', hint: '12章标准商业计划书构建与逻辑自洽', subItems: ['12章大纲全覆盖', '核心佐证附件齐全', '三张财务报表模型'] },
  { stage: 'L4', label: '打磨优化', status: 'doing', hint: '当前阶段：评委视界深度质询、竞品壁垒补强与六维增量提分', subItems: ['大厂竞品迁移成本补强', '回款周期与坏账假设修正', '专利成果转化批件公证'] },
  { stage: 'L5', label: '路演成型', status: 'todo', hint: '15页金奖路演幻灯片、1/3分钟电梯演讲与答辩攻防演练', subItems: ['15页金奖汇报PPT', '结构化电梯演讲词', '高频靶向防守锦囊'] },
  { stage: 'L6', label: '赛前冲刺', status: 'todo', hint: '国赛合规性终审、现场评审模拟舱全息拉动', subItems: ['教育部合规资格审查', '盲审背靠背打分演练', '答辩突发状况特训'] }
];

export const SAMPLE_BP_CONTENT = `# 面向晶圆级高精度光学缺陷检测系统 —— 商业计划书（国赛攻坚金奖正本）

## 1. 执行摘要
本项目针对我国集成电路制造与半导体先进封测领域“工业视觉检测核心设备长期被基恩士、康耐视及KLA等美日巨头垄断”的卡脖子难题，由高校光学工程重点实验室科研团队历时4年产学研联合攻关，研制出具有完全自主知识产权的**晶圆级高精度光学缺陷检测系统**。
项目突破大视场纳秒激光相干层析与微米级在线重构算法，将单片晶圆全检节拍从进口设备的1.8秒大幅压缩至0.2秒以内，同时实现99.6%的高检出率与不足0.1%的过杀率。目前已通过国家第三方CNAS/CMA权威检测认证，并在长三角两家头部封测上市企业完成连续1200小时产线无故障试跑，获得65万元前期概念验证(POC)到账开发费。

## 2. 项目背景与痛点
1. **产业卡脖子痛点**：我国先进制程晶圆产线70%以上的明场与暗场光学检测设备依赖进口，面临关键光学器件断供禁运与数据外泄双重安全风险；
2. **现有设备效率瓶颈**：国外同类主流设备单台售价超800万元，且换型调试周期长达2周，无法灵活适应国内特色封装工艺的高频变更；
3. **真实刚需验证**：走访调研国内TOP8半导体制造及封测厂商，87.5%的受访产线总监明确表示：“迫切需要兼具亚微米测量精度、超快节拍响应与高性价比的国产首台套替代装备”。

## 3. 产品/服务与技术
- **核心突破一：大光斑纳秒激光干涉光学系统**：独创非对称光路设计，单脉冲能量均匀度提升至98.2%，光斑利用率提高40%；
- **核心突破二：轻量化实时缺陷分类嵌入式边缘算法**：基于深度边缘张量加速，实现微米级划痕、开裂、空洞等18类常见缺陷毫秒级多重推理；
- **知识产权矩阵**：已获授权国家发明专利8项、实用新型专利12项、软件著作权6项，核心专利链条完整覆盖光机电软全栈架构。

## 4. 市场分析与规模
- **TAM（全市场总额）**：全球半导体量测与缺陷检测设备市场规模达124亿美元；
- **SAM（可服务市场）**：中国大陆半导体晶圆检测设备年采购规模超180亿元人民币，年复合增长率(CAGR)保持在18.4%；
- **SOM（目标可获取市场）**：项目以先进封装与功率半导体检测为切入点，预计2027年实现国内该细分领域8.5%市场占有率，对应年产值1.5亿元。

## 5. 竞争分析与护城河
对比基恩士（Keyence）、康耐视（Cognex）及国内初创公司，本项目构筑了三道不可逾越的护城河：
1. **先发私有工业缺陷数据集飞轮**：已沉淀200万+张产线真实晶圆缺陷多波段光谱图谱，大厂无法获取细分制造场景的专有训练数据；
2. **制造执行系统(MES)协议深度集成**：定制化产线通信协议与自动分选机构无缝联锁，客户替换整套设备停线停工成本高达数百万元；
3. **本土化2小时极速服务响应**：提供7×24小时驻厂工程师支持，相比进口厂商2-4周的海外备件周期具有决定性服务优势。

## 6. 商业模式与盈利路径
- **硬件装备销售**：针对半导体产线推出标机与定制化检测专机（客单价120万~260万元/台）；
- **核心光学传感器模块授权**：向国内自动化集成商提供嵌入式模组与算法SDK授权（客单价15万~30万元/套）；
- **高阶算法SaaS年费与耗材维保**：提供云端缺陷特征库增量更新与产线良率智能优化增值服务，形成稳健长尾现金流。

## 7. 营销推广与获客策略
- **阶段一（标杆突破，已完成）**：与2家行业头部封测上市公司签订联合开发与试用协议，建立国家级行业标杆灯塔工厂；
- **阶段二（区域渗透，2026-2027）**：深耕长三角、珠三角半导体产业集群，签约5家省级代理集成商，实现规模化批量交付；
- **阶段三（生态拓展，2028起）**：拓展新能源电池极耳检测、汽车电子等泛半导体高精密检测领域。

## 8. 生产交付与运营体系
- **轻资产软硬协同制造模式**：核心光机组件与专用算法板卡自研组装与核心标定，机加钣金与通用外设委托长三角优质代工厂生产；
- **严格出厂质检流程**：制定108项晶圆级出厂动态标定规程，通过国家机器人检测评定中心(CNAS)标准认证，平均无故障运行时间(MTBF)超5000小时。

## 9. 团队结构与组织协同
- **项目负责人**：博士研究生，师从国家杰青学者，主持省级重点研发课题2项，发表顶刊论文6篇；
- **首席技术顾问**：光学工程系博导，全国五一劳动奖章获得者，在半导体量测装备领域深耕25年；
- **商业与运营总监**：MBA研究生，曾任知名工业视觉上市公司华东区高级大客户经理，具备8年产业化落地经验；
- **研发骨干配比**：核心成员涵盖光学、精密机械、仪器科学、计算机及工商管理，博硕比例达75%，师生协同创业机制规范清晰。

## 10. 财务预测与融资计划
- **财务测算**：2026年预计营收850万元，实现微利；2027年预计营收2800万元，净利润620万元；2028年预计营收6500万元；
- **单客户经济模型(Unit Economics)**：客单价180万元，硬件物料成本75万元，销售毛利率达58.3%，获客成本在交付后1.5个月即可完全收回；
- **融资规划**：本轮计划出让10%股权融资1500万元，重点用于二代全自动晶圆装载机研发（40%）、长三角中试基地建设（35%）及销售渠道铺设（25%）。

## 11. 风险防控与应急预案
- **技术替代风险**：针对国外厂商可能推出的低价机型，团队已启动二代深紫外波段检测光路研发，性能领先下一代周期；
- **知识产权合规**：已与所在高校签署《科技成果排他性独占转让及转化协议》，明确发明人奖励比例与无职务发明侵权争议，法律批文随附附件。

## 12. 社会价值与产业效益
- **新质生产力标杆**：有力推进国产半导体核心检测装备自主可控进程，彻底摆脱外部断供与技术卡死风险；
- **高质量人才培养与就业带动**：累计为高校输送光机电交叉学科工程硕博30余名，未来三年预计提供高端研发与技术支持岗位超120个。
`;

export const SAMPLE_FILES: ProjectFileItem[] = [
  {
    id: 'f-bp-main',
    name: '面向晶圆级高精度光学缺陷检测系统-商业计划书.md',
    fileType: 'text',
    size: 148560,
    versionRef: 'v2.0.0-rc',
    readonly: false,
    updatedAt: '2026-09-05 14:10:25',
    category: '核心申报书',
    badge: '国赛金奖正本',
    description: '涵盖12章完整体系论证、技术第一性原理及商业模式自洽正本',
    author: '项目团队联合撰写（负责人：李林峰）',
    ext: 'md',
    tags: ['核心BP', '标准12章', '最新版本'],
    metadata: {
      wordCount: 18600,
      chaptersCount: 12,
      lastEditor: '李林峰（光学博士）',
      reviewStatus: '已通过省赛金奖终审，直通国赛争夺金'
    }
  },
  {
    id: 'f-interview-records',
    name: '半导体产线总监与工艺工程师深度访谈纪要.md',
    fileType: 'text',
    size: 42150,
    versionRef: 'v1.4.0',
    readonly: false,
    updatedAt: '2026-09-04 11:32:00',
    category: '用户调研',
    badge: '真实实测验证',
    description: '涵盖华东6家知名晶圆封测厂产线负责人、良率分析专家的真实痛点与采购价格心理区间',
    author: '市场与调研组（王诗雨）',
    ext: 'md',
    tags: ['需求真伪', '痛点挖掘', '客户画像'],
    metadata: {
      interviewees: 18,
      targetGroup: '长三角/珠三角半导体制造与封测产线总监',
      willingnessToPay: '¥120万 - ¥250万',
      coreFinding: '对换型停机成本极其敏感，强烈需要本土化即时响应'
    }
  },
  {
    id: 'f-roadshow-ppt',
    name: '全国总决赛现场答辩-15页路演极速汇报幻灯片.pptx',
    fileType: 'binary',
    size: 28450120,
    versionRef: 'v2.0.0-rc',
    readonly: true,
    updatedAt: '2026-09-05 09:20:12',
    category: '路演答辩',
    badge: '金奖幻灯片',
    description: '针对2026大赛8分钟陈述定制，按“痛点→突破→落地→商业→团队”黄金节奏排布',
    author: '路演主讲人',
    ext: 'pptx',
    tags: ['路演PPT', '15页极简', '排版高分'],
    metadata: {
      slidesCount: 15,
      aspectRatio: '16:9',
      durationMinutes: 8,
      currentPresenter: '李林峰'
    }
  },
  {
    id: 'f-demo-video',
    name: '晶圆微米级缺陷在线高速检测样机产线实录.mp4',
    fileType: 'binary',
    size: 89450120,
    versionRef: 'v1.3.0',
    readonly: true,
    updatedAt: '2026-09-02 16:40:00',
    category: '演示多媒体',
    badge: '中试实跑录像',
    description: '展示产线全自动上下料、0.18秒超高速纳秒激光重构与缺陷毫秒级标定全流程实录',
    author: '工程实验组',
    ext: 'mp4',
    tags: ['样机视频', '产线实拍', '高检出率'],
    metadata: {
      resolution: '4K 60FPS',
      duration: '03:15',
      location: '某国家级封测中试车间'
    }
  },
  {
    id: 'f-patent-cert',
    name: '国家知识产权局发明专利证书与科技成果转化审查意见书.pdf',
    fileType: 'readonly',
    size: 4520300,
    versionRef: 'v1.0',
    readonly: true,
    updatedAt: '2026-08-28 10:15:00',
    category: '佐证材料',
    badge: '国知局授权',
    description: '核心发明专利ZL202310884210.X授权公告及高校科技处独占性转让转化批复文件',
    author: '国家知识产权局 / 校科技处',
    ext: 'pdf',
    tags: ['发明专利', '合规证明', '独占许可'],
    metadata: {
      patentNo: 'ZL202310884210.X',
      officialSealed: true,
      legalStatus: '排他性独占转让有效'
    }
  },
  {
    id: 'f-cnas-report',
    name: '国家机器人与精密仪器检测评定中心(CNAS)全项检验报告.pdf',
    fileType: 'readonly',
    size: 6180400,
    versionRef: 'v1.1',
    readonly: true,
    updatedAt: '2026-08-30 14:00:00',
    category: '佐证材料',
    badge: 'CNAS权威检验',
    description: '第三方出具的亚微米测量重复精度、MTBF无故障运行时间与过杀率检验公章报告',
    author: '国家检验评定中心',
    ext: 'pdf',
    tags: ['国家检测报告', 'CNAS公章', '权威背书'],
    metadata: {
      reportNo: 'CNAS-2026-ST88921',
      testingPassRate: '100%',
      sampleSN: 'PROTOTYPE-003'
    }
  },
  {
    id: 'f-financial-model',
    name: '未来三年财务预测三张表与单客户经济模型测算.xlsx',
    fileType: 'binary',
    size: 1542000,
    versionRef: 'v1.5.0',
    readonly: false,
    updatedAt: '2026-09-04 18:00:00',
    category: '核心申报书',
    badge: '三表逻辑自洽',
    description: '资产负债表、利润表、现金流量表动态联动测算，包含回款账期与敏感性分析',
    author: '财务顾问组',
    ext: 'xlsx',
    tags: ['财务模型', '单客户经济学', '现金流预测'],
    metadata: {
      forecastPeriod: '2026-2028',
      grossMargin: '58.3%',
      paybackPeriodMonths: 1.5
    }
  }
];

export const SAMPLE_VERSIONS: ProjectVersion[] = [
  {
    versionId: 'v2.0.0-rc',
    versionType: 'version',
    label: 'v2.0.0-rc (国赛备战终稿)',
    source: 'manual',
    scoreVersionId: 's4',
    createdAt: '2026-09-05 14:10',
    total: 91,
    commitMsg: '根据省金评审专家意见，补全大厂竞品迁移成本与私有数据飞轮论证，修正第10章财务回款周期假设。',
    branchName: 'main'
  },
  {
    versionId: 'v1.4.0',
    versionType: 'milestone',
    label: 'v1.4.0 (省决赛金奖提交版)',
    source: 'milestone',
    scoreVersionId: 's3',
    createdAt: '2026-08-25 18:30',
    total: 87,
    commitMsg: '省决赛前夕里程碑锁定，新增国家第三方CNAS检测报告附件与头部两家客户POC实测回执。',
    branchName: 'main'
  },
  {
    versionId: 'v1.2.0',
    versionType: 'version',
    label: 'v1.2.0 (省赛网评复审版)',
    source: 'edit',
    scoreVersionId: 's2',
    createdAt: '2026-07-20 10:15',
    total: 81,
    commitMsg: '扩充第3章技术突破第一性原理图解，增加18类缺陷分类矩阵，重构财务预测模型。',
    branchName: 'main'
  },
  {
    versionId: 'v1.0.0',
    versionType: 'snapshot',
    label: 'v1.0.0 (校赛立项基线版)',
    source: 'auto',
    scoreVersionId: 's1',
    createdAt: '2026-06-12 09:00',
    total: 73,
    commitMsg: '首次基线创建，录入初步项目立项计划书与实验室初期检测数据。',
    branchName: 'main'
  }
];

export const SAMPLE_TODOS: GuidanceTodoItem[] = [
  {
    id: 'td-1',
    title: '在第5章补充“客户迁移停机成本量化表”与“私有数据飞轮图谱”',
    stage: 'L4',
    completed: true,
    priority: 'high',
    assignee: '李林峰',
    dueDate: '2026-09-06',
    chapterRef: '第5章 竞争分析'
  },
  {
    id: 'td-2',
    title: '针对大厂入局价格战，制定二代波段检测专机降本30%反制方案',
    stage: 'L4',
    completed: false,
    priority: 'high',
    assignee: '技术组',
    dueDate: '2026-09-07',
    chapterRef: '第3章 技术与产品'
  },
  {
    id: 'td-3',
    title: '补充更新2家意向采购协议(POC)最新回款进度及测试联签单扫描件',
    stage: 'L4',
    completed: true,
    priority: 'medium',
    assignee: '商业组',
    dueDate: '2026-09-08',
    chapterRef: '第7章 营销与获客'
  },
  {
    id: 'td-4',
    title: '校核路演PPT第7页与第11页的财务数据及单台设备毛利口径一致性',
    stage: 'L5',
    completed: false,
    priority: 'high',
    assignee: '王诗雨',
    dueDate: '2026-09-10',
    chapterRef: '第10章 财务预测'
  },
  {
    id: 'td-5',
    title: '开展全真8分钟路演演讲计时演练，强化评委互动与首屏吸引力',
    stage: 'L5',
    completed: false,
    priority: 'medium',
    assignee: '全员',
    dueDate: '2026-09-12'
  }
];

export const SAMPLE_TRIAGE: TriageResult = {
  projectId: 'p-default',
  primaryType: '产品创新',
  secondaryTypes: ['工艺流程创新', '商业模式创新'],
  confidence: {
    产品创新: 0.88,
    工艺流程创新: 0.08,
    商业模式创新: 0.03,
    服务创新: 0.01
  },
  evidence: [
    { type: '产品创新', quote: '突破大视场纳秒激光相干层析与微米级在线重构算法，自主研制晶圆级高精度光学检测系统' },
    { type: '工艺流程创新', quote: '提出非对称光路与自适应嵌入式张量推理架构，将全检节拍压缩至0.2秒' }
  ],
  status: 'active',
  degraded: false
};

export const SAMPLE_DIAGNOSIS: DiagnosisResult = {
  projectId: 'p-default',
  stage: 'L4',
  stageLabel: 'L4 打磨优化',
  youAre: '已顺利完成12章标准商业计划书构建与校赛/省赛真金白银验证，当前已进入全国总决赛冲金打磨期。关键技术指标扎实，但在巨头竞争反制与极端账期应对上仍有追问空间。',
  missing: [
    {
      text: '第5章巨头防御：缺乏大厂降价或绑定销售时的客户迁移成本硬性测算；',
      chapterId: '5',
      action: 'chapter_coach',
      target: '5',
      urgency: 'high'
    },
    {
      text: '第10章财务预测：未充分披露半导体行业6-9个月长账期验收下的流动资金缺口保障预案；',
      chapterId: '10',
      action: 'chapter_coach',
      target: '10',
      urgency: 'high'
    },
    {
      text: '第12章社会效益：需进一步结合新质生产力与国家自主可控重大战略指标补全数据链；',
      chapterId: '12',
      action: 'chapter_coach',
      target: '12',
      urgency: 'medium'
    }
  ],
  nextSteps: [
    {
      text: '在BP第5章补充“客户更换设备直接停机损失（超200万元）与MES协议锁定”专属论述；',
      chapterId: '5',
      action: 'edit',
      target: '5',
      urgency: 'high'
    },
    {
      text: '在第10章财务模型中引入9个月账期压力测试与65万已到账POC资金的补充印证；',
      chapterId: '10',
      action: 'edit',
      target: '10',
      urgency: 'high'
    },
    {
      text: '联动路演答辩训练舱进行巨头防御主题的极限追问实战演练。',
      chapterId: '',
      action: 'full_run',
      target: 'defense',
      urgency: 'medium'
    }
  ]
};

export const SAMPLE_ASSESSMENT: AssessResult = {
  projectId: 'p-default',
  versionId: 'v2.0.0-rc',
  group: '高教主赛道研究生创意组',
  scorecardName: '2026年中国国际大学生创新大赛（主赛道）国家级评审标准',
  total: 91,
  trend: 'up',
  isBaseline: false,
  degraded: false,
  dimensionScores: {
    创新性: 94,
    技术可行性: 93,
    商业落地: 86,
    团队协同: 90,
    表现力: 89,
    社会价值: 94
  },
  items: [
    {
      itemId: 'itm-1',
      dimension: '创新性',
      itemText: '核心技术自主研发水平与第一性原理突破度',
      cap: 20,
      baseScore: 17,
      currentScore: 19,
      delta: 2,
      reason: '大视场纳秒激光干涉光路设计新颖，微米级检测精度通过CNAS认证，创新性首屈一指。',
      quote: '突破大视场纳秒激光相干层析与微米级在线重构算法'
    },
    {
      itemId: 'itm-2',
      dimension: '技术可行性',
      itemText: '工程实现成熟度、试跑验证与关键指标闭环',
      cap: 20,
      baseScore: 17,
      currentScore: 19,
      delta: 2,
      reason: '1200小时连续产线无故障试跑数据详实，18类缺陷分类毫秒级推理闭环。',
      quote: '在长三角两家头部封测上市企业完成连续1200小时产线无故障试跑'
    },
    {
      itemId: 'itm-3',
      dimension: '商业落地',
      itemText: '市场切入点精准度、客户画像真实度与商业模式自洽',
      cap: 20,
      baseScore: 14,
      currentScore: 17,
      delta: 3,
      reason: '补充了2家头部客户POC合同及单客户经济模型，但应收账期风险预案仍可进一步展开。',
      quote: '硬件销售+SDK模组授权+算法SaaS云升级复合盈利模式'
    },
    {
      itemId: 'itm-4',
      dimension: '团队协同',
      itemText: '师生共创机制、学科交叉配比与真实执行力',
      cap: 15,
      baseScore: 13,
      currentScore: 14,
      delta: 1,
      reason: '博导长期领衔，博硕士研究生主导核心落地，商科MBA补足产业落地短板。',
      quote: '核心成员涵盖光学、机械、仪器与计算机，博硕比例达75%'
    },
    {
      itemId: 'itm-5',
      dimension: '社会价值',
      itemText: '自主可控支撑度、新质生产力赋能与高质量人才培养',
      cap: 15,
      baseScore: 13,
      currentScore: 14,
      delta: 1,
      reason: '解决半导体先进封测核心检测装备断供卡脖子危机，服务国家重大战略导向极其明确。',
      quote: '推进国产半导体核心检测装备自主可控进程'
    },
    {
      itemId: 'itm-6',
      dimension: '表现力',
      itemText: '商业计划书逻辑架构、论据佐证充分度与排版规范',
      cap: 10,
      baseScore: 7,
      currentScore: 8,
      delta: 1,
      reason: '12章体系健全，数据图表严谨专业，语言精炼客观无学生气浮夸词汇。',
      quote: '图表规范完整，关键数据均有国家权威检验或产线联签证明支撑'
    }
  ],
  issues: [
    '第5章竞品反制需持续强化客户迁移痛点图谱',
    '注意与15页路演幻灯片中关键节拍数据的一致性'
  ]
};

export const INITIAL_COACH_SESSIONS: CoachSessionItem[] = [
  {
    id: 1,
    title: '全链路规划与巨头竞品防御强化',
    messageCount: 4,
    createdAt: '2026-09-05 10:00',
    updatedAt: '2026-09-05 14:20',
    stageFocus: 'L4'
  },
  {
    id: 2,
    title: '第10章财务预测三张表与单客户经济模型优化',
    messageCount: 6,
    createdAt: '2026-09-04 15:30',
    updatedAt: '2026-09-04 17:40',
    stageFocus: 'L3'
  },
  {
    id: 3,
    title: '15页路演幻灯片与8分钟演讲词框架把关',
    messageCount: 5,
    createdAt: '2026-09-03 09:10',
    updatedAt: '2026-09-03 11:00',
    stageFocus: 'L5'
  }
];

export const INITIAL_COACH_MESSAGES: CoachMessageItem[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: `你好！我是你的【双创全链路指导 AI 教练】。认真审阅《面向晶圆级高精度光学缺陷检测系统》申报书后，我为你梳理了当前项目的关键状态：

1. **当前阶段**：【L4 打磨优化】（已具备国赛金奖争夺梯队水准）；
2. **核心王牌**：底层光路自研打破垄断，节拍从1.8s压缩至0.2s，CNAS报告与两家封测上市厂POC验证扎实；
3. **重点攻坚突破点**：
   - 评委在国赛答辩时，必抓“大厂如果降价反扑你们怎么办？”（第5章）；
   - 商业化长账期与坏账防范对策需进一步在财务报表中自洽（第10章）。

你想让我针对哪一部分协助你进行针对性推敲与一键润色？`,
    createdAt: '14:15',
    suggestions: [
      '帮我打磨第5章：生成对标基恩士与康耐视的反制策略',
      '帮我诊断第10章财务预测：完善应收账期应对方案',
      '生成一份符合2026国赛标准的3分钟电梯演讲稿',
      '根据当前进展，为我们团队自动生成本周待办任务'
    ]
  }
];
