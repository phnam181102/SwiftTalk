import express from 'express';

import { getAllUsers } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const userRouter = express.Router();

userRouter.get('/get-users', getAllUsers);

export default userRouter;
