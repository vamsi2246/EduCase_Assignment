const express = require('express');
const githubController = require('../controllers/githubController');
const { validateUsername, validateListQuery } = require('../middleware/validateRequest');
const { generalLimiter, profileAnalyzerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// 1. Core Profile Analytics Trigger
router.get('/profile/:username', profileAnalyzerLimiter, validateUsername, githubController.analyzeProfile);

// 2. Paginated Profiles List
router.get('/profiles', generalLimiter, validateListQuery, githubController.getAllProfiles);

// 3. Single Profile DB Query
router.get('/profiles/:id', generalLimiter, githubController.getProfileById);

// 4. Chronological Search Logs
router.get('/history', generalLimiter, githubController.getSearchLogs);

module.exports = router;
