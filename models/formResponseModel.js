import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: [true, 'Form ID is required'],
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
  responseJson: {
    type: Object,
    required: [true, 'Form is required'],
  },
});

export const formResponse = mongoose.model('formResponse', formResponseSchema);
