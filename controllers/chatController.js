// controllers/chatcontroller.js
const ChatMessage = require('../models/ChatMessage');
const OpenAI = require('openai');
require('dotenv').config();

// -------------------------------------
// INIT OPENAI CLIENT
// -------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Warn if key missing
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is missing. Chat AI will NOT work.');
}

// -------------------------------------
// MAIN AI RESPONSE GENERATOR
// -------------------------------------
const generateChatResponse = async (message) => {
  if (!process.env.OPENAI_API_KEY) {
    return {
      response: 'AI key not configured. Please set OPENAI_API_KEY in backend .env',
      detectedLanguage: 'en',
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // you can upgrade model anytime
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a multilingual AI coding tutor.

Your job:
- Detect the user's language.
- Respond in the SAME language.
- Give correct programming explanations.
- Help debug code.
- Keep responses simple, helpful, and accurate.

IMPORTANT: ALWAYS return ONLY pure JSON like this:

{
  "response": "<your answer>",
  "detectedLanguage": "<2-letter or 3-letter language code>"
}

Do NOT wrap in backticks.
Do NOT add extra fields.
`.trim(),
        },
        { role: "user", content: message },
      ],
    });

    const raw = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ OpenAI JSON Parsing Failed:", err);
      parsed = {
        response: "Sorry, I could not understand your message properly.",
        detectedLanguage: "en",
      };
    }

    return {
      response: parsed.response,
      detectedLanguage: parsed.detectedLanguage || "en",
    };
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);

    return {
      response: "I am facing some issues while generating a response. Try again!",
      detectedLanguage: "en",
    };
  }
};

// -------------------------------------
// POST /api/chat/message
// SEND CHAT MESSAGE
// -------------------------------------
exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Generate AI response using OpenAI
    const { response, detectedLanguage } = await generateChatResponse(message);

    // Save both user & AI message to DB
    const chatMessage = new ChatMessage({
      message: message.trim(),
      response,
      detectedLanguage,
      conversationId: conversationId || "",
    });

    await chatMessage.save();

    res.json({
      success: true,
      data: {
        id: chatMessage._id,
        response,
        detectedLanguage,
        conversationId: chatMessage.conversationId,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      message: error.message,
    });
  }
};

// -------------------------------------
// GET /api/chat/history
// GET CHAT HISTORY
// -------------------------------------
exports.getHistory = async (req, res) => {
  try {
    const conversationId = req.query.conversationId;
    const limit = parseInt(req.query.limit) || 50;

    const query = conversationId ? { conversationId } : {};

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: messages.length,
      data: messages.reverse(), // oldest first
    });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({
      error: "Failed to fetch chat history",
      message: error.message,
    });
  }
};
