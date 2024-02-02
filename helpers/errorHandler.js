import AppError from './appError.js';

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please login again', 401);
};
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired !', 401);
};

const handleDuplicateFieldErrorDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate Field Value ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (error) => {
  const err = Object.values(error.errors).map((element) => element.message);
  const message = `Invalid input Data : ${err.join('. ')}`;
  return new AppError(message, 400);
};

const handleProductionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};
const handleDevelopmentError = async (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statuscode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  err.statuscode = err.statuscode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDb(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    handleProductionError(error, res);
  }
};

export default errorHandler;
