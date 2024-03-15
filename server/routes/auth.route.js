import express from 'express';

const authRoute = express.Router();
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

authRoute.post('/login', authController.login);
authRoute.post('/register', authController.register);
authRoute.get('/me', [authMiddleware], authController.me);

export default authRoute;
