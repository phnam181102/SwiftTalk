import express from 'express';

import { generateTokenUser, getAllUsers } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const userRouter = express.Router();

userRouter.get('/get-users/:userId', getAllUsers);
userRouter.get('/generate-token-user/:userId', generateTokenUser);

export default userRouter;
