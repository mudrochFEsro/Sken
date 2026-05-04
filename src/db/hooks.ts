import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { Scan } from './schema';
import * as ops from './operations';

export function useScans() {
  const db = useSQLiteContext();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await ops.getAllScans(db);
    setScans(data);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { scans, loading, refresh };
}

export function useScan(id: string | null) {
  const db = useSQLiteContext();
  const [scan, setScan] = useState<Scan | null>(null);

  useEffect(() => {
    if (!id) return;
    ops.getScanById(db, id).then(setScan);
  }, [db, id]);

  return scan;
}

export function useMonthlyTotal(year: number, month: number) {
  const db = useSQLiteContext();
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    ops.getMonthlyTotal(db, year, month).then((result) => {
      setTotal(result.total);
      setCurrency(result.currency);
    });
  }, [db, year, month]);

  return { total, currency };
}

export function useSaveScan() {
  const db = useSQLiteContext();

  return useCallback(
    async (scan: Omit<Scan, 'created_at' | 'updated_at'>) => {
      const existing = await ops.getScanById(db, scan.id);
      if (existing) {
        const { id, ...fields } = scan;
        await ops.updateScan(db, id, fields);
      } else {
        await ops.insertScan(db, scan);
      }
    },
    [db]
  );
}

export function useDeleteScan() {
  const db = useSQLiteContext();
  return useCallback((id: string) => ops.deleteScan(db, id), [db]);
}
