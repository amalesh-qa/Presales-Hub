import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers } from 'lucide-react';

const CAPABILITY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function CapabilityChart({ proposals = [] }) {
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
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            {dataPoint.scope}
          </div>
          <div className="text-slate-300 mt-1 font-mono">
            {dataPoint.count} Demand Proposals
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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">QE Capability Demand</h3>
            <p className="text-[11px] text-slate-400 font-medium">Most requested QE service offerings</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
            No QE capability data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 15, right: 30, left: 30, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="scope"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 500 }}
                width={130}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CAPABILITY_COLORS[index % CAPABILITY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
