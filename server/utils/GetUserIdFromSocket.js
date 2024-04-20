export const getUserIdFromSocket = (socket) => {
    const rooms = Object.keys(socket.rooms);
    return rooms.length > 1 ? rooms[1] : null;
};
