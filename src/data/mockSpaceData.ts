/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectSpace, CoachSession } from '../types';

export const initialMergedSessions: CoachSession[] = [
  {
    id: 'sess-roadmap-ppt',
    title: '规划场景深度演进路径',
    time: '刚刚',
    preview: 'PPT已重新生成，深度扩充产品里程碑、场景深度、客户/收入与融资四阶演进矩阵',
    taskKey: 'task-roadmap-ppt',
    taskType: 'bp',
    messages: [
      {
        id: 'msg-roadmap-user',
        sender: 'student',
        type: 'text',
        text: '有点总结的太厉害了，要稍微详细点，重新输出PPT',
        timestamp: '14:20'
      },
      {
        id: 'msg-roadmap-coach',
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
    ]
  },
  {
    id: 'sess-init-1',
    title: '赛事政策与规则 · 规则库与评分标准解读',
    time: '刚刚',
    preview: '高教主赛道新农科组 vs 红旅赛道准入边界、双重申报红线与主赛道创意组评分导向精读',
    taskKey: 'task-1',
    taskType: 'policy',
    messages: [
      {
        id: 'msg-1',
        sender: 'coach',
        type: 'text',
        text: '同学你好！我是你的2026中国国际大学生创新大赛AI备赛教练。你可以随时向我提问关于大赛规则、商业计划书润色、PPT逻辑打磨或模拟答辩准备的问题。',
        timestamp: '刚刚'
      }
    ]
  },
  {
    id: 'sess-zy-deep-42',
    title: '【深度调用】BP商业计划书全链路深度体检',
    time: '15分钟前',
    preview: '调用 4.2 深度诊断引擎，6维量化雷达对标国金基准线，逐章排查散户付费漏洞并生成整改待办',
    taskKey: 'task-deep-42-diag',
    taskType: 'bp'
  },
  {
    id: 'sess-zy-deep-43',
    title: '【深度调用】全流程模拟答辩与多考官极限压力训练',
    time: '40分钟前',
    preview: '调用 4.3 答辩引擎，多考官视角极限压力测试，输出连环质询防守复盘与答辩能力雷达',
    taskKey: 'task-deep-43-defense',
    taskType: 'defense'
  },
  {
    id: 'sess-zy-shallow-42',
    title: '【浅度调用】商业计划书商业模式章节原子速诊',
    time: '2小时前',
    preview: '轻量 RPC 调用 4.2 诊断微服务 (sk-bp-diag)，极速剖析第三章散户付费漏洞与合作社分成改进方案',
    taskKey: 'task-shallow-42-chapter',
    taskType: 'writing'
  },
  {
    id: 'sess-zy-shallow-43',
    title: '【浅度调用】考官高频尖锐答辩质询题直出',
    time: '昨天',
    preview: '轻量微服务调用 4.3 出题算子 (sk-defense-grill)，单次全量输出 5 道商业壁垒/产能/落地高频尖锐质询题',
    taskKey: 'task-shallow-43-questions',
    taskType: 'defense'
  },
  {
    id: 'sess-zy-task-3-1',
    title: '金奖标杆拆解 · 近三年乡村振兴金奖共性',
    time: '昨天 15:40',
    preview: '对标近三年全国红旅赛道金奖项目，解构“政府撬动+村集体增收台账+农险兜底”底层范式',
    taskKey: 'task-3-1',
    taskType: 'benchmark'
  },
  {
    id: 'sess-zy-task-3-2',
    title: '竞品与市场调研 · 智慧农业5大痛点与竞品矩阵',
    time: '2天前',
    preview: '梳理大疆、极飞、麦飞竞品生态矩阵，提炼水稻精细化病虫害5大痛点与差异化插件载荷对策',
    taskKey: 'task-3-2',
    taskType: 'market'
  },
  {
    id: 'sess-zy-task-4',
    title: '校内智库 · 厦大双创专属知识库与算力报销',
    time: '3天前',
    preview: '调用厦门大学校本双创专属库，对接信息学院重点实验室算力池、匹配导师与国赛培育报销',
    taskKey: 'task-4',
    taskType: 'knowledge'
  },
  {
    id: 'sess-ppt-gen',
    title: '答辩路演PPT · 视觉逻辑框架与核心图表生成',
    time: '4天前',
    preview: '自动解构15页金奖路演PPT叙事架构，提供视觉图表与演练重点标记',
    taskType: 'ppt'
  },
  {
    id: 'sess-init-2',
    title: '商业计划书执行摘要逻辑优化与价值主张提炼',
    time: '5天前',
    preview: '用三句话讲清楚：痛点真实性、技术壁垒不可替代性，以及商业化落地验证',
    taskType: 'bp'
  }
];

export const initialProjectSpaces: ProjectSpace[] = [
  {
    id: 'sp-zhiyun',
    name: '智耘农业',
    trackTag: '高教主赛道 · 新农科组',
    school: '厦门大学',
    leader: '林小满',
    stage: 'L3',
    icon: '🌾',
    workspace: {
      localPath: '~/Workspaces/智耘农业-2026/',
      cloudBucket: 'oss://innov-cloud/spaces/sp-zhiyun/',
      cloudSyncStatus: 'synced',
      lastSyncTime: '刚刚',
      totalFiles: 8,
      syncRate: '100% 同步'
    },
    sessions: [
      {
        id: 'sess-zy-task-1',
        title: '赛事政策与规则 · 规则库与评分标准解读',
        time: '刚刚',
        preview: '高教主赛道新农科组 vs 红旅赛道准入边界、双重申报红线与主赛道创意组评分导向精读',
        taskKey: 'task-1'
      },
      {
        id: 'sess-zy-deep-42',
        title: '【深度调用】BP商业计划书全链路深度体检',
        time: '15分钟前',
        preview: '调用 4.2 深度诊断引擎，6维量化雷达对标国金基准线，逐章排查散户付费漏洞并生成整改待办',
        taskKey: 'task-deep-42-diag'
      },
      {
        id: 'sess-zy-deep-43',
        title: '【深度调用】全流程模拟答辩与多考官极限压力训练',
        time: '40分钟前',
        preview: '调用 4.3 答辩引擎，多考官视角极限压力测试，输出连环质询防守复盘与答辩能力雷达',
        taskKey: 'task-deep-43-defense'
      },
      {
        id: 'sess-zy-shallow-42',
        title: '【浅度调用】商业计划书商业模式章节原子速诊',
        time: '2小时前',
        preview: '轻量 RPC 调用 4.2 诊断微服务 (sk-bp-diag)，极速剖析第三章散户付费漏洞与合作社分成改进方案',
        taskKey: 'task-shallow-42-chapter'
      },
      {
        id: 'sess-zy-shallow-43',
        title: '【浅度调用】考官高频尖锐答辩质询题直出',
        time: '昨天',
        preview: '轻量微服务调用 4.3 出题算子 (sk-defense-grill)，单次全量输出 5 道商业壁垒/产能/落地高频尖锐质询题',
        taskKey: 'task-shallow-43-questions'
      },
      {
        id: 'sess-zy-task-3-1',
        title: '金奖标杆拆解 · 近三年乡村振兴金奖共性',
        time: '昨天 15:40',
        preview: '对标近三年全国红旅赛道金奖项目，解构“政府撬动+村集体增收台账+农险兜底”底层范式',
        taskKey: 'task-3-1'
      },
      {
        id: 'sess-zy-task-3-2',
        title: '竞品与市场调研 · 智慧农业5大痛点与竞品矩阵',
        time: '2天前',
        preview: '梳理大疆、极飞、麦飞竞品生态矩阵，提炼水稻精细化病虫害5大痛点与差异化插件载荷对策',
        taskKey: 'task-3-2'
      },
      {
        id: 'sess-zy-task-4',
        title: '校内智库 · 厦大双创专属知识库与算力报销',
        time: '3天前',
        preview: '调用厦门大学校本双创专属库，对接信息学院重点实验室算力池、匹配导师与国赛培育报销',
        taskKey: 'task-4'
      }
    ],
    activeSessionId: 'sess-zy-task-1'
  }
];
