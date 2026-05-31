const rateLimit = require('express-rate-limit');

// 1. General Rate Limiter: Applies to standard history/list endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: { message: 'Too many requests, please try again in 15 minutes.', status: 429 }
    });
  }
});

// 2. Strict Rate Limiter: Applies to external API query trigger endpoints
const profileAnalyzerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 analysis operations per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many profile analysis requests. Please slow down and try again later.',
        status: 429
      }
    });
  }
});

module.exports = {
  generalLimiter,
  profileAnalyzerLimiter
};
