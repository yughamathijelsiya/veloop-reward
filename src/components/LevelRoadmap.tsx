import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Shield, Lock, ChevronRight, X, Sparkles, Gift, Award, Zap } from 'lucide-react';
import { LevelInfo } from '../types';
import { sounds } from '../utils/sound';

interface LevelRoadmapProps {
  levels: LevelInfo[];
  currentLevel: number;
}

export const LevelRoadmap: React.FC<LevelRoadmapProps> = ({ levels, currentLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo | null>(null);

  const getStatusBadge = (lvl: LevelInfo) => {
    if (lvl.level < currentLevel) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
          <Check className="w-3 h-3 text-emerald-400" />
          COMPLETED
        </span>
      );
    }
    if (lvl.level === currentLevel) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/50 px-2.5 py-0.5 rounded-full shadow-sm shadow-cyan-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          YOU ARE HERE
        </span>
      );
    }
    if (lvl.level === currentLevel + 1) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/50 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-amber-400" />
          NEXT GOAL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-900/60 border border-slate-800 px-2.5 py-0.5 rounded-full">
        <Lock className="w-3 h-3" />
        LOCKED
      </span>
    );
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            PROGRESSION MILESTONES
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
            Level Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your tier advancement, unlocked Guardian suits, and upcoming institutional rewards.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 text-xs text-slate-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Current
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Next
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600" /> Locked
          </span>
        </div>
      </div>

      {/* Roadmap Horizon Track - Responsive horizontal scroll / grid */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          <div className="flex items-stretch gap-4 min-w-[850px] lg:min-w-full">
            {levels.map((lvl) => {
              const isCurrent = lvl.level === currentLevel;
              const isCompleted = lvl.level < currentLevel;
              const isNext = lvl.level === currentLevel + 1;
              const isLocked = lvl.level > currentLevel + 1;

              return (
                <div
                  key={lvl.level}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedLevel(lvl);
                  }}
                  className={`flex-1 min-w-[200px] rounded-2xl p-4.5 cursor-pointer transition-all duration-300 flex flex-col justify-between relative ${
                    isCurrent
                      ? 'bg-gradient-to-b from-[#1d253f] to-[#14192b] border-2 border-cyan-500/80 shadow-xl shadow-cyan-950/50 scale-[1.02] z-10'
                      : isNext
                      ? 'bg-gradient-to-b from-[#222138] to-[#151726] border border-amber-500/40 hover:border-amber-500/70 shadow-lg'
                      : isCompleted
                      ? 'bg-[#151929] border border-[#232a42] hover:border-emerald-500/40'
                      : 'bg-[#10131f]/70 border border-[#1d2235] opacity-60 hover:opacity-80'
                  }`}
                >
                  {/* Top Level indicator & state */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono-numbers text-xs font-bold text-slate-400">
                        LVL {String(lvl.level).padStart(2, '0')}
                      </span>
                      {getStatusBadge(lvl)}
                    </div>

                    {/* Level Name & Icon */}
                    <div className="flex items-center gap-3 my-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          isCurrent
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : isNext
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Shield className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <h4 className="font-heading text-lg font-bold text-white tracking-tight">
                          {lvl.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 block font-mono-numbers">
                          {lvl.xpRequired.toLocaleString()} XP
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>

                  {/* Bottom Reward Tag */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lvl.rewardVes} VEs</span>
                    </div>
                    <span className="text-[10px] text-slate-400 hover:text-white flex items-center">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER FOR SELECTED LEVEL DETAILS */}
      <AnimatePresence>
        {selectedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#1b2238] to-[#121626] border border-[#2b3558] rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedLevel(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      LEVEL {String(selectedLevel.level).padStart(2, '0')}
                    </span>
                    {getStatusBadge(selectedLevel)}
                  </div>
                  <h3 className="font-heading text-2xl font-black text-white">
                    {selectedLevel.name}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                {selectedLevel.description}
              </p>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-3 bg-[#0e121e] p-3.5 rounded-xl border border-[#1f263e] mb-5">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">XP Requirement</span>
                  <span className="text-base font-bold text-white font-mono-numbers">
                    {selectedLevel.xpRequired.toLocaleString()} XP
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Milestone Reward</span>
                  <span className="text-base font-bold text-amber-300 font-mono-numbers">
                    {selectedLevel.rewardVes} VEs
                  </span>
                </div>
              </div>

              {/* Guardian Suit Evolution Stage */}
              <div className="mb-5 bg-[#14192b] p-3.5 rounded-xl border border-cyan-500/20">
                <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  Guardian Runner Exosuit
                </span>
                <p className="text-xs text-white font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {selectedLevel.guardianSuitStage}
                </p>
              </div>

              {/* Perks List */}
              <div className="mb-6">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tier Perks & Capabilities
                </h5>
                <ul className="space-y-1.5">
                  {selectedLevel.perks.map((perk, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="px-5 py-2 rounded-xl bg-[#232b49] hover:bg-[#2b3558] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Roadmap Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
