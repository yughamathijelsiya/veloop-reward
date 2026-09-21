import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, ArrowRight, Zap, Star, Shield, Sparkles, Trophy, Award } from 'lucide-react';
import { MiniGame } from '../types';
import { sounds } from '../utils/sound';

interface PlayAndEarnProps {
  games: MiniGame[];
  onSelectGame: (gameId: string) => void;
}

export const PlayAndEarn: React.FC<PlayAndEarnProps> = ({ games, onSelectGame }) => {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const renderStars = (diff: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${
              s <= diff ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  // Sleek animated SVG preview thumbnail for each game
  const renderGameThumbnail = (game: MiniGame) => {
    const isHovered = hoveredGame === game.id;

    if (game.id === 'guardian-run') {
      return (
        <div className="relative w-full h-36 bg-gradient-to-b from-[#161f36] to-[#0d1222] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-cyan-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          {/* Skyline silhouette */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#0a0d18] to-transparent flex items-end justify-around px-2">
            <div className="w-6 h-10 bg-[#1e2945]" />
            <div className="w-8 h-14 bg-[#182138]" />
            <div className="w-7 h-8 bg-[#1f2a47]" />
          </div>
          {/* Runner Icon */}
          <motion.div
            animate={isHovered ? { x: [-10, 10, -10], y: [0, -6, 0] } : { y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/30 z-10"
          >
            <Shield className="w-6 h-6" />
          </motion.div>
          {/* Floating VE Coin */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute top-3 right-4 w-6 h-6 rounded-full bg-amber-400 border border-amber-300 text-black text-[9px] font-black flex items-center justify-center shadow-md"
          >
            VE
          </motion.div>
        </div>
      );
    }

    if (game.id === 'coin-catch') {
      return (
        <div className="relative w-full h-36 bg-gradient-to-b from-[#211e33] to-[#0e0c18] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-amber-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          {/* Falling coins visual */}
          <motion.div
            animate={{ y: [-15, 20], opacity: [1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute top-4 left-10 w-5 h-5 rounded-full bg-amber-400 text-black text-[8px] font-black flex items-center justify-center shadow-sm"
          >
            VE
          </motion.div>
          <motion.div
            animate={{ y: [-20, 25], opacity: [1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: 0.3 }}
            className="absolute top-3 right-12 w-5 h-5 rounded-full bg-cyan-400 text-black text-[8px] font-black flex items-center justify-center shadow-sm"
          >
            XP
          </motion.div>
          {/* Collector Drone Beam */}
          <div className="absolute bottom-4 w-20 h-3 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full shadow-md flex items-center justify-center">
            <div className="w-14 h-1 bg-white/70 rounded-full" />
          </div>
        </div>
      );
    }

    if (game.id === 'reward-match') {
      return (
        <div className="relative w-full h-36 bg-gradient-to-b from-[#211a36] to-[#0e0c19] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-purple-500/20">
          <div className="flex gap-2 items-center">
            <motion.div
              animate={isHovered ? { rotateY: [0, 180, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-14 rounded-lg bg-[#272144] border border-purple-400/60 flex items-center justify-center text-purple-300 shadow-md"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>
            <motion.div
              animate={isHovered ? { rotateY: [180, 0, 180] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-14 rounded-lg bg-gradient-to-b from-purple-600 to-indigo-700 border border-white/40 flex items-center justify-center text-white shadow-md"
            >
              <Award className="w-5 h-5 text-amber-300" />
            </motion.div>
          </div>
        </div>
      );
    }

    if (game.id === 'xp-sprint') {
      return (
        <div className="relative w-full h-36 bg-gradient-to-b from-[#152338] to-[#0a111c] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-blue-500/20">
          {/* Pulse node */}
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-cyan-400 opacity-30"></span>
            <div className="w-12 h-12 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <span className="absolute bottom-2 text-[10px] font-mono-numbers font-bold text-cyan-400">
            COMBO x4
          </span>
        </div>
      );
    }

    // Default: Reward Hunt
    return (
      <div className="relative w-full h-36 bg-gradient-to-b from-[#13222e] to-[#081119] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-emerald-500/20">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-2 px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
          3 / 3 HIDDEN
        </div>
      </div>
    );
  };

  return (
    <section id="play-and-earn" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
      {/* Section Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b233a] border border-[#2b3558] text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>SKILL-BASED CHALLENGES</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
            PLAY & EARN
          </h2>
          <p className="mt-1 text-xs sm:text-base text-slate-300">
            Complete skill-based challenges and progress toward your next reward.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 text-xs text-slate-400">
          <span className="font-bold text-amber-300">+25 XP</span> guaranteed per challenge completed
        </div>
      </div>

      {/* 5 Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {games.map((game) => {
          return (
            <motion.div
              key={game.id}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-gradient-to-b from-[#181e33] to-[#121626] border border-[#27304f] hover:border-cyan-500/50 p-4 shadow-lg flex flex-col justify-between transition-all duration-300 group cursor-pointer"
              onClick={() => {
                sounds.playTap();
                onSelectGame(game.id);
              }}
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 uppercase tracking-wider">
                    {game.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {game.category}
                  </span>
                </div>

                {/* Animated Game Preview Thumbnail */}
                {renderGameThumbnail(game)}

                {/* Title & Subtitle */}
                <h3 className="font-heading text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{game.subtitle}</p>

                <p className="text-[11px] text-slate-400/90 mt-2 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>

                {/* Difficulty & Reward Meta */}
                <div className="mt-4 pt-3 border-t border-[#222944] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Difficulty:</span>
                    {renderStars(game.difficulty)}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Reward:</span>
                    <span className="text-xs font-bold text-amber-300 font-mono-numbers">
                      +{game.rewardXp} XP {game.rewardVesBonus ? `(+${game.rewardVesBonus} VEs)` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Play Now Button */}
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playTap();
                    onSelectGame(game.id);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#202844] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 text-xs font-bold text-white group-hover:text-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>PLAY NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
