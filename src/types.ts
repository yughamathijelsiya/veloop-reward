export type LevelStatus = 'COMPLETED' | 'CURRENT' | 'NEXT' | 'LOCKED';

export interface LevelInfo {
  level: number;
  name: string;
  xpRequired: number;
  rewardVes: number;
  rewardTitle: string;
  status: LevelStatus;
  perks: string[];
  description: string;
  guardianSuitStage: string;
}

export interface UserProgress {
  currentLevel: number;
  levelName: string;
  currentXp: number;
  nextLevelXp: number;
  vesBalance: number;
  streakDays: number;
  streakClaimedToday: boolean;
  dailyChallengeCompleted: boolean;
  referralCode: string;
  referralsCount: number;
  completedGamesCount: number;
}

export interface MiniGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: number; // 1 to 5
  rewardXp: number;
  rewardVesBonus?: number;
  category: string;
  badge: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  source: string;
  xp: number;
  ves?: number;
  timestamp: string;
  iconType: 'game' | 'daily' | 'streak' | 'referral' | 'level_up' | 'mission';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardVes?: number;
  status: 'AVAILABLE' | 'COMPLETED' | 'COMING_SOON';
  progress?: number;
  maxProgress?: number;
  badge: string;
}
