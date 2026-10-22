import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, Lock, RefreshCw, Radio, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TabNavigation({
  activeTab,
  setActiveTab,
  currentUser,
  syncStatus = 'connected',
  lastSyncTime = null,
  dataMode = 'google_sheet',
  onManualSync = () => {},
  isSyncing = false
}) {
  const { themeConfig } = useTheme();
  const isAdmin = currentUser?.role === 'Admin';

  // Relative time counter
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 2000);
    return () => clearInterval(timer);
  }, []);

  const getRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(isoString)) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className={`${themeConfig.tabsBg} px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex space-x-2 py-3" aria-label="Tabs">
          {/* Dashboard Tab (Both Admin & User) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? themeConfig.tabActive
                : themeConfig.tabInactive
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Configuration Tab (Admin Only) */}
          {isAdmin ? (
            <button
              onClick={() => setActiveTab('configuration')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'configuration'
                  ? themeConfig.tabActive
                  : themeConfig.tabInactive
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                themeConfig.mode === 'light'
                  ? 'bg-amber-400 text-slate-900 border border-slate-900 font-bold'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                Admin
              </span>
            </button>
          ) : (
            <div
              title="Configuration page is restricted to Admin role"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-600 cursor-not-allowed text-xs font-semibold select-none opacity-60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Configuration</span>
              <span className="ml-1 text-[9px] bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-500 px-1.5 py-0.5 rounded font-mono">
                Admin Only
              </span>
            </div>
          )}
        </nav>

        {/* Dynamic Live Sync Indicator Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {dataMode === 'local_upload' ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-[11px]">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx) Active</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onManualSync(true)}
              title={`Click to force sync now. Last synced ${getRelativeTime(lastSyncTime)}`}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition cursor-pointer font-mono text-[11px] ${
                syncStatus === 'error'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : isSyncing || syncStatus === 'syncing'
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isSyncing || syncStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
              ) : syncStatus === 'error' ? (
                <AlertCircle className="w-3 h-3 text-rose-400" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}

              <span>
                {isSyncing || syncStatus === 'syncing'
                  ? 'Syncing...'
                  : syncStatus === 'error'
                    ? 'Sync Error (Click to retry)'
                    : `Live Sync Active (${getRelativeTime(lastSyncTime)})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
