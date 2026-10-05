import React from 'react';
import { LayoutDashboard, Settings, Lock } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab, currentUser }) {
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div className="bg-slate-950/60 border-b border-slate-800/60 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex space-x-2 py-3" aria-label="Tabs">
          {/* Dashboard Tab (Both Admin & User) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Configuration Tab (Admin Only) */}
          {isAdmin ? (
            <button
              onClick={() => setActiveTab('configuration')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTab === 'configuration'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
              <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-emerald-500/30">
                Admin
              </span>
            </button>
          ) : (
            <div
              title="Configuration page is restricted to Admin role"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 cursor-not-allowed text-xs font-semibold select-none opacity-60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Configuration</span>
              <span className="ml-1 text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                Admin Only
              </span>
            </div>
          )}
        </nav>

        {/* Sync Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[11px] font-medium">Live Google Sheet Sync Active</span>
        </div>
      </div>
    </div>
  );
}
