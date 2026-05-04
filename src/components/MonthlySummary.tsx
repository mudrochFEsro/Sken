import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { H1, Caption } from './ui/Typography';
import { useMonthlyTotal } from '@/db/hooks';
import { formatAmount } from '@/utils/currency';
import { getCurrentMonth, getMonthName } from '@/utils/date';

export function MonthlySummary() {
  const { t, i18n } = useTranslation();
  const { year, month } = getCurrentMonth();
  const { total, currency } = useMonthlyTotal(year, month);

  return (
    <Card style={styles.card}>
      <Caption>{t('dashboard.monthly_total')}</Caption>
      <H1 style={styles.amount}>{formatAmount(total, currency)}</H1>
      <Caption>{getMonthName(month, i18n.language)} {year}</Caption>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  amount: {
    marginVertical: 8,
    letterSpacing: -1,
  },
});
