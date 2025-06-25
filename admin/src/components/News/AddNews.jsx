import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const NewsForm = ({ onSubmit }) => {
  const [video, setVideo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [title, setTitle] = useState('');
  const [profileName, setProfileName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (!video || !title || !profileName || !date || !profileImage) {
      toast.error('Please fill all fields!');
      return;
    }

    onSubmit({ title, video, profileName, profileImage, date });

    setVideo(null);
    setProfileImage(null);
    setTitle('');
    setProfileName('');
    setDate('');
    toast.success('News created!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl flex flex-col lg:flex-row gap-6">
      {/* Video Upload */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {video ? (
            <video
              src={URL.createObjectURL(video)}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://wallpapers.com/images/hd/news-studio-background-dyhy6shg9vnyheww.jpg"
              alt="News"
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <label className="block">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="hidden"
          />
          <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm">
            Upload Video
          </span>
        </label>
      </div>

      {/* Form Inputs */}
      <div className="flex-1 space-y-4">
        <input
          type="text"
          placeholder="News Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 border px-3 py-2 rounded">
            <FaCamera className="text-gray-600" />
            <input
              type="text"
              placeholder="Reporter Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="hidden"
              />
              <span className="bg-green-500 text-white px-4 py-2 rounded text-sm">
                Upload Pic
              </span>
            </label>

            {profileImage && (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Preview"
                className="w-10 h-10 rounded-full object-cover border"
              />
            )}
          </div>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full sm:w-auto"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewsForm;
