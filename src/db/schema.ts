export const CREATE_SCANS_TABLE = `
  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    merchant TEXT NOT NULL DEFAULT '',
    amount REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'EUR',
    date TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'other',
    notes TEXT DEFAULT '',
    image_uri TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_scans_date ON scans(date);
  CREATE INDEX IF NOT EXISTS idx_scans_category ON scans(category);
  CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
`;

export const CREATE_SCHEMA_VERSION = `
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY
  );
`;

export type Scan = {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  notes: string;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
};
