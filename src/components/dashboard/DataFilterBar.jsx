import React from 'react';
import { Search, Filter, RotateCcw, EyeOff, Eye } from 'lucide-react';

export default function DataFilterBar({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedScope,
  setSelectedScope,
  selectedStatus,
  setSelectedStatus,
  regions = [],
  scopes = [],
  onReset,
  showTable = true,
  onToggleTable
}) {
  const hasActiveFilters = searchQuery || selectedRegion !== 'All' || selectedScope !== 'All' || selectedStatus !== 'All';

  // If table is hidden, don't render filter toolbar in DOM if requested, or render compact toggle
  if (!showTable) {
    return (
      <div id="dashboard-filter-bar" className="hidden border-0 p-0 m-0 no-capture"></div>
    );
  }

  return (
    <div id="dashboard-filter-bar" className="glass-card rounded-2xl p-4 border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunity or client..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
        />
      </div>

      {/* Dropdown Filters & Ignore Ledger Toggle */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filter By:</span>
        </div>

        {/* Region Filter */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
        >
          <option value="All">All Regions</option>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* QE Scope Filter */}
        <select
          value={selectedScope}
          onChange={(e) => setSelectedScope(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
        >
          <option value="All">All QE Scopes</option>
          {scopes.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
          <option value="Pending">Pending</option>
          <option value="On Hold">On Hold</option>
        </select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* PROMINENT IGNORE DETAILED LEDGER TOGGLE */}
        <button
          onClick={onToggleTable}
          title={showTable ? 'Ignore/Hide the Detailed QE Proposals Ledger table' : 'Show the Detailed QE Proposals Ledger table'}
          className="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
        >
          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
          <span>Ignore Ledger</span>
        </button>
      </div>
    </div>
  );
}
