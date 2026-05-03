const { AppSetting, Assessment, CareerPath, LearningResource, ResourceProgress, SkillQuestion, User } = require('../../models');
const AppError = require('../../shared/AppError');
const asyncHandler = require('../../shared/asyncHandler');
const { publicUser } = require('../auth/auth.controller');
const { serialize } = require('../../shared/serialize');

const getSummary = asyncHandler(async (req, res) => {
  res.status(200).json({
    users: await User.countDocuments(),
    students: await User.countDocuments({ role: 'student' }),
    admins: await User.countDocuments({ role: 'admin' }),
    skillQuestions: await SkillQuestion.countDocuments(),
    careerPaths: await CareerPath.countDocuments(),
    learningResources: await LearningResource.countDocuments(),
    assessments: await Assessment.countDocuments(),
    trackedResources: await ResourceProgress.countDocuments(),
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json(users.map((user) => publicUser(user)));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  const { name, role, targetCareerId } = req.body;
  if (name !== undefined) user.name = name;
  if (targetCareerId !== undefined) user.targetCareerId = targetCareerId;
  if (role !== undefined) {
    if (!['admin', 'student'].includes(role)) throw new AppError('Role must be admin or student', 400);
    user.role = role;
  }

  await user.save();
  res.status(200).json(publicUser(user));
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) throw new AppError('You cannot delete your own admin account', 400);

  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError('User not found', 404);
  await Assessment.deleteMany({ userId: req.params.id });
  await ResourceProgress.deleteMany({ userId: req.params.id });
  res.status(204).send();
});

const listAssessments = asyncHandler(async (req, res) => {
  const [assessments, users, careers] = await Promise.all([
    Assessment.find().sort({ createdAt: -1 }),
    User.find(),
    CareerPath.find(),
  ]);
  const userMap = new Map(users.map((user) => [user.id, user]));
  const careerMap = new Map(careers.map((career) => [career.id, career]));

  const rows = assessments.map((assessment) => {
    const user = userMap.get(assessment.userId);
    const career = careerMap.get(assessment.targetCareerId);
    return {
      ...serialize(assessment),
      user: user ? publicUser(user) : null,
      careerTitle: career?.title || 'Unassigned',
    };
  });

  res.status(200).json(rows);
});

const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  if (!assessment) throw new AppError('Assessment not found', 404);
  res.status(204).send();
});

const getSettings = asyncHandler(async (req, res) => {
  const settings = await AppSetting.findOne({ key: 'main' });
  res.status(200).json(serialize(settings));
});

const updateSettings = asyncHandler(async (req, res) => {
  const allowed = ['appName', 'audience', 'heroTitle', 'heroText'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = String(req.body[key]);
  });
  const settings = await AppSetting.findOneAndUpdate({ key: 'main' }, updates, { returnDocument: 'after', upsert: true });
  res.status(200).json(serialize(settings));
});

module.exports = {
  getSummary,
  listUsers,
  updateUser,
  deleteUser,
  listAssessments,
  deleteAssessment,
  getSettings,
  updateSettings,
};
