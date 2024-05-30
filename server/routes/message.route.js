import express from 'express';
import multer from 'multer';
import messageController from '../controllers/message.controller.js';
import { updateAccessToken } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const messageRouter = express.Router();

const uploadImage = multer({ dest: '/uploads/images' });
const uploadAudio = multer({ dest: '/uploads/recordings' });

messageRouter.post('/add-message', messageController.addMessage);
// messageRouter.post('/add-message-group', messageController.addMessageGroup);
messageRouter.get('/get-messages/:from/:to', messageController.getMessages);
messageRouter.get('/get-initial-contacts/:from', messageController.getInitialContactsWithMessages);
messageRouter.post('/add-image-message', uploadImage.single('image'), messageController.addImageMessage);
messageRouter.post('/add-audio-message', uploadAudio.single('audio'), messageController.addAudioMessage);
messageRouter.post('/create-group', uploadImage.single('image'), messageController.createGroup);
messageRouter.get('/fetch-group', updateAccessToken, [authMiddleware], messageController.fetchGroup);

export default messageRouter;
