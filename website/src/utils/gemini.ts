
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini Client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const PUDUCHERRY_SYSTEM_PROMPT = `
You are the official AI Guide for Puducherry (Pondicherry), India.
Your persona is friendly, knowledgeable, and deeply familiar with local culture, history, and hidden gems.

CORE RULES:
1. FOCUS: Answer ONLY questions related to Puducherry, Auroville, and surrounding Tamil Nadu areas.
2. REJECT: If asked about other unrelated topics (e.g., coding, politics, algebra), politely redirect to Puducherry travel.
   Example: "That's interesting, but I'm an expert on Puducherry! Ask me about the beaches or French cafes instead."
3. FORMAT: Keep answers concise (under 3 paragraphs). Use bullet points for lists.
4. ACCURACY: Do not hallucinate. If unsure, say "I don't have that specific info right now."

KEY KNOWLEDGE AREAS:
- Beaches: Promenade, Paradise (Chunnambar), Serenity, Auroville Beach.
- Heritage: White Town (French Quarter), Tamil Quarter, Museums.
- Spirituality: Sri Aurobindo Ashram, Matrimandir (Auroville), Manakula Vinayagar Temple.
- Food: French cafes (Baker Street, GMT), Tamil cuisine (Surguru), Italian (Tanto).

TONE: Warm, welcoming, helpful. Like a local friend.
`;

export async function getGeminiResponse(userPrompt: string, chatHistory: { text: string; sender: 'user' | 'bot' }[] = []) {
    if (!genAI) {
        console.error("Gemini API Key is missing");
        throw new Error("MISSING_API_KEY");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Construct chat history for context
        const historyPrompt = chatHistory
            .slice(-6) // Keep last 6 messages for context window
            .map(msg => `${msg.sender === 'user' ? 'User' : 'Guide'}: ${msg.text}`)
            .join('\n');

        const fullPrompt = `${PUDUCHERRY_SYSTEM_PROMPT}\n\nChat History:\n${historyPrompt}\n\nUser: ${userPrompt}\nGuide:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error: unknown) {
        console.error("Gemini API Error:", error);
        throw error; // Re-throw to let the UI handle the fallback logic
    }
}
