import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Body, Caption, H3 } from '@/components/ui/Typography';
import { EmptyState } from '@/components/EmptyState';
import { useScans } from '@/db/hooks';
import { exportToCSV } from '@/utils/csv';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';

export default function ExportScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];
  const { scans, loading } = useScans();
  const [csvPreview, setCsvPreview] = useState('');

  useEffect(() => {
    if (scans.length > 0) {
      const csv = exportToCSV(scans);
      setCsvPreview(csv.split('\n').slice(0, 6).join('\n'));
    }
  }, [scans]);

  const handleExport = async () => {
    const csv = exportToCSV(scans);
    const csvFile = new File(Paths.cache, 'sken_export.csv');
    csvFile.write(csv);
    const fileUri = csvFile.uri;

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: t('export.share'),
      });
    } else {
      Alert.alert(t('export.success'));
    }
  };

  if (!loading && scans.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <View style={styles.emptyContainer}>
          <Body color="muted">{t('export.no_data')}</Body>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
    >
      <Body color="muted">{t('export.description')}</Body>
      <Caption style={styles.count}>{scans.length} scans</Caption>

      {csvPreview && (
        <Card>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Caption selectable style={styles.preview}>{csvPreview}</Caption>
          </ScrollView>
          {scans.length > 5 && <Caption color="muted">...</Caption>}
        </Card>
      )}

      <Button title={t('export.share')} onPress={handleExport} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: 48,
  },
  count: {
    fontVariant: ['tabular-nums'],
  },
  preview: {
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
