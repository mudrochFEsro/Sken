export type OcrResult = {
  text: string;
  blocks: any[];
};

const EMPTY: OcrResult = { text: '', blocks: [] };

export async function recognizeText(imageUri: string): Promise<OcrResult> {
  try {
    const module = require('@infinitered/react-native-mlkit-text-recognition');
    const result = await module.recognizeText(imageUri);
    return { text: result.text, blocks: result.blocks };
  } catch {
    return EMPTY;
  }
}
