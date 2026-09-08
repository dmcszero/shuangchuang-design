/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExpertAgent, CoachSkillDef, McpConnectorDef, RecommendedTaskDef } from '../types';

export const EXPERT_AGENTS: ExpertAgent[] = [
  {
    id: 'policy',
    name: '赛事政策与规则专家',
    avatar: '📜',
    badge: '4.1 政策引擎',
    role: '政策百事通 · 多级规则与资格审查',
    description: '涵盖国赛、省赛、校赛官方正式文件与评审细则，精准解读赛道划分准入、材料规范及评分标准。',
    recommendedFor: '赛道划分 / 参赛资格 / 评审规则解读 / 评分标准对齐',
    builtinSkills: [
      { id: 'sk-policy-rules', name: '多级赛事规则与赛道准入', icon: '⚖️', description: '核查资格、赛道划分及材料合规' },
      { id: 'sk-rubric-interpret', name: '评审标准与导向精读', icon: '📋', description: '拆解关注要点与财务预测规范' }
    ],
    builtinConnectors: [
      { id: 'mcp-rules-reg', name: '官方政策规则库 MCP', icon: '📜', recordsCount: '国/省/校三级最新章程' },
      { id: 'mcp-expert-exp', name: '评审专家经验库 MCP', icon: '🧠', recordsCount: '1,420+ 评审打分偏好' }
    ]
  },
  {
    id: 'diagnosis',
    name: '商业计划与模式诊断专家',
    avatar: '🎯',
    badge: '4.2 诊断引擎',
    role: '金牌备赛教练 · BP深度体检与壁垒提炼',
    description: '负责商业计划书与路演PPT穿透式诊断、六维量化雷达打分、核心创新点提炼及竞争壁垒构建。',
    recommendedFor: 'BP/PPT诊断 / 逻辑漏洞修复 / 创新点提炼 / 竞争护城河',
    builtinSkills: [
      { id: 'sk-bp-diag', name: 'BP/PPT 穿透诊断与逻辑体检', icon: '📊', description: '排查商业逻辑漏洞并优化前三页' },
      { id: 'sk-innovation-moat', name: '创新点提炼与壁垒护城河', icon: '🛡️', description: '提炼硬核创新点与独家商业壁垒' }
    ],
    builtinConnectors: [
      { id: 'mcp-expert-exp', name: '评审专家经验库 MCP', icon: '🧠', recordsCount: '1,420+ 评审打分偏好' },
      { id: 'mcp-history-cases', name: '金奖标杆案例库 MCP', icon: '🏆', recordsCount: '320+ 全国金奖全景案卷' },
      { id: 'mcp-industry-intel', name: '产业与竞品情报 MCP', icon: '🌐', recordsCount: '实时企业库与行研报告' }
    ]
  },
  {
    id: 'defense',
    name: '路演答辩与模拟专家',
    avatar: '🎙️',
    badge: '4.3 答辩引擎',
    role: '金牌备赛教练 · 评委模拟与压力质询',
    description: '配置严苛投资人、高校学术权威等多重考官人设，提供1分钟开场白重构、财务极限施压与抗辩复盘。',
    recommendedFor: '模拟答辩 / 压力测试 / 开场白优化 / 尖锐问题防守',
    builtinSkills: [
      { id: 'sk-defense-grill', name: '路演答辩与极限压力测试', icon: '🎙️', description: '多考官连环发问与1分钟开场白重构' }
    ],
    builtinConnectors: [
      { id: 'mcp-expert-exp', name: '评审专家经验库 MCP', icon: '🧠', recordsCount: '1,420+ 评审打分偏好' },
      { id: 'mcp-history-cases', name: '金奖标杆案例库 MCP', icon: '🏆', recordsCount: '320+ 全国金奖全景案卷' }
    ]
  },
  {
    id: 'intel',
    name: '行业情报与对标专家',
    avatar: '🔍',
    badge: '4.4&4.5 情报局',
    role: '行业情报局 · 金奖案例与竞品全景',
    description: '拆解近三年全国金奖标杆案例底层商业模式，开展多维竞品矩阵、痛点穿透与投融资情报深度研判。',
    recommendedFor: '历史金奖共性 / 标杆拆解 / 竞品调研 / 行业痛点挖掘',
    builtinSkills: [
      { id: 'sk-gold-cases', name: '近三年标杆金奖案例拆解', icon: '🏆', description: '拆解历年全国金奖项目商业模式共性' },
      { id: 'sk-competitor', name: '竞品调研与行业痛点分析', icon: '🔍', description: '竞品差异化生态定位与痛点解决措施' }
    ],
    builtinConnectors: [
      { id: 'mcp-history-cases', name: '金奖标杆案例库 MCP', icon: '🏆', recordsCount: '320+ 全国金奖全景案卷' },
      { id: 'mcp-industry-intel', name: '产业与竞品情报 MCP', icon: '🌐', recordsCount: '实时企业库与行研报告' }
    ]
  },
  {
    id: 'campus',
    name: '校内双创与智库专家',
    avatar: '🏛️',
    badge: '4.6 校内智库',
    role: '校内智库 · 校本专属知识库与资源匹配',
    description: '直连本校双创学院专属知识库，匹配校内导师、重点实验室算力池、专项扶持资金及极速报销通道。',
    recommendedFor: '校本专属库 / 导师匹配 / 实验室对接 / 资助报销',
    builtinSkills: [
      { id: 'sk-campus', name: '校本专属智库与双创资源', icon: '🏛️', description: '调用特色赛道、校内导师与报销流程' }
    ],
    builtinConnectors: [
      { id: 'mcp-campus-repo', name: '高校校本智库 MCP', icon: '🏛️', recordsCount: '本校专属双创资源资产' }
    ]
  }
];

export const COACH_SKILLS: CoachSkillDef[] = [
  // 1. 政策百事通
  {
    id: 'sk-policy-rules',
    name: '多级赛事规则与赛道准入',
    icon: '⚖️',
    engine: '4.1 政策引擎',
    description: '核查国赛/省赛/校赛参赛资格、赛道划分（主赛道/红旅/产业）及材料合规',
    defaultActive: true
  },
  {
    id: 'sk-rubric-interpret',
    name: '评审标准与导向精读',
    icon: '📋',
    engine: '4.1 政策引擎',
    description: '将厚重评分细则转化为通俗问答，拆解主赛道/创意组关注要点与财务预测规范',
    defaultActive: true
  },

  // 2. 金牌备赛教练 (BP/创新壁垒/答辩)
  {
    id: 'sk-bp-diag',
    name: 'BP/PPT 穿透诊断与逻辑体检',
    icon: '📊',
    engine: '4.2 诊断引擎',
    description: '结合金奖案例体检商业计划书，排查市场逻辑漏洞、前后矛盾并优化前三页吸睛度',
    defaultActive: true
  },
  {
    id: 'sk-innovation-moat',
    name: '创新点提炼与壁垒护城河',
    icon: '🛡️',
    engine: '4.2 诊断引擎',
    description: '破除“技术自嗨”与“伪需求”，提炼打动评委的硬核创新点与独家商业壁垒',
    defaultActive: true
  },
  {
    id: 'sk-defense-grill',
    name: '路演答辩与极限压力测试',
    icon: '🎙️',
    engine: '4.3 答辩引擎',
    description: '多考官人设连环发问，提供尖锐财务问题防守、1分钟开场白黄金话术优化',
    defaultActive: true
  },

  // 3. 行业情报局
  {
    id: 'sk-gold-cases',
    name: '近三年标杆金奖案例拆解',
    icon: '🏆',
    engine: '4.4 案例智库',
    description: '拆解历年全国金奖项目商业模式共性，对比红旅乡村振兴/产业赛道底层范式',
    defaultActive: true
  },
  {
    id: 'sk-competitor',
    name: '竞品调研与行业痛点分析',
    icon: '🔍',
    engine: '4.5 产业智库',
    description: '辅助团队开展行业数据搜集、竞品差异化生态定位与5大核心痛点解决方案',
    defaultActive: true
  },

  // 4. 校内智库
  {
    id: 'sk-campus',
    name: '校本专属智库与双创资源',
    icon: '🏛️',
    engine: '4.6 校内智库',
    description: '调用本校双创学院特色赛道、校内导师研究方向、往届获奖库及报销审批流程',
    defaultActive: true
  }
];

export const MCP_CONNECTORS: McpConnectorDef[] = [
  {
    id: 'mcp-rules-reg',
    name: '官方政策规则库 MCP',
    icon: '📜',
    endpoint: 'mcp://registry/cwec-official-rules',
    recordsCount: '国/省/校三级最新章程',
    status: 'connected',
    description: '收录教育部及组委会最新官方文件、各赛道参赛资格细则、评审标准打分表与规程红线',
    defaultActive: true
  },
  {
    id: 'mcp-expert-exp',
    name: '评审专家经验库 MCP',
    icon: '🧠',
    endpoint: 'mcp://knowledge/expert-heuristics',
    recordsCount: '1,420+ 评审打分偏好',
    status: 'connected',
    description: '沉淀百位国赛/省赛评委的真实打分偏好、常见失分暗坑、高频质询问题及答辩防守技巧',
    defaultActive: true
  },
  {
    id: 'mcp-history-cases',
    name: '金奖标杆案例库 MCP',
    icon: '🏆',
    endpoint: 'mcp://database/gold-silver-cases',
    recordsCount: '320+ 全国金奖全景案卷',
    status: 'connected',
    description: '涵盖近三年高教主赛道、红旅、产业赛道金奖BP脱敏文本、答辩录音与商业模式提炼',
    defaultActive: true
  },
  {
    id: 'mcp-industry-intel',
    name: '产业与竞品情报 MCP',
    icon: '🌐',
    endpoint: 'mcp://market/industry-intel-live',
    recordsCount: '实时企业库与行研报告',
    status: 'connected',
    description: '检索赛道头部竞品矩阵、投融资历史、市场痛点数据与产业链上中下游生态图谱',
    defaultActive: true
  },
  {
    id: 'mcp-campus-repo',
    name: '高校校本智库 MCP',
    icon: '🏛️',
    endpoint: 'mcp://university/campus-private-kb',
    recordsCount: '本校专属双创资源资产',
    status: 'connected',
    description: '支持各高校自主建库、动态完善与学生调用，涵盖特色赛道指引、校内导师、扶持经费与报销流程',
    defaultActive: true
  }
];

export const RECOMMENDED_TASKS: RecommendedTaskDef[] = [
  // ⭐ 核心演示 1: 4.2 深度调用起始 Prompt (完整项目诊断)
  {
    id: 'task-deep-42-diag',
    name: '【深度调用 4.2】完整项目诊断',
    icon: '🚀',
    prompt: '帮我完整诊断项目，开启 4.2 全链路智能指导与商业模式深度体检',
    agentId: 'diagnosis',
    skills: ['sk-bp-diag', 'sk-innovation-moat'],
    mcps: ['mcp-expert-exp', 'mcp-history-cases'],
    tag: '深度·4.2诊断',
    taskCategory: '深度调用 4.2'
  },

  // ⭐ 核心演示 2: 4.3 深度调用起始 Prompt (模拟答辩训练)
  {
    id: 'task-deep-43-defense',
    name: '【深度调用 4.3】全流程模拟答辩',
    icon: '🎙️',
    prompt: '帮我开启全流程模拟答辩，跳转 4.3 模拟评审与多考官极限压力训练',
    agentId: 'defense',
    skills: ['sk-defense-grill'],
    mcps: ['mcp-expert-exp'],
    tag: '深度·4.3答辩',
    taskCategory: '深度调用 4.3'
  },

  // ⚡ 浅度调用 1: 4.3 原子能力——出 5 道答辩题
  {
    id: 'task-shallow-43-questions',
    name: '【浅度调用 4.3】出 5 道答辩题',
    icon: '⚡',
    prompt: '帮我出 5 道答辩题，重点针对市场商业模式和财务真实性的尖锐质询',
    agentId: 'defense',
    skills: ['sk-defense-grill'],
    mcps: ['mcp-expert-exp'],
    tag: '浅度·4.3出题',
    taskCategory: '浅度调用 4.3'
  },

  // ⚡ 浅度调用 2: 4.2 原子能力——BP 商业模式章节速诊
  {
    id: 'task-shallow-42-chapter',
    name: '【浅度调用 4.2】BP商业模式速诊',
    icon: '📑',
    prompt: '帮我诊断 BP 商业模式章节，分析付费主体与现金流闭环是否存在逻辑漏洞',
    agentId: 'diagnosis',
    skills: ['sk-bp-diag'],
    mcps: ['mcp-expert-exp'],
    tag: '浅度·4.2章节',
    taskCategory: '浅度调用 4.2'
  },

  // ⚡ 浅度调用 3: 4.2 原子能力——技术壁垒与评分速查
  {
    id: 'task-shallow-42-moat',
    name: '【浅度调用 4.2】技术壁垒评分核查',
    icon: '🛡️',
    prompt: '帮我核查技术创新壁垒与评分维度，避免“技术自嗨”并对标国赛金奖评分线',
    agentId: 'diagnosis',
    skills: ['sk-innovation-moat'],
    mcps: ['mcp-expert-exp', 'mcp-industry-intel'],
    tag: '浅度·4.2壁垒',
    taskCategory: '浅度调用 4.2'
  },

  // 1. 赛事政策与规则精准查询 ("政策百事通")
  {
    id: 'task-policy-track',
    name: '多级规则与赛道划分',
    icon: '⚖️',
    prompt: '我的项目能报哪个赛道？高教主赛道与红旅赛道有什么区别，两个能同时报吗？',
    agentId: 'policy',
    skills: ['sk-policy-rules'],
    mcps: ['mcp-rules-reg'],
    tag: '政策百事通',
    taskCategory: '1. 赛事政策与规则'
  },
  {
    id: 'task-policy-rubric',
    name: '评分标准与财务导向',
    icon: '📋',
    prompt: '我的项目属于主赛道创意组，评委最看重什么？财务预测要注意哪几个方面？',
    agentId: 'policy',
    skills: ['sk-rubric-interpret'],
    mcps: ['mcp-rules-reg', 'mcp-expert-exp'],
    tag: '评分标准',
    taskCategory: '1. 赛事政策与规则'
  },

  // 3. 标杆案例与竞品
  {
    id: 'task-gold-benchmark',
    name: '近三年金奖案例共性拆解',
    icon: '🏆',
    prompt: '近三年国赛金奖项目中，与我们赛道相关的优秀项目在商业模式与落地闭环上都有哪些共性？',
    agentId: 'intel',
    skills: ['sk-gold-cases'],
    mcps: ['mcp-history-cases'],
    tag: '标杆案例',
    taskCategory: '3.1 标杆案例拆解'
  },
  {
    id: 'task-competitor-intel',
    name: '竞品调研与痛点剖析',
    icon: '🔍',
    prompt: '帮我系统梳理当前赛道的主要竞品矩阵，并列出行业5个主要痛点及对应的穿透解决措施',
    agentId: 'intel',
    skills: ['sk-competitor'],
    mcps: ['mcp-industry-intel'],
    tag: '竞品调研',
    taskCategory: '3.2 竞品与调研'
  },

  // 4. 校内专属智库
  {
    id: 'task-campus-kb',
    name: '校内专属智库与扶持报销',
    icon: '🏛️',
    prompt: '调用本校双创专属知识库，查询本校特色赛道政策、校内导师研究方向与经费报销审批流程',
    agentId: 'campus',
    skills: ['sk-campus'],
    mcps: ['mcp-campus-repo'],
    tag: '校内智库',
    taskCategory: '4. 校本专属知识库'
  }
];
