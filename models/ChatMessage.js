// models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    // The user's message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // The AI's response
    response: {
      type: String,
      required: true,
      trim: true,
    },

    // Detected language for proper multilingual support
    detectedLanguage: {
      type: String,
      default: 'en',
      trim: true,
    },

    // To group messages under one ongoing conversation
    conversationId: {
      type: String,
      required: true,
      index: true, // ⚡ faster history lookups
      trim: true,
    },

    // Optional: Link messages to a user if needed in the future
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true, // ⚡ adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
