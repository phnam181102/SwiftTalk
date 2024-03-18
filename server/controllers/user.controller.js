import { CatchAsyncError } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../exceptions/ErrorHandler.js';
import { prismaClient } from '../index.js';

// get all users
export const getAllUsers = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await prismaClient.user.findMany({
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
