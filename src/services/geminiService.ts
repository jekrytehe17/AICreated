import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generatePoC = async (userInput: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const model = "gemini-3-flash-preview";
  const systemInstruction = `You are AICreated, an AI specialized in generating professional and modern Slide Presentations for Proof of Concept (PoC) documents. 
  When a user provides a concept, you should create a structured slide presentation where each slide is clearly separated by a horizontal rule (---).
  
  The presentation should include:
  1. Title Slide (Project Name, Date, Prepared by AICreated)
  2. Executive Summary
  3. Problem Statement & Market Pain Points
  4. Proposed Solution & Value Proposition
  5. Key Features & Functionality (2-3 slides if needed)
  6. Technical Architecture & Implementation Details
  7. Success Metrics & KPIs
  8. Project Roadmap & Timeline
  9. Conclusion
  
  Format the output in clean Markdown. Use '---' to separate slides. Each slide should have a clear heading (##) and concise, high-impact bullet points. The tone should be professional, innovative, and compelling.`;

  try {
    const result = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generatePoCStream = async (userInput: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const model = "gemini-3-flash-preview";
  const systemInstruction = `You are AICreated, an AI specialized in generating professional and modern Slide Presentations for Proof of Concept (PoC) documents. 
  When a user provides a concept, you should create a structured slide presentation where each slide is clearly separated by a horizontal rule (---).
  
  The presentation should include:
  1. Title Slide (Project Name, Date, Prepared by AICreated)
  2. Executive Summary
  3. Problem Statement & Market Pain Points
  4. Proposed Solution & Value Proposition
  5. Key Features & Functionality (2-3 slides if needed)
  6. Technical Architecture & Implementation Details
  7. Success Metrics & KPIs
  8. Project Roadmap & Timeline
  9. Conclusion
  
  Format the output in clean Markdown. Use '---' to separate slides. Each slide should have a clear heading (##) and concise, high-impact bullet points. The tone should be professional, innovative, and compelling.`;

  return ai.models.generateContentStream({
    model: model,
    contents: [{ role: "user", parts: [{ text: userInput }] }],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
};
