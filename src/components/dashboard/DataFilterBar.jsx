import React from 'react';
import { Search, Filter, RotateCcw, EyeOff, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const { themeConfig } = useTheme();
  const hasActiveFilters = searchQuery || selectedRegion !== 'All' || selectedScope !== 'All' || selectedStatus !== 'All';

  // If table is hidden, don't render filter toolbar in DOM if requested, or render compact toggle
  if (!showTable) {
    return (
      <div id="dashboard-filter-bar" className="hidden border-0 p-0 m-0 no-capture"></div>
    );
  }

  return (
    <div id="dashboard-filter-bar" className={`${themeConfig.filterContainer} p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-200`}>
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-60">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunity or client..."
          className={`w-full pl-9 pr-4 py-2 text-xs font-medium transition-all ${themeConfig.inputClass}`}
        />
      </div>

      {/* Dropdown Filters & Ignore Ledger Toggle */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className={`flex items-center gap-1.5 text-xs font-bold ${themeConfig.textSecondary}`}>
          <Filter className="w-3.5 h-3.5" style={{ color: themeConfig.swatch[0] }} />
          <span>Filter By:</span>
        </div>

        {/* Region Filter */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className={`px-3 py-2 text-xs font-semibold cursor-pointer ${themeConfig.selectClass}`}
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
          className={`px-3 py-2 text-xs font-semibold cursor-pointer ${themeConfig.selectClass}`}
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
          className={`px-3 py-2 text-xs font-semibold cursor-pointer ${themeConfig.selectClass}`}
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
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              themeConfig.mode === 'light'
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
                : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* PROMINENT IGNORE DETAILED LEDGER TOGGLE */}
        <button
          onClick={onToggleTable}
          title={showTable ? 'Ignore/Hide the Detailed QE Proposals Ledger table' : 'Show the Detailed QE Proposals Ledger table'}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${themeConfig.buttonSecondary}`}
        >
          <EyeOff className="w-3.5 h-3.5 opacity-70" />
          <span>Ignore Ledger</span>
        </button>
      </div>
    </div>
  );
}
