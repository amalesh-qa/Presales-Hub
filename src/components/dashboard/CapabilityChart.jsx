import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CapabilityChart({ proposals = [], className = '' }) {
  const { themeConfig } = useTheme();
  const capabilityColors = themeConfig.chartTheme.capabilityColors;

  const scopeCounts = {};

  proposals.forEach(p => {
    const scope = p.qeScope || 'General QA';
    scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
  });

  const data = Object.entries(scopeCounts)
    .map(([scope, count]) => ({ scope, count }))
    .sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className={`${themeConfig.chartTheme.tooltipBg} ${themeConfig.chartTheme.tooltipBorder} p-3 rounded-xl shadow-xl text-xs`}>
          <div className={`${themeConfig.chartTheme.tooltipTitle} flex items-center gap-2`}>
            <Layers className="w-3.5 h-3.5 text-current" />
            {dataPoint.scope}
          </div>
          <div className={`${themeConfig.chartTheme.tooltipValue} mt-1 font-mono`}>
            {dataPoint.count} Demand Proposals
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
              ? 'bg-amber-100 text-amber-800 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm ${themeConfig.cardHeader}`}>QE Capability Demand</h3>
            <p className={`text-[11px] ${themeConfig.cardSubtitle}`}>Most requested QE service offerings</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-xs font-medium ${themeConfig.textMuted}`}>
            No QE capability data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 15, right: 30, left: 30, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={themeConfig.chartTheme.gridStroke} horizontal={false} />
              <XAxis
                type="number"
                stroke={themeConfig.chartTheme.axisStroke}
                allowDecimals={false}
                tick={{ fill: themeConfig.chartTheme.tickFill, fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="scope"
                stroke={themeConfig.chartTheme.axisStroke}
                tick={{ fill: themeConfig.chartTheme.tickFill, fontSize: 10, fontWeight: 600 }}
                width={130}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={capabilityColors[index % capabilityColors.length]}
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
