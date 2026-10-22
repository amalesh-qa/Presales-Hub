import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function RegionChart({ proposals = [], className = '' }) {
  const { themeConfig } = useTheme();
  const regionColors = themeConfig.chartTheme.regionColors;

  const regionCounts = {};

  proposals.forEach(p => {
    const region = p.region || 'Unspecified';
    regionCounts[region] = (regionCounts[region] || 0) + 1;
  });

  const data = Object.entries(regionCounts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className={`${themeConfig.chartTheme.tooltipBg} ${themeConfig.chartTheme.tooltipBorder} p-3 rounded-xl shadow-xl text-xs`}>
          <div className={`${themeConfig.chartTheme.tooltipTitle} flex items-center gap-2`}>
            <Globe className="w-3.5 h-3.5 text-current" />
            {dataPoint.region}
          </div>
          <div className={`${themeConfig.chartTheme.tooltipValue} mt-1 font-mono`}>
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
              ? 'bg-blue-100 text-blue-700 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}>
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm ${themeConfig.cardHeader}`}>Proposals by Geographic Region</h3>
            <p className={`text-[11px] ${themeConfig.cardSubtitle}`}>Proposal volume per territory</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-xs font-medium ${themeConfig.textMuted}`}>
            No regional data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeConfig.chartTheme.gridStroke} vertical={false} />
              <XAxis
                dataKey="region"
                stroke={themeConfig.chartTheme.axisStroke}
                tick={{ fill: themeConfig.chartTheme.tickFill, fontSize: 11, fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke={themeConfig.chartTheme.axisStroke}
                tick={{ fill: themeConfig.chartTheme.tickFill, fontSize: 11 }}
                allowDecimals={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={regionColors[index % regionColors.length]}
                    stroke={themeConfig.mode === 'light' ? '#0f172a' : 'transparent'}
                    strokeWidth={themeConfig.mode === 'light' ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
