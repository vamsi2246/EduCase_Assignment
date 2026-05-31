const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Create connection pool
const dbUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

let poolConfig = {};

if (dbUri) {
  try {
    const parsedUrl = new URL(dbUri);
    poolConfig = {
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port || '3306', 10),
      user: parsedUrl.username,
      password: decodeURIComponent(parsedUrl.password),
      database: parsedUrl.pathname.replace(/^\//, ''),
    };
  } catch (err) {
    console.error('Failed to parse database connection string, falling back to separate env variables:', err.message);
    poolConfig = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'github_analyzer',
    };
  }
} else {
  poolConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'github_analyzer',
  };
}

// Enable secure TLS/SSL transport in production or if explicitly requested via DB_SSL env
const enableSSL = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

console.log(`[DB INFO] Initializing MySQL pool. Host: ${poolConfig.host}, Port: ${poolConfig.port}, Database: ${poolConfig.database}, User: ${poolConfig.user}, SSL Enabled: ${enableSSL}`);

const pool = mysql.createPool({
  ...poolConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ...(enableSSL ? { ssl: { rejectUnauthorized: false } } : {})
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

// Helper to automatically initialize database schema tables if missing
const initDatabase = async () => {
  try {
    console.log('[DB INFO] Verifying database schema tables...');
    
    let tablesExist = false;
    try {
      await pool.execute('SELECT 1 FROM profiles LIMIT 1');
      await pool.execute('SELECT 1 FROM search_history LIMIT 1');
      tablesExist = true;
      console.log('[DB INFO] Database schema tables verified successfully.');
    } catch (e) {
      console.warn('[DB WARNING] Database tables are missing. Starting automatic schema initialization...');
    }

    if (!tablesExist) {
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      const cleanSql = schemaSql
        .split('\n')
        .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('#'))
        .join('\n');

      const statements = cleanSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      const connection = await pool.getConnection();
      try {
        for (const statement of statements) {
          const upperStmt = statement.toUpperCase();
          if (upperStmt.startsWith('CREATE DATABASE') || upperStmt.startsWith('USE')) {
            continue; // Skip DB creation since pool is already connected directly to the database
          }
          await connection.query(statement);
        }
        console.log('[DB INFO] Database schema tables initialized successfully!');
      } finally {
        connection.release();
      }
    }
  } catch (error) {
    console.error('[DB ERROR] Failed to automatically initialize database schema tables:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};

