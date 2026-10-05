import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function VelocityChart({ proposals = [] }) {
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
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            {dataPoint.month}
          </div>
          <div className="text-slate-300 mt-1 font-mono">
            {dataPoint.count} Proposals Submitted
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
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Proposal Velocity Trend</h3>
            <p className="text-[11px] text-slate-400 font-medium">Submission cadence over time</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
            No proposal timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                allowDecimals={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#velocityGradient)"
                dot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#a5b4fc', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
