require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../logger');

const { schema, tables } = config.db;

// Centralized table and column names
const LOGIN_TABLE = `"${schema}"."${tables.login}"`;
const USER_PROFILE_TABLE = `"${schema}"."${tables.userProfile}"`;

const LOGIN_COLUMNS = {
  USERNAME: 'USERNAME',
  PASSWORD: 'PASSWORD',
  USER_TYPE: 'USER_TYPE',
  IS_ACTIVE: 'IS_ACTIVE',
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

const USER_TYPES = {
  ADMIN: '0',
  OWNER: '1',
  TENANT: '2',
  AGENT: '3',
};

const ERROR_CODES = {
  MISSING_FIELDS: 'ERR001',
  USER_EXISTS: 'ERR002',
  USER_NOT_FOUND: 'ERR003',
  WRONG_PASSWORD: 'ERR004',
  DATABASE_ERROR: 'ERR005',
  JWT_ERROR: 'ERR006',
};

// Register new user
exports.registerUser = async (data) => {
  const { full_name, gender, email, password } = data;

  if (!full_name || !gender || !email || !password) {
    logger.warn('Missing required fields on registration');
    return {
      status: 400,
      data: {
        error: 'Missing required fields',
        code: ERROR_CODES.MISSING_FIELDS,
      },
    };
  }
  const client = await pool.connect(); // Get a client from the pool
  try {

      await client.query('BEGIN'); // Start transaction

    const userCheckQuery = `
      SELECT p."${PROFILE_COLUMNS.EMAIL}"
      FROM ${LOGIN_TABLE} u
      LEFT JOIN ${USER_PROFILE_TABLE} p 
        ON u."${LOGIN_COLUMNS.USER_ID}" = p."${PROFILE_COLUMNS.USER_ID}"
      WHERE p."${PROFILE_COLUMNS.EMAIL}" = $1
    `;
    const existingUser = await pool.query(userCheckQuery, [email]);

    if (existingUser.rows.length > 0) {
      logger.info(`Duplicate registration attempt for email: ${email}`);
      return {
        status: 400,
        data: {
          error: 'Email already exists',
          code: ERROR_CODES.USER_EXISTS,
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertLoginUserQuery = `
      INSERT INTO ${LOGIN_TABLE} 
      ("${LOGIN_COLUMNS.USERNAME}", "${LOGIN_COLUMNS.PASSWORD}", "${LOGIN_COLUMNS.USER_TYPE}", "${LOGIN_COLUMNS.IS_ACTIVE}")
      VALUES ($1, $2, $3, $4) RETURNING "${LOGIN_COLUMNS.USER_ID}"
    `;
    const userRes = await pool.query(insertLoginUserQuery, [
      email,
      hashedPassword,
      USER_TYPES.TENANT,
      true,
    ]);

    const userId = userRes.rows[0][LOGIN_COLUMNS.USER_ID];  // Check if this value is properly returned

    // Ensure that userId is correctly fetched and not null
    if (!userId) {
      logger.error('User ID not returned from login insert');
      await client.query('ROLLBACK'); // Rollback if userId is not returned
      return {
        status: 500,
        data: {
          error: 'Failed to register user',
          code: ERROR_CODES.DATABASE_ERROR,
        },
      };
    }

    const insertProfileQuery = `
      INSERT INTO ${USER_PROFILE_TABLE} 
      ("${PROFILE_COLUMNS.USER_ID}", "${PROFILE_COLUMNS.FULL_NAME}", "${PROFILE_COLUMNS.PHONE_NUMBER}", 
       "${PROFILE_COLUMNS.EMAIL}", "${PROFILE_COLUMNS.ADDRESS}", "${PROFILE_COLUMNS.GENDER}", "${PROFILE_COLUMNS.PROFILE_IMAGE}")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(insertProfileQuery, [
      userId,
      full_name,
      null,
      email,
      null,
      gender,
      null,
    ]);
    await client.query('COMMIT'); // Commit the transaction if both queries succeed

    logger.info(`User registered with email: ${email}`);
    return { status: 201, data: { message: 'User registered successfully' } };
  } catch (error) {
    //await client.query('ROLLBACK'); // Rollback in case of any error
    logger.error('Database error during registration:', {
      message: error.message,
      stack: error.stack,
    });
    return {
      status: 500,
      data: { error: 'Database error', code: ERROR_CODES.DATABASE_ERROR },
    };
  }
};

// Login user
exports.loginUser = async (data) => {
  const expiresIn = process.env.JWT_EXPIRATION;
  const { email, password } = data;

  try {
    const query = `
      SELECT * FROM ${LOGIN_TABLE} 
      WHERE "${LOGIN_COLUMNS.IS_ACTIVE}" IS TRUE AND "${LOGIN_COLUMNS.USERNAME}" = $1
    `;
    const result = await pool.query(query, [email]);
    const user = result.rows[0];
    logger.warn('Login failed: email is missing');
    if (!user) {
      logger.warn(`Login failed for non-existing user: ${email}`);
      return {
        status: 401,
        data: { error: 'Invalid email or password', code: ERROR_CODES.USER_NOT_FOUND },
      };
    }

    const isMatch = await bcrypt.compare(password, user[LOGIN_COLUMNS.PASSWORD]);
    if (!isMatch) {
      logger.warn(`Login failed: wrong password for user ${email}`);
      return {
        status: 401,
        data: { error: 'Invalid email or password', code: ERROR_CODES.WRONG_PASSWORD },
      };
    }

    const token = jwt.sign({ userId: user[LOGIN_COLUMNS.USER_ID] }, process.env.JWT_SECRET, { expiresIn });

    logger.info(`User logged in: ${email}`);
    return { status: 200, data: { message: 'Login successful', token } };
  } catch (error) {
    logger.error('JWT error during login:', {
      message: error.message,
      stack: error.stack,
    });
    return {
      status: 500,
      data: { error: 'JWT error', code: ERROR_CODES.JWT_ERROR },
    };
  }
};

// Get profile
exports.getUserProfile = async (userId) => {
  const query = `
    SELECT 
      p."${PROFILE_COLUMNS.FULL_NAME}", 
      p."${PROFILE_COLUMNS.PHONE_NUMBER}", 
      p."${PROFILE_COLUMNS.EMAIL}",
      p."${PROFILE_COLUMNS.ADDRESS}", 
      p."${PROFILE_COLUMNS.GENDER}", 
      p."${PROFILE_COLUMNS.PROFILE_IMAGE}",
      l."${LOGIN_COLUMNS.USER_TYPE}"
    FROM ${USER_PROFILE_TABLE} p
    JOIN ${LOGIN_TABLE} l ON p."${PROFILE_COLUMNS.USER_ID}" = l."${LOGIN_COLUMNS.USER_ID}"
    WHERE p."${PROFILE_COLUMNS.USER_ID}" = $1
  `;
  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return { status: 404, data: { error: 'User profile not found' } };
    }
    return { status: 200, data: { profile: result.rows[0] } };
  } catch (error) {
    logger.error('Error fetching user profile:', {
      message: error.message,
      stack: error.stack,
    });
    return { status: 500, data: { error: 'Database error' } };
  }
};
