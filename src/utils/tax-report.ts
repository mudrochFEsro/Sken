import type { Scan } from '../db/schema';
import { getCurrencySymbol } from './currency';
import { CATEGORIES, type Category } from './categories';
import { convertToHome } from './exchange-rates';

type ReportData = {
  scans: Scan[];
  homeCurrency: string;
  fromDate: string;
  toDate: string;
  title: string;
  generatedLabel: string;
  categoryLabels: Record<string, string>;
  totalLabel: string;
  dateLabel: string;
  merchantLabel: string;
  amountLabel: string;
  categoryLabel: string;
  convertedLabel: string;
};

export function generateTaxReportHTML(data: ReportData): string {
  const { scans, homeCurrency, fromDate, toDate, title, generatedLabel, categoryLabels, totalLabel, dateLabel, merchantLabel, amountLabel, categoryLabel, convertedLabel } = data;
  const symbol = getCurrencySymbol(homeCurrency);

  const byCategory: Record<string, { scans: Scan[]; total: number }> = {};
  for (const cat of CATEGORIES) {
    byCategory[cat] = { scans: [], total: 0 };
  }

  let grandTotal = 0;
  for (const scan of scans) {
    const cat = scan.category || 'other';
    const converted = convertToHome(scan.amount, scan.currency, homeCurrency);
    if (byCategory[cat]) {
      byCategory[cat].scans.push(scan);
      byCategory[cat].total += converted;
    }
    grandTotal += converted;
  }

  const categoryRows = CATEGORIES
    .filter((cat) => byCategory[cat].scans.length > 0)
    .map((cat) => {
      const { scans: catScans, total } = byCategory[cat];
      const scanRows = catScans
        .map(
          (s) =>
            `<tr><td>${s.date}</td><td>${s.merchant || '—'}</td><td style="text-align:right">${getCurrencySymbol(s.currency)}${s.amount.toFixed(2)}</td><td style="text-align:right">${symbol}${convertToHome(s.amount, s.currency, homeCurrency).toFixed(2)}</td></tr>`
        )
        .join('');
      return `
        <h3>${categoryLabels[cat] || cat}</h3>
        <table>
          <thead><tr><th>${dateLabel}</th><th>${merchantLabel}</th><th style="text-align:right">${amountLabel}</th><th style="text-align:right">${convertedLabel} (${homeCurrency})</th></tr></thead>
          <tbody>${scanRows}</tbody>
          <tfoot><tr><td colspan="3"><strong>${totalLabel}</strong></td><td style="text-align:right"><strong>${symbol}${total.toFixed(2)}</strong></td></tr></tfoot>
        </table>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #0a0a0a; font-size: 12px; }
  h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
  h3 { font-size: 14px; font-weight: 600; margin: 20px 0 8px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; }
  .meta { color: #737373; font-size: 11px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px; }
  th { font-weight: 600; background: #fafafa; }
  tfoot td { border-top: 2px solid #0a0a0a; border-bottom: none; }
  .grand { font-size: 16px; font-weight: 600; margin-top: 24px; border-top: 2px solid #0a0a0a; padding-top: 12px; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">${fromDate} — ${toDate} · ${generatedLabel} ${new Date().toLocaleDateString()}</p>
  ${categoryRows}
  <p class="grand">${totalLabel}: ${symbol}${grandTotal.toFixed(2)}</p>
</body>
</html>`;
}
