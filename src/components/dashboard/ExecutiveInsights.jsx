import React, { useMemo } from 'react';
import { Sparkles, Award, AlertTriangle, Cpu, MapPin, Layers } from 'lucide-react';
import { calculateExecutiveInsights } from '../../services/aiAnalysisService';
import { useTheme } from '../../context/ThemeContext';

export function ExecutiveHighlightCards({ proposals = [], className = '' }) {
  const { themeConfig } = useTheme();
  const insights = useMemo(() => calculateExecutiveInsights(proposals), [proposals]);
  const exec = themeConfig.executiveCards;

  const containerClass = className || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4";

  return (
    <div className={containerClass}>
      {/* Card 1: Quarterly Wins */}
      <div className={`p-5 rounded-2xl shadow-xl relative overflow-hidden group transition-all ${exec.winsCard}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">Quarterly Wins</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl font-black font-mono tracking-tight ${themeConfig.textPrimary}`}>
          {insights.quarterlyWins} <span className="text-xs font-sans font-semibold text-emerald-500 dark:text-emerald-400">Proposals Won</span>
        </div>
        <p className={`text-[11px] mt-1 ${themeConfig.textSecondary}`}>Confirmed victories in recent quarter</p>
      </div>

      {/* Card 2: Quarterly Losses */}
      <div className={`p-5 rounded-2xl shadow-xl relative overflow-hidden group transition-all ${exec.lossesCard}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">Quarterly Losses</span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl font-black font-mono tracking-tight ${themeConfig.textPrimary}`}>
          {insights.quarterlyLosses} <span className="text-xs font-sans font-semibold text-rose-500 dark:text-rose-400">Proposals Lost</span>
        </div>
        <p className={`text-[11px] mt-1 ${themeConfig.textSecondary}`}>Missed deals in recent quarter</p>
      </div>

      {/* Card 3: Highest Demand Scope */}
      <div className={`p-5 rounded-2xl shadow-xl relative overflow-hidden group transition-all ${exec.scopeCard}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">Highest Demand Scope</span>
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-sm font-bold tracking-tight leading-snug line-clamp-2 ${themeConfig.textPrimary}`}>
          {insights.highestDemandScope}
        </div>
        <p className={`text-[11px] mt-1 ${themeConfig.textSecondary}`}>Top requested QE capability</p>
      </div>

      {/* Card 4: Highest Opportunity Region */}
      <div className={`p-5 rounded-2xl shadow-xl relative overflow-hidden group transition-all ${exec.regionCard}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Highest Opportunity Region</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-sm font-bold tracking-tight leading-snug line-clamp-2 ${themeConfig.textPrimary}`}>
          {insights.highestOpportunityRegion}
        </div>
        <p className={`text-[11px] mt-1 ${themeConfig.textSecondary}`}>Geographical demand leader</p>
      </div>
    </div>
  );
}

export function ExecutiveAiSummaryCard({ proposals = [], className = '' }) {
  const { themeConfig } = useTheme();
  const insights = useMemo(() => calculateExecutiveInsights(proposals), [proposals]);
  const exec = themeConfig.executiveCards;

  return (
    <div className={`p-6 rounded-2xl shadow-2xl relative overflow-hidden transition-all ${exec.aiCard} ${className}`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
          themeConfig.mode === 'light'
            ? 'bg-blue-600 text-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
            : 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white border-indigo-400/40 shadow-indigo-500/30'
        }`}>
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-black tracking-tight ${themeConfig.textPrimary}`}>
                AI Win/Loss Synthesis
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-mono ${
                themeConfig.mode === 'light'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-900 font-bold'
                  : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                NLP Pattern Engine
              </span>
            </div>
          </div>

          <p className={`text-sm leading-relaxed p-4 rounded-xl shadow-inner ${exec.aiTextBubble}`}>
            "{insights.aiSummary}"
          </p>

          <div className={`flex items-center justify-between mt-3 text-[11px] ${themeConfig.textSecondary}`}>
            <span>Automatically generated from sentiment analysis of proposal win/loss feedback reasons.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveInsights({
  proposals = [],
  className = '',
  showAi = true,
  showHighlights = true,
  showHeader = true
}) {
  const { themeConfig } = useTheme();
  const exec = themeConfig.executiveCards;

  return (
    <div className={`mb-8 ${className}`}>
      {/* Header Banner */}
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${exec.bannerIcon}`}>
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight flex items-center gap-2 ${themeConfig.textPrimary}`}>
                <span>Executive Briefing & AI Intelligence</span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${exec.bannerBadge}`}>
                  Premium Insights
                </span>
              </h2>
              <p className={`text-xs font-medium ${themeConfig.textSecondary}`}>
                Real-time synthesized executive signals & win/loss dynamics
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Highlight Cards */}
      {showHighlights && <ExecutiveHighlightCards proposals={proposals} />}

      {/* AI Win/Loss Analysis Card */}
      {showAi && <ExecutiveAiSummaryCard proposals={proposals} />}
    </div>
  );
}
