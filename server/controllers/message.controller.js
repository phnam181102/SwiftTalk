import getPrismaInstance from '../utils/PrismaClient.js';
import { prismaClient } from '../index.js';
import { renameSync } from 'fs';

const messageController = {
    addMessage: async (req, res, next) => {
        console.log({ req });
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

    getInitialContactswithMessages: async (req, res, next) => {
        try {
            const userId = req.params.from;
            const prisma = getPrismaInstance();

            const user = await prismaClient.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(400).send('User not found!');
            }

            const sentMessages = await prisma.messages.findMany({
                where: { senderId: user.id },
                include: { sender: true, receiver: true },
            });

            const receivedMessages = await prisma.messages.findMany({
                where: { receiverId: user.id },
                include: { sender: true, receiver: true },
            });

            const messages = [...sentMessages, ...receivedMessages];
            messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            const users = new Map();
            const messageStatusChange = [];

            messages.forEach((msg) => {
                const isSender = msg.senderId === userId;
                const calculatedId = isSender ? msg.receiverId : msg.senderId;
                if (msg.messageStatus === 'sent') {
                    messageStatusChange.push(msg.id);
                }

                const { id, type, message, messageStatus, createdAt, senderId, receiverId } = msg;
                if (!users.get(calculatedId)) {
                    let user = { messageId: id, type, message, messageStatus, createdAt, senderId, receiverId };

                    if (isSender) {
                        user = {
                            ...user,
                            ...msg.receiver,
                            totalUnreadMessages: 0,
                        };
                    } else {
                        user = {
                            ...user,
                            ...msg.sender,
                            totalUnreadMessages: messageStatus !== 'read' ? 1 : 0,
                        };
                    }
                    users.set(calculatedId, { ...user });
                } else if (messageStatus !== 'read' && !isSender) {
                    const user = users.get(calculatedId);
                    users.set(calculatedId, {
                        ...user,
                        totalUnreadMessages: user.totalUnreadMessages + 1,
                    });
                }
            });

            if (messageStatusChange.length) {
                await prisma.messages.updateMany({
                    where: {
                        id: { in: messageStatusChange },
                    },
                    data: {
                        messageStatus: 'delivered',
                    },
                });
            }

            return res.status(200).json({
                users: Array.from(users.values()),
                onlineUsers: Array.from(onlineUsers.keys()),
            });
        } catch (e) {
            next(e);
        }
    },

    addImageMessage: async (req, res, next) => {
        try {
            if (req.file) {
                const { from, to } = req.query;

                const date = Date.now();

                let fileName = 'uploads/images/' + date + from;
                renameSync(req.file.path, fileName);
                const prisma = getPrismaInstance();

                if (from && to) {
                    const message = await prisma.messages.create({
                        data: {
                            message: fileName,
                            type: 'image',
                            sender: { connect: { id: from } },
                            receiver: { connect: { id: to } },
                        },
                    });
                    return res.status(201).send({
                        message,
                    });
                }
                return res.status(400).send('From, to is required.');
            }
            return res.status(400).send('Image is required.');
        } catch (e) {
            console.log(e);
            // next(e);
        }
    },

    addAudioMessage: async (req, res, next) => {
        try {
            if (req.file) {
                const { from, to } = req.query;

                const date = Date.now();

                let fileName = 'uploads/recordings/' + date + from;
                renameSync(req.file.path, fileName);
                const prisma = getPrismaInstance();

                if (from && to) {
                    const message = await prisma.messages.create({
                        data: {
                            message: fileName,
                            type: 'audio',
                            sender: { connect: { id: from } },
                            receiver: { connect: { id: to } },
                        },
                    });
                    return res.status(201).send({
                        message,
                    });
                }
                return res.status(400).send('From, to is required.');
            }
            return res.status(400).send('Audio is required.');
        } catch (e) {
            console.log(e);
            // next(e);
        }
    },
};

export default messageController;
