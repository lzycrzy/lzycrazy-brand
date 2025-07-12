import { io } from 'socket.io-client';
import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const useSocket = create((set, get) => ({
  socket: null,
  userId: null,

  setUserId: (userId) => set({ userId: userId }),

  connect: async () => {
    console.log(get().userId);
    if (get().socket?.connected) return;

    const socket = io(BACKEND_URL, {
      query: {
        userId: get().userId,
      },
      withCredentials: true,
    });

    socket.on('connection', () => {
      console.log('User Connected: ', socket.id);
    });

    socket.connect();

    set({ socket: socket });
  },

  disconnect: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));
