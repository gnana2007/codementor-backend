// controllers/codeController.js
const CodeAnalysis = require('../models/CodeAnalysis');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CODE_ANALYSIS_SYSTEM_PROMPT = `
You are CodeMentor.AI, a code analysis assistant.

Your job:
1. Analyze ONLY the exact code the user sends.
2. Find REAL issues: syntax errors, runtime errors, logical bugs, and important style problems.
3. Do NOT invent or assume errors that are not actually present in the code.
4. Keep your response proportional to the complexity of the code.

Very important behavior rules:

- If the code is VERY SIMPLE (for example: a single print/console.log, a few lines that just display text or do basic math):
  - Keep feedback VERY SHORT.
  - Do NOT rewrite the code into complex functions, classes, or big refactors.
  - Do NOT create extra helper functions unless the user explicitly asked for refactoring.

- Only introduce new functions, classes, or abstractions if:
  - The user’s code already uses them, OR
  - The user clearly asked you to refactor or “make this into a function/class/module”.

- If there are no meaningful errors:
  - Clearly say that the code is correct or mostly fine.
  - Return an empty list of errors.
  - The fixed_code should be either:
    - exactly the same as the input, OR
    - only slightly improved (small style tweaks, tiny clarity changes).

Output format (VERY IMPORTANT):
Return a single JSON object with this exact structure:

{
  "summary": "Short summary of the overall code quality and main issues (or confirm that it looks fine).",
  "errors": [
    {
      "line": <number or null>,
      "issue": "Short title of the issue.",
      "explanation": "Beginner-friendly explanation of what is wrong and how to fix it.",
      "severity": "error" | "warning" | "info"
    }
  ],
  "fixed_code": "The full corrected version of the code as a string."
}

Rules:
- "line" can be null if you cannot reliably calculate the line number.
- If there are no meaningful issues, "errors" MUST be an empty array [].
- Preserve the user’s style as much as possible.
- Never hardcode example issues. Always analyze ONLY the provided code for THIS request.
`;

// ------- AI helper -------
const analyzeCodeWithAI = async (code, language) => {
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const userContent = `
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`
`;

  const response = await openai.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: CODE_ANALYSIS_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || '{}';

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse AI JSON response:', err, raw);
    parsed = {
      summary:
        'Code analysis completed, but the AI response could not be fully parsed.',
      errors: [],
      fixed_code: code,
    };
  }

  return {
    summary: parsed.summary || 'Code analysis completed.',
    errors: Array.isArray(parsed.errors) ? parsed.errors : [],
    fixed_code: typeof parsed.fixed_code === 'string' ? parsed.fixed_code : code,
  };
};

// @route   POST /api/code/analyze
// @desc    Analyze code and return errors with explanations
// @access  Public
exports.analyzeCode = async (req, res) => {
  try {
    const { code, language, fileName } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: 'Code and language are required',
      });
    }

    if (
      !['python', 'javascript', 'java', 'cpp', 'c', 'typescript'].includes(
        language
      )
    ) {
      return res.status(400).json({
        error:
          'Invalid language. Supported: python, javascript, typescript, java, cpp, c',
      });
    }

    const analysisResult = await analyzeCodeWithAI(code, language);

    const codeAnalysis = new CodeAnalysis({
      code,
      language,
      summary: analysisResult.summary,
      errors: analysisResult.errors,
      fixed_code: analysisResult.fixed_code,
      fileName: fileName || '',
    });

    await codeAnalysis.save();

    res.json({
      success: true,
      data: {
        id: codeAnalysis._id,
        summary: analysisResult.summary,
        errors: analysisResult.errors,
        fixed_code: analysisResult.fixed_code,
      },
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze code',
      message: error.message,
    });
  }
};

// @route   GET /api/code/history
// @desc    Get code analysis history
// @access  Public
exports.getHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const analyses = await CodeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-code -fixed_code');

    res.json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

// @route   GET /api/code/:id
// @desc    Get specific code analysis by ID
// @access  Public
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await CodeAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found',
      });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis',
      message: error.message,
    });
  }
};
