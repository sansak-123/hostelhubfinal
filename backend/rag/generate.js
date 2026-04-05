// backend/rag/generate.js

import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: "./.env" });

// 🔥 Detect casual conversation
function isCasual(query) {
  const casualWords = [
    "hi",
    "hello",
    "hey",
    "how are you",
    "what's up",
    "good morning",
    "good evening",
  ];

  return casualWords.some((word) => query.toLowerCase().includes(word));
}

export async function generateAnswer(query, context = [], chatHistory = []) {
  // 🔥 HARD GUARD → no context, no hallucination
  if (!isCasual(query) && (!context || context.length === 0)) {
    return "Sorry, I don't have that information.";
  }

  // 🔥 Convert context to text
  const contextText = context.map((c) => c.content).join("\n");

  // 🔥 Build conversation memory
  const historyMessages = chatHistory.map((msg) => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  let systemPrompt;
  let userPrompt;

  // ─────────────────────────────────────────────
  // 💬 CASUAL MODE (controlled, not cringe)
  // ─────────────────────────────────────────────
  if (isCasual(query)) {
    systemPrompt = `
You are a senior student helping juniors in a hostel.

STYLE:
- Friendly and chill
- Short responses
- No overacting, no fake politeness
- No hotel-style language

EXAMPLES:
User: hi
Answer: Hey, what's up?

User: how are you
Answer: I'm good, what do you need help with?
`;

    userPrompt = query;
  } else {
    // ─────────────────────────────────────────────
    // 🧠 STRICT FACTUAL MODE (RAG)
    // ─────────────────────────────────────────────
    systemPrompt = `
You are a senior hostel student guiding juniors.

STRICT RULES:
- Answer ONLY using the given CONTEXT
- Do NOT add extra information
- Do NOT assume anything
- Do NOT behave like a hotel receptionist
- Do NOT suggest things like coffee, services, etc.

IF NOT FOUND:
Say exactly:
"Sorry, I don't have that information."

STYLE:
- Talk like a senior helping a junior
- Friendly but direct
- Simple and clear
- No unnecessary lines
`;

    // 🔥 FORCE grounding
    userPrompt = `
CONTEXT:
${contextText}

QUESTION:
${query}

Answer using ONLY the context above.
`;
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",

          temperature: 0.2, // 🔥 less creativity = less hallucination
          top_p: 0.6,
          max_tokens: 200,

          messages: [
            { role: "system", content: systemPrompt },
            ...historyMessages,
            { role: "user", content: userPrompt },
          ],
        }),
      },
    );

    const data = await response.json();

    console.log("🧠 RESPONSE:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }

    if (data.error) {
      return "Error: " + data.error.message;
    }

    return "Sorry, I don't have that information.";
  } catch (err) {
    console.error("❌ ERROR:", err);
    return "Server error";
  }
}
