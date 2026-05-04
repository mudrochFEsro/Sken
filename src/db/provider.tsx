import React from 'react';
import { SQLiteProvider as ExpoSQLiteProvider } from 'expo-sqlite';
import { CREATE_SCANS_TABLE, CREATE_INDEXES, CREATE_SCHEMA_VERSION } from './schema';

const DB_NAME = 'sken.db';

async function initDatabase(db: import('expo-sqlite').SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync(CREATE_SCANS_TABLE);
  await db.execAsync(CREATE_INDEXES);
  await db.execAsync(CREATE_SCHEMA_VERSION);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExpoSQLiteProvider databaseName={DB_NAME} onInit={initDatabase}>
      {children}
    </ExpoSQLiteProvider>
  );
}
