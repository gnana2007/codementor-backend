const CodeAnalysis = require('../models/CodeAnalysis');

// Mock code analysis function (replace with actual AI service integration)
const analyzeCodeWithAI = async (code, language) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis based on language
  if (language === 'python') {
    return {
      summary: 'Found 3 issues: 1 syntax error, 1 logical error, and 1 potential runtime issue',
      errors: [
        {
          line: 5,
          issue: 'Missing colon at end of function definition',
          explanation: 'In Python, all function definitions must end with a colon (:). This tells Python that you\'re about to define what the function does. Think of it like opening a door - the colon says "here comes the function body!"',
          severity: 'error'
        },
        {
          line: 8,
          issue: 'Variable used before assignment',
          explanation: 'You\'re trying to use the variable "result" before you\'ve given it a value. It\'s like trying to eat from an empty plate - you need to put food on it first! Always assign a value to variables before using them.',
          severity: 'error'
        },
        {
          line: 12,
          issue: 'Potential division by zero',
          explanation: 'If the variable "divisor" is 0, your program will crash because dividing by zero is mathematically undefined. Always check if the divisor is zero before dividing. Add an if statement like: if divisor != 0:',
          severity: 'warning'
        }
      ],
      fixed_code: `# Fixed Python Code

def calculate_average(numbers):  # Added missing colon
    """Calculate the average of a list of numbers"""
    if not numbers:  # Check for empty list
        return 0
    
    result = 0  # Initialize result before use
    for num in numbers:
        result += num
    
    # Safe division with zero check
    count = len(numbers)
    if count != 0:  # Prevent division by zero
        average = result / count
        return average
    return 0

# Example usage
data = [10, 20, 30, 40, 50]
avg = calculate_average(data)
print(f"Average: {avg}")`
    };
  } else if (language === 'javascript') {
    return {
      summary: 'Found 2 issues: 1 syntax error and 1 best practice recommendation',
      errors: [
        {
          line: 3,
          issue: 'Missing closing bracket',
          explanation: 'Every opening bracket { must have a matching closing bracket }. This is like closing parentheses in math - they must always come in pairs. Check your code and count all { and } to make sure they match.',
          severity: 'error'
        },
        {
          line: 7,
          issue: 'Using var instead of let/const',
          explanation: 'In modern JavaScript, we use "let" for variables that change and "const" for variables that don\'t change. The old "var" keyword can cause unexpected bugs because of how it handles scope. Use let or const instead!',
          severity: 'info'
        }
      ],
      fixed_code: `// Fixed JavaScript Code

function processData(items) {
    const results = [];  // Use const instead of var
    
    for (let i = 0; i < items.length; i++) {  // Use let instead of var
        const item = items[i];
        results.push(item * 2);
    }  // Added missing closing bracket
    
    return results;
}

// Example usage
const data = [1, 2, 3, 4, 5];
const processed = processData(data);
console.log("Processed:", processed);`
    };
  }

  // Default response for other languages
  return {
    summary: 'Code analysis completed successfully. No critical issues found.',
    errors: [],
    fixed_code: code + '\n\n// Code looks good! No changes needed.'
  };
};

// @route   POST /api/code/analyze
// @desc    Analyze code and return errors with explanations
// @access  Public
exports.analyzeCode = async (req, res) => {
  try {
    const { code, language, fileName } = req.body;

    // Validation
    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Code and language are required' 
      });
    }

    if (!['python', 'javascript', 'java', 'cpp', 'c'].includes(language)) {
      return res.status(400).json({ 
        error: 'Invalid language. Supported: python, javascript, java, cpp, c' 
      });
    }

    // Analyze code (replace with actual AI service)
    const analysisResult = await analyzeCodeWithAI(code, language);

    // Save to database
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
      }
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code',
      message: error.message 
    });
  }
};

// @route   GET /api/code/history
// @desc    Get code analysis history
// @access  Public
exports.getHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const analyses = await CodeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-code -fixed_code'); // Exclude large fields

    res.json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history',
      message: error.message 
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
        error: 'Analysis not found' 
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
      message: error.message 
    });
  }
};

