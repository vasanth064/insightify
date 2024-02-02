import User from './../models/userModel.js';
import catchAsync from './../helpers/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../helpers/appError.js';
import * as util from 'util';
import sendEmail from '../helpers/email.js';
import { createHash } from 'crypto';

const filterObject = (object, allowedFields) => {
  const filteredObject = {};
  Object.keys(object).map((el) => {
    if (allowedFields.includes(el)) {
      filteredObject[el] = object[el];
    }
  });
  return filteredObject;
};

const signToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  user.passwordChangedAt = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, err) => {
    const body = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  };
if (req.file) body.photo = `${userProfilePath}/${req.file.filename}`;
  const newUser = await User.create(body);
  createSendToken(newUser, 201, res);
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide Email and Password'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Username or Password !', 401));
  }
  createSendToken(user, 200, res);
});

export const signout = (req, res) => {
  res.cookie('jwt', 'signout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Please Login to Continue'));
  }
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const protectedRoute = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('You are not logged In !', 401));
  }
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError(`The user belonging to the token doesn't exist`));
  }
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password Changed recently ! Please Login Again', 401)
    );
  }
  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  // roles are passed down as array
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to access this !`, 403)
      );
    }
    next();
  };

export const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(
      new AppError(`There is no user with this email address !`, 404)
    );
  }
  if (!user) {
    return next(
      new AppError(`There is no user with this email address !`, 404)
    );
  }
  const resetToken = user.createPasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });
  const resetURL = `${req.body.url}${resetToken}`;
  let message = '';
  if (req.body.url) {
    message = `Forgot your password ? send your password to \n ${resetURL}`;
  } else {
    message = `Reset Token ID : ${resetToken}`;
  }
  try {
    await sendEmail({
      email: req.body.email,
      subject: message,
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresIn = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    console.log(err);
    return next(
      new AppError('There was an error sending the email. Try again Later ! ')
    );
  }
});
export const resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;

  await user.save();
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.verifyPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current Password is wrong', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
