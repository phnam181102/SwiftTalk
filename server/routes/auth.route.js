import express from 'express';

const authRouter = express.Router();
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

authRouter.post('/login', authController.login);
authRouter.post('/social-auth', authController.socialAuth);
authRouter.post('/register', authController.register);

export default authRouter;
