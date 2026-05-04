import { requireOptionalNativeModule } from 'expo-modules-core';

export type OcrResult = {
  text: string;
  blocks: any[];
};

const EMPTY: OcrResult = { text: '', blocks: [] };

export async function recognizeText(imageUri: string): Promise<OcrResult> {
  const nativeModule = requireOptionalNativeModule('RNMLKitTextRecognition');
  if (!nativeModule) {
    return EMPTY;
  }

  try {
    const module = require('@infinitered/react-native-mlkit-text-recognition');
    const result = await module.recognizeText(imageUri);
    return { text: result.text, blocks: result.blocks };
  } catch {
    return EMPTY;
  }
}
