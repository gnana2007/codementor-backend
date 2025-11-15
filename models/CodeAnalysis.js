const mongoose = require('mongoose');

const CodeAnalysisSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'java', 'cpp', 'c'],
  },
  summary: {
    type: String,
    default: '',
  },
  errors: [{
    line: Number,
    issue: String,
    explanation: String,
    severity: {
      type: String,
      enum: ['error', 'warning', 'info'],
      default: 'error',
    },
  }],
  fixed_code: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CodeAnalysis', CodeAnalysisSchema);

