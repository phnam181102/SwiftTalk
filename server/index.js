import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { ErrorMiddleware } from './middlewares/error.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import { Server } from 'socket.io';
import { getUserIdFromSocket } from './utils/GetUserIdFromSocket.js';

dotenv.config();
const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Cookie parser
app.use(cookieParser());

app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    }),
);
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);

app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/recordings', express.static('uploads/recordings'));

export const prismaClient = new PrismaClient({
    log: ['query'],
});

app.use(ErrorMiddleware);

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

global.onlineUsers = new Map();

const usersTyping = {};
io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', {
                from: data.from,
                message: data.message,
            });
        }
    });

    socket.on('get-initial-contacts', (data) => {
        console.log({ data });
        socket.emit('get-initial-contacts-response', data);
    });

    socket.on('join chat', (userId) => {
        socket.join(userId);
        usersTyping[userId] = false;
    });

    socket.on('typing', (userId) => {
        usersTyping[userId] = true;
        socket.broadcast.emit('typing', userId);
    });

    socket.on('stop typing', (userId) => {
        usersTyping[userId] = false;
        socket.broadcast.emit('stop typing', userId);
    });

    socket.on('leave chat', () => {
        const userId = getUserIdFromSocket(socket);
        if (userId) {
            delete usersTyping[userId];
            console.log('User ' + userId + ' left the chat');
        }
    });

    socket.on('outgoing-voice-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('incoming-voice-call', {
                from: data.from,
                roomId: data.roomId,
                callType: data.callType,
            });
        }
    });

    socket.on('outgoing-video-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('incoming-video-call', {
                from: data.from,
                roomId: data.roomId,
                callType: data.callType,
            });
        }
    });

    socket.on('reject-voice-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.from);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('voice-call-rejected');
        }
    });

    socket.on('reject-video-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.from);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('video-call-rejected');
        }
    });

    socket.on('accept-incoming-call', ({ id }) => {
        const sendUserSocket = onlineUsers.get(id);
        socket.to(sendUserSocket).emit('accept-call');
    });
});
