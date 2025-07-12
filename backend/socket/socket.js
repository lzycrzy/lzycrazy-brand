import { Server } from 'socket.io';

export const socketUserMap = {};

export const initSocket = (server) => {
  // console.log("Socket Initializing....")

  const io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.DASHBOARD_URL || 'http://localhost:5174',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.warn('No userId in query. Disconnecting...');
      socket.disconnect(true);
      return;
    }

    console.log('Socket connected:', socket.id, 'userId:', userId);

    socketUserMap[userId] = socket.id;

    // console.log(socketUserMap)

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      delete socketUserMap[userId];
    });
  });

  return io;
};
