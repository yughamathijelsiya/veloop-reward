import React from 'react';
import { Shield, Coins, Volume2, VolumeX, Sparkles, User, RefreshCw, PlusCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HeaderProps {
  currentLevel: number;
  levelName: string;
  currentXp: number;
  vesBalance: number;
  onSimulateAddXp: (amount: number) => void;
  onResetDemo: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  levelName,
  currentXp,
  vesBalance,
  onSimulateAddXp,
  onResetDemo,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#161827]/90 border-b border-[#242942]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e233b] via-[#161827] to-[#0d0f19] border border-amber-500/40 shadow-lg shadow-amber-500/10 group cursor-pointer">
            <div className="absolute inset-0 rounded-xl bg-amber-400/5 group-hover:bg-amber-400/10 transition-colors" />
            <Shield className="w-6 h-6 text-amber-400 group-hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-white">
                VELOOP
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/30 text-amber-300 uppercase tracking-wider">
                Rewards
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Level-Up &bull; Rewards &bull; Play &bull; Earn
            </p>
          </div>
        </div>

        {/* Center/Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Dev/Demo Tool: Add XP to test Level-Up */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#121422] p-1 rounded-xl border border-[#262c45]">
            <button
              onClick={() => {
                sounds.playTap();
                onSimulateAddXp(200);
              }}
              title="Add +200 XP to test progression and Level Up"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/60 rounded-lg border border-cyan-800/40 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>+200 XP</span>
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                onResetDemo();
              }}
              title="Reset state to Level 04 baseline (6,420 XP)"
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1c2238] to-[#161a2c] border border-[#2b3353] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300 tracking-wide">
              LVL {String(currentLevel).padStart(2, '0')}
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium border-l border-slate-700 pl-2">
              {levelName}
            </span>
          </div>

          {/* VEs Currency Balance */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#131728] border border-amber-500/30 shadow-inner group cursor-pointer hover:border-amber-500/50 transition-colors">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-numbers font-bold text-sm text-amber-300 tracking-tight">
                {vesBalance.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-amber-400/80">VEs</span>
            </div>
          </div>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            className="p-2 rounded-xl bg-[#1c2136] border border-[#2b3353] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Sound FX On' : 'Sound FX Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b2038] to-[#2b3358] border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-md">
              <User className="w-4 h-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#161827]" />
          </div>
        </div>
      </div>
    </header>
  );
};
