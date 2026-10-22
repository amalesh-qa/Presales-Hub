import React from 'react';
import KpiCards from '../KpiCards';
import { ExecutiveAiSummaryCard, ExecutiveHighlightCards } from '../ExecutiveInsights';
import OutcomeChart from '../OutcomeChart';
import RegionChart from '../RegionChart';
import CapabilityChart from '../CapabilityChart';
import VelocityChart from '../VelocityChart';
import DataFilterBar from '../DataFilterBar';
import ProposalTable from '../ProposalTable';
import { Sparkles, TrendingUp, Globe2, FileSpreadsheet, Compass } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function ModernVisualLayout({
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
    <div className="space-y-10 animate-fadeIn">
      
      {/* CHAPTER 1: STRATEGIC BRIEFING & AI INTELLIGENCE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className={`text-xs font-black uppercase tracking-wider block ${themeConfig.textPrimary}`}>
                Story Chapter 1: Strategic Briefing & Win/Loss Synthesis
              </span>
              <span className={`text-[10px] ${themeConfig.textSecondary}`}>
                Executive overview synthesized from live presales data
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
            Editorial Storyboard
          </span>
        </div>

        {/* Hero AI Win/Loss Synthesis */}
        <ExecutiveAiSummaryCard proposals={proposals} />

        {/* 4 Highlights Ribbon */}
        <ExecutiveHighlightCards
          proposals={proposals}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        />
      </section>

      {/* CHAPTER 2: PIPELINE HEALTH & DEAL VELOCITY */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className={`text-xs font-black uppercase tracking-wider block ${themeConfig.textPrimary}`}>
              Story Chapter 2: Pipeline Momentum & Conversion Dynamics
            </span>
            <span className={`text-[10px] ${themeConfig.textSecondary}`}>
              Key performance indicators and monthly velocity acceleration
            </span>
          </div>
        </div>

        {/* KPI Spotlight Cards */}
        <KpiCards
          proposals={proposals}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        />

        {/* Visual Pair: Velocity Trend + Outcome Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <VelocityChart proposals={filteredProposals} className="h-[380px]" />
          </div>
          <div className="lg:col-span-5">
            <OutcomeChart proposals={filteredProposals} className="h-[380px]" />
          </div>
        </div>
      </section>

      {/* CHAPTER 3: MARKET LANDSCAPE & QE DEMAND */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-blue-500/20">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <span className={`text-xs font-black uppercase tracking-wider block ${themeConfig.textPrimary}`}>
              Story Chapter 3: Global Footprint & Capability Demand
            </span>
            <span className={`text-[10px] ${themeConfig.textSecondary}`}>
              Regional market distribution and high-demand QE offerings
            </span>
          </div>
        </div>

        {/* Secondary Visual Pair: Regional + Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegionChart proposals={filteredProposals} className="h-[360px]" />
          <CapabilityChart proposals={filteredProposals} className="h-[360px]" />
        </div>
      </section>

      {/* CHAPTER 4: OPPORTUNITY REPOSITORY & AUDIT LEDGER */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <span className={`text-xs font-black uppercase tracking-wider block ${themeConfig.textPrimary}`}>
              Story Chapter 4: Proposal Ledger & Interactive Exploration
            </span>
            <span className={`text-[10px] ${themeConfig.textSecondary}`}>
              Searchable proposal records with multidimensional filters
            </span>
          </div>
        </div>

        {/* Filter Bar */}
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

        {/* Detailed Table */}
        <ProposalTable
          proposals={filteredProposals}
          showTable={showTable}
          onToggleTable={onToggleTable}
        />
      </section>

    </div>
  );
}
