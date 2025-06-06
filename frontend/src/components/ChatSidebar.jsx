import { useState, useEffect } from "react";

const friendsMock = [
  {
    id: 1,
    name: "Alice",
    profilePic:
      "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "Hey, how are you?",
    lastMessageCount: 2,
  },
  {
    id: 2,
    name: "Bob",
    profilePic:
      "https://randomuser.me/api/portraits/men/72.jpg",
    lastMessage: "Let's catch up tomorrow.",
    lastMessageCount: 5,
  },
  {
    id: 3,
    name: "Charlie",
    profilePic:
      "https://randomuser.me/api/portraits/men/65.jpg",
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
  const [activeTab, setActiveTab] = useState("friends"); // friends or addnew
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(friendsMock);
  const [filteredUsers, setFilteredUsers] = useState(allUsersMock);

  useEffect(() => {
    if (activeTab === "friends") {
      setFilteredFriends(
        friendsMock.filter((friend) =>
          friend.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else if (activeTab === "addnew") {
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
    <div className="w-80 bg-white border border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 flex flex-col">
        <div className="text-lg mb-2">Chat</div>

        {/* Search Input */}
        <input
          type="text"
          placeholder={activeTab === "friends" ? "Search friends..." : "Search users..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        {/* Tabs */}
        <div className="flex mt-3 border-b border-gray-300">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "friends"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("friends")}
          >
            Friends
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "addnew"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("addnew")}
          >
            Add New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "friends" && filteredFriends.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No friends found.</p>
        )}
        {activeTab === "addnew" && filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No users found.</p>
        )}

        {/* Friends List */}
        {activeTab === "friends" &&
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex justify-between items-center px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={friend.profilePic}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{friend.name}</span>
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

        {/* Add New Users List */}
        {activeTab === "addnew" &&
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-800">{user.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
