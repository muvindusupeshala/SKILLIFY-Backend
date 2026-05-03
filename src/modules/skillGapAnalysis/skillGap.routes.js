const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { getGapAnalysis } = require('./skillGap.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getGapAnalysis);

module.exports = router;