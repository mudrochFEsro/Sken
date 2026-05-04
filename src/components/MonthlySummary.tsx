import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSQLiteContext } from 'expo-sqlite';
import { Card } from './ui/Card';
import { H1, Caption } from './ui/Typography';
import { formatAmount, getDefaultCurrency } from '@/utils/currency';
import { getCurrentMonth, getMonthName } from '@/utils/date';
import { convertToHome } from '@/utils/exchange-rates';
import { getItem } from '@/utils/storage';
import type { Scan } from '@/db/schema';

export function MonthlySummary() {
  const { t, i18n } = useTranslation();
  const db = useSQLiteContext();
  const { year, month } = getCurrentMonth();
  const [total, setTotal] = useState(0);
  const [homeCurrency, setHomeCurrency] = useState(getDefaultCurrency());

  useEffect(() => {
    getItem('sken_home_currency').then((v) => { if (v) setHomeCurrency(v); });
  }, []);

  useEffect(() => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    db.getAllAsync<Pick<Scan, 'amount' | 'currency'>>(
      'SELECT amount, currency FROM scans WHERE date >= ? AND date < ?',
      [startDate, endDate]
    ).then((rows) => {
      let sum = 0;
      for (const row of rows) {
        sum += convertToHome(row.amount, row.currency, homeCurrency);
      }
      setTotal(sum);
    });
  }, [db, year, month, homeCurrency]);

  return (
    <Card style={styles.card}>
      <Caption>{t('dashboard.monthly_total')}</Caption>
      <H1 style={styles.amount}>{formatAmount(total, homeCurrency)}</H1>
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
