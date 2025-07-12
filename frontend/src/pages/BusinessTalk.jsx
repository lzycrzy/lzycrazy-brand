import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation, useNavigate, useParams } from 'react-router';
import Header from '../components/static/Header';
import { useBusinessChat } from '../store/useBusinessChat';
import instance from '../lib/axios/axiosInstance';
import { formatTime } from '../utils/formatTime';
import {
  BsChevronDown,
  BsSortDownAlt,
  BsSortUpAlt,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import MenuOptions from '../components/BusinessChat/MenuOptions';
import MessageMenuOptions from '../components/BusinessChat/MessageMenuOptions';
import { RxCross2 } from 'react-icons/rx';

const BusinessTalk = () => {
  const { user } = useUser();
  const {
    sendMessage,
    subscribeToMessage,
    unsubscribeToMessage,
    messages,
    selectedUser,
    setSelectedUser,
    getMessages,
    connectedBusiness,
    setConnectedBusiness,
    activeUser,
    getUserDetails,
    unreadMessagesMap,
  } = useBusinessChat();
  const { id } = useParams();

  const [text, setText] = useState('');
  const [menuOptions, setMenuOptions] = useState(false);
  const [messageMenuOptions, setMessageMenuOptions] = useState(null);
  const messageEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ text });
    setText('');
  };

  useEffect(() => {
    if (id) {
      setSelectedUser(id);
      getUserDetails(id);
    }

    return () => {
      setSelectedUser(null);
    };
  }, [id]);

  useEffect(() => {
    async function getBusinessConnection() {
      try {
        const res = await instance.post('/v1/message/get-business-partner', {
          userId: id,
        });

        if (res?.data.success) {
          setConnectedBusiness(res.data.partners);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getBusinessConnection();
  }, [id]);

  useEffect(() => {
    if (selectedUser) getMessages();
    subscribeToMessage(location.pathname);
    return () => unsubscribeToMessage();
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, id]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100">
      <Header />
      <div className="mx-auto mt-4 flex h-[80vh] w-full max-w-screen-lg flex-col overflow-hidden rounded-md bg-white shadow sm:flex-row">
        {/* Sidebar */}
        <div className="w-full overflow-y-auto border-b border-gray-200 bg-gray-50 sm:w-1/3 sm:border-r sm:border-b-0">
          <h2 className="mt-1 mb-4 border-b border-gray-200 p-4 text-xl font-semibold">
            Conversations
          </h2>
          <ul className="space-y-2">
            {connectedBusiness?.length > 0 ? (
              connectedBusiness?.map((user, index) => {
                const unreadCount = unreadMessagesMap[user._id]?.count || 0;

                return (
                  <li key={index} className="border-b border-gray-300">
                    <button
                      onClick={() => {
                        if (selectedUser !== user._id) {
                          setSelectedUser(user._id);
                        }
                        navigate(`/business-chat/${user._id}`);
                      }}
                      className={`relative flex w-full items-center gap-3 px-3 py-2 text-left ${
                        activeUser?.fullName === user.fullName
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-blue-50'
                      } transition`}
                    >
                      <img
                        src={user.image}
                        className="h-10 w-10 rounded-full border object-cover"
                        alt={user?.fullName}
                      />
                      <div className="flex flex-col">
                        <span className="truncate font-medium">
                          {user?.fullName}
                        </span>
                      </div>

                      {/* Badge for unread count */}
                      {unreadCount > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })
            ) : (
              <div>No Connection established</div>
            )}
          </ul>
        </div>

        {/* Chat Panel */}
        {selectedUser && (
          <div className="flex w-full flex-col sm:w-2/3">
            {/* Chat Header */}
            <div className="border- sticky top-0 z-10 flex min-h-[65px] items-center gap-3 border-b border-gray-200 bg-white p-1 px-4">
              {selectedUser && (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeUser?.image}
                      className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                      alt={activeUser?.fullName}
                    />
                    <div className="flex flex-col gap-0">
                      <h3 className="text-lg font-semibold">
                        {activeUser?.fullName}
                      </h3>
                      <span className="text-xs">{activeUser?.phone}</span>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <div
                      className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
                      onClick={() => setMenuOptions(id)}
                    >
                      <BsThreeDotsVertical />
                    </div>
                    <div
                      className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
                      onClick={() => {
                        // setActiveUser(null);
                        setSelectedUser(null);
                        navigate('/business-chat');
                      }}
                    >
                      <RxCross2 />
                    </div>
                    {menuOptions && (
                      <MenuOptions
                        menuOptions={menuOptions}
                        setMenuOptions={setMenuOptions}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-3">
              {selectedUser &&
                messages?.map((m, i) => {
                  const isSender = m.senderId === user?.profile?.id;
                  return (
                    <div
                      key={i}
                      className={`relative flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`group max-w-xs rounded-lg px-4 py-2 shadow-md transition duration-300 ${
                          isSender
                            ? 'rounded-br-none bg-blue-600 text-white'
                            : 'rounded-bl-none bg-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="relative flex min-w-[100px] flex-col">
                          <p className="break-words whitespace-pre-wrap">
                            {m.text}
                          </p>
                          <div className="flex justify-end">
                            <span
                              className={`text-xs ${isSender ? 'text-white/70' : 'text-gray-600/70'}`}
                            >
                              {formatTime(m.createdAt)}
                            </span>
                          </div>

                          <div
                            onClick={() => setMessageMenuOptions(m)}
                            className={`absolute -top-1 -right-3 ${isSender ? 'hover:bg-gray100 text-black' : 'text-black hover:bg-white'} ${messageMenuOptions?._id === m._id ? 'flex' : 'hidden'} rounded-full bg-gray-200 p-1 group-hover:flex`}
                          >
                            <BsChevronDown className="cursor-pointer font-bold" />
                          </div>

                          {m._id === messageMenuOptions?._id && (
                            <MessageMenuOptions
                              messageMenuOptions={messageMenuOptions}
                              setMessageMenuOptions={setMessageMenuOptions}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div ref={messageEndRef} />
            </div>

            {/* Input */}
            {selectedUser && (
              <div className="flex gap-2 bg-white p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 rounded-full border border-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="rounded-full bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        )}

        {!selectedUser && (
          <div className="flex h-full w-full justify-center text-lg font-medium text-gray-500 sm:mt-52">
            Select a business user to start Conversations
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessTalk;
