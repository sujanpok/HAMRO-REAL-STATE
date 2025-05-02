const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../logger');

const { schema, tables } = config.db;

// Centralized table and column names to simplify modification
const USERS_TABLE = `${schema}.${tables.users}`;
const USER_PROFILE_TABLE = `${schema}.${tables.userProfile}`;

const USER_COLUMNS = {
  USERNAME: 'USERNAME',
  PASSWORD: 'PASSWORD',
  USER_TYPE: 'USER_TYPE',
  USER_ID: 'USER_ID',
};

const PROFILE_COLUMNS = {
  USER_ID: 'USER_ID',
  FULL_NAME: 'FULL_NAME',
  PHONE_NUMBER: 'PHONE_NUMBER',
  EMAIL: 'EMAIL',
  ADDRESS: 'ADDRESS',
  GENDER: 'GENDER',
  PROFILE_IMAGE: 'PROFILE_IMAGE',
};

// Error codes
const ERROR_CODES = {
  MISSING_FIELDS: 'ERR001',
  PASSWORD_MISMATCH: 'ERR002',
  USER_EXISTS: 'ERR003',
  USER_NOT_FOUND: 'ERR004',
  WRONG_PASSWORD: 'ERR005',
  DATABASE_ERROR: 'ERR006',
  JWT_ERROR: 'ERR007',
};

exports.registerUser = async (data) => {
  const {
    username, password, confirm_password,
    full_name, email, phone_number,
    address, gender, profile_image
  } = data;

  // Validate required fields
  if (!username || !password || !confirm_password || !full_name || !email || !phone_number) {
    logger.warn('Missing required fields on registration');
    return { status: 400, data: { error: 'Missing required fields', code: ERROR_CODES.MISSING_FIELDS } };
  }

  // Check password match
  if (password !== confirm_password) {
    logger.warn('Passwords do not match');
    return { status: 400, data: { error: 'Passwords do not match', code: ERROR_CODES.PASSWORD_MISMATCH } };
  }

  try {
    // Check if user already exists by username or email
    const userCheckQuery = `
      SELECT ${USER_COLUMNS.USERNAME}, ${PROFILE_COLUMNS.EMAIL}
      FROM ${USERS_TABLE} u
      LEFT JOIN ${USER_PROFILE_TABLE} p ON u.${USER_COLUMNS.USER_ID} = p.${PROFILE_COLUMNS.USER_ID}
      WHERE u.${USER_COLUMNS.USERNAME} = $1 OR p.${PROFILE_COLUMNS.EMAIL} = $2
    `;
    const existingUser = await pool.query(userCheckQuery, [username, email]);

    if (existingUser.rows.length > 0) {
      logger.info(`Duplicate registration attempt for username: ${username} or email: ${email}`);
      return { status: 400, data: { error: 'Username or Email already exists', code: ERROR_CODES.USER_EXISTS } };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertUserQuery = `
      INSERT INTO ${USERS_TABLE} (${USER_COLUMNS.USERNAME}, ${USER_COLUMNS.PASSWORD}, ${USER_COLUMNS.USER_TYPE})
      VALUES ($1, $2, 'TENANT') RETURNING ${USER_COLUMNS.USER_ID}
    `;
    const userRes = await pool.query(insertUserQuery, [username, hashedPassword]);
    const userId = userRes.rows[0].user_id;

    // Insert or update user profile
    const insertProfileQuery = `
      INSERT INTO ${USER_PROFILE_TABLE} 
      (${PROFILE_COLUMNS.USER_ID}, ${PROFILE_COLUMNS.FULL_NAME}, ${PROFILE_COLUMNS.PHONE_NUMBER}, 
      ${PROFILE_COLUMNS.EMAIL}, ${PROFILE_COLUMNS.ADDRESS}, ${PROFILE_COLUMNS.GENDER}, ${PROFILE_COLUMNS.PROFILE_IMAGE})
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(insertProfileQuery, [
      userId, full_name, phone_number, email,
      address || null, gender || null, profile_image || null
    ]);

    logger.info(`User registered: ${username}`);
    return { status: 201, data: { message: 'User registered successfully' } };
  } catch (error) {
    logger.error('Database error during registration', error);
    return { status: 500, data: { error: 'Database error', code: ERROR_CODES.DATABASE_ERROR } };
  }
};

exports.loginUser = async (data) => {
  const expiresIn = process.env.JWT_EXPIRATION || '1h';  // Default to '1h' if not set
  const { username, password } = data;

  try {
    const query = `
      SELECT * FROM ${USERS_TABLE} WHERE ${USER_COLUMNS.USERNAME} = $1
    `;
    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      logger.warn(`Login failed for non-existing user: ${username}`);
      return { status: 401, data: { error: 'Invalid username or password', code: ERROR_CODES.USER_NOT_FOUND } };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: wrong password for user ${username}`);
      return { status: 401, data: { error: 'Invalid username or password', code: ERROR_CODES.WRONG_PASSWORD } };
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn });

    logger.info(`User logged in: ${username}`);
    return { status: 200, data: { message: 'Login successful', token } };
  } catch (error) {
    logger.error('JWT error during login', error);
    return { status: 500, data: { error: 'JWT error', code: ERROR_CODES.JWT_ERROR } };
  }
};

// New function to get logged-in user's profile details
exports.getUserProfile = async (userId) => {
    const query = `
      SELECT ${PROFILE_COLUMNS.FULL_NAME}, ${PROFILE_COLUMNS.PHONE_NUMBER}, ${PROFILE_COLUMNS.EMAIL},
             ${PROFILE_COLUMNS.ADDRESS}, ${PROFILE_COLUMNS.GENDER}, ${PROFILE_COLUMNS.PROFILE_IMAGE}
      FROM ${USER_PROFILE_TABLE}
      WHERE ${PROFILE_COLUMNS.USER_ID} = $1
    `;
    try {
      const result = await pool.query(query, [userId]);
      if (result.rows.length === 0) {
        return { status: 404, data: { error: 'User profile not found' } };
      }
      return { status: 200, data: { profile: result.rows[0] } };
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      return { status: 500, data: { error: 'Database error' } };
    }
  };
