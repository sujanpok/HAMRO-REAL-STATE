// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_GrX0A7HTNPDd@ep-snowy-star-a8xe92jt-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

module.exports = pool;
