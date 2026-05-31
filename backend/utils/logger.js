const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m",    // Cyan
  warn: "\x1b[33m",    // Yellow
  error: "\x1b[31m",   // Red
  debug: "\x1b[35m",   // Magenta
  timestamp: "\x1b[90m" // Gray
};

const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    const meta = args.length ? (args[0] instanceof Error ? { error: args[0].stack } : { meta: args }) : {};
    return JSON.stringify({ timestamp, level, message, ...meta });
  }

  const color = colors[level] || colors.reset;
  let formattedArgs = '';
  if (args.length > 0) {
    formattedArgs = args.map(arg => {
      if (arg instanceof Error) {
        return `\n${colors.error}${arg.stack}${colors.reset}`;
      }
      if (typeof arg === 'object') {
        return `\n${JSON.stringify(arg, null, 2)}`;
      }
      return ` ${arg}`;
    }).join(' ');
  }

  return `${colors.timestamp}[${timestamp}]${colors.reset} ${color}${level.toUpperCase()}:${colors.reset} ${message}${formattedArgs}`;
};

const logger = {
  info: (msg, ...args) => {
    console.log(formatMessage('info', msg, ...args));
  },
  warn: (msg, ...args) => {
    console.warn(formatMessage('warn', msg, ...args));
  },
  error: (msg, ...args) => {
    console.error(formatMessage('error', msg, ...args));
  },
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage('debug', msg, ...args));
    }
  }
};

module.exports = logger;
