
import { GoogleGenAI } from "@google/genai";
import { FundingGrant, StrategyItem } from "../types";

export const generateExecutiveReport = async (
  fundingData: FundingGrant[],
  strategyData: StrategyItem[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure the environment variable.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert fundraising consultant for a charity. 
    Analyze the following data and provide an Executive Summary Report in Markdown format.
    
    Data Provided:
    1. Funding & Grants List: ${JSON.stringify(fundingData)}
    2. Strategy Development Items: ${JSON.stringify(strategyData)}

    Please structure the report with the following sections:
    1. **Executive Summary**: A brief overview of the current funding landscape.
    2. **Critical Deadlines**: Identify the most urgent deadlines (Date for funding) coming up in the next 3 months.
    3. **Financial Outlook**: Summarize the total potential funding vs. secured/approved funding.
    4. **Strategy Recommendations**: Based on the strategy items and funding gaps, suggest 3 key actions.
    5. **SMT Review Status**: Highlight any items stuck in 'Pending Review' that need immediate attention.

    Keep the tone professional, encouraging, and action-oriented.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No report generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate report. Please try again later.";
  }
};
