import type { Scan } from '../db/schema';

function escapeField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCSV(scans: Scan[]): string {
  const headers = ['ID', 'Merchant', 'Amount', 'Currency', 'Date', 'Category', 'Notes', 'Created'];
  const rows = scans.map((s) => [
    s.id,
    escapeField(s.merchant),
    s.amount.toString(),
    s.currency,
    s.date,
    s.category,
    escapeField(s.notes ?? ''),
    s.created_at,
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
