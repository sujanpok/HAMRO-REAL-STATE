// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// ✅ Routes
router.post('/register', authController.register);  // Register route
router.post('/login', authController.login);  // Login route
router.get('/dashboard', authenticateJWT, dashboardController.getDashboard);  // Dashboard route (protected)

module.exports = router;
