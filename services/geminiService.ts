
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service to handle AI-powered features using the Google Gemini API.
 */

// Refines a raw problem description into a more professional and clear technical brief.
export const refineProblemDescription = async (rawDescription: string): Promise<string> => {
  // Always initialize inside the function to ensure the shim 'process.env' is available
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing. Skipping refinement.");
    return rawDescription;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please refine and improve the following technical problem description for a professional bounty platform. 
      Make it clearer, more structured, and technically precise while maintaining all original requirements:
      
      "${rawDescription}"`,
      config: {
        systemInstruction: "You are a world-class senior engineering manager. You specialize in writing clear, professional problem statements."
      }
    });
    
    return response.text || rawDescription;
  } catch (error) {
    console.error("Gemini refinement error:", error);
    return rawDescription;
  }
};

// Fetches live trending engineering insights.
export const getLiveInsights = async (): Promise<string[]> => {
  const apiKey = process.env.API_KEY;
  const fallbackInsights = [
    "Optimizing Large Language Model latency for edge devices",
    "Scaling distributed databases for real-time analytics",
    "Securing cross-origin authentication in zero-trust architectures",
    "Refactoring legacy monoliths to serverless microservices",
    "Implementing robust encryption for sensitive data",
    "Reducing memory overhead in high-frequency systems",
    "Automating Kubernetes cluster management with operators"
  ];

  if (!apiKey) return fallbackInsights;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 7 trending software engineering industry headlines. Return as a JSON array of strings only.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text || "[]";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini insights error:", error);
    return fallbackInsights;
  }
};
