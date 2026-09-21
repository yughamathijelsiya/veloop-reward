import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Award, Coins, ArrowRight, Check, Zap, Gift } from 'lucide-react';
import { sounds } from '../utils/sound';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedLevel: number;
  unlockedLevelName: string;
  rewardVes: number;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  onClose,
  unlockedLevel,
  unlockedLevelName,
  rewardVes,
}) => {
  const [stage, setStage] = useState<'vault' | 'opened'>('vault');

  useEffect(() => {
    if (isOpen) {
      setStage('vault');
      sounds.playLevelUp();
      const timer = setTimeout(() => {
        sounds.playCoin();
        setStage('opened');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-gradient-to-b from-[#1c223c] via-[#15192c] to-[#0f1220] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Subtle radial light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tier Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>LEVEL UP CELEBRATION</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          LEVEL {String(unlockedLevel).padStart(2, '0')}!
        </h2>
        <p className="text-sm font-semibold text-cyan-300 tracking-wide mt-1">
          Achievement Unlocked: {unlockedLevelName} Rank
        </p>

        {/* Animated Vault / Reward Unlocked Representation */}
        <div className="my-8 flex flex-col items-center justify-center">
          <motion.div
            animate={
              stage === 'vault'
                ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }
                : { scale: [1, 1.15, 1] }
            }
            transition={{ duration: 0.6 }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#2f2716] via-[#1c170d] to-[#0c0a06] border-2 border-amber-400 flex flex-col items-center justify-center shadow-2xl shadow-amber-500/30 relative"
          >
            {stage === 'vault' ? (
              <Gift className="w-12 h-12 text-amber-400 animate-pulse" />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <Coins className="w-12 h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                <span className="text-xs font-black text-amber-300 mt-1 uppercase">UNLOCKED</span>
              </motion.div>
            )}
            {/* Subtle glow rim */}
            <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />
          </motion.div>

          {/* Reward Amount Reveal */}
          <div className="mt-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              INSTITUTIONAL REWARD REVEALED
            </span>
            <div className="flex items-baseline justify-center gap-2 mt-1">
              <span className="font-heading text-4xl sm:text-5xl font-black text-amber-300 font-mono-numbers">
                +{rewardVes}
              </span>
              <span className="text-xl font-bold text-amber-400">VEs</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              Credited to your VELOOP Rewards Balance &bull; Demo Allocation
            </p>
          </div>
        </div>

        {/* New Tier Perks Checklist */}
        <div className="bg-[#0f121d] p-4 rounded-2xl border border-[#222944] text-left max-w-sm mx-auto mb-6">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            New Unlocked Tier Capabilities:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Titanium Gold Guardian Exosuit Armor</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>+25% Global XP Progression Acceleration</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Unlocks Tier 06 Elite Milestone Horizon</span>
            </li>
          </ul>
        </div>

        {/* Close / Continue button */}
        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>CONTINUE TO VELOOP HUB</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
