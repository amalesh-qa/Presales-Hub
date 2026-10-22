import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown, Sparkles, Moon, Zap, Leaf, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const THEME_ICONS = {
  midnight: Moon,
  neobrutal: Zap,
  aurora: Leaf,
  sunset: Sun
};

export default function ThemeSelector({ className = '' }) {
  const { theme, setTheme, themeConfig, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ActiveIcon = THEME_ICONS[theme] || Palette;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Dashboard Theme"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          themeConfig.mode === 'light'
            ? 'bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5'
            : `${themeConfig.buttonSecondary} shadow-lg`
        }`}
      >
        <div className="flex items-center gap-1.5">
          <ActiveIcon className="w-4 h-4 text-indigo-400" style={{ color: themeConfig.swatch[0] }} />
          <span className="hidden sm:inline font-semibold">{themeConfig.name}</span>
          <span className="sm:hidden font-semibold">Theme</span>
        </div>

        {/* Mini 3-dot color swatch */}
        <div className="flex items-center -space-x-1">
          {themeConfig.swatch.map((color, idx) => (
            <span
              key={idx}
              className="w-2.5 h-2.5 rounded-full border border-black/30 inline-block shrink-0"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl p-2 z-50 shadow-2xl transition-all duration-150 animate-in fade-in zoom-in-95 ${
            themeConfig.mode === 'light'
              ? 'bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#0f172a] text-slate-900'
              : `${themeConfig.card} border backdrop-blur-xl text-slate-100`
          }`}
          role="menu"
        >
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800/80 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" style={{ color: themeConfig.swatch[0] }} />
              <span className="text-xs font-extrabold uppercase tracking-wider">Dashboard Themes</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              4 Distinct Styles
            </span>
          </div>

          {/* Theme List */}
          <div className="space-y-1.5 py-1">
            {availableThemes.map((t) => {
              const isSelected = t.id === theme;
              const IconComponent = THEME_ICONS[t.id] || Sparkles;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? t.mode === 'light'
                        ? 'bg-blue-50 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
                        : 'bg-white/10 border border-white/20 shadow-md'
                      : t.mode === 'light'
                      ? 'hover:bg-slate-100 border border-transparent'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    {/* Theme Icon Box */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm"
                      style={{
                        backgroundColor: `${t.swatch[0]}22`,
                        borderColor: `${t.swatch[0]}55`,
                        color: t.swatch[0]
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-none">{t.name}</span>
                        {t.mode === 'light' && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-800 dark:text-amber-300">
                            Light
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-70 mt-1 line-clamp-1">{t.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pl-2 shrink-0">
                    {/* Swatch preview */}
                    <div className="flex items-center -space-x-1">
                      {t.swatch.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Active Checkmark */}
                    <div className="w-5 flex justify-center">
                      {isSelected ? (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: t.swatch[0] }}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
