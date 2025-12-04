import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, SupportedLanguage } from "../types";

// Schema definition for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, one-sentence summary of the main error.",
    },
    errorType: {
      type: Type.STRING,
      description: "The category of error (e.g., Syntax Error, Runtime Error, Logical Error, Memory Leak).",
    },
    detailedExplanation: {
      type: Type.STRING,
      description: "A beginner-friendly, markdown-formatted explanation of why the error occurred, using analogies if helpful.",
    },
    technicalDetails: {
      type: Type.STRING,
      description: "A more technical explanation of what is happening at the compiler/interpreter level (e.g., stack vs heap, memory allocation details, precedence rules).",
    },
    complexity: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.STRING, description: "Time complexity (Big O) of the code, with a brief reason." },
        space: { type: Type.STRING, description: "Space complexity (Big O) of the code, with a brief reason." }
      },
      required: ["time", "space"],
      description: "The algorithmic complexity analysis of the provided code."
    },
    correctedCode: {
      type: Type.STRING,
      description: "The complete corrected version of the code. Add comments explaining fixes.",
    },
    bestPractices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 tips, best practices, or potential optimizations related to the code snippet.",
    },
  },
  required: ["summary", "errorType", "detailedExplanation", "technicalDetails", "complexity", "correctedCode"],
};

export const analyzeCode = async (
  code: string,
  language: SupportedLanguage,
  apiKey: string
): Promise<AnalysisResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a world-class Senior Software Engineer and Mentor. Your goal is to debug code and teach the user.
    
    Language: ${language}
    
    Code to Analyze:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Task:
    1. Identify any syntax errors, runtime errors, memory issues, or logical flaws.
    2. Analyze the Time and Space complexity of the algorithm.
    3. Provide a 'Technical Deep Dive' explaining exactly what the computer is doing wrong (e.g., "The pointer is accessing a memory address 0x0 which is reserved...").
    4. Provide a 'Beginner Explanation' using simple analogies.
    5. Write the corrected code with comments.
    
    If the code is already correct, suggest an advanced optimization or alternative implementation that is more idiomatic, and explain why.
    
    Output must strictly follow the JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Lower temperature for more precise technical analysis
        thinkingConfig: { thinkingBudget: 2048 } // Increased budget for complexity analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze code. Please try again.");
  }
};