import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalOverlay from "./Modal";
import LocationModal from "./LocationModal";

const CreatePost = () => {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [audience, setAudience] = useState("Public");
  const [showDropdown, setShowDropdown] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tagged, setTagged] = useState("");
  const [feeling, setFeeling] = useState("");
  const [location, setLocation] = useState("");
  const [shareToWhatsApp, setShareToWhatsApp] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [showModalInput, setShowModalInput] = useState(false);
  const [modalCallback, setModalCallback] = useState(() => {});

  const dummyUsers = [
    "Ritu Singh", "Ankur Sharma", "Jaahid Hasan",
    "Priya Mehta", "Rahul Verma", "Aisha Khan"
  ];
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isTagging, setIsTagging] = useState(false);

  const audienceOptions = ["Public", "Friends", "Only Me"];

  const openModal = (title, message, callback = null, input = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModalInput(input);
    setModalInputValue("");
    setModalCallback(() => callback);
    setModalOpen(true);
  };

  const openTagModal = () => {
    setIsTagging(true);
    setModalTitle("Tag Someone");
    setModalMessage("Search and select a user to tag");
    setShowModalInput(true);
    setModalInputValue("");
    setFilteredUsers(dummyUsers);
    setModalOpen(true);
  };

  const handleTagSearch = (value) => {
    setModalInputValue(value);
    const results = dummyUsers.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(results);
  };

  const handleUserTag = (name) => {
    setTagged(name);
    setModalOpen(false);
    setIsTagging(false);
  };

  const handleMediaChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    if (file.type.startsWith("image")) {
      // Navigate to image editor page (like Facebook)
      navigate("/image-detail", { state: { image: fileUrl } });
    } else if (file.type.startsWith("video")) {
      navigate("/video-detail", { state: { video: fileUrl } }); // Optional
    } else {
      openModal("Unsupported File", "Please upload an image or video.");
    }
  };

  return (
    <>
      <div className="bg-white w-full max-w-xl mx-auto rounded-xl shadow-md mt-10 overflow-hidden relative z-10">
        <div className="border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-center">Create Post</h2>
        </div>

        <div className="p-4">
          <div className="flex gap-3 items-start mb-4">
            <div className="relative w-12 h-12">
              <label className="cursor-pointer block w-full h-full">
                <img
                  src={profileImage || "https://via.placeholder.com/100?text=+"}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover border border-gray-300 hover:opacity-80 transition"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setProfileImage(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-black text-sm">Jaahid Hasan</span>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-xs bg-gray-100 px-3 py-1 rounded-full inline-flex items-center gap-1 hover:bg-gray-200 mt-1"
              >
                🌐 {audience}
              </button>
              {showDropdown && (
                <div className="absolute mt-12 bg-white border rounded shadow w-32 z-50">
                  {audienceOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setAudience(option);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-blue-400 mb-3"
            rows={4}
            placeholder="What's on your mind, Jaahid?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {video && (
            <div className="mb-4 relative group">
              <p className="text-sm text-gray-500 mb-1">🎥 Video Preview</p>
              <video src={video} controls className="w-full rounded-md" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-blue-100">✏️ Edit</button>
                <button
                  onClick={() => setVideo(null)}
                  className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-red-100"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1 text-gray-600 text-sm mb-3">
            {tagged && <p>👥 Tagged: {tagged}</p>}
            {feeling && <p>😊 Feeling: {feeling}</p>}
            {location && <p>📍 Location: {location}</p>}
            {shareToWhatsApp && <p>🟢 Will share to WhatsApp</p>}
          </div>

          <div className="border rounded-lg px-4 py-3 bg-gray-50 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">Add to your post</p>
            <div className="flex gap-4 text-xl text-gray-600">
              <label className="cursor-pointer hover:text-blue-600" title="Upload image/video">
                📷
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onClick={(e) => (e.target.value = null)}
                  onChange={handleMediaChange}
                />
              </label>
              <button title="Record Video" className="hover:text-blue-600">🎥</button>
              <button onClick={openTagModal}>👥</button>
              <button onClick={() => openModal("Feeling", "How are you feeling?", setFeeling, true)}>😊</button>
              <button onClick={() => setLocationModalOpen(true)}>📍</button>
              <button
                onClick={() => setShareToWhatsApp((prev) => !prev)}
                className={shareToWhatsApp ? "text-green-500" : ""}
                title="Toggle WhatsApp Share"
              >
                🟢
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button className="w-full bg-blue-600 text-white text-sm px-6 py-2 rounded hover:bg-blue-700 transition">
            Next
          </button>
        </div>
      </div>

      <ModalOverlay
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        showInput={showModalInput}
        inputValue={modalInputValue}
        setInputValue={isTagging ? handleTagSearch : setModalInputValue}
        onClose={() => {
          setModalOpen(false);
          setIsTagging(false);
        }}
        onConfirm={() => {
          if (!isTagging && modalCallback) modalCallback(modalInputValue);
          setModalOpen(false);
          setIsTagging(false);
        }}
        customContent={
          isTagging && (
            <div>
              <input
                type="text"
                value={modalInputValue}
                onChange={(e) => handleTagSearch(e.target.value)}
                placeholder="Search for people..."
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <ul className="max-h-48 overflow-y-auto divide-y">
                {filteredUsers.map((user, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleUserTag(user)}
                    className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {user}
                  </li>
                ))}
                {filteredUsers.length === 0 && (
                  <li className="py-2 px-3 text-sm text-gray-500">No users found</li>
                )}
              </ul>
            </div>
          )
        }
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelect={(loc) => setLocation(loc)}
      />
    </>
  );
};

export default CreatePost;
