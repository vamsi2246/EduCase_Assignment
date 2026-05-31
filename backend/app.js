const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middlewares
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route Registry
const githubRoutes = require('./routes/githubRoutes');
const { swaggerUi, swaggerSpec, customOptions } = require('./config/swagger');
const { testConnection } = require('./config/db');

const app = express();

// 1. Apply Global Middlewares
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL 
    : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Swagger Documentation Middleware (Obsidian Themed)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, customOptions));

// 2. Register API Routes
app.use('/api', githubRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const isDbConnected = await testConnection();
  return res.status(isDbConnected ? 200 : 500).json({
    success: isDbConnected,
    message: isDbConnected 
      ? 'GitGauge API server and database are healthy and online.' 
      : 'GitGauge API server is running, but database connection is offline.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date(),
      env: process.env.NODE_ENV || 'development',
      database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED'
    }
  });
});


// Root welcome message
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the GitGauge Profile Analyzer Server API. API routes are hosted under /api.',
    data: {
      docs: '/api-docs',
      endpoints: {
        analyze: 'GET /api/profile/:username',
        profilesList: 'GET /api/profiles',
        profileDetails: 'GET /api/profiles/:id',
        auditLogs: 'GET /api/history'
      }
    }
  });
});

// 3. Catch-all unmatched route interceptor (Express 5.x compatible)
app.use((req, res, next) => {
  const error = new Error(`Cannot find endpoint [${req.method}] ${req.originalUrl} on this server.`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
});

// 4. Central global error middleware
app.use(errorHandler);

module.exports = app;
