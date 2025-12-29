
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service to handle AI-powered features using the Google Gemini API.
 */

// Refines a raw problem description into a more professional and clear technical brief.
export const refineProblemDescription = async (rawDescription: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing. Skipping refinement.");
    return rawDescription;
  }

  try {
    // Initializing Gemini client with named parameter and process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Please refine and improve the following technical problem description for a professional bounty platform.
Make it clearer, more structured, and technically precise while maintaining all original requirements:

"${rawDescription}"`,
      config: {
        systemInstruction: "You are a world-class senior engineering manager specializing in technical documentation."
      }
    });

    // Directly accessing .text property on the response object.
    return response.text || rawDescription;
  } catch (error) {
    console.error("Gemini refinement error:", error);
    return rawDescription;
  }
};

// Fetches live trending engineering insights.
export const getLiveInsights = async (): Promise<string[]> => {
  const fallbackInsights = [
    "Optimizing Large Language Model latency for edge devices",
    "Scaling distributed databases for real-time analytics",
    "Securing cross-origin authentication in zero-trust architectures",
    "Refactoring legacy monoliths to serverless microservices",
    "Implementing robust encryption for sensitive data",
    "Reducing memory overhead in high-frequency systems",
    "Automating Kubernetes cluster management with operators"
  ];

  if (!process.env.API_KEY) return fallbackInsights;

  try {
    // Initializing Gemini client with named parameter and process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 7 trending software engineering industry headlines.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    // Directly accessing .text property on the response object.
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini insights error:", error);
    return fallbackInsights;
  }
};
