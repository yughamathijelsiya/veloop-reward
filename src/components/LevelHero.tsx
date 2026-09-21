import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Lock, ArrowUpRight, Info, Award, Zap, ChevronRight, Gift } from 'lucide-react';
import { sounds } from '../utils/sound';

interface LevelHeroProps {
  currentLevel: number;
  levelName: string;
  currentXp: number;
  nextLevelXp: number;
  rewardVes: number;
  onOpenLevelInfo: () => void;
  onOpenRewardInfo: () => void;
  onPlayGamesClick: () => void;
}

export const LevelHero: React.FC<LevelHeroProps> = ({
  currentLevel,
  levelName,
  currentXp,
  nextLevelXp,
  rewardVes,
  onOpenLevelInfo,
  onOpenRewardInfo,
  onPlayGamesClick,
}) => {
  const [isHoveringVault, setIsHoveringVault] = useState(false);
  const [showLevelPerksTooltip, setShowLevelPerksTooltip] = useState(false);

  // Compute progress percentages
  const progressPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  const xpRemaining = Math.max(0, nextLevelXp - currentXp);

  return (
    <section className="relative pt-6 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting - strictly deep navy and subtle gold/blue glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Typography */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b2138]/80 border border-amber-500/25 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Fintech-Powered Gamified Hub</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
          Level Up Your Rewards
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-300/90 font-normal leading-relaxed">
          Keep earning XP, complete challenges, play and unlock better rewards.
        </p>
      </div>

      {/* Master XP Progress Bar Container */}
      <div className="bg-gradient-to-b from-[#1c2238] to-[#141829] p-5 sm:p-6 rounded-2xl border border-[#27304e] shadow-xl relative overflow-hidden mb-8">
        {/* Top metrics bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs">
              04
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level 04 &bull; {levelName}</p>
              <p className="text-sm sm:text-base font-bold text-white">
                <span className="font-mono-numbers text-cyan-300">{currentXp.toLocaleString()}</span>{' '}
                <span className="text-slate-400 text-xs font-medium">/ {nextLevelXp.toLocaleString()} XP</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider">XP Remaining</span>
              <p className="text-sm sm:text-base font-bold text-amber-300 font-mono-numbers">
                {xpRemaining.toLocaleString()} XP to Level 05
              </p>
            </div>

            <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-sm font-mono-numbers">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* The Animated Progress Track */}
        <div className="relative w-full h-4 sm:h-5 bg-[#0f121d] rounded-full overflow-hidden p-0.5 border border-[#222942]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 relative shadow-lg"
          >
            {/* Subtle glow highlight */}
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 rounded-full blur-[2px]" />
          </motion.div>
        </div>

        {/* Bottom milestones hint */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2.5 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            Current Base: Level 04 (6,420 XP)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            Next Milestone: Level 05 (8,000 XP) &bull; 500 VEs Vault
            <Gift className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Two High-Impact Cards: Current Level & Next Level Reward */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: CURRENT LEVEL CARD */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#1a2035] to-[#121626] border border-[#293252] p-6 shadow-lg flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wider uppercase">
                  CURRENT STANDING
                </span>
                <span className="text-xs text-slate-400 font-medium">Rank Active</span>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenLevelInfo();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
                title="Level Tier Guidelines"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Badge & Title */}
            <div className="mt-5 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e2540] via-[#14192b] to-[#0a0d17] border border-cyan-500/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-1 rounded-xl border border-cyan-400/20" />
                <Shield className="w-8 h-8 text-cyan-400" />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-amber-500 text-[10px] font-black text-black">
                  04
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">LEVEL 04</span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {levelName}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  VELOOP Guardian Runner &bull; Stage 4 Kinetic Suit
                </p>
              </div>
            </div>

            {/* Current Level Statistics */}
            <div className="mt-6 grid grid-cols-2 gap-3 bg-[#0e111d] p-3.5 rounded-xl border border-[#20273f]">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Accumulated</span>
                <span className="text-lg font-bold text-white font-mono-numbers">
                  {currentXp.toLocaleString()} <span className="text-xs font-normal text-slate-400">XP</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Remaining to Lvl 5</span>
                <span className="text-lg font-bold text-amber-300 font-mono-numbers">
                  {xpRemaining.toLocaleString()} <span className="text-xs font-normal text-slate-400">XP</span>
                </span>
              </div>
            </div>

            {/* Level Perks Pills */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Active Tier Perks
                </span>
                <button
                  onClick={() => setShowLevelPerksTooltip(!showLevelPerksTooltip)}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  {showLevelPerksTooltip ? 'Hide' : 'View perks'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#181f33] text-slate-300 border border-[#2a3350]">
                  +15% Mini-Game XP Multiplier
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#181f33] text-slate-300 border border-[#2a3350]">
                  Priority Daily Quests
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#181f33] text-slate-300 border border-[#2a3350]">
                  Level 04 Enhanced XP Trail
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#222942] flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">80% progress achieved</span>
            <button
              onClick={() => {
                sounds.playTap();
                onPlayGamesClick();
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
            >
              <span>Play to Earn XP</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: NEXT LEVEL REWARD (PREMIUM VAULT) */}
        <div
          onMouseEnter={() => setIsHoveringVault(true)}
          onMouseLeave={() => setIsHoveringVault(false)}
          className="relative rounded-2xl bg-gradient-to-b from-[#211f38] via-[#1a1c2e] to-[#121422] border border-amber-500/30 p-6 shadow-lg flex flex-col justify-between group hover:border-amber-500/60 transition-all duration-300"
        >
          {/* Ambient Gold Glow on hover */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-400" />
                  NEXT LEVEL REWARD
                </span>
                <span className="text-xs text-amber-400/80 font-medium">Locked &bull; Level 05</span>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenRewardInfo();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-950/40 transition-colors cursor-pointer"
                title="Reward Allocation Rules"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Representation of the Vault Capsule */}
            <div className="mt-5 flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2f281b] via-[#1a1712] to-[#0d0c0a] border-2 border-amber-500/60 flex flex-col items-center justify-center shadow-xl shadow-amber-950/40 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-white/10" />
                <Lock className={`w-7 h-7 text-amber-400 transition-all duration-300 ${isHoveringVault ? 'scale-110 text-amber-300' : ''}`} />
                <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest mt-1">
                  VAULT 05
                </span>
                {/* Vault glow pulse */}
                <div className="absolute -bottom-2 w-12 h-1 rounded-full bg-amber-400/80 blur-xs" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase block">
                  UNLOCK AT LEVEL 05
                </span>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
                    {rewardVes}
                  </h3>
                  <span className="text-base font-bold text-amber-400 uppercase">VEs</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Reach Level 05 (8,000 XP) to unlock the Guardian Master Vault.
                </p>
              </div>
            </div>

            {/* Progression sequence tracker: LOCKED -> LEVEL 05 -> UNLOCK REWARD */}
            <div className="mt-6 bg-[#0f111c] p-3.5 rounded-xl border border-amber-500/20">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400/60" />
                  <span>State: Partially Locked</span>
                </div>
                <span className="text-amber-300 font-bold font-mono-numbers">1,580 XP remaining</span>
              </div>

              {/* Step progression pill */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">LOCKED</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">LEVEL 05</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">UNLOCK 500 VEs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2a2640] flex items-center justify-between">
            <span className="text-xs text-amber-300/80 font-medium">Official Milestone Reward</span>
            <button
              onClick={() => {
                sounds.playTap();
                onPlayGamesClick();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <span>Accelerate with Games</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
