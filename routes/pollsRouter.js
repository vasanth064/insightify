import express from 'express';
import {
  pollStructure,
  pollResponse,
  getPollStructures,
  getPollStructure,
  deletePollStructure,
  getPollResponses,
  getPollResponse,
} from '../controllers/pollsController.js';
import { protectedRoute } from '../controllers/userController.js';

const pollsRouter = express.Router();

pollsRouter
  .post('/structure', protectedRoute, pollStructure)
  .get('/structure', protectedRoute, getPollStructures)
  .get('/structure:id', protectedRoute, getPollStructure)
  .delete('/structure', protectedRoute, deletePollStructure);

pollsRouter
  .post('/response', protectedRoute, pollResponse)
  .get('/response', protectedRoute, getPollResponses)
  .get('/response:id', protectedRoute, getPollResponse);

export default pollsRouter;
