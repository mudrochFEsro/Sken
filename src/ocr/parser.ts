import { getDefaultCurrency } from '../utils/currency';

export type ParsedReceipt = {
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  confidence: number;
  rawText: string;
};

const TOTAL_KEYWORDS = [
  'total', 'amount', 'sum', 'due', 'pay', 'grand total',
  'celkom', 'spolu', 'suma', 'k úhrade',
  'celkem', 'částka',
  'gesamt', 'betrag', 'summe',
  'итого', 'сумма', 'к оплате',
  'total', 'montant',
  '合計', '合算',
  'ukupno', 'iznos',
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  '€': 'EUR', '$': 'USD', '£': 'GBP', '¥': 'JPY',
  'Kč': 'CZK', 'zł': 'PLN', '₽': 'RUB', 'kn': 'HRK',
  'CHF': 'CHF', 'kr': 'SEK',
};

const CURRENCY_CODES = ['EUR', 'USD', 'GBP', 'CZK', 'JPY', 'CHF', 'PLN', 'RUB', 'HRK', 'SEK', 'NOK', 'DKK', 'HUF'];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ['restaurant', 'food', 'grocery', 'supermarket', 'cafe', 'bistro', 'pizz', 'burger', 'sushi', 'potraviny', 'jedlo', 'reštaurácia', 'lebensmittel', 'essen'],
  transport: ['taxi', 'uber', 'bolt', 'fuel', 'gas', 'petrol', 'diesel', 'parking', 'benzín', 'nafta', 'tankstelle'],
  travel: ['hotel', 'flight', 'airbnb', 'booking', 'train', 'bus', 'vlak', 'letenk'],
  office: ['office', 'paper', 'ink', 'toner', 'staples', 'kancelár'],
  health: ['pharmacy', 'lekáreň', 'apotheke', 'doctor', 'clinic', 'hospital'],
  entertainment: ['cinema', 'theater', 'concert', 'kino', 'divadlo'],
  utilities: ['electric', 'water', 'internet', 'phone', 'vodárne', 'elektrárne'],
};

function extractAmount(text: string): { amount: number; confidence: number } {
  const lines = text.split('\n');
  let bestAmount = 0;
  let bestConfidence = 0;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const hasKeyword = TOTAL_KEYWORDS.some((kw) => lower.includes(kw));

    const matches = line.match(/(\d{1,3}(?:[.,\s]\d{3})*[.,]\d{2})/g);
    if (!matches) continue;

    for (const match of matches) {
      const normalized = match.replace(/\s/g, '').replace(',', '.');
      const value = parseFloat(normalized);
      if (isNaN(value) || value <= 0) continue;

      const confidence = hasKeyword ? 0.9 : 0.4;
      if (confidence > bestConfidence || (confidence === bestConfidence && value > bestAmount)) {
        bestAmount = value;
        bestConfidence = confidence;
      }
    }
  }

  return { amount: bestAmount, confidence: bestConfidence };
}

function extractMerchant(text: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return '';
  const first = lines[0];
  if (first.length > 2 && first.length < 60) return first;
  const capitalized = lines.find((l) => l === l.toUpperCase() && l.length > 2 && l.length < 60);
  return capitalized ?? first.substring(0, 50);
}

function extractDate(text: string): string | null {
  const patterns = [
    /(\d{4})-(\d{2})-(\d{2})/,
    /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{1,2})-(\d{1,2})-(\d{4})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    if (pattern === patterns[0]) {
      return match[0];
    }

    const [, a, b, year] = match;
    const day = parseInt(a) > 12 ? a : b;
    const month = parseInt(a) > 12 ? b : a;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null;
}

function extractCurrency(text: string): string | null {
  for (const [symbol, code] of Object.entries(CURRENCY_SYMBOLS)) {
    if (text.includes(symbol)) return code;
  }
  for (const code of CURRENCY_CODES) {
    if (text.toUpperCase().includes(code)) return code;
  }
  return null;
}

function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return 'other';
}

export function parseReceipt(rawText: string): ParsedReceipt {
  const { amount, confidence: amountConfidence } = extractAmount(rawText);
  const merchant = extractMerchant(rawText);
  const date = extractDate(rawText) ?? new Date().toISOString().split('T')[0];
  const currency = extractCurrency(rawText) ?? getDefaultCurrency();
  const category = inferCategory(rawText);

  const hasDate = extractDate(rawText) !== null;
  const hasMerchant = merchant.length > 0;
  const confidence = Math.min(
    1,
    (amountConfidence * 0.4) + (hasDate ? 0.25 : 0) + (hasMerchant ? 0.2 : 0) + (currency ? 0.15 : 0)
  );

  return { merchant, amount, currency, date, category, confidence, rawText };
}
