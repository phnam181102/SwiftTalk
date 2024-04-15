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
app.use('/api/v1/', authRouter);
app.use('/api/v1/', userRouter);
app.use('/api/v1/', messageRouter);

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
});
