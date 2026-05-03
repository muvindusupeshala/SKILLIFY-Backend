const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { submitAssessment, listAssessmentHistory, getLatestAssessment } = require('./assessment.controller');

const router = express.Router();

router.use(authMiddleware);
router.post('/submit', submitAssessment);
router.get('/history', listAssessmentHistory);
router.get('/latest', getLatestAssessment);

module.exports = router;