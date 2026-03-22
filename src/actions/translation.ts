import * as deepl from 'deepl-node';
import { apiConfig } from '../config.js';

const authKey = apiConfig.externalApisKeys.deepL; 
const deeplClient = new deepl.DeepLClient(authKey);

export async function translate(text: string, destLanguage: string): Promise<{ translatedText: string }> {
    const result = await deeplClient.translateText(text, null, destLanguage as deepl.TargetLanguageCode);
    return {
        translatedText: result.text
    };
}