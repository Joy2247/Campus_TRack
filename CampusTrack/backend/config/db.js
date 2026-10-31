const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let isConnected = false;

async function initDB() {
  if (pool) return pool;

  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const database = process.env.DATABASE_NAME || 'campus_track';

  if (!host || !user) {
    console.log('[Database] MySQL environment variables not fully configured. Using High-Performance Embedded Store.');
    return null;
  }

  try {
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL at ${host}/${database}`);
    conn.release();
    isConnected = true;
    return pool;
  } catch (err) {
    console.warn(`[Database] MySQL connection failed (${err.message}). Falling back to Embedded Store.`);
    pool = null;
    isConnected = false;
    return null;
  }
}

function getPool() {
  return pool;
}

module.exports = {
  initDB,
  getPool,
  isConnected: () => isConnected
};
