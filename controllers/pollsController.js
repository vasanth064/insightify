import catchAsync from '../helpers/catchAsync.js';
import Poll from '../models/pollsModel.js';
import AppError from '../helpers/appError.js';
import User from '../models/userModel.js';

export const pollStructure = catchAsync(async (req, res, next) => {
  const body = {
    question: req.body.question,
    multiple: req.body.multiple,
    options: req.body.options,
    createdBy: req.user._id,
  };

  const poll = await Poll.create(body);

  res.status(201).json({
    status: 'success',
    message: req.body,
  });
});

export const pollResponse = catchAsync(async (req, res, err) => {
  res.status(201).json({
    status: 'success',
    message: req.body,
  });
});
