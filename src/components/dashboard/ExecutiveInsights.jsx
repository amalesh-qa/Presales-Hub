import React, { useMemo } from 'react';
import { Sparkles, Award, AlertTriangle, Cpu, MapPin, Layers, RefreshCw } from 'lucide-react';
import { calculateExecutiveInsights } from '../../services/aiAnalysisService';

export default function ExecutiveInsights({ proposals = [] }) {
  const insights = useMemo(() => {
    return calculateExecutiveInsights(proposals);
  }, [proposals]);

  return (
    <div className="mb-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 border border-amber-400/30">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Executive Briefing & AI Intelligence</span>
              <span className="text-[10px] uppercase font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Premium Insights
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">Real-time synthesized executive signals & win/loss dynamics</p>
          </div>
        </div>
      </div>

      {/* Grid of Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        
        {/* Card 1: Quarterly Wins */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Quarterly Wins</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {insights.quarterlyWins} <span className="text-xs font-sans font-semibold text-emerald-400">Proposals Won</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed victories in recent quarter</p>
        </div>

        {/* Card 2: Quarterly Losses */}
        <div className="glass-card rounded-2xl p-5 border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Quarterly Losses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {insights.quarterlyLosses} <span className="text-xs font-sans font-semibold text-rose-400">Proposals Lost</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Missed deals in recent quarter</p>
        </div>

        {/* Card 3: Highest Demand Scope */}
        <div className="glass-card rounded-2xl p-5 border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-slate-950 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Highest Demand Scope</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
            {insights.highestDemandScope}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Top requested QE capability</p>
        </div>

        {/* Card 4: Highest Opportunity Region */}
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Highest Opportunity Region</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
            {insights.highestOpportunityRegion}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Geographical demand leader</p>
        </div>

      </div>

      {/* AI Win/Loss Analysis Card */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/40 bg-gradient-to-r from-indigo-950/80 via-slate-900/95 to-slate-950 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 border border-indigo-400/40">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-tight">AI Win/Loss Synthesis</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  NLP Pattern Engine
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-indigo-200 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-indigo-900/50 shadow-inner">
              "{insights.aiSummary}"
            </p>

            <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
              <span>Automatically generated from sentiment analysis of proposal win/loss feedback reasons.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
