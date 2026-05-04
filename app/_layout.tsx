import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useThemeProvider, ThemeContext } from '@/hooks/useColorScheme';
import { DatabaseProvider } from '@/db/provider';
import { initI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { loadRates } from '@/utils/exchange-rates';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useThemeProvider();
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    Promise.all([initI18n(), loadRates()]).then(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if (theme.isLoaded && i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [theme.isLoaded, i18nReady]);

  if (!theme.isLoaded || !i18nReady) return null;

  const palette = colors[theme.colorScheme];

  return (
    <ThemeContext.Provider value={theme}>
      <DatabaseProvider>
        <StatusBar style={theme.colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.foreground,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: palette.background },
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Sken' }} />
          <Stack.Screen name="scan" options={{ title: '', headerTransparent: true }} />
          <Stack.Screen name="editor" options={{ title: '' }} />
          <Stack.Screen name="settings" />
          <Stack.Screen name="export" />
          <Stack.Screen name="tax-report" />
        </Stack>
      </DatabaseProvider>
    </ThemeContext.Provider>
  );
}
