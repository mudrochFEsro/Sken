import * as Localization from 'expo-localization';

export const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
] as const;

const LOCALE_CURRENCY_MAP: Record<string, string> = {
  en: 'USD', sk: 'EUR', cs: 'CZK', de: 'EUR', ru: 'RUB',
  fr: 'EUR', ja: 'JPY', hr: 'EUR',
};

export function getDefaultCurrency(): string {
  const locales = Localization.getLocales();
  if (locales.length > 0 && locales[0].currencyCode) {
    return locales[0].currencyCode;
  }
  const lang = locales[0]?.languageCode ?? 'en';
  return LOCALE_CURRENCY_MAP[lang] ?? 'EUR';
}

export function getCurrencySymbol(code: string): string {
  const found = CURRENCIES.find((c) => c.code === code);
  return found?.symbol ?? code;
}

export function formatAmount(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = amount.toFixed(currency === 'JPY' ? 0 : 2);
  return `${symbol}${formatted}`;
}
