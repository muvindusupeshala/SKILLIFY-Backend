const express = require('express');
const { authMiddleware, requireAdmin } = require('../../middleware/auth.middleware');
const { listQuestions, createQuestion, updateQuestion, deleteQuestion } = require('./skillQuestion.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listQuestions);
router.post('/', requireAdmin, createQuestion);
router.put('/:id', requireAdmin, updateQuestion);
router.delete('/:id', requireAdmin, deleteQuestion);

module.exports = router;
