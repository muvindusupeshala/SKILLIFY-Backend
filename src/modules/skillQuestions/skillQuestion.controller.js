const { SkillQuestion } = require('../../models');
const AppError = require('../../shared/AppError');
const asyncHandler = require('../../shared/asyncHandler');
const { serialize, serializeMany } = require('../../shared/serialize');

const listQuestions = asyncHandler(async (req, res) => {
  const questions = await SkillQuestion.find().sort({ createdAt: 1 });
  res.status(200).json(serializeMany(questions));
});

const createQuestion = asyncHandler(async (req, res) => {
  const { category, skill, type = 'technical', text, weight = 1 } = req.body;
  if (!category || !skill || !text) throw new AppError('Category, skill, and text are required', 400);

  const question = await SkillQuestion.create({ category, skill, type, text, weight });
  res.status(201).json(serialize(question));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await SkillQuestion.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
  if (!question) throw new AppError('Question not found', 404);
  res.status(200).json(serialize(question));
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await SkillQuestion.findByIdAndDelete(req.params.id);
  if (!question) throw new AppError('Question not found', 404);
  res.status(204).send();
});

module.exports = { listQuestions, createQuestion, updateQuestion, deleteQuestion };
