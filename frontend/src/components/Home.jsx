import React, { useState } from "react";
import { Settings } from "lucide-react";

function Home() {
  // State to manage the profile image URL
  const [profileImage, setProfileImage] = useState("");

  // Handler for when a new file is selected for the profile picture
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Profile Header */}
      <div className="bg-blue-900 py-8 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-4 md:mb-0">
          {/* Profile Picture with Upload Functionality */}
          <div className="relative group">
            <img
              src="./Images/image.png"
              alt="Profile"
              className="rounded-full border-4 border-white w-28 h-28 sm:w-32 sm:h-32 object-cover cursor-pointer"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            />
            {/* Overlay for "Change Photo" on hover */}
            <div
              className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            >
              <span className="text-white text-sm font-medium">
                Change Photo
              </span>
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div className="text-center sm:text-left pt-2 md:pt-0">
            <h1 className="text-3xl font-bold text-white">John Smith</h1>
            <span className="text-gray-200">120 Friends</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors duration-200">
            + Edit Story
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors duration-200">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Horizontal Rule */}
      <div className="bg-blue-900">
        <hr className="bg-white h-0.5 max-w-7xl mx-auto" />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-blue-900 border-b">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-2">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2 sm:mb-0">
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              Posts
            </button>
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              About
            </button>
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              Friends
            </button>
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              Photos
            </button>
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              Videos
            </button>
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              My Ads
            </button>
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm sm:text-base">
              More
            </button>
          </div>
          <div>
            {/* Setting Icon instead of button text */}
            <button className="px-4 py-2 rounded bg-white font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200">
              <Settings className="w-5 h-5" />{" "}
              {/* Lucide-react Settings icon */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;