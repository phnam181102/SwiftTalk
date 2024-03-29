import { UnauthorizedException } from '../exceptions/Unauthorized.js';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../index.js';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        next(new UnauthorizedException('Unauthorized', 401));
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN);

        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

        if (!user) {
            next(new UnauthorizedException('Unauthorized', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedException('Unauthorized', 401));
    }
};

export default authMiddleware;
