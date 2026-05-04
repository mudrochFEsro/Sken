import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Label, Caption, Body } from '@/components/ui/Typography';
import { CategoryPicker } from '@/components/CategoryPicker';
import { CurrencyPicker } from '@/components/CurrencyPicker';
import { useSaveScan, useScan, useDeleteScan } from '@/db/hooks';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import { deleteImage } from '@/utils/image';
import { getToday } from '@/utils/date';
import { getDefaultCurrency } from '@/utils/currency';
import type { Category } from '@/utils/categories';

export default function EditorScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];
  const saveScan = useSaveScan();
  const deleteScan = useDeleteScan();
  const params = useLocalSearchParams<{
    scanId: string;
    imageUri?: string;
    merchant?: string;
    amount?: string;
    currency?: string;
    date?: string;
    category?: string;
    confidence?: string;
    rawText?: string;
  }>();

  const existingScan = useScan(params.scanId ?? null);
  const isEditing = !!existingScan;

  const [merchant, setMerchant] = useState(params.merchant ?? '');
  const [amount, setAmount] = useState(params.amount ?? '0');
  const [currency, setCurrency] = useState(params.currency ?? getDefaultCurrency());
  const [date, setDate] = useState(params.date ?? getToday());
  const [category, setCategory] = useState<string>(params.category ?? 'other');
  const [notes, setNotes] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState(params.imageUri ?? '');

  useEffect(() => {
    if (existingScan) {
      setMerchant(existingScan.merchant);
      setAmount(existingScan.amount.toString());
      setCurrency(existingScan.currency);
      setDate(existingScan.date);
      setCategory(existingScan.category);
      setNotes(existingScan.notes ?? '');
      if (existingScan.image_uri) setImageUri(existingScan.image_uri);
    }
  }, [existingScan]);

  const confidence = parseFloat(params.confidence ?? '0');

  const handleSave = useCallback(async () => {
    setSaving(true);
    await saveScan({
      id: params.scanId!,
      merchant,
      amount: parseFloat(amount) || 0,
      currency,
      date,
      category,
      notes,
      image_uri: imageUri || null,
    });
    router.back();
  }, [saveScan, params.scanId, imageUri, merchant, amount, currency, date, category, notes, router]);

  const handleDelete = useCallback(() => {
    Alert.alert(t('common.delete_confirm'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          if (params.scanId) {
            await deleteScan(params.scanId);
            await deleteImage(params.scanId);
          }
          router.back();
        },
      },
    ]);
  }, [t, params.scanId, deleteScan, router]);

  const handleDiscard = useCallback(() => {
    Alert.alert(t('editor.discard_confirm'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('editor.discard'),
        style: 'destructive',
        onPress: async () => {
          if (params.scanId && !isEditing) await deleteImage(params.scanId);
          router.back();
        },
      },
    ]);
  }, [t, params.scanId, isEditing, router]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      ) : null}

      {confidence > 0 && confidence < 0.5 && (
        <Card style={[styles.badge, { borderColor: palette.muted }]}>
          <Caption>{t('editor.review_suggested')}</Caption>
        </Card>
      )}

      <View style={styles.form}>
        <Input
          label={t('editor.merchant')}
          value={merchant}
          onChangeText={setMerchant}
          placeholder={t('editor.merchant_placeholder')}
        />

        <View style={styles.row}>
          <View style={styles.amountField}>
            <Input
              label={t('editor.amount')}
              value={amount}
              onChangeText={setAmount}
              placeholder={t('editor.amount_placeholder')}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Label style={styles.sectionLabel}>{t('editor.currency')}</Label>
          <CurrencyPicker selected={currency} onSelect={setCurrency} />
        </View>

        <Input
          label={t('editor.date')}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.section}>
          <Label style={styles.sectionLabel}>{t('editor.category')}</Label>
          <CategoryPicker selected={category} onSelect={setCategory as (c: Category) => void} />
        </View>

        <Input
          label={t('editor.notes')}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('editor.notes_placeholder')}
          multiline
          numberOfLines={3}
        />

        {params.rawText && (
          <View style={styles.section}>
            <Pressable onPress={() => setShowRawText((v) => !v)}>
              <Caption style={styles.rawTextToggle}>{t('editor.raw_text')} {showRawText ? '▲' : '▼'}</Caption>
            </Pressable>
            {showRawText && (
              <Card>
                <Caption selectable>{params.rawText}</Caption>
              </Card>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <Button title={t('editor.save')} onPress={handleSave} disabled={saving} />
          {isEditing ? (
            <Button title={t('common.delete')} variant="destructive" onPress={handleDelete} />
          ) : (
            <Button title={t('editor.discard')} variant="ghost" onPress={handleDiscard} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 0,
  },
  badge: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  form: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  amountField: {
    flex: 1,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    marginLeft: spacing.xs,
  },
  rawTextToggle: {
    textDecorationLine: 'underline',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
