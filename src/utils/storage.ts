import { Platform } from 'react-native';

let AsyncStorageModule: any = null;

async function getAsyncStorage() {
  if (Platform.OS === 'web') return null;
  if (!AsyncStorageModule) {
    AsyncStorageModule = (await import('@react-native-async-storage/async-storage')).default;
  }
  return AsyncStorageModule;
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const storage = await getAsyncStorage();
  return storage?.getItem(key) ?? null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  const storage = await getAsyncStorage();
  await storage?.setItem(key, value);
}
