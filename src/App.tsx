import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { LevelHero } from './components/LevelHero';
import { QuickActionAndRecommendation } from './components/QuickActionAndRecommendation';
import { LevelRoadmap } from './components/LevelRoadmap';
import { GuardianCharacterShowcase } from './components/GuardianCharacterShowcase';
import { PlayAndEarn } from './components/PlayAndEarn';
import { EarnMoreXp } from './components/EarnMoreXp';
import { XpActivityFeed } from './components/XpActivityFeed';
import { Footer } from './components/Footer';
import { LevelUpCelebrationModal } from './components/LevelUpCelebrationModal';

// Mini-game modals
import { GuardianRunGame } from './components/games/GuardianRunGame';
import { CoinCatchGame } from './components/games/CoinCatchGame';
import { RewardMatchGame } from './components/games/RewardMatchGame';
import { XpSprintGame } from './components/games/XpSprintGame';
import { RewardHuntGame } from './components/games/RewardHuntGame';

import {
  INITIAL_USER_PROGRESS,
  LEVELS_DATA,
  MINI_GAMES,
  INITIAL_MISSIONS,
  INITIAL_ACTIVITIES,
} from './data/mockData';
import { UserProgress, ActivityItem } from './types';
import { sounds } from './utils/sound';

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_USER_PROGRESS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [unlockedInfo, setUnlockedInfo] = useState({
    level: 5,
    name: 'Guardian',
    rewardVes: 500,
  });
  const [toast, setToast] = useState<{ message: string; sub?: string } | null>(null);

  const showToast = (message: string, sub?: string) => {
    setToast({ message, sub });
    setTimeout(() => setToast(null), 3200);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.toggle();
    if (next) sounds.playTap();
  };

  const handleResetDemo = () => {
    setUserProgress(INITIAL_USER_PROGRESS);
    setActivities(INITIAL_ACTIVITIES);
    sounds.playTap();
    showToast('Demo State Reset', 'Level 04 Explorer restored');
  };

  // Add XP with automatic Level-Up checking
  const addXp = (
    amount: number,
    sourceTitle: string,
    iconType: ActivityItem['iconType'],
    vesBonus = 0
  ) => {
    setUserProgress((prev: UserProgress) => {
      const newXp = prev.currentXp + amount;
      const newVes = prev.vesBalance + vesBonus;

      // Check level up threshold
      if (newXp >= prev.nextLevelXp && prev.currentLevel < 8) {
        const nextLevelNum = prev.currentLevel + 1;
        const nextLevelData = LEVELS_DATA.find((l) => l.level === nextLevelNum);
        const reward = nextLevelData?.rewardVes || 500;
        const nextTargetLevelData = LEVELS_DATA.find((l) => l.level === nextLevelNum + 1);
        const nextTargetXp = nextTargetLevelData ? nextTargetLevelData.xpRequired : 25000;

        setUnlockedInfo({
          level: nextLevelNum,
          name: nextLevelData?.name || 'Guardian',
          rewardVes: reward,
        });

        setLevelUpModalOpen(true);

        // Add level up activity item
        const newAct: ActivityItem = {
          id: `act-${Date.now()}`,
          title: `Unlocked Level ${String(nextLevelNum).padStart(2, '0')}: ${nextLevelData?.name}`,
          source: 'System Milestone',
          xp: amount,
          ves: reward + vesBonus,
          timestamp: 'Just now',
          iconType: 'level_up',
        };
        setActivities((prevActs) => [newAct, ...prevActs]);

        return {
          ...prev,
          currentLevel: nextLevelNum,
          levelName: nextLevelData?.name || 'Guardian',
          currentXp: newXp,
          nextLevelXp: nextTargetXp,
          vesBalance: newVes + reward,
        };
      }

      // Standard XP gain
      showToast(`+${amount} XP Earned!`, sourceTitle);
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        title: sourceTitle,
        source: 'VELOOP Rewards',
        xp: amount,
        ves: vesBonus > 0 ? vesBonus : undefined,
        timestamp: 'Just now',
        iconType,
      };
      setActivities((prevActs) => [newAct, ...prevActs]);

      return {
        ...prev,
        currentXp: newXp,
        vesBalance: newVes,
      };
    });
  };

  // Game completion handler
  const handleGameComplete = (earnedXp: number, score: number) => {
    const game = MINI_GAMES.find((g) => g.id === activeGameId);
    const title = game ? `${game.title} (Score: ${score})` : 'Skill Game Challenge';
    const bonusVes = game?.rewardVesBonus || 0;
    addXp(earnedXp, title, 'game', bonusVes);
  };

  // Daily Challenge Action
  const handleDailyCheckIn = () => {
    if (userProgress.dailyChallengeCompleted) return;
    setUserProgress((prev: UserProgress) => ({ ...prev, dailyChallengeCompleted: true }));
    addXp(50, 'Daily Security Check-In', 'daily', 10);
    sounds.playCoin();
  };

  // Streak Action
  const handleClaimStreak = () => {
    if (userProgress.streakClaimedToday) return;
    setUserProgress((prev: UserProgress) => ({
      ...prev,
      streakClaimedToday: true,
      streakDays: prev.streakDays + 1,
    }));
    addXp(30, '5-Day Velocity Streak Bonus', 'streak');
    sounds.playCoin();
  };

  // Simulate Referral Verification
  const handleSimulateReferral = () => {
    setUserProgress((prev: UserProgress) => ({
      ...prev,
      referralsCount: prev.referralsCount + 1,
    }));
    addXp(100, 'Peer Referral Verified (VELOOP-EXP-442)', 'referral', 50);
    sounds.playCoin();
  };

  // Smooth navigation helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#161827] text-white selection:bg-cyan-500 selection:text-black flex flex-col font-sans">
      {/* Toast Notification for XP gains */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-5 z-50 px-4 py-2.5 rounded-2xl bg-[#14192b]/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <span className="text-xs font-black text-cyan-300 font-mono-numbers block">
                {toast.message}
              </span>
              {toast.sub && <span className="text-[11px] text-slate-400">{toast.sub}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar */}
      <Header
        currentLevel={userProgress.currentLevel}
        levelName={userProgress.levelName}
        currentXp={userProgress.currentXp}
        vesBalance={userProgress.vesBalance}
        onSimulateAddXp={(amount) => addXp(amount, 'Manual XP Calibration', 'daily')}
        onResetDemo={handleResetDemo}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Hub */}
      <main className="flex-1 w-full">
        {/* 2. Level Progression Hero */}
        <div id="level-hero">
          <LevelHero
            currentLevel={userProgress.currentLevel}
            levelName={userProgress.levelName}
            currentXp={userProgress.currentXp}
            nextLevelXp={userProgress.nextLevelXp}
            rewardVes={500}
            onOpenLevelInfo={() => scrollTo('level-roadmap')}
            onOpenRewardInfo={() => scrollTo('level-roadmap')}
            onPlayGamesClick={() => scrollTo('play-and-earn')}
          />
        </div>

        {/* 3. Quick Action & Smart Recommendations */}
        <QuickActionAndRecommendation
          currentXp={userProgress.currentXp}
          nextLevelXp={userProgress.nextLevelXp}
          onPlayClick={() => scrollTo('play-and-earn')}
          onDailyClick={handleDailyCheckIn}
          onStreakClick={handleClaimStreak}
          onReferralClick={() => scrollTo('earn-more-xp')}
        />

        {/* 4. Level-Up Interactive Roadmap */}
        <div id="level-roadmap">
          <LevelRoadmap
            levels={LEVELS_DATA}
            currentLevel={userProgress.currentLevel}
          />
        </div>

        {/* 5. VELOOP Guardian Runner Character Showcase */}
        <div id="guardian-character">
          <GuardianCharacterShowcase
            currentLevel={userProgress.currentLevel}
            onPlayRunner={() => setActiveGameId('guardian-run')}
          />
        </div>

        {/* 6. Play & Earn (5 Original Mini-Games Hub) */}
        <div id="play-and-earn">
          <PlayAndEarn
            games={MINI_GAMES}
            onSelectGame={(gameId) => setActiveGameId(gameId)}
          />
        </div>

        {/* 7. Earn More XP & Rewards Missions */}
        <div id="earn-more-xp">
          <EarnMoreXp
            missions={INITIAL_MISSIONS}
            onCompleteDaily={handleDailyCheckIn}
            onClaimStreak={handleClaimStreak}
            onSimulateReferral={handleSimulateReferral}
            onJumpToGames={() => scrollTo('play-and-earn')}
            streakDays={userProgress.streakDays}
            streakClaimed={userProgress.streakClaimedToday}
            dailyCompleted={userProgress.dailyChallengeCompleted}
            referralCode={userProgress.referralCode}
          />
        </div>

        {/* 8. XP Activity Timeline */}
        <XpActivityFeed activities={activities} />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* ACTIVE MINI-GAME MODALS */}
      {activeGameId === 'guardian-run' && (
        <GuardianRunGame
          onClose={() => setActiveGameId(null)}
          onGameComplete={handleGameComplete}
        />
      )}

      {activeGameId === 'coin-catch' && (
        <CoinCatchGame
          onClose={() => setActiveGameId(null)}
          onGameComplete={handleGameComplete}
        />
      )}

      {activeGameId === 'reward-match' && (
        <RewardMatchGame
          onClose={() => setActiveGameId(null)}
          onGameComplete={handleGameComplete}
        />
      )}

      {activeGameId === 'xp-sprint' && (
        <XpSprintGame
          onClose={() => setActiveGameId(null)}
          onGameComplete={handleGameComplete}
        />
      )}

      {activeGameId === 'reward-hunt' && (
        <RewardHuntGame
          onClose={() => setActiveGameId(null)}
          onGameComplete={handleGameComplete}
        />
      )}

      {/* LEVEL-UP CELEBRATION MODAL */}
      <LevelUpCelebrationModal
        isOpen={levelUpModalOpen}
        onClose={() => setLevelUpModalOpen(false)}
        unlockedLevel={unlockedInfo.level}
        unlockedLevelName={unlockedInfo.name}
        rewardVes={unlockedInfo.rewardVes}
      />
    </div>
  );
}
