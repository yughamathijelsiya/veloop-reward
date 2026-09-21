import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Flame, UserPlus, Gamepad2, Lock, Sparkles, Copy, Check, Tv, ExternalLink } from 'lucide-react';
import { Mission } from '../types';
import { sounds } from '../utils/sound';

interface EarnMoreXpProps {
  missions: Mission[];
  onCompleteDaily: () => void;
  onClaimStreak: () => void;
  onSimulateReferral: () => void;
  onJumpToGames: () => void;
  streakDays: number;
  streakClaimed: boolean;
  dailyCompleted: boolean;
  referralCode: string;
}

export const EarnMoreXp: React.FC<EarnMoreXpProps> = ({
  missions,
  onCompleteDaily,
  onClaimStreak,
  onSimulateReferral,
  onJumpToGames,
  streakDays,
  streakClaimed,
  dailyCompleted,
  referralCode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    sounds.playTap();
    navigator.clipboard?.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b233a] border border-[#2b3558] text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCELERATED EARNING</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
            EARN MORE XP & REWARDS
          </h2>
          <p className="mt-1 text-xs sm:text-base text-slate-300">
            Complete daily protocols, maintain streaks, and invite peers to expedite your Level 05 advancement.
          </p>
        </div>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: DAILY CHALLENGE */}
        <div className="rounded-2xl bg-gradient-to-b from-[#192036] to-[#121626] border border-[#283252] p-5 shadow-lg flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 uppercase tracking-wider">
                DAILY PROTOCOL
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono-numbers">+50 XP &bull; +10 VEs</span>
            </div>

            <div className="flex items-start gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white">Daily Security Check-In</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Perform the daily security telemetry sync to maintain system integrity and receive instantaneous tier credit.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#232b47] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {dailyCompleted ? 'Completed for today' : 'Available now'}
            </span>
            <button
              disabled={dailyCompleted}
              onClick={() => {
                sounds.playCoin();
                onCompleteDaily();
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dailyCompleted
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
              }`}
            >
              {dailyCompleted ? '✓ Completed' : 'Check In (+50 XP)'}
            </button>
          </div>
        </div>

        {/* CARD 2: PLAY & EARN */}
        <div className="rounded-2xl bg-gradient-to-b from-[#192036] to-[#121626] border border-[#283252] p-5 shadow-lg flex flex-col justify-between group hover:border-cyan-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 uppercase tracking-wider">
                SKILL GAMES
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono-numbers">+25 XP / Game</span>
            </div>

            <div className="flex items-start gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white">Play & Earn Mini-Games</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Jump into VELOOP Guardian Run, VE Coin Catch, or Reward Match to build XP multipliers through reflex mastery.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#232b47] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">5 Active Mini-Games</span>
            <button
              onClick={() => {
                sounds.playTap();
                onJumpToGames();
              }}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Open Games Hub
            </button>
          </div>
        </div>

        {/* CARD 3: REFERRAL MISSION */}
        <div className="rounded-2xl bg-gradient-to-b from-[#192036] to-[#121626] border border-[#283252] p-5 shadow-lg flex flex-col justify-between group hover:border-purple-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300 uppercase tracking-wider">
                COMMUNITY
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono-numbers">+100 XP &bull; +50 VEs</span>
            </div>

            <div className="flex items-start gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white">Referral Mission</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Distribute your personal VELOOP invite key. Earn institutional bounty XP when colleagues join the network.
                </p>
              </div>
            </div>

            {/* Referral code copy box */}
            <div className="mt-3 flex items-center justify-between bg-[#0e121e] px-3 py-1.5 rounded-lg border border-[#20273d]">
              <span className="text-xs font-mono font-bold text-slate-300">{referralCode}</span>
              <button
                onClick={handleCopyCode}
                className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#232b47] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Instant validation</span>
            <button
              onClick={() => {
                sounds.playCoin();
                onSimulateReferral();
              }}
              className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Simulate Invite (+100 XP)
            </button>
          </div>
        </div>

        {/* CARD 4: STREAK XP */}
        <div className="rounded-2xl bg-gradient-to-b from-[#192036] to-[#121626] border border-[#283252] p-5 shadow-lg flex flex-col justify-between group hover:border-amber-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 uppercase tracking-wider">
                STREAK INTEGRITY
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono-numbers">+30 XP</span>
            </div>

            <div className="flex items-start gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white">5-Day Velocity Streak</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Consecutive daily activity creates compounded XP yield and rewards tier multipliers.
                </p>
              </div>
            </div>

            {/* 7-Day Streak Pills */}
            <div className="flex items-center justify-between mt-3 px-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span
                    className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center border ${
                      day <= streakDays
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-[#101320] border-slate-800 text-slate-600'
                    }`}
                  >
                    D{day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#232b47] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{streakDays}/7 Days Completed</span>
            <button
              disabled={streakClaimed}
              onClick={() => {
                sounds.playCoin();
                onClaimStreak();
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                streakClaimed
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
              }`}
            >
              {streakClaimed ? '✓ Claimed Today' : 'Claim Streak (+30 XP)'}
            </button>
          </div>
        </div>

        {/* CARD 5: BONUS MISSION (COMING SOON) */}
        <div className="rounded-2xl bg-[#131625]/80 border border-[#20273f] p-5 shadow-lg flex flex-col justify-between opacity-75">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 uppercase tracking-wider">
                COMING SOON
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono-numbers">+200 XP</span>
            </div>

            <div className="flex items-start gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-slate-300">VELOOP Partner Liquidity</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Link verified merchant checkout methods to claim elevated transaction multipliers and partner cashbacks.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#1d2338] flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Scheduled for Q4 release</span>
            <span className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-500 text-xs font-medium border border-slate-700">
              COMING SOON
            </span>
          </div>
        </div>

        {/* CARD 6: WATCH & EARN (COMING SOON) */}
        <div className="rounded-2xl bg-[#131625]/80 border border-[#20273f] p-5 shadow-lg flex flex-col justify-between opacity-75">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 uppercase tracking-wider">
                COMING SOON
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono-numbers">+75 XP</span>
            </div>

            <div className="flex items-start gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-slate-300">Product Briefings & Insights</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Interactive video briefings on upcoming VELOOP institutional features and decentralized rewards mechanics.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#1d2338] flex items-center justify-between">
            <span className="text-[11px] text-slate-500">In certification</span>
            <span className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-500 text-xs font-medium border border-slate-700">
              COMING SOON
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
