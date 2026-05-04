import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Body, Caption } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import { generateTaxReportHTML } from '@/utils/tax-report';
import { getDefaultCurrency } from '@/utils/currency';
import { getToday } from '@/utils/date';
import type { Scan } from '@/db/schema';

export default function TaxReportScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];
  const db = useSQLiteContext();

  const now = new Date();
  const yearStart = `${now.getFullYear()}-01-01`;

  const [fromDate, setFromDate] = useState(yearStart);
  const [toDate, setToDate] = useState(getToday());
  const [generating, setGenerating] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM scans WHERE date >= ? AND date <= ?',
      [fromDate, toDate]
    ).then((r) => setScanCount(r?.count ?? 0));
  }, [db, fromDate, toDate]);

  const handleGenerate = async () => {
    setGenerating(true);

    const scans = await db.getAllAsync<Scan>(
      'SELECT * FROM scans WHERE date >= ? AND date <= ? ORDER BY date ASC',
      [fromDate, toDate]
    );

    if (scans.length === 0) {
      Alert.alert(t('tax_report.no_data'));
      setGenerating(false);
      return;
    }

    const categoryLabels: Record<string, string> = {};
    for (const cat of ['food', 'travel', 'office', 'transport', 'entertainment', 'health', 'utilities', 'other']) {
      categoryLabels[cat] = t(`categories.${cat}`);
    }

    const html = generateTaxReportHTML({
      scans,
      homeCurrency: getDefaultCurrency(),
      fromDate,
      toDate,
      title: t('tax_report.title'),
      generatedLabel: t('tax_report.generated'),
      categoryLabels,
      totalLabel: t('tax_report.total'),
      dateLabel: t('tax_report.date'),
      merchantLabel: t('tax_report.merchant'),
      amountLabel: t('tax_report.amount'),
      categoryLabel: t('tax_report.category'),
      convertedLabel: t('tax_report.converted'),
    });

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: t('tax_report.share') });
    }

    setGenerating(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
    >
      <Body color="muted">{t('tax_report.period')}</Body>

      <View style={styles.row}>
        <View style={styles.dateField}>
          <Input label={t('tax_report.from')} value={fromDate} onChangeText={setFromDate} placeholder="YYYY-MM-DD" />
        </View>
        <View style={styles.dateField}>
          <Input label={t('tax_report.to')} value={toDate} onChangeText={setToDate} placeholder="YYYY-MM-DD" />
        </View>
      </View>

      <Caption>{scanCount} scans</Caption>

      <Button title={t('tax_report.generate')} onPress={handleGenerate} disabled={generating || scanCount === 0} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.lg, paddingBottom: 48 },
  row: { flexDirection: 'row', gap: spacing.md },
  dateField: { flex: 1 },
});
