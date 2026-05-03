const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const skillQuestionRoutes = require('./modules/skillQuestions/skillQuestion.routes');
const assessmentRoutes = require('./modules/assessments/assessment.routes');
const careerPathRoutes = require('./modules/careerPaths/careerPath.routes');
const skillGapRoutes = require('./modules/skillGapAnalysis/skillGap.routes');
const learningResourceRoutes = require('./modules/learningResources/learningResource.routes');
const progressRoutes = require('./modules/progressAnalytics/progress.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const { authMiddleware } = require('./middleware/auth.middleware');
const { AppSetting } = require('./models');
const { serialize } = require('./shared/serialize');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'online', database: 'mongodb-atlas', modules: ['auth', 'skillQuestions', 'assessments', 'careerPaths', 'skillGapAnalysis', 'learningResources', 'progressAnalytics', 'admin'] });
});

router.get('/settings', async (req, res, next) => {
  try {
    const settings = await AppSetting.findOne({ key: 'main' });
    res.status(200).json(serialize(settings));
  } catch (error) {
    next(error);
  }
});

router.use('/auth', authRoutes);
router.use('/skill-questions', skillQuestionRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/career-paths', careerPathRoutes);
router.use('/skill-gap-analysis', skillGapRoutes);
router.use('/learning-resources', learningResourceRoutes);
router.use('/progress', progressRoutes);
router.use('/admin', adminRoutes);

// Compatibility aliases used by the current mobile app.
router.use('/questions', skillQuestionRoutes);
router.use('/resources', learningResourceRoutes);
router.use('/users/stats', authMiddleware, require('./modules/progressAnalytics/progress.controller').getProgressStats);

router.post('/seed', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'System generated questions and demo resources are already seeded' });
});

module.exports = router;
