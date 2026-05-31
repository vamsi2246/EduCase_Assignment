const logger = require('../utils/logger');

/**
 * Standard Central Global Error Interceptor Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error(`[DEV ERROR] Error encountered at [${req.method} ${req.originalUrl}]:`, err);
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message || 'Internal Server Error',
        status: err.statusCode,
        details: {
          stack: err.stack,
          error: err
        }
      }
    });
  } else {
    // Operational, trusted error: send clean explanation to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          message: err.message,
          status: err.statusCode
        }
      });
    }

    // System exception: Hide internals and alert operators
    console.error('[PRODUCTION CRITICAL ERROR]:', err);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong on our end. Please try again later.',
        status: 500
      }
    });
  }
};

module.exports = errorHandler;
