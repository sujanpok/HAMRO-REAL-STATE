// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://hamrorealstate.store'],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use('/', authRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running at http://localhost:${PORT}`);
});
