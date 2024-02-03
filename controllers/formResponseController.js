import catchAsync from '../helpers/catchAsync.js';
import {formResponse} from '../models/formResponseModel.js';

export const saveFormResponse = catchAsync(async (req, res, err) => {
    const {formId, responseJson} = req.body;
    const response = await formResponse.create({formId, responseJson, submittedBy: req.user._id});
    res.status(201).json({
        status: 'success',
        data: {
        response,
        },
    });
    }
);

export const getFormResponse = catchAsync(async (req, res, err) => {
    const response = await formResponse.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
        response,
        },
    });
    }
);