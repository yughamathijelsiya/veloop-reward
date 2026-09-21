import React from 'react';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/sound';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    sounds.playTap();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#0d101a] border-t border-[#1d233a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black text-sm shadow-md">
              V
            </div>
            <span className="font-heading font-black text-lg text-white tracking-wider">
              VELOOP <span className="text-amber-400 font-semibold text-xs tracking-normal">REWARDS</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
            Elevate your loyalty. Play, level up, and unlock real financial rewards with our gamified fintech progression system.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <button
            onClick={() => scrollTo('level-hero')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Level Progression
          </button>
          <button
            onClick={() => scrollTo('guardian-character')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Guardian Runner
          </button>
          <button
            onClick={() => scrollTo('play-and-earn')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Play & Earn
          </button>
          <button
            onClick={() => scrollTo('level-roadmap')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Roadmap
          </button>
        </div>

        {/* System status */}
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#14192b] border border-[#232b49] text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VELOOP Core Protocol &bull; Operational (14ms)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            &copy; 2025 VELOOP Technologies Inc. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
