const jwt = require('jsonwebtoken');
const AppError = require('../shared/AppError');
const config = require('../config/env');
const { User } = require('../models');

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new AppError('Authentication token is required', 401));

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 401));
    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return next(new AppError('Authentication is required', 401));
  if (req.user.role !== 'admin') return next(new AppError('Admin access is required', 403));
  return next();
}

module.exports = { createToken, authMiddleware, requireAdmin };
