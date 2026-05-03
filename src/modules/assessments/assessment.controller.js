const { Assessment, CareerPath } = require('../../models');
const AppError = require('../../shared/AppError');
const asyncHandler = require('../../shared/asyncHandler');
const { analyzeGapForCareer } = require('../skillGapAnalysis/skillGap.service');
const { serialize, serializeMany } = require('../../shared/serialize');

function normalizeScores(scores = {}) {
  return Object.entries(scores).reduce((acc, [skill, value]) => {
    const number = Number(value);
    acc[skill] = Number.isFinite(number) ? Math.max(0, Math.min(4, number)) : 0;
    return acc;
  }, {});
}

const submitAssessment = asyncHandler(async (req, res) => {
  const scores = normalizeScores(req.body.scores);
  if (!Object.keys(scores).length) throw new AppError('Assessment scores are required', 400);

  const firstCareer = await CareerPath.findOne().sort({ createdAt: 1 });
  const targetCareerId = req.body.targetCareerId || req.user.targetCareerId || firstCareer?.id;
  const targetCareer = await CareerPath.findById(targetCareerId);
  if (!targetCareer) throw new AppError('Target career path not found', 404);

  req.user.targetCareerId = targetCareerId;
  await req.user.save();

  const assessment = await Assessment.create({
    userId: req.user.id,
    targetCareerId,
    scores,
    gpa: req.body.gpa || '',
    certifications: req.body.certifications || '',
    result: analyzeGapForCareer(scores, targetCareer),
  });

  res.status(201).json(serialize(assessment));
});

const listAssessmentHistory = asyncHandler(async (req, res) => {
  const history = await Assessment.find({ userId: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json(serializeMany(history));
});

const getLatestAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!assessment) throw new AppError('No assessment found', 404);
  res.status(200).json(serialize(assessment));
});

module.exports = { submitAssessment, listAssessmentHistory, getLatestAssessment };
