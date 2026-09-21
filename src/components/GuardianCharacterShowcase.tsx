import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Sparkles, ChevronRight, Play, Award } from 'lucide-react';
import { sounds } from '../utils/sound';

interface CharacterShowcaseProps {
  currentLevel: number;
  onPlayRunner: () => void;
}

export const GuardianCharacterShowcase: React.FC<CharacterShowcaseProps> = ({
  currentLevel,
  onPlayRunner,
}) => {
  const [pose, setPose] = useState<'run' | 'jump' | 'victory'>('run');
  const [previewSuitStage, setPreviewSuitStage] = useState<number>(currentLevel);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
      <div className="rounded-3xl bg-gradient-to-r from-[#171d33] via-[#15192c] to-[#121524] border border-[#262f50] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>OFFICIAL VELOOP MASCOT</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
              VELOOP Guardian Runner
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Engineered with a sleek kinetic athletic silhouette, illuminated soft-blue telemetry visor, and gold accent conduits. The Guardian Runner evolves alongside your rewards tier.
            </p>

            {/* Suit evolution tabs */}
            <div className="mt-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Suit Evolution Stages
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { lvl: 1, name: 'Basic Suit' },
                  { lvl: 2, name: 'Armored' },
                  { lvl: 3, name: 'Voyager Trim' },
                  { lvl: 4, name: 'Enhanced XP' },
                  { lvl: 5, name: 'Titanium Gold' },
                ].map((tier) => (
                  <button
                    key={tier.lvl}
                    onClick={() => {
                      sounds.playTap();
                      setPreviewSuitStage(tier.lvl);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                      previewSuitStage === tier.lvl
                        ? 'bg-cyan-500/20 border-cyan-400 text-white'
                        : tier.lvl <= currentLevel
                        ? 'bg-[#1a2035] border-[#293252] text-slate-300 hover:border-slate-500'
                        : 'bg-[#121524] border-[#1f253d] text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono-numbers block text-slate-400">
                      LVL 0{tier.lvl} {tier.lvl === currentLevel && '★'}
                    </span>
                    <span className="text-xs font-bold truncate block">{tier.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kinetic Pose Controls */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Preview Motion:</span>
              <div className="inline-flex rounded-xl bg-[#111422] p-1 border border-[#232942]">
                {(['run', 'jump', 'victory'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      sounds.playTap();
                      setPose(p);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                      pose === p
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Runner CTA */}
            <div className="mt-6 pt-4 border-t border-[#232a45] flex items-center gap-4">
              <button
                onClick={() => {
                  sounds.playTap();
                  onPlayRunner();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play VELOOP Guardian Run</span>
              </button>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Endless Runner &bull; +25 XP Reward
              </span>
            </div>
          </div>

          {/* Right Visualizer Column: Original Futuristic Humanoid Mascot (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-64 h-80 sm:w-72 sm:h-96 relative flex items-center justify-center">
              {/* Radial backdrop */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-xl pointer-events-none" />

              {/* Futuristic Humanoid Runner SVG Avatar with dynamic pose & suit styling */}
              <motion.svg
                key={`${pose}-${previewSuitStage}`}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={
                  pose === 'run'
                    ? { y: [0, -6, 0], scale: 1, opacity: 1 }
                    : pose === 'jump'
                    ? { y: [-15, -25, -15], scale: 1.05, opacity: 1 }
                    : { y: [0, -4, 0], scale: 1.02, opacity: 1 }
                }
                transition={{ repeat: Infinity, duration: pose === 'run' ? 0.6 : 1.2, ease: 'easeInOut' }}
                viewBox="0 0 240 320"
                className="w-full h-full drop-shadow-[0_10px_25px_rgba(6,182,212,0.25)]"
              >
                <defs>
                  <linearGradient id="suitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a2035" />
                    <stop offset="60%" stopColor="#0d111d" />
                    <stop offset="100%" stopColor="#070911" />
                  </linearGradient>
                  <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="cyanVisor" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Ground light disc */}
                <ellipse cx="120" cy="300" rx="60" ry="12" fill="#06b6d4" opacity="0.25" filter="url(#glow)" />

                {/* ATHLETIC HUMANOID RUNNER GEOMETRY */}
                {/* Legs */}
                {pose === 'run' ? (
                  <>
                    {/* Back leg */}
                    <path d="M105 190 L90 245 L75 290" stroke="#0f1422" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M75 290 L60 295" stroke={previewSuitStage >= 4 ? "#f59e0b" : "#38bdf8"} strokeWidth="6" strokeLinecap="round" />
                    {/* Front leg */}
                    <path d="M135 190 L155 240 L165 290" stroke="#161e31" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M135 190 L155 240 L165 290" stroke={previewSuitStage >= 5 ? "#fbbf24" : "#0ea5e9"} strokeWidth="3" strokeDasharray="6,6" />
                    <path d="M165 290 L180 295" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    {/* Standing / Jumping legs */}
                    <path d="M105 190 L100 245 L102 290" stroke="#161e31" strokeWidth="15" strokeLinecap="round" />
                    <path d="M135 190 L140 245 L138 290" stroke="#161e31" strokeWidth="15" strokeLinecap="round" />
                    <path d="M102 290 L90 295" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                    <path d="M138 290 L150 295" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                  </>
                )}

                {/* Torso & Athletic Kinetic Suit */}
                <path
                  d="M100 95 L140 95 L148 180 L92 180 Z"
                  fill="url(#suitGrad)"
                  stroke="#26314f"
                  strokeWidth="2"
                />

                {/* Suit Chest Armor Plate */}
                <path
                  d="M105 105 L135 105 L142 150 L98 150 Z"
                  fill="#182035"
                  stroke={previewSuitStage >= 5 ? "url(#goldTrim)" : "#38bdf8"}
                  strokeWidth="2"
                />

                {/* V-Shape VELOOP Logo on Chest */}
                <path
                  d="M112 118 L120 134 L128 118"
                  fill="none"
                  stroke="url(#goldTrim)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {/* Energy conduits on torso */}
                {previewSuitStage >= 3 && (
                  <>
                    <line x1="102" y1="120" x2="102" y2="165" stroke="#22d3ee" strokeWidth="2" opacity="0.8" />
                    <line x1="138" y1="120" x2="138" y2="165" stroke="#22d3ee" strokeWidth="2" opacity="0.8" />
                  </>
                )}

                {/* Arms & Shoulders */}
                {pose === 'victory' ? (
                  <>
                    <path d="M96 100 L70 50" stroke="#182035" strokeWidth="11" strokeLinecap="round" />
                    <path d="M144 100 L170 50" stroke="#182035" strokeWidth="11" strokeLinecap="round" />
                    <circle cx="70" cy="50" r="5" fill="#f59e0b" />
                    <circle cx="170" cy="50" r="5" fill="#f59e0b" />
                  </>
                ) : pose === 'run' ? (
                  <>
                    <path d="M96 105 L80 140 L65 130" stroke="#182035" strokeWidth="11" strokeLinecap="round" />
                    <path d="M144 105 L160 145 L175 140" stroke="#182035" strokeWidth="11" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M96 105 L85 145 L80 170" stroke="#182035" strokeWidth="11" strokeLinecap="round" />
                    <path d="M144 105 L155 145 L160 170" stroke="#182035" strokeWidth="11" strokeLinecap="round" />
                  </>
                )}

                {/* Shoulder Pauldrons */}
                <circle cx="95" cy="100" r="8" fill={previewSuitStage >= 4 ? "#f59e0b" : "#223150"} stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="145" cy="100" r="8" fill={previewSuitStage >= 4 ? "#f59e0b" : "#223150"} stroke="#38bdf8" strokeWidth="1.5" />

                {/* Neck */}
                <rect x="114" y="82" width="12" height="15" fill="#0f1422" rx="2" />

                {/* Futuristic Helmet / Head */}
                <path
                  d="M104 55 Q120 38 136 55 L136 82 Q120 90 104 82 Z"
                  fill="#111626"
                  stroke="#2b385a"
                  strokeWidth="2"
                />

                {/* Illuminated Soft Blue Telemetry Visor */}
                <path
                  d="M106 60 Q120 54 134 60 L133 72 Q120 78 107 72 Z"
                  fill="url(#cyanVisor)"
                  filter="url(#glow)"
                />
                <line x1="110" y1="65" x2="130" y2="65" stroke="#ffffff" strokeWidth="1.5" opacity="0.75" />

                {/* Helmet Gold VELOOP Crest */}
                <polygon points="120,40 123,48 117,48" fill="#fbbf24" />

                {/* Enhanced XP Energy Aura for Level 4+ */}
                {previewSuitStage >= 4 && (
                  <circle cx="120" cy="130" r="55" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.4" />
                )}
              </motion.svg>

              {/* Status pill overlay */}
              <div className="absolute bottom-1 px-3 py-1 rounded-full bg-[#121626]/90 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 backdrop-blur-sm shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Tier 0{previewSuitStage} Suit Configuration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
