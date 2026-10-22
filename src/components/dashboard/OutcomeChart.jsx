import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function OutcomeChart({ proposals = [], className = '' }) {
  const { themeConfig } = useTheme();
  const colors = themeConfig.chartTheme.outcomeColors;

  const counts = { Won: 0, Lost: 0, Pending: 0, 'On Hold': 0 };

  proposals.forEach(p => {
    if (counts[p.status] !== undefined) {
      counts[p.status]++;
    } else {
      counts.Pending++;
    }
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      const total = proposals.length || 1;
      const pct = Math.round((dataPoint.value / total) * 100);
      return (
        <div className={`${themeConfig.chartTheme.tooltipBg} ${themeConfig.chartTheme.tooltipBorder} p-3 rounded-xl shadow-xl text-xs`}>
          <div className={`${themeConfig.chartTheme.tooltipTitle} flex items-center gap-2`}>
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: dataPoint.payload.fill || colors[dataPoint.name] }}
            ></span>
            {dataPoint.name}
          </div>
          <div className={`${themeConfig.chartTheme.tooltipValue} mt-1 font-mono`}>
            {dataPoint.value} Proposals ({pct}%)
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
              : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
          }`}>
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm ${themeConfig.cardHeader}`}>Proposal Outcome Distribution</h3>
            <p className={`text-[11px] ${themeConfig.cardSubtitle}`}>Breakdown by deal status</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-xs font-medium ${themeConfig.textMuted}`}>
            No proposal outcome data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[entry.name] || '#94a3b8'}
                    stroke={themeConfig.chartTheme.pieStroke}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className={`text-xs font-bold ${themeConfig.textSecondary}`}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
