const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const insightController = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');

// Auth
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/user-profile', protect, authController.getProfile);

// Insights
router.get('/insights', protect, insightController.getAllInsights);
router.post('/insights/new', protect, insightController.createInsight);
router.get('/insights/:id', protect, insightController.getInsight);
router.post('/verify-insight', protect, insightController.verifyInsight);
router.post('/get-summary',protect, insightController.getSummary);
router.post('/get-score',protect, insightController.generateInsightScores);

module.exports = router;