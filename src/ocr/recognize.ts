import { Platform } from 'react-native';

export type OcrResult = {
  text: string;
  blocks: any[];
};

export async function recognizeText(imageUri: string): Promise<OcrResult> {
  if (Platform.OS === 'web') {
    return { text: '', blocks: [] };
  }

  const { recognizeText: mlkitRecognize } = await import(
    '@infinitered/react-native-mlkit-text-recognition'
  );
  const result = await mlkitRecognize(imageUri);
  return {
    text: result.text,
    blocks: result.blocks,
  };
}
