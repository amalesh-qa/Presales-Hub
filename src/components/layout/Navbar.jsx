import React from 'react';
import { LogOut, Building2, Shield, User as UserIcon } from 'lucide-react';

export default function Navbar({ currentUser, onLogout }) {
  // Extract user's first name
  const firstName = currentUser?.name?.split(' ')[0] || 'User';
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-tight">Presales Tracker</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5 font-medium">Enterprise QE Analytics</span>
          </div>
        </div>

        {/* Right Side: Welcome Greeting, Role Badge & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
              {firstName[0].toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200">
                Welcome, {firstName}!
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <Shield className="w-3 h-3" /> Admin Role
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-300 font-semibold">
                    <UserIcon className="w-3 h-3" /> Standard Role
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout of session"
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/15 hover:border-rose-500/40 border border-slate-700/60 text-slate-300 hover:text-rose-300 font-medium text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
