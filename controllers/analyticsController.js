import { Form } from '../models/formModel.js';
import { Poll, PollResponse } from '../models/pollsModel.js';
import catchAsync from '../helpers/catchAsync.js';

export const dashboardAnalytics = catchAsync(async (req, res, next) => {
  const forms = (await Form.find({ createdBy: req.user._id })).length;
  const polls = (await Poll.find({ createdBy: req.user._id })).length;

  res.status(200).json([
    {
      title: 'Forms',
      count: forms,
    },
    {
      title: 'Polls',
      count: polls,
    },
  ]);
});

export const dashboardRecents = catchAsync(async (req, res, next) => {
  const forms = await Form.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });

  const polls = await Poll.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });

  const recents = [...forms, ...polls].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  res.status(200).json({
    recents,
  });
});
