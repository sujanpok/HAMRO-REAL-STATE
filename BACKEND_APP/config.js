// config.js
require('dotenv').config();

const isCloud = process.env.DB_MODE === 'cloud';

module.exports = {
  db: {
    name: isCloud ? process.env.DB_NAME : process.env.DB_NAME,
    schema: isCloud ? process.env.DB_SCHEMA : null, // Local DB may not need schema
    tables: {
      // table List
      login: process.env.LOGIN,
      userProfile: process.env.USER_PROFILE,
    },
    connection: isCloud
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }
  }
};
