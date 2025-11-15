const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  detectedLanguage: {
    type: String,
    default: 'en',
  },
  conversationId: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);

