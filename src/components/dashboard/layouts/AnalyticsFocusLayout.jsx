import React from 'react';
import KpiCards from '../KpiCards';
import { ExecutiveAiSummaryCard, ExecutiveHighlightCards } from '../ExecutiveInsights';
import OutcomeChart from '../OutcomeChart';
import RegionChart from '../RegionChart';
import CapabilityChart from '../CapabilityChart';
import VelocityChart from '../VelocityChart';
import DataFilterBar from '../DataFilterBar';
import ProposalTable from '../ProposalTable';
import { Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function AnalyticsFocusLayout({
  proposals,
  filteredProposals,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedScope,
  setSelectedScope,
  selectedStatus,
  setSelectedStatus,
  regions,
  scopes,
  onReset,
  showTable,
  onToggleTable
}) {
  const { themeConfig } = useTheme();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. TOP HERO INTELLIGENCE BANNER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider ${themeConfig.textPrimary}`}>
              Executive Intelligence & AI Win/Loss Synthesis
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            themeConfig.mode === 'light'
              ? 'bg-blue-100 text-blue-900 border-slate-900 font-bold'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
          }`}>
            Analytics Showcase Mode
          </span>
        </div>

        {/* AI Synthesis Hero Card */}
        <ExecutiveAiSummaryCard proposals={proposals} />

        {/* Compact KPI Metric Ribbon */}
        <KpiCards
          proposals={proposals}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        />
      </div>

      {/* 2. FEATURED HERO ANALYTICS CENTERPIECE */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className={`text-xs font-bold uppercase tracking-wider ${themeConfig.textPrimary}`}>
            Pipeline Velocity & Conversion Trends
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Velocity Line/Area Chart (Featured 7-column span) */}
          <div className="lg:col-span-7">
            <VelocityChart proposals={filteredProposals} className="h-[400px]" />
          </div>

          {/* Outcome Donut Chart (5-column span) */}
          <div className="lg:col-span-5">
            <OutcomeChart proposals={filteredProposals} className="h-[400px]" />
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE HIGHLIGHT CARDS (STRATEGIC STRIP) */}
      <div className="pt-2">
        <ExecutiveHighlightCards
          proposals={proposals}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        />
      </div>

      {/* 4. SECONDARY COMPARISONS (GEOGRAPHIC & CAPABILITY SPREAD) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-400" />
          <span className={`text-xs font-bold uppercase tracking-wider ${themeConfig.textPrimary}`}>
            Market Geography & Technical Capability Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegionChart proposals={filteredProposals} className="h-[360px]" />
          <CapabilityChart proposals={filteredProposals} className="h-[360px]" />
        </div>
      </div>

      {/* 5. FILTER BAR & PROPOSALS LEDGER */}
      <div className="pt-4 space-y-4">
        <DataFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          regions={regions}
          scopes={scopes}
          onReset={onReset}
          showTable={showTable}
          onToggleTable={onToggleTable}
        />

        <ProposalTable
          proposals={filteredProposals}
          showTable={showTable}
          onToggleTable={onToggleTable}
        />
      </div>
    </div>
  );
}
