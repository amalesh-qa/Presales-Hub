import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../themes/themeConfig';

const THEME_STORAGE_KEY = 'presales_hub_theme_v1';

const ThemeContext = createContext({
  theme: 'midnight',
  setTheme: () => {},
  themeConfig: THEMES.midnight,
  availableThemes: Object.values(THEMES)
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && THEMES[saved]) {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to load theme preference from localStorage:', e);
    }
    return 'midnight';
  });

  const setTheme = (newTheme) => {
    if (THEMES[newTheme]) {
      setThemeState(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (e) {
        console.warn('Failed to persist theme preference:', e);
      }
    }
  };

  const themeConfig = THEMES[theme] || THEMES.midnight;

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = themeConfig.mode;
      document.body.style.backgroundColor = themeConfig.bgHex;
      document.body.style.fontFamily = themeConfig.fontFamily;
    } catch (e) {
      console.error('Error applying theme styles to document root:', e);
    }
  }, [theme, themeConfig]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeConfig,
        availableThemes: Object.values(THEMES)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
