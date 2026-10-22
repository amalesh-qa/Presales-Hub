import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function VelocityChart({ proposals = [], className = '' }) {
  const { themeConfig } = useTheme();
  const vTheme = themeConfig.chartTheme;

  // Aggregate proposals by Month (YYYY-MM or Month Name)
  const monthCounts = {};

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  proposals.forEach(p => {
    if (p.submissionDate) {
      const d = new Date(p.submissionDate);
      if (!isNaN(d)) {
        const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthCounts[sortKey]) {
          monthCounts[sortKey] = { month: monthKey, count: 0, sortKey };
        }
        monthCounts[sortKey].count++;
      }
    }
  });

  const data = Object.values(monthCounts).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className={`${vTheme.tooltipBg} ${vTheme.tooltipBorder} p-3 rounded-xl shadow-xl text-xs`}>
          <div className={`${vTheme.tooltipTitle} flex items-center gap-2`}>
            <TrendingUp className="w-3.5 h-3.5 text-current" />
            {dataPoint.month}
          </div>
          <div className={`${vTheme.tooltipValue} mt-1 font-mono`}>
            {dataPoint.count} Proposals Submitted
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${themeConfig.card} ${themeConfig.cardHover} p-6 flex flex-col justify-between ${className || 'h-[380px]'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            themeConfig.mode === 'light'
              ? 'bg-purple-100 text-purple-800 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm ${themeConfig.cardHeader}`}>Monthly Proposal Velocity Trend</h3>
            <p className={`text-[11px] ${themeConfig.cardSubtitle}`}>Submission cadence over time</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-xs font-medium ${themeConfig.textMuted}`}>
            No proposal timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={vTheme.velocityGradient.start} stopOpacity={vTheme.velocityGradient.startOpacity} />
                  <stop offset="95%" stopColor={vTheme.velocityGradient.end} stopOpacity={vTheme.velocityGradient.endOpacity} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={vTheme.gridStroke} vertical={false} />
              <XAxis
                dataKey="month"
                stroke={vTheme.axisStroke}
                tick={{ fill: vTheme.tickFill, fontSize: 11, fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke={vTheme.axisStroke}
                tick={{ fill: vTheme.tickFill, fontSize: 11 }}
                allowDecimals={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={vTheme.velocityStroke}
                strokeWidth={themeConfig.mode === 'light' ? 3.5 : 3}
                fillOpacity={1}
                fill="url(#velocityGradient)"
                dot={{
                  r: 5,
                  fill: vTheme.velocityDots.dotFill,
                  stroke: vTheme.velocityDots.dotStroke,
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 7,
                  fill: vTheme.velocityDots.activeFill,
                  stroke: vTheme.velocityDots.activeStroke,
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
