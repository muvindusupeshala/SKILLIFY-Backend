function notFoundHandler(req, res, next) {
  res.status(404).json({ status: 'fail', message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message || 'Server error',
  });
}

module.exports = { notFoundHandler, errorHandler };