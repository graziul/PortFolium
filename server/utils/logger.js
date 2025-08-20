const winston = require('winston');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(logColors);

// Create log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Create transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: logFormat,
  }),
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  transports,
  exitOnError: false,
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
    logger.info('Logger: Created logs directory');
  } catch (error) {
    console.error('Logger: Failed to create logs directory:', error);
  }
}

// Enhanced logging methods with context
const createContextualLogger = (context) => {
  return {
    error: (message, error = null) => {
      const logMessage = `${context}: ${message}`;
      if (error) {
        logger.error(`${logMessage} - Error: ${error.message}`);
        logger.error(`${context}: Error stack: ${error.stack}`);
      } else {
        logger.error(logMessage);
      }
    },
    warn: (message) => {
      logger.warn(`${context}: ${message}`);
    },
    info: (message) => {
      logger.info(`${context}: ${message}`);
    },
    debug: (message) => {
      logger.debug(`${context}: ${message}`);
    },
    http: (message) => {
      logger.http(`${context}: ${message}`);
    }
  };
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  logger.http(`Request: ${method} ${url} from ${ip}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if ((method === 'POST' || method === 'PUT') && req.body) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.token;
    logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
  }
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    logger.http(`Response: ${method} ${url} ${res.statusCode} - ${duration}ms`);
    originalEnd.apply(this, args);
  };
  
  next();
};

// Error logging middleware
const errorLogger = (error, req, res, next) => {
  const { method, url, ip } = req;
  logger.error(`Error in ${method} ${url} from ${ip}: ${error.message}`);
  logger.error(`Error stack: ${error.stack}`);
  
  // Log additional context if available
  if (req.user) {
    logger.error(`User context: ${req.user.id}`);
  }
  
  next(error);
};

// Database operation logger
const dbLogger = createContextualLogger('Database');

// Service operation logger
const serviceLogger = createContextualLogger('Service');

// Route operation logger
const routeLogger = createContextualLogger('Route');

// Authentication logger
const authLogger = createContextualLogger('Auth');

// File operation logger
const fileLogger = createContextualLogger('File');

// Server operation logger
const serverLogger = createContextualLogger('Server');

module.exports = {
  logger,
  createContextualLogger,
  requestLogger,
  errorLogger,
  dbLogger,
  serviceLogger,
  routeLogger,
  authLogger,
  fileLogger,
  serverLogger
};