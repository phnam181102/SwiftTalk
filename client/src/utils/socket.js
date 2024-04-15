import { io } from 'socket.io-client';
import { HOST } from './ApiRoutes';

export const socket = io.connect(HOST);
