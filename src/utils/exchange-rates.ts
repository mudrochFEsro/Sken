import { getItem, setItem } from './storage';

const RATES_KEY = 'sken_exchange_rates';
const RATES_DATE_KEY = 'sken_exchange_rates_date';

const BUNDLED_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  CZK: 25.3,
  JPY: 164.5,
  CHF: 0.97,
  PLN: 4.28,
  RUB: 99.5,
  HRK: 7.53,
  SEK: 11.4,
  NOK: 11.6,
  DKK: 7.46,
  HUF: 392,
};

let cachedRates: Record<string, number> = { ...BUNDLED_RATES };

export async function loadRates(): Promise<void> {
  const stored = await getItem(RATES_KEY);
  if (stored) {
    try {
      cachedRates = JSON.parse(stored);
    } catch {
      cachedRates = { ...BUNDLED_RATES };
    }
  }
}

export async function fetchRates(): Promise<boolean> {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    if (!res.ok) return false;
    const data = await res.json();
    cachedRates = data.rates;
    await setItem(RATES_KEY, JSON.stringify(cachedRates));
    await setItem(RATES_DATE_KEY, new Date().toISOString().split('T')[0]);
    return true;
  } catch {
    return false;
  }
}

export async function getRatesDate(): Promise<string | null> {
  return getItem(RATES_DATE_KEY);
}

export function convertToHome(amount: number, fromCurrency: string, homeCurrency: string): number {
  if (fromCurrency === homeCurrency) return amount;
  const fromRate = cachedRates[fromCurrency] ?? 1;
  const toRate = cachedRates[homeCurrency] ?? 1;
  return (amount / fromRate) * toRate;
}

export function getRates(): Record<string, number> {
  return { ...cachedRates };
}
