import { create } from 'zustand';
import { useSocket } from '../lib/socket/socketConfig';
import instance from '../lib/axios/axiosInstance';

export const useBusinessChat = create((set, get) => ({
  messages: [],
  unseenMessage: [],
  unseenMessageOnChat: [],
  unreadMessagesMap: {},
  selectedUser: null,
  connectedBusiness: [],
  activeUser: null,

  setConnectedBusiness: (partners) => {
    set({ connectedBusiness: partners });
  },

  fetchUnreadMessages: async () => {
    try {
      const res = await instance.get('/v1/message/unread');
      if (res?.data.success) {
        const unreadMap = {};
        res.data.data.forEach((item) => {
          unreadMap[item._id] = {
            count: item.count,
          };
        });

        set({
          unreadMessagesMap: unreadMap,
          unseenMessage: [],
          unseenMessageOnChat: [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch unread messages', err);
    }
  },

  setSelectedUser: (userId) => {
    const unreadMap = get().unreadMessagesMap;

    if (unreadMap[userId]) {
      delete unreadMap[userId];
    }

    if (userId === null) {
      set({ activeUser: null });
    }

    set({
      selectedUser: userId,
      unseenMessage: [],
      messages: [],
      unreadMessagesMap: { ...unreadMap },
    });
  },

  getUserDetails: async (id) => {
    try {
      const res = await instance.get(`/v1/message/user/${id}`);
      if (res?.data?.user) {
        set({ activeUser: res.data.user });
      }
    } catch (error) {
      console.log(error);
    }
  },

  getMessages: async () => {
    const { selectedUser, unreadMessagesMap } = get();
    try {
      const res = await instance.get(`/v1/message/get/${selectedUser}`);

      if (res?.data.success) {
        const updatedMap = { ...unreadMessagesMap };
        delete updatedMap[selectedUser];

        set({
          messages: res.data.messages,
          unreadMessagesMap: updatedMap,
        });

        await instance.patch(`/v1/message/read/${selectedUser}`);
      }
    } catch (error) {
      console.log(error);
    }
  },

  acknowledgeMessagesAsRead: async (userId) => {
    try {
      await instance.patch(`/v1/message/read/${userId}`);
      const updatedMap = { ...get().unreadMessagesMap };
      delete updatedMap[userId];

      set({ unreadMessagesMap: updatedMap });
    } catch (error) {
      console.log('Failed to acknowledge messages as read', error);
    }
  },

  sendMessage: async (data) => {
    const { selectedUser } = get();
    try {
      const res = await instance.post(`/v1/message/send/${selectedUser}`, data);
      if (res?.data.success) {
        set((state) => ({
          messages: [...state.messages, res.data.data.newMessage],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  },

  subscribeToMessage: (pathname) => {
    const { socket } = useSocket.getState();

    if (socket) {
      socket.off('chat-receive');
      socket.on('chat-receive', async (data) => {
        const {
          selectedUser,
          messages,
          unseenMessage,
          unseenMessageOnChat,
          unreadMessagesMap,
        } = get();

        const senderId = data?.sender?._id;
        const message = data?.newMessage;
        const messageId = message?._id;

        if (message?.isRead) return;

        const messageAlreadyExists =
          messages.some((m) => m._id === messageId) ||
          unseenMessage.some((m) => m._id === messageId) ||
          unseenMessageOnChat.some((m) => m._id === messageId);

        if (messageAlreadyExists) return;

        if (!pathname.includes('/business-chat')) {
          set((state) => ({
            unseenMessage: [...state.unseenMessage, message],
            unreadMessagesMap: {
              ...state.unreadMessagesMap,
              [senderId]: (state.unreadMessagesMap[senderId]?.count || 0) + 1,
            },
          }));
          return;
        }

        if (senderId !== selectedUser) {
          set((state) => ({
            unseenMessageOnChat: [...state.unseenMessageOnChat, message],
            unreadMessagesMap: {
              ...state.unreadMessagesMap,
              [senderId]: (state.unreadMessagesMap[senderId]?.count || 0) + 1,
            },
          }));
          return;
        }

        // 5. Actively chatting with sender — message is seen
        set((state) => ({
          messages: [...state.messages, message],
        }));

        // Acknowledge this message as read on backend
        try {
          await instance.patch(`/v1/message/read/${senderId}`);
          const updatedMap = { ...unreadMessagesMap };
          delete updatedMap[senderId];
          set({ unreadMessagesMap: updatedMap });
        } catch (err) {
          console.log('Failed to mark message read during receive', err);
        }
      });
    }
  },

  unsubscribeToMessage: () => {
    const socket = useSocket.getState().socket;
    socket?.off('chat-receive');
  },

  deleteMessage: async (messageId) => {
    try {
      const res = await instance.delete(`/v1/message/delete/${messageId}`);
      if (res?.data.success) {
        set({ messages: res.data.messages });
      }
    } catch (error) {
      console.log(error);
    }
  },

  blockUser: async (userId, navigate) => {
    try {
      const res = await instance.put(`/v1/message/block/${userId}`);

      if (res?.data.success) {
        set({connectedBusiness: res.data.partners})
        navigate('/business-chat');
      }
    } catch (error) {
      console.log(error);
    }
  }
}));
