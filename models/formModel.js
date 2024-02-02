import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';

const formSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Name is Required']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Form must belong to a user']
    },
    formJson: {
        type: Object,
        required: [true, 'Form is required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    closesAt: {
        type: Date,
        required: [true, 'Form closing date is required']
    }
});

export const Form = mongoose.model('Form', formSchema);