import express from 'express';
import messageController from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.post('/add-message', messageController.addMessage);
messageRouter.get('/get-messages/:from/:to', messageController.getMessages);

export default messageRouter;
