// routes/chatRoutes.js
const express = require('express');
const router = express.Router();

// Import chat controller methods
const {
  sendMessage,
  getHistory,
} = require('../controllers/chatController'); // ensure filename matches exactly

// ------------------------------
// POST /api/chat/message
// Send a chat message + get AI response
// ------------------------------
router.post('/message', sendMessage);

// ------------------------------
// GET /api/chat/history
// Get conversation history
// ------------------------------
router.get('/history', getHistory);

// Export the router
module.exports = router;
