import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = {
  Won: '#10b981',    // Emerald
  Lost: '#f43f5e',   // Rose
  Pending: '#f59e0b',// Amber
  'On Hold': '#6366f1' // Indigo
};

export default function OutcomeChart({ proposals = [] }) {
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
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <div className="font-bold text-slate-100 flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: dataPoint.payload.fill || COLORS[dataPoint.name] }}
            ></span>
            {dataPoint.name}
          </div>
          <div className="text-slate-300 mt-1 font-mono">
            {dataPoint.value} Proposals ({pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between h-[380px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Proposal Outcome Distribution</h3>
            <p className="text-[11px] text-slate-400 font-medium">Breakdown by deal status</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
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
                    fill={COLORS[entry.name] || '#94a3b8'}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs font-semibold text-slate-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
