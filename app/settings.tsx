import React, { useState, useEffect } from 'react';
import { View, Pressable, Switch, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Body, Caption, Label } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyPicker } from '@/components/CurrencyPicker';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import { supportedLanguages, changeLanguage, type SupportedLanguage } from '@/i18n';
import { getDefaultCurrency } from '@/utils/currency';
import { getItem, setItem } from '@/utils/storage';
import { fetchRates, getRatesDate } from '@/utils/exchange-rates';
import { shareBackup } from '@/utils/backup';

const HOME_CURRENCY_KEY = 'sken_home_currency';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colorScheme, toggle } = useTheme();
  const palette = colors[colorScheme];
  const router = useRouter();

  const [homeCurrency, setHomeCurrency] = useState(getDefaultCurrency());
  const [ratesDate, setRatesDate] = useState<string | null>(null);
  const [updatingRates, setUpdatingRates] = useState(false);

  useEffect(() => {
    getItem(HOME_CURRENCY_KEY).then((v) => { if (v) setHomeCurrency(v); });
    getRatesDate().then(setRatesDate);
  }, []);

  const handleCurrencyChange = (code: string) => {
    setHomeCurrency(code);
    setItem(HOME_CURRENCY_KEY, code);
  };

  const handleUpdateRates = async () => {
    setUpdatingRates(true);
    const ok = await fetchRates();
    if (ok) {
      const date = await getRatesDate();
      setRatesDate(date);
      Alert.alert(t('settings.rates_updated'));
    } else {
      Alert.alert(t('settings.rates_offline'));
    }
    setUpdatingRates(false);
  };

  const handleBackup = async () => {
    const ok = await shareBackup();
    if (ok) {
      Alert.alert(t('settings.backup_done'));
    } else {
      Alert.alert(t('settings.backup_empty'));
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Label color="muted" style={styles.sectionTitle}>{t('settings.theme')}</Label>
        <Card>
          <View style={styles.themeRow}>
            <Body>{colorScheme === 'dark' ? t('settings.theme_dark') : t('settings.theme_light')}</Body>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggle}
              trackColor={{ false: palette.border, true: palette.accent }}
              thumbColor="#FAFAFA"
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Label color="muted" style={styles.sectionTitle}>{t('settings.language')}</Label>
        <Card style={styles.listCard}>
          {(Object.entries(supportedLanguages) as [SupportedLanguage, string][]).map(
            ([code, name], index) => {
              const isSelected = i18n.language === code;
              const isLast = index === Object.keys(supportedLanguages).length - 1;
              return (
                <Pressable
                  key={code}
                  onPress={() => changeLanguage(code)}
                  style={[
                    styles.listItem,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: palette.border },
                  ]}
                >
                  <Body>{name}</Body>
                  {isSelected && <Body color="accent">✓</Body>}
                </Pressable>
              );
            }
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <Label color="muted" style={styles.sectionTitle}>{t('settings.home_currency')}</Label>
        <CurrencyPicker selected={homeCurrency} onSelect={handleCurrencyChange} />
      </View>

      <View style={styles.section}>
        <Label color="muted" style={styles.sectionTitle}>{t('settings.rates')}</Label>
        <Card>
          <View style={styles.themeRow}>
            <View>
              <Body>{t('settings.rates')}</Body>
              {ratesDate && <Caption>{t('settings.rates_date')}: {ratesDate}</Caption>}
            </View>
            <Button title={t('settings.rates_update')} variant="ghost" onPress={handleUpdateRates} disabled={updatingRates} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Label color="muted" style={styles.sectionTitle}>{t('tax_report.title')}</Label>
        <Card>
          <Pressable style={styles.listItem} onPress={() => router.push('/tax-report' as any)}>
            <Body>{t('tax_report.generate')}</Body>
            <Body color="muted">→</Body>
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Label color="muted" style={styles.sectionTitle}>{t('settings.backup')}</Label>
        <Card>
          <Pressable style={styles.listItem} onPress={handleBackup}>
            <View>
              <Body>{t('settings.backup_export')}</Body>
              <Caption>{t('settings.backup_export_desc')}</Caption>
            </View>
          </Pressable>
        </Card>
      </View>

      <View style={styles.footer}>
        <Caption>{t('settings.version')} {Constants.expoConfig?.version ?? '1.0.0'}</Caption>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.lg, paddingBottom: 48 },
  section: { gap: spacing.sm },
  sectionTitle: { marginLeft: spacing.xs, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listCard: { padding: 0 },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: spacing.md },
  footer: { alignItems: 'center', marginTop: spacing.xl },
});
