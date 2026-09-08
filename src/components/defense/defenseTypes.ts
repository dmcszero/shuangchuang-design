import { LucideIcon } from 'lucide-react';

export type TrainingMode = 'standard' | 'elevator' | 'followup' | 'weakness' | 'adversarial';

export interface DefenseProject {
  id: string;
  name: string;
  track: string;
  summary: string;
  tags: string[];
  isCurrentProject?: boolean;
}

export interface ModeDef {
  id: TrainingMode;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  tags: string[];
  badge?: string;
}

export interface DefenseMessage {
  id: string;
  role: 'judge' | 'user';
  content: string;
  time?: number; // seconds spent
  tag?: string;
}

export interface DimensionScore {
  label: string;
  value: number;
  color: string;
  comment?: string;
}

export interface DefenseSessionConfig {
  judgeMode: 'single' | 'panel';
  difficulty: 'friendly' | 'standard' | 'high_pressure';
  rounds: 'unlimited' | '3' | '5' | '8';
  timeLimit: number; // 60, 90, 120
  elevatorDuration?: '1min' | '3min';
}

export interface DefenseHistoryItem {
  id: string;
  modeId: TrainingMode;
  modeName: string;
  projectId: string;
  projectName: string;
  status: '进行中' | '已结束';
  stats: string;
  score?: number;
  date: string;
}
