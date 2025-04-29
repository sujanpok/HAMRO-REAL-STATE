// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Enable CORS from .env
const allowedOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// request with post method
app.get('/', (req, res) => {
  res.send('👋 Hello from your Raspberry Pi! Request with Post Method');
});

// ✅ Routes
app.use('/', authRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running at http://localhost:${PORT}`);
});
