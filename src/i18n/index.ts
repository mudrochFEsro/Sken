import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getItem, setItem } from '@/utils/storage';

import en from './locales/en.json';
import sk from './locales/sk.json';
import cs from './locales/cs.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import hr from './locales/hr.json';

const LANGUAGE_KEY = 'sken_language';

export const supportedLanguages = {
  en: 'English',
  sk: 'Slovenčina',
  cs: 'Čeština',
  de: 'Deutsch',
  ru: 'Русский',
  fr: 'Français',
  ja: '日本語',
  hr: 'Hrvatski',
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

const resources = { en: { translation: en }, sk: { translation: sk }, cs: { translation: cs }, de: { translation: de }, ru: { translation: ru }, fr: { translation: fr }, ja: { translation: ja }, hr: { translation: hr } };

function getDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  if (locales.length > 0) {
    const code = locales[0].languageCode as SupportedLanguage;
    if (code in supportedLanguages) return code;
  }
  return 'en';
}

export async function initI18n() {
  const stored = await getItem(LANGUAGE_KEY);
  const lng = (stored && stored in supportedLanguages) ? stored : getDeviceLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

  return i18n;
}

export async function changeLanguage(lang: SupportedLanguage) {
  await setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export default i18n;
