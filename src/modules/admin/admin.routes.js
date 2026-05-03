const express = require('express');
const { authMiddleware, requireAdmin } = require('../../middleware/auth.middleware');
const {
  deleteAssessment,
  deleteUser,
  getSettings,
  getSummary,
  listAssessments,
  listUsers,
  updateSettings,
  updateUser,
} = require('./admin.controller');

const router = express.Router();

router.use(authMiddleware, requireAdmin);

router.get('/summary', getSummary);
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/assessments', listAssessments);
router.delete('/assessments/:id', deleteAssessment);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
