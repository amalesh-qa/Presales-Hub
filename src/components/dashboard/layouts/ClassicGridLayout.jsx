import React from 'react';
import KpiCards from '../KpiCards';
import ExecutiveInsights from '../ExecutiveInsights';
import OutcomeChart from '../OutcomeChart';
import RegionChart from '../RegionChart';
import CapabilityChart from '../CapabilityChart';
import VelocityChart from '../VelocityChart';
import DataFilterBar from '../DataFilterBar';
import ProposalTable from '../ProposalTable';

export default function ClassicGridLayout({
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
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. KPI Summary Cards (4-Column Balanced Grid) */}
      <KpiCards proposals={proposals} />

      {/* 2. Executive Briefing & AI Intelligence */}
      <ExecutiveInsights proposals={proposals} />

      {/* 3. 2x2 Data Visualization Grid */}
      <div id="charts-grid-container" className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${showTable ? 'mb-8' : 'mb-0'}`}>
        <OutcomeChart proposals={filteredProposals} />
        <RegionChart proposals={filteredProposals} />
        <CapabilityChart proposals={filteredProposals} />
        <VelocityChart proposals={filteredProposals} />
      </div>

      {/* 4. Interactive Data Filter Bar */}
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

      {/* 5. Detailed Proposals Ledger Table */}
      <ProposalTable
        proposals={filteredProposals}
        showTable={showTable}
        onToggleTable={onToggleTable}
      />
    </div>
  );
}
