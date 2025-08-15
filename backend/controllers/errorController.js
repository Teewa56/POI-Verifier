class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  if (process.env.NODE_ENV !== 'production') {
    return res.status(statusCode).json({
      status,
      message: err.message,
      stack: err.stack,
    });
  }
  // production
  return res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong',
  });
};

module.exports = { AppError, globalErrorHandler };
