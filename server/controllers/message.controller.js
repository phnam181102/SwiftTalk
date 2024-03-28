import getPrismaInstance from '../utils/PrismaClient.js';

const messageController = {
    addMessage: async (req, res, next) => {
        try {
            const prisma = getPrismaInstance();
            const { message, from, to } = req.body;
            const getUser = onlineUsers.get(to);

            if (message && from && to) {
                const newMessage = await prisma.messages.create({
                    data: {
                        message,
                        sender: { connect: { id: from } },
                        receiver: { connect: { id: to } },
                        messageStatus: getUser ? 'delivered' : 'sent',
                    },
                    include: { sender: true, receiver: true },
                });

                return res.status(201).send({
                    message: newMessage,
                });
            }

            return res.status(400).send('From, to and Message is required');
        } catch (e) {
            next(e);
        }
    },

    getMessages: async (req, res, next) => {
        try {
            const prisma = getPrismaInstance();
            const { from, to } = req.params;
            let messages = await prisma.messages.findMany({
                where: {
                    OR: [
                        { senderId: from, receiverId: to },
                        { senderId: to, receiverId: from },
                    ],
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });

            const unreadMessages = messages
                .filter((message) => message.messageStatus !== 'read' && message.senderId === to)
                .map((message) => message.id);

            if (unreadMessages.length > 0) {
                await prisma.messages.updateMany({
                    where: {
                        id: { in: unreadMessages },
                    },
                    data: {
                        messageStatus: 'read',
                    },
                });

                messages = await prisma.messages.findMany({
                    where: {
                        OR: [
                            { senderId: from, receiverId: to },
                            { senderId: to, receiverId: from },
                        ],
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                });
            }

            res.status(200).json({
                messages,
            });
        } catch (error) {
            console.log(error.message);
        }
    },
};

export default messageController;
