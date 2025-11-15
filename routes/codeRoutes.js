const express = require('express');
const router = express.Router();
const {
  analyzeCode,
  getHistory,
  getAnalysis,
} = require('../controllers/codeController');

router.post('/analyze', analyzeCode);
router.get('/history', getHistory);
router.get('/:id', getAnalysis);

module.exports = router;

