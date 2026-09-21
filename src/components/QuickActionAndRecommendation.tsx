import React from 'react';
import { Gamepad2, CheckCircle2, Flame, UserPlus, Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';

interface QuickActionProps {
  currentXp: number;
  nextLevelXp: number;
  onPlayClick: () => void;
  onDailyClick: () => void;
  onStreakClick: () => void;
  onReferralClick: () => void;
}

export const QuickActionAndRecommendation: React.FC<QuickActionProps> = ({
  currentXp,
  nextLevelXp,
  onPlayClick,
  onDailyClick,
  onStreakClick,
  onReferralClick,
}) => {
  const xpLeft = Math.max(0, nextLevelXp - currentXp);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* RECOMMENDED FOR YOU CARD (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#1c233c] via-[#161c31] to-[#121626] border border-cyan-500/30 p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                RECOMMENDED FOR YOU
              </span>
            </div>
            <h4 className="font-heading text-xl font-bold text-white leading-snug">
              You are {xpLeft.toLocaleString()} XP away from Level 05.
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete today's featured <strong className="text-white">VELOOP Guardian Run</strong> or claim your Daily Check-in to advance toward the 500 VEs Vault reward.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#232a45] flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400">Recommended Action:</span>
            <button
              onClick={() => {
                sounds.playTap();
                onPlayClick();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Launch Guardian Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WAYS TO REACH LEVEL 05 (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#15192a] border border-[#262f4e] p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ACCELERATE PROGRESS
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono-numbers px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                {xpLeft.toLocaleString()} XP LEFT
              </span>
            </div>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-white mb-4">
              Direct Ways to Reach Level 05
            </h4>

            {/* 4 Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* PLAY */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onPlayClick();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c223a] hover:bg-[#232b49] border border-[#2b3558] hover:border-cyan-500/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
                  PLAY
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">+25 XP / Game</span>
              </button>

              {/* COMPLETE */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onDailyClick();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c223a] hover:bg-[#232b49] border border-[#2b3558] hover:border-emerald-500/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors uppercase tracking-wider">
                  COMPLETE
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">+50 XP Protocol</span>
              </button>

              {/* EARN / STREAK */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onStreakClick();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c223a] hover:bg-[#232b49] border border-[#2b3558] hover:border-amber-500/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors uppercase tracking-wider">
                  STREAK
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">+30 XP Daily</span>
              </button>

              {/* REFER */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onReferralClick();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c223a] hover:bg-[#232b49] border border-[#2b3558] hover:border-purple-500/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                  REFER
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">+100 XP / Friend</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Skill-based progression &bull; No wagering &bull; 100% transparent</span>
            <span className="text-cyan-400 font-medium">Daily quests refresh in 14h</span>
          </div>
        </div>
      </div>
    </section>
  );
};
