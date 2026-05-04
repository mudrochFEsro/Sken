export function formatDate(isoDate: string, locale = 'en'): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function getMonthName(month: number, locale = 'en'): string {
  const date = new Date(2024, month - 1, 1);
  return date.toLocaleDateString(locale, { month: 'long' });
}
