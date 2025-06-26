import { useState, useEffect } from "react";
import { MdOutlineMessage } from "react-icons/md";
import { BiMessageRoundedDetail } from "react-icons/bi";

import { IoClose } from "react-icons/io5";

const friendsMock = [
  {
    id: 1,
    name: "Alice",
    profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "Hey, how are you?",
    lastMessageCount: 2,
  },
  {
    id: 2,
    name: "Bob",
    profilePic: "https://randomuser.me/api/portraits/men/72.jpg",
    lastMessage: "Let's catch up tomorrow.",
    lastMessageCount: 5,
  },
  {
    id: 3,
    name: "Charlie",
    profilePic: "https://randomuser.me/api/portraits/men/65.jpg",
    lastMessage: "Got it, thanks!",
    lastMessageCount: 0,
  },
];

const allUsersMock = [
  {
    id: 1,
    name: "Alice",
    profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 2,
    name: "Bob",
    profilePic: "https://randomuser.me/api/portraits/men/72.jpg",
  },
  {
    id: 3,
    name: "Charlie",
    profilePic: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 4,
    name: "David",
    profilePic: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 5,
    name: "Eva",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 6,
    name: "Frank",
    profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

const ChatSidebar = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(friendsMock);
  const [filteredUsers, setFilteredUsers] = useState(allUsersMock);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "friends") {
      setFilteredFriends(
        friendsMock.filter((friend) =>
          friend.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(
        allUsersMock.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  return (
    <div className="fixed bottom-4 right-4 px-4 p-2 z-50">
      {isOpen ? (
        <div className="w-[280px] h-[450px] bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 flex justify-between items-center">
            <div>Chat</div>
            <IoClose
              className="text-xl cursor-pointer text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
            />
          </div>
          

          {/* Search */}
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder={
                activeTab === "friends" ? "Search friends..." : "Search users..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tabs */}
          <div className="flex px-4 border-b border-gray-300 mb-2">
            <button
              className={`flex-1 py-2 text-sm ${
                activeTab === "friends"
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabClick("friends")}
            >
              Friends
            </button>
            <button
              className={`flex-1 py-2 text-sm ${
                activeTab === "addnew"
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabClick("addnew")}
            >
              Add New
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-2">
            {activeTab === "friends" && filteredFriends.length === 0 && (
              <p className="text-center text-gray-500 mt-6">No friends found.</p>
            )}
            {activeTab === "addnew" && filteredUsers.length === 0 && (
              <p className="text-center text-gray-500 mt-6">No users found.</p>
            )}

            {activeTab === "friends" &&
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center px-2 py-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.profilePic}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-800">
                        {friend.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[140px]">
                        {friend.lastMessage}
                      </span>
                    </div>
                  </div>
                  {friend.lastMessageCount > 0 && (
                    <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {friend.lastMessageCount}
                    </div>
                  )}
                </div>
              ))}

            {activeTab === "addnew" &&
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-800">{user.name}</span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <button
        className="bg-white text-black p-4 border border-gray-300 rounded-full shadow-2xl hover:shadow-lg transition duration-200"
        onClick={() => setIsOpen(true)}
      >
        <MdOutlineMessage size={24} />
      </button>
      
      )}
    </div>
  );
};

export default ChatSidebar;
