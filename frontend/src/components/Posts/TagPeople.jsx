import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "../../lib/axios/axiosInstance";

const TagPeopleModal = ({ isOpen, onClose, taggedUsers, setTaggedUsers, searchUrl }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Prevent scroll behind modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Fetch search results
  useEffect(() => {
    if (!isOpen || !searchQuery) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${searchUrl}?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, searchUrl, isOpen]);

  const handleTagUser = (user) => {
    if (!taggedUsers.find((u) => u._id === user._id)) {
      setTaggedUsers(prev=>[...prev, user._id]);
    }
    onClose();
  };

  if (!isOpen) return null;
console.log("searchResult",searchResults);

  return (
    <div className="fixed inset-0 z-50 bg-white/90  flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">👥 Tag People</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-blue-400"
            />
          </div>

          {/* Results */}
          <div className="max-h-60 overflow-y-auto border rounded divide-y">
            {loading && <div className="p-4 text-sm text-gray-600">Loading...</div>}
            {!loading && searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleTagUser(user)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.image || "/default-avatar.png"}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.fullName}</span>
                </div>
                <span className="text-blue-600 text-sm">+ Tag</span>
              </div>
            ))}
            {searchQuery && !loading && searchResults.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagPeopleModal;
