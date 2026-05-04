import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { getItem, setItem } from '@/utils/storage';

const THEME_KEY = 'sken_theme';

export type ColorScheme = 'light' | 'dark';

type ThemeContextType = {
  colorScheme: ColorScheme;
  toggle: () => void;
  isLoaded: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggle: () => {},
  isLoaded: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeProvider() {
  const systemScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemScheme ?? 'light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setColorScheme(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const toggle = useCallback(() => {
    setColorScheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  return { colorScheme, toggle, isLoaded };
}
