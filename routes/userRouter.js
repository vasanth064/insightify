import express from 'express';
import {
  getMe,
  signin,
  signup,
  protectedRoute,
  restrictTo,
  forgetPassword,
  resetPassword,
  updatePassword,
  signout,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/signout', signout);
userRouter.get('/me', protectedRoute, getMe);

userRouter.patch('/updatePassword', protectedRoute, updatePassword);
userRouter.post('/forgetPassword', forgetPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

export default userRouter;
