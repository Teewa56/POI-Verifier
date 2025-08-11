const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');
const authController = require('../controllers/authController');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Insight routes
router.get('/insights', authController.protect, insightController.getAllInsights);
router.post('/insights', authController.protect, insightController.createInsight);
router.get('/insights/:id', authController.protect, insightController.getInsight);

module.exports = router;