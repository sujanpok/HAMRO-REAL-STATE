// config.js
require('dotenv').config();

const isCloud = process.env.DB_MODE === 'cloud';

module.exports = {
  db: {
    name: isCloud ? process.env.DB_NAME : process.env.DB_NAME,
    schema: isCloud ? process.env.DB_SCHEMA : null, // Local DB may not need schema
    tables: {
      users: process.env.TABLE_USERS || 'users',
      userProfile: process.env.TABLE_USER_PROFILE || 'user_profile',
    },
    connection: isCloud
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432'),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }
  }
};
