/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoachSession {
  id: string;
  title: string;
  time: string;
  preview?: string;
  messageCount?: number;
}

export interface CoachSpace {
  id: string;
  name: string;
  trackTag: string;
  leader: string;
  school: string;
  localDirectory: string;
  cloudUri: string;
  cloudStatus: 'synced' | 'syncing' | 'offline';
  cloudStatusText: string;
  lastSyncTime: string;
  activeSessionId: string;
  sessions: CoachSession[];
}

export const defaultSpaces: CoachSpace[] = [
  {
    id: 'space-zhiyun',
    name: '智耘农业',
    trackTag: '高教主赛道 · 新农科组',
    leader: '林小满',
    school: '厦门大学',
    localDirectory: '~/Workspaces/智耘农业-2026/',
    cloudUri: 'cloud://spaces/zhiyun-agri-v2',
    cloudStatus: 'synced',
    cloudStatusText: '已实时同步',
    lastSyncTime: '刚刚',
    activeSessionId: 'sess-1',
    sessions: [
      {
        id: 'sess-1',
        title: '智耘农业 · 国赛冲刺与模式复盘',
        time: '刚刚',
        preview: '商业模式由散户收费转型为合作社托管+农险分成...',
        messageCount: 14,
      },
      {
        id: 'sess-2',
        title: '高教主赛道 vs 红旅申报条件对比',
        time: '昨天',
        preview: '红旅青年红色筑梦之旅更强调公益扶贫与高校定点帮扶...',
        messageCount: 8,
      },
      {
        id: 'sess-3',
        title: '建瓯吉安增收盲测台账与农险分成',
        time: '3天前',
        preview: '在答辩前 10 秒抛出建瓯两季 1.8 万亩实测数据...',
        messageCount: 11,
      },
      {
        id: 'sess-4',
        title: '厦大信息学院低空光谱算子对接',
        time: '5天前',
        preview: '联合张林教授实验室引入病理光谱反演迁移学习...',
        messageCount: 6,
      },
    ],
  },
  {
    id: 'space-shengwen',
    name: '声纹智医',
    trackTag: '产业命题赛道 · 医疗器械组',
    leader: '张铭哲',
    school: '浙江大学',
    localDirectory: '~/Workspaces/声纹智医-AI早筛/',
    cloudUri: 'cloud://spaces/shengwen-med-ai',
    cloudStatus: 'synced',
    cloudStatusText: '已同步云端',
    lastSyncTime: '15分钟前',
    activeSessionId: 'sess-201',
    sessions: [
      {
        id: 'sess-201',
        title: '呼吸音早筛多中心临床试验与伦理合规',
        time: '昨天',
        preview: '需补充华东医院等三家三甲医院的 IRB 书面伦理批件...',
        messageCount: 9,
      },
      {
        id: 'sess-202',
        title: '医保DRG付费结算与二类医疗器械注册',
        time: '4天前',
        preview: '探讨院端独立编码收费与耗材打包计费的可行性路径...',
        messageCount: 12,
      },
      {
        id: 'sess-203',
        title: '评委追问：假阳性率法律风险界定模拟',
        time: '1周前',
        preview: '资深投资人评委围绕 AI 辅助诊断法律责任的追问演练...',
        messageCount: 7,
      },
    ],
  },
];
