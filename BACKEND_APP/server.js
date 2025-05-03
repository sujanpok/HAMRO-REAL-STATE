// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Parse comma-separated origins from .env
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

// ✅ Enable CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('👋 Hello!!! from your Raspberry Pi! Api service running.');
});

// ✅ Routes
app.use('/', authRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running at http://localhost:${PORT}`);
});
