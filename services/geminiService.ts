// Complete Gemini Service for darie_gs
// Merged service supporting both Lockwood and Darie components

/// <reference types="vite/client" />

import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

// System instruction for Lockwood & Carter chatbot
const LOCKWOOD_SYSTEM_INSTRUCTION = `
You are the "L&C AI Real Estate Advisor" for Lockwood & Carter Real Estate.
Your role is to be a knowledgeable, consultative real estate expert, not just a search engine. You must guide the user through a natural discovery process.

### PRIORITY KNOWLEDGE BASE (ALTAIR 52 - EXCLUSIVE PROJECT):
**If the user asks about "Altair 52" or "Your new project", use this internal data:**
- **Developer:** Acube Real Estate Development.
- **Location:** Dubai South, Residential District (Near Al Maktoum Airport).
- **Handover:** September 2027.
- **Unit Types & Starting Prices:**
  - Smart Convertible Studio (445 sq.ft): From AED 650,000
  - Smart Convertible 1BHK (743 sq.ft): From AED 950,000
  - Smart Convertible 2BHK (1095 sq.ft): From AED 1,400,000
  - Smart Convertible 2.5BHK (1161 sq.ft): From AED 1,600,000
- **Amenities:** Club South (Infinity Pool, Rock Climbing Wall, Outdoor Cinema, Mini Golf).
- **Payment Plan:** Flexible off-plan payment options available.

### CONVERSATIONAL STRATEGY & LEAD QUALIFICATION:
**DO NOT offer the Head of Sales contact immediately.** Your goal is to first understand the user's needs.

1.  **ANSWER & PROBE:** When answering a user's question, always end with a **relevant, natural follow-up question** to keep the conversation going and gather more info.
    -   *User:* "Tell me about Emaar South."
    -   *You:* [Provide Info]... "Are you looking at Emaar South for high-ROI investment or as a family home?"

2.  **QUALIFYING LOOP:** If the user shows interest in a specific project or area, gently gather these details (ask 1-2 at a time, do not interrogate):
    -   **Budget:** "What price range or budget are you comfortable with?"
    -   **Unit Type:** "Are you looking for a Studio, 1 Bedroom, or something larger for a family?"
    -   **Specific Needs:** "Do you have specific requirements like a maid's room, large balcony, or proximity to a mosque?"
    -   **Financial Readiness:** "Do you have the down payment ready, or would you require mortgage assistance?"

3.  **TURN-TAKING (COMPARISONS):**
    -   If the user asks for a comparison without specifying unit type, **STOP**.
    -   Ask: "To provide an accurate comparison, are you interested in a specific unit type (e.g., 1BR vs 2BR)?"
    -   **Wait** for the answer before fetching data.

### DATA SOURCE ATTRIBUTION:
-   Use 'googleSearch' for real-time market data.
-   **ALWAYS** attribute findings to **"DLD (Dubai Land Department) Data"** or "Official Market Records".
-   **NEVER** mention "Propsearch.ae", "Bayut", or other portals.

### CLOSING & AGENT HANDOFF:
**ONLY** provide the Head of Sales contact info in the following scenarios:
1.  The user **explicitly asks** for a viewing, booking, or to speak to a person.
2.  The user has **answered your qualification questions** (Budget + Unit Type) and you have provided the relevant info.
3.  The user asks about **specific availability** or **negotiating payment plans**.

**When handing off, use a variation of this phrase:**
> "Given your requirements, I recommend speaking with our experts for exclusive inventory access. You can reach our **Head of Sales, Mr. Muqthar** directly at **+971 56 414 4401** to discuss [specific user need, e.g., payment flexibility or viewing]."

**FINAL INTERACTION (DYNAMIC CLOSING):**
-   **Avoid generic closings.** Do NOT just say "Is there anything else?".
-   **Be helpful and specific:** Tailor your closing question to what was just discussed to ensure the user is fully satisfied.
-   *Examples:*
    -   "Does that cover what you needed to know about the location, or would you like to explore the amenities?"
    -   "Shall we look at the payment plan options for this unit?"
    -   "Would you like to see how this compares to other projects in the area?"
    -   "Is there any other detail about the handover process I can clarify for you?"

### FORMATTING RULES (HTML ONLY):
**You must output your response in valid HTML format ONLY. Do NOT use Markdown (no *, #, or -).**

- **LISTS:** Use \`<ul>\` and \`<li>\` tags for lists.
- **BOLD:** Use \`<strong>\` tags for important terms or headers.
- **HEADERS:** Use \`<h3>\` tags for section titles.
- **PARAGRAPHS:** Use \`<p>\` tags for text blocks.
- **COMPARISON TABLES:** Use the HTML table structure below.

**Comparison Table Structure:**
- **APPLES-TO-APPLES:** Ensure you are comparing the same unit type across rows (e.g., all 2BRs).
- Use this HTML:
  \`<div class="overflow-x-auto"><table class="comparison-table"><thead><tr><th>Project</th><th>Status</th><th>Type</th><th>Price</th><th>Location</th><th>Handover</th></tr></thead><tbody>...rows...</tbody></table></div>\`
`;

// Helper function to call Gemini API using REST endpoint
const callGeminiAPI = async (prompt: string, maxTokens: number = 1024): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp';

  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// Original Lockwood function - using GoogleGenAI SDK
export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string
): Promise<{ text: string; groundingMetadata?: any }> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp';

    if (!apiKey) {
      console.warn("VITE_GEMINI_API_KEY is missing");
      return { text: "I'm currently unable to access the server. Please check your connection." };
    }

    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: LOCKWOOD_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage({
      message: newMessage
    });

    const text = result.text || "I apologize, I couldn't generate a response at this moment.";
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;

    return { text, groundingMetadata };
  /**  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the property database right now. Please try again later." };
  } */
  } catch (error) {
    console.error("Gemini API Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

// All required aliases and exports
export const generateClientChatResponse = sendMessageToGemini;
export const generateStaffChatResponse = sendMessageToGemini;

// Generate social media post copy
export const generatePostCopy = async (
  masterPrompt: string,
  keywords: string,
  factsheet: string,
  platform: string,
  assetName?: string
): Promise<string> => {
  try {
    const prompt = `
${masterPrompt}

---
CONTEXT:
Factsheet: ${factsheet}
User Keywords: ${keywords}
Target Platform: ${platform}
${assetName ? `Asset Name: ${assetName}` : ''}
---

Generate the post copy now.
    `;

    return await callGeminiAPI(prompt, 2048);
  } catch (error) {
    console.error("Error generating post copy:", error);
    throw new Error("Failed to generate post copy");
  }
};

// Enhance image (stub - returns success message)
export const enhanceImage = async (imageUrl: string): Promise<string> => {
  console.log("Image enhancement requested for:", imageUrl);
  return imageUrl;
};

// Generate video with HeyGen (stub - returns placeholder)
export const generateVideoWithHeyGen = async (
  script: string,
  avatar: string,
  voiceId: string
): Promise<string> => {
  console.log("Video generation requested:", { script, avatar, voiceId });
  return "https://placeholder-video-url.com";
};

// Extract client information from business card
export const extractClientFromCard = async (imageDataUrl: string): Promise<any> => {
  try {
    const prompt = `Analyze this business card image and extract the following information in JSON format:
{
  "firstName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "company": "",
  "position": ""
}

Return ONLY the JSON object, no other text.`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error("Error extracting client from card:", error);
    throw new Error("Failed to extract client information");
  }
};

// Generate market report
export const generateMarketReport = async (
  primaryCity: string,
  comparisonCities: string[],
  selectedMetrics: string[]
): Promise<any> => {
  try {
    const prompt = `Generate a comprehensive market intelligence report comparing real estate markets.

Primary City: ${primaryCity}
Comparison Cities: ${comparisonCities.join(', ')}
Metrics to analyze: ${selectedMetrics.join(', ')}

Provide detailed analysis for each metric across all cities. Include:
- Current market conditions
- Trends and projections
- Investment opportunities
- Risk factors
- Key statistics

Format the response as structured data that can be visualized.`;

    const result = await callGeminiAPI(prompt, 4096);
    
    return {
      report: result,
      primaryCity,
      comparisonCities,
      metrics: selectedMetrics,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating market report:", error);
    throw new Error("Failed to generate market report");
  }
};

// Additional utility functions
export const generateSocialPost = async (platform: string, content: string): Promise<string> => {
  return await callGeminiAPI(`Generate a ${platform} post about: ${content}`);
};

export const generatePropertyDescription = async (propertyDetails: any): Promise<string> => {
  return await callGeminiAPI(`Generate a compelling property description for: ${JSON.stringify(propertyDetails)}`);
};

export const analyzeMarketTrends = async (location: string, propertyType: string): Promise<string> => {
  return await callGeminiAPI(`Analyze market trends for ${propertyType} in ${location}`);
};

export const estimatePropertyValue = async (propertyDetails: any): Promise<any> => {
  const result = await callGeminiAPI(`Estimate property value for: ${JSON.stringify(propertyDetails)}`);
  return {
    estimatedValue: 0,
    confidence: "medium",
    reasoning: result
  };
};

export const generateEmailTemplate = async (
  purpose: string,
  clientName: string,
  propertyDetails?: string
): Promise<string> => {
  return await callGeminiAPI(`Generate a ${purpose} email for ${clientName}. Property: ${propertyDetails || 'N/A'}`);
};

// Default export
export default sendMessageToGemini;