const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create connection pool
const dbUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

const poolConfig = dbUri
  ? { uri: dbUri }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'github_analyzer',
    };

// Enable secure TLS/SSL transport in production or if explicitly requested via DB_SSL env
const enableSSL = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

const pool = mysql.createPool({
  ...poolConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ...(enableSSL ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {})
});


// Helper to test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: ${process.env.DB_NAME || 'github_analyzer'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to the MySQL database. Please verify your credentials and ensure MySQL is running.', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};
