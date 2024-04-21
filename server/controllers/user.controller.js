import { CatchAsyncError } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../exceptions/ErrorHandler.js';
import { prismaClient } from '../index.js';
import { generateToken04 } from '../utils/TokenGenerator.js';

// get all users
export const getAllUsers = CatchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params; // Lấy userId từ params

        const users = await prismaClient.user.findMany({
            where: {
                id: {
                    not: userId, // Loại bỏ người dùng có userId cụ thể
                },
            },
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        const usersGroupedByInitialLetter = {};

        users.forEach((user) => {
            const initialLetter = user.name.charAt(0).toUpperCase();
            usersGroupedByInitialLetter[initialLetter] = usersGroupedByInitialLetter[initialLetter] || [];
            usersGroupedByInitialLetter[initialLetter].push(user);
        });

        res.status(201).json({
            success: true,
            users: usersGroupedByInitialLetter,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const generateTokenUser = CatchAsyncError(async (req, res, next) => {
    try {
        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_ID;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = '';
        if (appId && serverSecret && userId) {
            const token = generateToken04(appId, userId, serverSecret, effectiveTime, payload);
            res.json({ token });
        }
        return next(new ErrorHandler('User id, app id and server secret is required.', 400));
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
