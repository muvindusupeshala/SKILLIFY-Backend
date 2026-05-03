const { Assessment, LearningResource, ResourceProgress } = require('../../models');
const asyncHandler = require('../../shared/asyncHandler');
const { serializeMany } = require('../../shared/serialize');

function calculateOverall(scores = {}) {
  const values = Object.values(scores);
  return values.length ? Math.round((values.reduce((sum, value) => sum + Number(value), 0) / (values.length * 4)) * 100) : 0;
}

const getProgressStats = asyncHandler(async (req, res) => {
  const userAssessments = await Assessment.find({ userId: req.user.id }).sort({ createdAt: -1 });
  const latest = userAssessments[0];
  const scores = latest?.scores instanceof Map ? Object.fromEntries(latest.scores) : latest?.scores || {};
  const completedResources = await ResourceProgress.countDocuments({ userId: req.user.id, status: 'completed' });
  const progressItems = await ResourceProgress.find({ userId: req.user.id });
  const assignedResourceIds = new Set(progressItems.map((item) => item.resourceId));
  const availableResources = await LearningResource.countDocuments();

  res.status(200).json({
    overall: calculateOverall(scores),
    assessments: userAssessments.length,
    programming: Math.round((((scores.JavaScript || 0) + (scores.React || 0) + (scores['Node.js'] || 0)) / 12) * 100),
    data: Math.round(((scores.Databases || 0) / 4) * 100),
    infra: Math.round((((scores.Cloud || 0) + (scores.Cybersecurity || 0)) / 8) * 100),
    completedResources,
    trackedResources: assignedResourceIds.size,
    availableResources,
    history: userAssessments.slice().reverse().map((assessment, index) => ({
      name: `Assessment ${index + 1}`,
      progress: calculateOverall(assessment.scores instanceof Map ? Object.fromEntries(assessment.scores) : assessment.scores),
    })),
  });
});

const getResourceProgress = asyncHandler(async (req, res) => {
  const progress = await ResourceProgress.find({ userId: req.user.id });
  res.status(200).json(serializeMany(progress));
});

module.exports = { getProgressStats, getResourceProgress };
