import type { SQLiteDatabase } from 'expo-sqlite';
import type { Scan } from './schema';

export async function insertScan(
  db: SQLiteDatabase,
  scan: Omit<Scan, 'created_at' | 'updated_at'>
): Promise<void> {
  await db.runAsync(
    `INSERT INTO scans (id, merchant, amount, currency, date, category, notes, image_uri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [scan.id, scan.merchant, scan.amount, scan.currency, scan.date, scan.category, scan.notes, scan.image_uri]
  );
}

export async function getAllScans(db: SQLiteDatabase): Promise<Scan[]> {
  return db.getAllAsync<Scan>('SELECT * FROM scans ORDER BY created_at DESC');
}

export async function getScanById(db: SQLiteDatabase, id: string): Promise<Scan | null> {
  return db.getFirstAsync<Scan>('SELECT * FROM scans WHERE id = ?', [id]);
}

export async function updateScan(
  db: SQLiteDatabase,
  id: string,
  fields: Partial<Omit<Scan, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const entries = Object.entries(fields).filter(([_, v]) => v !== undefined);
  if (entries.length === 0) return;

  const sets = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([_, v]) => v);

  await db.runAsync(
    `UPDATE scans SET ${sets}, updated_at = datetime('now') WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteScan(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM scans WHERE id = ?', [id]);
}

export async function getMonthlyTotal(
  db: SQLiteDatabase,
  year: number,
  month: number
): Promise<{ total: number; currency: string }> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  const result = await db.getFirstAsync<{ total: number; currency: string }>(
    `SELECT COALESCE(SUM(amount), 0) as total, COALESCE(MAX(currency), 'EUR') as currency
     FROM scans WHERE date >= ? AND date < ?`,
    [startDate, endDate]
  );

  return result ?? { total: 0, currency: 'EUR' };
}

export async function getScansByMonth(
  db: SQLiteDatabase,
  year: number,
  month: number
): Promise<Scan[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  return db.getAllAsync<Scan>(
    'SELECT * FROM scans WHERE date >= ? AND date < ? ORDER BY created_at DESC',
    [startDate, endDate]
  );
}
