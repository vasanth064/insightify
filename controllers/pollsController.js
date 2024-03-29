import catchAsync from '../helpers/catchAsync.js';
import { Poll, PollResponse } from '../models/pollsModel.js';
import AppError from '../helpers/appError.js';

export const pollStructure = catchAsync(async (req, res, next) => {
  const body = {
    question: req.body.question,
    multiple: req.body.multiple,
    options: req.body.options,
    createdBy: req.user._id,
  };

  await Poll.create(body);

  res.status(201).json({
    status: 'success',
    message: req.body,
  });
});

export const getPollStructures = catchAsync(async (req, res, next) => {
  const polls = await Poll.find({
    createdBy: req.user._id,
  }).exec();
  res.status(200).json({
    status: 'success',
    data: polls,
  });
});

export const getPollStructure = catchAsync(async (req, res, next) => {
  if (req.params.id === 'undefined')
    return next(new AppError('Poll not found', 404));

  const poll = await Poll.findOne({ _id: req.params.id });

  console.log(poll, req.params.id);
  if (!poll) {
    return next(new AppError('Poll not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: poll,
  });
});

export const deletePollStructure = catchAsync(async (req, res, next) => {
  if (req.body.id === 'undefined')
    return next(new AppError('Poll not found', 404));

  const poll = await Poll.findOneAndDelete(req.body.id);

  if (!poll) {
    return next(new AppError('Poll not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const pollResponse = catchAsync(async (req, res, err) => {
  const poll = await Poll.findById(req.body.poll);
  if (!poll) {
    return next(new AppError('Poll not found', 404));
  }
  const body = {
    poll: poll._id,
    submittedBy: req.user._id,
    answers: req.body.answers,
  };

  await PollResponse.create(body);

  res.status(201).json({
    status: 'success',
    message: req.body,
  });
});

export const getPollResponses = catchAsync(async (req, res, next) => {
  const polls = await PollResponse.find({
    submittedBy: req.user._id,
  }).exec();
  res.status(200).json({
    status: 'success',
    data: polls,
  });
});

export const getPollResponse = catchAsync(async (req, res, next) => {
  console.log(req.params.id)
  if (req.params.id === 'undefined')
    return next(new AppError('Poll not found', 404));

  const poll = await PollResponse.findById(req.params.id);

  if (!poll) {
    return next(new AppError('Poll not found', 404));
  }
  //  
  // 
  
    res.status(200).json({
      status: 'success',
      data: poll,
    });
  });
  

  // 
  
export const getSocketpollresponse = catchAsync(async (req, res, next) => {
  const chatSocket = io.of('/chat/pollresp');

  chatSocket.on('connection', (socket) => {
    // console.log('A user connected to the chat namespace');
    socket.emit('chatMessage', 'Welcome to the chat!')
  
    socket.on('chatMessage', (message) => {
      console.log('Message received on chat namespace:', message);
      socket.emit('receiveMessage', message);
    });
    socket.on('chatMessage', ({ pollId, message }) => {
      io.to(pollId).emit('receiveMessage', message);
      console.log(`Message received in room ${pollId}: ${message}`);
    });
  });
  
});