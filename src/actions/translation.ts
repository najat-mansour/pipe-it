import * as deepl from 'deepl-node';
import { apiConfig } from '../config.js';

const authKey = apiConfig.externalApisKeys.deepL; 
const deeplClient = new deepl.DeepLClient(authKey);

export type TranslationResult = {
    translatedText: string;
}

export async function translateText(text: string, destLanguage: string): Promise<TranslationResult> {
    const result = await deeplClient.translateText(text, null, destLanguage as deepl.TargetLanguageCode);
    return {
        translatedText: result.text
    };
}