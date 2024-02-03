import express from 'express';
import {createForm, getForm,  deleteForm, getUserForms} from '../controllers/formController.js';
import {protectedRoute} from '../controllers/userController.js';
import catchAsync from '../helpers/catchAsync.js';

const formRouter = express.Router();


formRouter.post('/',protectedRoute, createForm);
formRouter.get('/',protectedRoute, getUserForms);
formRouter.get('/:id',protectedRoute, getForm);
formRouter.delete('/:id',protectedRoute, deleteForm);

export default formRouter;