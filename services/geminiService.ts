
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service to handle AI-powered features using the Google Gemini API.
 */

export const evaluateSolutionWithAI = async (problemDescription: string, solutionContent: string) => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the following student code/explanation for a technical simulation.
      Problem Context: ${problemDescription}
      Student Solution: ${solutionContent}
      
      Analyze logic, readability, and effectiveness.`,
      config: {
        systemInstruction: "You are a technical mentor. Return a suggested score (0-100) and brief critique flags.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedScore: { type: Type.INTEGER },
            reasoning: { type: Type.STRING },
            flags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Short labels like 'Great Logic', 'Missing Tests', 'Incomplete'"
            }
          },
          required: ["suggestedScore", "reasoning", "flags"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    return null;
  }
};

export const refineProblemDescription = async (rawDescription: string): Promise<string> => {
  if (!process.env.API_KEY) return rawDescription;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refine this description: "${rawDescription}"`,
      config: {
        systemInstruction: "You are a world-class senior engineering manager specializing in technical documentation."
      }
    });
    return response.text || rawDescription;
  } catch (error) {
    return rawDescription;
  }
};

export const getLiveInsights = async (): Promise<string[]> => {
  const fallback = ["Optimizing LLM latency", "Scaling microservices", "Zero-trust auth"];
  if (!process.env.API_KEY) return fallback;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 7 software engineering headlines.",
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return fallback;
  }
};
