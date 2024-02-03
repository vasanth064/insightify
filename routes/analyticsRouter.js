import express from 'express';
import {
  dashboardAnalytics,
  dashboardRecents,
} from '../controllers/analyticsController.js';
import { protectedRoute } from '../controllers/userController.js';
const analyticsRouter = express.Router();

analyticsRouter.get('/dashboard', protectedRoute, dashboardAnalytics);
analyticsRouter.get('/recents', protectedRoute, dashboardRecents);

export default analyticsRouter;
