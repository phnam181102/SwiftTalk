import express from 'express';
import multer from 'multer';
import messageController from '../controllers/message.controller.js';

const messageRouter = express.Router();

const uploadImage = multer({ dest: '/uploads/images' });
const uploadAudio = multer({ dest: '/uploads/recordings' });

messageRouter.post('/add-message', messageController.addMessage);
messageRouter.get('/get-messages/:from/:to', messageController.getMessages);
messageRouter.get('/get-initial-contacts/:from', messageController.getInitialContactswithMessages);
messageRouter.post('/create-group', uploadImage.single('image'), messageController.createGroup);
messageRouter.post('/add-image-message', uploadImage.single('image'), messageController.addImageMessage);
messageRouter.post('/add-audio-message', uploadAudio.single('audio'), messageController.addAudioMessage);

export default messageRouter;
