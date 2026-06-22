const retryFetch = require("../utils/retryFetch.js");

const {
  createTripPrompt,
  createRegenerateDayPrompt,
} = require("../prompts/tripPrompt.js");

const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const data = await retryFetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    },
    3,
    1000,
  );

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }
  return JSON.parse(text);
};

const generateTripPlan = async (tripInput) => {
    const prompt = createTripPrompt(tripInput);
    return await callGemini(prompt);
}

const regenerateDayPlan = async ({ trip, dayNumber, instruction }) => {
    const prompt = createRegenerateDayPrompt({ trip, dayNumber, instruction });
    return await callGemini(prompt);    
}

module.exports = {
    generateTripPlan,
    regenerateDayPlan,
};
