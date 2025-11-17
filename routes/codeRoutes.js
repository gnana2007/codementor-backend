// routes/coderoute.js
const express = require('express');
const router = express.Router();

const {
  analyzeCode,
  getHistory,
  getAnalysis,
} = require('../controllers/codeController');

// POST /api/code/analyze
router.post('/analyze', analyzeCode);

// GET /api/code/history
router.get('/history', getHistory);

// GET /api/code/:id
router.get('/:id', getAnalysis);

module.exports = router;
