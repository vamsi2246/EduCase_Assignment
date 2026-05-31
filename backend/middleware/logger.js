const morgan = require('morgan');

// Standard color codes
const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m",    // Cyan
  timestamp: "\x1b[90m" // Gray
};

const format = process.env.NODE_ENV === 'production'
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  : ':method :url :status :res[content-length] - :response-time ms';

const loggerMiddleware = morgan(format, {
  stream: {
    write: (message) => {
      const timestamp = new Date().toISOString();
      if (process.env.NODE_ENV === 'production') {
        console.log(JSON.stringify({ timestamp, level: 'info', message: message.trim() }));
      } else {
        console.log(`${colors.timestamp}[${timestamp}]${colors.reset} ${colors.info}INFO:${colors.reset} ${message.trim()}`);
      }
    }
  }
});

module.exports = loggerMiddleware;
