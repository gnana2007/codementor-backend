// server.js or index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL, // e.g. https://your-frontend.onrender.com
].filter(Boolean); // remove undefined/null

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    // If in allowed list -> allow
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, be permissive
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ CORS: Allowing origin in development:', origin);
      return callback(null, true);
    }

    // In production, block unknown origins
    console.warn('🚫 CORS: Origin not allowed:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 hours
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Log CORS configuration on startup
console.log(
  '🌐 CORS enabled with allowed origins:',
  allowedOrigins.length > 0 ? allowedOrigins : 'All (development mode)'
);
// ---------- END CORS CONFIG ----------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const codeRoutes = require('./routes/codeRoutes'); // << important: matches file name
const chatRoutes = require('./routes/chatRoutes'); // make sure this file exists

// Final endpoints:
//
//   POST /api/code/analyze
//   GET  /api/code/history
//   GET  /api/code/:id
//   ... /api/chat/...
//
app.use('/api/code', codeRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeMentor.AI API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CodeMentor.AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      code: '/api/code',
      chat: '/api/chat',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
