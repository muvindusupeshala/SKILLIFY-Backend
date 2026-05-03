const { Assessment, LearningResource, ResourceProgress } = require('../../models');
const asyncHandler = require('../../shared/asyncHandler');
const AppError = require('../../shared/AppError');
const { serialize, serializeMany } = require('../../shared/serialize');

async function getLatestAssessment(userId) {
  return Assessment.findOne({ userId }).sort({ createdAt: -1 });
}

const listResources = asyncHandler(async (req, res) => {
  const skill = req.query.skill;
  const query = skill ? { skill } : {};
  const resources = await LearningResource.find(query).sort({ createdAt: 1 });
  res.status(200).json(serializeMany(resources));
});

const getRecommendedResources = asyncHandler(async (req, res) => {
  const latest = await getLatestAssessment(req.user.id);
  if (!latest) throw new AppError('Complete an assessment before requesting recommendations', 404);

  const lackingSkills = latest.result?.lackingSkills || [];
  const resources = await LearningResource.find({ skill: { $in: lackingSkills } }).sort({ createdAt: 1 });

  res.status(200).json(serializeMany(resources));
});

const createResource = asyncHandler(async (req, res) => {
  const { skill, title, provider, type = 'course', duration = 'Unknown', rating = 0, isPaid = false, url } = req.body;
  if (!skill || !title || !provider || !url) throw new AppError('Skill, title, provider, and url are required', 400);

  const resource = await LearningResource.create({ skill, title, provider, type, duration, rating, isPaid, url });
  res.status(201).json(serialize(resource));
});

const updateResource = asyncHandler(async (req, res) => {
  const resource = await LearningResource.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
  if (!resource) throw new AppError('Learning resource not found', 404);
  res.status(200).json(serialize(resource));
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await LearningResource.findByIdAndDelete(req.params.id);
  if (!resource) throw new AppError('Learning resource not found', 404);
  await ResourceProgress.deleteMany({ resourceId: req.params.id });
  res.status(204).send();
});

const updateResourceProgress = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const { status = 'in-progress', percent = 0 } = req.body;
  const resource = await LearningResource.findById(resourceId);
  if (!resource) throw new AppError('Learning resource not found', 404);

  const progress = await ResourceProgress.findOneAndUpdate(
    { userId: req.user.id, resourceId },
    { status, percent: Math.max(0, Math.min(100, Number(percent))) },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );

  res.status(200).json(serialize(progress));
});

module.exports = { listResources, getRecommendedResources, createResource, updateResource, deleteResource, updateResourceProgress };
