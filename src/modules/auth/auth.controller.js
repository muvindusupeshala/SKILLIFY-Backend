const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const AppError = require('../../shared/AppError');
const asyncHandler = require('../../shared/asyncHandler');
const { createToken } = require('../../middleware/auth.middleware');

function publicUser(user) {
  const id = user.id || user._id?.toString();
  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    targetCareerId: user.targetCareerId,
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, targetCareerId = '' } = req.body;

  if (!name || !email || !password) throw new AppError('Name, email, and password are required', 400);
  if (password.length < 6) throw new AppError('Password must be at least 6 characters', 400);
  if (await User.exists({ email: email.toLowerCase() })) throw new AppError('Email already exists', 409);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    targetCareerId,
    role: 'student',
  });
  res.status(201).json({ user: publicUser(user), token: createToken(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Invalid email or password', 401);

  res.status(200).json({ user: publicUser(user), token: createToken(user) });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: publicUser(req.user) });
});

module.exports = { register, login, me, publicUser };
