import jwt from 'jsonwebtoken';
import { renameSync, unlinkSync } from 'fs';

import { CatchAsyncError } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../exceptions/ErrorHandler.js';
import { prismaClient } from '../index.js';
import { generateToken04 } from '../utils/TokenGenerator.js';
import { accessTokenOptions, refreshTokenOptions } from '../utils/Jwt.js';

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
                profilePicture: true,
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

export const updateProfile = CatchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { name, username, email } = req.body;

        const user = await prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        let fileName;
        if (req.file) {
            // Nếu user có ảnh cũ, xóa ảnh đó
            if (user.profilePicture) {
                try {
                    unlinkSync(user.profilePicture);
                } catch (error) {
                    console.error(`Failed to delete old avatar: ${error.message}`);
                    return next(new ErrorHandler('Failed to delete old avatar', 500));
                }
            }

            const date = Date.now();
            fileName = 'uploads/images/' + 'avatar' + userId + date;
            renameSync(req.file.path, fileName);
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                username,
                email,
                profilePicture: fileName || user.profilePicture,
            },
        });

        res.status(200).json({
            success: true,
            message: "User's profile updated successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
            },
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getUserInfo = CatchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params;
        let user = await prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const updateAccessToken = CatchAsyncError(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const errMessage = 'Could not refresh token';

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
        if (!decoded) return next(new ErrorHandler(errMessage, 400));

        const user = decoded;

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: '3d',
        });

        req.user = user;

        res.cookie('token', accessToken, accessTokenOptions);
        res.cookie('refresh_token', refreshToken, refreshTokenOptions);

        next();
    } catch (error) {
        console.log('ERROR: updateAccessToken');
        return next(new ErrorHandler(error.message, 400));
    }
});

export const generateTokenUser = CatchAsyncError(async (req, res, next) => {
    try {
        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_ID;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = '';
        console.log('LOG', appId, serverSecret, userId);
        if (appId && serverSecret && userId) {
            const token = generateToken04(appId, userId, serverSecret, effectiveTime, payload);
            return res.json({ token });
        }

        return next(new ErrorHandler('User id, app id and server secret is required.', 400));
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
