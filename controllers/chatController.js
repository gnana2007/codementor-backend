const ChatMessage = require('../models/ChatMessage');

// Mock chat response function (replace with actual AI service integration)
const generateChatResponse = async (message) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();
  
  // Telugu response
  if (message.includes('ఎలా') || message.includes('ఏమిటి')) {
    return {
      response: 'నమస్కారం! నేను మీ కోడింగ్ ట్యూటర్‌ని. Python, JavaScript, C++, Java వంటి భాషలలో మీకు సహాయం చేయగలను. మీకు ఏదైనా సందేహాలు ఉంటే అడగండి!',
      detectedLanguage: 'te'
    };
  }
  
  // Tamil response
  if (message.includes('எப்படி') || message.includes('என்ன')) {
    return {
      response: 'வணக்கம்! நான் உங்கள் குறியீட்டு வழிகாட்டி. Python, JavaScript, C++, Java போன்ற மொழிகளில் உதவ முடியும். உங்கள் சந்தேகங்களைக் கேளுங்கள்!',
      detectedLanguage: 'ta'
    };
  }
  
  // Hindi response
  if (message.includes('कैसे') || message.includes('क्या') || message.includes('नमस्ते') || message.includes('हैलो')) {
    return {
      response: 'नमस्ते! मैं आपका कोडिंग ट्यूटर हूं। Python, JavaScript, C++, Java जैसी भाषाओं में मदद कर सकता हूं। अपने सवाल पूछें!',
      detectedLanguage: 'hi'
    };
  }

  // Malayalam response
  if (message.includes('എങ്ങനെ') || message.includes('എന്താണ്') || message.includes('ഹലോ')) {
    return {
      response: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കോഡിംഗ് ട്യൂട്ടർ ആണ്. Python, JavaScript, C++, Java പോലുള്ള ഭാഷകളിൽ സഹായിക്കാം. നിങ്ങളുടെ ചോദ്യങ്ങൾ ചോദിക്കൂ!',
      detectedLanguage: 'ml'
    };
  }

  // Kannada response
  if (message.includes('ಹೇಗೆ') || message.includes('ಏನು') || message.includes('ನಮಸ್ಕಾರ')) {
    return {
      response: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೋಡಿಂಗ್ ಟ್ಯೂಟರ್. Python, JavaScript, C++, Java ನಂತಹ ಭಾಷೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು. ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ!',
      detectedLanguage: 'kn'
    };
  }

  // Punjabi response
  if (message.includes('ਕਿਵੇਂ') || message.includes('ਕੀ') || message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ')) {
    return {
      response: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕੋਡਿੰਗ ਟਿਊਟਰ ਹਾਂ। Python, JavaScript, C++, Java ਵਰਗੀਆਂ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਆਪਣੇ ਸਵਾਲ ਪੁੱਛੋ!',
      detectedLanguage: 'pa'
    };
  }

  // Bengali response
  if (message.includes('কিভাবে') || message.includes('কী') || message.includes('নমস্কার')) {
    return {
      response: 'নমস্কার! আমি আপনার কোডিং টিউটর। Python, JavaScript, C++, Java এর মতো ভাষায় সাহায্য করতে পারি। আপনার প্রশ্ন জিজ্ঞাসা করুন!',
      detectedLanguage: 'bn'
    };
  }

  // Mock English responses based on keywords
  if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
    return {
      response: `I'd be happy to help you fix that error! 

To give you the best help, please share:
1. The error message you're seeing
2. The code that's causing the issue
3. What you expected to happen

Common debugging tips:
• Check for typos in variable names
• Make sure all brackets/parentheses are closed
• Look at the line number in the error message
• Read the error message carefully - it usually tells you what's wrong!

Feel free to paste your code and I'll help you debug it step by step.`,
      detectedLanguage: 'en'
    };
  }

  if (lowerMessage.includes('loop') || lowerMessage.includes('for')) {
    return {
      response: `Great question about loops!

**What is a loop?**
A loop is like telling your program to repeat something multiple times. Think of it like doing homework problems - instead of writing the same steps for each problem, you use a pattern.

**Types of loops:**

1. **For loop** - When you know how many times to repeat
   \`\`\`
   for i in range(5):
       print(i)  # Prints 0,1,2,3,4
   \`\`\`

2. **While loop** - When you repeat until a condition is met
   \`\`\`
   count = 0
   while count < 5:
       print(count)
       count += 1
   \`\`\`

**Tip:** Always make sure your loop has a way to stop, or it will run forever!

Need help with a specific loop? Share your code!`,
      detectedLanguage: 'en'
    };
  }

  if (lowerMessage.includes('function') || lowerMessage.includes('def')) {
    return {
      response: `Functions are one of the most important concepts in programming!

**What is a function?**
A function is like a recipe - you write instructions once, then use them many times by just calling the function name.

**Why use functions?**
✓ Avoid repeating the same code
✓ Make code easier to read and organize
✓ Fix bugs in one place instead of many
✓ Share code with others easily

**Example:**
\`\`\`python
def greet(name):
    message = f"Hello, {name}!"
    return message

# Use the function
result = greet("Student")
print(result)  # Output: Hello, Student!
\`\`\`

**Key parts:**
• **def** - keyword to define a function
• **name** - what you call your function
• **parameters** - inputs (like "name" above)
• **return** - output you get back

Try creating your own function! What would you like it to do?`,
      detectedLanguage: 'en'
    };
  }

  // Default helpful response
  return {
    response: `Hello! I'm your AI coding tutor, and I'm here to help you learn programming! 🚀

I can help you with:
• Explaining programming concepts
• Debugging your code
• Understanding error messages
• Learning best practices
• Code reviews and improvements

**Supported languages:**
Python • JavaScript • C++ • Java • C

**I also speak:**
English • తెలుగు • தமிழ் • हिंदी • മലയാളം • ಕನ್ನಡ • ਪੰਜਾਬੀ • বাংলা

Feel free to ask questions in any language! What would you like to learn today?`,
    detectedLanguage: 'en'
  };
};

// @route   POST /api/chat/message
// @desc    Send a chat message and get AI response
// @access  Public
exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    // Generate response (replace with actual AI service)
    const { response, detectedLanguage } = await generateChatResponse(message);

    // Save to database
    const chatMessage = new ChatMessage({
      message: message.trim(),
      response,
      detectedLanguage,
      conversationId: conversationId || '',
    });

    await chatMessage.save();

    res.json({
      success: true,
      data: {
        id: chatMessage._id,
        response,
        detectedLanguage,
        conversationId: chatMessage.conversationId,
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: error.message 
    });
  }
};

// @route   GET /api/chat/history
// @desc    Get chat message history
// @access  Public
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
      data: messages.reverse(), // Reverse to show oldest first
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat history',
      message: error.message 
    });
  }
};

