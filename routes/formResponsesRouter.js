import express from 'express';
import { protectedRoute } from '../controllers/userController.js';
import catchAsync from '../helpers/catchAsync.js';
import { saveFormResponse } from '../controllers/formResponseController.js';
import { getFormResponse } from '../controllers/formResponseController.js';

const formResponseRouter = express.Router();

formResponseRouter.post('/', protectedRoute, saveFormResponse);
formResponseRouter.get('/:id', protectedRoute, getFormResponse);


export default formResponseRouter;
