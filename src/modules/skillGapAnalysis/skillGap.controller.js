const { Assessment, CareerPath } = require('../../models');
const AppError = require('../../shared/AppError');
const asyncHandler = require('../../shared/asyncHandler');
const { analyzeGapForCareer } = require('./skillGap.service');

const getGapAnalysis = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!assessment) throw new AppError('Complete a skill assessment first', 404);

  const careerId = req.query.careerId || assessment.targetCareerId || req.user.targetCareerId;
  const career = await CareerPath.findById(careerId);
  if (!career) throw new AppError('Career path not found', 404);

  const scores = assessment.scores instanceof Map ? Object.fromEntries(assessment.scores) : assessment.scores;
  res.status(200).json(analyzeGapForCareer(scores, career));
});

module.exports = { getGapAnalysis };
