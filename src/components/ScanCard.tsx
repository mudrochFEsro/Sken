import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Body, Caption } from './ui/Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/tokens';
import { formatAmount } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import type { Scan } from '@/db/schema';
import { useTranslation } from 'react-i18next';

type ScanCardProps = {
  scan: Scan;
  onPress: (scan: Scan) => void;
};

export const ScanCard = memo(function ScanCard({ scan, onPress }: ScanCardProps) {
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];
  const { t, i18n } = useTranslation();

  return (
    <Pressable
      onPress={() => onPress(scan)}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: palette.border },
        pressed && { opacity: 0.7, backgroundColor: palette.border },
      ]}
    >
      <View style={styles.left}>
        <Body numberOfLines={1}>{scan.merchant || t('editor.merchant_placeholder')}</Body>
        <Caption>{formatDate(scan.date, i18n.language)} · {t(`categories.${scan.category}`)}</Caption>
      </View>
      <Body style={styles.amount}>{formatAmount(scan.amount, scan.currency)}</Body>
    </Pressable>
  );
}, (prev, next) => prev.scan.id === next.scan.id && prev.scan.updated_at === next.scan.updated_at);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
    gap: 2,
  },
  amount: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
