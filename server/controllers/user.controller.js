import { CatchAsyncError } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../exceptions/ErrorHandler.js';
import { prismaClient } from '../index.js';

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
                username: true,
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
