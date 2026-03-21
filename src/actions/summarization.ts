import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function summarizeText(text: string): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this text briefly: ${text}`,
  });
  return response.text;
}