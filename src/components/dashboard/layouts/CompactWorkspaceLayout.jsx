import React from 'react';
import KpiCards from '../KpiCards';
import { ExecutiveHighlightCards, ExecutiveAiSummaryCard } from '../ExecutiveInsights';
import OutcomeChart from '../OutcomeChart';
import RegionChart from '../RegionChart';
import CapabilityChart from '../CapabilityChart';
import VelocityChart from '../VelocityChart';
import DataFilterBar from '../DataFilterBar';
import ProposalTable from '../ProposalTable';
import { PanelsTopLeft, Activity, BarChart3 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function CompactWorkspaceLayout({
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
      {/* Workspace Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <PanelsTopLeft className="w-4 h-4" />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider block ${themeConfig.textPrimary}`}>
              Operational Command Workspace
            </span>
            <span className={`text-[10px] ${themeConfig.textSecondary}`}>
              High-density telemetry rail & analytical execution canvas
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Dual-Pane Grid
        </span>
      </div>

      {/* DUAL-PANE ASYMMETRIC WORKSPACE (Desktop: Left Rail 4 cols, Right Canvas 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT TELEMETRY RAIL (4 Columns on Desktop) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Section Title */}
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${themeConfig.textSecondary}`}>
              Pipeline Telemetry Rail
            </span>
          </div>

          {/* Stacked Vertical KPI Cards */}
          <KpiCards
            proposals={proposals}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5"
          />

          {/* Executive Highlights (2x2 Grid) */}
          <div className="space-y-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${themeConfig.textSecondary}`}>
              Quarterly Insights
            </span>
            <ExecutiveHighlightCards
              proposals={proposals}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3"
            />
          </div>

          {/* AI Win/Loss Synthesis Card */}
          <div className="space-y-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${themeConfig.textSecondary}`}>
              AI Synthesis
            </span>
            <ExecutiveAiSummaryCard proposals={proposals} />
          </div>
        </div>

        {/* RIGHT ANALYTICAL CANVAS (8 Columns on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                Visual Analytics Matrix
              </span>
            </div>
            <span className={`text-[10px] font-mono ${themeConfig.textMuted}`}>
              4 Coordinated Recharts
            </span>
          </div>

          {/* 2x2 Compact Charts Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OutcomeChart proposals={filteredProposals} className="h-[340px]" />
            <VelocityChart proposals={filteredProposals} className="h-[340px]" />
            <RegionChart proposals={filteredProposals} className="h-[340px]" />
            <CapabilityChart proposals={filteredProposals} className="h-[340px]" />
          </div>

          {/* Interactive Filter Bar */}
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

          {/* Detailed Proposals Ledger */}
          <ProposalTable
            proposals={filteredProposals}
            showTable={showTable}
            onToggleTable={onToggleTable}
          />
        </div>

      </div>
    </div>
  );
}
