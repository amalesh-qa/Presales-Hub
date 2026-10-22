import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, BarChart3, PanelsTopLeft, LayoutDashboard, ChevronDown, Check, Layers } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { useTheme } from '../../context/ThemeContext';

const LAYOUT_ICONS = {
  classic: LayoutGrid,
  analytics: BarChart3,
  compact: PanelsTopLeft,
  visual: LayoutDashboard
};

// Mini SVG / CSS wireframe illustrations representing each layout
function LayoutMiniWireframe({ layoutId, activeColor = '#6366f1' }) {
  if (layoutId === 'classic') {
    // Top 4 small boxes, middle 4 small boxes, 2x2 grid
    return (
      <div className="w-10 h-7 rounded border border-current/20 p-0.5 flex flex-col justify-between shrink-0 opacity-80">
        <div className="grid grid-cols-4 gap-0.5">
          <div className="h-1 rounded-[1px] bg-current opacity-70" />
          <div className="h-1 rounded-[1px] bg-current opacity-70" />
          <div className="h-1 rounded-[1px] bg-current opacity-70" />
          <div className="h-1 rounded-[1px] bg-current opacity-70" />
        </div>
        <div className="grid grid-cols-2 gap-0.5">
          <div className="h-2 rounded-[1px] bg-current opacity-50" />
          <div className="h-2 rounded-[1px] bg-current opacity-50" />
        </div>
        <div className="h-1 rounded-[1px] bg-current opacity-30" />
      </div>
    );
  }

  if (layoutId === 'analytics') {
    // Top full bar, prominent wide hero chart, 2 smaller charts
    return (
      <div className="w-10 h-7 rounded border border-current/20 p-0.5 flex flex-col justify-between shrink-0 opacity-80">
        <div className="h-1 rounded-[1px] bg-current opacity-70" />
        <div className="h-2.5 rounded-[1px] bg-current opacity-90" />
        <div className="grid grid-cols-2 gap-0.5">
          <div className="h-1.5 rounded-[1px] bg-current opacity-50" />
          <div className="h-1.5 rounded-[1px] bg-current opacity-50" />
        </div>
      </div>
    );
  }

  if (layoutId === 'compact') {
    // Split 2-column: Left metric rail (w-1/3), right main canvas (w-2/3)
    return (
      <div className="w-10 h-7 rounded border border-current/20 p-0.5 flex gap-0.5 shrink-0 opacity-80">
        <div className="w-2.5 h-full rounded-[1px] bg-current opacity-80 flex flex-col justify-between p-0.5">
          <div className="h-1 rounded-[1px] bg-white/40" />
          <div className="h-1 rounded-[1px] bg-white/40" />
          <div className="h-1 rounded-[1px] bg-white/40" />
        </div>
        <div className="flex-1 h-full flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-2 rounded-[1px] bg-current opacity-60" />
            <div className="h-2 rounded-[1px] bg-current opacity-60" />
          </div>
          <div className="h-2 rounded-[1px] bg-current opacity-40" />
        </div>
      </div>
    );
  }

  // visual: Staggered masonry
  return (
    <div className="w-10 h-7 rounded border border-current/20 p-0.5 flex flex-col justify-between shrink-0 opacity-80">
      <div className="grid grid-cols-3 gap-0.5">
        <div className="col-span-2 h-1.5 rounded-[1px] bg-current opacity-90" />
        <div className="h-1.5 rounded-[1px] bg-current opacity-50" />
      </div>
      <div className="grid grid-cols-3 gap-0.5">
        <div className="h-2 rounded-[1px] bg-current opacity-50" />
        <div className="col-span-2 h-2 rounded-[1px] bg-current opacity-70" />
      </div>
      <div className="h-1 rounded-[1px] bg-current opacity-30" />
    </div>
  );
}

export default function LayoutSelector({ className = '' }) {
  const { layout, setLayout, layoutConfig, availableLayouts } = useLayout();
  const { themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ActiveIcon = LAYOUT_ICONS[layout] || LayoutGrid;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Dashboard Layout"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          themeConfig.mode === 'light'
            ? 'bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5'
            : `${themeConfig.buttonSecondary} shadow-lg`
        }`}
      >
        <div className="flex items-center gap-1.5">
          <ActiveIcon className="w-4 h-4" style={{ color: themeConfig.swatch[0] }} />
          <span className="hidden sm:inline font-semibold">{layoutConfig.name}</span>
          <span className="sm:hidden font-semibold">Layout</span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-72 sm:w-84 rounded-2xl p-2 z-50 shadow-2xl transition-all duration-150 animate-in fade-in zoom-in-95 ${
            themeConfig.mode === 'light'
              ? 'bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#0f172a] text-slate-900'
              : `${themeConfig.card} border backdrop-blur-xl text-slate-100`
          }`}
          role="menu"
        >
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800/80 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: themeConfig.swatch[0] }} />
              <span className="text-xs font-extrabold uppercase tracking-wider">Dashboard Layouts</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              4 Structural Modes
            </span>
          </div>

          {/* Layout List */}
          <div className="space-y-1.5 py-1">
            {availableLayouts.map((l) => {
              const isSelected = l.id === layout;
              const IconComponent = LAYOUT_ICONS[l.id] || LayoutGrid;

              return (
                <button
                  key={l.id}
                  onClick={() => {
                    setLayout(l.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? themeConfig.mode === 'light'
                        ? 'bg-blue-50 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
                        : 'bg-white/10 border border-white/20 shadow-md'
                      : themeConfig.mode === 'light'
                      ? 'hover:bg-slate-100 border border-transparent'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    {/* Wireframe Preview Graphic */}
                    <div
                      className="p-1 rounded-lg border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${themeConfig.swatch[0]}15`,
                        borderColor: `${themeConfig.swatch[0]}35`,
                        color: themeConfig.swatch[0]
                      }}
                    >
                      <LayoutMiniWireframe layoutId={l.id} activeColor={themeConfig.swatch[0]} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-none">{l.name}</span>
                      </div>
                      <p className="text-[10px] opacity-70 mt-1 line-clamp-1">{l.tagline}</p>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  <div className="w-5 flex justify-center shrink-0 pl-2">
                    {isSelected ? (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: themeConfig.swatch[0] }}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : null}
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
