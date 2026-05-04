export const colors = {
  light: {
    background: '#FAFAFA',
    foreground: '#0A0A0A',
    muted: '#737373',
    border: '#E5E5E5',
    accent: '#171717',
    card: '#FFFFFF',
    destructive: '#DC2626',
  },
  dark: {
    background: '#0A0A0A',
    foreground: '#FAFAFA',
    muted: '#A3A3A3',
    border: '#262626',
    accent: '#FAFAFA',
    card: '#141414',
    destructive: '#EF4444',
  },
} as const;

export type ThemeColors = typeof colors.light;
