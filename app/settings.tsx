import React from 'react';
import { View, Pressable, Switch, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { Body, Caption, H3, Label } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/tokens';
import { supportedLanguages, changeLanguage, type SupportedLanguage } from '@/i18n';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colorScheme, toggle } = useTheme();
  const palette = colors[colorScheme];

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
        <Card style={styles.languageCard}>
          {(Object.entries(supportedLanguages) as [SupportedLanguage, string][]).map(
            ([code, name], index) => {
              const isSelected = i18n.language === code;
              const isLast = index === Object.keys(supportedLanguages).length - 1;
              return (
                <Pressable
                  key={code}
                  onPress={() => changeLanguage(code)}
                  style={[
                    styles.languageItem,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: palette.border },
                  ]}
                >
                  <Body>{name}</Body>
                  {isSelected && (
                    <Body color="accent">✓</Body>
                  )}
                </Pressable>
              );
            }
          )}
        </Card>
      </View>

      <View style={styles.footer}>
        <Caption>{t('settings.version')} {Constants.expoConfig?.version ?? '1.0.0'}</Caption>
      </View>
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
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageCard: {
    padding: 0,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
