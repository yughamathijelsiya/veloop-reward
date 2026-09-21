import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Award, Coins, Zap, Shield, Sparkles, Compass, Eye, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface RewardHuntGameProps {
  onClose: () => void;
  onGameComplete: (earnedXp: number, score: number) => void;
}

interface HiddenReward {
  id: string;
  name: string;
  type: 'coin' | 'xp' | 'badge';
  description: string;
  found: boolean;
  coords: { x: number; y: number }; // percentage
  hint: string;
}

const INITIAL_TARGETS: HiddenReward[] = [
  {
    id: 'target-1',
    name: 'High-Altitude VE Cache',
    type: 'coin',
    description: 'A floating kinetic cache suspended near the city telecommunications spire.',
    found: false,
    coords: { x: 26, y: 28 },
    hint: 'Glows softly atop the western telecom spire.',
  },
  {
    id: 'target-2',
    name: 'Resonant XP Energy Matrix',
    type: 'xp',
    description: 'A concentrated node of raw XP energy pulsing in the central kinetic fountain.',
    found: false,
    coords: { x: 50, y: 65 },
    hint: 'Vibrates in the lower center plaza generator.',
  },
  {
    id: 'target-3',
    name: 'Ancient VELOOP Guardian Crest',
    type: 'badge',
    description: 'An apex insignia sealed within the eastern observation deck archway.',
    found: false,
    coords: { x: 78, y: 35 },
    hint: 'Hidden behind the high eastern observation glass.',
  },
];

export const RewardHuntGame: React.FC<RewardHuntGameProps> = ({ onClose, onGameComplete }) => {
  const [gameState, setGameState] = useState<'preview' | 'countdown' | 'playing' | 'completed'>('preview');
  const [countdown, setCountdown] = useState<number>(3);
  const [targets, setTargets] = useState<HiddenReward[]>(INITIAL_TARGETS);
  const [activeHint, setActiveHint] = useState<string>('Click or tap glowing areas in the VELOOP Hub to uncover all 3 hidden rewards.');

  const foundCount = targets.filter((t) => t.found).length;

  const handleStart = () => {
    sounds.playTap();
    setGameState('countdown');
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        sounds.playTap();
        setCountdown(count);
      } else {
        clearInterval(interval);
        sounds.playJump();
        setCountdown(0);
        startGameplay();
      }
    }, 700);
  };

  const startGameplay = () => {
    setTargets(INITIAL_TARGETS.map((t) => ({ ...t, found: false })));
    setActiveHint('Look for subtle pulse rings across the futuristic cityscape!');
    setGameState('playing');
  };

  const handleTargetClick = (targetId: string) => {
    if (gameState !== 'playing') return;

    sounds.playCoin();

    const updated = targets.map((t) => (t.id === targetId ? { ...t, found: true } : t));
    setTargets(updated);

    const foundTarget = targets.find((t) => t.id === targetId);
    if (foundTarget) {
      setActiveHint(`Discovered: ${foundTarget.name}!`);
    }

    const newFoundCount = updated.filter((t) => t.found).length;
    if (newFoundCount === 3) {
      setTimeout(() => {
        sounds.playLevelUp();
        setGameState('completed');
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#141828] border border-[#293252] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#101320] border-b border-[#222942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white">
                REWARD HUNT
              </h3>
              <span className="text-[11px] text-slate-400">Environmental Exploration &bull; +25 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {gameState === 'playing' && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs font-mono-numbers">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>{foundCount} / 3 FOUND</span>
              </div>
            )}

            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exploration Scene Area */}
        <div className="relative w-full h-[380px] sm:h-[450px] bg-gradient-to-b from-[#0d101a] via-[#131726] to-[#0a0d17] overflow-hidden select-none">
          {/* Futuristic Environment SVG Art */}
          <svg className="w-full h-full object-cover" viewBox="0 0 800 500" preserveAspectRatio="none">
            {/* Stars / digital dots */}
            <circle cx="120" cy="80" r="1.5" fill="#38bdf8" opacity="0.6" />
            <circle cx="280" cy="60" r="1" fill="#ffffff" opacity="0.5" />
            <circle cx="620" cy="90" r="1.5" fill="#fbbf24" opacity="0.6" />
            <circle cx="710" cy="70" r="1" fill="#38bdf8" opacity="0.5" />

            {/* Futuristic Skyline */}
            {/* Background towers */}
            <path d="M80 500 L80 180 L140 180 L140 500 Z" fill="#101524" />
            <path d="M190 500 L190 120 L270 120 L270 500 Z" fill="#141a2c" />
            <path d="M370 500 L370 160 L450 160 L450 500 Z" fill="#111728" />
            <path d="M560 500 L560 130 L640 130 L640 500 Z" fill="#151b2d" />
            <path d="M680 500 L680 200 L760 200 L760 500 Z" fill="#0f1422" />

            {/* Telecommunications spire on tower 2 */}
            <line x1="230" y1="120" x2="230" y2="70" stroke="#0ea5e9" strokeWidth="3" />
            <circle cx="230" cy="70" r="5" fill="#38bdf8" />

            {/* Central Skybridge and Gateway */}
            <path d="M140 280 Q400 240 660 280 L660 310 Q400 270 140 310 Z" fill="#1c233a" stroke="#2c385a" strokeWidth="2" />

            {/* Illuminated windows */}
            <rect x="205" y="150" width="12" height="12" fill="#0284c7" opacity="0.7" />
            <rect x="245" y="180" width="12" height="12" fill="#f59e0b" opacity="0.7" />
            <rect x="580" y="160" width="12" height="12" fill="#0284c7" opacity="0.7" />

            {/* Lower Plaza & Kinetic Ring */}
            <ellipse cx="400" cy="420" rx="320" ry="80" fill="#0b0e19" stroke="#1d253f" strokeWidth="3" />
            <ellipse cx="400" cy="420" rx="150" ry="38" fill="#111728" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>

          {/* Interactive Hidden Reward Hotspots */}
          {gameState === 'playing' &&
            targets.map((target) => {
              return (
                <div
                  key={target.id}
                  style={{
                    left: `${target.coords.x}%`,
                    top: `${target.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => !target.found && handleTargetClick(target.id)}
                  className={`absolute z-10 cursor-pointer group ${
                    target.found ? 'pointer-events-none' : ''
                  }`}
                >
                  {target.found ? (
                    /* Found celebration marker */
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    /* Pulsing hidden target */
                    <div className="relative flex items-center justify-center w-12 h-12">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-40"></span>
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:scale-115 group-hover:border-amber-400 group-hover:text-amber-300 transition-all shadow-md">
                        <Eye className="w-4 h-4 animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Bottom Hint Banner */}
          {gameState === 'playing' && (
            <div className="absolute bottom-3 left-4 right-4 bg-[#111422]/90 backdrop-blur-md border border-[#27304e] p-3 rounded-2xl flex items-center justify-between z-15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium truncate">{activeHint}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {targets.map((t, idx) => (
                  <span
                    key={t.id}
                    className={`w-2.5 h-2.5 rounded-full ${
                      t.found ? 'bg-emerald-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STATE 1: PREVIEW */}
          {gameState === 'preview' && (
            <div className="absolute inset-0 bg-[#121524]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg">
                <Compass className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                REWARD HUNT
              </h2>
              <p className="text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
                Scan the futuristic VELOOP environment to discover 3 hidden caches containing VE coins, XP nodes, and crests. Find all 3 to claim your reward!
              </p>

              <div className="mt-6">
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>START EXPLORATION</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: COUNTDOWN */}
          {gameState === 'countdown' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center z-20">
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-heading text-6xl sm:text-7xl font-black text-amber-300 font-mono-numbers"
              >
                {countdown > 0 ? countdown : 'GO!'}
              </motion.span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-4">
                SCANNING SECTOR
              </span>
            </div>
          )}

          {/* STATE 3: COMPLETED */}
          {gameState === 'completed' && (
            <div className="absolute inset-0 bg-[#0e111d]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-xl">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                REWARD HUNT COMPLETE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                All 3 Caches Found!
              </h3>

              <div className="bg-[#141829] p-4 rounded-xl border border-[#262f4c] my-4 max-w-sm w-full text-left">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
                  Discovered Assets
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>High-Altitude VE Cache (+10 VEs)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Resonant XP Energy Matrix (+25 XP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ancient VELOOP Guardian Crest (Unlocked)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-blue-500/15 border border-amber-500/40 px-5 py-3 rounded-xl mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <span className="text-xs font-bold text-amber-300">+25 XP &bull; +10 VEs DEMO REWARD</span>
                  <p className="text-[11px] text-slate-400">Transferred to VELOOP Level-Up bar</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playCoin();
                    onGameComplete(25, 100);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  Claim +25 XP & Return
                </button>
                <button
                  onClick={handleStart}
                  className="px-4 py-2.5 rounded-xl bg-[#1e253d] hover:bg-[#283252] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
