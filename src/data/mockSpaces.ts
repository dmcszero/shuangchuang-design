/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectSpace } from '../types';

export const initialSpaces: ProjectSpace[] = [
  {
    id: 'space-zhiyun',
    name: '智耘农业',
    trackTag: '高教主赛道 · 新农科组',
    school: '厦门大学',
    leader: '林小满',
    stage: 'L3',
    icon: '🌾',
    workspace: {
      localPath: '~/Workspaces/智耘农业-2026/',
      cloudBucket: 'cloud://spaces/zhiyun-agri-v2',
      cloudSyncStatus: 'synced',
      syncRate: '100% 同步',
      lastSyncTime: '刚刚',
      totalFiles: 6,
    },
    activeSessionId: 'sess-1',
    sessions: [
      {
        id: 'sess-1',
        title: '智耘农业 · 国赛冲刺与商业模式诊断',
        time: '50分钟前',
        preview: '执行 6 维多因子综合诊断，重构商业模式与合作社托管',
        active: true,
      },
      {
        id: 'sess-2',
        title: '高教主赛道 vs 红旅申报条件对比',
        time: '昨天',
        preview: '近三年红旅赛道与新农科组国金案例三大商业共性',
        active: false,
      },
      {
        id: 'sess-3',
        title: '建瓯吉安增收盲测台账与农险分成',
        time: '3天前',
        preview: '在答辩前 10 秒抛出建瓯、吉安两季 1.8 万亩增收盲测台账',
        active: false,
      },
      {
        id: 'sess-4',
        title: '厦大信息学院低空多光谱算子对接',
        time: '5天前',
        preview: '对接厦大信息学院张林教授团队低空多光谱算子',
        active: false,
      },
    ],
  },
  {
    id: 'space-zhiyi',
    name: '声纹智医',
    trackTag: '产业命题赛道 · 医疗器械组',
    school: '浙江大学',
    leader: '张铭哲',
    stage: 'L2',
    icon: '🩺',
    workspace: {
      localPath: '~/Workspaces/声纹智医-AI早筛/',
      cloudBucket: 'cloud://spaces/shengwen-med-ai',
      cloudSyncStatus: 'synced',
      syncRate: '100% 同步',
      lastSyncTime: '15分钟前',
      totalFiles: 4,
    },
    activeSessionId: 'sess-103',
    sessions: [
      {
        id: 'sess-103',
        title: '医保DRG付费结算与二类器械注册',
        time: '昨天',
        preview: '探讨院端独立编码收费与耗材打包计费的可行性路径',
        active: true,
      },
      {
        id: 'sess-sw-1',
        title: '三甲医院多中心临床双盲试验方案',
        time: '2天前',
        preview: '核查临床试验伦理委员会批件与入组数据脱敏规范',
        active: false,
      },
      {
        id: 'sess-sw-2',
        title: '声纹生物标志物早筛商业模式落地',
        time: '4天前',
        preview: '社区卫生中心与体检机构云端按次分润模式',
        active: false,
      },
    ],
  },
];
