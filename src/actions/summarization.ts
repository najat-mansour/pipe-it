import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function summarizeText(text: string): Promise<{ summary: string | undefined }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this text briefly: ${text}`,
  });
  return {
    summary: response.text
  };
}