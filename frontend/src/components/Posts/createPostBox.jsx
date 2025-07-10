import React, { useState } from "react";
import { FaVideo, FaPhotoVideo, FaSmile } from "react-icons/fa";
import CreatePost from "./CreatePost";
import VideoRecording from "./VideoRecording";

const CreatePostBox = ({ user }) => {
  const [uploadModal, setUploadModal] = useState(false);
  const [liveRecModal, setLiveRecModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-xl mx-auto">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setUploadModal(true)} // Default click opens upload modal
      >
        <img
          src={user?.profileImage || "https://via.placeholder.com/100?text=User"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder={`What's on your mind, ${user?.name || "User"}?`}
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none cursor-pointer"
          readOnly
        />
      </div>

      <hr className="my-3" />

      <div className="flex justify-between text-sm text-gray-600 font-semibold">
        <div
          onClick={() => setLiveRecModal(true)}
          className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
        >
          <FaVideo className="text-red-500" />
          <span>Live video</span>
        </div>

        <div
          onClick={() => setUploadModal(true)}
          className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
        >
          <FaPhotoVideo className="text-green-500" />
          <span>Photo/video</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          <FaSmile className="text-yellow-500" />
          <span>Feeling/activity</span>
        </div>
      </div>

      {/* Modals */}
      {uploadModal && (
        <CreatePost
         setUploadModal={setUploadModal} 
        />
      )}

      {liveRecModal && (
        <VideoRecording setLiveRecModal={setLiveRecModal} />
      )}
    </div>
  );
};

export default CreatePostBox;
