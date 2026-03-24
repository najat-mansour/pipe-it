import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export type SummarizationResult = {
  summarizedText: string | undefined;
};

export async function summarizeText(
  text: string,
): Promise<SummarizationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this text briefly: ${text}`,
  });

  return {
    summarizedText: response.text,
  };
}
