const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/auth/google', authController.loginWithGooogle);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/user-profile', authMiddleware.protect, authController.getProfile);
// Insight routes
router.get('/insights', authMiddleware.protect, insightController.getAllInsights);
router.post('/insights/new', authMiddleware.protect, insightController.createInsight);
router.get('/insights/:id', authMiddleware.protect, insightController.getInsight);
router.post('/gemini/summary', authMiddleware.protect, insightController.getSummary);
router.post('/gemini/score-data', authMiddleware.protect, insightController.generateInsightScores);

module.exports = router;