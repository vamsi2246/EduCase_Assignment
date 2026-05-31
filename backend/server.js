const app = require('./app');
const { testConnection } = require('./config/db');

// Low-level synchronous uncaught exception catcher
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION CRITICAL] Shutting down server immediately...', err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // 1. Establish and test MySQL Connection
  const isDbConnected = await testConnection();
  if (!isDbConnected) {
    console.warn('[DB WARNING] Database is currently offline. Ensure MySQL is configured correctly and running.');
  }

  // 2. Open HTTP Listener Port
  const server = app.listen(PORT, () => {
    console.log(`Server started in "${process.env.NODE_ENV || 'development'}" environment.`);
    console.log(`Listening for requests on: http://localhost:${PORT}`);
  });

  // Unhandled async promise rejection catcher
  process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION CRITICAL] Shutting down server gracefully...', err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
