import React from 'react';
import { Target, Trophy, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function KpiCards({ proposals = [], className = '', variant = 'grid' }) {
  const { themeConfig } = useTheme();

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
      key: 'total',
      title: 'Total Opportunities',
      subtitle: 'Total Proposals Submitted',
      count: totalProposals,
      badge: formattedTotalValue,
      badgeTitle: `Exact Sum of QE Estimated Deal Value: ${exactValueFormatted}`,
      badgeLabel: 'Pipeline Value',
      icon: Target,
      styles: themeConfig.kpiCards.total
    },
    {
      key: 'wins',
      title: 'Victories',
      subtitle: 'Proposals Won',
      count: victories,
      badge: `${winRate}%`,
      badgeLabel: 'Win Rate',
      icon: Trophy,
      styles: themeConfig.kpiCards.wins
    },
    {
      key: 'losses',
      title: 'Missed Opportunities',
      subtitle: 'Proposals Lost',
      count: missedOpportunities,
      badge: `${lossRate}%`,
      badgeLabel: 'Loss Rate',
      icon: XCircle,
      styles: themeConfig.kpiCards.losses
    },
    {
      key: 'pipeline',
      title: 'Active Pipeline',
      subtitle: 'In Pipeline / Pending',
      count: activePipeline,
      badge: `${totalProposals > 0 ? Math.round((activePipeline / totalProposals) * 100) : 0}%`,
      badgeLabel: 'In Pursuit',
      icon: Clock,
      styles: themeConfig.kpiCards.pipeline
    }
  ];

  const containerClass = className || "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8";

  return (
    <div className={containerClass}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`${themeConfig.card} ${themeConfig.cardHover} p-6 flex flex-col justify-between relative overflow-hidden group ${card.styles.hoverBorder} ${card.styles.glow}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block ${themeConfig.cardSubtitle}`}>
                  {card.title}
                </span>
                <span className={`text-[11px] font-medium ${themeConfig.textMuted}`}>
                  {card.subtitle}
                </span>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.styles.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div className={`text-3xl font-black tracking-tight font-mono ${themeConfig.textPrimary}`}>
                {card.count}
              </div>
              <div className="text-right">
                <span
                  title={card.badgeTitle || card.badge}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono cursor-help ${card.styles.badgeBg}`}
                >
                  <TrendingUp className="w-3 h-3 text-current" />
                  {card.badge}
                </span>
                <span className={`text-[10px] block mt-1 font-medium ${themeConfig.textMuted}`}>
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
