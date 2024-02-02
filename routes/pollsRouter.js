import express from 'express';
import { pollStructure, pollResponse } from '../controllers/pollsController.js';
import { protectedRoute } from '../controllers/userController.js';

const pollsRouter = express.Router();

pollsRouter.post('/structure', protectedRoute, pollStructure);

pollsRouter.post('/response', protectedRoute, pollResponse);

export default pollsRouter;
