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
  // Add your production frontend URL here, or via env:
  process.env.FRONTEND_URL, // e.g. https://your-frontend.onrender.com
].filter(Boolean); // remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ CORS: Allowing origin in development:', origin);
      return callback(null, true);
    }

    // In production, log but still allow for now (you can make this stricter)
    // TODO: In production, uncomment the next line to block unknown origins
    // return callback(new Error('Not allowed by CORS'));
    console.warn('⚠️ CORS: Origin not in allowed list:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 hours
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicitly handle preflight (OPTIONS) requests for all routes
app.options('*', cors(corsOptions));

// Log CORS configuration on startup
console.log('🌐 CORS enabled with allowed origins:', allowedOrigins.length > 0 ? allowedOrigins : 'All (development mode)');
// ---------- END CORS CONFIG ----------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// NOTE: Full endpoints will look like:
//   POST /api/code/analyze
//   POST /api/chat/...
app.use('/api/code', require('./routes/codeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));


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
