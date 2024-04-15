import { CatchAsyncError } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../exceptions/ErrorHandler.js';
import { prismaClient } from '../index.js';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSchema } from '../schema/users.js';
import { accessTokenOptions, refreshTokenOptions } from '../utils/Jwt.js';

const authController = {
    register: CatchAsyncError(async (req, res, next) => {
        try {
            RegisterSchema.parse(req.body);
            const { name, username, email, password } = req.body;
            let user = await prismaClient.user.findFirst({ where: { email } });
            if (user) {
                return next(new ErrorHandler('Email already exist', 400));
            }
            user = await prismaClient.user.create({
                data: { name, email, username, hashedPassword: hashSync(password, 10) },
            });

            res.json(user);
        } catch (error) {
            return next(new ErrorHandler(error.errors[0].message, 400));
        }
    }),

    login: CatchAsyncError(async (req, res, next) => {
        try {
            const { email, password } = req.body;

            let user = await prismaClient.user.findFirst({ where: { email } });

            if (!user) {
                return next(new ErrorHandler('Email does not exist', 400));
            }

            if (!compareSync(password, user.hashedPassword)) {
                return next(new ErrorHandler('Incorrect password', 400));
            }

            const token = authController.generateAccessToken(user);

            res.json({ success: true, user, token });
        } catch (error) {
            if (error.errors) {
                return next(new ErrorHandler(error.errors[0].message, 400));
            } else {
                return next(new ErrorHandler(error.message, 400));
            }
        }
    }),
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                userId: user.id,
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: '3d' },
        );
    },
    updateAccessToken: CatchAsyncError(async (req, res, next) => {
        try {
            const refresh_token = req.cookies.refresh_token;
            const errMessage = 'Could not refresh token';

            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
            if (!decoded) return next(new ErrorHandler(errMessage, 400));

            const user = JSON.parse(decoded);

            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });

            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
                expiresIn: '3d',
            });

            req.user = user;

            res.cookie('token', accessToken, accessTokenOptions);
            res.cookie('refresh_token', refreshToken, refreshTokenOptions);

            next();
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }),
    me: async (req, res) => {
        res.json(req.user);
    },
    socialAuth: CatchAsyncError(async (req, res, next) => {
        try {
            const { email, name, avatar } = req.body

            const user = await prismaClient.user.findFirst({ where: { email } });

            if (!user) {
                user = await prismaClient.user.create({
                    data: { name, email, hashedPassword: hashSync(password, 10) },
                });
            }
                
            const token = authController.generateAccessToken(user);
            res.json({ success: true, user, token });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
};

export default authController;
