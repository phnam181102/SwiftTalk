import express from 'express';

const authRoute = express.Router();
import authController from '../controllers/auth.controller.js';

authRoute.post('/login', authController.login);
authRoute.post('/register', authController.register);
// router.post('/refresh', authController.requestRefreshToken);
// router.post('/logout', middleware.verifyToken, authController.logout);

export default authRoute;
