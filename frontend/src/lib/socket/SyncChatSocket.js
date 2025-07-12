import { useUser } from '../../context/UserContext';
import { useBusinessChat } from '../../store/useBusinessChat';
import { useSocket } from './socketConfig';
import { useEffect } from 'react';

const SyncChatSocket = () => {
  const { user, authChecked } = useUser();
  const setUserId = useSocket((s) => s.setUserId);
  const connect = useSocket((s) => s.connect);
  const disconnect = useSocket((s) => s.disconnect);

  const { fetchUnreadMessages } = useBusinessChat();

  useEffect(() => {
    if (user?.profile?.id) {
      fetchUnreadMessages();
    }
  }, [user]);

  useEffect(() => {
    if (authChecked && user?.profile?.id) {
      setUserId(user.profile.id);
    }
  }, [authChecked, user, setUserId]);

  useEffect(() => {
    if (user?.profile?.id) {
      connect();
    }
    return () => disconnect();
  }, [user?._id]);

  return null;
};

export default SyncChatSocket;
