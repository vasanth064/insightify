import mongoose from 'mongoose';
import validator from 'validator';

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [
      {
        value: { type: String, required: [true, 'Option value is required.'] },
        innerText: String,
        selected: { type: Boolean, default: false },
      },
    ],
    validate: {
      validator: function (options) {
        return options.length >= 2;
      },
      message: 'At least two options are required.',
    },
  },
});

const pollResponseSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: [true, 'Poll ID is required'],
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  answers: [
    {
      id: Number,
    },
  ],
});

export const PollResponse = mongoose.model('PollResponses', pollResponseSchema);
export const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
