import { Paths, File, Directory } from 'expo-file-system';

const IMAGES_DIR_NAME = 'scans';

function getImagesDir(): Directory {
  return new Directory(Paths.document, IMAGES_DIR_NAME);
}

function ensureDir(): void {
  const dir = getImagesDir();
  if (!dir.exists) {
    dir.create();
  }
}

export async function saveImage(scanId: string, tempUri: string): Promise<string> {
  ensureDir();
  const source = new File(tempUri);
  const dest = new File(getImagesDir(), `${scanId}.jpg`);
  source.move(dest);
  return dest.uri;
}

export function getImageUri(scanId: string): string | null {
  const file = new File(getImagesDir(), `${scanId}.jpg`);
  return file.exists ? file.uri : null;
}

export function deleteImage(scanId: string): void {
  const file = new File(getImagesDir(), `${scanId}.jpg`);
  if (file.exists) {
    file.delete();
  }
}
