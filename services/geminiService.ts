import { GoogleGenAI } from "@google/genai";

// Safely access process.env to avoid "process is not defined" crashes in browser
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Refines a problem description to be more technical and clear.
 */
export const refineProblemDescription = async (rawDescription: string): Promise<string> => {
  if (!apiKey) return rawDescription;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a Senior Technical Project Manager. Rewrite the following problem description to be professional, clear, and structured for computer science students. Keep the core meaning but improve formatting.
      
      Original: "${rawDescription}"`,
    });
    return response.text || rawDescription;
  } catch (error) {
    console.error("Gemini refinement failed:", error);
    return rawDescription;
  }
};

/**
 * Analyzes a solution and gives a brief summary/rating suggestion.
 */
export const analyzeSolution = async (problem: string, solution: string): Promise<string> => {
  if (!apiKey) return "AI Analysis unavailable.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: A company posted a problem: "${problem}".
      A student submitted this solution: "${solution}".
      
      Please provide a 2-sentence summary of whether this solution seems relevant and helpful.`,
    });
    return response.text || "Could not analyze.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Analysis failed.";
  }
};