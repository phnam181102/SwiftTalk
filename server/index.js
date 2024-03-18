import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { ErrorMiddleware } from './middlewares/error.js';
import { RegisterSchema } from './schema/users.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';

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

export const prismaClient = new PrismaClient({
    log: ['query'],
});

app.use(ErrorMiddleware);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});
