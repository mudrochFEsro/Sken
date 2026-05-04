import {
  documentDirectory,
  makeDirectoryAsync,
  moveAsync,
  getInfoAsync,
  deleteAsync,
} from 'expo-file-system/legacy';

const IMAGES_DIR = `${documentDirectory}scans/`;

async function ensureDir() {
  const info = await getInfoAsync(IMAGES_DIR);
  if (!info.exists) {
    await makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  }
}

export async function saveImage(scanId: string, tempUri: string): Promise<string> {
  await ensureDir();
  const dest = `${IMAGES_DIR}${scanId}.jpg`;
  await moveAsync({ from: tempUri, to: dest });
  return dest;
}

export async function getImageUri(scanId: string): Promise<string | null> {
  const path = `${IMAGES_DIR}${scanId}.jpg`;
  const info = await getInfoAsync(path);
  return info.exists ? path : null;
}

export async function deleteImage(scanId: string): Promise<void> {
  const path = `${IMAGES_DIR}${scanId}.jpg`;
  const info = await getInfoAsync(path);
  if (info.exists) {
    await deleteAsync(path);
  }
}
