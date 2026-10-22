import React, { createContext, useContext, useState } from 'react';

export const LAYOUTS = {
  classic: {
    id: 'classic',
    name: 'Classic Grid',
    tagline: 'Balanced, structured 4-card rows with 2x2 visualization grid',
    icon: 'LayoutGrid',
    description: 'Traditional executive layout with clear vertical hierarchy from KPIs to charts and ledger.'
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics Focus',
    tagline: 'Chart-first intelligence with hero velocity centerpiece',
    icon: 'BarChart3',
    description: 'Data-centric layout emphasizing pipeline velocity trends, outcome breakdown, and visual analytics.'
  },
  compact: {
    id: 'compact',
    name: 'Compact Workspace',
    tagline: 'High-density dual-column command center for power users',
    icon: 'PanelsTopLeft',
    description: 'Space-efficient dual-pane workspace pairing a metric left rail with a comprehensive analytical canvas.'
  },
  visual: {
    id: 'visual',
    name: 'Modern Visual',
    tagline: 'Editorial storytelling flow with hero AI briefing & masonry blocks',
    icon: 'LayoutDashboard',
    description: 'Magazine-grade visual storyboard featuring narrative cards, momentum blocks, and market landscape.'
  }
};

const LAYOUT_STORAGE_KEY = 'presales_hub_layout_v1';

const LayoutContext = createContext({
  layout: 'classic',
  setLayout: () => {},
  layoutConfig: LAYOUTS.classic,
  availableLayouts: Object.values(LAYOUTS)
});

export function LayoutProvider({ children }) {
  const [layout, setLayoutState] = useState(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (saved && LAYOUTS[saved]) {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to load layout preference from localStorage:', e);
    }
    return 'classic';
  });

  const setLayout = (newLayout) => {
    if (LAYOUTS[newLayout]) {
      setLayoutState(newLayout);
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, newLayout);
      } catch (e) {
        console.warn('Failed to persist layout preference:', e);
      }
    }
  };

  const layoutConfig = LAYOUTS[layout] || LAYOUTS.classic;

  return (
    <LayoutContext.Provider
      value={{
        layout,
        setLayout,
        layoutConfig,
        availableLayouts: Object.values(LAYOUTS)
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
