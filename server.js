// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const config = require('./config');
const logger = require('./logger');
require('dotenv').config();

const app = express();
app.use(express.json());

const { schema, tables } = config.db;

// ✅ Register Route
app.post('/register', async (req, res) => {
  const {
    username, password, confirm_password,
    full_name, email, phone_number,
    address, gender, profile_image
  } = req.body;

  if (!username || !password || !confirm_password || !full_name || !email || !phone_number) {
    logger.warn('Missing required fields on registration');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password !== confirm_password) {
    logger.warn('Passwords do not match');
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const userCheckQuery = `
      SELECT u.USERNAME, p.EMAIL
      FROM ${schema}.${tables.users} u
      LEFT JOIN ${schema}.${tables.userProfile} p ON u.USER_ID = p.USER_ID
      WHERE u.USERNAME = $1 OR p.EMAIL = $2
    `;
    const existingUser = await pool.query(userCheckQuery, [username, email]);
    if (existingUser.rows.length > 0) {
      logger.info(`Duplicate registration attempt for username: ${username} or email: ${email}`);
      return res.status(400).json({ error: 'Username or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO ${schema}.${tables.users} (USERNAME, PASSWORD, USER_TYPE)
      VALUES ($1, $2, 'TENANT') RETURNING USER_ID
    `;
    const userRes = await pool.query(insertUserQuery, [username, hashedPassword]);
    const userId = userRes.rows[0].user_id;

    const insertProfileQuery = `
      INSERT INTO ${schema}.${tables.userProfile}
      (USER_ID, FULL_NAME, PHONE_NUMBER, EMAIL, ADDRESS, GENDER, PROFILE_IMAGE)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(insertProfileQuery, [
      userId, full_name, phone_number, email,
      address || null, gender || null, profile_image || null
    ]);

    logger.info(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    logger.error(`Register Error: ${err.message}`);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = `SELECT * FROM ${schema}.${tables.users} WHERE USERNAME = $1`;
    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      logger.warn(`Login failed for non-existing user: ${username}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: wrong password for user ${username}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User logged in: ${username}`);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    logger.error(`Login Error: ${err.message}`);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running at http://localhost:${PORT}`);
});
