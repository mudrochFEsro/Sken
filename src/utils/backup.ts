import {
  documentDirectory,
  cacheDirectory,
  copyAsync,
  getInfoAsync,
  makeDirectoryAsync,
  deleteAsync,
  readDirectoryAsync,
} from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const DB_NAME = 'sken.db';
const IMAGES_DIR = `${documentDirectory}scans/`;
const DB_PATH = `${documentDirectory}SQLite/${DB_NAME}`;

export async function exportBackup(): Promise<string | null> {
  const backupDir = `${cacheDirectory}sken-backup/`;
  const backupDb = `${backupDir}${DB_NAME}`;
  const backupImages = `${backupDir}scans/`;

  const info = await getInfoAsync(backupDir);
  if (info.exists) await deleteAsync(backupDir);
  await makeDirectoryAsync(backupDir, { intermediates: true });

  const dbInfo = await getInfoAsync(DB_PATH);
  if (!dbInfo.exists) return null;
  await copyAsync({ from: DB_PATH, to: backupDb });

  const imagesInfo = await getInfoAsync(IMAGES_DIR);
  if (imagesInfo.exists) {
    await makeDirectoryAsync(backupImages, { intermediates: true });
    const files = await readDirectoryAsync(IMAGES_DIR);
    for (const file of files) {
      await copyAsync({ from: `${IMAGES_DIR}${file}`, to: `${backupImages}${file}` });
    }
  }

  return backupDir;
}

export async function shareBackup(): Promise<boolean> {
  const dbInfo = await getInfoAsync(DB_PATH);
  if (!dbInfo.exists) return false;

  const backupPath = `${cacheDirectory}sken-backup.db`;
  await copyAsync({ from: DB_PATH, to: backupPath });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(backupPath, {
      mimeType: 'application/octet-stream',
      dialogTitle: 'Sken Backup',
      UTI: 'public.database',
    });
    return true;
  }
  return false;
}

export async function importBackup(backupDbUri: string): Promise<boolean> {
  try {
    const sqliteDir = `${documentDirectory}SQLite/`;
    const dirInfo = await getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await makeDirectoryAsync(sqliteDir, { intermediates: true });
    }
    await copyAsync({ from: backupDbUri, to: DB_PATH });
    return true;
  } catch {
    return false;
  }
}

export async function getBackupInfo(): Promise<{ exists: boolean; size: number } | null> {
  const dbInfo = await getInfoAsync(DB_PATH);
  if (!dbInfo.exists) return null;
  return { exists: true, size: (dbInfo as any).size ?? 0 };
}
