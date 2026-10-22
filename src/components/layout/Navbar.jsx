import React from 'react';
import { LogOut, Building2, Shield, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeSelector from '../common/ThemeSelector';
import LayoutSelector from '../common/LayoutSelector';

export default function Navbar({ currentUser, onLogout }) {
  const { themeConfig } = useTheme();
  const firstName = currentUser?.name?.split(' ')[0] || 'User';
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <header className={`${themeConfig.navbarBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${themeConfig.navbarBrandIcon}`}>
            <Building2 className="w-5 h-5 text-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-extrabold tracking-tight ${themeConfig.textPrimary}`}>
                Presales Tracker
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${themeConfig.navbarBadge}`}>
                v1.0
              </span>
            </div>
            <span className={`text-[11px] block -mt-0.5 font-medium ${themeConfig.textSecondary}`}>
              Enterprise QE Analytics
            </span>
          </div>
        </div>

        {/* Right Side: Layout Switcher, Theme Switcher, Welcome Greeting, Role Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* LAYOUT SWITCHER DROPDOWN */}
          <LayoutSelector />

          {/* THEME SWITCHER DROPDOWN */}
          <ThemeSelector />

          {/* User Profile Pill */}
          <div className={`hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all ${themeConfig.navbarUserPill}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${themeConfig.navbarUserAvatar}`}>
              {firstName[0].toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight">
                Welcome, {firstName}!
              </div>
              <div className="flex items-center gap-1.5 text-[10px] opacity-80 mt-0.5">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                    <Shield className="w-3 h-3" /> Admin Role
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <UserIcon className="w-3 h-3" /> Standard Role
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout of session"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              themeConfig.mode === 'light'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
                : 'bg-slate-800/80 hover:bg-rose-500/15 hover:border-rose-500/40 border border-slate-700/60 text-slate-300 hover:text-rose-300'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
