import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { H3, Body } from './ui/Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';

export function EmptyState() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  return (
    <View style={styles.container}>
      <Ionicons name="scan-outline" size={64} color={palette.muted} />
      <H3 color="muted" style={styles.title}>{t('dashboard.empty_title')}</H3>
      <Body color="muted">{t('dashboard.empty_subtitle')}</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  title: {
    marginTop: 8,
  },
});
