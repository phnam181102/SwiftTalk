import express from 'express';

const authRouter = express.Router();
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/refresh', authController.updateAccessToken);
authRouter.get('/me', [authMiddleware], authController.me);

export default authRouter;
