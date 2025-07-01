import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import instance from '../utils/axios';

const MAX_VIDEO_SIZE_MB = 50;
const MAX_IMAGE_SIZE_MB = 5;

const NewsForm = ({ onSubmit }) => {
  const [video, setVideo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [title, setTitle] = useState('');
  const [profileName, setProfileName] = useState('');
  const [date, setDate] = useState('');
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) setVideoPreview(URL.createObjectURL(video));
    if (profileImage) setImagePreview(URL.createObjectURL(profileImage));
    return () => {
      videoPreview && URL.revokeObjectURL(videoPreview);
      imagePreview && URL.revokeObjectURL(imagePreview);
    };
  }, [video, profileImage]);

  const handleSubmit = async () => {
    if (!video || !title || !profileName || !date || !profileImage) {
      toast.error('Please fill all fields!');
      return;
    }

    if (video.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      toast.error(`Video size should be less than ${MAX_VIDEO_SIZE_MB}MB`);
      return;
    }

    if (profileImage.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image size should be less than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('profileName', profileName);
    formData.append('date', date);
    formData.append('video', video);
    formData.append('profileImage', profileImage);

    setLoading(true);
    try {
      await instance.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('News created!');

      // Reset form
      setTitle('');
      setProfileName('');
      setDate('');
      setVideo(null);
      setProfileImage(null);
      setVideoPreview(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl flex flex-col lg:flex-row gap-6">
      {/* Video Upload */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {videoPreview ? (
            <video src={videoPreview} controls className="w-full h-full object-cover" />
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

      {/* Form Fields */}
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

            {imagePreview && (
              <img
                src={imagePreview}
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
          disabled={loading}
          className={`${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-semibold px-6 py-2 rounded w-full sm:w-auto`}
        >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default NewsForm;
