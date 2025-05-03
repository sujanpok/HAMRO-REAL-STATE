// db.js
const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DB_MODE === 'cloud') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}
// export
module.exports = pool;
