import { Payload, SummarizationPayload, TranslationPayload, WeatherQueryPayload } from "../types/tasks.js";
import { Action } from "../types/webhooks.js";
import { SummarizationResult, summarizeText } from "./summarization.js";
import { translateText, TranslationResult } from "./translation.js";
import { getTodayMatches, TodayMatchesResult } from "./today-matches.js";
import { getWeather, WeatherQueryResult } from "./weather-query.js";

export type ActionResult = SummarizationResult | TranslationResult | WeatherQueryResult | TodayMatchesResult;

export async function executeAction(action: Action, payload: Payload): Promise<ActionResult | undefined> {
    if (action === "SUMMARIZATION") {
        const summarizationPayload = payload as SummarizationPayload;
        return await summarizeText(summarizationPayload.text);
    }

    if (action === "TRANSLATION") {
        const translationPayload = payload as TranslationPayload;
        return await translateText(translationPayload.text, translationPayload.destLanguage);
    }

    if (action === "WEATHER-QUERY") {
        const weatherQueryPayload = payload as WeatherQueryPayload;
        return await getWeather(weatherQueryPayload.city);
    }

    if (action === "TODAY-MATCHES") {
        return await getTodayMatches();
    }
}