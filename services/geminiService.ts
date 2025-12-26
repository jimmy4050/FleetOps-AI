
import { GoogleGenAI } from "@google/genai";
import { Vehicle, MaintenanceRecord } from "../types";

// Correctly initialize GoogleGenAI with a named parameter using the direct API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFleetInsights = async (vehicles: Vehicle[], maintenance: MaintenanceRecord[]) => {
  const prompt = `
    Analyze this fleet data and provide strategic recommendations for the fleet manager.
    Focus on:
    1. Maintenance scheduling optimization.
    2. Potential risks based on mileage and fuel levels.
    3. Operational efficiency.

    Fleet Data:
    ${JSON.stringify(vehicles)}

    Recent Maintenance:
    ${JSON.stringify(maintenance)}
  `;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for advanced reasoning and strategic data analysis.
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Enterprise Fleet Consultant. Provide concise, data-driven insights. Use bullet points.",
        temperature: 0.7,
      },
    });

    // Access text property directly from GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate insights at this time. Please check your network connection.";
  }
};

export const chatWithAdvisor = async (query: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for intelligent fleet advisor interaction.
      model: "gemini-3-pro-preview",
      contents: `User Query: ${query}\n\nContext Data: ${JSON.stringify(context)}`,
      config: {
        systemInstruction: "You are FleetOps AI Assistant. Help the user manage their fleet using the provided context.",
      }
    });
    return response.text;
  } catch (error) {
    return "Error communicating with AI Advisor.";
  }
};
