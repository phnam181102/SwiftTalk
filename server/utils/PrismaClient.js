import { PrismaClient } from '@prisma/client';

let prisma;

const getPrismaInstance = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};

export default getPrismaInstance;
