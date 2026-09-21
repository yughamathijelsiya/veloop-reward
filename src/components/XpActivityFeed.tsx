import React from 'react';
import { Activity, Gamepad2, CheckCircle2, Flame, UserPlus, Zap, Coins } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const XpActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['iconType']) => {
    switch (type) {
      case 'game':
        return <Gamepad2 className="w-4 h-4 text-cyan-400" />;
      case 'daily':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'referral':
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
      <div className="rounded-3xl bg-[#141829] border border-[#262f4e] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white">XP Activity Timeline</h3>
              <p className="text-xs text-slate-400">Real-time ledger of completed challenges, missions, and rewards</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 px-3 py-1 rounded-lg bg-[#191f35] border border-[#273254]">
            {activities.length} Recorded Transactions
          </span>
        </div>

        {/* Activity items list */}
        <div className="space-y-3">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#111422] border border-[#202740] hover:border-[#2f3a5e] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#192036] border border-[#2b3558] flex items-center justify-center shrink-0">
                  {getIcon(item.iconType)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                  <span className="text-[11px] text-slate-400">{item.source} &bull; {item.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.ves && (
                  <span className="text-xs font-bold text-amber-300 font-mono-numbers px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" />
                    +{item.ves} VEs
                  </span>
                )}
                <span className="text-xs font-bold text-cyan-300 font-mono-numbers px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  +{item.xp} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
