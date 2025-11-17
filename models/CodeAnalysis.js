// models/CodeAnalysis.js
const mongoose = require('mongoose');

// Sub-schema for errors (cleaner, reusable, validated)
const ErrorSchema = new mongoose.Schema(
  {
    line: {
      type: Number,
      default: null,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['error', 'warning', 'info'],
      default: 'error',
    },
  },
  { _id: false } // avoid unnecessary ids for each error item
);

const CodeAnalysisSchema = new mongoose.Schema(
  {
    // Original code provided by user
    code: {
      type: String,
      required: true,
      trim: false, // preserve formatting exactly
    },

    // Programming language
    language: {
      type: String,
      required: true,
      enum: ['python', 'javascript', 'typescript', 'java', 'cpp', 'c'],
    },

    // Summary returned by the AI
    summary: {
      type: String,
      default: '',
      trim: true,
    },

    // Array of AI-generated issues
    errors: {
      type: [ErrorSchema],
      default: [],
    },

    // Full corrected version of the code
    fixed_code: {
      type: String,
      default: '',
      trim: false,
    },

    // Optional filename
    fileName: {
      type: String,
      default: '',
      trim: true,
    },

    // Optional future user reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true, // ⚡ automatic createdAt + updatedAt
  }
);

// Optional indexing for faster history queries later
CodeAnalysisSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CodeAnalysis', CodeAnalysisSchema);
