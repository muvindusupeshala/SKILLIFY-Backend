const { CareerPath } = require('../../models');
const AppError = require('../../shared/AppError');
const asyncHandler = require('../../shared/asyncHandler');
const { serialize, serializeMany } = require('../../shared/serialize');

const listCareerPaths = asyncHandler(async (req, res) => {
  const careers = await CareerPath.find().sort({ createdAt: 1 });
  res.status(200).json(serializeMany(careers));
});

const getCareerPath = asyncHandler(async (req, res) => {
  const career = await CareerPath.findById(req.params.id);
  if (!career) throw new AppError('Career path not found', 404);
  res.status(200).json(serialize(career));
});

const createCareerPath = asyncHandler(async (req, res) => {
  const { title, description, salaryRange, growthRate, requiredSkills = [] } = req.body;
  if (!title || !description) throw new AppError('Title and description are required', 400);

  const career = await CareerPath.create({
    title,
    description,
    salaryRange: salaryRange || 'Not available',
    growthRate: growthRate || 'Medium',
    targetAudience: req.body.targetAudience || 'IT undergraduates',
    requiredSkills,
  });
  res.status(201).json(serialize(career));
});

const updateCareerPath = asyncHandler(async (req, res) => {
  const career = await CareerPath.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
  if (!career) throw new AppError('Career path not found', 404);
  res.status(200).json(serialize(career));
});

const deleteCareerPath = asyncHandler(async (req, res) => {
  const career = await CareerPath.findByIdAndDelete(req.params.id);
  if (!career) throw new AppError('Career path not found', 404);
  res.status(204).send();
});

module.exports = { listCareerPaths, getCareerPath, createCareerPath, updateCareerPath, deleteCareerPath };
