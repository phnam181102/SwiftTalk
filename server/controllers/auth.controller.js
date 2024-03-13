import { CatchAsyncError } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { prismaClient } from '../index.js';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSchema } from '../schema/users.js';

const authController = {
    register: CatchAsyncError(async (req, res, next) => {
        try {
            RegisterSchema.parse(req.body);
            const { name, email, password } = req.body;
            let user = await prismaClient.user.findFirst({ where: { email } });
            if (user) {
                return next(new ErrorHandler('Email already exist', 400));
            }
            user = await prismaClient.user.create({
                data: { name, email, hashedPassword: hashSync(password, 10) },
            });

            res.json(user);
        } catch (error) {
            console.log(error.message);
            return next(new ErrorHandler(error.message, 400));
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

            const token = jwt.sign(
                {
                    userId: user.id,
                },
                process.env.ACCESS_TOKEN,
            );

            res.json({ success: true, user, token });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }),
};

export default authController;
