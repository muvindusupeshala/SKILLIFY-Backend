const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { getProgressStats, getResourceProgress } = require('./progress.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/stats', getProgressStats);
router.get('/resources', getResourceProgress);

module.exports = router;