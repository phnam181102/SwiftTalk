import express from 'express';
import multer from 'multer';

import {
    generateTokenUser,
    getAllUsers,
    updateAccessToken,
    getUserInfo,
    updateProfile,
} from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const userRouter = express.Router();

const uploadImage = multer({ dest: '/uploads/images' });

userRouter.get('/get-users/:userId', getAllUsers);
userRouter.put('/update-profile/:userId', uploadImage.single('image'), updateProfile);
userRouter.get('/generate-token-user/:userId', generateTokenUser);
userRouter.get('/me/:userId', updateAccessToken, [authMiddleware], getUserInfo);
userRouter.get('/refresh', updateAccessToken);

export default userRouter;
