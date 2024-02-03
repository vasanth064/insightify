import {Form} from '../models/formModel.js';
import catchAsync from '../helpers/catchAsync.js';


export const createForm = catchAsync(async (req, res, err) => {
    req.user._id
    const {name, formJson, createdAt, closesAt } = req.body;
    const {formName, formJson, createdAt, closesAt } = req.body;
    const form = await Form.create({name:formName, createdBy: req.user._id, formJson, createdAt, closesAt});
    res.status(201).json({
        status: 'success',
        data: {
        form,
        },
    });
    }
);

export const getForm = catchAsync(async (req, res, err) => {
    const form = await Form.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
        form,
        },
    });
    }
);

export const getUserForms = catchAsync(async (req, res, err) => {
    const forms = await Form.find({createdBy: req.user._id});
    res.status(200).json({
        status: 'success',
        data: {
        forms,
        },
    });
    }
);

export const deleteForm = catchAsync(async (req, res, err) => {
    await Form.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
    }
);




