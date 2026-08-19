import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace('sslmode=require', 'sslmode=require&uselibpqcompat=true'),
  ssl: {
    rejectUnauthorized: false // Neon requires SSL
  }
});

// Helper to ensure the users table exists
export const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
};

// Initialize DB schema on startup
initDb().catch(console.error);

export default pool;
