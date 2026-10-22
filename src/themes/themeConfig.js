export const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Obsidian',
    tagline: 'Cyber Executive & Deep Obsidian Glass',
    mode: 'dark',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    swatch: ['#6366f1', '#06b6d4', '#10b981'],
    bgHex: '#0b0f19',
    
    // Page & Layout Classes
    pageBgClass: 'bg-[#0b0f19] text-slate-100',
    dashboardWrapperClass: 'bg-[#0b0f19]',
    
    // Header & Navbar
    navbarBg: 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80',
    navbarBrandIcon: 'bg-gradient-to-tr from-indigo-600 to-blue-500 border border-indigo-400/30 text-white shadow-indigo-500/20',
    navbarBadge: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    navbarUserPill: 'bg-slate-800/50 border border-slate-700/50 text-slate-200',
    navbarUserAvatar: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30',
    
    // Tabs Navigation
    tabsBg: 'bg-slate-950/60 border-b border-slate-800/60',
    tabActive: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/40',
    tabInactive: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    syncBadge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    
    // Cards & Containers
    card: 'bg-slate-900/75 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl',
    cardHover: 'hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300',
    cardHeader: 'text-white font-bold',
    cardSubtitle: 'text-slate-400 font-medium',
    
    // Text Accents
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    textAccent: 'text-indigo-400',
    
    // Buttons
    buttonPrimary: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30 rounded-xl',
    buttonSecondary: 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl',
    buttonGhost: 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 rounded-xl',
    
    // Filters & Inputs
    filterContainer: 'bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl',
    inputClass: 'bg-slate-900/90 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl',
    selectClass: 'bg-slate-900 border border-slate-700 text-slate-200 focus:border-indigo-500 rounded-xl',
    
    // Table Styling
    tableContainer: 'bg-slate-900/75 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl',
    tableHeaderRow: 'bg-slate-900/90 border-b border-slate-800 text-slate-400',
    tableRowHover: 'hover:bg-slate-800/40 transition',
    tableRowBorder: 'border-slate-800/60',
    tableTextPrimary: 'text-slate-100',
    tableTextSecondary: 'text-slate-400',
    tableBadgeScope: 'bg-slate-800/80 text-indigo-300 border border-slate-700',
    
    // KPI Cards Specific
    kpiCards: {
      total: {
        iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        hoverBorder: 'hover:border-indigo-500/50',
        glow: 'glow-primary',
        badgeBg: 'bg-slate-800 text-slate-200 border-slate-700'
      },
      wins: {
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-500/50',
        glow: 'glow-emerald',
        badgeBg: 'bg-slate-800 text-slate-200 border-slate-700'
      },
      losses: {
        iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        hoverBorder: 'hover:border-rose-500/50',
        glow: 'glow-rose',
        badgeBg: 'bg-slate-800 text-slate-200 border-slate-700'
      },
      pipeline: {
        iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        hoverBorder: 'hover:border-amber-500/50',
        glow: 'glow-amber',
        badgeBg: 'bg-slate-800 text-slate-200 border-slate-700'
      }
    },
    
    // Executive Briefing Cards
    executiveCards: {
      bannerIcon: 'bg-gradient-to-tr from-amber-500 to-indigo-600 border border-amber-400/30 text-white shadow-amber-500/20',
      bannerBadge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      winsCard: 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950',
      lossesCard: 'border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950',
      scopeCard: 'border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-slate-950',
      regionCard: 'border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950',
      aiCard: 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/80 via-slate-900/95 to-slate-950',
      aiTextBubble: 'bg-slate-900/80 text-indigo-200 border border-indigo-900/50'
    },
    
    // Chart Theme Tokens
    chartTheme: {
      outcomeColors: {
        Won: '#10b981',
        Lost: '#f43f5e',
        Pending: '#f59e0b',
        'On Hold': '#6366f1'
      },
      pieStroke: 'rgba(15, 23, 42, 0.8)',
      regionColors: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899'],
      capabilityColors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'],
      velocityStroke: '#818cf8',
      velocityGradient: {
        start: '#6366f1',
        end: '#6366f1',
        startOpacity: 0.4,
        endOpacity: 0
      },
      velocityDots: {
        dotFill: '#6366f1',
        dotStroke: '#ffffff',
        activeFill: '#a5b4fc',
        activeStroke: '#ffffff'
      },
      gridStroke: '#1e293b',
      axisStroke: '#64748b',
      tickFill: '#94a3b8',
      tooltipBg: 'bg-slate-900',
      tooltipBorder: 'border border-slate-700',
      tooltipTitle: 'text-white font-bold',
      tooltipValue: 'text-slate-300'
    }
  },

  neobrutal: {
    id: 'neobrutal',
    name: 'Neo-Brutalist Light',
    tagline: 'High-Contrast Editorial, Bold Shadows & Crisp Ink',
    mode: 'light',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    swatch: ['#2563eb', '#ea580c', '#0f172a'],
    bgHex: '#f1f5f9',
    
    // Page & Layout Classes
    pageBgClass: 'bg-[#f1f5f9] text-slate-900',
    dashboardWrapperClass: 'bg-[#f1f5f9]',
    
    // Header & Navbar
    navbarBg: 'bg-white border-b-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] sticky top-0 z-40',
    navbarBrandIcon: 'bg-blue-600 border-2 border-slate-900 text-white shadow-[2px_2px_0_0_#0f172a]',
    navbarBadge: 'bg-amber-400 text-slate-950 font-black border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]',
    navbarUserPill: 'bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] text-slate-900',
    navbarUserAvatar: 'bg-blue-500 text-white font-black border-2 border-slate-900',
    
    // Tabs Navigation
    tabsBg: 'bg-slate-200/90 border-b-2 border-slate-900',
    tabActive: 'bg-blue-600 text-white font-bold border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]',
    tabInactive: 'text-slate-700 hover:text-slate-950 hover:bg-white font-bold',
    syncBadge: 'text-slate-900 bg-emerald-400 font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]',
    
    // Cards & Containers
    card: 'bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] rounded-xl',
    cardHover: 'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#0f172a] transition-all duration-200',
    cardHeader: 'text-slate-900 font-black tracking-tight',
    cardSubtitle: 'text-slate-600 font-semibold',
    
    // Text Accents
    textPrimary: 'text-slate-950',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    textAccent: 'text-blue-600',
    
    // Buttons
    buttonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#0f172a] rounded-xl',
    buttonSecondary: 'bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#0f172a] rounded-xl',
    buttonGhost: 'bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] rounded-xl',
    
    // Filters & Inputs
    filterContainer: 'bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] rounded-xl',
    inputClass: 'bg-slate-50 border-2 border-slate-900 text-slate-950 placeholder-slate-500 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg',
    selectClass: 'bg-white border-2 border-slate-900 text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg cursor-pointer',
    
    // Table Styling
    tableContainer: 'bg-white border-2 border-slate-900 shadow-[5px_5px_0_0_#0f172a] rounded-xl',
    tableHeaderRow: 'bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-black',
    tableRowHover: 'hover:bg-blue-50/70 transition',
    tableRowBorder: 'border-slate-300',
    tableTextPrimary: 'text-slate-950 font-bold',
    tableTextSecondary: 'text-slate-600 font-medium',
    tableBadgeScope: 'bg-blue-100 text-blue-900 border-2 border-slate-900 font-bold',
    
    // KPI Cards Specific
    kpiCards: {
      total: {
        iconBg: 'bg-blue-100 text-blue-700 border-2 border-slate-900',
        hoverBorder: 'hover:border-slate-950',
        glow: '',
        badgeBg: 'bg-blue-50 text-blue-950 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
      },
      wins: {
        iconBg: 'bg-emerald-100 text-emerald-800 border-2 border-slate-900',
        hoverBorder: 'hover:border-slate-950',
        glow: '',
        badgeBg: 'bg-emerald-50 text-emerald-950 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
      },
      losses: {
        iconBg: 'bg-rose-100 text-rose-700 border-2 border-slate-900',
        hoverBorder: 'hover:border-slate-950',
        glow: '',
        badgeBg: 'bg-rose-50 text-rose-950 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
      },
      pipeline: {
        iconBg: 'bg-amber-100 text-amber-800 border-2 border-slate-900',
        hoverBorder: 'hover:border-slate-950',
        glow: '',
        badgeBg: 'bg-amber-50 text-amber-950 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
      }
    },
    
    // Executive Briefing Cards
    executiveCards: {
      bannerIcon: 'bg-amber-400 border-2 border-slate-900 text-slate-950 shadow-[2px_2px_0_0_#0f172a]',
      bannerBadge: 'bg-lime-300 text-slate-950 font-black border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]',
      winsCard: 'border-2 border-slate-900 bg-emerald-50 shadow-[3px_3px_0_0_#0f172a]',
      lossesCard: 'border-2 border-slate-900 bg-rose-50 shadow-[3px_3px_0_0_#0f172a]',
      scopeCard: 'border-2 border-slate-900 bg-blue-50 shadow-[3px_3px_0_0_#0f172a]',
      regionCard: 'border-2 border-slate-900 bg-purple-50 shadow-[3px_3px_0_0_#0f172a]',
      aiCard: 'border-2 border-slate-900 bg-gradient-to-r from-amber-50 via-white to-blue-50 shadow-[4px_4px_0_0_#0f172a]',
      aiTextBubble: 'bg-white text-slate-900 border-2 border-slate-900 font-semibold shadow-[2px_2px_0_0_#0f172a]'
    },
    
    // Chart Theme Tokens
    chartTheme: {
      outcomeColors: {
        Won: '#16a34a',
        Lost: '#dc2626',
        Pending: '#d97706',
        'On Hold': '#2563eb'
      },
      pieStroke: '#0f172a',
      regionColors: ['#2563eb', '#ea580c', '#059669', '#7c3aed', '#0891b2', '#db2777'],
      capabilityColors: ['#ea580c', '#2563eb', '#059669', '#7c3aed', '#d97706', '#db2777'],
      velocityStroke: '#2563eb',
      velocityGradient: {
        start: '#3b82f6',
        end: '#93c5fd',
        startOpacity: 0.6,
        endOpacity: 0.1
      },
      velocityDots: {
        dotFill: '#2563eb',
        dotStroke: '#0f172a',
        activeFill: '#1d4ed8',
        activeStroke: '#ffffff'
      },
      gridStroke: '#cbd5e1',
      axisStroke: '#475569',
      tickFill: '#1e293b',
      tooltipBg: 'bg-white',
      tooltipBorder: 'border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]',
      tooltipTitle: 'text-slate-950 font-black',
      tooltipValue: 'text-slate-700 font-bold'
    }
  },

  aurora: {
    id: 'aurora',
    name: 'Aurora Emerald',
    tagline: 'Nordic Pine, Mint & Bioluminescent Glow',
    mode: 'dark',
    fontFamily: "'Outfit', system-ui, sans-serif",
    swatch: ['#10b981', '#14b8a6', '#06b6d4'],
    bgHex: '#031412',
    
    // Page & Layout Classes
    pageBgClass: 'bg-[#031412] text-emerald-50',
    dashboardWrapperClass: 'bg-[#031412]',
    
    // Header & Navbar
    navbarBg: 'bg-[#051e1b]/95 backdrop-blur-md border-b border-emerald-900/60 sticky top-0 z-40',
    navbarBrandIcon: 'bg-gradient-to-tr from-emerald-600 to-teal-400 border border-emerald-400/30 text-white shadow-emerald-500/25',
    navbarBadge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    navbarUserPill: 'bg-[#062420] border border-emerald-800/50 text-emerald-100',
    navbarUserAvatar: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
    
    // Tabs Navigation
    tabsBg: 'bg-[#020e0d]/80 border-b border-emerald-900/40',
    tabActive: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40',
    tabInactive: 'text-emerald-300/60 hover:text-emerald-100 hover:bg-emerald-950/40',
    syncBadge: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
    
    // Cards & Containers
    card: 'bg-[#062420]/80 backdrop-blur-md border border-emerald-500/20 shadow-xl shadow-emerald-950/50 rounded-2xl',
    cardHover: 'hover:border-emerald-400/50 hover:bg-[#082e29]/90 hover:shadow-emerald-500/15 transition-all duration-300',
    cardHeader: 'text-emerald-100 font-bold',
    cardSubtitle: 'text-emerald-400/70 font-medium',
    
    // Text Accents
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-300/80',
    textMuted: 'text-emerald-500/60',
    textAccent: 'text-emerald-400',
    
    // Buttons
    buttonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30 rounded-xl',
    buttonSecondary: 'bg-[#082a25] hover:bg-[#0b3831] text-emerald-200 border border-emerald-700/60 rounded-xl',
    buttonGhost: 'bg-[#0a332d] hover:bg-[#0e443c] text-emerald-200 border border-emerald-600/40 rounded-xl',
    
    // Filters & Inputs
    filterContainer: 'bg-[#062420]/85 backdrop-blur-md border border-emerald-500/25 rounded-2xl',
    inputClass: 'bg-[#031715] border border-emerald-800/70 text-emerald-100 placeholder-emerald-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl',
    selectClass: 'bg-[#031715] border border-emerald-800/70 text-emerald-100 focus:border-teal-400 rounded-xl',
    
    // Table Styling
    tableContainer: 'bg-[#062420]/80 backdrop-blur-md border border-emerald-500/25 shadow-xl rounded-2xl',
    tableHeaderRow: 'bg-[#041a17] border-b border-emerald-800/60 text-emerald-400/80',
    tableRowHover: 'hover:bg-emerald-950/50 transition',
    tableRowBorder: 'border-emerald-900/40',
    tableTextPrimary: 'text-emerald-50',
    tableTextSecondary: 'text-emerald-300/70',
    tableBadgeScope: 'bg-emerald-950/80 text-teal-300 border border-emerald-700/50',
    
    // KPI Cards Specific
    kpiCards: {
      total: {
        iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        hoverBorder: 'hover:border-teal-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(20,184,166,0.3)]',
        badgeBg: 'bg-[#041d1a] text-teal-200 border-emerald-700/60'
      },
      wins: {
        iconBg: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
        hoverBorder: 'hover:border-emerald-400/70',
        glow: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.35)]',
        badgeBg: 'bg-[#041d1a] text-emerald-200 border-emerald-700/60'
      },
      losses: {
        iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        hoverBorder: 'hover:border-rose-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]',
        badgeBg: 'bg-[#041d1a] text-rose-200 border-rose-800/60'
      },
      pipeline: {
        iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        hoverBorder: 'hover:border-amber-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]',
        badgeBg: 'bg-[#041d1a] text-amber-200 border-amber-800/60'
      }
    },
    
    // Executive Briefing Cards
    executiveCards: {
      bannerIcon: 'bg-gradient-to-tr from-teal-500 to-emerald-400 border border-teal-300/40 text-slate-950 shadow-emerald-500/30',
      bannerBadge: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
      winsCard: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/70 via-[#062420] to-[#031412]',
      lossesCard: 'border-rose-500/40 bg-gradient-to-br from-rose-950/60 via-[#062420] to-[#031412]',
      scopeCard: 'border-teal-500/40 bg-gradient-to-br from-teal-950/70 via-[#062420] to-[#031412]',
      regionCard: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/70 via-[#062420] to-[#031412]',
      aiCard: 'border-teal-500/40 bg-gradient-to-r from-emerald-950/90 via-[#062420] to-[#031412]',
      aiTextBubble: 'bg-[#031715] text-emerald-200 border border-teal-800/60'
    },
    
    // Chart Theme Tokens
    chartTheme: {
      outcomeColors: {
        Won: '#10b981',
        Lost: '#f87171',
        Pending: '#fbbf24',
        'On Hold': '#2dd4bf'
      },
      pieStroke: '#041d1a',
      regionColors: ['#10b981', '#14b8a6', '#06b6d4', '#34d399', '#6ee7b7', '#a7f3d0'],
      capabilityColors: ['#14b8a6', '#10b981', '#2dd4bf', '#059669', '#34d399', '#86efac'],
      velocityStroke: '#10b981',
      velocityGradient: {
        start: '#10b981',
        end: '#14b8a6',
        startOpacity: 0.45,
        endOpacity: 0.05
      },
      velocityDots: {
        dotFill: '#10b981',
        dotStroke: '#041d1a',
        activeFill: '#6ee7b7',
        activeStroke: '#ffffff'
      },
      gridStroke: '#0b352e',
      axisStroke: '#115e52',
      tickFill: '#6ee7b7',
      tooltipBg: 'bg-[#052420]',
      tooltipBorder: 'border border-emerald-500/40 shadow-xl shadow-emerald-950/80',
      tooltipTitle: 'text-emerald-100 font-bold',
      tooltipValue: 'text-emerald-300'
    }
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset Horizon',
    tagline: 'Warm Dark Velvet, Sunset Rose & Radiant Gold',
    mode: 'dark',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    swatch: ['#f43f5e', '#f59e0b', '#c084fc'],
    bgHex: '#0d0817',
    
    // Page & Layout Classes
    pageBgClass: 'bg-[#0d0817] text-rose-50',
    dashboardWrapperClass: 'bg-[#0d0817]',
    
    // Header & Navbar
    navbarBg: 'bg-[#140b24]/95 backdrop-blur-md border-b border-purple-900/50 sticky top-0 z-40',
    navbarBrandIcon: 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 border border-rose-300/40 text-white shadow-rose-500/25',
    navbarBadge: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    navbarUserPill: 'bg-[#1b1030] border border-purple-800/40 text-rose-100',
    navbarUserAvatar: 'bg-rose-500/20 text-rose-300 border border-rose-400/40',
    
    // Tabs Navigation
    tabsBg: 'bg-[#090510]/80 border-b border-purple-900/40',
    tabActive: 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30 border border-rose-400/40',
    tabInactive: 'text-purple-300/60 hover:text-purple-100 hover:bg-purple-950/40',
    syncBadge: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    
    // Cards & Containers
    card: 'bg-[#180e2b]/85 backdrop-blur-md border border-rose-500/20 shadow-xl shadow-purple-950/50 rounded-2xl',
    cardHover: 'hover:border-rose-400/50 hover:bg-[#201338]/90 hover:shadow-rose-500/15 transition-all duration-300',
    cardHeader: 'text-rose-100 font-bold',
    cardSubtitle: 'text-rose-300/70 font-medium',
    
    // Text Accents
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200/80',
    textMuted: 'text-purple-400/60',
    textAccent: 'text-rose-400',
    
    // Buttons
    buttonPrimary: 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/30 border border-rose-400/30 rounded-xl',
    buttonSecondary: 'bg-[#1e1236] hover:bg-[#281847] text-rose-200 border border-rose-800/50 rounded-xl',
    buttonGhost: 'bg-[#251542] hover:bg-[#301c54] text-rose-200 border border-rose-700/40 rounded-xl',
    
    // Filters & Inputs
    filterContainer: 'bg-[#180e2b]/90 backdrop-blur-md border border-rose-500/25 rounded-2xl',
    inputClass: 'bg-[#0f091a] border border-purple-800/70 text-rose-100 placeholder-purple-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl',
    selectClass: 'bg-[#0f091a] border border-purple-800/70 text-rose-100 focus:border-rose-400 rounded-xl',
    
    // Table Styling
    tableContainer: 'bg-[#180e2b]/85 backdrop-blur-md border border-rose-500/25 shadow-xl rounded-2xl',
    tableHeaderRow: 'bg-[#110821] border-b border-purple-800/60 text-rose-300/80',
    tableRowHover: 'hover:bg-purple-950/50 transition',
    tableRowBorder: 'border-purple-900/40',
    tableTextPrimary: 'text-rose-50',
    tableTextSecondary: 'text-rose-300/70',
    tableBadgeScope: 'bg-[#251442] text-amber-300 border border-rose-700/40',
    
    // KPI Cards Specific
    kpiCards: {
      total: {
        iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        hoverBorder: 'hover:border-rose-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]',
        badgeBg: 'bg-[#130a24] text-rose-200 border-rose-700/50'
      },
      wins: {
        iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        hoverBorder: 'hover:border-amber-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.35)]',
        badgeBg: 'bg-[#130a24] text-amber-200 border-amber-700/50'
      },
      losses: {
        iconBg: 'bg-red-500/20 text-red-300 border-red-500/30',
        hoverBorder: 'hover:border-red-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]',
        badgeBg: 'bg-[#130a24] text-red-200 border-red-800/50'
      },
      pipeline: {
        iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        hoverBorder: 'hover:border-purple-400/60',
        glow: 'shadow-[0_0_20px_-5px_rgba(192,132,252,0.3)]',
        badgeBg: 'bg-[#130a24] text-purple-200 border-purple-800/50'
      }
    },
    
    // Executive Briefing Cards
    executiveCards: {
      bannerIcon: 'bg-gradient-to-tr from-rose-500 to-amber-500 border border-rose-300/40 text-white shadow-rose-500/30',
      bannerBadge: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      winsCard: 'border-amber-500/40 bg-gradient-to-br from-amber-950/60 via-[#180e2b] to-[#0d0817]',
      lossesCard: 'border-red-500/40 bg-gradient-to-br from-rose-950/60 via-[#180e2b] to-[#0d0817]',
      scopeCard: 'border-purple-500/40 bg-gradient-to-br from-purple-950/70 via-[#180e2b] to-[#0d0817]',
      regionCard: 'border-rose-500/40 bg-gradient-to-br from-rose-950/70 via-[#180e2b] to-[#0d0817]',
      aiCard: 'border-rose-500/40 bg-gradient-to-r from-rose-950/80 via-[#180e2b] to-[#0d0817]',
      aiTextBubble: 'bg-[#10071e] text-rose-200 border border-rose-800/50'
    },
    
    // Chart Theme Tokens
    chartTheme: {
      outcomeColors: {
        Won: '#f59e0b',
        Lost: '#f43f5e',
        Pending: '#fb923c',
        'On Hold': '#c084fc'
      },
      pieStroke: '#130a24',
      regionColors: ['#f43f5e', '#f59e0b', '#ec4899', '#c084fc', '#fb923c', '#e11d48'],
      capabilityColors: ['#fb923c', '#f43f5e', '#c084fc', '#f59e0b', '#e11d48', '#d946ef'],
      velocityStroke: '#f43f5e',
      velocityGradient: {
        start: '#f43f5e',
        end: '#fb923c',
        startOpacity: 0.5,
        endOpacity: 0.05
      },
      velocityDots: {
        dotFill: '#f43f5e',
        dotStroke: '#130a24',
        activeFill: '#fda4af',
        activeStroke: '#ffffff'
      },
      gridStroke: '#2d184a',
      axisStroke: '#582b8a',
      tickFill: '#f472b6',
      tooltipBg: 'bg-[#1b0e33]',
      tooltipBorder: 'border border-rose-500/40 shadow-xl shadow-purple-950/80',
      tooltipTitle: 'text-rose-100 font-bold',
      tooltipValue: 'text-amber-300'
    }
  }
};
