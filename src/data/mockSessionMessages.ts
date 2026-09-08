/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage } from '../types';
import { 
  mockTrackComparisons, 
  mockGoldCases, 
  mockCompetitorList, 
  mockUniversities,
  mockJudgePersonas
} from './mockCoachData';

export const mockSessionHistories: Record<string, ChatMessage[]> = {
  // =========================================================================
  // 规划场景深度演进路径 (Roadmap PPT Re-generation Session)
  // =========================================================================
  'sess-roadmap-ppt': [
    {
      id: 'roadmap-msg-1',
      sender: 'student',
      type: 'text',
      text: '有点总结的太厉害了，要稍微详细点，重新输出PPT',
      timestamp: '14:20',
    },
    {
      id: 'roadmap-msg-2',
      sender: 'coach',
      type: 'text',
      text: `已完成 2m33s >\n\nPPT已重新生成。和上一版相比，每个格子的内容大幅扩充：\n\n**产品里程碑（内容最多）：**\n• P1：完整列出Assistant助手7项功能、数据脱敏4项、案件库2项、评估能力2项\n• P2：SaaS产品化、合规完成、Assistant扩展、Workflows+多Agent、自建替代各模块子项都展开\n• P3/P4：全流程AI化各环节、Agent Platform客户化、生态化等细节保留\n\n**场景深度：**\n• P1：验证目标、覆盖范围、交付流程都保留\n• P2：刑事+知产各自的具体功能和适用场景展开\n• P3：立案→举证→庭审→判决→执行每个环节的AI能力都列出\n• P4：融资、匹配、闭环、分成模式的完整链条\n\n**客户/收入/融资：** 每个格子的数字、条件、时间窗口等细节全部保留，没有压缩。\n\n字体用了7-8pt来容纳更多内容，打开看看排版是否合适，有需要调整的告诉我。`,
      timestamp: '14:23',
      generatedFiles: [
        {
          id: 'art-ppt-1',
          name: '安里AI_BP补充_项目路标.pptx',
          type: 'ppt',
          typeLabel: '路演汇报幻灯片 (Deck)',
          size: '31.3 KB',
          updateTime: '刚刚',
          status: 'ready'
        }
      ],
      changesCount: 2
    }
  ],

  // =========================================================================
  // 独立无工作空间会话 (Standalone Sessions)
  // =========================================================================
  'sess-init-none': [
    {
      id: 'none-init-1',
      sender: 'student',
      type: 'text',
      text: '你好！我们是一个刚组建的跨学科学生团队，目前研发了一套基于视觉感知的智能检测算法原型，计划备战 2026 年中国国际大学生创新大赛。请问目前大赛包含哪些主要赛道？我们处于初创阶段，该如何规划备赛节奏？',
      timestamp: '10:00',
    },
    {
      id: 'none-init-2',
      sender: 'coach',
      type: 'policy_answer',
      reactProcess: {
        duration: '1.8s',
        summary: '已完成备赛路径思考与规划',
        steps: [
          {
            id: 'r-none-1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '820ms',
            content: '分析学生团队背景：处于“算法原型在手、尚未商业化”的初创概念阶段（L1-L2级）。首要任务是明确高教主赛道（研究生/本科生创意组）与产业赛道的准入差异，避免过早陷入商业化盈利造假陷阱，重点在算法学术原创度与可验证的应用场景之间建立桥梁。'
          },
          {
            id: 'r-none-2',
            type: 'plan',
            title: '整理备赛推进计划',
            content: '规划针对初创阶段团队的四步推进路线：',
            tasks: [
              { id: 't1', text: '对齐大赛四大赛道（高教主赛道、红旅、产业命题、国际赛道）报名门槛' },
              { id: 't2', text: '锁定创意组三大评审红线（专利独占性、真实测试数据、商业模式闭环逻辑）' },
              { id: 't3', text: '输出初学者 L1-L4 备赛里程碑时间表与支撑材料清单' }
            ]
          },
          {
            id: 'r-none-3',
            type: 'act',
            title: '检索 2026 大赛章程与初创期培育指引',
            command: {
              lang: 'mcp',
              cmd: 'mcp://official-rules/query?track=main_creative_track&stage=early_stage_incubation',
              output: '匹配到教育部高等教育司关于创新大赛章程最新修订要点及创意组评审导向。'
            },
            content: '已提取创意组评审打分权重：创新性（30%）、商业性（25%）、团队情况（20%）、带动就业与社会价值（25%）。'
          }
        ]
      },
      text: `同学你好！非常欢迎加入创新大赛冲刺之旅。针对初创期拥有核心算法原型的跨学科团队，为你系统梳理赛道定位与备赛路线：\n\n📌 **一、赛道选择策略（创意组首选）**：\n• **高教主赛道 - 创意组**：参赛项目具有较好的创意和较为成型的产品原型或服务模式，**在报名截止前尚未在市场监督管理部门登记注册**。这最适合你们目前的原型状态；\n• **核心加分项**：高校实验室自主知识产权授权、指导教师顶刊成果背书、多学科交叉团队背景；\n• **防踩坑警示**：千万不要虚构庞大营收！创意组评委最反感“纸面千万营收”，更看重**技术真实指标（如实测抗噪度、准确率）与小范围真实试用台账**。\n\n🗺️ **二、备赛节奏规划建议（L1-L4 阶段）**：\n1. **L1 选题与赛道锁定（本周）**：凝练一句话核心价值，完成赛道规则对齐；\n2. **L2 BP 与模式诊断（2-3周）**：撰写商业计划书初稿，重点理清“谁在为技术买单”的商业闭环；\n3. **L3 PPT 视觉与实效台账（4-6周）**：拍摄实机运行视频，整理合作证明或盲测报告；\n4. **L4 模拟答辩与高压质询（赛前冲刺）**：演练评委常见 10 大尖锐问题，打磨 1 分钟开场白。\n\n你可以随时在输入框中提问，或者选择左侧工作空间绑定具体的项目展开专属诊断！`,
      timestamp: '10:01',
      citation: '《中国国际大学生创新大赛（2026）参赛指南》第一章及创意组专项评审细则',
      engineAttribution: '4.1 赛事政策与规则专家 · 政策百事通',
      data: {
        comparisons: mockTrackComparisons
      }
    }
  ],

  'sess-none-2': [
    {
      id: 'none-2-1',
      sender: 'student',
      type: 'text',
      text: '探讨青年红色筑梦之旅赛道准入，红旅赛道对指导教师、涉农合作社合作单位有什么具体硬性要求？',
      timestamp: '昨天 14:20',
    },
    {
      id: 'none-2-2',
      sender: 'coach',
      type: 'text',
      reactProcess: {
        duration: '1.5s',
        summary: '已完成红旅准入规则检索与解析',
        steps: [
          {
            id: 'r-n2-1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '650ms',
            content: '分析红旅赛道准入硬门槛。红旅赛道核心考核扎根革命老区或脱贫乡村的实际帮扶成效。指导教师必须具有实质性科技指导或成果转化赋能事实；合作主体需具备正规公章证明、真实挽损增收台账，坚决杜绝“挂牌拍照走过场”。'
          },
          {
            id: 'r-n2-2',
            type: 'plan',
            title: '拟定红旅申报审查清单',
            tasks: [
              { id: 't1', text: '审查青年红色筑梦之旅赛道申报资质与团队师生比例' },
              { id: 't2', text: '核对涉农合作社合作协议三单合一规范（协议+台账+政府公函）' }
            ]
          },
          {
            id: 'r-n2-3',
            type: 'act',
            title: '调用教育部红旅赛道红头文件库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://official-rules/red_journey?year=2026&focus=rural_revitalization_entry_bar'
            },
            content: '已提取红旅乡村振兴组与公益组核心准入红线，形成 3 大硬性要求清单。'
          }
        ]
      },
      text: `已为你梳理青年红色筑梦之旅（红旅）赛道的关键准入与硬性要求：\n\n📌 **一、合作单位与帮扶凭证（一票否决红线）**：\n• **必须具备真实落地协议**：与县级农业农村局、乡镇政府、供销合作社或村两委签署的正式科技服务/项目帮扶协议；\n• **“三单合一”证据链**：必须提供农户增收协议账本、县级农技站抽样测产报告、地方政府官方推荐或应用公函；\n\n📌 **二、指导教师硬性要求**：\n• 指导教师必须全程实质指导，提供本校相关科研成果的普通实施许可或转让证明，杜绝虚名挂靠；\n• 评分中“师生共创与扎根实效”占 25% 权重。`,
      timestamp: '昨天 14:22',
      citation: '教育部关于举办中国国际大学生创新大赛“青年红色筑梦之旅”活动通知',
      engineAttribution: '4.1 赛事政策与规则专家'
    }
  ],

  // =========================================================================
  // 空间一：智耘农业 (sp-zhiyun) 对应 7 大任务实战会话
  // =========================================================================

  // 1. 赛事政策与规则精准查询 ("政策百事通")
  'sess-zy-task-1': [
    {
      id: 'zy-t1-m1',
      sender: 'student',
      type: 'text',
      text: '我的项目是水稻多光谱无人机病害预警，属于高教主赛道创意组。请问主赛道和红旅赛道有什么核心区别？能同时兼报吗？评委最看重什么？财务预测要注意哪几个方面？',
      timestamp: '10:00',
    },
    {
      id: 'zy-t1-m3',
      sender: 'coach',
      type: 'policy_answer',
      reactProcess: {
        duration: '2.1s',
        summary: '已完成双赛道规则研判与财务模型校验',
        steps: [
          {
            id: 'zy-p1-s1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '910ms',
            content: '分析用户咨询核心：水稻多光谱无人机项目在主赛道（新农科）与青年红色筑梦之旅赛道的定位权衡。需明确双赛道申报的排他性规则，提炼评委对学术原创与基层挽损的不同偏好，并针对农机设备财务预测中高发的产能脱节与虚高毛利暗坑做重点前置预警。'
          },
          {
            id: 'zy-p1-s2',
            type: 'plan',
            title: '整理任务计划',
            tasks: [
              { id: 't1', text: '检索教育部 2025/2026 大赛最新章程第十二条双赛道兼报排他性条款' },
              { id: 't2', text: '对标高教主赛道创意组（技术原创）与红旅赛道（扎根实效）打分权重' },
              { id: 't3', text: '提取涉农硬科技项目财务测算的 3 个致命常识暗坑' }
            ]
          },
          {
            id: 'zy-p1-s3',
            type: 'act',
            title: '检索官方政策规则库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://official-rules/query?track=main_vs_red_journey&item=agri_drone',
              output: '匹配到《中国国际大学生创新大赛评审规则》第三章第十二条：同一项目严禁兼报双赛道。'
            },
            content: '成功匹配官方条款，确立主赛道新农科组（首选92分）与红旅赛道差异维度。'
          },
          {
            id: 'zy-p1-s4',
            type: 'act',
            title: '运行财务一致性校验脚本',
            command: {
              lang: 'bash',
              cmd: 'python check_financial_assumptions.py --model=agri_hardware_30units'
            },
            content: '发现逻辑漏洞：首期装配线年产仅30套，但BP预测首年千万营收，产能与营收严重脱节，需立即预警。'
          }
        ]
      },
      text: `针对「智耘农业」（基于低空多光谱的水稻病虫害预警系统），为你穿透解读多级规则库与评审导向：\n\n1. **赛道划分与申报红线**：\n   - **高教主赛道 - 新农科组（首选）**：核心聚焦**技术算法突破、自研窄带滤波硬件、学术专利壁垒与商业天花板**；\n   - **青年红色筑梦之旅赛道 - 乡村振兴组**：核心聚焦**基层扎根实效、涉农合作社挽损台账、农民增收脱贫佐证**；\n   - ⚠️ **红线警示**：同一竞赛年度**严禁跨赛道或兼报双赛道**，一经查实直接取消全国总决赛资格！\n\n2. **主赛道创意组评委核心关注**：\n   - 创新性（30%）：是否有真正自主研发的原型机或算法，坚决反对“贴牌集成”；\n   - 商业性（25%）：是否跑通了首批付费意向客户，而不是停留在实验室纸面构想。\n\n3. **财务预测三大必须规避暗坑**：\n   - **产能与营收脱节**：首年预测千万元营收，但生产装配线仅 30 套，被评委秒抓矛盾；\n   - **毛利率违背常识**：农机硬件宣称 85% 净利率，必须扣减田间飞防运维与电池损耗成本；\n   - **缺乏现金流压力测试**：农机回款存在长达 6-9 个月的农闲账期，需明确流动资金储备。`,
      timestamp: '10:01',
      citation: '《中国国际大学生创新大赛（2025/2026）官方评审规则》第三章第十二条与主赛道评分细则',
      engineAttribution: '4.1 赛事政策与规则专家 · 政策百事通',
      data: {
        comparisons: mockTrackComparisons
      }
    }
  ],

  // =========================================================================
  // ⭐ 4.2/4.3 跨模块深度调用与浅度调用 4 个完整示例场景
  // =========================================================================

  // 1. 【深度调用 4.2】BP商业计划书全链路深度体检
  'sess-zy-deep-42': [
    {
      id: 'zy-deep42-m1',
      sender: 'student',
      type: 'text',
      text: '帮我完整诊断项目，开启 4.2 全链路智能指导与商业模式深度体检',
      timestamp: '10:15',
    },
    {
      id: 'zy-deep42-cfg',
      sender: 'coach',
      type: 'deep_call_config_collection',
      reactProcess: {
        duration: '1.6s',
        summary: '已识别商业计划书全链路深度体检意图，正在装配工作空间物料与配置',
        steps: [
          {
            id: 'd42-s1-init',
            type: 'reasoning',
            title: '意图识别与跨模块路由',
            subtitle: '480ms',
            content: '识别到针对「智耘农业」的 4.2 全链路商业计划书深度体检指令。自动装配工作空间 38 页 BP 与路演 PPT 资产，准备发起跨模块 RPC 管道调用。'
          },
          {
            id: 'd42-s2-init',
            type: 'plan',
            title: '装配工作空间物料与配置',
            tasks: [
              { id: 't1', text: '打包工作空间核心物料（BP_商业计划书_v2.4、路演汇报Deck_v3、盲测公章台账）' },
              { id: 't2', text: '装配六维打分雷达与国赛金奖标杆库基准线' },
              { id: 't3', text: '生成 4.2 全链路智能指导 意图识别与配置确认卡片' }
            ]
          },
          {
            id: 'd42-s3-init',
            type: 'act',
            title: '调用 4.2 全链路智能指导 意图校验网关',
            command: {
              lang: 'mcp',
              cmd: 'mcp://guidance-engine/intent-check?project=智耘农业&mode=deep_pipeline'
            },
            content: '意图校验通过，工作空间物料与配置参数已就绪，等待用户确认执行。'
          }
        ]
      },
      text: `已识别你的【4.2 全链路智能指导与商业计划书深度体检】调用意图！\n\n4.1 正在为你打包当前工作空间 38 页 BP 与路演 PPT 资产。请在下方卡片核对本次调用的项目物料、诊断重点维度与基准库设置。**核对无误后，点击卡片中的「确认配置并立即调用 4.2 执行」即可启动 2 秒模拟调用：**`,
      timestamp: '10:16',
      engineAttribution: '4.2 全链路智能指导专家引擎 · 意图确认',
      data: {
        target: '4.2',
        projectName: '智耘农业——基于低空多光谱的茶园精准病虫害防控系统',
        trackTag: '新农科组',
        university: '厦门大学',
        materials: [
          { id: 'm1', name: 'BP_商业计划书_v2.4_智耘农业.pdf', type: 'PDF', size: '14.8MB', selected: true },
          { id: 'm2', name: '路演汇报Deck_金奖标准_v3.pptx', type: 'PPTX', size: '28.4MB', selected: true },
          { id: 'm3', name: '建瓯与吉安茶园盲测挽损公章台账.xlsx', type: 'XLSX', size: '3.2MB', selected: true }
        ],
        focusDimensions: ['商业模式与合作社分成闭环', '财务预测与产能匹配度', 'PPT 前三页视觉焦点'],
        benchmarkCohort: '近三年全国国赛金奖标杆库 (Top 1%)'
      }
    },
    {
      id: 'zy-deep42-confirm',
      sender: 'student',
      type: 'text',
      text: '已确认上述配置参数，请立即打包物料并调用 4.2 全链路智能指导 引擎执行完整流程',
      timestamp: '10:16',
    },
    {
      id: 'zy-deep42-m2',
      sender: 'coach',
      type: 'deep_call_result',
      reactProcess: {
        duration: '2.0s',
        summary: '已完成 4.2 深度诊断引擎调用与全篇章雷达对标',
        steps: [
          {
            id: 'd42-s1',
            type: 'reasoning',
            title: '深度思考与意图路由',
            subtitle: '620ms',
            content: '检测到「智耘农业」全链路深度诊断指令。自动调用 4.2 诊断与指导引擎服务，装配工作空间全量 BP 文本 (38页) 与路演 PPT 资产，运行 6 维多因子国金基准线对标算法。'
          },
          {
            id: 'd42-s2',
            type: 'plan',
            title: '项目诊断装配与执行计划',
            tasks: [
              { id: 't1', text: '向 4.2 引擎发起全链路深度诊断请求' },
              { id: 't2', text: '对标近三年全国金奖项目库基准线 (Top 1%) 测算差距' },
              { id: 't3', text: '提取逐章硬伤、数据矛盾与前三页视觉重构待办' }
            ]
          },
          {
            id: 'd42-s3',
            type: 'act',
            title: '调用 4.2 全链路智能指导引擎',
            command: {
              lang: 'mcp',
              cmd: 'mcp://guidance-engine/deep-diagnosis?project=智耘农业&depth=extreme'
            },
            content: '4.2 引擎计算完毕 (200 OK, 2000ms)。返回 71.5 分诊断报告，定位散户付费致命硬伤与产能脱节问题。'
          }
        ]
      },
      text: `已为你完成【4.2 全链路智能指导引擎】深度体检！\n\n经过对《智耘农业》商业计划书与路演 PPT 的全文穿透扫描，项目全景综合诊断得分为 **71.5 分**（对标近三年全国金奖项目库基准线存在 **-32%** 成熟度差距）。\n\n核心漏洞集中在**「市场与商业模式（散户付费假设）」**与**「首期产能与营收脱节」**。完整诊断雷达、逐章问题清单与行动改进指南已在下方生成，并支持一键将整改待办全量同步至工作空间。`,
      timestamp: '10:17',
      citation: '教育部全国双创大赛 12 份农业国金 BP 深度体检数据库',
      engineAttribution: '4.2 全链路智能指导引擎 · 深度调用',
      data: {
        target: '4.2',
        totalScore: 71.5,
        benchmarkScore: 92.0,
        benchmarkCohort: '近三年全国金奖项目库 (Top 1%)',
        goldGap: '-32% 成熟度差距',
        radar: [
          { label: '创新性', value: 75, benchmark: 92, max: 100 },
          { label: '技术可行性', value: 80, benchmark: 90, max: 100 },
          { label: '市场与商业价值', value: 55, benchmark: 88, max: 100 },
          { label: '团队匹配度', value: 70, benchmark: 89, max: 100 },
          { label: '表达与完整性', value: 65, benchmark: 87, max: 100 },
          { label: '社会价值', value: 85, benchmark: 94, max: 100 }
        ],
        criticalFlaws: [
          { 
            chapter: '第三章 · 市场与商业模式', 
            flaw: '假设向单体散户直接收取软件年费，散户付费意愿极低且收款成本高昂，缺乏组织化合作社分成兜底机制', 
            severity: '致命硬伤' 
          },
          { 
            chapter: '第四章 · 财务预测与产能规划', 
            flaw: '首期生产装配线年产仅30套，但BP预测首年覆盖120个农场并实现千万元营收，产能与营收前后严重脱节', 
            severity: '前后矛盾' 
          }
        ],
        chapterAnnotations: [
          { chapter: '第一章 · 项目背景与痛点', score: 8.5, status: '良好', comment: '水稻病虫害早期微观病斑痛点阐述清晰，契合国家粮食安全战略。' },
          { chapter: '第二章 · 核心技术与产品', score: 8.0, status: '达标', comment: '自研窄带滤波分光机理与叶绿素反演模型具备新颖度，建议补充极端工况测试报告。' },
          { chapter: '第三章 · 市场与商业模式', score: 5.5, status: '急需重构', comment: '散户付费模式不成立。必须重构为“农机合作社统防托管 + 人保农险挽损分成”。' },
          { chapter: '第四章 · 财务与融资计划', score: 6.5, status: '待修正', comment: '装配产能 30 套与千万营收脱节，需修正出货量逻辑并补充 6-9 个月农闲账期压力测试。' }
        ],
        actionItems: [
          '重构商业模式：由散户收费转型为“合作社托管 + 农险分成（30%）”',
          '修正财务预测一致性：首期装配产能 30 套与阶段性营收指标匹配',
          '路演 PPT 前三页去掉密集文字，替换为晨曦稻浪实拍与建瓯两季 320 万元挽损公章'
        ],
        flowLogId: 'log-deep-42-01'
      }
    }
  ],

  // 2. 【深度调用 4.3】全流程模拟答辩与多考官极限压力训练
  'sess-zy-deep-43': [
    {
      id: 'zy-deep43-m1',
      sender: 'student',
      type: 'text',
      text: '帮我开启全流程模拟答辩，跳转 4.3 模拟评审与多考官极限压力训练',
      timestamp: '09:30',
    },
    {
      id: 'zy-deep43-cfg',
      sender: 'coach',
      type: 'deep_call_config_collection',
      reactProcess: {
        duration: '1.6s',
        summary: '已识别全流程模拟答辩与多考官极限压力意图，正在装配工作空间物料与配置',
        steps: [
          {
            id: 'd43-s1-init',
            type: 'reasoning',
            title: '意图识别与跨模块路由',
            subtitle: '480ms',
            content: '识别到针对「智耘农业」的 4.3 全流程模拟答辩与多考官极限压力训练指令。自动装配工作空间 BP、Deck 与盲测公章数据，准备调度多考官矩阵发起答辩演练。'
          },
          {
            id: 'd43-s2-init',
            type: 'plan',
            title: '装配工作空间物料与配置',
            tasks: [
              { id: 't1', text: '打包工作空间核心物料（BP、PPT、财务测算表、盲测公章台账）' },
              { id: 't2', text: '装配考官人设矩阵（张严苛/陈投资/李学者）与高压质询题库' },
              { id: 't3', text: '生成 4.3 模拟评审与答辩训练 意图识别与配置确认卡片' }
            ]
          },
          {
            id: 'd43-s3-init',
            type: 'act',
            title: '调用 4.3 模拟评审与答辩训练 意图校验网关',
            command: {
              lang: 'mcp',
              cmd: 'mcp://defense-engine/intent-check?project=智耘农业&mode=deep_pipeline'
            },
            content: '意图校验通过，工作空间物料与配置参数已就绪，等待用户确认执行。'
          }
        ]
      },
      text: `已识别你的【4.3 模拟评审与多考官极限压力答辩】深度调用意图！\n\n4.1 正在为你打包当前工作空间物料资产与考官配置。请在下方卡片核对本次调用的项目物料、考官矩阵与基准库设置。**核对无误后，点击卡片中的「确认配置并立即调用 4.3 执行」即可启动 2 秒模拟调用：**`,
      timestamp: '09:31',
      engineAttribution: '4.3 模拟评审与答辩训练引擎 · 意图确认',
      data: {
        target: '4.3',
        projectName: '智耘农业——基于低空多光谱的茶园精准病虫害防控系统',
        trackTag: '新农科组',
        university: '厦门大学',
        materials: [
          { id: 'm1', name: 'BP_商业计划书_v2.4_智耘农业.pdf', type: 'PDF', size: '14.8MB', selected: true },
          { id: 'm2', name: '路演汇报Deck_金奖标准_v3.pptx', type: 'PPTX', size: '28.4MB', selected: true },
          { id: 'm3', name: '建瓯与吉安茶园盲测挽损公章台账.xlsx', type: 'XLSX', size: '3.2MB', selected: true }
        ],
        focusDimensions: ['商业壁垒与大厂防守', '下沉市场现金流账期', '技术专属数据集验证'],
        benchmarkCohort: '近三年全国国赛金奖标杆库 (Top 1%)'
      }
    },
    {
      id: 'zy-deep43-confirm',
      sender: 'student',
      type: 'text',
      text: '已确认上述配置参数，请立即打包物料并调用 4.3 模拟评审与答辩训练 引擎执行完整流程',
      timestamp: '09:31',
    },
    {
      id: 'zy-deep43-m2',
      sender: 'coach',
      type: 'deep_call_result',
      reactProcess: {
        duration: '2.0s',
        summary: '已完成 4.3 答辩引擎调用与双考官极限攻防',
        steps: [
          {
            id: 'd43-s1',
            type: 'reasoning',
            title: '深度思考与多考官调度',
            subtitle: '850ms',
            content: '激活 4.3 模拟评审与答辩训练引擎。调度【张严苛（质疑型）】与【陈投资（投资型）】双考官人设，针对大疆生态碾压、真实挽损实证与轻资产代工进行 2 轮极限连环质询。'
          },
          {
            id: 'd43-s2',
            type: 'plan',
            title: '模拟评审执行与评分计划',
            tasks: [
              { id: 't1', text: '向 4.3 引擎发起 RPC 请求：POST /api/engine/4.3/defense-simulation' },
              { id: 't2', text: '模拟评委连环追问并生成攻防表现评分' },
              { id: 't3', text: '输出答辩能力 6 维雷达与 1 分钟黄金路演开场白优化' }
            ]
          },
          {
            id: 'd43-s3',
            type: 'act',
            title: '调用 4.3 答辩与模拟评审引擎',
            command: {
              lang: 'mcp',
              cmd: 'mcp://defense-engine/full-simulation?project=智耘农业&mode=extreme_pressure'
            },
            content: '答辩训练完成 (200 OK, 2000ms)。综合得分 82.0 分，生成防守复盘报告与整改清单。'
          }
        ]
      },
      text: `已为你完成【4.3 模拟评审与答辩训练引擎】全流程演练！\n\n系统调动【张严苛（质疑型）】与【陈投资（投资型）】双考官人设，进行了 2 轮极限连环质询与追问，答辩综合得分为 **82.0 分**。\n\n针对「大疆/极飞巨头生态降维打击」与「农户付费经济账真实性」，已生成金奖防守复盘与答辩能力雷达如下：`,
      timestamp: '09:32',
      citation: '全国大学生创新大赛总决赛评审委员会主任答辩点评库',
      engineAttribution: '4.3 模拟评审与答辩训练引擎 · 深度调用',
      data: {
        target: '4.3',
        totalScore: 82.0,
        benchmarkScore: 90.0,
        benchmarkCohort: '国赛金奖答辩标准',
        goldGap: '-8.0 分 答辩抗压差距',
        radar: [
          { label: '逻辑自洽', value: 85, benchmark: 92, max: 100 },
          { label: '商业壁垒', value: 78, benchmark: 90, max: 100 },
          { label: '实证铁证', value: 88, benchmark: 92, max: 100 },
          { label: '临场抗压', value: 82, benchmark: 88, max: 100 },
          { label: '表达精炼', value: 80, benchmark: 86, max: 100 },
          { label: '战略站位', value: 90, benchmark: 94, max: 100 }
        ],
        criticalFlaws: [
          { 
            chapter: '第一轮质询 · 巨头竞品压制', 
            flaw: '面对大疆/极飞硬件降维打击，开头 10 秒未明确“互补生态算法载荷”定位，容易被误判为存量同质竞争', 
            severity: '答辩策略漏洞' 
          },
          { 
            chapter: '第二轮质询 · 农户经济账与实证', 
            flaw: '回答农户挽损增收时，初期叙述偏宏观，未能第一时间亮出福建建瓯农技站公章盖章报告', 
            severity: '铁证亮出迟缓' 
          }
        ],
        chapterAnnotations: [
          { chapter: '第一轮：大疆竞品降维打击', score: 8.2, status: '良好', comment: '成功运用“大疆卖无人机硬件，智耘提供病害高价值算法插件”转化对抗为共赢。' },
          { chapter: '第二轮：农田经济账两季实证', score: 8.8, status: '优秀', comment: '以 1.8 万亩盲测、挽回损失 142 元/亩与农险 1:7.2 ROI 构成无可辩驳的证据闭环。' }
        ],
        actionItems: [
          '答辩开场 10 秒即抛出建瓯、吉安两季 1.8 万亩增收盲测台账与农险公章',
          '针对大疆竞争强调“专有窄带光谱数据库与 4 项授权发明专利”物理壁垒',
          '精炼 1 分钟黄金路演开场白，以农民真实痛点建立深层共情'
        ],
        flowLogId: 'log-deep-43-02'
      }
    }
  ],

  // 3. 【浅度调用 4.2】商业计划书商业模式章节原子速诊
  'sess-zy-shallow-42': [
    {
      id: 'zy-shallow42-m1',
      sender: 'student',
      type: 'text',
      text: '帮我诊断 BP 商业模式章节，分析付费主体与现金流闭环是否存在逻辑漏洞',
      timestamp: '昨天 15:10',
    },
    {
      id: 'zy-shallow42-m2',
      sender: 'coach',
      type: 'atomic_call_result',
      reactProcess: {
        duration: '1.4s',
        summary: '已完成 4.2 [BP商业模式章节速诊] 原子能力调用',
        steps: [
          {
            id: 's42-s1',
            type: 'reasoning',
            title: '识别原子能力调用意图',
            subtitle: '380ms',
            content: '识别到针对「智耘农业」商业模式章节的轻量速诊诉求。路由至 4.2 全链路智能指导引擎的原子能力 [sk-bp-diag]，无需执行全篇章 38 页重度流程。'
          },
          {
            id: 's42-s2',
            type: 'plan',
            title: '参数序列化与上下文装配',
            tasks: [
              { id: 't1', text: '提取商业计划书第三章“市场与商业模式”核心段落' },
              { id: 't2', text: '向 4.2 诊断微服务发起轻量 RPC 交互' }
            ]
          },
          {
            id: 's42-s3',
            type: 'act',
            title: '调用 4.2 原子能力 (sk-bp-diag)',
            command: {
              lang: 'mcp',
              cmd: 'mcp://guidance-engine/atomic?skill=sk-bp-diag&chapter=3'
            },
            content: '原子能力响应成功 (200 OK, 460ms)，数据已流转至 4.1 前端。'
          }
        ]
      },
      text: `已为你浅度调用【4.2 全链路智能指导】的原子能力：**BP 商业模式章节速诊 (sk-bp-diag)**。\n\n计算耗时 460ms，结果已直接回传并渲染在下方。针对《智耘农业》第三章核心逻辑漏洞与优化建议如下：`,
      timestamp: '昨天 15:12',
      engineAttribution: '4.2 全链路智能指导 (原子能力)',
      callMeta: {
        callType: 'shallow',
        targetEngine: '4.2',
        capabilityName: 'BP商业模式章节速诊 (sk-bp-diag)',
        duration: '460ms',
        inputPayload: {
          atomicCapability: 'sk-bp-diag',
          chapterName: '第三章 · 市场与商业模式',
          focus: '付费主体、现金流闭环与分成机制'
        },
        outputResponse: {
          status: 200,
          score: 5.5,
          benchmark: 8.8,
          flaw: '散户付费意愿极低，直接向农户收取年费属于致命假需求'
        }
      },
      data: {
        atomicType: 'chapter_42',
        chapterName: '第三章 · 市场与商业模式',
        score: 5.5,
        benchmarkScore: 8.8,
        gap: '落后金奖线 3.3 分 (高危扣分项)',
        logicDiagnosis: 'BP 中假设“直接向分散茶农/粮农每年收取 300 元/亩软件费”。中国传统农户对纯数字化工具付费意愿极低，且催缴收款履约成本极高，评审专家将直接判定为纸面商业模式。',
        rewriteAdvice: '立即重构为“组织化农机专业合作社飞防托管 + 联合人保财险防灾减损 30% 分成”。让合作社和保险公司出资，农户享受免费早筛，形成坚固的政企险协同闭环。',
        actionPill: '一键重构为“合作社托管 + 农险分成”模式'
      }
    }
  ],

  // 4. 【浅度调用 4.3】考官高频尖锐答辩质询题直出 (5道)
  'sess-zy-shallow-43': [
    {
      id: 'zy-shallow43-m1',
      sender: 'student',
      type: 'text',
      text: '帮我出 5 道答辩题，重点针对市场商业模式和财务真实性的尖锐质询',
      timestamp: '昨天 17:00',
    },
    {
      id: 'zy-shallow43-m2',
      sender: 'coach',
      type: 'atomic_call_result',
      reactProcess: {
        duration: '1.5s',
        summary: '已完成 4.3 [评委尖锐质询题生成器] 原子能力调用',
        steps: [
          {
            id: 's43-s1',
            type: 'reasoning',
            title: '识别原子能力调用意图',
            subtitle: '410ms',
            content: '识别到答辩质询题生成诉求。路由至 4.3 模拟评审微服务 [sk-defense-grill]，选定【张严苛 评委（国赛资深常委 / 质疑型）】视角，一次性批量输出 5 道高频攻防题目。'
          },
          {
            id: 's43-s2',
            type: 'plan',
            title: '参数序列化与上下文装配',
            tasks: [
              { id: 't1', text: '装配「智耘农业」项目特征与赛道参数' },
              { id: 't2', text: '调用 4.3 题库引擎生成 5 道核心商业与技术质询题' }
            ]
          },
          {
            id: 's43-s3',
            type: 'act',
            title: '调用 4.3 原子能力 (sk-defense-grill)',
            command: {
              lang: 'mcp',
              cmd: 'mcp://defense-engine/atomic?skill=sk-defense-grill&judge=critical&count=5'
            },
            content: '原子能力响应成功 (200 OK, 480ms)，直出 5 道题目并流转至 4.1 前端。'
          }
        ]
      },
      text: `已为你浅度调用【4.3 模拟评审与答辩训练】的原子能力：**评委尖锐质询题生成器 (出5题)**。\n\n针对「智耘农业」，系统选定【张严苛 评委（国赛资深常委 / 质疑型）】视角，一键直出 5 道高频尖锐答辩题：`,
      timestamp: '昨天 17:02',
      engineAttribution: '4.3 模拟评审与答辩训练 (原子能力)',
      callMeta: {
        callType: 'shallow',
        targetEngine: '4.3',
        capabilityName: '评委尖锐质询题生成器 (5题)',
        duration: '480ms',
        inputPayload: {
          atomicCapability: 'sk-defense-grill',
          judgePersona: 'critical',
          questionCount: 5
        },
        outputResponse: {
          status: 200,
          count: 5,
          judge: '张严苛 评委'
        }
      },
      data: {
        atomicType: 'questions_43',
        judge: mockJudgePersonas[0],
        projectName: '智耘农业',
        questions: [
          {
            qId: 1,
            category: '巨头竞品压制与核心壁垒',
            question: '大疆农业（DJI）拥有成熟的农机硬件与全国飞防渠道。若大疆在固件中直接集成相似算法，你们的核心技术壁垒到底在哪？凭什么活下去？',
            difficulty: '极高',
            tip: '转化竞争为互补生态：大疆做硬件底盘，智耘提供水稻专属病理光谱模型与 4 项发明专利，已适配大疆 Payload SDK。'
          },
          {
            qId: 2,
            category: '下沉市场付费意愿与经济账',
            question: '中国农民最看重直接收益，你们宣称每亩挽损 142 元，究竟有无福建、江西两季由农业农村局或保险公司盖章的第三方盲测实测台账？',
            difficulty: '极高',
            tip: '亮出铁证：2024-2025 年建瓯、吉安 6 个示范合作社 1.8 万亩盲测，福建农技推广站+阳光农险联合测产盖章报告。'
          },
          {
            qId: 3,
            category: '首期产能与财务营收矛盾',
            question: '商业计划书财务预测首年实现千万元营收，但团队自建生产线年产仅 30 套设备，硬件产能与巨额营收预测如何自圆其说？',
            difficulty: '高',
            tip: '轻资产代工方案：核心光学镜头由省光电所中试基地代工，自动化装配委托泉州代工厂，团队专注于算法标定与软件订阅。'
          },
          {
            qId: 4,
            category: '农闲账期与现金流断裂风险',
            question: '农业飞防具有极强的季节性（农忙仅 3 个月，农闲长达 9 个月），在长达半年的农闲停滞期，团队如何维持研发团队薪酬与现金流周转？',
            difficulty: '高',
            tip: '跨南北积温带作业：结合海南南繁冬季育种基地与北方一季稻轮作，拉长全年作业周期，配合农险按季预付定损服务费。'
          },
          {
            qId: 5,
            category: '高校职务发明专利权属清晰度',
            question: '核心发明专利中，指导教师与学生第一作者的知识产权划分是否清晰？是否存在高校职务发明的权属争议隐患？',
            difficulty: '高',
            tip: '权属合规闭环：指导老师专利已签署厦门大学科技处备案的 10 年独家排他许可协议，学生团队自主持有 2 项软件著作权。'
          }
        ]
      }
    }
  ],

  // 3.1 历史金奖与竞品对标分析 - 标杆案例拆解
  'sess-zy-task-3-1': [
    {
      id: 'zy-t31-m1',
      sender: 'student',
      type: 'text',
      text: '请帮我们拆解近三年全国创新大赛关于乡村振兴与新农科的金奖项目，重点总结他们在商业模式和落地实效上有哪些共性？',
      timestamp: '前天 15:40',
    },
    {
      id: 'zy-t31-m3',
      sender: 'coach',
      type: 'gold_cases',
      reactProcess: {
        duration: '1.7s',
        summary: '已完成标杆金奖案例底层商业范式比对',
        steps: [
          {
            id: 'zy-c1-s1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '780ms',
            content: '分析教育部历届金奖涉农项目（如《渔光智联》、《茶语云眼》等）。总结评审委员会对乡村振兴赛道项目的终极偏好：坚决不相信“散户销售模式”，高度看重供销社/龙头企业组织化背书；严格核验“三单合一”真实增收账本；厘清高校专利许可权属。'
          },
          {
            id: 'zy-c1-s2',
            type: 'plan',
            title: '标杆案例萃取计划',
            tasks: [
              { id: 't1', text: '检索近三年全国总决赛涉农及乡村振兴金奖案例案卷' },
              { id: 't2', text: '归纳商业模式变迁与落地证据链的三大底层共性' },
              { id: 't3', text: '提取对智耘农业可直接复用的行动清单' }
            ]
          },
          {
            id: 'zy-c1-s3',
            type: 'act',
            title: '调用金奖标杆案例库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://gold-benchmarks/filter?track=rural_revitalization&years=2023-2025'
            },
            content: '提取“组织化主体 + 三单齐备 + 高校专利独占”三大共性范式。'
          }
        ]
      },
      text: `已为你穿透拆解近三届全国总决赛涉农金奖项目（包括《渔光智联》、《茶语云眼》等标杆案例）：\n\n🏆 **三大颠覆性底层共性**：\n1. **去“散户化”，拥抱“组织化主体”**：100% 的金奖项目放弃了“挨家挨户推销农技”的幻想，全部依托供销联社、农业龙头企业或大型农机合作社切入；\n2. **三单齐备的实效铁证**：金奖项目必具备“**农户增收协议账本 + 县级农技站抽样测产报告 + 地方政府应用公函**”，三者形成闭环；\n3. **高校专利独占反哺**：指导教师持有的国家发明专利全部签署独家普通实施许可或转让协议，明晰知识产权界限。`,
      timestamp: '前天 15:42',
      citation: '教育部双创大赛金奖案例库全景报告（2023-2025汇总）',
      engineAttribution: '4.4 行业情报与对标专家 · 标杆案例拆解',
      data: {
        cases: mockGoldCases
      }
    }
  ],

  // 3.2 历史金奖与竞品对标分析 - 竞品与市场调研辅助
  'sess-zy-task-3-2': [
    {
      id: 'zy-t32-m1',
      sender: 'student',
      type: 'text',
      text: '做智慧农业低空巡检，请帮我们梳理当前赛道的主要竞品，并列出行业 5 个主要痛点及对应的解决措施，便于我们完善调研报告。',
      timestamp: '3天前 14:00',
    },
    {
      id: 'zy-t32-m2',
      sender: 'coach',
      type: 'competitor_intel',
      reactProcess: {
        duration: '1.6s',
        summary: '已完成竞品矩阵与痛点对策图谱绘制',
        steps: [
          {
            id: 'zy-i1-s1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '720ms',
            content: '对标大疆农业、极飞科技、麦飞科技等头部玩家。虽然巨头占据飞防农机底盘绝对份额，但在水稻早期叶绿素病理窄带反演、端侧无网离线计算、农险防灾分成等细分垂直维度存在明显服务空白。应系统梳理 5 大产业痛点，为智耘农业找到错位竞争生存空间。'
          },
          {
            id: 'zy-i1-s2',
            type: 'plan',
            title: '竞品调研推进计划',
            tasks: [
              { id: 't1', text: '绘制头部农机与遥感企业竞品能力四象限' },
              { id: 't2', text: '深入田野作业场景，总结 5 个未被满足的痛点与差异化穿透对策' }
            ]
          },
          {
            id: 'zy-i1-s3',
            type: 'act',
            title: '聚合农业投融资白皮书与产业研报',
            command: {
              lang: 'mcp',
              cmd: 'mcp://intel-extractor/competitor-matrix?sector=smart_agriculture'
            },
            content: '完成 5 大核心痛点对策表及大疆、极飞差异化竞品图谱。'
          }
        ]
      },
      text: `已为你检索智慧农业赛道核心头部企业矩阵（大疆农业、极飞科技、麦飞科技等），并深度梳理行业 5 大痛点与突破措施：\n\n📌 **智慧农业与低空飞防 5 大核心痛点及穿透对策**：\n\n1. **痛点一：通用光谱波段宽，水稻初期细微病理无法识别**\n   - *现状*：市面多数无人机搭载红外NDVI，只能反映作物是否缺水发黄，此时已错失防治窗口；\n   - *对策*：采用 680nm/720nm/800nm 窄带滤波片，捕捉叶绿体荧光猝灭早期病态征兆。\n\n2. **痛点二：农机硬件售价昂贵，合作社采购意愿低**\n   - *现状*：进口多光谱相机动辄 8-15 万元，回收周期长达 5 年以上；\n   - *对策*：模块化 CMOS 阵列与自研分光镜片，整机降至 8,000 元内，主打高性价比普惠。\n\n3. **痛点三：田间山区网络盲区，图像无法实时上传云端算力**\n   - *现状*：回到住处夜间导出 SD 卡跑算力，失去应急飞防处置意义；\n   - *对策*：端侧 FPGA 轻量模型就地实时拼接与秒级病斑定位，随巡随打。\n\n4. **痛点四：仅出检测图纸，不与后续农药喷洒联动**\n   - *现状*：农户拿到热力图依旧不知道该配什么药、配多少浓度；\n   - *对策*：生成国际通用“处方施药图（Shapefile）”，直接导入极飞/大疆植保机实现变量精准喷洒，减药 32%。\n\n5. **痛点五：缺乏农险挽损挂钩，商业变现单薄**\n   - *现状*：纯靠卖设备一次性交易，缺乏持续服务性现金流；\n   - *对策*：与地方人保/中华财险联合建立“防灾减损分成机制”，以数据赋能险企降赔分成。`,
      timestamp: '3天前 14:02',
      citation: '农业农村部信息中心智慧农业投融资白皮书及行业研报',
      engineAttribution: '4.5 行业情报与对标专家 · 竞品与调研辅助',
      data: {
        competitors: mockCompetitorList
      }
    }
  ],

  // 4. 校本专属与双创资源 ("校内智库")
  'sess-zy-task-4': [
    {
      id: 'zy-t4-m1',
      sender: 'student',
      type: 'text',
      text: '请调用本校（厦门大学）专属双创知识库，查询本校双创学院的特色扶持政策、重点实验室算力池，以及大赛样机打样和差旅报销流程。',
      timestamp: '4天前 10:20',
    },
    {
      id: 'zy-t4-m2',
      sender: 'coach',
      type: 'campus_resources',
      reactProcess: {
        duration: '1.4s',
        summary: '已完成厦门大学校本双创资源检索',
        steps: [
          {
            id: 'zy-u1-s1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '680ms',
            content: '厦门大学对双创参赛项目有完整的南强科创生态支持体系。需调取针对工科与涉农项目的南强科创天使种子基金资助额度（10万元）、信息学院低空光谱算子重点实验室匹配情况，以及厦大综合服务平台双创竞赛报销专项绿色通道的操作规范。'
          },
          {
            id: 'zy-u1-s2',
            type: 'plan',
            title: '校本智库匹配计划',
            tasks: [
              { id: 't1', text: '检索《厦门大学深化创新创业教育改革实施意见》厦大创字〔2025〕06号' },
              { id: 't2', text: '匹配信息学院张林教授团队算力集群与导师库' },
              { id: 't3', text: '梳理差旅与打样线上免纸质 3 日报销指引' }
            ]
          },
          {
            id: 'zy-u1-s3',
            type: 'act',
            title: '调取厦门大学双创知识库',
            command: {
              lang: 'mcp',
              cmd: 'mcp://campus-kb/xmu?dept=innov_center&query=funding_and_reimbursement'
            },
            content: '成功调取南强科创天使种子基金政策、实验室算力预约通道与极速报销指南。'
          }
        ]
      },
      text: `已为你成功连接【厦门大学双创学院专属校本知识库】！本校为在库孵化团队提供全周期专项支持：\n\n🏛️ **一、校内专项资助与特色赛道机制**：\n• **南强科创天使种子基金**：针对国赛冲刺团队提供最高 **10 万元/项** 无偿样机研制与测试补贴；\n• **导师与算力直通车**：推荐对接信息学院张林教授实验室（低空多光谱算子匹配度 94%）以及海韵园高性能 GPU 训练集群；\n\n🧾 **二、校内差旅与耗材极速报销通道（双创绿色通道）**：\n1. 登录“厦大综合服务平台-双创竞赛报销专项”；\n2. 课题组负责老师线上审核签字免纸质流转；\n3. 农机打样发票与田间差旅高铁票上传后，双创学院财务室 3 个工作日极速打款至负责人银行卡。`,
      timestamp: '4天前 10:22',
      citation: '厦门大学创新创业教育学院文件（厦大创字〔2025〕06号）',
      engineAttribution: '4.6 校内双创与智库专家 · 校内专属智库',
      data: {
        university: mockUniversities[0]
      }
    }
  ],


  // 兼容老会话 id (sess-1, sess-103)
  'sess-1': [
    {
      id: 'sess1-compat-1',
      sender: 'student',
      type: 'text',
      text: '帮我们分析一下当前项目在国赛评审 6 大维度的得分分布与可视化雷达图，并重点诊断商业模式弱项。',
      timestamp: '50分钟前',
    },
    {
      id: 'sess1-compat-3',
      sender: 'coach',
      type: 'bp_diagnosis',
      reactProcess: {
        duration: '1.9s',
        summary: '已完成 6 维量化雷达对标与模式诊断',
        steps: [
          {
            id: 's1-r1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '800ms',
            content: '对标全国金奖项目商业闭环，分析 38 页 BP 在 6 个评审维度上的短板。技术可行性与社会价值表现良好，但商业模式与产能脱节为核心失分点。'
          },
          {
            id: 's1-r2',
            type: 'plan',
            title: '量化诊断计划',
            tasks: [
              { id: 't1', text: '计算 6 维指标对标国金平均线差距' },
              { id: 't2', text: '提出盈利模式由散户转为合作社托管方案' }
            ]
          },
          {
            id: 's1-r3',
            type: 'act',
            title: '生成量化雷达评估矩阵',
            command: {
              lang: 'mcp',
              cmd: 'mcp://bp-eval/radar?project=智耘农业'
            },
            content: '生成综合评分 7.0 分诊断报告，定位商业模式为核心改造项。'
          }
        ]
      },
      text: `已为你生成「智耘农业」全景量化诊断可视化报告：\n\n经过对 38 页 BP 的全文语义提取与国赛金奖基准线对标，项目综合评分为 **7.0 / 10.0**。其中**「市场与商业价值」仅得 5.5 分（金奖基准线 8.8 分）**，为核心短板！\n\n💡 **教练关键重构建议**：\n建议将盈利模式由原来的“直接向散户茶农收取 300 元/亩年费”，重构为**“农机合作社统防统治托管 + 联合人保农险挽损分成（30%）”**，大幅提升现金流闭环可信度。`,
      timestamp: '48分钟前',
      citation: '依据全国高校双创大赛评审规则及 12 份金奖农业科技项目盈利模型演进路径',
      engineAttribution: '4.2 商业计划与模式诊断专家',
      data: {
        totalScore: 7.0,
        benchmarkScore: 9.0,
        chapterIssues: [
          {
            chapter: '第三章 · 市场与商业模式',
            level: '重大逻辑漏洞',
            desc: 'BP 中假设向单体粮农收取年费，散户付费意愿极低。需重构为“合作社托管+农险分成”。'
          },
          {
            chapter: '第四章 · 财务预测与产能规划',
            level: '前后数据矛盾',
            desc: '2026年覆盖 120 个农场，但生产线年产仅 30 套，营收暴增与产能脱节。'
          }
        ],
        radar: [
          { label: '创新性', value: 7.5, benchmark: 9.2 },
          { label: '技术可行性', value: 8.0, benchmark: 9.0 },
          { label: '市场与商业价值', value: 5.5, benchmark: 8.8 },
          { label: '团队匹配度', value: 7.0, benchmark: 8.9 },
          { label: '表达与完整性', value: 6.5, benchmark: 8.7 },
          { label: '社会价值', value: 8.5, benchmark: 9.4 },
        ]
      }
    }
  ],

  'sess-103': [
    {
      id: 'sess103-1',
      sender: 'student',
      type: 'text',
      text: '探讨院端独立编码收费与耗材打包计费的可行性路径，目前医院医保控费严格，医疗 AI 如何跑通合规回款？',
      timestamp: '昨天',
    },
    {
      id: 'sess103-2',
      sender: 'coach',
      type: 'text',
      reactProcess: {
        duration: '1.6s',
        summary: '已完成医保控费与院外收费合规研判',
        steps: [
          {
            id: 's103-r1',
            type: 'reasoning',
            title: '深度思考',
            subtitle: '700ms',
            content: '国家医保局关于医疗服务价格立项新规明确规定：不得单纯为 AI 技术收取额外费用。因此医疗 AI 回款必须走“伴随诊断提高手术转化率”或“院外体检/基层公卫自选自费升级包”路径。'
          },
          {
            id: 's103-r2',
            type: 'plan',
            title: '合规回款路径梳理',
            tasks: [
              { id: 't1', text: '解读医保局《关于促进医疗服务价格多元化立项的指导意见》' },
              { id: 't2', text: '梳理院外自选体检与专科伴随诊断两条造血闭环' }
            ]
          },
          {
            id: 's103-r3',
            type: 'act',
            title: '检索医疗服务价格立项指南',
            command: {
              lang: 'mcp',
              cmd: 'mcp://nhsa-pricing/guideline?query=ai_assisted_diagnosis'
            },
            content: '提炼两大合规破局路径：院外自费体检升级包与伴随专科门诊打包。'
          }
        ]
      },
      text: `已为你梳理国家医保局关于人工智能辅助诊断医疗服务价格立项指南：\n\n1. **收费立项原则**：“医疗机构采用人工智能技术辅助开展的医疗服务，原则上不得额外向患者收取人工智能技术服务费”；\n2. **破局路径一（院外合规自费）**：在体检中心、视光中心及基层慢病公卫体检中作为自选健康升级包收取服务费；\n3. **破局路径二（伴随诊断打包）**：将 AI 筛查嵌入专科门诊整体检查项目中，作为提高早期视网膜光凝手术转化率的核心抓手。`,
      timestamp: '昨天',
      citation: '国家医疗保障局《关于促进医疗服务价格多元化立项的指导意见》',
      engineAttribution: '4.2 商业计划与模式诊断专家'
    }
  ]
};
