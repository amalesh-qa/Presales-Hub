import React from 'react';
import { Target, Trophy, XCircle, Clock, TrendingUp } from 'lucide-react';

export default function KpiCards({ proposals = [] }) {
  const totalProposals = proposals.length;
  const victories = proposals.filter(p => p.status === 'Won').length;
  const missedOpportunities = proposals.filter(p => p.status === 'Lost').length;
  const activePipeline = proposals.filter(p => p.status === 'Pending' || p.status === 'On Hold').length;

  const winRate = totalProposals > 0 ? Math.round((victories / totalProposals) * 100) : 0;
  const lossRate = totalProposals > 0 ? Math.round((missedOpportunities / totalProposals) * 100) : 0;

  // Pipeline Value = Exact sum of 'QE Estimated Deal Value' across all proposals in Proposal Tracker sheet
  const totalValue = proposals.reduce((acc, p) => acc + (p.contractValue || 0), 0);

  const formattedTotalValue = totalValue >= 1000000
    ? `$${(totalValue / 1000000).toFixed(2)}M`
    : totalValue >= 1000
    ? `$${(totalValue / 1000).toFixed(1)}K`
    : `$${totalValue.toLocaleString()}`;

  const exactValueFormatted = `$${totalValue.toLocaleString()}`;

  const cards = [
    {
      title: 'Total Opportunities',
      subtitle: 'Total Proposals Submitted',
      count: totalProposals,
      badge: formattedTotalValue,
      badgeTitle: `Exact Sum of QE Estimated Deal Value: ${exactValueFormatted}`,
      badgeLabel: 'Pipeline Value',
      icon: Target,
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      borderHover: 'hover:border-indigo-500/50',
      glow: 'glow-primary'
    },
    {
      title: 'Victories',
      subtitle: 'Proposals Won',
      count: victories,
      badge: `${winRate}%`,
      badgeLabel: 'Win Rate',
      icon: Trophy,
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      borderHover: 'hover:border-emerald-500/50',
      glow: 'glow-emerald'
    },
    {
      title: 'Missed Opportunities',
      subtitle: 'Proposals Lost',
      count: missedOpportunities,
      badge: `${lossRate}%`,
      badgeLabel: 'Loss Rate',
      icon: XCircle,
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      borderHover: 'hover:border-rose-500/50',
      glow: 'glow-rose'
    },
    {
      title: 'Active Pipeline',
      subtitle: 'In Pipeline / Pending',
      count: activePipeline,
      badge: `${totalProposals > 0 ? Math.round((activePipeline / totalProposals) * 100) : 0}%`,
      badgeLabel: 'In Pursuit',
      icon: Clock,
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      borderHover: 'hover:border-amber-500/50',
      glow: 'glow-amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group ${card.borderHover}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {card.subtitle}
                </span>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {card.count}
              </div>
              <div className="text-right">
                <span
                  title={card.badgeTitle || card.badge}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 font-mono cursor-help"
                >
                  <TrendingUp className="w-3 h-3 text-indigo-400" />
                  {card.badge}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1 font-medium">
                  {card.badgeLabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
