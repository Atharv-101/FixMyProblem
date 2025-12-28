
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the mandatory API key from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Refines a problem description to be more technical and clear.
 */
export const refineProblemDescription = async (rawDescription: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite this problem description to be professional and technical for CS students: "${rawDescription}"`,
      config: {
        systemInstruction: "You are a Senior Technical Project Manager at a top tech company."
      }
    });
    // Use .text property directly as per the extracted string output guidelines
    return response.text || rawDescription;
  } catch (error) {
    console.error("Gemini refinement failed:", error);
    return rawDescription;
  }
};

/**
 * Fetches real-time industry insights and tech roadblocks using Google Search grounding.
 */
export const getLiveInsights = async (): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "What are 5 trending technical challenges or bugs reported by major tech companies in the last 7 days? Provide a list of short headlines.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    // Simplistic parsing for the list items from the .text property
    const text = response.text || "";
    const lines = text.split('\n').filter(l => l.trim().length > 5).map(l => l.replace(/^[0-9.-]*/, '').trim());
    return lines.length > 0 ? lines : [
      "Optimizing Large Language Model latency",
      "Scaling distributed databases for real-time analytics",
      "Securing cross-origin authentication protocols",
      "Refactoring legacy monoliths to serverless microservices",
      "Implementing zero-trust architecture in hybrid clouds"
    ];
  } catch (error) {
    console.error("Failed to fetch live insights:", error);
    return ["Protocol active. System status: OPTIMAL."];
  }
};
