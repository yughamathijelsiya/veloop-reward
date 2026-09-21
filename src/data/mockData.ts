import { LevelInfo, MiniGame, Mission, ActivityItem, UserProgress } from '../types';

export const LEVELS_DATA: LevelInfo[] = [
  {
    level: 1,
    name: 'Cadet',
    xpRequired: 1000,
    rewardVes: 100,
    rewardTitle: 'Cadet Welcome Stash',
    status: 'COMPLETED',
    perks: ['Platform Access', 'Standard XP Rates', 'Basic Guardian Suit'],
    description: 'Initial onboarding tier establishing baseline VELOOP reward eligibility.',
    guardianSuitStage: 'Standard Cadet Suit'
  },
  {
    level: 2,
    name: 'Initiate',
    xpRequired: 2500,
    rewardVes: 200,
    rewardTitle: 'Initiate Vault Capsule',
    status: 'COMPLETED',
    perks: ['+5% Challenge Bonus', 'Daily Streak Tracker', 'Suit Reinforcements'],
    description: 'Proven engagement across VELOOP missions with unlocked daily streaks.',
    guardianSuitStage: 'Reinforced Plating'
  },
  {
    level: 3,
    name: 'Voyager',
    xpRequired: 4500,
    rewardVes: 350,
    rewardTitle: 'Voyager Reward Chest',
    status: 'COMPLETED',
    perks: ['+10% Mini-Game Multiplier', 'Weekly Bonus Quests', 'Premium Accessories'],
    description: 'Consistent participant across all VELOOP challenges and referral channels.',
    guardianSuitStage: 'Aero-Luminescent Trim'
  },
  {
    level: 4,
    name: 'Explorer',
    xpRequired: 8000,
    rewardVes: 500,
    rewardTitle: 'Explorer Executive Cache',
    status: 'CURRENT',
    perks: ['+15% Mini-Game XP Multiplier', 'Priority Quest Allocation', 'Enhanced Energy Trails'],
    description: 'Current standing: Elite velocity across VELOOP Reward City with advanced skill unlocks.',
    guardianSuitStage: 'Level 04 Enhanced XP Suit'
  },
  {
    level: 5,
    name: 'Guardian',
    xpRequired: 12500,
    rewardVes: 500,
    rewardTitle: 'Guardian Master Vault',
    status: 'NEXT',
    perks: ['500 VEs Instant Unlock', 'Exclusive Guardian Runner Skin', '+25% Global XP Acceleration'],
    description: 'Next milestone: Reach 8,000 XP to unlock the 500 VEs Vault and Tier 5 Guardian armor.',
    guardianSuitStage: 'Titanium Gold Guardian Suit'
  },
  {
    level: 6,
    name: 'Elite',
    xpRequired: 18000,
    rewardVes: 1000,
    rewardTitle: 'Elite Prestige Stash',
    status: 'LOCKED',
    perks: ['VIP Reward Redemption Portal', '+35% XP Boost', 'Dual Thruster Auras'],
    description: 'Top-tier rewards allocation tier reserved for seasoned VELOOP veterans.',
    guardianSuitStage: 'Obsidian Kinetic Armor'
  },
  {
    level: 7,
    name: 'Master',
    xpRequired: 25000,
    rewardVes: 2500,
    rewardTitle: 'VELOOP Apex Treasury',
    status: 'LOCKED',
    perks: ['Maximum 50% XP Boost', 'Annual Exclusive Rewards', 'Legendary Golden Visor'],
    description: 'The pinnacle of VELOOP progression with permanent institutional rewards status.',
    guardianSuitStage: 'Apex Crown Exosuit'
  },
];

export const MINI_GAMES: MiniGame[] = [
  {
    id: 'guardian-run',
    title: 'VELOOP GUARDIAN RUN',
    subtitle: 'Endless Skill Challenge',
    description: 'Control the Guardian Runner through VELOOP Reward City. Switch lanes, jump barriers, and collect VE coins.',
    difficulty: 3,
    rewardXp: 25,
    rewardVesBonus: 5,
    category: 'Endless Runner',
    badge: 'FEATURED'
  },
  {
    id: 'coin-catch',
    title: 'VE COIN CATCH',
    subtitle: 'Reflex & Precision',
    description: '20-second skill challenge. Catch falling VE coins and XP orbs with your VELOOP collector while dodging hazard glitches.',
    difficulty: 2,
    rewardXp: 25,
    category: 'Action Arcade',
    badge: 'FAST PACED'
  },
  {
    id: 'reward-match',
    title: 'REWARD MATCH',
    subtitle: 'Memory Pairs',
    description: 'Flip elegant reward cards and pair identical VELOOP assets under the timer for combo XP points.',
    difficulty: 3,
    rewardXp: 25,
    category: 'Memory & Focus',
    badge: 'BRAIN SHARP'
  },
  {
    id: 'xp-sprint',
    title: 'XP SPRINT',
    subtitle: 'Speed & Reaction',
    description: 'High-speed reaction challenge. Tap pulsing XP nodes as they materialize across the grid before they dissipate.',
    difficulty: 4,
    rewardXp: 25,
    category: 'Speed Tap',
    badge: 'COMBO BOOST'
  },
  {
    id: 'reward-hunt',
    title: 'REWARD HUNT',
    subtitle: 'Exploration & Discovery',
    description: 'Examine the futuristic VELOOP scene to locate 3 hidden caches containing VE coins, XP nodes, and badges.',
    difficulty: 2,
    rewardXp: 25,
    rewardVesBonus: 10,
    category: 'Exploration',
    badge: 'EXPLORER'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'daily-challenge',
    title: 'Daily Protocol Check-in',
    description: 'Verify your daily security handshake to maintain streak integrity and claim tier XP.',
    rewardXp: 50,
    rewardVes: 10,
    status: 'AVAILABLE',
    badge: 'DAILY'
  },
  {
    id: 'play-earn',
    title: 'Play & Earn Mastery',
    description: 'Score at least 150 points across any VELOOP mini-game challenge today.',
    rewardXp: 25,
    progress: 1,
    maxProgress: 1,
    status: 'AVAILABLE',
    badge: 'GAME'
  },
  {
    id: 'referral-mission',
    title: 'Network Referral Program',
    description: 'Share your exclusive VELOOP invite code with peers to unlock mutual rewards upon verification.',
    rewardXp: 100,
    rewardVes: 50,
    status: 'AVAILABLE',
    badge: 'NETWORK'
  },
  {
    id: 'streak-xp',
    title: '5-Day Velocity Streak',
    description: 'Log in and interact with VELOOP rewards 5 days consecutively.',
    rewardXp: 30,
    progress: 5,
    maxProgress: 7,
    status: 'AVAILABLE',
    badge: 'STREAK'
  },
  {
    id: 'bonus-mission',
    title: 'VELOOP Partner Liquidity Link',
    description: 'Connect verified merchant checkout methods to claim elevated transaction multipliers.',
    rewardXp: 200,
    rewardVes: 100,
    status: 'COMING_SOON',
    badge: 'EXPANSION'
  },
  {
    id: 'watch-earn',
    title: 'Product Briefing & Insights',
    description: 'Preview upcoming VELOOP ecosystem releases and platform intelligence updates.',
    rewardXp: 75,
    status: 'COMING_SOON',
    badge: 'LEARNING'
  }
];

export const INITIAL_USER_PROGRESS: UserProgress = {
  currentLevel: 4,
  levelName: 'Explorer',
  currentXp: 7200,
  nextLevelXp: 8000,
  vesBalance: 1450,
  streakDays: 5,
  streakClaimedToday: false,
  dailyChallengeCompleted: false,
  referralCode: 'VELOOP-EXP-442',
  referralsCount: 4,
  completedGamesCount: 18,
};

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Daily Challenge Complete',
    source: 'Daily Protocol',
    xp: 50,
    ves: 10,
    timestamp: '12m ago',
    iconType: 'daily'
  },
  {
    id: 'act-2',
    title: 'VELOOP Guardian Run',
    source: 'Mini-Game Hub',
    xp: 25,
    timestamp: '48m ago',
    iconType: 'game'
  },
  {
    id: 'act-3',
    title: 'Peer Invite Verified',
    source: 'Network Referral',
    xp: 100,
    ves: 20,
    timestamp: '3h ago',
    iconType: 'referral'
  },
  {
    id: 'act-4',
    title: '4-Day Streak Bonus',
    source: 'Streak Tracker',
    xp: 30,
    timestamp: 'Yesterday',
    iconType: 'streak'
  }
];
